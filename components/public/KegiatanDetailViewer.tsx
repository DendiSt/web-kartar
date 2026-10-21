'use client'

import React, { useState, useRef, useCallback, useEffect } from 'react'
import Image from 'next/image'
import { ChevronLeft, ChevronRight, Maximize2, X, Camera } from 'lucide-react'
import { Button } from '@/components/ui/button'

interface KegiatanDetailViewerProps {
  images: string[]
  title: string
  description: string
}

export function KegiatanDetailViewer({ images, title, description }: KegiatanDetailViewerProps) {
  const [activeIndex, setActiveIndex] = useState(0)
  const [isLightboxOpen, setIsLightboxOpen] = useState(false)
  const [isFading, setIsFading] = useState(false)
  const mainImageRef = useRef<HTMLDivElement>(null)

  const activeImage = images[activeIndex] || images[0]

  const handleSelectImage = (idx: number) => {
    if (idx === activeIndex) return
    setIsFading(true)
    setTimeout(() => {
      setActiveIndex(idx)
      setIsFading(false)
    }, 150)
  }

  const handlePrev = useCallback(() => {
    if (images.length <= 1) return
    setIsFading(true)
    setTimeout(() => {
      setActiveIndex((prev) => (prev - 1 + images.length) % images.length)
      setIsFading(false)
    }, 150)
  }, [images.length])

  const handleNext = useCallback(() => {
    if (images.length <= 1) return
    setIsFading(true)
    setTimeout(() => {
      setActiveIndex((prev) => (prev + 1) % images.length)
      setIsFading(false)
    }, 150)
  }, [images.length])

  // Keyboard navigation for lightbox
  useEffect(() => {
    if (!isLightboxOpen) return

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setIsLightboxOpen(false)
      if (e.key === 'ArrowLeft') handlePrev()
      if (e.key === 'ArrowRight') handleNext()
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [isLightboxOpen, handlePrev, handleNext])

  return (
    <div className="space-y-8">
      {/* 1. Main Display Image (Like Shopee) */}
      {activeImage && (
        <div 
          ref={mainImageRef} 
          className="relative aspect-video w-full rounded-2xl overflow-hidden border border-border bg-muted/50 shadow-sm group select-none"
        >
          <div className={`w-full h-full relative transition-opacity duration-200 ${isFading ? 'opacity-40 scale-[0.99]' : 'opacity-100 scale-100'}`}>
            <Image 
              src={activeImage} 
              alt={`${title} - Foto ${activeIndex + 1}`} 
              fill 
              className="object-cover"
              priority
              sizes="(max-width: 1024px) 100vw, 900px"
            />
          </div>

          {/* Overlay Navigation Arrows (if multiple images) */}
          {images.length > 1 && (
            <>
              <button
                type="button"
                onClick={handlePrev}
                aria-label="Foto Sebelumnya"
                className="absolute left-3 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/80 text-white rounded-full p-2.5 backdrop-blur-md opacity-0 group-hover:opacity-100 transition-all hover:scale-105 z-10"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              <button
                type="button"
                onClick={handleNext}
                aria-label="Foto Selanjutnya"
                className="absolute right-3 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/80 text-white rounded-full p-2.5 backdrop-blur-md opacity-0 group-hover:opacity-100 transition-all hover:scale-105 z-10"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </>
          )}

          {/* Top Left Badge: Image Counter */}
          {images.length > 1 && (
            <div className="absolute top-3 left-3 bg-black/60 backdrop-blur-md text-white text-xs font-medium px-3 py-1 rounded-full z-10 shadow-sm">
              Foto {activeIndex + 1} dari {images.length}
            </div>
          )}

          {/* Bottom Right: Fullscreen / Lightbox Button */}
          <button
            type="button"
            onClick={() => setIsLightboxOpen(true)}
            className="absolute bottom-3 right-3 bg-black/60 hover:bg-black/80 text-white text-xs font-medium px-3 py-1.5 rounded-full backdrop-blur-md flex items-center gap-1.5 transition-all hover:scale-105 z-10 shadow-sm"
          >
            <Maximize2 className="w-3.5 h-3.5" />
            <span>Lihat Ukuran Penuh</span>
          </button>
        </div>
      )}

      {/* 2. Deskripsi Kegiatan */}
      <div className="prose prose-slate max-w-none dark:prose-invert">
        {description.split('\n').map((paragraph: string, idx: number) => (
          <p key={idx}>{paragraph}</p>
        ))}
      </div>

      {/* 3. Galeri Dokumentasi (Interactive Shopee-style Thumbnails) */}
      {images.length > 1 && (
        <div className="space-y-4 pt-6 border-t border-border">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Camera className="w-5 h-5 text-primary" />
              <div>
                <h2 className="text-xl font-heading font-bold tracking-tight">
                  Galeri Dokumentasi
                </h2>
                <p className="text-xs text-muted-foreground mt-0.5">
                  Klik foto di bawah untuk menampilkan gambar di tampilan utama atas.
                </p>
              </div>
            </div>
            <span className="text-xs text-muted-foreground bg-muted px-2.5 py-1 rounded-full font-medium">
              {images.length} Foto
            </span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3.5 pt-1">
            {images.map((url, idx) => {
              const isActive = idx === activeIndex
              return (
                <button
                  key={`${url}-${idx}`}
                  type="button"
                  onClick={() => handleSelectImage(idx)}
                  className={`group relative aspect-video rounded-[10px] overflow-hidden border bg-muted/40 cursor-pointer transition-all duration-200 text-left ${
                    isActive
                      ? 'ring-4 ring-primary border-transparent shadow-md scale-[1.02]'
                      : 'border-border opacity-70 hover:opacity-100 hover:scale-[1.01] hover:border-primary/50'
                  }`}
                >
                  <Image
                    src={url}
                    alt={`${title} - Thumbnail ${idx + 1}`}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-300"
                    sizes="(max-width: 640px) 50vw, (max-width: 768px) 33vw, 25vw"
                  />
                </button>
              )
            })}
          </div>
        </div>
      )}

      {/* 4. Lightbox Modal (For full-screen viewing when requested) */}
      {isLightboxOpen && (
        <div 
          className="fixed inset-0 z-50 bg-black/95 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in duration-200"
          onClick={() => setIsLightboxOpen(false)}
        >
          {/* Top Bar */}
          <div 
            className="absolute top-4 left-4 right-4 flex items-center justify-between text-white z-20"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="text-sm font-medium bg-white/10 backdrop-blur-md px-3.5 py-1 rounded-full">
              {activeIndex + 1} / {images.length}
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsLightboxOpen(false)}
              className="text-white hover:bg-white/20 rounded-full h-9 w-9"
            >
              <X className="w-5 h-5" />
            </Button>
          </div>

          {/* Prev Button */}
          {images.length > 1 && (
            <Button
              variant="ghost"
              size="icon"
              onClick={(e) => {
                e.stopPropagation()
                handlePrev()
              }}
              className="absolute left-4 top-1/2 -translate-y-1/2 text-white hover:bg-white/20 rounded-full h-11 w-11 z-20"
            >
              <ChevronLeft className="w-7 h-7" />
            </Button>
          )}

          {/* Image */}
          <div 
            className="relative max-w-5xl max-h-[85vh] w-full h-[80vh] flex items-center justify-center"
            onClick={(e) => e.stopPropagation()}
          >
            <img
              src={activeImage}
              alt={`${title} - Foto ${activeIndex + 1}`}
              className="max-w-full max-h-full object-contain rounded-lg shadow-2xl"
            />
          </div>

          {/* Next Button */}
          {images.length > 1 && (
            <Button
              variant="ghost"
              size="icon"
              onClick={(e) => {
                e.stopPropagation()
                handleNext()
              }}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-white hover:bg-white/20 rounded-full h-11 w-11 z-20"
            >
              <ChevronRight className="w-7 h-7" />
            </Button>
          )}
        </div>
      )}
    </div>
  )
}
