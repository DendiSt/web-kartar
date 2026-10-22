'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import {
  TrendingUp,
  TrendingDown,
  DollarSign,
  Eye,
  Download,
  Calendar,
  Users,
  Plus,
  Sparkles,
  BarChart3,
  PieChart as PieChartIcon,
  RefreshCw,
  FolderArchive,
  Newspaper,
  Camera,
  CalendarDays,
  ChevronRight,
  FileText
} from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  PieChart,
  Pie,
  Cell
} from 'recharts'
import type { DashboardAnalyticsData } from '@/app/actions/analytics'

interface DashboardAnalyticsClientProps {
  data: DashboardAnalyticsData
}

function formatRupiah(num: number) {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(num)
}

function formatCompactRupiah(num: number) {
  return new Intl.NumberFormat('id-ID', {
    notation: 'compact',
    compactDisplay: 'short'
  }).format(num)
}

// Custom Tooltip for Cash Flow declared outside render
interface CashFlowTooltipProps {
  active?: boolean
  payload?: Array<{ name: string; value: number; color: string }>
  label?: string
}

function CustomCashFlowTooltip({ active, payload, label }: CashFlowTooltipProps) {
  if (active && payload && payload.length) {
    const pem = payload.find((p) => p.name.toLowerCase().includes('pemasukan'))?.value || 0
    const peng = payload.find((p) => p.name.toLowerCase().includes('pengeluaran'))?.value || 0
    const net = pem - peng

    return (
      <div className="rounded-xl border border-border bg-card/95 p-3.5 shadow-xl backdrop-blur-md text-xs space-y-1.5 min-w-[200px]">
        <p className="font-semibold text-foreground border-b border-border/60 pb-1 text-sm">{label}</p>
        <div className="flex items-center justify-between text-emerald-600 dark:text-emerald-400 font-medium">
          <span>Pemasukan:</span>
          <span>{formatRupiah(pem)}</span>
        </div>
        <div className="flex items-center justify-between text-rose-600 dark:text-rose-400 font-medium">
          <span>Pengeluaran:</span>
          <span>{formatRupiah(peng)}</span>
        </div>
        <div className="flex items-center justify-between pt-1 border-t border-border/60 font-bold">
          <span className="text-muted-foreground">Arus Bersih (Net):</span>
          <span className={net >= 0 ? 'text-emerald-600 dark:text-emerald-400' : 'text-rose-600 dark:text-rose-400'}>
            {net >= 0 ? '+' : ''}{formatRupiah(net)}
          </span>
        </div>
      </div>
    )
  }
  return null
}

// Custom Tooltip for Pie Chart declared outside render
interface PieTooltipProps {
  active?: boolean
  payload?: Array<{ name: string; value: number; payload: { name: string; value: number; color: string } }>
  mode?: 'keuangan' | 'dokumen'
}

function CustomPieTooltip({ active, payload, mode = 'keuangan' }: PieTooltipProps) {
  if (active && payload && payload.length) {
    const item = payload[0]
    return (
      <div className="rounded-xl border border-border bg-card/95 p-3 shadow-lg backdrop-blur-md text-xs">
        <p className="font-semibold text-foreground">{item.name}</p>
        <p className="text-muted-foreground mt-0.5">
          {mode === 'keuangan' ? formatRupiah(item.value) : `${item.value} Dokumen`}
        </p>
      </div>
    )
  }
  return null
}

