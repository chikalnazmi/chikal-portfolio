// src/lib/portfolio-store.ts
// Centralized portfolio state store with localStorage persistence and Supabase integration readiness

export interface SocialLinks {
  email: string;
  whatsapp: string;
  whatsappNumber: string;
  linkedin: string;
  instagram: string;
  tiktok: string;
  youtube: string;
  medium: string;
}

export interface CreatorAccount {
  name: string;
  handle: string;
  tag: string;
  platforms: string;
  stats: string;
  hasCenterStage: boolean;
  centerLink?: string;
  centerImg: string;
  centerTitle: string;
  centerDesc: string;
  leftPhoneImg: string;
  leftPhoneTitle: string;
  leftPhoneTag: string;
  leftPhoneLink?: string;
  rightPhoneImg: string;
  rightPhoneTitle: string;
  rightPhoneTag: string;
  rightPhoneLink?: string;
  link: string;
}

export interface ProjectDoc {
  id: string;
  category: string;
  title: string;
  tag: string;
  period: string;
  badgeColor: string;
  summary: string;
  challenge: string;
  strategy: string;
  results: string[];
  image: string;
  extraImages: string[];
  link?: string;
  linkLabel?: string;
}

export interface AwardItem {
  id?: string;
  year: string;
  rank: string;
  rankBadge: string;
  title: string;
  organizer: string;
  scope: string;
  level?: string;
  desc: string;
  certImg: string;
  eventImg: string;
  extraImages?: string[];
  link?: string;
  linkLabel?: string;
  videoLink?: string;
  videoLinkLabel?: string;
}

export interface OrganizationItem {
  id: string;
  period: string;
  role: string;
  institution: string;
  tag: string;
  desc: string;
  highlights: string[];
  images: string[];
  link?: string;
  linkLabel?: string;
}

export interface HeroContent {
  headline: string;
  subheadline: string;
  bio: string;
  avatarImg: string;
  avatarScale?: number;
  avatarOffsetY?: number;
  avatarOffsetX?: number;
  avatarBlendMode?: 'multiply' | 'normal';
  stat1Value: string;
  stat1Label: string;
  stat2Value: string;
  stat2Label: string;
  stat3Value: string;
  stat3Label: string;
  stat4Value: string;
  stat4Label: string;
}

export interface SkillCategory {
  id: string;
  title: string;
  subtitle: string;
  type: 'hard' | 'soft';
  icon: string;
  badgeColor: string;
  skills: string[];
  description: string;
}

export interface AcademicDegree {
  badge: string;
  period: string;
  degree: string;
  institution: string;
  gpaTitle: string;
  gpaValue: string;
  toeicTitle: string;
  toeicScore: string;
  toeicLevel: string;
  description: string;
  images: string[];
}

export interface CertificationItem {
  id: string;
  title: string;
  issuer: string;
  year: string;
  tag: string;
  badgeColor?: string;
  image: string;
  extraImages?: string[];
  desc: string;
  link?: string;
  linkLabel?: string;
}

export interface PortfolioData {
  hero: HeroContent;
  academic?: AcademicDegree;
  socials: SocialLinks;
  creatorAccounts: Record<string, CreatorAccount>;
  experiences?: ProjectDoc[];
  projects: ProjectDoc[];
  awards: AwardItem[];
  organizations?: OrganizationItem[];
  skills?: SkillCategory[];
  certifications?: CertificationItem[];
}

