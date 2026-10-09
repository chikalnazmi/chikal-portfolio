// src/lib/translations.ts
// Comprehensive bilingual dictionary for Chikal Nazmi Mahira Portfolio

export type Language = 'id' | 'en';

export interface TranslationDictionary {
  nav: {
    brandTag: string;
    academy: string;
    experience: string;
    projects: string;
    awards: string;
    leadership: string;
    certifications: string;
    creative: string;
    hobbies: string;
    connectBtn: string;
  };
  hero: {
    greeting: string;
    subheadline: string;
    openToWorkBadge: string;
    statGpaLabel: string;
    statGpaHonor: string;
    statToeicLabel: string;
    statToeicHonor: string;
    statAwardsLabel: string;
    statAwardsHonor: string;
    bio: string;
    ctaBtn: string;
  };
  academy: {
    kicker: string;
    titleMain: string;
    titleItalic: string;
    subtitle: string;
    degreeBadge: string;
    degreeTitle: string;
    degreeInstitution: string;
    academicStandingLabel: string;
    cumLaudeTag: string;
    scaleTag: string;
    globalEnglishLabel: string;
    certifiedTag: string;
    workingProficiencyTag: string;
    coreLabel: string;
    coreDesc: string;
    docBtn: string;
    tabs: {
      all: string;
      strategy: string;
      systems: string;
      media: string;
      ethics: string;
    };
    skills: {
      strategyTitle: string;
      strategyStatus: string;
      strategyDesc: string;
      systemsTitle: string;
      systemsDesc: string;
      mediaTitle: string;
      mediaDesc: string;
    };
    curriculumNotice: string;
    consultLink: string;
  };
  experience: {
    kicker: string;
    titleMain: string;
    titleItalic: string;
    subtitle: string;
    presentText: string;
    docGalleryBtn: string;
    duasisi: {
      title: string;
      desc: string;
      b1: string;
      b2: string;
      b3: string;
      btn: string;
    };
    yarnup: {
      title: string;
      desc: string;
      b1: string;
      b2: string;
      b3: string;
      btn: string;
    };
    manikarumi: {
      title: string;
      desc: string;
      b1: string;
      b2: string;
      b3: string;
      btn: string;
    };
    digivia: {
      title: string;
      desc: string;
      b1: string;
      b2: string;
      b3: string;
      btn: string;
    };
  };
  projects: {
    kicker: string;
    titleMain: string;
    titleItalic: string;
    subtitle: string;
    tabs: {
      all: string;
      web: string;
      ux: string;
      media: string;
    };
    detailBtn: string;
    inspectGalleryPrompt: string;
  };
  awards: {
    kicker: string;
    titleMain: string;
    titleItalic: string;
    subtitle: string;
    tabs: {
      all: string;
      first: string;
      second: string;
      top5: string;
    };
    viewDocBtn: string;
  };
  leadership: {
    kicker: string;
    titleMain: string;
    titleItalic: string;
    subtitle: string;
    inspectDocBtn: string;
  };
  certifications: {
    kicker: string;
    titleMain: string;
    titleItalic: string;
    subtitle: string;
    notice: string;
    clickPrompt: string;
    viewCert: string;
  };
  creative: {
    kicker: string;
    title: string;
    subtitle: string;
    subheading: string;
    hoverNotice: string;
  };
  hobbies: {
    kicker: string;
    title: string;
    subtitle: string;
    travelTitle: string;
    travelSub: string;
    travelDesc: string;
    knittingTitle: string;
    knittingSub: string;
    knittingDesc: string;
    writingTitle: string;
    writingSub: string;
    writingDesc: string;
    readingTitle: string;
    readingSub: string;
    readingDesc: string;
    mediumBtn: string;
    creativeTag: string;
  };
  contact: {
    kicker: string;
    headingMain: string;
    headingItalic: string;
    headingTogether: string;
    desc: string;
    emailBtn: string;
    waBtn: string;
    linkedinBtn: string;
    connectDivider: string;
    rights: string;
  };
  modal: {
    verifiedLabel: string;
    verifiedText: string;
    closeBtn: string;
  };
}

