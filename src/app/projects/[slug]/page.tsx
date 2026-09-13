import React from 'react';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import ProjectMediaGallery from '@/components/ProjectMediaGallery';

interface ProjectDetailData {
  slug: string;
  role: string;
  title: string;
  subtitle: string;
  client: string;
  period: string;
  category: string;
  images: string[];
  overview: string;
  challenge: string;
  solution: string;
  features: string[];
  techStack: string[];
  metrics: { label: string; value: string }[];
  liveLink?: string;
  linkLabel?: string;
}

const PROJECTS_EXTENDED: Record<string, ProjectDetailData> = {
  'sistem-manajemen-koran': {
    slug: 'sistem-manajemen-koran',
    role: 'Full Stack Software Engineer',
    title: 'Sistem Manajemen Koran & Kliping Berita AI',
    subtitle: 'Platform digitalisasi dan deteksi otomatis bounding box koran cetak terintegrasi model visi komputer.',
    client: 'PT Digivla Indonesia (Media Intelligence & Monitoring)',
    period: '2023 - 2024',
    category: 'Web System & Computer Vision',
    images: ['/14.png', '/1.png', '/13.png'],
    overview: 'Platform web enterprise berbasis Laravel 10 dan MySQL yang mengotomasi alur pemantauan, pemotongan, dan pengindeksan koran cetak di seluruh Indonesia. Dilengkapi integrasi model Computer Vision (YOLO / RT-DETR) untuk pendeteksian letak artikel, judul berita, dan foto secara real-time.',
    challenge: 'Proses kliping berita cetak manual memerlukan waktu 6+ jam setiap pagi untuk memindai, memotong, dan menginput metadata koran harian, dengan tingkat human error yang cukup tinggi pada nama jurnalis dan kolom editorial.',
    solution: 'Membangun arsitektur terdistribusi di mana skrip Python memproses pindaian koran beresolusi tinggi, menjalankan inferensi deteksi artikel berbasis AI, dan mengirimkan hasil koordinat bounding box ke portal web Laravel untuk ditinjau oleh editor.',
    features: [
      'Deteksi otomatis koordinat artikel koran dengan bounding-box YOLO / RT-DETR',
      'Dashboard manajemen pengarsipan koran multi-penerbit berskala nasional',
      'Editor visual pemotongan gambar berbasis koordinat kanvas kanonikal',
      'Ekspor laporan kliping berita harian dalam format PDF & Excel untuk klien korporat',
    ],
    techStack: ['Laravel 10', 'PHP 8.2', 'MySQL', 'Python 3.10', 'YOLO / RT-DETR', 'OpenCV', 'Tailwind CSS', 'REST API'],
    metrics: [
      { label: 'Efisiensi Waktu Pemrosesan', value: '65%' },
      { label: 'Akurasi Deteksi Berita', value: '94.2%' },
      { label: 'Volume Koran Terproses Harian', value: '50+ Edisi' },
      { label: 'Waktu Pengiriman Kliping', value: '< 2 Jam' },
    ],
    liveLink: 'https://digivla.id',
    linkLabel: 'Situs Resmi PT Digivla Indonesia ↗',
  },
  'website-surveyku': {
    slug: 'website-surveyku',
    role: 'Database Engineer & Backend Developer',
    title: 'Website Surveyku — Platform Survei Terintegrasi',
    subtitle: 'Sistem informasi pengumpulan data evaluasi dan kepuasan sivitas akademika Politeknik Negeri Malang.',
    client: 'Politeknik Negeri Malang (Polinema)',
    period: '2023',
    category: 'Academic Enterprise Database',
    images: ['/13.png', '/11.png', '/15.png'],
    overview: 'Sistem evaluasi pembelajaran dan kepuasan stakeholder berbasis web untuk Politeknik Negeri Malang. Menghubungkan ribuan responden mahasiswa, dosen, alumni, serta mitra industri dalam satu basis data relasional yang efisien dan terstruktur.',
    challenge: 'Kuesioner evaluasi pembelajaran sebelumnya menggunakan formulir independen yang tidak memiliki relasi entitas, menyebabkan duplikasi data, anomali pengisian, serta lambatnya kalkulasi matriks kepuasan saat persiapan akreditasi jurusan.',
    solution: 'Merancang arsitektur basis data relasional yang ternormalisasi (Third Normal Form - 3NF), membuat prosedur penyimpanan analitik (stored procedures), dan membangun API backend yang mampu melayani lonjakan pengisian survei pada akhir semester.',
    features: [
      'Perancangan skema relasional 3NF bebas anomali redundansi',
      'Otentikasi multi-peran (Mahasiswa, Dosen, Admin Prodi, Pimpinan Jurusan)',
      'Mesin pembuat kuesioner dinamis dengan beragam skala pengukuran Likert',
      'Visualisasi analitik grafik kepuasan real-time dan ekspor laporan akreditasi',
    ],
    techStack: ['PostgreSQL', 'Laravel', 'Prisma ORM', 'Bootstrap 5', 'Chart.js', 'Relational Modeling (3NF)'],
    metrics: [
      { label: 'Responden Terakomodasi', value: '3.000+' },
      { label: 'Latensi Query Analitik', value: '< 200ms' },
      { label: 'Integritas Relasi Data', value: '100% 3NF' },
      { label: 'Kepuasan Pimpinan', value: 'Tinggi' },
    ],
    liveLink: 'https://jti.polinema.ac.id',
    linkLabel: 'Portal Resmi JTI Polinema ↗',
  },
  'jti-certify': {
    slug: 'jti-certify',
    role: 'Frontend Engineer & UI/UX Designer',
    title: 'Website & App JTI-Certify',
    subtitle: 'Aplikasi manajemen portofolio sertifikasi profesi dan kompetensi dosen bertaraf internasional.',
    client: 'Jurusan Teknologi Informasi Politeknik Negeri Malang',
    period: '2023 - 2024',
    category: 'Web & Mobile Application',
    images: ['/15.png', '/16.png', '/12.png'],
    overview: 'Platform tata kelola sertifikasi profesional bagi dosen dan instruktur laboratorium. Memantau siklus hidup lisensi keahlian, tanggal kedaluwarsa sertifikasi industri (Cisco, Oracle, Microsoft, BNSP), serta pemenuhan skor kompetensi pengajaran.',
    challenge: 'Banyak berkas sertifikasi fisik tercecer atau melewati masa berlaku tanpa disadari, menghambat pengajuan akreditasi internasional prodi dan pembaharuan data pangkalan perguruan tinggi.',
    solution: 'Merancang alur UI/UX modern berbasis Figma, membangun antarmuka web responsif dengan React.js dan prototipe mobile dengan React Native, dilengkapi sistem peringatan dini kedaluwarsa dokumen secara terjadwal.',
    features: [
      'Dashboard repositori berkas sertifikat digital dengan verifikasi hash',
      'Kalender pemantauan tanggal kedaluwarsa lisensi terotomasi',
      'Alur persetujuan verifikasi sertifikasi berjenjang oleh tim kurikulum',
      'Antarmuka adaptif mobile dan desktop dengan estetika modern yang bersih',
    ],
    techStack: ['React.js', 'React Native', 'Tailwind CSS', 'Figma', 'Axios', 'RESTful API'],
    metrics: [
      { label: 'Kepatuhan Verifikasi Dokumen', value: '100%' },
      { label: 'Peringatan Kedaluwarsa Dini', value: 'H-30 Hari' },
      { label: 'Kesiapan Akreditasi', value: 'ISO Ready' },
      { label: 'Efisiensi Administrasi', value: '80%' },
    ],
  },
  'sales-performance-dashboard': {
    slug: 'sales-performance-dashboard',
    role: 'Data Analyst & BI Specialist',
    title: 'Sales Performance & Inventory Analytics Dashboard',
    subtitle: 'Dashboard Business Intelligence interaktif untuk memonitor penjualan, inventaris, dan profitabilitas bisnis.',
    client: 'Proyek Analisis Sistem Informasi Bisnis D4 Polinema',
    period: '2024',
    category: 'Business Intelligence & Analytics',
    images: ['/16.png', '/17.png', '/14.png'],
    overview: 'Solusi visualisasi analitik komprehensif menggunakan Microsoft Power BI dan Google Looker Studio untuk membedah kinerja penjualan ritel multi-cabang, mengidentifikasi tren musiman, serta memproyeksikan margin profitabilitas secara akurat.',
    challenge: 'Data penjualan ritel tercatat dalam ribuan baris spreadsheet mentah tanpa relasi yang jelas, menyebabkan pemilik usaha kesulitan menentukan cabang mana yang berkinerja rendah dan produk apa yang mengalami stagnasi inventaris (dead-stock).',
    solution: 'Menjalankan proses ETL (Extract, Transform, Load) menggunakan Power Query, membangun skema data bintang (Star Schema) dengan relasi fakta dan dimensi, serta merumuskan kalkulasi metrik khusus berbasis formula DAX.',
    features: [
      'Pemodelan data Star Schema dengan integrasi tabel transaksi dan master produk',
      'Kalkulasi metrik dinamis berbasis formula DAX (Year-over-Year, Profit Margin, Moving Average)',
      'Visualisasi drill-down berdasarkan wilayah penjualan, kategori produk, dan waktu',
      'Sistem deteksi dini inventaris lambat bergerak (dead-stock warning)',
    ],
    techStack: ['Microsoft Power BI', 'Google Looker Studio', 'Microsoft Excel (Power Query & DAX)', 'SQL', 'Data Modeling'],
    metrics: [
      { label: 'Identifikasi Dead-Stock', value: '35% Lebih Cepat' },
      { label: 'KPI Penjualan Terpantau', value: '12+ Metrik' },
      { label: 'Waktu Analisis Laporan', value: 'Turun 70%' },
      { label: 'Akurasi Rekonsiliasi', value: '99.8%' },
    ],
  },
};

