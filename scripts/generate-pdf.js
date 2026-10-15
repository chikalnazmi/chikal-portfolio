const fs = require('fs');
const path = require('path');
const puppeteer = require('puppeteer-core');

const chromePath = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const outputPath = path.join(__dirname, '..', 'public', 'chikal-nazmi-portfolio.pdf');

function getBase64(filePath) {
  try {
    const full = path.resolve(__dirname, '..', filePath);
    if (fs.existsSync(full)) {
      const ext = path.extname(full).replace('.', '');
      const mime = ext === 'webp' ? 'image/webp' : ext === 'png' ? 'image/png' : ext === 'jpg' || ext === 'jpeg' ? 'image/jpeg' : 'image/png';
      const b64 = fs.readFileSync(full).toString('base64');
      return `data:${mime};base64,${b64}`;
    }
  } catch (e) {
    console.error('Error reading file:', filePath, e.message);
  }
  return '';
}

function getFontBase64(fontName) {
  try {
    const full = path.resolve(__dirname, '..', 'public', 'fonts', fontName);
    if (fs.existsSync(full)) {
      return fs.readFileSync(full).toString('base64');
    }
  } catch (e) {
    console.error('Font error:', fontName, e.message);
  }
  return '';
}

const urbanistRegular = getFontBase64('Urbanist-Regular.ttf');
const urbanistSemiBold = getFontBase64('Urbanist-SemiBold.ttf');
const urbanistBold = getFontBase64('Urbanist-Bold.ttf');
const serifRegular = getFontBase64('InstrumentSerif-Regular.ttf');
const serifItalic = getFontBase64('InstrumentSerif-Italic.ttf');

const chikalPortrait = getBase64('public/chikal_hero_cutout.png') || getBase64('public/chikal_hero_cutout.webp');

