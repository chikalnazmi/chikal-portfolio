'use client';

import React, { useState } from 'react';

export default function Home() {
  // Modal state for certificates and documentation
  const [modalData, setModalData] = useState<{
    isOpen: boolean;
    title: string;
    category: string;
    description: string;
    images: string[];
  }>({
    isOpen: false,
    title: '',
    category: '',
    description: '',
    images: [],
  });

  // Mobile menu state
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Active filter/tab in Selected Works Dossier
  const [activeDossierTab, setActiveDossierTab] = useState<'all' | 'operations' | 'growth' | 'partnership' | 'data'>('all');

  // Active account in Content Creator Showcase
  const [activeCreatorAccount, setActiveCreatorAccount] = useState<'personal' | 'yarnup' | 'manikarumi' | 'duasisi'>('personal');

  // Active filter for Trophy Case Mosaic Exhibition
  const [awardFilter, setAwardFilter] = useState<'all' | '1st' | '2nd' | 'top5' | 'speaker'>('all');

  // Modal open helper
  const openModal = (title: string, category: string, description: string, images: string[]) => {
    setModalData({
      isOpen: true,
      title,
      category,
      description,
      images,
    });
  };

  const closeModal = () => {
    setModalData(prev => ({ ...prev, isOpen: false }));
  };

  // Case Studies Dossier Data
  const dossierProjects = [
    {
      id: 'operations',
      category: 'OPERATIONAL EXCELLENCE & SCALING',
      title: 'Dua Sisi Laundry Operations & SOP System',
      tag: 'Business Operations',
      period: '2023 - 2024',
      badgeColor: 'bg-emerald-100 text-emerald-900 border-emerald-300',
      summary: 'Perumusan Standard Operating Procedure (SOP) hulu-ke-hilir, standarisasi pengerjaan cucian, dan digitalisasi pencatatan keuangan harian.',
      challenge: 'Operasional cucian sebelumnya mengalami variasi kualitas pengerjaan, risiko keterlambatan pengembalian, dan pembukuan manual yang rentan selisih.',
      strategy: 'Merancang matriks alur kerja 5 tahap (Sortir - Cuci - Kering - Setrika Uap - QC/Packing), menetapkan standar waktu layanan 24/48 jam, dan membuat dashboard kas terpusat.',
      results: [
        '35% Peningkatan efisiensi rotasi cucian harian',
        '0% Zero-complaint atas kerusakan atau kehilangan pakaian',
        'Pencatatan kas dan rekonsiliasi bahan baku 100% transparan',
      ],
      image: '/3.png',
      extraImages: ['/3.png', '/4.png'],
    },
    {
      id: 'growth',
      category: 'ECOMMERCE & ORGANIC BRAND LAUNCH',
      title: 'YarnUp! Studio — Handcrafted Accessories Engine',
      tag: 'Brand Founder & Growth',
      period: '2023 - Sekarang',
      badgeColor: 'bg-rose-100 text-rose-900 border-rose-300',
      summary: 'Membangun brand aksesoris rajut handmade dari nol, menguji pasar melalui video storytelling, dan mengoptimalkan konversi di media sosial.',
      challenge: 'Pasar kerajinan tangan lokal dibanjiri produk impor murah; brand butuh diferensiasi visual yang kuat dan positioning emosional untuk memvalidasi harga premium.',
      strategy: 'Mengadopsi strategi content marketing berbasis proses pembuatan (behind-the-scenes), styling visual editorial produk, dan peluncuran batch tematik terbatas.',
      results: [
        '+2.089% Lonjakan jangkauan akun Instagram Reels organik',
        '20.02% Rasio keterlibatan audiens (Engagement Rate)',
        '100% Produk terjual habis pada batch peluncuran pertama',
      ],
      image: '/5.png',
      extraImages: ['/5.png', '/6.png'],
    },
    {
      id: 'partnership',
      category: 'B2B NEGOTIATION & EVENT ACTIVATION',
      title: 'Manikarumi Indonesia — Retail Placement & PR',
      tag: 'Event PR & Display',
      period: '2023 - 2024',
      badgeColor: 'bg-amber-100 text-amber-900 border-amber-300',
      summary: 'Memimpin kemitraan offline dengan puluhan event organizer terkemuka di Jawa Timur dan Jakarta untuk penempatan stan display tenant.',
      challenge: 'Tingginya biaya sewa stan acara memerlukan seleksi ketat agar tenant mendapatkan traffic pengunjung yang relevan dan ROI penjualan positif.',
      strategy: 'Melakukan riset demografi pengunjung festival, menyusun deck penawaran sponsorship yang menarik, dan menata tata letak visual booth agar mengundang interaksi.',
      results: [
        '20+ Kemitraan strategis dengan event organizer sukses terjalin',
        'Ekspansi penempatan stan di kota Malang, Surabaya, dan Jakarta',
        'Peningkatan rata-rata foot-traffic stan hingga 40% per event',
      ],
      image: '/7.png',
      extraImages: ['/7.png', '/8.png'],
    },
    {
      id: 'data',
      category: 'SOFTWARE ENGINEERING & MEDIA MONITORING',
      title: 'PT Digivla Indonesia — Automated Intelligence Pipeline',
      tag: 'Data & Tech Strategy',
      period: '2023',
      badgeColor: 'bg-blue-100 text-blue-900 border-blue-300',
      summary: 'Mengembangkan sistem otomasi media monitoring berbasis Python untuk deteksi berita cetak dan pipeline ekstraksi data intelligence.',
      challenge: 'Pemantauan manual koran harian cetak memakan waktu berjam-jam dan rentan melewatkan publikasi isu strategis para klien korporat.',
      strategy: 'Membangun script otomasi web crawling dan pengenalan tata letak artikel koran digital menggunakan pustaka pengolahan citra dan data Python.',
      results: [
        'Otomasi pipeline pemrosesan puluhan surat kabar nasional setiap pagi',
        'Mempercepat waktu agregasi berita hingga 60% dibanding metode manual',
        'Penyajian data analitik yang presisi untuk laporan intelligence harian',
      ],
      image: '/9.png',
      extraImages: ['/9.png', '/10.png'],
    },
  ];

  const filteredDossier = activeDossierTab === 'all' 
    ? dossierProjects 
    : dossierProjects.filter(p => p.id === activeDossierTab);

  // 7 Trophy Case Awards Data
  const awardsList = [
    {
      year: '2024',
      rank: '1st Winner',
      rankBadge: 'bg-rose-dark text-white',
      title: 'National Fest Business Plan Competition 2024',
      organizer: 'Fakultas Ekonomi dan Bisnis, Universitas Islam Malang',
      scope: 'Tingkat Nasional',
      desc: 'Juara 1 dalam perancangan strategi model bisnis berkelanjutan dengan keunggulan analisis kelayakan finansial dan strategi penetrasi pasar.',
      certImg: '/11.png',
      eventImg: '/12.png',
    },
    {
      year: '2024',
      rank: 'Top 5 Finalist',
      rankBadge: 'bg-rose-dusty text-white',
      title: 'National Business Plan Competition (BPC) 2024',
      organizer: 'Universitas Negeri Padang',
      scope: 'Tingkat Nasional',
      desc: 'Masuk jajaran 5 proposal bisnis terbaik nasional dari ratusan tim perguruan tinggi di seluruh Indonesia.',
      certImg: '/13.png',
      eventImg: '/14.png',
    },
    {
      year: '2023',
      rank: '1st Winner',
      rankBadge: 'bg-rose-dark text-white',
      title: 'Lomba Business Plan Mahasiswa 2023',
      organizer: 'Politeknik Negeri Malang',
      scope: 'Tingkat Institusi',
      desc: 'Meraih Juara 1 melalui inovasi solusi digital bisnis terintegrasi dan validasi prototipe operasional.',
      certImg: '/15.png',
      eventImg: '/16.png',
    },
    {
      year: '2023',
      rank: 'Top 5 Finalist',
      rankBadge: 'bg-rose-dusty text-white',
      title: 'National Business Plan Competition 2023',
      organizer: 'Universitas Brawijaya',
      scope: 'Tingkat Nasional',
      desc: 'Finalis 5 Besar dalam kompetisi rencana bisnis bergengsi se-Indonesia dengan fokus pada skalabilitas usaha.',
      certImg: '/17.png',
      eventImg: '/11.png',
    },
    {
      year: '2023',
      rank: '2nd Winner',
      rankBadge: 'bg-forest-light text-white',
      title: 'National Fest Business Plan Competition 2023',
      organizer: 'Fakultas Ekonomi dan Bisnis, Universitas Islam Malang',
      scope: 'Tingkat Nasional',
      desc: 'Juara 2 Nasional dalam perumusan proposisi nilai produk dan strategi pemasaran multi-channel.',
      certImg: '/12.png',
      eventImg: '/13.png',
    },
    {
      year: '2022',
      rank: '2nd Winner',
      rankBadge: 'bg-forest-light text-white',
      title: 'Business Plan Competition Nasional 2022',
      organizer: 'Universitas Muhammadiyah Malang',
      scope: 'Tingkat Nasional',
      desc: 'Juara 2 dalam perancangan ide bisnis kreatif berdaya saing tinggi.',
      certImg: '/14.png',
      eventImg: '/15.png',
    },
    {
      year: '2022',
      rank: 'Best Speaker',
      rankBadge: 'bg-amber-600 text-white',
      title: 'Lomba Debat Nasional FH UNHAS 2022',
      organizer: 'Fakultas Hukum, Universitas Hasanuddin',
      scope: 'Tingkat Nasional',
      desc: 'Dinobatkan sebagai Pembicara Terbaik (Best Speaker) berkat retorika argumen terstruktur dan analisis kebijakan komprehensif.',
      certImg: '/16.png',
      eventImg: '/17.png',
    },
  ];

  // Dynamic filter for Trophy Case Mosaic
  const filteredAwards = awardsList.filter(award => {
    if (awardFilter === 'all') return true;
    if (awardFilter === '1st') return award.rank.includes('1st');
    if (awardFilter === '2nd') return award.rank.includes('2nd');
    if (awardFilter === 'top5') return award.rank.includes('Top 5');
    if (awardFilter === 'speaker') return award.rank.includes('Speaker');
    return true;
  });

  // 5 Organization Roles Data
  const organizationList = [
    {
      period: '2024 - Sekarang',
      role: 'Google Student Ambassador',
      institution: 'Google Developer Student Clubs (GDSC) Polinema',
      tag: 'Campus Leadership & Tech Community',
      desc: 'Menjadi representatif ekosistem Google di kampus. Memfasilitasi workshop teknologi, menghubungkan ratusan mahasiswa dengan teknologi Google, dan menyelenggarakan program inkubasi talenta digital.',
      images: ['/11.png', '/12.png'],
    },
    {
      period: '2023 - 2024',
      role: 'Vice Chairwoman (Wakil Ketua Himpunan)',
      institution: 'Himpunan Mahasiswa Teknologi Informasi (HMTI) Polinema',
      tag: 'Executive Governance',
      desc: 'Membawahi 8 departemen dan puluhan staf fungsional. Mengkoordinasikan perumusan program kerja tahunan, memediasi aspirasi mahasiswa ke pimpinan jurusan, dan mengawal efektivitas anggaran organisasi.',
      images: ['/13.png', '/14.png'],
    },
    {
      period: '2023',
      role: 'Secretary of General Election',
      institution: 'Komisi Pemilihan Umum Mahasiswa Jurusan TI',
      tag: 'Administrative & Electoral Governance',
      desc: 'Memimpin seluruh manajemen ketatausahaan, dokumentasi regulasi, dan verifikasi berkas kandidat pemilu raya pimpinan himpunan dengan transparansi penuh.',
      images: ['/15.png', '/16.png'],
    },
    {
      period: '2023',
      role: 'Chief Executive of New Student Orientation',
      institution: 'PKKMB Mahasiswa Baru Jurusan TI Polinema',
      tag: 'Operations & Event Leadership',
      desc: 'Memimpin penyelenggaraan orientasi mahasiswa baru yang dihadiri lebih dari 600 peserta. Mengelola alur acara, logistik lapangan, manajemen risiko, serta kepemimpinan lintas komite.',
      images: ['/17.png', '/11.png'],
    },
    {
      period: '2022 - 2023',
      role: 'Store Staff & Merchandise Logistics',
      institution: 'UKM Korps Protokoler Mahasiswa (KPM) Polinema',
      tag: 'Retail & Inventory Management',
      desc: 'Mengelola persediaan merchandise resmi protokoler, melayani transaksi penjualan seragam dan atribut, serta merekonsiliasi laporan arus kas kasir UKM.',
      images: ['/12.png', '/13.png'],
    },
  ];

  // Content Creator Multi-Account Data (Instagram & TikTok)
  const creatorAccounts = {
    personal: {
      name: 'Personal Account',
      handle: '@chikalnazmi',
      tag: 'Lifestyle, Career & Visual Stories',
      platforms: 'Instagram Reels & TikTok',
      stats: '10K+ Monthly Reach • High Engagement',
      centerImg: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=900&fit=crop',
      centerTitle: 'Visual Journal & Creative Storytelling',
      centerDesc: 'Mengeksplorasi pembuatan konten video pendek berirama sinematik, lifestyle reels, dan storytelling seputar karir dan pengembangan diri.',
      leftPhoneImg: 'https://images.unsplash.com/photo-1611162617474-5b21e879e113?w=500',
      leftPhoneTitle: 'Reels & Aesthetics',
      leftPhoneTag: 'Instagram',
      rightPhoneImg: 'https://images.unsplash.com/photo-1611162616475-46b635cb6868?w=500',
      rightPhoneTitle: 'Short-Form Video',
      rightPhoneTag: 'TikTok',
      link: 'https://instagram.com',
    },
    yarnup: {
      name: 'YarnUp! Studio',
      handle: '@yarnup.official',
      tag: 'Handcrafted Accessories & E-Commerce',
      platforms: 'Instagram & TikTok Shop',
      stats: '+2.089% Reach Surge • 20.02% Engagement',
      centerImg: 'https://images.unsplash.com/photo-1605289982774-9a6fef564df8?q=80&w=900&fit=crop',
      centerTitle: 'Handcrafted Accessories Catalog',
      centerDesc: 'Mengarahkan photoshoot katalog produk rajut, video proses manual (behind-the-scenes), dan audio trending untuk mendorong konversi penjualan.',
      leftPhoneImg: 'https://images.unsplash.com/photo-1584992236310-6edddc08acff?w=500',
      leftPhoneTitle: 'Behind The Craft',
      leftPhoneTag: 'Instagram',
      rightPhoneImg: 'https://images.unsplash.com/photo-1605289982774-9a6fef564df8?w=500',
      rightPhoneTitle: 'Crochet Patterns',
      rightPhoneTag: 'TikTok',
      link: 'https://instagram.com',
    },
    manikarumi: {
      name: 'Manikarumi Indonesia',
      handle: '@manikarumi.id',
      tag: 'Visual Merchandising & Event PR',
      platforms: 'Instagram & Event Vlogs',
      stats: '20+ Festival Displays • 40% Foot-Traffic Surge',
      centerImg: 'https://images.unsplash.com/photo-1556761175-5973dc0f32b7?q=80&w=900&fit=crop',
      centerTitle: 'Festival Exhibition & Retail Display',
      centerDesc: 'Menata tata letak booth offline di berbagai festival Malang dan Jakarta, lalu mengabadikannya dalam konten video interaktif untuk media sosial.',
      leftPhoneImg: 'https://images.unsplash.com/photo-1560343090-f0409e92791a?w=500',
      leftPhoneTitle: 'Booth Atmosphere',
      leftPhoneTag: 'Instagram',
      rightPhoneImg: 'https://images.unsplash.com/photo-1511578314322-379afb476865?w=500',
      rightPhoneTitle: 'Festival Highlights',
      rightPhoneTag: 'TikTok',
      link: 'https://instagram.com',
    },
    duasisi: {
      name: 'Dua Sisi Laundry',
      handle: '@duasisi.laundry',
      tag: 'Digital Marketing & Business Ops',
      platforms: 'Instagram & Customer Education',
      stats: '35% Efficiency Gain • Zero Garment Loss',
      centerImg: '/3.png',
      centerTitle: 'Standardized Laundry Operations',
      centerDesc: 'Memproduksi konten edukasi perawatan pakaian, higienitas proses cuci-setrika uap, dan kampanye promosi digital untuk menjangkau pelanggan lokal.',
      leftPhoneImg: '/4.png',
      leftPhoneTitle: 'Process Transparency',
      leftPhoneTag: 'Instagram',
      rightPhoneImg: 'https://images.unsplash.com/photo-1517677208171-0bc6725a3e60?w=500',
      rightPhoneTitle: 'Garment Care Tips',
      rightPhoneTag: 'TikTok',
      link: 'https://instagram.com',
    },
  };

  const currentCreator = creatorAccounts[activeCreatorAccount];

  // 4 Beyond The Screen Hobbies & Intellectual Pursuits
  const hobbiesList = [
    {
      title: 'Travelling',
      sub: 'Melihat dunia untuk perspektif baru',
      tag: 'World Exploration',
      icon: '✈️',
      img: 'https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?q=80&w=600&fit=crop',
      desc: 'Menjelajahi beragam kota dan keindahan alam untuk menyerap inspirasi budaya, arsitektur lokal, serta memperluas sudut pandang dalam memecahkan masalah.',
    },
    {
      title: 'Knitting & Crochet',
      sub: 'Eksplorasi kreativitas karya handmade',
      tag: 'Artisanal Craft',
      icon: '🧶',
      img: 'https://images.unsplash.com/photo-1605289982774-9a6fef564df8?q=80&w=600&fit=crop',
      desc: 'Mengekspresikan ketelitian melalui rajutan benang manual tangan, eksplorasi pola baru, dan merancang karya aksesoris bernilai artistik tinggi.',
    },
    {
      title: 'Writing (Medium)',
      sub: 'Berbagi pemikiran dan strategi bisnis',
      tag: 'Strategic Essays',
      icon: '✍️',
      img: 'https://images.unsplash.com/photo-1455390582262-044cdead2708?q=80&w=600&fit=crop',
      desc: 'Menuangkan pemikiran analitis seputar dinamika bisnis, kepemimpinan tim, dan strategi operasional ke dalam esai terstruktur di platform Medium.',
      link: 'https://medium.com',
    },
    {
      title: 'Reading & Learning',
      sub: 'Eksplorasi literatur & self-development',
      tag: 'Continuous Growth',
      icon: '📚',
      img: 'https://images.unsplash.com/photo-1512820790803-83ca734da794?q=80&w=600&fit=crop',
      desc: 'Membaca buku-buku strategi bisnis, psikologi konsumen, biografi pemimpin dunia, dan pengembangan diri untuk terus mengasah ketajaman wawasan.',
    },
  ];

  return (
    <div className="min-h-screen bg-[#E8EFE5] text-[#212B1E] font-sans antialiased selection:bg-rose-blush selection:text-rose-dark relative">
      {/* Decorative Subtle Background Botanical Glows */}
      <div className="fixed top-0 left-0 w-[550px] h-[550px] bg-rose-blush/30 rounded-full blur-3xl pointer-events-none -translate-x-1/2 -translate-y-1/2" />
      <div className="fixed bottom-0 right-0 w-[650px] h-[650px] bg-[#CAD7C5]/40 rounded-full blur-3xl pointer-events-none translate-x-1/3 translate-y-1/3" />

      {/* ========================================================================= */}
      {/* NAVBAR: Modern Floating Editorial Pill */}
      {/* ========================================================================= */}
      <nav className="sticky top-4 z-40 max-w-6xl mx-auto px-4 sm:px-6">
        <div className="bg-white/85 backdrop-blur-md border border-[#CAD7C5] rounded-full px-5 py-3 shadow-sm flex items-center justify-between transition-all hover:border-rose-dusty/40">
          <a href="#hero" className="flex items-center gap-2.5 group">
            <span className="w-8 h-8 rounded-full bg-forest text-[#E8EFE5] flex items-center justify-center font-serif text-sm font-bold group-hover:bg-rose-dark transition-colors">
              CN
            </span>
            <div className="flex flex-col">
              <span className="font-serif font-bold text-sm tracking-wide text-forest group-hover:text-rose-dark transition-colors">
                Chikal Nazmi Mahira
              </span>
              <span className="text-[10px] font-medium tracking-wider uppercase text-forest/60">
                Business & Marketing
              </span>
            </div>
          </a>

          {/* Desktop Nav Links */}
          <div className="hidden md:flex items-center gap-7 text-xs font-semibold tracking-wider uppercase text-forest/80">
            <a href="#works" className="hover:text-rose-dark transition-colors">
              Selected Works
            </a>
            <a href="#recognition" className="hover:text-rose-dark transition-colors">
              Awards (7)
            </a>
            <a href="#leadership" className="hover:text-rose-dark transition-colors">
              Leadership
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
            <a href="#works" onClick={() => setMobileMenuOpen(false)} className="py-1 hover:text-rose-dark">
              Selected Works
            </a>
            <a href="#recognition" onClick={() => setMobileMenuOpen(false)} className="py-1 hover:text-rose-dark">
              Awards (7)
            </a>
            <a href="#leadership" onClick={() => setMobileMenuOpen(false)} className="py-1 hover:text-rose-dark">
              Leadership
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
      <section id="hero" className="max-w-6xl mx-auto px-4 sm:px-6 pt-12 pb-16 lg:pt-16 lg:pb-24">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          
          {/* Left Column: Narrative, Typography & Direct Metrics (7 Cols) */}
          <div className="lg:col-span-7 flex flex-col items-start">
            
            {/* Live Availability Pill */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/80 border border-[#CAD7C5] text-forest text-xs font-medium mb-6 shadow-xs">
              <span className="w-2 h-2 rounded-full bg-emerald-600 animate-pulse" />
              <span>Available for Management Trainee & BizDev Roles</span>
            </div>

            {/* Editorial Headline */}
            <h1 className="font-serif text-4xl sm:text-5xl lg:text-6xl font-bold leading-[1.15] text-forest tracking-tight mb-6">
              Cultivating Growth through{' '}
              <span className="editorial-italic text-rose-dark font-normal">
                Analytical Strategy
              </span>{' '}
              & Creative Tenacity.
            </h1>

            {/* Value Proposition Subtext */}
            <p className="text-base sm:text-lg text-forest/80 leading-relaxed font-normal max-w-xl mb-8">
              Halo, saya <span className="font-semibold text-forest">Chikal Nazmi Mahira</span>. Lulusan D4 Sistem Informasi Bisnis (Politeknik Negeri Malang) dengan spesialisasi dalam ekspansi kemitraan, formulasi SOP operasional terukur, dan pertumbuhan brand berbasis data.
            </p>

            {/* Metrics Ribbon (Clean Statistical Grid) */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 w-full max-w-xl mb-8">
              <div className="bg-white/70 border border-[#CAD7C5] rounded-xl p-3 text-center">
                <span className="block font-serif text-2xl font-bold text-rose-dark">7x</span>
                <span className="text-[11px] text-forest/70 uppercase tracking-wider font-medium">National Awards</span>
              </div>
              <div className="bg-white/70 border border-[#CAD7C5] rounded-xl p-3 text-center">
                <span className="block font-serif text-2xl font-bold text-rose-dark">+2.089%</span>
                <span className="text-[11px] text-forest/70 uppercase tracking-wider font-medium">Reels Reach Surge</span>
              </div>
              <div className="bg-white/70 border border-[#CAD7C5] rounded-xl p-3 text-center">
                <span className="block font-serif text-2xl font-bold text-forest">20+</span>
                <span className="text-[11px] text-forest/70 uppercase tracking-wider font-medium">Event Partners</span>
              </div>
              <div className="bg-white/70 border border-[#CAD7C5] rounded-xl p-3 text-center">
                <span className="block font-serif text-2xl font-bold text-forest">D4 SIB</span>
                <span className="text-[11px] text-forest/70 uppercase tracking-wider font-medium">Polinema Honor</span>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-wrap items-center gap-4">
              <a
                href="#works"
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
                <span>✉</span>
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
                    src="/2.png"
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
      <div className="border-y border-[#CAD7C5]/70 bg-white/40 py-3.5 overflow-hidden">
        <div className="max-w-6xl mx-auto px-4 flex items-center justify-between text-xs font-semibold tracking-widest uppercase text-forest/60 overflow-x-auto gap-8 no-scrollbar">
          <span className="whitespace-nowrap flex items-center gap-2">
            <span className="text-rose-dusty">✦</span> Dua Sisi Laundry
          </span>
          <span className="whitespace-nowrap flex items-center gap-2">
            <span className="text-rose-dusty">✦</span> YarnUp! Studio
          </span>
          <span className="whitespace-nowrap flex items-center gap-2">
            <span className="text-rose-dusty">✦</span> Manikarumi Indonesia
          </span>
          <span className="whitespace-nowrap flex items-center gap-2">
            <span className="text-rose-dusty">✦</span> PT Digivla Indonesia
          </span>
          <span className="whitespace-nowrap flex items-center gap-2">
            <span className="text-rose-dusty">✦</span> Polinema Developer Students
          </span>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* SECTION 1: SELECTED STRATEGIC WORKS & CASE DOSSIER */}
      {/* ========================================================================= */}
      <section id="works" className="max-w-6xl mx-auto px-4 sm:px-6 py-20">
        
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/80 border border-[#CAD7C5] text-xs font-semibold text-rose-dark uppercase tracking-wider mb-3">
            Portfolio Dossier
          </div>
          <h2 className="font-serif text-3xl sm:text-4xl font-bold text-forest mb-3">
            Selected Works & Business Cases
          </h2>
          <p className="text-sm sm:text-base text-forest/75 leading-relaxed">
            Studi kasus nyata pembuktian eksekusi dari formulasi strategi operasional, peluncuran brand mandiri, hingga kemitraan komersial.
          </p>
        </div>

        {/* Dossier Filter Tabs */}
        <div className="flex flex-wrap items-center justify-center gap-2 mb-10">
          <button
            onClick={() => setActiveDossierTab('all')}
            className={`px-4 py-1.5 rounded-full text-xs font-semibold transition-all ${
              activeDossierTab === 'all'
                ? 'bg-rose-dark text-white shadow-sm'
                : 'bg-white/70 text-forest/80 border border-[#CAD7C5] hover:bg-white'
            }`}
          >
            All Initiatives (4)
          </button>
          <button
            onClick={() => setActiveDossierTab('operations')}
            className={`px-4 py-1.5 rounded-full text-xs font-semibold transition-all ${
              activeDossierTab === 'operations'
                ? 'bg-rose-dark text-white shadow-sm'
                : 'bg-white/70 text-forest/80 border border-[#CAD7C5] hover:bg-white'
            }`}
          >
            Operations & SOP
          </button>
          <button
            onClick={() => setActiveDossierTab('growth')}
            className={`px-4 py-1.5 rounded-full text-xs font-semibold transition-all ${
              activeDossierTab === 'growth'
                ? 'bg-rose-dark text-white shadow-sm'
                : 'bg-white/70 text-forest/80 border border-[#CAD7C5] hover:bg-white'
            }`}
          >
            Brand Growth & E-Commerce
          </button>
          <button
            onClick={() => setActiveDossierTab('partnership')}
            className={`px-4 py-1.5 rounded-full text-xs font-semibold transition-all ${
              activeDossierTab === 'partnership'
                ? 'bg-rose-dark text-white shadow-sm'
                : 'bg-white/70 text-forest/80 border border-[#CAD7C5] hover:bg-white'
            }`}
          >
            Event B2B Partnership
          </button>
          <button
            onClick={() => setActiveDossierTab('data')}
            className={`px-4 py-1.5 rounded-full text-xs font-semibold transition-all ${
              activeDossierTab === 'data'
                ? 'bg-rose-dark text-white shadow-sm'
                : 'bg-white/70 text-forest/80 border border-[#CAD7C5] hover:bg-white'
            }`}
          >
            Software & Data
          </button>
        </div>

        {/* Case Dossier Cards (Alternating Editorial 2-Column Layout) */}
        <div className="space-y-10">
          {filteredDossier.map((project, idx) => (
            <div
              key={project.id}
              className="bg-white/90 backdrop-blur-sm border border-[#CAD7C5] rounded-3xl p-6 sm:p-8 shadow-sm hover:shadow-md transition-all"
            >
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
                
                {/* Visual Showcase (5 Cols) */}
                <div className={`lg:col-span-5 ${idx % 2 === 1 ? 'lg:order-2' : ''}`}>
                  <div className="relative group overflow-hidden rounded-2xl border border-[#CAD7C5] bg-[#E8EFE5]/50 aspect-[4/3]">
                    <img
                      src={project.image}
                      alt={project.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-forest/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                      <button
                        onClick={() => openModal(project.title, project.category, project.summary, project.extraImages)}
                        className="px-4 py-2 rounded-full bg-white text-forest text-xs font-semibold shadow-md hover:bg-rose-blush transition-colors"
                      >
                        Buka Galeri Bukti ↗
                      </button>
                    </div>
                  </div>
                </div>

                {/* Narrative & Metrics Breakdown (7 Cols) */}
                <div className={`lg:col-span-7 ${idx % 2 === 1 ? 'lg:order-1' : ''}`}>
                  <div className="flex flex-wrap items-center gap-2 mb-2">
                    <span className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full border ${project.badgeColor} uppercase tracking-wider`}>
                      {project.tag}
                    </span>
                    <span className="text-xs text-forest/60 font-medium">
                      {project.period}
                    </span>
                  </div>

                  <h3 className="font-serif text-2xl sm:text-3xl font-bold text-forest mb-3">
                    {project.title}
                  </h3>

                  <p className="text-sm text-forest/80 leading-relaxed mb-5">
                    {project.summary}
                  </p>

                  {/* Challenge & Strategy Matrix */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-5 p-4 rounded-2xl bg-[#E8EFE5]/40 border border-[#CAD7C5]/70">
                    <div>
                      <span className="block text-[11px] font-bold uppercase tracking-wider text-forest/60 mb-1">
                        🎯 The Challenge
                      </span>
                      <p className="text-xs text-forest/80 leading-snug">
                        {project.challenge}
                      </p>
                    </div>
                    <div>
                      <span className="block text-[11px] font-bold uppercase tracking-wider text-rose-dark mb-1">
                        💡 Strategic Action
                      </span>
                      <p className="text-xs text-forest/80 leading-snug">
                        {project.strategy}
                      </p>
                    </div>
                  </div>

                  {/* Key Measurable Outcomes */}
                  <div className="mb-6">
                    <span className="block text-[11px] font-bold uppercase tracking-wider text-forest mb-2">
                      📈 Measurable Key Outcomes:
                    </span>
                    <ul className="space-y-1.5">
                      {project.results.map((res, rIdx) => (
                        <li key={rIdx} className="text-xs text-forest/85 flex items-start gap-2">
                          <span className="text-rose-dusty font-bold">✔</span>
                          <span>{res}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Action Link */}
                  <button
                    onClick={() => openModal(project.title, project.category, project.summary, project.extraImages)}
                    className="inline-flex items-center gap-1.5 text-xs font-bold text-rose-dark hover:text-rose-berry transition-colors"
                  >
                    <span>Lihat Dokumentasi & Detail SOP</span>
                    <span>→</span>
                  </button>

                </div>

              </div>
            </div>
          ))}
        </div>

      </section>

      {/* ========================================================================= */}
      {/* SECTION 2: WALL OF RECOGNITION (Visual Mosaic Exhibition Collage) */}
      {/* ========================================================================= */}
      <section id="recognition" className="max-w-6xl mx-auto px-4 sm:px-6 py-20 border-t border-[#CAD7C5]/80">
        
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-10">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-white/80 border border-[#CAD7C5] text-xs font-subheader text-rose-dark tracking-subheader uppercase mb-3">
            Honors & Achievements
          </div>
          <h2 className="font-serif text-3xl sm:text-4xl font-bold text-forest mb-3">
            National Trophy Case & Recognition
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
            🏆 1st Winner (2)
          </button>
          <button
            onClick={() => setAwardFilter('2nd')}
            className={`px-4 py-1.5 rounded-full text-xs font-subheader tracking-wider transition-all ${
              awardFilter === '2nd'
                ? 'bg-rose-dark text-white shadow-sm'
                : 'bg-white/80 text-forest/80 border border-[#CAD7C5] hover:bg-white'
            }`}
          >
            🥈 2nd Winner (2)
          </button>
          <button
            onClick={() => setAwardFilter('top5')}
            className={`px-4 py-1.5 rounded-full text-xs font-subheader tracking-wider transition-all ${
              awardFilter === 'top5'
                ? 'bg-rose-dark text-white shadow-sm'
                : 'bg-white/80 text-forest/80 border border-[#CAD7C5] hover:bg-white'
            }`}
          >
            🌟 Top 5 Finalist (2)
          </button>
          <button
            onClick={() => setAwardFilter('speaker')}
            className={`px-4 py-1.5 rounded-full text-xs font-subheader tracking-wider transition-all ${
              awardFilter === 'speaker'
                ? 'bg-rose-dark text-white shadow-sm'
                : 'bg-white/80 text-forest/80 border border-[#CAD7C5] hover:bg-white'
            }`}
          >
            🎙️ Best Speaker (1)
          </button>
        </div>

        {/* Visual Exhibition Mosaic Container (Framed with Pastel Glow like user's reference image!) */}
        <div className="relative p-3 sm:p-5 rounded-[2.5rem] bg-gradient-to-tr from-rose-blush/40 via-white/60 to-sage-DEFAULT/30 border border-white/80 shadow-xl backdrop-blur-sm">
          
          {/* Floating Left Dock with Quick Filter Icons (like the user reference image!) */}
          <div className="hidden lg:flex flex-col items-center gap-2 absolute -left-5 top-1/2 -translate-y-1/2 z-20 bg-white/95 backdrop-blur-md p-1.5 rounded-2xl border border-[#CAD7C5] shadow-lg">
            <button
              onClick={() => setAwardFilter('all')}
              title="Semua Penghargaan"
              className={`w-9 h-9 rounded-xl flex items-center justify-center text-xs transition-colors ${
                awardFilter === 'all' ? 'bg-rose-dark text-white' : 'text-forest/70 hover:bg-[#E8EFE5]'
              }`}
            >
              ✦
            </button>
            <button
              onClick={() => setAwardFilter('1st')}
              title="1st Winner"
              className={`w-9 h-9 rounded-xl flex items-center justify-center text-xs transition-colors ${
                awardFilter === '1st' ? 'bg-rose-dark text-white' : 'text-forest/70 hover:bg-[#E8EFE5]'
              }`}
            >
              🏆
            </button>
            <button
              onClick={() => setAwardFilter('2nd')}
              title="2nd Winner"
              className={`w-9 h-9 rounded-xl flex items-center justify-center text-xs transition-colors ${
                awardFilter === '2nd' ? 'bg-rose-dark text-white' : 'text-forest/70 hover:bg-[#E8EFE5]'
              }`}
            >
              🥈
            </button>
            <button
              onClick={() => setAwardFilter('top5')}
              title="Top 5 Finalist"
              className={`w-9 h-9 rounded-xl flex items-center justify-center text-xs transition-colors ${
                awardFilter === 'top5' ? 'bg-rose-dark text-white' : 'text-forest/70 hover:bg-[#E8EFE5]'
              }`}
            >
              ⭐
            </button>
            <button
              onClick={() => setAwardFilter('speaker')}
              title="Best Speaker"
              className={`w-9 h-9 rounded-xl flex items-center justify-center text-xs transition-colors ${
                awardFilter === 'speaker' ? 'bg-rose-dark text-white' : 'text-forest/70 hover:bg-[#E8EFE5]'
              }`}
            >
              🎙️
            </button>
          </div>

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
                  onClick={() => openModal(award.title, `${award.rank} • ${award.organizer}`, award.desc, [award.certImg, award.eventImg])}
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

                  {/* Default Bottom Minimal Teaser (Before Hover) */}
                  <div className="relative z-10 group-hover:opacity-0 transition-opacity duration-300 text-white">
                    <h3 className="font-serif text-lg font-bold leading-snug drop-shadow-md">
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
                        <span>📜 Sertifikat & Bukti Foto</span>
                      </span>
                      <span className="px-3.5 py-1.5 rounded-full bg-rose-dark text-white text-xs font-bold shadow-md hover:bg-rose-berry transition-colors flex items-center gap-1">
                        <span>Buka Detail</span>
                        <span>↗</span>
                      </span>
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
      {/* SECTION 3: INSTITUTIONAL LEADERSHIP & GOVERNANCE */}
      {/* ========================================================================= */}
      <section id="leadership" className="max-w-6xl mx-auto px-4 sm:px-6 py-20 border-t border-[#CAD7C5]/80">
        
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-14">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/80 border border-[#CAD7C5] text-xs font-semibold text-rose-dark uppercase tracking-wider mb-3">
            Governance & Track Record
          </div>
          <h2 className="font-serif text-3xl sm:text-4xl font-bold text-forest mb-3">
            Leadership & Organizational Impact
          </h2>
          <p className="text-sm sm:text-base text-forest/75 leading-relaxed">
            Pengalaman memimpin ratusan mahasiswa, mengelola tata kelola organisasi skala jurusan, serta mewakili ekosistem teknologi kampus.
          </p>
        </div>

        {/* Timeline Journal Layout */}
        <div className="space-y-6">
          {organizationList.map((org, idx) => (
            <div
              key={idx}
              className="bg-white/85 backdrop-blur-sm border border-[#CAD7C5] rounded-2xl p-6 sm:p-7 hover:border-rose-dusty/60 transition-all flex flex-col md:flex-row md:items-start justify-between gap-6"
            >
              <div className="md:max-w-3xl">
                <div className="flex flex-wrap items-center gap-2.5 mb-2">
                  <span className="text-xs font-semibold text-rose-dark bg-rose-blush/60 px-2.5 py-0.5 rounded-full">
                    {org.period}
                  </span>
                  <span className="text-[11px] font-bold text-forest/60 uppercase tracking-wider">
                    {org.tag}
                  </span>
                </div>
                <h3 className="font-serif text-2xl font-bold text-forest mb-1">
                  {org.role}
                </h3>
                <h4 className="text-xs font-semibold text-forest/70 uppercase tracking-wide mb-3">
                  {org.institution}
                </h4>
                <p className="text-xs sm:text-sm text-forest/80 leading-relaxed">
                  {org.desc}
                </p>
              </div>

              <div className="shrink-0 self-start md:self-center">
                <button
                  onClick={() => openModal(org.role, org.institution, org.desc, org.images)}
                  className="px-4 py-2 rounded-full text-xs font-semibold bg-white border border-[#CAD7C5] text-forest hover:bg-forest hover:text-white transition-all shadow-xs flex items-center gap-1.5"
                >
                  <span>Lihat Dokumentasi</span>
                  <span>↗</span>
                </button>
              </div>
            </div>
          ))}

          {/* Formal Education Summary Card */}
          <div className="bg-[#CAD7C5]/30 border-2 border-dashed border-[#CAD7C5] rounded-2xl p-6 sm:p-7 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-forest/60">
                Formal Academic Credential
              </span>
              <h3 className="font-serif text-xl font-bold text-forest mt-0.5">
                Sarjana Terapan Sistem Informasi Bisnis (D4 SIB)
              </h3>
              <p className="text-xs text-forest/75 mt-0.5">
                Jurusan Teknologi Informasi — Politeknik Negeri Malang (2020 - 2024)
              </p>
            </div>
            <div className="text-left sm:text-right">
              <span className="inline-block px-3 py-1 rounded-full text-xs font-bold bg-forest text-[#E8EFE5]">
                IPK Memuaskan / Honor
              </span>
            </div>
          </div>

        </div>

      </section>

      {/* ========================================================================= */}
      {/* SECTION 4: CREATIVE PURSUITS & CONTENT CREATOR HIGHLIGHT */}
      {/* ========================================================================= */}
      <section id="creative" className="max-w-6xl mx-auto px-4 sm:px-6 py-20 border-t border-[#CAD7C5]/80">
        
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/80 border border-[#CAD7C5] text-xs font-semibold text-rose-dark uppercase tracking-wider mb-3">
            Creative & Production
          </div>
          <h2 className="font-serif text-3xl sm:text-4xl font-bold text-forest mb-3">
            Content Creator & Creative Pursuits
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

          {/* Multi-Device Pop-out Stage (Inspired by user's reference image!) */}
          <div className="relative py-6 flex flex-col lg:flex-row items-center justify-center gap-6 lg:gap-8">
            
            {/* Left Phone Mockup (Reels / Stories) - Hover Pops! */}
            <div className="w-full sm:w-[220px] lg:w-[200px] shrink-0 bg-[#253521] p-3 rounded-[2.5rem] border-2 border-[#CAD7C5] shadow-lg transition-all duration-500 hover:-translate-y-3 hover:scale-105 hover:shadow-2xl group cursor-pointer">
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

            {/* Central Wide Featured Stage (Tablet / Screen View) - Hover Pops! */}
            <div className="w-full lg:max-w-[480px] bg-white rounded-3xl p-3 border-2 border-[#CAD7C5] shadow-xl transition-all duration-500 hover:-translate-y-3 hover:scale-[1.03] hover:shadow-2xl group cursor-pointer">
              <div className="flex items-center gap-1.5 px-3 py-1.5 border-b border-[#CAD7C5]/50 mb-2.5">
                <span className="w-2.5 h-2.5 rounded-full bg-rose-dusty" />
                <span className="w-2.5 h-2.5 rounded-full bg-amber-400" />
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
                <span className="text-[10px] text-forest/50 font-mono ml-2 truncate">
                  content-studio / {activeCreatorAccount}
                </span>
              </div>
              <div className="relative aspect-[16/10] rounded-2xl overflow-hidden bg-[#E8EFE5]">
                <img
                  src={currentCreator.centerImg}
                  alt={currentCreator.centerTitle}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-forest/90 via-forest/30 to-transparent flex flex-col justify-end p-5 text-white">
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
            <div className="w-full sm:w-[220px] lg:w-[200px] shrink-0 bg-[#253521] p-3 rounded-[2.5rem] border-2 border-[#CAD7C5] shadow-lg transition-all duration-500 hover:-translate-y-3 hover:scale-105 hover:shadow-2xl group cursor-pointer">
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
      <footer id="contact" className="max-w-6xl mx-auto px-4 sm:px-6 pb-16 pt-8">
        
        {/* Contact Invitation Card */}
        <div className="bg-forest text-[#E8EFE5] rounded-3xl p-8 sm:p-14 relative overflow-hidden shadow-xl border border-forest-light text-center flex flex-col items-center">
          
          {/* Subtle floral watermark effect */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-rose-dark/20 rounded-full blur-3xl pointer-events-none" />
          
          <div className="relative z-10 max-w-2xl mx-auto flex flex-col items-center text-center">
            <span className="inline-block px-3.5 py-1 rounded-full bg-white/10 border border-white/20 text-xs font-subheader text-rose-blush tracking-subheader uppercase mb-4">
              Get In Touch
            </span>
            <h2 className="font-serif text-3xl sm:text-5xl font-bold leading-tight mb-4 text-white">
              Let&apos;s Cultivate Meaningful{' '}
              <span className="editorial-italic text-rose-blush font-normal">
                Business Growth
              </span>{' '}
              Together.
            </h2>
            <p className="text-sm sm:text-base text-[#E8EFE5]/80 leading-relaxed mb-8 max-w-xl mx-auto">
              Terbuka untuk posisi Management Trainee, Business Development, Strategic Marketing Specialist, serta inisiatif kemitraan baru. Mari berdiskusi bagaimana saya dapat berkontribusi nyata bagi organisasi Anda.
            </p>

            <div className="flex flex-wrap items-center justify-center gap-3">
              <a
                href="mailto:chikalnazmi@gmail.com"
                className="px-6 py-3 rounded-full text-xs font-bold bg-white text-forest hover:bg-rose-blush transition-colors flex items-center gap-2 shadow-sm"
              >
                <span>✉ Kirim Email: chikalnazmi@gmail.com</span>
              </a>
              <a
                href="https://wa.me/6281234567890?text=Halo%20Chikal,%20saya%20tertarik%20berdiskusi%20mengenai%20peluang%20kerjasama."
                target="_blank"
                rel="noopener noreferrer"
                className="px-6 py-3 rounded-full text-xs font-bold bg-rose-dark text-white hover:bg-rose-berry transition-colors flex items-center gap-2 shadow-sm"
              >
                <span>💬 WhatsApp Langsung</span>
              </a>
              <a
                href="https://linkedin.com"
                target="_blank"
                rel="noopener noreferrer"
                className="px-5 py-3 rounded-full text-xs font-bold bg-white/10 border border-white/20 text-white hover:bg-white/20 transition-colors"
              >
                LinkedIn Profile ↗
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
      {/* REUSABLE MODAL DIALOG: Certificates & Proof Documentation */}
      {/* ========================================================================= */}
      {modalData.isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/65 backdrop-blur-sm animate-fadeIn">
          <div className="bg-white rounded-3xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl border border-[#CAD7C5] p-6 sm:p-8 relative">
            
            {/* Close Button */}
            <button
              onClick={closeModal}
              className="absolute top-5 right-5 w-8 h-8 rounded-full bg-[#E8EFE5] hover:bg-rose-blush text-forest flex items-center justify-center transition-colors text-base font-bold"
              aria-label="Tutup Dialog"
            >
              ✕
            </button>

            {/* Modal Category & Title */}
            <span className="inline-block text-[11px] font-bold uppercase tracking-wider text-rose-dark bg-rose-blush/40 px-3 py-1 rounded-full mb-2">
              {modalData.category}
            </span>
            <h3 className="font-serif text-2xl sm:text-3xl font-bold text-forest mb-3 pr-8">
              {modalData.title}
            </h3>
            <p className="text-xs sm:text-sm text-forest/80 leading-relaxed mb-6">
              {modalData.description}
            </p>

            {/* Modal Image Gallery */}
            <div className="space-y-4">
              {modalData.images.map((imgSrc, imgIdx) => (
                <div key={imgIdx} className="rounded-2xl overflow-hidden border border-[#CAD7C5] bg-[#E8EFE5]/30">
                  <img
                    src={imgSrc}
                    alt={`${modalData.title} dok ${imgIdx + 1}`}
                    className="w-full max-h-[480px] object-contain mx-auto"
                  />
                </div>
              ))}
            </div>

            {/* Modal Footer Button */}
            <div className="mt-6 pt-4 border-t border-[#CAD7C5] flex justify-end">
              <button
                onClick={closeModal}
                className="px-5 py-2 rounded-full text-xs font-semibold bg-forest text-white hover:bg-rose-dark transition-colors"
              >
                Tutup Dokumen
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}
