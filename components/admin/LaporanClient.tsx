'use client'

import * as React from 'react'
import {
  Printer,
  Download,
  DollarSign,
  Calendar,
  Users
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  LaporanKeuanganResult,
  LaporanKegiatanResult,
  LaporanAnggotaResult
} from '@/app/actions/laporan'

interface LaporanClientProps {
  keuanganData: LaporanKeuanganResult
  kegiatanData: LaporanKegiatanResult
  anggotaData: LaporanAnggotaResult
  orgInfo: {
    nama_organisasi: string
    nama_dusun: string
    desa: string
    kecamatan: string
    kabupaten: string
    provinsi: string
    email: string
    telepon: string
    alamat: string
    ketua_nama: string
    bendahara_nama: string
    sekretaris_nama: string
  }
}

export default function LaporanClient({
  keuanganData,
  kegiatanData,
  anggotaData,
  orgInfo
}: LaporanClientProps) {
  const [activeTab, setActiveTab] = React.useState<'keuangan' | 'kegiatan' | 'anggota'>('keuangan')
  const [previewMode, setPreviewMode] = React.useState<'theme' | 'paper'>('theme')

  const isPaper = previewMode === 'paper'

  // Date formatted for print
  const printDateStr = new Date().toLocaleDateString('id-ID', {
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  })

  // Format currency
  const formatRupiah = (val: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0
    }).format(val)
  }

  // Handle Trigger Print
  const handlePrint = () => {
    window.print()
  }

  // Export CSV Keuangan
  const handleExportKeuanganCSV = () => {
    const headers = ['No', 'Tanggal', 'Tipe', 'Kategori', 'Keterangan', 'Pemasukan (Rp)', 'Pengeluaran (Rp)']
    const rows = keuanganData.items.map((item, idx) => [
      idx + 1,
      item.tanggal,
      item.tipe.toUpperCase(),
      `"${item.kategori}"`,
      `"${item.keterangan.replace(/"/g, '""')}"`,
      item.tipe === 'pemasukan' ? item.jumlah : 0,
      item.tipe === 'pengeluaran' ? item.jumlah : 0
    ])

    rows.push([
      '',
      '',
      '',
      'TOTAL',
      '',
      keuanganData.totalPemasukan,
      keuanganData.totalPengeluaran
    ])
    rows.push(['', '', '', 'SALDO AKHIR', '', '', keuanganData.saldoBersih])

    const csvContent = '\uFEFF' + [headers.join(','), ...rows.map((r) => r.join(','))].join('\r\n')
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.setAttribute('download', `laporan_keuangan_${new Date().toISOString().split('T')[0]}.csv`)
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  // Export CSV Kegiatan
  const handleExportKegiatanCSV = () => {
    const headers = ['No', 'Nama Kegiatan', 'Tanggal Pelaksanaan', 'Lokasi', 'Status', 'Ringkasan']
    const rows = kegiatanData.items.map((item, idx) => [
      idx + 1,
      `"${item.judul.replace(/"/g, '""')}"`,
      item.tanggal,
      `"${(item.lokasi || '-').replace(/"/g, '""')}"`,
      item.status,
      `"${(item.deskripsi || '-').replace(/"/g, '""')}"`
    ])

    const csvContent = '\uFEFF' + [headers.join(','), ...rows.map((r) => r.join(','))].join('\r\n')
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.setAttribute('download', `rekap_kegiatan_${new Date().toISOString().split('T')[0]}.csv`)
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  // Export CSV Anggota
  const handleExportAnggotaCSV = () => {
    const headers = ['No', 'Nama', 'NIK', 'Gender', 'Tempat Lahir', 'Tanggal Lahir', 'No HP', 'RT', 'RW', 'Status', 'Jabatan', 'Minat/Bakat']
    const rows = anggotaData.items.map((item, idx) => [
      idx + 1,
      `"${item.nama.replace(/"/g, '""')}"`,
      `"${item.nik || '-'}"`,
      item.jenis_kelamin,
      `"${item.tempat_lahir || '-'}"`,
      item.tanggal_lahir || '-',
      `"${item.no_hp || '-'}"`,
      item.rt,
      item.rw,
      item.status,
      `"${item.jabatan || '-'}"`,
      `"${(item.minat_bakat || '-').replace(/"/g, '""')}"`
    ])

    const csvContent = '\uFEFF' + [headers.join(','), ...rows.map((r) => r.join(','))].join('\r\n')
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.setAttribute('download', `buku_induk_anggota_${new Date().toISOString().split('T')[0]}.csv`)
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  // Table styling classes based on preview mode
  const tableBorder = isPaper ? 'border-gray-900' : 'border-border'
  const thStyle = isPaper
    ? 'py-2 px-2 border-r border-gray-900 bg-gray-100 text-gray-900 font-bold'
    : 'py-2 px-2 border-r border-border bg-muted/70 text-foreground font-bold'
  const tdStyle = isPaper
    ? 'py-1.5 px-2 border-r border-gray-300 text-gray-800'
    : 'py-1.5 px-2 border-r border-border text-foreground'
  const trStyle = isPaper
    ? 'border-b border-gray-200 hover:bg-gray-50'
    : 'border-b border-border/60 hover:bg-muted/30 transition-colors'

  return (
    <div className="space-y-6">
      {/* Tab Navigation & Mode Toggle (Hidden on Print) */}
      <div className="flex flex-col lg:flex-row gap-3 items-stretch lg:items-center justify-between print:hidden">
        {/* Report Tab Selector */}
        <div className="inline-flex p-1 rounded-xl bg-muted border space-x-1">
          <button
            type="button"
            onClick={() => setActiveTab('keuangan')}
            className={`px-4 py-2 rounded-lg text-xs font-semibold transition-all flex items-center gap-2 ${
              activeTab === 'keuangan'
                ? 'bg-background text-foreground shadow-sm'
                : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            <DollarSign className="h-3.5 w-3.5" />
            Laporan Keuangan
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('kegiatan')}
            className={`px-4 py-2 rounded-lg text-xs font-semibold transition-all flex items-center gap-2 ${
              activeTab === 'kegiatan'
                ? 'bg-background text-foreground shadow-sm'
                : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            <Calendar className="h-3.5 w-3.5" />
            Rekap Kegiatan
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('anggota')}
            className={`px-4 py-2 rounded-lg text-xs font-semibold transition-all flex items-center gap-2 ${
              activeTab === 'anggota'
                ? 'bg-background text-foreground shadow-sm'
                : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            <Users className="h-3.5 w-3.5" />
            Buku Induk Anggota
          </button>
        </div>

        {/* Preview Mode Selector & Export Actions */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Mode Pratinjau Toggle */}
          <div className="flex items-center gap-1 bg-muted p-1 rounded-lg border text-xs">
            <span className="text-muted-foreground px-1.5 font-medium hidden sm:inline">Pratinjau:</span>
            <button
              type="button"
              onClick={() => setPreviewMode('theme')}
              className={`px-2.5 py-1 rounded-md transition-all font-medium ${
                previewMode === 'theme'
                  ? 'bg-background text-foreground shadow-xs font-semibold'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              Tema Gelap/Terang
            </button>
            <button
              type="button"
              onClick={() => setPreviewMode('paper')}
              className={`px-2.5 py-1 rounded-md transition-all font-medium ${
                previewMode === 'paper'
                  ? 'bg-background text-foreground shadow-xs font-semibold'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              Kertas A4 Putih
            </button>
          </div>

          <Button
            variant="outline"
            size="sm"
            onClick={
              activeTab === 'keuangan'
                ? handleExportKeuanganCSV
                : activeTab === 'kegiatan'
                ? handleExportKegiatanCSV
                : handleExportAnggotaCSV
            }
            className="h-9 gap-1.5 text-xs font-medium"
          >
            <Download className="h-3.5 w-3.5" />
            Export Excel (CSV)
          </Button>

          <Button
            size="sm"
            onClick={handlePrint}
            className="h-9 gap-1.5 text-xs font-semibold bg-primary text-primary-foreground hover:bg-primary/90"
          >
            <Printer className="h-3.5 w-3.5" />
            Cetak / Simpan PDF
          </Button>
        </div>
      </div>

      {/* Summary KPI Cards (Screen Only) */}
      <div className="print:hidden">
        {activeTab === 'keuangan' && (
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="p-4 rounded-xl border bg-card text-card-foreground shadow-sm">
              <span className="text-xs text-muted-foreground block">Total Pemasukan</span>
              <p className="text-xl font-bold text-emerald-600 dark:text-emerald-400 mt-1">
                {formatRupiah(keuanganData.totalPemasukan)}
              </p>
              <p className="text-[11px] text-muted-foreground mt-0.5">Dari iuran & donatur</p>
            </div>
            <div className="p-4 rounded-xl border bg-card text-card-foreground shadow-sm">
              <span className="text-xs text-muted-foreground block">Total Pengeluaran</span>
              <p className="text-xl font-bold text-rose-600 dark:text-rose-400 mt-1">
                {formatRupiah(keuanganData.totalPengeluaran)}
              </p>
              <p className="text-[11px] text-muted-foreground mt-0.5">Operasional & kegiatan</p>
            </div>
            <div className="p-4 rounded-xl border bg-card text-card-foreground shadow-sm">
              <span className="text-xs text-muted-foreground block">Saldo Kas Terkini</span>
              <p className="text-xl font-bold text-primary mt-1">
                {formatRupiah(keuanganData.saldoBersih)}
              </p>
              <p className="text-[11px] text-muted-foreground mt-0.5">Kas bersih kas organisasi</p>
            </div>
          </div>
        )}

        {activeTab === 'kegiatan' && (
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="p-4 rounded-xl border bg-card text-card-foreground shadow-sm">
              <span className="text-xs text-muted-foreground block">Total Program Kerja</span>
              <p className="text-xl font-bold text-foreground mt-1">{kegiatanData.totalKegiatan} Kegiatan</p>
            </div>
            <div className="p-4 rounded-xl border bg-card text-card-foreground shadow-sm">
              <span className="text-xs text-muted-foreground block">Kegiatan Terlaksana</span>
              <p className="text-xl font-bold text-emerald-600 dark:text-emerald-400 mt-1">
                {kegiatanData.kegiatanSelesai} Sukses
              </p>
            </div>
            <div className="p-4 rounded-xl border bg-card text-card-foreground shadow-sm">
              <span className="text-xs text-muted-foreground block">Kegiatan Mendatang</span>
              <p className="text-xl font-bold text-amber-600 dark:text-amber-400 mt-1">
                {kegiatanData.kegiatanMendatang} Terjadwal
              </p>
            </div>
          </div>
        )}

        {activeTab === 'anggota' && (
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="p-4 rounded-xl border bg-card text-card-foreground shadow-sm">
              <span className="text-xs text-muted-foreground block">Total Buku Induk</span>
              <p className="text-xl font-bold text-foreground mt-1">{anggotaData.total} Orang</p>
            </div>
            <div className="p-4 rounded-xl border bg-card text-card-foreground shadow-sm">
              <span className="text-xs text-muted-foreground block">Pemuda (Laki-laki)</span>
              <p className="text-xl font-bold text-blue-600 dark:text-blue-400 mt-1">
                {anggotaData.pria} Orang
              </p>
            </div>
            <div className="p-4 rounded-xl border bg-card text-card-foreground shadow-sm">
              <span className="text-xs text-muted-foreground block">Pemudi (Perempuan)</span>
              <p className="text-xl font-bold text-pink-600 dark:text-pink-400 mt-1">
                {anggotaData.wanita} Orang
              </p>
            </div>
          </div>
        )}
      </div>

      {/* DOCUMENT PREVIEW CONTAINER */}
      <div
        className={`rounded-2xl transition-colors duration-200 ${
          isPaper
            ? 'bg-white text-gray-900 border border-gray-300 shadow-2xl p-6 sm:p-12 max-w-4xl mx-auto'
            : 'bg-card text-card-foreground border border-border shadow-sm p-6 sm:p-10'
        } print:border-none print:shadow-none print:p-0 print:m-0 print:max-w-none print:bg-white print:text-black`}
      >
        {/* OFFICIAL KOP SURAT */}
        <div
          className={`border-b-2 pb-4 mb-6 ${
            isPaper
              ? 'border-gray-900'
              : 'border-border'
          } print:border-black`}
        >
          <div className="flex items-center gap-4">
            <img
              src="/images/logo.png"
              alt="Logo"
              className="h-16 w-16 object-contain shrink-0"
            />
            <div className="text-center flex-1">
              <h2
                className={`text-lg font-bold tracking-wider uppercase font-serif ${
                  isPaper ? 'text-gray-900' : 'text-foreground'
                } print:text-black`}
              >
                {orgInfo.nama_organisasi}
              </h2>
              <p
                className={`text-xs font-semibold uppercase tracking-wide ${
                  isPaper ? 'text-gray-800' : 'text-foreground/90'
                } print:text-black`}
              >
                {orgInfo.nama_dusun}, Desa {orgInfo.desa}, Kab. {orgInfo.kabupaten}
              </p>
              <p
                className={`text-[11px] italic mt-0.5 ${
                  isPaper ? 'text-gray-600' : 'text-muted-foreground'
                } print:text-gray-700`}
              >
                Alamat: {orgInfo.alamat} · Kontak: {orgInfo.telepon} · Email: {orgInfo.email}
              </p>
            </div>
          </div>
        </div>

        {/* DOCUMENT TITLE & METADATA */}
        <div className="text-center mb-6 space-y-1">
          <h3
            className={`text-base font-bold uppercase underline tracking-wide font-serif ${
              isPaper ? 'text-gray-900' : 'text-foreground'
            } print:text-black`}
          >
            {activeTab === 'keuangan' && 'LAPORAN REKAPITULASI KEUANGAN ORGANISASI'}
            {activeTab === 'kegiatan' && 'LAPORAN REKAPITULASI REALISASI PROGRAM KEGIATAN'}
            {activeTab === 'anggota' && 'BUKU INDUK KEANGGOTAAN PEMUDA KARANG TARUNA'}
          </h3>
          <p
            className={`text-xs ${
              isPaper ? 'text-gray-600' : 'text-muted-foreground'
            } print:text-gray-700`}
          >
            Dicetak pada: {printDateStr} · Status: Dokumen Resmi Terverifikasi
          </p>
        </div>

        {/* CONTENT TAB 1: KEUANGAN */}
        {activeTab === 'keuangan' && (
          <div className="space-y-4">
            <div className="overflow-x-hidden">
              <table className={`w-full text-xs text-left border ${tableBorder} border-collapse table-fixed print:border-black`}>
                <thead>
                  <tr className="print:bg-gray-100 print:text-black print:border-black">
                    <th className={`${thStyle} w-[6%] text-center print:border-black`}>No</th>
                    <th className={`${thStyle} w-[14%] print:border-black`}>Tanggal</th>
                    <th className={`${thStyle} w-[12%] text-center print:border-black`}>Tipe</th>
                    <th className={`${thStyle} w-[18%] print:border-black`}>Kategori</th>
                    <th className={`${thStyle} w-[26%] print:border-black`}>Keterangan</th>
                    <th className={`${thStyle} w-[12%] text-right print:border-black`}>Pemasukan</th>
                    <th className={`${thStyle} w-[12%] text-right print:border-black`}>Pengeluaran</th>
                  </tr>
                </thead>
                <tbody className={`divide-y ${isPaper ? 'divide-gray-200' : 'divide-border'} print:divide-black/20`}>
                  {keuanganData.items.map((item, idx) => (
                    <tr key={item.id} className={`${trStyle} print:border-black/10`}>
                      <td className={`${tdStyle} text-center print:border-black/20`}>{idx + 1}</td>
                      <td className={`${tdStyle} print:border-black/20`}>{item.tanggal}</td>
                      <td className={`${tdStyle} text-center uppercase font-medium print:border-black/20`}>
                        {item.tipe}
                      </td>
                      <td className={`${tdStyle} truncate print:border-black/20`}>{item.kategori}</td>
                      <td className={`${tdStyle} truncate print:border-black/20`} title={item.keterangan}>
                        {item.keterangan}
                      </td>
                      <td className={`${tdStyle} text-right font-medium print:border-black/20 ${
                        item.tipe === 'pemasukan' ? (isPaper ? 'text-emerald-700 font-semibold' : 'text-emerald-600 dark:text-emerald-400') : ''
                      } print:text-black`}>
                        {item.tipe === 'pemasukan' ? formatRupiah(item.jumlah) : '-'}
                      </td>
                      <td className={`${tdStyle} text-right font-medium ${
                        item.tipe === 'pengeluaran' ? (isPaper ? 'text-rose-700 font-semibold' : 'text-rose-600 dark:text-rose-400') : ''
                      } print:text-black`}>
                        {item.tipe === 'pengeluaran' ? formatRupiah(item.jumlah) : '-'}
                      </td>
                    </tr>
                  ))}
                </tbody>
                <tfoot>
                  <tr className={`font-bold border-t ${
                    isPaper ? 'bg-gray-100 text-gray-900 border-gray-900' : 'bg-muted/70 text-foreground border-border'
                  } print:bg-gray-100 print:text-black print:border-black`}>
                    <td colSpan={5} className="py-2 px-2 text-right border-r border-inherit uppercase">
                      Total Akumulasi
                    </td>
                    <td className={`py-2 px-2 text-right border-r border-inherit ${
                      isPaper ? 'text-emerald-800' : 'text-emerald-600 dark:text-emerald-400'
                    } print:text-black`}>
                      {formatRupiah(keuanganData.totalPemasukan)}
                    </td>
                    <td className={`py-2 px-2 text-right ${
                      isPaper ? 'text-rose-800' : 'text-rose-600 dark:text-rose-400'
                    } print:text-black`}>
                      {formatRupiah(keuanganData.totalPengeluaran)}
                    </td>
                  </tr>
                  <tr className={`font-bold border-t ${
                    isPaper ? 'bg-gray-200 text-gray-900 border-gray-900' : 'bg-muted text-foreground border-border'
                  } print:bg-gray-200 print:text-black print:border-black`}>
                    <td colSpan={5} className="py-2 px-2 text-right border-r border-inherit uppercase">
                      Sisa Saldo Kas Bersih
                    </td>
                    <td colSpan={2} className={`py-2 px-2 text-right font-bold text-sm ${
                      isPaper ? 'text-gray-950' : 'text-primary'
                    } print:text-black`}>
                      {formatRupiah(keuanganData.saldoBersih)}
                    </td>
                  </tr>
                </tfoot>
              </table>
            </div>
          </div>
        )}

        {/* CONTENT TAB 2: KEGIATAN */}
        {activeTab === 'kegiatan' && (
          <div className="space-y-4">
            <div className="overflow-x-hidden">
              <table className={`w-full text-xs text-left border ${tableBorder} border-collapse table-fixed print:border-black`}>
                <thead>
                  <tr className="print:bg-gray-100 print:text-black print:border-black">
                    <th className={`${thStyle} w-[6%] text-center print:border-black`}>No</th>
                    <th className={`${thStyle} w-[24%] print:border-black`}>Nama Kegiatan</th>
                    <th className={`${thStyle} w-[15%] print:border-black`}>Tanggal</th>
                    <th className={`${thStyle} w-[18%] print:border-black`}>Lokasi</th>
                    <th className={`${thStyle} w-[12%] text-center print:border-black`}>Status</th>
                    <th className={`${thStyle} w-[25%] print:border-black`}>Deskripsi / Hasil</th>
                  </tr>
                </thead>
                <tbody className={`divide-y ${isPaper ? 'divide-gray-200' : 'divide-border'} print:divide-black/20`}>
                  {kegiatanData.items.map((item, idx) => (
                    <tr key={item.id} className={`${trStyle} print:border-black/10`}>
                      <td className={`${tdStyle} text-center print:border-black/20`}>{idx + 1}</td>
                      <td className={`${tdStyle} font-semibold truncate print:border-black/20`} title={item.judul}>
                        {item.judul}
                      </td>
                      <td className={`${tdStyle} print:border-black/20`}>{item.tanggal}</td>
                      <td className={`${tdStyle} truncate print:border-black/20`}>{item.lokasi || '-'}</td>
                      <td className={`${tdStyle} text-center uppercase font-medium print:border-black/20`}>
                        {item.status}
                      </td>
                      <td className={`${tdStyle} truncate`} title={item.deskripsi}>
                        {item.deskripsi}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* CONTENT TAB 3: ANGGOTA */}
        {activeTab === 'anggota' && (
          <div className="space-y-4">
            <div className="overflow-x-hidden">
              <table className={`w-full text-xs text-left border ${tableBorder} border-collapse table-fixed print:border-black`}>
                <thead>
                  <tr className="print:bg-gray-100 print:text-black print:border-black">
                    <th className={`${thStyle} w-[5%] text-center print:border-black`}>No</th>
                    <th className={`${thStyle} w-[22%] print:border-black`}>Nama Lengkap</th>
                    <th className={`${thStyle} w-[8%] text-center print:border-black`}>L/P</th>
                    <th className={`${thStyle} w-[15%] print:border-black`}>TTL</th>
                    <th className={`${thStyle} w-[10%] text-center print:border-black`}>Wilayah</th>
                    <th className={`${thStyle} w-[12%] text-center print:border-black`}>Status</th>
                    <th className={`${thStyle} w-[14%] print:border-black`}>Jabatan</th>
                    <th className={`${thStyle} w-[14%] print:border-black`}>Minat / Bakat</th>
                  </tr>
                </thead>
                <tbody className={`divide-y ${isPaper ? 'divide-gray-200' : 'divide-border'} print:divide-black/20`}>
                  {anggotaData.items.map((item, idx) => (
                    <tr key={item.id} className={`${trStyle} print:border-black/10`}>
                      <td className={`${tdStyle} text-center print:border-black/20`}>{idx + 1}</td>
                      <td className={`${tdStyle} font-semibold truncate print:border-black/20`} title={item.nama}>
                        {item.nama}
                      </td>
                      <td className={`${tdStyle} text-center print:border-black/20`}>{item.jenis_kelamin}</td>
                      <td className={`${tdStyle} truncate print:border-black/20`}>
                        {item.tempat_lahir || '-'}{item.tanggal_lahir ? `, ${item.tanggal_lahir}` : ''}
                      </td>
                      <td className={`${tdStyle} text-center print:border-black/20`}>
                        RT {item.rt} / RW {item.rw}
                      </td>
                      <td className={`${tdStyle} text-center print:border-black/20`}>{item.status}</td>
                      <td className={`${tdStyle} truncate print:border-black/20`}>{item.jabatan || 'Anggota'}</td>
                      <td className={`${tdStyle} truncate`}>{item.minat_bakat || '-'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* OFFICIAL SIGNATURE SECTION */}
        <div
          className={`mt-12 pt-4 grid grid-cols-2 text-center text-xs break-inside-avoid ${
            isPaper ? 'text-gray-900' : 'text-foreground'
          } print:text-black`}
        >
          <div className="space-y-16">
            <p className="font-medium">
              Mengetahui,<br />
              <strong>Ketua Karang Taruna</strong>
            </p>
            <div>
              <p
                className={`font-bold underline text-sm ${
                  isPaper ? 'text-gray-900' : 'text-foreground'
                } print:text-black`}
              >
                {orgInfo.ketua_nama}
              </p>
              <p
                className={`text-[11px] ${
                  isPaper ? 'text-gray-600' : 'text-muted-foreground'
                } print:text-gray-700`}
              >
                NRP: KT-01-2024
              </p>
            </div>
          </div>

          <div className="space-y-16">
            <p className="font-medium">
              Sumurgintung, {printDateStr}<br />
              <strong>{activeTab === 'keuangan' ? 'Bendahara Umum' : 'Sekretaris Umum'}</strong>
            </p>
            <div>
              <p
                className={`font-bold underline text-sm ${
                  isPaper ? 'text-gray-900' : 'text-foreground'
                } print:text-black`}
              >
                {activeTab === 'keuangan' ? orgInfo.bendahara_nama : orgInfo.sekretaris_nama}
              </p>
              <p
                className={`text-[11px] ${
                  isPaper ? 'text-gray-600' : 'text-muted-foreground'
                } print:text-gray-700`}
              >
                NRP: KT-01-2025
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
