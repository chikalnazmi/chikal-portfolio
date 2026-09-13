'use client';

import React, { useState } from 'react';

interface ProjectMediaGalleryProps {
  title: string;
  images: string[];
}

export default function ProjectMediaGallery({ title, images }: ProjectMediaGalleryProps) {
  const [activeIdx, setActiveIdx] = useState(0);
  const currentImg = images[activeIdx] || images[0] || '/13.png';

  const handlePrev = () => {
    setActiveIdx((prev) => (prev > 0 ? prev - 1 : images.length - 1));
  };

  const handleNext = () => {
    setActiveIdx((prev) => (prev < images.length - 1 ? prev + 1 : 0));
  };

  return (
    <div className="w-full bg-white/95 rounded-[2rem] sm:rounded-[2.5rem] border border-[#CAD7C5] p-4 sm:p-7 shadow-sm mb-12">
      {/* Top Media Bar Info */}
      <div className="flex items-center justify-between gap-3 mb-4 pb-3 border-b border-[#CAD7C5]/60 text-xs">
        <div className="flex items-center gap-2 font-mono text-forest/70 font-medium">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          <span>Dokumentasi Media {activeIdx + 1} dari {images.length}</span>
        </div>
        <a
          href={currentImg}
          target="_blank"
          rel="noopener noreferrer"
          className="px-3.5 py-1.5 rounded-full bg-[#E8EFE5] hover:bg-rose-blush text-forest hover:text-rose-dark text-xs font-bold transition-all shadow-xs flex items-center gap-1"
        >
          <span>Buka Ukuran Asli</span>
          <span>↗</span>
        </a>
      </div>

      {/* Main Showcase Stage (Generous, High-Visibility, Uncropped) */}
      <div className="relative w-full h-[340px] sm:h-[480px] md:h-[560px] rounded-2xl overflow-hidden bg-[#1A2518]/5 border border-[#CAD7C5]/80 flex items-center justify-center group shadow-inner">
        {/* Soft Ambient Blurred Glow */}
        <div
          className="absolute inset-0 bg-cover bg-center opacity-20 filter blur-2xl scale-125 pointer-events-none transition-all duration-500"
          style={{ backgroundImage: `url(${currentImg})` }}
        />

        {/* 100% Uncropped Image */}
        <img
          src={currentImg}
          alt={`${title} screenshot ${activeIdx + 1}`}
          className="relative z-10 max-w-full max-h-full object-contain p-2 sm:p-4 transition-transform duration-300 drop-shadow-md"
        />

        {/* Left Arrow */}
        {images.length > 1 && (
          <button
            onClick={handlePrev}
            className="absolute left-3 sm:left-5 top-1/2 -translate-y-1/2 z-20 w-11 h-11 sm:w-12 sm:h-12 rounded-full bg-white/95 hover:bg-white text-forest hover:text-rose-dark shadow-xl border border-[#CAD7C5] flex items-center justify-center text-2xl font-bold transition-all hover:scale-110 active:scale-95 cursor-pointer ring-4 ring-black/5"
            title="Foto Sebelumnya"
            aria-label="Previous image"
          >
            ‹
          </button>
        )}

        {/* Right Arrow */}
        {images.length > 1 && (
          <button
            onClick={handleNext}
            className="absolute right-3 sm:right-5 top-1/2 -translate-y-1/2 z-20 w-11 h-11 sm:w-12 sm:h-12 rounded-full bg-white/95 hover:bg-white text-forest hover:text-rose-dark shadow-xl border border-[#CAD7C5] flex items-center justify-center text-2xl font-bold transition-all hover:scale-110 active:scale-95 cursor-pointer ring-4 ring-black/5"
            title="Foto Selanjutnya"
            aria-label="Next image"
          >
            ›
          </button>
        )}

        {/* Live Badge */}
        <div className="absolute bottom-3 left-3 z-20 px-3.5 py-1.5 rounded-full bg-black/75 backdrop-blur-md text-white text-xs font-mono font-medium shadow-md flex items-center gap-2 border border-white/20">
          <span className="w-2 h-2 rounded-full bg-emerald-400" />
          <span>Gambar {activeIdx + 1} / {images.length}</span>
        </div>
      </div>

      {/* Thumbnails Filmstrip */}
      {images.length > 1 && (
        <div className="mt-4 pt-3 border-t border-[#CAD7C5]/50">
          <span className="text-[11px] font-bold uppercase tracking-wider text-forest/60 block mb-2">
            Klik Thumbnail untuk Melihat Dokumentasi Lainnya:
          </span>
          <div className="flex items-center gap-3 overflow-x-auto py-1 scrollbar-thin">
            {images.map((img, idx) => {
              const isActive = idx === activeIdx;
              return (
                <button
                  key={idx}
                  onClick={() => setActiveIdx(idx)}
                  className={`relative w-24 sm:w-32 aspect-[4/3] rounded-xl overflow-hidden border-2 transition-all shrink-0 cursor-pointer bg-forest/5 ${
                    isActive
                      ? 'border-rose-dark ring-3 ring-rose-dark/40 scale-105 shadow-md'
                      : 'border-[#CAD7C5] opacity-65 hover:opacity-100 hover:border-forest'
                  }`}
                  title={`Lihat Foto ${idx + 1}`}
                >
                  <img src={img} alt={`Preview ${idx + 1}`} className="w-full h-full object-cover" />
                  <span className={`absolute bottom-1 right-1 px-1.5 py-0.5 rounded text-[9px] font-bold font-mono ${
                    isActive ? 'bg-rose-dark text-white' : 'bg-black/70 text-white'
                  }`}>
                    #{idx + 1}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
