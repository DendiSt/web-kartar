import { getKegiatan } from '@/app/actions/kegiatan'
import { Card, CardContent, CardFooter } from '@/components/ui/card'
import Image from 'next/image'
import Link from 'next/link'
import { Calendar, MapPin, ArrowRight } from 'lucide-react'
import { format } from 'date-fns'
import { id as localeID } from 'date-fns/locale/id'

export const metadata = {
  title: 'Kegiatan | Tirtajaya 01'
}

export default async function KegiatanPublicPage() {
  const data = await getKegiatan()

  return (
    <div className="container py-12 md:py-24 max-w-6xl mx-auto space-y-12">
      <div className="text-center max-w-2xl mx-auto space-y-4">
        <h1 className="text-4xl font-heading font-bold tracking-tight sm:text-5xl">Kegiatan Kami</h1>
        <p className="text-xl text-muted-foreground">
          Jejak langkah dan program kerja Karang Taruna Tirtajaya 01 dalam membangun pemuda dan masyarakat.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {data.length === 0 ? (
          <div className="col-span-full text-center py-12 text-muted-foreground">
            Belum ada data kegiatan.
          </div>
        ) : (
          data.map((item) => (
            <Card key={item.id} className="overflow-hidden group hover:shadow-lg transition-shadow border-muted flex flex-col">
              <div className="aspect-video relative bg-muted overflow-hidden">
                {item.foto_cover ? (
                  <Image 
                    src={item.foto_cover} 
                    alt={item.judul} 
                    fill 
                    className="object-cover group-hover:scale-105 transition-transform duration-300"
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  />
                ) : (
                  <div className="absolute inset-0 flex items-center justify-center bg-secondary/50">
                    <span className="text-muted-foreground font-medium">Tanpa Gambar</span>
                  </div>
                )}
                <div className="absolute top-4 right-4">
                  <span className={`px-3 py-1 rounded-full text-xs font-medium backdrop-blur-md ${
                    item.status === 'selesai' ? 'bg-black/50 text-white' : 
                    item.status === 'berlangsung' ? 'bg-primary/90 text-primary-foreground' : 'bg-red-500/90 text-white'
                  }`}>
                    {item.status.replace('_', ' ')}
                  </span>
                </div>
              </div>
              <CardContent className="p-6 flex-1 space-y-4">
                <h3 className="font-heading text-xl font-bold line-clamp-2 group-hover:text-primary transition-colors">
                  <Link href={`/kegiatan/${item.slug}`}>
                    {item.judul}
                  </Link>
                </h3>
                <div className="space-y-2 text-sm text-muted-foreground">
                  <div className="flex items-center">
                    <Calendar className="mr-2 h-4 w-4" />
                    {format(new Date(item.tanggal_pelaksanaan), 'dd MMMM yyyy', { locale: localeID })}
                  </div>
                  <div className="flex items-center">
                    <MapPin className="mr-2 h-4 w-4" />
                    {item.lokasi || 'Tidak ada lokasi'}
                  </div>
                </div>
                <p className="text-muted-foreground line-clamp-3 text-sm">
                  {item.deskripsi}
                </p>
              </CardContent>
              <CardFooter className="p-6 pt-0">
                <Link 
                  href={`/kegiatan/${item.slug}`} 
                  className="inline-flex items-center text-sm font-medium text-primary hover:underline"
                >
                  Baca selengkapnya <ArrowRight className="ml-1 h-4 w-4" />
                </Link>
              </CardFooter>
            </Card>
          ))
        )}
      </div>
    </div>
  )
}