export const DEFAULT_PORTFOLIO_DATA: PortfolioData = {
  hero: {
    headline: 'Menghubungkan Strategi Bisnis, Operasional, & Kreativitas Digital.',
    subheadline: 'Open to Work • Management Trainee, BizDev, & Creative Roles',
    bio: 'Halo, saya Chikal Nazmi Mahira. Mahasiswi / Lulusan D4 Sistem Informasi Bisnis Politeknik Negeri Malang yang berfokus pada operasional bisnis, public relations, dan pembuatan konten kreatif.',
    avatarImg: '/2.png',
    avatarScale: 1.15,
    avatarOffsetY: -24,
    avatarBlendMode: 'multiply',
    stat1Value: '7x',
    stat1Label: 'Penghargaan Lomba',
    stat2Value: '10K+',
    stat2Label: 'Jangkauan Konten',
    stat3Value: '20+',
    stat3Label: 'Mitra Event',
    stat4Value: '775',
    stat4Label: 'Skor Resmi TOEIC',
  },
  socials: {
    email: 'chikalnazmi@gmail.com',
    whatsappNumber: '6281234567890',
    whatsapp: 'https://wa.me/6281234567890?text=Halo%20Chikal,%20saya%20tertarik%20berdiskusi%20mengenai%20peluang%20kerjasama.',
    linkedin: 'https://linkedin.com/in/chikalnazmi',
    instagram: 'https://instagram.com/chikalnazmi',
    tiktok: 'https://www.tiktok.com/@chikalnazmi',
    youtube: 'https://www.youtube.com/@chikalnazmi',
    medium: 'https://medium.com/@chikalnazmi',
  },
  creatorAccounts: {
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
  },
  experiences: [
    {
      id: 'duasisi-ops',
      category: 'BUSINESS OPERATIONS & SOP',
      title: 'Dua Sisi Laundry — Operational Setup & SOP',
      tag: 'Business Operations',
      period: '2024 - Sekarang',
      badgeColor: 'bg-emerald-100 text-emerald-900 border-emerald-300',
      summary: 'Menginisiasi peluncuran operasional laundry, menyusun Standard Operating Procedure (SOP) pengerjaan cuci-setrika harian, serta mengelola pencatatan kas dan promosi lokal.',
      challenge: 'Standarisasi mutu pengerjaan cuci-setrika dan alur kas harian.',
      strategy: 'Merancang SOP pengerjaan terstruktur dan pencatatan kas transparan.',
      results: [
        'SOP Cuci & Setrika',
        'Pencatatan Kas Harian',
        'Pemasaran Lokal',
      ],
      image: '/3.png',
      extraImages: ['/3.png', '/4.png', '/1.png'],
      link: 'https://instagram.com/duasisi.laundry',
      linkLabel: 'Profil Bisnis Dua Sisi ↗',
    },
    {
      id: 'yarnup-brand',
      category: 'SMALL BUSINESS & CREATIVE BRAND',
      title: 'YarnUp! Studio — Handmade Accessories',
      tag: 'Small Business Owner',
      period: '2024 - Sekarang',
      badgeColor: 'bg-rose-100 text-rose-900 border-rose-300',
      summary: 'Membangun usaha aksesoris rajut buatan tangan (handmade), memproduksi konten foto katalog serta video TikTok/Reels, dan menjadi sponsor di acara kampus.',
      challenge: 'Diferensiasi visual produk handmade di media sosial.',
      strategy: 'Membuat video proses pengerjaan dan foto katalog visual rapi.',
      results: [
        'Konten Video Kreatif',
        'Katalog Produk Handmade',
        'Kemitraan Acara Kampus',
      ],
      image: '/5.png',
      extraImages: ['/5.png', '/6.png', '/2.png'],
      link: 'https://instagram.com/yarnup.official',
      linkLabel: 'Official Store Instagram ↗',
    },
    {
      id: 'manikarumi-pr',
      category: 'PUBLIC RELATIONS & EVENT PLACEMENT',
      title: 'Manikarumi Indonesia — PR & Event Placement',
      tag: 'Public Relations Lead',
      period: '2024 - Sekarang',
      badgeColor: 'bg-amber-100 text-amber-900 border-amber-300',
      summary: 'Membangun relasi kemitraan dengan 20+ event organizer di Malang dan Jakarta untuk penempatan stan bazar, serta mengelola dokumentasi visual dan konten media sosial.',
      challenge: 'Koordinasi penempatan stan dan engagement pengunjung festival.',
      strategy: 'Komunikasi proaktif dengan mitra EO dan tata letak booth rapi.',
      results: [
        '20+ Mitra Event Organizer',
        'Operasional Stan Bazar',
        'Foto Katalog & Video TikTok',
      ],
      image: '/7.png',
      extraImages: ['/7.png', '/8.png', '/12.png'],
      link: 'https://instagram.com/manikarumi.id',
      linkLabel: 'Galeri Booth Manikarumi ↗',
    },
    {
      id: 'digivla-intern',
      category: 'SOFTWARE ENGINEERING INTERNSHIP',
      title: 'PT Digivla Indonesia — Software Engineer Intern',
      tag: 'Software & Data Systems',
      period: '2024 - 2025',
      badgeColor: 'bg-blue-100 text-blue-900 border-blue-300',
      summary: 'Mengembangkan sistem deteksi koran internal perusahaan menggunakan Python, melakukan pemeliharaan fitur, serta pengujian dan validasi aplikasi internal.',
      challenge: 'Automasi deteksi artikel koran untuk monitoring media.',
      strategy: 'Pengembangan script Python dan pengujian fitur berkelanjutan.',
      results: [
        'Python Automation',
        'Deteksi Berita Koran',
        'Pengujian Fitur Aplikasi',
      ],
      image: '/9.png',
      extraImages: ['/9.png', '/10.png', '/14.png'],
      link: 'https://digivla.id',
      linkLabel: 'Portal Digivla Intelligence ↗',
    },
  ],
  projects: [
    {
      id: 'surveyku',
      category: 'CAMPUS PROJECT (D4 SIB)',
      title: 'Website SurveyKu — Academic Survey Platform',
      tag: 'Web & Systems Development',
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
      id: 'media-monitor',
      category: 'ACADEMIC PYTHON AUTOMATION',
      title: 'Media Monitoring & News Detection Automation',
      tag: 'Python Automation & Data',
      period: '2023',
      badgeColor: 'bg-blue-100 text-blue-900 border-blue-300',
      summary: 'Proyek otomasi pengenalan pola artikel berita koran cetak ke format data terstruktur menggunakan script Python dan image processing.',
      challenge: 'Automasi ekstraksi berita cetak secara cepat dan akurat.',
      strategy: 'Penerapan modul Python regex dan image processing pipeline.',
      results: [
        'Python Regex Pipeline',
        'Data Extraction Accuracy',
        'Dokumentasi Pengujian Sistem',
      ],
      image: '/9.png',
      extraImages: ['/9.png', '/10.png', '/14.png'],
      link: 'https://polinema.ac.id',
      linkLabel: 'Dokumentasi Riset TI ↗',
    },
    {
      id: 'jti-certify',
      category: 'ACADEMIC CREDENTIAL PORTAL',
      title: 'JTI Certify — Mahasiswa TI Credential System',
      tag: 'Information Systems',
      period: '2023',
      badgeColor: 'bg-emerald-100 text-emerald-900 border-emerald-300',
      summary: 'Perancangan sistem informasi portofolio dan verifikasi sertifikat prestasi akademik mahasiswa Jurusan Teknologi Informasi.',
      challenge: 'Verifikasi keaslian sertifikat lomba dan arsip prestasi mahasiswa.',
      strategy: 'Pembuatan skema database relasional dan antarmuka verifikasi yang aman.',
      results: [
        'Sistem Arsip Prestasi',
        'Verifikasi Sertifikat Digital',
        'Pengujian Fungsionalitas',
      ],
      image: '/11.png',
      extraImages: ['/11.png', '/12.png', '/16.png'],
      link: 'https://polinema.ac.id',
      linkLabel: 'Portal Akademik JTI ↗',
    },
    {
      id: 'sales-dashboard',
      category: 'BUSINESS DATA MODELING',
      title: 'Sales Performance & Business Analytics Dashboard',
      tag: 'Business Analytics & Data',
      period: '2023',
      badgeColor: 'bg-amber-100 text-amber-900 border-amber-300',
      summary: 'Pemodelan data analitik penjualan dan rekonsiliasi kas berbasis spreadsheet formula tingkat lanjut untuk visualisasi KPI bisnis.',
      challenge: 'Membaca tren transaksi penjualan harian dan perputaran stok barang.',
      strategy: 'Formula lookup dinamis, pivot table, dan chart performa interaktif.',
      results: [
        'Financial KPI Modeling',
        'Automated Cash Reconciliation',
        'Visual Chart Summary',
      ],
      image: '/14.png',
      extraImages: ['/14.png', '/15.png', '/17.png'],
      link: 'https://polinema.ac.id',
      linkLabel: 'Laporan Pemodelan Bisnis ↗',
    },
    {
      id: 'bpc-canvas',
      category: 'BUSINESS PLAN & FEASIBILITY',
      title: 'Business Model Canvas & Market Feasibility Plan',
      tag: 'Strategic Planning & BMC',
      period: '2024',
      badgeColor: 'bg-rose-100 text-rose-900 border-rose-300',
      summary: 'Perumusan rencana bisnis komprehensif, analisis pasar 9 blok BMC, dan proyeksi arus kas keuangan untuk kompetisi bisnis nasional.',
      challenge: 'Menyusun strategi penetrasi pasar dengan diferensiasi nilai yang kuat.',
      strategy: 'Riset kompetitor mendalam, customer persona, dan validasi finansial.',
      results: [
        '9-Block BMC Formulation',
        'Market Penetration Strategy',
        'Financial Projections (3Y)',
      ],
      image: '/12.png',
      extraImages: ['/12.png', '/13.png', '/11.png'],
      link: 'https://unisma.ac.id',
      linkLabel: 'Proposal Inovasi Bisnis ↗',
    },
    {
      id: 'creative-campaign',
      category: 'CREATIVE MARKETING & E-COMMERCE',
      title: 'E-Commerce & Digital Content Creative Strategy',
      tag: 'Digital Marketing & Content',
      period: '2023 - Sekarang',
      badgeColor: 'bg-indigo-100 text-indigo-900 border-indigo-300',
      summary: 'Perencanaan kalender konten media sosial, produksi video pendek berdaya jangkau tinggi, serta eksekusi kampanye promosi produk kreatif.',
      challenge: 'Meningkatkan retensi penonton dan interaksi organik di platform media sosial.',
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
  ],
  awards: [
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
  ],
  academic: {
    badge: 'Formal Degree',
    period: '2020 – 2024',
    degree: 'Sarjana Terapan Sistem Informasi Bisnis (D4 SIB)',
    institution: 'Jurusan Teknologi Informasi — Politeknik Negeri Malang',
    gpaTitle: 'Academic Standing',
    gpaValue: 'IPK Memuaskan / Cum Laude Honor',
    toeicTitle: 'Global English Proficiency',
    toeicScore: '775',
    toeicLevel: 'Working Proficiency',
    description: 'Mengombinasikan tata kelola proses bisnis hulu-ke-hilir, pemodelan data relasional, serta strategi penetrasi pasar dengan kemampuan komunikasi bahasa Inggris standar multinasional.',
    images: ['/11.png', '/12.png', '/16.png'],
  },
  skills: [
    {
      id: 'tech',
      title: 'IT & Digital Systems',
      subtitle: 'Technical Skills',
      type: 'hard',
      icon: '',
      badgeColor: 'bg-emerald-100 text-emerald-900 border-emerald-300',
      description: 'Keahlian sistem informasi, riset pengguna, dan perancangan prototipe antarmuka digital.',
      skills: [
        'html/css fundamental',
        'UI/UX Research',
        'Figma Prototyping',
        'Design System',
        'Usability Testing',
        'Database Management',
      ],
    },
    {
      id: 'business',
      title: 'Business & Operations',
      subtitle: 'Business Skills',
      type: 'hard',
      icon: '',
      badgeColor: 'bg-amber-100 text-amber-900 border-amber-300',
      description: 'Penyusunan alur operasional, riset pasar, dan kelayakan pemodelan bisnis.',
      skills: [
        'Business Model Canvas',
        'Standard Operating Procedure (SOP)',
        'Market Research',
        'Financial Feasibility',
        'Inventory & Cash Reconciliation',
        'B2B Partnership Strategy',
      ],
    },
    {
      id: 'creative',
      title: 'Creative & Media',
      subtitle: 'Creative Skills',
      type: 'hard',
      icon: '',
      badgeColor: 'bg-rose-100 text-rose-900 border-rose-300',
      description: 'Pembuatan konten visual, video pendek media sosial, dan penceritaan brand.',
      skills: [
        'Branding',
        'CapCut & Video Editing',
        'Content Storytelling',
        'Social Media Strategy',
        'Visual Layout Design',
        'Product Photography Direction',
      ],
    },
    {
      id: 'soft',
      title: 'Personal Skills',
      subtitle: 'Personal Strengths',
      type: 'soft',
      icon: '',
      badgeColor: 'bg-purple-100 text-purple-900 border-purple-300',
      description: 'Kemampuan komunikasi, kepemimpinan, dan kerja sama tim.',
      skills: [
        'Creative & Collaborative',
        'Proactive Problem Solving',
        'Strategic Communication',
        'Responsibility & High Ownership',
        'Cross-Functional Collaboration',
      ],
    },
  ],
  certifications: [
    {
      id: 'revou-dm',
      title: 'Intro to Digital Marketing',
      issuer: 'RevoU',
      year: '2024',
      tag: 'Marketing Strategy',
      badgeColor: 'bg-rose-100 text-rose-800 border-rose-200',
      image: '/13.png',
      desc: 'Sertifikasi intensif perumusan digital marketing framework, strategi social media ads, riset target audiens, dan optimasi conversion funnel.',
      link: 'https://revou.co',
      linkLabel: 'Verifikasi RevoU ↗',
    },
    {
      id: 'myskill-da',
      title: 'Data Analysis Fundamental',
      issuer: 'MySkill',
      year: '2024',
      tag: 'Business Analytics',
      badgeColor: 'bg-emerald-100 text-emerald-800 border-emerald-200',
      image: '/9.png',
      desc: 'Pondasi analisis data bisnis, statistik deskriptif, visualisasi grafik data interaktif, dan penarikan insight untuk pengambilan keputusan strategis.',
      link: 'https://myskill.id',
      linkLabel: 'Verifikasi MySkill ↗',
    },
    {
      id: 'myskill-campaign',
      title: 'Creating Marketing Campaign',
      issuer: 'MySkill',
      year: '2024',
      tag: 'Brand Campaign',
      badgeColor: 'bg-amber-100 text-amber-800 border-amber-200',
      image: '/7.png',
      desc: 'Perancangan pesan kampanye kreatif, copywriting terstruktur, pemilihan kanal distribusi konten, serta pengukuran KPI reach dan konversi.',
      link: 'https://myskill.id',
      linkLabel: 'Verifikasi MySkill ↗',
    },
    {
      id: 'myskill-excel',
      title: 'VLOOKUP & HLOOKUP Mastery',
      issuer: 'MySkill',
      year: '2023',
      tag: 'Spreadsheet Modeling',
      badgeColor: 'bg-blue-100 text-blue-800 border-blue-200',
      image: '/15.png',
      desc: 'Teknik pengolahan dan rekonsiliasi data kompleks skala besar menggunakan fungsi pencarian tabel dan formula lookup tingkat lanjut Microsoft Excel.',
      link: 'https://myskill.id',
      linkLabel: 'Verifikasi MySkill ↗',
    },
    {
      id: 'toeic-ets',
      title: 'Official TOEIC Certification (Score 775)',
      issuer: 'ETS / ITC Indonesia',
      year: '2024',
      tag: 'English Proficiency',
      badgeColor: 'bg-purple-100 text-purple-800 border-purple-200',
      image: '/16.png',
      desc: 'Sertifikasi kemahiran bahasa Inggris internasional dengan skor resmi 775 (Professional Working Proficiency) untuk komunikasi bisnis global.',
      link: 'https://itc-indonesia.com',
      linkLabel: 'Sertifikat Resmi TOEIC ↗',
    },
  ],
  organizations: [
    {
      id: 'gdsc',
      period: '2024 - Sekarang',
      role: 'Google Student Ambassador',
      institution: 'Google Developer Student Clubs (GDSC) Polinema',
      tag: 'Campus Leadership & Tech Community',
      desc: 'Representatif ekosistem Google di kampus, memfasilitasi sesi pengenalan teknologi dan kegiatan komunitas mahasiswa.',
      highlights: ['Google Ecosystem', 'Tech Workshops', 'Komunitas Mahasiswa'],
      images: ['/11.png', '/12.png', '/10.png'],
    },
    {
      id: 'hmti',
      period: '2023 - 2024',
      role: 'Vice Chairwoman (Wakil Ketua Himpunan)',
      institution: 'Himpunan Mahasiswa Teknologi Informasi (HMTI) Polinema',
      tag: 'Executive Governance',
      desc: 'Membantu koordinasi lintas divisi dan mendukung kelancaran pelaksanaan program kerja mahasiswa Jurusan TI.',
      highlights: ['Koordinasi Divisi', 'Program Kerja Mahasiswa', 'Aspirasi Mahasiswa'],
      images: ['/13.png', '/14.png', '/1.png'],
    },
    {
      id: 'kpu',
      period: '2023',
      role: 'Secretary of General Election',
      institution: 'Komisi Pemilihan Umum Mahasiswa Jurusan TI',
      tag: 'Administrative & Electoral Governance',
      desc: 'Mengelola tata kelola administrasi, surat-menyurat, dan dokumentasi pada pemilihan umum raya himpunan mahasiswa.',
      highlights: ['Administrasi Pemilu', 'Verifikasi Berkas', 'Dokumentasi Acara'],
      images: ['/15.png', '/16.png', '/3.png'],
    },
    {
      id: 'pkkmb',
      period: '2023',
      role: 'Chief Executive of New Student Orientation',
      institution: 'PKKMB Mahasiswa Baru Jurusan TI Polinema',
      tag: 'Operations & Event Leadership',
      desc: 'Mengkoordinasikan kepanitiaan dalam penyelenggaraan orientasi mahasiswa baru jurusan TI.',
      highlights: ['Koordinasi Panitia', 'Alur Acara', 'Penyambutan Mahasiswa Baru'],
      images: ['/17.png', '/11.png', '/4.png'],
    },
    {
      id: 'kpm',
      period: '2022 - 2023',
      role: 'Store Staff & Merchandise Logistics',
      institution: 'UKM Korps Protokoler Mahasiswa (KPM) Polinema',
      tag: 'Retail & Inventory Management',
      desc: 'Membantu pengelolaan stok merchandise dan pencatatan transaksi kasir seragam UKM.',
      highlights: ['Merchandise Organisasi', 'Pelayanan Transaksi', 'Pencatatan Kasir'],
      images: ['/12.png', '/13.png', '/5.png'],
    },
  ],
};

const STORAGE_KEY = 'chikal_portfolio_content_v7';
const STORAGE_TS_KEY = 'chikal_portfolio_content_v7_ts';
const EVENT_NAME = 'chikal_portfolio_updated';

import { supabase, isSupabaseConfigured } from './supabase';

function mergePortfolioData(raw: Partial<PortfolioData>): PortfolioData {
  const mergedHero = { ...DEFAULT_PORTFOLIO_DATA.hero, ...(raw.hero || {}) };
  if (mergedHero.stat4Value === 'D4 SIB') {
    mergedHero.stat4Value = '775';
    mergedHero.stat4Label = 'Skor Resmi TOEIC';
  }
  return {
    hero: mergedHero,
    academic: raw.academic || DEFAULT_PORTFOLIO_DATA.academic,
    socials: { ...DEFAULT_PORTFOLIO_DATA.socials, ...(raw.socials || {}) },
    creatorAccounts: { ...DEFAULT_PORTFOLIO_DATA.creatorAccounts, ...(raw.creatorAccounts || {}) },
    experiences: raw.experiences && raw.experiences.length > 0 ? raw.experiences : DEFAULT_PORTFOLIO_DATA.experiences,
    projects: raw.projects && raw.projects.length > 0 ? raw.projects : DEFAULT_PORTFOLIO_DATA.projects,
    awards: raw.awards && raw.awards.length > 0 ? raw.awards : DEFAULT_PORTFOLIO_DATA.awards,
    organizations: raw.organizations && raw.organizations.length > 0 ? raw.organizations : DEFAULT_PORTFOLIO_DATA.organizations,
    skills: raw.skills && raw.skills.length > 0 ? raw.skills : DEFAULT_PORTFOLIO_DATA.skills,
    certifications: raw.certifications && raw.certifications.length > 0 ? raw.certifications : DEFAULT_PORTFOLIO_DATA.certifications,
  };
}

// Helper to get portfolio data (reads localStorage on client, or defaults)
export function getPortfolioData(): PortfolioData {
  if (typeof window === 'undefined') return DEFAULT_PORTFOLIO_DATA;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return DEFAULT_PORTFOLIO_DATA;
    const parsed = JSON.parse(raw);
    return mergePortfolioData(parsed);
  } catch {
    return DEFAULT_PORTFOLIO_DATA;
  }
}

