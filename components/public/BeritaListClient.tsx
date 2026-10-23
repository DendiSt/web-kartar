'use client'

import { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Calendar, Eye, ArrowRight, Search, Pin, Newspaper, Sparkles, User, Filter, ChevronDown } from 'lucide-react'
import { format } from 'date-fns'
import { id as localeID } from 'date-fns/locale/id'

interface BeritaItem {
  id: string
  judul: string
  slug: string
  ringkasan: string | null
  konten: string
  kategori: string
  status: string
  foto_cover: string | null
  penulis: string | null
  is_pinned: boolean
  views: number
  created_at: string | null
}

const categories = [
  { id: 'semua', label: 'Semua Info' },
  { id: 'pengumuman', label: '📢 Pengumuman' },
  { id: 'berita', label: '📰 Berita' },
  { id: 'info_dusun', label: '🏡 Info Dusun' },
  { id: 'kegiatan', label: '🎯 Kegiatan' }
]

export default function BeritaListClient({ initialData }: { initialData: BeritaItem[] }) {
  const [activeCategory, setActiveCategory] = useState('semua')
  const [searchQuery, setSearchQuery] = useState('')

  const filteredData = initialData.filter((item) => {
    const matchesCategory = activeCategory === 'semua' || item.kategori === activeCategory
    const matchesSearch = item.judul.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (item.ringkasan && item.ringkasan.toLowerCase().includes(searchQuery.toLowerCase())) ||
      item.konten.toLowerCase().includes(searchQuery.toLowerCase())
    return matchesCategory && matchesSearch
  })

  // Separate pinned items if viewing all without search
  const pinnedItems = activeCategory === 'semua' && !searchQuery 
    ? filteredData.filter(item => item.is_pinned) 
    : []
    
  const regularItems = activeCategory === 'semua' && !searchQuery
    ? filteredData.filter(item => !item.is_pinned)
    : filteredData

  const getKategoriBadge = (kategori: string) => {
    switch (kategori) {
      case 'pengumuman':
        return { label: 'Pengumuman', class: 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300 border-amber-200 dark:border-amber-800' }
      case 'info_dusun':
        return { label: 'Info Dusun', class: 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800' }
      case 'kegiatan':
        return { label: 'Kegiatan', class: 'bg-purple-100 text-purple-800 dark:bg-purple-950 dark:text-purple-300 border-purple-200 dark:border-purple-800' }
      default:
        return { label: 'Berita', class: 'bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-300 border-blue-200 dark:border-blue-800' }
    }
  }

  return (
    <div className="space-y-10">
      {/* Search & Filter Toolbar */}
      <div className="flex flex-col md:flex-row gap-3 md:gap-4 items-stretch md:items-center justify-between bg-white dark:bg-[#181b20] p-4 md:p-6 rounded-[20px] border border-[#f0f1f2] dark:border-[#292a2e] shadow-sm">
        {/* Mobile: Category Dropdown */}
        <div className="w-full md:hidden">
          <div className="relative flex items-center bg-muted/40 dark:bg-muted/20 rounded-xl border border-border/80 focus-within:border-primary/50 transition-colors">
            <Filter className="w-4 h-4 ml-3 text-muted-foreground shrink-0 pointer-events-none" />
            <select
              value={activeCategory}
              onChange={(e) => setActiveCategory(e.target.value)}
              className="w-full bg-transparent text-xs font-semibold py-2.5 pl-2.5 pr-8 text-foreground appearance-none cursor-pointer focus:outline-none"
            >
              {categories.map((cat) => (
                <option key={cat.id} value={cat.id} className="bg-background text-foreground py-1">
                  {cat.label}
                </option>
              ))}
            </select>
            <ChevronDown className="w-4 h-4 mr-3 text-muted-foreground shrink-0 pointer-events-none absolute right-0" />
          </div>
        </div>

        {/* Desktop: Category Pills */}
        <div className="hidden md:flex items-center gap-2 overflow-x-auto w-auto pb-0 scrollbar-none">
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

        {/* Search Input */}
        <div className="relative w-full md:w-72">
          <Search className="absolute left-3.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Cari berita atau pengumuman..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 h-10 rounded-full border-[#f0f1f2] dark:border-[#292a2e] bg-muted/40 focus:bg-background text-sm"
          />
          {searchQuery && (
            <button 
              onClick={() => setSearchQuery('')}
              className="absolute right-3.5 top-2.5 text-xs text-muted-foreground hover:text-foreground"
            >
              Hapus
            </button>
          )}
        </div>
      </div>

      {/* Pinned Spotlight Banner (When available) */}
      {pinnedItems.length > 0 && (
        <div className="space-y-4">
          <div className="flex items-center gap-2 text-sm font-semibold text-amber-600 dark:text-amber-400">
            <Sparkles className="w-4 h-4 fill-amber-500" />
            <span>PENGUMUMAN PENTING & UTAMA</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {pinnedItems.map((item) => {
              const badge = getKategoriBadge(item.kategori)
              return (
                <Card 
                  key={item.id}
                  className="rounded-[20px] bg-gradient-to-br from-amber-500/10 via-background to-background border-2 border-amber-300 dark:border-amber-700/60 p-6 relative overflow-hidden group hover:shadow-md transition-all"
                >
                  <div className="absolute top-4 right-4 flex items-center gap-1.5 bg-amber-500 text-white text-[11px] font-bold px-3 py-1 rounded-full shadow-sm">
                    <Pin className="w-3.5 h-3.5 fill-white" />
                    <span>DISEMATKAN</span>
                  </div>

                  <div className="space-y-3">
                    <Badge variant="outline" className={`rounded-full text-xs font-semibold ${badge.class}`}>
                      {badge.label}
                    </Badge>

                    <h3 className="font-heading text-xl font-bold text-[#101214] dark:text-white group-hover:text-[#1868db] transition-colors line-clamp-2">
                      <Link href={`/berita/${item.slug}`}>
                        {item.judul}
                      </Link>
                    </h3>

                    <p className="text-sm text-[#42526e] dark:text-[#b7b9be] line-clamp-3 leading-relaxed">
                      {item.ringkasan || item.konten}
                    </p>

                    <div className="flex items-center justify-between pt-4 border-t border-amber-200/50 dark:border-amber-900/40 text-xs text-muted-foreground">
                      <div className="flex items-center gap-3">
                        <span className="flex items-center gap-1">
                          <Calendar className="w-3.5 h-3.5 text-[#1868db]" />
                          {item.created_at ? format(new Date(item.created_at), 'dd MMMM yyyy', { locale: localeID }) : '-'}
                        </span>
                        <span className="flex items-center gap-1">
                          <Eye className="w-3.5 h-3.5" />
                          {item.views} dilihat
                        </span>
                      </div>

                      <Link 
                        href={`/berita/${item.slug}`} 
                        className="inline-flex items-center font-semibold text-[#1868db] hover:underline"
                      >
                        Baca <ArrowRight className="ml-1 w-3.5 h-3.5" />
                      </Link>
                    </div>
                  </div>
                </Card>
              )
            })}
          </div>
        </div>
      )}

      {/* Regular News Grid */}
      <div className="space-y-4">
        {pinnedItems.length > 0 && regularItems.length > 0 && (
          <h3 className="font-heading text-xl font-bold text-[#101214] dark:text-white">
            Semua Kabar & Informasi
          </h3>
        )}

        {regularItems.length === 0 && pinnedItems.length === 0 ? (
          <div className="text-center py-16 bg-white dark:bg-[#181b20] rounded-[20px] border border-[#f0f1f2] dark:border-[#292a2e] p-8">
            <Newspaper className="mx-auto h-12 w-12 text-muted-foreground/40 mb-3" />
            <h4 className="font-heading text-lg font-bold">Tidak ada berita atau pengumuman</h4>
            <p className="text-sm text-muted-foreground mt-1 max-w-sm mx-auto">
              Belum ada informasi yang sesuai dengan filter atau kata kunci pencarian Anda.
            </p>
            {(activeCategory !== 'semua' || searchQuery) && (
              <Button 
                variant="outline" 
                size="sm" 
                className="mt-4 rounded-full"
                onClick={() => {
                  setActiveCategory('semua')
                  setSearchQuery('')
                }}
              >
                Reset Filter
              </Button>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {regularItems.map((item) => {
              const badge = getKategoriBadge(item.kategori)
              return (
                <Card 
                  key={item.id}
                  className="rounded-[20px] bg-white dark:bg-[#181b20] border border-[#f0f1f2] dark:border-[#292a2e] shadow-[0_0_1px_0_rgba(9,30,66,0.31),0_1px_1px_0_rgba(9,30,66,0.15)] dark:shadow-none p-5 flex flex-col group transition-all hover:translate-y-[-3px]"
                >
                  {/* Thumbnail Cover */}
                  <div className="aspect-[16/10] bg-[#f0f1f2] dark:bg-[#1c2b42] relative overflow-hidden rounded-[8px] mb-4">
                    {item.foto_cover ? (
                      <Image 
                        src={item.foto_cover} 
                        alt={item.judul} 
                        fill 
                        className="object-cover group-hover:scale-105 transition-transform duration-300"
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                      />
                    ) : (
                      <div className="absolute inset-0 flex flex-col items-center justify-center text-muted-foreground/60 bg-gradient-to-br from-secondary/40 to-secondary/10">
                        <Newspaper className="w-8 h-8 mb-1 opacity-40" />
                        <span className="text-xs font-medium">Kabar Dusun</span>
                      </div>
                    )}
                    
                    <div className="absolute top-3 left-3">
                      <Badge variant="outline" className={`rounded-full text-[11px] font-semibold backdrop-blur-md shadow-sm ${badge.class}`}>
                        {badge.label}
                      </Badge>
                    </div>

                    {item.is_pinned && (
                      <div className="absolute top-3 right-3 bg-amber-500 text-white p-1 rounded-full shadow-sm" title="Disematkan">
                        <Pin className="w-3.5 h-3.5 fill-white" />
                      </div>
                    )}
                  </div>

                  {/* Content */}
                  <CardContent className="p-0 flex-1 flex flex-col space-y-3">
                    <div className="flex items-center gap-3 text-xs text-[#42526e] dark:text-[#b7b9be]">
                      <span className="flex items-center gap-1">
                        <Calendar className="w-3.5 h-3.5 text-[#1868db]" />
                        {item.created_at ? format(new Date(item.created_at), 'dd MMM yyyy', { locale: localeID }) : '-'}
                      </span>
                      <span>•</span>
                      <span className="flex items-center gap-1">
                        <User className="w-3.5 h-3.5" />
                        {item.penulis || 'Admin'}
                      </span>
                    </div>

                    <h3 className="font-heading text-lg font-bold line-clamp-2 text-[#101214] dark:text-white leading-snug group-hover:text-[#1868db] transition-colors">
                      <Link href={`/berita/${item.slug}`}>
                        {item.judul}
                      </Link>
                    </h3>

                    <p className="text-sm text-[#42526e] dark:text-[#b7b9be] line-clamp-3 leading-relaxed flex-1">
                      {item.ringkasan || item.konten}
                    </p>

                    <div className="pt-4 border-t border-[#f0f1f2] dark:border-[#292a2e] flex items-center justify-between text-xs text-muted-foreground mt-auto">
                      <span className="flex items-center gap-1">
                        <Eye className="w-3.5 h-3.5" />
                        {item.views} dilihat
                      </span>

                      <Link 
                        href={`/berita/${item.slug}`} 
                        className="inline-flex items-center font-semibold text-[#1868db] hover:underline"
                      >
                        Baca Selengkapnya <ArrowRight className="ml-1 w-3.5 h-3.5" />
                      </Link>
                    </div>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}
