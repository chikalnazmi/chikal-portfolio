'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { 
  getPortfolioData, 
  fetchPortfolioDataFromSupabase,
  subscribeToPortfolioUpdates, 
  DEFAULT_PORTFOLIO_DATA, 
  PortfolioData 
} from '@/lib/portfolio-store';

export default function Home() {
  // Modal state for certificates and documentation
  const [modalData, setModalData] = useState<{
    isOpen: boolean;
    title: string;
    category: string;
    description: string;
    images: string[];
    link?: string;
    linkLabel?: string;
  }>({
    isOpen: false,
    title: '',
    category: '',
    description: '',
    images: [],
    link: undefined,
    linkLabel: undefined,
  });

  // Dynamic portfolio store state (synced with /admin and Supabase in real-time)
  const [portfolioData, setPortfolioData] = useState<PortfolioData>(DEFAULT_PORTFOLIO_DATA);

  useEffect(() => {
    setPortfolioData(getPortfolioData());
    fetchPortfolioDataFromSupabase().then((remoteData) => {
      if (remoteData) {
        setPortfolioData(remoteData);
      }
    });
    const unsubscribe = subscribeToPortfolioUpdates((newData) => {
      setPortfolioData(newData);
    });
    return () => unsubscribe();
  }, []);

  // Mobile menu state
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Active filter in Selected Works
  const [activeProjectFilter, setActiveProjectFilter] = useState<string>('all');

  // Active filter for Awards & Accreditations
  const [activeAwardFilter, setActiveAwardFilter] = useState<'all' | '1st' | '2nd' | 'top5'>('all');

  // Active image index in modal
  const [activeModalImgIdx, setActiveModalImgIdx] = useState(0);

  // Derived lists from store
  const experiencesList = (portfolioData.experiences && portfolioData.experiences.length > 0)
    ? portfolioData.experiences
    : DEFAULT_PORTFOLIO_DATA.experiences!;

  const projectsList = (portfolioData.projects && portfolioData.projects.length > 0)
    ? portfolioData.projects
    : DEFAULT_PORTFOLIO_DATA.projects!;

  const awardsList = (portfolioData.awards && portfolioData.awards.length > 0)
    ? portfolioData.awards
    : DEFAULT_PORTFOLIO_DATA.awards!;

  const academicData = portfolioData.academic || DEFAULT_PORTFOLIO_DATA.academic!;

  const certificationList = (portfolioData.certifications && portfolioData.certifications.length > 0)
    ? portfolioData.certifications
    : DEFAULT_PORTFOLIO_DATA.certifications!;

  // Filtered projects
  const filteredProjects = activeProjectFilter === 'all'
    ? projectsList
    : projectsList.filter(p => 
        p.category.toLowerCase().includes(activeProjectFilter.toLowerCase()) || 
        p.tag.toLowerCase().includes(activeProjectFilter.toLowerCase())
      );

  // Filtered awards
  const filteredAwards = activeAwardFilter === 'all'
    ? awardsList
    : awardsList.filter(a => {
        if (activeAwardFilter === '1st') return a.rank.includes('1st');
        if (activeAwardFilter === '2nd') return a.rank.includes('2nd');
        if (activeAwardFilter === 'top5') return a.rank.includes('Top') || a.rank.includes('Speaker');
        return true;
      });

  // Open modal handler
  const openModal = (item: {
    title: string;
    category: string;
    description: string;
    images: string[];
    link?: string;
    linkLabel?: string;
  }) => {
    setActiveModalImgIdx(0);
    setModalData({
      isOpen: true,
      title: item.title,
      category: item.category,
      description: item.description,
      images: item.images && item.images.length > 0 ? item.images : ['/1.png'],
      link: item.link,
      linkLabel: item.linkLabel,
    });
  };

  const closeModal = () => {
    setModalData(prev => ({ ...prev, isOpen: false }));
  };

  return (
    <div className="min-h-screen bg-[#FCFCFC] text-[#241C1E] font-sans antialiased selection:bg-rose-100 selection:text-rose-900 relative overflow-x-hidden">
      
      {/* ========================================================================= */}
      {/* 1. TOP MINIMALIST NAVIGATION                                              */}
      {/* ========================================================================= */}
      <header className="sticky top-0 z-40 bg-[#FCFCFC]/90 backdrop-blur-md border-b border-rose-100/60 py-4 px-4 sm:px-8 lg:px-12 transition-all">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          
          {/* Logo in Elegant Serif Italic */}
          <Link href="/" className="group flex items-center gap-2">
            <span className="font-serif italic font-medium text-2xl sm:text-3xl text-[#241C1E] tracking-tight group-hover:text-rose-700 transition-colors">
              Chikal Nazmi
            </span>
          </Link>

          {/* Center Honor Pill (Desktop) */}
          <div className="hidden md:flex items-center gap-2 bg-rose-50/80 border border-rose-200/60 rounded-full px-4 py-1 text-[11px] font-medium text-rose-900">
            <span className="w-1.5 h-1.5 rounded-full bg-rose-500 animate-pulse"></span>
            <span>(Honor) Cum Laude Graduate · Polinema D4 SIB</span>
          </div>

          {/* Right Navigation & Actions */}
          <div className="flex items-center gap-3 sm:gap-5">
            <nav className="hidden lg:flex items-center gap-6 text-xs font-medium text-[#4A3B40]">
              <a href="#about" className="hover:text-rose-700 transition-colors">About</a>
              <a href="#projects" className="hover:text-rose-700 transition-colors">Selected Works</a>
              <a href="#process" className="hover:text-rose-700 transition-colors">Process</a>
              <a href="#experience" className="hover:text-rose-700 transition-colors">Experience</a>
              <a href="#awards" className="hover:text-rose-700 transition-colors">Awards</a>
            </nav>

            <a
              href={portfolioData.socials?.whatsapp || "https://wa.me/6281234567890"}
              target="_blank"
              rel="noopener noreferrer"
              className="px-4 sm:px-5 py-2 rounded-full text-xs font-semibold bg-[#241C1E] text-white hover:bg-rose-950 transition-all shadow-xs flex items-center gap-1.5"
            >
              <span>✦ Let&apos;s Talk</span>
            </a>

            <Link
              href="/admin"
              title="Studio CMS"
              className="w-8 h-8 rounded-full border border-rose-200/80 flex items-center justify-center text-xs text-rose-800 hover:bg-rose-100 transition-colors"
            >
              🔒
            </Link>

            {/* Mobile menu button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 rounded-xl text-[#241C1E] hover:bg-rose-50 transition-colors"
              aria-label="Toggle menu"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                {mobileMenuOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile menu dropdown */}
        {mobileMenuOpen && (
          <div className="lg:hidden mt-3 pt-3 border-t border-rose-100/60 flex flex-col gap-2.5 pb-2 text-xs font-medium text-[#4A3B40]">
            <a href="#about" onClick={() => setMobileMenuOpen(false)} className="py-1 px-2 hover:bg-rose-50 rounded-lg">About</a>
            <a href="#projects" onClick={() => setMobileMenuOpen(false)} className="py-1 px-2 hover:bg-rose-50 rounded-lg">Selected Works</a>
            <a href="#process" onClick={() => setMobileMenuOpen(false)} className="py-1 px-2 hover:bg-rose-50 rounded-lg">Process</a>
            <a href="#experience" onClick={() => setMobileMenuOpen(false)} className="py-1 px-2 hover:bg-rose-50 rounded-lg">Experience</a>
            <a href="#awards" onClick={() => setMobileMenuOpen(false)} className="py-1 px-2 hover:bg-rose-50 rounded-lg">Awards</a>
          </div>
        )}
      </header>

      {/* ========================================================================= */}
      {/* 2. HERO SECTION (Layout & Proporsi Persis Referensi Elian Ross)            */}
      {/* ========================================================================= */}
      <section className="relative pt-8 sm:pt-12 pb-16 sm:pb-24 px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto overflow-hidden text-center">
        
        {/* Soft Petal Pink Radiant Halo Aura Directly Behind Avatar */}
        <div className="absolute top-[52%] left-1/2 -translate-x-1/2 -translate-y-1/2 w-[320px] sm:w-[500px] md:w-[620px] h-[320px] sm:h-[500px] md:h-[620px] pink-halo-glow rounded-full pointer-events-none z-0"></div>

        {/* Top Kicker Pill */}
        <div className="relative z-10 flex justify-center mb-3">
          <div className="inline-flex items-center gap-2 px-4 py-1 rounded-full bg-white/95 backdrop-blur-md border border-rose-200/70 shadow-xs text-[11px] font-semibold text-rose-900">
            <span>🌸</span>
            <span>{portfolioData.hero?.subheadline || "Open to Work • Management Trainee, BizDev, & Creative Roles"}</span>
          </div>
        </div>

        {/* Big Dual-Contrast Typography: Sans + Italic Serif (Persis Elian Ross) */}
        <div className="relative z-10 max-w-4xl mx-auto mb-6 sm:mb-8">
          <h1 className="font-sans font-extrabold text-5xl sm:text-7xl md:text-8xl tracking-tight text-[#241C1E] leading-tight">
            Hi I&apos;m Chikal
          </h1>
          <span className="font-serif italic font-normal text-4xl sm:text-6xl md:text-7xl lg:text-8xl text-rose-900 tracking-tight block mt-1">
            Business &amp; Digital Strategist
          </span>
        </div>

        {/* Centered Portrait Area with Floating Badges Around It */}
        <div className="relative z-10 max-w-4xl mx-auto min-h-[380px] sm:min-h-[460px] flex items-center justify-center">
          
          {/* FLOATING BADGE 1 (Top-Left): Available for Opportunities */}
          <div className="absolute top-2 sm:top-6 left-1 sm:left-4 md:left-10 z-20 animate-soft-float">
            <div className="bg-white/95 backdrop-blur-md border border-rose-100/90 rounded-full px-4 py-2 sm:py-2.5 shadow-sm flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping"></span>
              <span className="text-[11px] sm:text-xs font-semibold text-[#241C1E]">
                Available for new opportunities
              </span>
            </div>
          </div>

          {/* FLOATING INTRO CARD (Top-Right): Punchy Bio (Persis Referensi) */}
          <div className="absolute top-0 sm:top-4 right-1 sm:right-4 md:right-10 z-20 max-w-[210px] sm:max-w-xs text-right hidden sm:block">
            <div className="bg-white/90 backdrop-blur-md p-4 rounded-3xl border border-rose-100/70 shadow-xs text-left">
              <p className="text-xs sm:text-sm text-[#4A3B40] leading-relaxed font-normal">
                {portfolioData.hero?.bio || "Halo, saya Chikal Nazmi Mahira. Berfokus pada operasional bisnis, sistem informasi hulu-ke-hilir, dan penceritaan konten digital kreatif."}
              </p>
            </div>
          </div>

          {/* FLOATING BADGE 3 (Bottom-Left): Social proof / achievements */}
          <div className="absolute bottom-2 sm:bottom-6 left-1 sm:left-4 md:left-12 z-20">
            <div className="bg-white/95 backdrop-blur-md border border-rose-100/90 rounded-2xl px-4 py-2.5 shadow-sm flex items-center gap-3">
              <div className="flex -space-x-2 overflow-hidden">
                <img className="inline-block h-6 w-6 rounded-full ring-2 ring-white object-cover" src="/11.png" alt="Award 1" />
                <img className="inline-block h-6 w-6 rounded-full ring-2 ring-white object-cover" src="/12.png" alt="Award 2" />
                <img className="inline-block h-6 w-6 rounded-full ring-2 ring-white object-cover" src="/16.png" alt="Award 3" />
              </div>
              <div className="text-left">
                <p className="text-[11px] font-bold text-[#241C1E] leading-tight">7x National Awards</p>
                <p className="text-[10px] text-rose-700 leading-tight">+2,089% Reach Surge</p>
              </div>
            </div>
          </div>

          {/* FLOATING BADGE 4 (Bottom-Right): Sleek Pill CTA Button */}
          <div className="absolute bottom-2 sm:bottom-6 right-1 sm:right-4 md:right-12 z-20">
            <a
              href={portfolioData.socials?.whatsapp || "https://wa.me/6281234567890"}
              target="_blank"
              rel="noopener noreferrer"
              className="bg-[#241C1E] hover:bg-rose-950 text-white rounded-full px-5 sm:px-6 py-2.5 sm:py-3 text-xs sm:text-sm font-semibold shadow-md hover:shadow-lg transition-all flex items-center gap-2 cursor-pointer group"
            >
              <span>✦ Chat on WhatsApp</span>
              <span className="group-hover:translate-x-0.5 transition-transform">→</span>
            </a>
          </div>

          {/* CENTERED SUBJECT / PORTRAIT */}
          <div className="relative w-[280px] sm:w-[350px] md:w-[400px] h-[360px] sm:h-[450px] flex items-end justify-center">
            <img
              src={portfolioData.hero?.avatarImg || "/2.png"}
              alt="Chikal Nazmi"
              className="w-full h-full object-contain object-bottom drop-shadow-md select-none transition-transform duration-500 hover:scale-[1.02]"
            />
          </div>

        </div>

      </section>

      {/* ========================================================================= */}
      {/* 3. LOGO TICKER / CREDENTIAL ROW (Polinema, GDSC, Brands)                 */}
      {/* ========================================================================= */}
      <section className="py-7 border-y border-rose-100/60 bg-white/60 overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 flex items-center justify-between flex-wrap gap-6 sm:gap-8 opacity-75 grayscale hover:grayscale-0 transition-all duration-300">
          <div className="flex items-center gap-2 text-xs sm:text-sm font-semibold text-[#4A3B40]">
            <span>🎓</span>
            <span>Politeknik Negeri Malang</span>
          </div>
          <div className="flex items-center gap-2 text-xs sm:text-sm font-semibold text-[#4A3B40]">
            <span>🌐</span>
            <span>GDSC Google Polinema</span>
          </div>
          <div className="flex items-center gap-2 text-xs sm:text-sm font-semibold text-[#4A3B40]">
            <span>🌸</span>
            <span>Manikarumi Hijab</span>
          </div>
          <div className="flex items-center gap-2 text-xs sm:text-sm font-semibold text-[#4A3B40]">
            <span>🧶</span>
            <span>Yarn Up Creative</span>
          </div>
          <div className="flex items-center gap-2 text-xs sm:text-sm font-semibold text-[#4A3B40]">
            <span>🎬</span>
            <span>Dua Sisi Media</span>
          </div>
          <div className="flex items-center gap-2 text-xs sm:text-sm font-semibold text-[#4A3B40]">
            <span>🚀</span>
            <span>RevoU Digital Marketing</span>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 4. BENTO VISUAL SHOWCASE MOSAIC (Curated Project Previews)                */}
      {/* ========================================================================= */}
      <section className="py-16 sm:py-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="bg-gradient-to-b from-rose-50/70 via-pink-50/30 to-white rounded-4xl p-6 sm:p-10 border border-rose-100/80 shadow-xs">
          
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
            <div>
              <span className="font-script text-2xl sm:text-3xl text-rose-600 block">/ Curated Portfolio /</span>
              <h2 className="font-sans font-bold text-3xl sm:text-4xl text-[#241C1E] tracking-tight mt-1">
                Visual Work Mosaic
              </h2>
            </div>
            <p className="text-xs sm:text-sm text-[#4A3B40] max-w-sm">
              Tangkapan layar nyata dari perancangan sistem informasi, riset antarmuka digital, dan kampanye konten komersial.
            </p>
          </div>

          {/* Mosaic Grid of 4 Highlights */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-5 sm:gap-6">
            
            {/* Card 1 (Large - Sistem Koran) */}
            <div 
              onClick={() => openModal({
                title: projectsList[0]?.title || 'Sistem Manajemen Pelanggan Koran',
                category: 'WEB APP & SYSTEM ARCHITECTURE',
                description: projectsList[0]?.summary || 'Sistem informasi terintegrasi untuk pencatatan sirkulasi, tagihan otomatis, dan pemetaan rute kurir harian.',
                images: projectsList[0]?.extraImages && projectsList[0]?.extraImages.length > 0 ? projectsList[0].extraImages : ['/1.png', '/3.png'],
                link: projectsList[0]?.link,
                linkLabel: 'Dokumentasi Sistem ↗'
              })}
              className="lg:col-span-7 bg-white rounded-3xl p-5 border border-rose-100/80 shadow-xs hover:shadow-md transition-all cursor-pointer group"
            >
              <div className="relative overflow-hidden rounded-2xl bg-neutral-100 h-56 sm:h-72 mb-4">
                <img 
                  src={projectsList[0]?.image || "/1.png"} 
                  alt="Sistem Manajemen Koran"
                  className="w-full h-full object-cover object-top group-hover:scale-[1.02] transition-transform duration-500" 
                />
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-sans font-bold text-base sm:text-lg text-[#241C1E] group-hover:text-rose-700 transition-colors">
                    {projectsList[0]?.title || "Sistem Manajemen Pelanggan Koran"}
                  </h3>
                  <p className="text-xs text-[#4A3B40] mt-0.5">Database Relasional &amp; Sirkulasi Otomatis</p>
                </div>
                <span className="text-xs font-semibold px-3 py-1 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200">
                  Polinema D4 SIB
                </span>
              </div>
            </div>

            {/* Card 2 (Medium - SurveyKu) */}
            <div 
              onClick={() => openModal({
                title: projectsList[1]?.title || 'Website SurveyKu (Riset Pasar & Polling)',
                category: 'UX RESEARCH & ANALYTICS',
                description: projectsList[1]?.summary || 'Platform kuesioner digital dengan analisis sentimen dan visualisasi demografi responden secara real-time.',
                images: projectsList[1]?.extraImages && projectsList[1]?.extraImages.length > 0 ? projectsList[1].extraImages : ['/3.png', '/1.png'],
                link: projectsList[1]?.link,
                linkLabel: 'Buka Prototipe ↗'
              })}
              className="lg:col-span-5 bg-white rounded-3xl p-5 border border-rose-100/80 shadow-xs hover:shadow-md transition-all cursor-pointer group"
            >
              <div className="relative overflow-hidden rounded-2xl bg-neutral-100 h-56 sm:h-72 mb-4">
                <img 
                  src={projectsList[1]?.image || "/3.png"} 
                  alt="Website SurveyKu"
                  className="w-full h-full object-cover object-top group-hover:scale-[1.02] transition-transform duration-500" 
                />
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-sans font-bold text-base sm:text-lg text-[#241C1E] group-hover:text-rose-700 transition-colors">
                    {projectsList[1]?.title || "Website SurveyKu Analytics"}
                  </h3>
                  <p className="text-xs text-[#4A3B40] mt-0.5">User Feedback &amp; Data Modeling</p>
                </div>
                <span className="text-xs font-semibold px-3 py-1 rounded-full bg-blue-50 text-blue-800 border border-blue-200">
                  UX Analytics
                </span>
              </div>
            </div>

            {/* Card 3 (Medium - JTI Certify) */}
            <div 
              onClick={() => openModal({
                title: projectsList[2]?.title || 'JTI Certify (Verifikasi Sertifikat Online)',
                category: 'SECURITY & VALIDATION',
                description: projectsList[2]?.summary || 'Sistem verifikasi keaslian sertifikat digital mahasiswa menggunakan validasi kode unik dan basis data anti-pemalsuan.',
                images: projectsList[2]?.extraImages && projectsList[2]?.extraImages.length > 0 ? projectsList[2].extraImages : ['/9.png', '/10.png'],
                link: projectsList[2]?.link,
                linkLabel: 'Verifikasi Sistem ↗'
              })}
              className="lg:col-span-5 bg-white rounded-3xl p-5 border border-rose-100/80 shadow-xs hover:shadow-md transition-all cursor-pointer group"
            >
              <div className="relative overflow-hidden rounded-2xl bg-neutral-100 h-56 sm:h-72 mb-4">
                <img 
                  src={projectsList[2]?.image || "/9.png"} 
                  alt="JTI Certify"
                  className="w-full h-full object-cover object-top group-hover:scale-[1.02] transition-transform duration-500" 
                />
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-sans font-bold text-base sm:text-lg text-[#241C1E] group-hover:text-rose-700 transition-colors">
                    {projectsList[2]?.title || "JTI Certify Platform"}
                  </h3>
                  <p className="text-xs text-[#4A3B40] mt-0.5">Anti-Forgery Digital Credential</p>
                </div>
                <span className="text-xs font-semibold px-3 py-1 rounded-full bg-purple-50 text-purple-800 border border-purple-200">
                  Polinema JTI
                </span>
              </div>
            </div>

            {/* Card 4 (Large - Manikarumi & Yarn Up Campaigns) */}
            <div 
              onClick={() => openModal({
                title: 'Manikarumi & Yarn Up Creative Campaign',
                category: 'COMMERCIAL CREATIVE & CAMPAIGN',
                description: 'Eksekusi strategi konten media sosial berdaya jangkau tinggi, fotografi katalog produk, dan optimalisasi funnel konversi penjualan produk fashion hijab.',
                images: ['/17.png', '/18.png', '/7.png', '/8.png'],
                link: 'https://instagram.com/chikalnazmi',
                linkLabel: 'Lihat Instagram ↗'
              })}
              className="lg:col-span-7 bg-white rounded-3xl p-5 border border-rose-100/80 shadow-xs hover:shadow-md transition-all cursor-pointer group"
            >
              <div className="relative overflow-hidden rounded-2xl bg-neutral-100 h-56 sm:h-72 mb-4">
                <img 
                  src="/17.png" 
                  alt="Manikarumi Campaign"
                  className="w-full h-full object-cover object-top group-hover:scale-[1.02] transition-transform duration-500" 
                />
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-sans font-bold text-base sm:text-lg text-[#241C1E] group-hover:text-rose-700 transition-colors">
                    Manikarumi &amp; Yarn Up Commercial Campaigns
                  </h3>
                  <p className="text-xs text-[#4A3B40] mt-0.5">Short-Form Video Production &amp; Reach Surge</p>
                </div>
                <span className="text-xs font-semibold px-3 py-1 rounded-full bg-rose-50 text-rose-800 border border-rose-200">
                  +2,089% Reach
                </span>
              </div>
            </div>

          </div>

        </div>
      </section>

      {/* ========================================================================= */}
      {/* 5. VALUE PROPOSITION MANIFESTO ("What I Do" with Floating Skills)         */}
      {/* ========================================================================= */}
      <section id="about" className="py-20 sm:py-28 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto text-center relative">
        
        {/* Soft Center Halo */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] sm:w-[450px] h-[300px] sm:h-[450px] pink-halo-glow-subtle rounded-full pointer-events-none z-0"></div>

        {/* Script Kicker */}
        <div className="relative z-10 mb-4">
          <span className="font-script text-3xl sm:text-4xl text-rose-600 block">/ What I do /</span>
        </div>

        {/* Big Bold Statement with Highlighted Words */}
        <div className="relative z-10 max-w-3xl mx-auto mb-12">
          <p className="font-sans font-medium text-2xl sm:text-4xl md:text-5xl text-[#241C1E] leading-snug sm:leading-tight tracking-tight">
            my focus is on blending{' '}
            <strong className="font-extrabold text-rose-950">clear business strategy</strong>,{' '}
            <strong className="font-extrabold text-rose-950">thoughtful operational systems</strong>, and{' '}
            <span className="font-serif italic font-normal text-rose-800">creative storytelling</span>{' '}
            to craft experiences that{' '}
            <span className="underline decoration-rose-300 decoration-wavy underline-offset-8">
              solve real problems
            </span>.
          </p>
        </div>

        {/* Floating Skill Pills Around the Statement */}
        <div className="relative z-10 flex flex-wrap justify-center gap-2.5 sm:gap-3 max-w-2xl mx-auto">
          <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white border border-rose-200/80 shadow-xs text-xs font-semibold text-[#241C1E] hover:border-rose-400 transition-colors">
            <span className="w-2 h-2 rounded-full bg-amber-500"></span>
            <span>Business Model Canvas</span>
          </span>
          <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white border border-rose-200/80 shadow-xs text-xs font-semibold text-[#241C1E] hover:border-rose-400 transition-colors">
            <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
            <span>UI/UX &amp; Market Research</span>
          </span>
          <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white border border-rose-200/80 shadow-xs text-xs font-semibold text-[#241C1E] hover:border-rose-400 transition-colors">
            <span className="w-2 h-2 rounded-full bg-rose-500"></span>
            <span>SOP &amp; Operational Flow</span>
          </span>
          <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white border border-rose-200/80 shadow-xs text-xs font-semibold text-[#241C1E] hover:border-rose-400 transition-colors">
            <span className="w-2 h-2 rounded-full bg-blue-500"></span>
            <span>Figma Prototyping</span>
          </span>
          <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white border border-rose-200/80 shadow-xs text-xs font-semibold text-[#241C1E] hover:border-rose-400 transition-colors">
            <span className="w-2 h-2 rounded-full bg-purple-500"></span>
            <span>Short-Form Video &amp; CapCut</span>
          </span>
          <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white border border-rose-200/80 shadow-xs text-xs font-semibold text-[#241C1E] hover:border-rose-400 transition-colors">
            <span className="w-2 h-2 rounded-full bg-pink-500"></span>
            <span>B2B Partnerships Strategy</span>
          </span>
        </div>

      </section>

      {/* ========================================================================= */}
      {/* 6. PROCESS ROADMAP ("Here's how it works" with 3 Cards & Quotes)          */}
      {/* ========================================================================= */}
      <section id="process" className="py-20 sm:py-28 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="font-script text-3xl sm:text-4xl text-rose-600 block">/ How I Deliver Value /</span>
          <h2 className="font-sans font-bold text-4xl sm:text-5xl text-[#241C1E] tracking-tight mt-1">
            Here&apos;s how it works
          </h2>
          <p className="text-xs sm:text-sm text-[#4A3B40] mt-3">
            Tiga pilar pendekatan terstruktur dalam membedah tantangan bisnis, merumuskan solusi sistematis, dan mengeksekusinya secara terukur.
          </p>
        </div>

        {/* 3 Process Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 relative">
          
          {/* Card 01 - Discover */}
          <div className="process-card p-8 rounded-3xl bg-white border border-rose-100/90 shadow-xs flex flex-col justify-between relative group">
            <div>
              <span className="font-sans font-extrabold text-5xl text-rose-200/80 group-hover:text-rose-300 transition-colors">01</span>
              <h3 className="font-sans font-bold text-2xl text-[#241C1E] mt-4 mb-2">
                Discover
              </h3>
              <p className="text-xs sm:text-sm text-[#4A3B40] leading-relaxed">
                Riset pasar mendalam, wawancara pengguna (user interview), analisis kendala operasional (bottlenecks), dan pemetaan peluang bisnis nyata.
              </p>
            </div>
            <div className="mt-8 pt-4 border-t border-rose-100/60 flex items-center justify-between text-[11px] font-semibold text-rose-800">
              <span>Market &amp; User Needs</span>
              <span>🔍</span>
            </div>
          </div>

          {/* Card 02 - Strategize */}
          <div className="process-card p-8 rounded-3xl bg-white border border-rose-100/90 shadow-xs flex flex-col justify-between relative group">
            <div>
              <span className="font-sans font-extrabold text-5xl text-rose-200/80 group-hover:text-rose-300 transition-colors">02</span>
              <h3 className="font-sans font-bold text-2xl text-[#241C1E] mt-4 mb-2">
                Strategize
              </h3>
              <p className="text-xs sm:text-sm text-[#4A3B40] leading-relaxed">
                Merumuskan Business Model Canvas, analisis kelayakan finansial, standard operating procedure (SOP), serta konsep kreatif penceritaan brand.
              </p>
            </div>
            <div className="mt-8 pt-4 border-t border-rose-100/60 flex items-center justify-between text-[11px] font-semibold text-rose-800">
              <span>Business Model &amp; SOP</span>
              <span>📐</span>
            </div>
          </div>

          {/* Card 03 - Deliver */}
          <div className="process-card p-8 rounded-3xl bg-white border border-rose-100/90 shadow-xs flex flex-col justify-between relative group">
            <div>
              <span className="font-sans font-extrabold text-5xl text-rose-200/80 group-hover:text-rose-300 transition-colors">03</span>
              <h3 className="font-sans font-bold text-2xl text-[#241C1E] mt-4 mb-2">
                Deliver
              </h3>
              <p className="text-xs sm:text-sm text-[#4A3B40] leading-relaxed">
                Eksekusi kampanye pemasaran digital, pembuatan prototipe interaktif, dan pelacakan metrik keberhasilan (KPI) yang terukur.
              </p>
            </div>
            <div className="mt-8 pt-4 border-t border-rose-100/60 flex items-center justify-between text-[11px] font-semibold text-rose-800">
              <span>Execution &amp; KPI Reach</span>
              <span>🚀</span>
            </div>
          </div>

        </div>

        {/* 2 Clean Quote / Highlight Cards Underneath */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-12 max-w-5xl mx-auto">
          
          <div className="bg-white p-6 sm:p-7 rounded-3xl border border-rose-100/80 shadow-xs flex items-start gap-4">
            <span className="text-3xl text-rose-300 font-serif leading-none">“</span>
            <div>
              <p className="text-xs sm:text-sm text-[#241C1E] italic leading-relaxed">
                Kemampuan analisis komprehensif dalam memadukan kelayakan bisnis, tata kelola data sistem informasi, dan presentasi meyakinkan terbukti membawakan 7 gelar juara nasional.
              </p>
              <div className="flex items-center gap-3 mt-4">
                <img src="/11.png" alt="Award" className="w-8 h-8 rounded-full object-cover ring-2 ring-rose-100" />
                <div>
                  <h4 className="font-bold text-xs text-[#241C1E]">National Fest Business Plan Competition</h4>
                  <p className="text-[10px] text-[#4A3B40]">Juara 1 Tingkat Nasional 2024</p>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 sm:p-7 rounded-3xl border border-rose-100/80 shadow-xs flex items-start gap-4">
            <span className="text-3xl text-rose-300 font-serif leading-none">“</span>
            <div>
              <p className="text-xs sm:text-sm text-[#241C1E] italic leading-relaxed">
                Inisiatif kepemimpinan di Manikarumi dan GDSC Polinema mempercepat lonjakan jangkauan konten organik hingga +2.089% dengan storytelling yang memikat audiens muda.
              </p>
              <div className="flex items-center gap-3 mt-4">
                <img src="/17.png" alt="Manikarumi" className="w-8 h-8 rounded-full object-cover ring-2 ring-rose-100" />
                <div>
                  <h4 className="font-bold text-xs text-[#241C1E]">Commercial Content Growth</h4>
                  <p className="text-[10px] text-[#4A3B40]">Brand Impact &amp; Reach Surge</p>
                </div>
              </div>
            </div>
          </div>

        </div>

      </section>

      {/* ========================================================================= */}
      {/* 7. SELECTED WORKS (2x2 Grid Layout Persis Referensi Elian Ross)           */}
      {/* ========================================================================= */}
      <section id="projects" className="py-20 sm:py-28 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        
        {/* Section Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6 mb-12">
          <div>
            <span className="font-script text-3xl sm:text-4xl text-rose-600 block">/ Selected Works /</span>
            <h2 className="font-sans font-bold text-4xl sm:text-5xl text-[#241C1E] tracking-tight mt-1">
              Selected Works
            </h2>
          </div>

          {/* Filter Pills */}
          <div className="flex flex-wrap gap-2">
            {[
              { id: 'all', label: 'All Works' },
              { id: 'system', label: 'Systems & Web' },
              { id: 'marketing', label: 'Campaign & Marketing' },
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveProjectFilter(tab.id)}
                className={`px-4 py-1.5 rounded-full text-xs font-semibold transition-all cursor-pointer ${
                  activeProjectFilter === tab.id
                    ? 'bg-[#241C1E] text-white shadow-xs'
                    : 'bg-white text-[#4A3B40] border border-rose-100 hover:border-rose-300'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* 2x2 Project Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 sm:gap-10">
          {filteredProjects.map((project, idx) => (
            <div
              key={project.id || idx}
              onClick={() => openModal({
                title: project.title,
                category: project.category,
                description: project.summary,
                images: project.extraImages && project.extraImages.length > 0 ? project.extraImages : [project.image || '/1.png'],
                link: project.link,
                linkLabel: project.linkLabel || 'Buka Dokumentasi ↗'
              })}
              className="editorial-card p-5 sm:p-6 rounded-4xl bg-white border border-rose-100/90 shadow-xs hover:shadow-lg transition-all cursor-pointer group flex flex-col justify-between"
            >
              {/* Project Image Container */}
              <div className="relative overflow-hidden rounded-3xl bg-neutral-100 aspect-[16/10] sm:aspect-[16/11] mb-5">
                <img
                  src={project.image || "/1.png"}
                  alt={project.title}
                  className="w-full h-full object-cover object-top group-hover:scale-[1.03] transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-300 flex items-center justify-center">
                  <span className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 px-4 py-2 rounded-full bg-white/95 backdrop-blur-md text-xs font-bold text-[#241C1E] shadow-sm">
                    🔍 Lihat Dokumentasi &amp; Hasil
                  </span>
                </div>
              </div>

              {/* Title on Left, Tag Pills on Right */}
              <div className="flex items-start justify-between gap-4 pt-1">
                <div>
                  <h3 className="font-sans font-bold text-lg sm:text-xl text-[#241C1E] group-hover:text-rose-800 transition-colors">
                    {project.title}
                  </h3>
                  <p className="text-xs text-[#4A3B40] mt-1 line-clamp-1">
                    {project.summary}
                  </p>
                </div>

                <div className="flex flex-wrap gap-1.5 justify-end shrink-0">
                  <span className="text-[11px] font-semibold px-3 py-1 rounded-full bg-rose-50 text-rose-800 border border-rose-100">
                    {project.tag || "Case Study"}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>

      </section>

      {/* ========================================================================= */}
      {/* 8. PUSHING BOUNDARIES (About Story & Clean Career Timeline)              */}
      {/* ========================================================================= */}
      <section id="experience" className="py-20 sm:py-28 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto border-t border-rose-100/60">
        
        {/* Kicker & Title */}
        <div className="mb-14">
          <span className="font-script text-3xl sm:text-4xl text-rose-600 block">/ Who Am I /</span>
          <h2 className="font-sans font-bold text-4xl sm:text-6xl text-[#241C1E] tracking-tight mt-1">
            Pushing Boundaries <span className="font-serif italic font-normal text-rose-900">since 2020</span>
          </h2>
        </div>

        {/* 2 Columns: Photo & Bio Left, Clean Horizontal Timeline Right */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 sm:gap-14 items-start">
          
          {/* Left Column: Stylized Portrait Card & Social Links */}
          <div className="lg:col-span-5 space-y-6">
            <div className="relative overflow-hidden rounded-4xl bg-[#1F191B] p-4 sm:p-5 shadow-lg">
              <div className="relative aspect-[4/5] rounded-3xl overflow-hidden bg-neutral-900">
                <img
                  src={portfolioData.hero?.avatarImg || "/2.png"}
                  alt="Chikal Portrait"
                  className="w-full h-full object-cover object-top"
                />
              </div>
              <div className="mt-4 px-2 flex items-center justify-between">
                <div>
                  <h4 className="font-serif italic font-medium text-lg text-white">Chikal Nazmi</h4>
                  <p className="text-xs text-rose-200/80">Business &amp; Digital Strategist</p>
                </div>
                <span className="text-xs font-mono text-white/50">2020 — 2026</span>
              </div>
            </div>

            {/* Social Icons Row */}
            <div className="flex items-center justify-center gap-3 p-3 bg-white rounded-full border border-rose-100/80 shadow-xs">
              <a
                href={portfolioData.socials?.linkedin || "https://linkedin.com"}
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 rounded-full bg-rose-50 text-rose-900 hover:bg-rose-900 hover:text-white transition-colors flex items-center justify-center text-xs font-bold"
                title="LinkedIn"
              >
                in
              </a>
              <a
                href={portfolioData.socials?.instagram || "https://instagram.com/chikalnazmi"}
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 rounded-full bg-rose-50 text-rose-900 hover:bg-rose-900 hover:text-white transition-colors flex items-center justify-center text-xs font-bold"
                title="Instagram"
              >
                ig
              </a>
              <a
                href={portfolioData.socials?.tiktok || "https://tiktok.com"}
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 rounded-full bg-rose-50 text-rose-900 hover:bg-rose-900 hover:text-white transition-colors flex items-center justify-center text-xs font-bold"
                title="TikTok"
              >
                tt
              </a>
              <a
                href={`mailto:${portfolioData.socials?.email || "chikalnazmi@gmail.com"}`}
                className="w-9 h-9 rounded-full bg-rose-50 text-rose-900 hover:bg-rose-900 hover:text-white transition-colors flex items-center justify-center text-xs font-bold"
                title="Email"
              >
                ✉
              </a>
            </div>
          </div>

          {/* Right Column: Narrative Story & Clean Horizontal Career Rows */}
          <div className="lg:col-span-7 space-y-8">
            <p className="text-sm sm:text-base text-[#4A3B40] leading-relaxed font-normal">
              Lulusan <strong>Sarjana Terapan Sistem Informasi Bisnis (D4 SIB) Politeknik Negeri Malang</strong> dengan predikat <em>Cum Laude</em> dan sertifikasi internasional TOEIC 775. Memadukan keahlian analisis kelayakan bisnis, tata kelola data hulu-ke-hilir, serta strategi penceritaan kreatif digital yang terbukti menghasilkan dampak pertumbuhan nyata.
            </p>

            {/* Clean Timeline Rows (Persis List di Referensi) */}
            <div className="border-t border-rose-100">
              {experiencesList.map((exp, idx) => (
                <div 
                  key={exp.id || idx}
                  className="py-4 sm:py-5 border-b border-rose-100/70 flex flex-col sm:flex-row sm:items-center justify-between gap-2 sm:gap-4 hover:bg-rose-50/40 px-2 rounded-xl transition-colors cursor-pointer group"
                  onClick={() => openModal({
                    title: exp.title,
                    category: exp.category || 'WORK EXPERIENCE',
                    description: exp.summary,
                    images: exp.extraImages && exp.extraImages.length > 0 ? exp.extraImages : [exp.image || '/1.png'],
                  })}
                >
                  <div>
                    <h4 className="font-sans font-bold text-sm sm:text-base text-[#241C1E] group-hover:text-rose-800 transition-colors">
                      {exp.title}
                    </h4>
                    <p className="text-xs text-[#4A3B40]">
                      {exp.category} · {exp.tag}
                    </p>
                  </div>

                  <div className="flex items-center gap-3 self-start sm:self-auto">
                    <span className="text-[11px] font-medium text-rose-800 bg-rose-50 px-2.5 py-0.5 rounded-full border border-rose-100">
                      {exp.period}
                    </span>
                    <span className="text-xs text-rose-300 group-hover:translate-x-1 transition-transform">→</span>
                  </div>
                </div>
              ))}

              {/* Education Entry */}
              <div 
                className="py-4 sm:py-5 border-b border-rose-100/70 flex flex-col sm:flex-row sm:items-center justify-between gap-2 sm:gap-4 hover:bg-rose-50/40 px-2 rounded-xl transition-colors cursor-pointer group"
                onClick={() => openModal({
                  title: `${academicData.degree} · ${academicData.institution}`,
                  category: 'FORMAL EDUCATION',
                  description: academicData.description,
                  images: academicData.images && academicData.images.length > 0 ? academicData.images : ['/11.png', '/12.png', '/16.png'],
                })}
              >
                <div>
                  <h4 className="font-sans font-bold text-sm sm:text-base text-[#241C1E] group-hover:text-rose-800 transition-colors">
                    {academicData.degree}
                  </h4>
                  <p className="text-xs text-[#4A3B40]">
                    {academicData.institution} · {academicData.gpaValue}
                  </p>
                </div>

                <div className="flex items-center gap-3 self-start sm:self-auto">
                  <span className="text-[11px] font-medium text-rose-800 bg-rose-50 px-2.5 py-0.5 rounded-full border border-rose-100">
                    {academicData.period}
                  </span>
                  <span className="text-xs text-rose-300 group-hover:translate-x-1 transition-transform">→</span>
                </div>
              </div>
            </div>

            {/* Micro Callout for CV */}
            <div className="flex items-center gap-4 pt-2">
              <a
                href={portfolioData.socials?.whatsapp || "https://wa.me/6281234567890"}
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs font-bold text-rose-800 underline underline-offset-4 hover:text-rose-950 transition-colors"
              >
                Minta Dokumen CV Lengkap via WhatsApp ↗
              </a>
            </div>

          </div>

        </div>

      </section>

      {/* ========================================================================= */}
      {/* 9. TROPHY CASE & CERTIFICATIONS (Clean Minimalist Cards)                   */}
      {/* ========================================================================= */}
      <section id="awards" className="py-20 sm:py-28 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto border-t border-rose-100/60">
        
        {/* Section Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6 mb-12">
          <div>
            <span className="font-script text-3xl sm:text-4xl text-rose-600 block">/ Accreditations /</span>
            <h2 className="font-sans font-bold text-4xl sm:text-5xl text-[#241C1E] tracking-tight mt-1">
              Awards &amp; Credentials
            </h2>
          </div>

          <div className="flex flex-wrap gap-2">
            {[
              { id: 'all', label: 'All Honors' },
              { id: '1st', label: '🥇 1st Place' },
              { id: '2nd', label: '🥈 2nd Place' },
              { id: 'top5', label: '⭐ Finalist & Speaker' },
            ].map(filter => (
              <button
                key={filter.id}
                onClick={() => setActiveAwardFilter(filter.id as any)}
                className={`px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all cursor-pointer ${
                  activeAwardFilter === filter.id
                    ? 'bg-[#241C1E] text-white shadow-xs'
                    : 'bg-white text-[#4A3B40] border border-rose-100 hover:border-rose-300'
                }`}
              >
                {filter.label}
              </button>
            ))}
          </div>
        </div>

        {/* Awards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredAwards.map((award, idx) => (
            <div
              key={idx}
              onClick={() => openModal({
                title: `${award.rank}: ${award.title}`,
                category: award.scope || 'NATIONAL COMPETITION',
                description: `${award.desc} Penyelenggara: ${award.organizer} (${award.year}).`,
                images: [award.certImg || '/11.png', award.eventImg || '/12.png'],
                link: award.link,
                linkLabel: award.linkLabel || 'Dokumentasi Resmi ↗'
              })}
              className="editorial-card p-6 rounded-3xl bg-white border border-rose-100/80 shadow-xs hover:shadow-md transition-all cursor-pointer group flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-4">
                  <span className="text-[11px] font-bold px-3 py-1 rounded-full bg-rose-50 text-rose-900 border border-rose-100">
                    {award.rank}
                  </span>
                  <span className="text-xs text-[#4A3B40] font-mono">{award.year}</span>
                </div>
                <h4 className="font-sans font-bold text-base text-[#241C1E] group-hover:text-rose-800 transition-colors leading-snug">
                  {award.title}
                </h4>
                <p className="text-xs text-[#4A3B40] mt-2 leading-relaxed">
                  {award.organizer} · {award.scope}
                </p>
              </div>

              <div className="mt-6 pt-3 border-t border-rose-100/60 flex items-center justify-between text-xs font-semibold text-rose-700">
                <span>Lihat Sertifikat &amp; Piala</span>
                <span className="group-hover:translate-x-1 transition-transform">↗</span>
              </div>
            </div>
          ))}
        </div>

        {/* Professional Certifications Bar */}
        <div className="mt-14 pt-10 border-t border-rose-100/80">
          <h3 className="font-sans font-bold text-xl text-[#241C1E] mb-6">
            Professional Courses &amp; Certifications
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {certificationList.map((cert, idx) => (
              <div
                key={cert.id || idx}
                onClick={() => openModal({
                  title: cert.title,
                  category: cert.issuer,
                  description: cert.desc || `${cert.title} diterbitkan oleh ${cert.issuer} pada tahun ${cert.year}.`,
                  images: [cert.image || '/9.png'],
                  link: cert.link,
                  linkLabel: cert.linkLabel || 'Verifikasi Kredensial ↗'
                })}
                className="p-4 rounded-2xl bg-white border border-rose-100/70 hover:border-rose-300 shadow-xs hover:shadow-sm transition-all cursor-pointer flex flex-col justify-between"
              >
                <div>
                  <span className="text-[10px] font-bold text-rose-800 uppercase tracking-wider">{cert.issuer}</span>
                  <h4 className="font-bold text-xs text-[#241C1E] mt-1 leading-snug">{cert.title}</h4>
                </div>
                <div className="mt-3 pt-2 border-t border-rose-50 flex items-center justify-between text-[10px] text-[#4A3B40]">
                  <span>{cert.year}</span>
                  <span className="text-rose-600 font-semibold">Verified ↗</span>
                </div>
              </div>
            ))}
          </div>
        </div>

      </section>

      {/* ========================================================================= */}
      {/* 10. CTA BANNER ("Let's Make It Happen" Persis Referensi Elian Ross)       */}
      {/* ========================================================================= */}
      <section className="py-16 sm:py-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="relative overflow-hidden rounded-4xl p-10 sm:p-16 text-center cta-banner-glow border border-rose-200 shadow-md">
          
          <div className="relative z-10 max-w-3xl mx-auto space-y-4">
            <h2 className="font-sans font-extrabold text-4xl sm:text-6xl md:text-7xl text-[#241C1E] tracking-tight leading-none">
              Let&apos;s Make It Happen
            </h2>
            <p className="text-xs sm:text-base text-rose-950/80 max-w-xl mx-auto leading-relaxed">
              always open for new opportunities, collaborations and creative challenges. let&apos;s work together to bring your ideas to life.
            </p>
            <div className="pt-4">
              <a
                href={portfolioData.socials?.whatsapp || "https://wa.me/6281234567890"}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-8 py-3.5 rounded-full bg-[#241C1E] hover:bg-black text-white text-xs sm:text-sm font-bold uppercase tracking-wider shadow-lg hover:shadow-xl transition-all cursor-pointer"
              >
                <span>✦ GET IN TOUCH</span>
                <span>→</span>
              </a>
            </div>
          </div>

        </div>
      </section>

      {/* ========================================================================= */}
      {/* 11. FOOTER & GIANT WATERMARK SIGNATURE                                    */}
      {/* ========================================================================= */}
      <footer className="pt-12 pb-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto border-t border-rose-100/60 relative overflow-hidden">
        
        {/* Navigation & Copyright */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-6 text-xs text-[#4A3B40] pb-12">
          <div className="flex items-center gap-6 font-medium">
            <a href="#about" className="hover:text-rose-700 transition-colors">About</a>
            <a href="#projects" className="hover:text-rose-700 transition-colors">Portfolio</a>
            <a href="#process" className="hover:text-rose-700 transition-colors">Process</a>
            <a href="#experience" className="hover:text-rose-700 transition-colors">Experience</a>
            <a href="#awards" className="hover:text-rose-700 transition-colors">Awards</a>
            <Link href="/admin" className="hover:text-rose-700 transition-colors font-bold">Studio CMS</Link>
          </div>

          <p className="text-center sm:text-right">
            © 2026 Chikal Nazmi Mahira. All rights reserved.
          </p>
        </div>

        {/* Giant Watermark Signature Typography Across Bottom (Persis Referensi) */}
        <div className="text-center select-none pointer-events-none pt-4">
          <span className="font-serif italic font-normal text-6xl sm:text-8xl md:text-9xl lg:text-[140px] text-rose-100/60 leading-none tracking-tight block">
            Chikal Nazmi
          </span>
        </div>

      </footer>

      {/* ========================================================================= */}
      {/* 12. INTERACTIVE DOCUMENTATION & CERTIFICATE MODAL                          */}
      {/* ========================================================================= */}
      {modalData.isOpen && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-fade-in"
          onClick={closeModal}
        >
          <div 
            className="bg-white rounded-3xl max-w-3xl w-full p-6 sm:p-8 shadow-2xl border border-rose-100 space-y-6 max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="flex items-start justify-between gap-4">
              <div>
                <span className="text-[11px] font-bold text-rose-800 uppercase tracking-wider bg-rose-50 px-3 py-1 rounded-full border border-rose-100">
                  {modalData.category}
                </span>
                <h3 className="font-sans font-bold text-xl sm:text-2xl text-[#241C1E] mt-2">
                  {modalData.title}
                </h3>
              </div>

              <button
                onClick={closeModal}
                className="w-9 h-9 rounded-full bg-rose-50 hover:bg-rose-100 text-[#241C1E] flex items-center justify-center font-bold text-sm transition-colors cursor-pointer"
                aria-label="Close modal"
              >
                ✕
              </button>
            </div>

            {/* Modal Images Carousel / Viewer */}
            {modalData.images.length > 0 && (
              <div className="space-y-3">
                <div className="relative aspect-[16/10] bg-neutral-100 rounded-2xl overflow-hidden border border-rose-100">
                  <img
                    src={modalData.images[activeModalImgIdx] || modalData.images[0]}
                    alt="Documentation Preview"
                    className="w-full h-full object-contain bg-neutral-900"
                  />
                </div>

                {modalData.images.length > 1 && (
                  <div className="flex gap-2 overflow-x-auto pb-1">
                    {modalData.images.map((img, idx) => (
                      <button
                        key={idx}
                        onClick={() => setActiveModalImgIdx(idx)}
                        className={`w-16 h-12 rounded-xl overflow-hidden border-2 shrink-0 transition-all ${
                          activeModalImgIdx === idx ? 'border-rose-600 ring-2 ring-rose-200' : 'border-transparent opacity-60 hover:opacity-100'
                        }`}
                      >
                        <img src={img} alt={`Thumb ${idx + 1}`} className="w-full h-full object-cover" />
                      </button>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Modal Description */}
            <div className="space-y-2">
              <h4 className="font-bold text-xs uppercase tracking-wider text-rose-900">Ringkasan &amp; Informasi</h4>
              <p className="text-xs sm:text-sm text-[#4A3B40] leading-relaxed">
                {modalData.description}
              </p>
            </div>

            {/* Modal Footer / External Link */}
            <div className="pt-4 border-t border-rose-100 flex items-center justify-between">
              {modalData.link ? (
                <a
                  href={modalData.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-5 py-2 rounded-full text-xs font-bold bg-[#241C1E] text-white hover:bg-rose-900 transition-colors inline-flex items-center gap-1.5"
                >
                  <span>{modalData.linkLabel || 'Buka Tautan Resmi ↗'}</span>
                </a>
              ) : (
                <span className="text-xs text-rose-700 italic">Dokumentasi Portofolio Resmi</span>
              )}

              <button
                onClick={closeModal}
                className="px-4 py-2 rounded-full text-xs font-semibold text-[#4A3B40] hover:bg-rose-50 transition-colors"
              >
                Tutup
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}
