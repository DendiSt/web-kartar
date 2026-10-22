'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Share2, Check, Copy } from 'lucide-react'

export function ShareButtons({ title, slug }: { title: string, slug: string }) {
  const [copied, setCopied] = useState(false)

  const shareUrl = typeof window !== 'undefined' 
    ? `${window.location.origin}/berita/${slug}` 
    : `https://kartar-tirtajaya.id/berita/${slug}`

  const handleCopy = () => {
    if (typeof navigator !== 'undefined') {
      navigator.clipboard.writeText(shareUrl)
      setCopied(true)
      setTimeout(() => setCopied(false), 2500)
    }
  }

  const handleWhatsApp = () => {
    const text = encodeURIComponent(`*${title}*\n\nBaca selengkapnya di Website Karang Taruna Tirtajaya 01:\n${shareUrl}`)
    window.open(`https://api.whatsapp.com/send?text=${text}`, '_blank')
  }

  return (
    <div className="flex flex-wrap items-center gap-2 pt-4 border-t border-border">
      <span className="text-xs font-semibold text-muted-foreground mr-1 flex items-center gap-1">
        <Share2 className="w-3.5 h-3.5" /> Bagikan:
      </span>
      
      <Button 
        variant="outline" 
        size="sm" 
        onClick={handleWhatsApp}
        className="rounded-full h-8 text-xs bg-emerald-50 text-emerald-700 border-emerald-300 dark:bg-emerald-950/60 dark:text-emerald-300 dark:border-emerald-800 hover:bg-emerald-100"
      >
        WhatsApp
      </Button>

      <Button 
        variant="outline" 
        size="sm" 
        onClick={handleCopy}
        className="rounded-full h-8 text-xs gap-1.5"
      >
        {copied ? (
          <>
            <Check className="w-3.5 h-3.5 text-emerald-600" />
            <span className="text-emerald-600">Tersalin!</span>
          </>
        ) : (
          <>
            <Copy className="w-3.5 h-3.5" />
            <span>Salin Link</span>
          </>
        )}
      </Button>
    </div>
  )
}
