'use client'

import { useState, useEffect, useCallback } from 'react'
import Image from 'next/image'
import { X, Maximize2 } from 'lucide-react'

interface Props {
  src: string
  alt: string
}

export default function TentangPhotoViewer({ src, alt }: Props) {
  const [isOpen, setIsOpen] = useState(false)
  const [scale, setScale] = useState(1)
  const [position, setPosition] = useState({ x: 0, y: 0 })
  const [isDragging, setIsDragging] = useState(false)
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 })

  const closeLightbox = useCallback(() => {
    setIsOpen(false)
    setScale(1)
    setPosition({ x: 0, y: 0 })
  }, [])

  // Lock body scroll when modal is open
  useEffect(() => {
    if (isOpen) {
      const originalOverflow = document.body.style.overflow
      document.body.style.overflow = 'hidden'
      return () => {
        document.body.style.overflow = originalOverflow
      }
    }
  }, [isOpen])

  // Keyboard navigation
  useEffect(() => {
    if (!isOpen) return

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        closeLightbox()
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [isOpen, closeLightbox])

  // Toggle zoom on click / tap (1x -> 2x -> 1x)
  const handleImageClick = (e: React.MouseEvent) => {
    e.stopPropagation()
    if (isDragging) return
    if (scale === 1) {
      setScale(2)
    } else {
      setScale(1)
      setPosition({ x: 0, y: 0 })
    }
  }

  // Mouse Drag handlers
  const handleMouseDown = (e: React.MouseEvent) => {
    if (scale <= 1) return
    e.preventDefault()
    setIsDragging(true)
    setDragStart({ x: e.clientX - position.x, y: e.clientY - position.y })
  }

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging || scale <= 1) return
    e.preventDefault()
    setPosition({
      x: e.clientX - dragStart.x,
      y: e.clientY - dragStart.y
    })
  }

  const handleMouseUp = () => {
    setIsDragging(false)
  }

  // Touch handlers for mobile
  const handleTouchStart = (e: React.TouchEvent) => {
    if (scale <= 1) return
    if (e.touches.length === 1) {
      setIsDragging(true)
      setDragStart({
        x: e.touches[0].clientX - position.x,
        y: e.touches[0].clientY - position.y
      })
    }
  }

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!isDragging || scale <= 1) return
    if (e.touches.length === 1) {
      setPosition({
        x: e.touches[0].clientX - dragStart.x,
        y: e.touches[0].clientY - dragStart.y
      })
    }
  }

  const handleTouchEnd = () => {
    setIsDragging(false)
  }

  return (
    <>
      {/* Thumbnail Card */}
      <div
        onClick={() => setIsOpen(true)}
        className="aspect-4/3 sm:aspect-square relative rounded-2xl overflow-hidden bg-muted shadow-md border border-border/80 group cursor-zoom-in"
        role="button"
        tabIndex={0}
        aria-label="Buka foto layar penuh"
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            setIsOpen(true)
          }
        }}
      >
        <Image
          src={src}
          alt={alt}
          fill
          className="object-cover group-hover:scale-105 transition-transform duration-500"
          sizes="(max-width: 768px) 100vw, 450px"
          priority
        />

        {/* Hover overlay for desktop */}
        <div className="absolute inset-0 bg-black/35 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center pointer-events-none">
          <div className="bg-black/70 backdrop-blur-md text-white text-xs font-semibold px-4 py-2 rounded-full flex items-center gap-2 shadow-lg scale-95 group-hover:scale-100 transition-transform">
            <Maximize2 className="w-4 h-4" />
            <span>Klik untuk Layar Penuh</span>
          </div>
        </div>

        {/* Touch badge for mobile */}
        <div className="sm:hidden absolute bottom-2.5 right-2.5 bg-black/70 backdrop-blur-md text-white text-[10px] font-medium px-2.5 py-1 rounded-full flex items-center gap-1.5 shadow-sm">
          <Maximize2 className="w-3 h-3" />
          <span>Layar Penuh</span>
        </div>
      </div>

      {/* Fullscreen Lightbox Modal */}
      {isOpen && (
        <div
          className="fixed inset-0 z-50 bg-black/95 backdrop-blur-md flex flex-col justify-between animate-in fade-in duration-200 select-none overflow-hidden"
          onClick={closeLightbox}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
        >
          {/* Tombol X Close Selalu Ada di Pojok Kanan Atas */}
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation()
              closeLightbox()
            }}
            className="absolute top-3.5 right-3.5 sm:top-5 sm:right-5 z-50 w-10 h-10 sm:w-11 sm:h-11 rounded-full bg-red-600/90 hover:bg-red-600 active:scale-95 text-white flex items-center justify-center transition-all cursor-pointer backdrop-blur-md shadow-xl border border-white/20"
            title="Tutup (Esc)"
            aria-label="Tutup foto"
          >
            <X className="w-5 h-5 sm:w-6 sm:h-6" />
          </button>

          {/* Top Bar with Title only */}
          <div
            className="w-full pt-3.5 pb-3.5 pl-4 pr-16 sm:pt-5 sm:pb-5 sm:pl-6 sm:pr-20 flex items-center text-white z-20 bg-gradient-to-b from-black/80 to-transparent"
            onClick={(e) => e.stopPropagation()}
          >
            <span className="text-xs sm:text-sm font-semibold truncate text-white/90">
              {alt}
            </span>
          </div>

          {/* Main Zoomable Image Canvas */}
          <div
            className="flex-1 flex items-center justify-center p-2 sm:p-4 overflow-hidden relative"
            onMouseDown={handleMouseDown}
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
          >
            <div
              onClick={handleImageClick}
              style={{
                transform: `translate(${position.x}px, ${position.y}px) scale(${scale})`,
                transition: isDragging ? 'none' : 'transform 0.25s ease-out',
                cursor: scale > 1 ? (isDragging ? 'grabbing' : 'grab') : 'zoom-in'
              }}
              className="relative max-w-5xl max-h-[82vh] w-full h-[75vh] flex items-center justify-center"
            >
              <Image
                src={src}
                alt={alt}
                fill
                className="object-contain pointer-events-none"
                sizes="100vw"
                priority
              />
            </div>
          </div>

          {/* Bottom Hint Bar */}
          <div
            className="w-full py-2.5 px-4 text-center text-white/70 text-[11px] sm:text-xs bg-gradient-to-t from-black/80 to-transparent"
            onClick={(e) => e.stopPropagation()}
          >
            {scale > 1 ? (
              <span>Geser gambar untuk menjelajah &bull; Klik untuk kembalikan &bull; Tekan tombol X untuk keluar</span>
            ) : (
              <span>Klik gambar untuk memperbesar &bull; Tekan tombol X di pojok kanan atas untuk keluar</span>
            )}
          </div>
        </div>
      )}
    </>
  )
}