const htmlContent = `<!DOCTYPE html>
<html lang="id">
<head>
<meta charset="UTF-8">
<style>
  @font-face {
    font-family: 'Instrument Serif';
    src: url('data:font/truetype;charset=utf-8;base64,${serifRegular}') format('truetype');
    font-weight: 400;
    font-style: normal;
  }
  @font-face {
    font-family: 'Instrument Serif';
    src: url('data:font/truetype;charset=utf-8;base64,${serifItalic}') format('truetype');
    font-weight: 400;
    font-style: italic;
  }
  @font-face {
    font-family: 'Urbanist';
    src: url('data:font/truetype;charset=utf-8;base64,${urbanistRegular}') format('truetype');
    font-weight: 400;
  }
  @font-face {
    font-family: 'Urbanist';
    src: url('data:font/truetype;charset=utf-8;base64,${urbanistSemiBold}') format('truetype');
    font-weight: 600;
  }
  @font-face {
    font-family: 'Urbanist';
    src: url('data:font/truetype;charset=utf-8;base64,${urbanistBold}') format('truetype');
    font-weight: 700;
  }

  * {
    box-sizing: border-box;
    margin: 0;
    padding: 0;
  }

  body {
    font-family: 'Urbanist', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
    color: #212B1E;
    background-color: #FAFCF8;
    -webkit-print-color-adjust: exact;
    print-color-adjust: exact;
    line-height: 1.45;
  }

  .serif {
    font-family: 'Instrument Serif', Georgia, serif;
  }

  .serif-italic {
    font-family: 'Instrument Serif', Georgia, serif;
    font-style: italic;
  }

  /* Page styling - Exact A4 */
  .page {
    width: 210mm;
    height: 297mm;
    padding: 14mm 16mm 12mm 16mm;
    position: relative;
    page-break-after: always;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    background: #FAFCF8;
    overflow: hidden;
  }

  .page-inner {
    flex: 1;
    display: flex;
    flex-direction: column;
  }

  .footer-bar {
    border-top: 1px solid #CAD7C5;
    padding-top: 6px;
    margin-top: 8px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    font-size: 8pt;
    color: #556B4E;
  }

  /* Header / Accent elements */
  .doc-top-bar {
    display: flex;
    justify-content: space-between;
    align-items: center;
    border-bottom: 1.5px solid #CAD7C5;
    padding-bottom: 8px;
    margin-bottom: 12px;
  }

  .brand-title {
    font-size: 14pt;
    font-weight: 700;
    color: #1E351A;
    letter-spacing: -0.2px;
  }

  .brand-subtitle {
    font-size: 7.5pt;
    text-transform: uppercase;
    letter-spacing: 1.6px;
    color: #BD5871;
    font-weight: 700;
  }

  .badge-pill {
    display: inline-flex;
    align-items: center;
    padding: 2.5px 9px;
    border-radius: 9999px;
    font-size: 7.5pt;
    font-weight: 600;
    background: #E8EFE5;
    color: #1E351A;
    border: 1px solid #CAD7C5;
  }

  .badge-rose {
    background: #FCEEF1;
    color: #BD5871;
    border-color: #F5D3DC;
  }

  .badge-forest {
    background: #1E351A;
    color: #FFFFFF;
    border-color: #1E351A;
  }

  .section-kicker {
    font-size: 7.5pt;
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: 1.5px;
    color: #BD5871;
    display: block;
    margin-bottom: 2px;
  }

  .card {
    background: #FFFFFF;
    border: 1px solid #CAD7C5;
    border-radius: 9px;
    padding: 10px 12px;
    box-shadow: 0 1px 4px rgba(33, 43, 30, 0.02);
  }

  .metric-box {
    background: #FFFFFF;
    border: 1px solid #CAD7C5;
    border-radius: 7px;
    padding: 8px 10px;
    text-align: center;
  }

  .metric-val {
    font-size: 16pt;
    font-weight: 700;
    color: #1E351A;
    line-height: 1;
  }

  .metric-lbl {
    font-size: 7pt;
    font-weight: 600;
    color: #556B4E;
    margin-top: 3px;
    text-transform: uppercase;
    letter-spacing: 0.5px;
  }

  .metric-sub {
    font-size: 7pt;
    color: #BD5871;
    font-weight: 600;
  }

  .bullet-list {
    margin-left: 14px;
    margin-top: 4px;
    font-size: 8pt;
    color: #334430;
  }

  .bullet-list li {
    margin-bottom: 2.5px;
  }

  .tag-item {
    display: inline-block;
    padding: 2px 6px;
    border-radius: 4px;
    font-size: 7pt;
    font-weight: 600;
    background: #F0F4ED;
    border: 1px solid #CAD7C5;
    color: #1E351A;
    margin-right: 3px;
    margin-bottom: 3px;
  }
</style>
</head>
<body>

<!-- ============================================================== -->
<!-- PAGE 1: COVER & EXECUTIVE PROFILE                              -->
<!-- ============================================================== -->
<div class="page">
  <div class="page-inner">
    <!-- Top Bar -->
    <div class="doc-top-bar">
      <div>
        <div class="brand-title">Chikal Nazmi Mahira</div>
        <div class="brand-subtitle">Business Development • Operations • Marketing</div>
      </div>
      <div style="display: flex; gap: 8px; align-items: center;">
        <span class="badge-pill badge-rose">Portfolio &amp; Executive CV</span>
        <span class="badge-pill badge-forest">Open to Work</span>
      </div>
    </div>

    <!-- Hero / Profile Main Showcase -->
    <div style="display: grid; grid-template-columns: 140mm 1fr; gap: 14px; margin-bottom: 12px; align-items: center;">
      <div>
        <div style="font-size: 9.5pt; color: #556B4E; font-weight: 700; margin-bottom: 3px; letter-spacing: 1px;">CURRICULUM VITAE &amp; DOSSIER</div>
        <h1 style="font-size: 24pt; color: #1E351A; font-weight: 700; line-height: 1.1; margin-bottom: 4px;">
          Chikal Nazmi Mahira
        </h1>
        <div class="serif-italic" style="font-size: 18pt; color: #BD5871; line-height: 1.15; margin-bottom: 10px;">
          Connecting Business Strategy, Operations &amp; Digital Creativity
        </div>
        <p style="font-size: 8.8pt; color: #2D3D2A; line-height: 1.5; text-align: justify; margin-bottom: 10px;">
          Lulusan Sarjana Terapan Sistem Informasi Bisnis (D4 SIB) Politeknik Negeri Malang dengan predikat akademik memuaskan (Cum Laude). Memiliki rekam jejak terbukti dalam perancangan strategi bisnis hulu-ke-hilir, standarisasi SOP operasional, manajemen kemitraan public relations dengan 20+ event organizer, serta kejuaraan 7x kompetisi rencana bisnis nasional. Siap berkontribusi dalam program Management Trainee, Business Development, dan Creative Strategic Marketing.
        </p>

        <!-- Key Metrics Row -->
        <div style="display: grid; grid-template-columns: repeat(4, 1fr); gap: 6px; margin-top: 8px;">
          <div class="metric-box">
            <div class="metric-val" style="color: #1E351A;">3.73</div>
            <div class="metric-lbl">IPK / GPA</div>
            <div class="metric-sub">Cum Laude</div>
          </div>
          <div class="metric-box">
            <div class="metric-val" style="color: #BD5871;">775</div>
            <div class="metric-lbl">TOEIC Score</div>
            <div class="metric-sub">Working Prof.</div>
          </div>
          <div class="metric-box">
            <div class="metric-val" style="color: #385E30;">7x</div>
            <div class="metric-lbl">Business Awards</div>
            <div class="metric-sub">Tingkat Nasional</div>
          </div>
          <div class="metric-box">
            <div class="metric-val" style="color: #B5672B;">20+</div>
            <div class="metric-lbl">Event Partners</div>
            <div class="metric-sub">PR &amp; Placement</div>
          </div>
        </div>
      </div>

      <!-- Cutout / Profile Photo Column -->
      <div style="text-align: center; background: #FFFFFF; border: 1.5px solid #CAD7C5; border-radius: 12px; padding: 10px; box-shadow: 0 4px 12px rgba(33,43,30,0.03);">
        <img src="${chikalPortrait}" alt="Chikal Nazmi Mahira" style="width: 100%; max-height: 175px; object-fit: contain; margin-bottom: 6px;" />
        <div style="font-size: 8.5pt; font-weight: 700; color: #1E351A;">Chikal Nazmi Mahira</div>
        <div style="font-size: 7.2pt; color: #556B4E; margin-top: 1px;">D4 Sistem Informasi Bisnis</div>
        <div style="font-size: 7.2pt; color: #BD5871; font-weight: 600;">Politeknik Negeri Malang</div>
      </div>
    </div>

    <!-- Contact & Direct Coordinates Strip -->
    <div class="card" style="margin-bottom: 12px; background: #E8EFE5; border-color: #B8CBB4; padding: 8px 12px;">
      <div style="display: grid; grid-template-columns: repeat(4, 1fr); gap: 10px; font-size: 8pt;">
        <div><strong style="color: #1E351A;">Email:</strong> chikalnazmi@gmail.com</div>
        <div><strong style="color: #1E351A;">WhatsApp:</strong> +62 812-3456-7890</div>
        <div><strong style="color: #1E351A;">LinkedIn:</strong> linkedin.com/in/chikalnazmi</div>
        <div><strong style="color: #1E351A;">Domisili:</strong> Malang / Jakarta, ID</div>
      </div>
    </div>

    <!-- Core Highlights Grid -->
    <div style="display: grid; grid-template-columns: 1.1fr 0.9fr; gap: 10px; flex: 1;">
      <!-- Career Focus & Value Offer -->
      <div class="card">
        <span class="section-kicker">Core Competencies</span>
        <h3 style="font-size: 10.5pt; color: #1E351A; font-weight: 700; margin-bottom: 4px;">Spesialisasi &amp; Nilai Tambah</h3>
        <ul class="bullet-list" style="margin-top: 2px;">
          <li><strong>Business Plan &amp; BMC Modeling:</strong> Mahir menyusun 9-blok Business Model Canvas, analisis kelayakan pasar, proyeksi finansial, dan strategi diferensiasi produk.</li>
          <li><strong>Operational SOP &amp; Cash Flow:</strong> Berpengalaman mendirikan alur kerja laundry harian terstandar, pencatatan pembukuan kas harian, dan evaluasi efisiensi pengerjaan.</li>
          <li><strong>Public Relations &amp; Sponsorship:</strong> Menghubungkan brand dengan 20+ event organizer terkemuka untuk penempatan booth, aktivasi bazar, dan kemitraan kolaboratif.</li>
          <li><strong>Creative Media &amp; Digital Campaign:</strong> Memproduksi video konten pendek (Reels/TikTok) dengan storytelling sinematik, katalog produk rajut, dan peningkatan jangkauan audiens organik.</li>
        </ul>
      </div>

      <!-- Quick Executive Summary & Education Overview -->
      <div class="card">
        <span class="section-kicker">Academic Standing</span>
        <h3 style="font-size: 10.5pt; color: #1E351A; font-weight: 700; margin-bottom: 4px;">Pendidikan Formal</h3>
        <div style="margin-bottom: 6px;">
          <div style="display: flex; justify-content: space-between; align-items: baseline;">
            <strong style="font-size: 9pt; color: #1E351A;">D4 Sistem Informasi Bisnis</strong>
            <span style="font-size: 7.5pt; color: #556B4E; font-weight: 600;">2020 – 2024</span>
          </div>
          <div style="font-size: 8pt; color: #BD5871; font-weight: 600;">Politeknik Negeri Malang • Jurusan TI</div>
          <div style="font-size: 7.5pt; color: #445540; margin-top: 2px;">
            Predikat Memuaskan (Cum Laude). Fokus pada Analisis Proses Bisnis, Manajemen Proyek TI, dan Riset Pasar.
          </div>
        </div>

        <div style="border-top: 1px solid #CAD7C5; padding-top: 6px; margin-top: 6px;">
          <strong style="font-size: 8.5pt; color: #1E351A; display: block; margin-bottom: 2px;">Kemampuan Bahasa &amp; Komunikasi</strong>
          <div style="font-size: 7.5pt; color: #334430; line-height: 1.4;">
            • <strong>Bahasa Indonesia:</strong> Penutur Asli (Native)<br>
            • <strong>Bahasa Inggris:</strong> Skor Resmi TOEIC 775 (Working Proficiency &amp; Business Presentations)
          </div>
        </div>
      </div>
    </div>
  </div>

  <!-- Footer -->
  <div class="footer-bar">
    <div>Chikal Nazmi Mahira • Executive Dossier</div>
    <div>Halaman 1 dari 5</div>
  </div>
</div>


<!-- ============================================================== -->
<!-- PAGE 2: PROFESSIONAL & BUSINESS EXPERIENCES                    -->
<!-- ============================================================== -->
<div class="page">
  <div class="page-inner">
    <!-- Top Bar -->
    <div class="doc-top-bar">
      <div>
        <div class="brand-title">Pengalaman Kerja &amp; Wirausaha</div>
        <div class="brand-subtitle">Track Record • Leadership • Concrete Impact</div>
      </div>
      <div>
        <span class="badge-pill badge-rose">Professional Experience</span>
      </div>
    </div>

    <div style="display: flex; flex-direction: column; gap: 8px; flex: 1; justify-content: space-between;">
      <!-- Experience 1: Dua Sisi Laundry -->
      <div class="card" style="padding: 9px 12px;">
        <div style="display: flex; justify-content: space-between; align-items: baseline; margin-bottom: 3px;">
          <div>
            <span style="font-size: 7pt; font-weight: 700; color: #BD5871; text-transform: uppercase; letter-spacing: 0.8px;">Operasional &amp; Sistem Kas</span>
            <h3 style="font-size: 10.5pt; color: #1E351A; font-weight: 700;">Dua Sisi Laundry — Operational Setup &amp; SOP</h3>
          </div>
          <span class="badge-pill">2024 – Sekarang</span>
        </div>
        <p style="font-size: 8pt; color: #334430; margin-bottom: 4px;">
          Menginisiasi peluncuran operasional bisnis laundry, merumuskan alur kerja pengerjaan cuci-setrika harian, mengelola arus kas, dan memimpin promosi pemasaran digital lokal.
        </p>
        <div style="background: #F4F7F2; border-radius: 5px; padding: 5px 8px; margin-bottom: 4px;">
          <ul class="bullet-list" style="margin-top: 0; font-size: 7.5pt;">
            <li><strong>Penyusunan SOP Standar:</strong> Merancang panduan operasional cuci, pemilahan jenis bahan, setrika uap, dan pengemasan untuk menjamin zero garment loss.</li>
            <li><strong>Pencatatan Kas &amp; Pembukuan:</strong> Mengintegrasikan sistem pencatatan keuangan harian untuk rekonsiliasi kas masuk dan operasional belanja deterjen/parfum.</li>
            <li><strong>Pemasaran Digital Lokal:</strong> Menjalankan konten edukasi perawatan pakaian di Instagram (@duasisi.laundry) untuk menjaring pelanggan tetap.</li>
          </ul>
        </div>
        <div>
          <span class="tag-item">SOP Development</span>
          <span class="tag-item">Cash Reconciliation</span>
          <span class="tag-item">Customer Satisfaction</span>
        </div>
      </div>

      <!-- Experience 2: YarnUp! Studio -->
      <div class="card" style="padding: 9px 12px;">
        <div style="display: flex; justify-content: space-between; align-items: baseline; margin-bottom: 3px;">
          <div>
            <span style="font-size: 7pt; font-weight: 700; color: #BD5871; text-transform: uppercase; letter-spacing: 0.8px;">Wirausaha Kreatif &amp; Brand Founder</span>
            <h3 style="font-size: 10.5pt; color: #1E351A; font-weight: 700;">YarnUp! Studio — Handcrafted Accessories Brand</h3>
          </div>
          <span class="badge-pill">2024 – Sekarang</span>
        </div>
        <p style="font-size: 8pt; color: #334430; margin-bottom: 4px;">
          Membangun dan memimpin lini usaha aksesoris rajut buatan tangan (handmade), memproduksi visual foto katalog produk, serta menyusun kalender promosi TikTok dan Instagram Reels.
        </p>
        <div style="background: #F4F7F2; border-radius: 5px; padding: 5px 8px; margin-bottom: 4px;">
          <ul class="bullet-list" style="margin-top: 0; font-size: 7.5pt;">
            <li><strong>Lonjakan Jangkauan Konten:</strong> Meraih lonjakan jangkauan penonton hingga +2.089% dan engagement rate 20.02% melalui video behind-the-scenes proses merajut.</li>
            <li><strong>Penetapan Harga &amp; Margin:</strong> Menghitung Cost of Goods Sold (COGS), margin keuntungan tiap jenis produk, serta strategi bundling aksesoris.</li>
            <li><strong>Sponsorship Kampus:</strong> Menjadi mitra sponsor resmi merchandise dalam perhelatan kegiatan mahasiswa dan festival kampus.</li>
          </ul>
        </div>
        <div>
          <span class="tag-item">Brand Strategy</span>
          <span class="tag-item">Product Direction</span>
          <span class="tag-item">COGS Calculation</span>
        </div>
      </div>

      <!-- Experience 3: Manikarumi Indonesia -->
      <div class="card" style="padding: 9px 12px;">
        <div style="display: flex; justify-content: space-between; align-items: baseline; margin-bottom: 3px;">
          <div>
            <span style="font-size: 7pt; font-weight: 700; color: #BD5871; text-transform: uppercase; letter-spacing: 0.8px;">Kemitraan &amp; Penempatan Event</span>
            <h3 style="font-size: 10.5pt; color: #1E351A; font-weight: 700;">Manikarumi Indonesia — Public Relations Lead</h3>
          </div>
          <span class="badge-pill">2024 – Sekarang</span>
        </div>
        <p style="font-size: 8pt; color: #334430; margin-bottom: 4px;">
          Bertanggung jawab atas kemitraan eksternal, negosiasi penempatan stan bazar dengan 20+ event organizer di Malang dan Jakarta, serta penataan visual merchandising booth.
        </p>
        <div style="background: #F4F7F2; border-radius: 5px; padding: 5px 8px; margin-bottom: 4px;">
          <ul class="bullet-list" style="margin-top: 0; font-size: 7.5pt;">
            <li><strong>20+ Jaringan Mitra Event:</strong> Berhasil menempatkan display booth di festival-festival besar lintas kota dengan traffic pengunjung tinggi.</li>
            <li><strong>Visual Merchandising:</strong> Menata display yang memicu kenaikan kunjungan booth hingga +40% dibanding penataan standar.</li>
            <li><strong>Dokumentasi PR &amp; Media:</strong> Mengabadikan suasana live bazar dalam format vlog dan reels interaktif untuk brand awareness.</li>
          </ul>
        </div>
        <div>
          <span class="tag-item">B2B Networking</span>
          <span class="tag-item">Booth Merchandising</span>
          <span class="tag-item">Event Management</span>
        </div>
      </div>

      <!-- Experience 4: PT Digivla Indonesia -->
      <div class="card" style="padding: 9px 12px;">
        <div style="display: flex; justify-content: space-between; align-items: baseline; margin-bottom: 3px;">
          <div>
            <span style="font-size: 7pt; font-weight: 700; color: #BD5871; text-transform: uppercase; letter-spacing: 0.8px;">Software Engineering &amp; Data Internship</span>
            <h3 style="font-size: 10.5pt; color: #1E351A; font-weight: 700;">PT Digivla Indonesia — Software Engineer Intern</h3>
          </div>
          <span class="badge-pill">2024 – 2025</span>
        </div>
        <p style="font-size: 8pt; color: #334430; margin-bottom: 4px;">
          Mengembangkan pipeline otomasi deteksi teks koran cetak menggunakan modul Python, validasi akurasi data berita, dan pengujian fungsional modul aplikasi intelijen media internal.
        </p>
        <div style="background: #F4F7F2; border-radius: 5px; padding: 5px 8px; margin-bottom: 4px;">
          <ul class="bullet-list" style="margin-top: 0; font-size: 7.5pt;">
            <li><strong>Automasi Monitoring Berita:</strong> Mengimplementasikan script Python untuk ekstraksi teks koran fisik ke dalam database terstruktur.</li>
            <li><strong>Quality Assurance &amp; Bug Tracking:</strong> Melakukan pengujian sistematis untuk memastikan kestabilan modul pemrosesan data media.</li>
          </ul>
        </div>
        <div>
          <span class="tag-item">Python Scripting</span>
          <span class="tag-item">Data Processing</span>
          <span class="tag-item">Quality Assurance (QA)</span>
        </div>
      </div>
    </div>
  </div>

  <!-- Footer -->
  <div class="footer-bar">
    <div>Chikal Nazmi Mahira • Experience Records</div>
    <div>Halaman 2 dari 5</div>
  </div>
</div>


<!-- ============================================================== -->
<!-- PAGE 3: STRATEGIC & SYSTEMS PROJECTS                           -->
<!-- ============================================================== -->
<div class="page">
  <div class="page-inner">
    <!-- Top Bar -->
    <div class="doc-top-bar">
      <div>
        <div class="brand-title">Proyek Sistem &amp; Perencanaan Strategis</div>
        <div class="brand-subtitle">Business Analysis • Systems Architecture • Market Feasibility</div>
      </div>
      <div>
        <span class="badge-pill badge-rose">Selected Works Dossier</span>
      </div>
    </div>

    <div style="display: flex; flex-direction: column; gap: 8px; flex: 1; justify-content: space-between;">
      <!-- Project 1: SurveyKu Platform -->
      <div class="card" style="padding: 9px 12px;">
        <div style="display: flex; justify-content: space-between; align-items: baseline; margin-bottom: 2px;">
          <div>
            <span style="font-size: 7pt; font-weight: 700; color: #BD5871; text-transform: uppercase; letter-spacing: 0.8px;">Sistem Informasi &amp; UI/UX</span>
            <h3 style="font-size: 10pt; color: #1E351A; font-weight: 700;">Website SurveyKu — Academic Survey Platform</h3>
          </div>
          <span class="badge-pill">2023 – 2024</span>
        </div>
        <p style="font-size: 8pt; color: #334430; margin-bottom: 4px;">
          Merancang prototipe antarmuka UI/UX (Figma) dan skema database relasional untuk platform evaluasi kepuasan mahasiswa terpadu di Politeknik Negeri Malang.
        </p>
        <div style="font-size: 7.5pt; color: #556B4E; margin-bottom: 4px;">
          <strong>Poin Kunci:</strong> User-centered design, pemodelan tabel MySQL, kuesioner interaktif, dan visualisasi agregasi respon realtime.
        </div>
        <div>
          <span class="tag-item">Figma UI/UX</span>
          <span class="tag-item">Database Design</span>
          <span class="tag-item">Usability Testing</span>
        </div>
      </div>

      <!-- Project 2: Media Monitoring Automation -->
      <div class="card" style="padding: 9px 12px;">
        <div style="display: flex; justify-content: space-between; align-items: baseline; margin-bottom: 2px;">
          <div>
            <span style="font-size: 7pt; font-weight: 700; color: #BD5871; text-transform: uppercase; letter-spacing: 0.8px;">Automasi Data Python</span>
            <h3 style="font-size: 10pt; color: #1E351A; font-weight: 700;">Media Monitoring &amp; Newspaper Detection Pipeline</h3>
          </div>
          <span class="badge-pill">2023 – 2024</span>
        </div>
        <p style="font-size: 8pt; color: #334430; margin-bottom: 4px;">
          Pengembangan script automasi berbasis Python untuk ekstraksi teks berita koran dan pengelompokan kata kunci media monitoring.
        </p>
        <div style="font-size: 7.5pt; color: #556B4E; margin-bottom: 4px;">
          <strong>Poin Kunci:</strong> Ekstraksi regex terstruktur, pengujian fungsional modul intelijen media, dan pembersihan data teks otomatis.
        </div>
        <div>
          <span class="tag-item">Python</span>
          <span class="tag-item">Regex Pipeline</span>
          <span class="tag-item">Data Extraction</span>
        </div>
      </div>

      <!-- Project 3: JTI Certify Portal -->
      <div class="card" style="padding: 9px 12px;">
        <div style="display: flex; justify-content: space-between; align-items: baseline; margin-bottom: 2px;">
          <div>
            <span style="font-size: 7pt; font-weight: 700; color: #BD5871; text-transform: uppercase; letter-spacing: 0.8px;">Manajemen Kredensial Akademik</span>
            <h3 style="font-size: 10pt; color: #1E351A; font-weight: 700;">JTI Certify — Mahasiswa TI Credential System</h3>
          </div>
          <span class="badge-pill">2023</span>
        </div>
        <p style="font-size: 8pt; color: #334430; margin-bottom: 4px;">
          Perancangan alur sistem verifikasi portofolio dan arsip sertifikat prestasi akademik mahasiswa Jurusan Teknologi Informasi.
        </p>
        <div style="font-size: 7.5pt; color: #556B4E; margin-bottom: 4px;">
          <strong>Poin Kunci:</strong> Validasi keaslian berkas digital, antarmuka peninjauan berkas admin, dan integrasi riwayat mahasiswa.
        </div>
        <div>
          <span class="tag-item">Information Architecture</span>
          <span class="tag-item">Credential Verification</span>
          <span class="tag-item">Process Flow</span>
        </div>
      </div>

      <!-- Project 4: Business Model Canvas & Feasibility -->
      <div class="card" style="padding: 9px 12px;">
        <div style="display: flex; justify-content: space-between; align-items: baseline; margin-bottom: 2px;">
          <div>
            <span style="font-size: 7pt; font-weight: 700; color: #BD5871; text-transform: uppercase; letter-spacing: 0.8px;">Perencanaan Bisnis &amp; Finansial</span>
            <h3 style="font-size: 10pt; color: #1E351A; font-weight: 700;">Business Model Canvas &amp; Market Feasibility Plan</h3>
          </div>
          <span class="badge-pill">2024</span>
        </div>
        <p style="font-size: 8pt; color: #334430; margin-bottom: 4px;">
          Perumusan rencana bisnis komprehensif 9 blok BMC, analisis SWOT, strategi penetrasi pasar, dan proyeksi arus kas 3 tahun yang mengantarkan gelar Juara 1 Nasional.
        </p>
        <div style="font-size: 7.5pt; color: #556B4E; margin-bottom: 4px;">
          <strong>Poin Kunci:</strong> Valuasi target pasar, diferensiasi value proposition, customer acquisition cost, dan analisis Break Even Point (BEP).
        </div>
        <div>
          <span class="tag-item">9-Block BMC</span>
          <span class="tag-item">Financial Projection</span>
          <span class="tag-item">Market Feasibility</span>
        </div>
      </div>

      <!-- Project 5: Sales Performance & Analytics Dashboard -->
      <div class="card" style="padding: 9px 12px;">
        <div style="display: flex; justify-content: space-between; align-items: baseline; margin-bottom: 2px;">
          <div>
            <span style="font-size: 7pt; font-weight: 700; color: #BD5871; text-transform: uppercase; letter-spacing: 0.8px;">Analisis Data Bisnis</span>
            <h3 style="font-size: 10pt; color: #1E351A; font-weight: 700;">Sales Performance &amp; Business Analytics Dashboard</h3>
          </div>
          <span class="badge-pill">2023</span>
        </div>
        <p style="font-size: 8pt; color: #334430; margin-bottom: 4px;">
          Pemodelan data analitik penjualan dan rekonsiliasi kas berbasis spreadsheet formula tingkat lanjut untuk monitoring KPI transaksi harian.
        </p>
        <div style="font-size: 7.5pt; color: #556B4E; margin-bottom: 4px;">
          <strong>Poin Kunci:</strong> Formula lookup dinamis, visualisasi performa penjualan, perputaran stok barang, dan rekonsiliasi kas otomatis.
        </div>
        <div>
          <span class="tag-item">Sales KPI Modeling</span>
          <span class="tag-item">Data Analytics</span>
          <span class="tag-item">Cash Reconciliation</span>
        </div>
      </div>
    </div>
  </div>

  <!-- Footer -->
  <div class="footer-bar">
    <div>Chikal Nazmi Mahira • Strategic Projects</div>
    <div>Halaman 3 dari 5</div>
  </div>
</div>


<!-- ============================================================== -->
<!-- PAGE 4: AWARDS, HONORS & TROPHY CASE                           -->
<!-- ============================================================== -->
<div class="page">
  <div class="page-inner">
    <!-- Top Bar -->
    <div class="doc-top-bar">
      <div>
        <div class="brand-title">Penghargaan Kompetisi Bisnis</div>
        <div class="brand-subtitle">7x National Competition Honors &amp; Public Speaking</div>
      </div>
      <div>
        <span class="badge-pill badge-rose">National Business Competitions</span>
      </div>
    </div>

    <!-- Awards Intro Highlight -->
    <div class="card" style="background: #E8EFE5; border-color: #B8CBB4; margin-bottom: 10px; display: flex; justify-content: space-between; align-items: center; padding: 8px 12px;">
      <div>
        <span style="font-size: 7.5pt; font-weight: 700; color: #1E351A; text-transform: uppercase; letter-spacing: 1px;">Prestasi Kompetitif Nasional</span>
        <div style="font-size: 10pt; color: #1E351A; font-weight: 700; margin-top: 1px;">
          Terbukti Berdaya Saing Tinggi dalam Perumusan Ide Bisnis, Riset Pasar, &amp; Pitching Presentasi
        </div>
      </div>
      <div style="text-align: right; min-width: 90px;">
        <span class="badge-pill badge-forest" style="font-size: 8pt; padding: 3px 10px;">7 Gelar Juara</span>
      </div>
    </div>

    <!-- 7 Awards Table / List -->
    <div style="display: flex; flex-direction: column; gap: 7px; flex: 1; justify-content: space-between;">
      <!-- Award 1 -->
      <div class="card" style="padding: 9px 12px;">
        <div style="display: flex; justify-content: space-between; align-items: baseline;">
          <div>
            <span class="badge-pill badge-rose" style="font-size: 7pt; margin-bottom: 2px;">Juara 1 • Tingkat Nasional</span>
            <h4 style="font-size: 9.5pt; color: #1E351A; font-weight: 700;">National Fest Business Plan Competition 2024</h4>
            <div style="font-size: 7.5pt; color: #556B4E; font-weight: 600;">Fakultas Ekonomi dan Bisnis, Universitas Islam Malang (UNISMA)</div>
          </div>
          <span style="font-size: 8pt; font-weight: 700; color: #1E351A;">2024</span>
        </div>
        <p style="font-size: 7.5pt; color: #334430; margin-top: 3px;">
          Meraih Juara 1 tingkat nasional dalam penyusunan proposal bisnis komprehensif, validasi kelayakan model finansial, dan presentasi pitching di hadapan juri akademisi dan praktisi bisnis.
        </p>
      </div>

      <!-- Award 2 -->
      <div class="card" style="padding: 9px 12px;">
        <div style="display: flex; justify-content: space-between; align-items: baseline;">
          <div>
            <span class="badge-pill" style="font-size: 7pt; margin-bottom: 2px; background: #FFF3D6; color: #8F5B00; border-color: #E8D099;">Top 5 Finalist • Tingkat Nasional</span>
            <h4 style="font-size: 9.5pt; color: #1E351A; font-weight: 700;">National Business Plan Competition (BPC) 2024</h4>
            <div style="font-size: 7.5pt; color: #556B4E; font-weight: 600;">Universitas Negeri Padang (UNP)</div>
          </div>
          <span style="font-size: 8pt; font-weight: 700; color: #1E351A;">2024</span>
        </div>
        <p style="font-size: 7.5pt; color: #334430; margin-top: 3px;">
          Masuk jajaran 5 besar proposal bisnis terpilih dari ratusan peserta perguruan tinggi se-Indonesia dengan keunggulan riset pasar dan diferensiasi produk.
        </p>
      </div>

      <!-- Award 3 -->
      <div class="card" style="padding: 9px 12px;">
        <div style="display: flex; justify-content: space-between; align-items: baseline;">
          <div>
            <span class="badge-pill badge-rose" style="font-size: 7pt; margin-bottom: 2px;">Juara 1 • Tingkat Institusi</span>
            <h4 style="font-size: 9.5pt; color: #1E351A; font-weight: 700;">Lomba Business Plan Mahasiswa Politeknik Negeri Malang 2023</h4>
            <div style="font-size: 7.5pt; color: #556B4E; font-weight: 600;">Politeknik Negeri Malang</div>
          </div>
          <span style="font-size: 8pt; font-weight: 700; color: #1E351A;">2023</span>
        </div>
        <p style="font-size: 7.5pt; color: #334430; margin-top: 3px;">
          Juara 1 dalam perancangan ide inovasi bisnis terapan antar jurusan di Politeknik Negeri Malang.
        </p>
      </div>

      <!-- Award 4 -->
      <div class="card" style="padding: 9px 12px;">
        <div style="display: flex; justify-content: space-between; align-items: baseline;">
          <div>
            <span class="badge-pill" style="font-size: 7pt; margin-bottom: 2px; background: #FFF3D6; color: #8F5B00; border-color: #E8D099;">Top 5 Finalist • Tingkat Nasional</span>
            <h4 style="font-size: 9.5pt; color: #1E351A; font-weight: 700;">National Business Plan Competition Universitas Brawijaya 2023</h4>
            <div style="font-size: 7.5pt; color: #556B4E; font-weight: 600;">Universitas Brawijaya (UB)</div>
          </div>
          <span style="font-size: 8pt; font-weight: 700; color: #1E351A;">2023</span>
        </div>
        <p style="font-size: 7.5pt; color: #334430; margin-top: 3px;">
          Finalis 5 besar nasional dalam kompetisi perencanaan bisnis kreatif mahasiswa dengan penilaian inovasi dan kelayakan eksekusi.
        </p>
      </div>

      <!-- Award 5 -->
      <div class="card" style="padding: 9px 12px;">
        <div style="display: flex; justify-content: space-between; align-items: baseline;">
          <div>
            <span class="badge-pill badge-forest" style="font-size: 7pt; margin-bottom: 2px;">Juara 2 • Tingkat Nasional</span>
            <h4 style="font-size: 9.5pt; color: #1E351A; font-weight: 700;">National Fest Business Plan Competition 2023</h4>
            <div style="font-size: 7.5pt; color: #556B4E; font-weight: 600;">Fakultas Ekonomi dan Bisnis, Universitas Islam Malang</div>
          </div>
          <span style="font-size: 8pt; font-weight: 700; color: #1E351A;">2023</span>
        </div>
        <p style="font-size: 7.5pt; color: #334430; margin-top: 3px;">
          Juara 2 dalam perumusan strategi penetrasi pasar dan proyeksi keuangan 3 tahun produk konsumen.
        </p>
      </div>

      <!-- Award 6 & 7 (Grid 2 Kolom) -->
      <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 7px;">
        <div class="card" style="padding: 8px 11px;">
          <span class="badge-pill badge-forest" style="font-size: 7pt; margin-bottom: 2px;">Juara 2 • Tingkat Nasional</span>
          <h4 style="font-size: 9pt; color: #1E351A; font-weight: 700;">Business Plan Competition 2022</h4>
          <div style="font-size: 7pt; color: #556B4E; font-weight: 600;">Universitas Muhammadiyah Malang (UMM)</div>
          <p style="font-size: 7pt; color: #334430; margin-top: 2px;">
            Perancangan proposal bisnis kreatif mahasiswa tingkat nasional (Tahun 2022).
          </p>
        </div>

        <div class="card" style="padding: 8px 11px; background: #FCEEF1; border-color: #F5D3DC;">
          <span class="badge-pill badge-rose" style="font-size: 7pt; margin-bottom: 2px;">Best Speaker • Tingkat Nasional</span>
          <h4 style="font-size: 9pt; color: #BD5871; font-weight: 700;">National BPC UNESA 2022</h4>
          <div style="font-size: 7pt; color: #8F3A50; font-weight: 600;">Universitas Negeri Surabaya (UNESA)</div>
          <p style="font-size: 7pt; color: #5A2734; margin-top: 2px;">
            Penghargaan Pembicara Terbaik dalam presentasi bisnis dan sesi tanya jawab juri.
          </p>
        </div>
      </div>
    </div>
  </div>

  <!-- Footer -->
  <div class="footer-bar">
    <div>Chikal Nazmi Mahira • Awards &amp; Honors</div>
    <div>Halaman 4 dari 5</div>
  </div>
</div>


<!-- ============================================================== -->
<!-- PAGE 5: SKILLS MATRIX, CERTIFICATIONS & LEADERSHIP             -->
<!-- ============================================================== -->
<div class="page">
  <div class="page-inner">
    <!-- Top Bar -->
    <div class="doc-top-bar">
      <div>
        <div class="brand-title">Keahlian, Sertifikasi &amp; Kepemimpinan</div>
        <div class="brand-subtitle">Skills Matrix • Professional Development • Leadership</div>
      </div>
      <div>
        <span class="badge-pill badge-forest">Competencies &amp; Credentials</span>
      </div>
    </div>

    <!-- Skills Matrix: 4 Pillars -->
    <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 8px; margin-bottom: 10px;">
      <!-- Business & Operations -->
      <div class="card" style="padding: 8px 11px;">
        <span class="section-kicker">Pilar 1</span>
        <h4 style="font-size: 9.5pt; color: #1E351A; font-weight: 700; margin-bottom: 4px;">Business Strategy &amp; Operations</h4>
        <div>
          <span class="tag-item">Business Model Canvas (BMC)</span>
          <span class="tag-item">Standard Operating Procedure (SOP)</span>
          <span class="tag-item">Market Feasibility Study</span>
          <span class="tag-item">Cash &amp; Inventory Reconciliation</span>
          <span class="tag-item">B2B Event Partnership</span>
          <span class="tag-item">Competitive Market Research</span>
        </div>
      </div>

      <!-- Creative & Digital Marketing -->
      <div class="card" style="padding: 8px 11px;">
        <span class="section-kicker">Pilar 2</span>
        <h4 style="font-size: 9.5pt; color: #1E351A; font-weight: 700; margin-bottom: 4px;">Creative &amp; Digital Marketing</h4>
        <div>
          <span class="tag-item">Short-form Video (Reels/TikTok)</span>
          <span class="tag-item">CapCut &amp; Video Editing</span>
          <span class="tag-item">Product Photo Direction</span>
          <span class="tag-item">Content Storytelling &amp; Copywriting</span>
          <span class="tag-item">Social Media Calendar</span>
          <span class="tag-item">Organic Audience Engagement</span>
        </div>
      </div>

      <!-- IT & Information Systems -->
      <div class="card" style="padding: 8px 11px;">
        <span class="section-kicker">Pilar 3</span>
        <h4 style="font-size: 9.5pt; color: #1E351A; font-weight: 700; margin-bottom: 4px;">IT &amp; Systems Development</h4>
        <div>
          <span class="tag-item">UI/UX Prototyping (Figma)</span>
          <span class="tag-item">Database Management (SQL)</span>
          <span class="tag-item">Python Automation Scripts</span>
          <span class="tag-item">HTML &amp; CSS Fundamentals</span>
          <span class="tag-item">Usability Testing</span>
          <span class="tag-item">System Workflow Design</span>
        </div>
      </div>

      <!-- Personal Strengths & Leadership -->
      <div class="card" style="padding: 8px 11px;">
        <span class="section-kicker">Pilar 4</span>
        <h4 style="font-size: 9.5pt; color: #1E351A; font-weight: 700; margin-bottom: 4px;">Soft Skills &amp; Leadership</h4>
        <div>
          <span class="tag-item">High Ownership &amp; Accountability</span>
          <span class="tag-item">Persuasive Pitching &amp; Public Speaking</span>
          <span class="tag-item">Cross-Functional Team Collaboration</span>
          <span class="tag-item">Proactive Problem Solving</span>
          <span class="tag-item">Adaptive Learning Agility</span>
        </div>
      </div>
    </div>

    <!-- Certifications Section -->
    <div class="card" style="margin-bottom: 10px; padding: 9px 12px;">
      <span class="section-kicker">Sertifikasi &amp; Kursus Terakreditasi</span>
      <h3 style="font-size: 10.5pt; color: #1E351A; font-weight: 700; margin-bottom: 5px;">Professional Certifications</h3>
      <div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 7px;">
        <div style="background: #F4F7F2; border-radius: 6px; padding: 6px 8px; border: 1px solid #CAD7C5;">
          <div style="font-size: 8pt; font-weight: 700; color: #1E351A;">Intro to Digital Marketing</div>
          <div style="font-size: 7.2pt; color: #BD5871; font-weight: 600;">RevoU (2024)</div>
          <div style="font-size: 6.8pt; color: #556B4E; margin-top: 2px;">Social Media, Content Marketing &amp; Analytics</div>
        </div>
        <div style="background: #F4F7F2; border-radius: 6px; padding: 6px 8px; border: 1px solid #CAD7C5;">
          <div style="font-size: 8pt; font-weight: 700; color: #1E351A;">Official TOEIC Listening &amp; Reading</div>
          <div style="font-size: 7.2pt; color: #BD5871; font-weight: 600;">ETS TOEIC • Skor 775</div>
          <div style="font-size: 6.8pt; color: #556B4E; margin-top: 2px;">International Business Communication</div>
        </div>
        <div style="background: #F4F7F2; border-radius: 6px; padding: 6px 8px; border: 1px solid #CAD7C5;">
          <div style="font-size: 8pt; font-weight: 700; color: #1E351A;">Google Developer Student Clubs</div>
          <div style="font-size: 7.2pt; color: #BD5871; font-weight: 600;">GDSC Polinema Chapter</div>
          <div style="font-size: 6.8pt; color: #556B4E; margin-top: 2px;">Community Event &amp; Student Ambassador</div>
        </div>
      </div>
    </div>

    <!-- Leadership & Organization Experience -->
    <div class="card" style="flex: 1; display: flex; flex-direction: column; justify-content: space-between; padding: 9px 12px;">
      <div>
        <span class="section-kicker">Organisasi &amp; Kepanitiaan</span>
        <h3 style="font-size: 10.5pt; color: #1E351A; font-weight: 700; margin-bottom: 5px;">Leadership &amp; Community Experience</h3>
        <ul class="bullet-list" style="font-size: 7.8pt;">
          <li><strong>Google Developer Student Clubs (GDSC) Polinema:</strong> Berperan aktif dalam koordinasi workshop teknologi, menyelenggarakan seminar mahasiswa, dan membangun relasi komunitas developer kampus.</li>
          <li><strong>Koordinator Hubungan Masyarakat &amp; Sponsor Acara Kampus:</strong> Bertanggung jawab menyusun proposal sponsorship, menjalin kemitraan dengan sponsor eksternal, dan merancang materi publikasi acara.</li>
        </ul>
      </div>

      <!-- Final Statement & Verification Strip -->
      <div style="background: #E8EFE5; border-radius: 7px; padding: 8px 12px; margin-top: 6px; border: 1px solid #B8CBB4; display: flex; justify-content: space-between; align-items: center;">
        <div>
          <div style="font-size: 8.5pt; font-weight: 700; color: #1E351A;">Portofolio Digital Lengkap &amp; Verifikasi:</div>
          <div style="font-size: 7.2pt; color: #556B4E;">Kunjungi website interaktif: https://chikal-portfolio.vercel.app (WhatsApp: +62 812-3456-7890)</div>
        </div>
        <div style="text-align: right;">
          <span class="badge-pill badge-forest" style="font-size: 7.5pt;">Siap Ditempatkan / Segera</span>
        </div>
      </div>
    </div>

  </div>

  <!-- Footer -->
  <div class="footer-bar">
    <div>Chikal Nazmi Mahira • Competencies &amp; Credentials</div>
    <div>Halaman 5 dari 5</div>
  </div>
</div>

</body>
</html>
`;