// Fetch from Supabase Cloud Database (via server API or direct Supabase client)
export async function fetchPortfolioDataFromSupabase(): Promise<PortfolioData | null> {
  if (typeof window === 'undefined') {
    return null;
  }

  // Check local timestamp
  let localTs = 0;
  try {
    const storedTs = localStorage.getItem(STORAGE_TS_KEY);
    if (storedTs) localTs = parseInt(storedTs, 10) || 0;
  } catch {}

  // 1. Try server-side API first for ultra-reliable fetching with fast timeout (3.5s max)
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 3500);
    const res = await fetch('/api/portfolio', { cache: 'no-store', signal: controller.signal });
    clearTimeout(timeoutId);

    if (res.ok) {
      const json = await res.json();
      if (json && json.data && json.data.hero) {
        const remoteUpdated = json.updatedAt ? new Date(json.updatedAt).getTime() : 0;

        // If local has newer edits that haven't been pushed, do NOT overwrite with older data
        if (localTs > 0 && remoteUpdated > 0 && localTs > remoteUpdated + 2000) {
          console.log('Local data is newer than remote Supabase timestamp. Retaining local data.');
          return getPortfolioData();
        }

        const merged = mergePortfolioData(json.data);
        try {
          localStorage.setItem(STORAGE_KEY, JSON.stringify(merged));
          if (remoteUpdated > 0) {
            localStorage.setItem(STORAGE_TS_KEY, remoteUpdated.toString());
          }
          window.dispatchEvent(new CustomEvent(EVENT_NAME, { detail: merged }));
        } catch {}
        return merged;
      }
    }
  } catch (e) {
    console.warn('API /api/portfolio fetch notice (falling back):', e);
  }

  // 2. Direct client-side Supabase query fallback
  if (!isSupabaseConfigured || !supabase) {
    return null;
  }

  try {
    const { data, error } = await supabase
      .from('portfolio_content')
      .select('content, updated_at')
      .eq('id', 'main')
      .single();

    if (error || !data || !data.content || !data.content.hero) {
      return null;
    }

    const remoteUpdated = data.updated_at ? new Date(data.updated_at).getTime() : 0;
    if (localTs > 0 && remoteUpdated > 0 && localTs > remoteUpdated + 2000) {
      console.log('Local data is newer than Supabase. Keeping local data.');
      return getPortfolioData();
    }

    const merged = mergePortfolioData(data.content as Partial<PortfolioData>);

    // Cache locally
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(merged));
      if (remoteUpdated > 0) {
        localStorage.setItem(STORAGE_TS_KEY, remoteUpdated.toString());
      }
      window.dispatchEvent(new CustomEvent(EVENT_NAME, { detail: merged }));
    } catch {}

    return merged;
  } catch (err) {
    console.warn('Supabase fetch notice:', err);
    return null;
  }
}

