'use client'

import React, { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Loader2, UploadCloud, X, ImageIcon } from 'lucide-react'
import Image from 'next/image'

interface ImageUploaderProps {
  bucket?: string
  folder?: string
  onUploadSuccess: (url: string) => void
  onUploadError?: (error: Error) => void
  defaultImage?: string | null
}

export function ImageUploader({
  bucket = 'public-storage',
  folder = 'uploads',
  onUploadSuccess,
  onUploadError,
  defaultImage
}: ImageUploaderProps) {
  const [isUploading, setIsUploading] = useState(false)
  const [preview, setPreview] = useState<string | null>(defaultImage || null)
  const supabase = createClient()

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    setIsUploading(true)
    
    // Create local preview immediately
    const objectUrl = URL.createObjectURL(file)
    setPreview(objectUrl)

    try {
      // 1. Generate unique filename
      const fileExt = file.name.split('.').pop()
      const fileName = `${Math.random().toString(36).substring(2, 15)}_${Date.now()}.${fileExt}`
      const filePath = `${folder}/${fileName}`

      // 2. Upload to Supabase Storage
      const { data, error } = await supabase.storage
        .from(bucket)
        .upload(filePath, file, {
          cacheControl: '3600',
          upsert: false
        })

      if (error) {
        throw error
      }

      // 3. Get Public URL
      const { data: publicUrlData } = supabase.storage
        .from(bucket)
        .getPublicUrl(filePath)

      const publicUrl = publicUrlData.publicUrl
      onUploadSuccess(publicUrl)
      
    } catch (error: any) {
      console.error('Upload Error:', error)
      if (onUploadError) {
        onUploadError(error)
      } else {
        alert('Gagal mengunggah gambar: ' + error.message)
      }
      // Revert preview on failure
      setPreview(defaultImage || null)
    } finally {
      setIsUploading(false)
    }
  }

  const clearImage = () => {
    setPreview(null)
    onUploadSuccess('') // Empty string to clear the value in form
  }

  return (
    <div className="w-full space-y-4">
      {preview ? (
        <div className="relative group w-full max-w-sm rounded-lg overflow-hidden border">
          <div className="aspect-video relative bg-muted">
            <Image 
              src={preview} 
              alt="Preview" 
              fill 
              className="object-cover"
              sizes="(max-width: 768px) 100vw, 384px"
            />
          </div>
          <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
            <Button 
              type="button" 
              variant="destructive" 
              size="sm" 
              onClick={clearImage}
              className="gap-2"
            >
              <X className="h-4 w-4" />
              Hapus Gambar
            </Button>
          </div>
        </div>
      ) : (
        <div className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-6 flex flex-col items-center justify-center gap-2 bg-muted/20 hover:bg-muted/50 transition-colors cursor-pointer relative">
          <Input 
            type="file" 
            accept="image/*" 
            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
            onChange={handleFileChange}
            disabled={isUploading}
          />
          {isUploading ? (
            <Loader2 className="h-8 w-8 text-muted-foreground animate-spin" />
          ) : (
            <UploadCloud className="h-8 w-8 text-muted-foreground" />
          )}
          <div className="text-center">
            <p className="text-sm font-medium">
              {isUploading ? 'Mengunggah...' : 'Klik atau seret gambar ke sini'}
            </p>
            <p className="text-xs text-muted-foreground mt-1">
              PNG, JPG, WEBP maks 5MB
            </p>
          </div>
        </div>
      )}
    </div>
  )
}
