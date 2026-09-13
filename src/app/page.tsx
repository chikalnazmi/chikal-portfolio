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

// Floating Petal Particles for Warm Botanical Aesthetic
const PETAL_PARTICLES = [
  { left: '4%', delay: '0s', size: 18, duration: '14s' },
  { left: '16%', delay: '3.8s', size: 22, duration: '18s' },
  { left: '29%', delay: '1.2s', size: 16, duration: '15s' },
  { left: '44%', delay: '5.5s', size: 20, duration: '20s' },
  { left: '58%', delay: '2.3s', size: 24, duration: '16s' },
  { left: '72%', delay: '4.8s', size: 18, duration: '19s' },
  { left: '85%', delay: '0.9s', size: 22, duration: '17s' },
  { left: '94%', delay: '6.5s', size: 16, duration: '21s' },
];

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
    <div className="min-h-screen bg-sage-linen text-[#212B1E] font-sans antialiased selection:bg-rose-blush selection:text-rose-dark relative overflow-x-hidden">
      
      {/* Floating Falling Flower Petals */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-20" aria-hidden="true">
        {PETAL_PARTICLES.map((p, idx) => (
          <div
            key={idx}
            className="petal-particle"
            style={{
              left: p.left,
              top: '-50px',
              animationDelay: p.delay,
              animationDuration: p.duration,
            }}
          >
            <svg width={p.size} height={p.size} viewBox="0 0 24 24" fill="none">
              <path
                d="M12 2C12 2 15 6 18 10C21 14 20 18 17 21C14 24 10 24 7 21C4 18 3 14 6 10C9 6 12 2 12 2Z"
                fill="#F7C6D0"
                opacity="0.85"
              />
              <circle cx="12" cy="14" r="2.5" fill="#ECA2B3" opacity="0.9" />
            </svg>
          </div>
        ))}
      </div>
      
      {/* ========================================================================= */}
      {/* 1. TOP MINIMALIST NAVIGATION                                              */}
      {/* ========================================================================= */}
            {/* ========================================================================= */}
      {/* NAVBAR: Modern Floating Editorial Pill (Exact Version from a92721e)        */}
      {/* ========================================================================= */}
      <nav className="sticky top-4 z-40 w-full max-w-[1560px] mx-auto px-4 sm:px-8 lg:px-12 xl:px-16">
        <div className="bg-white/85 backdrop-blur-md border border-[#CAD7C5] rounded-full px-5 py-3 shadow-sm flex items-center justify-between transition-all hover:border-rose-dusty/40">
          
          {/* Brand Identity (CN Initial + Two-tier Name & Role) */}
          <Link href="/" className="flex items-center gap-2.5 group shrink-0">
            <span className="w-8 h-8 rounded-full bg-forest text-[#E8EFE5] flex items-center justify-center font-serif text-sm font-bold group-hover:bg-rose-dark transition-colors">
              CN
            </span>
            <div className="flex flex-col text-left">
              <span className="font-serif font-bold text-sm tracking-wide text-forest group-hover:text-rose-dark transition-colors whitespace-nowrap">
                Chikal Nazmi Mahira
              </span>
              <span className="text-[10px] font-medium tracking-wider uppercase text-forest/60 whitespace-nowrap">
                Business &amp; Marketing
              </span>
            </div>
          </Link>

          {/* Desktop Nav Links */}
          <div className="hidden lg:flex items-center gap-5 xl:gap-6 text-xs font-semibold tracking-wider uppercase text-forest/80">
            <a href="#about" className="hover:text-rose-dark transition-colors whitespace-nowrap">About</a>
            <a href="#projects" className="hover:text-rose-dark transition-colors whitespace-nowrap">Works</a>
            <a href="#creator" className="hover:text-rose-dark transition-colors whitespace-nowrap">Creator Studio</a>
            <a href="#process" className="hover:text-rose-dark transition-colors whitespace-nowrap">Process</a>
            <a href="#experience" className="hover:text-rose-dark transition-colors whitespace-nowrap">Experience</a>
            <a href="#awards" className="hover:text-rose-dark transition-colors whitespace-nowrap">Awards</a>
          </div>

          {/* Right Action CTA Button */}
          <div className="flex items-center gap-3 shrink-0">
            <a
              href={portfolioData.socials?.whatsapp || "https://wa.me/6281234567890"}
              target="_blank"
              rel="noopener noreferrer"
              className="px-4 sm:px-5 py-1.5 rounded-full text-xs font-semibold bg-rose-dark text-white hover:bg-rose-berry transition-colors shadow-sm whitespace-nowrap active:scale-95 cursor-pointer"
            >
              Let&apos;s Connect ✦
            </a>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 text-forest hover:text-rose-dark cursor-pointer shrink-0"
              aria-label="Toggle Menu"
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

        {/* Mobile Dropdown */}
        {mobileMenuOpen && (
          <div className="lg:hidden mt-2 bg-white/95 backdrop-blur-md border border-[#CAD7C5] rounded-2xl p-4 shadow-lg flex flex-col gap-2 text-xs font-medium text-forest">
            <a href="#about" onClick={() => setMobileMenuOpen(false)} className="py-2 px-3 hover:bg-rose-50 rounded-lg transition-colors">About</a>
            <a href="#projects" onClick={() => setMobileMenuOpen(false)} className="py-2 px-3 hover:bg-rose-50 rounded-lg transition-colors">Works</a>
            <a href="#creator" onClick={() => setMobileMenuOpen(false)} className="py-2 px-3 hover:bg-rose-50 rounded-lg transition-colors">Creator Studio</a>
            <a href="#process" onClick={() => setMobileMenuOpen(false)} className="py-2 px-3 hover:bg-rose-50 rounded-lg transition-colors">Process</a>
            <a href="#experience" onClick={() => setMobileMenuOpen(false)} className="py-2 px-3 hover:bg-rose-50 rounded-lg transition-colors">Experience</a>
            <a href="#awards" onClick={() => setMobileMenuOpen(false)} className="py-2 px-3 hover:bg-rose-50 rounded-lg transition-colors">Awards</a>
          </div>
        )}
      </nav>

      {/* ========================================================================= */}
      {/* 2. HERO SECTION (2-Column Editorial Layout: Left Content, Right Photo)     */}
      {/* ========================================================================= */}
      <section className="relative w-full pt-8 sm:pt-14 md:pt-20 pb-16 sm:pb-24 px-4 sm:px-8 lg:px-12 xl:px-16 overflow-hidden">
        
        {/* Subtle Radiant Sage-Rose Glow Backdrop */}
        <div className="absolute top-1/4 -right-20 w-[420px] sm:w-[580px] h-[420px] sm:h-[580px] floral-glow-hero rounded-full pointer-events-none z-0"></div>
        <div className="absolute top-1/3 -left-20 w-[360px] sm:w-[480px] h-[360px] sm:h-[480px] pink-halo-glow-subtle rounded-full pointer-events-none z-0"></div>

        {/* Main 2-Column Grid */}
        <div className="relative z-10 max-w-[1560px] mx-auto grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-center">
          
          {/* ================= LEFT COLUMN: Kicker, Headline, Info, CTA ================= */}
          <div className="lg:col-span-7 flex flex-col items-start text-left">
            
            {/* Top Kicker / Category Pill */}
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/85 border border-[#CAD7C5] shadow-2xs text-[11px] sm:text-xs font-medium text-rose-dark mb-5">
              <span className="w-2 h-2 rounded-full bg-rose-dusty animate-pulse"></span>
              <span>{portfolioData.hero?.subheadline || "Management Trainee • Business Development • Creative Content Lead"}</span>
            </div>

            {/* Headline / Title */}
            <div className="mb-5 max-w-2xl">
              {portfolioData.hero?.headline ? (
                <h1 className="font-serif font-bold text-4xl sm:text-5xl lg:text-6xl tracking-tight text-forest leading-[1.15]">
                  {portfolioData.hero.headline}
                </h1>
              ) : (
                <>
                  <h1 className="font-serif font-bold text-4xl sm:text-5xl lg:text-[58px] tracking-tight text-forest leading-none">
                    Hi, I&apos;m Chikal
                  </h1>
                  <span className="font-serif italic font-normal text-4xl sm:text-5xl lg:text-[66px] text-rose-dark tracking-tight block mt-1.5 leading-[1.1]">
                    Business &amp; Digital Strategist
                  </span>
                </>
              )}
            </div>

            {/* Info / Description Paragraph */}
            <p className="text-base sm:text-lg text-forest/80 leading-relaxed font-normal mb-8 max-w-xl">
              {portfolioData.hero?.bio || "Passionate about scaling business ventures, digital products & data-driven operations that deliver real impact."}
            </p>

            {/* CTA Action Buttons */}
            <div className="flex items-center gap-3.5 sm:gap-4 flex-wrap mb-9">
              <a
                href={portfolioData.socials?.whatsapp || "https://wa.me/6281234567890"}
                target="_blank"
                rel="noopener noreferrer"
                className="bg-forest hover:bg-forest-dark text-white rounded-full px-6 sm:px-7 py-3 text-sm font-semibold shadow-md hover:shadow-lg transition-all flex items-center gap-2.5 cursor-pointer group active:scale-95 whitespace-nowrap"
              >
                <span>✦ Chat on WhatsApp</span>
                <span className="group-hover:translate-x-1 transition-transform">→</span>
              </a>

              <a
                href="#projects"
                className="bg-white/90 hover:bg-white text-forest hover:text-rose-dark border border-[#CAD7C5] rounded-full px-6 py-3 text-sm font-semibold shadow-xs hover:shadow-sm transition-all flex items-center gap-2 cursor-pointer active:scale-95 whitespace-nowrap"
              >
                <span>Explore Works</span>
                <span>↓</span>
              </a>
            </div>

            {/* Trust Badges & Awards Proof Row */}
            <div className="pt-2 w-full flex items-center gap-4 flex-wrap">
              <div className="flex -space-x-2.5 overflow-hidden">
                <img className="inline-block h-8 w-8 rounded-full ring-2 ring-white object-cover shadow-2xs" src="/11.png" alt="Award 1" loading="lazy" decoding="async" />
                <img className="inline-block h-8 w-8 rounded-full ring-2 ring-white object-cover shadow-2xs" src="/12.png" alt="Award 2" loading="lazy" decoding="async" />
                <img className="inline-block h-8 w-8 rounded-full ring-2 ring-white object-cover shadow-2xs" src="/16.png" alt="Award 3" loading="lazy" decoding="async" />
              </div>
              <div>
                <p className="text-xs sm:text-sm font-bold text-forest leading-tight flex items-center gap-1.5">
                  <span className="text-rose-dusty font-serif italic text-sm">✦</span>
                  <span>{portfolioData.hero?.stat1Value || "7x"} {portfolioData.hero?.stat1Label || "National Awards"}</span>
                </p>
                <p className="text-[11px] sm:text-xs text-forest/70 font-medium leading-tight mt-0.5">
                  {portfolioData.hero?.stat2Value ? `${portfolioData.hero.stat2Value} ${portfolioData.hero.stat2Label || "Reach"}` : "Business Case & IT Innovation"}
                </p>
              </div>
            </div>

          </div>

          {/* ================= RIGHT COLUMN: Slot Foto Pribadi ================= */}
          <div className="lg:col-span-5 flex justify-center lg:justify-end relative">
            
            {/* Ambient Halo Behind Image Card */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] sm:w-[400px] h-[300px] sm:h-[400px] pink-halo-glow rounded-full pointer-events-none z-0"></div>

            {/* Photo Frame Container */}
            <div className="relative z-10 w-full max-w-[360px] sm:max-w-[430px] rounded-4xl bg-white/85 border border-[#CAD7C5] p-3 sm:p-4 shadow-xl backdrop-blur-xs transition-transform duration-500 hover:-translate-y-1">
              
              {/* Photo Subject with Smooth Gradient & Border */}
              <div className="relative rounded-[2rem] overflow-hidden bg-gradient-to-b from-[#F2F7EF]/90 to-[#E8EFE5]/70 flex items-end justify-center min-h-[380px] sm:min-h-[440px] md:min-h-[480px]">
                <img
                  src={portfolioData.hero?.avatarImg || "/2.png"}
                  alt="Chikal Nazmi"
                  className="w-full h-full max-h-[480px] object-contain object-bottom select-none transition-transform duration-700 hover:scale-[1.03] drop-shadow-md z-10"
                  decoding="async"
                />
              </div>

              {/* Floating Badge 1 (Top-Left): Academic / Status */}
              <div className="absolute top-6 left-6 z-20 bg-white/95 backdrop-blur-md border border-[#CAD7C5] rounded-full px-3.5 py-1.5 shadow-md flex items-center gap-2 animate-soft-float">
                <span className="w-2 h-2 rounded-full bg-rose-dusty shadow-[0_0_8px_rgba(189,88,113,0.8)] animate-pulse"></span>
                <span className="text-[11px] font-semibold text-forest">
                  D4 SIB · Cum Laude
                </span>
              </div>

              {/* Floating Badge 2 (Bottom-Right): Reach / Growth */}
              <div className="absolute bottom-6 right-6 z-20 bg-white/95 backdrop-blur-md border border-[#CAD7C5] rounded-2xl p-3 shadow-lg text-left">
                <div className="flex items-center gap-2.5">
                  <span className="w-7 h-7 rounded-xl bg-[#F2F7EF] text-forest flex items-center justify-center font-bold text-xs">↗</span>
                  <div>
                    <p className="text-xs font-bold text-forest leading-tight">
                      {portfolioData.hero?.stat2Value || "10K+"} Reach
                    </p>
                    <p className="text-[10px] text-rose-dark font-semibold">
                      Digital Growth
                    </p>
                  </div>
                </div>
              </div>

            </div>

          </div>

        </div>

        {/* 4 Statistical Metrics Bar: Sleek, Unified Editorial Ribbon */}
        <div className="relative z-10 max-w-[1560px] mx-auto mt-14 sm:mt-18">
          <div className="bg-white/70 backdrop-blur-md rounded-3xl p-4 sm:p-6 border border-[#CAD7C5]/60 shadow-xs grid grid-cols-2 md:grid-cols-4 divide-y sm:divide-y-0 sm:divide-x divide-[#CAD7C5]/40">
            <div className="text-center py-3 sm:py-2 px-4">
              <span className="font-serif font-bold text-2xl sm:text-3xl text-forest block tracking-tight">
                {portfolioData.hero?.stat1Value || "7x"}
              </span>
              <span className="text-[10px] sm:text-[11px] uppercase font-semibold text-forest/70 tracking-wider block mt-1">
                {portfolioData.hero?.stat1Label || "Penghargaan Lomba"}
              </span>
            </div>
            <div className="text-center py-3 sm:py-2 px-4">
              <span className="font-serif font-bold text-2xl sm:text-3xl text-rose-dark block tracking-tight">
                {portfolioData.hero?.stat2Value || "10K+"}
              </span>
              <span className="text-[10px] sm:text-[11px] uppercase font-semibold text-forest/70 tracking-wider block mt-1">
                {portfolioData.hero?.stat2Label || "Jangkauan Konten"}
              </span>
            </div>
            <div className="text-center py-3 sm:py-2 px-4">
              <span className="font-serif font-bold text-2xl sm:text-3xl text-forest block tracking-tight">
                {portfolioData.hero?.stat3Value || "20+"}
              </span>
              <span className="text-[10px] sm:text-[11px] uppercase font-semibold text-forest/70 tracking-wider block mt-1">
                {portfolioData.hero?.stat3Label || "Mitra Event"}
              </span>
            </div>
            <div className="text-center py-3 sm:py-2 px-4">
              <span className="font-serif font-bold text-2xl sm:text-3xl text-rose-dark block tracking-tight">
                {portfolioData.hero?.stat4Value || "D4 SIB"}
              </span>
              <span className="text-[10px] sm:text-[11px] uppercase font-semibold text-forest/70 tracking-wider block mt-1">
                {portfolioData.hero?.stat4Label || "Polinema"}
              </span>
            </div>
          </div>
        </div>

      </section>

      {/* ========================================================================= */}
      {/* 3. LOGO TICKER / CREDENTIAL ROW: Infinite Smooth Marquee                 */}
      {/* ========================================================================= */}
      <section className="w-full py-6 border-y border-[#CAD7C5]/30 bg-white/35 backdrop-blur-xs overflow-hidden select-none">
        <div className="relative w-full overflow-hidden [mask-image:_linear-gradient(to_right,transparent_0,_black_64px,_black_calc(100%-64px),transparent_100%)]">
          <div className="animate-marquee flex items-center gap-10 sm:gap-14 whitespace-nowrap py-1">
            {[
              "Politeknik Negeri Malang",
              "GDSC Google Polinema",
              "Manikarumi Hijab",
              "Yarn Up Creative",
              "Dua Sisi Media",
              "RevoU Digital Marketing",
              "Politeknik Negeri Malang",
              "GDSC Google Polinema",
              "Manikarumi Hijab",
              "Yarn Up Creative",
              "Dua Sisi Media",
              "RevoU Digital Marketing",
            ].map((partner, pIdx) => (
              <div key={pIdx} className="flex items-center gap-2.5 text-xs sm:text-sm font-semibold tracking-wide text-forest/75 hover:text-forest transition-colors shrink-0">
                <span className="text-rose-dusty text-xs">✦</span>
                <span>{partner}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 4. BENTO VISUAL SHOWCASE MOSAIC (Curated Project Previews)                */}
      {/* ========================================================================= */}
      <section className="w-full py-20 sm:py-28 px-4 sm:px-8 lg:px-12 xl:px-16 relative">
        <div className="max-w-[1560px] mx-auto">
          
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
            <div>
              <span className="font-script text-2xl sm:text-3xl text-rose-dark block">/ Curated Portfolio /</span>
              <h2 className="font-serif font-bold text-3xl sm:text-4xl text-forest tracking-tight mt-1">
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
              className="lg:col-span-7 bg-white/95 backdrop-blur-xs rounded-3xl p-5 sm:p-6 border border-[#CAD7C5] shadow-xs hover:shadow-xl hover:border-rose-dusty/60 hover:-translate-y-1 transition-all duration-300 cursor-pointer group flex flex-col justify-between"
            >
              <div className="relative overflow-hidden rounded-2xl bg-neutral-100 h-56 sm:h-72 mb-4">
                <img 
                  src={projectsList[0]?.image || "/1.png"} 
                  alt="Sistem Manajemen Koran"
                  className="w-full h-full object-cover object-top group-hover:scale-[1.02] transition-transform duration-500" 
                  loading="lazy"
                  decoding="async"
                />
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-sans font-bold text-base sm:text-lg text-forest group-hover:text-rose-dark transition-colors">
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
              className="lg:col-span-5 bg-white/95 backdrop-blur-xs rounded-3xl p-5 sm:p-6 border border-[#CAD7C5] shadow-xs hover:shadow-xl hover:border-rose-dusty/60 hover:-translate-y-1 transition-all duration-300 cursor-pointer group flex flex-col justify-between"
            >
              <div className="relative overflow-hidden rounded-2xl bg-neutral-100 h-56 sm:h-72 mb-4">
                <img 
                  src={projectsList[1]?.image || "/3.png"} 
                  alt="Website SurveyKu"
                  className="w-full h-full object-cover object-top group-hover:scale-[1.02] transition-transform duration-500" 
                  loading="lazy"
                  decoding="async"
                />
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-sans font-bold text-base sm:text-lg text-forest group-hover:text-rose-dark transition-colors">
                    {projectsList[1]?.title || "Website SurveyKu Analytics"}
                  </h3>
                  <p className="text-xs text-neutral-500 mt-0.5">{projectsList[1]?.tag || "User Feedback & Data Modeling"}</p>
                </div>
                <span className="text-xs font-semibold px-3 py-1 rounded-full bg-rose-50 text-rose-dark font-serif italic border border-rose-200">
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
              className="lg:col-span-5 bg-white/95 backdrop-blur-xs rounded-3xl p-5 sm:p-6 border border-[#CAD7C5] shadow-xs hover:shadow-xl hover:border-rose-dusty/60 hover:-translate-y-1 transition-all duration-300 cursor-pointer group flex flex-col justify-between"
            >
              <div className="relative overflow-hidden rounded-2xl bg-neutral-100 h-56 sm:h-72 mb-4">
                <img 
                  src={projectsList[2]?.image || "/9.png"} 
                  alt="JTI Certify"
                  className="w-full h-full object-cover object-top group-hover:scale-[1.02] transition-transform duration-500" 
                  loading="lazy"
                  decoding="async"
                />
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-sans font-bold text-base sm:text-lg text-forest group-hover:text-rose-dark transition-colors">
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
              className="lg:col-span-7 bg-white/95 backdrop-blur-xs rounded-3xl p-5 sm:p-6 border border-[#CAD7C5] shadow-xs hover:shadow-xl hover:border-rose-dusty/60 hover:-translate-y-1 transition-all duration-300 cursor-pointer group flex flex-col justify-between"
            >
              <div className="relative overflow-hidden rounded-2xl bg-neutral-100 h-56 sm:h-72 mb-4">
                <img 
                  src={projectsList[3]?.image || "/17.png"} 
                  alt={projectsList[3]?.title || "Manikarumi Campaign"}
                  className="w-full h-full object-cover object-top group-hover:scale-[1.02] transition-transform duration-500" 
                  loading="lazy"
                  decoding="async"
                />
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-sans font-bold text-base sm:text-lg text-forest group-hover:text-rose-dark transition-colors">
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
      <section id="about" className="w-full py-24 sm:py-32 px-4 sm:px-8 lg:px-12 xl:px-16 text-center relative">
        
        {/* Soft Center Aura (Beloved Pink Halo) */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] sm:w-[480px] h-[300px] sm:h-[480px] pink-halo-glow-subtle rounded-full pointer-events-none z-0"></div>

        {/* Script / Editorial Kicker */}
        <div className="relative z-10 mb-4">
          <span className="font-script text-3xl sm:text-4xl text-rose-dark block">/ What I do /</span>
        </div>

        {/* Big Bold Statement with Highlighted Words (Elian Ross Style) */}
        <div className="relative z-10 max-w-3xl mx-auto mb-12">
          <p className="font-sans font-normal text-2xl sm:text-4xl md:text-5xl text-forest leading-snug sm:leading-tight tracking-tight">
            my focus is on blending{' '}
            <strong className="font-semibold text-forest">clear business strategy</strong>,{' '}
            <strong className="font-semibold text-forest">thoughtful operational systems</strong>, and{' '}
            <span className="font-serif italic font-normal text-rose-800">creative storytelling</span>{' '}
            to craft experiences that{' '}
            <span className="underline decoration-rose-dusty decoration-wavy underline-offset-8">
              solve real problems
            </span>.
          </p>
        </div>

        {/* Floating Skill Pills Around the Statement with Harmonious Botanical Accents */}
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
            const isRoseDot = sIdx % 2 === 1;
            return (
              <span 
                key={sIdx}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/90 backdrop-blur-xs border border-[#CAD7C5] hover:border-rose-dusty/80 shadow-2xs hover:shadow-xs text-xs font-semibold text-forest hover:-translate-y-0.5 transition-all duration-200 cursor-default"
              >
                <span className={`w-2 h-2 rounded-full ${
                  isRoseDot 
                    ? 'bg-rose-dusty shadow-[0_0_6px_rgba(189,88,113,0.6)]' 
                    : 'bg-forest/70 shadow-[0_0_6px_rgba(37,53,33,0.4)]'
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
      <section id="process" className="w-full border-t border-[#CAD7C5]/30 py-20 sm:py-28 px-4 sm:px-8 lg:px-12 xl:px-16 relative">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="font-script text-3xl sm:text-4xl text-rose-dark block">/ How I Deliver Value /</span>
          <h2 className="font-sans font-medium text-4xl sm:text-5xl text-forest tracking-tight mt-1">
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
                stroke="#94AB8B" 
                strokeWidth="2.5" 
                strokeDasharray="6 6"
                className="opacity-70"
              />
              <circle cx="20" cy="50" r="4" fill="#94AB8B" />
              <circle cx="250" cy="30" r="4" fill="#BD5871" />
              <circle cx="480" cy="40" r="4" fill="#94AB8B" />
            </svg>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 relative z-20">
            
            {/* Card 01 - Discover */}
            <div className="process-card p-8 rounded-3xl bg-white border border-[#CAD7C5] shadow-xs flex flex-col justify-between relative group">
              <div>
                <span className="font-serif italic font-normal text-6xl text-rose-dusty/35 group-hover:text-rose-dusty transition-colors">01</span>
                <h3 className="font-sans font-bold text-2xl text-forest mt-4 mb-2">
                  Discover
                </h3>
                <p className="text-xs sm:text-sm text-neutral-600 leading-relaxed">
                  Riset pasar mendalam, wawancara pengguna (user interview), analisis kendala operasional (bottlenecks), dan pemetaan peluang bisnis nyata.
                </p>
              </div>
              <div className="mt-8 pt-4 border-t border-[#CAD7C5]/60 flex items-center justify-between text-[11px] font-semibold text-rose-dark">
                <span>Market &amp; User Needs</span>
                <span className="text-xs text-rose-700 font-mono">01 ↗</span>
              </div>
            </div>

            {/* Card 02 - Strategize */}
            <div className="process-card p-8 rounded-3xl bg-white border border-[#CAD7C5] shadow-xs flex flex-col justify-between relative group">
              <div>
                <span className="font-serif italic font-normal text-6xl text-rose-dusty/35 group-hover:text-rose-dusty transition-colors">02</span>
                <h3 className="font-sans font-bold text-2xl text-forest mt-4 mb-2">
                  Strategize
                </h3>
                <p className="text-xs sm:text-sm text-neutral-600 leading-relaxed">
                  Merumuskan Business Model Canvas, analisis kelayakan finansial, standard operating procedure (SOP), serta konsep kreatif penceritaan brand.
                </p>
              </div>
              <div className="mt-8 pt-4 border-t border-[#CAD7C5]/60 flex items-center justify-between text-[11px] font-semibold text-rose-dark">
                <span>Business Model &amp; SOP</span>
                <span className="text-xs text-rose-700 font-mono">02 ↗</span>
              </div>
            </div>

            {/* Card 03 - Deliver */}
            <div className="process-card p-8 rounded-3xl bg-white border border-[#CAD7C5] shadow-xs flex flex-col justify-between relative group">
              <div>
                <span className="font-serif italic font-normal text-6xl text-rose-dusty/35 group-hover:text-rose-dusty transition-colors">03</span>
                <h3 className="font-sans font-bold text-2xl text-forest mt-4 mb-2">
                  Deliver
                </h3>
                <p className="text-xs sm:text-sm text-neutral-600 leading-relaxed">
                  Eksekusi kampanye pemasaran digital, pembuatan prototipe interaktif, dan pelacakan metrik keberhasilan (KPI) yang terukur.
                </p>
              </div>
              <div className="mt-8 pt-4 border-t border-[#CAD7C5]/60 flex items-center justify-between text-[11px] font-semibold text-rose-dark">
                <span>Execution &amp; KPI Reach</span>
                <span className="text-xs text-rose-700 font-mono">03 ↗</span>
              </div>
            </div>

          </div>
        </div>

        {/* 2 Clean Quote / Highlight Cards Underneath */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-12 max-w-5xl mx-auto">
          
          <div className="bg-white p-6 sm:p-7 rounded-3xl border border-[#CAD7C5] shadow-xs flex items-start gap-4">
            <span className="text-3xl text-rose-300 font-serif leading-none">“</span>
            <div>
              <p className="text-xs sm:text-sm text-forest italic leading-relaxed">
                {awardsList[0]?.desc ? `${awardsList[0].title} — ${awardsList[0].desc}` : "Kemampuan analisis komprehensif dalam memadukan kelayakan bisnis, tata kelola data sistem informasi, dan presentasi meyakinkan terbukti membawakan 7 gelar juara nasional."}
              </p>
              <div className="flex items-center gap-3 mt-4">
                <img src={awardsList[0]?.certImg || "/11.png"} alt="Award" className="w-8 h-8 rounded-full object-cover ring-2 ring-rose-100" loading="lazy" decoding="async" />
                <div>
                  <h4 className="font-bold text-xs text-forest">{awardsList[0]?.title || "National Fest Business Plan Competition"}</h4>
                  <p className="text-[10px] text-rose-700">{awardsList[0]?.rank || "Juara 1 Tingkat Nasional"} {awardsList[0]?.year ? `(${awardsList[0].year})` : ""}</p>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 sm:p-7 rounded-3xl border border-[#CAD7C5] shadow-xs flex items-start gap-4">
            <span className="text-3xl text-rose-300 font-serif leading-none">“</span>
            <div>
              <p className="text-xs sm:text-sm text-forest italic leading-relaxed">
                {portfolioData.creatorAccounts?.manikarumi?.centerDesc || "Inisiatif kepemimpinan di Manikarumi dan GDSC Polinema mempercepat lonjakan jangkauan konten organik hingga +2.089% dengan storytelling yang memikat audiens muda."}
              </p>
              <div className="flex items-center gap-3 mt-4">
                <img src={portfolioData.creatorAccounts?.manikarumi?.centerImg || "/17.png"} alt="Manikarumi" className="w-8 h-8 rounded-full object-cover ring-2 ring-rose-100" loading="lazy" decoding="async" />
                <div>
                  <h4 className="font-bold text-xs text-forest">{portfolioData.creatorAccounts?.manikarumi?.name || "Commercial Content Growth"}</h4>
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
      <section id="projects" className="w-full py-20 sm:py-28 px-4 sm:px-8 lg:px-12 xl:px-16">
        
        {/* Section Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6 mb-12">
          <div>
            <span className="font-script text-3xl sm:text-4xl text-rose-dark block">/ Selected Works /</span>
            <h2 className="font-sans font-medium text-4xl sm:text-5xl text-forest tracking-tight mt-1">
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
                    ? 'bg-rose-dark text-white shadow-xs'
                    : 'bg-white/80 text-forest/75 border border-[#CAD7C5] hover:border-rose-dusty'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* 2x2 Project Grid */}
        <div className="max-w-[1560px] mx-auto grid grid-cols-1 md:grid-cols-2 gap-8 sm:gap-10">
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
              className="editorial-card p-5 sm:p-6 rounded-4xl bg-white/95 border border-[#CAD7C5] shadow-xs hover:shadow-xl hover:border-rose-dusty/60 hover:-translate-y-1 transition-all duration-300 cursor-pointer group flex flex-col justify-between"
            >
              {/* Project Image Container */}
              <div className="relative overflow-hidden rounded-3xl bg-neutral-100 aspect-[16/10] sm:aspect-[16/11] mb-5">
                <img
                  src={project.image || "/1.png"}
                  alt={project.title}
                  className="w-full h-full object-cover object-top group-hover:scale-[1.03] transition-transform duration-500"
                  loading="lazy"
                  decoding="async"
                />
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-300 flex items-center justify-center">
                  <span className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 px-4 py-2 rounded-full bg-white/95 backdrop-blur-md text-xs font-bold text-forest shadow-sm">
                    Lihat Dokumentasi &amp; Hasil ↗
                  </span>
                </div>
              </div>

              {/* Title on Left, Tag Pills on Right */}
              <div className="flex items-start justify-between gap-4 pt-1">
                <div>
                  <h3 className="font-sans font-bold text-lg sm:text-xl text-forest group-hover:text-rose-dark transition-colors">
                    {project.title}
                  </h3>
                  <p className="text-xs text-neutral-500 mt-1 line-clamp-1">
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
      {/* CREATIVE MEDIA & CONTENT CREATOR SHOWCASE (CMS Video & Creator Tab)        */}
      {/* ========================================================================= */}
      <section id="creator" className="w-full border-t border-[#CAD7C5]/30 py-20 sm:py-28 px-4 sm:px-8 lg:px-12 xl:px-16">
        
        {/* Section Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6 mb-12">
          <div>
            <span className="font-script text-3xl sm:text-4xl text-rose-dark block">/ Content &amp; Media /</span>
            <h2 className="font-sans font-medium text-4xl sm:text-5xl text-forest tracking-tight mt-1">
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
                      ? 'bg-rose-dark text-white shadow-xs'
                      : 'bg-white/80 text-forest/75 border border-[#CAD7C5] hover:border-rose-dusty'
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
          <div className="space-y-8">
            
            {/* Account Info Bar: Clean Glass Island */}
            <div className="bg-white/70 backdrop-blur-md rounded-3xl p-6 sm:p-8 border border-[#CAD7C5]/60 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white border border-rose-200/80 text-[11px] font-bold text-rose-900 mb-2">
                  <span>✦ {currentCreator.tag}</span>
                </div>
                <h3 className="font-sans font-bold text-2xl sm:text-3xl text-forest">
                  {currentCreator.name} <span className="font-mono font-normal text-sm sm:text-base text-rose-700">{currentCreator.handle}</span>
                </h3>
                <p className="text-xs text-neutral-500 mt-1">
                  Platform: {currentCreator.platforms}
                </p>
              </div>

              <div className="flex items-center gap-3">
                <span className="px-4 py-2 rounded-2xl bg-[#F2F7EF] text-forest border border-[#CAD7C5] font-bold text-xs sm:text-sm">
                  ✦ {currentCreator.stats}
                </span>
                {currentCreator.link && (
                  <a
                    href={currentCreator.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-4 py-2 rounded-full bg-rose-dark text-white text-xs font-semibold hover:bg-rose-berry transition-colors"
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
                className="md:col-span-3 bg-white/95 rounded-3xl p-4 sm:p-5 border border-[#CAD7C5] shadow-xs hover:shadow-xl hover:border-rose-dusty/60 hover:-translate-y-1 transition-all duration-300 cursor-pointer group flex flex-col justify-between"
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
                    loading="lazy"
                    decoding="async"
                  />
                  <div className="absolute top-2 left-2 px-2.5 py-0.5 rounded-full bg-black/60 backdrop-blur-xs text-[10px] font-bold text-white">
                    {currentCreator.leftPhoneTag || "Reels"}
                  </div>
                </div>
                <div>
                  <h4 className="font-bold text-xs sm:text-sm text-forest group-hover:text-rose-dark transition-colors">
                    {currentCreator.leftPhoneTitle}
                  </h4>
                  <span className="text-[10px] text-rose-600 font-medium">Lihat Media ↗</span>
                </div>
              </div>

              {/* Center Stage Card (Center Showcase) */}
              <div 
                className="md:col-span-6 bg-white/95 rounded-3xl p-5 sm:p-6 border border-[#CAD7C5] shadow-xs hover:shadow-xl hover:border-rose-dusty/60 hover:-translate-y-1 transition-all duration-300 cursor-pointer group flex flex-col justify-between"
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
                    loading="lazy"
                    decoding="async"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent flex items-end p-4">
                    <div>
                      <span className="text-[10px] font-bold uppercase tracking-wider text-rose-200">
                        Featured Spotlight
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
                  <div className="mt-4 pt-3 border-t border-[#CAD7C5]/60 flex items-center justify-between text-xs font-semibold text-rose-800">
                    <span>{currentCreator.centerLink ? "Tonton Konten Pilihan ↗" : "Dokumentasi Galeri"}</span>
                    <span className="group-hover:translate-x-1 transition-transform">→</span>
                  </div>
                </div>
              </div>

              {/* Right Media Card (Right Phone Mockup) */}
              <div 
                className="md:col-span-3 bg-white/95 rounded-3xl p-4 sm:p-5 border border-[#CAD7C5] shadow-xs hover:shadow-xl hover:border-rose-dusty/60 hover:-translate-y-1 transition-all duration-300 cursor-pointer group flex flex-col justify-between"
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
                    loading="lazy"
                    decoding="async"
                  />
                  <div className="absolute top-2 left-2 px-2.5 py-0.5 rounded-full bg-black/60 backdrop-blur-xs text-[10px] font-bold text-white">
                    {currentCreator.rightPhoneTag || "TikTok"}
                  </div>
                </div>
                <div>
                  <h4 className="font-bold text-xs sm:text-sm text-forest group-hover:text-rose-dark transition-colors">
                    {currentCreator.rightPhoneTitle}
                  </h4>
                  <span className="text-[10px] text-rose-600 font-medium">Lihat Media ↗</span>
                </div>
              </div>

            </div>

          </div>
        )}

      </section>

      {/* ========================================================================= */}
      {/* 8. PUSHING BOUNDARIES (About Story & Clean Career Timeline)              */}
      {/* ========================================================================= */}
      <section id="experience" className="w-full py-20 sm:py-28 px-4 sm:px-8 lg:px-12 xl:px-16">
        
        {/* Kicker & Title (Elian Ross Style: Title Bold + Year Muted Light) */}
        <div className="mb-14">
          <span className="font-script text-3xl sm:text-4xl text-rose-dark block">/ Who Am I /</span>
          <h2 className="font-sans font-medium text-4xl sm:text-6xl text-forest tracking-tight mt-1">
            Pushing Boundaries <span className="font-serif italic font-normal text-rose-dark">since 2020</span>
          </h2>
        </div>

        {/* 2 Columns: Photo & Bio Left, Clean Horizontal Timeline Right */}
        <div className="max-w-[1560px] mx-auto grid grid-cols-1 lg:grid-cols-12 gap-10 sm:gap-14 items-start">
          
          {/* Left Column: Stylized Portrait Card & Social Links */}
          <div className="lg:col-span-5 space-y-6">
            <div className="relative overflow-hidden rounded-4xl bg-forest p-4 sm:p-5 shadow-lg border border-[#CAD7C5]/30">
              <div className="relative aspect-[4/5] rounded-3xl overflow-hidden bg-neutral-900">
                <img
                  src={portfolioData.hero?.avatarImg || "/2.png"}
                  alt="Chikal Portrait"
                  className="w-full h-full object-cover object-top"
                  loading="lazy"
                  decoding="async"
                />
              </div>
              <div className="mt-4 px-2 flex items-center justify-between">
                <div>
                  <h4 className="font-serif italic font-normal text-xl text-white">Chikal Nazmi</h4>
                  <p className="text-xs text-rose-200/80">Business &amp; Digital Strategist</p>
                </div>
                <span className="text-xs font-mono text-white/50">2020 — 2026</span>
              </div>
            </div>

            {/* Social Icons Row with Official Brand Logos */}
            <div className="flex items-center justify-center gap-3 p-3 bg-white rounded-full border border-[#CAD7C5] shadow-xs">
              <a
                href={portfolioData.socials?.linkedin || "https://linkedin.com"}
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 rounded-full bg-[#F2F7EF] text-forest hover:bg-forest hover:text-white transition-all duration-200 hover:-translate-y-0.5 hover:shadow-xs flex items-center justify-center"
                title="LinkedIn"
                aria-label="LinkedIn"
              >
                <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24" aria-hidden="true">
                  <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452z" />
                </svg>
              </a>
              <a
                href={portfolioData.socials?.instagram || "https://instagram.com/chikalnazmi"}
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 rounded-full bg-[#F2F7EF] text-forest hover:bg-forest hover:text-white transition-all duration-200 hover:-translate-y-0.5 hover:shadow-xs flex items-center justify-center"
                title="Instagram"
                aria-label="Instagram"
              >
                <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24" aria-hidden="true">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
                </svg>
              </a>
              <a
                href={portfolioData.socials?.tiktok || "https://tiktok.com"}
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 rounded-full bg-[#F2F7EF] text-forest hover:bg-forest hover:text-white transition-all duration-200 hover:-translate-y-0.5 hover:shadow-xs flex items-center justify-center"
                title="TikTok"
                aria-label="TikTok"
              >
                <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24" aria-hidden="true">
                  <path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.63.41-1.11 1.04-1.36 1.75-.21.51-.15 1.07-.14 1.61.24 1.64 1.82 3.02 3.5 2.87 1.12-.01 2.19-.66 2.77-1.61.19-.33.4-.67.41-1.06.1-1.79.06-3.57.07-5.36.01-4.03-.01-8.05.02-12.07z" />
                </svg>
              </a>
              <a
                href={`mailto:${portfolioData.socials?.email || "chikalnazmi@gmail.com"}`}
                className="w-9 h-9 rounded-full bg-[#F2F7EF] text-forest hover:bg-forest hover:text-white transition-all duration-200 hover:-translate-y-0.5 hover:shadow-xs flex items-center justify-center"
                title="Email"
                aria-label="Email"
              >
                <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24" aria-hidden="true">
                  <path d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z" />
                </svg>
              </a>
              {portfolioData.socials?.youtube && (
                <a
                  href={portfolioData.socials.youtube}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-9 h-9 rounded-full bg-[#F2F7EF] text-forest hover:bg-forest hover:text-white transition-all duration-200 hover:-translate-y-0.5 hover:shadow-xs flex items-center justify-center"
                  title="YouTube"
                  aria-label="YouTube"
                >
                  <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24" aria-hidden="true">
                    <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
                  </svg>
                </a>
              )}
              {portfolioData.socials?.medium && (
                <a
                  href={portfolioData.socials.medium}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-9 h-9 rounded-full bg-[#F2F7EF] text-forest hover:bg-forest hover:text-white transition-all duration-200 hover:-translate-y-0.5 hover:shadow-xs flex items-center justify-center"
                  title="Medium"
                  aria-label="Medium"
                >
                  <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24" aria-hidden="true">
                    <path d="M13.54 12a6.8 6.8 0 0 1-6.77 6.82A6.8 6.8 0 0 1 0 12a6.8 6.8 0 0 1 6.77-6.82A6.8 6.8 0 0 1 13.54 12zM20.96 12c0 3.54-1.51 6.42-3.38 6.42-1.87 0-3.39-2.88-3.39-6.42s1.52-6.42 3.39-6.42 3.38 2.88 3.38 6.42M24 12c0 3.17-.53 5.75-1.19 5.75-.66 0-1.19-2.58-1.19-5.75s.53-5.75 1.19-5.75C23.47 6.25 24 8.83 24 12z" />
                  </svg>
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
            <div className="border-t border-[#CAD7C5]/60">
              {experiencesList.map((exp, idx) => (
                <div 
                  key={exp.id || idx}
                  className="py-4 sm:py-5 border-b border-[#CAD7C5]/60 flex flex-col sm:flex-row sm:items-center justify-between gap-2 sm:gap-4 hover:bg-white/60 px-2 rounded-xl transition-colors cursor-pointer group"
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
                    <h4 className="font-sans font-bold text-sm sm:text-base text-forest group-hover:text-rose-dark transition-colors">
                      {exp.title}
                    </h4>
                    <p className="text-xs text-neutral-500">
                      {exp.category} · {exp.tag}
                    </p>
                  </div>

                  <div className="flex items-center gap-3 self-start sm:self-auto">
                    <span className="text-[11px] font-medium text-forest bg-[#F2F7EF] px-2.5 py-0.5 rounded-full border border-[#CAD7C5]">
                      {exp.period}
                    </span>
                    <span className="text-xs text-rose-dusty group-hover:text-rose-dark group-hover:translate-x-1 transition-all">→</span>
                  </div>
                </div>
              ))}

              {/* Education Entry */}
              <div 
                className="py-4 sm:py-5 border-b border-[#CAD7C5]/60 flex flex-col sm:flex-row sm:items-center justify-between gap-2 sm:gap-4 hover:bg-white/60 px-2 rounded-xl transition-colors cursor-pointer group"
                onClick={() => openModal({
                  title: `${academicData.degree} · ${academicData.institution}`,
                  category: 'FORMAL EDUCATION',
                  description: academicData.description,
                  images: academicData.images && academicData.images.length > 0 ? academicData.images : ['/11.png', '/12.png', '/16.png'],
                })}
              >
                <div>
                  <h4 className="font-sans font-bold text-sm sm:text-base text-forest group-hover:text-rose-dark transition-colors">
                    {academicData.degree}
                  </h4>
                  <p className="text-xs text-neutral-500">
                    {academicData.institution} · GPA {academicData.gpaValue}
                  </p>
                </div>

                <div className="flex items-center gap-3 self-start sm:self-auto">
                  <span className="text-[11px] font-medium text-forest bg-[#F2F7EF] px-2.5 py-0.5 rounded-full border border-[#CAD7C5]">
                    {academicData.period}
                  </span>
                  <span className="text-xs text-rose-dusty group-hover:text-rose-dark group-hover:translate-x-1 transition-all">→</span>
                </div>
              </div>
            </div>

            {/* Micro Callout for CV */}
            <div className="flex items-center gap-4 pt-2">
              <a
                href={portfolioData.socials?.whatsapp || "https://wa.me/6281234567890"}
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs font-semibold text-rose-dark underline underline-offset-4 hover:text-rose-berry transition-colors"
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
      <section id="awards" className="w-full border-t border-[#CAD7C5]/30 py-20 sm:py-28 px-4 sm:px-8 lg:px-12 xl:px-16">
        
        {/* Section Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6 mb-12">
          <div>
            <span className="font-script text-3xl sm:text-4xl text-rose-dark block">/ Accreditations /</span>
            <h2 className="font-sans font-medium text-4xl sm:text-5xl text-forest tracking-tight mt-1">
              Awards &amp; Credentials
            </h2>
          </div>

          <div className="flex flex-wrap gap-2">
            {[
              { id: 'all', label: 'All Honors' },
              { id: '1st', label: '1st Place' },
              { id: '2nd', label: '2nd Place' },
              { id: 'top5', label: 'Finalist & Speaker' },
            ].map(filter => (
              <button
                key={filter.id}
                onClick={() => setActiveAwardFilter(filter.id as any)}
                className={`px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all cursor-pointer ${
                  activeAwardFilter === filter.id
                    ? 'bg-rose-dark text-white shadow-xs'
                    : 'bg-white/80 text-forest/75 border border-[#CAD7C5] hover:border-rose-dusty'
                }`}
              >
                {filter.label}
              </button>
            ))}
          </div>
        </div>

        {/* Awards Grid */}
        <div className="max-w-[1560px] mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
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
              className="editorial-card p-6 rounded-3xl bg-white/95 border border-[#CAD7C5] shadow-xs hover:shadow-xl hover:border-rose-dusty/60 hover:-translate-y-1 transition-all duration-300 cursor-pointer group flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-4">
                  <span className="text-[11px] font-bold px-3 py-1 rounded-full bg-[#F2F7EF] text-forest border border-[#CAD7C5]">
                    {award.rank}
                  </span>
                  <span className="text-xs text-neutral-500 font-mono">{award.year}</span>
                </div>
                <h4 className="font-sans font-bold text-base text-forest group-hover:text-rose-dark transition-colors leading-snug">
                  {award.title}
                </h4>
                <p className="text-xs text-neutral-600 mt-2 leading-relaxed">
                  {award.organizer} · {award.scope}
                </p>
              </div>

              <div className="mt-6 pt-3 border-t border-[#CAD7C5]/60 flex items-center justify-between text-xs font-semibold text-rose-dark">
                <span>Lihat Sertifikat &amp; Piala</span>
                <span className="group-hover:translate-x-1 transition-transform">↗</span>
              </div>
            </div>
          ))}
        </div>

        {/* Professional Certifications Bar */}
        <div className="mt-14 pt-10 border-t border-[#CAD7C5]">
          <h3 className="font-sans font-medium text-xl text-forest mb-6">
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
                className="p-4 rounded-2xl bg-white/95 border border-[#CAD7C5] hover:border-rose-dusty/60 shadow-2xs hover:shadow-md hover:-translate-y-0.5 transition-all cursor-pointer flex flex-col justify-between"
              >
                <div>
                  <span className="text-[10px] font-bold text-rose-dark uppercase tracking-wider">{cert.issuer}</span>
                  <h4 className="font-bold text-xs text-forest mt-1 leading-snug">{cert.title}</h4>
                </div>
                <div className="mt-3 pt-2 border-t border-[#CAD7C5]/40 flex items-center justify-between text-[10px] text-neutral-500">
                  <span>{cert.year}</span>
                  <span className="text-rose-dusty group-hover:text-rose-dark font-semibold">Verified ↗</span>
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
        <div className="relative overflow-hidden rounded-4xl p-10 sm:p-16 text-center cta-banner-glow border border-[#CAD7C5] shadow-md">
          
          <div className="relative z-10 max-w-3xl mx-auto space-y-4">
            <h2 className="font-sans font-medium text-4xl sm:text-6xl md:text-7xl text-forest tracking-tight leading-none">
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
                className="inline-flex items-center gap-2 px-8 py-3.5 rounded-full bg-forest hover:bg-forest-dark text-white text-xs sm:text-sm font-bold uppercase tracking-wider shadow-lg hover:shadow-xl hover:-translate-y-0.5 active:translate-y-0 transition-all cursor-pointer"
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
      <footer className="w-full border-t border-[#CAD7C5]/30 pt-16 pb-20 px-4 sm:px-8 lg:px-12 xl:px-16 relative overflow-hidden">
        
        {/* Navigation & Copyright (Elian Ross Style) */}
        <div className="max-w-[1560px] mx-auto flex flex-col sm:flex-row items-center justify-between gap-6 text-xs text-neutral-600 pb-12">
          <div className="flex items-center gap-6 font-medium">
            <a href="#about" className="hover:text-rose-dark transition-colors">Home</a>
            <a href="#about" className="hover:text-rose-dark transition-colors">About</a>
            <a href="#projects" className="hover:text-rose-dark transition-colors">Portfolio</a>
            <a href="#creator" className="hover:text-rose-dark transition-colors">Creator</a>
            <a href="#process" className="hover:text-rose-dark transition-colors">Process</a>
            <a href="#experience" className="hover:text-rose-dark transition-colors">Experience</a>
            <a href="#awards" className="hover:text-rose-dark transition-colors">Awards</a>
          </div>

          <p className="text-center sm:text-right text-neutral-400">
            © 2026 Chikal Nazmi. All rights reserved.
          </p>
        </div>

        {/* Giant Solid Signature Typography Across Bottom (Persis Referensi Elian Ross) */}
        <div className="text-center select-none pt-4 overflow-hidden">
          <span className="font-serif italic font-normal text-6xl sm:text-8xl md:text-9xl lg:text-[150px] xl:text-[170px] text-forest/15 leading-none tracking-tight block">
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
                <h3 className="font-sans font-bold text-xl sm:text-2xl text-forest mt-2">
                  {modalData.title}
                </h3>
              </div>

              <button
                onClick={closeModal}
                className="w-9 h-9 rounded-full bg-rose-50 hover:bg-rose-100 text-forest flex items-center justify-center font-bold text-sm transition-colors cursor-pointer"
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
              <p className="text-xs sm:text-sm text-forest/75 leading-relaxed">
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
                  className="px-5 py-2 rounded-full text-xs font-bold bg-rose-dark text-white hover:bg-rose-berry transition-colors inline-flex items-center gap-1.5"
                >
                  <span>{modalData.linkLabel || 'Buka Tautan Resmi ↗'}</span>
                </a>
              ) : (
                <span className="text-xs text-rose-700 italic">Dokumentasi Portofolio Resmi</span>
              )}

              <button
                onClick={closeModal}
                className="px-4 py-2 rounded-full text-xs font-semibold text-forest/75 hover:bg-rose-50 transition-colors"
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