async function uploadDataUrl(dataUrl: string, prefix = 'photo'): Promise<string> {
  if (!dataUrl || !dataUrl.startsWith('data:image/')) return dataUrl;
  try {
    const res = await fetch(dataUrl);
    const blob = await res.blob();
    const ext = blob.type.split('/')[1] || 'jpg';
    const filename = `${prefix}_${Date.now()}_${Math.random().toString(36).substring(2, 7)}.${ext}`;
    const file = new File([blob], filename, { type: blob.type });

    const formData = new FormData();
    formData.append('file', file);

    const uploadRes = await fetch('/api/upload', {
      method: 'POST',
      body: formData,
    });

    if (uploadRes.ok) {
      const json = await uploadRes.json();
      if (json.url) return json.url;
    }
  } catch (err) {
    console.warn('Could not upload base64 image to storage:', err);
  }
  return dataUrl;
}

export async function sanitizeAndUploadAllImages(data: PortfolioData): Promise<PortfolioData> {
  const cloned: PortfolioData = JSON.parse(JSON.stringify(data));

  // 1. Hero Avatar
  if (cloned.hero?.avatarImg && cloned.hero.avatarImg.startsWith('data:image/')) {
    cloned.hero.avatarImg = await uploadDataUrl(cloned.hero.avatarImg, 'hero_avatar');
  }

  // 2. Academic Images
  if (cloned.academic?.images && Array.isArray(cloned.academic.images)) {
    for (let i = 0; i < cloned.academic.images.length; i++) {
      if (cloned.academic.images[i]?.startsWith('data:image/')) {
        cloned.academic.images[i] = await uploadDataUrl(cloned.academic.images[i], `academic_${i}`);
      }
    }
  }

  // 3. Creator Accounts
  if (cloned.creatorAccounts) {
    for (const key of Object.keys(cloned.creatorAccounts)) {
      const acc = cloned.creatorAccounts[key];
      if (acc.centerImg?.startsWith('data:image/')) {
        acc.centerImg = await uploadDataUrl(acc.centerImg, `creator_${key}_center`);
      }
      if (acc.leftPhoneImg?.startsWith('data:image/')) {
        acc.leftPhoneImg = await uploadDataUrl(acc.leftPhoneImg, `creator_${key}_left`);
      }
      if (acc.rightPhoneImg?.startsWith('data:image/')) {
        acc.rightPhoneImg = await uploadDataUrl(acc.rightPhoneImg, `creator_${key}_right`);
      }
    }
  }

  // 4. Experiences
  if (cloned.experiences && Array.isArray(cloned.experiences)) {
    for (let i = 0; i < cloned.experiences.length; i++) {
      const exp = cloned.experiences[i];
      if (exp.image?.startsWith('data:image/')) {
        exp.image = await uploadDataUrl(exp.image, `exp_${i}`);
      }
      if (exp.extraImages && Array.isArray(exp.extraImages)) {
        for (let j = 0; j < exp.extraImages.length; j++) {
          if (exp.extraImages[j]?.startsWith('data:image/')) {
            exp.extraImages[j] = await uploadDataUrl(exp.extraImages[j], `exp_${i}_extra_${j}`);
          }
        }
      }
    }
  }

  // 5. Projects
  if (cloned.projects && Array.isArray(cloned.projects)) {
    for (let i = 0; i < cloned.projects.length; i++) {
      const proj = cloned.projects[i];
      if (proj.image?.startsWith('data:image/')) {
        proj.image = await uploadDataUrl(proj.image, `proj_${i}`);
      }
      if (proj.extraImages && Array.isArray(proj.extraImages)) {
        for (let j = 0; j < proj.extraImages.length; j++) {
          if (proj.extraImages[j]?.startsWith('data:image/')) {
            proj.extraImages[j] = await uploadDataUrl(proj.extraImages[j], `proj_${i}_extra_${j}`);
          }
        }
      }
    }
  }

  // 6. Awards
  if (cloned.awards && Array.isArray(cloned.awards)) {
    for (let i = 0; i < cloned.awards.length; i++) {
      const aw = cloned.awards[i];
      if (aw.certImg?.startsWith('data:image/')) {
        aw.certImg = await uploadDataUrl(aw.certImg, `award_${i}_cert`);
      }
      if (aw.eventImg?.startsWith('data:image/')) {
        aw.eventImg = await uploadDataUrl(aw.eventImg, `award_${i}_event`);
      }
      if (aw.extraImages && Array.isArray(aw.extraImages)) {
        for (let j = 0; j < aw.extraImages.length; j++) {
          if (aw.extraImages[j]?.startsWith('data:image/')) {
            aw.extraImages[j] = await uploadDataUrl(aw.extraImages[j], `award_${i}_extra_${j}`);
          }
        }
      }
    }
  }

  // 7. Certifications
  if (cloned.certifications && Array.isArray(cloned.certifications)) {
    for (let i = 0; i < cloned.certifications.length; i++) {
      const cert = cloned.certifications[i];
      if (cert.image?.startsWith('data:image/')) {
        cert.image = await uploadDataUrl(cert.image, `cert_${i}`);
      }
      if (cert.extraImages && Array.isArray(cert.extraImages)) {
        for (let j = 0; j < cert.extraImages.length; j++) {
          if (cert.extraImages[j]?.startsWith('data:image/')) {
            cert.extraImages[j] = await uploadDataUrl(cert.extraImages[j], `cert_${i}_extra_${j}`);
          }
        }
      }
    }
  }

  // 8. Organizations & Leadership
  if (cloned.organizations && Array.isArray(cloned.organizations)) {
    for (let i = 0; i < cloned.organizations.length; i++) {
      const org = cloned.organizations[i];
      if (org.images && Array.isArray(org.images)) {
        for (let j = 0; j < org.images.length; j++) {
          if (org.images[j]?.startsWith('data:image/')) {
            org.images[j] = await uploadDataUrl(org.images[j], `org_${i}_img_${j}`);
          }
        }
      }
    }
  }

  return cloned;
}

