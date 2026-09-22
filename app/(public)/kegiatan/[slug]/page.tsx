import { createClient } from '@/lib/supabase/server'
import { notFound } from 'next/navigation'
import Image from 'next/image'
import { Calendar, MapPin, ArrowLeft } from 'lucide-react'
import { format } from 'date-fns'
import { id as localeID } from 'date-fns/locale/id'
import Link from 'next/link'
import { Badge } from '@/components/ui/badge'

export async function generateMetadata({ params }: { params: { slug: string } }) {
  const supabase = await createClient()
  const { data } = await supabase.from('kegiatan').select('judul').eq('slug', params.slug).single()
  return {
    title: data ? `${data.judul} | Tirtajaya 01` : 'Kegiatan Tidak Ditemukan'
  }
}

export default async function KegiatanDetailPage({ params }: { params: { slug: string } }) {
  const supabase = await createClient()
  const { data: item } = await supabase
    .from('kegiatan')
    .select('*')
    .eq('slug', params.slug)
    .single()

  if (!item) {
    notFound()
  }

  return (
    <div className="container py-12 max-w-4xl mx-auto space-y-8">
      <Link href="/kegiatan" className="inline-flex items-center text-sm font-medium text-muted-foreground hover:text-primary transition-colors">
        <ArrowLeft className="mr-2 h-4 w-4" /> Kembali ke Daftar Kegiatan
      </Link>
      
      <div className="space-y-4">
        <div className="flex gap-2">
          <Badge variant={item.status === 'selesai' ? 'default' : item.status === 'berlangsung' ? 'secondary' : 'destructive'}>
            {item.status.replace('_', ' ')}
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

      {item.foto_cover && (
        <div className="aspect-video relative rounded-xl overflow-hidden border bg-muted">
          <Image 
            src={item.foto_cover} 
            alt={item.judul} 
            fill 
            className="object-cover"
            priority
          />
        </div>
      )}

      <div className="prose prose-slate max-w-none dark:prose-invert">
        {item.deskripsi.split('\n').map((paragraph: string, idx: number) => (
          <p key={idx}>{paragraph}</p>
        ))}
      </div>
    </div>
  )
}
