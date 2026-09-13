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

// Reusable Signature Botanical Flourishes (Lily & Magnolia Motif)
function BotanicalDivider({ className = "" }: { className?: string }) {
  return (
    <div className={`w-full max-w-5xl mx-auto py-10 sm:py-14 flex items-center justify-center gap-4 px-4 opacity-75 ${className}`}>
      <div className="h-px flex-1 bg-gradient-to-r from-transparent via-[#CAD7C5] to-[#CAD7C5]"></div>
      <div className="flex items-center gap-2 text-rose-dusty select-none">
        <span className="text-[10px] text-rose-dusty/60">✦</span>
        <svg className="w-5 h-5 text-rose-dusty" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
          <path d="M12 2C13.5 5.5 17.5 7.5 21 8C17.5 9.5 14.5 13.5 14 17C12.5 13.5 8.5 11.5 5 11C8.5 9.5 11.5 5.5 12 2Z" fill="#BD5871" fillOpacity="0.25" />
          <circle cx="12" cy="11" r="1.5" fill="#BD5871" />
        </svg>
        <span className="text-[10px] text-rose-dusty/60">✦</span>
      </div>
      <div className="h-px flex-1 bg-gradient-to-l from-transparent via-[#CAD7C5] to-[#CAD7C5]"></div>
    </div>
  );
}

function BotanicalCorner({ className = "top-3 right-3" }: { className?: string }) {
  return (
    <div className={`absolute ${className} pointer-events-none z-10 botanical-corner opacity-40 group-hover:opacity-100 transition-all duration-300`}>
      <svg className="w-5 h-5 sm:w-6 sm:h-6 text-rose-dusty/80" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <path d="M4 20c4-4 8-6 16-8-2 8-4 12-8 16-2-2-4-5-8-8z" fill="#BD5871" fillOpacity="0.15" />
        <path d="M12 12c2-3 5-4 8-5-1 4-2 6-5 8" strokeDasharray="1 1" />
      </svg>
    </div>
  );
}