async function generatePdf() {
  console.log('Launching Chrome from:', chromePath);
  const browser = await puppeteer.launch({
    executablePath: chromePath,
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-gpu']
  });

  const page = await browser.newPage();
  console.log('Setting content...');
  await page.setContent(htmlContent, { waitUntil: 'networkidle0' });

  console.log('Generating PDF to:', outputPath);
  await page.pdf({
    path: outputPath,
    format: 'A4',
    printBackground: true,
    margin: {
      top: '0mm',
      right: '0mm',
      bottom: '0mm',
      left: '0mm'
    }
  });

  const pages = await page.$$('.page');
  console.log(`Found ${pages.length} pages, capturing preview screenshots...`);
  const artifactDir = 'C:\\\\Users\\\\chika\\\\.gemini\\\\antigravity-ide\\\\brain\\\\04bee2b4-7039-42e7-8700-654125cb9e6d';
  for (let i = 0; i < pages.length; i++) {
    const previewPath = path.join(artifactDir, `pdf_preview_page_${i + 1}.png`);
    await pages[i].screenshot({ path: previewPath });
    console.log(`Saved preview: pdf_preview_page_${i + 1}.png to artifact dir`);
  }

  await browser.close();
  console.log('PDF generation complete! Saved to', outputPath);
}

generatePdf().catch(err => {
  console.error('Failed to generate PDF:', err);
  process.exit(1);
});
