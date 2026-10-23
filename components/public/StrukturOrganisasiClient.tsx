'use client'

import { useState } from 'react'
import Image from 'next/image'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { 
  Users, 
  Crown, 
  ShieldCheck, 
  Award, 
  Briefcase, 
  Network, 
  LayoutGrid, 
  Search, 
  Phone, 
  Mail,
  Layers
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
  const [viewMode, setViewMode] = useState<'tree' | 'grid'>('tree')
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedFilter, setSelectedFilter] = useState('semua')

  // Categorize members
  const pembinas: StrukturMember[] = []
  const ketuas: StrukturMember[] = []
  const pengurusHarian: StrukturMember[] = [] // Wakil 1, Wakil 2, Sekretaris, Bendahara (4 cards in one row)
  const lainnya: StrukturMember[] = []

  initialMembers.forEach((m) => {
    const j = m.jabatan.toLowerCase().trim()
    if (j.includes('pembina') || j.includes('penasihat') || j.includes('pelindung')) {
      pembinas.push(m)
    } else if (j === 'ketua' || (j.includes('ketua') && !j.includes('wakil') && !j.includes('seksi') && !j.includes('bidang'))) {
      ketuas.push(m)
    } else if (j.includes('wakil') || j.includes('sekretaris') || j.includes('bendahara')) {
      pengurusHarian.push(m)
    } else {
      lainnya.push(m)
    }
  })

  const sortByUrutan = (a: StrukturMember, b: StrukturMember) => (a.urutan ?? 99) - (b.urutan ?? 99)
  pembinas.sort(sortByUrutan)
  ketuas.sort(sortByUrutan)
  pengurusHarian.sort(sortByUrutan)
  lainnya.sort(sortByUrutan)

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
      {/* View Switcher & Toolbar (Compact & Clean on Mobile) */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-2.5 sm:gap-4 bg-card/60 backdrop-blur-sm p-2 sm:p-3 rounded-xl sm:rounded-2xl border border-border">
        {/* Compact Toggle Buttons */}
        <div className="flex items-center bg-muted/60 p-0.5 sm:p-1 rounded-lg border border-border/80 w-full sm:w-auto">
          <button
            type="button"
            onClick={() => setViewMode('tree')}
            className={`flex-1 sm:flex-initial flex items-center justify-center gap-1.5 px-3 sm:px-4 py-1.5 sm:py-2 rounded-md text-[11px] sm:text-xs font-semibold transition-all cursor-pointer whitespace-nowrap ${
              viewMode === 'tree'
                ? 'bg-primary text-primary-foreground shadow-xs'
                : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            <Network className="w-3.5 h-3.5 shrink-0" />
            <span>Bagan Struktur</span>
          </button>
          <button
            type="button"
            onClick={() => setViewMode('grid')}
            className={`flex-1 sm:flex-initial flex items-center justify-center gap-1.5 px-3 sm:px-4 py-1.5 sm:py-2 rounded-md text-[11px] sm:text-xs font-semibold transition-all cursor-pointer whitespace-nowrap ${
              viewMode === 'grid'
                ? 'bg-primary text-primary-foreground shadow-xs'
                : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            <LayoutGrid className="w-3.5 h-3.5 shrink-0" />
            <span>Daftar Pengurus</span>
          </button>
        </div>

        {/* Compact Period Badge & Count */}
        <div className="flex items-center justify-between sm:justify-end w-full sm:w-auto gap-2 text-[10px] sm:text-xs text-muted-foreground font-medium px-1 sm:px-0">
          <Badge variant="outline" className="px-2 sm:px-2.5 py-0.5 rounded-full text-[10px] sm:text-xs font-normal border-primary/20 bg-primary/5 text-primary">
            2026 - Sekarang
          </Badge>
          <span>{initialMembers.length} Pengurus Aktif</span>
        </div>
      </div>

      {/* 1. BAGAN STRUKTUR (ORGANOGRAM COMPACT VIEW: 4 CARDS PER ROW) */}
      {viewMode === 'tree' ? (
        <div className="space-y-2 sm:space-y-4 py-2">
          {/* TIER 1: PEMBINA & PELINDUNG */}
          {pembinas.length > 0 && (
            <div className="flex flex-col items-center">
              <div className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[9px] sm:text-[11px] font-bold uppercase tracking-wider text-amber-700 dark:text-amber-300 bg-amber-500/10 border border-amber-500/20 mb-2">
                <ShieldCheck className="w-3 h-3" />
                Dewan Pembina / Penasihat
              </div>
              <div className="flex flex-wrap justify-center items-center gap-3">
                {pembinas.map((item) => (
                  <div key={item.id} className="w-[105px] xs:w-[115px] sm:w-[160px] md:w-[190px]">
                    <CompactCard item={item} tier="pembina" />
                  </div>
                ))}
              </div>

              {/* Connecting line to Ketua */}
              {ketuas.length > 0 && (
                <div className="flex flex-col items-center my-1">
                  <div className="w-0.5 h-4 sm:h-6 bg-gradient-to-b from-amber-500/50 to-primary/50" />
                  <div className="w-1.5 h-1.5 rounded-full bg-primary/60 -mt-0.5" />
                </div>
              )}
            </div>
          )}

          {/* TIER 2: KETUA */}
          {ketuas.length > 0 && (
            <div className="flex flex-col items-center">
              <div className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[9px] sm:text-[11px] font-bold uppercase tracking-wider text-primary bg-primary/10 border border-primary/20 mb-2">
                <Crown className="w-3 h-3" />
                Ketua Karang Taruna
              </div>
              <div className="flex flex-wrap justify-center items-center gap-3">
                {ketuas.map((item) => (
                  <div key={item.id} className="w-[105px] xs:w-[115px] sm:w-[160px] md:w-[190px]">
                    <CompactCard item={item} tier="ketua" />
                  </div>
                ))}
              </div>

              {/* Connecting branch to 4 Pengurus Harian */}
              {pengurusHarian.length > 0 && (
                <div className="flex flex-col items-center w-full my-1.5">
                  <div className="w-0.5 h-3 sm:h-5 bg-border" />
                  {/* Branch spanning across the 4 cards */}
                  <div className="w-[75%] sm:w-[75%] max-w-2xl h-0.5 bg-border relative">
                    <div className="absolute left-0 top-0 w-0.5 h-3 sm:h-5 bg-border" />
                    <div className="absolute left-[33%] top-0 w-0.5 h-3 sm:h-5 bg-border" />
                    <div className="absolute left-[66%] top-0 w-0.5 h-3 sm:h-5 bg-border" />
                    <div className="absolute right-0 top-0 w-0.5 h-3 sm:h-5 bg-border" />
                  </div>
                  <div className="w-0.5 h-3 sm:h-5 bg-border -mt-0.5" />
                </div>
              )}
            </div>
          )}

          {/* TIER 3: PENGURUS HARIAN (1 BARIS MUAT 4 CARD: WAKIL 1, WAKIL 2, SEKRETARIS, BENDAHARA) */}
          {pengurusHarian.length > 0 && (
            <div className="flex flex-col items-center">
              <div className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[9px] sm:text-[11px] font-bold uppercase tracking-wider text-sky-700 dark:text-sky-300 bg-sky-500/10 border border-sky-500/20 mb-2">
                <Briefcase className="w-3 h-3" />
                Pengurus Inti & Harian
              </div>

              {/* 4 Cards in 1 Row */}
              <div className="grid grid-cols-4 gap-1.5 sm:gap-3 md:gap-4 max-w-4xl mx-auto w-full">
                {pengurusHarian.map((item) => (
                  <CompactCard key={item.id} item={item} tier="harian" />
                ))}
              </div>

              {/* Connector to Seksi/Lainnya */}
              {lainnya.length > 0 && (
                <div className="flex flex-col items-center my-2">
                  <div className="w-0.5 h-4 sm:h-6 bg-border" />
                  <div className="w-1.5 h-1.5 rounded-full bg-primary/60 -mt-0.5" />
                </div>
              )}
            </div>
          )}

          {/* TIER 4: SEKSI & KOORDINATOR BIDANG KERJA */}
          {lainnya.length > 0 && (
            <div className="flex flex-col items-center pt-2">
              <div className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[9px] sm:text-[11px] font-bold uppercase tracking-wider text-purple-700 dark:text-purple-300 bg-purple-500/10 border border-purple-500/20 mb-2">
                <Layers className="w-3 h-3" />
                Seksi & Koordinator Bidang
              </div>
              <div className="grid grid-cols-4 gap-1.5 sm:gap-3 md:gap-4 max-w-4xl mx-auto w-full">
                {lainnya.map((item) => (
                  <CompactCard key={item.id} item={item} tier="lainnya" />
                ))}
              </div>
            </div>
          )}
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
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2 sm:gap-3.5">
              {filteredGridMembers.map((item) => (
                <CompactCard key={item.id} item={item} tier="grid" />
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  )
}

function CompactCard({
  item,
  tier
}: {
  item: StrukturMember
  tier: 'pembina' | 'ketua' | 'harian' | 'lainnya' | 'grid'
}) {
  // Initials for avatar fallback
  const initials = item.nama_lengkap
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((w) => w[0]?.toUpperCase())
    .join('') || 'KT'

  const j = item.jabatan.toLowerCase()
  const isKetua = tier === 'ketua' || (tier === 'grid' && j.includes('ketua') && !j.includes('wakil'))
  const isPembina = tier === 'pembina' || (tier === 'grid' && (j.includes('pembina') || j.includes('penasihat')))
  const isWakil = j.includes('wakil')
  const isSekretaris = j.includes('sekretaris')
  const isBendahara = j.includes('bendahara')

  // Theme badges & colors
  const badgeClass = isPembina
    ? 'bg-amber-500/15 text-amber-700 dark:text-amber-300 border-amber-500/30'
    : isKetua
    ? 'bg-primary/15 text-primary border-primary/30'
    : isWakil
    ? 'bg-sky-500/15 text-sky-700 dark:text-sky-300 border-sky-500/30'
    : isSekretaris
    ? 'bg-emerald-500/15 text-emerald-700 dark:text-emerald-300 border-emerald-500/30'
    : isBendahara
    ? 'bg-purple-500/15 text-purple-700 dark:text-purple-300 border-purple-500/30'
    : 'bg-muted text-muted-foreground border-border'

  const borderAccent = isKetua
    ? 'border-primary/50 shadow-xs ring-1 ring-primary/20'
    : isPembina
    ? 'border-amber-500/40'
    : 'border-border/80'

  return (
    <Card className={`w-full bg-card rounded-xl sm:rounded-2xl border ${borderAccent} p-1.5 sm:p-3 flex flex-col items-center justify-between text-center shadow-2xs hover:shadow-md transition-all duration-300 relative group overflow-hidden`}>
      {/* Avatar Container */}
      <div className="relative mt-0.5 sm:mt-1">
        {item.foto_url ? (
          <div className="relative w-9 h-9 sm:w-14 sm:h-14 md:w-16 md:h-16 rounded-full overflow-hidden border border-border shadow-inner">
            <Image
              src={item.foto_url}
              alt={item.nama_lengkap}
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-300"
              sizes="(max-width: 640px) 40px, 64px"
            />
          </div>
        ) : (
          <div className={`w-9 h-9 sm:w-14 sm:h-14 md:w-16 md:h-16 rounded-full flex items-center justify-center font-heading font-extrabold text-xs sm:text-base md:text-lg border shadow-inner transition-transform duration-300 group-hover:scale-105 ${badgeClass}`}>
            {initials}
          </div>
        )}
      </div>

      {/* Role / Jabatan Pill */}
      <div className="mt-1 sm:mt-1.5 w-full px-0.5">
        <span className={`inline-block w-full max-w-full text-[8px] sm:text-[10px] md:text-xs font-bold px-1 sm:px-2 py-0.5 rounded-full border truncate leading-none ${badgeClass}`}>
          {item.jabatan}
        </span>
      </div>

      {/* Name & Divisi */}
      <div className="my-1 sm:my-1.5 w-full px-0.5">
        <h3 className="font-heading font-bold text-[10px] sm:text-xs md:text-sm text-foreground line-clamp-2 leading-tight group-hover:text-primary transition-colors">
          {item.nama_lengkap}
        </h3>
        {item.divisi && (
          <p className="text-[7px] sm:text-[9px] md:text-[10px] text-muted-foreground truncate leading-tight mt-0.5">
            Div. {item.divisi}
          </p>
        )}
      </div>

      {/* Desktop/Tablet Extra Details: Periode & Contact links */}
      <div className="hidden sm:flex flex-col w-full pt-1.5 border-t border-border/50 text-[10px] text-muted-foreground">
        <span className="font-medium text-foreground/80 truncate">{item.periode || '2026-Sekarang'}</span>

        {(item.no_telepon || item.email) && (
          <div className="flex items-center justify-center gap-1.5 pt-1">
            {item.no_telepon && (
              <a
                href={`https://wa.me/${item.no_telepon.replace(/\D/g, '')}`}
                target="_blank"
                rel="noopener noreferrer"
                title="Hubungi WhatsApp"
                className="w-5 h-5 rounded-full bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 flex items-center justify-center transition-colors"
              >
                <Phone className="w-2.5 h-2.5" />
              </a>
            )}
            {item.email && (
              <a
                href={`mailto:${item.email}`}
                title="Kirim Email"
                className="w-5 h-5 rounded-full bg-primary/10 hover:bg-primary/20 text-primary flex items-center justify-center transition-colors"
              >
                <Mail className="w-2.5 h-2.5" />
              </a>
            )}
          </div>
        )}
      </div>
    </Card>
  )
}