function FloralBullet() {
  return (
    <svg className="w-3.5 h-3.5 text-rose-dusty shrink-0 mt-0.5" viewBox="0 0 16 16" fill="currentColor">
      <path d="M8 1c1.5 2.5 3.5 3.5 6 4-2.5 1.5-3.5 3.5-4 6-1.5-2.5-3.5-3.5-6-4 2.5-1.5 3.5-3.5 4-6z" opacity="0.85" />
    </svg>
  );
}

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

  // Top featured project for full-width highlight card
  const featuredProject = projectsList[0];
  const gridProjects = projectsList.slice(1);

  // Filtered projects for grid
  const filteredProjects = activeProjectFilter === 'all'
    ? gridProjects
    : gridProjects.filter(p => 
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
      {/* 1. NAVBAR: Modern Floating Editorial Pill (Sequential Navigation)         */}
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

          {/* Desktop Nav Links (100% Sequential Match with Page Content Flow) */}
          <div className="hidden lg:flex items-center gap-5 xl:gap-6 text-xs font-semibold tracking-wider uppercase text-forest/80">
            <a href="#about" className="hover:text-rose-dark transition-colors whitespace-nowrap">About</a>
            <a href="#process" className="hover:text-rose-dark transition-colors whitespace-nowrap">Process</a>
            <a href="#projects" className="hover:text-rose-dark transition-colors whitespace-nowrap">Works</a>
            <a href="#creator" className="hover:text-rose-dark transition-colors whitespace-nowrap">Creator Studio</a>
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
            <a href="#process" onClick={() => setMobileMenuOpen(false)} className="py-2 px-3 hover:bg-rose-50 rounded-lg transition-colors">Process</a>
            <a href="#projects" onClick={() => setMobileMenuOpen(false)} className="py-2 px-3 hover:bg-rose-50 rounded-lg transition-colors">Works</a>
            <a href="#creator" onClick={() => setMobileMenuOpen(false)} className="py-2 px-3 hover:bg-rose-50 rounded-lg transition-colors">Creator Studio</a>
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
                className="bg-white/80 border border-[#CAD7C5] hover:border-rose-dusty text-forest hover:text-rose-dark rounded-full px-6 sm:px-7 py-3 text-sm font-semibold shadow-xs hover:shadow-sm transition-all cursor-pointer whitespace-nowrap"
              >
                Lihat Studi Kasus ↓
              </a>
            </div>

            {/* Trust Badges & Awards Proof Row */}
            <div className="pt-2 w-full flex items-center gap-4 flex-wrap">
              <div className="flex -space-x-2.5 overflow-hidden">
                <img className="inline-block h-8 w-8 rounded-full ring-2 ring-white object-cover shadow-2xs" src="/11.png" alt="Award 1" loading="lazy" decoding="async" />
                <img className="inline-block h-8 w-8 rounded-full ring-2 ring-white object-cover shadow-2xs" src="/12.png" alt="Award 2" loading="lazy" decoding="async" />
                <img className="inline-block h-8 w-8 rounded-full ring-2 ring-white object-cover shadow-2xs" src="/13.png" alt="Award 3" loading="lazy" decoding="async" />
                <img className="inline-block h-8 w-8 rounded-full ring-2 ring-white object-cover shadow-2xs" src="/14.png" alt="Award 4" loading="lazy" decoding="async" />
              </div>
              <div className="text-xs text-forest/75 font-medium">
                <strong className="font-bold text-forest">7x Juara Nasional</strong> Kompetisi Business Plan &amp; Karya Tulis Ilmiah
              </div>
            </div>

          </div>

          {/* ================= RIGHT COLUMN: Hero Photo Container ================= */}
          <div className="lg:col-span-5 flex items-center justify-center relative">
            
            {/* Halo Ambient Glow */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] sm:w-[400px] h-[300px] sm:h-[400px] pink-halo-glow rounded-full pointer-events-none z-0"></div>

            {/* Photo Frame Container */}
            <div className="relative z-10 w-full max-w-[360px] sm:max-w-[430px] rounded-4xl bg-white/85 border border-[#CAD7C5] p-3 sm:p-4 shadow-xl backdrop-blur-xs transition-transform duration-500 hover:-translate-y-1">
              
              {/* Photo Subject with Smooth Gradient & Border */}
              <div className="relative rounded-[2rem] overflow-hidden bg-gradient-to-b from-[#F2F7EF]/90 to-[#E8EFE5]/70 flex items-end justify-center min-h-[380px] sm:min-h-[440px] md:min-h-[480px]">
                <img
                  src={portfolioData.hero?.avatarImg || "/chikal-hero.png"}
                  alt="Chikal Nazmi Mahira"
                  className="w-full h-auto object-cover object-bottom max-h-[490px] drop-shadow-md transform hover:scale-[1.02] transition-transform duration-700 ease-out"
                  loading="eager"
                  decoding="async"
                />

                {/* Subtle Gradient Fog at Feet */}
                <div className="absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-white/40 to-transparent pointer-events-none"></div>
              </div>

              {/* Floating Verified Student Pill */}
              <div className="absolute -bottom-4 left-1/2 -translate-x-1/2 whitespace-nowrap bg-white/95 backdrop-blur-md px-4 py-2 rounded-full border border-[#CAD7C5] shadow-lg flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping"></span>
                <span className="text-[11px] font-semibold text-forest">
                  D4 SIB Student • Politeknik Negeri Malang
                </span>
              </div>

            </div>

          </div>

        </div>

        {/* Unified Glass Metric Ribbon Across Full Width */}
        <div className="max-w-[1560px] mx-auto mt-14 sm:mt-16 bg-white/60 backdrop-blur-md border border-[#CAD7C5]/80 rounded-3xl p-3 sm:p-4 shadow-xs">
          <div className="grid grid-cols-2 md:grid-cols-4 divide-y md:divide-y-0 md:divide-x divide-[#CAD7C5]/60">
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

      <BotanicalDivider />

      {/* ========================================================================= */}
      {/* 4. VALUE PROPOSITION & 3-PILLAR STRUCTURED SKILLS (#about)                 */}
      {/* ========================================================================= */}
      <section id="about" className="w-full py-16 sm:py-24 px-4 sm:px-8 lg:px-12 xl:px-16 text-center relative">
        
        {/* Soft Center Aura */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[320px] sm:w-[500px] h-[320px] sm:h-[500px] pink-halo-glow-subtle rounded-full pointer-events-none z-0"></div>

        {/* Script / Editorial Kicker */}
        <div className="relative z-10 mb-4">
          <span className="font-script text-3xl sm:text-4xl text-rose-dark block">/ Core Philosophy &amp; Capabilities /</span>
        </div>

        {/* Big Bold Statement with Highlighted Words (Elian Ross Style) */}
        <div className="relative z-10 max-w-3xl mx-auto mb-14">
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

        {/* 3 Structured Pillar Cards (Solving Tag Cloud Clump into Cohesive Hierarchy) */}
        <div className="relative z-10 max-w-[1560px] mx-auto grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8 text-left">
          
          {/* Pillar 1: Clear Business Strategy */}
          <div className="editorial-card p-6 sm:p-7 rounded-3xl bg-white/95 border border-[#CAD7C5] shadow-xs relative group flex flex-col justify-between">
            <BotanicalCorner />
            <div>
              <div className="flex items-center gap-2 text-rose-dusty text-xs font-bold uppercase tracking-wider mb-2">
                <span>✦</span>
                <span>PILLAR 01</span>
              </div>
              <h3 className="font-sans font-bold text-xl sm:text-2xl text-forest mb-2">
                Clear Business Strategy
              </h3>
              <p className="text-xs sm:text-sm text-neutral-600 leading-relaxed mb-6">
                Riset pasar berbasis data, pemodelan kelayakan finansial, dan perumusan strategi kemitraan B2B yang realistis.
              </p>
            </div>
            <div className="flex flex-wrap gap-2 pt-4 border-t border-[#CAD7C5]/40">
              {[
                'Business Model Canvas (BMC)',
                'B2B Partnerships Strategy',
                'Market & Feasibility Study',
                'Revenue & Pricing Modeling'
              ].map((pill, idx) => (
                <span 
                  key={idx}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#F2F7EF] border border-[#CAD7C5] text-[11px] font-semibold text-forest hover:border-rose-dusty/80 transition-all cursor-default"
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-forest/70"></span>
                  <span>{pill}</span>
                </span>
              ))}
            </div>
          </div>

          {/* Pillar 2: Thoughtful Operational Systems */}
          <div className="editorial-card p-6 sm:p-7 rounded-3xl bg-white/95 border border-[#CAD7C5] shadow-xs relative group flex flex-col justify-between">
            <BotanicalCorner />
            <div>
              <div className="flex items-center gap-2 text-rose-dusty text-xs font-bold uppercase tracking-wider mb-2">
                <span>✦</span>
                <span>PILLAR 02</span>
              </div>
              <h3 className="font-sans font-bold text-xl sm:text-2xl text-forest mb-2">
                Thoughtful Operational Systems
              </h3>
              <p className="text-xs sm:text-sm text-neutral-600 leading-relaxed mb-6">
                Arsitektur sistem informasi bisnis (D4 SIB), SOP terstandarisasi, serta otomasi sirkulasi dan penagihan pelanggan.
              </p>
            </div>
            <div className="flex flex-wrap gap-2 pt-4 border-t border-[#CAD7C5]/40">
              {[
                'SOP & Operational Flow',
                'System Architecture & D4 SIB',
                'Relational Database Modeling',
                'KPI & Performance Tracking'
              ].map((pill, idx) => (
                <span 
                  key={idx}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#F2F7EF] border border-[#CAD7C5] text-[11px] font-semibold text-forest hover:border-rose-dusty/80 transition-all cursor-default"
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-rose-dusty"></span>
                  <span>{pill}</span>
                </span>
              ))}
            </div>
          </div>

          {/* Pillar 3: Creative Storytelling */}
          <div className="editorial-card p-6 sm:p-7 rounded-3xl bg-white/95 border border-[#CAD7C5] shadow-xs relative group flex flex-col justify-between">
            <BotanicalCorner />
            <div>
              <div className="flex items-center gap-2 text-rose-dusty text-xs font-bold uppercase tracking-wider mb-2">
                <span>✦</span>
                <span>PILLAR 03</span>
              </div>
              <h3 className="font-sans font-bold text-xl sm:text-2xl text-forest mb-2">
                Creative Storytelling
              </h3>
              <p className="text-xs sm:text-sm text-neutral-600 leading-relaxed mb-6">
                Prototipe interaktif antarmuka Figma, penyutradaraan konten video pendek berdaya jangkau tinggi, dan kurasi katalog ritel.
              </p>
            </div>
            <div className="flex flex-wrap gap-2 pt-4 border-t border-[#CAD7C5]/40">
              {[
                'Figma Interactive Prototyping',
                'UI/UX User Flow & Wireframe',
                'Short-Form Video Production',
                'Brand Campaign Direction'
              ].map((pill, idx) => (
                <span 
                  key={idx}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#F2F7EF] border border-[#CAD7C5] text-[11px] font-semibold text-forest hover:border-rose-dusty/80 transition-all cursor-default"
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-forest/70"></span>
                  <span>{pill}</span>
                </span>
              ))}
            </div>
          </div>

        </div>

      </section>

      <BotanicalDivider />

      {/* ========================================================================= */}
      {/* 5. PROCESS ROADMAP ("Here's how it works" with Clear Deliverables)        */}
      {/* ========================================================================= */}
      <section id="process" className="w-full py-16 sm:py-24 px-4 sm:px-8 lg:px-12 xl:px-16 relative">
        
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

        {/* 3 Process Cards with Connected Curvy Line (Desktop) */}
        <div className="relative max-w-[1560px] mx-auto">
          
          {/* Curvy Connector Line SVG (Desktop) */}
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
            <div className="process-card p-7 sm:p-8 rounded-3xl bg-white border border-[#CAD7C5] shadow-xs flex flex-col justify-between relative group">
              <BotanicalCorner />
              <div>
                <span className="font-serif italic font-normal text-6xl text-rose-dusty/35 group-hover:text-rose-dusty transition-colors">01</span>
                <h3 className="font-sans font-bold text-2xl text-forest mt-4 mb-2">
                  Discover
                </h3>
                <p className="text-xs sm:text-sm text-neutral-600 leading-relaxed mb-6">
                  Riset pasar mendalam, wawancara stakeholder/pengguna, analisis kendala operasional (bottlenecks), dan pemetaan peluang bisnis nyata.
                </p>
              </div>
              
              {/* Explicit Key Deliverables List with Floral Bullets */}
              <div className="pt-5 border-t border-[#CAD7C5]/60 space-y-2">
                <span className="text-[10px] font-bold text-rose-dark uppercase tracking-wider block mb-2">
                  ✦ Key Deliverables:
                </span>
                <div className="flex items-start gap-2 text-xs text-forest/85">
                  <FloralBullet />
                  <span>Stakeholder &amp; User In-Depth Interviews</span>
                </div>
                <div className="flex items-start gap-2 text-xs text-forest/85">
                  <FloralBullet />
                  <span>Operational Bottleneck &amp; Ecosystem Audit</span>
                </div>
                <div className="flex items-start gap-2 text-xs text-forest/85">
                  <FloralBullet />
                  <span>Competitive Market Landscape Mapping</span>
                </div>
              </div>
            </div>

            {/* Card 02 - Strategize */}
            <div className="process-card p-7 sm:p-8 rounded-3xl bg-white border border-[#CAD7C5] shadow-xs flex flex-col justify-between relative group">
              <BotanicalCorner />
              <div>
                <span className="font-serif italic font-normal text-6xl text-rose-dusty/35 group-hover:text-rose-dusty transition-colors">02</span>
                <h3 className="font-sans font-bold text-2xl text-forest mt-4 mb-2">
                  Strategize
                </h3>
                <p className="text-xs sm:text-sm text-neutral-600 leading-relaxed mb-6">
                  Merumuskan Business Model Canvas, analisis kelayakan finansial, standard operating procedure (SOP), serta arsitektur sistem informasi.
                </p>
              </div>

              {/* Explicit Key Deliverables List with Floral Bullets */}
              <div className="pt-5 border-t border-[#CAD7C5]/60 space-y-2">
                <span className="text-[10px] font-bold text-rose-dark uppercase tracking-wider block mb-2">
                  ✦ Key Deliverables:
                </span>
                <div className="flex items-start gap-2 text-xs text-forest/85">
                  <FloralBullet />
                  <span>Business Model Canvas (BMC) Blueprint</span>
                </div>
                <div className="flex items-start gap-2 text-xs text-forest/85">
                  <FloralBullet />
                  <span>Standard Operating Procedure (SOP) Matrix</span>
                </div>
                <div className="flex items-start gap-2 text-xs text-forest/85">
                  <FloralBullet />
                  <span>Database Schema &amp; Information Flow Architecture</span>
                </div>
              </div>
            </div>

            {/* Card 03 - Deliver */}
            <div className="process-card p-7 sm:p-8 rounded-3xl bg-white border border-[#CAD7C5] shadow-xs flex flex-col justify-between relative group">
              <BotanicalCorner />
              <div>
                <span className="font-serif italic font-normal text-6xl text-rose-dusty/35 group-hover:text-rose-dusty transition-colors">03</span>
                <h3 className="font-sans font-bold text-2xl text-forest mt-4 mb-2">
                  Deliver
                </h3>
                <p className="text-xs sm:text-sm text-neutral-600 leading-relaxed mb-6">
                  Eksekusi kampanye pemasaran digital, pembuatan prototipe interaktif, deployment sistem operasional, dan pelacakan KPI terukur.
                </p>
              </div>

              {/* Explicit Key Deliverables List with Floral Bullets */}
              <div className="pt-5 border-t border-[#CAD7C5]/60 space-y-2">
                <span className="text-[10px] font-bold text-rose-dark uppercase tracking-wider block mb-2">
                  ✦ Key Deliverables:
                </span>
                <div className="flex items-start gap-2 text-xs text-forest/85">
                  <FloralBullet />
                  <span>High-Fidelity Interactive Prototype (Figma)</span>
                </div>
                <div className="flex items-start gap-2 text-xs text-forest/85">
                  <FloralBullet />
                  <span>Commercial Campaign Launch &amp; Content Asset</span>
                </div>
                <div className="flex items-start gap-2 text-xs text-forest/85">
                  <FloralBullet />
                  <span>Measurable Growth KPI &amp; Conversion Verification</span>
                </div>
              </div>
            </div>

          </div>
        </div>

      </section>

      <BotanicalDivider />

      {/* ========================================================================= */}
      {/* 6. SELECTED WORKS & SYSTEM CASE STUDIES (#projects)                        */}
      {/* ========================================================================= */}
      <section id="projects" className="w-full py-16 sm:py-24 px-4 sm:px-8 lg:px-12 xl:px-16">
        <div className="max-w-[1560px] mx-auto">
          
          {/* Section Header */}
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6 mb-12">
            <div>
              <span className="font-script text-3xl sm:text-4xl text-rose-dark block">/ Portfolio &amp; Case Studies /</span>
              <h2 className="font-sans font-medium text-4xl sm:text-5xl text-forest tracking-tight mt-1">
                Selected Works &amp; Case Studies
              </h2>
              <p className="text-xs sm:text-sm text-neutral-600 mt-2 max-w-lg">
                Implementasi nyata perancangan model bisnis, sistem informasi operasional, dan optimalisasi kampanye digital komersial.
              </p>
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

          {/* TOP FEATURED FULL-WIDTH CASE STUDY (Breaking Grid Monotony with Editorial Layout) */}
          {featuredProject && (
            <div 
              onClick={() => openModal({
                title: featuredProject.title,
                category: featuredProject.category,
                description: featuredProject.summary,
                images: featuredProject.extraImages && featuredProject.extraImages.length > 0 ? featuredProject.extraImages : [featuredProject.image || '/1.png'],
                link: featuredProject.link,
                linkLabel: featuredProject.linkLabel || 'Buka Dokumentasi Sistem ↗'
              })}
              className="editorial-card p-6 sm:p-9 rounded-4xl bg-white/95 border border-[#CAD7C5] shadow-sm hover:shadow-xl hover:border-rose-dusty/70 transition-all duration-300 cursor-pointer group mb-12 relative overflow-hidden"
            >
              <BotanicalCorner />
              
              <div className="flex items-center gap-2 text-rose-dark text-xs font-bold uppercase tracking-wider mb-6">
                <span>✦</span>
                <span>FEATURED FLAGSHIP CASE STUDY</span>
                <span className="hidden sm:inline text-[#CAD7C5]">•</span>
                <span className="hidden sm:inline text-neutral-500 font-normal">D4 SIB Polinema</span>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
                
                {/* Left: Large High-Fidelity Mockup Container with Botanical Watermark Texture */}
                <div className="lg:col-span-7 relative overflow-hidden rounded-3xl bg-neutral-100 aspect-[16/10] sm:aspect-[16/9] border border-[#CAD7C5]/50 botanical-watermark">
                  <img 
                    src={featuredProject.image || "/1.png"} 
                    alt={featuredProject.title}
                    className="w-full h-full object-cover object-top group-hover:scale-[1.02] transition-transform duration-700" 
                    loading="lazy"
                    decoding="async"
                  />
                  <div className="absolute top-4 left-4">
                    <span className="px-3.5 py-1.5 rounded-full bg-white/90 backdrop-blur-md text-[11px] font-bold text-forest shadow-xs border border-[#CAD7C5]">
                      Live Operational System
                    </span>
                  </div>
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-300 flex items-center justify-center">
                    <span className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 px-5 py-2.5 rounded-full bg-white/95 backdrop-blur-md text-xs font-bold text-forest shadow-md">
                      Buka Dokumentasi &amp; Hasil Sistem ↗
                    </span>
                  </div>
                </div>

                {/* Right: Rich Editorial Content & Measured Business Impact */}
                <div className="lg:col-span-5 flex flex-col justify-between space-y-6 text-left">
                  <div>
                    <span className="text-[11px] font-bold text-rose-800 uppercase tracking-wider bg-rose-50 px-3 py-1 rounded-full border border-rose-100">
                      {featuredProject.category}
                    </span>
                    <h3 className="font-serif font-bold text-2xl sm:text-3xl text-forest mt-3 mb-3 leading-tight group-hover:text-rose-dark transition-colors">
                      {featuredProject.title}
                    </h3>
                    <p className="text-xs sm:text-sm text-neutral-600 leading-relaxed mb-6">
                      {featuredProject.summary}
                    </p>

                    {/* Measured Impact Numbers */}
                    <div className="grid grid-cols-2 gap-3 p-4 rounded-2xl bg-[#F2F7EF]/70 border border-[#CAD7C5]/80 mb-6">
                      <div>
                        <span className="font-serif font-bold text-xl sm:text-2xl text-forest block">
                          +300%
                        </span>
                        <span className="text-[10px] uppercase font-semibold text-neutral-500 tracking-wider">
                          Efisiensi Distribusi
                        </span>
                      </div>
                      <div>
                        <span className="font-serif font-bold text-xl sm:text-2xl text-rose-dark block">
                          100%
                        </span>
                        <span className="text-[10px] uppercase font-semibold text-neutral-500 tracking-wider">
                          Digital Billing Accuracy
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <span className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full bg-forest text-white text-xs font-bold tracking-wide uppercase group-hover:bg-rose-dark transition-colors">
                      <span>Lihat Detail Studi Kasus</span>
                      <span>→</span>
                    </span>
                    <span className="text-xs text-neutral-400 font-mono">{featuredProject.tag}</span>
                  </div>

                </div>

              </div>
            </div>
          )}

          {/* FILTERABLE PROJECT GRID (2-Column Editorial Grid for Remaining Works) */}
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
                className="editorial-card p-5 sm:p-6 rounded-4xl bg-white/95 border border-[#CAD7C5] shadow-xs hover:shadow-xl hover:border-rose-dusty/60 hover:-translate-y-1 transition-all duration-300 cursor-pointer group flex flex-col justify-between relative overflow-hidden"
              >
                <BotanicalCorner />

                {/* Project Image Container with Botanical Watermark Texture */}
                <div className="relative overflow-hidden rounded-3xl bg-neutral-100 aspect-[16/10] sm:aspect-[16/11] mb-5 border border-[#CAD7C5]/40 botanical-watermark">
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

          {/* MID-PAGE SECONDARY QUICK-CONNECT CTA RIBBON */}
          <div className="mt-14 sm:mt-16 max-w-5xl mx-auto rounded-3xl p-6 sm:p-8 bg-gradient-to-r from-white/95 via-[#F2F7EF]/90 to-white/95 border border-[#CAD7C5] shadow-xs flex flex-col md:flex-row items-center justify-between gap-6 relative overflow-hidden">
            <BotanicalCorner className="top-2 right-2" />
            <div className="text-left space-y-1">
              <span className="text-[11px] font-bold text-rose-dark uppercase tracking-wider flex items-center gap-1.5">
                <span>✦</span> Siap Berkolaborasi?
              </span>
              <h3 className="font-serif font-bold text-xl sm:text-2xl text-forest">
                Punya ide sistem bisnis atau kampanye kreatif?
              </h3>
              <p className="text-xs sm:text-sm text-neutral-600 max-w-lg">
                Mari diskusikan bagaimana perancangan sistem informasi dan strategi konten dapat mendorong pertumbuhan bisnis Anda.
              </p>
            </div>
            <div className="flex items-center gap-3 shrink-0 w-full md:w-auto justify-start md:justify-end">
              <a
                href={portfolioData.socials?.whatsapp || "https://wa.me/6281234567890"}
                target="_blank"
                rel="noopener noreferrer"
                className="px-5 py-2.5 rounded-full bg-forest hover:bg-forest-dark text-white text-xs font-semibold shadow-md hover:shadow-lg hover:-translate-y-0.5 transition-all flex items-center gap-2 whitespace-nowrap"
              >
                <span>✦ Chat WhatsApp</span>
                <span>→</span>
              </a>
              <a
                href={`mailto:${portfolioData.socials?.email || "chikalnazmi@gmail.com"}`}
                className="px-5 py-2.5 rounded-full bg-white border border-[#CAD7C5] hover:border-rose-dusty text-forest text-xs font-semibold shadow-2xs hover:shadow-xs hover:-translate-y-0.5 transition-all whitespace-nowrap"
              >
                Email Inkuiri ✉
              </a>
            </div>
          </div>

        </div>
      </section>

      <BotanicalDivider />

      {/* ========================================================================= */}
      {/* 7. CREATIVE MEDIA & CONTENT CREATOR SHOWCASE (#creator)                    */}
      {/* ========================================================================= */}
      <section id="creator" className="w-full py-16 sm:py-24 px-4 sm:px-8 lg:px-12 xl:px-16">
        <div className="max-w-[1560px] mx-auto">
          
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

            {/* Switchable Account Pills */}
            <div className="flex flex-wrap gap-2">
              {Object.entries(creatorAccounts).map(([key, acc]) => (
                <button
                  key={key}
                  onClick={() => setActiveCreatorKey(key)}
                  className={`px-4 py-2 rounded-full text-xs font-semibold transition-all cursor-pointer ${
                    activeCreatorKey === key
                      ? 'bg-rose-dark text-white shadow-xs'
                      : 'bg-white/80 text-forest/75 border border-[#CAD7C5] hover:border-rose-dusty'
                  }`}
                >
                  {acc.name} ({acc.handle})
                </button>
              ))}
            </div>
          </div>

          {/* Active Creator Stage Display */}
          {currentCreator && (
            <div className="space-y-6">
              
              {/* Creator Metadata Bar */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 rounded-2xl bg-white/80 border border-[#CAD7C5] shadow-xs">
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="font-serif font-bold text-2xl text-forest">
                      {currentCreator.name}
                    </h3>
                    <span className="text-xs font-mono text-rose-dusty font-semibold">
                      {currentCreator.handle}
                    </span>
                  </div>
                  <p className="text-xs text-neutral-500 mt-1">
                    {currentCreator.tag} · Platform: {currentCreator.platforms}
                  </p>
                </div>

                <span className="text-xs font-bold text-rose-dark bg-rose-50 px-4 py-1.5 rounded-full border border-rose-100 self-start sm:self-auto">
                  {currentCreator.stats}
                </span>
              </div>

              {/* 3 Interactive Phone & Showcase Mockups */}
              <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-stretch">
                
                {/* Left Media Card (Left Phone Mockup) */}
                <div 
                  className="md:col-span-3 bg-white/95 rounded-3xl p-4 sm:p-5 border border-[#CAD7C5] shadow-xs hover:shadow-xl hover:border-rose-dusty/60 hover:-translate-y-1 transition-all duration-300 cursor-pointer group flex flex-col justify-between relative overflow-hidden"
                  onClick={() => openModal({
                    title: currentCreator.leftPhoneTitle || currentCreator.name,
                    category: currentCreator.leftPhoneTag || 'SOCIAL MEDIA REELS',
                    description: `Cuplikan konten video vertikal berdaya jangkau tinggi yang dikurasi langsung oleh Chikal Nazmi untuk ${currentCreator.name}.`,
                    images: [currentCreator.leftPhoneImg || '/7.png', currentCreator.centerImg || '/17.png'],
                    link: currentCreator.leftPhoneLink || portfolioData.socials?.instagram,
                    linkLabel: 'Buka Video Reels ↗'
                  })}
                >
                  <BotanicalCorner />
                  <div className="relative aspect-[9/16] rounded-2xl overflow-hidden bg-neutral-100 mb-3 border border-[#CAD7C5]/40 botanical-watermark">
                    <img
                      src={currentCreator.leftPhoneImg || "/7.png"}
                      alt="Left Reel Preview"
                      className="w-full h-full object-cover group-hover:scale-[1.03] transition-transform duration-500"
                      loading="lazy"
                      decoding="async"
                    />
                    <div className="absolute inset-0 bg-black/10 flex items-center justify-center">
                      <span className="w-10 h-10 rounded-full bg-white/90 flex items-center justify-center text-rose-dark shadow-md">▶</span>
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
                  className="md:col-span-6 bg-white/95 rounded-3xl p-5 sm:p-6 border border-[#CAD7C5] shadow-xs hover:shadow-xl hover:border-rose-dusty/60 hover:-translate-y-1 transition-all duration-300 cursor-pointer group flex flex-col justify-between relative overflow-hidden"
                  onClick={() => openModal({
                    title: currentCreator.centerTitle || currentCreator.name,
                    category: 'CREATIVE SHOWCASE',
                    description: currentCreator.centerDesc || `Visual pameran dan kurasi kampanye komersial untuk ${currentCreator.name}.`,
                    images: [currentCreator.centerImg || '/17.png', currentCreator.rightPhoneImg || '/8.png', currentCreator.leftPhoneImg || '/7.png'],
                    link: currentCreator.centerLink,
                    linkLabel: 'Buka Dokumentasi Penuh ↗'
                  })}
                >
                  <BotanicalCorner />
                  <div className="relative aspect-[16/10] sm:aspect-[16/11] rounded-2xl overflow-hidden bg-neutral-100 mb-4 border border-[#CAD7C5]/40 botanical-watermark">
                    <img
                      src={currentCreator.centerImg || "/17.png"}
                      alt="Center Showcase Preview"
                      className="w-full h-full object-cover group-hover:scale-[1.03] transition-transform duration-500"
                      loading="lazy"
                      decoding="async"
                    />
                  </div>
                  <div>
                    <span className="text-[10px] font-bold text-rose-800 uppercase tracking-wider bg-rose-50 px-2.5 py-0.5 rounded-full border border-rose-100">
                      Showcase Utama
                    </span>
                    <h4 className="font-serif font-bold text-lg sm:text-xl text-forest mt-2 group-hover:text-rose-dark transition-colors">
                      {currentCreator.centerTitle}
                    </h4>
                    <p className="text-xs text-neutral-600 mt-1 line-clamp-2 leading-relaxed">
                      {currentCreator.centerDesc}
                    </p>
                  </div>
                </div>

                {/* Right Media Card (Right Phone Mockup) */}
                <div 
                  className="md:col-span-3 bg-white/95 rounded-3xl p-4 sm:p-5 border border-[#CAD7C5] shadow-xs hover:shadow-xl hover:border-rose-dusty/60 hover:-translate-y-1 transition-all duration-300 cursor-pointer group flex flex-col justify-between relative overflow-hidden"
                  onClick={() => openModal({
                    title: currentCreator.rightPhoneTitle || currentCreator.name,
                    category: currentCreator.rightPhoneTag || 'TIKTOK CONTENT',
                    description: `Kampanye konten video pendek TikTok dengan storytelling interaktif untuk ${currentCreator.name}.`,
                    images: [currentCreator.rightPhoneImg || '/8.png', currentCreator.centerImg || '/17.png'],
                    link: currentCreator.rightPhoneLink || portfolioData.socials?.tiktok,
                    linkLabel: 'Buka Video TikTok ↗'
                  })}
                >
                  <BotanicalCorner />
                  <div className="relative aspect-[9/16] rounded-2xl overflow-hidden bg-neutral-100 mb-3 border border-[#CAD7C5]/40 botanical-watermark">
                    <img
                      src={currentCreator.rightPhoneImg || "/8.png"}
                      alt="Right Reel Preview"
                      className="w-full h-full object-cover group-hover:scale-[1.03] transition-transform duration-500"
                      loading="lazy"
                      decoding="async"
                    />
                    <div className="absolute inset-0 bg-black/10 flex items-center justify-center">
                      <span className="w-10 h-10 rounded-full bg-white/90 flex items-center justify-center text-rose-dark shadow-md">▶</span>
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

        </div>
      </section>

      <BotanicalDivider />

      {/* ========================================================================= */}
      {/* 8. CAREER JOURNEY & TIMELINE (#experience - Synchronized with Navbar)      */}
      {/* ========================================================================= */}
      <section id="experience" className="w-full py-16 sm:py-24 px-4 sm:px-8 lg:px-12 xl:px-16">
        <div className="max-w-[1560px] mx-auto">
          
          {/* Kicker & Title */}
          <div className="mb-14">
            <span className="font-script text-3xl sm:text-4xl text-rose-dark block">/ Career &amp; Experience /</span>
            <h2 className="font-sans font-medium text-4xl sm:text-5xl lg:text-6xl text-forest tracking-tight mt-1">
              Career Journey &amp; Experience <span className="font-serif italic font-normal text-rose-dark">Pushing Boundaries since 2020</span>
            </h2>
          </div>

          {/* 2 Columns: Photo & Bio Left, Clean Horizontal Timeline Right */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 sm:gap-14 items-start">
            
            {/* Left Column: Stylized Portrait Card & Official SVG Social Links */}
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

              {/* Social Icons Row with Official SVG Brand Logos */}
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

            {/* Right Column: Narrative Story & Generous Spaced Career Timeline */}
            <div className="lg:col-span-7 space-y-8">
              <p className="text-sm sm:text-base text-neutral-700 leading-relaxed font-normal">
                Lulusan <strong>{academicData.degree || "Sarjana Terapan Sistem Informasi Bisnis (D4 SIB)"} {academicData.institution || "Politeknik Negeri Malang"}</strong> dengan predikat <em>{academicData.badge || "Cum Laude"} (IPK {academicData.gpaValue || "3.84"})</em>{academicData.toeicScore ? ` serta sertifikasi internasional TOEIC ${academicData.toeicScore} (${academicData.toeicLevel || "Working Proficiency"})` : ""}. {academicData.description || "Berfokus pada perancangan model bisnis, tata kelola data sistem informasi, serta optimalisasi strategi media komersial yang terbukti memperluas pangsa pasar dan memenangkan kompetisi nasional."}
              </p>

              {/* Clean Timeline Rows with Generous Spacing and Breathing Room */}
              <div className="border-t border-[#CAD7C5]/60 divide-y divide-[#CAD7C5]/50">
                {experiencesList.map((exp, idx) => (
                  <div 
                    key={exp.id || idx}
                    className="py-5 sm:py-6 flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4 hover:bg-white/60 px-3 rounded-2xl transition-all cursor-pointer group"
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
                      <h4 className="font-sans font-bold text-base sm:text-lg text-forest group-hover:text-rose-dark transition-colors">
                        {exp.title}
                      </h4>
                      <p className="text-xs text-neutral-500 mt-1">
                        {exp.category} · <span className="font-medium text-rose-dusty">{exp.tag}</span>
                      </p>
                    </div>

                    <div className="flex items-center gap-3 self-start sm:self-auto shrink-0">
                      <span className="text-[11px] font-medium text-forest bg-[#F2F7EF] px-3 py-1 rounded-full border border-[#CAD7C5]">
                        {exp.period}
                      </span>
                      <span className="text-xs text-rose-dusty group-hover:text-rose-dark group-hover:translate-x-1 transition-all">→</span>
                    </div>
                  </div>
                ))}

                {/* Education Entry */}
                <div 
                  className="py-5 sm:py-6 flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4 hover:bg-white/60 px-3 rounded-2xl transition-all cursor-pointer group"
                  onClick={() => openModal({
                    title: `${academicData.degree} · ${academicData.institution}`,
                    category: 'FORMAL EDUCATION',
                    description: academicData.description,
                    images: academicData.images && academicData.images.length > 0 ? academicData.images : ['/11.png', '/12.png', '/16.png'],
                  })}
                >
                  <div>
                    <h4 className="font-sans font-bold text-base sm:text-lg text-forest group-hover:text-rose-dark transition-colors">
                      {academicData.degree}
                    </h4>
                    <p className="text-xs text-neutral-500 mt-1">
                      {academicData.institution} · <span className="font-medium text-rose-dusty">GPA {academicData.gpaValue} (Cum Laude)</span>
                    </p>
                  </div>

                  <div className="flex items-center gap-3 self-start sm:self-auto shrink-0">
                    <span className="text-[11px] font-medium text-forest bg-[#F2F7EF] px-3 py-1 rounded-full border border-[#CAD7C5]">
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
                  className="text-xs font-semibold text-rose-dark underline underline-offset-4 hover:text-rose-berry transition-colors flex items-center gap-1.5"
                >
                  <span>Minta Dokumen Curriculum Vitae (CV) via WhatsApp</span>
                  <span>↗</span>
                </a>
              </div>

            </div>

          </div>

        </div>
      </section>

      <BotanicalDivider />

      {/* ========================================================================= */}
      {/* 9. HONORS, AWARDS & PROFESSIONAL CERTIFICATIONS (#awards)                  */}
      {/* ========================================================================= */}
      <section id="awards" className="w-full py-16 sm:py-24 px-4 sm:px-8 lg:px-12 xl:px-16">
        <div className="max-w-[1560px] mx-auto space-y-16">
          
          {/* SUB-SECTION A: NATIONAL HONORS & COMPETITIONS */}
          <div>
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6 mb-12">
              <div>
                <span className="font-script text-3xl sm:text-4xl text-rose-dark block">/ Honors &amp; Recognitions /</span>
                <h2 className="font-sans font-medium text-4xl sm:text-5xl text-forest tracking-tight mt-1">
                  National Competitions &amp; Honors
                </h2>
                <p className="text-xs sm:text-sm text-neutral-600 mt-2 max-w-lg">
                  Rekam jejak kompetisi Business Plan dan Karya Tulis Ilmiah tingkat nasional dengan solusi berbasis riset dan kelayakan bisnis nyata.
                </p>
              </div>

              {/* Filter Pills */}
              <div className="flex flex-wrap gap-2">
                {[
                  { id: 'all', label: 'Semua Lomba' },
                  { id: '1st', label: 'Juara 1 (1st)' },
                  { id: '2nd', label: 'Juara 2 (2nd)' },
                  { id: 'top5', label: 'Top 5 & Speaker' },
                ].map(tab => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveAwardFilter(tab.id as any)}
                    className={`px-4 py-1.5 rounded-full text-xs font-semibold transition-all cursor-pointer ${
                      activeAwardFilter === tab.id
                        ? 'bg-rose-dark text-white shadow-xs'
                        : 'bg-white/80 text-forest/75 border border-[#CAD7C5] hover:border-rose-dusty'
                    }`}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Awards Grid (4-Column Editorial Cards) */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {filteredAwards.map((award, idx) => (
                <div
                  key={award.id || idx}
                  onClick={() => openModal({
                    title: award.title,
                    category: award.rank,
                    description: `${award.desc || award.title}\n\nTingkat: ${award.scope || award.level || 'Nasional'}\nPenyelenggara: ${award.organizer}\nTahun: ${award.year}`,
                    images: award.certImg ? [award.certImg] : ['/11.png'],
                    link: award.link,
                    linkLabel: award.linkLabel || 'Dokumentasi Resmi ↗'
                  })}
                  className="editorial-card p-6 rounded-3xl bg-white/95 border border-[#CAD7C5] shadow-xs hover:shadow-xl hover:border-rose-dusty/60 hover:-translate-y-1 transition-all duration-300 cursor-pointer group flex flex-col justify-between relative overflow-hidden"
                >
                  <BotanicalCorner />
                  <div>
                    <div className="flex items-center justify-between mb-4">
                      <span className="w-8 h-8 rounded-full bg-rose-50 text-rose-dark flex items-center justify-center text-sm font-serif font-bold">
                        🏆
                      </span>
                      <span className="text-[11px] font-bold text-rose-800 uppercase tracking-wider bg-rose-50 px-2.5 py-0.5 rounded-full border border-rose-100">
                        {award.year}
                      </span>
                    </div>

                    <h4 className="font-sans font-bold text-base text-forest group-hover:text-rose-dark transition-colors leading-snug">
                      {award.title}
                    </h4>
                    <p className="text-xs text-rose-dark font-medium mt-1">
                      {award.rank}
                    </p>
                    <p className="text-xs text-neutral-500 mt-2 line-clamp-2">
                      {award.desc}
                    </p>
                  </div>

                  <div className="mt-6 pt-3 border-t border-[#CAD7C5]/50 flex items-center justify-between text-[11px] text-neutral-500">
                    <span>{award.organizer}</span>
                    <span className="text-rose-dusty group-hover:text-rose-dark font-semibold">Sertifikat ↗</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Mini Botanical Flower Break */}
          <div className="w-48 mx-auto h-px bg-[#CAD7C5]/60 flex items-center justify-center">
            <span className="text-rose-dusty text-xs px-3 bg-[#E8EFE5] select-none">❀</span>
          </div>

          {/* SUB-SECTION B: PROFESSIONAL CERTIFICATIONS & CREDENTIALS */}
          <div>
            <div className="mb-10 text-left">
              <span className="font-script text-3xl sm:text-4xl text-rose-dark block">/ Continuous Learning /</span>
              <h3 className="font-sans font-medium text-3xl sm:text-4xl text-forest tracking-tight mt-1">
                Professional Certifications &amp; Credentials
              </h3>
              <p className="text-xs sm:text-sm text-neutral-600 mt-2 max-w-lg">
                Sertifikasi kompetensi resmi dalam metodologi riset digital, pemasaran komersial, dan tata kelola sistem.
              </p>
            </div>

            {/* Certifications Grid (4-Column Aligned Rhythm) */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
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
                  className="editorial-card p-6 rounded-3xl bg-white/95 border border-[#CAD7C5] hover:border-rose-dusty/60 shadow-xs hover:shadow-xl hover:-translate-y-1 transition-all duration-300 cursor-pointer flex flex-col justify-between relative overflow-hidden group"
                >
                  <BotanicalCorner />
                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-[10px] font-bold text-rose-dark uppercase tracking-wider bg-rose-50 px-2.5 py-0.5 rounded-full border border-rose-100">
                        {cert.issuer}
                      </span>
                      <span className="text-[10px] font-mono text-neutral-400">
                        {cert.year}
                      </span>
                    </div>
                    <h4 className="font-sans font-bold text-sm text-forest group-hover:text-rose-dark transition-colors mt-1 leading-snug">
                      {cert.title}
                    </h4>
                    <p className="text-xs text-neutral-500 mt-2 line-clamp-2">
                      {cert.desc || `Verifikasi kredensial resmi ${cert.title} yang diterbitkan oleh ${cert.issuer}.`}
                    </p>
                  </div>
                  
                  <div className="mt-5 pt-3 border-t border-[#CAD7C5]/50 flex items-center justify-between text-[11px]">
                    <span className="text-neutral-400 font-mono">Issued {cert.year}</span>
                    <span className="text-rose-dusty group-hover:text-rose-dark font-semibold">Verified ↗</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>
      </section>

      <BotanicalDivider />

      {/* ========================================================================= */}
      {/* 10. BOTTOM CTA BANNER ("Let's Make It Happen")                            */}
      {/* ========================================================================= */}
      <section className="py-16 sm:py-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="relative overflow-hidden rounded-4xl p-10 sm:p-16 text-center cta-banner-glow border border-[#CAD7C5] shadow-md">
          <BotanicalCorner className="top-4 right-4" />
          <BotanicalCorner className="bottom-4 left-4" />
          
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
      {/* 11. FOOTER WITH LARGE BOTANICAL CLOSING SILHOUETTE & SIGNATURE            */}
      {/* ========================================================================= */}
      <footer className="w-full border-t border-[#CAD7C5]/30 pt-16 pb-20 px-4 sm:px-8 lg:px-12 xl:px-16 relative overflow-hidden">
        
        {/* Large Botanical Lily/Magnolia Closing Silhouette Backdrop */}
        <div className="absolute -bottom-20 left-1/2 -translate-x-1/2 w-[600px] sm:w-[800px] h-[350px] pointer-events-none select-none opacity-[0.07] z-0 flex items-center justify-center">
          <svg viewBox="0 0 400 200" fill="currentColor" className="w-full h-full text-forest">
            <path d="M200 10 C220 50, 280 80, 350 90 C290 120, 260 160, 200 200 C140 160, 110 120, 50 90 C120 80, 180 50, 200 10 Z" />
            <path d="M200 60 C210 90, 250 110, 300 120 C250 140, 230 170, 200 190 C170 170, 150 140, 100 120 C150 110, 190 90, 200 60 Z" opacity="0.6" />
          </svg>
        </div>

        {/* Navigation & Copyright (Sequential Match with Page Flow) */}
        <div className="relative z-10 max-w-[1560px] mx-auto flex flex-col sm:flex-row items-center justify-between gap-6 text-xs text-neutral-600 pb-12">
          <div className="flex items-center gap-6 font-medium flex-wrap justify-center sm:justify-start">
            <a href="#about" className="hover:text-rose-dark transition-colors">About</a>
            <a href="#process" className="hover:text-rose-dark transition-colors">Process</a>
            <a href="#projects" className="hover:text-rose-dark transition-colors">Works</a>
            <a href="#creator" className="hover:text-rose-dark transition-colors">Creator Studio</a>
            <a href="#experience" className="hover:text-rose-dark transition-colors">Experience</a>
            <a href="#awards" className="hover:text-rose-dark transition-colors">Awards</a>
          </div>

          <p className="text-center sm:text-right text-neutral-400">
            © 2026 Chikal Nazmi. All rights reserved.
          </p>
        </div>

        {/* Giant Solid Signature Typography Across Bottom */}
        <div className="relative z-10 text-center select-none pt-4 overflow-hidden">
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
              <p className="text-xs sm:text-sm text-forest/75 leading-relaxed whitespace-pre-line">
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
