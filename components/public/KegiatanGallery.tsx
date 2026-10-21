'use client'

import React, { useState, useEffect, useCallback } from 'react'
import Image from 'next/image'
import { X, ChevronLeft, ChevronRight, Camera, ZoomIn } from 'lucide-react'
import { Button } from '@/components/ui/button'

interface KegiatanGalleryProps {
  images: string[]
  title: string
}

export function KegiatanGallery({ images, title }: KegiatanGalleryProps) {
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null)

  const handleOpen = (index: number) => {
    setSelectedIndex(index)
  }

  const handleClose = () => {
    setSelectedIndex(null)
  }

  const handlePrev = useCallback(() => {
    if (selectedIndex === null) return
    setSelectedIndex((prev) => (prev === null ? null : (prev - 1 + images.length) % images.length))
  }, [selectedIndex, images.length])

  const handleNext = useCallback(() => {
    if (selectedIndex === null) return
    setSelectedIndex((prev) => (prev === null ? null : (prev + 1) % images.length))
  }, [selectedIndex, images.length])

  // Keyboard navigation
  useEffect(() => {
    if (selectedIndex === null) return

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') handleClose()
      if (e.key === 'ArrowLeft') handlePrev()
      if (e.key === 'ArrowRight') handleNext()
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [selectedIndex, handlePrev, handleNext])

  if (!images || images.length === 0) return null

  return (
    <div className="space-y-4 pt-6 border-t border-border">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Camera className="w-5 h-5 text-primary" />
          <h2 className="text-xl font-heading font-bold tracking-tight">
            Galeri Dokumentasi
          </h2>
        </div>
        <span className="text-xs text-muted-foreground bg-muted px-2.5 py-1 rounded-full font-medium">
          {images.length} Foto
        </span>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
        {images.map((url, idx) => (
          <button
            key={`${url}-${idx}`}
            type="button"
            onClick={() => handleOpen(idx)}
            className="group relative aspect-video rounded-[10px] overflow-hidden border border-border bg-muted/40 cursor-pointer focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 transition-all hover:scale-[1.02] hover:shadow-md"
          >
            <Image
              src={url}
              alt={`${title} - Foto ${idx + 1}`}
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-300"
              sizes="(max-width: 640px) 50vw, (max-width: 768px) 33vw, 25vw"
            />
            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white">
              <ZoomIn className="w-5 h-5" />
            </div>
            <div className="absolute bottom-1.5 right-1.5 bg-black/60 text-white text-[10px] px-1.5 py-0.5 rounded font-mono">
              #{idx + 1}
            </div>
          </button>
        ))}
      </div>

      {/* Lightbox Modal */}
      {selectedIndex !== null && (
        <div 
          className="fixed inset-0 z-50 bg-black/90 backdrop-blur-sm flex items-center justify-center p-4"
          onClick={handleClose}
        >
          {/* Top Bar with counter & close */}
          <div 
            className="absolute top-4 left-4 right-4 flex items-center justify-between text-white z-20"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="text-sm font-medium bg-white/10 backdrop-blur-md px-3 py-1 rounded-full">
              {selectedIndex + 1} / {images.length}
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={handleClose}
              className="text-white hover:bg-white/20 rounded-full h-9 w-9"
            >
              <X className="w-5 h-5" />
            </Button>
          </div>

          {/* Navigation Prev Button */}
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

          {/* Main Image */}
          <div 
            className="relative max-w-4xl max-h-[80vh] w-full h-[75vh] flex items-center justify-center"
            onClick={(e) => e.stopPropagation()}
          >
            <img
              src={images[selectedIndex]}
              alt={`${title} - Foto ${selectedIndex + 1}`}
              className="max-w-full max-h-full object-contain rounded-[8px] shadow-2xl"
            />
          </div>

          {/* Navigation Next Button */}
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
