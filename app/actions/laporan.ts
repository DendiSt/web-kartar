'use server'

import { prisma } from '@/lib/prisma'
import type { Prisma, Keuangan, Kegiatan, Anggota } from '@prisma/client'

export interface LaporanKeuanganResult {
  items: {
    id: string
    tanggal: string
    tipe: string
    kategori: string
    jumlah: number
    keterangan: string
    bukti_url: string | null
  }[]
  totalPemasukan: number
  totalPengeluaran: number
  saldoBersih: number
  kategoriBreakdown: { kategori: string; total: number; count: number }[]
}

export interface LaporanKegiatanResult {
  items: {
    id: string
    judul: string
    tanggal: string
    lokasi: string | null
    status: string
    deskripsi: string
    foto_cover: string | null
  }[]
  totalKegiatan: number
  kegiatanSelesai: number
  kegiatanMendatang: number
}

export interface LaporanAnggotaResult {
  items: {
    id: string
    nama: string
    nik: string | null
    jenis_kelamin: string
    tempat_lahir: string | null
    tanggal_lahir: string | null
    no_hp: string | null
    alamat: string | null
    rt: string
    rw: string
    status: string
    jabatan: string | null
    minat_bakat: string | null
  }[]
  total: number
  pria: number
  wanita: number
}

export async function getLaporanKeuanganData(options?: {
  startDate?: string
  endDate?: string
  tipe?: string
  kategori?: string
}): Promise<LaporanKeuanganResult> {
  try {
    const where: Prisma.KeuanganWhereInput = {}

    if (options?.tipe && options.tipe !== 'semua') {
      where.tipe = options.tipe
    }

    if (options?.kategori && options.kategori !== 'semua') {
      where.kategori = options.kategori
    }

    if (options?.startDate || options?.endDate) {
      where.tanggal = {}
      if (options.startDate) {
        where.tanggal.gte = new Date(options.startDate)
      }
      if (options.endDate) {
        where.tanggal.lte = new Date(options.endDate)
      }
    }

    const data = await prisma.keuangan.findMany({
      where,
      orderBy: { tanggal: 'asc' }
    })

    let totalPemasukan = 0
    let totalPengeluaran = 0
    const catMap: Record<string, { total: number; count: number }> = {}

    const items = data.map((d: Keuangan) => {
      const jml = Number(d.jumlah)
      if (d.tipe === 'pemasukan') {
        totalPemasukan += jml
      } else {
        totalPengeluaran += jml
      }

      if (!catMap[d.kategori]) {
        catMap[d.kategori] = { total: 0, count: 0 }
      }
      catMap[d.kategori].total += jml
      catMap[d.kategori].count += 1

      return {
        id: d.id,
        tanggal: d.tanggal.toISOString().split('T')[0],
        tipe: d.tipe,
        kategori: d.kategori,
        jumlah: jml,
        keterangan: d.keterangan,
        bukti_url: d.bukti_url
      }
    })

    const kategoriBreakdown = Object.entries(catMap).map(([kategori, val]) => ({
      kategori,
      total: val.total,
      count: val.count
    }))

    return {
      items,
      totalPemasukan,
      totalPengeluaran,
      saldoBersih: totalPemasukan - totalPengeluaran,
      kategoriBreakdown
    }
  } catch (error) {
    console.error('Error fetching laporan keuangan data:', error)
    return {
      items: [],
      totalPemasukan: 0,
      totalPengeluaran: 0,
      saldoBersih: 0,
      kategoriBreakdown: []
    }
  }
}

export async function getLaporanKegiatanData(options?: {
  tahun?: number
  status?: string
}): Promise<LaporanKegiatanResult> {
  try {
    const where: Prisma.KegiatanWhereInput = {}

    if (options?.status && options.status !== 'semua') {
      where.status = options.status
    }

    if (options?.tahun && !isNaN(options.tahun)) {
      where.tanggal_pelaksanaan = {
        gte: new Date(`${options.tahun}-01-01`),
        lte: new Date(`${options.tahun}-12-31`)
      }
    }

    const data = await prisma.kegiatan.findMany({
      where,
      orderBy: { tanggal_pelaksanaan: 'desc' }
    })

    const items = data.map((k: Kegiatan) => ({
      id: k.id,
      judul: k.judul,
      tanggal: k.tanggal_pelaksanaan.toISOString().split('T')[0],
      lokasi: k.lokasi,
      status: k.status,
      deskripsi: k.deskripsi,
      foto_cover: k.foto_cover
    }))

    return {
      items,
      totalKegiatan: items.length,
      kegiatanSelesai: items.filter((k: { status: string }) => k.status === 'selesai').length,
      kegiatanMendatang: items.filter((k: { status: string }) => k.status !== 'selesai').length
    }
  } catch (error) {
    console.error('Error fetching laporan kegiatan data:', error)
    return {
      items: [],
      totalKegiatan: 0,
      kegiatanSelesai: 0,
      kegiatanMendatang: 0
    }
  }
}

