'use server'

import { prisma } from '@/lib/prisma'
import { getSaldoKas } from '@/app/actions/keuangan'

export interface MonthlyFlowItem {
  monthKey: string
  name: string
  pemasukan: number
  pengeluaran: number
  net: number
}

export interface CategoryPieItem {
  name: string
  value: number
  color: string
}

export interface TopBeritaItem {
  id: string
  judul: string
  slug: string
  views: number
  kategori: string
  created_at: string | null
}

export interface TopDokumenItem {
  id: string
  judul: string
  kategori: string
  downloads: number
  file_type: string | null
  file_size: string | null
  file_url: string
}

export interface UpcomingAgendaItem {
  id: string
  judul: string
  tanggal_mulai: string
  lokasi: string | null
  status: string
  kategori: string | null
}

export interface RecentActivityItem {
  id: string
  type: 'berita' | 'dokumen' | 'keuangan' | 'kegiatan'
  title: string
  description: string
  date: string
  meta?: string
  status?: string
}

export interface DashboardAnalyticsData {
  metrics: {
    countBerita: number
    totalBeritaViews: number
    countDokumen: number
    totalDokumenDownloads: number
    countKegiatan: number
    countAgendaUpcoming: number
    countPengurus: number
    saldoKas: number
    pemasukanBulanIni: number
    pengeluaranBulanIni: number
    rasioKas: number // percentage
  }
  monthlyFlow: MonthlyFlowItem[]
  keuanganCategoryDistribution: CategoryPieItem[]
  dokumenCategoryDistribution: CategoryPieItem[]
  topBerita: TopBeritaItem[]
  topDokumen: TopDokumenItem[]
  upcomingAgenda: UpcomingAgendaItem[]
  recentActivities: RecentActivityItem[]
}

const CATEGORY_COLORS = [
  '#1868db', '#10b981', '#f59e0b', '#8b5cf6', '#ec4899', '#06b6d4', '#f97316'
]

