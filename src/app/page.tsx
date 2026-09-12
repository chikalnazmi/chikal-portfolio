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

  // Active creator key for Creator Stage
  const [activeCreatorKey, setActiveCreatorKey] = useState<string>('personal');

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

  const creatorAccounts = portfolioData.creatorAccounts || DEFAULT_PORTFOLIO_DATA.creatorAccounts;
  const currentCreator = creatorAccounts[activeCreatorKey] || Object.values(creatorAccounts)[0];

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
    <div className="min-h-screen bg-[#FCFCFC] text-[#18181B] font-sans antialiased selection:bg-teal-100 selection:text-teal-900 relative overflow-x-hidden">
      
      {/* ========================================================================= */}
      {/* 1. TOP MINIMALIST NAVIGATION                                              */}
      {/* ========================================================================= */}
      <header className="sticky top-0 z-40 bg-[#FCFCFC]/90 backdrop-blur-md border-b border-teal-100/50 py-4 px-4 sm:px-8 lg:px-12 transition-all">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          
          {/* Logo in Slender Editorial Serif Italic (Like Elian Ross) */}
          <Link href="/" className="group flex items-center gap-2">
            <span className="font-serif italic font-normal text-2xl sm:text-3xl text-[#18181B] tracking-tight group-hover:text-teal-700 transition-colors">
              Chikal Nazmi
            </span>
          </Link>

          {/* Center Honor Pill (Desktop - Laurel Wreath Style) */}
          <div className="hidden md:flex items-center gap-2 bg-teal-50/80 border border-teal-200/70 rounded-full px-4 py-1 text-[11px] font-medium text-teal-900 shadow-xs">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
            <span>(Honor) {academicData.badge || "Cum Laude Graduate"} · {academicData.institution || "Polinema D4 SIB"} · GPA {academicData.gpaValue || "3.84"}</span>
          </div>

          {/* Right Navigation & Actions */}
          <div className="flex items-center gap-3 sm:gap-5">
            <nav className="hidden lg:flex items-center gap-6 text-xs font-medium text-neutral-600">
              <a href="#about" className="hover:text-teal-700 transition-colors">About</a>
              <a href="#projects" className="hover:text-teal-700 transition-colors">Selected Works</a>
              <a href="#creator" className="hover:text-teal-700 transition-colors">Creator Studio</a>
              <a href="#process" className="hover:text-teal-700 transition-colors">Process</a>
              <a href="#experience" className="hover:text-teal-700 transition-colors">Experience</a>
              <a href="#awards" className="hover:text-teal-700 transition-colors">Awards</a>
            </nav>

            <a
              href={portfolioData.socials?.whatsapp || "https://wa.me/6281234567890"}
              target="_blank"
              rel="noopener noreferrer"
              className="px-4 sm:px-5 py-2 rounded-full text-xs font-semibold bg-[#0B2321] text-white hover:bg-[#134E4A] transition-all shadow-xs flex items-center gap-1.5 cursor-pointer"
            >
              <span>✦ Let&apos;s Talk</span>
            </a>

            {/* Mobile menu button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 rounded-xl text-[#18181B] hover:bg-teal-50 transition-colors"
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
          <div className="lg:hidden mt-3 pt-3 border-t border-teal-100/60 flex flex-col gap-2.5 pb-2 text-xs font-medium text-neutral-600">
            <a href="#about" onClick={() => setMobileMenuOpen(false)} className="py-1 px-2 hover:bg-teal-50 rounded-lg">About</a>
            <a href="#projects" onClick={() => setMobileMenuOpen(false)} className="py-1 px-2 hover:bg-teal-50 rounded-lg">Selected Works</a>
            <a href="#creator" onClick={() => setMobileMenuOpen(false)} className="py-1 px-2 hover:bg-teal-50 rounded-lg">Creator Studio</a>
            <a href="#process" onClick={() => setMobileMenuOpen(false)} className="py-1 px-2 hover:bg-teal-50 rounded-lg">Process</a>
            <a href="#experience" onClick={() => setMobileMenuOpen(false)} className="py-1 px-2 hover:bg-teal-50 rounded-lg">Experience</a>
            <a href="#awards" onClick={() => setMobileMenuOpen(false)} className="py-1 px-2 hover:bg-teal-50 rounded-lg">Awards</a>
          </div>
        )}
      </header>

      {/* ========================================================================= */}
      {/* 2. HERO SECTION (Layout, Font & Dominant Green-Teal Aura Elian Ross)       */}
      {/* ========================================================================= */}
      <section className="relative pt-6 sm:pt-10 pb-16 sm:pb-24 px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto overflow-hidden text-center">
        
        {/* Dominant Radiant Green-Teal Aura + Soft Rose Glow Directly Behind Portrait */}
        <div className="absolute top-[28%] left-1/2 -translate-x-1/2 -translate-y-1/2 w-[340px] sm:w-[540px] md:w-[680px] lg:w-[820px] h-[340px] sm:h-[540px] md:h-[680px] hero-teal-rose-glow rounded-full pointer-events-none z-0"></div>
        <div className="absolute top-[48%] left-1/2 -translate-x-1/2 -translate-y-1/2 w-[260px] sm:w-[420px] md:w-[500px] h-[260px] sm:h-[420px] teal-halo-glow rounded-full pointer-events-none z-0"></div>

        {/* Top Honor Citation (Laurel Wreath style like Elian Ross Site of the Day) */}
        <div className="relative z-10 flex justify-center mb-4">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/90 backdrop-blur-md border border-teal-200/70 shadow-xs text-[11px] font-medium text-teal-950">
            <span className="text-teal-600">🌿</span>
            <span>{portfolioData.hero?.subheadline || "Management Trainee • Business Development • Creative Content Lead"}</span>
          </div>
        </div>

        {/* Dual-Contrast Headline: Sans Bold + Slender Italic Serif */}
        <div className="relative z-10 max-w-4xl mx-auto mb-6 sm:mb-8">
          {portfolioData.hero?.headline ? (
            <h1 className="font-sans font-medium text-4xl sm:text-5xl md:text-6xl lg:text-[72px] tracking-tight text-[#18181B] leading-tight">
              {portfolioData.hero.headline}
            </h1>
          ) : (
            <>
              <h1 className="font-sans font-medium text-5xl sm:text-6xl md:text-7xl lg:text-[76px] tracking-tight text-[#18181B] leading-none">
                Hi I&apos;m Chikal
              </h1>
              <span className="font-serif italic font-normal text-5xl sm:text-6xl md:text-7xl lg:text-[84px] text-[#0B2321] tracking-tight block mt-1 leading-[1.05]">
                Business &amp; Digital Strategist
              </span>
            </>
          )}
        </div>

        {/* Centered Portrait Area with Floating Micro-Elements in 4 Corners */}
        <div className="relative z-10 max-w-4xl mx-auto min-h-[380px] sm:min-h-[460px] md:min-h-[500px] flex items-center justify-center">
          
          {/* FLOATING ELEMENT 1 (Top-Left): Available for Opportunities Pill */}
          <div className="absolute top-4 sm:top-8 left-1 sm:left-4 md:left-8 z-20 animate-soft-float">
            <div className="bg-white/95 backdrop-blur-md border border-teal-200/80 rounded-full px-3.5 sm:px-4 py-2 shadow-xs flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.8)] animate-pulse"></span>
              <span className="text-[11px] sm:text-xs font-semibold text-teal-950">
                Available for new opportunities
              </span>
            </div>
          </div>

          {/* FLOATING ELEMENT 2 (Top-Right): Clean Text Statement (Elian Ross Style, NO Box) */}
          <div className="absolute top-2 sm:top-6 right-1 sm:right-4 md:right-8 z-20 max-w-[220px] sm:max-w-[260px] text-right hidden sm:block">
            <p className="text-xs sm:text-sm text-neutral-700 leading-relaxed font-normal">
              {portfolioData.hero?.bio || "passionate about scaling business ventures, digital products & data-driven operations that deliver real impact."}
            </p>
          </div>

          {/* FLOATING ELEMENT 3 (Bottom-Left): Social proof & 7x awards */}
          <div className="absolute bottom-2 sm:bottom-6 left-1 sm:left-4 md:left-8 z-20">
            <div className="bg-white/95 backdrop-blur-md border border-teal-100/90 rounded-2xl px-3.5 sm:px-4 py-2.5 shadow-sm flex items-center gap-3">
              <div className="flex -space-x-2 overflow-hidden">
                <img className="inline-block h-6 w-6 rounded-full ring-2 ring-white object-cover" src="/11.png" alt="Award 1" />
                <img className="inline-block h-6 w-6 rounded-full ring-2 ring-white object-cover" src="/12.png" alt="Award 2" />
                <img className="inline-block h-6 w-6 rounded-full ring-2 ring-white object-cover" src="/16.png" alt="Award 3" />
              </div>
              <div className="text-left">
                <p className="text-[11px] font-bold text-[#18181B] leading-tight">🏆 {portfolioData.hero?.stat1Value || "7x"} {portfolioData.hero?.stat1Label || "National Awards"}</p>
                <p className="text-[10px] text-teal-700 font-medium leading-tight">{portfolioData.hero?.stat2Value ? `${portfolioData.hero.stat2Value} ${portfolioData.hero.stat2Label || "Reach"}` : "Business Case & IT Innovation"}</p>
              </div>
            </div>
          </div>

          {/* FLOATING ELEMENT 4 (Bottom-Right): Sleek Solid Pill Button (Elian Ross Style) */}
          <div className="absolute bottom-2 sm:bottom-6 right-1 sm:right-4 md:right-8 z-20">
            <a
              href={portfolioData.socials?.whatsapp || "https://wa.me/6281234567890"}
              target="_blank"
              rel="noopener noreferrer"
              className="bg-[#0B2321] hover:bg-[#134E4A] text-white rounded-full px-5 sm:px-6 py-2.5 sm:py-3 text-xs sm:text-sm font-semibold shadow-md hover:shadow-lg transition-all flex items-center gap-2 cursor-pointer group"
            >
              <span>✦ Chat on WhatsApp</span>
              <span className="group-hover:translate-x-0.5 transition-transform">→</span>
            </a>
          </div>

          {/* CENTERED SUBJECT / PORTRAIT WITH SMOOTH MASK FADE */}
          <div className="relative w-[280px] sm:w-[360px] md:w-[420px] h-[360px] sm:h-[460px] md:h-[500px] flex items-end justify-center">
            <img
              src={portfolioData.hero?.avatarImg || "/2.png"}
              alt="Chikal Nazmi"
              className="w-full h-full object-contain object-bottom select-none transition-transform duration-500 hover:scale-[1.02] [mask-image:linear-gradient(to_bottom,black_80%,transparent_100%)]"
            />
          </div>

        </div>

        {/* 4 Statistical Metrics Bar (Real-time from CMS Tab Hero) */}
        <div className="relative z-10 max-w-4xl mx-auto mt-10 grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 px-2">
          <div className="bg-white/90 backdrop-blur-md rounded-2xl p-3.5 sm:p-4 border border-teal-100/90 shadow-xs hover:border-teal-300 transition-colors text-center">
            <span className="font-serif font-bold text-2xl sm:text-3xl text-teal-950 block">
              {portfolioData.hero?.stat1Value || "7x"}
            </span>
            <span className="text-[10px] sm:text-[11px] uppercase font-bold text-neutral-500 tracking-wider block mt-0.5">
              {portfolioData.hero?.stat1Label || "Penghargaan Lomba"}
            </span>
          </div>
          <div className="bg-white/90 backdrop-blur-md rounded-2xl p-3.5 sm:p-4 border border-rose-100/90 shadow-xs hover:border-rose-300 transition-colors text-center">
            <span className="font-serif font-bold text-2xl sm:text-3xl text-rose-900 block">
              {portfolioData.hero?.stat2Value || "10K+"}
            </span>
            <span className="text-[10px] sm:text-[11px] uppercase font-bold text-neutral-500 tracking-wider block mt-0.5">
              {portfolioData.hero?.stat2Label || "Jangkauan Konten"}
            </span>
          </div>
          <div className="bg-white/90 backdrop-blur-md rounded-2xl p-3.5 sm:p-4 border border-teal-100/90 shadow-xs hover:border-teal-300 transition-colors text-center">
            <span className="font-serif font-bold text-2xl sm:text-3xl text-teal-950 block">
              {portfolioData.hero?.stat3Value || "20+"}
            </span>
            <span className="text-[10px] sm:text-[11px] uppercase font-bold text-neutral-500 tracking-wider block mt-0.5">
              {portfolioData.hero?.stat3Label || "Mitra Event"}
            </span>
          </div>
          <div className="bg-white/90 backdrop-blur-md rounded-2xl p-3.5 sm:p-4 border border-rose-100/90 shadow-xs hover:border-rose-300 transition-colors text-center">
            <span className="font-serif font-bold text-2xl sm:text-3xl text-rose-900 block">
              {portfolioData.hero?.stat4Value || "D4 SIB"}
            </span>
            <span className="text-[10px] sm:text-[11px] uppercase font-bold text-neutral-500 tracking-wider block mt-0.5">
              {portfolioData.hero?.stat4Label || "Polinema"}
            </span>
          </div>
        </div>

      </section>

      {/* ========================================================================= */}
      {/* 3. LOGO TICKER / CREDENTIAL ROW (Polinema, GDSC, Brands)                 */}
      {/* ========================================================================= */}
      <section className="py-7 border-y border-teal-100/50 bg-white/60 overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 flex items-center justify-between flex-wrap gap-6 sm:gap-8 opacity-80 transition-all duration-300">
          <div className="flex items-center gap-2 text-xs sm:text-sm font-medium text-neutral-600 hover:text-teal-800 transition-colors">
            <span>🎓</span>
            <span>Politeknik Negeri Malang</span>
          </div>
          <div className="flex items-center gap-2 text-xs sm:text-sm font-medium text-neutral-600 hover:text-teal-800 transition-colors">
            <span>🌐</span>
            <span>GDSC Google Polinema</span>
          </div>
          <div className="flex items-center gap-2 text-xs sm:text-sm font-medium text-neutral-600 hover:text-rose-800 transition-colors">
            <span>🌸</span>
            <span>Manikarumi Hijab</span>
          </div>
          <div className="flex items-center gap-2 text-xs sm:text-sm font-medium text-neutral-600 hover:text-rose-800 transition-colors">
            <span>🧶</span>
            <span>Yarn Up Creative</span>
          </div>
          <div className="flex items-center gap-2 text-xs sm:text-sm font-medium text-neutral-600 hover:text-teal-800 transition-colors">
            <span>🎬</span>
            <span>Dua Sisi Media</span>
          </div>
          <div className="flex items-center gap-2 text-xs sm:text-sm font-medium text-neutral-600 hover:text-teal-800 transition-colors">
            <span>🚀</span>
            <span>RevoU Digital Marketing</span>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 4. BENTO VISUAL SHOWCASE MOSAIC (Curated Project Previews)                */}
      {/* ========================================================================= */}
      <section className="py-16 sm:py-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="bg-gradient-to-b from-teal-50/50 via-rose-50/30 to-white rounded-4xl p-6 sm:p-10 border border-teal-100/80 shadow-xs">
          
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
            <div>
              <span className="font-serif italic font-normal text-xl sm:text-2xl text-teal-600 block">/ Curated Portfolio /</span>
              <h2 className="font-sans font-medium text-3xl sm:text-4xl text-[#18181B] tracking-tight mt-1">
                Visual Work Mosaic
              </h2>
            </div>
            <p className="text-xs sm:text-sm text-neutral-600 max-w-sm">
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
              className="lg:col-span-7 bg-white rounded-3xl p-5 border border-teal-100/80 shadow-xs hover:shadow-md transition-all cursor-pointer group"
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
                  <h3 className="font-sans font-bold text-base sm:text-lg text-[#18181B] group-hover:text-teal-700 transition-colors">
                    {projectsList[0]?.title || "Sistem Manajemen Pelanggan Koran"}
                  </h3>
                  <p className="text-xs text-neutral-500 mt-0.5">{projectsList[0]?.tag || "Database Relasional & Sirkulasi Otomatis"}</p>
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
              className="lg:col-span-5 bg-white rounded-3xl p-5 border border-teal-100/80 shadow-xs hover:shadow-md transition-all cursor-pointer group"
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
                  <h3 className="font-sans font-bold text-base sm:text-lg text-[#18181B] group-hover:text-teal-700 transition-colors">
                    {projectsList[1]?.title || "Website SurveyKu Analytics"}
                  </h3>
                  <p className="text-xs text-neutral-500 mt-0.5">{projectsList[1]?.tag || "User Feedback & Data Modeling"}</p>
                </div>
                <span className="text-xs font-semibold px-3 py-1 rounded-full bg-teal-50 text-teal-800 border border-teal-200">
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
              className="lg:col-span-5 bg-white rounded-3xl p-5 border border-teal-100/80 shadow-xs hover:shadow-md transition-all cursor-pointer group"
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
                  <h3 className="font-sans font-bold text-base sm:text-lg text-[#18181B] group-hover:text-teal-700 transition-colors">
                    {projectsList[2]?.title || "JTI Certify Platform"}
                  </h3>
                  <p className="text-xs text-neutral-500 mt-0.5">{projectsList[2]?.tag || "Anti-Forgery Digital Credential"}</p>
                </div>
                <span className="text-xs font-semibold px-3 py-1 rounded-full bg-purple-50 text-purple-800 border border-purple-200">
                  Polinema JTI
                </span>
              </div>
            </div>

            {/* Card 4 (Large - Manikarumi & Yarn Up Campaigns / Dynamic Project 4) */}
            <div 
              onClick={() => openModal({
                title: projectsList[3]?.title || 'Manikarumi & Yarn Up Commercial Campaigns',
                category: projectsList[3]?.category || 'COMMERCIAL CREATIVE & CAMPAIGN',
                description: projectsList[3]?.summary || 'Eksekusi strategi konten media sosial berdaya jangkau tinggi, fotografi katalog produk, dan optimalisasi funnel konversi penjualan produk fashion hijab.',
                images: projectsList[3]?.extraImages && projectsList[3]?.extraImages.length > 0 ? projectsList[3].extraImages : ['/17.png', '/18.png', '/7.png', '/8.png'],
                link: projectsList[3]?.link || 'https://instagram.com/chikalnazmi',
                linkLabel: projectsList[3]?.linkLabel || 'Lihat Instagram ↗'
              })}
              className="lg:col-span-7 bg-white rounded-3xl p-5 border border-rose-100/80 shadow-xs hover:shadow-md transition-all cursor-pointer group"
            >
              <div className="relative overflow-hidden rounded-2xl bg-neutral-100 h-56 sm:h-72 mb-4">
                <img 
                  src={projectsList[3]?.image || "/17.png"} 
                  alt={projectsList[3]?.title || "Manikarumi Campaign"}
                  className="w-full h-full object-cover object-top group-hover:scale-[1.02] transition-transform duration-500" 
                />
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-sans font-bold text-base sm:text-lg text-[#18181B] group-hover:text-rose-700 transition-colors">
                    {projectsList[3]?.title || "Manikarumi & Yarn Up Commercial Campaigns"}
                  </h3>
                  <p className="text-xs text-neutral-500 mt-0.5">{projectsList[3]?.tag || "Short-Form Video Production & Reach Surge"}</p>
                </div>
                <span className="text-xs font-semibold px-3 py-1 rounded-full bg-rose-50 text-rose-800 border border-rose-200">
                  {projectsList[3]?.results?.[0] || "+2,089% Reach"}
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
        
        {/* Soft Center Aura (Teal + Rose) */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] sm:w-[480px] h-[300px] sm:h-[480px] teal-halo-glow-subtle rounded-full pointer-events-none z-0"></div>

        {/* Script / Editorial Kicker */}
        <div className="relative z-10 mb-4">
          <span className="font-serif italic font-normal text-2xl sm:text-3xl text-teal-600 block">/ What I do /</span>
        </div>

        {/* Big Bold Statement with Highlighted Words (Elian Ross Style) */}
        <div className="relative z-10 max-w-3xl mx-auto mb-12">
          <p className="font-sans font-normal text-2xl sm:text-4xl md:text-5xl text-[#18181B] leading-snug sm:leading-tight tracking-tight">
            my focus is on blending{' '}
            <strong className="font-semibold text-teal-950">clear business strategy</strong>,{' '}
            <strong className="font-semibold text-teal-950">thoughtful operational systems</strong>, and{' '}
            <span className="font-serif italic font-normal text-rose-800">creative storytelling</span>{' '}
            to craft experiences that{' '}
            <span className="underline decoration-teal-300 decoration-wavy underline-offset-8">
              solve real problems
            </span>.
          </p>
        </div>

        {/* Floating Skill Pills Around the Statement with Green-Teal & Rose accents */}
        <div className="relative z-10 flex flex-wrap justify-center gap-2.5 sm:gap-3 max-w-3xl mx-auto">
          {((portfolioData.skills && portfolioData.skills.length > 0)
            ? portfolioData.skills.flatMap(cat => cat.skills.map(s => ({ name: s, type: cat.type })))
            : [
                { name: 'Business Model Canvas', type: 'hard' },
                { name: 'UI/UX & Market Research', type: 'hard' },
                { name: 'SOP & Operational Flow', type: 'hard' },
                { name: 'Figma Prototyping', type: 'hard' },
                { name: 'Short-Form Video & CapCut', type: 'hard' },
                { name: 'B2B Partnerships Strategy', type: 'hard' }
              ]
          ).slice(0, 15).map((skill, sIdx) => {
            const isRose = skill.type === 'soft' || sIdx % 3 === 2;
            const isCyan = sIdx % 3 === 1;
            return (
              <span 
                key={sIdx}
                className={`inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white border ${
                  isRose ? 'border-rose-200/80 hover:border-rose-400' : 'border-teal-200/80 hover:border-teal-400'
                } shadow-xs text-xs font-semibold text-[#18181B] transition-colors`}
              >
                <span className={`w-2 h-2 rounded-full ${
                  isRose ? 'bg-rose-500' : isCyan ? 'bg-teal-500 shadow-[0_0_6px_rgba(20,184,166,0.7)]' : 'bg-emerald-500 shadow-[0_0_6px_rgba(16,185,129,0.7)]'
                }`}></span>
                <span>{skill.name}</span>
              </span>
            );
          })}
        </div>

      </section>

      {/* ========================================================================= */}
      {/* 6. PROCESS ROADMAP ("Here's how it works" with Curving Connector Doodle)  */}
      {/* ========================================================================= */}
      <section id="process" className="py-20 sm:py-28 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto relative">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="font-serif italic font-normal text-2xl sm:text-3xl text-teal-600 block">/ How I Deliver Value /</span>
          <h2 className="font-sans font-medium text-4xl sm:text-5xl text-[#18181B] tracking-tight mt-1">
            Here&apos;s how it works
          </h2>
          <p className="text-xs sm:text-sm text-neutral-600 mt-3">
            Tiga pilar pendekatan terstruktur dalam membedah tantangan bisnis, merumuskan solusi sistematis, dan mengeksekusinya secara terukur.
          </p>
        </div>

        {/* 3 Process Cards with Connected Curvy Doodle Line (Elian Ross Style) */}
        <div className="relative">
          
          {/* Curvy Green-Teal Connector Line SVG (Desktop) */}
          <div className="hidden md:block absolute top-12 left-1/4 right-1/4 h-24 pointer-events-none z-10">
            <svg className="w-full h-full" viewBox="0 0 500 100" fill="none" preserveAspectRatio="none">
              <path 
                d="M 20 50 C 120 10, 180 80, 250 30 C 320 -20, 380 90, 480 40" 
                stroke="#10B981" 
                strokeWidth="2.5" 
                strokeDasharray="6 6"
                className="opacity-70"
              />
              <circle cx="20" cy="50" r="4" fill="#10B981" />
              <circle cx="250" cy="30" r="4" fill="#14B8A6" />
              <circle cx="480" cy="40" r="4" fill="#10B981" />
            </svg>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 relative z-20">
            
            {/* Card 01 - Discover */}
            <div className="process-card p-8 rounded-3xl bg-white border border-teal-100/90 shadow-xs flex flex-col justify-between relative group">
              <div>
                <span className="font-sans font-light text-5xl text-teal-300 group-hover:text-teal-500 transition-colors">01</span>
                <h3 className="font-sans font-bold text-2xl text-[#18181B] mt-4 mb-2">
                  Discover
                </h3>
                <p className="text-xs sm:text-sm text-neutral-600 leading-relaxed">
                  Riset pasar mendalam, wawancara pengguna (user interview), analisis kendala operasional (bottlenecks), dan pemetaan peluang bisnis nyata.
                </p>
              </div>
              <div className="mt-8 pt-4 border-t border-teal-100/60 flex items-center justify-between text-[11px] font-semibold text-teal-800">
                <span>Market &amp; User Needs</span>
                <span>🔍</span>
              </div>
            </div>

            {/* Card 02 - Strategize */}
            <div className="process-card p-8 rounded-3xl bg-white border border-teal-100/90 shadow-xs flex flex-col justify-between relative group">
              <div>
                <span className="font-sans font-light text-5xl text-teal-300 group-hover:text-teal-500 transition-colors">02</span>
                <h3 className="font-sans font-bold text-2xl text-[#18181B] mt-4 mb-2">
                  Strategize
                </h3>
                <p className="text-xs sm:text-sm text-neutral-600 leading-relaxed">
                  Merumuskan Business Model Canvas, analisis kelayakan finansial, standard operating procedure (SOP), serta konsep kreatif penceritaan brand.
                </p>
              </div>
              <div className="mt-8 pt-4 border-t border-teal-100/60 flex items-center justify-between text-[11px] font-semibold text-teal-800">
                <span>Business Model &amp; SOP</span>
                <span>📐</span>
              </div>
            </div>

            {/* Card 03 - Deliver */}
            <div className="process-card p-8 rounded-3xl bg-white border border-teal-100/90 shadow-xs flex flex-col justify-between relative group">
              <div>
                <span className="font-sans font-light text-5xl text-teal-300 group-hover:text-teal-500 transition-colors">03</span>
                <h3 className="font-sans font-bold text-2xl text-[#18181B] mt-4 mb-2">
                  Deliver
                </h3>
                <p className="text-xs sm:text-sm text-neutral-600 leading-relaxed">
                  Eksekusi kampanye pemasaran digital, pembuatan prototipe interaktif, dan pelacakan metrik keberhasilan (KPI) yang terukur.
                </p>
              </div>
              <div className="mt-8 pt-4 border-t border-teal-100/60 flex items-center justify-between text-[11px] font-semibold text-teal-800">
                <span>Execution &amp; KPI Reach</span>
                <span>🚀</span>
              </div>
            </div>

          </div>
        </div>

        {/* 2 Clean Quote / Highlight Cards Underneath */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-12 max-w-5xl mx-auto">
          
          <div className="bg-white p-6 sm:p-7 rounded-3xl border border-teal-100/80 shadow-xs flex items-start gap-4">
            <span className="text-3xl text-teal-400 font-serif leading-none">“</span>
            <div>
              <p className="text-xs sm:text-sm text-[#18181B] italic leading-relaxed">
                {awardsList[0]?.desc ? `${awardsList[0].title} — ${awardsList[0].desc}` : "Kemampuan analisis komprehensif dalam memadukan kelayakan bisnis, tata kelola data sistem informasi, dan presentasi meyakinkan terbukti membawakan 7 gelar juara nasional."}
              </p>
              <div className="flex items-center gap-3 mt-4">
                <img src={awardsList[0]?.certImg || "/11.png"} alt="Award" className="w-8 h-8 rounded-full object-cover ring-2 ring-teal-100" />
                <div>
                  <h4 className="font-bold text-xs text-[#18181B]">{awardsList[0]?.title || "National Fest Business Plan Competition"}</h4>
                  <p className="text-[10px] text-teal-700">{awardsList[0]?.rank || "Juara 1 Tingkat Nasional"} {awardsList[0]?.year ? `(${awardsList[0].year})` : ""}</p>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 sm:p-7 rounded-3xl border border-rose-100/80 shadow-xs flex items-start gap-4">
            <span className="text-3xl text-rose-300 font-serif leading-none">“</span>
            <div>
              <p className="text-xs sm:text-sm text-[#18181B] italic leading-relaxed">
                {portfolioData.creatorAccounts?.manikarumi?.centerDesc || "Inisiatif kepemimpinan di Manikarumi dan GDSC Polinema mempercepat lonjakan jangkauan konten organik hingga +2.089% dengan storytelling yang memikat audiens muda."}
              </p>
              <div className="flex items-center gap-3 mt-4">
                <img src={portfolioData.creatorAccounts?.manikarumi?.centerImg || "/17.png"} alt="Manikarumi" className="w-8 h-8 rounded-full object-cover ring-2 ring-rose-100" />
                <div>
                  <h4 className="font-bold text-xs text-[#18181B]">{portfolioData.creatorAccounts?.manikarumi?.name || "Commercial Content Growth"}</h4>
                  <p className="text-[10px] text-rose-700">{portfolioData.creatorAccounts?.manikarumi?.stats || "Brand Impact & Reach Surge"}</p>
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
            <span className="font-serif italic font-normal text-2xl sm:text-3xl text-teal-600 block">/ Selected Works /</span>
            <h2 className="font-sans font-medium text-4xl sm:text-5xl text-[#18181B] tracking-tight mt-1">
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
                    ? 'bg-[#0B2321] text-white shadow-xs'
                    : 'bg-white text-neutral-600 border border-teal-100 hover:border-teal-300'
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
              className="editorial-card p-5 sm:p-6 rounded-4xl bg-white border border-teal-100/90 shadow-xs hover:shadow-lg transition-all cursor-pointer group flex flex-col justify-between"
            >
              {/* Project Image Container */}
              <div className="relative overflow-hidden rounded-3xl bg-neutral-100 aspect-[16/10] sm:aspect-[16/11] mb-5">
                <img
                  src={project.image || "/1.png"}
                  alt={project.title}
                  className="w-full h-full object-cover object-top group-hover:scale-[1.03] transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-300 flex items-center justify-center">
                  <span className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 px-4 py-2 rounded-full bg-white/95 backdrop-blur-md text-xs font-bold text-[#18181B] shadow-sm">
                    🔍 Lihat Dokumentasi &amp; Hasil
                  </span>
                </div>
              </div>

              {/* Title on Left, Tag Pills on Right */}
              <div className="flex items-start justify-between gap-4 pt-1">
                <div>
                  <h3 className="font-sans font-bold text-lg sm:text-xl text-[#18181B] group-hover:text-teal-700 transition-colors">
                    {project.title}
                  </h3>
                  <p className="text-xs text-neutral-500 mt-1 line-clamp-1">
                    {project.summary}
                  </p>
                </div>

                <div className="flex flex-wrap gap-1.5 justify-end shrink-0">
                  <span className="text-[11px] font-semibold px-3 py-1 rounded-full bg-teal-50 text-teal-800 border border-teal-100">
                    {project.tag || "Case Study"}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>

      </section>

      {/* ========================================================================= */}
      {/* CREATIVE MEDIA & CONTENT CREATOR SHOWCASE (CMS Video & Creator Tab)        */}
      {/* ========================================================================= */}
      <section id="creator" className="py-20 sm:py-28 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto border-t border-teal-100/50">
        
        {/* Section Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6 mb-12">
          <div>
            <span className="font-serif italic font-normal text-2xl sm:text-3xl text-teal-600 block">/ Content &amp; Media /</span>
            <h2 className="font-sans font-medium text-4xl sm:text-5xl text-[#18181B] tracking-tight mt-1">
              Creator Studio &amp; Social Growth
            </h2>
            <p className="text-xs sm:text-sm text-neutral-600 mt-2 max-w-md">
              Produksi video pendek bernuansa sinematik, visual merchandising ritel festival, dan kurasi katalog produk yang mendorong interaksi audiens.
            </p>
          </div>

          {/* Account Switcher Tabs (From CMS data.creatorAccounts) */}
          <div className="flex flex-wrap gap-2">
            {Object.keys(portfolioData.creatorAccounts || {}).map((accKey) => {
              const acc = portfolioData.creatorAccounts[accKey];
              return (
                <button
                  key={accKey}
                  onClick={() => setActiveCreatorKey(accKey)}
                  className={`px-4 py-1.5 rounded-full text-xs font-semibold transition-all cursor-pointer ${
                    activeCreatorKey === accKey
                      ? 'bg-[#0B2321] text-white shadow-xs'
                      : 'bg-white text-neutral-600 border border-teal-100 hover:border-teal-300'
                  }`}
                >
                  <span>{acc.name}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Selected Creator Account Display */}
        {currentCreator && (
          <div className="bg-gradient-to-b from-rose-50/30 via-white to-teal-50/30 rounded-4xl p-6 sm:p-10 border border-rose-100/80 shadow-xs">
            
            {/* Account Info Bar */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-8 border-b border-teal-100/60">
              <div>
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white border border-rose-200/80 text-[11px] font-bold text-rose-900 mb-2">
                  <span>🎬 {currentCreator.tag}</span>
                </div>
                <h3 className="font-sans font-bold text-2xl sm:text-3xl text-[#18181B]">
                  {currentCreator.name} <span className="font-mono font-normal text-sm sm:text-base text-teal-700">{currentCreator.handle}</span>
                </h3>
                <p className="text-xs text-neutral-500 mt-1">
                  Platform: {currentCreator.platforms}
                </p>
              </div>

              <div className="flex items-center gap-3">
                <span className="px-4 py-2 rounded-2xl bg-emerald-50 text-emerald-900 border border-emerald-200 font-bold text-xs sm:text-sm">
                  📈 {currentCreator.stats}
                </span>
                {currentCreator.link && (
                  <a
                    href={currentCreator.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-4 py-2 rounded-full bg-[#0B2321] text-white text-xs font-semibold hover:bg-[#134E4A] transition-colors"
                  >
                    Buka Akun ↗
                  </a>
                )}
              </div>
            </div>

            {/* Media Gallery / Phone Mockups + Center Stage */}
            <div className="grid grid-cols-1 md:grid-cols-12 gap-6 mt-8 items-stretch">
              
              {/* Left Media Card (Left Phone Mockup) */}
              <div 
                className="md:col-span-3 bg-white rounded-3xl p-4 border border-teal-100/80 shadow-xs hover:shadow-md transition-all cursor-pointer group flex flex-col justify-between"
                onClick={() => openModal({
                  title: currentCreator.leftPhoneTitle || currentCreator.name,
                  category: currentCreator.leftPhoneTag || 'SOCIAL MEDIA REELS',
                  description: `${currentCreator.name} — ${currentCreator.leftPhoneTitle}. Platform: ${currentCreator.platforms}.`,
                  images: [currentCreator.leftPhoneImg || '/1.png'],
                  link: currentCreator.leftPhoneLink || currentCreator.link,
                  linkLabel: 'Buka Konten ↗'
                })}
              >
                <div className="relative overflow-hidden rounded-2xl bg-neutral-100 aspect-[9/16] max-h-[320px] mb-3">
                  <img
                    src={currentCreator.leftPhoneImg || "/4.png"}
                    alt={currentCreator.leftPhoneTitle}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute top-2 left-2 px-2.5 py-0.5 rounded-full bg-black/60 backdrop-blur-xs text-[10px] font-bold text-white">
                    {currentCreator.leftPhoneTag || "Reels"}
                  </div>
                </div>
                <div>
                  <h4 className="font-bold text-xs sm:text-sm text-[#18181B] group-hover:text-teal-700 transition-colors">
                    {currentCreator.leftPhoneTitle}
                  </h4>
                  <span className="text-[10px] text-teal-600 font-medium">Lihat Media ↗</span>
                </div>
              </div>

              {/* Center Stage Card (Center Showcase) */}
              <div 
                className="md:col-span-6 bg-white rounded-3xl p-5 sm:p-6 border border-rose-100/90 shadow-xs hover:shadow-md transition-all cursor-pointer group flex flex-col justify-between"
                onClick={() => openModal({
                  title: currentCreator.centerTitle || currentCreator.name,
                  category: 'CREATIVE SHOWCASE',
                  description: currentCreator.centerDesc,
                  images: [currentCreator.centerImg || '/2.png'],
                  link: currentCreator.centerLink || currentCreator.link,
                  linkLabel: 'Lihat Video / Katalog ↗'
                })}
              >
                <div className="relative overflow-hidden rounded-2xl bg-neutral-100 aspect-[16/10] sm:aspect-[16/11] mb-4">
                  <img
                    src={currentCreator.centerImg || "/3.png"}
                    alt={currentCreator.centerTitle}
                    className="w-full h-full object-cover group-hover:scale-[1.02] transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent flex items-end p-4">
                    <div>
                      <span className="text-[10px] font-bold uppercase tracking-wider text-rose-200">
                        ⭐ Highlight Spotlight
                      </span>
                      <h4 className="font-serif italic font-normal text-xl sm:text-2xl text-white">
                        {currentCreator.centerTitle}
                      </h4>
                    </div>
                  </div>
                </div>

                <div>
                  <p className="text-xs sm:text-sm text-neutral-600 leading-relaxed">
                    {currentCreator.centerDesc}
                  </p>
                  <div className="mt-4 pt-3 border-t border-rose-100/60 flex items-center justify-between text-xs font-semibold text-rose-800">
                    <span>{currentCreator.centerLink ? "Tonton Konten Pilihan ↗" : "Dokumentasi Galeri"}</span>
                    <span className="group-hover:translate-x-1 transition-transform">→</span>
                  </div>
                </div>
              </div>

              {/* Right Media Card (Right Phone Mockup) */}
              <div 
                className="md:col-span-3 bg-white rounded-3xl p-4 border border-teal-100/80 shadow-xs hover:shadow-md transition-all cursor-pointer group flex flex-col justify-between"
                onClick={() => openModal({
                  title: currentCreator.rightPhoneTitle || currentCreator.name,
                  category: currentCreator.rightPhoneTag || 'TIKTOK CONTENT',
                  description: `${currentCreator.name} — ${currentCreator.rightPhoneTitle}. Platform: ${currentCreator.platforms}.`,
                  images: [currentCreator.rightPhoneImg || '/1.png'],
                  link: currentCreator.rightPhoneLink || currentCreator.link,
                  linkLabel: 'Buka Konten ↗'
                })}
              >
                <div className="relative overflow-hidden rounded-2xl bg-neutral-100 aspect-[9/16] max-h-[320px] mb-3">
                  <img
                    src={currentCreator.rightPhoneImg || "/5.png"}
                    alt={currentCreator.rightPhoneTitle}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute top-2 left-2 px-2.5 py-0.5 rounded-full bg-black/60 backdrop-blur-xs text-[10px] font-bold text-white">
                    {currentCreator.rightPhoneTag || "TikTok"}
                  </div>
                </div>
                <div>
                  <h4 className="font-bold text-xs sm:text-sm text-[#18181B] group-hover:text-teal-700 transition-colors">
                    {currentCreator.rightPhoneTitle}
                  </h4>
                  <span className="text-[10px] text-teal-600 font-medium">Lihat Media ↗</span>
                </div>
              </div>

            </div>

          </div>
        )}

      </section>

      {/* ========================================================================= */}
      {/* 8. PUSHING BOUNDARIES (About Story & Clean Career Timeline)              */}
      {/* ========================================================================= */}
      <section id="experience" className="py-20 sm:py-28 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto border-t border-teal-100/50">
        
        {/* Kicker & Title (Elian Ross Style: Title Bold + Year Muted Light) */}
        <div className="mb-14">
          <span className="font-serif italic font-normal text-2xl sm:text-3xl text-teal-600 block">/ Who Am I /</span>
          <h2 className="font-sans font-medium text-4xl sm:text-6xl text-[#18181B] tracking-tight mt-1">
            Pushing Boundaries <span className="font-sans font-light text-neutral-400">since 2020</span>
          </h2>
        </div>

        {/* 2 Columns: Photo & Bio Left, Clean Horizontal Timeline Right */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 sm:gap-14 items-start">
          
          {/* Left Column: Stylized Portrait Card & Social Links */}
          <div className="lg:col-span-5 space-y-6">
            <div className="relative overflow-hidden rounded-4xl bg-[#0B2321] p-4 sm:p-5 shadow-lg border border-teal-900/40">
              <div className="relative aspect-[4/5] rounded-3xl overflow-hidden bg-neutral-900">
                <img
                  src={portfolioData.hero?.avatarImg || "/2.png"}
                  alt="Chikal Portrait"
                  className="w-full h-full object-cover object-top"
                />
              </div>
              <div className="mt-4 px-2 flex items-center justify-between">
                <div>
                  <h4 className="font-serif italic font-normal text-xl text-white">Chikal Nazmi</h4>
                  <p className="text-xs text-teal-300">Business &amp; Digital Strategist</p>
                </div>
                <span className="text-xs font-mono text-teal-200/60">2020 — 2026</span>
              </div>
            </div>

            {/* Social Icons Row with Teal & Rose Touch */}
            <div className="flex items-center justify-center gap-3 p-3 bg-white rounded-full border border-teal-100/80 shadow-xs">
              <a
                href={portfolioData.socials?.linkedin || "https://linkedin.com"}
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 rounded-full bg-teal-50 text-teal-900 hover:bg-[#0B2321] hover:text-white transition-colors flex items-center justify-center text-xs font-bold"
                title="LinkedIn"
              >
                in
              </a>
              <a
                href={portfolioData.socials?.instagram || "https://instagram.com/chikalnazmi"}
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 rounded-full bg-rose-50 text-rose-900 hover:bg-[#0B2321] hover:text-white transition-colors flex items-center justify-center text-xs font-bold"
                title="Instagram"
              >
                ig
              </a>
              <a
                href={portfolioData.socials?.tiktok || "https://tiktok.com"}
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 rounded-full bg-teal-50 text-teal-900 hover:bg-[#0B2321] hover:text-white transition-colors flex items-center justify-center text-xs font-bold"
                title="TikTok"
              >
                tt
              </a>
              <a
                href={`mailto:${portfolioData.socials?.email || "chikalnazmi@gmail.com"}`}
                className="w-9 h-9 rounded-full bg-rose-50 text-rose-900 hover:bg-[#0B2321] hover:text-white transition-colors flex items-center justify-center text-xs font-bold"
                title="Email"
              >
                ✉
              </a>
              {portfolioData.socials?.youtube && (
                <a
                  href={portfolioData.socials.youtube}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-9 h-9 rounded-full bg-rose-50 text-rose-900 hover:bg-[#0B2321] hover:text-white transition-colors flex items-center justify-center text-xs font-bold"
                  title="YouTube"
                >
                  yt
                </a>
              )}
              {portfolioData.socials?.medium && (
                <a
                  href={portfolioData.socials.medium}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-9 h-9 rounded-full bg-teal-50 text-teal-900 hover:bg-[#0B2321] hover:text-white transition-colors flex items-center justify-center text-xs font-bold"
                  title="Medium"
                >
                  m
                </a>
              )}
            </div>
          </div>

          {/* Right Column: Narrative Story & Clean Horizontal Career Rows */}
          <div className="lg:col-span-7 space-y-8">
            <p className="text-sm sm:text-base text-neutral-700 leading-relaxed font-normal">
              Lulusan <strong>{academicData.degree || "Sarjana Terapan Sistem Informasi Bisnis (D4 SIB)"} {academicData.institution || "Politeknik Negeri Malang"}</strong> dengan predikat <em>{academicData.badge || "Cum Laude"} (IPK {academicData.gpaValue || "3.84"})</em>{academicData.toeicScore ? ` serta sertifikasi internasional TOEIC ${academicData.toeicScore} (${academicData.toeicLevel || "Working Proficiency"})` : ""}. {academicData.description || "Berfokus pada perancangan model bisnis, tata kelola data sistem informasi, serta optimalisasi strategi media komersial yang terbukti memperluas pangsa pasar dan memenangkan kompetisi nasional."}
            </p>

            {/* Clean Timeline Rows (Elian Ross Style) */}
            <div className="border-t border-teal-100">
              {experiencesList.map((exp, idx) => (
                <div 
                  key={exp.id || idx}
                  className="py-4 sm:py-5 border-b border-teal-100/60 flex flex-col sm:flex-row sm:items-center justify-between gap-2 sm:gap-4 hover:bg-teal-50/40 px-2 rounded-xl transition-colors cursor-pointer group"
                  onClick={() => openModal({
                    title: exp.title,
                    category: exp.category || 'WORK EXPERIENCE',
                    description: `${exp.summary}${exp.results && exp.results.length > 0 ? `\n\nFokus & Capaian:\n• ${exp.results.join('\n• ')}` : ''}`,
                    images: exp.extraImages && exp.extraImages.length > 0 ? exp.extraImages : [exp.image || '/1.png'],
                    link: exp.link,
                    linkLabel: exp.linkLabel || 'Profil Bisnis ↗'
                  })}
                >
                  <div>
                    <h4 className="font-sans font-bold text-sm sm:text-base text-[#18181B] group-hover:text-teal-700 transition-colors">
                      {exp.title}
                    </h4>
                    <p className="text-xs text-neutral-500">
                      {exp.category} · {exp.tag}
                    </p>
                  </div>

                  <div className="flex items-center gap-3 self-start sm:self-auto">
                    <span className="text-[11px] font-medium text-teal-900 bg-teal-50 px-2.5 py-0.5 rounded-full border border-teal-100">
                      {exp.period}
                    </span>
                    <span className="text-xs text-teal-400 group-hover:translate-x-1 transition-transform">→</span>
                  </div>
                </div>
              ))}

              {/* Education Entry */}
              <div 
                className="py-4 sm:py-5 border-b border-teal-100/60 flex flex-col sm:flex-row sm:items-center justify-between gap-2 sm:gap-4 hover:bg-teal-50/40 px-2 rounded-xl transition-colors cursor-pointer group"
                onClick={() => openModal({
                  title: `${academicData.degree} · ${academicData.institution}`,
                  category: 'FORMAL EDUCATION',
                  description: academicData.description,
                  images: academicData.images && academicData.images.length > 0 ? academicData.images : ['/11.png', '/12.png', '/16.png'],
                })}
              >
                <div>
                  <h4 className="font-sans font-bold text-sm sm:text-base text-[#18181B] group-hover:text-teal-700 transition-colors">
                    {academicData.degree}
                  </h4>
                  <p className="text-xs text-neutral-500">
                    {academicData.institution} · GPA {academicData.gpaValue}
                  </p>
                </div>

                <div className="flex items-center gap-3 self-start sm:self-auto">
                  <span className="text-[11px] font-medium text-teal-900 bg-teal-50 px-2.5 py-0.5 rounded-full border border-teal-100">
                    {academicData.period}
                  </span>
                  <span className="text-xs text-teal-400 group-hover:translate-x-1 transition-transform">→</span>
                </div>
              </div>
            </div>

            {/* Micro Callout for CV */}
            <div className="flex items-center gap-4 pt-2">
              <a
                href={portfolioData.socials?.whatsapp || "https://wa.me/6281234567890"}
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs font-semibold text-teal-800 underline underline-offset-4 hover:text-teal-950 transition-colors"
              >
                Minta Dokumen Curriculum Vitae (CV) via WhatsApp ↗
              </a>
            </div>

          </div>

        </div>

      </section>

      {/* ========================================================================= */}
      {/* 9. TROPHY CASE & CERTIFICATIONS (Clean Minimalist Cards)                   */}
      {/* ========================================================================= */}
      <section id="awards" className="py-20 sm:py-28 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto border-t border-teal-100/50">
        
        {/* Section Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6 mb-12">
          <div>
            <span className="font-serif italic font-normal text-2xl sm:text-3xl text-teal-600 block">/ Accreditations /</span>
            <h2 className="font-sans font-medium text-4xl sm:text-5xl text-[#18181B] tracking-tight mt-1">
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
                    ? 'bg-[#0B2321] text-white shadow-xs'
                    : 'bg-white text-neutral-600 border border-teal-100 hover:border-teal-300'
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
              className="editorial-card p-6 rounded-3xl bg-white border border-teal-100/80 shadow-xs hover:shadow-md transition-all cursor-pointer group flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-4">
                  <span className="text-[11px] font-bold px-3 py-1 rounded-full bg-emerald-50 text-emerald-900 border border-emerald-200">
                    {award.rank}
                  </span>
                  <span className="text-xs text-neutral-500 font-mono">{award.year}</span>
                </div>
                <h4 className="font-sans font-bold text-base text-[#18181B] group-hover:text-teal-700 transition-colors leading-snug">
                  {award.title}
                </h4>
                <p className="text-xs text-neutral-600 mt-2 leading-relaxed">
                  {award.organizer} · {award.scope}
                </p>
              </div>

              <div className="mt-6 pt-3 border-t border-teal-100/60 flex items-center justify-between text-xs font-semibold text-teal-700">
                <span>Lihat Sertifikat &amp; Piala</span>
                <span className="group-hover:translate-x-1 transition-transform">↗</span>
              </div>
            </div>
          ))}
        </div>

        {/* Professional Certifications Bar */}
        <div className="mt-14 pt-10 border-t border-teal-100/60">
          <h3 className="font-sans font-medium text-xl text-[#18181B] mb-6">
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
                className="p-4 rounded-2xl bg-white border border-teal-100/70 hover:border-teal-300 shadow-xs hover:shadow-sm transition-all cursor-pointer flex flex-col justify-between"
              >
                <div>
                  <span className="text-[10px] font-bold text-teal-800 uppercase tracking-wider">{cert.issuer}</span>
                  <h4 className="font-bold text-xs text-[#18181B] mt-1 leading-snug">{cert.title}</h4>
                </div>
                <div className="mt-3 pt-2 border-t border-teal-50 flex items-center justify-between text-[10px] text-neutral-500">
                  <span>{cert.year}</span>
                  <span className="text-teal-600 font-semibold">Verified ↗</span>
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
        <div className="relative overflow-hidden rounded-4xl p-10 sm:p-16 text-center cta-banner-glow border border-teal-200/80 shadow-md">
          
          <div className="relative z-10 max-w-3xl mx-auto space-y-4">
            <h2 className="font-sans font-medium text-4xl sm:text-6xl md:text-7xl text-[#0B2321] tracking-tight leading-none">
              Let&apos;s Make It Happen
            </h2>
            <p className="text-xs sm:text-base text-teal-950/80 max-w-xl mx-auto leading-relaxed">
              always open for new opportunities, collaborations and creative challenges. let&apos;s work together to bring your ideas to life.
            </p>
            <div className="pt-4">
              <a
                href={portfolioData.socials?.whatsapp || "https://wa.me/6281234567890"}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-8 py-3.5 rounded-full bg-[#0B2321] hover:bg-black text-white text-xs sm:text-sm font-bold uppercase tracking-wider shadow-lg hover:shadow-xl transition-all cursor-pointer"
              >
                <span>✦ GET IN TOUCH</span>
                <span>→</span>
              </a>
            </div>
          </div>

        </div>
      </section>

      {/* ========================================================================= */}
      {/* 11. FOOTER & GIANT WATERMARK SIGNATURE (Instrument Serif Italic)          */}
      {/* ========================================================================= */}
      <footer className="pt-12 pb-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto border-t border-teal-100/50 relative overflow-hidden">
        
        {/* Navigation & Copyright (Elian Ross Style) */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-6 text-xs text-neutral-600 pb-12">
          <div className="flex items-center gap-6 font-medium">
            <a href="#about" className="hover:text-teal-700 transition-colors">Home</a>
            <a href="#about" className="hover:text-teal-700 transition-colors">About</a>
            <a href="#projects" className="hover:text-teal-700 transition-colors">Portfolio</a>
            <a href="#creator" className="hover:text-teal-700 transition-colors">Creator</a>
            <a href="#process" className="hover:text-teal-700 transition-colors">Process</a>
            <a href="#experience" className="hover:text-teal-700 transition-colors">Experience</a>
            <a href="#awards" className="hover:text-teal-700 transition-colors">Awards</a>
          </div>

          <p className="text-center sm:text-right text-neutral-400">
            © 2026 Chikal Nazmi. All rights reserved.
          </p>
        </div>

        {/* Giant Solid Signature Typography Across Bottom (Persis Referensi Elian Ross) */}
        <div className="text-center select-none pt-4 overflow-hidden">
          <span className="font-serif italic font-normal text-6xl sm:text-8xl md:text-9xl lg:text-[150px] xl:text-[170px] text-[#0B2321] leading-none tracking-tight block">
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
