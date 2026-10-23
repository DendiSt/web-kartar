'use client'

import { useState } from 'react'
import Image from 'next/image'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { 
  Users, 
  User, 
  Crown, 
  ShieldCheck, 
  Award, 
  Briefcase, 
  Network, 
  LayoutGrid, 
  Search, 
  Phone, 
  Mail,
  Layers,
  ChevronDown
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

  // Helper to categorize members
  const pembinas: StrukturMember[] = []
  const ketuas: StrukturMember[] = []
  const wakils: StrukturMember[] = []
  const bph: StrukturMember[] = []
  const lainnya: StrukturMember[] = []

  initialMembers.forEach((m) => {
    const j = m.jabatan.toLowerCase().trim()
    if (j.includes('pembina') || j.includes('penasihat') || j.includes('pelindung')) {
      pembinas.push(m)
    } else if (j === 'ketua' || (j.includes('ketua') && !j.includes('wakil') && !j.includes('seksi') && !j.includes('bidang'))) {
      ketuas.push(m)
    } else if (j.includes('wakil')) {
      wakils.push(m)
    } else if (j.includes('sekretaris') || j.includes('bendahara')) {
      bph.push(m)
    } else {
      lainnya.push(m)
    }
  })

  const sortByUrutan = (a: StrukturMember, b: StrukturMember) => (a.urutan ?? 99) - (b.urutan ?? 99)
  pembinas.sort(sortByUrutan)
  ketuas.sort(sortByUrutan)
  wakils.sort(sortByUrutan)
  bph.sort(sortByUrutan)
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
    <div className="space-y-10">
      {/* View Switcher & Toolbar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-card/60 backdrop-blur-sm p-3 sm:p-4 rounded-2xl border border-border">
        {/* View Toggle */}
        <div className="flex items-center bg-muted/60 p-1 rounded-xl border border-border/80 w-full sm:w-auto">
          <button
            type="button"
            onClick={() => setViewMode('tree')}
            className={`flex-1 sm:flex-initial flex items-center justify-center gap-1.5 px-4 py-2 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
              viewMode === 'tree'
                ? 'bg-primary text-primary-foreground shadow-sm'
                : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            <Network className="w-3.5 h-3.5" />
            Bagan Struktur (Hierarki)
          </button>
          <button
            type="button"
            onClick={() => setViewMode('grid')}
            className={`flex-1 sm:flex-initial flex items-center justify-center gap-1.5 px-4 py-2 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
              viewMode === 'grid'
                ? 'bg-primary text-primary-foreground shadow-sm'
                : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            <LayoutGrid className="w-3.5 h-3.5" />
            Daftar Pengurus (Grid)
          </button>
        </div>

        {/* Info Period Badge */}
        <div className="text-xs text-muted-foreground font-medium flex items-center gap-2">
          <Badge variant="outline" className="px-3 py-1 rounded-full text-xs font-normal border-primary/20 bg-primary/5 text-primary">
            Masa Bakti: 2026 - Sekarang
          </Badge>
          <span>{initialMembers.length} Pengurus Aktif</span>
        </div>
      </div>

      {/* 1. BAGAN STRUKTUR (ORGANOGRAM TREE VIEW) */}
      {viewMode === 'tree' ? (
        <div className="space-y-4 py-4 overflow-x-auto">
          {/* TIER 1: PEMBINA & PELINDUNG */}
          {pembinas.length > 0 && (
            <div className="flex flex-col items-center">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-bold uppercase tracking-wider text-amber-700 dark:text-amber-300 bg-amber-500/10 border border-amber-500/20 mb-3 shadow-2xs">
                <ShieldCheck className="w-3.5 h-3.5" />
                Dewan Pembina / Penasihat
              </div>
              <div className="flex flex-wrap justify-center items-center gap-6">
                {pembinas.map((item) => (
                  <MemberCard key={item.id} item={item} tier="pembina" />
                ))}
              </div>

              {/* Connecting line to Ketua */}
              {ketuas.length > 0 && (
                <div className="flex flex-col items-center mt-3 mb-1">
                  <div className="w-0.5 h-8 bg-gradient-to-b from-amber-500/50 to-primary/50" />
                  <div className="w-2 h-2 rounded-full bg-primary/60 -mt-1" />
                </div>
              )}
            </div>
          )}

          {/* TIER 2: KETUA */}
          {ketuas.length > 0 && (
            <div className="flex flex-col items-center">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-bold uppercase tracking-wider text-primary bg-primary/10 border border-primary/20 mb-3 shadow-2xs">
                <Crown className="w-3.5 h-3.5" />
                Ketua Karang Taruna
              </div>
              <div className="flex flex-wrap justify-center items-center gap-6">
                {ketuas.map((item) => (
                  <MemberCard key={item.id} item={item} tier="ketua" />
                ))}
              </div>

              {/* Connecting branch to Wakils */}
              {wakils.length > 0 && (
                <>
                  {wakils.length === 2 ? (
                    <div className="hidden sm:flex flex-col items-center w-full my-2">
                      <div className="w-0.5 h-6 bg-border" />
                      <div className="w-[320px] md:w-[350px] h-0.5 bg-border relative">
                        <div className="absolute left-0 top-0 w-0.5 h-6 bg-border" />
                        <div className="absolute right-0 top-0 w-0.5 h-6 bg-border" />
                      </div>
                    </div>
                  ) : (
                    <div className="w-0.5 h-8 bg-border my-2" />
                  )}
                  {/* Mobile connector */}
                  <div className="flex sm:hidden flex-col items-center my-2">
                    <div className="w-0.5 h-6 bg-border" />
                    <div className="w-2 h-2 rounded-full bg-primary/60 -mt-1" />
                  </div>
                </>
              )}
            </div>
          )}

          {/* TIER 3: WAKIL KETUA */}
          {wakils.length > 0 && (
            <div className="flex flex-col items-center">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-bold uppercase tracking-wider text-sky-700 dark:text-sky-300 bg-sky-500/10 border border-sky-500/20 mb-3 shadow-2xs">
                <Award className="w-3.5 h-3.5" />
                Wakil Ketua
              </div>
              <div className="flex flex-wrap justify-center items-center gap-6 sm:gap-8">
                {wakils.map((item) => (
                  <MemberCard key={item.id} item={item} tier="wakil" />
                ))}
              </div>

              {/* Connecting branch to BPH */}
              {bph.length > 0 && (
                <>
                  {bph.length === 2 ? (
                    <div className="hidden sm:flex flex-col items-center w-full my-2">
                      <div className="w-0.5 h-6 bg-border" />
                      <div className="w-[320px] md:w-[350px] h-0.5 bg-border relative">
                        <div className="absolute left-0 top-0 w-0.5 h-6 bg-border" />
                        <div className="absolute right-0 top-0 w-0.5 h-6 bg-border" />
                      </div>
                    </div>
                  ) : (
                    <div className="w-0.5 h-8 bg-border my-2" />
                  )}
                  {/* Mobile connector */}
                  <div className="flex sm:hidden flex-col items-center my-2">
                    <div className="w-0.5 h-6 bg-border" />
                    <div className="w-2 h-2 rounded-full bg-primary/60 -mt-1" />
                  </div>
                </>
              )}
            </div>
          )}

          {/* TIER 4: SEKRETARIS & BENDAHARA (BPH) */}
          {bph.length > 0 && (
            <div className="flex flex-col items-center">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-bold uppercase tracking-wider text-emerald-700 dark:text-emerald-300 bg-emerald-500/10 border border-emerald-500/20 mb-3 shadow-2xs">
                <Briefcase className="w-3.5 h-3.5" />
                Sekretariat & Kebendaharaan
              </div>
              <div className="flex flex-wrap justify-center items-center gap-6 sm:gap-8">
                {bph.map((item) => (
                  <MemberCard key={item.id} item={item} tier="bph" />
                ))}
              </div>

              {/* Connecting branch to Seksi/Lainnya */}
              {lainnya.length > 0 && (
                <div className="flex flex-col items-center my-3">
                  <div className="w-0.5 h-8 bg-border" />
                  <div className="w-2 h-2 rounded-full bg-primary/60 -mt-1" />
                </div>
              )}
            </div>
          )}

          {/* TIER 5: SEKSI, KOORDINATOR & ANGGOTA (JIKA ADA) */}
          {lainnya.length > 0 && (
            <div className="flex flex-col items-center pt-2">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-bold uppercase tracking-wider text-purple-700 dark:text-purple-300 bg-purple-500/10 border border-purple-500/20 mb-3 shadow-2xs">
                <Layers className="w-3.5 h-3.5" />
                Seksi & Koordinator Bidang
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 max-w-5xl mx-auto">
                {lainnya.map((item) => (
                  <MemberCard key={item.id} item={item} tier="lainnya" />
                ))}
              </div>
            </div>
          )}
        </div>
      ) : (
        /* 2. DAFTAR PENGURUS (GRID VIEW DENGAN FILTER & SEARCH) */
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center justify-between">
            {/* Search */}
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Cari nama, jabatan, atau divisi..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 h-10 rounded-xl bg-card text-sm"
              />
            </div>

            {/* Filter */}
            <div className="flex items-center gap-1.5 bg-card px-3 py-1.5 rounded-xl border border-border">
              <span className="text-xs text-muted-foreground">Kategori:</span>
              <select
                value={selectedFilter}
                onChange={(e) => setSelectedFilter(e.target.value)}
                className="bg-transparent text-xs font-semibold text-foreground cursor-pointer focus:outline-none"
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
            <div className="text-center py-16 bg-card rounded-2xl border border-border space-y-2">
              <Users className="w-10 h-10 text-muted-foreground/30 mx-auto" />
              <p className="text-sm font-semibold text-foreground">Tidak ada pengurus ditemukan.</p>
              <p className="text-xs text-muted-foreground">Coba ubah kata kunci pencarian Anda.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {filteredGridMembers.map((item) => (
                <MemberCard key={item.id} item={item} tier="grid" />
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  )
}

function MemberCard({
  item,
  tier
}: {
  item: StrukturMember
  tier: 'pembina' | 'ketua' | 'wakil' | 'bph' | 'lainnya' | 'grid'
}) {
  // Initials for avatar fallback
  const initials = item.nama_lengkap
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((w) => w[0]?.toUpperCase())
    .join('') || 'KT'

  // Tier-specific styles
  const isKetua = tier === 'ketua'
  const isPembina = tier === 'pembina'
  const isWakil = tier === 'wakil'
  const isBPH = tier === 'bph'

  const badgeStyle = isPembina
    ? 'bg-amber-500/10 text-amber-700 dark:text-amber-300 border-amber-500/20'
    : isKetua
    ? 'bg-primary/10 text-primary border-primary/20'
    : isWakil
    ? 'bg-sky-500/10 text-sky-700 dark:text-sky-300 border-sky-500/20'
    : isBPH
    ? 'bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 border-emerald-500/20'
    : 'bg-muted text-muted-foreground border-border'

  const borderAccent = isKetua
    ? 'border-primary/40 shadow-sm ring-1 ring-primary/20'
    : isPembina
    ? 'border-amber-500/30'
    : 'border-border/80'

  return (
    <Card className={`w-[260px] sm:w-[280px] bg-card rounded-2xl border ${borderAccent} shadow-xs hover:shadow-lg transition-all duration-300 flex flex-col overflow-hidden group`}>
      {/* Top Image or Avatar Frame */}
      <div className="relative aspect-4/3 w-full bg-gradient-to-b from-muted/40 via-muted/60 to-muted flex items-center justify-center overflow-hidden">
        {item.foto_url ? (
          <Image
            src={item.foto_url}
            alt={item.nama_lengkap}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-300"
            sizes="280px"
          />
        ) : (
          <div className="flex flex-col items-center justify-center text-center p-4">
            <div className={`w-16 h-16 sm:w-20 sm:h-20 rounded-2xl flex items-center justify-center font-heading font-extrabold text-xl sm:text-2xl shadow-inner border transition-transform duration-300 group-hover:scale-105 ${
              isPembina 
                ? 'bg-amber-500/15 text-amber-700 dark:text-amber-300 border-amber-500/30'
                : isKetua
                ? 'bg-primary/15 text-primary border-primary/30'
                : isWakil
                ? 'bg-sky-500/15 text-sky-700 dark:text-sky-300 border-sky-500/30'
                : isBPH
                ? 'bg-emerald-500/15 text-emerald-700 dark:text-emerald-300 border-emerald-500/30'
                : 'bg-secondary text-foreground border-border'
            }`}>
              {initials}
            </div>
          </div>
        )}

        {/* Floating Top Jabatan Badge */}
        <div className="absolute top-2.5 right-2.5">
          <Badge variant="outline" className={`text-[10px] px-2.5 py-0.5 rounded-full backdrop-blur-md font-semibold ${badgeStyle}`}>
            {item.jabatan}
          </Badge>
        </div>
      </div>

      {/* Card Content Information */}
      <CardContent className="p-4 sm:p-5 text-center flex-1 flex flex-col justify-between space-y-3">
        <div className="space-y-1">
          <h3 className="font-heading font-bold text-base sm:text-[17px] text-foreground line-clamp-1 group-hover:text-primary transition-colors">
            {item.nama_lengkap}
          </h3>
          <p className="text-xs font-semibold text-primary">
            {item.jabatan}
          </p>
          {item.divisi && (
            <p className="text-[11px] text-muted-foreground font-medium">
              Bidang: {item.divisi}
            </p>
          )}
        </div>

        {/* Footer info: Periode and optional contacts */}
        <div className="pt-2.5 border-t border-border/60 flex items-center justify-between text-[11px] text-muted-foreground">
          <span className="text-[10px] uppercase font-bold tracking-wider text-muted-foreground/70">Masa Bakti</span>
          <span className="font-semibold text-foreground">{item.periode || '2026-Sekarang'}</span>
        </div>

        {/* Contact Links if provided */}
        {(item.no_telepon || item.email) && (
          <div className="flex items-center justify-center gap-2 pt-1 border-t border-border/40">
            {item.no_telepon && (
              <a
                href={`https://wa.me/${item.no_telepon.replace(/\D/g, '')}`}
                target="_blank"
                rel="noopener noreferrer"
                title="Hubungi via WhatsApp"
                className="w-7 h-7 rounded-full bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 flex items-center justify-center transition-colors"
              >
                <Phone className="w-3.5 h-3.5" />
              </a>
            )}
            {item.email && (
              <a
                href={`mailto:${item.email}`}
                title="Kirim Email"
                className="w-7 h-7 rounded-full bg-primary/10 hover:bg-primary/20 text-primary flex items-center justify-center transition-colors"
              >
                <Mail className="w-3.5 h-3.5" />
              </a>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
