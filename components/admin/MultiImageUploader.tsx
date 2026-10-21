'use client'

import React, { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Loader2, UploadCloud, X, Link as LinkIcon, Image as ImageIcon, Star, Plus, Check } from 'lucide-react'

interface MultiImageUploaderProps {
  bucket?: string
  folder?: string
  maxImages?: number
  images: string[]
  onChange: (images: string[]) => void
}

export function MultiImageUploader({
  bucket = 'kegiatan',
  folder = 'galeri',
  maxImages = 15,
  images = [],
  onChange
}: MultiImageUploaderProps) {
  const [isUploading, setIsUploading] = useState(false)
  const [uploadProgress, setUploadProgress] = useState('')
  const [inputMode, setInputMode] = useState<'upload' | 'url'>('upload')
  const [customUrl, setCustomUrl] = useState('')
  const supabase = createClient()

  const remainingSlots = Math.max(0, maxImages - images.length)

  // Handle Multiple File Upload
  const handleFilesChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const fileList = e.target.files
    if (!fileList || fileList.length === 0) return

    const filesToUpload = Array.from(fileList).slice(0, remainingSlots)
    if (filesToUpload.length === 0) {
      alert(`Maksimal ${maxImages} foto telah tercapai.`)
      return
    }

    if (fileList.length > remainingSlots) {
      alert(`Hanya ${remainingSlots} foto yang dapat ditambahkan karena batas maksimal ${maxImages} foto.`)
    }

    setIsUploading(true)
    const newUploadedUrls: string[] = []

    try {
      for (let i = 0; i < filesToUpload.length; i++) {
        const file = filesToUpload[i]
        setUploadProgress(`Mengunggah foto ${i + 1} dari ${filesToUpload.length}...`)

        const fileExt = file.name.split('.').pop()
        const fileName = `${Math.random().toString(36).substring(2, 9)}_${Date.now()}.${fileExt}`
        const filePath = `${folder}/${fileName}`

        const { error } = await supabase.storage
          .from(bucket)
          .upload(filePath, file, {
            cacheControl: '3600',
            upsert: true
          })

        if (error) {
          console.error('Upload Error for', file.name, error)
          continue
        }

        const { data: publicUrlData } = supabase.storage
          .from(bucket)
          .getPublicUrl(filePath)

        if (publicUrlData?.publicUrl) {
          newUploadedUrls.push(publicUrlData.publicUrl)
        }
      }

      if (newUploadedUrls.length > 0) {
        onChange([...images, ...newUploadedUrls])
      }
    } catch (error: any) {
      console.error('Batch Upload Error:', error)
      alert('Terjadi kesalahan saat mengunggah: ' + (error.message || error))
    } finally {
      setIsUploading(false)
      setUploadProgress('')
      // Reset input value so same files can be re-selected if needed
      e.target.value = ''
    }
  }

  // Handle URL Add
  const handleAddUrl = () => {
    const url = customUrl.trim()
    if (!url) return

    if (remainingSlots <= 0) {
      alert(`Maksimal ${maxImages} foto telah tercapai.`)
      return
    }

    // Support comma or newline separated URLs if multiple are pasted
    const splitUrls = url
      .split(/[\n,]/)
      .map((u) => u.trim())
      .filter((u) => u.length > 0 && u.startsWith('http'))

    if (splitUrls.length === 0) {
      alert('Masukkan link URL gambar yang valid (diawali http:// atau https://)')
      return
    }

    const toAdd = splitUrls.slice(0, remainingSlots)
    onChange([...images, ...toAdd])
    setCustomUrl('')
  }

  // Remove Image
  const handleRemove = (index: number) => {
    const updated = images.filter((_, i) => i !== index)
    onChange(updated)
  }

  // Set as Cover (Move to index 0)
  const handleSetCover = (index: number) => {
    if (index === 0) return
    const target = images[index]
    const updated = [target, ...images.filter((_, i) => i !== index)]
    onChange(updated)
  }

  return (
    <div className="w-full space-y-3">
      <div className="flex items-center justify-between text-xs">
        <span className="font-medium text-foreground">
          Galeri Foto Kegiatan{' '}
          <span className="text-muted-foreground font-normal">
            ({images.length}/{maxImages} foto)
          </span>
        </span>
        <button
          type="button"
          onClick={() => setInputMode(inputMode === 'upload' ? 'url' : 'upload')}
          className="text-[#1868db] hover:underline font-medium inline-flex items-center gap-1"
        >
          {inputMode === 'upload' ? (
            <>
              <LinkIcon className="w-3 h-3" /> Tambah via URL
            </>
          ) : (
            <>
              <UploadCloud className="w-3 h-3" /> Unggah File
            </>
          )}
        </button>
      </div>

      {/* Input Section (if under limit) */}
      {remainingSlots > 0 && (
        <div>
          {inputMode === 'upload' ? (
            <div className="border-2 border-dashed border-border hover:border-primary/50 rounded-[12px] p-4 flex flex-col items-center justify-center gap-2 bg-muted/20 hover:bg-muted/40 transition-colors cursor-pointer relative">
              <Input
                type="file"
                accept="image/*"
                multiple
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                onChange={handleFilesChange}
                disabled={isUploading}
              />
              {isUploading ? (
                <div className="flex flex-col items-center gap-1.5 py-1">
                  <Loader2 className="h-6 w-6 text-primary animate-spin" />
                  <p className="text-xs font-medium text-foreground">{uploadProgress}</p>
                </div>
              ) : (
                <>
                  <UploadCloud className="h-6 w-6 text-[#1868db]" />
                  <div className="text-center">
                    <p className="text-xs font-semibold text-foreground">
                      Pilih atau seret hingga {remainingSlots} foto lagi
                    </p>
                    <p className="text-[11px] text-muted-foreground mt-0.5">
                      Bisa pilih beberapa foto sekaligus (PNG, JPG, WEBP maks 5MB/foto)
                    </p>
                  </div>
                </>
              )}
            </div>
          ) : (
            <div className="flex gap-2">
              <Input
                type="url"
                placeholder="https://example.com/foto1.jpg, https://example.com/foto2.jpg"
                value={customUrl}
                onChange={(e) => setCustomUrl(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault()
                    handleAddUrl()
                  }
                }}
                className="text-xs"
              />
              <Button
                type="button"
                size="sm"
                onClick={handleAddUrl}
                disabled={!customUrl.trim()}
                className="rounded-full px-4 text-xs flex-shrink-0"
              >
                <Plus className="w-3.5 h-3.5 mr-1" /> Tambah
              </Button>
            </div>
          )}
        </div>
      )}

      {/* Image Thumbnails Grid */}
      {images.length > 0 && (
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 pt-1">
          {images.map((url, idx) => {
            const isCover = idx === 0
            return (
              <div
                key={`${url}-${idx}`}
                className={`relative group rounded-[8px] overflow-hidden border aspect-video bg-muted/40 transition-all ${
                  isCover ? 'ring-2 ring-primary border-transparent' : 'border-border'
                }`}
              >
                <img
                  src={url}
                  alt={`Foto ${idx + 1}`}
                  className="w-full h-full object-cover"
                />

                {/* Cover Badge */}
                {isCover ? (
                  <div className="absolute top-1.5 left-1.5 z-10">
                    <Badge className="bg-primary text-primary-foreground text-[10px] px-2 py-0.5 shadow-sm font-semibold flex items-center gap-1">
                      <Star className="w-2.5 h-2.5 fill-current" /> Cover Utama
                    </Badge>
                  </div>
                ) : (
                  <button
                    type="button"
                    onClick={() => handleSetCover(idx)}
                    title="Jadikan sebagai cover utama"
                    className="absolute top-1.5 left-1.5 z-10 opacity-0 group-hover:opacity-100 transition-opacity bg-black/60 hover:bg-black/80 text-white rounded-[4px] px-2 py-0.5 text-[10px] font-medium flex items-center gap-1"
                  >
                    <Star className="w-2.5 h-2.5" /> Jadikan Cover
                  </button>
                )}

                {/* Delete Button */}
                <button
                  type="button"
                  onClick={() => handleRemove(idx)}
                  title="Hapus foto ini"
                  className="absolute top-1.5 right-1.5 z-10 opacity-0 group-hover:opacity-100 transition-opacity bg-red-600/90 hover:bg-red-700 text-white rounded-full p-1 shadow-sm"
                >
                  <X className="w-3 h-3" />
                </button>

                {/* Number index badge */}
                <div className="absolute bottom-1 right-1.5 bg-black/50 text-white text-[10px] px-1.5 py-0.2 rounded font-mono">
                  #{idx + 1}
                </div>
              </div>
            )
          })}
        </div>
      )}

      {images.length === 0 && (
        <p className="text-[11px] text-muted-foreground italic">
          Belum ada foto yang ditambahkan. Foto pertama otomatis akan menjadi cover utama kegiatan.
        </p>
      )}
    </div>
  )
}
