'use client';

import React, { useState, useEffect } from 'react';
import { 
  getPortfolioData, 
  fetchPortfolioDataFromSupabase,
  subscribeToPortfolioUpdates, 
  DEFAULT_PORTFOLIO_DATA, 
  PortfolioData 
} from '@/lib/portfolio-store';


function BotanicalDivider() {
  return (
    <div className="w-full flex items-center justify-center my-6 sm:my-10 pointer-events-none select-none max-w-[1560px] mx-auto px-4">
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
  // Active photo index for each organization card
  const [orgPhotoIndex, setOrgPhotoIndex] = useState<{ [key: number]: number }>({ 0: 0, 1: 0, 2: 0, 3: 0, 4: 0 });

  // Auto-slide documentation photos every 3 seconds without manual clicks
  useEffect(() => {
    const photoTimer = setInterval(() => {
      setOrgPhotoIndex(prev => {
        const nextState = { ...prev };
        organizationList.forEach((_, idx) => {
          const totalPhotos = organizationList[idx].images.length;
          nextState[idx] = ((prev[idx] || 0) + 1) % totalPhotos;
        });
        return nextState;
      });
    }, 3000);

    return () => clearInterval(photoTimer);
  }, []);

  // Active photo index inside Landscape Modal Dialog
  const [activeModalPhoto, setActiveModalPhoto] = useState(0);

  // Modal open helper
  const openModal = (
    title: string, 
    category: string, 
    description: string, 
    images: string[],
    link?: string,
    linkLabel?: string
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
      badgeColor: 'bg-emerald-100 text-emerald-900 border-emerald-300',
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
      badgeColor: 'bg-rose-100 text-rose-900 border-rose-300',
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
      badgeColor: 'bg-amber-100 text-amber-900 border-amber-300',
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
      badgeColor: 'bg-blue-100 text-blue-900 border-blue-300',
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
      badgeColor: 'bg-purple-100 text-purple-900 border-purple-300',
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
      badgeColor: 'bg-rose-100 text-rose-900 border-rose-300',
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

  // 7 Trophy Case Awards Data
  const defaultAwardsList = [
    {
      year: '2024',
      rank: '1st Winner',
      rankBadge: 'bg-rose-dark text-white',
      title: 'National Fest Business Plan Competition 2024',
      organizer: 'Fakultas Ekonomi dan Bisnis, Universitas Islam Malang',
      scope: 'Tingkat Nasional',
      desc: 'Juara 1 dalam perancangan ide dan rencana bisnis mahasiswa tingkat nasional.',
      certImg: '/11.png',
      eventImg: '/12.png',
      link: 'https://unisma.ac.id',
      linkLabel: 'Liputan Berita Unisma ↗',
    },
    {
      year: '2024',
      rank: 'Top 5 Finalist',
      rankBadge: 'bg-rose-dusty text-white',
      title: 'National Business Plan Competition (BPC) 2024',
      organizer: 'Universitas Negeri Padang',
      scope: 'Tingkat Nasional',
      desc: 'Masuk jajaran 5 proposal bisnis terpilih pada kompetisi tingkat nasional.',
      certImg: '/13.png',
      eventImg: '/14.png',
      link: 'https://unp.ac.id',
      linkLabel: 'Warta Kompetisi UNP ↗',
    },
    {
      year: '2023',
      rank: '1st Winner',
      rankBadge: 'bg-rose-dark text-white',
      title: 'Lomba Business Plan Mahasiswa 2023',
      organizer: 'Politeknik Negeri Malang',
      scope: 'Tingkat Institusi',
      desc: 'Meraih Juara 1 dalam kompetisi business plan mahasiswa tingkat kampus.',
      certImg: '/15.png',
      eventImg: '/16.png',
      link: 'https://polinema.ac.id',
      linkLabel: 'Pengumuman Resmi Polinema ↗',
    },
    {
      year: '2023',
      rank: 'Top 5 Finalist',
      rankBadge: 'bg-rose-dusty text-white',
      title: 'National Business Plan Competition 2023',
      organizer: 'Universitas Brawijaya',
      scope: 'Tingkat Nasional',
      desc: 'Finalis 5 besar dalam kompetisi rencana bisnis mahasiswa nasional.',
      certImg: '/17.png',
      eventImg: '/11.png',
      link: 'https://ub.ac.id',
      linkLabel: 'Rilis Berita UB ↗',
    },
    {
      year: '2023',
      rank: '2nd Winner',
      rankBadge: 'bg-forest text-white',
      title: 'National Fest Business Plan Competition 2023',
      organizer: 'Fakultas Ekonomi dan Bisnis, Universitas Islam Malang',
      scope: 'Tingkat Nasional',
      desc: 'Juara 2 dalam perumusan ide dan strategi pemasaran produk.',
      certImg: '/12.png',
      eventImg: '/13.png',
      link: 'https://unisma.ac.id',
      linkLabel: 'Arsip Berita Nasional ↗',
    },
    {
      year: '2022',
      rank: '2nd Winner',
      rankBadge: 'bg-forest text-white',
      title: 'Business Plan Competition Nasional 2022',
      organizer: 'Universitas Muhammadiyah Malang',
      scope: 'Tingkat Nasional',
      desc: 'Juara 2 dalam perancangan proposal bisnis kreatif mahasiswa.',
      certImg: '/14.png',
      eventImg: '/15.png',
      link: 'https://umm.ac.id',
      linkLabel: 'Publikasi UMM ↗',
    },
    {
      year: '2022',
      rank: 'Best Speaker',
      rankBadge: 'bg-rose-dark text-white',
      title: 'National Business Plan Competition 2022',
      organizer: 'Universitas Negeri Surabaya',
      scope: 'Tingkat Nasional',
      desc: 'Penghargaan Pembicara Terbaik dalam presentasi bisnis dan sesi tanya jawab.',
      certImg: '/16.png',
      eventImg: '/17.png',
      link: 'https://unesa.ac.id',
      linkLabel: 'Dokumentasi Unesa ↗',
    },
  ];

  const awardsList = (portfolioData.awards && portfolioData.awards.length > 0)
    ? portfolioData.awards
    : defaultAwardsList;

  // Dynamic filter for Trophy Case Mosaic
  const filteredAwards = awardsList.filter(award => {
    if (awardFilter === 'all') return true;
    if (awardFilter === '1st') return award.rank.includes('1st');
    if (awardFilter === '2nd') return award.rank.includes('2nd');
    if (awardFilter === 'top5') return award.rank.includes('Top 5');
    if (awardFilter === 'speaker') return award.rank.includes('Speaker');
    return true;
  });

  // 5 Organization Roles Data (Authentic & Grounded)
  const organizationList = [
    {
      period: '2024 - Sekarang',
      role: 'Google Student Ambassador',
      institution: 'Google Developer Student Clubs (GDSC) Polinema',
      tag: 'Campus Leadership & Tech Community',
      desc: 'Representatif ekosistem Google di kampus, memfasilitasi sesi pengenalan teknologi dan kegiatan komunitas mahasiswa.',
      highlights: ['Google Ecosystem', 'Tech Workshops', 'Komunitas Mahasiswa'],
      images: ['/11.png', '/12.png', '/10.png'],
    },
    {
      period: '2023 - 2024',
      role: 'Vice Chairwoman (Wakil Ketua Himpunan)',
      institution: 'Himpunan Mahasiswa Teknologi Informasi (HMTI) Polinema',
      tag: 'Executive Governance',
      desc: 'Membantu koordinasi lintas divisi dan mendukung kelancaran pelaksanaan program kerja mahasiswa Jurusan TI.',
      highlights: ['Koordinasi Divisi', 'Program Kerja Mahasiswa', 'Aspirasi Mahasiswa'],
      images: ['/13.png', '/14.png', '/1.png'],
    },
    {
      period: '2023',
      role: 'Secretary of General Election',
      institution: 'Komisi Pemilihan Umum Mahasiswa Jurusan TI',
      tag: 'Administrative & Electoral Governance',
      desc: 'Mengelola tata kelola administrasi, surat-menyurat, dan dokumentasi pada pemilihan umum raya himpunan mahasiswa.',
      highlights: ['Administrasi Pemilu', 'Verifikasi Berkas', 'Dokumentasi Acara'],
      images: ['/15.png', '/16.png', '/3.png'],
    },
    {
      period: '2023',
      role: 'Chief Executive of New Student Orientation',
      institution: 'PKKMB Mahasiswa Baru Jurusan TI Polinema',
      tag: 'Operations & Event Leadership',
      desc: 'Mengkoordinasikan kepanitiaan dalam penyelenggaraan orientasi mahasiswa baru jurusan TI.',
      highlights: ['Koordinasi Panitia', 'Alur Acara', 'Penyambutan Mahasiswa Baru'],
      images: ['/17.png', '/11.png', '/4.png'],
    },
    {
      period: '2022 - 2023',
      role: 'Store Staff & Merchandise Logistics',
      institution: 'UKM Korps Protokoler Mahasiswa (KPM) Polinema',
      tag: 'Retail & Inventory Management',
      desc: 'Membantu pengelolaan stok merchandise dan pencatatan transaksi kasir seragam UKM.',
      highlights: ['Merchandise Organisasi', 'Pelayanan Transaksi', 'Pencatatan Kasir'],
      images: ['/12.png', '/13.png', '/5.png'],
    },
  ];

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
      {/* Decorative Subtle Background Botanical Glows */}
      <div className="fixed top-0 left-0 w-[550px] h-[550px] bg-rose-blush/30 rounded-full blur-3xl pointer-events-none -translate-x-1/2 -translate-y-1/2" />
      <div className="fixed bottom-0 right-0 w-[650px] h-[650px] bg-[#CAD7C5]/40 rounded-full blur-3xl pointer-events-none translate-x-1/3 translate-y-1/3" />

      {/* ========================================================================= */}
      {/* NAVBAR: Modern Floating Editorial Pill */}
      {/* ========================================================================= */}
      <nav className="sticky top-4 z-40 max-w-[1560px] mx-auto px-4 sm:px-8 lg:px-12 xl:px-16">
        <div className="bg-white/85 backdrop-blur-md border border-[#CAD7C5] rounded-full px-5 py-3 shadow-sm flex items-center justify-between transition-all hover:border-rose-dusty/40">
          <a href="#hero" className="flex items-center gap-2.5 group">
            <span className="w-8 h-8 rounded-full bg-forest text-[#E8EFE5] flex items-center justify-center font-serif text-sm font-bold group-hover:bg-rose-dark transition-colors">
              CN
            </span>
            <div className="flex flex-col">
              <span className="font-serif font-bold text-sm tracking-normal text-forest group-hover:text-rose-dark transition-colors">
                Chikal Nazmi Mahira
              </span>
              <span className="text-[10px] font-medium tracking-wider uppercase text-forest/70">
                Business & Marketing
              </span>
            </div>
          </a>

          {/* Desktop Nav Links */}
          <div className="hidden md:flex items-center gap-5 lg:gap-6 text-xs font-semibold tracking-wider uppercase text-forest/80">
            <a href="#academy-skills" className="hover:text-rose-dark transition-colors">
              Academy & Skills
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
              Creative & Content
            </a>
          </div>

          {/* Action CTA */}
          <div className="hidden sm:flex items-center gap-3">
            <a
              href="https://wa.me/6281234567890?text=Halo%20Chikal,%20saya%20tertarik%20berdiskusi%20mengenai%20peluang%20kerjasama."
              target="_blank"
              rel="noopener noreferrer"
              className="px-4 py-1.5 rounded-full text-xs font-semibold bg-rose-dark text-white hover:bg-rose-berry transition-colors shadow-sm"
            >
              Let&apos;s Connect ↗
            </a>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 text-forest hover:text-rose-dark"
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

        {/* Mobile Dropdown */}
        {mobileMenuOpen && (
          <div className="md:hidden mt-2 bg-white/95 backdrop-blur-md border border-[#CAD7C5] rounded-2xl p-4 shadow-lg flex flex-col gap-3 text-sm font-medium text-forest">
            <a href="#academy-skills" onClick={() => setMobileMenuOpen(false)} className="py-1 hover:text-rose-dark">
              Academy & Skills
            </a>
            <a href="#experience" onClick={() => setMobileMenuOpen(false)} className="py-1 hover:text-rose-dark">
              Experience
            </a>
            <a href="#projects" onClick={() => setMobileMenuOpen(false)} className="py-1 hover:text-rose-dark">
              Projects
            </a>
            <a href="#recognition" onClick={() => setMobileMenuOpen(false)} className="py-1 hover:text-rose-dark">
              Awards (7)
            </a>
            <a href="#leadership" onClick={() => setMobileMenuOpen(false)} className="py-1 hover:text-rose-dark">
              Leadership
            </a>
            <a href="#certifications" onClick={() => setMobileMenuOpen(false)} className="py-1 hover:text-rose-dark">
              Certifications
            </a>
            <a href="#creative" onClick={() => setMobileMenuOpen(false)} className="py-1 hover:text-rose-dark">
              Creative & Content
            </a>
            <a
              href="https://wa.me/6281234567890"
              target="_blank"
              rel="noopener noreferrer"
              className="mt-2 text-center py-2 rounded-xl bg-rose-dark text-white text-xs font-semibold"
            >
              Hubungi via WhatsApp ↗
            </a>
          </div>
        )}
      </nav>

      {/* ========================================================================= */}
      {/* HERO SECTION: Asymmetric Editorial Split (No Hilman Blueprint) */}
      {/* ========================================================================= */}
      <section id="hero" className="max-w-[1560px] mx-auto px-4 sm:px-8 lg:px-12 xl:px-16 pt-12 pb-16 lg:pt-16 lg:pb-24">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          
          {/* Left Column: Narrative, Typography & Direct Metrics (7 Cols) */}
          <div className="lg:col-span-7 flex flex-col items-start">
            
            {/* Live Availability Pill */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/80 border border-[#CAD7C5] text-forest text-xs font-medium mb-6 shadow-xs">
              <span className="w-2 h-2 rounded-full bg-emerald-600 animate-pulse" />
              <span>{portfolioData.hero?.subheadline || 'Available for Management Trainee & BizDev Roles'}</span>
            </div>

            {/* Editorial Headline */}
            <h1 className="font-serif text-4xl sm:text-5xl lg:text-6xl font-bold leading-[1.18] text-forest tracking-normal mb-6">
              {portfolioData.hero?.headline || (
                <>
                  Cultivating Growth through{' '}
                  <span className="editorial-italic text-rose-dark font-normal">
                    Analytical Strategy
                  </span>{' '}
                  & Creative Tenacity.
                </>
              )}
            </h1>

            {/* Value Proposition Subtext */}
            <p className="text-base sm:text-lg text-forest/80 leading-relaxed font-normal max-w-xl mb-8">
              {portfolioData.hero?.bio || (
                <>
                  Halo, saya <span className="font-semibold text-forest">Chikal Nazmi Mahira</span>. Mahasiswi / Lulusan D4 Sistem Informasi Bisnis Politeknik Negeri Malang yang berfokus pada operasional bisnis, public relations, dan pembuatan konten kreatif.
                </>
              )}
            </p>

            {/* Metrics Ribbon (Clean Statistical Grid) */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 w-full max-w-xl mb-8">
              <div className="bg-white/70 border border-[#CAD7C5] rounded-xl p-3 text-center">
                <span className="block font-serif text-2xl font-bold text-rose-dark">{portfolioData.hero?.stat1Value || '7x'}</span>
                <span className="text-[11px] text-forest/70 uppercase tracking-wider font-medium">{portfolioData.hero?.stat1Label || 'National Awards'}</span>
              </div>
              <div className="bg-white/70 border border-[#CAD7C5] rounded-xl p-3 text-center">
                <span className="block font-serif text-2xl font-bold text-rose-dark">{portfolioData.hero?.stat2Value || '+2.089%'}</span>
                <span className="text-[11px] text-forest/70 uppercase tracking-wider font-medium">{portfolioData.hero?.stat2Label || 'Reels Reach Surge'}</span>
              </div>
              <div className="bg-white/70 border border-[#CAD7C5] rounded-xl p-3 text-center">
                <span className="block font-serif text-2xl font-bold text-forest">{portfolioData.hero?.stat3Value || '20+'}</span>
                <span className="text-[11px] text-forest/70 uppercase tracking-wider font-medium">{portfolioData.hero?.stat3Label || 'Event Partners'}</span>
              </div>
              <div className="bg-white/70 border border-[#CAD7C5] rounded-xl p-3 text-center">
                <span className="block font-serif text-2xl font-bold text-forest">{portfolioData.hero?.stat4Value || 'D4 SIB'}</span>
                <span className="text-[11px] text-forest/70 uppercase tracking-wider font-medium">{portfolioData.hero?.stat4Label || 'Polinema Honor'}</span>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-wrap items-center gap-4">
              <a
                href="#projects"
                className="px-6 py-3 rounded-full text-sm font-semibold bg-rose-dark text-white hover:bg-rose-berry transition-all shadow-md hover:shadow-lg flex items-center gap-2"
              >
                <span>Explore Selected Works</span>
                <span>↓</span>
              </a>
              <a
                href="mailto:chikalnazmi@gmail.com"
                className="px-6 py-3 rounded-full text-sm font-semibold bg-white/80 border border-[#CAD7C5] text-forest hover:bg-white hover:border-rose-dusty transition-all flex items-center gap-2"
              >
                <span>Email Inquiries</span>
                <span>→</span>
              </a>
            </div>

          </div>

          {/* Right Column: Modern Arch Frame Portrait & Strategic Highlights (5 Cols) */}
          <div className="lg:col-span-5 flex justify-center lg:justify-end">
            <div className="relative w-full max-w-[340px] sm:max-w-[380px]">
              
              {/* Modern Arch Frame Container */}
              <div className="relative bg-[#CAD7C5]/30 p-2.5 rounded-t-[160px] rounded-b-[32px] border-2 border-[#CAD7C5] shadow-xl">
                <div className="relative w-full aspect-[4/5] rounded-t-[150px] rounded-b-[24px] overflow-hidden bg-forest/10">
                  <img
                    src={portfolioData.hero?.avatarImg || '/2.png'}
                    alt="Chikal Nazmi Mahira"
                    className="w-full h-full object-cover object-top hover:scale-105 transition-transform duration-700"
                  />
                  {/* Subtle gradient overlay at bottom */}
                  <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-forest/50 to-transparent pointer-events-none" />
                </div>
              </div>

              {/* Floating Pill: Strategic Strengths */}
              <div className="absolute -bottom-6 -left-4 sm:-left-6 bg-white/95 backdrop-blur-md border border-[#CAD7C5] p-3.5 rounded-2xl shadow-lg max-w-[240px]">
                <div className="flex items-center gap-2 mb-1.5">
                  <span className="w-2 h-2 rounded-full bg-rose-dark" />
                  <span className="text-[11px] font-bold uppercase tracking-wider text-rose-dark">Key Competencies</span>
                </div>
                <p className="text-xs text-forest font-medium leading-snug">
                  Data-Driven Marketing • Operational SOPs • Cross-Functional Leadership
                </p>
              </div>

              {/* Botanical Monogram Stamp */}
              <div className="absolute -top-3 -right-3 w-12 h-12 rounded-full bg-rose-blush border border-rose-dusty/50 flex items-center justify-center text-rose-dark font-serif font-bold text-xs shadow-md rotate-12">
                CNM
              </div>

            </div>
          </div>

        </div>
      </section>

      {/* ========================================================================= */}
      {/* BRAND & ECOSYSTEM TICKER: Subtle Editorial Tape */}
      {/* ========================================================================= */}
      <section className="w-full py-5 border-y border-[#CAD7C5]/50 bg-white/35 backdrop-blur-xs overflow-hidden select-none">
        <div className="relative w-full overflow-hidden [mask-image:_linear-gradient(to_right,transparent_0,_black_64px,_black_calc(100%-64px),transparent_100%)]">
          <div className="animate-marquee flex items-center gap-10 sm:gap-14 whitespace-nowrap py-1">
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
      </section>

      {/* ========================================================================= */}
      {/* SECTION: ACADEMIC BACKGROUND & SPOTLIGHT SKILLS CARD (Paired Side-by-Side) */}
      {/* ========================================================================= */}
      <BotanicalDivider />
      <section id="academy-skills" className="max-w-[1560px] mx-auto px-4 sm:px-8 lg:px-12 xl:px-16 py-16 sm:py-20">
        
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-12">
          <span className="font-script text-3xl sm:text-4xl text-rose-dark block mb-1">/ Foundations & Capabilities /</span>
          <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold text-forest tracking-normal mb-2.5">
            Academic Background & Core Skills
          </h2>
          <p className="text-xs sm:text-sm text-forest/75 leading-relaxed font-source">
            Kombinasi latar belakang pendidikan formal sistem informasi bisnis dan keahlian praktis lintas disiplin yang teruji.
          </p>
        </div>

        {/* 2-Column Responsive Grid: Formal Degree on Left, Spotlight Skills on Right */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-stretch">
          
          {/* LEFT: Formal Academic & Language Anchor Card (Matching Screenshot 2) */}
          <div className="lg:col-span-5 bg-gradient-to-br from-white via-white/95 to-[#E8EFE5]/60 border border-[#CAD7C5] rounded-[2.5rem] p-6 sm:p-8 shadow-sm hover:shadow-md transition-all flex flex-col justify-between group">
            <div>
              {/* Header Badge */}
              <div className="flex items-center justify-between gap-2 mb-4">
                <span className="text-[10px] font-bold px-3 py-1 rounded-full bg-rose-blush/80 text-rose-dark border border-rose-dusty/40 uppercase tracking-wider shadow-2xs">
                  {academicData.badge?.replace('', '').trim() || 'FORMAL DEGREE'}
                </span>
                <span className="text-xs font-mono font-bold text-forest/60">
                  {academicData.period || '2020 – 2024'}
                </span>
              </div>

              {/* Title & Institution */}
              <h3 className="font-serif text-2xl sm:text-3xl font-bold text-forest mb-1.5 group-hover:text-rose-dark transition-colors tracking-tight">
                {academicData.degree}
              </h3>
              <h4 className="text-xs font-subheader text-forest/70 uppercase tracking-wide mb-6">
                {academicData.institution}
              </h4>

              {/* Key Credentials Badges (IPK & TOEIC Score 775) */}
              <div className="space-y-3 mb-6">
                <div className="flex items-center gap-3.5 p-3.5 rounded-2xl bg-white border border-[#CAD7C5]/70 shadow-2xs">
                  <div className="w-10 h-10 rounded-xl bg-forest text-[#E8EFE5] flex items-center justify-center text-xs font-bold shrink-0 font-mono">
                    GPA
                  </div>
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-forest/60 block">
                      {academicData.gpaTitle || 'ACADEMIC STANDING'}
                    </span>
                    <span className="text-xs sm:text-sm font-bold text-forest">
                      {academicData.gpaValue || 'IPK Memuaskan / Cum Laude Honor'}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-3.5 p-3.5 rounded-2xl bg-white border border-[#CAD7C5]/70 shadow-2xs">
                  <div className="w-10 h-10 rounded-xl bg-rose-dark text-white flex items-center justify-center text-xs font-bold shrink-0 font-mono">
                    EN
                  </div>
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-rose-dark block">
                      {academicData.toeicTitle || 'GLOBAL ENGLISH PROFICIENCY'}
                    </span>
                    <span className="text-xs sm:text-sm font-bold text-forest">
                      Official TOEIC Score: <span className="text-rose-dark font-extrabold">{academicData.toeicScore || '775'}</span> ({academicData.toeicLevel || 'Working Proficiency'})
                    </span>
                  </div>
                </div>
              </div>

              {/* Focus Summary */}
              <p className="text-xs sm:text-sm text-forest/80 leading-relaxed font-source mb-6">
                {academicData.description}
              </p>
            </div>

            {/* Action Trigger */}
            <button
              onClick={() => openModal(
                academicData.degree,
                `${academicData.institution} (${academicData.period})`,
                academicData.description,
                academicData.images && academicData.images.length > 0 ? academicData.images : ['/11.png', '/12.png', '/16.png']
              )}
              className="w-full py-3 rounded-full bg-forest text-[#E8EFE5] hover:bg-rose-dark text-xs font-bold shadow-xs hover:shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer mt-2"
            >
              <span>Buka Dokumen Kelulusan & TOEIC</span>
              <span>↗</span>
            </button>
          </div>

          {/* RIGHT: The 1 Centered Aesthetic Spotlight Skills Card (Matching Screenshot 1) */}
          <div className="lg:col-span-7 bg-white/95 border border-[#CAD7C5] rounded-[2.5rem] p-6 sm:p-8 shadow-sm hover:shadow-md transition-all text-forest relative flex flex-col justify-between group">
            <div>
              {/* Top Badge & Dossier Tag */}
              <div className="flex items-center justify-between gap-2 mb-6">
                <span className="text-[10px] font-bold px-3 py-1 rounded-full bg-rose-blush/80 text-rose-dark border border-rose-dusty/40 uppercase tracking-wider shadow-2xs">
                  CORE COMPETENCIES MATRIX
                </span>
                <span className="text-xs font-serif italic text-rose-dark/70 font-bold tracking-wider">
                  Dossier
                </span>
              </div>

              {/* Technical Skills Header */}
              <h3 className="font-serif text-2xl sm:text-3xl font-bold text-forest mb-4 tracking-tight">
                Technical Skills
              </h3>

              {/* Subdivided Domains: IT, Business, Creative — Fully dynamic from store! */}
              <div className="space-y-4 mb-6">
                {/* IT / Tech */}
                <div>
                  <span className="block text-[10px] font-bold uppercase tracking-wider text-forest/60 mb-1.5 flex items-center gap-1.5">
                    <span className="text-rose-dusty">✦</span>
                    <span>IT & Digital Systems</span>
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {itSkills.map((skill, sIdx) => (
                      <span
                        key={sIdx}
                        className="inline-block px-3 py-1 rounded-full border border-forest/30 bg-white/80 text-[11px] font-medium text-forest shadow-2xs hover:border-forest transition-colors"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Business */}
                <div>
                  <span className="block text-[10px] font-bold uppercase tracking-wider text-forest/60 mb-1.5 flex items-center gap-1.5">
                    <span className="text-rose-dusty">✦</span>
                    <span>Business & Operations</span>
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {bizSkills.map((skill, sIdx) => (
                      <span
                        key={sIdx}
                        className="inline-block px-3 py-1 rounded-full border border-forest/30 bg-white/80 text-[11px] font-medium text-forest shadow-2xs hover:border-forest transition-colors"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Creative */}
                <div>
                  <span className="block text-[10px] font-bold uppercase tracking-wider text-forest/60 mb-1.5 flex items-center gap-1.5">
                    <span className="text-rose-dusty">✦</span>
                    <span>Creative & Media</span>
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {creativeSkills.map((skill, sIdx) => (
                      <span
                        key={sIdx}
                        className="inline-block px-3 py-1 rounded-full border border-forest/30 bg-white/80 text-[11px] font-medium text-forest shadow-2xs hover:border-forest transition-colors"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Personal Skills Header */}
              <h3 className="font-serif text-2xl sm:text-3xl font-bold text-forest mb-3 tracking-tight">
                Personal Skills
              </h3>

              {/* Big Pill Marquee Badge */}
              <div className="inline-block w-full text-center px-4 py-2 rounded-full border border-forest/30 bg-white/85 text-xs font-bold text-forest shadow-2xs mb-4">
                Creative — Openness — Teamwork
              </div>

              {/* Bulleted Strengths */}
              <div className="space-y-2 text-xs text-forest/90 font-medium pl-1 mb-6">
                {personalSkills.map((skill, pIdx) => (
                  <div key={pIdx} className="flex items-center gap-2.5">
                    <span className="w-2 h-2 rounded-full bg-rose-dark shrink-0" />
                    <span>{skill}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Bottom QR & Connect Widget */}
            <div className="pt-3 border-t border-rose-300/60 flex items-center justify-between gap-3 bg-white/70 p-3.5 rounded-2xl border border-rose-200/90 shadow-2xs">
              <div className="flex items-center gap-3">
                <div className="w-11 h-11 rounded-xl bg-white p-1 border border-forest/25 shadow-2xs shrink-0 flex items-center justify-center">
                  <svg viewBox="0 0 24 24" className="w-9 h-9 text-forest" fill="currentColor">
                    <path d="M2 2h8v8H2V2zm2 2v4h4V4H4zm10-2h8v8h-8V2zm2 2v4h4V4h-4zM2 14h8v8H2v-8zm2 2v4h4v-4H4zm14 0h4v2h-4v-2zm-4 0h2v4h-2v-4zm4 4h4v2h-4v-2zm-2-2h2v2h-2v-2zm-2 2h2v2h-2v-2zm6 0h2v2h-2v-2z" />
                  </svg>
                </div>
                <div>
                  <span className="text-[9px] font-mono uppercase text-forest/60 block font-bold tracking-wider">
                    Portfolio Quick QR
                  </span>
                  <span className="text-xs font-bold text-forest">
                    Chikal Nazmi
                  </span>
                </div>
              </div>

              <a
                href={portfolioData.socials?.whatsapp || "https://wa.me/6281234567890"}
                target="_blank"
                rel="noopener noreferrer"
                className="px-3.5 py-1.5 rounded-full border border-forest/30 bg-white text-[11px] font-bold text-rose-dark hover:bg-forest hover:text-white transition-all shadow-2xs shrink-0"
              >
                Scan me! ↗
              </a>
            </div>

          </div>

        </div>

      </section>

      {/* ========================================================================= */}
      {/* SECTION: WORK & BUSINESS EXPERIENCE (Pengalaman Kerja Otentik)            */}
      {/* ========================================================================= */}
      <BotanicalDivider />
      <section id="experience" className="max-w-[1560px] mx-auto px-4 sm:px-8 lg:px-12 xl:px-16 py-20 border-t border-[#CAD7C5]/80">
        
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-10">
          <span className="font-script text-3xl sm:text-4xl text-rose-dark block mb-1">/ Career & Experience /</span>
          <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold text-forest tracking-normal mb-3">
            Work & Business Experience <span className="font-serif italic font-normal text-rose-dark text-2xl sm:text-3xl lg:text-4xl block sm:inline sm:ml-2">Pushing Boundaries since 2020</span>
          </h2>
          <p className="text-sm sm:text-base text-forest/75 leading-relaxed font-source">
            Pengalaman kerja nyata dalam standardisasi operasional, pertumbuhan brand mandiri, kemitraan event komersial, serta riset automasi software.
          </p>
        </div>

        {/* 2-Grid Layout Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-stretch">
          {experiencesList.map((exp) => (
            <div
              key={exp.id}
              className="bg-white/95 backdrop-blur-sm border border-[#CAD7C5] rounded-3xl p-5 sm:p-6 shadow-sm hover:shadow-md hover:border-rose-dusty/50 transition-all flex flex-col justify-between group"
            >
              <div>
                {/* Card Header Info */}
                <div className="flex items-center justify-between gap-2 mb-3">
                  <span className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full border ${exp.badgeColor || 'bg-emerald-100 text-emerald-900 border-emerald-300'} uppercase tracking-wider`}>
                    {exp.tag}
                  </span>
                  <span className="text-xs text-forest/60 font-medium font-mono">
                    {exp.period}
                  </span>
                </div>

                <h3 className="font-serif text-xl sm:text-2xl font-bold text-forest mb-3 group-hover:text-rose-dark transition-colors">
                  {exp.title}
                </h3>

                {/* Direct Multi-Photo Mini Gallery */}
                <div className="relative mb-4 overflow-hidden rounded-2xl border border-[#CAD7C5]/70 bg-[#E8EFE5]/40 p-1.5">
                  <div className="grid grid-cols-12 gap-1.5 aspect-[16/9]">
                    {/* Foto Utama (7 Kolom) */}
                    <div className="col-span-7 relative overflow-hidden rounded-xl bg-forest/5">
                      <img
                        src={exp.image}
                        alt={exp.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                      <span className="absolute bottom-1.5 left-1.5 bg-forest/80 backdrop-blur-xs text-white text-[9px] font-medium px-2 py-0.5 rounded-full">
                        Dokumentasi Primer
                      </span>
                    </div>
                    {/* Foto Pendukung (5 Kolom) */}
                    <div className="col-span-5 relative overflow-hidden rounded-xl bg-forest/5">
                      <img
                        src={exp.extraImages?.[1] || exp.image}
                        alt={`${exp.title} dokumentasi tambahan`}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                      <span className="absolute bottom-1.5 right-1.5 bg-rose-dark/85 backdrop-blur-xs text-white text-[9px] font-medium px-2 py-0.5 rounded-full">
                        Foto Kerja
                      </span>
                    </div>
                  </div>

                  {/* Quick Hover Action */}
                  <div 
                    onClick={() => openModal(exp.title, `${exp.tag} • ${exp.period}`, exp.summary, exp.extraImages && exp.extraImages.length > 0 ? exp.extraImages : [exp.image], exp.link, exp.linkLabel)}
                    className="absolute inset-0 bg-forest/30 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center cursor-pointer"
                  >
                    <span className="px-3.5 py-1.5 rounded-full bg-white text-forest text-xs font-semibold shadow-md">
                      Buka Galeri Lengkap ({exp.extraImages?.length || 1} Foto)
                    </span>
                  </div>
                </div>

                {/* Summary */}
                <p className="text-xs sm:text-sm text-forest/80 leading-relaxed mb-4 font-source">
                  {exp.summary}
                </p>

                {/* Highlights / Key Focus Tags */}
                <div className="flex flex-wrap gap-2 mb-5 font-source">
                  {exp.results?.map((res, rIdx) => (
                    <span
                      key={rIdx}
                      className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#FAFBF8] border border-[#CAD7C5]/70 text-[11px] font-medium text-forest shadow-2xs"
                    >
                      <span className="w-1.5 h-1.5 rounded-full bg-rose-dusty shrink-0" />
                      <span>{res}</span>
                    </span>
                  ))}
                </div>
              </div>

              {/* Bottom Trigger Button & Link */}
              <div className="pt-3 border-t border-[#CAD7C5]/50 flex flex-wrap items-center justify-between gap-2">
                <button
                  onClick={() => openModal(exp.title, `${exp.tag} • ${exp.period}`, exp.summary, exp.extraImages && exp.extraImages.length > 0 ? exp.extraImages : [exp.image], exp.link, exp.linkLabel)}
                  className="inline-flex items-center gap-1 text-xs font-bold text-rose-dark hover:text-rose-berry transition-colors cursor-pointer"
                >
                  <span>Lihat Dokumentasi Kerja</span>
                  <span>→</span>
                </button>

                {exp.link && (
                  <a
                    href={exp.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 text-xs font-bold text-forest/80 hover:text-forest transition-colors bg-[#E8EFE5] hover:bg-[#CAD7C5] px-3 py-1 rounded-full border border-[#CAD7C5]/60"
                  >
                    <span>{exp.linkLabel || 'Kunjungi Tautan ↗'}</span>
                  </a>
                )}
              </div>
            </div>
          ))}
        </div>

      </section>

      {/* ========================================================================= */}
      {/* SECTION: MY WORK INCLUDES (Campus Projects / Proyek Kampus & Akademik)    */}
      {/* ========================================================================= */}
      <BotanicalDivider />
      <section id="projects" className="max-w-[1560px] mx-auto px-4 sm:px-8 lg:px-12 xl:px-16 py-20 border-t border-[#CAD7C5]/80">
        
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-10">
          <span className="font-script text-3xl sm:text-4xl text-rose-dark block mb-1">/ Portfolio & Case Studies /</span>
          <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold text-forest tracking-normal mb-3">
            Selected Works & Campus Projects
          </h2>
          <p className="text-sm sm:text-base text-forest/75 leading-relaxed font-source">
            Kompilasi proyek sistem informasi, riset aplikasi, analisis data, dan strategi bisnis yang dikerjakan selama masa studi di D4 Sistem Informasi Bisnis Polinema. Arahkan kursor untuk membaca ringkasan dan klik untuk membuka dokumentasi lengkap.
          </p>
        </div>

        {/* Category Filter Pills */}
        <div className="flex flex-wrap items-center justify-center gap-2 mb-10 pb-4 border-b border-[#CAD7C5]/60">
          <button
            onClick={() => setActiveDossierTab('all')}
            className={`px-4 py-1.5 rounded-full text-xs font-subheader tracking-wider transition-all cursor-pointer ${
              activeDossierTab === 'all'
                ? 'bg-rose-dark text-white shadow-sm'
                : 'bg-white/80 text-forest/80 border border-[#CAD7C5] hover:bg-white'
            }`}
          >
            All Projects ({projectsList.length})
          </button>
          <button
            onClick={() => setActiveDossierTab('surveyku')}
            className={`px-4 py-1.5 rounded-full text-xs font-subheader tracking-wider transition-all cursor-pointer ${
              activeDossierTab === 'surveyku'
                ? 'bg-rose-dark text-white shadow-sm'
                : 'bg-white/80 text-forest/80 border border-[#CAD7C5] hover:bg-white'
            }`}
          >
            Web Systems
          </button>
          <button
            onClick={() => setActiveDossierTab('media-monitor')}
            className={`px-4 py-1.5 rounded-full text-xs font-subheader tracking-wider transition-all cursor-pointer ${
              activeDossierTab === 'media-monitor'
                ? 'bg-rose-dark text-white shadow-sm'
                : 'bg-white/80 text-forest/80 border border-[#CAD7C5] hover:bg-white'
            }`}
          >
            Python Automation
          </button>
          <button
            onClick={() => setActiveDossierTab('jti-certify')}
            className={`px-4 py-1.5 rounded-full text-xs font-subheader tracking-wider transition-all cursor-pointer ${
              activeDossierTab === 'jti-certify'
                ? 'bg-rose-dark text-white shadow-sm'
                : 'bg-white/80 text-forest/80 border border-[#CAD7C5] hover:bg-white'
            }`}
          >
            Credential Portal
          </button>
          <button
            onClick={() => setActiveDossierTab('sales-dashboard')}
            className={`px-4 py-1.5 rounded-full text-xs font-subheader tracking-wider transition-all cursor-pointer ${
              activeDossierTab === 'sales-dashboard'
                ? 'bg-rose-dark text-white shadow-sm'
                : 'bg-white/80 text-forest/80 border border-[#CAD7C5] hover:bg-white'
            }`}
          >
            Business Analytics
          </button>
          <button
            onClick={() => setActiveDossierTab('bpc-canvas')}
            className={`px-4 py-1.5 rounded-full text-xs font-subheader tracking-wider transition-all cursor-pointer ${
              activeDossierTab === 'bpc-canvas'
                ? 'bg-rose-dark text-white shadow-sm'
                : 'bg-white/80 text-forest/80 border border-[#CAD7C5] hover:bg-white'
            }`}
          >
            BMC & Strategy
          </button>
        </div>

        {/* 3-Column Grid Matching User Reference Image */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-7 items-stretch">
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
              className="bg-white/95 backdrop-blur-sm border border-[#CAD7C5] rounded-[2rem] p-4 sm:p-5 shadow-sm hover:shadow-xl hover:border-rose-dusty/80 hover:-translate-y-1.5 transition-all duration-300 flex flex-col justify-between group cursor-pointer"
            >
              <div>
                {/* 1. GAMBAR PROYEK (Visual Showcase Clean on Top) */}
                <div className="relative aspect-[4/3] rounded-2xl overflow-hidden bg-forest/5 mb-4 border border-[#CAD7C5]/60 shadow-2xs">
                  <img
                    src={project.image}
                    alt={project.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-50 group-hover:opacity-80 transition-opacity pointer-events-none" />
                  
                  {/* Category Pill on Image */}
                  <span className="absolute top-3 left-3 bg-white/90 backdrop-blur-xs text-forest text-[9px] font-bold px-2.5 py-1 rounded-full shadow-xs uppercase tracking-wider">
                    {project.tag}
                  </span>

                  {/* Hover Quick Prompt */}
                  <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-forest/30 pointer-events-none">
                    <span className="px-3.5 py-1.5 rounded-full bg-white/95 text-rose-dark text-xs font-bold shadow-md flex items-center gap-1.5 backdrop-blur-xs">
                      <span>Buka Dokumentasi ↗</span>
                      <span>↗</span>
                    </span>
                  </div>
                </div>

                {/* 2. JUDUL PROYEK DI BAWAHNYA (Uppercase Bold, faithful to reference screenshot) */}
                <div className="flex items-center justify-between gap-2 mb-1.5">
                  <span className="text-[10px] font-mono font-bold text-forest/50 uppercase tracking-wider">
                    {project.period}
                  </span>
                  <span className="text-[10px] text-forest/60 font-medium">
                    {project.extraImages?.length || 1} Foto
                  </span>
                </div>

                <h3 className="font-serif text-base sm:text-lg font-bold text-forest uppercase tracking-wide group-hover:text-rose-dark transition-colors line-clamp-2 leading-snug">
                  {project.title}
                </h3>

                {/* 3. RINGKASAN PROYEK (Visible & Readable) */}
                <div className="mt-3">
                  <p className="text-xs text-forest/80 font-source leading-relaxed mb-3 line-clamp-2 sm:line-clamp-3">
                    {project.summary}
                  </p>
                  <div className="flex flex-wrap gap-1.5">
                    {project.results?.map((res, rIdx) => (
                      <span
                        key={rIdx}
                        className="inline-flex items-center gap-1 text-[10px] font-medium px-2.5 py-0.5 rounded-full bg-[#E8EFE5] text-forest border border-[#CAD7C5]"
                      >
                        <span className="w-1 h-1 rounded-full bg-rose-dark" />
                        <span>{res}</span>
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Bottom Subtle Action Trigger */}
              <div className="pt-3 mt-3 border-t border-[#CAD7C5]/40 flex items-center justify-between text-xs text-forest/60">
                <span className="text-[11px] font-bold text-rose-dark group-hover:underline flex items-center gap-1">
                  <span>Klik untuk dokumentasi</span>
                  <span className="text-xs">↗</span>
                </span>
                <span className="w-6 h-6 rounded-full bg-[#E8EFE5] text-forest group-hover:bg-rose-dark group-hover:text-white transition-colors flex items-center justify-center text-[10px] font-bold">
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
      <BotanicalDivider />
      <section id="recognition" className="max-w-[1560px] mx-auto px-4 sm:px-8 lg:px-12 xl:px-16 py-20 border-t border-[#CAD7C5]/80">
        
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-10">
          <span className="font-script text-3xl sm:text-4xl text-rose-dark block mb-1">/ Honors & Recognitions /</span>
          <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold text-forest tracking-normal mb-3">
            National Competitions & Honors
          </h2>
          <p className="text-sm sm:text-base text-forest/75 leading-relaxed">
            Galeri visual pencapaian terverifikasi dalam kompetisi business plan dan debat nasional. Arahkan kursor ke tiap dokumentasi untuk melihat detail dan klik untuk membuka sertifikat resmi.
          </p>
        </div>

        {/* Filter Pills */}
        <div className="flex flex-wrap items-center justify-center gap-2 mb-8">
          <button
            onClick={() => setAwardFilter('all')}
            className={`px-4 py-1.5 rounded-full text-xs font-subheader tracking-wider transition-all ${
              awardFilter === 'all'
                ? 'bg-rose-dark text-white shadow-sm'
                : 'bg-white/80 text-forest/80 border border-[#CAD7C5] hover:bg-white'
            }`}
          >
            All Awards (7)
          </button>
          <button
            onClick={() => setAwardFilter('1st')}
            className={`px-4 py-1.5 rounded-full text-xs font-subheader tracking-wider transition-all ${
              awardFilter === '1st'
                ? 'bg-rose-dark text-white shadow-sm'
                : 'bg-white/80 text-forest/80 border border-[#CAD7C5] hover:bg-white'
            }`}
          >
            1st Winner (2)
          </button>
          <button
            onClick={() => setAwardFilter('2nd')}
            className={`px-4 py-1.5 rounded-full text-xs font-subheader tracking-wider transition-all ${
              awardFilter === '2nd'
                ? 'bg-rose-dark text-white shadow-sm'
                : 'bg-white/80 text-forest/80 border border-[#CAD7C5] hover:bg-white'
            }`}
          >
            2nd Winner (2)
          </button>
          <button
            onClick={() => setAwardFilter('top5')}
            className={`px-4 py-1.5 rounded-full text-xs font-subheader tracking-wider transition-all ${
              awardFilter === 'top5'
                ? 'bg-rose-dark text-white shadow-sm'
                : 'bg-white/80 text-forest/80 border border-[#CAD7C5] hover:bg-white'
            }`}
          >
            Top 5 Finalist (2)
          </button>
          <button
            onClick={() => setAwardFilter('speaker')}
            className={`px-4 py-1.5 rounded-full text-xs font-subheader tracking-wider transition-all ${
              awardFilter === 'speaker'
                ? 'bg-rose-dark text-white shadow-sm'
                : 'bg-white/80 text-forest/80 border border-[#CAD7C5] hover:bg-white'
            }`}
          >
            Best Speaker (1)
          </button>
        </div>

        {/* Visual Exhibition Mosaic Container (Framed with Pastel Glow like user's reference image!) */}
        <div className="relative p-3 sm:p-5 rounded-[2.5rem] bg-gradient-to-tr from-rose-blush/40 via-white/60 to-sage-DEFAULT/30 border border-white/80 shadow-xl backdrop-blur-sm">
          
          {/* Mosaic Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-4 sm:gap-5">
            {filteredAwards.map((award, idx) => {
              // Custom asymmetric span pattern matching user's image collage
              let colSpan = 'lg:col-span-4 min-h-[280px]';
              if (awardFilter === 'all') {
                if (idx === 0) colSpan = 'lg:col-span-4 lg:row-span-2 min-h-[440px]'; // Tall vertical card like left of reference!
                else if (idx === 1) colSpan = 'lg:col-span-8 min-h-[220px]'; // Wide top card like upper right of reference!
                else if (idx === 2) colSpan = 'lg:col-span-4 min-h-[220px]';
                else if (idx === 3) colSpan = 'lg:col-span-4 min-h-[220px]';
                else if (idx === 4) colSpan = 'lg:col-span-4 min-h-[260px]';
                else if (idx === 5) colSpan = 'lg:col-span-4 min-h-[260px]';
                else if (idx === 6) colSpan = 'lg:col-span-4 min-h-[260px]';
              } else {
                colSpan = 'lg:col-span-6 min-h-[320px]';
              }

              return (
                <div
                  key={idx}
                  onClick={() => openModal(award.title, `${award.rank} • ${award.organizer}`, award.desc, [award.certImg, award.eventImg], award.link, award.linkLabel)}
                  className={`group relative rounded-3xl overflow-hidden cursor-pointer bg-forest/20 border-2 border-white/60 shadow-md transition-all duration-500 hover:-translate-y-2.5 hover:scale-[1.015] hover:shadow-2xl ${colSpan} flex flex-col justify-between p-5`}
                >
                  {/* Background Event Documentation Image */}
                  <img
                    src={award.eventImg}
                    alt={award.title}
                    className="absolute inset-0 w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 pointer-events-none"
                  />
                  
                  {/* Subtle Gradient Shadow by default */}
                  <div className="absolute inset-0 bg-gradient-to-t from-forest/80 via-forest/20 to-transparent group-hover:opacity-0 transition-opacity duration-300 pointer-events-none" />

                  {/* Top Header Tag (Pills) */}
                  <div className="relative z-10 flex items-center justify-between w-full">
                    <span className={`text-[10px] font-subheader px-2.5 py-1 rounded-full shadow-sm tracking-wider uppercase ${award.rankBadge}`}>
                      {award.rank}
                    </span>
                    <span className="text-[11px] font-mono font-bold px-2 py-0.5 rounded-full bg-black/45 backdrop-blur-md text-white border border-white/20">
                      {award.year}
                    </span>
                  </div>

                  {/* Default Bottom Teaser with Legible Backdrop */}
                  <div className="relative z-10 bg-black/60 backdrop-blur-xs p-3.5 rounded-2xl border border-white/15 text-white group-hover:opacity-0 transition-opacity duration-300">
                    <h3 className="font-serif text-base sm:text-lg font-bold leading-snug">
                      {award.title}
                    </h3>
                    <p className="text-[11px] font-subheader text-rose-blush tracking-wider uppercase mt-0.5 truncate">
                      {award.organizer}
                    </p>
                  </div>

                  {/* HOVER OVERLAY: Timbul & Pop-out Full Details! */}
                  <div className="absolute inset-0 bg-forest/90 backdrop-blur-sm p-6 flex flex-col justify-between opacity-0 group-hover:opacity-100 transition-all duration-300 z-20 text-white">
                    <div>
                      <div className="flex items-center gap-2 mb-2">
                        <span className="w-2 h-2 rounded-full bg-rose-dusty" />
                        <span className="text-[10px] font-subheader text-rose-blush tracking-subheader uppercase">
                          {award.scope}
                        </span>
                      </div>
                      <h3 className="font-serif text-xl sm:text-2xl font-bold leading-snug mb-1 text-white">
                        {award.title}
                      </h3>
                      <p className="text-xs font-subheader text-[#E8EFE5]/70 tracking-wider uppercase mb-3">
                        {award.organizer}
                      </p>
                      <p className="text-xs text-[#E8EFE5]/85 leading-relaxed line-clamp-3">
                        {award.desc}
                      </p>
                    </div>

                    <div className="pt-3 border-t border-white/20 flex items-center justify-between">
                      <span className="text-[11px] font-bold text-rose-blush flex items-center gap-1">
                        <span>Bukti Foto</span>
                      </span>
                      <div className="flex items-center gap-2">
                        {award.link && (
                          <a
                            href={award.link}
                            target="_blank"
                            rel="noopener noreferrer"
                            onClick={(e) => e.stopPropagation()}
                            className="px-2.5 py-1.5 rounded-full bg-white/20 hover:bg-white text-white hover:text-forest text-[11px] font-bold border border-white/30 transition-colors flex items-center gap-1"
                          >
                            <span>↗</span>
                            <span>{award.linkLabel || 'Publikasi'}</span>
                          </a>
                        )}
                        <span className="px-3.5 py-1.5 rounded-full bg-rose-dark text-white text-xs font-bold shadow-md hover:bg-rose-berry transition-colors flex items-center gap-1">
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
        <p className="text-center text-xs text-forest/60 italic mt-5">
          Klik pada gambar untuk melihat pop-up foto penerimaan piala dan sertifikat resmi
        </p>

      </section>

      {/* ========================================================================= */}
      {/* SECTION 3: INSTITUTIONAL LEADERSHIP & GOVERNANCE (Infinite Coverflow)    */}
      {/* ========================================================================= */}
      <BotanicalDivider />
      <section id="leadership" className="max-w-[1560px] mx-auto px-4 sm:px-8 lg:px-12 xl:px-16 py-20 border-t border-[#CAD7C5]/80 overflow-hidden">
        
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-10">
          <span className="font-script text-3xl sm:text-4xl text-rose-dark block mb-1">/ Governance & Track Record /</span>
          <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold text-forest tracking-normal mb-3">
            Leadership & Organizational Impact
          </h2>
          <p className="text-sm sm:text-base text-forest/75 leading-relaxed font-source">
            Pengalaman memimpin ratusan mahasiswa, mengawal tata kelola organisasi skala jurusan, serta mewakili ekosistem teknologi kampus. Geser kartu ke samping untuk menjelajahi peran.
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
              <div className="flex items-center justify-between max-w-4xl mx-auto mb-4 px-2">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-rose-dark animate-pulse" />
                  <span className="text-xs font-bold text-forest uppercase tracking-wider font-source">
                    Peran {activeOrgIdx + 1} dari {organizationList.length}
                  </span>
                  <span className="text-xs text-forest/50 hidden sm:inline">•</span>
                  <span className="text-xs font-serif italic text-forest/75 hidden sm:inline">
                    {activeOrg.role} ({activeOrg.institution})
                  </span>
                </div>

                <div className="text-[11px] text-forest/60 font-medium hidden sm:flex items-center gap-1.5 bg-white/70 px-3 py-1 rounded-full border border-[#CAD7C5]/60">
                  <span>Auto-slide foto aktif</span>
                </div>
              </div>

              {/* =================================================================== */}
              {/* INFINITE COVERFLOW CONTAINER WITH PROMINENT SIDE ARROWS             */}
              {/* =================================================================== */}
              <div 
                className="relative py-8 select-none"
                style={{ 
                  '--card-width': 'min(80vw, 390px)',
                  '--card-gap': '1.75rem'
                } as React.CSSProperties}
              >
                {/* Floating Left Arrow Button (Prominent on Side) */}
                <button
                  onClick={handlePrevOrg}
                  className="absolute left-1 sm:left-3 lg:left-6 top-1/2 -translate-y-1/2 z-40 w-12 h-12 sm:w-14 sm:h-14 rounded-full bg-white/95 backdrop-blur-md border-2 border-[#CAD7C5] shadow-xl text-forest hover:bg-forest hover:text-[#E8EFE5] hover:scale-110 active:scale-95 transition-all flex items-center justify-center text-2xl font-bold cursor-pointer ring-4 ring-forest/5"
                  title="Peran Sebelumnya (Geser Kiri)"
                  aria-label="Previous Role"
                >
                  ‹
                </button>

                {/* Floating Right Arrow Button (Prominent on Side) */}
                <button
                  onClick={handleNextOrg}
                  className="absolute right-1 sm:right-3 lg:right-6 top-1/2 -translate-y-1/2 z-40 w-12 h-12 sm:w-14 sm:h-14 rounded-full bg-white/95 backdrop-blur-md border-2 border-[#CAD7C5] shadow-xl text-forest hover:bg-forest hover:text-[#E8EFE5] hover:scale-110 active:scale-95 transition-all flex items-center justify-center text-2xl font-bold cursor-pointer ring-4 ring-forest/5"
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
                        className={`shrink-0 rounded-3xl transition-all duration-500 flex flex-col justify-between overflow-hidden cursor-pointer ${
                          isCenter
                            ? 'scale-105 sm:scale-108 z-30 opacity-100 bg-white shadow-2xl ring-2 ring-rose-dark/35 border-transparent'
                            : 'scale-90 sm:scale-95 z-10 opacity-55 hover:opacity-85 bg-white/85 shadow-md border border-[#CAD7C5]'
                        }`}
                      >
                        {/* Spotlight Ribbon on Center Card */}
                        {isCenter && (
                          <div className="bg-gradient-to-r from-forest via-rose-dark to-forest text-[#E8EFE5] text-center text-[10px] font-bold uppercase tracking-widest py-1">
                            ✦ Spotlight Organization ✦
                          </div>
                        )}

                        {/* Card Image Area: 1:1 Aspect Ratio (Square) with Auto-Sliding Photo */}
                        <div className="relative aspect-square overflow-hidden bg-forest/10 group/img">
                          <img
                            src={currentPhoto}
                            alt={`${org.role} - ${org.institution}`}
                            className="w-full h-full object-cover group-hover/img:scale-105 transition-all duration-700"
                          />
                          
                          {/* Gradient overlay */}
                          <div className="absolute inset-0 bg-gradient-to-t from-forest/75 via-transparent to-black/20 pointer-events-none" />

                          {/* Top Badges */}
                          <div className="absolute top-3 inset-x-3 flex items-center justify-between z-10">
                            <span className="text-[10px] font-bold bg-white/90 backdrop-blur-xs text-forest px-2.5 py-0.5 rounded-full shadow-xs">
                              {org.period}
                            </span>
                            <span className="text-[10px] font-medium bg-forest/85 backdrop-blur-xs text-white px-2.5 py-0.5 rounded-full flex items-center gap-1 shadow-xs">
                              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                              <span>Foto {activePhotoIdx + 1}/{org.images.length}</span>
                            </span>
                          </div>

                          {/* Multi-Photo Indicators & Thumbnail switcher at bottom of 1:1 photo */}
                          <div className="absolute bottom-3 left-3 z-10 flex items-center gap-1.5 bg-black/60 backdrop-blur-md px-2.5 py-1 rounded-full">
                            {org.images.map((_, pIdx) => (
                              <button
                                key={pIdx}
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setOrgPhotoIndex(prev => ({ ...prev, [orgIdx]: pIdx }));
                                }}
                                className={`w-4 h-4 rounded-full text-[9px] font-bold flex items-center justify-center transition-all ${
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
                            className="absolute bottom-3 right-3 z-10 px-2.5 py-1 rounded-full bg-white/90 hover:bg-rose-blush text-forest text-[10px] font-bold shadow-xs transition-colors"
                            title="Buka Dokumentasi Resolusi Penuh"
                          >
                            Galeri ↗
                          </button>
                        </div>

                        {/* Card Content Body */}
                        <div className="p-5 sm:p-6 flex flex-col justify-between grow">
                          <div>
                            <div className="text-[10px] font-bold text-rose-dark uppercase tracking-wider mb-1">
                              {org.tag}
                            </div>

                            <h3 className="font-serif text-xl sm:text-2xl font-bold text-forest mb-1">
                              {org.role}
                            </h3>

                            <h4 className="text-xs font-subheader text-forest/70 tracking-wider uppercase mb-3">
                              {org.institution}
                            </h4>

                            <p className="text-xs sm:text-sm text-forest/80 leading-relaxed font-source mb-4 line-clamp-3">
                              {org.desc}
                            </p>

                            {/* Highlights Badges */}
                            <div className="flex flex-wrap gap-1.5 mb-4">
                              {org.highlights.map((item, hIdx) => (
                                <span
                                  key={hIdx}
                                  className="text-[10px] font-medium px-2.5 py-0.5 rounded-full bg-[#E8EFE5]/70 border border-[#CAD7C5] text-forest/85"
                                >
                                  ✦ {item}
                                </span>
                              ))}
                            </div>
                          </div>

                          {/* Footer Trigger */}
                          <div className="pt-3 border-t border-[#CAD7C5]/50 flex items-center justify-between">
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
              <div className="flex flex-wrap items-center justify-center gap-2 mt-4 mb-10">
                {organizationList.map((org, idx) => (
                  <button
                    key={idx}
                    onClick={() => handleJumpOrg(idx)}
                    className={`px-3.5 py-1.5 rounded-full text-xs font-medium transition-all cursor-pointer ${
                      idx === activeOrgIdx
                        ? 'bg-forest text-[#E8EFE5] font-bold shadow-sm ring-2 ring-forest/20'
                        : 'bg-white/80 text-forest/75 border border-[#CAD7C5] hover:bg-white hover:text-forest'
                    }`}
                  >
                    <span className="opacity-60 mr-1.5">#{idx + 1}</span>
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
      <BotanicalDivider />
      <section id="certifications" className="max-w-[1560px] mx-auto px-4 sm:px-8 lg:px-12 xl:px-16 py-20 border-t border-[#CAD7C5]/80">
        
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-12">
          <span className="font-script text-3xl sm:text-4xl text-rose-dark block mb-1">/ Continuous Learning /</span>
          <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold text-forest tracking-normal mb-3">
            Professional Certifications & Credentials
          </h2>
          <p className="text-sm sm:text-base text-forest/75 leading-relaxed font-source">
            Lisensi pelatihan intensif industri, sertifikasi kompetensi terakreditasi, dan pengujian standar internasional untuk mendukung kapabilitas strategis dan eksekusi bisnis.
          </p>
        </div>

        {/* Compact Vertical Cards Grid (Kembalikan ke Desain Sebelumnya, Tanpa Status Akademik) */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4 sm:gap-4.5 items-stretch">
          {certificationList.map((item, idx) => (
            <div
              key={idx}
              onClick={() => openModal(
                item.title,
                `${item.issuer} • ${item.year} (${item.tag})`,
                item.desc,
                [item.image]
              )}
              className="bg-white/95 backdrop-blur-sm border border-[#CAD7C5] rounded-[1.75rem] p-3.5 hover:shadow-lg hover:border-rose-dusty/60 hover:-translate-y-1 transition-all flex flex-col justify-between group cursor-pointer"
            >
              <div>
                {/* Visual Card Graphic (Clean 4:3 with Tag & Issuer Pill) */}
                <div className="relative aspect-[4/3] rounded-2xl overflow-hidden bg-forest/5 mb-3 border border-[#CAD7C5]/60">
                  <img
                    src={item.image}
                    alt={item.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent pointer-events-none" />
                  
                  {/* Issuer & Year Pill */}
                  <span className="absolute bottom-2 left-2 bg-white/90 backdrop-blur-xs text-forest text-[9px] font-bold px-2 py-0.5 rounded-full shadow-xs">
                    {item.issuer} • {item.year}
                  </span>
                </div>

                {/* Category Tag */}
                <span className={`inline-block text-[9px] font-bold px-2 py-0.5 rounded-full border ${item.badgeColor || 'bg-rose-blush/60 text-rose-dark border-rose-dusty/50'} uppercase tracking-wider mb-1.5`}>
                  {item.tag}
                </span>

                {/* Course Title */}
                <h4 className="font-serif text-sm font-bold text-forest group-hover:text-rose-dark transition-colors line-clamp-2 leading-snug">
                  {item.title}
                </h4>
              </div>

              {/* Bottom Minimal Arrow Footer */}
              <div className="pt-3 mt-2 border-t border-[#CAD7C5]/40 flex items-center justify-between text-xs">
                <span className="text-[10px] text-forest/60 font-medium">
                  Lihat Sertifikat
                </span>
                <span className="w-6 h-6 rounded-full bg-[#E8EFE5] text-forest group-hover:bg-rose-dark group-hover:text-white transition-colors flex items-center justify-center text-[10px] font-bold">
                  →
                </span>
              </div>
            </div>
          ))}
        </div>

        {/* Trust Banner Below Cards */}
        <div className="mt-8 p-4 rounded-2xl bg-[#CAD7C5]/25 border border-[#CAD7C5]/60 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-forest/80">
          <div className="flex items-center gap-2.5">
            <span className="text-rose-dark font-serif font-bold text-lg select-none">✦</span>
            <span className="font-medium">
              Seluruh sertifikat diterbitkan oleh institusi terakreditasi internasional & nasional (RevoU, MySkill, ETS International).
            </span>
          </div>
          <span className="text-[11px] font-bold text-rose-dark shrink-0">
            Klik kartu manapun untuk pratinjau sertifikat beresolusi tinggi ↗
          </span>
        </div>

      </section>

      {/* ========================================================================= */}
      {/* SECTION 6: CREATIVE PURSUITS & CONTENT CREATOR HIGHLIGHT */}
      {/* ========================================================================= */}
      <BotanicalDivider />
      <section id="creative" className="max-w-[1560px] mx-auto px-4 sm:px-8 lg:px-12 xl:px-16 py-20 border-t border-[#CAD7C5]/80">
        
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-12">
          <span className="font-script text-3xl sm:text-4xl text-rose-dark block mb-1">/ Content & Media /</span>
          <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold text-forest tracking-normal mb-3">
            Creator Studio & Social Growth
          </h2>
          <p className="text-sm sm:text-base text-forest/75 leading-relaxed">
            Eksplorasi visual dan penceritaan kreatif: Produksi konten lintas platform (Instagram & TikTok) di berbagai akun, karya rajutan tangan, eksplorasi dunia, serta pemikiran strategis.
          </p>
        </div>

        {/* ----------------------------------------------------------------------- */}
        {/* SUBSECTION A: CONTENT CREATOR MULTI-DEVICE POP-OUT SHOWCASE */}
        {/* ----------------------------------------------------------------------- */}
        <div className="bg-white/90 backdrop-blur-md border border-[#CAD7C5] rounded-3xl p-6 sm:p-10 shadow-sm mb-16">
          
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
            <div>
              <span className="text-[11px] font-bold uppercase tracking-widest text-rose-dark block mb-1">
                ✦ Multi-Platform Production
              </span>
              <h3 className="font-serif text-2xl sm:text-3xl font-bold text-forest">
                Social Media & Video Production
              </h3>
            </div>
            
            {/* Account Switcher Tabs */}
            <div className="flex flex-wrap items-center gap-2">
              <button
                onClick={() => setActiveCreatorAccount('personal')}
                className={`px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all ${
                  activeCreatorAccount === 'personal'
                    ? 'bg-rose-dark text-white shadow-sm'
                    : 'bg-[#E8EFE5] text-forest/80 hover:bg-white'
                }`}
              >
                Personal Account
              </button>
              <button
                onClick={() => setActiveCreatorAccount('yarnup')}
                className={`px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all ${
                  activeCreatorAccount === 'yarnup'
                    ? 'bg-rose-dark text-white shadow-sm'
                    : 'bg-[#E8EFE5] text-forest/80 hover:bg-white'
                }`}
              >
                YarnUp! Studio
              </button>
              <button
                onClick={() => setActiveCreatorAccount('manikarumi')}
                className={`px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all ${
                  activeCreatorAccount === 'manikarumi'
                    ? 'bg-rose-dark text-white shadow-sm'
                    : 'bg-[#E8EFE5] text-forest/80 hover:bg-white'
                }`}
              >
                Manikarumi ID
              </button>
              <button
                onClick={() => setActiveCreatorAccount('duasisi')}
                className={`px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all ${
                  activeCreatorAccount === 'duasisi'
                    ? 'bg-rose-dark text-white shadow-sm'
                    : 'bg-[#E8EFE5] text-forest/80 hover:bg-white'
                }`}
              >
                Dua Sisi Laundry
              </button>
            </div>
          </div>

          {/* Account Meta Ribbon */}
          <div className="flex flex-wrap items-center justify-between gap-3 p-4 rounded-2xl bg-[#E8EFE5]/50 border border-[#CAD7C5]/70 mb-8 text-xs">
            <div className="flex items-center gap-3">
              <span className="font-bold text-forest text-sm font-serif">{currentCreator.name}</span>
              <span className="text-rose-dark font-mono font-medium">{currentCreator.handle}</span>
              <span className="hidden sm:inline text-forest/40">•</span>
              <span className="hidden sm:inline text-forest/70 font-medium">{currentCreator.tag}</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full bg-rose-blush text-rose-dark font-bold text-[10px] uppercase">
                {currentCreator.stats}
              </span>
              <a
                href={currentCreator.link}
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs font-bold text-forest hover:text-rose-dark underline ml-2"
              >
                Buka Akun ↗
              </a>
            </div>
          </div>

          {/* Multi-Device Pop-out Stage (Adaptive: 3 Devices if hasCenterStage, or 2 Phones if hasCenterStage is false!) */}
          {currentCreator.hasCenterStage ? (
            /* 3-DEVICE STAGE (Left Phone + Clickable YouTube/Video Stage + Right Phone) */
            <div className="relative py-6 flex flex-col lg:flex-row items-center justify-center gap-6 lg:gap-8">
              
              {/* Left Phone Mockup (Reels / Stories) - Hover Pops! */}
              <div 
                onClick={() => {
                  if (currentCreator.leftPhoneLink || currentCreator.link) {
                    window.open(currentCreator.leftPhoneLink || currentCreator.link, '_blank');
                  }
                }}
                className="w-full sm:w-[220px] lg:w-[200px] shrink-0 bg-[#253521] p-3 rounded-[2.5rem] border-2 border-[#CAD7C5] shadow-lg transition-all duration-500 hover:-translate-y-3 hover:scale-105 hover:shadow-2xl group cursor-pointer"
              >
                <div className="w-16 h-4 bg-black/60 rounded-full mx-auto mb-2" />
                <div className="relative aspect-[9/16] rounded-3xl overflow-hidden bg-forest/30">
                  <img
                    src={currentCreator.leftPhoneImg}
                    alt={currentCreator.leftPhoneTitle}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                  />
                  <div className="absolute inset-x-0 bottom-0 p-3 bg-gradient-to-t from-black/85 via-black/40 to-transparent text-white">
                    <span className="inline-block px-2 py-0.5 rounded-full bg-rose-dark/90 text-[9px] font-bold uppercase tracking-wider mb-1">
                      {currentCreator.leftPhoneTag}
                    </span>
                    <p className="text-[11px] font-bold leading-tight line-clamp-1">
                      {currentCreator.leftPhoneTitle}
                    </p>
                  </div>
                </div>
              </div>

              {/* Central Wide Featured Stage (Tablet / Screen View) - Links out to YouTube / Video! */}
              <div 
                onClick={() => {
                  if (currentCreator.centerLink) {
                    window.open(currentCreator.centerLink, '_blank');
                  }
                }}
                className="w-full lg:max-w-[480px] bg-white rounded-3xl p-3 border-2 border-[#CAD7C5] shadow-xl transition-all duration-500 hover:-translate-y-3 hover:scale-[1.03] hover:shadow-2xl group cursor-pointer relative"
              >
                <div className="flex items-center justify-between px-3 py-1.5 border-b border-[#CAD7C5]/50 mb-2.5">
                  <div className="flex items-center gap-1.5">
                    <span className="w-2.5 h-2.5 rounded-full bg-rose-dusty" />
                    <span className="w-2.5 h-2.5 rounded-full bg-amber-400" />
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
                    <span className="text-[10px] text-forest/50 font-mono ml-2 truncate">
                      content-studio / {activeCreatorAccount}
                    </span>
                  </div>

                  {currentCreator.centerLink && (
                    <span className="text-[10px] font-bold font-mono px-2.5 py-0.5 rounded-full bg-red-100 text-red-700 border border-red-200 flex items-center gap-1 group-hover:bg-red-600 group-hover:text-white transition-colors">
                      <span>▶</span>
                      <span>Buka di YouTube ↗</span>
                    </span>
                  )}
                </div>

                <div className="relative aspect-[16/10] rounded-2xl overflow-hidden bg-[#E8EFE5]">
                  <img
                    src={currentCreator.centerImg}
                    alt={currentCreator.centerTitle}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                  />
                  
                  {/* Play button hover overlay */}
                  <div className="absolute inset-0 bg-forest/30 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center pointer-events-none">
                    <div className="w-14 h-14 rounded-full bg-white/95 text-red-600 flex items-center justify-center text-2xl shadow-xl transform scale-75 group-hover:scale-100 transition-transform">
                      ▶
                    </div>
                  </div>

                  <div className="absolute inset-0 bg-gradient-to-t from-forest/95 via-forest/40 to-transparent flex flex-col justify-end p-5 text-white">
                    <span className="text-[10px] font-bold uppercase tracking-widest text-rose-blush mb-1">
                      {currentCreator.platforms}
                    </span>
                    <h4 className="font-serif text-xl sm:text-2xl font-bold leading-tight mb-1">
                      {currentCreator.centerTitle}
                    </h4>
                    <p className="text-xs text-[#E8EFE5]/85 leading-snug line-clamp-2">
                      {currentCreator.centerDesc}
                    </p>
                  </div>
                </div>
              </div>

              {/* Right Phone Mockup (Shorts / Feed) - Hover Pops! */}
              <div 
                onClick={() => {
                  if (currentCreator.rightPhoneLink || currentCreator.link) {
                    window.open(currentCreator.rightPhoneLink || currentCreator.link, '_blank');
                  }
                }}
                className="w-full sm:w-[220px] lg:w-[200px] shrink-0 bg-[#253521] p-3 rounded-[2.5rem] border-2 border-[#CAD7C5] shadow-lg transition-all duration-500 hover:-translate-y-3 hover:scale-105 hover:shadow-2xl group cursor-pointer"
              >
                <div className="w-16 h-4 bg-black/60 rounded-full mx-auto mb-2" />
                <div className="relative aspect-[9/16] rounded-3xl overflow-hidden bg-forest/30">
                  <img
                    src={currentCreator.rightPhoneImg}
                    alt={currentCreator.rightPhoneTitle}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                  />
                  <div className="absolute inset-x-0 bottom-0 p-3 bg-gradient-to-t from-black/85 via-black/40 to-transparent text-white">
                    <span className="inline-block px-2 py-0.5 rounded-full bg-emerald-700/90 text-[9px] font-bold uppercase tracking-wider mb-1">
                      {currentCreator.rightPhoneTag}
                    </span>
                    <p className="text-[11px] font-bold leading-tight line-clamp-1">
                      {currentCreator.rightPhoneTitle}
                    </p>
                  </div>
                </div>
              </div>

            </div>
          ) : (
            /* ADAPTIVE 2-PHONE STAGE (For Dua Sisi Laundry / Accounts without landscape video) */
            <div className="py-6 flex flex-col items-center justify-center">
              <div className="mb-5 inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#E8EFE5] border border-[#CAD7C5] text-forest text-xs font-medium">
                <span className="text-rose-dusty">✦</span>
                <span>Dual Mobile Showcase — Video Vertikal (Instagram Reels & TikTok) • Format Landscape Segera Hadir</span>
              </div>

              <div className="flex flex-row flex-wrap items-center justify-center gap-6 sm:gap-10">
                {/* Left Phone Mockup */}
                <div 
                  onClick={() => {
                    if (currentCreator.leftPhoneLink || currentCreator.link) {
                      window.open(currentCreator.leftPhoneLink || currentCreator.link, '_blank');
                    }
                  }}
                  className="w-[230px] sm:w-[250px] shrink-0 bg-[#253521] p-3 rounded-[2.5rem] border-2 border-[#CAD7C5] shadow-xl transition-all duration-500 hover:-translate-y-3 hover:scale-105 hover:shadow-2xl group cursor-pointer"
                >
                  <div className="w-16 h-4 bg-black/60 rounded-full mx-auto mb-2" />
                  <div className="relative aspect-[9/16] rounded-3xl overflow-hidden bg-forest/30">
                    <img
                      src={currentCreator.leftPhoneImg}
                      alt={currentCreator.leftPhoneTitle}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                    />
                    <div className="absolute inset-x-0 bottom-0 p-3.5 bg-gradient-to-t from-black/90 via-black/50 to-transparent text-white">
                      <span className="inline-block px-2.5 py-0.5 rounded-full bg-rose-dark text-[10px] font-bold uppercase tracking-wider mb-1">
                        {currentCreator.leftPhoneTag}
                      </span>
                      <p className="text-xs font-bold leading-tight">
                        {currentCreator.leftPhoneTitle}
                      </p>
                      <p className="text-[10px] text-white/75 mt-0.5">Buka di Instagram ↗</p>
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
                  className="w-[230px] sm:w-[250px] shrink-0 bg-[#253521] p-3 rounded-[2.5rem] border-2 border-[#CAD7C5] shadow-xl transition-all duration-500 hover:-translate-y-3 hover:scale-105 hover:shadow-2xl group cursor-pointer"
                >
                  <div className="w-16 h-4 bg-black/60 rounded-full mx-auto mb-2" />
                  <div className="relative aspect-[9/16] rounded-3xl overflow-hidden bg-forest/30">
                    <img
                      src={currentCreator.rightPhoneImg}
                      alt={currentCreator.rightPhoneTitle}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                    />
                    <div className="absolute inset-x-0 bottom-0 p-3.5 bg-gradient-to-t from-black/90 via-black/50 to-transparent text-white">
                      <span className="inline-block px-2.5 py-0.5 rounded-full bg-emerald-700 text-[10px] font-bold uppercase tracking-wider mb-1">
                        {currentCreator.rightPhoneTag}
                      </span>
                      <p className="text-xs font-bold leading-tight">
                        {currentCreator.rightPhoneTitle}
                      </p>
                      <p className="text-[10px] text-white/75 mt-0.5">Buka di TikTok ↗</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          <p className="text-center text-xs text-forest/60 italic mt-4">
            Arahkan kursor ke masing-masing kartu untuk melihat efek pop-out interaktif
          </p>

        </div>

        {/* ----------------------------------------------------------------------- */}
        {/* SUBSECTION B: BEYOND THE SCREEN — ART, HOBBIES & INTELLECTUAL PURSUITS */}
        {/* ----------------------------------------------------------------------- */}
        <div>
          <div className="text-center max-w-xl mx-auto mb-10">
            <span className="text-[11px] font-bold uppercase tracking-widest text-rose-dark block mb-1">
              ✦ Beyond The Screen
            </span>
            <h3 className="font-serif text-2xl sm:text-3xl font-bold text-forest">
              Arts, Hobbies & Intellectual Pursuits
            </h3>
            <p className="text-xs sm:text-sm text-forest/75 mt-1">
              Aktivitas personal yang menjaga keseimbangan kreativitas, wawasan intelektual, dan kesegaran cara pandang.
            </p>
          </div>

          {/* 4 Hobbies Card Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {hobbiesList.map((hobby, hIdx) => (
              <div
                key={hIdx}
                className="bg-white/90 border border-[#CAD7C5] rounded-3xl p-5 hover:border-rose-dusty hover:-translate-y-2 hover:shadow-xl transition-all duration-300 flex flex-col justify-between group shadow-sm"
              >
                <div>
                  <div className="w-full aspect-[4/3] rounded-2xl overflow-hidden bg-[#E8EFE5] mb-4 relative">
                    <img
                      src={hobby.img}
                      alt={hobby.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <span className="absolute top-2.5 left-2.5 bg-white/90 text-forest text-[10px] font-bold px-2.5 py-0.5 rounded-full shadow-xs flex items-center gap-1">
                      <span>{hobby.icon}</span>
                      <span>{hobby.tag}</span>
                    </span>
                  </div>
                  <h4 className="font-serif text-lg font-bold text-forest mb-1">
                    {hobby.title}
                  </h4>
                  <p className="text-[11px] font-semibold text-rose-dark mb-2">
                    {hobby.sub}
                  </p>
                  <p className="text-xs text-forest/75 leading-relaxed">
                    {hobby.desc}
                  </p>
                </div>

                <div className="pt-3 mt-4 border-t border-[#CAD7C5]/50 flex items-center justify-between">
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
                    <span className="text-[11px] font-medium text-forest/50 italic">
                      Creative Expression
                    </span>
                  )}
                  <span className="w-7 h-7 rounded-full bg-[#E8EFE5] flex items-center justify-center text-xs group-hover:bg-rose-blush group-hover:text-rose-dark transition-colors">
                    →
                  </span>
                </div>
              </div>
            ))}
          </div>

        </div>

      </section>

      {/* ========================================================================= */}
      {/* SECTION 5: EDITORIAL COLLABORATION & CONTACT FOOTER */}
      {/* ========================================================================= */}
      <BotanicalDivider />
      <footer id="contact" className="max-w-[1560px] mx-auto px-4 sm:px-8 lg:px-12 xl:px-16 pb-16 pt-8">
        
        {/* Contact Invitation Card */}
        <div className="bg-forest text-[#E8EFE5] rounded-3xl p-8 sm:p-14 relative overflow-hidden shadow-xl border border-forest-light text-center flex flex-col items-center">
          
          {/* Subtle floral watermark effect */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-rose-dark/20 rounded-full blur-3xl pointer-events-none" />
          
          <div className="relative z-10 max-w-2xl mx-auto flex flex-col items-center text-center">
            <span className="font-script text-3xl sm:text-4xl text-rose-blush block mb-2">/ Let's Connect /</span>
            <h2 className="font-serif text-3xl sm:text-5xl lg:text-6xl font-bold leading-[1.18] mb-4 text-white tracking-normal">
              Let&apos;s Cultivate Meaningful{' '}
              <span className="editorial-italic text-rose-blush font-normal">
                Business Growth
              </span>{' '}
              Together.
            </h2>
            <p className="text-sm sm:text-base text-[#E8EFE5]/80 leading-relaxed mb-8 max-w-xl mx-auto">
              Terbuka untuk posisi Management Trainee, Business Development, Strategic Marketing Specialist, serta inisiatif kemitraan baru. Mari berdiskusi bagaimana saya dapat berkontribusi nyata bagi organisasi Anda.
            </p>

            {/* Primary Direct Contact Buttons */}
            <div className="flex flex-wrap items-center justify-center gap-3 mb-4">
              <a
                href={`mailto:${portfolioData.socials.email}`}
                className="px-6 py-3 rounded-full text-xs font-bold bg-white text-forest hover:bg-rose-blush transition-colors flex items-center gap-2 shadow-sm"
              >
                <span>Kirim Email: {portfolioData.socials.email}</span>
              </a>
              <a
                href={portfolioData.socials.whatsapp}
                target="_blank"
                rel="noopener noreferrer"
                className="px-6 py-3 rounded-full text-xs font-bold bg-rose-dark text-white hover:bg-rose-berry transition-colors flex items-center gap-2 shadow-sm"
              >
                <span>WhatsApp Langsung ✦</span>
              </a>
              <a
                href={portfolioData.socials.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                className="px-5 py-3 rounded-full text-xs font-bold bg-white/10 border border-white/20 text-white hover:bg-white/20 transition-colors"
              >
                LinkedIn Profile ↗
              </a>
            </div>

            {/* Divider with subtle label */}
            <div className="flex items-center gap-3 my-5 w-full max-w-xs justify-center opacity-40">
              <div className="h-px bg-white grow" />
              <span className="text-[10px] uppercase font-mono tracking-widest text-white">Social Media</span>
              <div className="h-px bg-white grow" />
            </div>

            {/* Official Social Media Brand Icon Buttons (Instagram, TikTok, YouTube, Medium) */}
            <div className="flex items-center justify-center gap-3.5">
              {/* Instagram */}
              <a
                href={portfolioData.socials.instagram}
                target="_blank"
                rel="noopener noreferrer"
                title="Instagram: @chikalnazmi"
                aria-label="Instagram Chikal Nazmi"
                className="w-12 h-12 rounded-2xl bg-white/10 hover:bg-gradient-to-tr hover:from-[#f09433] hover:via-[#dc2743] hover:to-[#bc1888] border border-white/20 hover:border-transparent text-white flex items-center justify-center transition-all duration-300 hover:scale-115 hover:-translate-y-1 shadow-md group relative"
              >
                <svg className="w-5 h-5 transition-transform duration-300 group-hover:scale-110" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                </svg>
                <span className="absolute -bottom-8 opacity-0 group-hover:opacity-100 transition-opacity bg-black/90 text-white text-[10px] font-mono px-2 py-0.5 rounded pointer-events-none whitespace-nowrap shadow-md z-30">
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
                className="w-12 h-12 rounded-2xl bg-white/10 hover:bg-black border border-white/20 hover:border-[#25F4EE] text-white hover:text-[#25F4EE] flex items-center justify-center transition-all duration-300 hover:scale-115 hover:-translate-y-1 shadow-md group relative"
              >
                <svg className="w-5 h-5 transition-transform duration-300 group-hover:scale-110" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64c.298-.002.595.042.88.13V9.4a6.33 6.33 0 0 0-1-.08A6.34 6.34 0 0 0 3 15.66a6.34 6.34 0 0 0 10.86 4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-3.04-1.52z"/>
                </svg>
                <span className="absolute -bottom-8 opacity-0 group-hover:opacity-100 transition-opacity bg-black/90 text-white text-[10px] font-mono px-2 py-0.5 rounded pointer-events-none whitespace-nowrap shadow-md z-30">
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
                className="w-12 h-12 rounded-2xl bg-white/10 hover:bg-[#FF0000] border border-white/20 hover:border-transparent text-white flex items-center justify-center transition-all duration-300 hover:scale-115 hover:-translate-y-1 shadow-md group relative"
              >
                <svg className="w-5 h-5 transition-transform duration-300 group-hover:scale-110" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
                </svg>
                <span className="absolute -bottom-8 opacity-0 group-hover:opacity-100 transition-opacity bg-black/90 text-white text-[10px] font-mono px-2 py-0.5 rounded pointer-events-none whitespace-nowrap shadow-md z-30">
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
                className="w-12 h-12 rounded-2xl bg-white/10 hover:bg-white border border-white/20 hover:border-transparent text-white hover:text-black flex items-center justify-center transition-all duration-300 hover:scale-115 hover:-translate-y-1 shadow-md group relative"
              >
                <svg className="w-5 h-5 transition-transform duration-300 group-hover:scale-110" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M13.54 12a6.8 6.8 0 0 1-6.77 6.82A6.8 6.8 0 0 1 0 12a6.8 6.8 0 0 1 6.77-6.82A6.8 6.8 0 0 1 13.54 12zM20.96 12c0 3.54-1.51 6.42-3.38 6.42-1.87 0-3.39-2.88-3.39-6.42s1.52-6.42 3.39-6.42 3.38 2.88 3.38 6.42M24 12c0 3.17-.53 5.75-1.19 5.75-.66 0-1.19-2.58-1.19-5.75s.53-5.75 1.19-5.75C23.47 6.25 24 8.83 24 12z"/>
                </svg>
                <span className="absolute -bottom-8 opacity-0 group-hover:opacity-100 transition-opacity bg-black/90 text-white text-[10px] font-mono px-2 py-0.5 rounded pointer-events-none whitespace-nowrap shadow-md z-30">
                  Medium
                </span>
              </a>
            </div>
          </div>

          {/* Bottom Bar inside Card */}
          <div className="w-full mt-12 pt-6 border-t border-white/15 flex flex-col sm:flex-row items-center justify-between text-xs text-[#E8EFE5]/60 gap-4">
            <div>
              © 2026 Chikal Nazmi Mahira. All rights reserved.
            </div>
            <div className="flex items-center gap-6">
              <a href="#hero" className="hover:text-white transition-colors">
                Back to Top ↑
              </a>
              <span>•</span>
              <span className="font-serif italic text-rose-blush">
                Designed with Sage & Rose Aesthetic
              </span>
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
            className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 md:p-6 bg-black/80 backdrop-blur-md animate-fadeIn select-none"
            onClick={closeModal}
          >
            <div 
              className="bg-white rounded-[2rem] sm:rounded-[2.5rem] max-w-5xl w-[96vw] max-h-[94vh] shadow-2xl border-2 border-[#CAD7C5] p-4 sm:p-6 md:p-8 relative flex flex-col justify-between overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              {/* ----------------------------------------------------------------- */}
              {/* TOP HEADER: Badge, Title & Full Detailed Narrative                */}
              {/* ----------------------------------------------------------------- */}
              <div className="flex items-start justify-between gap-4 pb-3.5 mb-3 border-b border-[#CAD7C5]/70">
                <div className="max-w-3xl pr-2">
                  <div className="flex flex-wrap items-center gap-2 mb-2">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-rose-dark bg-rose-blush/70 border border-rose-dusty/40 px-3 py-1 rounded-full">
                      {modalData.category}
                    </span>
                    <span className="text-xs font-semibold text-forest/70">
                      • {modalData.images.length} Dokumentasi Visual
                    </span>
                  </div>

                  <h3 className="font-serif text-2xl sm:text-3xl font-bold text-forest leading-snug mb-2">
                    {modalData.title}
                  </h3>

                  <p className="text-xs sm:text-sm text-forest/85 leading-relaxed font-source">
                    {modalData.description}
                  </p>
                </div>

                {/* Close Button */}
                <button
                  onClick={closeModal}
                  className="w-10 h-10 sm:w-11 sm:h-11 rounded-full bg-[#E8EFE5] hover:bg-rose-dark hover:text-white text-forest flex items-center justify-center transition-all text-lg font-bold shadow-xs cursor-pointer shrink-0"
                  aria-label="Tutup Dialog"
                  title="Tutup Dialog"
                >
                  ✕
                </button>
              </div>

              {/* ----------------------------------------------------------------- */}
              {/* PROMINENT MEDIA STAGE: 100% VISIBLE & UNCROPPED (object-contain)  */}
              {/* ----------------------------------------------------------------- */}
              <div className="relative w-full h-[340px] sm:h-[460px] md:h-[520px] rounded-2xl sm:rounded-3xl overflow-hidden bg-forest/5 border border-[#CAD7C5]/80 my-2 flex items-center justify-center group shadow-inner">
                {/* Ambient Blurred Backdrop to fit portrait or landscape gracefully */}
                <div 
                  className="absolute inset-0 bg-cover bg-center opacity-25 filter blur-2xl scale-125 pointer-events-none transition-all duration-500"
                  style={{ backgroundImage: `url(${currentImg})` }}
                />

                {/* Main Uncropped Photo Display */}
                <img
                  src={currentImg}
                  alt={`${modalData.title} dokumentasi ${activeModalPhoto + 1}`}
                  className="relative z-10 max-w-full max-h-full object-contain p-2 sm:p-4 drop-shadow-md transition-all duration-300"
                />

                {/* Navigation Left Arrow */}
                {hasMultiple && (
                  <button
                    onClick={handlePrevPhoto}
                    className="absolute left-2.5 sm:left-4 top-1/2 -translate-y-1/2 z-20 w-11 h-11 sm:w-12 sm:h-12 rounded-full bg-white/95 hover:bg-white text-forest hover:text-rose-dark shadow-xl border border-[#CAD7C5] flex items-center justify-center text-2xl font-bold transition-all hover:scale-110 active:scale-95 cursor-pointer ring-4 ring-black/5"
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
                    className="absolute right-2.5 sm:right-4 top-1/2 -translate-y-1/2 z-20 w-11 h-11 sm:w-12 sm:h-12 rounded-full bg-white/95 hover:bg-white text-forest hover:text-rose-dark shadow-xl border border-[#CAD7C5] flex items-center justify-center text-2xl font-bold transition-all hover:scale-110 active:scale-95 cursor-pointer ring-4 ring-black/5"
                    title="Foto Selanjutnya (Panah Kanan)"
                    aria-label="Next Photo"
                  >
                    ›
                  </button>
                )}

                {/* Top Right: Open Original Photo Button */}
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
                <div className="absolute bottom-3 left-3 z-20 px-3.5 py-1.5 rounded-full bg-black/75 backdrop-blur-md text-white text-xs font-mono font-medium shadow-md flex items-center gap-2 border border-white/20">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                  <span>Dokumentasi {activeModalPhoto + 1} dari {modalData.images.length}</span>
                </div>
              </div>

              {/* ----------------------------------------------------------------- */}
              {/* INTERACTIVE THUMBNAIL FILMSTRIP: Explore All Photos Easily        */}
              {/* ----------------------------------------------------------------- */}
              {hasMultiple && (
                <div className="mt-2 mb-1">
                  <div className="text-[11px] font-bold uppercase tracking-wider text-forest/60 mb-1.5 flex items-center justify-between">
                    <span>Pilih Foto Dokumentasi ({modalData.images.length} Tersedia):</span>
                    <span className="text-forest/50 font-normal hidden sm:inline">Gunakan tombol ‹ › atau tombol panah keyboard</span>
                  </div>
                  <div className="flex items-center gap-2.5 overflow-x-auto py-1.5 px-1 scrollbar-thin">
                    {modalData.images.map((img, idx) => {
                      const isActive = idx === activeModalPhoto;
                      return (
                        <button
                          key={idx}
                          onClick={() => setActiveModalPhoto(idx)}
                          className={`relative w-20 sm:w-28 aspect-[4/3] rounded-xl overflow-hidden border-2 transition-all shrink-0 cursor-pointer bg-forest/5 ${
                            isActive
                              ? 'border-rose-dark ring-3 ring-rose-dark/30 scale-105 shadow-md'
                              : 'border-[#CAD7C5] opacity-60 hover:opacity-100 hover:border-forest'
                          }`}
                          title={`Lihat Foto ${idx + 1}`}
                        >
                          <img src={img} alt={`Thumbnail ${idx + 1}`} className="w-full h-full object-cover" />
                          <span className={`absolute bottom-1 right-1 px-1.5 py-0.5 rounded text-[9px] font-bold font-mono ${
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

              {/* ----------------------------------------------------------------- */}
              {/* BOTTOM FOOTER: Status, Adaptive External Link & Close Action     */}
              {/* ----------------------------------------------------------------- */}
              <div className="pt-3.5 mt-2 border-t border-[#CAD7C5]/70 flex flex-wrap items-center justify-between gap-3 text-xs text-forest/75">
                <div className="flex items-center gap-2">
                  <span className="text-rose-dark font-bold">✔</span>
                  <span className="text-[11px] font-medium">
                    Foto ditampilkan dalam rasio asli tanpa pemotongan (uncropped)
                  </span>
                </div>

                <div className="flex items-center gap-2.5">
                  {modalData.link && (
                    <a
                      href={modalData.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-4 py-2 rounded-full text-xs font-bold bg-emerald-100 border border-emerald-300 text-emerald-900 hover:bg-emerald-200 transition-colors shadow-xs flex items-center gap-1.5"
                    >
                      <span>↗</span>
                      <span>{modalData.linkLabel || 'Buka Tautan Eksternal ↗'}</span>
                    </a>
                  )}
                  <button
                    onClick={closeModal}
                    className="px-6 py-2 rounded-full text-xs font-bold bg-forest text-[#E8EFE5] hover:bg-rose-dark transition-colors shadow-xs cursor-pointer"
                  >
                    Tutup Dialog
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
