export const NAV_LINKS = [
  { label: "Tentang", href: "#about" },
  { label: "Perjalanan", href: "#experience" },
  { label: "Penghargaan", href: "#achievements" },
  { label: "Konten", href: "#creator" },
  { label: "Kreativitas", href: "#creativity" },
  { label: "Karya", href: "#projects" },
];

export const HERO_CONTENT = {
  eyebrow: "Business Development · Marketing · Growth",
  h1: "Chikal Nazmi Mahira",
  subhead: "Menanam kerja sama, merawat pertumbuhan, memanen hasil.",
  description:
    "Fresh Graduate Sistem Informasi Bisnis, Politeknik Negeri Malang — membangun brand, kemitraan, dan angka pertumbuhan nyata sejak masih kuliah.",
  stats: [
    { value: 2089, suffix: "%", label: "reach growth" },
    { value: 20, suffix: "+", label: "partnerships" },
    { value: 7, suffix: "×", label: "national wins" },
  ],
};

export const ABOUT_CONTENT = {
  paragraphs: [
    "Aku percaya bisnis yang tumbuh itu kayak taman — butuh yang menanam, yang merawat, dan yang sabar menunggu mekar. Dari jadi Public Relations Lead yang bernegosiasi dengan 20+ event organizer, sampai membangun brand aksesori rajut dari nol dengan reach yang tumbuh 2.089% dalam sebulan — aku belajar bahwa pertumbuhan nyata itu hasil dari kerja konsisten, bukan keberuntungan semata.",
    "Sekarang, sambil menunggu wisuda dari Sistem Informasi Bisnis Polinema, aku sedang merawat 'kebun' baru: usaha laundry yang baru dibuka, dan mencari peran Business Development atau Management Trainee yang bisa jadi rumah untuk semua yang sudah aku tanam.",
  ],
};

export const EXPERIENCE_CONTENT = [
  {
    role: "Manager",
    company: "Dua Sisi Laundry",
    date: "Juli 2026–Sekarang",
    location: "Kota Malang",
    tag: "Terbaru",
    bullets: [
      "memimpin peluncuran bisnis & SOP order/QC/customer service",
      "sistem pelacakan operasional & finansial harian",
      "inisiatif marketing lokal tahap awal",
    ],
  },
  {
    role: "Small Business Owner",
    company: "YarnUp!",
    date: "November 2024–Sekarang",
    location: "Kota Malang",
    tag: "Founder",
    featured: true,
    highlightStat: "2.089,6% pertumbuhan reach Instagram dalam 1 bulan",
    bullets: [
      "mendirikan bisnis aksesori rajut handmade end-to-end",
      "sponsor resmi acara kampus untuk 150+ peserta",
      "kelola booth ritel di berbagai acara kampus",
    ],
  },
  {
    role: "Public Relations Lead",
    company: "Manikarumi Indonesia",
    date: "Mei 2024–Sekarang",
    location: "Kota Malang",
    tag: "PR Lead",
    highlightStat: "20+ event organizer dinegosiasikan",
    bullets: [
      "kolaborasi brand & tenant placement",
      "operasional booth Malang & Jakarta termasuk Entrepreneur Festival Polinema",
      "konten katalog & TikTok",
    ],
  },
  {
    role: "Google Student Ambassador",
    company: "Google",
    date: "September 2025–Februari 2026",
    tag: "Ambassador",
    bullets: [
      "mewakili Google sebagai liaison komunitas mahasiswa Indonesia",
      "kampanye konten kreatif untuk program & tools Google",
    ],
  },
  {
    role: "Software Engineer Intern",
    company: "PT Digivla Indonesia",
    date: "Agustus 2025–Januari 2026",
    location: "Jakarta Selatan",
    tag: "Akar Teknis",
    bullets: [
      "sistem deteksi koran internal pakai Python",
      "maintenance, testing & validasi fitur aplikasi internal",
    ],
  },
];

export const ORG_LEADERSHIP_CONTENT = [
  {
    role: "Vice Chairwoman",
    org: "HMTI Polinema",
    date: "Feb 2024–Feb 2025",
    stat: 70,
    statSuffix: "+",
    statLabel: "anggota terkoordinasi",
  },
  {
    role: "Secretary, Election Committee",
    org: "HMTI Polinema",
    date: "Agt 2023–Jan 2024",
    stat: 1500,
    statSuffix: "+",
    statLabel: "suara mahasiswa difasilitasi",
  },
  {
    role: "Chief Executive, Student Orientation",
    org: "HMTI Polinema",
    date: "Feb–Sep 2023",
    stat: 400,
    statSuffix: "+",
    statLabel: "mahasiswa onboarded, 97% KPI",
  },
];