export default function DashboardAnalyticsClient({ data }: DashboardAnalyticsClientProps) {
  const [chartMode, setChartMode] = useState<'area' | 'bar'>('area')
  const [pieMode, setPieMode] = useState<'keuangan' | 'dokumen'>('keuangan')
  const [isRefreshing, setIsRefreshing] = useState(false)

  const {
    metrics,
    monthlyFlow,
    keuanganCategoryDistribution,
    dokumenCategoryDistribution,
    topBerita,
    topDokumen,
    upcomingAgenda,
    recentActivities
  } = data

  const handleRefresh = () => {
    setIsRefreshing(true)
    window.location.reload()
  }

  // Calculate total flow over 6 months
  const total6MPemasukan = monthlyFlow.reduce((acc, curr) => acc + curr.pemasukan, 0)
  const total6MPengeluaran = monthlyFlow.reduce((acc, curr) => acc + curr.pengeluaran, 0)
  const net6M = total6MPemasukan - total6MPengeluaran

  const activePieData = pieMode === 'keuangan' ? keuanganCategoryDistribution : dokumenCategoryDistribution

  return (
    <div className="space-y-8 pb-10">
      {/* 1. Header Banner & Quick Controls */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-border/70 pb-6">
        <div>
          <div className="flex items-center gap-2">
            <Badge variant="outline" className="gap-1.5 px-2.5 py-0.5 bg-primary/10 text-primary border-primary/20 text-xs font-medium rounded-full">
              <Sparkles className="w-3.5 h-3.5" />
              Pusat Kendali Organisasi
            </Badge>
            <span className="text-xs text-muted-foreground hidden sm:inline">• Real-time Analytics</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-heading font-extrabold tracking-tight mt-1 text-foreground">
            Dashboard Analitik Tirtajaya 01
          </h1>
          <p className="text-muted-foreground text-sm mt-1">
            Pantau arus kas transparansi, pembaca berita, unduhan arsip, dan jadwal kegiatan dusun.
          </p>
        </div>

        <div className="flex items-center gap-2.5 self-start md:self-center">
          <Button
            variant="outline"
            size="sm"
            onClick={handleRefresh}
            disabled={isRefreshing}
            className="rounded-xl gap-2 text-xs h-9 cursor-pointer border-border hover:bg-muted"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isRefreshing ? 'animate-spin' : ''}`} />
            Perbarui
          </Button>

          <Link href="/dashboard/keuangan">
            <Button size="sm" className="rounded-xl gap-2 text-xs h-9 bg-primary hover:bg-primary/90 text-primary-foreground shadow-sm">
              <DollarSign className="w-3.5 h-3.5" />
              Kelola Kas
            </Button>
          </Link>
        </div>
      </div>

      {/* 2. Quick Actions Bar (Aksi Cepat) */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            Pintasan Aksi Cepat (Quick Actions)
          </h3>
          <span className="text-[11px] text-muted-foreground">Langsung buat atau unggah konten</span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
          <Link
            href="/dashboard/berita"
            className="group relative flex flex-col p-3.5 rounded-2xl border border-border/80 bg-card hover:bg-accent/40 hover:border-primary/50 transition-all shadow-xs hover:shadow-md"
          >
            <div className="w-9 h-9 rounded-xl bg-blue-500/10 text-[#1868db] dark:text-blue-400 flex items-center justify-center mb-2.5 group-hover:scale-105 transition-transform">
              <Newspaper className="w-5 h-5" />
            </div>
            <div className="text-sm font-semibold text-foreground group-hover:text-primary transition-colors flex items-center justify-between">
              Tulis Berita
              <Plus className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity" />
            </div>
            <p className="text-[11px] text-muted-foreground mt-0.5">Rilis info dusun terbaru</p>
          </Link>

          <Link
            href="/dashboard/dokumen"
            className="group relative flex flex-col p-3.5 rounded-2xl border border-border/80 bg-card hover:bg-accent/40 hover:border-primary/50 transition-all shadow-xs hover:shadow-md"
          >
            <div className="w-9 h-9 rounded-xl bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 flex items-center justify-center mb-2.5 group-hover:scale-105 transition-transform">
              <FolderArchive className="w-5 h-5" />
            </div>
            <div className="text-sm font-semibold text-foreground group-hover:text-primary transition-colors flex items-center justify-between">
              Unggah Dokumen
              <Plus className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity" />
            </div>
            <p className="text-[11px] text-muted-foreground mt-0.5">SK, Proposal, &amp; LPJ</p>
          </Link>

          <Link
            href="/dashboard/kegiatan"
            className="group relative flex flex-col p-3.5 rounded-2xl border border-border/80 bg-card hover:bg-accent/40 hover:border-primary/50 transition-all shadow-xs hover:shadow-md"
          >
            <div className="w-9 h-9 rounded-xl bg-amber-500/10 text-amber-600 dark:text-amber-400 flex items-center justify-center mb-2.5 group-hover:scale-105 transition-transform">
              <Camera className="w-5 h-5" />
            </div>
            <div className="text-sm font-semibold text-foreground group-hover:text-primary transition-colors flex items-center justify-between">
              Dokumentasi Acara
              <Plus className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity" />
            </div>
            <p className="text-[11px] text-muted-foreground mt-0.5">Tambah foto kegiatan</p>
          </Link>

          <Link
            href="/dashboard/agenda"
            className="group relative flex flex-col p-3.5 rounded-2xl border border-border/80 bg-card hover:bg-accent/40 hover:border-primary/50 transition-all shadow-xs hover:shadow-md"
          >
            <div className="w-9 h-9 rounded-xl bg-purple-500/10 text-purple-600 dark:text-purple-400 flex items-center justify-center mb-2.5 group-hover:scale-105 transition-transform">
              <CalendarDays className="w-5 h-5" />
            </div>
            <div className="text-sm font-semibold text-foreground group-hover:text-primary transition-colors flex items-center justify-between">
              Jadwal Agenda
              <Plus className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity" />
            </div>
            <p className="text-[11px] text-muted-foreground mt-0.5">Rapat atau gotong royong</p>
          </Link>

          <Link
            href="/dashboard/keuangan"
            className="group relative flex flex-col p-3.5 rounded-2xl border border-border/80 bg-card hover:bg-accent/40 hover:border-primary/50 transition-all shadow-xs hover:shadow-md col-span-2 sm:col-span-1"
          >
            <div className="w-9 h-9 rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mb-2.5 group-hover:scale-105 transition-transform">
              <DollarSign className="w-5 h-5" />
            </div>
            <div className="text-sm font-semibold text-foreground group-hover:text-primary transition-colors flex items-center justify-between">
              Catat Kas
              <Plus className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity" />
            </div>
            <p className="text-[11px] text-muted-foreground mt-0.5">Pemasukan / pengeluaran</p>
          </Link>
        </div>
      </div>

      {/* 3. Hero Key Metrics Cards (4 Core Dimensions) */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {/* Card 1: Saldo Kas */}
        <Card className="rounded-2xl border-border/80 shadow-xs relative overflow-hidden bg-gradient-to-br from-card via-card to-emerald-500/5">
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <span className="text-xs font-medium text-muted-foreground">Total Saldo Kas</span>
            <div className="w-8 h-8 rounded-lg bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
              <DollarSign className="w-4 h-4" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold font-heading text-foreground tracking-tight">
              {formatRupiah(metrics.saldoKas)}
            </div>
            <div className="mt-2 flex items-center justify-between text-[11px] text-muted-foreground border-t border-border/60 pt-2">
              <div className="flex items-center gap-1 text-emerald-600 dark:text-emerald-400 font-medium">
                <TrendingUp className="w-3 h-3" />
                <span>+ {formatCompactRupiah(metrics.pemasukanBulanIni)}</span>
              </div>
              <div className="flex items-center gap-1 text-rose-600 dark:text-rose-400 font-medium">
                <TrendingDown className="w-3 h-3" />
                <span>- {formatCompactRupiah(metrics.pengeluaranBulanIni)}</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Card 2: Pembaca Berita */}
        <Card className="rounded-2xl border-border/80 shadow-xs relative overflow-hidden bg-gradient-to-br from-card via-card to-blue-500/5">
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <span className="text-xs font-medium text-muted-foreground">Jangkauan Warga (Berita)</span>
            <div className="w-8 h-8 rounded-lg bg-blue-500/10 text-blue-600 dark:text-blue-400 flex items-center justify-center">
              <Eye className="w-4 h-4" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold font-heading text-foreground tracking-tight">
              {metrics.totalBeritaViews.toLocaleString('id-ID')}
              <span className="text-xs font-normal text-muted-foreground ml-1.5">kali dibaca</span>
            </div>
            <div className="mt-2 flex items-center justify-between text-[11px] text-muted-foreground border-t border-border/60 pt-2">
              <span>{metrics.countBerita} artikel terbit</span>
              <span className="text-primary font-medium">
                ~{metrics.countBerita > 0 ? Math.round(metrics.totalBeritaViews / metrics.countBerita) : 0} avg/berita
              </span>
            </div>
          </CardContent>
        </Card>

        {/* Card 3: Dokumen & Unduhan */}
        <Card className="rounded-2xl border-border/80 shadow-xs relative overflow-hidden bg-gradient-to-br from-card via-card to-indigo-500/5">
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <span className="text-xs font-medium text-muted-foreground">Arsip &amp; Unduhan</span>
            <div className="w-8 h-8 rounded-lg bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 flex items-center justify-center">
              <Download className="w-4 h-4" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold font-heading text-foreground tracking-tight">
              {metrics.totalDokumenDownloads.toLocaleString('id-ID')}
              <span className="text-xs font-normal text-muted-foreground ml-1.5">unduhan</span>
            </div>
            <div className="mt-2 flex items-center justify-between text-[11px] text-muted-foreground border-t border-border/60 pt-2">
              <span>{metrics.countDokumen} berkas publik</span>
              <span className="text-indigo-600 dark:text-indigo-400 font-medium">Transparansi 100%</span>
            </div>
          </CardContent>
        </Card>

        {/* Card 4: Kegiatan & Agenda */}
        <Card className="rounded-2xl border-border/80 shadow-xs relative overflow-hidden bg-gradient-to-br from-card via-card to-purple-500/5">
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <span className="text-xs font-medium text-muted-foreground">Kegiatan &amp; Pengurus</span>
            <div className="w-8 h-8 rounded-lg bg-purple-500/10 text-purple-600 dark:text-purple-400 flex items-center justify-center">
              <Users className="w-4 h-4" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold font-heading text-foreground tracking-tight">
              {metrics.countKegiatan}
              <span className="text-xs font-normal text-muted-foreground ml-1.5">kegiatan selesai</span>
            </div>
            <div className="mt-2 flex items-center justify-between text-[11px] text-muted-foreground border-t border-border/60 pt-2">
              <span>{metrics.countAgendaUpcoming} agenda segera</span>
              <span className="text-purple-600 dark:text-purple-400 font-medium">
                {metrics.countPengurus} pengurus aktif
              </span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* 4. Interactive Charts Section (Arus Kas & Distribusi) */}
      <div className="grid gap-6 lg:grid-cols-3">
        {/* Cash Flow Chart (2 Cols) */}
        <Card className="lg:col-span-2 rounded-2xl border-border/80 shadow-xs">
          <CardHeader className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-2">
            <div>
              <div className="flex items-center gap-2">
                <BarChart3 className="w-4 h-4 text-primary" />
                <CardTitle className="text-base font-bold font-heading">
                  Statistik Arus Kas (6 Bulan Terakhir)
                </CardTitle>
              </div>
              <CardDescription className="text-xs mt-0.5">
                Perbandingan pemasukan, pengeluaran kas, serta saldo bersih per bulan
              </CardDescription>
            </div>

            <div className="flex items-center gap-1.5 bg-muted/60 p-1 rounded-xl self-start sm:self-auto border border-border/60">
              <button
                type="button"
                onClick={() => setChartMode('area')}
                className={`text-xs px-2.5 py-1 rounded-lg font-medium transition-all ${
                  chartMode === 'area'
                    ? 'bg-card text-foreground shadow-xs font-semibold'
                    : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                Area Tren
              </button>
              <button
                type="button"
                onClick={() => setChartMode('bar')}
                className={`text-xs px-2.5 py-1 rounded-lg font-medium transition-all ${
                  chartMode === 'bar'
                    ? 'bg-card text-foreground shadow-xs font-semibold'
                    : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                Batang (Bar)
              </button>
            </div>
          </CardHeader>

          <CardContent className="pt-4">
            <div className="h-[280px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                {chartMode === 'area' ? (
                  <AreaChart data={monthlyFlow} margin={{ top: 10, right: 10, left: -15, bottom: 0 }}>
                    <defs>
                      <linearGradient id="pemasukanGrad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#10b981" stopOpacity={0.35} />
                        <stop offset="95%" stopColor="#10b981" stopOpacity={0.0} />
                      </linearGradient>
                      <linearGradient id="pengeluaranGrad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#ef4444" stopOpacity={0.3} />
                        <stop offset="95%" stopColor="#ef4444" stopOpacity={0.0} />
                      </linearGradient>
                    </defs>
                    <XAxis dataKey="name" fontSize={11} tickLine={false} axisLine={false} stroke="currentColor" className="text-muted-foreground" />
                    <YAxis tickFormatter={formatCompactRupiah} fontSize={11} tickLine={false} axisLine={false} stroke="currentColor" className="text-muted-foreground" />
                    <Tooltip content={<CustomCashFlowTooltip />} />
                    <Legend wrapperStyle={{ fontSize: '12px', paddingTop: '10px' }} />
                    <Area type="monotone" dataKey="pemasukan" name="Pemasukan" stroke="#10b981" strokeWidth={2.5} fillOpacity={1} fill="url(#pemasukanGrad)" />
                    <Area type="monotone" dataKey="pengeluaran" name="Pengeluaran" stroke="#ef4444" strokeWidth={2.5} fillOpacity={1} fill="url(#pengeluaranGrad)" />
                  </AreaChart>
                ) : (
                  <BarChart data={monthlyFlow} margin={{ top: 10, right: 10, left: -15, bottom: 0 }}>
                    <XAxis dataKey="name" fontSize={11} tickLine={false} axisLine={false} stroke="currentColor" className="text-muted-foreground" />
                    <YAxis tickFormatter={formatCompactRupiah} fontSize={11} tickLine={false} axisLine={false} stroke="currentColor" className="text-muted-foreground" />
                    <Tooltip content={<CustomCashFlowTooltip />} />
                    <Legend wrapperStyle={{ fontSize: '12px', paddingTop: '10px' }} />
                    <Bar dataKey="pemasukan" name="Pemasukan" fill="#10b981" radius={[6, 6, 0, 0]} />
                    <Bar dataKey="pengeluaran" name="Pengeluaran" fill="#ef4444" radius={[6, 6, 0, 0]} />
                  </BarChart>
                )}
              </ResponsiveContainer>
            </div>

            {/* Micro Summary Footer */}
            <div className="grid grid-cols-3 gap-2 border-t border-border/70 mt-4 pt-3 text-center text-xs">
              <div>
                <span className="text-muted-foreground block text-[11px]">Total Masuk 6 Bln</span>
                <span className="font-semibold text-emerald-600 dark:text-emerald-400 mt-0.5 block">
                  {formatCompactRupiah(total6MPemasukan)}
                </span>
              </div>
              <div className="border-x border-border/60">
                <span className="text-muted-foreground block text-[11px]">Total Keluar 6 Bln</span>
                <span className="font-semibold text-rose-600 dark:text-rose-400 mt-0.5 block">
                  {formatCompactRupiah(total6MPengeluaran)}
                </span>
              </div>
              <div>
                <span className="text-muted-foreground block text-[11px]">Surplus / Defisit</span>
                <span className={`font-semibold mt-0.5 block ${net6M >= 0 ? 'text-emerald-600 dark:text-emerald-400' : 'text-rose-600 dark:text-rose-400'}`}>
                  {net6M >= 0 ? '+' : ''}{formatCompactRupiah(net6M)}
                </span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Donut Chart (1 Col) */}
        <Card className="rounded-2xl border-border/80 shadow-xs flex flex-col justify-between">
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <PieChartIcon className="w-4 h-4 text-primary" />
                <CardTitle className="text-base font-bold font-heading">
                  Distribusi Kategori
                </CardTitle>
              </div>

              <div className="flex items-center gap-1 bg-muted/60 p-0.5 rounded-lg border border-border/60">
                <button
                  type="button"
                  onClick={() => setPieMode('keuangan')}
                  className={`text-[11px] px-2 py-0.5 rounded font-medium transition-all ${
                    pieMode === 'keuangan'
                      ? 'bg-card text-foreground shadow-xs font-semibold'
                      : 'text-muted-foreground hover:text-foreground'
                  }`}
                >
                  Kas
                </button>
                <button
                  type="button"
                  onClick={() => setPieMode('dokumen')}
                  className={`text-[11px] px-2 py-0.5 rounded font-medium transition-all ${
                    pieMode === 'dokumen'
                      ? 'bg-card text-foreground shadow-xs font-semibold'
                      : 'text-muted-foreground hover:text-foreground'
                  }`}
                >
                  Dokumen
                </button>
              </div>
            </div>
            <CardDescription className="text-xs">
              {pieMode === 'keuangan' ? 'Porsi pengeluaran berdasarkan pos kegiatan' : 'Komposisi jenis berkas arsip'}
            </CardDescription>
          </CardHeader>

          <CardContent className="flex-1 flex flex-col justify-center">
            {activePieData.length === 0 ? (
              <div className="h-[220px] flex items-center justify-center text-xs text-muted-foreground">
                Belum ada data distribusi.
              </div>
            ) : (
              <>
                <div className="h-[190px] w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Tooltip content={<CustomPieTooltip mode={pieMode} />} />
                      <Pie
                        data={activePieData}
                        dataKey="value"
                        nameKey="name"
                        cx="50%"
                        cy="50%"
                        innerRadius={50}
                        outerRadius={75}
                        paddingAngle={3}
                      >
                        {activePieData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} stroke="transparent" />
                        ))}
                      </Pie>
                    </PieChart>
                  </ResponsiveContainer>
                </div>

                <div className="space-y-1.5 mt-2 border-t border-border/60 pt-3">
                  {activePieData.slice(0, 4).map((entry, idx) => (
                    <div key={idx} className="flex items-center justify-between text-xs">
                      <div className="flex items-center gap-2 truncate pr-2">
                        <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: entry.color }} />
                        <span className="truncate text-muted-foreground">{entry.name}</span>
                      </div>
                      <span className="font-semibold text-foreground shrink-0">
                        {pieMode === 'keuangan' ? formatCompactRupiah(entry.value) : `${entry.value} file`}
                      </span>
                    </div>
                  ))}
                </div>
              </>
            )}
          </CardContent>
        </Card>
      </div>

      {/* 5. Performance Insights & Rankings (3 Columns) */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {/* Top Berita */}
        <Card className="rounded-2xl border-border/80 shadow-xs">
          <CardHeader className="pb-3 flex flex-row items-center justify-between space-y-0">
            <div>
              <CardTitle className="text-sm font-bold font-heading flex items-center gap-2">
                <Newspaper className="w-4 h-4 text-blue-500" />
                Berita Terpopuler
              </CardTitle>
              <CardDescription className="text-xs mt-0.5">Paling banyak dibaca warga</CardDescription>
            </div>
            <Link href="/dashboard/berita" className="text-xs text-primary hover:underline flex items-center gap-0.5">
              Semua <ChevronRight className="w-3 h-3" />
            </Link>
          </CardHeader>
          <CardContent className="space-y-3">
            {topBerita.length === 0 ? (
              <p className="text-xs text-muted-foreground text-center py-6">Belum ada berita terpublikasi</p>
            ) : (
              topBerita.map((item, idx) => (
                <div key={item.id} className="flex items-start justify-between gap-3 group">
                  <div className="flex items-start gap-2.5 min-w-0">
                    <span className="w-5 h-5 rounded-full bg-muted flex items-center justify-center text-[10px] font-bold text-muted-foreground shrink-0 mt-0.5 group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                      {idx + 1}
                    </span>
                    <div className="min-w-0">
                      <Link
                        href={`/berita/${item.slug}`}
                        target="_blank"
                        className="text-xs font-medium text-foreground hover:text-primary transition-colors line-clamp-1 block"
                      >
                        {item.judul}
                      </Link>
                      <span className="text-[10px] text-muted-foreground capitalize">
                        {item.kategori}
                      </span>
                    </div>
                  </div>
                  <Badge variant="secondary" className="gap-1 shrink-0 text-[10px] px-2 py-0.5 font-medium">
                    <Eye className="w-3 h-3" />
                    {item.views}
                  </Badge>
                </div>
              ))
            )}
          </CardContent>
        </Card>

        {/* Top Dokumen */}
        <Card className="rounded-2xl border-border/80 shadow-xs">
          <CardHeader className="pb-3 flex flex-row items-center justify-between space-y-0">
            <div>
              <CardTitle className="text-sm font-bold font-heading flex items-center gap-2">
                <FolderArchive className="w-4 h-4 text-indigo-500" />
                Dokumen Terfavorit
              </CardTitle>
              <CardDescription className="text-xs mt-0.5">Berkas paling sering diunduh</CardDescription>
            </div>
            <Link href="/dashboard/dokumen" className="text-xs text-primary hover:underline flex items-center gap-0.5">
              Semua <ChevronRight className="w-3 h-3" />
            </Link>
          </CardHeader>
          <CardContent className="space-y-3">
            {topDokumen.length === 0 ? (
              <p className="text-xs text-muted-foreground text-center py-6">Belum ada dokumen diunggah</p>
            ) : (
              topDokumen.map((item, idx) => (
                <div key={item.id} className="flex items-start justify-between gap-3 group">
                  <div className="flex items-start gap-2.5 min-w-0">
                    <span className="w-5 h-5 rounded-full bg-muted flex items-center justify-center text-[10px] font-bold text-muted-foreground shrink-0 mt-0.5 group-hover:bg-indigo-600 group-hover:text-white transition-colors">
                      {idx + 1}
                    </span>
                    <div className="min-w-0">
                      <a
                        href={item.file_url}
                        target="_blank"
                        rel="noreferrer"
                        className="text-xs font-medium text-foreground hover:text-primary transition-colors line-clamp-1 block"
                      >
                        {item.judul}
                      </a>
                      <span className="text-[10px] text-muted-foreground uppercase">
                        {item.file_type || 'PDF'} {item.file_size ? `• ${item.file_size}` : ''}
                      </span>
                    </div>
                  </div>
                  <Badge variant="outline" className="gap-1 shrink-0 text-[10px] px-2 py-0.5 font-medium border-border">
                    <Download className="w-3 h-3 text-indigo-500" />
                    {item.downloads}
                  </Badge>
                </div>
              ))
            )}
          </CardContent>
        </Card>

        {/* Upcoming Agenda Countdown */}
        <Card className="rounded-2xl border-border/80 shadow-xs md:col-span-2 lg:col-span-1">
          <CardHeader className="pb-3 flex flex-row items-center justify-between space-y-0">
            <div>
              <CardTitle className="text-sm font-bold font-heading flex items-center gap-2">
                <Calendar className="w-4 h-4 text-purple-500" />
                Agenda Terdekat
              </CardTitle>
              <CardDescription className="text-xs mt-0.5">Jadwal kegiatan dusun terdekat</CardDescription>
            </div>
            <Link href="/dashboard/agenda" className="text-xs text-primary hover:underline flex items-center gap-0.5">
              Semua <ChevronRight className="w-3 h-3" />
            </Link>
          </CardHeader>
          <CardContent className="space-y-3">
            {upcomingAgenda.length === 0 ? (
              <p className="text-xs text-muted-foreground text-center py-6">Tidak ada agenda mendatang</p>
            ) : (
              upcomingAgenda.map((item) => {
                const dateObj = new Date(item.tanggal_mulai)
                const dateStr = dateObj.toLocaleDateString('id-ID', {
                  day: 'numeric',
                  month: 'short',
                  year: 'numeric'
                })

                return (
                  <div key={item.id} className="p-2.5 rounded-xl border border-border/60 bg-muted/30 space-y-1">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-semibold text-foreground line-clamp-1">{item.judul}</span>
                      <Badge variant="outline" className="text-[10px] px-1.5 py-0 border-purple-500/30 text-purple-600 dark:text-purple-400">
                        {item.status.replace('_', ' ')}
                      </Badge>
                    </div>
                    <div className="flex items-center justify-between text-[11px] text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <CalendarDays className="w-3 h-3" />
                        {dateStr}
                      </span>
                      {item.lokasi && <span className="truncate max-w-[120px]">{item.lokasi}</span>}
                    </div>
                  </div>
                )
              })
            )}
          </CardContent>
        </Card>
      </div>

      {/* 6. Recent Activity Stream */}
      <Card className="rounded-2xl border-border/80 shadow-xs">
        <CardHeader className="pb-3">
          <CardTitle className="text-base font-bold font-heading">
            Aliran Aktivitas Terkini (Recent Activity Stream)
          </CardTitle>
          <CardDescription className="text-xs">
            Riwayat pembaruan berita, transaksi kas, dokumen, dan kegiatan organisasi
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="divide-y divide-border/60">
            {recentActivities.length === 0 ? (
              <p className="text-xs text-muted-foreground text-center py-6">Belum ada aktivitas tercatat</p>
            ) : (
              recentActivities.map((act) => {
                const actDate = new Date(act.date).toLocaleDateString('id-ID', {
                  day: 'numeric',
                  month: 'short',
                  year: 'numeric'
                })

                let iconNode = <FileText className="w-4 h-4 text-primary" />
                if (act.type === 'berita') {
                  iconNode = <Newspaper className="w-4 h-4 text-blue-500" />
                } else if (act.type === 'keuangan') {
                  iconNode = <DollarSign className="w-4 h-4 text-emerald-500" />
                } else if (act.type === 'dokumen') {
                  iconNode = <FolderArchive className="w-4 h-4 text-indigo-500" />
                } else if (act.type === 'kegiatan') {
                  iconNode = <Camera className="w-4 h-4 text-amber-500" />
                }

                return (
                  <div key={act.id} className="py-3 flex items-start justify-between gap-4 first:pt-0 last:pb-0">
                    <div className="flex items-start gap-3">
                      <div className="w-8 h-8 rounded-full bg-muted/80 flex items-center justify-center shrink-0 mt-0.5">
                        {iconNode}
                      </div>
                      <div>
                        <p className="text-xs sm:text-sm font-medium text-foreground">{act.title}</p>
                        <p className="text-[11px] text-muted-foreground mt-0.5">{act.description}</p>
                      </div>
                    </div>
                    <span className="text-[11px] text-muted-foreground whitespace-nowrap shrink-0">{actDate}</span>
                  </div>
                )
              })
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
