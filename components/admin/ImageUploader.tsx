'use client'

import React, { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Loader2, UploadCloud, X, Link as LinkIcon } from 'lucide-react'

interface ImageUploaderProps {
  bucket?: string
  folder?: string
  onUploadSuccess: (url: string) => void
  onUploadError?: (error: Error) => void
  defaultImage?: string | null
}

export function ImageUploader({
  bucket = 'kegiatan',
  folder = 'cover',
  onUploadSuccess,
  onUploadError,
  defaultImage
}: ImageUploaderProps) {
  const [isUploading, setIsUploading] = useState(false)
  const [preview, setPreview] = useState<string | null>(defaultImage || null)
  const [inputMode, setInputMode] = useState<'upload' | 'url'>('upload')
  const [customUrl, setCustomUrl] = useState('')
  const supabase = createClient()

  const [prevDefault, setPrevDefault] = useState(defaultImage)
  if (defaultImage !== prevDefault) {
    setPrevDefault(defaultImage)
    setPreview(defaultImage || null)
    setCustomUrl(defaultImage || '')
  }

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    setIsUploading(true)

    // Create local object URL for preview
    const objectUrl = URL.createObjectURL(file)
    setPreview(objectUrl)

    try {
      // 1. Generate unique filename
      const fileExt = file.name.split('.').pop()
      const fileName = `${Math.random().toString(36).substring(2, 10)}_${Date.now()}.${fileExt}`
      const filePath = `${folder}/${fileName}`

      // 2. Upload to Supabase Storage
      const { error } = await supabase.storage
        .from(bucket)
        .upload(filePath, file, {
          cacheControl: '3600',
          upsert: true
        })

      if (error) {
        throw error
      }

      // 3. Get Public URL
      const { data: publicUrlData } = supabase.storage
        .from(bucket)
        .getPublicUrl(filePath)

      const publicUrl = publicUrlData.publicUrl
      setPreview(publicUrl)
      setCustomUrl(publicUrl)
      onUploadSuccess(publicUrl)
      
    } catch (error) {
      console.error('Upload Error:', error)
      const err = error instanceof Error ? error : new Error(String(error))
      if (onUploadError) {
        onUploadError(err)
      } else {
        alert('Gagal mengunggah gambar ke cloud storage: ' + err.message)
      }
      setPreview(defaultImage || null)
    } finally {
      setIsUploading(false)
    }
  }

  const handleUrlApply = () => {
    if (customUrl.trim()) {
      setPreview(customUrl.trim())
      onUploadSuccess(customUrl.trim())
    }
  }

  const clearImage = () => {
    setPreview(null)
    setCustomUrl('')
    onUploadSuccess('')
  }

  return (
    <div className="w-full space-y-3">
      {preview ? (
        <div className="relative group w-full max-w-sm rounded-[10px] overflow-hidden border border-border bg-muted/30">
          <div className="aspect-video relative overflow-hidden flex items-center justify-center bg-muted">
            <img 
              src={preview} 
              alt="Preview" 
              className="w-full h-full object-cover"
              onError={() => {
                // fallback if broken image link
              }}
            />
          </div>
          <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
            <Button 
              type="button" 
              variant="destructive" 
              size="sm" 
              onClick={clearImage}
              className="gap-1.5 rounded-full px-4 text-xs font-semibold"
            >
              <X className="h-3.5 w-3.5" />
              Hapus Gambar
            </Button>
          </div>
        </div>
      ) : (
        <div className="space-y-3">
          {inputMode === 'upload' ? (
            <div className="border-2 border-dashed border-border hover:border-primary/50 rounded-[12px] p-5 flex flex-col items-center justify-center gap-2 bg-muted/20 hover:bg-muted/40 transition-colors cursor-pointer relative">
              <Input 
                type="file" 
                accept="image/*" 
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                onChange={handleFileChange}
                disabled={isUploading}
              />
              {isUploading ? (
                <Loader2 className="h-7 w-7 text-primary animate-spin" />
              ) : (
                <UploadCloud className="h-7 w-7 text-[#1868db]" />
              )}
              <div className="text-center">
                <p className="text-sm font-semibold text-foreground">
                  {isUploading ? 'Sedang mengunggah...' : 'Klik atau seret foto cover ke sini'}
                </p>
                <p className="text-xs text-muted-foreground mt-0.5">
                  PNG, JPG, WEBP maksimal 5MB
                </p>
              </div>
            </div>
          ) : (
            <div className="flex gap-2">
              <Input 
                type="url" 
                placeholder="https://example.com/foto-kegiatan.jpg" 
                value={customUrl}
                onChange={(e) => {
                  setCustomUrl(e.target.value)
                  if (!e.target.value) {
                    onUploadSuccess('')
                  }
                }}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault()
                    handleUrlApply()
                  }
                }}
                onBlur={() => {
                  if (customUrl.trim() && customUrl.startsWith('http')) {
                    handleUrlApply()
                  }
                }}
                className="text-sm"
              />
              <Button 
                type="button" 
                size="sm" 
                onClick={handleUrlApply}
                disabled={!customUrl.trim()}
                className="rounded-full px-4 text-xs"
              >
                Gunakan URL
              </Button>
            </div>
          )}

          {/* Toggle between Upload File and Paste Link */}
          <div className="flex items-center justify-between text-xs text-muted-foreground pt-0.5">
            <span>
              {inputMode === 'upload' ? 'Atau punya tautan gambar?' : 'Atau mau unggah file langsung?'}
            </span>
            <button
              type="button"
              onClick={() => setInputMode(inputMode === 'upload' ? 'url' : 'upload')}
              className="text-[#1868db] hover:underline font-medium inline-flex items-center gap-1"
            >
              {inputMode === 'upload' ? (
                <>
                  <LinkIcon className="w-3 h-3" /> Masukkan URL Gambar
                </>
              ) : (
                <>
                  <UploadCloud className="w-3 h-3" /> Unggah File Gambar
                </>
              )}
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
