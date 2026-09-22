# 📋 Product Requirements Document (PRD)
## Website Karang Taruna Tirtajaya 01

---

## 1. Ringkasan Proyek

| Aspek | Detail |
|-------|--------|
| **Nama Proyek** | Website Karang Taruna Tirtajaya 01 |
| **Tech Stack** | Next.js 15 (App Router), TypeScript, Tailwind CSS, Supabase (PostgreSQL + Auth + Storage) |
| **Tipe Aplikasi** | Web Application (Responsive: Mobile & Desktop) |
| **Target User** | Warga Dusun Tirtajaya (User Umum) & Pengurus Karang Taruna Tirtajaya 01 (Admin) |
| **Tema Visual** | Modern, dinamis, tidak monoton, dengan warna yang energik namun tetap profesional |

---

## 2. Fitur & Fungsionalitas

### 2.1 Halaman User (Publik)

| No | Fitur | Deskripsi |
|----|-------|-----------|
| 1 | **Beranda / Landing Page** | Hero section, ringkasan kegiatan terbaru, agenda mendatang, statistik singkat |
| 2 | **Kegiatan / Proker** | Galeri kegiatan yang telah dilaksanakan dengan foto dan deskripsi lengkap |
| 3 | **Agenda / Jadwal** | Kalender atau list agenda kegiatan (mendatang & yang sudah lewat) |
| 4 | **Struktur Organisasi** | Diagram/tampilan hierarki pengurus Karang Taruna beserta foto & jabatan |
| 5 | **Transparansi Keuangan** | Tabel/detail pemasukan & pengeluaran kas, saldo total, filter per periode |
| 6 | **Tentang Kami** | Profil Karang Taruna Tirtajaya 01, visi-misi, sejarah singkat |
| 7 | **Kontak** | Informasi kontak pengurus, lokasi (embed maps) |

### 2.2 Halaman Admin (Dashboard)

| No | Fitur | Deskripsi |
|----|-------|-----------|
| 1 | **Dashboard Overview** | Ringkasan statistik: jumlah kegiatan, total anggota, saldo kas, agenda mendatang |
| 2 | **Manajemen Kegiatan (CRUD)** | Tambah, edit, hapus kegiatan beserta upload foto multiple |
| 3 | **Manajemen Agenda (CRUD)** | Tambah, edit, hapus agenda/jadwal kegiatan |
| 4 | **Manajemen Struktur Organisasi (CRUD)** | Tambah, edit, hapus anggota pengurus beserta foto & jabatan |
| 5 | **Manajemen Keuangan (CRUD)** | Tambah, edit, hapus transaksi pemasukan & pengeluaran |
| 6 | **Manajemen Admin (Role)** | Tambah/hapus akun admin (untuk super admin) |
| 7 | **Pengaturan Website** | Edit profil Karang Taruna Tirtajaya 01, kontak, logo |

---

## 3. Struktur Database (Supabase / PostgreSQL)

