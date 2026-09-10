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
  year: string;
  rank: string;
  rankBadge: string;
  title: string;
  organizer: string;
  scope: string;
  desc: string;
  certImg: string;
  eventImg: string;
  link?: string;
  linkLabel?: string;
}

export interface PortfolioData {
  socials: SocialLinks;
  creatorAccounts: Record<string, CreatorAccount>;
  projects: ProjectDoc[];
  awards: AwardItem[];
}

export const DEFAULT_PORTFOLIO_DATA: PortfolioData = {
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
      // Dua Sisi Laundry: Belum ada video landscape, sehingga diatur hasCenterStage: false
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
  },
  projects: [
    {
      id: 'operations',
      category: 'OPERATIONAL EXCELLENCE & SCALING',
      title: 'Dua Sisi Laundry Operations & SOP System',
      tag: 'Business Operations',
      period: '2023 - 2024',
      badgeColor: 'bg-emerald-100 text-emerald-900 border-emerald-300',
      summary: 'Perumusan Standard Operating Procedure (SOP) hulu-ke-hilir, standarisasi pengerjaan cucian, dan digitalisasi pencatatan keuangan kas harian.',
      challenge: 'Variasi mutu pengerjaan cuci-setrika, risiko keterlambatan pengembalian, dan pencatatan kas manual rentan selisih.',
      strategy: 'Merancang SOP 5 tahap (Sortir-Cuci-Kering-Setrika-Packing), SLA 24/48 jam, dan dashboard kas harian terpusat.',
      results: [
        '35% Peningkatan efisiensi rotasi cucian harian',
        '0% Zero-complaint atas kerusakan / kehilangan',
        '100% Pencatatan kas & bahan baku transparan',
      ],
      image: '/3.png',
      extraImages: ['/3.png', '/4.png', '/1.png'],
      link: 'https://instagram.com/duasisi.laundry',
      linkLabel: 'Profil Bisnis Dua Sisi ↗',
    },
    {
      id: 'growth',
      category: 'ECOMMERCE & ORGANIC BRAND LAUNCH',
      title: 'YarnUp! Studio — Handcrafted Accessories Engine',
      tag: 'Brand Founder & Growth',
      period: '2023 - Sekarang',
      badgeColor: 'bg-rose-100 text-rose-900 border-rose-300',
      summary: 'Membangun brand aksesoris rajut handmade dari nol, validasi produk via video storytelling, dan konversi media sosial.',
      challenge: 'Banjir produk impor murah; brand butuh diferensiasi visual kuat dan positioning emosional untuk harga premium.',
      strategy: 'Content marketing proses pembuatan (behind-the-scenes), styling visual editorial produk, dan rilis batch terbatas.',
      results: [
        '+2.089% Lonjakan reach Reels Instagram organik',
        '20.02% Rasio keterlibatan (Engagement Rate)',
        '100% Produk terjual habis pada batch 1',
      ],
      image: '/5.png',
      extraImages: ['/5.png', '/6.png', '/2.png'],
      link: 'https://instagram.com/yarnup.official',
      linkLabel: 'Official Store Instagram ↗',
    },
    {
      id: 'partnership',
      category: 'B2B NEGOTIATION & EVENT ACTIVATION',
      title: 'Manikarumi Indonesia — Retail Placement & PR',
      tag: 'Event PR & Display',
      period: '2023 - 2024',
      badgeColor: 'bg-amber-100 text-amber-900 border-amber-300',
      summary: 'Memimpin kemitraan offline dengan puluhan event organizer terkemuka di Jawa Timur dan Jakarta untuk penempatan stan display tenant.',
      challenge: 'Biaya sewa stan tinggi; memerlukan seleksi ketat agar tenant mendapatkan traffic pengunjung relevan & ROI positif.',
      strategy: 'Riset demografi pengunjung festival, deck sponsorship persuasif, dan display booth visual interaktif.',
      results: [
        '20+ Kemitraan strategis event organizer',
        'Ekspansi penempatan stan Malang, Surabaya, Jakarta',
        '+40% Rata-rata foot-traffic stan per event',
      ],
      image: '/7.png',
      extraImages: ['/7.png', '/8.png', '/12.png'],
      link: 'https://instagram.com/manikarumi.id',
      linkLabel: 'Galeri Booth Manikarumi ↗',
    },
    {
      id: 'data',
      category: 'SOFTWARE ENGINEERING & MEDIA MONITORING',
      title: 'PT Digivla Indonesia — Automated Intelligence Pipeline',
      tag: 'Data & Tech Strategy',
      period: '2023',
      badgeColor: 'bg-blue-100 text-blue-900 border-blue-300',
      summary: 'Mengembangkan sistem otomasi media monitoring berbasis Python untuk deteksi berita cetak dan ekstraksi data intelligence.',
      challenge: 'Pemantauan manual koran cetak memakan waktu berjam-jam dan rentan melewatkan publikasi isu strategis klien korporat.',
      strategy: 'Script web crawling otomatis & analisis tata letak koran digital menggunakan pustaka image processing Python.',
      results: [
        'Otomasi puluhan surat kabar nasional per pagi',
        '60% Mempercepat waktu agregasi berita vs manual',
        'Penyajian data analitik presisi laporan harian',
      ],
      image: '/9.png',
      extraImages: ['/9.png', '/10.png', '/14.png'],
      link: 'https://digivla.id',
      linkLabel: 'Portal Digivla Intelligence ↗',
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
      desc: 'Juara 1 dalam perancangan strategi model bisnis berkelanjutan dengan keunggulan analisis kelayakan finansial dan strategi penetrasi pasar.',
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
      desc: 'Masuk jajaran 5 proposal bisnis terbaik nasional dari ratusan tim perguruan tinggi di seluruh Indonesia.',
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
      desc: 'Meraih Juara 1 melalui inovasi solusi digital bisnis terintegrasi dan validasi prototipe operasional.',
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
      desc: 'Finalis 5 Besar dalam kompetisi rencana bisnis bergengsi se-Indonesia dengan fokus pada skalabilitas usaha.',
      certImg: '/17.png',
      eventImg: '/11.png',
      link: 'https://ub.ac.id',
      linkLabel: 'Rilis Berita UB ↗',
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
      link: 'https://unisma.ac.id',
      linkLabel: 'Arsip Berita Nasional ↗',
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
      desc: 'Penghargaan Individu Pembicara & Presenter Terbaik atas penguasaan panggung, artikulasi argumen bisnis, dan ketajaman sesi tanya jawab juri.',
      certImg: '/16.png',
      eventImg: '/17.png',
      link: 'https://unesa.ac.id',
      linkLabel: 'Dokumentasi Unesa ↗',
    },
  ],
};