export async function getLaporanAnggotaData(options?: {
  rt?: string
  status?: string
}): Promise<LaporanAnggotaResult> {
  try {
    const where: Prisma.AnggotaWhereInput = {}

    if (options?.rt && options.rt !== 'semua') {
      where.rt = options.rt
    }

    if (options?.status && options.status !== 'semua') {
      where.status = options.status
    }

    const data = await prisma.anggota.findMany({
      where,
      orderBy: [{ rt: 'asc' }, { nama: 'asc' }]
    })

    const items = data.map((a: Anggota) => ({
      id: a.id,
      nama: a.nama,
      nik: a.nik,
      jenis_kelamin: a.jenis_kelamin,
      tempat_lahir: a.tempat_lahir,
      tanggal_lahir: a.tanggal_lahir ? a.tanggal_lahir.toISOString().split('T')[0] : null,
      no_hp: a.no_hp,
      alamat: a.alamat,
      rt: a.rt,
      rw: a.rw,
      status: a.status,
      jabatan: a.jabatan,
      minat_bakat: a.minat_bakat
    }))

    return {
      items,
      total: items.length,
      pria: items.filter((a: { jenis_kelamin: string }) => a.jenis_kelamin === 'L').length,
      wanita: items.filter((a: { jenis_kelamin: string }) => a.jenis_kelamin === 'P').length
    }
  } catch (error) {
    console.error('Error fetching laporan anggota data:', error)
    return {
      items: [],
      total: 0,
      pria: 0,
      wanita: 0
    }
  }
}

export async function getOrganisasiInfo() {
  try {
    const profile = await prisma.profile.findFirst()
    const ketua = await prisma.strukturOrganisasi.findFirst({
      where: {
        jabatan: { contains: 'Ketua', mode: 'insensitive' },
        is_active: true
      }
    })
    const bendahara = await prisma.strukturOrganisasi.findFirst({
      where: {
        jabatan: { contains: 'Bendahara', mode: 'insensitive' },
        is_active: true
      }
    })
    const sekretaris = await prisma.strukturOrganisasi.findFirst({
      where: {
        jabatan: { contains: 'Sekretaris', mode: 'insensitive' },
        is_active: true
      }
    })

    return {
      nama_organisasi: profile?.nama_organisasi || 'Karang Taruna Tirtajaya 01',
      nama_dusun: profile?.nama_dusun || 'Dusun Sumurgintung',
      desa: profile?.desa || 'Sumurgintung',
      kecamatan: profile?.kecamatan || '',
      kabupaten: profile?.kabupaten || 'Cirebon',
      provinsi: profile?.provinsi || 'Jawa Barat',
      email: profile?.email || 'karangtarunatirtajaya01@gmail.com',
      telepon: profile?.telepon || '0821-2060-6391',
      alamat: profile?.alamat || 'Dusun Sumurgintung RT 01/01',
      ketua_nama: ketua?.nama_lengkap || 'Ahmad Fauzi',
      bendahara_nama: bendahara?.nama_lengkap || 'Siti Nurhaliza',
      sekretaris_nama: sekretaris?.nama_lengkap || 'Rizky Ramadhan'
    }
  } catch (error) {
    console.error('Error fetching organisasi info:', error)
    return {
      nama_organisasi: 'Karang Taruna Tirtajaya 01',
      nama_dusun: 'Dusun Sumurgintung',
      desa: 'Sumurgintung',
      kecamatan: '',
      kabupaten: 'Cirebon',
      provinsi: 'Jawa Barat',
      email: 'karangtarunatirtajaya01@gmail.com',
      telepon: '0821-2060-6391',
      alamat: 'Dusun Sumurgintung RT 01/01',
      ketua_nama: 'Ahmad Fauzi',
      bendahara_nama: 'Siti Nurhaliza',
      sekretaris_nama: 'Rizky Ramadhan'
    }
  }
}
