/**
 * Utility helpers for image processing, compression, and Apple HEIC/HEIF conversion
 */

export function isHeicFile(file: File): boolean {
  const name = (file.name || '').toLowerCase();
  const type = (file.type || '').toLowerCase();
  return (
    name.endsWith('.heic') ||
    name.endsWith('.heif') ||
    type === 'image/heic' ||
    type === 'image/heif'
  );
}

export function isSupportedImage(file: File): boolean {
  if (isHeicFile(file)) return true;
  if (file.type && file.type.startsWith('image/')) return true;
  const name = (file.name || '').toLowerCase();
  return /\.(jpe?g|png|webp|gif|svg|avif|bmp)$/i.test(name);
}

/**
 * Converts Apple HEIC / HEIF image files to standard JPEG in the browser.
 * Uses dynamic import for heic2any so that the wasm/library is only loaded when an HEIC file is uploaded.
 */
export async function convertHeicIfNeeded(
  file: File,
  onStatusUpdate?: (msg: string) => void
): Promise<File> {
  if (!isHeicFile(file)) {
    return file;
  }

  if (typeof window === 'undefined') {
    return file;
  }

  onStatusUpdate?.('Mengonversi foto iPhone (HEIC ke JPEG)...');

  try {
    const heic2any = (await import('heic2any')).default;
    const result = await heic2any({
      blob: file,
      toType: 'image/jpeg',
      quality: 0.9,
    });

    const blob = Array.isArray(result) ? result[0] : result;
    const cleanBaseName = file.name
      .replace(/\.[^/.]+$/, '')
      .replace(/[^a-zA-Z0-9_-]/g, '_') || 'iphone_photo';

    return new File([blob], `${cleanBaseName}.jpg`, {
      type: 'image/jpeg',
      lastModified: Date.now(),
    });
  } catch (err) {
    console.error('HEIC conversion error:', err);
    throw new Error('Gagal mengonversi file HEIC. Pastikan file tidak rusak atau gunakan format JPG/PNG.');
  }
}

/**
 * Resizes and compresses an image on client before uploading to reduce bandwidth and storage.
 * Automatically preserves full alpha transparency for PNG and WebP cutout images,
 * and auto-trims excessive transparent padding (e.g. empty space above the head).
 */
export function compressImageToBlob(
  file: File,
  maxDim = 1600,
  quality = 0.88
): Promise<Blob> {
  return new Promise((resolve) => {
    // If SVG, don't compress via canvas
    if (file.type === 'image/svg+xml') {
      resolve(file);
      return;
    }

    const isPng = file.type === 'image/png' || file.name.toLowerCase().endsWith('.png');
    const isWebp = file.type === 'image/webp' || file.name.toLowerCase().endsWith('.webp');
    const preserveAlpha = isPng || isWebp;

    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = (e) => {
      const img = new Image();
      img.src = e.target?.result as string;
      img.onload = () => {
        let width = img.width;
        let height = img.height;

        if (width > maxDim || height > maxDim) {
          if (width > height) {
            height = Math.round((height * maxDim) / width);
            width = maxDim;
          } else {
            width = Math.round((width * maxDim) / height);
            height = maxDim;
          }
        }

        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        if (!ctx) {
          resolve(file);
          return;
        }

        if (preserveAlpha) {
          // Transparent background: Draw image directly preserving alpha
          ctx.clearRect(0, 0, width, height);
          ctx.drawImage(img, 0, 0, width, height);

          // Auto-trim transparent borders (e.g. huge empty space above cutout head)
          try {
            const imgData = ctx.getImageData(0, 0, width, height);
            const data = imgData.data;
            let top = height, bottom = 0, left = width, right = 0;
            let hasTransparency = false;

            for (let y = 0; y < height; y++) {
              for (let x = 0; x < width; x++) {
                const alpha = data[(y * width + x) * 4 + 3];
                if (alpha < 245) {
                  hasTransparency = true;
                }
                if (alpha > 20) { // Visible subject pixel
                  if (y < top) top = y;
                  if (y > bottom) bottom = y;
                  if (x < left) left = x;
                  if (x > right) right = x;
                }
              }
            }

            // If there is significant transparent margin at the top (head pushed down), crop it!
            if (hasTransparency && top < bottom && left < right && top > 15) {
              const padX = Math.round(width * 0.02);
              const padY = Math.round(height * 0.02);
              const cropX = Math.max(0, left - padX);
              const cropY = Math.max(0, top - padY);
              const cropW = Math.min(width - cropX, (right - left) + padX * 2);
              const cropH = Math.min(height - cropY, (bottom - top) + padY * 2);

              if (cropW > 60 && cropH > 60) {
                const trimmedCanvas = document.createElement('canvas');
                trimmedCanvas.width = cropW;
                trimmedCanvas.height = cropH;
                const tCtx = trimmedCanvas.getContext('2d');
                if (tCtx) {
                  tCtx.drawImage(canvas, cropX, cropY, cropW, cropH, 0, 0, cropW, cropH);
                  trimmedCanvas.toBlob(
                    (blob) => resolve(blob || file),
                    'image/webp',
                    0.92
                  );
                  return;
                }
              }
            }
          } catch {}

          // Export as WebP preserving transparency
          canvas.toBlob(
            (blob) => resolve(blob || file),
            'image/webp',
            0.92
          );
          return;
        }

        // Non-transparent (JPG): Fill solid white background and export JPEG
        ctx.fillStyle = '#FFFFFF';
        ctx.fillRect(0, 0, width, height);
        ctx.drawImage(img, 0, 0, width, height);
        canvas.toBlob(
          (blob) => {
            if (blob) resolve(blob);
            else resolve(file);
          },
          'image/jpeg',
          quality
        );
      };
      img.onerror = () => resolve(file);
    };
    reader.onerror = () => resolve(file);
  });
}

/**
 * Full pipeline: HEIC conversion -> Compression -> Ready-to-upload File
 */
export async function prepareImageForUpload(
  file: File,
  onStatusUpdate?: (msg: string) => void
): Promise<File> {
  // 1. Convert HEIC if needed
  const converted = await convertHeicIfNeeded(file, onStatusUpdate);

  const isPng = converted.type === 'image/png' || converted.name.toLowerCase().endsWith('.png');
  const isWebp = converted.type === 'image/webp' || converted.name.toLowerCase().endsWith('.webp');
  const ext = (isPng || isWebp) ? 'webp' : 'jpg';
  const mime = (isPng || isWebp) ? 'image/webp' : 'image/jpeg';

  // 2. Compress for lightning-fast web delivery
  onStatusUpdate?.('Mengompres foto untuk performa web...');
  const compressedBlob = await compressImageToBlob(converted);

  const cleanBaseName = converted.name
    .replace(/\.[^/.]+$/, '')
    .replace(/[^a-zA-Z0-9_-]/g, '_') || 'photo';

  return new File([compressedBlob], `${cleanBaseName}.${ext}`, {
    type: mime,
    lastModified: Date.now(),
  });
}
