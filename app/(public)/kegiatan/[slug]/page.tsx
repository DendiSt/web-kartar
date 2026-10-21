import { prisma } from '@/lib/prisma'
import { notFound } from 'next/navigation'
import { Calendar, MapPin, ArrowLeft } from 'lucide-react'
import { format } from 'date-fns'
import { id as localeID } from 'date-fns/locale/id'
import Link from 'next/link'
import { Badge } from '@/components/ui/badge'
import { KegiatanDetailViewer } from '@/components/public/KegiatanDetailViewer'

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const data = await prisma.kegiatan.findUnique({
    where: { slug },
    select: { judul: true }
  })
  return {
    title: data ? `${data.judul} | Tirtajaya 01` : 'Kegiatan Tidak Ditemukan'
  }
}

export default async function KegiatanDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const item = await prisma.kegiatan.findUnique({
    where: { slug }
  })

  if (!item) {
    notFound()
  }

  // Unified photo list: cover first, then gallery photos
  const allImages: string[] = []
  if (item.foto_cover) allImages.push(item.foto_cover)
  if (item.foto_galeri && Array.isArray(item.foto_galeri)) {
    for (const img of item.foto_galeri) {
      if (!allImages.includes(img)) {
        allImages.push(img)
      }
    }
  }

  return (
    <div className="container py-12 max-w-4xl mx-auto space-y-8">
      <Link href="/kegiatan" className="inline-flex items-center text-sm font-medium text-muted-foreground hover:text-primary transition-colors">
        <ArrowLeft className="mr-2 h-4 w-4" /> Kembali ke Daftar Kegiatan
      </Link>
      
      <div className="space-y-4">
        <div className="flex gap-2">
          <Badge variant={item.status === 'selesai' ? 'default' : item.status === 'berlangsung' ? 'secondary' : 'destructive'}>
            {item.status?.replace('_', ' ') || ''}
          </Badge>
        </div>
        <h1 className="text-4xl font-heading font-bold tracking-tight sm:text-5xl">{item.judul}</h1>
        
        <div className="flex flex-wrap gap-4 text-muted-foreground text-sm pt-2">
          <div className="flex items-center">
            <Calendar className="mr-2 h-4 w-4" />
            {format(new Date(item.tanggal_pelaksanaan), 'EEEE, dd MMMM yyyy', { locale: localeID })}
          </div>
          <div className="flex items-center">
            <MapPin className="mr-2 h-4 w-4" />
            {item.lokasi || 'Tidak dicantumkan lokasi'}
          </div>
        </div>
      </div>

      <KegiatanDetailViewer 
        images={allImages}
        title={item.judul}
        description={item.deskripsi}
      />
    </div>
  )
}