export async function getDashboardAnalytics(): Promise<DashboardAnalyticsData> {
  try {
    const now = new Date()
    const currentYear = now.getFullYear()
    const currentMonth = now.getMonth()

    // 1. Fetch counts & aggregations in parallel
    const [
      countBerita,
      viewsAggregate,
      countDokumen,
      downloadsAggregate,
      countKegiatan,
      countAgendaUpcoming,
      countPengurus,
      saldoKas,
      allKeuangan,
      allDokumen,
      topBeritaRaw,
      topDokumenRaw,
      upcomingAgendaRaw,
      latestKegiatanRaw
    ] = await Promise.all([
      prisma.berita.count(),
      prisma.berita.aggregate({ _sum: { views: true } }),
      prisma.dokumen.count(),
      prisma.dokumen.aggregate({ _sum: { downloads: true } }),
      prisma.kegiatan.count(),
      prisma.agenda.count({ where: { status: 'akan_datang' } }),
      prisma.strukturOrganisasi.count({ where: { is_active: true } }),
      getSaldoKas(),
      prisma.keuangan.findMany({
        orderBy: { tanggal: 'asc' }
      }),
      prisma.dokumen.findMany({
        select: { kategori: true }
      }),
      prisma.berita.findMany({
        where: { status: 'published' },
        orderBy: { views: 'desc' },
        take: 5
      }),
      prisma.dokumen.findMany({
        orderBy: { downloads: 'desc' },
        take: 5
      }),
      prisma.agenda.findMany({
        where: {
          tanggal_mulai: { gte: new Date(now.getTime() - 24 * 60 * 60 * 1000) }
        },
        orderBy: { tanggal_mulai: 'asc' },
        take: 4
      }),
      prisma.kegiatan.findMany({
        orderBy: { created_at: 'desc' },
        take: 3
      })
    ])

    // Calculate this month's financial metrics
    let pemasukanBulanIni = 0
    let pengeluaranBulanIni = 0

    // Monthly flow map for last 6 months
    const monthlyMap: Record<string, { name: string; pemasukan: number; pengeluaran: number }> = {}
    for (let i = 5; i >= 0; i--) {
      const d = new Date(currentYear, currentMonth - i, 1)
      const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`
      const name = d.toLocaleDateString('id-ID', { month: 'short', year: '2-digit' })
      monthlyMap[key] = { name, pemasukan: 0, pengeluaran: 0 }
    }

    // Category breakdown for Keuangan
    const keuanganCategoryMap: Record<string, number> = {}

    allKeuangan.forEach((item) => {
      const d = new Date(item.tanggal)
      const amount = Number(item.jumlah)
      const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`

      if (d.getFullYear() === currentYear && d.getMonth() === currentMonth) {
        if (item.tipe === 'pemasukan') {
          pemasukanBulanIni += amount
        } else {
          pengeluaranBulanIni += amount
        }
      }

      if (monthlyMap[key]) {
        if (item.tipe === 'pemasukan') {
          monthlyMap[key].pemasukan += amount
        } else {
          monthlyMap[key].pengeluaran += amount
        }
      }

      // Aggregate category (focused on pengeluaran or all)
      const cat = item.kategori || 'Lainnya'
      keuanganCategoryMap[cat] = (keuanganCategoryMap[cat] || 0) + amount
    })

    const monthlyFlow: MonthlyFlowItem[] = Object.entries(monthlyMap).map(([key, val]) => ({
      monthKey: key,
      name: val.name,
      pemasukan: val.pemasukan,
      pengeluaran: val.pengeluaran,
      net: val.pemasukan - val.pengeluaran
    }))

    const keuanganCategoryDistribution: CategoryPieItem[] = Object.entries(keuanganCategoryMap)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5)
      .map(([name, value], idx) => ({
        name,
        value,
        color: CATEGORY_COLORS[idx % CATEGORY_COLORS.length]
      }))

    // Dokumen category breakdown
    const dokumenCategoryMap: Record<string, number> = {}
    const KATEGORI_LABELS: Record<string, string> = {
      sk: 'SK Pengurus',
      ad_art: 'AD / ART',
      proposal: 'Proposal',
      lpj: 'LPJ',
      surat: 'Surat Resmi',
      lainnya: 'Lainnya'
    }

    allDokumen.forEach((doc) => {
      const label = KATEGORI_LABELS[doc.kategori] || doc.kategori.toUpperCase()
      dokumenCategoryMap[label] = (dokumenCategoryMap[label] || 0) + 1
    })

    const dokumenCategoryDistribution: CategoryPieItem[] = Object.entries(dokumenCategoryMap).map(
      ([name, value], idx) => ({
        name,
        value,
        color: CATEGORY_COLORS[(idx + 2) % CATEGORY_COLORS.length]
      })
    )

    // Calculate Kas ratio (pemasukan vs pengeluaran bulan ini)
    const totalCirculation = pemasukanBulanIni + pengeluaranBulanIni
    const rasioKas = totalCirculation > 0 ? Math.round((pemasukanBulanIni / totalCirculation) * 100) : 100

    // Top Berita mapped
    const topBerita: TopBeritaItem[] = topBeritaRaw.map((b) => ({
      id: b.id,
      judul: b.judul,
      slug: b.slug,
      views: b.views,
      kategori: b.kategori,
      created_at: b.created_at ? b.created_at.toISOString() : null
    }))

    // Top Dokumen mapped
    const topDokumen: TopDokumenItem[] = topDokumenRaw.map((d) => ({
      id: d.id,
      judul: d.judul,
      kategori: d.kategori,
      downloads: d.downloads,
      file_type: d.file_type,
      file_size: d.file_size,
      file_url: d.file_url
    }))

    // Upcoming Agenda mapped
    const upcomingAgenda: UpcomingAgendaItem[] = upcomingAgendaRaw.map((a) => ({
      id: a.id,
      judul: a.judul,
      tanggal_mulai: a.tanggal_mulai.toISOString(),
      lokasi: a.lokasi,
      status: a.status,
      kategori: a.kategori
    }))

    // Consolidated Recent Activities
    const recentActivities: RecentActivityItem[] = []

    // 1. Latest Berita
    topBeritaRaw.slice(0, 2).forEach((b) => {
      recentActivities.push({
        id: `berita-${b.id}`,
        type: 'berita',
        title: `Berita dipublikasi: "${b.judul}"`,
        description: `Kategori: ${b.kategori} • ${b.views} views`,
        date: b.created_at ? b.created_at.toISOString() : now.toISOString(),
        status: b.status
      })
    })

    // 2. Latest Keuangan
    allKeuangan
      .slice(-3)
      .reverse()
      .forEach((k) => {
        recentActivities.push({
          id: `keuangan-${k.id}`,
          type: 'keuangan',
          title: `Transaksi kas: ${k.keterangan}`,
          description: `${k.tipe.toUpperCase()} - Rp ${Number(k.jumlah).toLocaleString('id-ID')}`,
          date: new Date(k.tanggal).toISOString(),
          status: k.tipe
        })
      })

    // 3. Latest Dokumen
    topDokumenRaw.slice(0, 2).forEach((d) => {
      recentActivities.push({
        id: `dokumen-${d.id}`,
        type: 'dokumen',
        title: `Dokumen diunggah: "${d.judul}"`,
        description: `${KATEGORI_LABELS[d.kategori] || d.kategori} • ${d.downloads} unduhan`,
        date: d.created_at ? d.created_at.toISOString() : now.toISOString()
      })
    })

    // 4. Latest Kegiatan
    latestKegiatanRaw.forEach((kg) => {
      recentActivities.push({
        id: `kegiatan-${kg.id}`,
        type: 'kegiatan',
        title: `Dokumentasi kegiatan: "${kg.judul}"`,
        description: `Status: ${kg.status} • Lokasi: ${kg.lokasi || 'Dusun Sumurgintung'}`,
        date: kg.created_at ? kg.created_at.toISOString() : now.toISOString()
      })
    })

    // Sort recent activities by date descending and take 6
    recentActivities.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())

    return {
      metrics: {
        countBerita,
        totalBeritaViews: viewsAggregate._sum.views || 0,
        countDokumen,
        totalDokumenDownloads: downloadsAggregate._sum.downloads || 0,
        countKegiatan,
        countAgendaUpcoming,
        countPengurus,
        saldoKas,
        pemasukanBulanIni,
        pengeluaranBulanIni,
        rasioKas
      },
      monthlyFlow,
      keuanganCategoryDistribution,
      dokumenCategoryDistribution,
      topBerita,
      topDokumen,
      upcomingAgenda,
      recentActivities: recentActivities.slice(0, 7)
    }
  } catch (error) {
    console.error('Error fetching dashboard analytics:', error)
    return {
      metrics: {
        countBerita: 0,
        totalBeritaViews: 0,
        countDokumen: 0,
        totalDokumenDownloads: 0,
        countKegiatan: 0,
        countAgendaUpcoming: 0,
        countPengurus: 0,
        saldoKas: 0,
        pemasukanBulanIni: 0,
        pengeluaranBulanIni: 0,
        rasioKas: 100
      },
      monthlyFlow: [],
      keuanganCategoryDistribution: [],
      dokumenCategoryDistribution: [],
      topBerita: [],
      topDokumen: [],
      upcomingAgenda: [],
      recentActivities: []
    }
  }
}