const STORAGE_KEY = 'chikal_portfolio_content_v1';
const EVENT_NAME = 'chikal_portfolio_updated';

// Helper to get portfolio data (reads localStorage on client, or defaults)
export function getPortfolioData(): PortfolioData {
  if (typeof window === 'undefined') return DEFAULT_PORTFOLIO_DATA;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return DEFAULT_PORTFOLIO_DATA;
    const parsed = JSON.parse(raw);
    return {
      socials: { ...DEFAULT_PORTFOLIO_DATA.socials, ...parsed.socials },
      creatorAccounts: { ...DEFAULT_PORTFOLIO_DATA.creatorAccounts, ...parsed.creatorAccounts },
      projects: parsed.projects && parsed.projects.length > 0 ? parsed.projects : DEFAULT_PORTFOLIO_DATA.projects,
      awards: parsed.awards && parsed.awards.length > 0 ? parsed.awards : DEFAULT_PORTFOLIO_DATA.awards,
    };
  } catch {
    return DEFAULT_PORTFOLIO_DATA;
  }
}

// Helper to save portfolio data
export function savePortfolioData(data: PortfolioData) {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    window.dispatchEvent(new CustomEvent(EVENT_NAME, { detail: data }));
  } catch (e) {
    console.error('Error saving portfolio data to localStorage:', e);
  }
}

// Reset to default
export function resetPortfolioData() {
  if (typeof window === 'undefined') return;
  localStorage.removeItem(STORAGE_KEY);
  window.dispatchEvent(new CustomEvent(EVENT_NAME, { detail: DEFAULT_PORTFOLIO_DATA }));
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
