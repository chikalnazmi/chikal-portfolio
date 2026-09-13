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
        if (ctx) {
          // Fill background white in case of transparent background when converting to JPEG
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
        } else {
          resolve(file);
        }
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

  // 2. Compress for lightning-fast web delivery
  onStatusUpdate?.('Mengompres foto untuk performa web...');
  const compressedBlob = await compressImageToBlob(converted);

  const cleanBaseName = converted.name
    .replace(/\.[^/.]+$/, '')
    .replace(/[^a-zA-Z0-9_-]/g, '_') || 'photo';

  return new File([compressedBlob], `${cleanBaseName}.jpg`, {
    type: 'image/jpeg',
    lastModified: Date.now(),
  });
}
