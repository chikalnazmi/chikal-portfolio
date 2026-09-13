'use client';

import React, { useState, useEffect } from 'react';
import { 
  getPortfolioData, 
  fetchPortfolioDataFromSupabase,
  subscribeToPortfolioUpdates, 
  DEFAULT_PORTFOLIO_DATA, 
  PortfolioData,
  AwardItem,
  ProjectDoc,
  OrganizationItem
} from '@/lib/portfolio-store';


function BotanicalDivider() {
  return (
    <div className="w-full flex items-center justify-center my-2 pointer-events-none select-none max-w-[1380px] mx-auto px-4 sm:px-6">
      <div className="flex-1 max-w-[220px] sm:max-w-sm h-px bg-gradient-to-r from-transparent to-[#CAD7C5]/80" />
      <div className="px-4 text-rose-dusty/70 text-base sm:text-lg">❀</div>
      <div className="flex-1 max-w-[220px] sm:max-w-sm h-px bg-gradient-to-l from-transparent to-[#CAD7C5]/80" />
    </div>
  );
}

function BotanicalCorner({ className = "top-4 right-4" }: { className?: string }) {
  return (
    <div className={`absolute ${className} pointer-events-none opacity-40 group-hover:opacity-80 transition-opacity`}>
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" className="text-rose-dusty">
        <path d="M12 2C12 2 13.5 6.5 17 8C13.5 9.5 12 14 12 14C12 14 10.5 9.5 7 8C10.5 6.5 12 2 12 2Z" fill="currentColor" opacity="0.8" />
        <circle cx="12" cy="8" r="1.5" fill="#455E3F" />
      </svg>
    </div>
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
    videoLink?: string;
    videoLinkLabel?: string;
  }>({
    isOpen: false,
    title: '',
    category: '',
    description: '',
    images: [],
    link: undefined,
    linkLabel: undefined,
    videoLink: undefined,
    videoLinkLabel: undefined,
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

  // Active filter/tab in Selected Works Dossier
  const [activeDossierTab, setActiveDossierTab] = useState<string>('all');

  // Active account in Content Creator Showcase
  const [activeCreatorAccount, setActiveCreatorAccount] = useState<'personal' | 'yarnup' | 'manikarumi' | 'duasisi'>('personal');

  // Active filter for Trophy Case Mosaic Exhibition
  const [awardFilter, setAwardFilter] = useState<'all' | '1st' | '2nd' | 'top5' | 'speaker'>('all');

  // Working Experience layout view mode: 'compact' (2-per-row in 1 view) or 'collage' (multi-photo collage feed)
  const [experienceViewMode, setExperienceViewMode] = useState<'compact' | 'collage'>('compact');

  // Active category filter for Skills Matrix
  const [activeSkillCategory, setActiveSkillCategory] = useState<string>('all');

  // Current slide index in infinite circular carousel (starts at 10 = index 0 Google Student Ambassador)
  const [currentSlideIndex, setCurrentSlideIndex] = useState(10);
  // Organization roles synced with Admin Studio
  const organizationList = (portfolioData.organizations && portfolioData.organizations.length > 0)
    ? portfolioData.organizations
    : (DEFAULT_PORTFOLIO_DATA.organizations || []);

  // Active photo index for each organization card
  const [orgPhotoIndex, setOrgPhotoIndex] = useState<{ [key: number]: number }>({ 0: 0, 1: 0, 2: 0, 3: 0, 4: 0 });

  // Active photo index for each experience card (interactive in-card gallery preview)
  const [expPhotoIndex, setExpPhotoIndex] = useState<{ [key: string]: number }>({});

  // Auto-slide documentation photos every 3 seconds without manual clicks
  useEffect(() => {
    if (organizationList.length === 0) return;
    const photoTimer = setInterval(() => {
      setOrgPhotoIndex(prev => {
        const nextState = { ...prev };
        organizationList.forEach((org, idx) => {
          const totalPhotos = org.images?.length || 1;
          nextState[idx] = ((prev[idx] || 0) + 1) % totalPhotos;
        });
        return nextState;
      });
    }, 3000);

    return () => clearInterval(photoTimer);
  }, [organizationList]);

  // Active photo index inside Landscape Modal Dialog
  const [activeModalPhoto, setActiveModalPhoto] = useState(0);

  // Modal open helper
  const openModal = (
    title: string, 
    category: string, 
    description: string, 
    images: string[],
    link?: string,
    linkLabel?: string,
    videoLink?: string,
    videoLinkLabel?: string
  ) => {
    setActiveModalPhoto(0);
    setModalData({
      isOpen: true,
      title,
      category,
      description,
      images: images && images.length > 0 ? images : ['/11.png'],
      link,
      linkLabel,
      videoLink,
      videoLinkLabel,
    });
  };

  
  // Keyboard accessibility: Close modal on Escape, Navigate photos with Arrow keys
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!modalData.isOpen) return;
      if (e.key === 'Escape') {
        closeModal();
      } else if (modalData.images.length > 1) {
        if (e.key === 'ArrowLeft') {
          setActiveModalPhoto((prev) => (prev > 0 ? prev - 1 : modalData.images.length - 1));
        } else if (e.key === 'ArrowRight') {
          setActiveModalPhoto((prev) => (prev < modalData.images.length - 1 ? prev + 1 : 0));
        }
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [modalData.isOpen, modalData.images.length]);

  const closeModal = () => {
    setModalData(prev => ({ ...prev, isOpen: false }));
  };

  // Case Studies Dossier Data (Authentic & Grounded)
  const defaultDossierProjects = [
    {
      id: 'operations',
      category: 'Business & Operations',
      title: 'Dua Sisi Laundry — Operasional & Sistem Kas',
      tag: 'Operations & SOP',
      period: '2023 - 2024',
      badgeColor: 'bg-rose-blush/90 text-rose-dark border-rose-dusty/40',
      summary: 'Penyusunan alur kerja operasional cuci-setrika, pendataan kas harian, dan koordinasi layanan laundry lokal.',
      challenge: 'Perlunya alur kerja cuci-setrika yang konsisten dan pencatatan kas harian yang rapi.',
      strategy: 'Merumuskan alur pengerjaan terstandarisasi dan pencatatan pembukuan harian.',
      results: [
        'SOP pengerjaan cuci & setrika rapi',
        'Pencatatan kas harian teratur',
        'Pengelolaan komplain & kepuasan pelanggan',
      ],
      image: '/3.png',
      extraImages: ['/3.png', '/4.png', '/1.png'],
      link: 'https://instagram.com/duasisi.laundry',
      linkLabel: 'Profil Bisnis Dua Sisi ↗',
    },
    {
      id: 'growth',
      category: 'Brand & Social Media',
      title: 'YarnUp! Studio — Brand Aksesoris Rajut',
      tag: 'Handmade & Content',
      period: '2023 - Sekarang',
      badgeColor: 'bg-rose-blush/90 text-rose-dark border-rose-dusty/40',
      summary: 'Mengembangkan brand aksesoris rajut handmade, pembuatan katalog foto dan video konten pendek di Instagram.',
      challenge: 'Membangun awareness produk rajut handmade lokal di media sosial.',
      strategy: 'Membuat konten video proses pembuatan rajut dan foto katalog produk estetik.',
      results: [
        'Desain katalog & konten produk',
        'Pembuatan video proses rajut kreatif',
        'Sponsorship merchandise acara kampus',
      ],
      image: '/5.png',
      extraImages: ['/5.png', '/6.png', '/2.png'],
      link: 'https://instagram.com/yarnup.official',
      linkLabel: 'Official Store Instagram ↗',
    },
    {
      id: 'partnership',
      category: 'Public Relations & Event',
      title: 'Manikarumi Indonesia — PR & Event Partner',
      tag: 'Public Relations',
      period: '2023 - 2024',
      badgeColor: 'bg-rose-blush/90 text-rose-dark border-rose-dusty/40',
      summary: 'Membina kemitraan dengan event organizer di Malang & Jakarta untuk pengadaan stan display bazar dan promosi offline.',
      challenge: 'Memperluas jangkauan stan offline melalui kolaborasi dengan berbagai penyelenggara acara.',
      strategy: 'Menjalin komunikasi aktif dengan event organizer serta menata display stan produk yang menarik.',
      results: [
        'Koordinasi 20+ event bazar',
        'Pengaturan display booth produk',
        'Dukungan konten promosi TikTok & IG',
      ],
      image: '/7.png',
      extraImages: ['/7.png', '/8.png', '/12.png'],
      link: 'https://instagram.com/manikarumi.id',
      linkLabel: 'Galeri Booth Manikarumi ↗',
    },
    {
      id: 'data',
      category: 'Software Engineer Intern',
      title: 'PT Digivla Indonesia — Software Engineer Intern',
      tag: 'Python & Tech Support',
      period: '2023',
      badgeColor: 'bg-rose-blush/90 text-rose-dark border-rose-dusty/40',
      summary: 'Magang sebagai software engineer, membantu otomasi pengumpulan berita koran cetak dan pengujian sistem media intelligence.',
      challenge: 'Membantu otomasi pemantauan berita dari koran cetak ke format digital.',
      strategy: 'Membantu pengembangan skrip Python untuk deteksi berita dan verifikasi akurasi data.',
      results: [
        'Pengembangan skrip Python pendeteksi berita',
        'Pengecekan kualitas data berita koran',
        'Dokumentasi dan pengujian sistem internal',
      ],
      image: '/9.png',
      extraImages: ['/9.png', '/10.png', '/14.png'],
      link: 'https://digivla.id',
      linkLabel: 'Portal Digivla Intelligence ↗',
    },
    {
      id: 'surveyku',
      category: 'Web Application & Systems',
      title: 'Website SurveyKu — Academic Survey Platform',
      tag: 'UI/UX & Web Systems',
      period: '2023 - 2024',
      badgeColor: 'bg-rose-blush/90 text-rose-dark border-rose-dusty/40',
      summary: 'Merancang arsitektur antarmuka UI/UX dan basis data relasional untuk sistem pengumpulan kuesioner dan evaluasi kepuasan mahasiswa secara daring.',
      challenge: 'Mempermudah distribusi kuesioner dan visualisasi data hasil survei responden secara realtime.',
      strategy: 'Perancangan prototipe Figma berorientasi user-centric dan pemodelan relasional database terstruktur.',
      results: [
        'UI/UX Prototyping Figma',
        'Relational Database Schema',
        'Realtime Analytics & Feedback',
      ],
      image: '/15.png',
      extraImages: ['/15.png', '/16.png', '/13.png'],
      link: 'https://polinema.ac.id',
      linkLabel: 'Detail Riset SurveyKu ↗',
    },
    {
      id: 'campaign',
      category: 'Digital Marketing & Content Strategy',
      title: 'Creative Content Strategy & Social Campaigns',
      tag: 'Social Media Strategy',
      period: '2023 - Sekarang',
      badgeColor: 'bg-rose-blush/90 text-rose-dark border-rose-dusty/40',
      summary: 'Perencanaan kalender konten media sosial, produksi video pendek berdaya jangkau tinggi, serta eksekusi kampanye promosi digital terukur.',
      challenge: 'Meningkatkan retensi penonton dan interaksi organik di tengah algoritma media sosial yang dinamis.',
      strategy: 'Storytelling berdurasi singkat yang informatif dengan visual hooks kuat pada 3 detik pertama.',
      results: [
        'Editorial Content Calendar',
        'Short-Form Video Production',
        'Organic Reach & Engagement Surge',
      ],
      image: '/17.png',
      extraImages: ['/17.png', '/1.png', '/2.png'],
      link: 'https://instagram.com/chikalnazmi',
      linkLabel: 'Lihat Portfolio Konten ↗',
    },
  ];

  // Work & Business Experiences (4 items: Dua Sisi Laundry, YarnUp!, Manikarumi, Digivla)
  const experiencesList = (portfolioData.experiences && portfolioData.experiences.length > 0)
    ? portfolioData.experiences
    : (DEFAULT_PORTFOLIO_DATA.experiences || []);

  // Campus Projects (6 items: SurveyKu, Python Automation, JTI Certify, Sales Dashboard, BMC, Campaign)
  const projectsList = (portfolioData.projects && portfolioData.projects.length > 0)
    ? portfolioData.projects
    : (DEFAULT_PORTFOLIO_DATA.projects || defaultDossierProjects);

  const dossierProjects = projectsList;
  const filteredDossier = activeDossierTab === 'all' 
    ? projectsList 
    : projectsList.filter(p => p.id === activeDossierTab);

  // 7 Trophy Case Awards Data (synced with admin / store)
  const awardsList: AwardItem[] = (portfolioData.awards && portfolioData.awards.length > 0)
    ? portfolioData.awards
    : DEFAULT_PORTFOLIO_DATA.awards;

  // Dynamic filter for Trophy Case Mosaic
  const filteredAwards = awardsList.filter(award => {
    if (awardFilter === 'all') return true;
    if (awardFilter === '1st') return award.rank.includes('1st');
    if (awardFilter === '2nd') return award.rank.includes('2nd');
    if (awardFilter === 'top5') return award.rank.includes('Top 5');
    if (awardFilter === 'speaker') return award.rank.includes('Speaker');
    return true;
  });


  // Academic & Formal Degree Data (synced with admin / store)
  const academicData = portfolioData.academic || DEFAULT_PORTFOLIO_DATA.academic!;

  // Academic & Certified Professional Courses Data (synced with admin / store)
  const certificationList = (portfolioData.certifications && portfolioData.certifications.length > 0)
    ? portfolioData.certifications
    : (DEFAULT_PORTFOLIO_DATA.certifications || []);

  // Content Creator Multi-Account Data (Instagram & TikTok)
  const creatorAccounts = portfolioData.creatorAccounts || {
    personal: {
      name: 'Personal Account',
      handle: '@chikalnazmi',
      tag: 'Lifestyle, Career & Visual Stories',
      platforms: 'Instagram Reels & TikTok',
      stats: '10K+ Monthly Reach • High Engagement',
      hasCenterStage: true,
      centerLink: 'https://www.youtube.com/@chikalnazmi',
      centerImg: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=900&fit=crop',
      centerTitle: 'Visual Journal & Creative Storytelling',
      centerDesc: 'Mengeksplorasi pembuatan konten video pendek berirama sinematik, lifestyle reels, dan storytelling seputar karir dan pengembangan diri.',
      leftPhoneImg: 'https://images.unsplash.com/photo-1611162617474-5b21e879e113?w=500',
      leftPhoneTitle: 'Reels & Aesthetics',
      leftPhoneTag: 'Instagram',
      leftPhoneLink: 'https://instagram.com/chikalnazmi',
      rightPhoneImg: 'https://images.unsplash.com/photo-1611162616475-46b635cb6868?w=500',
      rightPhoneTitle: 'Short-Form Video',
      rightPhoneTag: 'TikTok',
      rightPhoneLink: 'https://www.tiktok.com/@chikalnazmi',
      link: 'https://instagram.com/chikalnazmi',
    },
    yarnup: {
      name: 'YarnUp! Studio',
      handle: '@yarnup.official',
      tag: 'Handcrafted Accessories & E-Commerce',
      platforms: 'Instagram & TikTok Shop',
      stats: '+2.089% Reach Surge • 20.02% Engagement',
      hasCenterStage: true,
      centerLink: 'https://instagram.com/yarnup.official',
      centerImg: 'https://images.unsplash.com/photo-1605289982774-9a6fef564df8?q=80&w=900&fit=crop',
      centerTitle: 'Handcrafted Accessories Catalog',
      centerDesc: 'Mengarahkan photoshoot katalog produk rajut, video proses manual (behind-the-scenes), dan audio trending untuk mendorong konversi penjualan.',
      leftPhoneImg: 'https://images.unsplash.com/photo-1584992236310-6edddc08acff?w=500',
      leftPhoneTitle: 'Behind The Craft',
      leftPhoneTag: 'Instagram',
      leftPhoneLink: 'https://instagram.com/yarnup.official',
      rightPhoneImg: 'https://images.unsplash.com/photo-1605289982774-9a6fef564df8?w=500',
      rightPhoneTitle: 'Crochet Patterns',
      rightPhoneTag: 'TikTok',
      rightPhoneLink: 'https://www.tiktok.com/@yarnup.official',
      link: 'https://instagram.com/yarnup.official',
    },
    manikarumi: {
      name: 'Manikarumi Indonesia',
      handle: '@manikarumi.id',
      tag: 'Visual Merchandising & Event PR',
      platforms: 'Instagram & Event Vlogs',
      stats: '20+ Festival Displays • 40% Foot-Traffic Surge',
      hasCenterStage: true,
      centerLink: 'https://instagram.com/manikarumi.id',
      centerImg: 'https://images.unsplash.com/photo-1556761175-5973dc0f32b7?q=80&w=900&fit=crop',
      centerTitle: 'Festival Exhibition & Retail Display',
      centerDesc: 'Menata tata letak booth offline di berbagai festival Malang dan Jakarta, lalu mengabadikannya dalam konten video interaktif untuk media sosial.',
      leftPhoneImg: 'https://images.unsplash.com/photo-1560343090-f0409e92791a?w=500',
      leftPhoneTitle: 'Booth Atmosphere',
      leftPhoneTag: 'Instagram',
      leftPhoneLink: 'https://instagram.com/manikarumi.id',
      rightPhoneImg: 'https://images.unsplash.com/photo-1511578314322-379afb476865?w=500',
      rightPhoneTitle: 'Festival Highlights',
      rightPhoneTag: 'TikTok',
      rightPhoneLink: 'https://www.tiktok.com/@manikarumi.id',
      link: 'https://instagram.com/manikarumi.id',
    },
    duasisi: {
      name: 'Dua Sisi Laundry',
      handle: '@duasisi.laundry',
      tag: 'Digital Marketing & Business Ops',
      platforms: 'Instagram & Customer Education',
      stats: '35% Efficiency Gain • Zero Garment Loss',
      // Dua Sisi Laundry: belum ada video landscape, sehingga diatur hasCenterStage: false
      // Tampilan otomatis adaptif hanya merender 2 phone mockups!
      hasCenterStage: false,
      centerLink: undefined,
      centerImg: '/3.png',
      centerTitle: 'Standardized Laundry Operations',
      centerDesc: 'Memproduksi konten edukasi perawatan pakaian, higienitas proses cuci-setrika uap, dan kampanye promosi digital untuk menjangkau pelanggan lokal.',
      leftPhoneImg: '/4.png',
      leftPhoneTitle: 'Process Transparency',
      leftPhoneTag: 'Instagram',
      leftPhoneLink: 'https://instagram.com/duasisi.laundry',
      rightPhoneImg: 'https://images.unsplash.com/photo-1517677208171-0bc6725a3e60?w=500',
      rightPhoneTitle: 'Garment Care Tips',
      rightPhoneTag: 'TikTok',
      rightPhoneLink: 'https://www.tiktok.com/@duasisi.laundry',
      link: 'https://instagram.com/duasisi.laundry',
    },
  };

  const currentCreator = creatorAccounts[activeCreatorAccount];

  // 4 Beyond The Screen Hobbies & Intellectual Pursuits
  const hobbiesList = [
    {
      title: 'Travelling',
      sub: 'Melihat dunia untuk perspektif baru',
      tag: 'World Exploration',
      icon: '',
      img: 'https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?q=80&w=600&fit=crop',
      desc: 'Menjelajahi beragam kota dan keindahan alam untuk menyerap inspirasi budaya, arsitektur lokal, serta memperluas sudut pandang dalam memecahkan masalah.',
    },
    {
      title: 'Knitting & Crochet',
      sub: 'Eksplorasi kreativitas karya handmade',
      tag: 'Artisanal Craft',
      icon: '',
      img: 'https://images.unsplash.com/photo-1605289982774-9a6fef564df8?q=80&w=600&fit=crop',
      desc: 'Mengekspresikan ketelitian melalui rajutan benang manual tangan, eksplorasi pola baru, dan merancang karya aksesoris bernilai artistik tinggi.',
    },
    {
      title: 'Writing (Medium)',
      sub: 'Berbagi pemikiran dan strategi bisnis',
      tag: 'Strategic Essays',
      icon: '',
      img: 'https://images.unsplash.com/photo-1455390582262-044cdead2708?q=80&w=600&fit=crop',
      desc: 'Menuangkan pemikiran analitis seputar dinamika bisnis, kepemimpinan tim, dan strategi operasional ke dalam esai terstruktur di platform Medium.',
      link: 'https://medium.com',
    },
    {
      title: 'Reading & Learning',
      sub: 'Eksplorasi literatur & self-development',
      tag: 'Continuous Growth',
      icon: '',
      img: 'https://images.unsplash.com/photo-1512820790803-83ca734da794?q=80&w=600&fit=crop',
      desc: 'Membaca buku-buku strategi bisnis, psikologi konsumen, biografi pemimpin dunia, dan pengembangan diri untuk terus mengasah ketajaman wawasan.',
    },
  ];

  // Skills Data (Dynamic from store / admin without arbitrary slicing)
  const skillsData = (portfolioData.skills && portfolioData.skills.length > 0)
    ? portfolioData.skills
    : (DEFAULT_PORTFOLIO_DATA.skills || []);

  const itSkills = skillsData.find(s => s.id === 'tech')?.skills || [
    'html/css fundamental',
    'UI/UX Research',
    'Figma Prototyping',
    'Design System',
    'Usability Testing',
  ];
  const bizSkills = skillsData.find(s => s.id === 'business')?.skills || [
    'Business Model Canvas',
    'Standard Operating Procedure (SOP)',
    'Market Research',
    'Financial Feasibility',
    'Inventory & Cash Reconciliation',
  ];
  const creativeSkills = skillsData.find(s => s.id === 'creative')?.skills || [
    'Branding',
    'CapCut & Video Editing',
    'Content Storytelling',
    'Social Media Strategy',
    'Visual Layout Design',
  ];
  const personalSkills = skillsData.find(s => s.id === 'soft')?.skills || [
    'Creative & Collaborative',
    'Proactive Problem Solving',
    'Strategic Communication',
    'Responsibility & High Ownership',
  ];

  return (
    <div className="min-h-screen font-sans antialiased selection:bg-rose-blush selection:text-rose-dark relative transition-colors duration-700 bg-sage-linen text-[#212B1E]">
      {/* Paper & Linen Tactile Texture Overlay (Subtle Organic Grain) */}
      <div className="paper-texture-overlay" />

      {/* ========================================================================= */}
      {/* NAVBAR: Modern Floating Editorial Pill */}
      {/* ========================================================================= */}
      <nav className="sticky top-2 sm:top-2.5 z-40 max-w-[1380px] mx-auto px-4 sm:px-6 lg:px-8 isolate">
        <div className="bg-white/95 backdrop-blur-md border border-[#CAD7C5]/90 rounded-full px-4 sm:px-5 py-1.5 sm:py-2 shadow-xs flex items-center justify-between transition-all hover:border-rose-dusty/40">
          <a href="#hero" className="flex flex-col group py-0.5">
            <span className="font-serif font-bold text-xs sm:text-sm tracking-normal text-forest group-hover:text-rose-dark transition-colors leading-tight">
              Chikal Nazmi Mahira
            </span>
            <span className="text-[9px] font-mono font-medium tracking-wider uppercase text-forest/60">
              Business &amp; Marketing
            </span>
          </a>

          {/* Desktop Nav Links */}
          <div className="hidden md:flex items-center gap-3.5 lg:gap-5 text-[11px] font-medium tracking-wide uppercase text-forest/75">
            <a href="#academy-skills" className="hover:text-rose-dark transition-colors">
              Academy &amp; Skills
            </a>
            <a href="#experience" className="hover:text-rose-dark transition-colors">
              Experience
            </a>
            <a href="#projects" className="hover:text-rose-dark transition-colors">
              Projects
            </a>
            <a href="#recognition" className="hover:text-rose-dark transition-colors">
              Awards (7)
            </a>
            <a href="#leadership" className="hover:text-rose-dark transition-colors">
              Leadership
            </a>
            <a href="#certifications" className="hover:text-rose-dark transition-colors">
              Certifications
            </a>
            <a href="#creative" className="hover:text-rose-dark transition-colors">
              Creative &amp; Content
            </a>
            <a href="#hobbies" className="hover:text-rose-dark transition-colors">
              Hobbies
            </a>
          </div>

          {/* Action CTA */}
          <div className="hidden sm:flex items-center gap-2.5">
            <a
              href="https://wa.me/6281234567890?text=Halo%20Chikal,%20saya%20tertarik%20berdiskusi%20mengenai%20peluang%20kerjasama."
              target="_blank"
              rel="noopener noreferrer"
              className="px-3.5 py-1 rounded-full text-[11px] font-semibold bg-rose-dark text-white hover:bg-rose-berry transition-colors shadow-2xs"
            >
              Let&apos;s Connect ↗
            </a>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-1.5 text-forest hover:text-rose-dark"
            aria-label="Toggle Menu"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              {mobileMenuOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>

        {/* Mobile Dropdown */}
        {mobileMenuOpen && (
          <div className="md:hidden mt-2 bg-white/95 backdrop-blur-md border border-[#CAD7C5] rounded-2xl p-3 sm:p-4 shadow-lg flex flex-col gap-1 text-sm font-medium text-forest max-h-[75vh] overflow-y-auto">
            <a href="#academy-skills" onClick={() => setMobileMenuOpen(false)} className="px-3 py-2 rounded-xl hover:bg-[#F4F7F2] hover:text-rose-dark transition-colors">
              Academy &amp; Skills
            </a>
            <a href="#experience" onClick={() => setMobileMenuOpen(false)} className="px-3 py-2 rounded-xl hover:bg-[#F4F7F2] hover:text-rose-dark transition-colors">
              Experience
            </a>
            <a href="#projects" onClick={() => setMobileMenuOpen(false)} className="px-3 py-2 rounded-xl hover:bg-[#F4F7F2] hover:text-rose-dark transition-colors">
              Projects
            </a>
            <a href="#recognition" onClick={() => setMobileMenuOpen(false)} className="px-3 py-2 rounded-xl hover:bg-[#F4F7F2] hover:text-rose-dark transition-colors">
              Awards (7)
            </a>
            <a href="#leadership" onClick={() => setMobileMenuOpen(false)} className="px-3 py-2 rounded-xl hover:bg-[#F4F7F2] hover:text-rose-dark transition-colors">
              Leadership
            </a>
            <a href="#certifications" onClick={() => setMobileMenuOpen(false)} className="px-3 py-2 rounded-xl hover:bg-[#F4F7F2] hover:text-rose-dark transition-colors">
              Certifications
            </a>
            <a href="#creative" onClick={() => setMobileMenuOpen(false)} className="px-3 py-2 rounded-xl hover:bg-[#F4F7F2] hover:text-rose-dark transition-colors">
              Creative &amp; Content
            </a>
            <a href="#hobbies" onClick={() => setMobileMenuOpen(false)} className="px-3 py-2 rounded-xl hover:bg-[#F4F7F2] hover:text-rose-dark transition-colors">
              Hobbies
            </a>
            <a
              href="https://wa.me/6281234567890"
              target="_blank"
              rel="noopener noreferrer"
              className="mt-2 text-center py-2.5 rounded-xl bg-rose-dark text-white text-xs font-semibold shadow-xs"
            >
              Hubungi via WhatsApp ↗
            </a>
          </div>
        )}
      </nav>

      {/* ========================================================================= */}
      {/* HERO SECTION: Asymmetric Editorial Split (No Hilman Blueprint) */}
      {/* ========================================================================= */}
      <section id="hero" className="hero-stage-wrapper w-full min-h-[calc(100vh-4.25rem)] flex flex-col justify-between scroll-mt-18">
        
        {/* Main Centered Stage Container */}
        <div className="flex-1 flex flex-col justify-center items-center max-w-[1380px] mx-auto w-full px-4 sm:px-6 lg:px-8 pt-3 pb-2 sm:pt-5 sm:pb-3 relative z-10">
          
          {/* Centered Main Headline (Urbanist + Instrument Serif Italic) */}
          <div className="text-center max-w-4xl mx-auto mb-2 sm:mb-3 relative z-10">
            <h1 className="hero-headline">
              <span className="block font-sans font-medium text-3xl sm:text-5xl lg:text-[72px] text-forest tracking-[-0.035em] leading-[0.98]">
                Hi I&apos;m Chikal
              </span>
              <span className="editorial-serif-italic block text-[1.12em] text-3xl sm:text-5xl lg:text-[72px] text-forest tracking-[-0.02em] font-normal leading-[1.02] mt-[-0.1rem]">
                {portfolioData.hero?.headline && portfolioData.hero.headline !== 'Menghubungkan Strategi Bisnis, Operasional, & Kreativitas Digital.'
                  ? portfolioData.hero.headline
                  : 'Business & Marketing'}
              </span>
            </h1>
          </div>

          {/* Central Hero Stage (Cutout Portrait Centered, Flanked Left & Right) */}
          <div className="hero-stage-container">
            
            {/* Radiant Lime Studio Glow Aura (Completely smooth Gaussian falloff matching reference) */}
            <div className="hero-radiant-sage-aura" />

            {/* Left Flank: Available Status at Mid-Height + Social Proof at Bottom */}
            <div className="hero-flank-left">
              {/* Status Badge */}
              <div className="hero-badge-available inline-flex items-center gap-2.5 px-4 py-2 rounded-full bg-white/95 border border-[#CAD7C5] shadow-xs text-xs sm:text-sm font-medium text-forest w-fit mt-8 lg:mt-12 backdrop-blur-md">
                <span className="relative flex h-2.5 w-2.5">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-500 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-600"></span>
                </span>
                <span>{portfolioData.hero?.subheadline || 'Available for now opportunities'}</span>
              </div>

              {/* Bottom: 3 Credential Cards */}
              <div className="hero-trusted-proof grid grid-cols-3 gap-2 w-full max-w-[320px]">
                {/* Card 1: IPK 3.73 */}
                <div className="bg-white/95 backdrop-blur-md border border-[#CAD7C5] rounded-xl p-2.5 shadow-2xs text-left hover:border-forest/40 transition-all">
                  <span className="block text-[9px] font-mono font-bold uppercase tracking-wider text-forest/60">IPK</span>
                  <span className="block text-base sm:text-lg font-mono font-extrabold text-forest leading-tight">3.73</span>
                  <span className="block text-[9px] font-medium text-rose-dark leading-tight mt-0.5">Cum Laude</span>
                </div>

                {/* Card 2: TOEIC 775 */}
                <div className="bg-white/95 backdrop-blur-md border border-[#CAD7C5] rounded-xl p-2.5 shadow-2xs text-left hover:border-forest/40 transition-all">
                  <span className="block text-[9px] font-mono font-bold uppercase tracking-wider text-forest/60">TOEIC</span>
                  <span className="block text-base sm:text-lg font-mono font-extrabold text-rose-dark leading-tight">775</span>
                  <span className="block text-[9px] font-medium text-forest/70 leading-tight mt-0.5">Skor Resmi</span>
                </div>

                {/* Card 3: 7x Juara Nasional */}
                <div className="bg-white/95 backdrop-blur-md border border-[#CAD7C5] rounded-xl p-2.5 shadow-2xs text-left hover:border-forest/40 transition-all">
                  <span className="block text-[9px] font-mono font-bold uppercase tracking-wider text-forest/60">Lomba</span>
                  <span className="block text-base sm:text-lg font-mono font-extrabold text-[#4E6B47] leading-tight">7x</span>
                  <span className="block text-[9px] font-medium text-forest/70 leading-tight mt-0.5">Juara Nas.</span>
                </div>
              </div>
            </div>

            {/* Center: Cutout Character Portrait with Organic Floral Backdrop */}
            <div className="hero-portrait-wrap">
              {/* Floral Backdrop Elements */}
              {(portfolioData.hero?.heroFloralStyle !== 'none') && (
                <div
                  className="hero-floral-backdrop"
                  style={{ opacity: portfolioData.hero?.heroFloralOpacity ?? 1.0 }}
                >
                  {(portfolioData.hero?.heroFloralStyle ?? 'arch') === 'arch' && (
                    <img
                      src="/floral_arch.webp"
                      alt="Rustic Floral Arch"
                      className="hero-floral-arch"
                    />
                  )}
                  {portfolioData.hero?.heroFloralStyle === 'oval-frame' && (
                    <img
                      src="/floral_oval.webp"
                      alt="Vintage Rose Frame"
                      className="hero-floral-oval"
                    />
                  )}
                  {portfolioData.hero?.heroFloralStyle === 'bouquet' && (
                    <div className="hero-floral-bouquet-wrap">
                      <img
                        src="/floral_bouquet.webp"
                        alt="Blooming Floral Bouquet"
                        className="hero-floral-bouquet"
                      />
                      <img
                        src="/floral_vine.webp"
                        alt="Botanical Vine Accent"
                        className="hero-floral-vine"
                      />
                    </div>
                  )}
                  {(portfolioData.hero?.heroShowButterflies ?? true) && (
                    <img
                      src="/floral_butterflies.webp"
                      alt="Floating Butterflies"
                      className="hero-floral-butterflies"
                    />
                  )}
                </div>
              )}

              {/* Main Cutout Character Portrait with Smooth Bottom Mask Gradient */}
              <img
                src={portfolioData.hero?.avatarImg || '/chikal_hero_cutout.webp'}
                alt="Chikal Nazmi Mahira"
                className="hero-portrait-img"
                style={{
                  transform: `scale(${portfolioData.hero?.avatarScale ?? 0.96}) translateY(${portfolioData.hero?.avatarOffsetY ?? 8}px) translateX(${portfolioData.hero?.avatarOffsetX ?? 0}px)`,
                  transformOrigin: 'bottom center',
                  mixBlendMode: portfolioData.hero?.avatarBlendMode === 'multiply' ? 'multiply' : 'normal',
                }}
              />
            </div>

            {/* Right Flank: Value Statement at Mid-Height + Get in Touch CTA at Bottom */}
            <div className="hero-flank-right">
              {/* Statement */}
              <p className="hero-statement-right text-xs sm:text-sm text-forest/85 leading-relaxed font-normal max-w-[280px] mt-8 lg:mt-12 font-source text-left sm:text-left">
                {portfolioData.hero?.bio || 'passionate about creating intuitive digital experiences that connect users with value.'}
              </p>

              {/* Get in Touch CTA Button */}
              <a
                href={portfolioData.socials?.whatsapp || "https://wa.me/6281234567890?text=Halo%20Chikal,%20saya%20tertarik%20berdiskusi%20mengenai%20peluang%20kerjasama."}
                target="_blank"
                rel="noopener noreferrer"
                className="hero-cta-btn inline-flex items-center gap-2.5 px-6 py-2.5 rounded-full bg-forest hover:bg-rose-dark text-[#E8EFE5] text-xs sm:text-sm font-semibold shadow-md hover:shadow-lg transition-all"
              >
                <span>→</span>
                <span>Get in Touch</span>
              </a>
            </div>

          </div>

        </div>

        {/* BRAND & ECOSYSTEM TICKER: Anchored at bottom of Hero viewport */}
        <div className="w-full py-2 sm:py-2.5 border-y border-[#CAD7C5]/50 bg-white/45 backdrop-blur-xs overflow-hidden select-none relative z-10">
          <div className="relative w-full overflow-hidden [mask-image:_linear-gradient(to_right,transparent_0,_black_64px,_black_calc(100%-64px),transparent_100%)]">
            <div className="animate-marquee flex items-center gap-10 sm:gap-14 whitespace-nowrap py-0.5">
              {[
                "Politeknik Negeri Malang",
                "GDSC Google Polinema",
                "Dua Sisi Laundry",
                "YarnUp! Studio",
                "Manikarumi Indonesia",
                "PT Digivla Indonesia",
                "Universitas Islam Malang",
                "Universitas Negeri Padang",
                "RevoU Digital Marketing",
              ].concat([
                "Politeknik Negeri Malang",
                "GDSC Google Polinema",
                "Dua Sisi Laundry",
                "YarnUp! Studio",
                "Manikarumi Indonesia",
                "PT Digivla Indonesia",
                "Universitas Islam Malang",
                "Universitas Negeri Padang",
                "RevoU Digital Marketing",
              ]).map((partner, pIdx) => (
                <div key={pIdx} className="flex items-center gap-2.5 text-xs sm:text-sm font-semibold tracking-wide text-forest/75 hover:text-forest transition-colors shrink-0">
                  <span className="text-rose-dusty text-xs">✦</span>
                  <span>{partner}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

      </section>

      {/* ========================================================================= */}
      {/* SECTION: ACADEMIC BACKGROUND & SPOTLIGHT SKILLS CARD (Paired Side-by-Side) */}
      {/* ========================================================================= */}
      <section id="academy-skills" className="max-w-[1380px] mx-auto px-4 sm:px-6 lg:px-8 py-7 sm:py-8 lg:py-10 border-t border-[#CAD7C5]/60 scroll-mt-18">
        
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-5 sm:mb-6">
          <span className="font-mono text-xs sm:text-sm text-forest/60 tracking-widest uppercase block mb-1">
            ( 01 ) Foundations &amp; Capabilities
          </span>
          <h2 className="text-2xl sm:text-3xl lg:text-4xl text-forest tracking-tight mb-1.5">
            <span className="font-sans font-semibold">Academic Background &amp; </span>
            <span className="editorial-serif-italic">Core Capabilities</span>
          </h2>
          <p className="text-xs sm:text-sm text-forest/75 leading-relaxed font-source">
            Kombinasi latar belakang pendidikan formal sistem informasi bisnis dan keahlian praktis lintas disiplin yang teruji.
          </p>
        </div>

        {/* Modern Bento Grid: Asymmetric, Dynamic & Highly Readable */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-4 lg:gap-5">
          
          {/* BENTO CARD 1: Formal Degree & Official Certifications (Col Span 5) */}
          <div className="md:col-span-12 lg:col-span-5 bg-white/95 border border-[#CAD7C5] rounded-3xl p-5 sm:p-6 shadow-xs hover:shadow-md transition-all flex flex-col justify-between group">
            <div>
              {/* Header Badges */}
              <div className="flex items-center justify-between gap-2 mb-3">
                <span className="text-[10px] font-bold px-3 py-1 rounded-full bg-rose-blush/90 text-rose-dark border border-rose-dusty/40 uppercase tracking-wider shadow-2xs">
                  {academicData.badge?.replace('', '').trim() || 'FORMAL DEGREE'}
                </span>
                <span className="text-[11px] font-mono font-bold px-3 py-1 rounded-full bg-[#F4F7F2] text-forest/80 border border-[#CAD7C5]">
                  {academicData.period || '2020 – 2024'}
                </span>
              </div>

              {/* Title & Institution */}
              <h3 className="font-sans font-bold text-xl sm:text-2xl text-forest tracking-tight mb-1 group-hover:text-rose-dark transition-colors">
                {academicData.degree}
              </h3>
              <h4 className="text-xs sm:text-sm font-semibold text-forest/75 uppercase tracking-wide mb-4 font-mono">
                {academicData.institution}
              </h4>

              {/* Verified Credentials (GPA & TOEIC) */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-2.5 mb-4">
                {/* GPA Highlight */}
                <div className="p-3 rounded-2xl bg-[#F4F7F2]/90 border border-[#CAD7C5] shadow-2xs flex items-center justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-forest text-[#E8EFE5] flex flex-col items-center justify-center font-mono font-bold shrink-0 shadow-2xs">
                      <span className="text-[11px] font-bold leading-none">GPA</span>
                      <span className="text-[8px] text-white/70 leading-none mt-0.5">HONOR</span>
                    </div>
                    <div>
                      <span className="text-[9px] font-mono font-bold uppercase tracking-wider text-forest/60 block leading-tight">
                        {academicData.gpaTitle || 'ACADEMIC STANDING'}
                      </span>
                      <span className="text-sm font-sans font-bold text-forest block leading-snug">
                        {academicData.gpaValue || 'IPK : 3.73'}
                      </span>
                      <span className="text-[10px] text-forest/70 leading-tight">
                        Kurikulum Terapan Bisnis &amp; Sistem
                      </span>
                    </div>
                  </div>
                  <span className="px-2 py-0.5 rounded-md bg-forest/10 text-forest text-[10px] font-bold uppercase tracking-wider shrink-0">
                    Cum Laude
                  </span>
                </div>

                {/* TOEIC Highlight */}
                <div className="p-3 rounded-2xl bg-rose-50/60 border border-rose-200/90 shadow-2xs flex items-center justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-rose-dark text-white flex flex-col items-center justify-center font-mono font-bold shrink-0 shadow-2xs">
                      <span className="text-[11px] font-bold leading-none">EN</span>
                      <span className="text-[8px] text-rose-100 leading-none mt-0.5">{academicData.toeicScore || '775'}</span>
                    </div>
                    <div>
                      <span className="text-[9px] font-mono font-bold uppercase tracking-wider text-rose-dark/70 block leading-tight">
                        {academicData.toeicTitle || 'GLOBAL ENGLISH PROFICIENCY'}
                      </span>
                      <span className="text-sm font-sans font-bold text-forest block leading-snug">
                        Official TOEIC: <span className="text-rose-dark font-extrabold">{academicData.toeicScore || '775'}</span>
                      </span>
                      <span className="text-[10px] text-forest/70 leading-tight">
                        {academicData.toeicLevel || 'Working Proficiency'} • ETS
                      </span>
                    </div>
                  </div>
                  <span className="px-2 py-0.5 rounded-md bg-rose-blush text-rose-dark text-[10px] font-bold uppercase tracking-wider shrink-0 border border-rose-dusty/30">
                    Certified
                  </span>
                </div>
              </div>

              {/* Focus Summary */}
              <div className="p-3 rounded-2xl bg-[#F9FBF8] border border-[#CAD7C5]/70 mb-4">
                <span className="text-[9px] font-mono font-bold uppercase tracking-wider text-forest/60 block mb-0.5">
                  Focus &amp; Academic Core
                </span>
                <p className="text-xs text-forest/80 leading-relaxed font-source">
                  {academicData.description}
                </p>
              </div>
            </div>

            {/* Document Modal Trigger Button */}
            <button
              onClick={() => openModal(
                academicData.degree,
                `${academicData.institution} (${academicData.period})`,
                academicData.description,
                academicData.images && academicData.images.length > 0 ? academicData.images : ['/11.png', '/12.png', '/16.png']
              )}
              className="w-full py-2.5 px-4 rounded-xl bg-forest text-[#E8EFE5] hover:bg-rose-dark text-xs sm:text-sm font-bold shadow-2xs hover:shadow-xs transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <span>Buka Dokumen Kelulusan &amp; TOEIC</span>
              <span>↗</span>
            </button>
          </div>

          {/* BENTO CARD 2: Business & Operations Pillar (Col Span 4) */}
          <div className="md:col-span-6 lg:col-span-4 bg-white/95 border border-[#CAD7C5] rounded-3xl p-5 sm:p-6 shadow-xs hover:shadow-md transition-all flex flex-col justify-between group">
            <div>
              {/* Header Badge */}
              <div className="flex items-center justify-between gap-2 mb-3">
                <span className="text-[10px] font-bold px-3 py-1 rounded-full bg-amber-100 text-amber-900 border border-amber-300 uppercase tracking-wider shadow-2xs">
                  STRATEGY &amp; OPERATIONS
                </span>
                <span className="text-[11px] font-mono font-medium text-forest/60">
                  {bizSkills.length} Capabilities
                </span>
              </div>

              <h3 className="font-sans font-bold text-lg sm:text-xl text-forest tracking-tight mb-1">
                Business Systems &amp; SOPs
              </h3>
              <p className="text-xs text-forest/70 mb-4 font-source">
                Penyusunan alur operasional terstandarisasi, rekonsiliasi kas, dan riset peluang pasar.
              </p>

              {/* Curated Skill Cards / Highlights */}
              <div className="space-y-1.5 mb-4">
                {bizSkills.map((skill, sIdx) => (
                  <div
                    key={sIdx}
                    className="flex items-center gap-2 px-3 py-2 rounded-xl bg-[#FAFBF8] border border-[#CAD7C5]/70 text-xs font-semibold text-forest shadow-2xs group-hover:border-forest/30 transition-colors"
                  >
                    <span className="w-1.5 h-1.5 rounded-full bg-amber-600 shrink-0" />
                    <span className="truncate">{skill}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Real World Proven Tag */}
            <div className="pt-3 border-t border-[#CAD7C5]/60 flex items-center justify-between text-xs text-forest/75 font-medium">
              <span>Dua Sisi &amp; Manikarumi</span>
              <span className="text-emerald-700 font-bold flex items-center gap-1">
                <span>✓</span> Verified Applied
              </span>
            </div>
          </div>

          {/* BENTO CARD 3: Creative Media & Brand Growth (Col Span 3) */}
          <div className="md:col-span-6 lg:col-span-3 bg-white/95 border border-[#CAD7C5] rounded-3xl p-5 sm:p-6 shadow-xs hover:shadow-md transition-all flex flex-col justify-between group">
            <div>
              {/* Header Badge */}
              <div className="flex items-center justify-between gap-2 mb-3">
                <span className="text-[10px] font-bold px-3 py-1 rounded-full bg-rose-100 text-rose-900 border border-rose-300 uppercase tracking-wider shadow-2xs">
                  MARKETING &amp; MEDIA
                </span>
                <span className="text-[11px] font-mono font-medium text-forest/60">
                  {creativeSkills.length} Skills
                </span>
              </div>

              <h3 className="font-sans font-bold text-lg sm:text-xl text-forest tracking-tight mb-1">
                Creative &amp; Audience Growth
              </h3>
              <p className="text-xs text-forest/70 mb-4 font-source">
                Strategi video pendek, kurasi visual katalog, dan ekspansi jangkauan organik.
              </p>

              {/* Creative Capabilities Stack */}
              <div className="space-y-1.5 mb-4">
                {creativeSkills.map((skill, sIdx) => (
                  <div
                    key={sIdx}
                    className="flex items-center gap-2 px-3 py-2 rounded-xl bg-[#FAFBF8] border border-[#CAD7C5]/70 text-xs font-semibold text-forest shadow-2xs group-hover:border-rose-dark/30 transition-colors"
                  >
                    <span className="w-1.5 h-1.5 rounded-full bg-rose-dark shrink-0" />
                    <span className="truncate">{skill}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Performance Metric Tag */}
            <div className="pt-3 border-t border-[#CAD7C5]/60 flex items-center justify-between text-xs text-forest/75 font-medium">
              <span>YarnUp! &amp; Event PR</span>
              <span className="text-rose-dark font-bold font-mono">+2.089% Reach</span>
            </div>
          </div>

          {/* BENTO CARD 4A: Technical Software & Systems Stack (Col Span 7) */}
          <div className="md:col-span-12 lg:col-span-7 bg-white/95 border border-[#CAD7C5] rounded-3xl p-5 sm:p-6 shadow-xs hover:shadow-md transition-all flex flex-col justify-between group">
            <div>
              <div className="flex items-center justify-between gap-2 mb-2">
                <span className="text-[10px] font-bold px-3 py-1 rounded-full bg-blue-100 text-blue-900 border border-blue-300 uppercase tracking-wider shadow-2xs">
                  TECH &amp; SYSTEMS STACK
                </span>
                <span className="text-[11px] font-mono text-forest/60">
                  Information Systems Core
                </span>
              </div>

              <h3 className="font-sans font-bold text-lg sm:text-xl text-forest tracking-tight mb-1">
                Digital Systems, UI/UX &amp; Data Tools
              </h3>
              <p className="text-xs text-forest/70 mb-3.5 font-source">
                Fondasi teknologi perancangan antarmuka pengguna, pemodelan data relasional, dan automasi pemrosesan data.
              </p>

              {/* Badges Flow */}
              <div className="flex flex-wrap gap-2 mb-2">
                {itSkills.map((skill, sIdx) => (
                  <span
                    key={sIdx}
                    className="px-3 py-1.5 rounded-xl bg-[#F4F7F2] border border-[#CAD7C5] text-xs font-semibold text-forest shadow-2xs hover:bg-forest hover:text-white hover:border-forest transition-all cursor-default flex items-center gap-1.5"
                  >
                    <span className="text-rose-dusty text-[10px]">✦</span>
                    <span>{skill}</span>
                  </span>
                ))}
              </div>
            </div>

            <div className="pt-3 mt-2 border-t border-[#CAD7C5]/60 flex items-center justify-between text-xs text-forest/70 font-medium font-source">
              <span>Jurusan Teknologi Informasi — Politeknik Negeri Malang</span>
              <span className="font-mono text-forest/50">D4 SIB Certified</span>
            </div>
          </div>

          {/* BENTO CARD 4B: Personal Strengths & Fast Contact (Col Span 5) */}
          <div className="md:col-span-12 lg:col-span-5 bg-white/95 border border-[#CAD7C5] rounded-3xl p-5 sm:p-6 shadow-xs hover:shadow-md transition-all flex flex-col justify-between group">
            <div>
              <div className="flex items-center justify-between gap-2 mb-2">
                <span className="text-[10px] font-bold px-3 py-1 rounded-full bg-purple-100 text-purple-900 border border-purple-300 uppercase tracking-wider shadow-2xs">
                  PROFESSIONAL VALUES
                </span>
                <span className="text-[11px] font-mono text-forest/60">
                  Work Style
                </span>
              </div>

              <h3 className="font-sans font-bold text-lg sm:text-xl text-forest tracking-tight mb-1">
                Collaborative Strengths &amp; Ethics
              </h3>
              <p className="text-xs text-forest/70 mb-3 font-source">
                Karakter kerja adaptif, kepemilikan tanggung jawab tinggi, dan komunikasi proaktif.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5 mb-4">
                {personalSkills.map((skill, pIdx) => (
                  <div
                    key={pIdx}
                    className="flex items-center gap-2 p-2 rounded-xl bg-[#FAFBF8] border border-[#CAD7C5]/70 text-xs font-bold text-forest shadow-2xs"
                  >
                    <span className="w-1.5 h-1.5 rounded-full bg-purple-600 shrink-0" />
                    <span className="truncate">{skill}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* WhatsApp Contact Action */}
            <a
              href={portfolioData.socials?.whatsapp || "https://wa.me/6281234567890"}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full py-2.5 px-4 rounded-xl bg-[#F4F7F2] hover:bg-forest border border-[#CAD7C5] hover:border-forest text-forest hover:text-white text-xs sm:text-sm font-bold shadow-2xs hover:shadow-xs transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <span>Diskusi Peluang Karir via WhatsApp</span>
              <span>↗</span>
            </a>
          </div>

        </div>

      </section>

      {/* ========================================================================= */}
      {/* SECTION: WORK & BUSINESS EXPERIENCE (Pengalaman Kerja Otentik)            */}
      {/* ========================================================================= */}
      <section id="experience" className="max-w-[1380px] mx-auto px-4 sm:px-6 lg:px-8 py-7 sm:py-8 lg:py-10 border-t border-[#CAD7C5]/60 scroll-mt-18">
        
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-3.5 sm:mb-4.5">
          <span className="font-mono text-xs sm:text-sm text-forest/60 tracking-widest uppercase block mb-1">
            ( 02 ) Career &amp; Experience
          </span>
          <h2 className="text-2xl sm:text-3xl lg:text-4xl text-forest tracking-tight mb-1.5">
            <span className="font-sans font-semibold">Work &amp; Business </span>
            <span className="font-serif italic font-normal">Experience</span>
          </h2>
          <p className="text-xs sm:text-sm text-forest/75 leading-relaxed font-source">
            Pengalaman kerja nyata dalam standardisasi operasional, pertumbuhan brand mandiri, kemitraan event komersial, serta riset automasi software.
          </p>
        </div>

        {/* 2-Column Balanced Responsive Editorial Bento Cards */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-5 items-stretch">
          {experiencesList.map((exp) => {
            const galleryImages = (exp.extraImages && exp.extraImages.length > 0)
              ? exp.extraImages
              : [exp.image];
            const activeIdx = expPhotoIndex[exp.id] ?? 0;
            const currentImg = galleryImages[activeIdx] || exp.image;
            const isCurrentRole = exp.period.toLowerCase().includes('sekarang') || exp.period.toLowerCase().includes('present');

            return (
              <div
                key={exp.id}
                className="bg-white/95 backdrop-blur-sm border border-[#CAD7C5] hover:border-[#8A9E85] rounded-2xl p-4 sm:p-5 shadow-xs hover:shadow-md transition-all flex flex-col justify-between group"
              >
                {/* Top Meta Bar: Category Pill + Status & Period */}
                <div className="flex flex-wrap items-center justify-between gap-2 pb-3 mb-3.5 border-b border-[#CAD7C5]/60">
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] sm:text-[11px] font-sans font-bold px-3 py-1 rounded-full bg-rose-blush/90 text-rose-dark border border-rose-dusty/40 uppercase tracking-wider shadow-2xs">
                      {exp.category || exp.tag}
                    </span>
                    <span className="text-[10px] sm:text-[11px] font-medium text-forest/80 px-2.5 py-0.5 rounded-full bg-[#F4F7F2] border border-[#CAD7C5]/70 flex items-center gap-1.5">
                      <span className={`w-1.5 h-1.5 rounded-full ${isCurrentRole ? 'bg-emerald-500 animate-pulse' : 'bg-forest/50'}`} />
                      {exp.tag}
                    </span>
                  </div>
                  <span className="text-xs text-forest/80 font-mono font-medium px-2.5 py-1 rounded-lg bg-[#E8EFE5]/70 border border-[#CAD7C5]/70 shrink-0">
                    {exp.period}
                  </span>
                </div>

                {/* Main Content Area: Split into Interactive Photo Showcase + Executive Context */}
                <div className="grid grid-cols-1 sm:grid-cols-12 gap-4 sm:gap-4.5 items-start">
                  {/* Left (sm:col-span-5): Interactive Photo Showcase */}
                  <div className="sm:col-span-5 flex flex-col gap-2">
                    {/* Main Image with Zoom & Modal Trigger */}
                    <div
                      onClick={() => openModal(
                        exp.title,
                        `${exp.tag} • ${exp.period}`,
                        exp.summary,
                        galleryImages,
                        exp.link,
                        exp.linkLabel
                      )}
                      className="w-full h-44 sm:h-48 rounded-xl overflow-hidden relative border border-[#CAD7C5]/80 bg-[#E8EFE5]/40 cursor-pointer group/img shadow-2xs"
                    >
                      <img
                        src={currentImg || exp.image || '/3.png'}
                        alt={exp.title}
                        onError={(e) => {
                          const target = e.currentTarget;
                          const fallback = exp.image || '/3.png';
                          if (target.src !== fallback) {
                            target.src = fallback;
                          }
                        }}
                        className="w-full h-full object-cover group-hover/img:scale-105 transition-transform duration-500"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-forest/80 via-forest/20 to-transparent opacity-0 group-hover/img:opacity-100 transition-opacity flex items-end p-2.5">
                        <span className="px-2.5 py-1 rounded-lg bg-white/95 text-forest text-[10px] font-bold shadow-xs flex items-center gap-1">
                          <span>Buka Galeri</span>
                          <span>↗</span>
                        </span>
                      </div>
                      <div className="absolute top-2 right-2 px-2 py-0.5 rounded-md bg-forest/85 text-white text-[9px] font-mono font-bold backdrop-blur-xs shadow-2xs">
                        {activeIdx + 1} / {galleryImages.length}
                      </div>
                    </div>

                    {/* Mini Interactive Thumbnail Switcher Row */}
                    {galleryImages.length > 1 && (
                      <div className="grid grid-cols-3 gap-1.5">
                        {galleryImages.slice(0, 3).map((imgUrl, imgIdx) => (
                          <button
                            key={imgIdx}
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              setExpPhotoIndex(prev => ({ ...prev, [exp.id]: imgIdx }));
                            }}
                            className={`h-11 rounded-lg overflow-hidden border transition-all cursor-pointer relative ${
                              activeIdx === imgIdx
                                ? 'border-rose-dark ring-2 ring-rose-dark/30 scale-[1.02]'
                                : 'border-[#CAD7C5]/70 opacity-70 hover:opacity-100'
                            }`}
                          >
                            <img 
                              src={imgUrl} 
                              alt={`Foto ${imgIdx + 1}`} 
                              onError={(e) => {
                                const target = e.currentTarget;
                                target.src = '/3.png';
                              }}
                              className="w-full h-full object-cover" 
                            />
                            {activeIdx === imgIdx && (
                              <div className="absolute inset-0 bg-rose-dark/10" />
                            )}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Right (sm:col-span-7): Rich Structured Information */}
                  <div className="sm:col-span-7 flex flex-col justify-between h-full">
                    <div>
                      {/* Title & Role */}
                      <h3 className="font-sans text-base sm:text-lg font-bold text-forest group-hover:text-rose-dark transition-colors tracking-tight leading-snug mb-1.5">
                        {exp.title}
                      </h3>

                      {/* Executive Summary */}
                      <p className="text-xs sm:text-[13px] text-forest/80 leading-relaxed font-source mb-2.5">
                        {exp.summary}
                      </p>

                      {/* Strategic Insight Box */}
                      {(exp.strategy || exp.challenge) && (
                        <div className="p-2.5 rounded-xl bg-[#FAFBF8] border border-[#CAD7C5]/70 mb-2.5 text-left">
                          <span className="text-[10px] font-mono uppercase font-bold text-forest/60 block mb-0.5 tracking-wider">
                            ✦ Fokus Strategi &amp; Solusi
                          </span>
                          <p className="text-[11px] text-forest/85 leading-snug">
                            {exp.strategy || exp.challenge}
                          </p>
                        </div>
                      )}

                      {/* Key Deliverables & Metric Chips */}
                      <div>
                        <span className="text-[10px] font-mono uppercase font-bold text-forest/60 block mb-1 tracking-wider">
                          Deliverables &amp; Hasil:
                        </span>
                        <div className="flex flex-wrap gap-1.5 mb-2">
                          {exp.results?.map((res, rIdx) => (
                            <span
                              key={rIdx}
                              className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md bg-[#E8EFE5]/60 border border-[#CAD7C5]/80 text-[10px] font-semibold text-forest shadow-2xs"
                            >
                              <span className="w-1.5 h-1.5 rounded-full bg-rose-dusty shrink-0" />
                              <span>{res}</span>
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Card Bottom Footer: Action Links */}
                <div className="mt-3.5 pt-3 border-t border-[#CAD7C5]/60 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-2 sm:gap-2.5">
                  <button
                    onClick={() => openModal(
                      exp.title,
                      `${exp.tag} • ${exp.period}`,
                      exp.summary,
                      galleryImages,
                      exp.link,
                      exp.linkLabel
                    )}
                    className="inline-flex items-center justify-center gap-1.5 px-3.5 py-2 sm:py-1.5 rounded-xl bg-forest text-white hover:bg-forest/90 font-sans text-xs font-semibold transition-all shadow-xs cursor-pointer group/btn w-full sm:w-auto"
                  >
                    <span>Dokumentasi &amp; Galeri ({galleryImages.length} Foto)</span>
                    <span className="group-hover/btn:translate-x-0.5 transition-transform">→</span>
                  </button>

                  {exp.link && (
                    <a
                      href={exp.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center justify-center gap-1.5 px-3.5 py-2 sm:py-1.5 rounded-xl bg-white hover:bg-[#F4F7F2] text-forest font-sans text-xs font-semibold border border-[#CAD7C5] transition-all shadow-2xs hover:border-rose-dusty/60 w-full sm:w-auto text-center"
                    >
                      <span>{exp.linkLabel?.replace(' ↗', '') || 'Kunjungi'} ↗</span>
                    </a>
                  )}
                </div>
              </div>
            );
          })}
        </div>

      </section>

      {/* ========================================================================= */}
      {/* SECTION: MY WORK INCLUDES (Campus Projects / Proyek Kampus & Akademik)    */}
      {/* ========================================================================= */}
      <section id="projects" className="max-w-[1380px] mx-auto px-4 sm:px-6 lg:px-8 py-7 sm:py-8 lg:py-10 border-t border-[#CAD7C5]/60 scroll-mt-18">
        
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-3 sm:mb-3.5">
          <span className="font-mono text-xs sm:text-sm text-forest/60 tracking-widest uppercase block mb-1">
            ( 03 ) Portfolio &amp; Case Studies
          </span>
          <h2 className="text-2xl sm:text-3xl lg:text-4xl text-forest tracking-tight mb-1.5">
            <span className="font-sans font-semibold">Selected Works &amp; </span>
            <span className="font-serif italic font-normal">Campus Projects</span>
          </h2>
          <p className="text-xs sm:text-sm text-forest/75 leading-relaxed font-source">
            Kompilasi proyek sistem informasi, riset aplikasi, analisis data, dan strategi bisnis yang dikerjakan selama studi di D4 SIB Polinema.
          </p>
        </div>

        {/* Category Filter Pills */}
        <div className="flex flex-wrap items-center justify-center gap-2 mb-4 pb-2 border-b border-[#CAD7C5]/60">
          <button
            onClick={() => setActiveDossierTab('all')}
            className={`px-3.5 py-1 rounded-full text-xs font-subheader tracking-wider transition-all cursor-pointer ${
              activeDossierTab === 'all'
                ? 'bg-rose-dark text-white shadow-2xs'
                : 'bg-white/80 text-forest/80 border border-[#CAD7C5] hover:bg-white'
            }`}
          >
            All Projects ({projectsList.length})
          </button>
          <button
            onClick={() => setActiveDossierTab('surveyku')}
            className={`px-3.5 py-1 rounded-full text-xs font-subheader tracking-wider transition-all cursor-pointer ${
              activeDossierTab === 'surveyku'
                ? 'bg-rose-dark text-white shadow-2xs'
                : 'bg-white/80 text-forest/80 border border-[#CAD7C5] hover:bg-white'
            }`}
          >
            Web Systems
          </button>
          <button
            onClick={() => setActiveDossierTab('media-monitor')}
            className={`px-3.5 py-1 rounded-full text-xs font-subheader tracking-wider transition-all cursor-pointer ${
              activeDossierTab === 'media-monitor'
                ? 'bg-rose-dark text-white shadow-2xs'
                : 'bg-white/80 text-forest/80 border border-[#CAD7C5] hover:bg-white'
            }`}
          >
            Python Automation
          </button>
          <button
            onClick={() => setActiveDossierTab('jti-certify')}
            className={`px-3.5 py-1 rounded-full text-xs font-subheader tracking-wider transition-all cursor-pointer ${
              activeDossierTab === 'jti-certify'
                ? 'bg-rose-dark text-white shadow-2xs'
                : 'bg-white/80 text-forest/80 border border-[#CAD7C5] hover:bg-white'
            }`}
          >
            Credential Portal
          </button>
          <button
            onClick={() => setActiveDossierTab('sales-dashboard')}
            className={`px-3.5 py-1 rounded-full text-xs font-subheader tracking-wider transition-all cursor-pointer ${
              activeDossierTab === 'sales-dashboard'
                ? 'bg-rose-dark text-white shadow-2xs'
                : 'bg-white/80 text-forest/80 border border-[#CAD7C5] hover:bg-white'
            }`}
          >
            Business Analytics
          </button>
          <button
            onClick={() => setActiveDossierTab('bpc-canvas')}
            className={`px-3.5 py-1 rounded-full text-xs font-subheader tracking-wider transition-all cursor-pointer ${
              activeDossierTab === 'bpc-canvas'
                ? 'bg-rose-dark text-white shadow-2xs'
                : 'bg-white/80 text-forest/80 border border-[#CAD7C5] hover:bg-white'
            }`}
          >
            BMC & Strategy
          </button>
        </div>

        {/* 3-Column Grid Matching User Reference Image */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5 items-stretch">
          {filteredDossier.map((project) => (
            <div
              key={project.id}
              onClick={() => openModal(
                project.title,
                `${project.tag} • ${project.period}`,
                project.summary,
                project.extraImages && project.extraImages.length > 0 ? project.extraImages : [project.image],
                project.link,
                project.linkLabel
              )}
              className="bg-white/95 backdrop-blur-sm border border-[#CAD7C5] rounded-2xl p-3.5 shadow-2xs hover:shadow-md hover:border-rose-dusty/80 hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between group cursor-pointer"
            >
              <div>
                {/* 1. GAMBAR PROYEK (Visual Showcase Clean on Top with 16:10 Ratio) */}
                <div className="relative aspect-[16/10] rounded-xl overflow-hidden bg-forest/5 mb-2.5 border border-[#CAD7C5]/60 shadow-2xs">
                  <img
                    src={project.image}
                    alt={project.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-50 group-hover:opacity-80 transition-opacity pointer-events-none" />
                  
                  {/* Category Pill on Image */}
                  <span className="absolute top-2.5 left-2.5 bg-white/90 backdrop-blur-xs text-forest text-[9px] font-bold px-2 py-0.5 rounded-full shadow-xs uppercase tracking-wider">
                    {project.tag}
                  </span>

                  {/* Hover Quick Prompt */}
                  <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-forest/30 pointer-events-none">
                    <span className="px-3 py-1 rounded-full bg-white/95 text-rose-dark text-xs font-bold shadow-md flex items-center gap-1.5 backdrop-blur-xs">
                      <span>Buka Dokumentasi ↗</span>
                    </span>
                  </div>
                </div>

                {/* 2. JUDUL PROYEK DI BAWAHNYA */}
                <div className="flex items-center justify-between gap-2 mb-1">
                  <span className="text-[10px] font-mono font-bold text-forest/50 uppercase tracking-wider">
                    {project.period}
                  </span>
                  <span className="text-[10px] text-forest/60 font-medium">
                    {project.extraImages?.length || 1} Foto
                  </span>
                </div>

                <h3 className="font-sans text-sm sm:text-base font-bold text-forest uppercase tracking-wide group-hover:text-rose-dark transition-colors line-clamp-1 leading-snug">
                  {project.title}
                </h3>

                {/* 3. RINGKASAN PROYEK */}
                <div className="mt-1.5">
                  <p className="text-xs text-forest/80 font-source leading-relaxed mb-2 line-clamp-2">
                    {project.summary}
                  </p>
                  <div className="flex flex-wrap gap-1">
                    {project.results?.slice(0, 2).map((res, rIdx) => (
                      <span
                        key={rIdx}
                        className="inline-flex items-center gap-1 text-[9px] font-medium px-2 py-0.5 rounded-full bg-[#E8EFE5] text-forest border border-[#CAD7C5]"
                      >
                        <span className="w-1 h-1 rounded-full bg-rose-dark" />
                        <span className="truncate">{res}</span>
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Bottom Subtle Action Trigger */}
              <div className="pt-2 mt-2 border-t border-[#CAD7C5]/40 flex items-center justify-between text-xs text-forest/60">
                <span className="text-[11px] font-bold text-rose-dark group-hover:underline flex items-center gap-1">
                  <span>Lihat Dokumentasi</span>
                  <span className="text-xs">↗</span>
                </span>
                <span className="w-5 h-5 rounded-full bg-[#E8EFE5] text-forest group-hover:bg-rose-dark group-hover:text-white transition-colors flex items-center justify-center text-[10px] font-bold">
                  →
                </span>
              </div>
            </div>
          ))}
        </div>

      </section>

      {/* ========================================================================= */}
      {/* SECTION 2: WALL OF RECOGNITION (Visual Mosaic Exhibition Collage) */}
      {/* ========================================================================= */}
      <section id="recognition" className="max-w-[1380px] mx-auto px-4 sm:px-6 lg:px-8 py-7 sm:py-8 lg:py-10 border-t border-[#CAD7C5]/60 scroll-mt-18">
        
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-3.5 sm:mb-4">
          <span className="font-script text-2xl sm:text-3xl text-rose-dark block mb-0.5">/ Honors & Recognitions /</span>
          <h2 className="font-serif text-2xl sm:text-3xl lg:text-4xl font-bold text-forest tracking-normal mb-1.5">
            National Competitions & Honors
          </h2>
          <p className="text-xs sm:text-sm text-forest/75 leading-relaxed">
            Galeri visual pencapaian terverifikasi dalam kompetisi business plan dan debat nasional. Klik untuk membuka sertifikat resmi.
          </p>
        </div>

        {/* Filter Pills */}
        <div className="flex flex-wrap items-center justify-center gap-2 mb-3 sm:mb-3.5">
          <button
            onClick={() => setAwardFilter('all')}
            className={`px-3.5 py-1 rounded-full text-xs font-subheader tracking-wider transition-all cursor-pointer ${
              awardFilter === 'all'
                ? 'bg-rose-dark text-white shadow-2xs'
                : 'bg-white/80 text-forest/80 border border-[#CAD7C5] hover:bg-white'
            }`}
          >
            All Awards (7)
          </button>
          <button
            onClick={() => setAwardFilter('1st')}
            className={`px-3.5 py-1 rounded-full text-xs font-subheader tracking-wider transition-all cursor-pointer ${
              awardFilter === '1st'
                ? 'bg-rose-dark text-white shadow-2xs'
                : 'bg-white/80 text-forest/80 border border-[#CAD7C5] hover:bg-white'
            }`}
          >
            1st Winner (2)
          </button>
          <button
            onClick={() => setAwardFilter('2nd')}
            className={`px-3.5 py-1 rounded-full text-xs font-subheader tracking-wider transition-all cursor-pointer ${
              awardFilter === '2nd'
                ? 'bg-rose-dark text-white shadow-2xs'
                : 'bg-white/80 text-forest/80 border border-[#CAD7C5] hover:bg-white'
            }`}
          >
            2nd Winner (2)
          </button>
          <button
            onClick={() => setAwardFilter('top5')}
            className={`px-3.5 py-1 rounded-full text-xs font-subheader tracking-wider transition-all cursor-pointer ${
              awardFilter === 'top5'
                ? 'bg-rose-dark text-white shadow-2xs'
                : 'bg-white/80 text-forest/80 border border-[#CAD7C5] hover:bg-white'
            }`}
          >
            Top 5 Finalist (2)
          </button>
          <button
            onClick={() => setAwardFilter('speaker')}
            className={`px-3.5 py-1 rounded-full text-xs font-subheader tracking-wider transition-all cursor-pointer ${
              awardFilter === 'speaker'
                ? 'bg-rose-dark text-white shadow-2xs'
                : 'bg-white/80 text-forest/80 border border-[#CAD7C5] hover:bg-white'
            }`}
          >
            Best Speaker (1)
          </button>
        </div>

        {/* Visual Exhibition Mosaic Container */}
        <div className="relative p-3 sm:p-3.5 rounded-2xl bg-gradient-to-tr from-rose-blush/40 via-white/60 to-sage-DEFAULT/30 border border-white/80 shadow-md backdrop-blur-sm">
          
          {/* Mosaic Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-3 sm:gap-3.5">
            {filteredAwards.map((award, idx) => {
              // Calibrated compact asymmetric span pattern
              let colSpan = 'lg:col-span-4 min-h-[200px]';
              if (awardFilter === 'all') {
                if (idx === 0) colSpan = 'lg:col-span-4 lg:row-span-2 min-h-[340px]';
                else if (idx === 1) colSpan = 'lg:col-span-8 min-h-[160px]';
                else if (idx === 2) colSpan = 'lg:col-span-4 min-h-[160px]';
                else if (idx === 3) colSpan = 'lg:col-span-4 min-h-[160px]';
                else if (idx === 4) colSpan = 'lg:col-span-4 min-h-[165px]';
                else if (idx === 5) colSpan = 'lg:col-span-4 min-h-[165px]';
                else if (idx === 6) colSpan = 'lg:col-span-4 min-h-[165px]';
              } else {
                colSpan = 'lg:col-span-6 min-h-[220px]';
              }

              return (
                <div
                  key={idx}
                  onClick={() => openModal(
                    award.title, 
                    `${award.rank} • ${award.organizer}`, 
                    award.desc, 
                    [award.certImg, award.eventImg, ...(award.extraImages || [])].filter(Boolean) as string[], 
                    award.link, 
                    award.linkLabel,
                    award.videoLink,
                    award.videoLinkLabel
                  )}
                  className={`group relative rounded-2xl overflow-hidden cursor-pointer bg-forest/20 border-2 border-white/60 shadow-xs transition-all duration-500 hover:-translate-y-1 hover:shadow-lg ${colSpan} flex flex-col justify-between p-3 sm:p-3.5`}
                >
                  {/* Background Event Documentation Image */}
                  <img
                    src={award.eventImg}
                    alt={award.title}
                    className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 pointer-events-none"
                  />
                  
                  {/* Subtle Gradient Shadow by default */}
                  <div className="absolute inset-0 bg-gradient-to-t from-forest/80 via-forest/20 to-transparent group-hover:opacity-0 transition-opacity duration-300 pointer-events-none" />

                  {/* Top Header Tag (Pills) */}
                  <div className="relative z-10 flex items-center justify-between w-full">
                    <span className={`text-[9px] font-subheader px-2 py-0.5 rounded-full shadow-xs tracking-wider uppercase ${award.rankBadge}`}>
                      {award.rank}
                    </span>
                    <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-full bg-black/45 backdrop-blur-md text-white border border-white/20">
                      {award.year}
                    </span>
                  </div>

                  {/* Default Bottom Teaser with Legible Backdrop */}
                  <div className="relative z-10 bg-black/60 backdrop-blur-xs p-2.5 rounded-xl border border-white/15 text-white group-hover:opacity-0 transition-opacity duration-300">
                    <h3 className="font-sans text-sm sm:text-base font-bold leading-snug line-clamp-1">
                      {award.title}
                    </h3>
                    <p className="text-[10px] font-subheader text-rose-blush tracking-wider uppercase mt-0.5 truncate">
                      {award.organizer}
                    </p>
                  </div>

                  {/* HOVER OVERLAY: Timbul & Pop-out Full Details! */}
                  <div className="absolute inset-0 bg-forest/90 backdrop-blur-sm p-4 flex flex-col justify-between opacity-0 group-hover:opacity-100 transition-all duration-300 z-20 text-white">
                    <div>
                      <div className="flex items-center gap-1.5 mb-1">
                        <span className="w-1.5 h-1.5 rounded-full bg-rose-dusty" />
                        <span className="text-[9px] font-subheader text-rose-blush tracking-subheader uppercase">
                          {award.scope}
                        </span>
                      </div>
                      <h3 className="font-sans text-base sm:text-lg font-bold leading-snug mb-1 text-white line-clamp-1">
                        {award.title}
                      </h3>
                      <p className="text-[11px] font-subheader text-[#E8EFE5]/70 tracking-wider uppercase mb-1.5">
                        {award.organizer}
                      </p>
                      <p className="text-xs text-[#E8EFE5]/85 leading-relaxed line-clamp-2">
                        {award.desc}
                      </p>
                    </div>

                    <div className="pt-2 border-t border-white/20 flex items-center justify-between text-xs">
                      <span className="text-[10px] font-bold text-rose-blush flex items-center gap-1">
                        <span>Bukti Foto</span>
                      </span>
                      <div className="flex items-center gap-1.5">
                        {award.videoLink && (
                          <a
                            href={award.videoLink}
                            target="_blank"
                            rel="noopener noreferrer"
                            onClick={(e) => e.stopPropagation()}
                            className="px-2 py-1 rounded-full bg-rose-dark hover:bg-rose-berry text-white text-[10px] font-bold shadow-xs transition-colors flex items-center gap-1"
                            title={award.videoLinkLabel || 'Tonton Video'}
                          >
                            <span>▶</span>
                            <span>Video</span>
                          </a>
                        )}
                        {award.link && (
                          <a
                            href={award.link}
                            target="_blank"
                            rel="noopener noreferrer"
                            onClick={(e) => e.stopPropagation()}
                            className="px-2 py-1 rounded-full bg-white/20 hover:bg-white text-white hover:text-forest text-[10px] font-bold border border-white/30 transition-colors flex items-center gap-1"
                          >
                            <span>↗</span>
                            <span>{award.linkLabel || 'Publikasi'}</span>
                          </a>
                        )}
                        <span className="px-3 py-1 rounded-full bg-rose-dark text-white text-xs font-bold shadow-2xs hover:bg-rose-berry transition-colors flex items-center gap-1">
                          <span>Detail</span>
                          <span>↗</span>
                        </span>
                      </div>
                    </div>
                  </div>

                </div>
              );
            })}
          </div>

        </div>

        {/* Footer Note */}
        <p className="text-center text-xs text-forest/60 italic mt-2.5">
          Klik pada gambar untuk melihat pop-up foto penerimaan piala dan sertifikat resmi
        </p>

      </section>

      {/* ========================================================================= */}
      {/* SECTION 3: INSTITUTIONAL LEADERSHIP & GOVERNANCE (Infinite Coverflow)    */}
      {/* ========================================================================= */}
      <section id="leadership" className="max-w-[1380px] mx-auto px-4 sm:px-6 lg:px-8 py-7 sm:py-8 lg:py-10 border-t border-[#CAD7C5]/60 overflow-hidden scroll-mt-18">
        
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-2.5 sm:mb-3">
          <span className="font-script text-2xl sm:text-3xl text-rose-dark block mb-0.5">/ Governance & Track Record /</span>
          <h2 className="font-serif text-2xl sm:text-3xl lg:text-4xl font-bold text-forest tracking-normal mb-1.5">
            Leadership & Organizational Impact
          </h2>
          <p className="text-xs sm:text-sm text-forest/75 leading-relaxed font-source">
            Pengalaman memimpin mahasiswa, mengawal tata kelola organisasi skala jurusan, serta mewakili ekosistem teknologi kampus.
          </p>
        </div>

        {/* Carousel Status Counter */}
        {(() => {
          const activeOrgIdx = ((currentSlideIndex % organizationList.length) + organizationList.length) % organizationList.length;
          const activeOrg = organizationList[activeOrgIdx];

          const handleNextOrg = () => {
            setCurrentSlideIndex(prev => {
              const next = prev + 1;
              return next >= 20 ? next - 5 : next;
            });
          };

          const handlePrevOrg = () => {
            setCurrentSlideIndex(prev => {
              const prevIdx = prev - 1;
              return prevIdx < 5 ? prevIdx + 5 : prevIdx;
            });
          };

          const handleJumpOrg = (targetIdx: number) => {
            const currentSet = Math.floor(currentSlideIndex / organizationList.length) * organizationList.length;
            setCurrentSlideIndex(currentSet + targetIdx);
          };

          return (
            <>
              <div className="flex items-center justify-between max-w-4xl mx-auto mb-2 px-2">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-rose-dark animate-pulse" />
                  <span className="text-[11px] font-bold text-forest uppercase tracking-wider font-source">
                    Peran {activeOrgIdx + 1} dari {organizationList.length}
                  </span>
                  <span className="text-xs text-forest/50 hidden sm:inline">•</span>
                  <span className="text-xs font-serif italic text-forest/75 hidden sm:inline">
                    {activeOrg.role} ({activeOrg.institution})
                  </span>
                </div>

                <div className="text-[10px] text-forest/60 font-medium hidden sm:flex items-center gap-1 bg-white/70 px-2.5 py-0.5 rounded-full border border-[#CAD7C5]/60">
                  <span>Auto-slide foto aktif</span>
                </div>
              </div>

              {/* =================================================================== */}
              {/* INFINITE COVERFLOW CONTAINER WITH PROMINENT SIDE ARROWS             */}
              {/* =================================================================== */}
              <div 
                className="relative py-3 select-none"
                style={{ 
                  '--card-width': 'min(75vw, 340px)',
                  '--card-gap': '1.25rem'
                } as React.CSSProperties}
              >
                {/* Floating Left Arrow Button (Prominent on Side) */}
                <button
                  onClick={handlePrevOrg}
                  className="absolute left-1 sm:left-2 lg:left-4 top-1/2 -translate-y-1/2 z-40 w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-white/95 backdrop-blur-md border-2 border-[#CAD7C5] shadow-lg text-forest hover:bg-forest hover:text-[#E8EFE5] hover:scale-110 active:scale-95 transition-all flex items-center justify-center text-xl font-bold cursor-pointer ring-2 ring-forest/5"
                  title="Peran Sebelumnya (Geser Kiri)"
                  aria-label="Previous Role"
                >
                  ‹
                </button>

                {/* Floating Right Arrow Button (Prominent on Side) */}
                <button
                  onClick={handleNextOrg}
                  className="absolute right-1 sm:right-2 lg:right-4 top-1/2 -translate-y-1/2 z-40 w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-white/95 backdrop-blur-md border-2 border-[#CAD7C5] shadow-lg text-forest hover:bg-forest hover:text-[#E8EFE5] hover:scale-110 active:scale-95 transition-all flex items-center justify-center text-xl font-bold cursor-pointer ring-2 ring-forest/5"
                  title="Peran Selanjutnya (Geser Kanan)"
                  aria-label="Next Role"
                >
                  ›
                </button>

                {/* Track with smooth transition */}
                <div 
                  className="flex items-center transition-transform duration-500 ease-out"
                  style={{
                    gap: 'var(--card-gap)',
                    transform: `translateX(calc(50% - (${currentSlideIndex} * (var(--card-width) + var(--card-gap)) + (var(--card-width) / 2))))`
                  }}
                >
                  {Array.from({ length: 25 }).map((_, globalIdx) => {
                    const orgIdx = globalIdx % organizationList.length;
                    const org = organizationList[orgIdx];
                    const isCenter = globalIdx === currentSlideIndex;
                    const activePhotoIdx = orgPhotoIndex[orgIdx] || 0;
                    const currentPhoto = org.images[activePhotoIdx] || org.images[0];

                    return (
                      <div
                        key={globalIdx}
                        onClick={() => setCurrentSlideIndex(globalIdx)}
                        style={{ width: 'var(--card-width)' }}
                        className={`shrink-0 rounded-2xl transition-all duration-500 flex flex-col justify-between overflow-hidden cursor-pointer ${
                          isCenter
                            ? 'scale-102 sm:scale-105 z-30 opacity-100 bg-white shadow-xl ring-2 ring-rose-dark/35 border-transparent'
                            : 'scale-90 sm:scale-95 z-10 opacity-55 hover:opacity-85 bg-white/85 shadow-xs border border-[#CAD7C5]'
                        }`}
                      >
                        {/* Spotlight Ribbon on Center Card */}
                        {isCenter && (
                          <div className="bg-gradient-to-r from-forest via-rose-dark to-forest text-[#E8EFE5] text-center text-[9px] font-bold uppercase tracking-widest py-0.5">
                            ✦ Spotlight Organization ✦
                          </div>
                        )}

                        {/* Card Image Area: 16:10 Aspect Ratio with Auto-Sliding Photo */}
                        <div className="relative aspect-[16/10] overflow-hidden bg-forest/10 group/img">
                          <img
                            src={currentPhoto}
                            alt={`${org.role} - ${org.institution}`}
                            className="w-full h-full object-cover group-hover/img:scale-105 transition-all duration-700"
                          />
                          
                          {/* Gradient overlay */}
                          <div className="absolute inset-0 bg-gradient-to-t from-forest/75 via-transparent to-black/20 pointer-events-none" />

                          {/* Top Badges */}
                          <div className="absolute top-2.5 inset-x-2.5 flex items-center justify-between z-10">
                            <span className="text-[9px] font-bold bg-white/90 backdrop-blur-xs text-forest px-2 py-0.5 rounded-full shadow-xs">
                              {org.period}
                            </span>
                            <span className="text-[9px] font-medium bg-forest/85 backdrop-blur-xs text-white px-2 py-0.5 rounded-full flex items-center gap-1 shadow-xs">
                              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                              <span>Foto {activePhotoIdx + 1}/{org.images.length}</span>
                            </span>
                          </div>

                          {/* Multi-Photo Indicators & Thumbnail switcher at bottom of photo */}
                          <div className="absolute bottom-2.5 left-2.5 z-10 flex items-center gap-1 bg-black/60 backdrop-blur-md px-2 py-0.5 rounded-full">
                            {org.images.map((_, pIdx) => (
                              <button
                                key={pIdx}
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setOrgPhotoIndex(prev => ({ ...prev, [orgIdx]: pIdx }));
                                }}
                                className={`w-3.5 h-3.5 rounded-full text-[8px] font-bold flex items-center justify-center transition-all ${
                                  activePhotoIdx === pIdx
                                    ? 'bg-rose-dark text-white scale-110 shadow-xs'
                                    : 'bg-white/40 text-white hover:bg-white/70'
                                }`}
                                title={`Foto ${pIdx + 1}`}
                              >
                                {pIdx + 1}
                              </button>
                            ))}
                          </div>

                          {/* Zoom / Full Gallery Action */}
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              openModal(org.role, org.institution, org.desc, org.images);
                            }}
                            className="absolute bottom-2.5 right-2.5 z-10 px-2 py-0.5 rounded-full bg-white/90 hover:bg-rose-blush text-forest text-[9px] font-bold shadow-xs transition-colors"
                            title="Buka Dokumentasi Resolusi Penuh"
                          >
                            Galeri ↗
                          </button>
                        </div>

                        {/* Card Content Body */}
                        <div className="p-3.5 sm:p-4 flex flex-col justify-between grow">
                          <div>
                            <div className="text-[9px] font-bold text-rose-dark uppercase tracking-wider mb-0.5">
                              {org.tag}
                            </div>

                            <h3 className="font-sans text-lg sm:text-xl font-bold text-forest mb-0.5 line-clamp-1">
                              {org.role}
                            </h3>

                            <h4 className="text-[11px] font-subheader text-forest/70 tracking-wider uppercase mb-2">
                              {org.institution}
                            </h4>

                            <p className="text-xs text-forest/80 leading-relaxed font-source mb-2.5 line-clamp-2">
                              {org.desc}
                            </p>

                            {/* Highlights Badges */}
                            <div className="flex flex-wrap gap-1 mb-2.5">
                              {org.highlights.slice(0, 2).map((item, hIdx) => (
                                <span
                                  key={hIdx}
                                  className="text-[9px] font-medium px-2 py-0.5 rounded-full bg-[#E8EFE5]/70 border border-[#CAD7C5] text-forest/85"
                                >
                                  ✦ {item}
                                </span>
                              ))}
                            </div>
                          </div>

                          {/* Footer Trigger */}
                          <div className="pt-2 border-t border-[#CAD7C5]/50 flex items-center justify-between text-xs">
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                openModal(org.role, org.institution, org.desc, org.images);
                              }}
                              className="text-xs font-bold text-rose-dark hover:text-rose-berry transition-colors flex items-center gap-1 cursor-pointer"
                            >
                              <span>Dokumentasi Lengkap</span>
                              <span>↗</span>
                            </button>
                            <span className="text-[10px] text-forest/50 font-medium">
                              {org.images.length} Foto Tersedia
                            </span>
                          </div>

                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Quick Role Jump Pills (Clickable direct navigation below carousel) */}
              <div className="flex flex-wrap items-center justify-center gap-1.5 mt-2.5 mb-2">
                {organizationList.map((org, idx) => (
                  <button
                    key={idx}
                    onClick={() => handleJumpOrg(idx)}
                    className={`px-3 py-1 rounded-full text-xs font-medium transition-all cursor-pointer ${
                      idx === activeOrgIdx
                        ? 'bg-forest text-[#E8EFE5] font-bold shadow-2xs ring-2 ring-forest/20'
                        : 'bg-white/80 text-forest/75 border border-[#CAD7C5] hover:bg-white hover:text-forest'
                    }`}
                  >
                    <span className="opacity-60 mr-1">#{idx + 1}</span>
                    <span>{org.role.split('(')[0].trim()}</span>
                  </button>
                ))}
              </div>
            </>
          );
        })()}

      </section>

      {/* ========================================================================= */}
      {/* SECTION: PROFESSIONAL COURSES & ACCREDITATIONS (Dedicated Section)        */}
      {/* ========================================================================= */}
      <section id="certifications" className="max-w-[1380px] mx-auto px-4 sm:px-6 lg:px-8 py-7 sm:py-8 lg:py-10 border-t border-[#CAD7C5]/60 scroll-mt-18">
        
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-3.5 sm:mb-4">
          <span className="font-script text-2xl sm:text-3xl text-rose-dark block mb-0.5">/ Continuous Learning /</span>
          <h2 className="font-serif text-2xl sm:text-3xl lg:text-4xl font-bold text-forest tracking-normal mb-1.5">
            Professional Certifications & Credentials
          </h2>
          <p className="text-xs sm:text-sm text-forest/75 leading-relaxed font-source">
            Lisensi pelatihan industri, sertifikasi kompetensi terakreditasi, dan pengujian standar internasional.
          </p>
        </div>

        {/* Compact Vertical Cards Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 sm:gap-3.5 items-stretch">
          {certificationList.map((item, idx) => (
            <div
              key={idx}
              onClick={() => openModal(
                item.title,
                `${item.issuer} • ${item.year} (${item.tag})`,
                item.desc,
                [item.image, ...(item.extraImages || [])].filter(Boolean) as string[],
                item.link,
                item.linkLabel
              )}
              className="bg-white/95 backdrop-blur-sm border border-[#CAD7C5] rounded-2xl p-3 hover:shadow-md hover:border-rose-dusty/60 hover:-translate-y-0.5 transition-all flex flex-col justify-between group cursor-pointer"
            >
              <div>
                {/* Visual Card Graphic */}
                <div className="relative aspect-[4/3] rounded-xl overflow-hidden bg-forest/5 mb-2 border border-[#CAD7C5]/60">
                  <img
                    src={item.image}
                    alt={item.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent pointer-events-none" />
                  
                  {/* Issuer & Year Pill */}
                  <span className="absolute bottom-1.5 left-1.5 bg-white/90 backdrop-blur-xs text-forest text-[8px] font-bold px-1.5 py-0.5 rounded-full shadow-xs">
                    {item.issuer} • {item.year}
                  </span>
                </div>

                {/* Category Tag */}
                <span className={`inline-block text-[8px] font-bold px-2 py-0.5 rounded-full border ${item.badgeColor || 'bg-rose-blush/60 text-rose-dark border-rose-dusty/50'} uppercase tracking-wider mb-1`}>
                  {item.tag}
                </span>

                {/* Course Title */}
                <h4 className="font-sans text-xs sm:text-sm font-bold text-forest group-hover:text-rose-dark transition-colors line-clamp-2 leading-snug">
                  {item.title}
                </h4>
              </div>

              {/* Bottom Minimal Arrow Footer */}
              <div className="pt-2 mt-1.5 border-t border-[#CAD7C5]/40 flex items-center justify-between text-xs">
                <span className="text-[9px] text-forest/60 font-medium">
                  Lihat Sertifikat
                </span>
                <span className="w-5 h-5 rounded-full bg-[#E8EFE5] text-forest group-hover:bg-rose-dark group-hover:text-white transition-colors flex items-center justify-center text-[9px] font-bold">
                  →
                </span>
              </div>
            </div>
          ))}
        </div>

        {/* Trust Banner Below Cards */}
        <div className="mt-4 p-3 rounded-xl bg-[#CAD7C5]/25 border border-[#CAD7C5]/60 flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-forest/80">
          <div className="flex items-center gap-2">
            <span className="text-rose-dark font-serif font-bold text-base select-none">✦</span>
            <span className="font-medium text-[11px] sm:text-xs">
              Seluruh sertifikat diterbitkan oleh institusi terakreditasi internasional & nasional (RevoU, MySkill, ETS International).
            </span>
          </div>
          <span className="text-[10px] sm:text-[11px] font-bold text-rose-dark shrink-0">
            Klik kartu untuk pratinjau sertifikat resolusi tinggi ↗
          </span>
        </div>

      </section>

      {/* ========================================================================= */}
      {/* SECTION 6: CREATIVE PURSUITS & CONTENT CREATOR HIGHLIGHT                   */}
      {/* ========================================================================= */}
      <section id="creative" className="max-w-[1380px] mx-auto px-4 sm:px-6 lg:px-8 py-7 sm:py-8 lg:py-10 border-t border-[#CAD7C5]/60 scroll-mt-18">
        
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-3.5 sm:mb-4">
          <span className="font-script text-2xl sm:text-3xl text-rose-dark block mb-0.5">/ Content & Media /</span>
          <h2 className="font-serif text-2xl sm:text-3xl lg:text-4xl font-bold text-forest tracking-normal mb-1.5">
            Creator Studio & Social Growth
          </h2>
          <p className="text-xs sm:text-sm text-forest/75 leading-relaxed">
            Eksplorasi visual dan penceritaan kreatif: Produksi konten lintas platform (Instagram & TikTok) di berbagai akun.
          </p>
        </div>

        {/* CONTENT CREATOR MULTI-DEVICE SHOWCASE */}
        <div className="bg-white/90 backdrop-blur-md border border-[#CAD7C5] rounded-2xl p-4 sm:p-5 shadow-xs mb-0">
          
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 mb-3">
            <div>
              <span className="text-[10px] font-bold uppercase tracking-widest text-rose-dark block">
                ✦ Multi-Platform Production
              </span>
              <h3 className="font-sans text-lg sm:text-xl font-bold text-forest">
                Social Media & Video Production
              </h3>
            </div>
            
            {/* Account Switcher Tabs */}
            <div className="flex flex-wrap items-center gap-1.5">
              <button
                onClick={() => setActiveCreatorAccount('personal')}
                className={`px-3 py-1 rounded-full text-xs font-semibold transition-all cursor-pointer ${
                  activeCreatorAccount === 'personal'
                    ? 'bg-rose-dark text-white shadow-2xs'
                    : 'bg-[#E8EFE5] text-forest/80 hover:bg-white'
                }`}
              >
                Personal
              </button>
              <button
                onClick={() => setActiveCreatorAccount('yarnup')}
                className={`px-3 py-1 rounded-full text-xs font-semibold transition-all cursor-pointer ${
                  activeCreatorAccount === 'yarnup'
                    ? 'bg-rose-dark text-white shadow-2xs'
                    : 'bg-[#E8EFE5] text-forest/80 hover:bg-white'
                }`}
              >
                YarnUp!
              </button>
              <button
                onClick={() => setActiveCreatorAccount('manikarumi')}
                className={`px-3 py-1 rounded-full text-xs font-semibold transition-all cursor-pointer ${
                  activeCreatorAccount === 'manikarumi'
                    ? 'bg-rose-dark text-white shadow-2xs'
                    : 'bg-[#E8EFE5] text-forest/80 hover:bg-white'
                }`}
              >
                Manikarumi
              </button>
              <button
                onClick={() => setActiveCreatorAccount('duasisi')}
                className={`px-3 py-1 rounded-full text-xs font-semibold transition-all cursor-pointer ${
                  activeCreatorAccount === 'duasisi'
                    ? 'bg-rose-dark text-white shadow-2xs'
                    : 'bg-[#E8EFE5] text-forest/80 hover:bg-white'
                }`}
              >
                Dua Sisi
              </button>
            </div>
          </div>

          {/* Account Meta Ribbon */}
          <div className="flex flex-wrap items-center justify-between gap-2 p-2.5 rounded-xl bg-[#E8EFE5]/50 border border-[#CAD7C5]/70 mb-3 text-xs">
            <div className="flex items-center gap-2 sm:gap-3">
              <span className="font-bold text-forest text-xs sm:text-sm font-serif">{currentCreator.name}</span>
              <span className="text-rose-dark font-mono font-medium text-xs">{currentCreator.handle}</span>
              <span className="hidden sm:inline text-forest/40">•</span>
              <span className="hidden sm:inline text-forest/70 font-medium text-xs">{currentCreator.tag}</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="px-2 py-0.5 rounded-full bg-rose-blush text-rose-dark font-bold text-[9px] uppercase">
                {currentCreator.stats}
              </span>
              <a
                href={currentCreator.link}
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs font-bold text-forest hover:text-rose-dark underline ml-1"
              >
                Buka Akun ↗
              </a>
            </div>
          </div>

          {/* Multi-Device Pop-out Stage */}
          {currentCreator.hasCenterStage ? (
            /* 3-DEVICE STAGE */
            <div className="relative py-2 flex flex-col lg:flex-row items-center justify-center gap-4 lg:gap-6">
              
              {/* Left Phone Mockup */}
              <div 
                onClick={() => {
                  if (currentCreator.leftPhoneLink || currentCreator.link) {
                    window.open(currentCreator.leftPhoneLink || currentCreator.link, '_blank');
                  }
                }}
                className="w-[180px] sm:w-[170px] lg:w-[160px] shrink-0 mx-auto sm:mx-0 bg-[#253521] p-2.5 rounded-[2rem] border-2 border-[#CAD7C5] shadow-md transition-all duration-500 hover:-translate-y-1.5 hover:scale-102 hover:shadow-xl group cursor-pointer"
              >
                <div className="w-12 h-3 bg-black/60 rounded-full mx-auto mb-1.5" />
                <div className="relative aspect-[9/16] rounded-2xl overflow-hidden bg-forest/30">
                  <img
                    src={currentCreator.leftPhoneImg}
                    alt={currentCreator.leftPhoneTitle}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                  />
                  <div className="absolute inset-x-0 bottom-0 p-2 bg-gradient-to-t from-black/85 via-black/40 to-transparent text-white">
                    <span className="inline-block px-1.5 py-0.5 rounded-full bg-rose-dark/90 text-[8px] font-bold uppercase tracking-wider mb-0.5">
                      {currentCreator.leftPhoneTag}
                    </span>
                    <p className="text-[10px] font-bold leading-tight line-clamp-1">
                      {currentCreator.leftPhoneTitle}
                    </p>
                  </div>
                </div>
              </div>

              {/* Central Wide Featured Stage */}
              <div 
                onClick={() => {
                  if (currentCreator.centerLink) {
                    window.open(currentCreator.centerLink, '_blank');
                  }
                }}
                className="w-full lg:max-w-[420px] bg-white rounded-2xl p-2.5 border-2 border-[#CAD7C5] shadow-md transition-all duration-500 hover:-translate-y-1 hover:scale-[1.02] hover:shadow-xl group cursor-pointer relative"
              >
                <div className="flex items-center justify-between px-2.5 py-1 border-b border-[#CAD7C5]/50 mb-2">
                  <div className="flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-rose-dusty" />
                    <span className="w-2 h-2 rounded-full bg-amber-400" />
                    <span className="w-2 h-2 rounded-full bg-emerald-500" />
                    <span className="text-[9px] text-forest/50 font-mono ml-1.5 truncate">
                      content-studio / {activeCreatorAccount}
                    </span>
                  </div>

                  {currentCreator.centerLink && (
                    <span className="text-[9px] font-bold font-mono px-2 py-0.5 rounded-full bg-red-100 text-red-700 border border-red-200 flex items-center gap-1 group-hover:bg-red-600 group-hover:text-white transition-colors">
                      <span>▶</span>
                      <span>YouTube ↗</span>
                    </span>
                  )}
                </div>

                <div className="relative aspect-[16/10] rounded-xl overflow-hidden bg-[#E8EFE5]">
                  <img
                    src={currentCreator.centerImg}
                    alt={currentCreator.centerTitle}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                  />
                  
                  {/* Play button hover overlay */}
                  <div className="absolute inset-0 bg-forest/30 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center pointer-events-none">
                    <div className="w-10 h-10 rounded-full bg-white/95 text-red-600 flex items-center justify-center text-xl shadow-lg transform scale-90 group-hover:scale-100 transition-transform">
                      ▶
                    </div>
                  </div>

                  <div className="absolute inset-0 bg-gradient-to-t from-forest/95 via-forest/40 to-transparent flex flex-col justify-end p-3.5 text-white">
                    <span className="text-[9px] font-bold uppercase tracking-widest text-rose-blush mb-0.5">
                      {currentCreator.platforms}
                    </span>
                    <h4 className="font-sans text-base sm:text-lg font-bold leading-tight mb-0.5 line-clamp-1">
                      {currentCreator.centerTitle}
                    </h4>
                    <p className="text-[11px] text-[#E8EFE5]/85 leading-snug line-clamp-2">
                      {currentCreator.centerDesc}
                    </p>
                  </div>
                </div>
              </div>

              {/* Right Phone Mockup */}
              <div 
                onClick={() => {
                  if (currentCreator.rightPhoneLink || currentCreator.link) {
                    window.open(currentCreator.rightPhoneLink || currentCreator.link, '_blank');
                  }
                }}
                className="w-[180px] sm:w-[170px] lg:w-[160px] shrink-0 mx-auto sm:mx-0 bg-[#253521] p-2.5 rounded-[2rem] border-2 border-[#CAD7C5] shadow-md transition-all duration-500 hover:-translate-y-1.5 hover:scale-102 hover:shadow-xl group cursor-pointer"
              >
                <div className="w-12 h-3 bg-black/60 rounded-full mx-auto mb-1.5" />
                <div className="relative aspect-[9/16] rounded-2xl overflow-hidden bg-forest/30">
                  <img
                    src={currentCreator.rightPhoneImg}
                    alt={currentCreator.rightPhoneTitle}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                  />
                  <div className="absolute inset-x-0 bottom-0 p-2 bg-gradient-to-t from-black/85 via-black/40 to-transparent text-white">
                    <span className="inline-block px-1.5 py-0.5 rounded-full bg-emerald-700/90 text-[8px] font-bold uppercase tracking-wider mb-0.5">
                      {currentCreator.rightPhoneTag}
                    </span>
                    <p className="text-[10px] font-bold leading-tight line-clamp-1">
                      {currentCreator.rightPhoneTitle}
                    </p>
                  </div>
                </div>
              </div>

            </div>
          ) : (
            /* ADAPTIVE 2-PHONE STAGE */
            <div className="py-2 flex flex-col items-center justify-center">
              <div className="mb-3 inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-[#E8EFE5] border border-[#CAD7C5] text-forest text-xs font-medium">
                <span className="text-rose-dusty">✦</span>
                <span>Dual Mobile Showcase — Video Vertikal (Instagram Reels & TikTok)</span>
              </div>

              <div className="flex flex-row flex-wrap items-center justify-center gap-4 sm:gap-6">
                {/* Left Phone Mockup */}
                <div 
                  onClick={() => {
                    if (currentCreator.leftPhoneLink || currentCreator.link) {
                      window.open(currentCreator.leftPhoneLink || currentCreator.link, '_blank');
                    }
                  }}
                  className="w-[180px] sm:w-[200px] shrink-0 bg-[#253521] p-2.5 rounded-[2rem] border-2 border-[#CAD7C5] shadow-md transition-all duration-500 hover:-translate-y-1.5 hover:scale-102 hover:shadow-xl group cursor-pointer"
                >
                  <div className="w-12 h-3 bg-black/60 rounded-full mx-auto mb-1.5" />
                  <div className="relative aspect-[9/16] rounded-2xl overflow-hidden bg-forest/30">
                    <img
                      src={currentCreator.leftPhoneImg}
                      alt={currentCreator.leftPhoneTitle}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                    />
                    <div className="absolute inset-x-0 bottom-0 p-2.5 bg-gradient-to-t from-black/90 via-black/50 to-transparent text-white">
                      <span className="inline-block px-2 py-0.5 rounded-full bg-rose-dark text-[9px] font-bold uppercase tracking-wider mb-0.5">
                        {currentCreator.leftPhoneTag}
                      </span>
                      <p className="text-[11px] font-bold leading-tight">
                        {currentCreator.leftPhoneTitle}
                      </p>
                      <p className="text-[9px] text-white/75 mt-0.5">Instagram ↗</p>
                    </div>
                  </div>
                </div>

                {/* Right Phone Mockup */}
                <div 
                  onClick={() => {
                    if (currentCreator.rightPhoneLink || currentCreator.link) {
                      window.open(currentCreator.rightPhoneLink || currentCreator.link, '_blank');
                    }
                  }}
                  className="w-[180px] sm:w-[200px] shrink-0 bg-[#253521] p-2.5 rounded-[2rem] border-2 border-[#CAD7C5] shadow-md transition-all duration-500 hover:-translate-y-1.5 hover:scale-102 hover:shadow-xl group cursor-pointer"
                >
                  <div className="w-12 h-3 bg-black/60 rounded-full mx-auto mb-1.5" />
                  <div className="relative aspect-[9/16] rounded-2xl overflow-hidden bg-forest/30">
                    <img
                      src={currentCreator.rightPhoneImg}
                      alt={currentCreator.rightPhoneTitle}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                    />
                    <div className="absolute inset-x-0 bottom-0 p-2.5 bg-gradient-to-t from-black/90 via-black/50 to-transparent text-white">
                      <span className="inline-block px-2 py-0.5 rounded-full bg-emerald-700 text-[9px] font-bold uppercase tracking-wider mb-0.5">
                        {currentCreator.rightPhoneTag}
                      </span>
                      <p className="text-[11px] font-bold leading-tight">
                        {currentCreator.rightPhoneTitle}
                      </p>
                      <p className="text-[9px] text-white/75 mt-0.5">TikTok ↗</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          <p className="text-center text-[11px] text-forest/60 italic mt-2.5">
            Arahkan kursor ke masing-masing kartu untuk melihat interaksi preview
          </p>

        </div>

      </section>

      {/* ========================================================================= */}
      {/* SECTION 7: BEYOND THE SCREEN — ART, HOBBIES & INTELLECTUAL PURSUITS       */}
      {/* ========================================================================= */}
      <section id="hobbies" className="max-w-[1380px] mx-auto px-4 sm:px-6 lg:px-8 py-7 sm:py-8 lg:py-10 border-t border-[#CAD7C5]/60 scroll-mt-18">
        
        {/* Section Header */}
        <div className="text-center max-w-xl mx-auto mb-3.5 sm:mb-4">
          <span className="font-script text-2xl sm:text-3xl text-rose-dark block mb-0.5">/ Creative Balance & Lifestyle /</span>
          <h2 className="font-serif text-2xl sm:text-3xl lg:text-4xl font-bold text-forest tracking-normal mb-1.5">
            Arts, Hobbies & Intellectual Pursuits
          </h2>
          <p className="text-xs sm:text-sm text-forest/75 leading-relaxed">
            Aktivitas personal yang menjaga keseimbangan kreativitas, wawasan intelektual, dan kesegaran cara pandang.
          </p>
        </div>

        {/* 4 Hobbies Card Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5 sm:gap-4">
          {hobbiesList.map((hobby, hIdx) => (
            <div
              key={hIdx}
              className="bg-white/90 border border-[#CAD7C5] rounded-2xl p-3.5 hover:border-rose-dusty hover:-translate-y-1 hover:shadow-md transition-all duration-300 flex flex-col justify-between group shadow-2xs"
            >
              <div>
                <div className="w-full aspect-[16/10] rounded-xl overflow-hidden bg-[#E8EFE5] mb-2.5 relative">
                  <img
                    src={hobby.img}
                    alt={hobby.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <span className="absolute top-2 left-2 bg-white/90 text-forest text-[9px] font-bold px-2 py-0.5 rounded-full shadow-xs flex items-center gap-1">
                    <span>{hobby.icon}</span>
                    <span>{hobby.tag}</span>
                  </span>
                </div>
                <h3 className="font-serif text-sm sm:text-base font-bold text-forest mb-0.5">
                  {hobby.title}
                </h3>
                <p className="text-[11px] font-semibold text-rose-dark mb-1">
                  {hobby.sub}
                </p>
                <p className="text-xs text-forest/75 leading-relaxed line-clamp-2">
                  {hobby.desc}
                </p>
              </div>

              <div className="pt-2 mt-2.5 border-t border-[#CAD7C5]/50 flex items-center justify-between text-xs">
                {hobby.link ? (
                  <a
                    href={hobby.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs font-bold text-rose-dark hover:underline flex items-center gap-1"
                  >
                    <span>Baca di Medium</span>
                    <span>↗</span>
                  </a>
                ) : (
                  <span className="text-[10px] font-medium text-forest/50 italic">
                    Creative Expression
                  </span>
                )}
                <span className="w-5 h-5 rounded-full bg-[#E8EFE5] flex items-center justify-center text-[10px] group-hover:bg-rose-blush group-hover:text-rose-dark transition-colors">
                  →
                </span>
              </div>
            </div>
          ))}
        </div>

      </section>

      {/* ========================================================================= */}
      {/* SECTION 8: EDITORIAL COLLABORATION & CONTACT FOOTER (Seamless Design)     */}
      {/* ========================================================================= */}
      <footer id="contact" className="relative max-w-[1380px] mx-auto px-4 sm:px-6 lg:px-8 pt-10 pb-12 sm:pt-12 sm:pb-14 overflow-hidden border-t border-[#CAD7C5]/60 scroll-mt-18">
        
        {/* Soft Ambient Botanical Glows */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-rose-blush/40 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 right-1/4 w-[400px] h-[400px] bg-[#CAD7C5]/30 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 max-w-3xl mx-auto flex flex-col items-center text-center">
          <span className="font-script text-2xl sm:text-3xl text-rose-dark block mb-1">/ Let&apos;s Connect /</span>
          <h2 className="font-serif text-2xl sm:text-4xl lg:text-5xl font-bold leading-[1.18] mb-2.5 text-forest tracking-normal">
            Let&apos;s Cultivate Meaningful{' '}
            <span className="editorial-italic text-rose-dark font-normal">
              Business Growth
            </span>{' '}
            Together.
          </h2>
          <p className="text-xs sm:text-sm text-forest/75 leading-relaxed mb-5 max-w-xl mx-auto font-source">
            Terbuka untuk posisi Management Trainee, Business Development, Strategic Marketing Specialist, serta inisiatif kemitraan baru. Mari berdiskusi bagaimana saya dapat berkontribusi nyata bagi organisasi Anda.
          </p>

          {/* Primary Direct Contact Buttons */}
          <div className="flex flex-col sm:flex-row flex-wrap items-center justify-center gap-2.5 mb-1 w-full sm:w-auto">
            <a
              href={`mailto:${portfolioData.socials.email}`}
              className="w-full sm:w-auto justify-center px-5 py-2.5 rounded-full text-xs sm:text-sm font-bold bg-forest text-[#E8EFE5] hover:bg-rose-dark transition-all flex items-center gap-2 shadow-2xs hover:shadow-xs hover:-translate-y-0.5 cursor-pointer text-center"
            >
              <span>Email: {portfolioData.socials.email}</span>
            </a>
            <a
              href={portfolioData.socials.whatsapp}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full sm:w-auto justify-center px-5 py-2.5 rounded-full text-xs sm:text-sm font-bold bg-rose-dark text-white hover:bg-rose-berry transition-all flex items-center gap-2 shadow-2xs hover:shadow-xs hover:-translate-y-0.5 cursor-pointer text-center"
            >
              <span>WhatsApp Langsung ✦</span>
            </a>
            <a
              href={portfolioData.socials.linkedin}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full sm:w-auto justify-center px-5 py-2.5 rounded-full text-xs sm:text-sm font-bold bg-white text-forest border border-[#CAD7C5] hover:border-forest hover:bg-[#FAFBF8] transition-all flex items-center gap-2 shadow-2xs hover:shadow-xs hover:-translate-y-0.5 cursor-pointer text-center"
            >
              <span>LinkedIn Profile ↗</span>
            </a>
          </div>

          {/* Subtle Hairline Divider */}
          <div className="flex items-center gap-3 my-4 w-full max-w-xs justify-center opacity-60">
            <div className="h-px bg-[#CAD7C5] grow" />
            <span className="text-[10px] uppercase font-mono font-bold tracking-widest text-forest/70">Connect & Social Media</span>
            <div className="h-px bg-[#CAD7C5] grow" />
          </div>

          {/* Official Social Media Brand Icon Buttons */}
          <div className="flex items-center justify-center gap-3">
            {/* Instagram */}
            <a
              href={portfolioData.socials.instagram}
              target="_blank"
              rel="noopener noreferrer"
              title="Instagram: @chikalnazmi"
              aria-label="Instagram Chikal Nazmi"
              className="w-10 h-10 rounded-xl bg-white hover:bg-gradient-to-tr hover:from-[#f09433] hover:via-[#dc2743] hover:to-[#bc1888] border border-[#CAD7C5] hover:border-transparent text-forest hover:text-white flex items-center justify-center transition-all duration-300 hover:scale-105 hover:-translate-y-0.5 shadow-2xs group relative"
            >
              <svg className="w-4 h-4 transition-transform duration-300 group-hover:scale-110" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
              </svg>
              <span className="absolute -bottom-8 opacity-0 group-hover:opacity-100 transition-opacity bg-forest text-white text-[10px] font-mono px-2 py-0.5 rounded pointer-events-none whitespace-nowrap shadow-md z-30">
                Instagram
              </span>
            </a>

            {/* TikTok */}
            <a
              href={portfolioData.socials.tiktok}
              target="_blank"
              rel="noopener noreferrer"
              title="TikTok: @chikalnazmi"
              aria-label="TikTok Chikal Nazmi"
              className="w-10 h-10 rounded-xl bg-white hover:bg-black border border-[#CAD7C5] hover:border-black text-forest hover:text-[#25F4EE] flex items-center justify-center transition-all duration-300 hover:scale-105 hover:-translate-y-0.5 shadow-2xs group relative"
            >
              <svg className="w-4 h-4 transition-transform duration-300 group-hover:scale-110" viewBox="0 0 24 24" fill="currentColor">
                <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64c.298-.002.595.042.88.13V9.4a6.33 6.33 0 0 0-1-.08A6.34 6.34 0 0 0 3 15.66a6.34 6.34 0 0 0 10.86 4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-3.04-1.52z"/>
              </svg>
              <span className="absolute -bottom-8 opacity-0 group-hover:opacity-100 transition-opacity bg-forest text-white text-[10px] font-mono px-2 py-0.5 rounded pointer-events-none whitespace-nowrap shadow-md z-30">
                TikTok
              </span>
            </a>

            {/* YouTube */}
            <a
              href={portfolioData.socials.youtube}
              target="_blank"
              rel="noopener noreferrer"
              title="YouTube: Chikal Nazmi"
              aria-label="YouTube Chikal Nazmi"
              className="w-10 h-10 rounded-xl bg-white hover:bg-[#FF0000] border border-[#CAD7C5] hover:border-[#FF0000] text-forest hover:text-white flex items-center justify-center transition-all duration-300 hover:scale-105 hover:-translate-y-0.5 shadow-2xs group relative"
            >
              <svg className="w-4 h-4 transition-transform duration-300 group-hover:scale-110" viewBox="0 0 24 24" fill="currentColor">
                <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
              </svg>
              <span className="absolute -bottom-8 opacity-0 group-hover:opacity-100 transition-opacity bg-forest text-white text-[10px] font-mono px-2 py-0.5 rounded pointer-events-none whitespace-nowrap shadow-md z-30">
                YouTube
              </span>
            </a>

            {/* Medium */}
            <a
              href={portfolioData.socials.medium}
              target="_blank"
              rel="noopener noreferrer"
              title="Medium: @chikalnazmi"
              aria-label="Medium Chikal Nazmi"
              className="w-10 h-10 rounded-xl bg-white hover:bg-forest border border-[#CAD7C5] hover:border-forest text-forest hover:text-white flex items-center justify-center transition-all duration-300 hover:scale-105 hover:-translate-y-0.5 shadow-2xs group relative"
            >
              <svg className="w-4 h-4 transition-transform duration-300 group-hover:scale-110" viewBox="0 0 24 24" fill="currentColor">
                <path d="M13.54 12a6.8 6.8 0 0 1-6.77 6.82A6.8 6.8 0 0 1 0 12a6.8 6.8 0 0 1 6.77-6.82A6.8 6.8 0 0 1 13.54 12zM20.96 12c0 3.54-1.51 6.42-3.38 6.42-1.87 0-3.39-2.88-3.39-6.42s1.52-6.42 3.39-6.42 3.38 2.88 3.38 6.42M24 12c0 3.17-.53 5.75-1.19 5.75-.66 0-1.19-2.58-1.19-5.75s.53-5.75 1.19-5.75C23.47 6.25 24 8.83 24 12z"/>
              </svg>
              <span className="absolute -bottom-8 opacity-0 group-hover:opacity-100 transition-opacity bg-forest text-white text-[10px] font-mono px-2 py-0.5 rounded pointer-events-none whitespace-nowrap shadow-md z-30">
                Medium
              </span>
            </a>
          </div>
        </div>

        {/* ========================================================================= */}
        {/* EDITORIAL GRAND FINALE FOOTER (Minimalist Editorial Concept)              */}
        {/* ========================================================================= */}
        <div className="w-full max-w-[1380px] mx-auto mt-12 sm:mt-16 pt-8 sm:pt-12 border-t border-[#CAD7C5]/70">
          {/* Top Row: Navigation Links (Left) + Copyright Notice (Right) */}
          <div className="flex flex-col md:flex-row items-center justify-between gap-4 sm:gap-6 pb-6 sm:pb-10 border-b border-[#CAD7C5]/40">
            {/* Left-Aligned Clean Editorial Navigation */}
            <nav className="flex flex-wrap items-center justify-center md:justify-start gap-5 sm:gap-7 lg:gap-8 text-xs sm:text-sm font-sans font-medium text-forest/75">
              <a href="#hero" className="hover:text-rose-dark transition-colors tracking-wide">Home</a>
              <a href="#about" className="hover:text-rose-dark transition-colors tracking-wide">About</a>
              <a href="#experience" className="hover:text-rose-dark transition-colors tracking-wide">Experience</a>
              <a href="#projects" className="hover:text-rose-dark transition-colors tracking-wide">Projects</a>
              <a href="#awards" className="hover:text-rose-dark transition-colors tracking-wide">Awards</a>
              <a href="#contact" className="hover:text-rose-dark transition-colors tracking-wide">Contact</a>
            </nav>

            {/* Right-Aligned Clean Copyright */}
            <div className="text-xs sm:text-[13px] text-forest/60 font-sans tracking-tight text-center md:text-right">
              © {new Date().getFullYear()} Chikal Nazmi Mahira. All rights reserved.
            </div>
          </div>

          {/* Bottom Row: Colossal Editorial Masthead Matching Brand Font */}
          <div className="w-full pt-6 sm:pt-8 pb-2 overflow-hidden select-none">
            <a
              href="#hero"
              className="group block w-full text-left tracking-normal font-serif font-bold text-forest hover:text-rose-dark transition-colors duration-700 leading-[0.88] cursor-pointer whitespace-nowrap overflow-hidden"
              title="Chikal Nazmi Mahira — Kembali ke Atas ↑"
            >
              <span className="block text-[8.5vw] sm:text-[8vw] md:text-[7.8vw] lg:text-[7.5vw] xl:text-[7.2rem] 2xl:text-[8.5rem] transition-transform duration-700 group-hover:translate-x-1.5">
                Chikal Nazmi Mahira
              </span>
            </a>
            <div className="text-[10px] sm:text-xs font-mono font-medium tracking-widest uppercase text-forest/60 mt-2 sm:mt-3">
              Business &amp; Marketing
            </div>
          </div>
        </div>

      </footer>

      {/* ========================================================================= */}
      {/* ========================================================================= */}
      {/* REUSABLE MODAL DIALOG: High-Visibility Interactive Media Showcase         */}
      {/* ========================================================================= */}
      {modalData.isOpen && (() => {
        const currentImg = modalData.images[activeModalPhoto] || modalData.images[0] || '/11.png';
        const hasMultiple = modalData.images.length > 1;

        const handlePrevPhoto = (e: React.MouseEvent) => {
          e.stopPropagation();
          setActiveModalPhoto(prev => (prev > 0 ? prev - 1 : modalData.images.length - 1));
        };

        const handleNextPhoto = (e: React.MouseEvent) => {
          e.stopPropagation();
          setActiveModalPhoto(prev => (prev < modalData.images.length - 1 ? prev + 1 : 0));
        };

        return (
          <div 
            className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 md:p-6 bg-black/85 backdrop-blur-md animate-fadeIn select-none"
            onClick={closeModal}
          >
            <div 
              className="bg-white rounded-2xl sm:rounded-3xl max-w-6xl w-full max-h-[96vh] shadow-2xl border-2 border-[#CAD7C5] p-3.5 sm:p-5 md:p-6 relative flex flex-col md:flex-row gap-4 sm:gap-6 overflow-y-auto md:overflow-hidden"
              onClick={(e) => e.stopPropagation()}
            >
              {/* ================================================================= */}
              {/* LEFT COLUMN: THE EXPANSIVE HERO VISUAL STAGE (64% on Desktop)     */}
              {/* ================================================================= */}
              <div className="w-full md:w-[62%] lg:w-[65%] flex flex-col justify-between h-auto md:h-[84vh] shrink-0">
                {/* Main Image Stage: Expands up to full available height! */}
                <div className="relative w-full flex-1 min-h-[340px] sm:min-h-[440px] md:min-h-0 rounded-2xl overflow-hidden bg-[#182315]/5 border border-[#CAD7C5]/80 flex items-center justify-center group shadow-inner">
                  {/* Soft Ambient Blurred Glow */}
                  <div 
                    className="absolute inset-0 bg-cover bg-center opacity-30 filter blur-3xl scale-125 pointer-events-none transition-all duration-700"
                    style={{ backgroundImage: `url(${currentImg})` }}
                  />

                  {/* The Hero Photo: Uncropped & Maximized in Size */}
                  <img
                    src={currentImg}
                    alt={`${modalData.title} dokumentasi ${activeModalPhoto + 1}`}
                    className="relative z-10 max-w-full max-h-full object-contain p-2 sm:p-3 drop-shadow-xl transition-all duration-300"
                  />

                  {/* Navigation Left Arrow */}
                  {hasMultiple && (
                    <button
                      onClick={handlePrevPhoto}
                      className="absolute left-2.5 sm:left-4 top-1/2 -translate-y-1/2 z-20 w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-white/95 hover:bg-white text-forest hover:text-rose-dark shadow-xl border border-[#CAD7C5] flex items-center justify-center text-xl sm:text-2xl font-bold transition-all hover:scale-110 active:scale-95 cursor-pointer ring-2 ring-black/5"
                      title="Foto Sebelumnya (Panah Kiri)"
                      aria-label="Previous Photo"
                    >
                      ‹
                    </button>
                  )}

                  {/* Navigation Right Arrow */}
                  {hasMultiple && (
                    <button
                      onClick={handleNextPhoto}
                      className="absolute right-2.5 sm:right-4 top-1/2 -translate-y-1/2 z-20 w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-white/95 hover:bg-white text-forest hover:text-rose-dark shadow-xl border border-[#CAD7C5] flex items-center justify-center text-xl sm:text-2xl font-bold transition-all hover:scale-110 active:scale-95 cursor-pointer ring-2 ring-black/5"
                      title="Foto Selanjutnya (Panah Kanan)"
                      aria-label="Next Photo"
                    >
                      ›
                    </button>
                  )}

                  {/* Top Right: Open Original Photo */}
                  <a
                    href={currentImg}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="absolute top-3 right-3 z-20 px-3 py-1.5 rounded-full bg-white/95 hover:bg-white text-forest hover:text-rose-dark text-xs font-bold shadow-md border border-[#CAD7C5]/70 transition-all flex items-center gap-1.5 backdrop-blur-xs"
                    title="Buka foto asli resolusi penuh di tab baru"
                  >
                    <span>Buka Ukuran Asli</span>
                    <span>↗</span>
                  </a>

                  {/* Bottom Left: Live Photo Counter Badge */}
                  <div className="absolute bottom-3 left-3 z-20 px-3.5 py-1 rounded-full bg-black/75 backdrop-blur-md text-white text-[11px] font-mono font-medium shadow-md flex items-center gap-2 border border-white/20">
                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                    <span>Foto {activeModalPhoto + 1} dari {modalData.images.length}</span>
                  </div>
                </div>

                {/* Filmstrip Thumbnails Row (Cleanly docked below the main photo) */}
                {hasMultiple && (
                  <div className="mt-3 shrink-0">
                    <div className="flex items-center gap-2 overflow-x-auto py-1 px-0.5 scrollbar-thin">
                      {modalData.images.map((img, idx) => {
                        const isActive = idx === activeModalPhoto;
                        return (
                          <button
                            key={idx}
                            onClick={() => setActiveModalPhoto(idx)}
                            className={`relative w-20 sm:w-24 aspect-[4/3] rounded-xl overflow-hidden border-2 transition-all shrink-0 cursor-pointer bg-forest/5 ${
                              isActive
                                ? 'border-rose-dark ring-2 ring-rose-dark/30 scale-102 shadow-md'
                                : 'border-[#CAD7C5] opacity-60 hover:opacity-100 hover:border-forest'
                            }`}
                            title={`Lihat Foto ${idx + 1}`}
                          >
                            <img src={img} alt={`Thumbnail ${idx + 1}`} className="w-full h-full object-cover" />
                            <span className={`absolute bottom-1 right-1 px-1.5 py-0.5 rounded text-[8px] font-bold font-mono ${
                              isActive ? 'bg-rose-dark text-white' : 'bg-black/75 text-white'
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

              {/* ================================================================= */}
              {/* RIGHT COLUMN: THE EDITORIAL STORY & ACTION PANEL (36% on Desktop) */}
              {/* ================================================================= */}
              <div className="w-full md:w-[38%] lg:w-[35%] flex flex-col justify-between h-auto md:h-[84vh] pl-0 md:pl-2">
                {/* Narrative & Info Header */}
                <div className="overflow-y-auto pr-1 md:pr-2">
                  {/* Top Action Row: Category + Close Button */}
                  <div className="flex items-center justify-between gap-3 pb-3 mb-3.5 border-b border-[#CAD7C5]/70">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-rose-dark bg-rose-blush/80 border border-rose-dusty/40 px-3 py-1 rounded-full shadow-2xs">
                        {modalData.category}
                      </span>
                    </div>

                    <button
                      onClick={closeModal}
                      className="w-10 h-10 rounded-full bg-[#E8EFE5] hover:bg-rose-dark hover:text-white text-forest flex items-center justify-center transition-all text-lg font-bold shadow-xs cursor-pointer shrink-0"
                      aria-label="Tutup Dialog"
                      title="Tutup Dialog"
                    >
                      ✕
                    </button>
                  </div>

                  {/* Title */}
                  <h3 className="font-serif text-2xl sm:text-3xl font-bold text-forest leading-snug tracking-tight mb-3">
                    {modalData.title}
                  </h3>

                  {/* Narrative Description */}
                  <div className="p-3.5 rounded-2xl bg-[#FAFBF8] border border-[#CAD7C5]/80 mb-4">
                    <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-forest/60 block mb-1">
                      ✦ Rincian &amp; Dokumentasi Kegiatan
                    </span>
                    <p className="text-xs sm:text-[13px] text-forest/85 leading-relaxed font-source">
                      {modalData.description}
                    </p>
                  </div>

                  {/* Interactive Action Card for External Links & Video Documentation */}
                  {(modalData.link || modalData.videoLink) && (
                    <div className="p-3.5 rounded-2xl bg-gradient-to-br from-rose-50/70 via-white to-sage-50/70 border border-[#CAD7C5] mb-4 space-y-2.5 shadow-2xs">
                      <div className="flex items-center gap-1.5 text-[10px] font-bold text-forest tracking-wider uppercase">
                        <span className="w-2 h-2 rounded-full bg-rose-dark animate-pulse" />
                        <span>Tautan Video &amp; Dokumentasi Eksternal</span>
                      </div>

                      {/* Video Link Button */}
                      {modalData.videoLink && (
                        <a
                          href={modalData.videoLink}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="w-full py-2.5 px-3.5 rounded-xl text-xs font-bold bg-rose-dark text-white hover:bg-rose-berry transition-all shadow-xs flex items-center justify-between group cursor-pointer"
                        >
                          <span className="flex items-center gap-2">
                            <span className="w-5 h-5 rounded-full bg-white/20 flex items-center justify-center text-[10px]">▶</span>
                            <span>{modalData.videoLinkLabel || 'Tonton Video Dokumentasi Lomba'}</span>
                          </span>
                          <span className="text-white/80 group-hover:translate-x-1 transition-transform">↗</span>
                        </a>
                      )}

                      {/* Primary / External Link Button */}
                      {modalData.link && (
                        <a
                          href={modalData.link}
                          target="_blank"
                          rel="noopener noreferrer"
                          className={`w-full py-2.5 px-3.5 rounded-xl text-xs font-bold transition-all shadow-xs flex items-center justify-between group cursor-pointer ${
                            !modalData.videoLink
                              ? 'bg-rose-dark text-white hover:bg-rose-berry'
                              : 'bg-white border border-[#CAD7C5] text-forest hover:bg-sage-50/80 hover:border-forest'
                          }`}
                        >
                          <span className="flex items-center gap-2">
                            <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] ${
                              !modalData.videoLink ? 'bg-white/20' : 'bg-forest/10'
                            }`}>
                              {modalData.link.includes('youtube') || modalData.link.includes('youtu.be') ? '▶' : '🔗'}
                            </span>
                            <span>
                              {modalData.linkLabel || (
                                modalData.link.includes('youtube') || modalData.link.includes('youtu.be')
                                  ? 'Tonton Video Dokumentasi'
                                  : 'Buka Tautan Eksternal'
                              )}
                            </span>
                          </span>
                          <span className="group-hover:translate-x-1 transition-transform">↗</span>
                        </a>
                      )}
                    </div>
                  )}

                  {/* Key Navigation Info */}
                  <div className="p-3 rounded-xl bg-[#E8EFE5]/40 border border-[#CAD7C5]/60 mb-4 text-xs text-forest/75 space-y-1.5">
                    <div className="flex items-center gap-2">
                      <span className="text-rose-dark font-bold text-xs">✔</span>
                      <span className="text-[11px] font-medium">
                        Foto ditampilkan dalam rasio asli tanpa distorsi / cropping
                      </span>
                    </div>
                    <div className="flex items-center gap-2 text-[10px] text-forest/60 font-mono">
                      <span>⌨</span>
                      <span>Navigasi: tombol panah ‹ › di keyboard</span>
                    </div>
                  </div>
                </div>

                {/* Bottom Sticky Action Footer */}
                <div className="pt-3 mt-3 border-t border-[#CAD7C5]/70 flex flex-col gap-2 shrink-0">
                  <button
                    onClick={closeModal}
                    className="w-full py-2.5 px-4 rounded-xl text-xs font-bold bg-forest text-[#E8EFE5] hover:bg-rose-dark transition-colors shadow-xs cursor-pointer text-center"
                  >
                    Tutup Dialog [ESC]
                  </button>
                </div>
              </div>

            </div>
          </div>
        );
      })()}

    </div>
  );
}
