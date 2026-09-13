'use client';

import React, { useState, useRef } from 'react';
import { prepareImageForUpload, isSupportedImage, isHeicFile } from '@/lib/image-helpers';

interface MultiImageGalleryFieldProps {
  label: string;
  images: string[];
  onChange: (newImages: string[]) => void;
  aspectRatio?: 'square' | 'portrait' | 'landscape' | 'certificate' | 'phone';
  helperText?: string;
  maxImages?: number;
}

export default function MultiImageGalleryField({
  label,
  images = [],
  onChange,
  aspectRatio = 'landscape',
  helperText = 'Upload atau tambahkan beberapa foto dokumentasi. Foto pertama akan otomatis menjadi foto sampul utama.',
  maxImages = 20,
}: MultiImageGalleryFieldProps) {
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState<string | null>(null);
  const [manualUrl, setManualUrl] = useState('');
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Determine Aspect Ratio CSS class for previews
  let aspectClass = 'aspect-[16/10]';
  if (aspectRatio === 'square') aspectClass = 'aspect-square';
  if (aspectRatio === 'portrait') aspectClass = 'aspect-[4/5]';
  if (aspectRatio === 'certificate') aspectClass = 'aspect-[4/3]';
  if (aspectRatio === 'phone') aspectClass = 'aspect-[9/16]';

  const handleProcessFiles = async (files: FileList | File[]) => {
    const fileArray = Array.from(files).filter(isSupportedImage);
    if (fileArray.length === 0) {
      alert('Mohon pilih file gambar yang valid (JPG, PNG, WebP, HEIC iPhone, dll)');
      return;
    }

    if (images.length + fileArray.length > maxImages) {
      alert(`Maksimal galeri berisi ${maxImages} foto. Saat ini sudah ada ${images.length} foto.`);
      return;
    }

    setIsUploading(true);
    const uploadedUrls: string[] = [];

    for (let i = 0; i < fileArray.length; i++) {
      const file = fileArray[i];
      const isHeic = isHeicFile(file);
      setUploadProgress(
        `Foto ${i + 1}/${fileArray.length}: ${isHeic ? 'Mengonversi foto iPhone (HEIC)...' : 'Mengompres...'}`
      );

      try {
        const uploadFile = await prepareImageForUpload(file, (msg) => {
          setUploadProgress(`Foto ${i + 1}/${fileArray.length}: ${msg}`);
        });

        const formData = new FormData();
        formData.append('file', uploadFile);

        const res = await fetch('/api/upload', {
          method: 'POST',
          body: formData,
        });

        if (res.ok) {
          const json = await res.json();
          if (json.url) {
            uploadedUrls.push(json.url);
          }
        } else {
          // Fallback to data URL
          const reader = new FileReader();
          const dataUrl = await new Promise<string>((resolve) => {
            reader.onload = () => resolve(reader.result as string);
            reader.readAsDataURL(uploadFile);
          });
          uploadedUrls.push(dataUrl);
        }
      } catch (err) {
        console.error('Upload error for file:', file.name, err);
      }
    }

    if (uploadedUrls.length > 0) {
      onChange([...images, ...uploadedUrls]);
      setUploadProgress(`✅ Berhasil menambahkan ${uploadedUrls.length} foto ke galeri!`);
      setTimeout(() => setUploadProgress(null), 3500);
    } else {
      setUploadProgress('⚠️ Gagal mengupload foto.');
      setTimeout(() => setUploadProgress(null), 4000);
    }

    setIsUploading(false);
  };

  const handleAddManualUrl = (e: React.FormEvent) => {
    e.preventDefault();
    const cleanUrl = manualUrl.trim();
    if (!cleanUrl) return;

    if (images.length >= maxImages) {
      alert(`Maksimal ${maxImages} foto.`);
      return;
    }

    onChange([...images, cleanUrl]);
    setManualUrl('');
  };

  const handleRemovePhoto = (indexToRemove: number) => {
    const updated = images.filter((_, idx) => idx !== indexToRemove);
    onChange(updated);
  };

  const handleSetAsCover = (indexToPromote: number) => {
    if (indexToPromote === 0) return;
    const item = images[indexToPromote];
    const remaining = images.filter((_, idx) => idx !== indexToPromote);
    onChange([item, ...remaining]);
  };

  const handleMove = (index: number, direction: 'left' | 'right') => {
    const targetIdx = direction === 'left' ? index - 1 : index + 1;
    if (targetIdx < 0 || targetIdx >= images.length) return;

    const newArr = [...images];
    const temp = newArr[index];
    newArr[index] = newArr[targetIdx];
    newArr[targetIdx] = temp;
    onChange(newArr);
  };

  return (
    <div className="space-y-3 bg-white p-4 sm:p-5 rounded-2xl border border-[#CAD7C5] shadow-xs">
      {/* Header with Title and Count */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 border-b border-[#CAD7C5]/60 pb-2.5">
        <div>
          <label className="block text-xs font-bold text-neutral-900">
            {label} <span className="font-mono text-forest/70 font-semibold">({images.length} Foto)</span>
          </label>
          {helperText && (
            <p className="text-[11px] text-neutral-500 mt-0.5">
              {helperText}
            </p>
          )}
        </div>

        <button
          type="button"
          onClick={() => fileInputRef.current?.click()}
          disabled={isUploading}
          className="px-3.5 py-1.5 rounded-full text-xs font-bold bg-forest text-white hover:bg-forest-dark transition-all shadow-xs flex items-center gap-1.5 cursor-pointer shrink-0 disabled:opacity-50"
        >
          <span>+ Upload Foto (Bisa Banyak)</span>
        </button>
      </div>

      {/* Upload Progress Status Message */}
      {uploadProgress && (
        <div className="text-xs px-3.5 py-2 rounded-xl bg-forest/10 border border-forest/30 text-forest font-medium flex items-center gap-2 animate-fadeIn">
          <span className="animate-spin text-sm">✦</span>
          <span>{uploadProgress}</span>
        </div>
      )}

      {/* Hidden File Input (supports multiple file selection) */}
      <input
        ref={fileInputRef}
        type="file"
        multiple
        accept="image/*,.heic,.heif,image/heic,image/heif"
        onChange={(e) => {
          if (e.target.files && e.target.files.length > 0) {
            handleProcessFiles(e.target.files);
            e.target.value = '';
          }
        }}
        className="hidden"
      />

      {/* Drag & Drop Upload Dropzone */}
      <div
        onDragOver={(e) => {
          e.preventDefault();
          setIsDragging(true);
        }}
        onDragLeave={() => setIsDragging(false)}
        onDrop={(e) => {
          e.preventDefault();
          setIsDragging(false);
          if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
            handleProcessFiles(e.dataTransfer.files);
          }
        }}
        onClick={() => fileInputRef.current?.click()}
        className={`border-2 border-dashed rounded-xl p-4 text-center cursor-pointer transition-all ${
          isDragging
            ? 'border-forest bg-forest/5'
            : 'border-[#CAD7C5] hover:border-forest hover:bg-sage-50/50'
        }`}
      >
        <p className="text-xs font-semibold text-neutral-800">
          Tarik & Lepas Foto di sini, atau <span className="text-forest underline">Pilih File dari Laptop / iPhone</span>
        </p>
        <p className="text-[10px] text-neutral-500 mt-0.5">
          Mendukung format JPG, PNG, WebP & foto iPhone (HEIC/HEIF) • Otomatis dioptimasi ke Cloud Supabase
        </p>
      </div>

      {/* Manual URL Input Bar */}
      <form onSubmit={handleAddManualUrl} className="flex gap-2">
        <input
          type="text"
          value={manualUrl}
          onChange={(e) => setManualUrl(e.target.value)}
          placeholder="Atau tempelkan URL gambar (https://... / path /1.png)..."
          className="flex-1 px-3 py-1.5 rounded-xl bg-white border border-[#CAD7C5] text-xs font-mono text-neutral-900 focus:outline-none focus:border-forest"
        />
        <button
          type="submit"
          disabled={!manualUrl.trim()}
          className="px-3 py-1.5 rounded-xl bg-sage-100 hover:bg-forest hover:text-white text-forest text-xs font-bold transition-colors border border-[#CAD7C5] disabled:opacity-40 cursor-pointer"
        >
          + Tambah URL
        </button>
      </form>

      {/* Thumbnails Gallery Grid */}
      {images.length === 0 ? (
        <div className="py-6 text-center text-xs text-neutral-400 border border-[#CAD7C5]/40 rounded-xl bg-sage-50/20">
          Belum ada foto dalam galeri item ini. Silakan upload foto dari laptop atau masukkan URL.
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 pt-2">
          {images.map((imgUrl, idx) => (
            <div
              key={idx}
              className={`relative rounded-xl overflow-hidden border transition-all group bg-neutral-900 flex flex-col justify-between ${
                idx === 0
                  ? 'border-forest ring-2 ring-forest/30 shadow-sm'
                  : 'border-[#CAD7C5] hover:border-forest/60'
              }`}
            >
              {/* Image Preview Container */}
              <div className={`relative w-full ${aspectClass} overflow-hidden bg-neutral-950`}>
                <img
                  src={imgUrl}
                  alt={`Dokumentasi #${idx + 1}`}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  onError={(e) => {
                    // Fallback to placeholder if broken
                    (e.target as HTMLImageElement).src = '/11.png';
                  }}
                />

                {/* Top Badge (Cover vs Slide) */}
                <div className="absolute top-2 left-2 z-10">
                  {idx === 0 ? (
                    <span className="px-2 py-0.5 rounded-md bg-forest text-white text-[10px] font-bold shadow-xs">
                      ★ Sampul Utama
                    </span>
                  ) : (
                    <span className="px-2 py-0.5 rounded-md bg-black/70 backdrop-blur-xs text-white text-[10px] font-medium font-mono">
                      #{idx + 1}
                    </span>
                  )}
                </div>

                {/* Quick Delete Button on Hover (Top Right) */}
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleRemovePhoto(idx);
                  }}
                  className="absolute top-2 right-2 z-10 w-6 h-6 rounded-md bg-black/70 hover:bg-rose-600 text-white flex items-center justify-center text-xs transition-colors cursor-pointer shadow-xs"
                  title="Hapus foto ini"
                >
                  ✕
                </button>
              </div>

              {/* Action Toolbar Below Preview */}
              <div className="p-1.5 bg-white border-t border-[#CAD7C5]/60 flex items-center justify-between text-[10px]">
                {/* Reorder Arrows */}
                <div className="flex items-center gap-1">
                  <button
                    type="button"
                    disabled={idx === 0}
                    onClick={() => handleMove(idx, 'left')}
                    className="w-5 h-5 rounded bg-sage-50 hover:bg-forest hover:text-white text-forest flex items-center justify-center font-bold disabled:opacity-30 cursor-pointer"
                    title="Geser ke kiri / urutan sebelumnya"
                  >
                    ◀
                  </button>
                  <button
                    type="button"
                    disabled={idx === images.length - 1}
                    onClick={() => handleMove(idx, 'right')}
                    className="w-5 h-5 rounded bg-sage-50 hover:bg-forest hover:text-white text-forest flex items-center justify-center font-bold disabled:opacity-30 cursor-pointer"
                    title="Geser ke kanan / urutan berikutnya"
                  >
                    ▶
                  </button>
                </div>

                {/* Set as Cover button (if not already cover) */}
                {idx !== 0 ? (
                  <button
                    type="button"
                    onClick={() => handleSetAsCover(idx)}
                    className="px-2 py-0.5 rounded text-[10px] font-bold text-forest hover:bg-forest hover:text-white transition-colors cursor-pointer"
                    title="Jadikan foto ini sebagai foto sampul utama di kartu"
                  >
                    Jadikan Sampul
                  </button>
                ) : (
                  <span className="text-[9px] font-bold text-forest uppercase tracking-wider">
                    Foto Utama
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
