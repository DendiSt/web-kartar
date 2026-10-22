'use client'

import React, { useState, useMemo, useEffect, useCallback } from 'react'
import Image from 'next/image'
import {
  Camera,
  Search,
  Filter,
  Maximize2,
  ChevronLeft,
  ChevronRight,
  X,
  Download,
  Calendar,
  Layers
} from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import type { GaleriItem, AlbumSummary } from '@/app/actions/galeri'

interface GaleriListClientProps {
  initialItems: GaleriItem[]
  albums: AlbumSummary[]
}

const KATEGORI_COLORS: Record<string, string> = {
  kegiatan: 'bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20',
  pemuda: 'bg-purple-500/10 text-purple-600 dark:text-purple-400 border-purple-500/20',
  sosial: 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20',
  olahraga: 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20',
  dusun: 'bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 border-cyan-500/20',
  default: 'bg-primary/10 text-primary border-primary/20'
}

export default function GaleriListClient({ initialItems, albums }: GaleriListClientProps) {
  const [selectedAlbum, setSelectedAlbum] = useState<string>('semua')
  const [selectedCategory, setSelectedCategory] = useState<string>('semua')
  const [searchQuery, setSearchQuery] = useState('')
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null)

  // Filtered items
  const filteredItems = useMemo(() => {
    return initialItems.filter((item) => {
      const matchSearch =
        searchQuery === '' ||
        item.judul.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.album.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (item.deskripsi && item.deskripsi.toLowerCase().includes(searchQuery.toLowerCase()))

      const matchAlbum = selectedAlbum === 'semua' || item.album === selectedAlbum
      const matchCategory = selectedCategory === 'semua' || item.kategori === selectedCategory

      return matchSearch && matchAlbum && matchCategory
    })
  }, [initialItems, searchQuery, selectedAlbum, selectedCategory])

  // Lightbox navigation
  const openLightbox = (index: number) => {
    setLightboxIndex(index)
  }

  const closeLightbox = useCallback(() => {
    setLightboxIndex(null)
  }, [])

  const nextLightbox = useCallback(() => {
    if (lightboxIndex !== null) {
      setLightboxIndex((prev) => (prev !== null && prev < filteredItems.length - 1 ? prev + 1 : 0))
    }
  }, [lightboxIndex, filteredItems.length])

  const prevLightbox = useCallback(() => {
    if (lightboxIndex !== null) {
      setLightboxIndex((prev) => (prev !== null && prev > 0 ? prev - 1 : filteredItems.length - 1))
    }
  }, [lightboxIndex, filteredItems.length])

  // Keyboard navigation for Lightbox
  useEffect(() => {
    if (lightboxIndex === null) return

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') closeLightbox()
      if (e.key === 'ArrowRight') nextLightbox()
      if (e.key === 'ArrowLeft') prevLightbox()
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [lightboxIndex, closeLightbox, nextLightbox, prevLightbox])

  const currentLightboxItem = lightboxIndex !== null ? filteredItems[lightboxIndex] : null

  return (
    <div className="space-y-8">
      {/* 1. Filter Toolbar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-card p-4 sm:p-5 rounded-2xl border border-border shadow-xs">
        {/* Search */}
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            type="text"
            placeholder="Cari foto, nama kegiatan, atau album..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 h-10 rounded-xl bg-background text-sm"
          />
        </div>

        {/* Filter controls */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Category Dropdown */}
          <div className="flex items-center gap-1.5 bg-background p-1 rounded-xl border border-border">
            <Filter className="w-3.5 h-3.5 ml-2 text-muted-foreground shrink-0" />
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="bg-transparent text-xs font-medium focus:outline-none pr-3 py-1 text-foreground cursor-pointer"
            >
              <option value="semua">Semua Kategori</option>
              <option value="kegiatan">Kegiatan</option>
              <option value="pemuda">Pemuda</option>
              <option value="sosial">Sosial &amp; Warga</option>
              <option value="olahraga">Olahraga</option>
              <option value="dusun">Wilayah Dusun</option>
            </select>
          </div>

          <Badge variant="outline" className="text-xs px-2.5 py-1.5 rounded-xl border-border font-medium">
            {filteredItems.length} Foto
          </Badge>
        </div>
      </div>

      {/* 2. Album Selector Pills */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
        <button
          type="button"
          onClick={() => setSelectedAlbum('semua')}
          className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
            selectedAlbum === 'semua'
              ? 'bg-primary text-primary-foreground shadow-sm'
              : 'bg-card text-muted-foreground hover:text-foreground border border-border/80 hover:border-border'
          }`}
        >
          <Layers className="w-3.5 h-3.5" />
          Semua Album ({initialItems.length})
        </button>

        {albums.map((album) => (
          <button
            key={album.nama}
            type="button"
            onClick={() => setSelectedAlbum(album.nama)}
            className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
              selectedAlbum === album.nama
                ? 'bg-primary text-primary-foreground shadow-sm'
                : 'bg-card text-muted-foreground hover:text-foreground border border-border/80 hover:border-border'
            }`}
          >
            {album.nama} ({album.count})
          </button>
        ))}
      </div>

      {/* 3. Masonry / Bento Photo Grid */}
      {filteredItems.length === 0 ? (
        <div className="text-center py-16 bg-card rounded-2xl border border-border space-y-3">
          <div className="w-12 h-12 rounded-full bg-muted flex items-center justify-center mx-auto text-muted-foreground">
            <Camera className="w-6 h-6" />
          </div>
          <h3 className="text-base font-bold text-foreground">Tidak ada foto ditemukan</h3>
          <p className="text-xs text-muted-foreground max-w-sm mx-auto">
            Tidak ada foto yang cocok dengan pencarian atau filter yang Anda pilih. Coba atur ulang kata kunci.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {filteredItems.map((item, index) => {
            const catClass = KATEGORI_COLORS[item.kategori] || KATEGORI_COLORS.default

            return (
              <div
                key={item.id}
                onClick={() => openLightbox(index)}
                className="group relative rounded-2xl overflow-hidden border border-border/80 bg-card shadow-xs hover:shadow-xl transition-all duration-300 cursor-pointer flex flex-col"
              >
                {/* Image Container with Hover Zoom */}
                <div className="relative aspect-4/3 w-full overflow-hidden bg-muted">
                  <Image
                    src={item.foto_url}
                    alt={item.judul}
                    fill
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                    loading="lazy"
                  />

                  {/* Gradient Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-between p-3.5 text-white">
                    <div className="flex items-center justify-between">
                      <Badge variant="outline" className={`text-[10px] px-2 py-0.5 rounded-md backdrop-blur-md bg-black/40 border-white/20 text-white font-medium`}>
                        {item.album}
                      </Badge>

                      <div className="w-7 h-7 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center text-white">
                        <Maximize2 className="w-3.5 h-3.5" />
                      </div>
                    </div>

                    <div>
                      <p className="text-xs font-bold line-clamp-1">{item.judul}</p>
                      {item.tanggal && (
                        <p className="text-[10px] text-white/80 flex items-center gap-1 mt-0.5">
                          <Calendar className="w-3 h-3" />
                          {item.tanggal}
                        </p>
                      )}
                    </div>
                  </div>
                </div>

                {/* Card Meta below */}
                <div className="p-3.5 flex flex-col justify-between flex-1 bg-card">
                  <div>
                    <div className="flex items-center justify-between gap-1 mb-1">
                      <span className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider line-clamp-1">
                        {item.album}
                      </span>
                      <Badge variant="outline" className={`text-[9px] px-1.5 py-0 capitalize shrink-0 ${catClass}`}>
                        {item.kategori}
                      </Badge>
                    </div>
                    <h4 className="font-semibold text-xs text-foreground line-clamp-1 group-hover:text-primary transition-colors">
                      {item.judul}
                    </h4>
                  </div>

                  {item.tanggal && (
                    <div className="flex items-center gap-1 text-[11px] text-muted-foreground mt-2 pt-2 border-t border-border/60">
                      <Calendar className="w-3 h-3" />
                      <span>{item.tanggal}</span>
                    </div>
                  )}
                </div>
              </div>
            )
          })}
        </div>
      )}

      {/* 4. Fullscreen Interactive Lightbox Modal */}
      {currentLightboxItem && lightboxIndex !== null && (
        <div
          className="fixed inset-0 z-50 bg-black/95 backdrop-blur-lg flex items-center justify-center p-3 sm:p-6"
          onClick={closeLightbox}
        >
          {/* Top Controls */}
          <div
            className="absolute top-4 left-4 right-4 flex items-center justify-between text-white z-20 pointer-events-none"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="pointer-events-auto flex items-center gap-2">
              <Badge variant="outline" className="bg-white/10 text-white border-white/20 text-xs px-2.5 py-1 backdrop-blur-md">
                {lightboxIndex + 1} / {filteredItems.length}
              </Badge>
              <Badge variant="outline" className="bg-primary text-white border-transparent text-xs px-2.5 py-1 hidden sm:inline-flex">
                {currentLightboxItem.album}
              </Badge>
            </div>

            <div className="pointer-events-auto flex items-center gap-2">
              <a
                href={currentLightboxItem.foto_url}
                target="_blank"
                rel="noreferrer"
                download
                className="w-9 h-9 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition-colors cursor-pointer"
                title="Buka ukuran asli / Unduh"
              >
                <Download className="w-4 h-4" />
              </a>
              <button
                type="button"
                onClick={closeLightbox}
                className="w-9 h-9 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition-colors cursor-pointer"
                title="Tutup (ESC)"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Prev Navigation Button */}
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation()
              prevLightbox()
            }}
            className="absolute left-3 sm:left-6 top-1/2 -translate-y-1/2 w-11 h-11 rounded-full bg-white/10 hover:bg-white/25 text-white flex items-center justify-center backdrop-blur-md transition-all z-20 cursor-pointer shadow-lg"
            title="Foto sebelumnya (Panah Kiri)"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>

          {/* Next Navigation Button */}
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation()
              nextLightbox()
            }}
            className="absolute right-3 sm:right-6 top-1/2 -translate-y-1/2 w-11 h-11 rounded-full bg-white/10 hover:bg-white/25 text-white flex items-center justify-center backdrop-blur-md transition-all z-20 cursor-pointer shadow-lg"
            title="Foto berikutnya (Panah Kanan)"
          >
            <ChevronRight className="w-6 h-6" />
          </button>

          {/* Center High-Res Image & Caption */}
          <div
            className="max-w-5xl max-h-[85vh] w-full flex flex-col items-center justify-center z-10"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="relative w-full h-[60vh] sm:h-[70vh]">
              <Image
                src={currentLightboxItem.foto_url}
                alt={currentLightboxItem.judul}
                fill
                priority
                sizes="100vw"
                className="object-contain"
              />
            </div>

            {/* Bottom Caption Bar */}
            <div className="w-full max-w-2xl bg-white/10 backdrop-blur-md rounded-2xl p-4 text-white text-center mt-3 border border-white/15">
              <h3 className="text-base sm:text-lg font-bold font-heading">{currentLightboxItem.judul}</h3>
              {currentLightboxItem.deskripsi && (
                <p className="text-xs sm:text-sm text-white/80 mt-1 line-clamp-2">
                  {currentLightboxItem.deskripsi}
                </p>
              )}
              <div className="flex items-center justify-center gap-4 text-xs text-white/70 mt-2 pt-2 border-t border-white/15">
                <span>Album: {currentLightboxItem.album}</span>
                {currentLightboxItem.tanggal && <span>Tanggal: {currentLightboxItem.tanggal}</span>}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
