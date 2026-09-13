'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { 
  getPortfolioData, 
  savePortfolioData, 
  resetPortfolioData, 
  fetchPortfolioDataFromSupabase,
  DEFAULT_PORTFOLIO_DATA,
  PortfolioData,
  ProjectDoc,
  AwardItem,
  OrganizationItem,
  SkillCategory 
} from '@/lib/portfolio-store';
import { isSupabaseConfigured } from '@/lib/supabase';
import ImageUploadField from '@/components/ImageUploadField';
import MultiImageGalleryField from '@/components/MultiImageGalleryField';

export default function AdminPortal() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [pinInput, setPinInput] = useState('');
  const [pinError, setPinError] = useState(false);
  const [activeTab, setActiveTab] = useState<'hero' | 'education' | 'experience' | 'projects' | 'awards' | 'organizations' | 'skills' | 'creator' | 'socials' | 'photoguide' | 'supabase'>('hero');
  const [data, setData] = useState<PortfolioData>(DEFAULT_PORTFOLIO_DATA);
  const [activeCreatorKey, setActiveCreatorKey] = useState<string>('personal');
  const [activeExperienceIdx, setActiveExperienceIdx] = useState<number>(0);
  const [activeProjectIdx, setActiveProjectIdx] = useState<number>(0);
  const [activeAwardIdx, setActiveAwardIdx] = useState<number>(0);
  const [activeOrgIdx, setActiveOrgIdx] = useState<number>(0);
  const [newOrgHighlightInput, setNewOrgHighlightInput] = useState<string>('');
  const [activeSkillIdx, setActiveSkillIdx] = useState<number>(0);
  const [activeCertIdx, setActiveCertIdx] = useState<number>(0);
  const [newSkillInput, setNewSkillInput] = useState<string>('');
  const [isSaving, setIsSaving] = useState(false);
  const [toastNotification, setToastNotification] = useState<{ type: 'success' | 'error'; message: string; detail?: string } | null>(null);

  // Secret PIN (Default: chikal2026)
  const SECRET_PIN = 'chikal2026';

  const [isCloudConnected, setIsCloudConnected] = useState<boolean>(isSupabaseConfigured);

  useEffect(() => {
    const authSession = sessionStorage.getItem('chikal_admin_session');
    if (authSession === 'authenticated') {
      setIsAuthenticated(true);
    }
    setData(getPortfolioData());
    fetchPortfolioDataFromSupabase().then((remoteData) => {
      if (remoteData) {
        setData(remoteData);
      }
    });

    // Check live server-side Supabase connectivity
    fetch('/api/portfolio')
      .then((res) => res.json())
      .then((resJson) => {
        if (resJson && resJson.isSupabaseConnected) {
          setIsCloudConnected(true);
        }
      })
      .catch(() => {});
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

  const handleSave = async () => {
    setIsSaving(true);
    try {
      const res = await savePortfolioData(data);
      if (res.data) {
        setData(res.data);
      }
      if (res.success) {
        setToastNotification({
          type: 'success',
          message: 'Perubahan Berhasil Disimpan!',
          detail: 'Teks, foto, dan pengaturan portofolio telah tersinkronisasi ke Cloud Database Supabase.',
        });
      } else {
        setToastNotification({
          type: 'error',
          message: 'Tersimpan di Browser Lokal',
          detail: res.error || 'Gagal sinkron ke Cloud Supabase, namun tersimpan aman di browser laptop Anda.',
        });
      }
    } catch (err: any) {
      setToastNotification({
        type: 'error',
        message: 'Gagal Menyimpan',
        detail: err?.message || 'Terjadi kesalahan sistem saat menyimpan data.',
      });
    } finally {
      setIsSaving(false);
      setTimeout(() => {
        setToastNotification(null);
      }, 4500);
    }
  };

  const handleReset = async () => {
    if (window.confirm('Yakin ingin mengembalikan seluruh konten teks, foto, dan tautan portofolio ke pengaturan bawaan?')) {
      setIsSaving(true);
      await resetPortfolioData();
      setData(DEFAULT_PORTFOLIO_DATA);
      setIsSaving(false);
      setToastNotification({
        type: 'success',
        message: 'Konten Direset ke Default Pabrik!',
        detail: 'Seluruh teks dan foto telah dikembalikan ke kondisi awal.',
      });
      setTimeout(() => {
        setToastNotification(null);
      }, 4000);
    }
  };

  // --------------------------------------------------------------------------
  // SCREEN 1: SECRET PIN LOCK (Discreet & Private - Public Can't Enter)
  // --------------------------------------------------------------------------
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-[#1E2E1B] text-[F4F7F2] flex items-center justify-center p-4 selection:bg-rose-dusty selection:text-white">
        <div className="max-w-md w-full bg-[#1F191B] border-2 border-[#CAD7C5]/30 rounded-3xl p-8 shadow-2xl relative overflow-hidden">
          <div className="absolute -top-20 -right-20 w-48 h-48 bg-rose-dark/20 rounded-full blur-3xl pointer-events-none" />
          
          <div className="text-center mb-6">
            <div className="w-16 h-16 rounded-2xl bg-white/10 border border-[#CAD7C5]/30 flex items-center justify-center mx-auto mb-4 text-2xl shadow-inner">
              ✦
            </div>
            <h1 className="font-serif text-2xl font-bold text-white tracking-wide">
              Chikal Content Studio
            </h1>
            <p className="text-xs text-sage-200/80 mt-1 font-source">
              Pusat pengelolaan teks, foto dokumentasi, dan tautan portofolio Chikal Nazmi.
            </p>
          </div>

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-xs font-mono text-sage-200 mb-1.5 uppercase tracking-wider">
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
                  PIN salah. Hubungi pemilik untuk akses.
                </p>
              )}
            </div>

            <button
              type="submit"
              className="w-full py-3 rounded-xl bg-forest hover:bg-forest-dark text-white font-bold text-sm tracking-wide transition-all shadow-md active:scale-98 cursor-pointer"
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
    <div className="min-h-screen bg-[#F7F9F5] text-forest font-sans antialiased pb-24">
      {/* Toast Notification */}
      {toastNotification && (
        <div className={`fixed top-6 right-6 z-50 text-white px-5 py-3.5 rounded-2xl shadow-2xl border flex items-center gap-3 animate-fade-in ${
          toastNotification.type === 'success'
            ? 'bg-[#1E2E1B] border-rose-blush/40'
            : 'bg-rose-950 border-rose-500/50'
        }`}>
          <span className="text-xl">
            {toastNotification.type === 'success' ? '✦' : '!'}
          </span>
          <div>
            <p className="text-xs font-bold font-serif text-rose-blush">
              {toastNotification.message}
            </p>
            {toastNotification.detail && (
              <p className="text-[11px] text-sage-200 max-w-sm">
                {toastNotification.detail}
              </p>
            )}
          </div>
        </div>
      )}

      {/* Top Bar */}
      <header className="sticky top-0 z-40 bg-white/90 backdrop-blur-md border-b border-[#CAD7C5]/80 px-4 sm:px-8 py-3.5 shadow-xs">
        <div className="w-full max-w-[1560px] mx-auto flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-xl bg-forest text-[#E8EFE5] flex items-center justify-center font-serif font-bold text-sm">
              C
            </div>
            <div>
              <h1 className="font-serif font-bold text-base text-neutral-900 leading-tight">
                Chikal Content Studio
              </h1>
              <div className="flex items-center gap-1.5 mt-0.5">
                <span className="text-[10px] text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full font-bold border border-emerald-200">
                  ● Studio Edit
                </span>
                {isCloudConnected || isSupabaseConfigured ? (
                  <span className="text-[10px] text-emerald-800 bg-emerald-100 px-2.5 py-0.5 rounded-full font-bold border border-emerald-300 flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                    Supabase Cloud Terhubung
                  </span>
                ) : (
                  <span className="text-[10px] text-amber-800 bg-amber-50 px-2 py-0.5 rounded-full font-bold border border-amber-200">
                    Mode Offline (LocalStorage)
                  </span>
                )}
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2 sm:gap-3">
            <Link
              href="/"
              target="_blank"
              className="px-3.5 py-1.5 rounded-full text-xs font-bold bg-sage-50 text-neutral-900 hover:bg-forest-dark hover:text-white transition-colors flex items-center gap-1 border border-[#CAD7C5]"
            >
              <span>Lihat Live</span>
              <span>↗</span>
            </Link>

            <button
              onClick={handleSave}
              disabled={isSaving}
              className="px-5 py-1.5 rounded-full text-xs font-bold bg-forest hover:bg-forest-dark text-white transition-all shadow-sm hover:shadow flex items-center gap-1.5 cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed"
            >
              <span>{isSaving ? 'Menyimpan...' : 'Simpan Data'}</span>
            </button>

            <button
              onClick={handleLogout}
              className="px-3 py-1.5 rounded-full text-xs font-medium text-neutral-500 hover:text-rose-900 hover:bg-rose-100 transition-colors"
              title="Kunci & Keluar"
            >
              Keluar
            </button>
          </div>
        </div>
      </header>

      {/* Navigation Tabs (Full Page Horizontal Strip) */}
      <div className="w-full max-w-[1560px] mx-auto px-4 sm:px-6 lg:px-8 mt-6">
        <div className="flex items-center gap-1.5 p-1.5 bg-white rounded-2xl border border-[#CAD7C5]/80 shadow-xs overflow-x-auto scrollbar-none whitespace-nowrap">
          <button
            onClick={() => setActiveTab('hero')}
            className={`px-4 sm:px-5 py-2.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap shrink-0 cursor-pointer ${
              activeTab === 'hero'
                ? 'bg-forest text-white shadow-sm'
                : 'text-forest/70 hover:text-forest hover:bg-sage-50'
            }`}
          >
            Profil & Hero
          </button>
          <button
            onClick={() => setActiveTab('education')}
            className={`px-4 sm:px-5 py-2.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap shrink-0 cursor-pointer ${
              activeTab === 'education'
                ? 'bg-forest text-white shadow-sm'
                : 'text-forest/70 hover:text-forest hover:bg-sage-50'
            }`}
          >
            Pendidikan
          </button>
          <button
            onClick={() => setActiveTab('experience')}
            className={`px-4 sm:px-5 py-2.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap shrink-0 cursor-pointer ${
              activeTab === 'experience'
                ? 'bg-forest text-white shadow-sm'
                : 'text-forest/70 hover:text-forest hover:bg-sage-50'
            }`}
          >
            Pengalaman
          </button>
          <button
            onClick={() => setActiveTab('projects')}
            className={`px-4 sm:px-5 py-2.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap shrink-0 cursor-pointer ${
              activeTab === 'projects'
                ? 'bg-forest text-white shadow-sm'
                : 'text-forest/70 hover:text-forest hover:bg-sage-50'
            }`}
          >
            Proyek Kampus
          </button>
          <button
            onClick={() => setActiveTab('awards')}
            className={`px-4 sm:px-5 py-2.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap shrink-0 cursor-pointer ${
              activeTab === 'awards'
                ? 'bg-forest text-white shadow-sm'
                : 'text-forest/70 hover:text-forest hover:bg-sage-50'
            }`}
          >
            Kejuaraan & Prestasi
          </button>
          <button
            onClick={() => setActiveTab('organizations')}
            className={`px-4 sm:px-5 py-2.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap shrink-0 cursor-pointer ${
              activeTab === 'organizations'
                ? 'bg-forest text-white shadow-sm'
                : 'text-forest/70 hover:text-forest hover:bg-sage-50'
            }`}
          >
            Organisasi & Kepemimpinan
          </button>
          <button
            onClick={() => setActiveTab('skills')}
            className={`px-4 sm:px-5 py-2.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap shrink-0 cursor-pointer ${
              activeTab === 'skills'
                ? 'bg-forest text-white shadow-sm'
                : 'text-forest/70 hover:text-forest hover:bg-sage-50'
            }`}
          >
            Keahlian (Skills)
          </button>
          <button
            onClick={() => setActiveTab('creator')}
            className={`px-4 sm:px-5 py-2.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap shrink-0 cursor-pointer ${
              activeTab === 'creator'
                ? 'bg-forest text-white shadow-sm'
                : 'text-forest/70 hover:text-forest hover:bg-sage-50'
            }`}
          >
            Creator Studio
          </button>
          <button
            onClick={() => setActiveTab('socials')}
            className={`px-4 sm:px-5 py-2.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap shrink-0 cursor-pointer ${
              activeTab === 'socials'
                ? 'bg-forest text-white shadow-sm'
                : 'text-forest/70 hover:text-forest hover:bg-sage-50'
            }`}
          >
            Media Sosial & Kontak
          </button>
          <button
            onClick={() => setActiveTab('photoguide')}
            className={`px-4 sm:px-5 py-2.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap shrink-0 cursor-pointer ${
              activeTab === 'photoguide'
                ? 'bg-forest text-white shadow-sm'
                : 'text-forest/70 hover:text-forest hover:bg-sage-50'
            }`}
          >
            Panduan Foto
          </button>
          <button
            onClick={() => setActiveTab('supabase')}
            className={`px-4 sm:px-5 py-2.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap shrink-0 cursor-pointer ${
              activeTab === 'supabase'
                ? 'bg-forest text-white shadow-sm'
                : 'text-forest/70 hover:text-forest hover:bg-sage-50'
            }`}
          >
            Database Cloud
          </button>
        </div>
      </div>

      {/* Tab Content Canvas */}
      <main className="w-full max-w-[1560px] mx-auto px-4 sm:px-6 lg:px-8 mt-6">
        
        {/* ================================================================= */}
        {/* TAB 1: PROFIL & TEKS UTAMA (HERO SECTION & FOTO PROFIL)           */}
        {/* ================================================================= */}
        {activeTab === 'hero' && (
          <div className="bg-white rounded-3xl p-6 sm:p-8 lg:p-10 border border-[#CAD7C5] shadow-sm space-y-6">
            <div>
              <h2 className="font-serif text-xl font-bold text-neutral-900">
                Pengaturan Profil & Teks Beranda (Hero Section)
              </h2>
              <p className="text-xs text-neutral-500 mt-1">
                Kamu bisa mengubah judul utama, biografi perkenalan diri, 4 metrik statistik, dan foto profil utama.
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8">
              {/* Left Column: Text Fields (8 cols) */}
              <div className="lg:col-span-8 space-y-4">
                <div>
                  <label className="block text-xs font-bold text-neutral-900 mb-1">
                    Pill Ketersediaan Karir (Status Bar):
                  </label>
                  <input
                    type="text"
                    value={data.hero?.subheadline || ''}
                    onChange={(e) => setData({
                      ...data,
                      hero: { ...data.hero, subheadline: e.target.value }
                    })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-[#CAD7C5] text-xs text-neutral-900"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-neutral-900 mb-1">
                    Kalimat Headline Utama (Judul Besar):
                  </label>
                  <textarea
                    rows={2}
                    value={data.hero?.headline || ''}
                    onChange={(e) => setData({
                      ...data,
                      hero: { ...data.hero, headline: e.target.value }
                    })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-[#CAD7C5] text-xs font-serif text-neutral-900"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-neutral-900 mb-1">
                    Paragraf Biografi / Pengenalan Diri:
                  </label>
                  <textarea
                    rows={4}
                    value={data.hero?.bio || ''}
                    onChange={(e) => setData({
                      ...data,
                      hero: { ...data.hero, bio: e.target.value }
                    })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-[#CAD7C5] text-xs text-neutral-900 leading-relaxed"
                  />
                </div>

                {/* 4 Statistical Metrics */}
                <div className="pt-2">
                  <label className="block text-xs font-bold text-neutral-900 mb-2">
                    4 Metrik Statistik Utama:
                  </label>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                    <div className="p-3 rounded-xl bg-sage-50/40 border border-[#CAD7C5]/60">
                      <input
                        type="text"
                        value={data.hero?.stat1Value || ''}
                        onChange={(e) => setData({
                          ...data,
                          hero: { ...data.hero, stat1Value: e.target.value }
                        })}
                        placeholder="7x"
                        className="w-full text-center font-serif font-bold text-sm text-rose-900 bg-white rounded-lg border border-[#CAD7C5] py-1 mb-1"
                      />
                      <input
                        type="text"
                        value={data.hero?.stat1Label || ''}
                        onChange={(e) => setData({
                          ...data,
                          hero: { ...data.hero, stat1Label: e.target.value }
                        })}
                        placeholder="National Awards"
                        className="w-full text-center text-[10px] uppercase font-bold text-neutral-500 bg-transparent"
                      />
                    </div>

                    <div className="p-3 rounded-xl bg-sage-50/40 border border-[#CAD7C5]/60">
                      <input
                        type="text"
                        value={data.hero?.stat2Value || ''}
                        onChange={(e) => setData({
                          ...data,
                          hero: { ...data.hero, stat2Value: e.target.value }
                        })}
                        placeholder="+2.089%"
                        className="w-full text-center font-serif font-bold text-sm text-rose-900 bg-white rounded-lg border border-[#CAD7C5] py-1 mb-1"
                      />
                      <input
                        type="text"
                        value={data.hero?.stat2Label || ''}
                        onChange={(e) => setData({
                          ...data,
                          hero: { ...data.hero, stat2Label: e.target.value }
                        })}
                        placeholder="Reels Reach Surge"
                        className="w-full text-center text-[10px] uppercase font-bold text-neutral-500 bg-transparent"
                      />
                    </div>

                    <div className="p-3 rounded-xl bg-sage-50/40 border border-[#CAD7C5]/60">
                      <input
                        type="text"
                        value={data.hero?.stat3Value || ''}
                        onChange={(e) => setData({
                          ...data,
                          hero: { ...data.hero, stat3Value: e.target.value }
                        })}
                        placeholder="20+"
                        className="w-full text-center font-serif font-bold text-sm text-neutral-900 bg-white rounded-lg border border-[#CAD7C5] py-1 mb-1"
                      />
                      <input
                        type="text"
                        value={data.hero?.stat3Label || ''}
                        onChange={(e) => setData({
                          ...data,
                          hero: { ...data.hero, stat3Label: e.target.value }
                        })}
                        placeholder="Event Partners"
                        className="w-full text-center text-[10px] uppercase font-bold text-neutral-500 bg-transparent"
                      />
                    </div>

                    <div className="p-3 rounded-xl bg-sage-50/40 border border-[#CAD7C5]/60">
                      <input
                        type="text"
                        value={data.hero?.stat4Value || ''}
                        onChange={(e) => setData({
                          ...data,
                          hero: { ...data.hero, stat4Value: e.target.value }
                        })}
                        placeholder="775"
                        className="w-full text-center font-serif font-bold text-sm text-neutral-900 bg-white rounded-lg border border-[#CAD7C5] py-1 mb-1"
                      />
                      <input
                        type="text"
                        value={data.hero?.stat4Label || ''}
                        onChange={(e) => setData({
                          ...data,
                          hero: { ...data.hero, stat4Label: e.target.value }
                        })}
                        placeholder="Skor Resmi TOEIC"
                        className="w-full text-center text-[10px] uppercase font-bold text-neutral-500 bg-transparent"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Right Column: Avatar Photo Edit & Live Preview (4 cols) */}
              <div className="lg:col-span-4 p-5 rounded-2xl bg-sage-50/40 border border-[#CAD7C5] flex flex-col justify-start gap-4">
                <div>
                  <ImageUploadField
                    label="Foto Profil Utama (Avatar Hero):"
                    value={data.hero?.avatarImg || '/2.png'}
                    onChange={(newUrl) => setData({
                      ...data,
                      hero: { ...data.hero, avatarImg: newUrl }
                    })}
                    aspectRatio="portrait"
                    helperText="Foto vertikal/portrait (rasio 4:5 atau 1:1) dengan resolusi tajam."
                  />
                </div>
              </div>
            </div>

            <div className="pt-4 border-t border-[#CAD7C5]/60 flex justify-end">
              <button
                onClick={handleSave}
                className="px-6 py-2.5 rounded-full bg-forest text-white text-xs font-bold hover:bg-forest-dark transition-colors shadow-sm cursor-pointer"
              >
                Simpan Profil & Teks Utama ✦
              </button>
            </div>
          </div>
        )}

        {/* ================================================================= */}
        {/* TAB: PENDIDIKAN FORMAL (ACADEMIC) & SERTIFIKASI PROFESIONAL        */}
        {/* ================================================================= */}
        {activeTab === 'education' && (
          <div className="bg-white rounded-3xl p-6 sm:p-8 lg:p-10 border border-[#CAD7C5] shadow-sm space-y-8">
            <div>
              <h2 className="font-serif text-xl font-bold text-neutral-900">
                Pengaturan Pendidikan Formal (D4 SIB) & Sertifikasi Profesional
              </h2>
              <p className="text-xs text-neutral-500 mt-1">
                Ubah gelar sarjana, institusi, IPK, skor tes TOEIC, berkas ijazah resmi, serta daftar sertifikat kursus profesional industri.
              </p>
            </div>

            {/* SECTION A: FORMAL ACADEMIC DEGREE */}
            <div className="p-6 rounded-2xl bg-gradient-to-br from-[F4F7F2]/40 to-white border border-[#CAD7C5] space-y-5">
              <div className="flex items-center justify-between border-b border-[#CAD7C5]/70 pb-3">
                <div className="flex items-center gap-2">
                  <span className="text-rose-700 font-serif italic text-xl">✦</span>
                  <h3 className="font-serif font-bold text-base text-neutral-900">
                    1. Latar Belakang Akademik Formal (Degree Card)
                  </h3>
                </div>
                <span className="text-xs font-mono bg-white text-neutral-900 px-3 py-1 rounded-full border border-[#CAD7C5] font-bold">
                  Ditampilkan di Beranda Sebelah Spotlight Skills
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="md:col-span-2">
                  <label className="block text-xs font-bold text-neutral-900 mb-1">Nama Gelar Akademik:</label>
                  <input
                    type="text"
                    value={data.academic?.degree || ''}
                    onChange={(e) => setData({
                      ...data,
                      academic: {
                        ...(data.academic || DEFAULT_PORTFOLIO_DATA.academic!),
                        degree: e.target.value
                      }
                    })}
                    placeholder="Sarjana Terapan Sistem Informasi Bisnis (D4 SIB)"
                    className="w-full px-3.5 py-2 rounded-xl bg-white border border-[#CAD7C5] text-xs font-serif font-bold text-neutral-900"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-neutral-900 mb-1">Periode Studi:</label>
                  <input
                    type="text"
                    value={data.academic?.period || ''}
                    onChange={(e) => setData({
                      ...data,
                      academic: {
                        ...(data.academic || DEFAULT_PORTFOLIO_DATA.academic!),
                        period: e.target.value
                      }
                    })}
                    placeholder="2020 – 2024"
                    className="w-full px-3.5 py-2 rounded-xl bg-white border border-[#CAD7C5] text-xs font-mono"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="md:col-span-2">
                  <label className="block text-xs font-bold text-neutral-900 mb-1">Jurusan & Institusi Kampus:</label>
                  <input
                    type="text"
                    value={data.academic?.institution || ''}
                    onChange={(e) => setData({
                      ...data,
                      academic: {
                        ...(data.academic || DEFAULT_PORTFOLIO_DATA.academic!),
                        institution: e.target.value
                      }
                    })}
                    placeholder="Jurusan Teknologi Informasi — Politeknik Negeri Malang"
                    className="w-full px-3.5 py-2 rounded-xl bg-white border border-[#CAD7C5] text-xs"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-neutral-900 mb-1">Label Badge Atas:</label>
                  <input
                    type="text"
                    value={data.academic?.badge || ''}
                    onChange={(e) => setData({
                      ...data,
                      academic: {
                        ...(data.academic || DEFAULT_PORTFOLIO_DATA.academic!),
                        badge: e.target.value
                      }
                    })}
                    placeholder="FORMAL DEGREE"
                    className="w-full px-3.5 py-2 rounded-xl bg-white border border-[#CAD7C5] text-xs font-bold text-rose-900"
                  />
                </div>
              </div>

              {/* Standing & TOEIC Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="p-4 rounded-xl bg-white border border-[#CAD7C5]/80 space-y-2">
                  <label className="block text-[11px] font-bold text-neutral-900 uppercase tracking-wider">
                    Prestasi Akademik (GPA):
                  </label>
                  <input
                    type="text"
                    value={data.academic?.gpaTitle || ''}
                    onChange={(e) => setData({
                      ...data,
                      academic: {
                        ...(data.academic || DEFAULT_PORTFOLIO_DATA.academic!),
                        gpaTitle: e.target.value
                      }
                    })}
                    placeholder="ACADEMIC STANDING"
                    className="w-full px-3 py-1.5 rounded-lg bg-sage-50/30 border border-[#CAD7C5] text-[11px] uppercase font-bold text-neutral-500"
                  />
                  <input
                    type="text"
                    value={data.academic?.gpaValue || ''}
                    onChange={(e) => setData({
                      ...data,
                      academic: {
                        ...(data.academic || DEFAULT_PORTFOLIO_DATA.academic!),
                        gpaValue: e.target.value
                      }
                    })}
                    placeholder="IPK Memuaskan / Cum Laude Honor"
                    className="w-full px-3 py-1.5 rounded-lg bg-white border border-[#CAD7C5] text-xs font-bold text-neutral-900"
                  />
                </div>

                <div className="p-4 rounded-xl bg-white border border-[#CAD7C5]/80 space-y-2">
                  <label className="block text-[11px] font-bold text-rose-900 uppercase tracking-wider">
                    Kemahiran Bahasa Internasional (TOEIC):
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    <input
                      type="text"
                      value={data.academic?.toeicScore || ''}
                      onChange={(e) => setData({
                        ...data,
                        academic: {
                          ...(data.academic || DEFAULT_PORTFOLIO_DATA.academic!),
                          toeicScore: e.target.value
                        }
                      })}
                      placeholder="Skor: 775"
                      className="w-full px-3 py-1.5 rounded-lg bg-white border border-[#CAD7C5] text-xs font-extrabold text-rose-900"
                    />
                    <input
                      type="text"
                      value={data.academic?.toeicLevel || ''}
                      onChange={(e) => setData({
                        ...data,
                        academic: {
                          ...(data.academic || DEFAULT_PORTFOLIO_DATA.academic!),
                          toeicLevel: e.target.value
                        }
                      })}
                      placeholder="Working Proficiency"
                      className="w-full px-3 py-1.5 rounded-lg bg-white border border-[#CAD7C5] text-xs font-bold text-neutral-900"
                    />
                  </div>
                  <input
                    type="text"
                    value={data.academic?.toeicTitle || ''}
                    onChange={(e) => setData({
                      ...data,
                      academic: {
                        ...(data.academic || DEFAULT_PORTFOLIO_DATA.academic!),
                        toeicTitle: e.target.value
                      }
                    })}
                    placeholder="GLOBAL ENGLISH PROFICIENCY"
                    className="w-full px-3 py-1.5 rounded-lg bg-sage-50/30 border border-[#CAD7C5] text-[11px] uppercase font-bold text-neutral-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-neutral-900 mb-1">Deskripsi Ringkasan Keilmuan:</label>
                <textarea
                  rows={3}
                  value={data.academic?.description || ''}
                  onChange={(e) => setData({
                    ...data,
                    academic: {
                      ...(data.academic || DEFAULT_PORTFOLIO_DATA.academic!),
                      description: e.target.value
                    }
                  })}
                  className="w-full px-3.5 py-2 rounded-xl bg-white border border-[#CAD7C5] text-xs leading-relaxed"
                />
              </div>

              {/* Academic Certificate Images (Ijazah / Transkrip / TOEIC) */}
              <div className="pt-2">
                <MultiImageGalleryField
                  label="Berkas Dokumen Kelulusan, Ijazah, Transkrip & Bukti Skor TOEIC (Dibuka Saat Tombol Diklik):"
                  images={data.academic?.images || ['/11.png', '/12.png', '/16.png']}
                  onChange={(newImages) => {
                    setData({
                      ...data,
                      academic: {
                        ...(data.academic || DEFAULT_PORTFOLIO_DATA.academic!),
                        images: newImages,
                      },
                    });
                  }}
                  aspectRatio="certificate"
                  helperText="Scan Ijazah Resmi D4 SIB, Sertifikat Skor TOEIC 775, Transkrip Nilai, dan bukti akademik lainnya. Bisa tambah foto sebanyak mungkin!"
                />
              </div>
            </div>

            {/* SECTION B: PROFESSIONAL CERTIFICATIONS LIST */}
            <div className="p-6 rounded-2xl bg-sage-50/30 border border-[#CAD7C5] space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#CAD7C5]/70 pb-3">
                <div className="flex items-center gap-2">
                  <span className="text-rose-700 font-serif italic text-xl">✦</span>
                  <div>
                    <h3 className="font-serif font-bold text-base text-neutral-900">
                      2. Daftar Sertifikasi Pelatihan Profesional ({data.certifications?.length || 0})
                    </h3>
                    <p className="text-[11px] text-neutral-500">
                      Tersaji dalam format kartu memanjang tanpa perlu digeser di section &quot;Professional Courses &amp; Accreditations&quot;.
                    </p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => {
                    const currentCerts = data.certifications || DEFAULT_PORTFOLIO_DATA.certifications || [];
                    const newCert = {
                      id: 'cert-' + Date.now(),
                      title: 'Sertifikasi Baru',
                      issuer: 'Lembaga Penerbit',
                      year: '2024',
                      tag: 'Bidang Keahlian',
                      badgeColor: 'bg-rose-100/80 text-rose-900 border-rose-dusty/40',
                      image: '/11.png',
                      desc: 'Deskripsi kompetensi dan materi yang dipelajari dalam pelatihan ini.',
                      link: ''
                    };
                    const updated = [...currentCerts, newCert];
                    setData({ ...data, certifications: updated });
                    setActiveCertIdx(updated.length - 1);
                  }}
                  className="px-4 py-1.5 rounded-full text-xs font-bold bg-forest text-white hover:bg-rose-950 transition-colors shadow-2xs shrink-0 cursor-pointer"
                >
                  + Tambah Sertifikat Baru
                </button>
              </div>

              {/* Certification Tabs */}
              <div className="flex flex-wrap gap-2">
                {(data.certifications || DEFAULT_PORTFOLIO_DATA.certifications || []).map((c, cIdx) => (
                  <button
                    key={cIdx}
                    onClick={() => setActiveCertIdx(cIdx)}
                    className={`px-3.5 py-1.5 rounded-full text-xs font-bold transition-all ${
                      activeCertIdx === cIdx
                        ? 'bg-forest text-white shadow-xs'
                        : 'bg-white text-neutral-600 border border-[#CAD7C5] hover:bg-[D2DEC9]'
                    }`}
                  >
                    {c.issuer} ({c.year})
                  </button>
                ))}
              </div>

              {/* Active Certification Editor */}
              {(() => {
                const certs = data.certifications || DEFAULT_PORTFOLIO_DATA.certifications || [];
                const currentCert = certs[activeCertIdx];
                if (!currentCert) return null;

                return (
                  <div className="p-5 rounded-2xl bg-white border border-[#CAD7C5] space-y-4 shadow-2xs">
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                      <div className="md:col-span-2">
                        <label className="block text-xs font-bold text-neutral-900 mb-1">Judul Sertifikasi / Pelatihan:</label>
                        <input
                          type="text"
                          value={currentCert.title}
                          onChange={(e) => {
                            const updated = [...certs];
                            updated[activeCertIdx] = { ...currentCert, title: e.target.value };
                            setData({ ...data, certifications: updated });
                          }}
                          className="w-full px-3.5 py-2 rounded-xl bg-white border border-[#CAD7C5] text-xs font-serif font-bold text-neutral-900"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-neutral-900 mb-1">Lembaga Penerbit (Issuer):</label>
                        <input
                          type="text"
                          value={currentCert.issuer}
                          onChange={(e) => {
                            const updated = [...certs];
                            updated[activeCertIdx] = { ...currentCert, issuer: e.target.value };
                            setData({ ...data, certifications: updated });
                          }}
                          placeholder="RevoU, MySkill, ETS, dll"
                          className="w-full px-3.5 py-2 rounded-xl bg-white border border-[#CAD7C5] text-xs font-bold text-neutral-900"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-neutral-900 mb-1">Tahun Penerbitan:</label>
                        <input
                          type="text"
                          value={currentCert.year}
                          onChange={(e) => {
                            const updated = [...certs];
                            updated[activeCertIdx] = { ...currentCert, year: e.target.value };
                            setData({ ...data, certifications: updated });
                          }}
                          className="w-full px-3.5 py-2 rounded-xl bg-white border border-[#CAD7C5] text-xs font-mono"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div>
                        <label className="block text-xs font-bold text-neutral-900 mb-1">Tag Kategori Bidang:</label>
                        <input
                          type="text"
                          value={currentCert.tag}
                          onChange={(e) => {
                            const updated = [...certs];
                            updated[activeCertIdx] = { ...currentCert, tag: e.target.value };
                            setData({ ...data, certifications: updated });
                          }}
                          placeholder="Digital Marketing, UI/UX, dll"
                          className="w-full px-3.5 py-2 rounded-xl bg-white border border-[#CAD7C5] text-xs"
                        />
                      </div>

                      <div className="md:col-span-2">
                        <label className="block text-xs font-bold text-neutral-900 mb-1">Link Kredensial Online (Opsional):</label>
                        <input
                          type="text"
                          value={currentCert.link || ''}
                          onChange={(e) => {
                            const updated = [...certs];
                            updated[activeCertIdx] = { ...currentCert, link: e.target.value };
                            setData({ ...data, certifications: updated });
                          }}
                          placeholder="https://..."
                          className="w-full px-3.5 py-2 rounded-xl bg-white border border-[#CAD7C5] text-xs font-mono"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-neutral-900 mb-1">Deskripsi Kompetensi:</label>
                      <textarea
                        rows={2}
                        value={currentCert.desc}
                        onChange={(e) => {
                          const updated = [...certs];
                          updated[activeCertIdx] = { ...currentCert, desc: e.target.value };
                          setData({ ...data, certifications: updated });
                        }}
                        className="w-full px-3.5 py-2 rounded-xl bg-white border border-[#CAD7C5] text-xs leading-relaxed"
                      />
                    </div>

                    {/* Image Upload for Certificate */}
                    <div className="pt-2 space-y-4">
                      <ImageUploadField
                        label="Foto / Scan Sertifikat Resmi (Sampul Utama):"
                        value={currentCert.image}
                        onChange={(newUrl) => {
                          const updated = [...certs];
                          updated[activeCertIdx] = { ...currentCert, image: newUrl };
                          setData({ ...data, certifications: updated });
                        }}
                        aspectRatio="certificate"
                        helperText="Upload gambar sertifikat resmi (rasio 4:3 atau 16:9)"
                      />

                      <MultiImageGalleryField
                        label="Dokumen & Foto Tambahan Sertifikasi (Opsional):"
                        images={currentCert.extraImages || []}
                        onChange={(newImages) => {
                          const updated = [...certs];
                          updated[activeCertIdx] = { ...currentCert, extraImages: newImages };
                          setData({ ...data, certifications: updated });
                        }}
                        aspectRatio="certificate"
                        helperText="Upload bukti transkrip modul, materi, atau foto dokumentasi pendukung lainnya."
                      />
                    </div>

                    <div className="pt-3 border-t border-[#CAD7C5]/50 flex items-center justify-between">
                      <button
                        type="button"
                        onClick={() => {
                          if (certs.length <= 1) {
                            alert('Minimal harus ada 1 sertifikat.');
                            return;
                          }
                          if (window.confirm(`Hapus sertifikat "${currentCert.title}"?`)) {
                            const updated = certs.filter((_, i) => i !== activeCertIdx);
                            setData({ ...data, certifications: updated });
                            setActiveCertIdx(0);
                          }
                        }}
                        className="px-3 py-1.5 rounded-lg text-xs font-medium text-rose-600 hover:bg-sage-50 transition-colors"
                      >
                        Hapus Sertifikat Ini
                      </button>

                      <button
                        type="button"
                        onClick={handleSave}
                        className="px-5 py-2 rounded-full bg-forest text-white text-xs font-bold hover:bg-forest-dark transition-colors shadow-xs cursor-pointer"
                      >
                        Simpan Sertifikat Ini ✦
                      </button>
                    </div>
                  </div>
                );
              })()}
            </div>

            <div className="pt-4 flex justify-end">
              <button
                onClick={handleSave}
                className="px-8 py-3 rounded-full bg-forest text-white text-xs font-bold hover:bg-forest-dark transition-colors shadow-md cursor-pointer flex items-center gap-2"
              >
                <span>Simpan Semua Data Pendidikan & Sertifikasi</span>
                <span>✦</span>
              </button>
            </div>
          </div>
        )}

        {/* ================================================================= */}
        {/* TAB: PENGALAMAN KERJA (WORK EXPERIENCE) — TEKS & BUKTI FOTO        */}
        {/* ================================================================= */}
        {activeTab === 'experience' && (
          <div className="bg-white rounded-3xl p-6 sm:p-8 lg:p-10 border border-[#CAD7C5] shadow-sm space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h2 className="font-serif text-xl font-bold text-neutral-900">
                  Pengaturan Teks & Foto — Pengalaman Kerja Nyata & Bisnis
                </h2>
                <p className="text-xs text-neutral-500 mt-1">
                  Pilih pengalaman kerja untuk mengedit judul peran, periode, tag, ringkasan eksekutif, fokus capaian, foto utama, dan galeri kerja.
                </p>
              </div>

              <button
                type="button"
                onClick={() => {
                  const currentList = data.experiences || DEFAULT_PORTFOLIO_DATA.experiences || [];
                  const newExp: ProjectDoc = {
                    id: `exp-${Date.now()}`,
                    category: 'BUSINESS OPERATIONS & SOP',
                    title: 'Peran Baru — Nama Perusahaan/Bisnis',
                    tag: 'Business Operations',
                    period: '2025 - Sekarang',
                    badgeColor: 'bg-emerald-100 text-emerald-900 border-emerald-300',
                    summary: 'Deskripsi singkat mengenai peran, kepemimpinan tim, dan tanggung jawab operasional.',
                    challenge: 'Tantangan operasional atau bisnis yang dihadapi.',
                    strategy: 'Strategi atau inisiatif yang diterapkan untuk mencapai target.',
                    results: [
                      'Inisiatif operasional terukur',
                      'Efisiensi alur kerja & SOP',
                      'Kemitraan & pertumbuhan bisnis',
                    ],
                    image: '/3.png',
                    extraImages: ['/3.png', '/4.png', '/1.png'],
                    link: '',
                    linkLabel: 'Profil Bisnis ↗',
                  };
                  const updated = [...currentList, newExp];
                  setData({ ...data, experiences: updated });
                  setActiveExperienceIdx(updated.length - 1);
                }}
                className="px-4 py-1.5 rounded-full text-xs font-bold bg-forest text-white hover:bg-forest-dark transition-colors shadow-2xs shrink-0 cursor-pointer"
              >
                + Tambah Pengalaman Baru
              </button>
            </div>

            {/* Experience Selector Tabs */}
            <div className="flex flex-wrap gap-2 border-b border-[#CAD7C5]/70 pb-4">
              {(data.experiences || DEFAULT_PORTFOLIO_DATA.experiences || []).map((exp, idx) => (
                <button
                  key={exp.id || idx}
                  onClick={() => setActiveExperienceIdx(idx)}
                  className={`px-4 py-1.5 rounded-full text-xs font-bold transition-all ${
                    activeExperienceIdx === idx
                      ? 'bg-forest text-white shadow-xs'
                      : 'bg-sage-50 text-neutral-600 hover:bg-[D2DEC9]'
                  }`}
                >
                  {exp.title.split('—')[0].trim()}
                </button>
              ))}
            </div>

            {/* Active Experience Editor */}
            {(() => {
              const exps = data.experiences || DEFAULT_PORTFOLIO_DATA.experiences || [];
              const currentExp = exps[activeExperienceIdx];
              if (!currentExp) return null;

              return (
                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="md:col-span-2">
                      <label className="block text-xs font-bold text-neutral-900 mb-1">Nama Peran & Perusahaan/Bisnis:</label>
                      <input
                        type="text"
                        value={currentExp.title}
                        onChange={(e) => {
                          const updated = [...exps];
                          updated[activeExperienceIdx] = { ...currentExp, title: e.target.value };
                          setData({ ...data, experiences: updated });
                        }}
                        className="w-full px-3.5 py-2 rounded-xl bg-white border border-[#CAD7C5] text-xs font-serif font-bold text-neutral-900"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-neutral-900 mb-1">Periode Kerja:</label>
                      <input
                        type="text"
                        value={currentExp.period}
                        onChange={(e) => {
                          const updated = [...exps];
                          updated[activeExperienceIdx] = { ...currentExp, period: e.target.value };
                          setData({ ...data, experiences: updated });
                        }}
                        className="w-full px-3.5 py-2 rounded-xl bg-white border border-[#CAD7C5] text-xs font-mono"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-neutral-900 mb-1">Tag / Kategori Bidang:</label>
                      <input
                        type="text"
                        value={currentExp.tag}
                        onChange={(e) => {
                          const updated = [...exps];
                          updated[activeExperienceIdx] = { ...currentExp, tag: e.target.value };
                          setData({ ...data, experiences: updated });
                        }}
                        className="w-full px-3.5 py-2 rounded-xl bg-white border border-[#CAD7C5] text-xs"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-neutral-900 mb-1">Link Eksternal / Profil Bisnis:</label>
                      <input
                        type="text"
                        value={currentExp.link || ''}
                        onChange={(e) => {
                          const updated = [...exps];
                          updated[activeExperienceIdx] = { ...currentExp, link: e.target.value };
                          setData({ ...data, experiences: updated });
                        }}
                        placeholder="https://... (Instagram / Web)"
                        className="w-full px-3.5 py-2 rounded-xl bg-white border border-[#CAD7C5] text-xs font-mono"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-neutral-900 mb-1">Label Tombol Tautan:</label>
                      <input
                        type="text"
                        value={currentExp.linkLabel || ''}
                        onChange={(e) => {
                          const updated = [...exps];
                          updated[activeExperienceIdx] = { ...currentExp, linkLabel: e.target.value };
                          setData({ ...data, experiences: updated });
                        }}
                        placeholder="Profil Bisnis Dua Sisi ↗"
                        className="w-full px-3.5 py-2 rounded-xl bg-white border border-[#CAD7C5] text-xs"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-neutral-900 mb-1">Ringkasan Pengalaman Kerja (Summary):</label>
                    <textarea
                      rows={2}
                      value={currentExp.summary}
                      onChange={(e) => {
                        const updated = [...exps];
                        updated[activeExperienceIdx] = { ...currentExp, summary: e.target.value };
                        setData({ ...data, experiences: updated });
                      }}
                      className="w-full px-3.5 py-2 rounded-xl bg-white border border-[#CAD7C5] text-xs leading-relaxed"
                    />
                  </div>

                  {/* 3 Result Badges */}
                  <div>
                    <label className="block text-xs font-bold text-neutral-900 mb-2">3 Poin Fokus / Capaian Kerja:</label>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                      {(currentExp.results || ['', '', '']).slice(0, 3).map((res, rIdx) => (
                        <div key={rIdx}>
                          <label className="block text-[11px] text-neutral-500 mb-1">Poin {rIdx + 1}:</label>
                          <input
                            type="text"
                            value={res}
                            onChange={(e) => {
                              const updated = [...exps];
                              const newResults = [...(currentExp.results || ['', '', ''])];
                              newResults[rIdx] = e.target.value;
                              updated[activeExperienceIdx] = { ...currentExp, results: newResults };
                              setData({ ...data, experiences: updated });
                            }}
                            className="w-full px-3 py-1.5 rounded-lg bg-white border border-[#CAD7C5] text-xs"
                          />
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Photos Upload Multi-Gallery */}
                  <MultiImageGalleryField
                    label="Galeri Foto Dokumentasi Pekerjaan & Bukti Lapangan:"
                    images={currentExp.extraImages && currentExp.extraImages.length > 0 ? currentExp.extraImages : (currentExp.image ? [currentExp.image] : ['/3.png'])}
                    onChange={(newImages) => {
                      const updated = [...exps];
                      const primaryImg = newImages[0] || currentExp.image || '/3.png';
                      updated[activeExperienceIdx] = {
                        ...currentExp,
                        image: primaryImg,
                        extraImages: newImages,
                      };
                      setData({ ...data, experiences: updated });
                    }}
                    aspectRatio="landscape"
                    helperText="Upload sebanyak mungkin foto dokumentasi pekerjaan (bisa 3, 5, 8, 12+ foto). Foto pertama otomatis menjadi foto sampul kartu."
                  />

                  <div className="pt-4 border-t border-[#CAD7C5]/60 flex items-center justify-between">
                    <button
                      type="button"
                      onClick={() => {
                        if (exps.length <= 1) {
                          alert('Minimal harus ada 1 riwayat pengalaman kerja.');
                          return;
                        }
                        if (window.confirm(`Yakin ingin menghapus pengalaman kerja "${currentExp.title}"?`)) {
                          const updated = exps.filter((_, i) => i !== activeExperienceIdx);
                          setData({ ...data, experiences: updated });
                          setActiveExperienceIdx(Math.max(0, activeExperienceIdx - 1));
                        }
                      }}
                      className="px-3 py-1.5 rounded-lg text-xs font-medium text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer"
                    >
                      Hapus Pengalaman Ini
                    </button>

                    <button
                      onClick={handleSave}
                      className="px-6 py-2.5 rounded-full bg-forest text-white text-xs font-bold hover:bg-forest-dark transition-colors shadow-sm cursor-pointer"
                    >
                      Simpan Perubahan Pengalaman Kerja ✦
                    </button>
                  </div>
                </div>
              );
            })()}
          </div>
        )}

        {/* ================================================================= */}
        {/* TAB: PROYEK KAMPUS (CAMPUS PROJECTS) — TEKS & BUKTI FOTO           */}
        {/* ================================================================= */}
        {activeTab === 'projects' && (
          <div className="bg-white rounded-3xl p-6 sm:p-8 lg:p-10 border border-[#CAD7C5] shadow-sm space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h2 className="font-serif text-xl font-bold text-neutral-900">
                  Pengaturan Teks & Foto — Proyek Kampus & Akademik (MY WORK INCLUDES)
                </h2>
                <p className="text-xs text-neutral-500 mt-1">
                  Pilih proyek kampus untuk mengedit judul, ringkasan, tantangan, strategi, metrik hasil, foto sampul, dan foto-foto dokumentasi pendukung.
                </p>
              </div>

              <button
                type="button"
                onClick={() => {
                  const currentProjects = data.projects || DEFAULT_PORTFOLIO_DATA.projects || [];
                  const newProj: ProjectDoc = {
                    id: `proj-${Date.now()}`,
                    category: 'TECH & BUSINESS CASE STUDY',
                    title: 'Judul Proyek Baru',
                    tag: 'Product & Business Analyst',
                    period: '2025',
                    badgeColor: 'bg-emerald-100 text-emerald-900 border-emerald-300',
                    summary: 'Ringkasan solusi digital atau inovasi bisnis yang dikembangkan.',
                    challenge: 'Tantangan permasalahan utama yang diselesaikan.',
                    strategy: 'Strategi perancangan sistem dan metodologi pengerjaan.',
                    results: [
                      'Fitur utama berhasil diimplementasikan',
                      'Uji coba pengguna dengan hasil positif',
                      'Dokumentasi sistem terstandarisasi',
                    ],
                    image: '/1.png',
                    extraImages: ['/1.png', '/2.png', '/3.png'],
                    link: '',
                    linkLabel: 'Buka Dokumentasi ↗',
                  };
                  const updated = [...currentProjects, newProj];
                  setData({ ...data, projects: updated });
                  setActiveProjectIdx(updated.length - 1);
                }}
                className="px-4 py-1.5 rounded-full text-xs font-bold bg-forest text-white hover:bg-forest-dark transition-colors shadow-2xs shrink-0 cursor-pointer"
              >
                + Tambah Proyek Baru
              </button>
            </div>

            {/* Project Selector Tabs */}
            <div className="flex flex-wrap gap-2 border-b border-[#CAD7C5]/70 pb-4">
              {(data.projects || DEFAULT_PORTFOLIO_DATA.projects || []).map((p, idx) => (
                <button
                  key={p.id || idx}
                  onClick={() => setActiveProjectIdx(idx)}
                  className={`px-4 py-1.5 rounded-full text-xs font-bold transition-all ${
                    activeProjectIdx === idx
                      ? 'bg-forest text-white shadow-xs'
                      : 'bg-sage-50 text-neutral-600 hover:bg-[D2DEC9]'
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
                    <label className="block text-xs font-bold text-neutral-900 mb-1">Judul Proyek:</label>
                    <input
                      type="text"
                      value={data.projects[activeProjectIdx].title}
                      onChange={(e) => {
                        const updated = [...data.projects];
                        updated[activeProjectIdx].title = e.target.value;
                        setData({ ...data, projects: updated });
                      }}
                      className="w-full px-3.5 py-2 rounded-xl bg-white border border-[#CAD7C5] text-xs font-serif font-bold text-neutral-900"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-neutral-900 mb-1">Periode / Waktu:</label>
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
                    <label className="block text-xs font-bold text-neutral-900 mb-1">Tag / Peran:</label>
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
                    <label className="block text-xs font-bold text-neutral-900 mb-1">Link Eksternal / Berita:</label>
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
                    <label className="block text-xs font-bold text-neutral-900 mb-1">Label Tombol Tautan:</label>
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
                  <label className="block text-xs font-bold text-neutral-900 mb-1">Ringkasan Eksekutif (Summary):</label>
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
                    <label className="block text-xs font-bold text-neutral-900 mb-1">Tantangan Bisnis (Challenge):</label>
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
                    <label className="block text-xs font-bold text-neutral-900 mb-1">Strategi & Solusi (Strategy):</label>
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
                  <label className="block text-xs font-bold text-neutral-900 mb-1">3 Tag Sorotan / Capaian Proyek:</label>
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

                {/* Photos Multi-Gallery Section */}
                <MultiImageGalleryField
                  label="Galeri Foto Sampul & Bukti Dokumentasi Proyek:"
                  images={data.projects[activeProjectIdx].extraImages && data.projects[activeProjectIdx].extraImages.length > 0 ? data.projects[activeProjectIdx].extraImages : (data.projects[activeProjectIdx].image ? [data.projects[activeProjectIdx].image] : ['/15.png'])}
                  onChange={(newImages) => {
                    const updated = [...data.projects];
                    const primaryImg = newImages[0] || data.projects[activeProjectIdx].image || '/15.png';
                    updated[activeProjectIdx] = {
                      ...data.projects[activeProjectIdx],
                      image: primaryImg,
                      extraImages: newImages,
                    };
                    setData({ ...data, projects: updated });
                  }}
                  aspectRatio="landscape"
                  helperText="Upload sebanyak mungkin foto dokumentasi (bisa 3, 5, 8, 12+ foto). Foto pertama otomatis menjadi foto sampul utama."
                />

                <div className="pt-4 border-t border-[#CAD7C5]/60 flex items-center justify-between">
                  <button
                    type="button"
                    onClick={() => {
                      if (data.projects.length <= 1) {
                        alert('Minimal harus ada 1 proyek dalam portofolio.');
                        return;
                      }
                      const currentProj = data.projects[activeProjectIdx];
                      if (window.confirm(`Yakin ingin menghapus proyek "${currentProj?.title}"?`)) {
                        const updated = data.projects.filter((_, i) => i !== activeProjectIdx);
                        setData({ ...data, projects: updated });
                        setActiveProjectIdx(Math.max(0, activeProjectIdx - 1));
                      }
                    }}
                    className="px-3 py-1.5 rounded-lg text-xs font-medium text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer"
                  >
                    Hapus Proyek Ini
                  </button>

                  <button
                    onClick={handleSave}
                    className="px-6 py-2.5 rounded-full bg-forest text-white text-xs font-bold hover:bg-forest-dark transition-colors shadow-sm cursor-pointer"
                  >
                    Simpan Perubahan Proyek ✦
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
          <div className="bg-white rounded-3xl p-6 sm:p-8 lg:p-10 border border-[#CAD7C5] shadow-sm space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h2 className="font-serif text-xl font-bold text-neutral-900">
                  Pengaturan Kejuaraan, Sertifikat & Foto Dokumentasi Panggung
                </h2>
                <p className="text-xs text-neutral-500 mt-1">
                  Ubah judul lomba, penyelenggara, deskripsi kemenangan, foto sertifikat resmi, foto panggung penghargaan, dan link publikasi berita.
                </p>
              </div>

              <button
                type="button"
                onClick={() => {
                  const currentAwards = data.awards || DEFAULT_PORTFOLIO_DATA.awards || [];
                  const newAward: AwardItem = {
                    id: `award-${Date.now()}`,
                    year: '2026',
                    rank: '1st Winner',
                    rankBadge: 'bg-rose-dark text-white',
                    title: 'Nama Kompetisi Bisnis / Lomba Baru',
                    organizer: 'Institusi / Universitas Penyelenggara',
                    scope: 'Tingkat Nasional',
                    level: 'Nasional',
                    desc: 'Deskripsi capaian penghargaan dan keunggulan ide yang dipresentasikan.',
                    certImg: '/11.png',
                    eventImg: '/12.png',
                    link: '',
                    linkLabel: 'Publikasi Berita ↗',
                  };
                  const updated = [...currentAwards, newAward];
                  setData({ ...data, awards: updated });
                  setActiveAwardIdx(updated.length - 1);
                }}
                className="px-4 py-1.5 rounded-full text-xs font-bold bg-forest text-white hover:bg-forest-dark transition-colors shadow-2xs shrink-0 cursor-pointer"
              >
                + Tambah Penghargaan Baru
              </button>
            </div>

            {/* Award Selector Tabs */}
            <div className="flex flex-wrap gap-2 border-b border-[#CAD7C5]/70 pb-4">
              {(data.awards || DEFAULT_PORTFOLIO_DATA.awards || []).map((award, idx) => (
                <button
                  key={award.id || idx}
                  onClick={() => setActiveAwardIdx(idx)}
                  className={`px-4 py-1.5 rounded-full text-xs font-bold transition-all ${
                    activeAwardIdx === idx
                      ? 'bg-forest text-white shadow-xs'
                      : 'bg-sage-50 text-neutral-600 hover:bg-[D2DEC9]'
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
                    <label className="block text-xs font-bold text-neutral-900 mb-1">Judul Kompetisi / Penghargaan:</label>
                    <input
                      type="text"
                      value={data.awards[activeAwardIdx].title}
                      onChange={(e) => {
                        const updated = [...data.awards];
                        updated[activeAwardIdx].title = e.target.value;
                        setData({ ...data, awards: updated });
                      }}
                      className="w-full px-3.5 py-2 rounded-xl bg-white border border-[#CAD7C5] text-xs font-serif font-bold text-neutral-900"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-neutral-900 mb-1">Gelar / Peringkat (Rank):</label>
                    <input
                      type="text"
                      value={data.awards[activeAwardIdx].rank}
                      onChange={(e) => {
                        const updated = [...data.awards];
                        updated[activeAwardIdx].rank = e.target.value;
                        setData({ ...data, awards: updated });
                      }}
                      placeholder="1st Winner, Top 5 Finalist, dll"
                      className="w-full px-3.5 py-2 rounded-xl bg-white border border-[#CAD7C5] text-xs font-bold text-rose-900"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-neutral-900 mb-1">Tahun Penyelenggaraan:</label>
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
                    <label className="block text-xs font-bold text-neutral-900 mb-1">Penyelenggara Institusi:</label>
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
                    <label className="block text-xs font-bold text-neutral-900 mb-1">Link Berita / Warta (Opsional):</label>
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
                    <label className="block text-xs font-bold text-neutral-900 mb-1">Label Tombol Tautan:</label>
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
                  <label className="block text-xs font-bold text-neutral-900 mb-1">Deskripsi Kemenangan / Inovasi:</label>
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
                <div className="p-5 rounded-2xl bg-sage-50/40 border border-[#CAD7C5] space-y-4">
                  <div className="flex items-center justify-between">
                    <h4 className="font-serif font-bold text-sm text-neutral-900">
                      Foto Sertifikat & Dokumentasi Panggung Kejuaraan
                    </h4>
                    <span className="text-[11px] text-rose-900 font-medium">
                      Bisa langsung upload file dari laptop
                    </span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    {/* Certificate Image */}
                    <ImageUploadField
                      label="Foto Sertifikat Asli:"
                      value={data.awards[activeAwardIdx].certImg}
                      onChange={(newUrl) => {
                        const updated = [...data.awards];
                        updated[activeAwardIdx].certImg = newUrl;
                        setData({ ...data, awards: updated });
                      }}
                      aspectRatio="certificate"
                      helperText="Scan sertifikat resmi juara (rasio 4:3)"
                    />

                    {/* Event Documentation Image */}
                    <ImageUploadField
                      label="Foto Panggung / Dokumentasi Event:"
                      value={data.awards[activeAwardIdx].eventImg}
                      onChange={(newUrl) => {
                        const updated = [...data.awards];
                        updated[activeAwardIdx].eventImg = newUrl;
                        setData({ ...data, awards: updated });
                      }}
                      aspectRatio="certificate"
                      helperText="Foto penyerahan piala/dokumentasi panggung"
                    />
                  </div>

                  {/* Extra Award Documentation Gallery */}
                  <div className="pt-2">
                    <MultiImageGalleryField
                      label="Galeri Foto Dokumentasi Tambahan Juara (Piala, Tim, Panggung, dll):"
                      images={data.awards[activeAwardIdx].extraImages || []}
                      onChange={(newImages) => {
                        const updated = [...data.awards];
                        updated[activeAwardIdx] = {
                          ...data.awards[activeAwardIdx],
                          extraImages: newImages,
                        };
                        setData({ ...data, awards: updated });
                      }}
                      aspectRatio="certificate"
                      helperText="Tambahkan foto piala, foto tim bersama dewan juri, atau dokumentasi suasana kompetisi. Semua foto akan tampil di galeri modal!"
                    />
                  </div>
                </div>

                <div className="pt-4 border-t border-[#CAD7C5]/60 flex items-center justify-between">
                  <button
                    type="button"
                    onClick={() => {
                      if (data.awards.length <= 1) {
                        alert('Minimal harus ada 1 penghargaan dalam portofolio.');
                        return;
                      }
                      const currentAward = data.awards[activeAwardIdx];
                      if (window.confirm(`Yakin ingin menghapus penghargaan "${currentAward?.title}"?`)) {
                        const updated = data.awards.filter((_, i) => i !== activeAwardIdx);
                        setData({ ...data, awards: updated });
                        setActiveAwardIdx(Math.max(0, activeAwardIdx - 1));
                      }
                    }}
                    className="px-3 py-1.5 rounded-lg text-xs font-medium text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer"
                  >
                    Hapus Penghargaan Ini
                  </button>

                  <button
                    onClick={handleSave}
                    className="px-6 py-2.5 rounded-full bg-forest text-white text-xs font-bold hover:bg-forest-dark transition-colors shadow-sm cursor-pointer"
                  >
                    Simpan Perubahan Kejuaraan ✦
                  </button>
                </div>
              </div>
            )}
          </div>
        )}

        {/* ================================================================= */}
        {/* TAB: KEPEMIMPINAN & ORGANISASI KAMPUS (ORGANIZATIONS CAROUSEL)    */}
        {/* ================================================================= */}
        {activeTab === 'organizations' && (
          <div className="bg-white rounded-3xl p-6 sm:p-8 lg:p-10 border border-[#CAD7C5] shadow-sm space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h2 className="font-serif text-xl font-bold text-neutral-900">
                  Pengaturan Kepemimpinan & Organisasi Kampus
                </h2>
                <p className="text-xs text-neutral-500 mt-1">
                  Kelola peran organisasi (GDSC Google Ambassador, HMTI, KPU, PKKMB, KPM), ringkasan inisiatif, tag sorotan, dan banyak foto dokumentasi kegiatan.
                </p>
              </div>

              <button
                type="button"
                onClick={() => {
                  const currentOrgs = data.organizations || DEFAULT_PORTFOLIO_DATA.organizations || [];
                  const newOrg: OrganizationItem = {
                    id: `org-${Date.now()}`,
                    period: '2025 - Sekarang',
                    role: 'Nama Peran / Posisi Organisasi Baru',
                    institution: 'Nama Lembaga / Himpunan Kampus',
                    tag: 'Campus Leadership & Governance',
                    desc: 'Deskripsi tanggung jawab kepemimpinan, program kerja mahasiswa, dan kontribusi nyata yang dijalankan.',
                    highlights: ['Program Kerja', 'Inisiatif Tim', 'Kolaborasi'],
                    images: ['/11.png', '/12.png', '/13.png'],
                    link: '',
                    linkLabel: 'Profil Lembaga ↗',
                  };
                  const updated = [...currentOrgs, newOrg];
                  setData({ ...data, organizations: updated });
                  setActiveOrgIdx(updated.length - 1);
                }}
                className="px-4 py-1.5 rounded-full text-xs font-bold bg-forest text-white hover:bg-forest-dark transition-colors shadow-2xs shrink-0 cursor-pointer"
              >
                + Tambah Peran Organisasi
              </button>
            </div>

            {/* Organization Selector Tabs */}
            <div className="flex flex-wrap gap-2 border-b border-[#CAD7C5]/70 pb-4">
              {(data.organizations || DEFAULT_PORTFOLIO_DATA.organizations || []).map((org, idx) => (
                <button
                  key={org.id || idx}
                  onClick={() => setActiveOrgIdx(idx)}
                  className={`px-4 py-1.5 rounded-full text-xs font-bold transition-all ${
                    activeOrgIdx === idx
                      ? 'bg-forest text-white shadow-xs'
                      : 'bg-sage-50 text-neutral-600 hover:bg-[D2DEC9]'
                  }`}
                >
                  {org.role.split('(')[0].trim()}
                </button>
              ))}
            </div>

            {/* Active Organization Editor */}
            {(() => {
              const orgs = data.organizations || DEFAULT_PORTFOLIO_DATA.organizations || [];
              const currentOrg = orgs[activeOrgIdx];
              if (!currentOrg) return null;

              return (
                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="md:col-span-2">
                      <label className="block text-xs font-bold text-neutral-900 mb-1">Nama Peran / Posisi Kepemimpinan:</label>
                      <input
                        type="text"
                        value={currentOrg.role}
                        onChange={(e) => {
                          const updated = [...orgs];
                          updated[activeOrgIdx] = { ...currentOrg, role: e.target.value };
                          setData({ ...data, organizations: updated });
                        }}
                        className="w-full px-3.5 py-2 rounded-xl bg-white border border-[#CAD7C5] text-xs font-serif font-bold text-neutral-900"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-neutral-900 mb-1">Periode Menjabat:</label>
                      <input
                        type="text"
                        value={currentOrg.period}
                        onChange={(e) => {
                          const updated = [...orgs];
                          updated[activeOrgIdx] = { ...currentOrg, period: e.target.value };
                          setData({ ...data, organizations: updated });
                        }}
                        className="w-full px-3.5 py-2 rounded-xl bg-white border border-[#CAD7C5] text-xs font-mono"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-neutral-900 mb-1">Nama Organisasi / Lembaga:</label>
                      <input
                        type="text"
                        value={currentOrg.institution}
                        onChange={(e) => {
                          const updated = [...orgs];
                          updated[activeOrgIdx] = { ...currentOrg, institution: e.target.value };
                          setData({ ...data, organizations: updated });
                        }}
                        className="w-full px-3.5 py-2 rounded-xl bg-white border border-[#CAD7C5] text-xs font-semibold"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-neutral-900 mb-1">Kategori / Tag Kepemimpinan:</label>
                      <input
                        type="text"
                        value={currentOrg.tag}
                        onChange={(e) => {
                          const updated = [...orgs];
                          updated[activeOrgIdx] = { ...currentOrg, tag: e.target.value };
                          setData({ ...data, organizations: updated });
                        }}
                        className="w-full px-3.5 py-2 rounded-xl bg-white border border-[#CAD7C5] text-xs"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-neutral-900 mb-1">Link Website / Media (Opsional):</label>
                      <input
                        type="text"
                        value={currentOrg.link || ''}
                        onChange={(e) => {
                          const updated = [...orgs];
                          updated[activeOrgIdx] = { ...currentOrg, link: e.target.value };
                          setData({ ...data, organizations: updated });
                        }}
                        placeholder="https://..."
                        className="w-full px-3.5 py-2 rounded-xl bg-white border border-[#CAD7C5] text-xs font-mono"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-neutral-900 mb-1">Deskripsi Tanggung Jawab & Inisiatif:</label>
                    <textarea
                      rows={3}
                      value={currentOrg.desc}
                      onChange={(e) => {
                        const updated = [...orgs];
                        updated[activeOrgIdx] = { ...currentOrg, desc: e.target.value };
                        setData({ ...data, organizations: updated });
                      }}
                      className="w-full px-3.5 py-2 rounded-xl bg-white border border-[#CAD7C5] text-xs leading-relaxed"
                    />
                  </div>

                  {/* Highlights pills management */}
                  <div className="p-4 rounded-2xl bg-sage-50/40 border border-[#CAD7C5] space-y-3">
                    <label className="block text-xs font-bold text-neutral-900">
                      Poin Sorotan / Tag Highlight:
                    </label>
                    <div className="flex flex-wrap gap-2">
                      {currentOrg.highlights.map((hl, hIdx) => (
                        <span
                          key={hIdx}
                          className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-forest/30 bg-white text-xs font-semibold text-neutral-900"
                        >
                          <span>{hl}</span>
                          <button
                            type="button"
                            onClick={() => {
                              const updated = [...orgs];
                              const newHl = currentOrg.highlights.filter((_, i) => i !== hIdx);
                              updated[activeOrgIdx] = { ...currentOrg, highlights: newHl };
                              setData({ ...data, organizations: updated });
                            }}
                            className="w-4 h-4 rounded-full bg-rose-100 text-rose-900 hover:bg-forest-dark hover:text-white flex items-center justify-center text-[10px] font-bold transition-colors cursor-pointer"
                            title="Hapus sorotan ini"
                          >
                            ✕
                          </button>
                        </span>
                      ))}
                    </div>

                    <div className="flex items-center gap-2 pt-2">
                      <input
                        type="text"
                        value={newOrgHighlightInput}
                        onChange={(e) => setNewOrgHighlightInput(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') {
                            e.preventDefault();
                            if (newOrgHighlightInput.trim()) {
                              const updated = [...orgs];
                              updated[activeOrgIdx] = {
                                ...currentOrg,
                                highlights: [...currentOrg.highlights, newOrgHighlightInput.trim()],
                              };
                              setData({ ...data, organizations: updated });
                              setNewOrgHighlightInput('');
                            }
                          }
                        }}
                        placeholder="Ketik tag sorotan baru lalu tekan Enter..."
                        className="flex-1 px-3 py-1.5 rounded-xl bg-white border border-[#CAD7C5] text-xs"
                      />
                      <button
                        type="button"
                        onClick={() => {
                          if (newOrgHighlightInput.trim()) {
                            const updated = [...orgs];
                            updated[activeOrgIdx] = {
                              ...currentOrg,
                              highlights: [...currentOrg.highlights, newOrgHighlightInput.trim()],
                            };
                            setData({ ...data, organizations: updated });
                            setNewOrgHighlightInput('');
                          }
                        }}
                        className="px-4 py-1.5 rounded-xl bg-forest text-white text-xs font-bold cursor-pointer"
                      >
                        + Tambah
                      </button>
                    </div>
                  </div>

                  {/* Multi-Image Gallery for Organization */}
                  <MultiImageGalleryField
                    label="Galeri Foto Dokumentasi Kegiatan Organisasi (Auto-slide & Modal):"
                    images={currentOrg.images || []}
                    onChange={(newImages) => {
                      const updated = [...orgs];
                      updated[activeOrgIdx] = { ...currentOrg, images: newImages };
                      setData({ ...data, organizations: updated });
                    }}
                    aspectRatio="landscape"
                    helperText="Upload sebanyak mungkin foto dokumentasi kegiatan (bisa 3, 5, 10+ foto). Foto akan otomatis berputar di carousel dan bisa dibuka di modal galeri!"
                  />

                  <div className="pt-4 border-t border-[#CAD7C5]/60 flex items-center justify-between">
                    <button
                      type="button"
                      onClick={() => {
                        if (orgs.length <= 1) {
                          alert('Minimal harus ada 1 riwayat peran organisasi.');
                          return;
                        }
                        if (window.confirm(`Yakin ingin menghapus peran organisasi "${currentOrg.role}"?`)) {
                          const updated = orgs.filter((_, i) => i !== activeOrgIdx);
                          setData({ ...data, organizations: updated });
                          setActiveOrgIdx(Math.max(0, activeOrgIdx - 1));
                        }
                      }}
                      className="px-3 py-1.5 rounded-lg text-xs font-medium text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer"
                    >
                      Hapus Peran Organisasi Ini
                    </button>

                    <button
                      onClick={handleSave}
                      className="px-6 py-2.5 rounded-full bg-forest text-white text-xs font-bold hover:bg-forest-dark transition-colors shadow-sm cursor-pointer"
                    >
                      Simpan Perubahan Organisasi ✦
                    </button>
                  </div>
                </div>
              );
            })()}
          </div>
        )}

        {/* ================================================================= */}
        {/* TAB: KEAHLIAN & KOMPETENSI (HARD SKILLS & SOFT SKILLS)            */}
        {/* ================================================================= */}
        {activeTab === 'skills' && (
          <div className="bg-white rounded-3xl p-6 sm:p-8 lg:p-10 border border-[#CAD7C5] shadow-sm space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h2 className="font-serif text-xl font-bold text-neutral-900">
                  Pengaturan Keahlian (Hard Skills & Soft Skills)
                </h2>
                <p className="text-xs text-neutral-500 mt-1">
                  Kelola daftar keahlian berdasarkan kategori: IT & Digital Systems, Bisnis & Manajemen Strategis, Konten Kreator, dan Personal Mastery.
                </p>
              </div>

              <div className="flex items-center gap-3">
                <span className="text-xs font-mono bg-sage-50 text-neutral-900 font-bold px-3 py-1.5 rounded-full border border-[#CAD7C5]">
                  {data.skills?.reduce((acc, cat) => acc + cat.skills.length, 0) || 0} Total Skills
                </span>
                <button
                  type="button"
                  onClick={() => {
                    const currentSkills = data.skills || DEFAULT_PORTFOLIO_DATA.skills || [];
                    const newCat: SkillCategory = {
                      id: `cat-${Date.now()}`,
                      title: 'Kategori Keahlian Baru',
                      subtitle: 'Competency Area',
                      type: 'hard',
                      icon: '',
                      badgeColor: 'bg-emerald-100 text-emerald-900 border-emerald-300',
                      description: 'Deskripsi bidang kompetensi dan keahlian.',
                      skills: ['Skill 1', 'Skill 2', 'Skill 3'],
                    };
                    const updated = [...currentSkills, newCat];
                    setData({ ...data, skills: updated });
                    setActiveSkillIdx(updated.length - 1);
                  }}
                  className="px-4 py-1.5 rounded-full text-xs font-bold bg-forest text-white hover:bg-forest-dark transition-colors shadow-2xs shrink-0 cursor-pointer"
                >
                  + Tambah Kategori
                </button>
              </div>
            </div>

            {/* Category Selector Tabs */}
            <div className="flex flex-wrap gap-2 border-b border-[#CAD7C5]/70 pb-4">
              {data.skills?.map((cat, idx) => (
                <button
                  key={cat.id}
                  onClick={() => setActiveSkillIdx(idx)}
                  className={`px-4 py-1.5 rounded-full text-xs font-bold transition-all flex items-center gap-1.5 ${
                    activeSkillIdx === idx
                      ? 'bg-forest text-white shadow-xs'
                      : 'bg-sage-50 text-neutral-600 hover:bg-[D2DEC9]'
                  }`}
                >
                  <span>{cat.icon}</span>
                  <span>{cat.title.split('&')[0].trim()}</span>
                  <span className="text-[10px] opacity-75">({cat.skills.length})</span>
                </button>
              ))}
            </div>

            {/* Active Category Skills Editor */}
            {data.skills && data.skills[activeSkillIdx] && (
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="md:col-span-2">
                    <label className="block text-xs font-bold text-neutral-900 mb-1">Nama Kategori Keahlian:</label>
                    <input
                      type="text"
                      value={data.skills[activeSkillIdx].title}
                      onChange={(e) => {
                        const updated = [...(data.skills || [])];
                        updated[activeSkillIdx].title = e.target.value;
                        setData({ ...data, skills: updated });
                      }}
                      className="w-full px-3.5 py-2 rounded-xl bg-white border border-[#CAD7C5] text-xs font-serif font-bold text-neutral-900"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-neutral-900 mb-1">Tipe / Subtitle:</label>
                    <input
                      type="text"
                      value={data.skills[activeSkillIdx].subtitle}
                      onChange={(e) => {
                        const updated = [...(data.skills || [])];
                        updated[activeSkillIdx].subtitle = e.target.value;
                        setData({ ...data, skills: updated });
                      }}
                      className="w-full px-3.5 py-2 rounded-xl bg-white border border-[#CAD7C5] text-xs"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-neutral-900 mb-1">Deskripsi Ringkas Kategori:</label>
                  <textarea
                    rows={2}
                    value={data.skills[activeSkillIdx].description}
                    onChange={(e) => {
                      const updated = [...(data.skills || [])];
                      updated[activeSkillIdx].description = e.target.value;
                      setData({ ...data, skills: updated });
                    }}
                    className="w-full px-3.5 py-2 rounded-xl bg-white border border-[#CAD7C5] text-xs leading-relaxed"
                  />
                </div>

                {/* Pill Badges Management Area */}
                <div className="p-5 rounded-2xl bg-sage-50/40 border border-[#CAD7C5] space-y-4">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <div>
                      <h4 className="font-serif font-bold text-sm text-neutral-900">
                        Daftar Badge Keahlian ({data.skills[activeSkillIdx].skills.length})
                      </h4>
                      <p className="text-[11px] text-neutral-500">
                        Klik tombol tanda silang ✕ pada pill untuk menghapus, atau gunakan formulir di bawah untuk menambah skill baru.
                      </p>
                    </div>
                  </div>

                  {/* Badges List with Remove button */}
                  <div className="flex flex-wrap gap-2 pt-1">
                    {data.skills[activeSkillIdx].skills.map((skill, sIdx) => (
                      <span
                        key={sIdx}
                        className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-forest/30 bg-white text-xs font-semibold text-neutral-900 shadow-2xs hover:border-sage-700 transition-all"
                      >
                        <span>{skill}</span>
                        <button
                          type="button"
                          onClick={() => {
                            const updated = [...(data.skills || [])];
                            updated[activeSkillIdx].skills = updated[activeSkillIdx].skills.filter((_, i) => i !== sIdx);
                            setData({ ...data, skills: updated });
                          }}
                          className="w-4 h-4 rounded-full bg-rose-100 text-rose-900 hover:bg-forest-dark hover:text-white flex items-center justify-center text-[10px] font-bold transition-colors cursor-pointer"
                          title="Hapus skill ini"
                        >
                          ✕
                        </button>
                      </span>
                    ))}
                  </div>

                  {/* Add New Skill Input */}
                  <div className="pt-3 border-t border-[#CAD7C5]/60 flex items-center gap-2">
                    <input
                      type="text"
                      value={newSkillInput}
                      onChange={(e) => setNewSkillInput(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          e.preventDefault();
                          if (newSkillInput.trim()) {
                            const updated = [...(data.skills || [])];
                            updated[activeSkillIdx].skills = [...updated[activeSkillIdx].skills, newSkillInput.trim()];
                            setData({ ...data, skills: updated });
                            setNewSkillInput('');
                          }
                        }
                      }}
                      placeholder="Ketik nama skill baru lalu tekan Enter / klik Tambah..."
                      className="flex-1 px-3.5 py-2 rounded-xl bg-white border border-[#CAD7C5] text-xs font-medium text-neutral-900 shadow-inner"
                    />
                    <button
                      type="button"
                      onClick={() => {
                        if (newSkillInput.trim()) {
                          const updated = [...(data.skills || [])];
                          updated[activeSkillIdx].skills = [...updated[activeSkillIdx].skills, newSkillInput.trim()];
                          setData({ ...data, skills: updated });
                          setNewSkillInput('');
                        }
                      }}
                      className="px-4 py-2 rounded-xl bg-forest hover:bg-forest text-white text-xs font-bold transition-all shadow-xs shrink-0 cursor-pointer"
                    >
                      + Tambah Skill
                    </button>
                  </div>
                </div>

                <div className="pt-4 border-t border-[#CAD7C5]/60 flex items-center justify-between">
                  <button
                    type="button"
                    onClick={() => {
                      if ((data.skills || []).length <= 1) {
                        alert('Minimal harus ada 1 kategori keahlian.');
                        return;
                      }
                      const currentCat = data.skills?.[activeSkillIdx];
                      if (window.confirm(`Yakin ingin menghapus kategori keahlian "${currentCat?.title}"?`)) {
                        const updated = (data.skills || []).filter((_, i) => i !== activeSkillIdx);
                        setData({ ...data, skills: updated });
                        setActiveSkillIdx(Math.max(0, activeSkillIdx - 1));
                      }
                    }}
                    className="px-3 py-1.5 rounded-lg text-xs font-medium text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer"
                  >
                    Hapus Kategori Ini
                  </button>

                  <button
                    onClick={handleSave}
                    className="px-6 py-2.5 rounded-full bg-forest text-white text-xs font-bold hover:bg-forest-dark transition-colors shadow-sm cursor-pointer"
                  >
                    Simpan Perubahan Keahlian ✦
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
          <div className="bg-white rounded-3xl p-6 sm:p-8 lg:p-10 border border-[#CAD7C5] shadow-sm space-y-6">
            <div>
              <h2 className="font-serif text-xl font-bold text-neutral-900">
                Pengaturan Stage Video & Foto Mockup HP Kreator
              </h2>
              <p className="text-xs text-neutral-500 mt-1">
                Atur tautan video YouTube di tengah, toggle adaptif (apakah 2 HP saja atau 3 perangkat), dan ubah foto-foto pada layar mockup.
              </p>
            </div>

            {/* Account Selector Pill & Add Account Button */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#CAD7C5]/70 pb-4">
              <div className="flex flex-wrap gap-2">
                {Object.keys(data.creatorAccounts).map((key) => (
                  <button
                    key={key}
                    onClick={() => setActiveCreatorKey(key)}
                    className={`px-4 py-1.5 rounded-full text-xs font-bold transition-all ${
                      activeCreatorKey === key
                        ? 'bg-forest text-white shadow-xs'
                        : 'bg-sage-50 text-neutral-600 hover:bg-[D2DEC9]'
                    }`}
                  >
                    {data.creatorAccounts[key].name}
                  </button>
                ))}
              </div>

              <button
                type="button"
                onClick={() => {
                  const newKey = `brand_${Date.now()}`;
                  const newAcc = {
                    name: 'Brand Kreator Baru',
                    handle: '@brand.kreator',
                    tag: 'Lifestyle, Creative & Storytelling',
                    platforms: 'Instagram Reels & TikTok',
                    stats: '12K+ Monthly Reach • High Engagement',
                    hasCenterStage: true,
                    centerLink: 'https://youtube.com',
                    centerImg: '/5.png',
                    centerTitle: 'Brand Storytelling & Video Showcase',
                    centerDesc: 'Mengeksplorasi pembuatan video kreatif, lifestyle content, dan visual storytelling.',
                    leftPhoneImg: '/4.png',
                    leftPhoneTitle: 'Reels & Aesthetics',
                    leftPhoneTag: 'Instagram',
                    leftPhoneLink: '',
                    rightPhoneImg: '/6.png',
                    rightPhoneTitle: 'Short-Form Video',
                    rightPhoneTag: 'TikTok',
                    rightPhoneLink: '',
                    link: 'https://instagram.com',
                  };
                  setData({
                    ...data,
                    creatorAccounts: {
                      ...data.creatorAccounts,
                      [newKey]: newAcc,
                    },
                  });
                  setActiveCreatorKey(newKey);
                }}
                className="px-4 py-1.5 rounded-full text-xs font-bold bg-forest text-white hover:bg-forest-dark transition-colors shadow-2xs shrink-0 cursor-pointer"
              >
                + Tambah Akun Kreator
              </button>
            </div>

            {/* Selected Creator Settings */}
            {data.creatorAccounts[activeCreatorKey] && (
              <div className="space-y-6">
                {/* Account Profile Header Fields */}
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 p-4 rounded-2xl bg-sage-50/40 border border-[#CAD7C5]">
                  <div>
                    <label className="block text-xs font-bold text-neutral-900 mb-1">Nama Brand / Akun:</label>
                    <input
                      type="text"
                      value={data.creatorAccounts[activeCreatorKey].name}
                      onChange={(e) => {
                        const updated = { ...data.creatorAccounts };
                        updated[activeCreatorKey].name = e.target.value;
                        setData({ ...data, creatorAccounts: updated });
                      }}
                      className="w-full px-3 py-1.5 rounded-xl bg-white border border-[#CAD7C5] text-xs font-bold"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-neutral-900 mb-1">Handle Username:</label>
                    <input
                      type="text"
                      value={data.creatorAccounts[activeCreatorKey].handle}
                      onChange={(e) => {
                        const updated = { ...data.creatorAccounts };
                        updated[activeCreatorKey].handle = e.target.value;
                        setData({ ...data, creatorAccounts: updated });
                      }}
                      className="w-full px-3 py-1.5 rounded-xl bg-white border border-[#CAD7C5] text-xs font-mono text-rose-900 font-bold"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-neutral-900 mb-1">Niche / Tag Kategori:</label>
                    <input
                      type="text"
                      value={data.creatorAccounts[activeCreatorKey].tag}
                      onChange={(e) => {
                        const updated = { ...data.creatorAccounts };
                        updated[activeCreatorKey].tag = e.target.value;
                        setData({ ...data, creatorAccounts: updated });
                      }}
                      className="w-full px-3 py-1.5 rounded-xl bg-white border border-[#CAD7C5] text-xs"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-neutral-900 mb-1">Platform Utama:</label>
                    <input
                      type="text"
                      value={data.creatorAccounts[activeCreatorKey].platforms}
                      onChange={(e) => {
                        const updated = { ...data.creatorAccounts };
                        updated[activeCreatorKey].platforms = e.target.value;
                        setData({ ...data, creatorAccounts: updated });
                      }}
                      className="w-full px-3 py-1.5 rounded-xl bg-white border border-[#CAD7C5] text-xs"
                    />
                  </div>
                </div>

                {/* Adaptive Stage Toggle */}
                <div className="p-5 rounded-2xl bg-amber-50 border border-amber-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div>
                    <span className="text-[10px] uppercase font-bold text-amber-900 bg-amber-200/70 px-2 py-0.5 rounded-full tracking-wider">
                      Fitur Adaptif Stage Tengah
                    </span>
                    <h4 className="font-bold text-sm text-neutral-900 mt-1">
                      Tampilkan Video / Mockup Landscape di Tengah?
                    </h4>
                    <p className="text-xs text-neutral-500 mt-0.5">
                      {data.creatorAccounts[activeCreatorKey].hasCenterStage 
                        ? '✦ Aktif: Menampilkan 3 perangkat (HP Kiri + Video Landscape Tengah + HP Kanan).'
                        : 'Mode 2 HP: Belum ada video landscape (seperti Dua Sisi Laundry), sehingga hanya menampilkan 2 HP di tengah secara rapi & seimbang.'
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
                        : 'bg-forest text-white'
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
                    <label className="block text-xs font-bold text-neutral-900 mb-1">
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
                    <label className="block text-xs font-bold text-neutral-900 mb-1">
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
                    <label className="block text-xs font-bold text-neutral-900 mb-1">
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
                    <label className="block text-xs font-bold text-neutral-900 mb-1">
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
                <div className="p-5 rounded-2xl bg-sage-50/40 border border-[#CAD7C5] space-y-4">
                  <div className="flex items-center justify-between">
                    <h4 className="font-serif font-bold text-sm text-neutral-900">
                      Foto Mockup HP Kiri, Layar Tengah & HP Kanan
                    </h4>
                    <span className="text-[11px] text-rose-900 font-medium">
                      Bisa langsung upload file dari laptop
                    </span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
                    {/* Left Phone Photo */}
                    <ImageUploadField
                      label="Foto HP Kiri (Instagram Reels):"
                      value={data.creatorAccounts[activeCreatorKey].leftPhoneImg}
                      onChange={(newUrl) => {
                        const updated = { ...data.creatorAccounts };
                        updated[activeCreatorKey].leftPhoneImg = newUrl;
                        setData({ ...data, creatorAccounts: updated });
                      }}
                      aspectRatio="phone"
                      helperText="Rasio 9:16 (Vertikal Layar HP)"
                    />

                    {/* Center Landscape Photo */}
                    <ImageUploadField
                      label="Foto Layar Tengah (Landscape):"
                      value={data.creatorAccounts[activeCreatorKey].centerImg}
                      onChange={(newUrl) => {
                        const updated = { ...data.creatorAccounts };
                        updated[activeCreatorKey].centerImg = newUrl;
                        setData({ ...data, creatorAccounts: updated });
                      }}
                      aspectRatio="landscape"
                      helperText="Rasio 16:10 / 16:9 (Layar Video Utama)"
                    />

                    {/* Right Phone Photo */}
                    <ImageUploadField
                      label="Foto HP Kanan (TikTok Shorts):"
                      value={data.creatorAccounts[activeCreatorKey].rightPhoneImg}
                      onChange={(newUrl) => {
                        const updated = { ...data.creatorAccounts };
                        updated[activeCreatorKey].rightPhoneImg = newUrl;
                        setData({ ...data, creatorAccounts: updated });
                      }}
                      aspectRatio="phone"
                      helperText="Rasio 9:16 (Vertikal Layar HP)"
                    />
                  </div>
                </div>

                <div className="pt-3 border-t border-[#CAD7C5]/60 flex items-center justify-between">
                  <button
                    type="button"
                    onClick={() => {
                      const keys = Object.keys(data.creatorAccounts);
                      if (keys.length <= 1) {
                        alert('Minimal harus ada 1 akun kreator.');
                        return;
                      }
                      if (window.confirm(`Yakin ingin menghapus akun kreator "${data.creatorAccounts[activeCreatorKey]?.name}"?`)) {
                        const updated = { ...data.creatorAccounts };
                        delete updated[activeCreatorKey];
                        const remainingKeys = Object.keys(updated);
                        setData({ ...data, creatorAccounts: updated });
                        setActiveCreatorKey(remainingKeys[0] || 'personal');
                      }
                    }}
                    className="px-3 py-1.5 rounded-lg text-xs font-medium text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer"
                  >
                    Hapus Akun Kreator Ini
                  </button>

                  <button
                    onClick={handleSave}
                    className="px-6 py-2.5 rounded-full bg-forest text-white text-xs font-bold hover:bg-forest-dark transition-colors shadow-sm cursor-pointer"
                  >
                    Simpan Perubahan Creator Studio ✦
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
          <div className="bg-white rounded-3xl p-6 sm:p-8 lg:p-10 border border-[#CAD7C5] shadow-sm space-y-6">
            <div>
              <h2 className="font-serif text-xl font-bold text-neutral-900">
                Pengaturan Seluruh Sosial Media & Kontak Pribadi
              </h2>
              <p className="text-xs text-neutral-500 mt-1">
                Ubah link dan akun kamu di sini. Semua perubahan akan langsung aktif di bagian Footer & Kontak portofolio.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div className="p-4 rounded-2xl bg-sage-50/40 border border-[#CAD7C5]/60 space-y-2">
                <span className="text-xs font-bold text-rose-900">Instagram</span>
                <input
                  type="text"
                  value={data.socials.instagram}
                  onChange={(e) => setData({
                    ...data,
                    socials: { ...data.socials, instagram: e.target.value }
                  })}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-[#CAD7C5] text-xs text-neutral-900 font-mono"
                />
              </div>

              <div className="p-4 rounded-2xl bg-sage-50/40 border border-[#CAD7C5]/60 space-y-2">
                <span className="text-xs font-bold text-neutral-900">TikTok</span>
                <input
                  type="text"
                  value={data.socials.tiktok}
                  onChange={(e) => setData({
                    ...data,
                    socials: { ...data.socials, tiktok: e.target.value }
                  })}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-[#CAD7C5] text-xs text-neutral-900 font-mono"
                />
              </div>

              <div className="p-4 rounded-2xl bg-sage-50/40 border border-[#CAD7C5]/60 space-y-2">
                <span className="text-xs font-bold text-red-700">YouTube Channel</span>
                <input
                  type="text"
                  value={data.socials.youtube}
                  onChange={(e) => setData({
                    ...data,
                    socials: { ...data.socials, youtube: e.target.value }
                  })}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-[#CAD7C5] text-xs text-neutral-900 font-mono"
                />
              </div>

              <div className="p-4 rounded-2xl bg-sage-50/40 border border-[#CAD7C5]/60 space-y-2">
                <span className="text-xs font-bold text-neutral-900">Medium</span>
                <input
                  type="text"
                  value={data.socials.medium}
                  onChange={(e) => setData({
                    ...data,
                    socials: { ...data.socials, medium: e.target.value }
                  })}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-[#CAD7C5] text-xs text-neutral-900 font-mono"
                />
              </div>

              <div className="p-4 rounded-2xl bg-sage-50/40 border border-[#CAD7C5]/60 space-y-2">
                <span className="text-xs font-bold text-neutral-900">Email</span>
                <input
                  type="email"
                  value={data.socials.email}
                  onChange={(e) => setData({
                    ...data,
                    socials: { ...data.socials, email: e.target.value }
                  })}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-[#CAD7C5] text-xs text-neutral-900 font-mono"
                />
              </div>

              <div className="p-4 rounded-2xl bg-sage-50/40 border border-[#CAD7C5]/60 space-y-2">
                <span className="text-xs font-bold text-emerald-800">WhatsApp Langsung</span>
                <input
                  type="text"
                  value={data.socials.whatsapp}
                  onChange={(e) => setData({
                    ...data,
                    socials: { ...data.socials, whatsapp: e.target.value }
                  })}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-[#CAD7C5] text-xs text-neutral-900 font-mono"
                />
              </div>

              <div className="col-span-1 md:col-span-2 p-4 rounded-2xl bg-sage-50/40 border border-[#CAD7C5]/60 space-y-2">
                <span className="text-xs font-bold text-blue-800">LinkedIn</span>
                <input
                  type="text"
                  value={data.socials.linkedin}
                  onChange={(e) => setData({
                    ...data,
                    socials: { ...data.socials, linkedin: e.target.value }
                  })}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-[#CAD7C5] text-xs text-neutral-900 font-mono"
                />
              </div>
            </div>

            <div className="pt-4 flex justify-end">
              <button
                onClick={handleSave}
                className="px-6 py-2.5 rounded-full bg-forest text-white text-xs font-bold hover:bg-forest-dark transition-colors shadow-sm cursor-pointer"
              >
                Simpan Perubahan Sosial Media ✦
              </button>
            </div>
          </div>
        )}

        {/* ================================================================= */}
        {/* TAB 6: PANDUAN CARA GANTI FOTO (MENGGUNAKAN FOTO SENDIRI)          */}
        {/* ================================================================= */}
        {activeTab === 'photoguide' && (
          <div className="bg-white rounded-3xl p-6 sm:p-8 lg:p-10 border border-[#CAD7C5] shadow-sm space-y-6">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-100 text-amber-900 font-bold text-xs">
              <span>Tips Praktis Pengelolaan Foto</span>
            </div>
            <h2 className="font-serif text-2xl font-bold text-neutral-900">
              Bagaimana Cara Mengganti Foto dengan Foto Sendiri?
            </h2>
            <p className="text-xs text-neutral-500 leading-relaxed max-w-2xl">
              Di sistem portofolio ini, kamu punya <strong>2 cara super mudah</strong> untuk menampilkan foto aslimu (foto wisuda, foto dokumentasi lomba, foto produk, sertifikat, dll):
            </p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              {/* Cara 1: Langsung Upload dari Laptop (FITUR UTAMA) */}
              <div className="p-5 rounded-2xl bg-emerald-50/70 border-2 border-emerald-300 space-y-3 shadow-xs">
                <div className="flex items-center gap-2">
                  <span className="w-7 h-7 rounded-full bg-forest text-white flex items-center justify-center font-bold text-xs">✦</span>
                  <h4 className="font-bold text-sm text-neutral-900">Cara 1: Langsung Upload dari Laptop (Paling Praktis)</h4>
                </div>
                <p className="text-xs text-neutral-600 leading-relaxed">
                  Sekarang kamu <strong>tidak perlu mengetik nama file atau memindah manual</strong>.
                </p>
                <div className="text-xs text-neutral-900/85 space-y-1.5 bg-white p-3.5 rounded-xl border border-emerald-200">
                  <p className="font-bold text-emerald-800">Langkah-langkah:</p>
                  <p>1. Klik tombol <strong>&ldquo;Pilih dari Laptop&rdquo;</strong> atau seret langsung file fotomu ke kotak garis putus-putus.</p>
                  <p>2. Foto otomatis dikompres agar website tetap super cepat dan ringan.</p>
                  <p>3. Preview langsung muncul seketika!</p>
                  <p>4. Klik tombol <strong>&ldquo;Simpan Data&rdquo;</strong> di pojok kanan atas.</p>
                </div>
              </div>

              {/* Cara 2: Menggunakan Folder Public */}
              <div className="p-5 rounded-2xl bg-sage-50/50 border border-[#CAD7C5] space-y-3">
                <div className="flex items-center gap-2">
                  <span className="w-7 h-7 rounded-full bg-forest text-white flex items-center justify-center font-bold text-xs">2</span>
                  <h4 className="font-bold text-sm text-neutral-900">Cara 2: Folder <code>public/</code></h4>
                </div>
                <p className="text-xs text-neutral-600 leading-relaxed">
                  Bila ingin mengorganisir file secara manual di proyek:
                </p>
                <div className="text-xs text-neutral-900/75 space-y-1 bg-white p-3 rounded-xl border border-[#CAD7C5]/60">
                  <p>1. Simpan foto ke folder <code>public/</code> (contoh: <code>foto-wisuda.jpg</code>).</p>
                  <p>2. Klik <em>&ldquo;Tautan / Path Manual&rdquo;</em> di bawah foto.</p>
                  <p>3. Ketik <code>/foto-wisuda.jpg</code>.</p>
                </div>
              </div>

              {/* Cara 3: Menggunakan Link URL Gambar Online */}
              <div className="p-5 rounded-2xl bg-sage-50/50 border border-[#CAD7C5] space-y-3">
                <div className="flex items-center gap-2">
                  <span className="w-7 h-7 rounded-full bg-forest text-white flex items-center justify-center font-bold text-xs">3</span>
                  <h4 className="font-bold text-sm text-neutral-900">Cara 3: Link Gambar Online (URL)</h4>
                </div>
                <p className="text-xs text-neutral-600 leading-relaxed">
                  Jika foto sudah tersimpan di web hosting / cloud:
                </p>
                <div className="text-xs text-neutral-900/75 space-y-1 bg-white p-3 rounded-xl border border-[#CAD7C5]/60">
                  <p>1. Copy link URL langsung gambarnya (misal Unsplash/Cloudinary).</p>
                  <p>2. Buka <em>&ldquo;Tautan / Path Manual&rdquo;</em> dan tempel URL.</p>
                  <p>3. Klik Simpan Data.</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ================================================================= */}
        {/* TAB 7: SUPABASE + VERCEL (ARSITEKTUR HILMAN JTI)                  */}
        {/* ================================================================= */}
        {activeTab === 'supabase' && (
          <div className="bg-white rounded-3xl p-6 sm:p-8 lg:p-10 border border-[#CAD7C5] shadow-sm space-y-6">
            <div className="flex items-start justify-between gap-4">
              <div>
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-100 text-emerald-900 font-bold text-xs mb-2">
                  <span>Rekomendasi Konfigurasi Database</span>
                </div>
                <h2 className="font-serif text-2xl font-bold text-neutral-900">
                  Arsitektur Vercel + Supabase Cloud Database
                </h2>
                <p className="text-xs text-neutral-500 mt-1 max-w-2xl leading-relaxed">
                  Frontend dihosting di Vercel (sangat cepat & gratis), sedangkan data tersimpan di Supabase (PostgreSQL gratis).
                </p>
              </div>

              <span className="text-3xl text-rose-600 hidden sm:block">✦</span>
            </div>

            <div className={`p-5 rounded-2xl border ${isSupabaseConfigured ? 'bg-emerald-50 border-emerald-300' : 'bg-amber-50 border-amber-300'}`}>
              <div className="flex items-center gap-2 font-bold text-xs mb-1">
                <span>{isSupabaseConfigured ? 'Terhubung' : 'Belum Terhubung'}</span>
                <span className={isSupabaseConfigured ? 'text-emerald-900' : 'text-amber-900'}>
                  {isSupabaseConfigured 
                    ? 'Status: Terhubung ke Supabase Cloud (Live Sync Aktif!)' 
                    : 'Status: Mode Penyimpanan Lokal (Supabase belum dikonfigurasi)'}
                </span>
              </div>
              <p className="text-xs text-neutral-900/90 leading-relaxed">
                {isSupabaseConfigured
                  ? 'Setiap kali kamu mengklik "Simpan Data", data otomatis tersinkronisasi ke database cloud Supabase Anda sekaligus ke browser lokal!'
                  : 'Saat ini studio beroperasi menggunakan penyimpanan lokal browser (localStorage). Ikuti 4 langkah di bawah ini untuk menghubungkan ke database Supabase agar konten bisa diedit dari mana saja dan tersimpan aman di cloud.'}
              </p>
            </div>

            <div className="space-y-4 pt-2">
              <h3 className="font-serif text-base font-bold text-neutral-900">
                Langkah-Langkah Menghubungkan ke Supabase:
              </h3>

              <div className="space-y-4 text-xs text-neutral-600 font-source">
                {/* Langkah 1 */}
                <div className="p-4 rounded-xl bg-sage-50/40 border border-[#CAD7C5]/70 space-y-1.5">
                  <div className="flex items-center gap-2">
                    <span className="w-5 h-5 rounded-full bg-forest text-white flex items-center justify-center font-bold text-[10px]">1</span>
                    <p className="font-bold text-neutral-900 text-sm">Buat Proyek Baru di Supabase</p>
                  </div>
                  <p>Buka <a href="https://supabase.com" target="_blank" rel="noopener noreferrer" className="text-rose-900 underline font-bold">supabase.com</a>, login / buat akun gratis, lalu klik tombol <strong>New Project</strong>.</p>
                  <p className="text-[11px] text-neutral-500">Beri nama proyek (misal: <em>chikal-portfolio</em>) dan simpan password database Anda.</p>
                </div>

                {/* Langkah 2 */}
                <div className="p-4 rounded-xl bg-sage-50/40 border border-[#CAD7C5]/70 space-y-2">
                  <div className="flex items-center gap-2">
                    <span className="w-5 h-5 rounded-full bg-forest text-white flex items-center justify-center font-bold text-[10px]">2</span>
                    <p className="font-bold text-neutral-900 text-sm">Jalankan SQL Schema di SQL Editor</p>
                  </div>
                  <p>Di dashboard Supabase proyekmu, klik menu <strong>SQL Editor</strong> di sidebar kiri, lalu klik <strong>New Query</strong>. Salin & tempel kode SQL di bawah ini, lalu klik <strong>Run</strong>:</p>
                  <pre className="p-3 bg-black/90 text-emerald-400 font-mono text-[11px] rounded-lg overflow-x-auto select-all leading-relaxed">
{`-- 1. Buat Tabel portfolio_content
create table if not exists public.portfolio_content (
  id text primary key default 'main',
  content jsonb not null,
  updated_at timestamp with time zone default timezone('utc'::text, now())
);

-- 2. Aktifkan Row Level Security (RLS)
alter table public.portfolio_content enable row level security;

-- 3. Policy agar publik bisa membaca konten portofolio
create policy "Allow public read access"
  on public.portfolio_content for select using (true);

-- 4. Policy agar admin bisa menyimpan data
create policy "Allow public update access"
  on public.portfolio_content for update using (true) with check (true);

create policy "Allow public insert access"
  on public.portfolio_content for insert with check (true);

-- 5. Masukkan data inisial
insert into public.portfolio_content (id, content)
values ('main', '{}'::jsonb)
on conflict (id) do nothing;`}
                  </pre>
                  <p className="text-[11px] text-emerald-800">Kode SQL di atas juga tersedia di file project: <code>supabase-schema.sql</code>.</p>
                </div>

                {/* Langkah 3 */}
                <div className="p-4 rounded-xl bg-sage-50/40 border border-[#CAD7C5]/70 space-y-2">
                  <div className="flex items-center gap-2">
                    <span className="w-5 h-5 rounded-full bg-forest text-white flex items-center justify-center font-bold text-[10px]">3</span>
                    <p className="font-bold text-neutral-900 text-sm">Ambil Project URL dan Anon Key</p>
                  </div>
                  <p>Di dashboard Supabase, klik menu <strong>Project Settings</strong> (ikon gerigi di kiri bawah) ➔ <strong>API</strong>. Salin 2 nilai berikut:</p>
                  <ul className="list-disc pl-5 space-y-1 text-xs">
                    <li><strong>Project URL</strong> (contoh: <code>https://xyzcompany.supabase.co</code>)</li>
                    <li><strong>Project API Keys</strong> ➔ bagian <strong>anon / public</strong> (kunci panjang berawalan <code>ey...</code>)</li>
                  </ul>
                </div>

                {/* Langkah 4 */}
                <div className="p-4 rounded-xl bg-sage-50/40 border border-[#CAD7C5]/70 space-y-2">
                  <div className="flex items-center gap-2">
                    <span className="w-5 h-5 rounded-full bg-forest text-white flex items-center justify-center font-bold text-[10px]">4</span>
                    <p className="font-bold text-neutral-900 text-sm">Pasang di Environment Variables</p>
                  </div>
                  <p className="font-semibold text-neutral-900">A. Untuk Pengujian Lokal di Laptop:</p>
                  <p>Buat atau buka file <code>.env.local</code> di folder utama proyek, lalu isi:</p>
                  <div className="font-mono text-[11px] bg-white p-2.5 rounded-lg border border-[#CAD7C5] space-y-1">
                    <p className="text-neutral-900"><code>NEXT_PUBLIC_SUPABASE_URL=https://proyek-kamu.supabase.co</code></p>
                    <p className="text-neutral-900"><code>NEXT_PUBLIC_SUPABASE_ANON_KEY=ey...anon_key_kamu</code></p>
                  </div>

                  <p className="font-semibold text-neutral-900 pt-1">B. Untuk Saat Website Tayang di Vercel:</p>
                  <p>Buka dashboard proyek di <strong>Vercel</strong> ➔ <strong>Settings</strong> ➔ <strong>Environment Variables</strong>, tambahkan 2 variabel yang sama persis di atas.</p>
                </div>
              </div>
            </div>

            <div className="pt-6 border-t border-[#CAD7C5]/60 flex items-center justify-between">
              <span className="text-xs text-neutral-500 italic">
                Ingin membatalkan semua editan dan kembali ke data asli?
              </span>
              <button
                onClick={handleReset}
                className="px-4 py-2 rounded-full text-xs font-bold text-rose-900 hover:bg-rose-100/60 border border-rose-dusty/40 transition-colors cursor-pointer"
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
