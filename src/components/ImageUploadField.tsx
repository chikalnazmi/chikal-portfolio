'use client';

import React, { useState, useRef } from 'react';

interface ImageUploadFieldProps {
  label: string;
  value: string;
  onChange: (newUrl: string) => void;
  aspectRatio?: 'square' | 'portrait' | 'landscape' | 'certificate' | 'phone';
  helperText?: string;
}

export default function ImageUploadField({
  label,
  value,
  onChange,
  aspectRatio = 'landscape',
  helperText,
}: ImageUploadFieldProps) {
  const [isUploading, setIsUploading] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [showManualInput, setShowManualInput] = useState(false);
  const [statusMessage, setStatusMessage] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Determine Aspect Ratio CSS class
  let aspectClass = 'aspect-[16/10]';
  if (aspectRatio === 'square') aspectClass = 'aspect-square';
  if (aspectRatio === 'portrait') aspectClass = 'aspect-[4/5]';
  if (aspectRatio === 'certificate') aspectClass = 'aspect-[4/3]';
  if (aspectRatio === 'phone') aspectClass = 'aspect-[9/16]';

  // Helper to compress large photos on the client before saving
  const compressImage = (file: File): Promise<string> => {
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = (e) => {
        const img = new Image();
        img.src = e.target?.result as string;
        img.onload = () => {
          const maxDim = 1400;
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
            ctx.drawImage(img, 0, 0, width, height);
            resolve(canvas.toDataURL('image/jpeg', 0.86));
          } else {
            resolve(e.target?.result as string);
          }
        };
        img.onerror = () => resolve(e.target?.result as string);
      };
      reader.onerror = () => resolve('');
    });
  };

  const handleProcessFile = async (file: File) => {
    if (!file.type.startsWith('image/')) {
      alert('Mohon pilih file gambar (JPG, PNG, WebP, dll)');
      return;
    }

    setIsUploading(true);
    setStatusMessage('Mengoptimasi & memproses foto...');

    try {
      // 1. Try uploading to local server API first
      const formData = new FormData();
      formData.append('file', file);

      const res = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });

      if (res.ok) {
        const json = await res.json();
        if (json.url) {
          onChange(json.url);
          setStatusMessage('✅ Foto berhasil diupload ke server!');
          setTimeout(() => setStatusMessage(null), 3000);
          setIsUploading(false);
          return;
        }
      }
    } catch {
      // If server API is not available or read-only (e.g. static host/Vercel serverless), proceed to base64 fallback
    }

    // 2. Fallback: Compress to optimized Data URL
    try {
      const compressedDataUrl = await compressImage(file);
      if (compressedDataUrl) {
        onChange(compressedDataUrl);
        setStatusMessage('✅ Foto berhasil dipasang & dioptimasi!');
        setTimeout(() => setStatusMessage(null), 3000);
      }
    } catch (err) {
      console.error(err);
      setStatusMessage('Gagal memproses foto.');
    } finally {
      setIsUploading(false);
    }
  };

  const onFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      handleProcessFile(files[0]);
    }
  };

  const onDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const onDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const onDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleProcessFile(e.dataTransfer.files[0]);
    }
  };

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <label className="block text-[11px] font-bold text-forest">
          {label}
        </label>
        {statusMessage && (
          <span className="text-[10px] font-bold text-rose-dark animate-pulse">
            {statusMessage}
          </span>
        )}
      </div>

      {/* Hidden Native File Input */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={onFileInputChange}
        className="hidden"
      />

      {/* Interactive Dropzone & Live Preview Container */}
      <div
        onDragOver={onDragOver}
        onDragLeave={onDragLeave}
        onDrop={onDrop}
        className={`relative rounded-2xl border-2 transition-all p-2 flex flex-col items-center justify-center overflow-hidden group ${
          isDragging
            ? 'border-rose-dark bg-rose-blush/40 scale-[1.01]'
            : 'border-dashed border-[#CAD7C5] bg-[#E8EFE5]/30 hover:border-forest/50'
        }`}
      >
        {/* If Image Value exists, show Image Preview with Replace Button */}
        {value ? (
          <div className="relative w-full flex flex-col items-center">
            <div className={`w-full max-w-full ${aspectClass} rounded-xl overflow-hidden bg-black/5 relative shadow-inner`}>
              <img
                src={value}
                alt={label}
                className="w-full h-full object-cover"
                onError={(e) => {
                  // Fallback if image not found
                  (e.target as HTMLImageElement).src = '/2.png';
                }}
              />

              {/* Hover overlay with quick action buttons */}
              <div className="absolute inset-0 bg-forest/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2 p-2">
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  disabled={isUploading}
                  className="px-3.5 py-1.5 rounded-full bg-white text-forest text-xs font-bold shadow-md hover:bg-rose-blush hover:text-rose-dark transition-all flex items-center gap-1 cursor-pointer"
                >
                  <span>📤</span>
                  <span>{isUploading ? 'Memproses...' : 'Ganti Foto'}</span>
                </button>
                <button
                  type="button"
                  onClick={() => onChange('')}
                  className="px-3 py-1.5 rounded-full bg-red-600 text-white text-xs font-bold shadow-md hover:bg-red-700 transition-all cursor-pointer"
                  title="Hapus Foto"
                >
                  ✕
                </button>
              </div>
            </div>

            {/* Change button below preview */}
            <div className="mt-2 flex items-center gap-2">
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                disabled={isUploading}
                className="px-3 py-1 rounded-lg bg-white border border-[#CAD7C5] text-[11px] font-bold text-forest hover:bg-rose-blush hover:text-rose-dark transition-colors shadow-2xs flex items-center gap-1 cursor-pointer"
              >
                <span>📁 Pilih dari Laptop</span>
              </button>
              <span className="text-[10px] text-forest/50 truncate max-w-[160px] font-mono">
                {value.startsWith('data:') ? 'Foto Lokal (Base64)' : value}
              </span>
            </div>
          </div>
        ) : (
          /* Empty State Dropzone */
          <div
            onClick={() => fileInputRef.current?.click()}
            className="w-full py-6 flex flex-col items-center justify-center text-center cursor-pointer space-y-1.5"
          >
            <div className="w-10 h-10 rounded-full bg-white text-forest flex items-center justify-center text-lg shadow-xs border border-[#CAD7C5]">
              {isUploading ? '⏳' : '📤'}
            </div>
            <div>
              <p className="text-xs font-bold text-forest">
                {isUploading ? 'Sedang Memproses Foto...' : 'Klik untuk Upload Foto dari Laptop'}
              </p>
              <p className="text-[10px] text-forest/60">
                atau seret & jatuhkan (drag and drop) file foto ke sini
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Manual URL Input Accordion Toggle */}
      <div className="flex items-center justify-between text-[10px]">
        <button
          type="button"
          onClick={() => setShowManualInput(!showManualInput)}
          className="text-forest/60 hover:text-rose-dark underline cursor-pointer"
        >
          {showManualInput ? '▼ Sembunyikan Input URL Manual' : '► Atau ketik Path / URL Manual'}
        </button>
        {helperText && <span className="text-forest/50 italic">{helperText}</span>}
      </div>

      {/* Manual Input Input Field */}
      {showManualInput && (
        <div className="pt-1">
          <input
            type="text"
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder="Contoh: /2.png atau https://images.unsplash.com/..."
            className="w-full px-3 py-1.5 rounded-lg bg-white border border-[#CAD7C5] text-xs font-mono text-forest placeholder:text-forest/30"
          />
        </div>
      )}
    </div>
  );
}
