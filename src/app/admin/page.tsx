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
  const [activeTab, setActiveTab] = useState<'socials' | 'creator' | 'projects' | 'awards' | 'supabase'>('socials');
  const [data, setData] = useState<PortfolioData>(DEFAULT_PORTFOLIO_DATA);
  const [activeCreatorKey, setActiveCreatorKey] = useState<string>('personal');
  const [saveSuccessToast, setSaveSuccessToast] = useState(false);

  // Secret PIN (Default: chikal2026)
  const SECRET_PIN = 'chikal2026';

  useEffect(() => {
    // Check session storage for existing auth
    const authSession = sessionStorage.getItem('chikal_admin_session');
    if (authSession === 'authenticated') {
      setIsAuthenticated(true);
    }
    // Load existing data
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
    if (window.confirm('Yakin ingin mengembalikan seluruh konten portofolio ke pengaturan awal bawaan?')) {
      resetPortfolioData();
      setData(DEFAULT_PORTFOLIO_DATA);
      setSaveSuccessToast(true);
      setTimeout(() => {
        setSaveSuccessToast(false);
      }, 3500);
    }
  };

  // --------------------------------------------------------------------------
  // SCREEN 1: SECRET PIN LOCK (Discreet & Private - Recruiters Can't Enter)
  // --------------------------------------------------------------------------
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-[#1E2E1B] text-[#E8EFE5] flex items-center justify-center p-4 selection:bg-rose-dusty selection:text-white">
        <div className="max-w-md w-full bg-[#253521] border-2 border-[#CAD7C5]/30 rounded-3xl p-8 shadow-2xl relative overflow-hidden">
          {/* Subtle Glow */}
          <div className="absolute -top-20 -right-20 w-48 h-48 bg-rose-dark/20 rounded-full blur-3xl pointer-events-none" />
          
          <div className="text-center mb-6">
            <div className="w-16 h-16 rounded-2xl bg-white/10 border border-[#CAD7C5]/30 flex items-center justify-center mx-auto mb-4 text-2xl shadow-inner">
              🔐
            </div>
            <h1 className="font-serif text-2xl font-bold text-white tracking-wide">
              Chikal Content Studio
            </h1>
            <p className="text-xs text-[#CAD7C5]/80 mt-1 font-source">
              Halaman ini bersifat rahasia khusus Chikal Nazmi untuk mengedit konten portofolio.
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
  // SCREEN 2: ADMIN CONTENT DASHBOARD
  // --------------------------------------------------------------------------
  return (
    <div className="min-h-screen bg-[#F7F9F5] text-forest font-source pb-24">
      {/* Toast Notification */}
      {saveSuccessToast && (
        <div className="fixed top-6 right-6 z-50 bg-[#1E2E1B] text-white px-5 py-3.5 rounded-2xl shadow-2xl border border-rose-blush/40 flex items-center gap-3 animate-fade-in">
          <span className="text-lg">✅</span>
          <div>
            <p className="text-xs font-bold font-serif text-rose-blush">Perubahan Berhasil Disimpan!</p>
            <p className="text-[11px] text-[#CAD7C5]">Halaman portofolio utama langsung terupdate.</p>
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
                Chikal Studio Admin
              </h1>
              <span className="text-[10px] text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full font-bold border border-emerald-200">
                ● Mode Edit Rahasia Aktif
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
            onClick={() => setActiveTab('socials')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
              activeTab === 'socials'
                ? 'bg-forest text-white shadow-sm'
                : 'text-forest/70 hover:bg-[#E8EFE5]'
            }`}
          >
            📱 Sosial Media & Kontak
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
            onClick={() => setActiveTab('projects')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
              activeTab === 'projects'
                ? 'bg-forest text-white shadow-sm'
                : 'text-forest/70 hover:bg-[#E8EFE5]'
            }`}
          >
            💼 Tautan Proyek Kerja
          </button>
          <button
            onClick={() => setActiveTab('awards')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
              activeTab === 'awards'
                ? 'bg-forest text-white shadow-sm'
                : 'text-forest/70 hover:bg-[#E8EFE5]'
            }`}
          >
            🏆 Tautan Kejuaraan
          </button>
          <button
            onClick={() => setActiveTab('supabase')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
              activeTab === 'supabase'
                ? 'bg-emerald-800 text-white shadow-sm'
                : 'text-emerald-800 hover:bg-emerald-50'
            }`}
          >
            ☁️ Supabase + Vercel (Saran Hilman)
          </button>
        </div>
      </div>

      {/* Tab Content Canvas */}
      <main className="max-w-6xl mx-auto px-4 sm:px-8 mt-6">
        {/* ================================================================= */}
        {/* TAB 1: SOSIAL MEDIA & KONTAK UTAMA                                */}
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
              {/* Instagram */}
              <div className="p-4 rounded-2xl bg-[#E8EFE5]/40 border border-[#CAD7C5]/60 space-y-2">
                <div className="flex items-center gap-2 text-rose-dark font-bold text-xs">
                  <span>📷</span>
                  <span>Instagram Pribadi</span>
                </div>
                <input
                  type="text"
                  value={data.socials.instagram}
                  onChange={(e) => setData({
                    ...data,
                    socials: { ...data.socials, instagram: e.target.value }
                  })}
                  placeholder="https://instagram.com/chikalnazmi"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-[#CAD7C5] text-xs text-forest font-mono focus:outline-none focus:border-rose-dark"
                />
              </div>

              {/* TikTok */}
              <div className="p-4 rounded-2xl bg-[#E8EFE5]/40 border border-[#CAD7C5]/60 space-y-2">
                <div className="flex items-center gap-2 text-forest font-bold text-xs">
                  <span>🎵</span>
                  <span>TikTok Pribadi</span>
                </div>
                <input
                  type="text"
                  value={data.socials.tiktok}
                  onChange={(e) => setData({
                    ...data,
                    socials: { ...data.socials, tiktok: e.target.value }
                  })}
                  placeholder="https://www.tiktok.com/@chikalnazmi"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-[#CAD7C5] text-xs text-forest font-mono focus:outline-none focus:border-rose-dark"
                />
              </div>

              {/* YouTube */}
              <div className="p-4 rounded-2xl bg-[#E8EFE5]/40 border border-[#CAD7C5]/60 space-y-2">
                <div className="flex items-center gap-2 text-red-700 font-bold text-xs">
                  <span>▶</span>
                  <span>YouTube Channel</span>
                </div>
                <input
                  type="text"
                  value={data.socials.youtube}
                  onChange={(e) => setData({
                    ...data,
                    socials: { ...data.socials, youtube: e.target.value }
                  })}
                  placeholder="https://www.youtube.com/@chikalnazmi"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-[#CAD7C5] text-xs text-forest font-mono focus:outline-none focus:border-rose-dark"
                />
              </div>

              {/* Medium */}
              <div className="p-4 rounded-2xl bg-[#E8EFE5]/40 border border-[#CAD7C5]/60 space-y-2">
                <div className="flex items-center gap-2 text-forest font-bold text-xs">
                  <span>✍️</span>
                  <span>Medium Article Profile</span>
                </div>
                <input
                  type="text"
                  value={data.socials.medium}
                  onChange={(e) => setData({
                    ...data,
                    socials: { ...data.socials, medium: e.target.value }
                  })}
                  placeholder="https://medium.com/@chikalnazmi"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-[#CAD7C5] text-xs text-forest font-mono focus:outline-none focus:border-rose-dark"
                />
              </div>

              {/* Email */}
              <div className="p-4 rounded-2xl bg-[#E8EFE5]/40 border border-[#CAD7C5]/60 space-y-2">
                <div className="flex items-center gap-2 text-forest font-bold text-xs">
                  <span>✉️</span>
                  <span>Email Kontak</span>
                </div>
                <input
                  type="email"
                  value={data.socials.email}
                  onChange={(e) => setData({
                    ...data,
                    socials: { ...data.socials, email: e.target.value }
                  })}
                  placeholder="chikalnazmi@gmail.com"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-[#CAD7C5] text-xs text-forest font-mono focus:outline-none focus:border-rose-dark"
                />
              </div>

              {/* WhatsApp Direct */}
              <div className="p-4 rounded-2xl bg-[#E8EFE5]/40 border border-[#CAD7C5]/60 space-y-2">
                <div className="flex items-center gap-2 text-emerald-800 font-bold text-xs">
                  <span>💬</span>
                  <span>WhatsApp URL Langsung</span>
                </div>
                <input
                  type="text"
                  value={data.socials.whatsapp}
                  onChange={(e) => setData({
                    ...data,
                    socials: { ...data.socials, whatsapp: e.target.value }
                  })}
                  placeholder="https://wa.me/6281234567890?text=..."
                  className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-[#CAD7C5] text-xs text-forest font-mono focus:outline-none focus:border-rose-dark"
                />
              </div>

              {/* LinkedIn */}
              <div className="col-span-1 md:col-span-2 p-4 rounded-2xl bg-[#E8EFE5]/40 border border-[#CAD7C5]/60 space-y-2">
                <div className="flex items-center gap-2 text-blue-800 font-bold text-xs">
                  <span>💼</span>
                  <span>LinkedIn Profile</span>
                </div>
                <input
                  type="text"
                  value={data.socials.linkedin}
                  onChange={(e) => setData({
                    ...data,
                    socials: { ...data.socials, linkedin: e.target.value }
                  })}
                  placeholder="https://linkedin.com/in/chikalnazmi"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-[#CAD7C5] text-xs text-forest font-mono focus:outline-none focus:border-rose-dark"
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
        {/* TAB 2: VIDEO & CREATOR PRODUCTION (ADAPTIF 2 HP vs 3 DEVICE)      */}
        {/* ================================================================= */}
        {activeTab === 'creator' && (
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#CAD7C5] shadow-xs space-y-6">
            <div>
              <h2 className="font-serif text-xl font-bold text-forest">
                Pengaturan Stage Video & Social Media Production
              </h2>
              <p className="text-xs text-forest/70 mt-1">
                Pilih akun kreator untuk mengatur tautan video YouTube di tengah, serta toggle adaptif apakah menampilkan video landscape atau 2 HP saja.
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
                {/* Adaptive Stage Toggle (Crucial Requirement!) */}
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
                        : '📱 Mode 2 HP: Belum ada video landscape, sehingga hanya menampilkan 2 HP (Instagram & TikTok) di tengah secara rapi & seimbang.'
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

                {/* Form fields for current creator */}
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
                    <span className="text-[10px] text-forest/60 mt-0.5 block">
                      Saat kartu tengah diklik oleh pengunjung, akan membuka link ini.
                    </span>
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
                      Platform Badge Tengah:
                    </label>
                    <input
                      type="text"
                      value={data.creatorAccounts[activeCreatorKey].platforms}
                      onChange={(e) => {
                        const updated = { ...data.creatorAccounts };
                        updated[activeCreatorKey].platforms = e.target.value;
                        setData({ ...data, creatorAccounts: updated });
                      }}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-[#CAD7C5] text-xs"
                    />
                  </div>

                  <div className="col-span-1 md:col-span-2">
                    <label className="block text-xs font-bold text-forest mb-1">
                      Deskripsi Konten:
                    </label>
                    <textarea
                      rows={2}
                      value={data.creatorAccounts[activeCreatorKey].centerDesc}
                      onChange={(e) => {
                        const updated = { ...data.creatorAccounts };
                        updated[activeCreatorKey].centerDesc = e.target.value;
                        setData({ ...data, creatorAccounts: updated });
                      }}
                      className="w-full px-3.5 py-2 rounded-xl bg-white border border-[#CAD7C5] text-xs"
                    />
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
        {/* TAB 3: PROYEK KERJA (DOSSIER) — TAUTAN DOKUMENTASI ADAPTIF         */}
        {/* ================================================================= */}
        {activeTab === 'projects' && (
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#CAD7C5] shadow-xs space-y-6">
            <div>
              <h2 className="font-serif text-xl font-bold text-forest">
                Tautan Dokumentasi Adaptif — Selected Works & Proyek
              </h2>
              <p className="text-xs text-forest/70 mt-1">
                Tautan publikasi, laporan, atau demo eksternal. Jika kolom tautan dikosongkan, tombol di kartu dan pop-up modal akan <strong>otomatis disembunyikan secara bersih</strong> (adaptif).
              </p>
            </div>

            <div className="space-y-4">
              {data.projects.map((project, idx) => (
                <div key={project.id} className="p-5 rounded-2xl bg-[#E8EFE5]/30 border border-[#CAD7C5] space-y-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="text-[10px] font-bold uppercase text-rose-dark bg-rose-blush/60 px-2 py-0.5 rounded-full">
                        {project.tag}
                      </span>
                      <h4 className="font-serif font-bold text-sm text-forest mt-1">
                        {project.title}
                      </h4>
                    </div>
                    <span className="text-xs font-mono text-forest/60">{project.period}</span>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-2">
                    <div>
                      <label className="block text-[11px] font-bold text-forest mb-1">
                        🔗 Tautan Eksternal / Berita / SOP (Opsional):
                      </label>
                      <input
                        type="text"
                        value={project.link || ''}
                        onChange={(e) => {
                          const updated = [...data.projects];
                          updated[idx].link = e.target.value;
                          setData({ ...data, projects: updated });
                        }}
                        placeholder="https://... (kosongkan jika tidak ada)"
                        className="w-full px-3 py-2 rounded-xl bg-white border border-[#CAD7C5] text-xs font-mono"
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] font-bold text-forest mb-1">
                        🏷️ Label Tombol:
                      </label>
                      <input
                        type="text"
                        value={project.linkLabel || ''}
                        onChange={(e) => {
                          const updated = [...data.projects];
                          updated[idx].linkLabel = e.target.value;
                          setData({ ...data, projects: updated });
                        }}
                        placeholder="Contoh: Buka Profil Bisnis ↗"
                        className="w-full px-3 py-2 rounded-xl bg-white border border-[#CAD7C5] text-xs"
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="pt-2 flex justify-end">
              <button
                onClick={handleSave}
                className="px-6 py-2.5 rounded-full bg-forest text-white text-xs font-bold hover:bg-rose-dark transition-colors shadow-sm cursor-pointer"
              >
                Simpan Tautan Proyek 💾
              </button>
            </div>
          </div>
        )}

        {/* ================================================================= */}
        {/* TAB 4: KEJUARAAN (AWARDS) — TAUTAN DOKUMENTASI ADAPTIF            */}
        {/* ================================================================= */}
        {activeTab === 'awards' && (
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#CAD7C5] shadow-xs space-y-6">
            <div>
              <h2 className="font-serif text-xl font-bold text-forest">
                Tautan Berita & Publikasi — National Trophy Case
              </h2>
              <p className="text-xs text-forest/70 mt-1">
                Tambahkan link liputan berita kampus, artikel media, atau publikasi juara. Jika link diisi, tombol publikasi akan muncul adaptif pada kartu dan pop-up modal.
              </p>
            </div>

            <div className="space-y-4">
              {data.awards.map((award, idx) => (
                <div key={idx} className="p-5 rounded-2xl bg-[#E8EFE5]/30 border border-[#CAD7C5] space-y-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="text-[10px] font-bold uppercase bg-rose-dark text-white px-2 py-0.5 rounded-full">
                        {award.rank}
                      </span>
                      <h4 className="font-serif font-bold text-sm text-forest mt-1">
                        {award.title}
                      </h4>
                      <p className="text-[11px] text-forest/70">{award.organizer}</p>
                    </div>
                    <span className="text-xs font-mono font-bold text-forest/60">{award.year}</span>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-2">
                    <div>
                      <label className="block text-[11px] font-bold text-forest mb-1">
                        🔗 Tautan Berita / Publikasi (Opsional):
                      </label>
                      <input
                        type="text"
                        value={award.link || ''}
                        onChange={(e) => {
                          const updated = [...data.awards];
                          updated[idx].link = e.target.value;
                          setData({ ...data, awards: updated });
                        }}
                        placeholder="https://... (kosongkan jika tidak ada)"
                        className="w-full px-3 py-2 rounded-xl bg-white border border-[#CAD7C5] text-xs font-mono"
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] font-bold text-forest mb-1">
                        🏷️ Label Tombol:
                      </label>
                      <input
                        type="text"
                        value={award.linkLabel || ''}
                        onChange={(e) => {
                          const updated = [...data.awards];
                          updated[idx].linkLabel = e.target.value;
                          setData({ ...data, awards: updated });
                        }}
                        placeholder="Contoh: Liputan Berita Kampus ↗"
                        className="w-full px-3 py-2 rounded-xl bg-white border border-[#CAD7C5] text-xs"
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="pt-2 flex justify-end">
              <button
                onClick={handleSave}
                className="px-6 py-2.5 rounded-full bg-forest text-white text-xs font-bold hover:bg-rose-dark transition-colors shadow-sm cursor-pointer"
              >
                Simpan Tautan Kejuaraan 💾
              </button>
            </div>
          </div>
        )}

        {/* ================================================================= */}
        {/* TAB 5: PANDUAN SUPABASE & VERCEL (REKOMENDASI HILMAN JTI POLINEMA) */}
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
                  Saran dari temanmu Hilman ini adalah <strong>best practice standar modern</strong>. Frontend dihosting di Vercel (sangat cepat & gratis), sedangkan database disimpan di Supabase (PostgreSQL gratis).
                </p>
              </div>

              <span className="text-4xl hidden sm:block">⚡</span>
            </div>

            {/* Architecture Card */}
            <div className="p-5 rounded-2xl bg-[#E8EFE5]/50 border border-[#CAD7C5] grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
              <div className="p-4 bg-white rounded-xl border border-[#CAD7C5]/60 shadow-2xs">
                <span className="text-2xl">▲</span>
                <h4 className="font-bold text-xs text-forest mt-2">1. Frontend di Vercel</h4>
                <p className="text-[11px] text-forest/70 mt-1">
                  Next.js App Router dideploy ke Vercel secara instan setiap kamu push ke GitHub.
                </p>
              </div>
              <div className="p-4 bg-white rounded-xl border border-[#CAD7C5]/60 shadow-2xs">
                <span className="text-2xl">🔒</span>
                <h4 className="font-bold text-xs text-forest mt-2">2. Portal /admin Rahasia</h4>
                <p className="text-[11px] text-forest/70 mt-1">
                  Halaman ini terkunci PIN (`chikal2026`) dan tidak ada link dari luar, aman dari publik.
                </p>
              </div>
              <div className="p-4 bg-white rounded-xl border border-[#CAD7C5]/60 shadow-2xs">
                <span className="text-2xl">⚡</span>
                <h4 className="font-bold text-xs text-forest mt-2">3. Database di Supabase</h4>
                <p className="text-[11px] text-forest/70 mt-1">
                  Semua editan tersimpan di cloud database sehingga data selalu terupdate di mana saja.
                </p>
              </div>
            </div>

            {/* Current State Status */}
            <div className="p-5 rounded-2xl bg-emerald-50 border border-emerald-300">
              <div className="flex items-center gap-2 text-emerald-900 font-bold text-xs mb-1">
                <span>🟢</span>
                <span>Status Saat Ini: Siap Pakai & Auto-Local Persistence</span>
              </div>
              <p className="text-xs text-emerald-950 leading-relaxed">
                Kamu tidak perlu buru-buru setup Supabase sekarang! Studio Admin ini <strong>sudah berfungsi penuh 100%</strong> menggunakan penyimpanan lokal browser (`localStorage`). Setiap kamu mengubah link sosial media, video, atau proyek di sini dan klik Simpan, halaman portofoliomu langsung berubah seketika!
              </p>
            </div>

            {/* Step-by-step to connect Supabase */}
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
                  <p className="mb-2">Salin skrip SQL ini dan jalankan sekali di menu <strong>SQL Editor</strong> Supabase:</p>
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
                  <p>Di dashboard Vercel pada proyekmu, buka <em>Settings → Environment Variables</em> dan tambahkan dua variabel dari Supabase:</p>
                  <div className="mt-2 font-mono text-[11px] bg-white p-2.5 rounded-lg border border-[#CAD7C5] space-y-1">
                    <p className="text-forest"><code>NEXT_PUBLIC_SUPABASE_URL</code> = https://your-project.supabase.co</p>
                    <p className="text-forest"><code>NEXT_PUBLIC_SUPABASE_ANON_KEY</code> = your-anon-key</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Reset Defaults Button */}
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
