'use client'

import React, { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Loader2, UploadCloud, X, Link as LinkIcon, FileText } from 'lucide-react'

interface DokumenUploaderProps {
  bucket?: string
  folder?: string
  defaultUrl?: string | null
  defaultName?: string | null
  defaultSize?: string | null
  defaultType?: string | null
  onUploadSuccess: (info: {
    url: string
    name: string
    size: string
    type: string
  }) => void
}

export function DokumenUploader({
  bucket = 'kegiatan',
  folder = 'dokumen',
  defaultUrl,
  defaultName,
  defaultSize,
  defaultType,
  onUploadSuccess
}: DokumenUploaderProps) {
  const [isUploading, setIsUploading] = useState(false)
  const [mode, setMode] = useState<'upload' | 'url'>('upload')
  const [fileUrl, setFileUrl] = useState(defaultUrl || '')
  const [fileName, setFileName] = useState(defaultName || '')
  const [fileSize, setFileSize] = useState(defaultSize || '')
  const [fileType, setFileType] = useState(defaultType || 'pdf')
  const supabase = createClient()

  const [prevUrl, setPrevUrl] = useState(defaultUrl)
  if (defaultUrl !== prevUrl) {
    setPrevUrl(defaultUrl)
    setFileUrl(defaultUrl || '')
    setFileName(defaultName || '')
    setFileSize(defaultSize || '')
    setFileType(defaultType || 'pdf')
  }

  const formatBytes = (bytes: number) => {
    if (bytes === 0) return '0 Bytes'
    const k = 1024
    const sizes = ['Bytes', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i]
  }

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    setIsUploading(true)

    try {
      const ext = file.name.split('.').pop()?.toLowerCase() || 'pdf'
      const cleanName = file.name.replace(/[^a-zA-Z0-9.-]/g, '_')
      const fileNameUnique = `${Date.now()}_${cleanName}`
      const filePath = `${folder}/${fileNameUnique}`

      // Upload to Supabase Storage
      const { error } = await supabase.storage
        .from(bucket)
        .upload(filePath, file, {
          cacheControl: '3600',
          upsert: true
        })

      if (error) throw error

      // Get public URL
      const { data: { publicUrl } } = supabase.storage
        .from(bucket)
        .getPublicUrl(filePath)

      const formattedSize = formatBytes(file.size)

      setFileUrl(publicUrl)
      setFileName(file.name)
      setFileSize(formattedSize)
      setFileType(ext)

      onUploadSuccess({
        url: publicUrl,
        name: file.name,
        size: formattedSize,
        type: ext
      })
    } catch (error) {
      console.error('Upload error:', error)
      const msg = error instanceof Error ? error.message : 'Periksa koneksi'
      alert(`Gagal mengunggah dokumen: ${msg}`)
    } finally {
      setIsUploading(false)
    }
  }

  const handleManualUrl = (url: string) => {
    setFileUrl(url)
    const inferredExt = url.split('.').pop()?.split('?')[0]?.toLowerCase() || 'pdf'
    const inferredName = url.split('/').pop()?.split('?')[0] || 'dokumen.pdf'
    
    setFileName(inferredName)
    setFileType(inferredExt)
    setFileSize('Eksternal')

    onUploadSuccess({
      url,
      name: inferredName,
      size: 'Eksternal',
      type: inferredExt
    })
  }

  const handleClear = () => {
    setFileUrl('')
    setFileName('')
    setFileSize('')
    setFileType('pdf')
    onUploadSuccess({
      url: '',
      name: '',
      size: '',
      type: 'pdf'
    })
  }

  return (
    <div className="space-y-3">
      {/* Mode Toggle */}
      <div className="flex gap-2 text-xs">
        <Button
          type="button"
          variant={mode === 'upload' ? 'default' : 'outline'}
          size="sm"
          onClick={() => setMode('upload')}
          className="h-7 text-xs rounded-full"
        >
          <UploadCloud className="w-3.5 h-3.5 mr-1" /> Unggah File
        </Button>
        <Button
          type="button"
          variant={mode === 'url' ? 'default' : 'outline'}
          size="sm"
          onClick={() => setMode('url')}
          className="h-7 text-xs rounded-full"
        >
          <LinkIcon className="w-3.5 h-3.5 mr-1" /> Tautan / URL Link
        </Button>
      </div>

      {mode === 'upload' ? (
        <div className="relative border-2 border-dashed border-border hover:border-primary/50 transition-colors rounded-xl p-4 flex flex-col items-center justify-center gap-2 bg-muted/20">
          <input
            type="file"
            accept=".pdf,.doc,.docx,.xls,.xlsx,.ppt,.pptx,.zip,.rar"
            onChange={handleFileChange}
            disabled={isUploading}
            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer disabled:cursor-not-allowed"
          />
          {isUploading ? (
            <div className="flex flex-col items-center gap-2 text-muted-foreground py-2">
              <Loader2 className="w-6 h-6 animate-spin text-primary" />
              <span className="text-xs">Mengunggah file dokumen...</span>
            </div>
          ) : (
            <div className="flex flex-col items-center gap-1.5 text-center py-2">
              <UploadCloud className="w-8 h-8 text-muted-foreground/60" />
              <span className="text-xs font-semibold text-foreground">
                Klik atau seret file dokumen ke sini
              </span>
              <span className="text-[11px] text-muted-foreground">
                Mendukung PDF, Word (DOCX), Excel (XLSX), ZIP (Maks. 25MB)
              </span>
            </div>
          )}
        </div>
      ) : (
        <div className="space-y-1.5">
          <Input
            placeholder="https://drive.google.com/... atau URL dokumen"
            value={fileUrl}
            onChange={(e) => handleManualUrl(e.target.value)}
            className="text-xs h-9 bg-background dark:bg-[#181b20]"
          />
        </div>
      )}

      {/* Uploaded File Pill */}
      {fileUrl && (
        <div className="flex items-center justify-between p-2.5 bg-muted/50 dark:bg-[#181b20] rounded-lg border border-border text-xs">
          <div className="flex items-center gap-2 min-w-0">
            <div className="p-1.5 bg-[#1868db]/10 text-[#1868db] rounded-md shrink-0">
              <FileText className="w-4 h-4" />
            </div>
            <div className="min-w-0">
              <span className="font-semibold block truncate" title={fileName}>
                {fileName || 'Dokumen Terlampir'}
              </span>
              <span className="text-[11px] text-muted-foreground">
                {fileSize ? `${fileSize} • ` : ''}Format {fileType.toUpperCase()}
              </span>
            </div>
          </div>

          <Button
            type="button"
            variant="ghost"
            size="icon"
            onClick={handleClear}
            className="h-7 w-7 text-muted-foreground hover:text-destructive shrink-0"
            title="Hapus file"
          >
            <X className="w-4 h-4" />
          </Button>
        </div>
      )}
    </div>
  )
}
