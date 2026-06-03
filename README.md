# 🔥 BurnoutGuard

> **Capstone Project — Coding Camp powered by DBS Foundation 2026**

BurnoutGuard adalah aplikasi web berbasis kecerdasan buatan yang dirancang untuk membantu mahasiswa mendeteksi risiko *burnout* secara dini. Dengan menganalisis berbagai faktor akademik dan gaya hidup, BurnoutGuard memberikan prediksi tingkat burnout beserta rekomendasi yang dapat ditindaklanjuti.

---

## 📋 Daftar Isi

- [Deskripsi Proyek](#-deskripsi-proyek)
- [Fitur Utama](#-fitur-utama)
- [Teknologi yang Digunakan](#-teknologi-yang-digunakan)
- [Arsitektur Sistem](#-arsitektur-sistem)
- [Petunjuk Setup Environment](#-petunjuk-setup-environment)
- [Cara Menjalankan Aplikasi](#-cara-menjalankan-aplikasi)
- [Tautan Model ML](#-tautan-model-ml)
- [Struktur Folder](#-struktur-folder)
- [Tim Pengembang](#-tim-pengembang)

---

## 📖 Deskripsi Proyek

Burnout akademik merupakan masalah serius yang banyak dialami mahasiswa, namun sering tidak disadari hingga kondisinya sudah parah. BurnoutGuard hadir sebagai solusi preventif dengan memanfaatkan model *Machine Learning* untuk menganalisis pola perilaku dan beban akademik mahasiswa.

Pengguna cukup mengisi kuesioner singkat mengenai jam belajar, kehadiran, tekanan akademik, pola tidur, dan faktor lainnya. Sistem kemudian memproses data tersebut melalui API prediksi berbasis ML dan menampilkan skor burnout, kategori risiko, serta saran konkret untuk menjaga keseimbangan hidup-studi.

**Masalah yang diselesaikan:**
- Mahasiswa sulit mengenali tanda-tanda awal burnout secara objektif
- Tidak ada alat yang mudah diakses untuk asesmen burnout secara mandiri
- Minimnya panduan personal berbasis data untuk manajemen stres akademik

---

## ✨ Fitur Utama

- **Prediksi Burnout Berbasis AI** — Model ML menganalisis 11+ parameter untuk menghasilkan skor risiko burnout yang akurat
- **Dashboard Personal** — Visualisasi riwayat prediksi dan tren kondisi pengguna dari waktu ke waktu
- **Autentikasi Aman** — Sistem login, registrasi, dan lupa password dengan Supabase Auth
- **Halaman About** — Informasi edukasi tentang burnout dan cara pencegahannya
- **Antarmuka Responsif** — Desain mobile-first yang nyaman digunakan di perangkat apa pun
- **Proteksi Rute** — Middleware otomatis melindungi halaman dashboard dari akses tanpa autentikasi

---

## 🛠 Teknologi yang Digunakan

### Frontend
| Teknologi | Versi | Keterangan |
|-----------|-------|------------|
| Next.js | 15.x | Framework React dengan App Router |
| React | 19.x | Library UI |
| TypeScript | 5.x | Type-safe JavaScript |
| Tailwind CSS | 4.x | Utility-first CSS framework |
| shadcn/ui | Latest | Komponen UI berbasis Radix |
| Framer Motion | Latest | Animasi UI |
| Recharts | Latest | Visualisasi data/grafik |
| React Hook Form + Zod | Latest | Manajemen dan validasi form |

### Backend & Database
| Teknologi | Keterangan |
|-----------|------------|
| Supabase | Backend-as-a-Service: Auth, Database (PostgreSQL), Storage |
| Next.js API Routes | Server-side API endpoint untuk proxy prediksi ML |

### Machine Learning
| Teknologi | Keterangan |
|-----------|------------|
| Python (FastAPI) | Server API model ML |
| Hugging Face Spaces | Hosting model dan API prediksi |

### Deployment
| Platform | Keterangan |
|----------|------------|
| Vercel | Hosting aplikasi Next.js |
| Hugging Face Spaces | Hosting API ML |
| Supabase | Database dan autentikasi cloud |

---

## 🏗 Arsitektur Sistem

```
┌──────────────────────────────────────────────────────────┐
│                    CLIENT (Browser)                      │
│              Next.js App (Vercel)                        │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌─────────┐ │
│  │  Landing │  │  Login/  │  │Dashboard │  │ Predict │ │
│  │  Page    │  │ Register │  │          │  │  Form   │ │
│  └──────────┘  └──────────┘  └──────────┘  └────┬────┘ │
└───────────────────────────────────────────────────┼──────┘
                                                    │ POST /api/predict
                                           ┌────────▼────────┐
                                           │  Next.js API    │
                                           │  Route (Proxy)  │
                                           └────────┬────────┘
                          ┌─────────────────────────┼──────────────────────┐
                          │                         │                      │
               ┌──────────▼──────────┐   ┌──────────▼──────────┐          │
               │   Supabase Auth     │   │  Hugging Face API   │          │
               │   (Login/Session)   │   │  (ML Prediction)    │          │
               └──────────┬──────────┘   └─────────────────────┘          │
                          │                                                │
               ┌──────────▼──────────┐                                    │
               │  Supabase Database  │◄───────────────────────────────────┘
               │  (Riwayat Prediksi) │     (Simpan hasil prediksi)
               └─────────────────────┘
```

---

## ⚙️ Petunjuk Setup Environment

### Prasyarat

Pastikan perangkat Anda telah menginstal:
- **Node.js** versi 18.x atau lebih baru ([unduh di nodejs.org](https://nodejs.org))
- **npm** versi 9.x atau lebih baru (sudah termasuk dalam instalasi Node.js)
- Akun **Supabase** ([daftar gratis di supabase.com](https://supabase.com))

### Langkah 1: Clone atau Ekstrak Proyek

```bash
# Jika menggunakan Git
git clone <url-repository>
cd burnoutguard-projek

# Atau ekstrak dari file ZIP
unzip burnoutguard-projek.zip
cd burnoutguard-projek
```

### Langkah 2: Install Dependensi

```bash
npm install
```

### Langkah 3: Konfigurasi Supabase

1. Login ke [supabase.com](https://supabase.com) dan buat project baru
2. Buka **Project Settings** → **API**
3. Salin nilai **Project URL** dan **anon/public key**
4. Buka **Project Settings** → **API** → salin juga **service_role key**

> ⚠️ **Perhatian:** `service_role` key bersifat rahasia. Jangan pernah menyertakannya dalam kode yang dipublikasikan atau di sisi client.

### Langkah 4: Konfigurasi Environment Variables

Buat file `.env.local` di root proyek:

```bash
cp .env.example .env.local
```

Kemudian isi file `.env.local` dengan nilai yang sesuai:

```dotenv
NEXT_PUBLIC_SUPABASE_URL=https://xxxxxxxxxxxxxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6...
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6...
BURNOUT_API_URL=https://your-space.hf.space
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

### Langkah 5: Setup Database Supabase

Di **Supabase Dashboard → SQL Editor**, jalankan query berikut untuk membuat tabel riwayat prediksi:

```sql
-- Tabel untuk menyimpan riwayat prediksi burnout
CREATE TABLE predictions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  score NUMERIC,
  risk_level TEXT,
  input_data JSONB,
  result_data JSONB
);

-- Row Level Security: pengguna hanya bisa akses data miliknya sendiri
ALTER TABLE predictions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own predictions"
  ON predictions FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own predictions"
  ON predictions FOR INSERT
  WITH CHECK (auth.uid() = user_id);
```

---

## 🚀 Cara Menjalankan Aplikasi

### Mode Development (Lokal)

```bash
npm run dev
```

Buka [http://localhost:3000](http://localhost:3000) di browser Anda.

### Mode Production (Build)

```bash
# Build aplikasi untuk produksi
npm run build

# Jalankan server produksi
npm run start
```

### Linting

```bash
npm run lint
```

### Rute Aplikasi

| Rute | Akses | Deskripsi |
|------|-------|-----------|
| `/` | Publik | Halaman landing |
| `/about` | Publik | Informasi tentang burnout |
| `/login` | Publik | Halaman login |
| `/register` | Publik | Halaman registrasi |
| `/forgot-password` | Publik | Reset password |
| `/dashboard` | 🔒 Login | Dashboard & riwayat prediksi |
| `/predict` | 🔒 Login | Form prediksi burnout |
| `/settings` | 🔒 Login | Pengaturan akun |

> 🔒 Rute yang memerlukan autentikasi akan otomatis mengarahkan ke `/login` jika pengguna belum masuk.

---

## 🤖 Tautan Model ML

Model Machine Learning yang digunakan dalam proyek ini dihosting di Hugging Face Spaces:

- **API Endpoint:** [https://dielnich-burnoutguard-api.hf.space](https://dielnich-burnoutguard-api.hf.space)
- **Dokumentasi API:** [https://dielnich-burnoutguard-api.hf.space/docs](https://dielnich-burnoutguard-api.hf.space/docs)

### Input Parameter Model

Model menerima parameter berikut melalui endpoint `POST /predict`:

| Parameter | Tipe | Deskripsi |
|-----------|------|-----------|
| `Age` | Integer | Usia mahasiswa |
| `Study_Hours` | Float | Jam belajar per hari |
| `Class_Attendance` | Float | Persentase kehadiran kuliah |
| `Exam_Frequency` | Integer | Frekuensi ujian per bulan |
| `Assignment_Load` | Integer | Jumlah tugas per minggu |
| `Sleep_Hours` | Float | Jam tidur per malam |
| `Social_Media_Use` | Float | Jam penggunaan media sosial per hari |
| `Screen_Time` | Float | Total waktu layar per hari |
| `Peer_Pressure` | Integer | Tingkat tekanan dari rekan (1-10) |
| `Family_Support` | Integer | Tingkat dukungan keluarga (1-10) |
| `Anxiety_Level` | Integer | Tingkat kecemasan (1-10) |

---

## 📁 Struktur Folder

```
burnoutguard-projek/
├── src/
│   ├── app/                          # Next.js App Router
│   │   ├── (protected)/              # Rute yang memerlukan autentikasi
│   │   │   ├── dashboard/page.tsx    # Halaman dashboard
│   │   │   ├── predict/page.tsx      # Form prediksi burnout
│   │   │   ├── settings/page.tsx     # Pengaturan akun
│   │   │   └── layout.tsx            # Layout untuk rute terproteksi
│   │   ├── api/
│   │   │   └── predict/route.ts      # API proxy ke model ML
│   │   ├── about/page.tsx            # Halaman about
│   │   ├── login/page.tsx            # Halaman login
│   │   ├── register/page.tsx         # Halaman registrasi
│   │   ├── forgot-password/page.tsx  # Reset password
│   │   ├── page.tsx                  # Halaman landing
│   │   ├── layout.tsx                # Root layout
│   │   └── globals.css               # Global styles
│   ├── components/
│   │   ├── layout/                   # Komponen layout (Topbar, Sidebar, dll)
│   │   ├── ui/                       # Komponen UI shadcn/ui
│   │   └── visual/                   # Komponen visual (ilustrasi, ikon)
│   ├── hooks/                        # Custom React hooks
│   └── lib/                          # Utilitas dan konfigurasi
│       ├── supabase.ts               # Supabase client (browser)
│       ├── supabase-server.ts        # Supabase client (server)
│       └── utils.ts                  # Fungsi utilitas umum
├── public/                           # Aset statis
├── middleware.ts                     # Middleware autentikasi rute
├── package.json                      # Dependensi proyek
├── tsconfig.json                     # Konfigurasi TypeScript
├── next.config.ts                    # Konfigurasi Next.js
├── postcss.config.mjs                # Konfigurasi PostCSS
├── eslint.config.mjs                 # Konfigurasi ESLint
├── .gitignore                        # File yang dikecualikan dari Git
├── .env.example                      # Template environment variables
└── README.md                         # Dokumentasi proyek (file ini)
```

---

## 👥 Tim Pengembang

Proyek ini dikembangkan sebagai bagian dari **Coding Camp powered by DBS Foundation 2026**.

Fullstack Developer
- Andi Muh. Daffa' Dermawan
- Nur Fadhilah Amaliah

---

## 📄 Lisensi

Proyek ini dibuat untuk keperluan pendidikan dalam rangka Capstone Project Coding Camp powered by DBS Foundation 2026.

---

<div align="center">
  <p>Dibuat untuk Capstone Project Coding Camp × DBS Foundation 2026</p>
  <p>🌐 <a href="https://burnoutguard.vercel.app">burnoutguard.vercel.app</a></p>
</div>