export interface SaveResult {
  success: boolean;
  data?: PortfolioData;
  message?: string;
  error?: string;
}

// Helper to save portfolio data (saves locally + awaits sync to Supabase Cloud)
export async function savePortfolioData(data: PortfolioData): Promise<SaveResult> {
  if (typeof window === 'undefined') {
    return { success: false, data, error: 'Window not defined' };
  }

  // 1. Auto-upload any embedded base64 images so payload is lightweight (<20KB) and never hits 413
  const cleanData = await sanitizeAndUploadAllImages(data);
  const nowTs = Date.now();

  // 2. Instant local persistence for zero latency
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(cleanData));
    localStorage.setItem(STORAGE_TS_KEY, nowTs.toString());
    window.dispatchEvent(new CustomEvent(EVENT_NAME, { detail: cleanData }));
  } catch (e: any) {
    console.error('Error saving portfolio data to localStorage:', e);
  }

  // 3. Cloud Sync via API and direct Supabase
  let apiSuccess = false;
  let errorMsg = '';

  try {
    const res = await fetch('/api/portfolio', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(cleanData),
    });

    if (res.ok) {
      apiSuccess = true;
    } else {
      const errJson = await res.json().catch(() => ({}));
      errorMsg = errJson.error || `Server responded with status ${res.status}`;
    }
  } catch (e: any) {
    errorMsg = e?.message || 'Network error connecting to /api/portfolio';
  }

  // Direct Supabase fallback / complementary sync
  if (isSupabaseConfigured && supabase) {
    try {
      const { error } = await supabase
        .from('portfolio_content')
        .upsert({
          id: 'main',
          content: cleanData,
          updated_at: new Date(nowTs).toISOString(),
        });

      if (!error) {
        apiSuccess = true;
      } else if (!apiSuccess) {
        errorMsg = error.message;
      }
    } catch (sbErr: any) {
      if (!apiSuccess) {
        errorMsg = sbErr?.message || errorMsg;
      }
    }
  }

  if (apiSuccess) {
    return {
      success: true,
      data: cleanData,
      message: 'Perubahan berhasil disimpan ke Cloud Database Supabase!',
    };
  }

  // If both failed to connect to cloud, but saved locally
  return {
    success: false,
    data: cleanData,
    error: errorMsg || 'Gagal tersambung ke database Supabase Cloud. Data tersimpan di browser.',
  };
}

