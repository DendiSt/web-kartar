'use client'

import { useState } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Search, Download, ExternalLink, FileText, FileSpreadsheet, FileArchive, Hash, FolderArchive } from 'lucide-react'
import { incrementDokumenDownload } from '@/app/actions/dokumen'

interface DokumenItem {
  id: string
  judul: string
  nomor_surat: string | null
  kategori: string
  deskripsi: string | null
  file_url: string
  file_name: string | null
  file_size: string | null
  file_type: string | null
  tahun: number | null
  downloads: number
  is_public: boolean
  created_at: string | null
}

const categories = [
  { id: 'semua', label: 'Semua Dokumen' },
  { id: 'sk', label: '📄 SK Pengurus' },
  { id: 'ad_art', label: '📜 AD / ART' },
  { id: 'proposal', label: '📑 Proposal' },
  { id: 'lpj', label: '📊 LPJ' },
  { id: 'surat', label: '✉️ Surat Resmi' },
  { id: 'lain_lain', label: '📁 Lainnya' }
]

export default function DokumenListClient({ initialData }: { initialData: DokumenItem[] }) {
  const [activeCategory, setActiveCategory] = useState('semua')
  const [activeTahun, setActiveTahun] = useState<string>('semua')
  const [searchQuery, setSearchQuery] = useState('')
  const [items, setItems] = useState<DokumenItem[]>(initialData)

  // Collect available years
  const availableYears = Array.from(
    new Set(initialData.map((d) => d.tahun).filter(Boolean) as number[])
  ).sort((a, b) => b - a)

  const filteredData = items.filter((item) => {
    const matchesCategory = activeCategory === 'semua' || item.kategori === activeCategory
    const matchesTahun = activeTahun === 'semua' || String(item.tahun) === activeTahun
    const matchesSearch = item.judul.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (item.nomor_surat && item.nomor_surat.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (item.deskripsi && item.deskripsi.toLowerCase().includes(searchQuery.toLowerCase()))
    return matchesCategory && matchesTahun && matchesSearch
  })

  const handleDownload = async (item: DokumenItem) => {
    // Increment download counter
    await incrementDokumenDownload(item.id)
    setItems((prev) =>
      prev.map((doc) =>
        doc.id === item.id ? { ...doc, downloads: doc.downloads + 1 } : doc
      )
    )
    // Open/download file
    window.open(item.file_url, '_blank')
  }

  const getKategoriBadge = (kategori: string) => {
    switch (kategori) {
      case 'sk':
        return { label: 'SK Pengurus', class: 'bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-300 border-blue-200 dark:border-blue-800' }
      case 'ad_art':
        return { label: 'AD / ART', class: 'bg-purple-100 text-purple-800 dark:bg-purple-950 dark:text-purple-300 border-purple-200 dark:border-purple-800' }
      case 'proposal':
        return { label: 'Proposal', class: 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300 border-amber-200 dark:border-amber-800' }
      case 'lpj':
        return { label: 'LPJ', class: 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800' }
      case 'surat':
        return { label: 'Surat Resmi', class: 'bg-cyan-100 text-cyan-800 dark:bg-cyan-950 dark:text-cyan-300 border-cyan-200 dark:border-cyan-800' }
      default:
        return { label: 'Arsip', class: 'bg-slate-100 text-slate-800 dark:bg-slate-800 dark:text-slate-300 border-slate-200 dark:border-slate-700' }
    }
  }

  const getFileBadge = (fileType: string | null) => {
    const ft = (fileType || 'pdf').toLowerCase()
    if (ft.includes('xls')) {
      return {
        icon: <FileSpreadsheet className="w-5 h-5 text-emerald-600" />,
        name: 'EXCEL',
        bg: 'bg-emerald-50 dark:bg-emerald-950/50 border-emerald-200 dark:border-emerald-800'
      }
    }
    if (ft.includes('zip') || ft.includes('rar')) {
      return {
        icon: <FileArchive className="w-5 h-5 text-amber-600" />,
        name: 'ARCHIVE',
        bg: 'bg-amber-50 dark:bg-amber-950/50 border-amber-200 dark:border-amber-800'
      }
    }
    if (ft.includes('doc')) {
      return {
        icon: <FileText className="w-5 h-5 text-blue-600" />,
        name: 'WORD',
        bg: 'bg-blue-50 dark:bg-blue-950/50 border-blue-200 dark:border-blue-800'
      }
    }
    return {
      icon: <FileText className="w-5 h-5 text-red-500" />,
      name: 'PDF',
      bg: 'bg-red-50 dark:bg-red-950/50 border-red-200 dark:border-red-800'
    }
  }

  return (
    <div className="space-y-8">
      {/* Search & Filter Toolbar */}
      <div className="flex flex-col md:flex-row gap-4 items-center justify-between bg-white dark:bg-[#181b20] p-4 md:p-6 rounded-[20px] border border-[#f0f1f2] dark:border-[#292a2e] shadow-sm">
        {/* Category Pills */}
        <div className="flex items-center gap-2 overflow-x-auto w-full md:w-auto pb-2 md:pb-0 scrollbar-none">
          {categories.map((cat) => (
            <Button
              key={cat.id}
              variant={activeCategory === cat.id ? 'default' : 'outline'}
              size="sm"
              onClick={() => setActiveCategory(cat.id)}
              className={`rounded-full px-4 h-9 text-xs md:text-sm font-medium transition-all shrink-0 ${
                activeCategory === cat.id 
                  ? 'bg-[#1868db] hover:bg-[#1558be] text-white shadow-sm' 
                  : 'border-[#f0f1f2] dark:border-[#292a2e] hover:bg-muted'
              }`}
            >
              {cat.label}
            </Button>
          ))}
        </div>

        {/* Year Filter & Search Input */}
        <div className="flex items-center gap-3 w-full md:w-auto">
          {availableYears.length > 0 && (
            <select
              value={activeTahun}
              onChange={(e) => setActiveTahun(e.target.value)}
              className="h-10 rounded-full border border-[#f0f1f2] dark:border-[#292a2e] bg-background dark:bg-[#181b20] text-foreground dark:text-white px-3 text-xs md:text-sm shadow-sm focus:outline-none"
            >
              <option value="semua" className="bg-white dark:bg-[#181b20] text-[#101214] dark:text-white">Semua Tahun</option>
              {availableYears.map((yr) => (
                <option key={yr} value={String(yr)} className="bg-white dark:bg-[#181b20] text-[#101214] dark:text-white">
                  Tahun {yr}
                </option>
              ))}
            </select>
          )}

          <div className="relative w-full md:w-64">
            <Search className="absolute left-3.5 top-3 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Cari dokumen..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 h-10 rounded-full border-[#f0f1f2] dark:border-[#292a2e] bg-muted/40 focus:bg-background text-sm"
            />
            {searchQuery && (
              <button 
                onClick={() => setSearchQuery('')}
                className="absolute right-3.5 top-3 text-xs text-muted-foreground hover:text-foreground"
              >
                Hapus
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Document Grid */}
      {filteredData.length === 0 ? (
        <div className="text-center py-16 bg-white dark:bg-[#181b20] rounded-[20px] border border-[#f0f1f2] dark:border-[#292a2e] p-8">
          <FolderArchive className="mx-auto h-12 w-12 text-muted-foreground/40 mb-3" />
          <h4 className="font-heading text-lg font-bold">Tidak ada dokumen yang ditemukan</h4>
          <p className="text-sm text-muted-foreground mt-1 max-w-sm mx-auto">
            Belum ada berkas arsip yang sesuai dengan kriteria filter atau pencarian Anda.
          </p>
          {(activeCategory !== 'semua' || activeTahun !== 'semua' || searchQuery) && (
            <Button 
              variant="outline" 
              size="sm" 
              className="mt-4 rounded-full"
              onClick={() => {
                setActiveCategory('semua')
                setActiveTahun('semua')
                setSearchQuery('')
              }}
            >
              Reset Filter
            </Button>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredData.map((item) => {
            const catBadge = getKategoriBadge(item.kategori)
            const fileBadge = getFileBadge(item.file_type)

            return (
              <Card 
                key={item.id}
                className="rounded-[20px] bg-white dark:bg-[#181b20] border border-[#f0f1f2] dark:border-[#292a2e] shadow-[0_0_1px_0_rgba(9,30,66,0.31),0_1px_1px_0_rgba(9,30,66,0.15)] dark:shadow-none p-5 flex flex-col group transition-all hover:translate-y-[-3px]"
              >
                {/* Header row: File icon & Category Badge */}
                <div className="flex items-start justify-between gap-3 mb-4">
                  <div className={`p-3 rounded-xl border flex items-center justify-center ${fileBadge.bg}`}>
                    {fileBadge.icon}
                  </div>

                  <div className="flex flex-col items-end gap-1">
                    <Badge variant="outline" className={`rounded-full text-[11px] font-semibold ${catBadge.class}`}>
                      {catBadge.label}
                    </Badge>
                    {item.tahun && (
                      <span className="text-[11px] font-medium text-muted-foreground">
                        Tahun {item.tahun}
                      </span>
                    )}
                  </div>
                </div>

                {/* Content */}
                <CardContent className="p-0 flex-1 flex flex-col space-y-2.5">
                  {item.nomor_surat && (
                    <div className="flex items-center gap-1 text-[11px] font-mono text-[#1868db] bg-[#1868db]/10 w-fit px-2 py-0.5 rounded-md">
                      <Hash className="w-3 h-3" />
                      <span className="truncate max-w-[220px]" title={item.nomor_surat}>{item.nomor_surat}</span>
                    </div>
                  )}

                  <h3 className="font-heading text-base font-bold line-clamp-2 text-[#101214] dark:text-white leading-snug group-hover:text-[#1868db] transition-colors">
                    {item.judul}
                  </h3>

                  <p className="text-xs sm:text-sm text-[#42526e] dark:text-[#b7b9be] line-clamp-2 leading-relaxed flex-1">
                    {item.deskripsi || item.file_name || 'Dokumen resmi organisasi.'}
                  </p>

                  {/* Metadata: size & downloads */}
                  <div className="pt-3 border-t border-[#f0f1f2] dark:border-[#292a2e] flex items-center justify-between text-[11px] text-muted-foreground">
                    <span>
                      {item.file_size ? `${item.file_size} • ` : ''}{fileBadge.name}
                    </span>
                    <span className="flex items-center gap-1">
                      <Download className="w-3 h-3 text-[#1868db]" />
                      {item.downloads}x diunduh
                    </span>
                  </div>

                  {/* Action buttons */}
                  <div className="pt-2 flex items-center gap-2">
                    <Button 
                      size="sm"
                      onClick={() => handleDownload(item)}
                      className="flex-1 rounded-full h-9 bg-[#1868db] hover:bg-[#1558be] text-white text-xs font-semibold shadow-none gap-1.5"
                    >
                      <Download className="w-3.5 h-3.5" /> Unduh Dokumen
                    </Button>
                    <a
                      href={item.file_url}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center justify-center h-9 px-3 rounded-full border border-[#f0f1f2] dark:border-[#292a2e] text-xs font-medium text-foreground hover:bg-muted transition-colors"
                      title="Pratinjau Dokumen"
                    >
                      <ExternalLink className="w-3.5 h-3.5" />
                    </a>
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </div>
      )}
    </div>
  )
}
