'use client'

import { useState } from 'react'
import Image from 'next/image'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { 
  Users, 
  Network, 
  LayoutGrid, 
  Search, 
  Phone, 
  Mail
} from 'lucide-react'

export interface StrukturMember {
  id: string
  nama_lengkap: string
  jabatan: string
  periode: string
  divisi?: string | null
  urutan?: number | null
  foto_url?: string | null
  no_telepon?: string | null
  email?: string | null
  bio?: string | null
  is_active: boolean
}

interface Props {
  initialMembers: StrukturMember[]
}

export default function StrukturOrganisasiClient({ initialMembers }: Props) {
  const [viewMode, setViewMode] = useState<'diagram' | 'grid'>('diagram')
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedFilter, setSelectedFilter] = useState('semua')

  // Categorize members
  const pembinas: StrukturMember[] = []
  const ketuas: StrukturMember[] = []
  const wakils: StrukturMember[] = []
  const sekretarisList: StrukturMember[] = []
  const bendaharaList: StrukturMember[] = []
  const bidangList: StrukturMember[] = []

  initialMembers.forEach((m) => {
    const j = m.jabatan.toLowerCase().trim()
    if (j.includes('pembina') || j.includes('penasihat') || j.includes('pelindung')) {
      pembinas.push(m)
    } else if (j === 'ketua' || (j.includes('ketua') && !j.includes('wakil') && !j.includes('seksi') && !j.includes('bidang'))) {
      ketuas.push(m)
    } else if (j.includes('wakil')) {
      wakils.push(m)
    } else if (j.includes('sekretaris')) {
      sekretarisList.push(m)
    } else if (j.includes('bendahara')) {
      bendaharaList.push(m)
    } else {
      bidangList.push(m)
    }
  })

  const sortByUrutan = (a: StrukturMember, b: StrukturMember) => (a.urutan ?? 99) - (b.urutan ?? 99)
  pembinas.sort(sortByUrutan)
  ketuas.sort(sortByUrutan)
  wakils.sort(sortByUrutan)
  sekretarisList.sort(sortByUrutan)
  bendaharaList.sort(sortByUrutan)
  bidangList.sort(sortByUrutan)

  // Filtered members for Grid view
  const filteredGridMembers = initialMembers.filter((m) => {
    const matchesSearch = 
      m.nama_lengkap.toLowerCase().includes(searchQuery.toLowerCase()) ||
      m.jabatan.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (m.divisi && m.divisi.toLowerCase().includes(searchQuery.toLowerCase()))

    if (!matchesSearch) return false

    if (selectedFilter === 'semua') return true
    const j = m.jabatan.toLowerCase()
    if (selectedFilter === 'pembina') return j.includes('pembina') || j.includes('penasihat') || j.includes('pelindung')
    if (selectedFilter === 'ketua') return j.includes('ketua')
    if (selectedFilter === 'sekretariat') return j.includes('sekretaris')
    if (selectedFilter === 'keuangan') return j.includes('bendahara')
    if (selectedFilter === 'bidang') return !j.includes('pembina') && !j.includes('ketua') && !j.includes('sekretaris') && !j.includes('bendahara')

    return true
  })

  return (
    <div className="space-y-6 sm:space-y-8">
      {/* View Switcher & Toolbar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-2.5 sm:gap-4 bg-card/60 backdrop-blur-sm p-2 sm:p-3 rounded-xl sm:rounded-2xl border border-border">
        {/* Toggle Buttons */}
        <div className="flex items-center bg-muted/60 p-0.5 sm:p-1 rounded-lg border border-border/80 w-full sm:w-auto">
          <button
            type="button"
            onClick={() => setViewMode('diagram')}
            className={`flex-1 sm:flex-initial flex items-center justify-center gap-1.5 px-3 sm:px-4 py-1.5 sm:py-2 rounded-md text-[11px] sm:text-xs font-semibold transition-all cursor-pointer whitespace-nowrap ${
              viewMode === 'diagram'
                ? 'bg-red-700 text-white shadow-xs'
                : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            <Network className="w-3.5 h-3.5 shrink-0" />
            <span>Bagan Diagram</span>
          </button>
          <button
            type="button"
            onClick={() => setViewMode('grid')}
            className={`flex-1 sm:flex-initial flex items-center justify-center gap-1.5 px-3 sm:px-4 py-1.5 sm:py-2 rounded-md text-[11px] sm:text-xs font-semibold transition-all cursor-pointer whitespace-nowrap ${
              viewMode === 'grid'
                ? 'bg-red-700 text-white shadow-xs'
                : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            <LayoutGrid className="w-3.5 h-3.5 shrink-0" />
            <span>Daftar Pengurus</span>
          </button>
        </div>

        {/* Info Period Badge */}
        <div className="flex items-center justify-between sm:justify-end w-full sm:w-auto gap-2 text-[10px] sm:text-xs text-muted-foreground font-medium px-1 sm:px-0">
          <Badge variant="outline" className="px-2.5 py-0.5 rounded-full text-[10px] sm:text-xs font-bold border-red-500/30 bg-red-500/10 text-red-700 dark:text-red-400">
            Periode 2026 - Sekarang
          </Badge>
          <span>{initialMembers.length} Pengurus Aktif</span>
        </div>
      </div>

      {/* 1. BAGAN DIAGRAM STRUKTUR (STYLE RESMI KARANG TARUNA SEPERTI POSTER) */}
      {viewMode === 'diagram' ? (
        <div className="relative rounded-2xl border-2 sm:border-4 border-red-700/80 dark:border-red-600/70 bg-gradient-to-b from-orange-500/5 via-card to-background p-3 sm:p-6 md:p-8 shadow-xl overflow-x-auto">
          {/* Decorative Corner Accents */}
          <div className="absolute top-0 left-0 w-8 h-8 sm:w-14 sm:h-14 border-t-4 border-l-4 border-orange-500 pointer-events-none rounded-tl-xl" />
          <div className="absolute top-0 right-0 w-8 h-8 sm:w-14 sm:h-14 border-t-4 border-r-4 border-orange-500 pointer-events-none rounded-tr-xl" />
          <div className="absolute bottom-0 left-0 w-8 h-8 sm:w-14 sm:h-14 border-b-4 border-l-4 border-orange-500 pointer-events-none rounded-bl-xl" />
          <div className="absolute bottom-0 right-0 w-8 h-8 sm:w-14 sm:h-14 border-b-4 border-r-4 border-orange-500 pointer-events-none rounded-br-xl" />

          {/* Diagram Title Banner */}
          <div className="text-center pb-5 sm:pb-8 border-b-2 border-red-700/20 dark:border-red-600/30 max-w-2xl mx-auto space-y-1 sm:space-y-1.5">
            <h2 className="text-lg xs:text-xl sm:text-3xl md:text-4xl font-heading font-black tracking-tight text-foreground uppercase">
              Struktur Organisasi
            </h2>
            <h3 className="text-sm xs:text-base sm:text-2xl md:text-3xl font-heading font-black text-red-700 dark:text-red-500 tracking-tight uppercase">
              Karang Taruna Tirtajaya 01
            </h3>
            <p className="text-[10px] xs:text-xs sm:text-sm font-heading font-bold text-muted-foreground uppercase tracking-wider">
              Dusun Sumurgintung &bull; Periode 2026 - Sekarang
            </p>
          </div>

          {/* DIAGRAM FLOW CONTAINER */}
          <div className="min-w-[320px] xs:min-w-[340px] sm:min-w-[580px] md:min-w-[700px] flex flex-col items-center pt-6 sm:pt-8 pb-4">
            {/* TIER 0: PEMBINA / PENASIHAT (JIKA ADA) */}
            {pembinas.length > 0 && (
              <div className="flex flex-col items-center">
                <div className="flex justify-center items-center gap-3">
                  {pembinas.map((item) => (
                    <div key={item.id} className="w-[180px] xs:w-[200px] sm:w-[240px] md:w-[260px]">
                      <PosterCard item={item} />
                    </div>
                  ))}
                </div>
                {/* Line down to Ketua */}
                {ketuas.length > 0 && (
                  <div className="w-1 h-6 sm:h-8 bg-slate-800 dark:bg-slate-300 mx-auto" />
                )}
              </div>
            )}

            {/* TIER 1: KETUA */}
            {ketuas.length > 0 && (
              <div className="flex flex-col items-center">
                <div className="w-[180px] xs:w-[200px] sm:w-[240px] md:w-[260px]">
                  {ketuas.map((item) => (
                    <PosterCard key={item.id} item={item} />
                  ))}
                </div>
                {/* Line down to Wakil */}
                {wakils.length > 0 && (
                  <div className="w-1 h-6 sm:h-8 bg-slate-800 dark:bg-slate-300 mx-auto" />
                )}
              </div>
            )}

            {/* TIER 2: WAKIL KETUA (1 ATAU 2 BERDAMPINGAN) */}
            {wakils.length > 0 && (
              <div className="flex flex-col items-center w-full">
                {wakils.length === 1 ? (
                  /* 1 Wakil Ketua (persis seperti poster referensi) */
                  <div className="w-[180px] xs:w-[200px] sm:w-[240px] md:w-[260px]">
                    <PosterCard item={wakils[0]} />
                  </div>
                ) : (
                  /* 2 Wakil Ketua berdampingan */
                  <div className="flex flex-col items-center w-full">
                    {/* Horizontal Branch Bar linking Wakil 1 & Wakil 2 */}
                    <div className="w-[200px] xs:w-[230px] sm:w-[320px] md:w-[380px] h-1 bg-slate-800 dark:bg-slate-300 relative">
                      <div className="absolute left-0 top-0 w-1 h-4 sm:h-6 bg-slate-800 dark:bg-slate-300" />
                      <div className="absolute right-0 top-0 w-1 h-4 sm:h-6 bg-slate-800 dark:bg-slate-300" />
                    </div>
                    {/* Cards */}
                    <div className="flex justify-center items-center gap-3 sm:gap-6 pt-4 sm:pt-6">
                      {wakils.map((item) => (
                        <div key={item.id} className="w-[145px] xs:w-[160px] sm:w-[210px] md:w-[240px]">
                          <PosterCard item={item} />
                        </div>
                      ))}
                    </div>
                    {/* Stems collecting back to central spine */}
                    <div className="w-[200px] xs:w-[230px] sm:w-[320px] md:w-[380px] h-1 bg-slate-800 dark:bg-slate-300 relative mt-4 sm:mt-6">
                      <div className="absolute left-0 bottom-0 w-1 h-4 sm:h-6 bg-slate-800 dark:bg-slate-300" />
                      <div className="absolute right-0 bottom-0 w-1 h-4 sm:h-6 bg-slate-800 dark:bg-slate-300" />
                    </div>
                  </div>
                )}

                {/* Central Spine down through Sekretaris & Bendahara */}
                {(sekretarisList.length > 0 || bendaharaList.length > 0) && (
                  <div className="w-1 h-6 sm:h-8 bg-slate-800 dark:bg-slate-300 mx-auto" />
                )}
              </div>
            )}

            {/* TIER 3: SEKRETARIS (KIRI) & BENDAHARA (KANAN) - SEPERTI DI GAMBAR CONTOH */}
            {(sekretarisList.length > 0 || bendaharaList.length > 0) && (
              <div className="relative flex items-center justify-center w-full my-1 sm:my-2">
                {/* Central vertical spine passing through the middle */}
                <div className="absolute top-0 bottom-0 w-1 bg-slate-800 dark:bg-slate-300 -z-0" />

                {/* Left (Sekretaris) and Right (Bendahara) Containers */}
                <div className="relative z-10 flex items-center justify-between w-full max-w-[340px] xs:max-w-[370px] sm:max-w-[500px] md:max-w-[620px] px-1 sm:px-4">
                  {/* Left: Sekretaris */}
                  <div className="relative">
                    {/* Horizontal connector into central spine */}
                    <div className="absolute -right-4 sm:-right-8 top-1/2 -translate-y-1/2 w-4 sm:w-8 h-1 bg-slate-800 dark:bg-slate-300 -z-10" />
                    {sekretarisList.length > 0 ? (
                      <div className="w-[145px] xs:w-[160px] sm:w-[210px] md:w-[240px]">
                        <PosterCard item={sekretarisList[0]} />
                      </div>
                    ) : (
                      <div className="w-[145px] xs:w-[160px] sm:w-[210px] md:w-[240px] opacity-0" />
                    )}
                  </div>

                  {/* Right: Bendahara */}
                  <div className="relative">
                    {/* Horizontal connector into central spine */}
                    <div className="absolute -left-4 sm:-left-8 top-1/2 -translate-y-1/2 w-4 sm:w-8 h-1 bg-slate-800 dark:bg-slate-300 -z-10" />
                    {bendaharaList.length > 0 ? (
                      <div className="w-[145px] xs:w-[160px] sm:w-[210px] md:w-[240px]">
                        <PosterCard item={bendaharaList[0]} />
                      </div>
                    ) : (
                      <div className="w-[145px] xs:w-[160px] sm:w-[210px] md:w-[240px] opacity-0" />
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* TIER 4: SEKSI & BIDANG KERJA (BERJEJER DI BAWAH SEPERTI GAMBAR CONTOH) */}
            {bidangList.length > 0 && (
              <div className="flex flex-col items-center w-full mt-1 sm:mt-2">
                {/* Spine drop from Sekretaris/Bendahara */}
                <div className="w-1 h-6 sm:h-8 bg-slate-800 dark:bg-slate-300 mx-auto" />

                {/* Horizontal branch bar across all Bidang */}
                <div className="w-[85%] sm:w-[92%] max-w-4xl h-1 bg-slate-800 dark:bg-slate-300 relative">
                  <div className="absolute left-0 top-0 w-1 h-4 sm:h-6 bg-slate-800 dark:bg-slate-300" />
                  <div className="absolute right-0 top-0 w-1 h-4 sm:h-6 bg-slate-800 dark:bg-slate-300" />
                </div>

                {/* Grid of Bidang Cards */}
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-2 sm:gap-3 w-full max-w-4xl mx-auto pt-4 sm:pt-6">
                  {bidangList.map((item) => (
                    <div key={item.id} className="w-full">
                      <PosterCard item={item} isBidang />
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      ) : (
        /* 2. DAFTAR PENGURUS (GRID VIEW DENGAN FILTER & SEARCH) */
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row gap-2.5 items-stretch sm:items-center justify-between">
            {/* Search */}
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground" />
              <Input
                placeholder="Cari nama, jabatan, atau divisi..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9 h-9 rounded-xl bg-card text-xs sm:text-sm"
              />
            </div>

            {/* Filter */}
            <div className="flex items-center gap-1.5 bg-card px-2.5 py-1.5 rounded-xl border border-border">
              <span className="text-[11px] text-muted-foreground">Kategori:</span>
              <select
                value={selectedFilter}
                onChange={(e) => setSelectedFilter(e.target.value)}
                className="bg-transparent text-[11px] font-semibold text-foreground cursor-pointer focus:outline-none"
              >
                <option value="semua">Semua Posisi</option>
                <option value="pembina">Pembina / Penasihat</option>
                <option value="ketua">Ketua & Wakil</option>
                <option value="sekretariat">Sekretaris</option>
                <option value="keuangan">Bendahara</option>
                <option value="bidang">Seksi / Bidang</option>
              </select>
            </div>
          </div>

          {filteredGridMembers.length === 0 ? (
            <div className="text-center py-12 bg-card rounded-xl border border-border space-y-1.5">
              <Users className="w-8 h-8 text-muted-foreground/30 mx-auto" />
              <p className="text-xs sm:text-sm font-semibold text-foreground">Tidak ada pengurus ditemukan.</p>
              <p className="text-[11px] text-muted-foreground">Coba ubah kata kunci pencarian Anda.</p>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2.5 sm:gap-4">
              {filteredGridMembers.map((item) => (
                <div key={item.id} className="w-full">
                  <PosterCard item={item} />
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  )
}

/**
 * Card bergaya resmi Karang Taruna (sesuai contoh gambar):
 * - Kiri: Kotak foto / avatar berbingkai merah
 * - Kanan Atas: Header merah dengan teks putih tebal (JABATAN)
 * - Kanan Bawah: Kotak kuning muda / cream dengan teks gelap tebal (NAMA)
 */
function PosterCard({
  item,
  isBidang = false
}: {
  item: StrukturMember
  isBidang?: boolean
}) {
  const initials = item.nama_lengkap
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((w) => w[0]?.toUpperCase())
    .join('') || 'KT'

  return (
    <div className="flex rounded-lg sm:rounded-xl overflow-hidden border-2 border-red-700 dark:border-red-600 shadow-md bg-white dark:bg-zinc-900 group transition-all duration-200 hover:shadow-lg hover:-translate-y-0.5">
      {/* KIRI: KOTAK FOTO / PLACEHOLDER (BERBINGKAI MERAH) */}
      <div className={`relative ${isBidang ? 'w-10 sm:w-12' : 'w-12 xs:w-14 sm:w-16 md:w-20'} bg-red-700 dark:bg-red-800 flex items-center justify-center p-0.5 sm:p-1 shrink-0 overflow-hidden`}>
        {item.foto_url ? (
          <div className="relative w-full h-full aspect-square rounded overflow-hidden bg-white">
            <Image
              src={item.foto_url}
              alt={item.nama_lengkap}
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-300"
              sizes="80px"
            />
          </div>
        ) : (
          <div className="w-full h-full aspect-square rounded bg-red-800 dark:bg-red-900/60 border border-red-500/40 flex flex-col items-center justify-center text-white">
            <span className="font-heading font-black text-[10px] xs:text-xs sm:text-sm md:text-base tracking-wider">
              {initials}
            </span>
          </div>
        )}
      </div>

      {/* KANAN: BARIS ATAS (JABATAN MERAH) & BARIS BAWAH (NAMA KUNING/CREAM) */}
      <div className="flex-1 flex flex-col justify-between min-w-0">
        {/* Header Bar Jabatan: Background Merah, Teks Putih Tebal */}
        <div className="bg-red-700 dark:bg-red-800 text-white px-1.5 sm:px-2 py-0.5 sm:py-1 text-center border-b border-red-800">
          <span className={`font-heading font-black tracking-wider uppercase line-clamp-1 block leading-tight ${
            isBidang ? 'text-[7px] sm:text-[9px]' : 'text-[8px] xs:text-[9px] sm:text-xs md:text-sm'
          }`}>
            {item.jabatan}
          </span>
        </div>

        {/* Box Nama Pengurus: Background Kuning Cerah/Cream, Teks Gelap Tebal */}
        <div className="bg-[#fff9c4] dark:bg-zinc-800 text-slate-900 dark:text-amber-100 px-1 sm:px-2 py-1 sm:py-1.5 text-center flex-1 flex flex-col items-center justify-center">
          <h4 className={`font-heading font-black uppercase tracking-tight line-clamp-2 leading-tight ${
            isBidang ? 'text-[8px] sm:text-[10px]' : 'text-[9px] xs:text-[10px] sm:text-xs md:text-sm'
          }`}>
            {item.nama_lengkap}
          </h4>
          {item.divisi && (
            <span className="text-[7px] sm:text-[8px] text-red-700 dark:text-red-400 font-bold uppercase line-clamp-1 mt-0.5">
              {item.divisi}
            </span>
          )}
        </div>

        {/* Contact links on hover if present (Desktop only) */}
        {(item.no_telepon || item.email) && (
          <div className="hidden sm:flex items-center justify-center gap-1.5 py-0.5 bg-[#fff59d] dark:bg-zinc-900 border-t border-red-700/20 text-[9px]">
            {item.no_telepon && (
              <a
                href={`https://wa.me/${item.no_telepon.replace(/\D/g, '')}`}
                target="_blank"
                rel="noopener noreferrer"
                title="WhatsApp"
                className="text-emerald-700 dark:text-emerald-400 hover:scale-110 transition-transform"
              >
                <Phone className="w-2.5 h-2.5" />
              </a>
            )}
            {item.email && (
              <a
                href={`mailto:${item.email}`}
                title="Email"
                className="text-red-700 dark:text-red-400 hover:scale-110 transition-transform"
              >
                <Mail className="w-2.5 h-2.5" />
              </a>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
