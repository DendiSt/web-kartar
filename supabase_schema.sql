-- ==========================================
-- 1. EXTENSIONS
-- ==========================================
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ==========================================
-- 2. CREATE TABLES
-- ==========================================

-- 2.1 Profiles (Profil Karang Taruna)
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

-- 2.2 Admins (Manajemen Admin)
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

-- 2.3 Kegiatan (Kegiatan / Proker)
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

-- 2.4 Agenda (Agenda / Jadwal)
CREATE TABLE agenda (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  judul VARCHAR(255) NOT NULL,
  deskripsi TEXT,
  tanggal_mulai TIMESTAMP WITH TIME ZONE NOT NULL,
  tanggal_selesai TIMESTAMP WITH TIME ZONE,
  lokasi VARCHAR(255),
  status VARCHAR(50) DEFAULT 'akan_datang' CHECK (status IN ('akan_datang', 'sedang_berlangsung', 'selesai', 'dibatalkan')),
  kategori VARCHAR(100),
  created_by UUID REFERENCES admins(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2.5 Struktur Organisasi (Pengurus)
CREATE TABLE struktur_organisasi (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  nama_lengkap VARCHAR(255) NOT NULL,
  jabatan VARCHAR(255) NOT NULL,
  periode VARCHAR(50) NOT NULL,
  foto_url TEXT,
  no_telepon VARCHAR(50),
  email VARCHAR(255),
  urutan INTEGER DEFAULT 0,
  divisi VARCHAR(100),
  bio TEXT,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2.6 Keuangan (Transaksi Kas)
CREATE TABLE keuangan (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tanggal DATE NOT NULL,
  tipe VARCHAR(20) NOT NULL CHECK (tipe IN ('pemasukan', 'pengeluaran')),
  kategori VARCHAR(100) NOT NULL,
  jumlah DECIMAL(15, 2) NOT NULL,
  keterangan TEXT NOT NULL,
  bukti_url TEXT,
  created_by UUID REFERENCES admins(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2.7 Kategori Keuangan (Master Kategori)
CREATE TABLE kategori_keuangan (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  nama VARCHAR(100) NOT NULL,
  tipe VARCHAR(20) NOT NULL CHECK (tipe IN ('pemasukan', 'pengeluaran')),
  is_default BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ==========================================
-- 3. ROW LEVEL SECURITY (RLS) POLICIES
-- ==========================================

-- Profiles
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public can read profiles" ON profiles FOR SELECT USING (true);
CREATE POLICY "Admins can manage profiles" ON profiles FOR ALL USING (
  EXISTS (SELECT 1 FROM admins WHERE user_id = auth.uid())
);

-- Kegiatan
ALTER TABLE kegiatan ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public can read kegiatan" ON kegiatan FOR SELECT USING (true);
CREATE POLICY "Admins can manage kegiatan" ON kegiatan FOR ALL USING (
  EXISTS (SELECT 1 FROM admins WHERE user_id = auth.uid())
);

-- Agenda
ALTER TABLE agenda ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public can read agenda" ON agenda FOR SELECT USING (true);
CREATE POLICY "Admins can manage agenda" ON agenda FOR ALL USING (
  EXISTS (SELECT 1 FROM admins WHERE user_id = auth.uid())
);

-- Struktur Organisasi
ALTER TABLE struktur_organisasi ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public can read struktur" ON struktur_organisasi FOR SELECT USING (true);
CREATE POLICY "Admins can manage struktur" ON struktur_organisasi FOR ALL USING (
  EXISTS (SELECT 1 FROM admins WHERE user_id = auth.uid())
);

-- Keuangan
ALTER TABLE keuangan ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public can read keuangan" ON keuangan FOR SELECT USING (true);
CREATE POLICY "Admins can manage keuangan" ON keuangan FOR ALL USING (
  EXISTS (SELECT 1 FROM admins WHERE user_id = auth.uid())
);

-- Kategori Keuangan
ALTER TABLE kategori_keuangan ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public can read kategori_keuangan" ON kategori_keuangan FOR SELECT USING (true);
CREATE POLICY "Admins can manage kategori_keuangan" ON kategori_keuangan FOR ALL USING (
  EXISTS (SELECT 1 FROM admins WHERE user_id = auth.uid())
);

-- Admins
ALTER TABLE admins ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Admins can read admins" ON admins FOR SELECT USING (
  EXISTS (SELECT 1 FROM admins WHERE user_id = auth.uid())
);
CREATE POLICY "Super admin can manage admins" ON admins FOR ALL USING (
  EXISTS (SELECT 1 FROM admins WHERE user_id = auth.uid() AND role = 'super_admin')
);

-- ==========================================
-- 4. STORAGE BUCKETS & POLICIES
-- ==========================================
-- Membuat buckets (kegiatan, struktur, keuangan, profiles) jika belum ada
INSERT INTO storage.buckets (id, name, public) VALUES 
('kegiatan', 'kegiatan', true),
('struktur', 'struktur', true),
('keuangan', 'keuangan', true),
('profiles', 'profiles', true)
ON CONFLICT (id) DO NOTHING;

-- Storage Policies (menggunakan schema auth.uid() pada table storage.objects)
CREATE POLICY "Public read for all buckets" ON storage.objects FOR SELECT USING (true);

CREATE POLICY "Admin write for all buckets" ON storage.objects FOR INSERT WITH CHECK (
  EXISTS (SELECT 1 FROM public.admins WHERE user_id = auth.uid())
);

CREATE POLICY "Admin update for all buckets" ON storage.objects FOR UPDATE USING (
  EXISTS (SELECT 1 FROM public.admins WHERE user_id = auth.uid())
);

CREATE POLICY "Admin delete for all buckets" ON storage.objects FOR DELETE USING (
  EXISTS (SELECT 1 FROM public.admins WHERE user_id = auth.uid())
);
