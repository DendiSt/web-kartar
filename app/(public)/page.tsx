import HeroSection from '@/components/public/HeroSection'
import StatsSection from '@/components/public/StatsSection'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen">
      <HeroSection />
      <StatsSection />
      
      {/* Quick Preview Section */}
      <section className="py-24 bg-background">
        <div className="container mx-auto px-4 md:px-6">
          <div className="flex flex-col items-center text-center mb-12">
            <h2 className="font-heading text-3xl font-bold sm:text-4xl">Kegiatan Terbaru</h2>
            <p className="mt-4 text-muted-foreground max-w-2xl">
              Intip beberapa program kerja dan kegiatan yang baru saja kami laksanakan bersama warga.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[1, 2, 3].map((i) => (
              <Card key={i} className="overflow-hidden border-border/50 shadow-sm transition-all hover:shadow-md hover:-translate-y-1">
                <div className="aspect-video bg-muted relative">
                  <div className="absolute inset-0 flex items-center justify-center text-muted-foreground">
                    <span className="text-4xl">📸</span>
                  </div>
                </div>
                <CardHeader>
                  <CardTitle className="font-heading text-xl">Kerja Bakti Bersih Desa {i}</CardTitle>
                  <CardDescription>12 Agustus 2026</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground line-clamp-2">
                    Kegiatan rutin bulanan membersihkan selokan dan jalan utama dusun bersama seluruh warga untuk mencegah banjir di musim hujan.
                  </p>
                </CardContent>
              </Card>
            ))}
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
