import HeroSection from '@/components/public/HeroSection'
import StatsSection from '@/components/public/StatsSection'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { createClient } from '@/lib/supabase/server'
import { getSaldoKas } from '@/app/actions/keuangan'
import Image from 'next/image'
import { Calendar, MapPin } from 'lucide-react'
import { format } from 'date-fns'
import { id as localeID } from 'date-fns/locale/id'

export default async function Home() {
  const supabase = await createClient()

  // 1. Fetch latest 3 kegiatan
  const { data: latestKegiatan } = await supabase
    .from('kegiatan')
    .select('*')
    .order('tanggal_pelaksanaan', { ascending: false })
    .limit(3)

  // 2. Fetch stats
  const { count: countPengurus } = await supabase
    .from('struktur_organisasi')
    .select('*', { count: 'exact', head: true })
    .eq('is_active', true)

  const { count: countProgram } = await supabase
    .from('kegiatan')
    .select('*', { count: 'exact', head: true })
    .eq('status', 'selesai')

  const saldoKas = await getSaldoKas()

  return (
    <div className="flex flex-col min-h-screen">
      <HeroSection />
      
      <StatsSection 
        anggotaAktif={countPengurus || 0} 
        programSukses={countProgram || 0}
        saldoKas={saldoKas}
      />
      
      {/* Quick Preview Section */}
      <section className="py-24 bg-background">
        <div className="container mx-auto px-4 md:px-6 max-w-6xl">
          <div className="flex flex-col items-center text-center mb-12">
            <h2 className="font-heading text-3xl font-bold sm:text-4xl">Kegiatan Terbaru</h2>
            <p className="mt-4 text-muted-foreground max-w-2xl">
              Intip beberapa program kerja dan kegiatan yang baru saja kami laksanakan bersama warga.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {!latestKegiatan || latestKegiatan.length === 0 ? (
              <div className="col-span-full text-center text-muted-foreground py-12">
                Belum ada kegiatan yang dipublikasikan.
              </div>
            ) : (
              latestKegiatan.map((item) => (
                <Card key={item.id} className="overflow-hidden border-border/50 shadow-sm transition-all hover:shadow-md hover:-translate-y-1 flex flex-col group">
                  <div className="aspect-video bg-muted relative overflow-hidden">
                    {item.foto_cover ? (
                      <Image 
                        src={item.foto_cover} 
                        alt={item.judul} 
                        fill 
                        className="object-cover group-hover:scale-105 transition-transform duration-300"
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 33vw, 33vw"
                      />
                    ) : (
                      <div className="absolute inset-0 flex items-center justify-center text-muted-foreground bg-secondary/50">
                        <span className="text-sm font-medium">Tanpa Gambar</span>
                      </div>
                    )}
                    <div className="absolute top-3 right-3">
                      <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-medium backdrop-blur-md uppercase tracking-wider ${
                        item.status === 'selesai' ? 'bg-black/50 text-white' : 
                        item.status === 'berlangsung' ? 'bg-primary/90 text-primary-foreground' : 'bg-red-500/90 text-white'
                      }`}>
                        {item.status.replace('_', ' ')}
                      </span>
                    </div>
                  </div>
                  <CardHeader className="pb-3 flex-1">
                    <CardTitle className="font-heading text-xl line-clamp-2">
                      <Link href={`/kegiatan/${item.slug}`} className="hover:text-primary transition-colors">
                        {item.judul}
                      </Link>
                    </CardTitle>
                    <CardDescription className="flex items-center gap-2 mt-1">
                      <Calendar className="h-3.5 w-3.5" />
                      {format(new Date(item.tanggal_pelaksanaan), 'dd MMMM yyyy', { locale: localeID })}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground line-clamp-3">
                      {item.deskripsi}
                    </p>
                  </CardContent>
                </Card>
              ))
            )}
          </div>
          
          <div className="mt-12 text-center">
            <Link href="/kegiatan">
              <Button variant="outline" className="rounded-full px-8 hover:bg-primary hover:text-primary-foreground">
                Lihat Semua Kegiatan
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}
