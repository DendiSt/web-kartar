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

  return (
    <div className="space-y-6">
      {/* Tab Navigation (Hidden on Print) */}
      <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center justify-between print:hidden">
        <div className="inline-flex p-1 rounded-xl bg-muted border space-x-1">
          <button
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

        {/* Global Action Buttons */}
        <div className="flex items-center gap-2">
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
            <div className="p-4 rounded-xl border bg-card shadow-sm">
              <span className="text-xs text-muted-foreground block">Total Pemasukan</span>
              <p className="text-xl font-bold text-emerald-600 dark:text-emerald-400 mt-1">
                {formatRupiah(keuanganData.totalPemasukan)}
              </p>
              <p className="text-[11px] text-muted-foreground mt-0.5">Dari iuran & donatur</p>
            </div>
            <div className="p-4 rounded-xl border bg-card shadow-sm">
              <span className="text-xs text-muted-foreground block">Total Pengeluaran</span>
              <p className="text-xl font-bold text-rose-600 dark:text-rose-400 mt-1">
                {formatRupiah(keuanganData.totalPengeluaran)}
              </p>
              <p className="text-[11px] text-muted-foreground mt-0.5">Operasional & kegiatan</p>
            </div>
            <div className="p-4 rounded-xl border bg-card shadow-sm">
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
            <div className="p-4 rounded-xl border bg-card shadow-sm">
              <span className="text-xs text-muted-foreground block">Total Program Kerja</span>
              <p className="text-xl font-bold text-foreground mt-1">{kegiatanData.totalKegiatan} Kegiatan</p>
            </div>
            <div className="p-4 rounded-xl border bg-card shadow-sm">
              <span className="text-xs text-muted-foreground block">Kegiatan Terlaksana</span>
              <p className="text-xl font-bold text-emerald-600 dark:text-emerald-400 mt-1">
                {kegiatanData.kegiatanSelesai} Sukses
              </p>
            </div>
            <div className="p-4 rounded-xl border bg-card shadow-sm">
              <span className="text-xs text-muted-foreground block">Kegiatan Mendatang</span>
              <p className="text-xl font-bold text-amber-600 dark:text-amber-400 mt-1">
                {kegiatanData.kegiatanMendatang} Terjadwal
              </p>
            </div>
          </div>
        )}

        {activeTab === 'anggota' && (
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="p-4 rounded-xl border bg-card shadow-sm">
              <span className="text-xs text-muted-foreground block">Total Buku Induk</span>
              <p className="text-xl font-bold text-foreground mt-1">{anggotaData.total} Orang</p>
            </div>
            <div className="p-4 rounded-xl border bg-card shadow-sm">
              <span className="text-xs text-muted-foreground block">Pemuda (Laki-laki)</span>
              <p className="text-xl font-bold text-blue-600 dark:text-blue-400 mt-1">
                {anggotaData.pria} Orang
              </p>
            </div>
            <div className="p-4 rounded-xl border bg-card shadow-sm">
              <span className="text-xs text-muted-foreground block">Pemudi (Perempuan)</span>
              <p className="text-xl font-bold text-pink-600 dark:text-pink-400 mt-1">
                {anggotaData.wanita} Orang
              </p>
            </div>
          </div>
        )}
      </div>

      {/* DOCUMENT PREVIEW CONTAINER (Styled for Screen & Perfect for Print) */}
      <div className="rounded-xl border bg-card shadow-sm p-6 sm:p-10 print:border-none print:shadow-none print:p-0 print:bg-white print:text-black">
        {/* OFFICIAL KOP SURAT */}
        <div className="border-b-2 border-black pb-4 mb-6">
          <div className="flex items-center gap-4">
            <img
              src="/images/logo.png"
              alt="Logo"
              className="h-16 w-16 object-contain shrink-0"
            />
            <div className="text-center flex-1">
              <h2 className="text-lg font-bold tracking-wider uppercase text-black font-serif">
                {orgInfo.nama_organisasi}
              </h2>
              <p className="text-xs font-semibold text-black uppercase tracking-wide">
                {orgInfo.nama_dusun}, Desa {orgInfo.desa}, Kab. {orgInfo.kabupaten}
              </p>
              <p className="text-[11px] text-gray-700 italic mt-0.5">
                Alamat: {orgInfo.alamat} · Kontak: {orgInfo.telepon} · Email: {orgInfo.email}
              </p>
            </div>
          </div>
        </div>

        {/* DOCUMENT TITLE & METADATA */}
        <div className="text-center mb-6 space-y-1">
          <h3 className="text-base font-bold uppercase underline tracking-wide text-black font-serif">
            {activeTab === 'keuangan' && 'LAPORAN REKAPITULASI KEUANGAN ORGANISASI'}
            {activeTab === 'kegiatan' && 'LAPORAN REKAPITULASI REALISASI PROGRAM KEGIATAN'}
            {activeTab === 'anggota' && 'BUKU INDUK KEANGGOTAAN PEMUDA KARANG TARUNA'}
          </h3>
          <p className="text-xs text-gray-700">
            Dicetak pada: {printDateStr} · Status: Dokumen Resmi Terverifikasi
          </p>
        </div>

        {/* CONTENT TAB 1: KEUANGAN */}
        {activeTab === 'keuangan' && (
          <div className="space-y-4">
            <div className="overflow-x-hidden">
              <table className="w-full text-xs text-left border border-black border-collapse table-fixed">
                <thead>
                  <tr className="bg-gray-100 text-black border-b border-black font-bold">
                    <th className="py-2 px-2 border-r border-black w-[6%] text-center">No</th>
                    <th className="py-2 px-2 border-r border-black w-[14%]">Tanggal</th>
                    <th className="py-2 px-2 border-r border-black w-[12%] text-center">Tipe</th>
                    <th className="py-2 px-2 border-r border-black w-[18%]">Kategori</th>
                    <th className="py-2 px-2 border-r border-black w-[26%]">Keterangan</th>
                    <th className="py-2 px-2 border-r border-black w-[12%] text-right">Pemasukan</th>
                    <th className="py-2 px-2 w-[12%] text-right">Pengeluaran</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-black/20 text-black">
                  {keuanganData.items.map((item, idx) => (
                    <tr key={item.id} className="border-b border-black/10">
                      <td className="py-1.5 px-2 border-r border-black/20 text-center">{idx + 1}</td>
                      <td className="py-1.5 px-2 border-r border-black/20">{item.tanggal}</td>
                      <td className="py-1.5 px-2 border-r border-black/20 text-center uppercase font-medium">
                        {item.tipe}
                      </td>
                      <td className="py-1.5 px-2 border-r border-black/20 truncate">{item.kategori}</td>
                      <td className="py-1.5 px-2 border-r border-black/20 truncate" title={item.keterangan}>
                        {item.keterangan}
                      </td>
                      <td className="py-1.5 px-2 border-r border-black/20 text-right font-medium">
                        {item.tipe === 'pemasukan' ? formatRupiah(item.jumlah) : '-'}
                      </td>
                      <td className="py-1.5 px-2 text-right font-medium text-black">
                        {item.tipe === 'pengeluaran' ? formatRupiah(item.jumlah) : '-'}
                      </td>
                    </tr>
                  ))}
                </tbody>
                <tfoot>
                  <tr className="bg-gray-100 font-bold border-t border-black text-black">
                    <td colSpan={5} className="py-2 px-2 text-right border-r border-black uppercase">
                      Total Akumulasi
                    </td>
                    <td className="py-2 px-2 text-right border-r border-black text-emerald-800">
                      {formatRupiah(keuanganData.totalPemasukan)}
                    </td>
                    <td className="py-2 px-2 text-right text-rose-800">
                      {formatRupiah(keuanganData.totalPengeluaran)}
                    </td>
                  </tr>
                  <tr className="bg-gray-200 font-bold border-t border-black text-black">
                    <td colSpan={5} className="py-2 px-2 text-right border-r border-black uppercase">
                      Sisa Saldo Kas Bersih
                    </td>
                    <td colSpan={2} className="py-2 px-2 text-right font-bold text-sm">
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
              <table className="w-full text-xs text-left border border-black border-collapse table-fixed">
                <thead>
                  <tr className="bg-gray-100 text-black border-b border-black font-bold">
                    <th className="py-2 px-2 border-r border-black w-[6%] text-center">No</th>
                    <th className="py-2 px-3 border-r border-black w-[24%]">Nama Kegiatan</th>
                    <th className="py-2 px-2 border-r border-black w-[15%]">Tanggal</th>
                    <th className="py-2 px-2 border-r border-black w-[18%]">Lokasi</th>
                    <th className="py-2 px-2 border-r border-black w-[12%] text-center">Status</th>
                    <th className="py-2 px-3 w-[25%]">Deskripsi / Hasil</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-black/20 text-black">
                  {kegiatanData.items.map((item, idx) => (
                    <tr key={item.id} className="border-b border-black/10">
                      <td className="py-2 px-2 border-r border-black/20 text-center">{idx + 1}</td>
                      <td className="py-2 px-3 border-r border-black/20 font-semibold truncate" title={item.judul}>
                        {item.judul}
                      </td>
                      <td className="py-2 px-2 border-r border-black/20">{item.tanggal}</td>
                      <td className="py-2 px-2 border-r border-black/20 truncate">{item.lokasi || '-'}</td>
                      <td className="py-2 px-2 border-r border-black/20 text-center uppercase font-medium">
                        {item.status}
                      </td>
                      <td className="py-2 px-3 truncate" title={item.deskripsi}>
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
              <table className="w-full text-xs text-left border border-black border-collapse table-fixed">
                <thead>
                  <tr className="bg-gray-100 text-black border-b border-black font-bold">
                    <th className="py-2 px-2 border-r border-black w-[5%] text-center">No</th>
                    <th className="py-2 px-3 border-r border-black w-[22%]">Nama Lengkap</th>
                    <th className="py-2 px-2 border-r border-black w-[8%] text-center">L/P</th>
                    <th className="py-2 px-2 border-r border-black w-[15%]">TTL</th>
                    <th className="py-2 px-2 border-r border-black w-[10%] text-center">Wilayah</th>
                    <th className="py-2 px-2 border-r border-black w-[12%] text-center">Status</th>
                    <th className="py-2 px-2 border-r border-black w-[14%]">Jabatan</th>
                    <th className="py-2 px-2 w-[14%]">Minat / Bakat</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-black/20 text-black">
                  {anggotaData.items.map((item, idx) => (
                    <tr key={item.id} className="border-b border-black/10">
                      <td className="py-2 px-2 border-r border-black/20 text-center">{idx + 1}</td>
                      <td className="py-2 px-3 border-r border-black/20 font-semibold truncate" title={item.nama}>
                        {item.nama}
                      </td>
                      <td className="py-2 px-2 border-r border-black/20 text-center">{item.jenis_kelamin}</td>
                      <td className="py-2 px-2 border-r border-black/20 truncate">
                        {item.tempat_lahir || '-'}{item.tanggal_lahir ? `, ${item.tanggal_lahir}` : ''}
                      </td>
                      <td className="py-2 px-2 border-r border-black/20 text-center">
                        RT {item.rt} / RW {item.rw}
                      </td>
                      <td className="py-2 px-2 border-r border-black/20 text-center">{item.status}</td>
                      <td className="py-2 px-2 border-r border-black/20 truncate">{item.jabatan || 'Anggota'}</td>
                      <td className="py-2 px-2 truncate">{item.minat_bakat || '-'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* OFFICIAL SIGNATURE SECTION */}
        <div className="mt-12 pt-4 grid grid-cols-2 text-center text-xs text-black break-inside-avoid">
          <div className="space-y-16">
            <p className="font-medium">
              Mengetahui,<br />
              <strong>Ketua Karang Taruna</strong>
            </p>
            <div>
              <p className="font-bold underline text-sm">{orgInfo.ketua_nama}</p>
              <p className="text-[11px] text-gray-700">NRP: KT-01-2024</p>
            </div>
          </div>

          <div className="space-y-16">
            <p className="font-medium">
              Sumurgintung, {printDateStr}<br />
              <strong>{activeTab === 'keuangan' ? 'Bendahara Umum' : 'Sekretaris Umum'}</strong>
            </p>
            <div>
              <p className="font-bold underline text-sm">
                {activeTab === 'keuangan' ? orgInfo.bendahara_nama : orgInfo.sekretaris_nama}
              </p>
              <p className="text-[11px] text-gray-700">NRP: KT-01-2025</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