// Reset to default
export async function resetPortfolioData(): Promise<SaveResult> {
  if (typeof window === 'undefined') return { success: false };
  const nowTs = Date.now();
  localStorage.removeItem(STORAGE_KEY);
  localStorage.removeItem(STORAGE_TS_KEY);
  window.dispatchEvent(new CustomEvent(EVENT_NAME, { detail: DEFAULT_PORTFOLIO_DATA }));

  try {
    const res = await fetch('/api/portfolio', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(DEFAULT_PORTFOLIO_DATA),
    });
    if (res.ok) {
      return { success: true, message: 'Data berhasil direset ke default!' };
    }
  } catch {}

  if (isSupabaseConfigured && supabase) {
    await supabase
      .from('portfolio_content')
      .upsert({
        id: 'main',
        content: DEFAULT_PORTFOLIO_DATA,
        updated_at: new Date(nowTs).toISOString(),
      });
  }

  return { success: true };
}

// Subscribe to updates in real time
export function subscribeToPortfolioUpdates(callback: (data: PortfolioData) => void): () => void {
  if (typeof window === 'undefined') return () => {};
  const handler = (e: Event) => {
    const customEvent = e as CustomEvent<PortfolioData>;
    if (customEvent.detail) {
      callback(customEvent.detail);
    } else {
      callback(getPortfolioData());
    }
  };
  window.addEventListener(EVENT_NAME, handler);
  window.addEventListener('storage', handler);
  return () => {
    window.removeEventListener(EVENT_NAME, handler);
    window.removeEventListener('storage', handler);
  };
}