export const translations: Record<Language, TranslationDictionary> = {
  id: {
    nav: {
      brandTag: 'Business & Marketing',
      academy: 'Pendidikan & Keahlian',
      experience: 'Pengalaman Kerja',
      projects: 'Proyek & Portofolio',
      awards: 'Penghargaan (7)',
      leadership: 'Kepemimpinan',
      certifications: 'Sertifikasi',
      creative: 'Kreatif & Konten',
      hobbies: 'Minat & Hobi',
      connectBtn: 'Hubungi Saya ↗',
    },
    hero: {
      greeting: "Hi I'm Chikal",
      subheadline: 'Menghubungkan Strategi Bisnis, Operasional, & Kreativitas Digital.',
      openToWorkBadge: 'Terbuka untuk Peluang • Management Trainee, BizDev, & Peran Kreatif',
      statGpaLabel: 'IPK / GPA',
      statGpaHonor: 'Cum Laude',
      statToeicLabel: 'TOEIC',
      statToeicHonor: 'Working Proficiency',
      statAwardsLabel: 'AWARDS',
      statAwardsHonor: '7x Juara Nas.',
      bio: 'Halo, saya Chikal Nazmi Mahira. Mahasiswi / Lulusan D4 Sistem Informasi Bisnis Politeknik Negeri Malang yang berfokus pada operasional bisnis, public relations, dan pembuatan konten kreatif.',
      ctaBtn: 'Hubungi Saya',
    },
    academy: {
      kicker: '( 01 ) Fondasi & Keahlian',
      titleMain: 'Latar Belakang Akademik & ',
      titleItalic: 'Keahlian Inti',
      subtitle: 'Kombinasi latar belakang pendidikan formal sistem informasi bisnis dan keahlian praktis lintas disiplin yang teruji.',
      degreeBadge: 'Pendidikan Formal',
      degreeTitle: 'Sarjana Terapan Sistem Informasi Bisnis (D4 SIB)',
      degreeInstitution: 'Jurusan Teknologi Informasi — Politeknik Negeri Malang',
      academicStandingLabel: 'Academic Standing',
      cumLaudeTag: 'Cum Laude',
      scaleTag: 'Skala 4.00',
      globalEnglishLabel: 'Global English Proficiency',
      certifiedTag: 'Certified',
      workingProficiencyTag: 'Working Proficiency',
      coreLabel: 'Fokus & Fondasi Akademik',
      coreDesc: 'Mengombinasikan tata kelola proses bisnis hulu-ke-hilir, pemodelan data relasional, serta strategi penetrasi pasar dengan kemampuan komunikasi bahasa Inggris standar multinasional.',
      docBtn: 'Buka Dokumen Kelulusan & TOEIC ↗',
      tabs: {
        all: 'Semua Keahlian',
        strategy: 'Strategi & Operasional',
        systems: 'Sistem & Tools',
        media: 'Media & Pemasaran',
        ethics: 'Etika Kerja',
      },
      skills: {
        strategyTitle: 'Business Strategy & Operational SOPs',
        strategyStatus: '✓ Terverifikasi Terapan',
        strategyDesc: 'Penyusunan alur operasional terstandarisasi, rekonsiliasi kas, dan riset model bisnis.',
        systemsTitle: 'Information Systems & Digital Tools',
        systemsDesc: 'Fondasi teknologi perancangan antarmuka pengguna, pemodelan data relasional, dan analisis data.',
        mediaTitle: 'Creative Media, Growth & Collaboration',
        mediaDesc: 'Produksi konten lintas platform, kurasi visual, dan komunikasi strategis tim.',
      },
      curriculumNotice: 'Kurikulum Terpadu & Implementasi Lapangan Mandiri',
      consultLink: 'Konsultasikan Kebutuhan Proyek ↗',
    },
    experience: {
      kicker: '( 02 ) Pengalaman & Karier',
      titleMain: 'Pengalaman Kerja & ',
      titleItalic: 'Bisnis Nyata',
      subtitle: 'Pengalaman kerja nyata dalam standardisasi operasional, pertumbuhan brand mandiri, kemitraan event komersial, serta riset automasi software.',
      presentText: 'Sekarang',
      docGalleryBtn: 'Dokumentasi & Galeri Foto',
      duasisi: {
        title: 'Dua Sisi Laundry — Operasional & SOP',
        desc: 'Menginisiasi peluncuran operasional laundry, menyusun Standard Operating Procedure (SOP) pengerjaan cuci-setrika harian, serta mengelola pencatatan kas dan promosi lokal.',
        b1: 'SOP Cuci & Setrika',
        b2: 'Pencatatan Kas Harian',
        b3: 'Pemasaran Lokal',
        btn: 'Profil Bisnis Dua Sisi ↗',
      },
      yarnup: {
        title: 'YarnUp! Studio — Aksesoris Buatan Tangan',
        desc: 'Membangun usaha aksesoris rajut buatan tangan (handmade), memproduksi konten foto katalog serta video TikTok/Reels, dan menjadi sponsor di acara kampus.',
        b1: 'Konten Video Kreatif',
        b2: 'Katalog Produk Handmade',
        b3: 'Kemitraan Acara Kampus',
        btn: 'Official Store Instagram ↗',
      },
      manikarumi: {
        title: 'Manikarumi Indonesia — Humas & Penempatan Acara',
        desc: 'Membangun relasi kemitraan dengan 20+ event organizer di Malang dan Jakarta untuk penempatan stan bazar, serta mengelola dokumentasi visual dan konten media sosial.',
        b1: '20+ Mitra Event Organizer',
        b2: 'Operasional Stan Bazar',
        b3: 'Foto Katalog & Video TikTok',
        btn: 'Galeri Booth Manikarumi ↗',
      },
      digivia: {
        title: 'PT Digivia Indonesia — Magang Rekayasa Perangkat Lunak',
        desc: 'Mengembangkan sistem deteksi koran internal perusahaan menggunakan Python, melakukan pemeliharaan fitur, serta pengujian dan validasi aplikasi internal.',
        b1: 'Python Automation',
        b2: 'Deteksi Berita Koran',
        b3: 'Pengujian Fitur Aplikasi',
        btn: 'Profil PT Digivia ↗',
      },
    },
    projects: {
      kicker: '( 03 ) Portofolio Pilihan',
      titleMain: 'Sistem Terapan & ',
      titleItalic: 'Kampanye Kreatif',
      subtitle: 'Studi kasus nyata dalam rekayasa sistem informasi bisnis, riset antarmuka pengguna, dan aktivasi pemasaran digital.',
      tabs: {
        all: 'Semua Proyek',
        web: 'Sistem Web & IT',
        ux: 'Riset UX & Data',
        media: 'Media Komersial',
      },
      detailBtn: 'Lihat Studi Kasus Lengkap ↗',
      inspectGalleryPrompt: 'Arahkan kursor atau klik kartu untuk melihat galeri dokumen',
    },
    awards: {
      kicker: '( 04 ) Prestasi & Rekognisi',
      titleMain: '7x Penghargaan ',
      titleItalic: 'Nasional & Regional',
      subtitle: 'Rekam jejak kejuaraan lomba perencanaan bisnis, inovasi teknologi informasi, dan kompetisi presentasi tingkat nasional.',
      tabs: {
        all: 'Semua Penghargaan (7)',
        first: '🥇 Juara 1',
        second: '🥈 Juara 2',
        top5: '⭐ Finalis & Pembicara',
      },
      viewDocBtn: 'Buka Dokumen Resmi ↗',
    },
    leadership: {
      kicker: '( 05 ) Kepemimpinan & Organisasi',
      titleMain: 'Pengalaman Organisasi & ',
      titleItalic: 'Sinergi Tim',
      subtitle: 'Kepemimpinan aktif dalam komunitas teknologi global mahasiswa dan divisi humas kemahasiswaan kampus.',
      inspectDocBtn: 'Lihat Sertifikat & Portofolio ↗',
    },
    certifications: {
      kicker: '( 06 ) Sertifikasi Profesional',
      titleMain: 'Sertifikasi Terakreditasi & ',
      titleItalic: 'Kredensial Global',
      subtitle: 'Pelatihan intensif dan sertifikasi terverifikasi dari institusi pendidikan teknologi dan pemasaran terkemuka.',
      notice: 'Seluruh sertifikat diterbitkan oleh institusi terakreditasi internasional & nasional (RevoU, MySkill, ETS International).',
      clickPrompt: 'Klik kartu untuk pratinjau sertifikat resolusi tinggi ↗',
      viewCert: 'Lihat Sertifikat',
    },
    creative: {
      kicker: '/ Konten & Media /',
      title: 'Studio Kreator & Pertumbuhan Media',
      subtitle: 'Eksplorasi visual dan penceritaan kreatif: Produksi konten lintas platform (Instagram & TikTok) di berbagai akun.',
      subheading: 'Produksi Media Sosial & Video Kreatif',
      hoverNotice: 'Arahkan kursor ke masing-masing kartu untuk melihat interaksi preview',
    },
    hobbies: {
      kicker: '/ Keseimbangan Kreatif & Gaya Hidup /',
      title: 'Seni, Hobi & Eksplorasi Intelektual',
      subtitle: 'Aktivitas personal yang menjaga keseimbangan kreativitas, wawasan intelektual, dan kesegaran cara pandang.',
      travelTitle: 'Travelling',
      travelSub: 'Melihat dunia untuk perspektif baru',
      travelDesc: 'Menjelajahi beragam kota dan keindahan alam untuk menyerap inspirasi budaya, arsitektur lokal, serta memperluas sudut pandang dalam memecahkan masalah.',
      knittingTitle: 'Knitting & Crochet',
      knittingSub: 'Eksplorasi kreativitas karya handmade',
      knittingDesc: 'Mengekspresikan ketelitian melalui rajutan benang manual tangan, eksplorasi pola baru, dan merancang karya aksesoris bernilai artistik tinggi.',
      writingTitle: 'Writing (Medium)',
      writingSub: 'Berbagi pemikiran dan strategi bisnis',
      writingDesc: 'Menuangkan pemikiran analitis seputar dinamika bisnis, kepemimpinan tim, dan strategi operasional ke dalam esai terstruktur di platform Medium.',
      readingTitle: 'Reading & Learning',
      readingSub: 'Eksplorasi literatur & self-development',
      readingDesc: 'Membaca buku-buku strategi bisnis, psikologi konsumen, biografi pemimpin dunia, dan pengembangan diri untuk terus mengasah ketajaman wawasan.',
      mediumBtn: 'Baca di Medium',
      creativeTag: 'Ekspresi Kreatif',
    },
    contact: {
      kicker: "/ Let's Connect /",
      headingMain: "Let's Cultivate Meaningful",
      headingItalic: 'Business Growth',
      headingTogether: 'Together.',
      desc: 'Terbuka untuk posisi Management Trainee, Business Development, Strategic Marketing Specialist, serta inisiatif kemitraan baru. Mari berdiskusi bagaimana saya dapat berkontribusi nyata bagi organisasi Anda.',
      emailBtn: 'Email Langsung',
      waBtn: 'WhatsApp Langsung ↗',
      linkedinBtn: 'LinkedIn Profile ↗',
      connectDivider: 'Connect & Social Media',
      rights: 'All rights reserved.',
    },
    modal: {
      verifiedLabel: '✔ Dokumen Terverifikasi',
      verifiedText: 'Seluruh dokumentasi dapat diklik untuk dibuka dalam ukuran resolusi penuh asli',
      closeBtn: 'Tutup Dialog',
    },
  },
  en: {
    nav: {
      brandTag: 'Business & Marketing',
      academy: 'Academy & Skills',
      experience: 'Experience',
      projects: 'Projects',
      awards: 'Awards (7)',
      leadership: 'Leadership',
      certifications: 'Certifications',
      creative: 'Creative & Content',
      hobbies: 'Hobbies',
      connectBtn: "Let's Connect ↗",
    },
    hero: {
      greeting: "Hi I'm Chikal",
      subheadline: 'Connecting Business Strategy, Operations, & Digital Creativity.',
      openToWorkBadge: 'Open to Work • Management Trainee, BizDev, & Creative Roles',
      statGpaLabel: 'IPK / GPA',
      statGpaHonor: 'Cum Laude',
      statToeicLabel: 'TOEIC',
      statToeicHonor: 'Working Proficiency',
      statAwardsLabel: 'AWARDS',
      statAwardsHonor: '7x Nat’l Winner',
      bio: "Hello, I'm Chikal Nazmi Mahira. A Business Information Systems (D4 SIB) graduate from State Polytechnic of Malang focused on business operations, public relations, and creative content strategy.",
      ctaBtn: 'Get in Touch',
    },
    academy: {
      kicker: '( 01 ) Foundations & Capabilities',
      titleMain: 'Academic Background & ',
      titleItalic: 'Core Capabilities',
      subtitle: 'A proven blend of formal business information systems education and multidisciplinary practical expertise.',
      degreeBadge: 'Formal Degree',
      degreeTitle: 'Bachelor of Applied Science in Business Information Systems (D4 SIB)',
      degreeInstitution: 'Department of Information Technology — State Polytechnic of Malang',
      academicStandingLabel: 'Academic Standing',
      cumLaudeTag: 'Cum Laude',
      scaleTag: '4.00 Scale',
      globalEnglishLabel: 'Global English Proficiency',
      certifiedTag: 'Certified',
      workingProficiencyTag: 'Working Proficiency',
      coreLabel: 'Focus & Academic Core',
      coreDesc: 'Combining end-to-end business process governance, relational data modeling, and market penetration strategies with multinational-standard English communication.',
      docBtn: 'Open Graduation & TOEIC Credentials ↗',
      tabs: {
        all: 'All Capabilities',
        strategy: 'Strategy & Ops',
        systems: 'Systems & Tools',
        media: 'Media & Marketing',
        ethics: 'Work Ethics',
      },
      skills: {
        strategyTitle: 'Business Strategy & Operational SOPs',
        strategyStatus: '✓ Verified Applied',
        strategyDesc: 'Standardized operational workflows, daily cash reconciliation, and business model research.',
        systemsTitle: 'Information Systems & Digital Tools',
        systemsDesc: 'Technological foundation in UI design, relational database modeling, and business analytics.',
        mediaTitle: 'Creative Media, Growth & Collaboration',
        mediaDesc: 'Multi-platform content production, visual curation, and strategic team communication.',
      },
      curriculumNotice: 'Integrated Curriculum & Applied Field Execution',
      consultLink: 'Discuss Project Needs ↗',
    },
    experience: {
      kicker: '( 02 ) Career & Experience',
      titleMain: 'Work & Business ',
      titleItalic: 'Experience',
      subtitle: 'Real-world work experience in operational standardization, independent brand scaling, commercial event partnerships, and software automation research.',
      presentText: 'Present',
      docGalleryBtn: 'Documentation & Photo Gallery',
      duasisi: {
        title: 'Dua Sisi Laundry — Operational Setup & SOP',
        desc: 'Initiated the operational laundry launch, established daily washing-ironing Standard Operating Procedures (SOPs), and managed local marketing.',
        b1: 'Washing & Ironing SOPs',
        b2: 'Daily Cash Reconciliation',
        b3: 'Hyperlocal Marketing',
        btn: 'Dua Sisi Business Profile ↗',
      },
      yarnup: {
        title: 'YarnUp! Studio — Handmade Accessories',
        desc: 'Founded a handmade crochet accessories venture, directed product catalog photography and viral TikTok/Reels video content, and partnered with campus events.',
        b1: 'Creative Video Content',
        b2: 'Handmade Product Catalog',
        b3: 'Campus Event Sponsorships',
        btn: 'Official Store Instagram ↗',
      },
      manikarumi: {
        title: 'Manikarumi Indonesia — PR & Event Placement',
        desc: 'Established strategic partnerships with 20+ event organizers across Malang and Jakarta for bazaar booth placements, alongside managing visual social media content.',
        b1: '20+ Event Organizer Partners',
        b2: 'Bazaar Booth Operations',
        b3: 'Catalog Photos & TikTok Content',
        btn: 'Manikarumi Booth Gallery ↗',
      },
      digivia: {
        title: 'PT Digivia Indonesia — Software Engineer Intern',
        desc: 'Developed an internal newspaper news detection pipeline using Python, performed software feature maintenance, and conducted internal app quality assurance.',
        b1: 'Python Automation',
        b2: 'Newspaper Article Detection',
        b3: 'App QA & Feature Testing',
        btn: 'PT Digivia Profile ↗',
      },
    },
    projects: {
      kicker: '( 03 ) Selected Portfolio',
      titleMain: 'Applied Systems & ',
      titleItalic: 'Creative Campaigns',
      subtitle: 'Real-world case studies in business information systems engineering, user interface research, and digital marketing activations.',
      tabs: {
        all: 'All Projects',
        web: 'Web & Systems',
        ux: 'UX Research & Data',
        media: 'Commercial Media',
      },
      detailBtn: 'View Full Case Study ↗',
      inspectGalleryPrompt: 'Hover or click cards to view media documentation',
    },
    awards: {
      kicker: '( 04 ) Honors & Accreditations',
      titleMain: '7x National & ',
      titleItalic: 'Regional Awards',
      subtitle: 'Demonstrated track record in business plan competitions, IT innovations, and national presentation contests.',
      tabs: {
        all: 'All Honors (7)',
        first: '🥇 1st Place',
        second: '🥈 2nd Place',
        top5: '⭐ Finalist & Speaker',
      },
      viewDocBtn: 'Open Official Document ↗',
    },
    leadership: {
      kicker: '( 05 ) Leadership & Synergy',
      titleMain: 'Organizational & ',
      titleItalic: 'Team Leadership',
      subtitle: 'Active leadership in global student technology communities and campus public relations divisions.',
      inspectDocBtn: 'View Certificate & Portfolio ↗',
    },
    certifications: {
      kicker: '( 06 ) Professional Verified',
      titleMain: 'Accredited Certifications & ',
      titleItalic: 'Global Credentials',
      subtitle: 'Rigorous training and verified certifications from prominent tech and digital marketing education institutions.',
      notice: 'All certifications issued by accredited national & international institutions (RevoU, MySkill, ETS International).',
      clickPrompt: 'Click any card to preview high-resolution credentials ↗',
      viewCert: 'View Certificate',
    },
    creative: {
      kicker: '/ Content & Media /',
      title: 'Creator Studio & Social Growth',
      subtitle: 'Visual storytelling and creative media: Multi-platform content production (Instagram & TikTok) across managed brand accounts.',
      subheading: 'Social Media & Video Production',
      hoverNotice: 'Hover over each card to preview interactive content',
    },
    hobbies: {
      kicker: '/ Creative Balance & Lifestyle /',
      title: 'Arts, Hobbies & Intellectual Pursuits',
      subtitle: 'Personal pursuits that nurture creative balance, intellectual curiosity, and fresh problem-solving perspectives.',
      travelTitle: 'Travelling',
      travelSub: 'Exploring the world for fresh perspectives',
      travelDesc: 'Exploring diverse cities and natural landscapes to absorb cultural inspiration, local architecture, and widen problem-solving angles.',
      knittingTitle: 'Knitting & Crochet',
      knittingSub: 'Creative exploration in artisanal craft',
      knittingDesc: 'Expressing precision through hand-knitted textiles, experimenting with bespoke patterns, and crafting high-value artistic accessories.',
      writingTitle: 'Writing (Medium)',
      writingSub: 'Sharing business insights and strategic frameworks',
      writingDesc: 'Translating analytical thoughts on business dynamics, team leadership, and operational strategies into structured essays on Medium.',
      readingTitle: 'Reading & Learning',
      readingSub: 'Literature & continuous self-development',
      readingDesc: 'Studying business strategy literature, consumer psychology, global leader biographies, and personal development to sharpen critical thinking.',
      mediumBtn: 'Read on Medium',
      creativeTag: 'Creative Expression',
    },
    contact: {
      kicker: "/ Let's Connect /",
      headingMain: "Let's Cultivate Meaningful",
      headingItalic: 'Business Growth',
      headingTogether: 'Together.',
      desc: 'Open for Management Trainee, Business Development, Strategic Marketing Specialist roles, and new partnership initiatives. Let’s discuss how I can deliver real value to your organization.',
      emailBtn: 'Direct Email',
      waBtn: 'WhatsApp Direct ↗',
      linkedinBtn: 'LinkedIn Profile ↗',
      connectDivider: 'Connect & Social Media',
      rights: 'All rights reserved.',
    },
    modal: {
      verifiedLabel: '✔ Verified Credential',
      verifiedText: 'All documentation can be clicked to view in full original high resolution',
      closeBtn: 'Close Dialog',
    },
  },
};