export const ACHIEVEMENTS_CONTENT = [
  {
    year: "2026",
    title: "1st Place, Gold Medalist, Best Team & Best Idea",
    event: "National Business Plan, Edutalk Fair 2026",
    description: "(40+ tim se-Indonesia)",
  },
  {
    year: "2026",
    title: "1st Place",
    event: "Business Challenge Go 8.0",
  },
  {
    year: "2025",
    title: "1st Place",
    event: "Business Plan/Marketing Video/Podcast — Entrepreneurs Festival Polinema",
    description: "(3 kategori)",
  },
  {
    year: "2025",
    title: "Awardee",
    event: "Business Incubation Program",
    description: "(naik jenjang dari PMW 2024, Manikarumi.id)",
  },
  {
    year: "2024",
    title: "1st Place, Best Entrepreneur Stand",
    event: "Entrepreneurs Festival Polinema",
  },
  {
    year: "2023",
    title: "1st Place",
    event: "Digital Education Entrepreneurship Festival",
  },
];

export const CONTENT_CREATOR_CONTENT = [
  {
    platform: "YouTube",
    handle: "Chikal Nazmi",
    description: "Vlog & cerita seputar wirausaha dan keseharian.",
    link: "https://www.youtube.com/results?search_query=Chikal+Nazmi",
  },
  {
    platform: "Instagram",
    handle: "@chikalnazmi",
    description: "Akun pribadi — keseharian & personal branding.",
    link: "https://instagram.com/chikalnazmi",
  },
  {
    platform: "Instagram (Bisnis)",
    handle: "@yarnup_",
    description: "Katalog produk & konten reels YarnUp!",
    link: "https://instagram.com/yarnup_",
  },
  {
    platform: "TikTok (Bisnis)",
    handle: "@manikarumi.id",
    description: "Konten brand & katalog Manikarumi Indonesia.",
    link: "https://www.tiktok.com/@manikarumi.id",
  },
];

export const CREATIVITY_GALLERY_CONTENT: { src?: string; alt: string }[] = [
  { alt: "Foto karya 1" },
  { alt: "Foto karya 2" },
  { alt: "Foto karya 3" },
  { alt: "Foto karya 4" },
  { alt: "Foto karya 5" },
  { alt: "Foto karya 6" },
];

export const PROJECTS_CONTENT = [
  {
    role: "Full Stack Engineer",
    title: "Sistem Manajemen Koran",
    slug: "sistem-manajemen-koran",
    description:
      "Laravel & MySQL untuk digitalisasi data media, terintegrasi AI (YOLO/RT-DETR).",
  },
  {
    role: "Database Engineer",
    title: "Website Surveyku",
    slug: "website-surveyku",
    description:
      "Basis data relasional untuk sistem survei stakeholder Politeknik Negeri Malang.",
  },
  {
    role: "Frontend Engineer",
    title: "Website & App JTI-Certify",
    slug: "jti-certify",
    description: "UI/UX web & mobile untuk sistem manajemen sertifikasi dosen.",
  },
  {
    role: "Data Analyst",
    title: "Sales Performance Dashboard",
    slug: "sales-performance-dashboard",
    description:
      "Dashboard interaktif Power BI & Looker Studio untuk monitoring penjualan.",
  },
];

export const SKILLS_CONTENT = {
  categories: [
    {
      title: "Bisnis & Kepemimpinan",
      skills: [
        "Negotiation",
        "Partnership Development",
        "Public Relations",
        "Strategic Planning",
        "Team Leadership",
      ],
    },
    {
      title: "Marketing & Growth",
      skills: [
        "Digital Marketing",
        "Content Strategy",
        "IG & TikTok Marketing",
        "Marketing Campaigns",
      ],
    },
    {
      title: "Data & Teknis",
      skills: [
        "Excel (VLOOKUP/INDEX-MATCH)",
        "Power BI",
        "Looker Studio",
        "SQL",
        "Python",
      ],
    },
  ],
  certifications: [
    "Data Analysis Fundamental (MySkill)",
    "Intro to Digital Marketing (RevoU)",
    "Creating Marketing Campaign (MySkill)",
    "VLOOKUP & HLOOKUP (MySkill)",
    "TOEIC (Score 775)",
  ],
};