export function generateStaticParams() {
  return Object.keys(PROJECTS_EXTENDED).map((slug) => ({ slug }));
}

export default async function ProjectPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const project = PROJECTS_EXTENDED[slug];

  if (!project) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-[#F4F7F2] text-[#212B1E] selection:bg-rose-blush selection:text-rose-dark py-10 px-4 sm:px-8 lg:px-12">
      <div className="max-w-5xl mx-auto">
        
        {/* Navigation Breadcrumb */}
        <div className="flex items-center justify-between mb-8 pb-4 border-b border-[#CAD7C5]">
          <Link
            href="/#projects"
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/90 border border-[#CAD7C5] text-xs font-bold text-forest hover:bg-forest hover:text-[#E8EFE5] transition-all shadow-xs"
          >
            <span>←</span>
            <span>Kembali ke Portofolio</span>
          </Link>

          <span className="text-xs font-mono font-medium text-forest/60">
            Case Study Detail • {project.period}
          </span>
        </div>

        {/* Project Header */}
        <div className="mb-8">
          <div className="flex flex-wrap items-center gap-2.5 mb-3">
            <span className="px-3.5 py-1 rounded-full bg-rose-blush text-rose-dark border border-rose-dusty/40 text-xs font-bold uppercase tracking-wider shadow-2xs">
              {project.role}
            </span>
            <span className="px-3 py-1 rounded-full bg-white border border-[#CAD7C5] text-xs font-medium text-forest/80 shadow-2xs">
              {project.category}
            </span>
            <span className="text-xs text-forest/60 font-mono hidden sm:inline">
              Klien: {project.client}
            </span>
          </div>

          <h1 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold text-forest tracking-tight leading-tight mb-3">
            {project.title}
          </h1>

          <p className="text-base sm:text-lg text-forest/85 font-source leading-relaxed max-w-3xl">
            {project.subtitle}
          </p>
        </div>

        {/* PROMINENT MEDIA GALLERY SHOWCASE (100% Visible & Uncropped) */}
        <ProjectMediaGallery title={project.title} images={project.images} />

        {/* Impact Metrics Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 mb-12">
          {project.metrics.map((metric, mIdx) => (
            <div key={mIdx} className="bg-white/90 border border-[#CAD7C5] rounded-2xl p-4 text-center shadow-xs">
              <span className="block font-serif text-2xl sm:text-3xl font-bold text-rose-dark mb-1">
                {metric.value}
              </span>
              <span className="text-xs text-forest/70 font-semibold uppercase tracking-wider block">
                {metric.label}
              </span>
            </div>
          ))}
        </div>

        {/* Main Content Grid: Narrative & Tech Stack */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start mb-16">
          
          {/* Left Column: Problem, Solution & Features (8 cols) */}
          <div className="lg:col-span-8 space-y-8">
            
            {/* Overview */}
            <div className="bg-white/90 rounded-3xl border border-[#CAD7C5] p-6 sm:p-8 shadow-xs">
              <h2 className="font-serif text-xl sm:text-2xl font-bold text-forest mb-3">
                Ringkasan Proyek & Konteks
              </h2>
              <p className="text-sm sm:text-base text-forest/80 leading-relaxed font-source">
                {project.overview}
              </p>
            </div>

            {/* Problem & Challenge */}
            <div className="bg-white/90 rounded-3xl border border-[#CAD7C5] p-6 sm:p-8 shadow-xs">
              <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-rose-dark mb-2">
                <span>✦</span>
                <span>Tantangan & Permasalahan</span>
              </div>
              <h2 className="font-serif text-xl sm:text-2xl font-bold text-forest mb-3">
                Kondisi Awal & Kebutuhan Solusi
              </h2>
              <p className="text-sm sm:text-base text-forest/80 leading-relaxed font-source">
                {project.challenge}
              </p>
            </div>

            {/* Solution & Implementation */}
            <div className="bg-white/90 rounded-3xl border border-[#CAD7C5] p-6 sm:p-8 shadow-xs">
              <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-emerald-800 mb-2">
                <span>✦</span>
                <span>Pendekatan & Implementasi</span>
              </div>
              <h2 className="font-serif text-xl sm:text-2xl font-bold text-forest mb-3">
                Solusi yang Dibangun
              </h2>
              <p className="text-sm sm:text-base text-forest/80 leading-relaxed font-source mb-6">
                {project.solution}
              </p>

              {/* Key Features List */}
              <h3 className="text-xs font-bold uppercase tracking-wider text-forest/70 mb-3">
                Fitur Kunci Sistem:
              </h3>
              <ul className="space-y-2.5 text-sm text-forest/85 font-source">
                {project.features.map((feat, fIdx) => (
                  <li key={fIdx} className="flex items-start gap-3">
                    <span className="w-2 h-2 rounded-full bg-rose-dark shrink-0 mt-2" />
                    <span>{feat}</span>
                  </li>
                ))}
              </ul>
            </div>

          </div>

          {/* Right Column: Tech Stack & Project Metadata (4 cols) */}
          <div className="lg:col-span-4 space-y-6">
            
            {/* Tech Stack Card */}
            <div className="bg-white/90 rounded-3xl border border-[#CAD7C5] p-6 shadow-xs">
              <h3 className="font-serif text-lg font-bold text-forest mb-4 pb-2 border-b border-[#CAD7C5]/50">
                Teknologi & Alat
              </h3>
              <div className="flex flex-wrap gap-2">
                {project.techStack.map((tech, tIdx) => (
                  <span
                    key={tIdx}
                    className="px-3 py-1 rounded-full bg-[#E8EFE5] border border-[#CAD7C5] text-xs font-medium text-forest shadow-2xs"
                  >
                    {tech}
                  </span>
                ))}
              </div>
            </div>

            {/* Project Client Info */}
            <div className="bg-white/90 rounded-3xl border border-[#CAD7C5] p-6 shadow-xs">
              <h3 className="font-serif text-lg font-bold text-forest mb-3 pb-2 border-b border-[#CAD7C5]/50">
                Informasi Proyek
              </h3>
              <div className="space-y-3 text-xs">
                <div>
                  <span className="text-forest/60 uppercase tracking-wider font-semibold block">Instansi / Klien</span>
                  <span className="font-bold text-forest text-sm">{project.client}</span>
                </div>
                <div>
                  <span className="text-forest/60 uppercase tracking-wider font-semibold block">Periode Pelaksanaan</span>
                  <span className="font-mono font-bold text-forest">{project.period}</span>
                </div>
                <div>
                  <span className="text-forest/60 uppercase tracking-wider font-semibold block">Peran Utama</span>
                  <span className="font-bold text-rose-dark">{project.role}</span>
                </div>
              </div>

              {/* External Link */}
              {project.liveLink && (
                <div className="mt-5 pt-4 border-t border-[#CAD7C5]/50">
                  <a
                    href={project.liveLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full py-2.5 rounded-full bg-forest text-[#E8EFE5] hover:bg-rose-dark text-xs font-bold transition-all shadow-xs flex items-center justify-center gap-2"
                  >
                    <span>{project.linkLabel || 'Buka Tautan ↗'}</span>
                  </a>
                </div>
              )}
            </div>

            {/* Inquiry CTA */}
            <div className="bg-gradient-to-br from-forest to-[#1A2518] text-[#E8EFE5] rounded-3xl p-6 shadow-md text-center">
              <h4 className="font-serif text-lg font-bold text-white mb-2">
                Tertarik Mendiskusikan Proyek Ini?
              </h4>
              <p className="text-xs text-[#E8EFE5]/80 leading-relaxed mb-4">
                Saya terbuka untuk mendiskusikan implementasi teknis dan strategi bisnis dari studi kasus ini.
              </p>
              <a
                href="https://wa.me/6281234567890?text=Halo%20Chikal,%20saya%20tertarik%20mendiskusikan%20proyek%20portfolio%20Anda."
                target="_blank"
                rel="noopener noreferrer"
                className="w-full py-2.5 rounded-full bg-rose-dark text-white hover:bg-rose-berry text-xs font-bold transition-colors shadow-xs flex items-center justify-center gap-1.5"
              >
                <span>Hubungi via WhatsApp ↗</span>
              </a>
            </div>

          </div>

        </div>

        {/* Bottom Back Button */}
        <div className="text-center pb-12 pt-4 border-t border-[#CAD7C5]">
          <Link
            href="/#projects"
            className="inline-flex items-center gap-2 px-8 py-3.5 rounded-full bg-forest text-[#E8EFE5] hover:bg-rose-dark text-sm font-bold shadow-md transition-all hover:scale-105"
          >
            <span>← Kembali ke Portofolio Utama</span>
          </Link>
        </div>

      </div>
    </div>
  );
}