### 3.1 Tabel: `profiles` (Profil Karang Taruna Tirtajaya 01)
```sql
CREATE TABLE profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  nama_organisasi VARCHAR(255) NOT NULL,
  nama_dusun VARCHAR(255) NOT NULL,
  desa VARCHAR(255) NOT NULL,
  kecamatan VARCHAR(255) NOT NULL,
  kabupaten VARCHAR(255) NOT NULL,
  provinsi VARCHAR(255) NOT NULL,
  visi TEXT,
  misi TEXT,
  sejarah TEXT,
  logo_url TEXT,
  email VARCHAR(255),
  telepon VARCHAR(50),
  alamat TEXT,
  maps_embed_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

### 3.2 Tabel: `admins` (Manajemen Admin)
```sql
CREATE TABLE admins (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  nama_lengkap VARCHAR(255) NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  role VARCHAR(50) DEFAULT 'admin' CHECK (role IN ('admin', 'super_admin')),
  foto_url TEXT,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

### 3.3 Tabel: `kegiatan` (Kegiatan / Proker)
```sql
CREATE TABLE kegiatan (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  judul VARCHAR(255) NOT NULL,
  slug VARCHAR(255) UNIQUE NOT NULL,
  deskripsi TEXT NOT NULL,
  tanggal_pelaksanaan DATE NOT NULL,
  lokasi VARCHAR(255),
  status VARCHAR(50) DEFAULT 'selesai' CHECK (status IN ('selesai', 'berlangsung', 'dibatalkan')),
  foto_cover TEXT,
  foto_galeri TEXT[], -- Array URL foto
  created_by UUID REFERENCES admins(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

### 3.4 Tabel: `agenda` (Agenda / Jadwal)
```sql
CREATE TABLE agenda (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  judul VARCHAR(255) NOT NULL,
  deskripsi TEXT,
  tanggal_mulai TIMESTAMP WITH TIME ZONE NOT NULL,
  tanggal_selesai TIMESTAMP WITH TIME ZONE,
  lokasi VARCHAR(255),
  status VARCHAR(50) DEFAULT 'akan_datang' CHECK (status IN ('akan_datang', 'sedang_berlangsung', 'selesai', 'dibatalkan')),
  kategori VARCHAR(100), -- rapat, kegiatan, gotong_royong, dll
  created_by UUID REFERENCES admins(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

### 3.5 Tabel: `struktur_organisasi` (Pengurus)
```sql
CREATE TABLE struktur_organisasi (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  nama_lengkap VARCHAR(255) NOT NULL,
  jabatan VARCHAR(255) NOT NULL,
  periode VARCHAR(50) NOT NULL, -- contoh: "2024-2026"
  foto_url TEXT,
  no_telepon VARCHAR(50),
  email VARCHAR(255),
  urutan INTEGER DEFAULT 0, -- Untuk mengatur urutan tampilan
  divisi VARCHAR(100), -- ketua, sekretaris, bendahara, divisi_acara, dll
  bio TEXT,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

### 3.6 Tabel: `keuangan` (Transaksi Kas)
```sql
CREATE TABLE keuangan (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tanggal DATE NOT NULL,
  tipe VARCHAR(20) NOT NULL CHECK (tipe IN ('pemasukan', 'pengeluaran')),
  kategori VARCHAR(100) NOT NULL, -- iuran_warga, sumbangan, belanja_kegiatan, operasional, dll
  jumlah DECIMAL(15, 2) NOT NULL,
  keterangan TEXT NOT NULL,
  bukti_url TEXT, -- Foto nota/bukti transaksi
  created_by UUID REFERENCES admins(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

### 3.7 Tabel: `kategori_keuangan` (Master Kategori)
```sql
CREATE TABLE kategori_keuangan (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  nama VARCHAR(100) NOT NULL,
  tipe VARCHAR(20) NOT NULL CHECK (tipe IN ('pemasukan', 'pengeluaran')),
  is_default BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

---

## 4. Row Level Security (RLS) Policies

```sql
-- Profiles: Public read, Admin write
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public can read profiles" ON profiles FOR SELECT USING (true);
CREATE POLICY "Admins can manage profiles" ON profiles FOR ALL USING (
  EXISTS (SELECT 1 FROM admins WHERE user_id = auth.uid())
);

-- Kegiatan: Public read, Admin write
ALTER TABLE kegiatan ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public can read kegiatan" ON kegiatan FOR SELECT USING (true);
CREATE POLICY "Admins can manage kegiatan" ON kegiatan FOR ALL USING (
  EXISTS (SELECT 1 FROM admins WHERE user_id = auth.uid())
);

-- Agenda: Public read, Admin write
ALTER TABLE agenda ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public can read agenda" ON agenda FOR SELECT USING (true);
CREATE POLICY "Admins can manage agenda" ON agenda FOR ALL USING (
  EXISTS (SELECT 1 FROM admins WHERE user_id = auth.uid())
);

-- Struktur Organisasi: Public read, Admin write
ALTER TABLE struktur_organisasi ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public can read struktur" ON struktur_organisasi FOR SELECT USING (true);
CREATE POLICY "Admins can manage struktur" ON struktur_organisasi FOR ALL USING (
  EXISTS (SELECT 1 FROM admins WHERE user_id = auth.uid())
);

-- Keuangan: Public read, Admin write
ALTER TABLE keuangan ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public can read keuangan" ON keuangan FOR SELECT USING (true);
CREATE POLICY "Admins can manage keuangan" ON keuangan FOR ALL USING (
  EXISTS (SELECT 1 FROM admins WHERE user_id = auth.uid())
);

-- Admins: Only super_admin can manage
ALTER TABLE admins ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Admins can read admins" ON admins FOR SELECT USING (
  EXISTS (SELECT 1 FROM admins WHERE user_id = auth.uid())
);
CREATE POLICY "Super admin can manage admins" ON admins FOR ALL USING (
  EXISTS (SELECT 1 FROM admins WHERE user_id = auth.uid() AND role = 'super_admin')
);
```

---

## 5. Arsitektur Aplikasi (Next.js App Router)

### 5.1 Struktur Folder

```
my-app/
├── app/
│   ├── (public)/                    # Route group untuk halaman publik
│   │   ├── page.tsx                 # Landing page
│   │   ├── kegiatan/
│   │   │   ├── page.tsx             # List kegiatan
│   │   │   └── [slug]/
│   │   │       └── page.tsx         # Detail kegiatan
│   │   ├── agenda/
│   │   │   └── page.tsx             # List agenda
│   │   ├── struktur/
│   │   │   └── page.tsx             # Struktur organisasi
│   │   ├── keuangan/
│   │   │   └── page.tsx             # Transparansi keuangan
│   │   ├── tentang/
│   │   │   └── page.tsx             # Tentang kami
│   │   ├── kontak/
│   │   │   └── page.tsx             # Kontak
│   │   └── layout.tsx               # Layout publik (navbar, footer)
│   │
│   ├── (admin)/                     # Route group untuk admin
│   │   ├── login/
│   │   │   └── page.tsx             # Halaman login admin
│   │   ├── dashboard/
│   │   │   ├── page.tsx             # Dashboard overview
│   │   │   ├── kegiatan/
│   │   │   │   ├── page.tsx         # List & CRUD kegiatan
│   │   │   │   └── [id]/
│   │   │   │       └── page.tsx     # Edit kegiatan
│   │   │   ├── agenda/
│   │   │   │   ├── page.tsx         # List & CRUD agenda
│   │   │   │   └── [id]/
│   │   │   │       └── page.tsx     # Edit agenda
│   │   │   ├── struktur/
│   │   │   │   ├── page.tsx         # List & CRUD struktur
│   │   │   │   └── [id]/
│   │   │   │       └── page.tsx     # Edit struktur
│   │   │   ├── keuangan/
│   │   │   │   ├── page.tsx         # List & CRUD keuangan
│   │   │   │   └── [id]/
│   │   │   │       └── page.tsx     # Edit transaksi
│   │   │   ├── pengaturan/
│   │   │   │   └── page.tsx         # Pengaturan website
│   │   │   ├── admin/
│   │   │   │   └── page.tsx         # Manajemen admin (super_admin only)
│   │   │   └── layout.tsx           # Layout admin (sidebar, header)
│   │
│   ├── api/                         # API Routes (jika diperlukan)
│   ├── layout.tsx                   # Root layout
│   └── globals.css                  # Global styles
│
├── components/
│   ├── ui/                          # Komponen UI reusable (shadcn/ui)
│   ├── public/                      # Komponen khusus halaman publik
│   │   ├── Navbar.tsx
│   │   ├── Footer.tsx
│   │   ├── HeroSection.tsx
│   │   ├── KegiatanCard.tsx
│   │   ├── AgendaCard.tsx
│   │   ├── StrukturCard.tsx
│   │   └── KeuanganTable.tsx
│   └── admin/                       # Komponen khusus halaman admin
│       ├── Sidebar.tsx
│       ├── Header.tsx
│       ├── StatCard.tsx
│       ├── DataTable.tsx
│       └── ImageUploader.tsx
│
├── lib/
│   ├── supabase/
│   │   ├── client.ts                # Supabase client (browser)
│   │   └── server.ts                # Supabase client (server)
│   ├── utils.ts                     # Utility functions
│   └── constants.ts                 # Konstanta aplikasi
│
├── hooks/
│   ├── useAuth.ts                   # Hook autentikasi
│   └── useSupabase.ts               # Hook Supabase queries
│
├── types/
│   └── database.ts                  # TypeScript types dari database
│
├── public/
│   └── images/                      # Asset statis
│
├── next.config.js
├── tailwind.config.ts
├── tsconfig.json
└── package.json
```

---

## 6. Tech Stack Detail

| Layer | Teknologi | Fungsi |
|-------|-----------|--------|
| **Framework** | Next.js 15 (App Router) | SSR, SSG, routing, API |
| **Language** | TypeScript | Type safety |
| **Styling** | Tailwind CSS | Utility-first CSS |
| **UI Components** | shadcn/ui | Komponen UI modern |
| **Database** | Supabase (PostgreSQL) | Database, Auth, Storage |
| **Auth** | Supabase Auth | Autentikasi admin |
| **Storage** | Supabase Storage | Upload foto |
| **Icons** | Lucide React | Icon set |
| **Form** | React Hook Form + Zod | Form handling & validasi |
| **Date** | date-fns | Manipulasi tanggal |
| **Animation** | Framer Motion | Animasi halaman |
| **Charts** | Recharts | Grafik di dashboard admin |

---

## 7. Desain UI/UX Guidelines

### 7.1 Color Palette (Tema Modern & Dinamis)

```
Primary:    #0EA5E9  (Sky Blue - Energik & Fresh)
Secondary:  #6366F1  (Indigo - Profesional)
Accent:     #F59E0B  (Amber - Warmth & Attention)
Success:    #10B981  (Emerald - Positif)
Danger:     #EF4444  (Red - Alert)
Warning:    #F97316  (Orange - Warning)

Background: #F8FAFC  (Slate-50 - Clean)
Surface:    #FFFFFF  (White)
Text:       #1E293B  (Slate-800 - Readable)
Text Muted: #64748B  (Slate-500)
Border:     #E2E8F0  (Slate-200)
```

### 7.2 Typography

```
Heading:   Inter / Poppins (Bold, Modern)
Body:      Inter (Clean, Readable)
Accent:    Poppins (Untuk highlight/quote)
```

### 7.3 Design Principles

1. **Card-based Layout** - Gunakan card untuk setiap item (kegiatan, agenda, pengurus)
2. **Glassmorphism** - Efek glass pada navbar dan overlay
3. **Micro-interactions** - Hover effects, smooth transitions
4. **Mobile-first** - Desain dimulai dari mobile, scale ke desktop
5. **Whitespace** - Jarak yang cukup untuk kenyamanan membaca
6. **Gradient Accents** - Gradient subtle pada hero dan CTA buttons
7. **Rounded Corners** - `rounded-xl` / `rounded-2xl` untuk modern feel

### 7.4 Responsive Breakpoints

```
Mobile:   < 640px   (sm)
Tablet:   640px - 1024px (md, lg)
Desktop:  > 1024px  (xl, 2xl)
```

---

## 8. Server Actions (Next.js)

### 8.1 Kegiatan Actions
```typescript
// app/actions/kegiatan.ts
'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'

export async function getKegiatan() { ... }
export async function getKegiatanBySlug(slug: string) { ... }
export async function createKegiatan(formData: FormData) { ... }
export async function updateKegiatan(id: string, formData: FormData) { ... }
export async function deleteKegiatan(id: string) { ... }
```

### 8.2 Agenda Actions
```typescript
// app/actions/agenda.ts
export async function getAgenda(filters?: { status?: string }) { ... }
export async function createAgenda(formData: FormData) { ... }
export async function updateAgenda(id: string, formData: FormData) { ... }
export async function deleteAgenda(id: string) { ... }
```

### 8.3 Struktur Actions
```typescript
// app/actions/struktur.ts
export async function getStruktur() { ... }
export async function createStruktur(formData: FormData) { ... }
export async function updateStruktur(id: string, formData: FormData) { ... }
export async function deleteStruktur(id: string) { ... }
```

### 8.4 Keuangan Actions
```typescript
// app/actions/keuangan.ts
export async function getKeuangan(filters?: { tipe?: string, periode?: string }) { ... }
export async function getSaldo() { ... }
export async function createTransaksi(formData: FormData) { ... }
export async function updateTransaksi(id: string, formData: FormData) { ... }
export async function deleteTransaksi(id: string) { ... }
```

---

## 9. Autentikasi & Otorisasi

### 9.1 Flow Autentikasi

```
1. Admin mengakses /login
2. Input email & password
3. Supabase Auth melakukan verifikasi
4. Cek apakah user ada di tabel admins
5. Jika valid, redirect ke /dashboard
6. Jika tidak valid, tampilkan error
```

### 9.2 Middleware (Auth Guard)

```typescript
// middleware.ts
import { createMiddlewareClient } from '@supabase/auth-helpers-nextjs'
import { NextResponse } from 'next/server'

export async function middleware(req) {
  const res = NextResponse.next()
  const supabase = createMiddlewareClient({ req, res })

  const { data: { session } } = await supabase.auth.getSession()

  // Protect admin routes
  if (req.nextUrl.pathname.startsWith('/dashboard')) {
    if (!session) {
      return NextResponse.redirect(new URL('/login', req.url))
    }

    // Cek apakah user adalah admin
    const { data: admin } = await supabase
      .from('admins')
      .select('*')
      .eq('user_id', session.user.id)
      .single()

    if (!admin) {
      return NextResponse.redirect(new URL('/', req.url))
    }
  }

  return res
}
```

---

## 10. Storage (Supabase Storage)

### 10.1 Bucket Structure

```
kegiatan/           # Foto kegiatan
  ├── covers/       # Foto cover kegiatan
  └── galeri/       # Foto galeri kegiatan

struktur/           # Foto pengurus
  ├── ketua/
  ├── anggota/
  └── ...

keuangan/           # Bukti transaksi
  ├── pemasukan/
  └── pengeluaran/

profiles/           # Logo & asset organisasi
```

### 10.2 Storage Policies

```sql
-- Public read untuk semua bucket
CREATE POLICY "Public read" ON storage.objects FOR SELECT USING (true);

-- Admin write untuk semua bucket
CREATE POLICY "Admin write" ON storage.objects FOR INSERT USING (
  EXISTS (SELECT 1 FROM admins WHERE user_id = auth.uid())
);
```

---

## 11. Halaman Publik - Wireframe Detail

### 11.1 Landing Page
```
┌─────────────────────────────────────────┐
│  [Navbar: Logo | Menu | Mobile Toggle]  │
├─────────────────────────────────────────┤
│                                         │
│  [Hero Section]                         │
│  - Gradient background                  │
│  - Headline: "Karang Taruna Tirtajaya 01" │
│  - CTA Button                           │
│                                         │
├─────────────────────────────────────────┤
│  [Stats Section]                        │
│  - Total Kegiatan | Anggota | Saldo     │
│  - Animated counters                    │
├─────────────────────────────────────────┤
│  [Kegiatan Terbaru]                     │
│  - 3-4 Card kegiatan terbaru            │
│  - "Lihat Semua" link                   │
├─────────────────────────────────────────┤
│  [Agenda Mendatang]                     │
│  - Timeline/list agenda                 │
│  - Badge status                         │
├─────────────────────────────────────────┤
│  [Struktur Organisasi Karang Taruna Tirtajaya 01] │
│  - Foto ketua + ringkasan               │
│  - "Lihat Struktur Lengkap"             │
├─────────────────────────────────────────┤
│  [Footer]                               │
│  - Info kontak Karang Taruna Tirtajaya 01, sosial media, copyright │
└─────────────────────────────────────────┘
```

### 11.2 Halaman Kegiatan
```
┌─────────────────────────────────────────┐
│  [Page Header]                          │
│  "Kegiatan & Program Kerja Karang Taruna Tirtajaya 01" │
│  [Filter: Semua | 2024 | 2025 | ...]    │
├─────────────────────────────────────────┤
│  [Grid Kegiatan Cards]                  │
│  ┌────────┐ ┌────────┐ ┌────────┐      │
│  │  Foto  │ │  Foto  │ │  Foto  │      │
│  │ Judul  │ │ Judul  │ │ Judul  │      │
│  │ Tgl    │ │ Tgl    │ │ Tgl    │      │
│  │ Desk   │ │ Desk   │ │ Desk   │      │
│  └────────┘ └────────┘ └────────┘      │
│  (Responsive: 1 col mobile, 3 col desktop)
└─────────────────────────────────────────┘
```

### 11.3 Halaman Keuangan (Transparansi)
```
┌─────────────────────────────────────────┐
│  [Page Header] "Transparansi Keuangan Karang Taruna Tirtajaya 01" │
│                                         │
│  [Summary Cards]                        │
│  ┌────────────┐ ┌────────────┐         │
│  │ Total Masuk│ │ Total Keluar│        │
│  │ Rp 5.000.000│ │ Rp 2.000.000│       │
│  └────────────┘ └────────────┘         │
│  ┌────────────────────┐                │
│  │ Saldo: Rp 3.000.000│                │
│  └────────────────────┘                │
│                                         │
│  [Filter: Periode | Tipe]               │
│                                         │
│  [Tabel Transaksi]                      │
│  No | Tanggal | Keterangan | Tipe | Jumlah
│  1  | 01/01   | Iuran warga | +    | 50K  │
│  2  | 05/01   | Belanja     | -    | 30K  │
│  ...                                    │
└─────────────────────────────────────────┘
```

---

## 12. Halaman Admin - Wireframe Detail

### 12.1 Dashboard
```
┌─────────────────────────────────────────────────────────┐
│ [Header: Search | Notifications | Profile Dropdown]     │
├────────────────┬────────────────────────────────────────┤
│                │                                        │
│  [Sidebar]     │  [Dashboard Content]                   │
│  - Dashboard   │                                        │
│  - Kegiatan    │  [Stat Cards Row]                      │
│  - Agenda      │  ┌────┐ ┌────┐ ┌────┐ ┌────┐          │
│  - Struktur    │  │Keg │ │Agd │ │Ang │ │Sal │          │
│  - Keuangan    │  └────┘ └────┘ └────┘ └────┘          │
│  - Pengaturan  │                                        │
│  - Logout      │  [Chart: Keuangan Bulanan]             │
│                │                                        │
│                │  [Recent Activities Table]             │
│                │                                        │
│                │  [Upcoming Agenda]                     │
│                │                                        │
└────────────────┴────────────────────────────────────────┘
```

### 12.2 CRUD Kegiatan (Admin)
```
┌─────────────────────────────────────────────────────────┐
│  [Header: "Manajemen Kegiatan - Karang Taruna Tirtajaya 01"] │
│  [Button: "+ Tambah Kegiatan"]                          │
├─────────────────────────────────────────────────────────┤
│  [Search + Filter]                                      │
│  [DataTable]                                            │
│  ┌────┬──────────┬──────────┬────────┬────────┐        │
│  │ No │ Judul    │ Tanggal  │ Status │ Aksi   │        │
│  ├────┼──────────┼──────────┼────────┼────────┤        │
│  │ 1  │ Gotong.. │ 01/01/25 │ Selesai│ ✏️ 🗑️ │        │
│  │ 2  │ Lomba 17 │ 17/08/25 │ Akan.. │ ✏️ 🗑️ │        │
│  └────┴──────────┴──────────┴────────┴────────┘        │
│  [Pagination]                                           │
└─────────────────────────────────────────────────────────┘
```

---

## 13. API Endpoints Summary

| Method | Endpoint | Auth | Deskripsi |
|--------|----------|------|-----------|
| GET | /api/kegiatan | No | List kegiatan |
| GET | /api/kegiatan/:slug | No | Detail kegiatan |
| POST | /api/kegiatan | Yes | Tambah kegiatan |
| PUT | /api/kegiatan/:id | Yes | Update kegiatan |
| DELETE | /api/kegiatan/:id | Yes | Hapus kegiatan |
| GET | /api/agenda | No | List agenda |
| POST | /api/agenda | Yes | Tambah agenda |
| PUT | /api/agenda/:id | Yes | Update agenda |
| DELETE | /api/agenda/:id | Yes | Hapus agenda |
| GET | /api/struktur | No | List struktur |
| POST | /api/struktur | Yes | Tambah struktur |
| PUT | /api/struktur/:id | Yes | Update struktur |
| DELETE | /api/struktur/:id | Yes | Hapus struktur |
| GET | /api/keuangan | No | List transaksi |
| GET | /api/keuangan/saldo | No | Get saldo |
| POST | /api/keuangan | Yes | Tambah transaksi |
| PUT | /api/keuangan/:id | Yes | Update transaksi |
| DELETE | /api/keuangan/:id | Yes | Hapus transaksi |

---

## 14. Timeline Pengembangan (Estimasi)

| Fase | Durasi | Deliverable |
|------|--------|-------------|
| **Fase 1: Setup** | 2 hari | Project init, Supabase setup, auth, database schema |
| **Fase 2: Public Pages** | 5 hari | Landing, Kegiatan, Agenda, Struktur, Keuangan, Tentang, Kontak |
| **Fase 3: Admin Dashboard** | 5 hari | Login, Dashboard, CRUD Kegiatan, CRUD Agenda, CRUD Struktur |
| **Fase 4: Admin Keuangan** | 3 hari | CRUD Keuangan, statistik, filter, export |
| **Fase 5: Polish** | 3 hari | Responsive, animation, testing, bug fix, deploy |
| **Total** | **~18 hari** | |

---

## 15. Checklist Pre-Development

- [ ] Setup project Next.js + TypeScript + Tailwind
- [ ] Install shadcn/ui components
- [ ] Setup Supabase project
- [ ] Buat database schema & RLS policies
- [ ] Setup Supabase Auth
- [ ] Setup Supabase Storage buckets
- [ ] Konfigurasi environment variables
- [ ] Setup middleware autentikasi
- [ ] Generate TypeScript types dari database
- [ ] Setup folder structure

---

## 16. Environment Variables

```env
# .env.local
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key

# Optional
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

---

*Dokumen ini dibuat sebagai panduan lengkap pengembangan Website Karang Taruna Dusun. Semua spesifikasi dapat disesuaikan sesuai kebutuhan selama proses development.*

**Versi:** 1.0  
**Tanggal:** 8 September 2026
