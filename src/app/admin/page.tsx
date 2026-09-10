'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { 
  getPortfolioData, 
  savePortfolioData, 
  resetPortfolioData, 
  DEFAULT_PORTFOLIO_DATA,
  PortfolioData 
} from '@/lib/portfolio-store';

export default function AdminPortal() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [pinInput, setPinInput] = useState('');
  const [pinError, setPinError] = useState(false);
  const [activeTab, setActiveTab] = useState<'hero' | 'projects' | 'awards' | 'creator' | 'socials' | 'photoguide' | 'supabase'>('hero');
  const [data, setData] = useState<PortfolioData>(DEFAULT_PORTFOLIO_DATA);
  const [activeCreatorKey, setActiveCreatorKey] = useState<string>('personal');
  const [activeProjectIdx, setActiveProjectIdx] = useState<number>(0);
  const [activeAwardIdx, setActiveAwardIdx] = useState<number>(0);
  const [saveSuccessToast, setSaveSuccessToast] = useState(false);

  // Secret PIN (Default: chikal2026)
  const SECRET_PIN = 'chikal2026';

  useEffect(() => {
    const authSession = sessionStorage.getItem('chikal_admin_session');
    if (authSession === 'authenticated') {
      setIsAuthenticated(true);
    }
    setData(getPortfolioData());
  }, []);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (pinInput === SECRET_PIN) {
      setIsAuthenticated(true);
      sessionStorage.setItem('chikal_admin_session', 'authenticated');
      setPinError(false);
    } else {
      setPinError(true);
    }
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    sessionStorage.removeItem('chikal_admin_session');
    setPinInput('');
  };

  const handleSave = () => {
    savePortfolioData(data);
    setSaveSuccessToast(true);
    setTimeout(() => {
      setSaveSuccessToast(false);
    }, 3500);
  };

  const handleReset = () => {
    if (window.confirm('Yakin ingin mengembalikan seluruh konten teks, foto, dan tautan portofolio ke pengaturan bawaan?')) {
      resetPortfolioData();
      setData(DEFAULT_PORTFOLIO_DATA);
      setSaveSuccessToast(true);
      setTimeout(() => {
        setSaveSuccessToast(false);
      }, 3500);
    }
  };

  // --------------------------------------------------------------------------
  // SCREEN 1: SECRET PIN LOCK (Discreet & Private - Public Can't Enter)
  // --------------------------------------------------------------------------
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-[#1E2E1B] text-[#E8EFE5] flex items-center justify-center p-4 selection:bg-rose-dusty selection:text-white">
        <div className="max-w-md w-full bg-[#253521] border-2 border-[#CAD7C5]/30 rounded-3xl p-8 shadow-2xl relative overflow-hidden">
          <div className="absolute -top-20 -right-20 w-48 h-48 bg-rose-dark/20 rounded-full blur-3xl pointer-events-none" />
          
          <div className="text-center mb-6">
            <div className="w-16 h-16 rounded-2xl bg-white/10 border border-[#CAD7C5]/30 flex items-center justify-center mx-auto mb-4 text-2xl shadow-inner">
              🔐
            </div>
            <h1 className="font-serif text-2xl font-bold text-white tracking-wide">
              Chikal Content Studio
            </h1>
            <p className="text-xs text-[#CAD7C5]/80 mt-1 font-source">
              Pusat pengelolaan teks, foto dokumentasi, dan tautan portofolio Chikal Nazmi.
            </p>
          </div>

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-xs font-mono text-[#CAD7C5] mb-1.5 uppercase tracking-wider">
                Masukkan PIN Rahasia
              </label>
              <input
                type="password"
                value={pinInput}
                onChange={(e) => {
                  setPinInput(e.target.value);
                  setPinError(false);
                }}
                placeholder="••••••••"
                className="w-full px-4 py-3 rounded-xl bg-black/40 border border-[#CAD7C5]/40 text-white placeholder-white/20 focus:outline-none focus:border-rose-blush text-center text-lg tracking-widest font-mono shadow-inner"
                autoFocus
              />
              {pinError && (
                <p className="text-rose-300 text-xs mt-2 text-center font-medium animate-shake">
                  ❌ PIN salah. Hubungi pemilik untuk akses.
                </p>
              )}
            </div>

            <button
              type="submit"
              className="w-full py-3 rounded-xl bg-rose-dark hover:bg-rose-berry text-white font-bold text-sm tracking-wide transition-all shadow-md active:scale-98 cursor-pointer"
            >
              Buka Studio Edit ➔
            </button>
          </form>

          <div className="mt-6 pt-6 border-t border-white/10 text-center text-xs text-white/50 flex items-center justify-between">
            <span className="font-mono text-[11px]">PIN Bawaan: chikal2026</span>
            <Link href="/" className="hover:text-rose-blush underline">
              ← Ke Beranda
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // --------------------------------------------------------------------------
  // SCREEN 2: ADMIN CONTENT DASHBOARD (TEXT, PHOTOS, LINKS & METRICS)
  // --------------------------------------------------------------------------
  return (
    <div className="min-h-screen bg-[#F7F9F5] text-forest font-source pb-24">
      {/* Toast Notification */}
      {saveSuccessToast && (
        <div className="fixed top-6 right-6 z-50 bg-[#1E2E1B] text-white px-5 py-3.5 rounded-2xl shadow-2xl border border-rose-blush/40 flex items-center gap-3 animate-fade-in">
          <span className="text-lg">✅</span>
          <div>
            <p className="text-xs font-bold font-serif text-rose-blush">Perubahan Berhasil Disimpan!</p>
            <p className="text-[11px] text-[#CAD7C5]">Seluruh teks dan foto di portofolio langsung terupdate.</p>
          </div>
        </div>
      )}

      {/* Top Bar */}
      <header className="sticky top-0 z-40 bg-white/90 backdrop-blur-md border-b border-[#CAD7C5]/80 px-4 sm:px-8 py-3.5 shadow-xs">
        <div className="max-w-6xl mx-auto flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-xl bg-forest text-[#E8EFE5] flex items-center justify-center font-serif font-bold text-sm">
              C
            </div>
            <div>
              <h1 className="font-serif font-bold text-base text-forest leading-tight">
                Chikal Content Studio
              </h1>
              <span className="text-[10px] text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full font-bold border border-emerald-200">
                ● Studio Edit Lengkap (Teks & Foto)
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2 sm:gap-3">
            <Link
              href="/"
              target="_blank"
              className="px-3.5 py-1.5 rounded-full text-xs font-bold bg-[#E8EFE5] text-forest hover:bg-forest hover:text-white transition-colors flex items-center gap-1 border border-[#CAD7C5]"
            >
              <span>👁️ Lihat Live</span>
              <span>↗</span>
            </Link>

            <button
              onClick={handleSave}
              className="px-5 py-1.5 rounded-full text-xs font-bold bg-rose-dark hover:bg-rose-berry text-white transition-all shadow-sm hover:shadow flex items-center gap-1.5 cursor-pointer"
            >
              <span>💾 Simpan Data</span>
            </button>

            <button
              onClick={handleLogout}
              className="px-3 py-1.5 rounded-full text-xs font-medium text-forest/70 hover:text-rose-dark hover:bg-rose-blush/40 transition-colors"
              title="Kunci & Keluar"
            >
              🔒 Keluar
            </button>
          </div>
        </div>
      </header>

      {/* Navigation Tabs */}
      <div className="max-w-6xl mx-auto px-4 sm:px-8 mt-6">
        <div className="flex flex-wrap gap-2 p-1.5 bg-white rounded-2xl border border-[#CAD7C5]/80 shadow-xs">
          <button
            onClick={() => setActiveTab('hero')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
              activeTab === 'hero'
                ? 'bg-forest text-white shadow-sm'
                : 'text-forest/70 hover:bg-[#E8EFE5]'
            }`}
          >
            🏠 Profil & Teks Utama
          </button>
          <button
            onClick={() => setActiveTab('projects')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
              activeTab === 'projects'
                ? 'bg-forest text-white shadow-sm'
                : 'text-forest/70 hover:bg-[#E8EFE5]'
            }`}
          >
            💼 Proyek & Bukti Foto
          </button>
          <button
            onClick={() => setActiveTab('awards')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
              activeTab === 'awards'
                ? 'bg-forest text-white shadow-sm'
                : 'text-forest/70 hover:bg-[#E8EFE5]'
            }`}
          >
            🏆 Kejuaraan & Sertifikat
          </button>
          <button
            onClick={() => setActiveTab('creator')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
              activeTab === 'creator'
                ? 'bg-forest text-white shadow-sm'
                : 'text-forest/70 hover:bg-[#E8EFE5]'
            }`}
          >
            🎬 Video & Creator Stage
          </button>
          <button
            onClick={() => setActiveTab('socials')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
              activeTab === 'socials'
                ? 'bg-forest text-white shadow-sm'
                : 'text-forest/70 hover:bg-[#E8EFE5]'
            }`}
          >
            📱 Media Sosial & Kontak
          </button>
          <button
            onClick={() => setActiveTab('photoguide')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
              activeTab === 'photoguide'
                ? 'bg-amber-700 text-white shadow-sm'
                : 'text-amber-800 hover:bg-amber-50'
            }`}
          >
            📸 Panduan Ganti Foto
          </button>
          <button
            onClick={() => setActiveTab('supabase')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
              activeTab === 'supabase'
                ? 'bg-emerald-800 text-white shadow-sm'
                : 'text-emerald-800 hover:bg-emerald-50'
            }`}
          >
            ☁️ Supabase + Vercel
          </button>
        </div>
      </div>

      {/* Tab Content Canvas */}
      <main className="max-w-6xl mx-auto px-4 sm:px-8 mt-6">
        
        {/* ================================================================= */}
        {/* TAB 1: PROFIL & TEKS UTAMA (HERO SECTION & FOTO PROFIL)           */}
        {/* ================================================================= */}
        {activeTab === 'hero' && (
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#CAD7C5] shadow-xs space-y-6">
            <div>
              <h2 className="font-serif text-xl font-bold text-forest">
                Pengaturan Profil & Teks Beranda (Hero Section)
              </h2>
              <p className="text-xs text-forest/70 mt-1">
                Kamu bisa mengubah judul utama, biografi perkenalan diri, 4 metrik statistik, dan foto profil utama.
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              {/* Left Column: Text Fields (8 cols) */}
              <div className="lg:col-span-8 space-y-4">
                <div>
                  <label className="block text-xs font-bold text-forest mb-1">
                    Pill Ketersediaan Karir (Status Bar):
                  </label>
                  <input
                    type="text"
                    value={data.hero?.subheadline || ''}
                    onChange={(e) => setData({
                      ...data,
                      hero: { ...data.hero, subheadline: e.target.value }
                    })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-[#CAD7C5] text-xs text-forest"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-forest mb-1">
                    Kalimat Headline Utama (Judul Besar):
                  </label>
                  <textarea
                    rows={2}
                    value={data.hero?.headline || ''}
                    onChange={(e) => setData({
                      ...data,
                      hero: { ...data.hero, headline: e.target.value }
                    })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-[#CAD7C5] text-xs font-serif text-forest"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-forest mb-1">
                    Paragraf Biografi / Pengenalan Diri:
                  </label>
                  <textarea
                    rows={4}
                    value={data.hero?.bio || ''}
                    onChange={(e) => setData({
                      ...data,
                      hero: { ...data.hero, bio: e.target.value }
                    })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-[#CAD7C5] text-xs text-forest leading-relaxed"
                  />
                </div>

                {/* 4 Statistical Metrics */}
                <div className="pt-2">
                  <label className="block text-xs font-bold text-forest mb-2">
                    4 Metrik Statistik Utama:
                  </label>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                    <div className="p-3 rounded-xl bg-[#E8EFE5]/40 border border-[#CAD7C5]/60">
                      <input
                        type="text"
                        value={data.hero?.stat1Value || ''}
                        onChange={(e) => setData({
                          ...data,
                          hero: { ...data.hero, stat1Value: e.target.value }
                        })}
                        placeholder="7x"
                        className="w-full text-center font-serif font-bold text-sm text-rose-dark bg-white rounded-lg border border-[#CAD7C5] py-1 mb-1"
                      />
                      <input
                        type="text"
                        value={data.hero?.stat1Label || ''}
                        onChange={(e) => setData({
                          ...data,
                          hero: { ...data.hero, stat1Label: e.target.value }
                        })}
                        placeholder="National Awards"
                        className="w-full text-center text-[10px] uppercase font-bold text-forest/70 bg-transparent"
                      />
                    </div>

                    <div className="p-3 rounded-xl bg-[#E8EFE5]/40 border border-[#CAD7C5]/60">
                      <input
                        type="text"
                        value={data.hero?.stat2Value || ''}
                        onChange={(e) => setData({
                          ...data,
                          hero: { ...data.hero, stat2Value: e.target.value }
                        })}
                        placeholder="+2.089%"
                        className="w-full text-center font-serif font-bold text-sm text-rose-dark bg-white rounded-lg border border-[#CAD7C5] py-1 mb-1"
                      />
                      <input
                        type="text"
                        value={data.hero?.stat2Label || ''}
                        onChange={(e) => setData({
                          ...data,
                          hero: { ...data.hero, stat2Label: e.target.value }
                        })}
                        placeholder="Reels Reach Surge"
                        className="w-full text-center text-[10px] uppercase font-bold text-forest/70 bg-transparent"
                      />
                    </div>

                    <div className="p-3 rounded-xl bg-[#E8EFE5]/40 border border-[#CAD7C5]/60">
                      <input
                        type="text"
                        value={data.hero?.stat3Value || ''}
                        onChange={(e) => setData({
                          ...data,
                          hero: { ...data.hero, stat3Value: e.target.value }
                        })}
                        placeholder="20+"
                        className="w-full text-center font-serif font-bold text-sm text-forest bg-white rounded-lg border border-[#CAD7C5] py-1 mb-1"
                      />
                      <input
                        type="text"
                        value={data.hero?.stat3Label || ''}
                        onChange={(e) => setData({
                          ...data,
                          hero: { ...data.hero, stat3Label: e.target.value }
                        })}
                        placeholder="Event Partners"
                        className="w-full text-center text-[10px] uppercase font-bold text-forest/70 bg-transparent"
                      />
                    </div>

                    <div className="p-3 rounded-xl bg-[#E8EFE5]/40 border border-[#CAD7C5]/60">
                      <input
                        type="text"
                        value={data.hero?.stat4Value || ''}
                        onChange={(e) => setData({
                          ...data,
                          hero: { ...data.hero, stat4Value: e.target.value }
                        })}
                        placeholder="D4 SIB"
                        className="w-full text-center font-serif font-bold text-sm text-forest bg-white rounded-lg border border-[#CAD7C5] py-1 mb-1"
                      />
                      <input
                        type="text"
                        value={data.hero?.stat4Label || ''}
                        onChange={(e) => setData({
                          ...data,
                          hero: { ...data.hero, stat4Label: e.target.value }
                        })}
                        placeholder="Polinema Honor"
                        className="w-full text-center text-[10px] uppercase font-bold text-forest/70 bg-transparent"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Right Column: Avatar Photo Edit & Live Preview (4 cols) */}
              <div className="lg:col-span-4 p-5 rounded-2xl bg-[#E8EFE5]/40 border border-[#CAD7C5] flex flex-col items-center justify-between gap-4">
                <div className="w-full text-center">
                  <span className="text-[10px] font-bold uppercase text-forest tracking-wider block mb-1">
                    Foto Profil Utama (Live Preview)
                  </span>
                  
                  {/* Image Frame Preview */}
                  <div className="w-36 h-44 mx-auto rounded-t-full rounded-b-2xl overflow-hidden border-2 border-forest shadow-md bg-forest/10 relative my-2">
                    <img
                      src={data.hero?.avatarImg || '/2.png'}
                      alt="Preview Profil"
                      className="w-full h-full object-cover object-top"
                      onError={(e) => {
                        // Fallback if image path not found
                        (e.target as HTMLImageElement).src = '/2.png';
                      }}
                    />
                  </div>
                </div>

                <div className="w-full">
                  <label className="block text-[11px] font-bold text-forest mb-1">
                    Path File Foto / URL Gambar:
                  </label>
                  <input
                    type="text"
                    value={data.hero?.avatarImg || ''}
                    onChange={(e) => setData({
                      ...data,
                      hero: { ...data.hero, avatarImg: e.target.value }
                    })}
                    placeholder="Contoh: /2.png atau /foto-wisuda.jpg"
                    className="w-full px-3 py-2 rounded-xl bg-white border border-[#CAD7C5] text-xs font-mono"
                  />
                  <span className="text-[10px] text-forest/60 mt-1 block">
                    Tip: Masukkan foto baru ke folder <code>public/</code> lalu ketik namanya di sini.
                  </span>
                </div>
              </div>
            </div>

            <div className="pt-4 border-t border-[#CAD7C5]/60 flex justify-end">
              <button
                onClick={handleSave}
                className="px-6 py-2.5 rounded-full bg-forest text-white text-xs font-bold hover:bg-rose-dark transition-colors shadow-sm cursor-pointer"
              >
                Simpan Profil & Teks Utama 💾
              </button>
            </div>
          </div>
        )}

        {/* ================================================================= */}
        {/* TAB 2: PROYEK KERJA (SELECTED WORKS) — TEKS & BUKTI FOTO           */}
        {/* ================================================================= */}
        {activeTab === 'projects' && (
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#CAD7C5] shadow-xs space-y-6">
            <div>
              <h2 className="font-serif text-xl font-bold text-forest">
                Pengaturan Teks & Foto — Selected Works & Proyek Bisnis
              </h2>
              <p className="text-xs text-forest/70 mt-1">
                Pilih proyek kerja untuk mengedit judul, ringkasan, tantangan, strategi, metrik hasil, foto sampul, dan foto-foto dokumentasi pendukung.
              </p>
            </div>

            {/* Project Selector Tabs */}
            <div className="flex flex-wrap gap-2 border-b border-[#CAD7C5]/70 pb-4">
              {data.projects.map((p, idx) => (
                <button
                  key={p.id}
                  onClick={() => setActiveProjectIdx(idx)}
                  className={`px-4 py-1.5 rounded-full text-xs font-bold transition-all ${
                    activeProjectIdx === idx
                      ? 'bg-rose-dark text-white shadow-xs'
                      : 'bg-[#E8EFE5] text-forest/80 hover:bg-[#CAD7C5]'
                  }`}
                >
                  {p.title.split('—')[0].trim()}
                </button>
              ))}
            </div>

            {/* Active Project Editor */}
            {data.projects[activeProjectIdx] && (
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="md:col-span-2">
                    <label className="block text-xs font-bold text-forest mb-1">Judul Proyek:</label>
                    <input
                      type="text"
                      value={data.projects[activeProjectIdx].title}
                      onChange={(e) => {
                        const updated = [...data.projects];
                        updated[activeProjectIdx].title = e.target.value;
                        setData({ ...data, projects: updated });
                      }}
                      className="w-full px-3.5 py-2 rounded-xl bg-white border border-[#CAD7C5] text-xs font-serif font-bold text-forest"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-forest mb-1">Periode / Waktu:</label>
                    <input
                      type="text"
                      value={data.projects[activeProjectIdx].period}
                      onChange={(e) => {
                        const updated = [...data.projects];
                        updated[activeProjectIdx].period = e.target.value;
                        setData({ ...data, projects: updated });
                      }}
                      className="w-full px-3.5 py-2 rounded-xl bg-white border border-[#CAD7C5] text-xs"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-forest mb-1">Tag / Peran:</label>
                    <input
                      type="text"
                      value={data.projects[activeProjectIdx].tag}
                      onChange={(e) => {
                        const updated = [...data.projects];
                        updated[activeProjectIdx].tag = e.target.value;
                        setData({ ...data, projects: updated });
                      }}
                      className="w-full px-3.5 py-2 rounded-xl bg-white border border-[#CAD7C5] text-xs"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-forest mb-1">🔗 Link Eksternal / Berita:</label>
                    <input
                      type="text"
                      value={data.projects[activeProjectIdx].link || ''}
                      onChange={(e) => {
                        const updated = [...data.projects];
                        updated[activeProjectIdx].link = e.target.value;
                        setData({ ...data, projects: updated });
                      }}
                      placeholder="https://... (kosongkan jika tidak ada)"
                      className="w-full px-3.5 py-2 rounded-xl bg-white border border-[#CAD7C5] text-xs font-mono"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-forest mb-1">Label Tombol Tautan:</label>
                    <input
                      type="text"
                      value={data.projects[activeProjectIdx].linkLabel || ''}
                      onChange={(e) => {
                        const updated = [...data.projects];
                        updated[activeProjectIdx].linkLabel = e.target.value;
                        setData({ ...data, projects: updated });
                      }}
                      placeholder="Profil Bisnis Dua Sisi ↗"
                      className="w-full px-3.5 py-2 rounded-xl bg-white border border-[#CAD7C5] text-xs"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-forest mb-1">Ringkasan Eksekutif (Summary):</label>
                  <textarea
                    rows={2}
                    value={data.projects[activeProjectIdx].summary}
                    onChange={(e) => {
                      const updated = [...data.projects];
                      updated[activeProjectIdx].summary = e.target.value;
                      setData({ ...data, projects: updated });
                    }}
                    className="w-full px-3.5 py-2 rounded-xl bg-white border border-[#CAD7C5] text-xs leading-relaxed"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-forest mb-1">Tantangan Bisnis (Challenge):</label>
                    <textarea
                      rows={2}
                      value={data.projects[activeProjectIdx].challenge}
                      onChange={(e) => {
                        const updated = [...data.projects];
                        updated[activeProjectIdx].challenge = e.target.value;
                        setData({ ...data, projects: updated });
                      }}
                      className="w-full px-3.5 py-2 rounded-xl bg-white border border-[#CAD7C5] text-xs"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-forest mb-1">Strategi & Solusi (Strategy):</label>
                    <textarea
                      rows={2}
                      value={data.projects[activeProjectIdx].strategy}
                      onChange={(e) => {
                        const updated = [...data.projects];
                        updated[activeProjectIdx].strategy = e.target.value;
                        setData({ ...data, projects: updated });
                      }}
                      className="w-full px-3.5 py-2 rounded-xl bg-white border border-[#CAD7C5] text-xs"
                    />
                  </div>
                </div>

                {/* Results List */}
                <div>
                  <label className="block text-xs font-bold text-forest mb-1">3 Metrik Hasil Capaian (Results):</label>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                    {data.projects[activeProjectIdx].results.map((res, rIdx) => (
                      <input
                        key={rIdx}
                        type="text"
                        value={res}
                        onChange={(e) => {
                          const updated = [...data.projects];
                          updated[activeProjectIdx].results[rIdx] = e.target.value;
                          setData({ ...data, projects: updated });
                        }}
                        className="w-full px-3 py-2 rounded-xl bg-white border border-[#CAD7C5] text-xs"
                      />
                    ))}
                  </div>
                </div>

                {/* Photos & Documentation Section */}
                <div className="p-4 rounded-2xl bg-[#E8EFE5]/40 border border-[#CAD7C5] space-y-4">
                  <h4 className="font-serif font-bold text-sm text-forest">
                    🖼️ Foto Sampul & Bukti Dokumentasi Proyek
                  </h4>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    {/* Primary Image */}
                    <div className="space-y-1.5">
                      <label className="block text-[11px] font-bold text-forest">Foto Sampul Utama:</label>
                      <input
                        type="text"
                        value={data.projects[activeProjectIdx].image}
                        onChange={(e) => {
                          const updated = [...data.projects];
                          updated[activeProjectIdx].image = e.target.value;
                          setData({ ...data, projects: updated });
                        }}
                        className="w-full px-3 py-1.5 rounded-lg bg-white border border-[#CAD7C5] text-xs font-mono"
                      />
                      <div className="w-full aspect-[16/10] rounded-lg overflow-hidden border border-[#CAD7C5] bg-black/5">
                        <img
                          src={data.projects[activeProjectIdx].image}
                          alt="Cover Preview"
                          className="w-full h-full object-cover"
                        />
                      </div>
                    </div>

                    {/* Extra Image 1 */}
                    <div className="space-y-1.5">
                      <label className="block text-[11px] font-bold text-forest">Foto Bukti 2:</label>
                      <input
                        type="text"
                        value={data.projects[activeProjectIdx].extraImages[1] || ''}
                        onChange={(e) => {
                          const updated = [...data.projects];
                          updated[activeProjectIdx].extraImages[1] = e.target.value;
                          setData({ ...data, projects: updated });
                        }}
                        className="w-full px-3 py-1.5 rounded-lg bg-white border border-[#CAD7C5] text-xs font-mono"
                      />
                      <div className="w-full aspect-[16/10] rounded-lg overflow-hidden border border-[#CAD7C5] bg-black/5">
                        <img
                          src={data.projects[activeProjectIdx].extraImages[1] || data.projects[activeProjectIdx].image}
                          alt="Bukti 2 Preview"
                          className="w-full h-full object-cover"
                        />
                      </div>
                    </div>

                    {/* Extra Image 2 */}
                    <div className="space-y-1.5">
                      <label className="block text-[11px] font-bold text-forest">Foto Bukti 3:</label>
                      <input
                        type="text"
                        value={data.projects[activeProjectIdx].extraImages[2] || ''}
                        onChange={(e) => {
                          const updated = [...data.projects];
                          updated[activeProjectIdx].extraImages[2] = e.target.value;
                          setData({ ...data, projects: updated });
                        }}
                        className="w-full px-3 py-1.5 rounded-lg bg-white border border-[#CAD7C5] text-xs font-mono"
                      />
                      <div className="w-full aspect-[16/10] rounded-lg overflow-hidden border border-[#CAD7C5] bg-black/5">
                        <img
                          src={data.projects[activeProjectIdx].extraImages[2] || data.projects[activeProjectIdx].image}
                          alt="Bukti 3 Preview"
                          className="w-full h-full object-cover"
                        />
                      </div>
                    </div>
                  </div>
                </div>

                <div className="pt-2 flex justify-end">
                  <button
                    onClick={handleSave}
                    className="px-6 py-2.5 rounded-full bg-forest text-white text-xs font-bold hover:bg-rose-dark transition-colors shadow-sm cursor-pointer"
                  >
                    Simpan Perubahan Proyek 💾
                  </button>
                </div>
              </div>
            )}
          </div>
        )}

        {/* ================================================================= */}
        {/* TAB 3: KEJUARAAN (AWARDS) — TEKS, SERTIFIKAT & FOTO DOKUMENTASI    */}
        {/* ================================================================= */}
        {activeTab === 'awards' && (
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#CAD7C5] shadow-xs space-y-6">
            <div>
              <h2 className="font-serif text-xl font-bold text-forest">
                Pengaturan Kejuaraan, Sertifikat & Foto Dokumentasi Panggung
              </h2>
              <p className="text-xs text-forest/70 mt-1">
                Ubah judul lomba, penyelenggara, deskripsi kemenangan, foto sertifikat resmi, foto panggung penghargaan, dan link publikasi berita.
              </p>
            </div>

            {/* Award Selector Tabs */}
            <div className="flex flex-wrap gap-2 border-b border-[#CAD7C5]/70 pb-4">
              {data.awards.map((award, idx) => (
                <button
                  key={idx}
                  onClick={() => setActiveAwardIdx(idx)}
                  className={`px-4 py-1.5 rounded-full text-xs font-bold transition-all ${
                    activeAwardIdx === idx
                      ? 'bg-rose-dark text-white shadow-xs'
                      : 'bg-[#E8EFE5] text-forest/80 hover:bg-[#CAD7C5]'
                  }`}
                >
                  {award.rank} ({award.year})
                </button>
              ))}
            </div>

            {/* Active Award Editor */}
            {data.awards[activeAwardIdx] && (
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <div className="md:col-span-2">
                    <label className="block text-xs font-bold text-forest mb-1">Judul Kompetisi / Penghargaan:</label>
                    <input
                      type="text"
                      value={data.awards[activeAwardIdx].title}
                      onChange={(e) => {
                        const updated = [...data.awards];
                        updated[activeAwardIdx].title = e.target.value;
                        setData({ ...data, awards: updated });
                      }}
                      className="w-full px-3.5 py-2 rounded-xl bg-white border border-[#CAD7C5] text-xs font-serif font-bold text-forest"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-forest mb-1">Gelar / Peringkat (Rank):</label>
                    <input
                      type="text"
                      value={data.awards[activeAwardIdx].rank}
                      onChange={(e) => {
                        const updated = [...data.awards];
                        updated[activeAwardIdx].rank = e.target.value;
                        setData({ ...data, awards: updated });
                      }}
                      placeholder="1st Winner, Top 5 Finalist, dll"
                      className="w-full px-3.5 py-2 rounded-xl bg-white border border-[#CAD7C5] text-xs font-bold text-rose-dark"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-forest mb-1">Tahun Penyelenggaraan:</label>
                    <input
                      type="text"
                      value={data.awards[activeAwardIdx].year}
                      onChange={(e) => {
                        const updated = [...data.awards];
                        updated[activeAwardIdx].year = e.target.value;
                        setData({ ...data, awards: updated });
                      }}
                      className="w-full px-3.5 py-2 rounded-xl bg-white border border-[#CAD7C5] text-xs font-mono"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-forest mb-1">Penyelenggara Institusi:</label>
                    <input
                      type="text"
                      value={data.awards[activeAwardIdx].organizer}
                      onChange={(e) => {
                        const updated = [...data.awards];
                        updated[activeAwardIdx].organizer = e.target.value;
                        setData({ ...data, awards: updated });
                      }}
                      className="w-full px-3.5 py-2 rounded-xl bg-white border border-[#CAD7C5] text-xs"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-forest mb-1">🔗 Link Berita / Warta (Opsional):</label>
                    <input
                      type="text"
                      value={data.awards[activeAwardIdx].link || ''}
                      onChange={(e) => {
                        const updated = [...data.awards];
                        updated[activeAwardIdx].link = e.target.value;
                        setData({ ...data, awards: updated });
                      }}
                      placeholder="https://..."
                      className="w-full px-3.5 py-2 rounded-xl bg-white border border-[#CAD7C5] text-xs font-mono"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-forest mb-1">Label Tombol Tautan:</label>
                    <input
                      type="text"
                      value={data.awards[activeAwardIdx].linkLabel || ''}
                      onChange={(e) => {
                        const updated = [...data.awards];
                        updated[activeAwardIdx].linkLabel = e.target.value;
                        setData({ ...data, awards: updated });
                      }}
                      placeholder="Liputan Berita Kampus ↗"
                      className="w-full px-3.5 py-2 rounded-xl bg-white border border-[#CAD7C5] text-xs"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-forest mb-1">Deskripsi Kemenangan / Inovasi:</label>
                  <textarea
                    rows={3}
                    value={data.awards[activeAwardIdx].desc}
                    onChange={(e) => {
                      const updated = [...data.awards];
                      updated[activeAwardIdx].desc = e.target.value;
                      setData({ ...data, awards: updated });
                    }}
                    className="w-full px-3.5 py-2 rounded-xl bg-white border border-[#CAD7C5] text-xs leading-relaxed"
                  />
                </div>

                {/* Photos: Certificate and Event Image */}
                <div className="p-4 rounded-2xl bg-[#E8EFE5]/40 border border-[#CAD7C5] space-y-4">
                  <h4 className="font-serif font-bold text-sm text-forest">
                    📜 Foto Sertifikat & Dokumentasi Panggung Kejuaraan
                  </h4>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {/* Certificate Image */}
                    <div className="space-y-1.5">
                      <label className="block text-[11px] font-bold text-forest">Foto Sertifikat Asli:</label>
                      <input
                        type="text"
                        value={data.awards[activeAwardIdx].certImg}
                        onChange={(e) => {
                          const updated = [...data.awards];
                          updated[activeAwardIdx].certImg = e.target.value;
                          setData({ ...data, awards: updated });
                        }}
                        className="w-full px-3 py-1.5 rounded-lg bg-white border border-[#CAD7C5] text-xs font-mono"
                      />
                      <div className="w-full aspect-[4/3] rounded-lg overflow-hidden border border-[#CAD7C5] bg-black/5">
                        <img
                          src={data.awards[activeAwardIdx].certImg}
                          alt="Certificate Preview"
                          className="w-full h-full object-contain p-2"
                        />
                      </div>
                    </div>

                    {/* Event Documentation Image */}
                    <div className="space-y-1.5">
                      <label className="block text-[11px] font-bold text-forest">Foto Panggung / Dokumentasi Event:</label>
                      <input
                        type="text"
                        value={data.awards[activeAwardIdx].eventImg}
                        onChange={(e) => {
                          const updated = [...data.awards];
                          updated[activeAwardIdx].eventImg = e.target.value;
                          setData({ ...data, awards: updated });
                        }}
                        className="w-full px-3 py-1.5 rounded-lg bg-white border border-[#CAD7C5] text-xs font-mono"
                      />
                      <div className="w-full aspect-[4/3] rounded-lg overflow-hidden border border-[#CAD7C5] bg-black/5">
                        <img
                          src={data.awards[activeAwardIdx].eventImg}
                          alt="Event Preview"
                          className="w-full h-full object-cover"
                        />
                      </div>
                    </div>
                  </div>
                </div>

                <div className="pt-2 flex justify-end">
                  <button
                    onClick={handleSave}
                    className="px-6 py-2.5 rounded-full bg-forest text-white text-xs font-bold hover:bg-rose-dark transition-colors shadow-sm cursor-pointer"
                  >
                    Simpan Perubahan Kejuaraan 💾
                  </button>
                </div>
              </div>
            )}
          </div>
        )}

        {/* ================================================================= */}
        {/* TAB 4: VIDEO & CREATOR PRODUCTION (FOTO MOCKUP & ADAPTIF 2 HP)    */}
        {/* ================================================================= */}
        {activeTab === 'creator' && (
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#CAD7C5] shadow-xs space-y-6">
            <div>
              <h2 className="font-serif text-xl font-bold text-forest">
                Pengaturan Stage Video & Foto Mockup HP Kreator
              </h2>
              <p className="text-xs text-forest/70 mt-1">
                Atur tautan video YouTube di tengah, toggle adaptif (apakah 2 HP saja atau 3 perangkat), dan ubah foto-foto pada layar mockup.
              </p>
            </div>

            {/* Account Selector Pill */}
            <div className="flex flex-wrap gap-2 border-b border-[#CAD7C5]/70 pb-4">
              {Object.keys(data.creatorAccounts).map((key) => (
                <button
                  key={key}
                  onClick={() => setActiveCreatorKey(key)}
                  className={`px-4 py-1.5 rounded-full text-xs font-bold transition-all ${
                    activeCreatorKey === key
                      ? 'bg-rose-dark text-white shadow-xs'
                      : 'bg-[#E8EFE5] text-forest/80 hover:bg-[#CAD7C5]'
                  }`}
                >
                  {data.creatorAccounts[key].name}
                </button>
              ))}
            </div>

            {/* Selected Creator Settings */}
            {data.creatorAccounts[activeCreatorKey] && (
              <div className="space-y-6">
                {/* Adaptive Stage Toggle */}
                <div className="p-5 rounded-2xl bg-amber-50 border border-amber-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div>
                    <span className="text-[10px] uppercase font-bold text-amber-900 bg-amber-200/70 px-2 py-0.5 rounded-full tracking-wider">
                      Fitur Adaptif Stage Tengah
                    </span>
                    <h4 className="font-bold text-sm text-forest mt-1">
                      Tampilkan Video / Mockup Landscape di Tengah?
                    </h4>
                    <p className="text-xs text-forest/70 mt-0.5">
                      {data.creatorAccounts[activeCreatorKey].hasCenterStage 
                        ? '✅ Aktif: Menampilkan 3 perangkat (HP Kiri + Video Landscape Tengah + HP Kanan).'
                        : '📱 Mode 2 HP: Belum ada video landscape (seperti Dua Sisi Laundry), sehingga hanya menampilkan 2 HP di tengah secara rapi & seimbang.'
                      }
                    </p>
                  </div>

                  <button
                    onClick={() => {
                      const updated = { ...data.creatorAccounts };
                      updated[activeCreatorKey].hasCenterStage = !updated[activeCreatorKey].hasCenterStage;
                      setData({ ...data, creatorAccounts: updated });
                    }}
                    className={`px-5 py-2 rounded-full text-xs font-bold transition-all shrink-0 cursor-pointer ${
                      data.creatorAccounts[activeCreatorKey].hasCenterStage
                        ? 'bg-forest text-white'
                        : 'bg-rose-dark text-white'
                    }`}
                  >
                    {data.creatorAccounts[activeCreatorKey].hasCenterStage 
                      ? 'Ubah ke Mode 2 HP Saja' 
                      : 'Aktifkan Video Landscape (3 Perangkat)'}
                  </button>
                </div>

                {/* Form fields */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-forest mb-1">
                      Tautan Video YouTube / Link Destinasi Tengah:
                    </label>
                    <input
                      type="text"
                      value={data.creatorAccounts[activeCreatorKey].centerLink || ''}
                      onChange={(e) => {
                        const updated = { ...data.creatorAccounts };
                        updated[activeCreatorKey].centerLink = e.target.value;
                        setData({ ...data, creatorAccounts: updated });
                      }}
                      placeholder="https://www.youtube.com/@chikalnazmi"
                      className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-[#CAD7C5] text-xs font-mono"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-forest mb-1">
                      Highlight Stats Banner:
                    </label>
                    <input
                      type="text"
                      value={data.creatorAccounts[activeCreatorKey].stats}
                      onChange={(e) => {
                        const updated = { ...data.creatorAccounts };
                        updated[activeCreatorKey].stats = e.target.value;
                        setData({ ...data, creatorAccounts: updated });
                      }}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-[#CAD7C5] text-xs"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-forest mb-1">
                      Judul Kartu Tengah:
                    </label>
                    <input
                      type="text"
                      value={data.creatorAccounts[activeCreatorKey].centerTitle}
                      onChange={(e) => {
                        const updated = { ...data.creatorAccounts };
                        updated[activeCreatorKey].centerTitle = e.target.value;
                        setData({ ...data, creatorAccounts: updated });
                      }}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-[#CAD7C5] text-xs"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-forest mb-1">
                      Deskripsi Konten:
                    </label>
                    <input
                      type="text"
                      value={data.creatorAccounts[activeCreatorKey].centerDesc}
                      onChange={(e) => {
                        const updated = { ...data.creatorAccounts };
                        updated[activeCreatorKey].centerDesc = e.target.value;
                        setData({ ...data, creatorAccounts: updated });
                      }}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-[#CAD7C5] text-xs"
                    />
                  </div>
                </div>

                {/* Photos & Mockup Images with Live Preview */}
                <div className="p-4 rounded-2xl bg-[#E8EFE5]/40 border border-[#CAD7C5] space-y-4">
                  <h4 className="font-serif font-bold text-sm text-forest">
                    📱 Foto Mockup HP Kiri, Layar Tengah & HP Kanan
                  </h4>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    {/* Left Phone Photo */}
                    <div className="space-y-1.5">
                      <label className="block text-[11px] font-bold text-forest">Foto HP Kiri (Instagram Reels):</label>
                      <input
                        type="text"
                        value={data.creatorAccounts[activeCreatorKey].leftPhoneImg}
                        onChange={(e) => {
                          const updated = { ...data.creatorAccounts };
                          updated[activeCreatorKey].leftPhoneImg = e.target.value;
                          setData({ ...data, creatorAccounts: updated });
                        }}
                        className="w-full px-3 py-1.5 rounded-lg bg-white border border-[#CAD7C5] text-xs font-mono"
                      />
                      <div className="w-28 h-48 mx-auto rounded-2xl overflow-hidden border border-[#CAD7C5] bg-black/10">
                        <img
                          src={data.creatorAccounts[activeCreatorKey].leftPhoneImg}
                          alt="Left Phone Preview"
                          className="w-full h-full object-cover"
                        />
                      </div>
                    </div>

                    {/* Center Landscape Photo */}
                    <div className="space-y-1.5">
                      <label className="block text-[11px] font-bold text-forest">Foto Layar Tengah (Landscape):</label>
                      <input
                        type="text"
                        value={data.creatorAccounts[activeCreatorKey].centerImg}
                        onChange={(e) => {
                          const updated = { ...data.creatorAccounts };
                          updated[activeCreatorKey].centerImg = e.target.value;
                          setData({ ...data, creatorAccounts: updated });
                        }}
                        className="w-full px-3 py-1.5 rounded-lg bg-white border border-[#CAD7C5] text-xs font-mono"
                      />
                      <div className="w-full aspect-[16/10] rounded-lg overflow-hidden border border-[#CAD7C5] bg-black/10">
                        <img
                          src={data.creatorAccounts[activeCreatorKey].centerImg}
                          alt="Center Preview"
                          className="w-full h-full object-cover"
                        />
                      </div>
                    </div>

                    {/* Right Phone Photo */}
                    <div className="space-y-1.5">
                      <label className="block text-[11px] font-bold text-forest">Foto HP Kanan (TikTok Shorts):</label>
                      <input
                        type="text"
                        value={data.creatorAccounts[activeCreatorKey].rightPhoneImg}
                        onChange={(e) => {
                          const updated = { ...data.creatorAccounts };
                          updated[activeCreatorKey].rightPhoneImg = e.target.value;
                          setData({ ...data, creatorAccounts: updated });
                        }}
                        className="w-full px-3 py-1.5 rounded-lg bg-white border border-[#CAD7C5] text-xs font-mono"
                      />
                      <div className="w-28 h-48 mx-auto rounded-2xl overflow-hidden border border-[#CAD7C5] bg-black/10">
                        <img
                          src={data.creatorAccounts[activeCreatorKey].rightPhoneImg}
                          alt="Right Phone Preview"
                          className="w-full h-full object-cover"
                        />
                      </div>
                    </div>
                  </div>
                </div>

                <div className="pt-2 flex justify-end">
                  <button
                    onClick={handleSave}
                    className="px-6 py-2.5 rounded-full bg-forest text-white text-xs font-bold hover:bg-rose-dark transition-colors shadow-sm cursor-pointer"
                  >
                    Simpan Perubahan Creator Studio 💾
                  </button>
                </div>
              </div>
            )}
          </div>
        )}

        {/* ================================================================= */}
        {/* TAB 5: SOSIAL MEDIA & KONTAK UTAMA                                */}
        {/* ================================================================= */}
        {activeTab === 'socials' && (
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#CAD7C5] shadow-xs space-y-6">
            <div>
              <h2 className="font-serif text-xl font-bold text-forest">
                Pengaturan Seluruh Sosial Media & Kontak Pribadi
              </h2>
              <p className="text-xs text-forest/70 mt-1">
                Ubah link dan akun kamu di sini. Semua perubahan akan langsung aktif di bagian Footer & Kontak portofolio.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div className="p-4 rounded-2xl bg-[#E8EFE5]/40 border border-[#CAD7C5]/60 space-y-2">
                <span className="text-xs font-bold text-rose-dark">📷 Instagram</span>
                <input
                  type="text"
                  value={data.socials.instagram}
                  onChange={(e) => setData({
                    ...data,
                    socials: { ...data.socials, instagram: e.target.value }
                  })}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-[#CAD7C5] text-xs text-forest font-mono"
                />
              </div>

              <div className="p-4 rounded-2xl bg-[#E8EFE5]/40 border border-[#CAD7C5]/60 space-y-2">
                <span className="text-xs font-bold text-forest">🎵 TikTok</span>
                <input
                  type="text"
                  value={data.socials.tiktok}
                  onChange={(e) => setData({
                    ...data,
                    socials: { ...data.socials, tiktok: e.target.value }
                  })}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-[#CAD7C5] text-xs text-forest font-mono"
                />
              </div>

              <div className="p-4 rounded-2xl bg-[#E8EFE5]/40 border border-[#CAD7C5]/60 space-y-2">
                <span className="text-xs font-bold text-red-700">▶ YouTube Channel</span>
                <input
                  type="text"
                  value={data.socials.youtube}
                  onChange={(e) => setData({
                    ...data,
                    socials: { ...data.socials, youtube: e.target.value }
                  })}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-[#CAD7C5] text-xs text-forest font-mono"
                />
              </div>

              <div className="p-4 rounded-2xl bg-[#E8EFE5]/40 border border-[#CAD7C5]/60 space-y-2">
                <span className="text-xs font-bold text-forest">✍️ Medium</span>
                <input
                  type="text"
                  value={data.socials.medium}
                  onChange={(e) => setData({
                    ...data,
                    socials: { ...data.socials, medium: e.target.value }
                  })}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-[#CAD7C5] text-xs text-forest font-mono"
                />
              </div>

              <div className="p-4 rounded-2xl bg-[#E8EFE5]/40 border border-[#CAD7C5]/60 space-y-2">
                <span className="text-xs font-bold text-forest">✉️ Email</span>
                <input
                  type="email"
                  value={data.socials.email}
                  onChange={(e) => setData({
                    ...data,
                    socials: { ...data.socials, email: e.target.value }
                  })}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-[#CAD7C5] text-xs text-forest font-mono"
                />
              </div>

              <div className="p-4 rounded-2xl bg-[#E8EFE5]/40 border border-[#CAD7C5]/60 space-y-2">
                <span className="text-xs font-bold text-emerald-800">💬 WhatsApp Langsung</span>
                <input
                  type="text"
                  value={data.socials.whatsapp}
                  onChange={(e) => setData({
                    ...data,
                    socials: { ...data.socials, whatsapp: e.target.value }
                  })}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-[#CAD7C5] text-xs text-forest font-mono"
                />
              </div>

              <div className="col-span-1 md:col-span-2 p-4 rounded-2xl bg-[#E8EFE5]/40 border border-[#CAD7C5]/60 space-y-2">
                <span className="text-xs font-bold text-blue-800">💼 LinkedIn</span>
                <input
                  type="text"
                  value={data.socials.linkedin}
                  onChange={(e) => setData({
                    ...data,
                    socials: { ...data.socials, linkedin: e.target.value }
                  })}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-[#CAD7C5] text-xs text-forest font-mono"
                />
              </div>
            </div>

            <div className="pt-4 flex justify-end">
              <button
                onClick={handleSave}
                className="px-6 py-2.5 rounded-full bg-forest text-white text-xs font-bold hover:bg-rose-dark transition-colors shadow-sm cursor-pointer"
              >
                Simpan Perubahan Sosial Media 💾
              </button>
            </div>
          </div>
        )}

        {/* ================================================================= */}
        {/* TAB 6: PANDUAN CARA GANTI FOTO (MENGGUNAKAN FOTO SENDIRI)          */}
        {/* ================================================================= */}
        {activeTab === 'photoguide' && (
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#CAD7C5] shadow-xs space-y-6">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-100 text-amber-900 font-bold text-xs">
              <span>📸 Tips Praktis Pengelolaan Foto</span>
            </div>
            <h2 className="font-serif text-2xl font-bold text-forest">
              Bagaimana Cara Mengganti Foto dengan Foto Sendiri?
            </h2>
            <p className="text-xs text-forest/70 leading-relaxed max-w-2xl">
              Di sistem portofolio ini, kamu punya <strong>2 cara super mudah</strong> untuk menampilkan foto aslimu (foto wisuda, foto dokumentasi lomba, foto produk, sertifikat, dll):
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Cara 1: Menggunakan Folder Public */}
              <div className="p-6 rounded-2xl bg-[#E8EFE5]/50 border border-[#CAD7C5] space-y-3">
                <div className="flex items-center gap-2">
                  <span className="w-7 h-7 rounded-full bg-forest text-white flex items-center justify-center font-bold text-xs">1</span>
                  <h4 className="font-bold text-sm text-forest">Cara 1: Simpan di Folder <code>public/</code> (Rekomendasi)</h4>
                </div>
                <p className="text-xs text-forest/80 leading-relaxed">
                  Kamu tinggal copy & paste foto barumu dari komputermu ke dalam folder:
                  <br />
                  <code className="inline-block mt-1 p-1 bg-white rounded border border-[#CAD7C5] font-mono text-[11px] text-forest">
                    c:\Kerja\chikal-portfolio\public\
                  </code>
                </p>
                <div className="text-xs text-forest/75 space-y-1 bg-white p-3 rounded-xl border border-[#CAD7C5]/60">
                  <p className="font-bold text-rose-dark">Contoh langkah:</p>
                  <p>1. Beri nama file fotomu, misal: <code>foto-wisuda.jpg</code></p>
                  <p>2. Taruh di dalam folder <code>public/</code></p>
                  <p>3. Di halaman Admin Studio ini, di kolom foto cukup ketik:</p>
                  <p className="font-mono font-bold text-forest">/foto-wisuda.jpg</p>
                  <p>4. Fotonya akan langsung muncul di Live Preview dan di websitemu!</p>
                </div>
              </div>

              {/* Cara 2: Menggunakan Link URL Gambar Online */}
              <div className="p-6 rounded-2xl bg-[#E8EFE5]/50 border border-[#CAD7C5] space-y-3">
                <div className="flex items-center gap-2">
                  <span className="w-7 h-7 rounded-full bg-rose-dark text-white flex items-center justify-center font-bold text-xs">2</span>
                  <h4 className="font-bold text-sm text-forest">Cara 2: Menggunakan Link Gambar Online (URL)</h4>
                </div>
                <p className="text-xs text-forest/80 leading-relaxed">
                  Jika foto sudah pernah kamu upload ke internet (misal di Google Drive publik, Imgur, Cloudinary, atau Supabase Storage):
                </p>
                <div className="text-xs text-forest/75 space-y-1 bg-white p-3 rounded-xl border border-[#CAD7C5]/60">
                  <p className="font-bold text-rose-dark">Contoh langkah:</p>
                  <p>1. Copy link URL langsung gambarnya, contoh:</p>
                  <p className="font-mono text-[10px] break-all text-forest">https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=900</p>
                  <p>2. Tempelkan link tersebut ke kolom foto di halaman Admin Studio.</p>
                  <p>3. Klik Simpan Data, selesai!</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ================================================================= */}
        {/* TAB 7: SUPABASE + VERCEL (ARSITEKTUR HILMAN JTI)                  */}
        {/* ================================================================= */}
        {activeTab === 'supabase' && (
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#CAD7C5] shadow-xs space-y-6">
            <div className="flex items-start justify-between gap-4">
              <div>
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-100 text-emerald-900 font-bold text-xs mb-2">
                  <span>💡 Rekomendasi Hilman JTI Polinema</span>
                </div>
                <h2 className="font-serif text-2xl font-bold text-forest">
                  Arsitektur Vercel + Supabase Cloud Database
                </h2>
                <p className="text-xs text-forest/70 mt-1 max-w-2xl leading-relaxed">
                  Frontend dihosting di Vercel (sangat cepat & gratis), sedangkan data tersimpan di Supabase (PostgreSQL gratis).
                </p>
              </div>

              <span className="text-4xl hidden sm:block">⚡</span>
            </div>

            <div className="p-5 rounded-2xl bg-emerald-50 border border-emerald-300">
              <div className="flex items-center gap-2 text-emerald-900 font-bold text-xs mb-1">
                <span>🟢</span>
                <span>Status Saat Ini: Siap Pakai & Auto-Local Persistence</span>
              </div>
              <p className="text-xs text-emerald-950 leading-relaxed">
                Studio Admin ini <strong>sudah berfungsi penuh 100%</strong> menggunakan penyimpanan lokal browser (`localStorage`). Setiap kamu mengubah teks profil, foto, atau tautan di sini dan klik Simpan, websitemu langsung berubah seketika!
              </p>
            </div>

            <div className="space-y-4 pt-2">
              <h3 className="font-serif text-base font-bold text-forest">
                Cara Menghubungkan ke Supabase (Saat Mau Deploy ke Vercel):
              </h3>

              <div className="space-y-3 text-xs text-forest/80 font-source">
                <div className="p-4 rounded-xl bg-[#E8EFE5]/40 border border-[#CAD7C5]/70">
                  <p className="font-bold text-forest mb-1">Langkah 1: Buat Proyek di Supabase</p>
                  <p>Buka <a href="https://supabase.com" target="_blank" rel="noopener noreferrer" className="text-rose-dark underline font-bold">supabase.com</a>, daftar gratis, lalu klik <em>New Project</em>.</p>
                </div>

                <div className="p-4 rounded-xl bg-[#E8EFE5]/40 border border-[#CAD7C5]/70">
                  <p className="font-bold text-forest mb-1">Langkah 2: Jalankan SQL Table di Supabase SQL Editor</p>
                  <pre className="p-3 bg-black/85 text-emerald-400 font-mono text-[11px] rounded-lg overflow-x-auto select-all">
{`-- Buat tabel penyimpanan konten portofolio Chikal
create table if not exists portfolio_content (
  id text primary key default 'main',
  content jsonb not null,
  updated_at timestamp with time zone default timezone('utc'::text, now())
);`}
                  </pre>
                </div>

                <div className="p-4 rounded-xl bg-[#E8EFE5]/40 border border-[#CAD7C5]/70">
                  <p className="font-bold text-forest mb-1">Langkah 3: Pasang Environment Variables di Vercel</p>
                  <div className="mt-2 font-mono text-[11px] bg-white p-2.5 rounded-lg border border-[#CAD7C5] space-y-1">
                    <p className="text-forest"><code>NEXT_PUBLIC_SUPABASE_URL</code> = https://your-project.supabase.co</p>
                    <p className="text-forest"><code>NEXT_PUBLIC_SUPABASE_ANON_KEY</code> = your-anon-key</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="pt-6 border-t border-[#CAD7C5]/60 flex items-center justify-between">
              <span className="text-xs text-forest/60 italic">
                Ingin membatalkan semua editan dan kembali ke data asli?
              </span>
              <button
                onClick={handleReset}
                className="px-4 py-2 rounded-full text-xs font-bold text-rose-dark hover:bg-rose-blush/60 border border-rose-dusty/40 transition-colors cursor-pointer"
              >
                Reset ke Data Default Pabrik
              </button>
            </div>
          </div>
        )}

      </main>
    </div>
  );
}
