import HeroSection from '@/components/public/HeroSection'
import StatsSection from '@/components/public/StatsSection'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { prisma } from '@/lib/prisma'
import { getSaldoKas } from '@/app/actions/keuangan'
import Image from 'next/image'
import { Calendar, ArrowRight, Camera, Newspaper, Pin } from 'lucide-react'
import { format } from 'date-fns'
import { id as localeID } from 'date-fns/locale/id'
import type { Kegiatan, Berita } from '@prisma/client'

export const revalidate = 60

export default async function Home() {
  const [latestKegiatan, latestBerita, countPengurus, countProgram, saldoKas] = await Promise.all([
    prisma.kegiatan.findMany({
      orderBy: { tanggal_pelaksanaan: 'desc' },
      take: 3
    }),
    prisma.berita.findMany({
      where: { status: 'published' },
      orderBy: [
        { is_pinned: 'desc' },
        { created_at: 'desc' }
      ],
      take: 3
    }),
    prisma.strukturOrganisasi.count({
      where: { is_active: true }
    }),
    prisma.kegiatan.count({
      where: { status: 'selesai' }
    }),
    getSaldoKas()
  ])

  return (
    <div className="flex flex-col min-h-screen">
      <HeroSection />
      
      <StatsSection 
        anggotaAktif={countPengurus || 0} 
        programSukses={countProgram || 0}
        saldoKas={saldoKas}
      />

      {/* Pengumuman & Berita Terkini Section */}
      {latestBerita && latestBerita.length > 0 && (
        <section className="py-16 md:py-20 bg-slate-50/70 dark:bg-[#14161a] border-b border-[#f0f1f2] dark:border-[#292a2e]">
          <div className="container mx-auto px-4 md:px-6 max-w-[1200px]">
            <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-4">
              <div>
                <span className="text-xs uppercase tracking-wider font-bold text-[#1868db] bg-[#1868db]/10 px-3 py-1 rounded-full inline-block mb-3">
                  Informasi Warga
                </span>
                <h2 className="font-heading text-2xl sm:text-3xl font-bold text-[#101214] dark:text-white tracking-tight">
                  Pengumuman & Kabar Terkini
                </h2>
                <p className="mt-2 text-[#42526e] dark:text-[#b7b9be] text-sm max-w-xl">
                  Ikuti informasi resmi, instruksi kegiatan, dan kabar terbaru dari pengurus Karang Taruna Tirtajaya 01.
                </p>
              </div>

              <Link href="/berita">
                <Button 
                  variant="outline" 
                  size="sm"
                  className="rounded-full px-5 h-9 text-xs border-[#1868db] text-[#1868db] hover:bg-[#1868db]/10"
                >
                  Lihat Semua Berita <ArrowRight className="ml-1.5 h-3.5 w-3.5" />
                </Button>
              </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {latestBerita.map((item: Berita) => (
                <Card 
                  key={item.id}
                  className="rounded-[20px] bg-white dark:bg-[#181b20] border border-[#f0f1f2] dark:border-[#292a2e] shadow-[0_0_1px_0_rgba(9,30,66,0.31),0_1px_1px_0_rgba(9,30,66,0.15)] dark:shadow-none p-5 flex flex-col group transition-all hover:translate-y-[-3px]"
                >
                  <div className="aspect-[16/10] bg-[#f0f1f2] dark:bg-[#1c2b42] relative overflow-hidden rounded-[8px] mb-4">
                    {item.foto_cover ? (
                      <Image 
                        src={item.foto_cover} 
                        alt={item.judul} 
                        fill 
                        className="object-cover group-hover:scale-105 transition-transform duration-300"
                        sizes="(max-width: 768px) 100vw, 33vw"
                      />
                    ) : (
                      <div className="h-full w-full flex flex-col items-center justify-center bg-secondary/50 text-muted-foreground">
                        <Newspaper className="w-8 h-8 opacity-40 mb-1" />
                        <span className="text-xs font-medium">Info Dusun</span>
                      </div>
                    )}

                    <div className="absolute top-2.5 left-2.5">
                      <Badge 
                        variant="outline" 
                        className="rounded-full text-[11px] font-semibold bg-white/90 dark:bg-black/80 backdrop-blur-md shadow-sm border-none uppercase"
                      >
                        {item.kategori.replace('_', ' ')}
                      </Badge>
                    </div>

                    {item.is_pinned && (
                      <div className="absolute top-2.5 right-2.5 bg-amber-500 text-white p-1 rounded-full shadow-sm" title="Disematkan">
                        <Pin className="w-3.5 h-3.5 fill-white" />
                      </div>
                    )}
                  </div>

                  <CardHeader className="p-0 pb-2">
                    <CardTitle className="font-heading text-base font-bold line-clamp-2 text-[#101214] dark:text-white leading-snug">
                      <Link href={`/berita/${item.slug}`} className="hover:text-[#1868db] transition-colors">
                        {item.judul}
                      </Link>
                    </CardTitle>
                    <CardDescription className="flex items-center gap-2 mt-1 text-xs text-[#42526e] dark:text-[#b7b9be]">
                      <Calendar className="h-3 w-3 text-[#1868db]" />
                      {item.created_at ? format(new Date(item.created_at), 'dd MMMM yyyy', { locale: localeID }) : '-'}
                    </CardDescription>
                  </CardHeader>

                  <CardContent className="p-0 pt-1 flex-1">
                    <p className="text-xs sm:text-sm text-[#42526e] dark:text-[#b7b9be] line-clamp-3 leading-relaxed">
                      {item.ringkasan || item.konten}
                    </p>
                  </CardContent>

                  <div className="pt-3 mt-4 border-t border-[#f0f1f2] dark:border-[#292a2e]">
                    <Link href={`/berita/${item.slug}`} className="inline-flex items-center text-xs font-semibold text-[#1868db] hover:underline">
                      Baca Selengkapnya <ArrowRight className="ml-1 h-3 w-3" />
                    </Link>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        </section>
      )}
      
      {/* Kegiatan Terbaru Section */}
      <section className="py-20 md:py-24 bg-white dark:bg-[#101214]">
        <div className="container mx-auto px-4 md:px-6 max-w-[1200px]">
          <div className="flex flex-col items-center text-center mb-14">
            <h2 className="font-heading text-3xl font-bold sm:text-4xl text-[#101214] dark:text-white tracking-tight">
              Kegiatan Terbaru
            </h2>
            <p className="mt-3 text-[#42526e] dark:text-[#b7b9be] max-w-xl text-base leading-relaxed">
              Program kerja dan aksi nyata yang baru saja dilaksanakan bersama pemuda dan warga dusun.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {!latestKegiatan || latestKegiatan.length === 0 ? (
              <div className="col-span-full text-center text-muted-foreground py-12">
                Belum ada kegiatan yang dipublikasikan.
              </div>
            ) : (
              latestKegiatan.map((item: Kegiatan) => (
                <Card 
                  key={item.id} 
                  className="rounded-[20px] bg-white dark:bg-[#181b20] border border-[#f0f1f2] dark:border-[#292a2e] shadow-[0_0_1px_0_rgba(9,30,66,0.31),0_1px_1px_0_rgba(9,30,66,0.15)] dark:shadow-none p-5 flex flex-col group transition-all hover:translate-y-[-3px]"
                >
                  {/* Image container with 5px radius corners as per DESIGN.md */}
                  <div className="aspect-video bg-[#f0f1f2] dark:bg-[#1c2b42] relative overflow-hidden rounded-[5px] mb-4">
                    {item.foto_cover ? (
                      <Image 
                        src={item.foto_cover} 
                        alt={item.judul} 
                        fill 
                        className="object-cover group-hover:scale-105 transition-transform duration-300 rounded-[5px]"
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 33vw, 33vw"
                      />
                    ) : (
                      <div className="absolute inset-0 flex items-center justify-center text-muted-foreground bg-secondary/50 rounded-[5px]">
                        <span className="text-sm font-medium">Tanpa Gambar</span>
                      </div>
                    )}
                    <div className="absolute top-3 right-3">
                      <Badge 
                        variant={item.status === 'selesai' ? 'default' : item.status === 'berlangsung' ? 'yellow' : 'secondary'}
                        className="rounded-full text-[12px] uppercase tracking-wide font-medium shadow-none"
                      >
                        {item.status?.replace('_', ' ') || ''}
                      </Badge>
                    </div>
                    {item.foto_galeri && item.foto_galeri.length > 1 && (
                      <div className="absolute bottom-2.5 right-2.5 bg-black/60 backdrop-blur-md text-white text-[11px] font-medium px-2 py-0.5 rounded-full flex items-center gap-1 shadow-sm">
                        <Camera className="w-3 h-3" />
                        <span>{item.foto_galeri.length} Foto</span>
                      </div>
                    )}
                  </div>

                  <CardHeader className="p-0 pb-3">
                    <CardTitle className="font-heading text-lg font-bold line-clamp-2 text-[#101214] dark:text-white leading-snug">
                      <Link href={`/kegiatan/${item.slug}`} className="hover:text-[#1868db] transition-colors">
                        {item.judul}
                      </Link>
                    </CardTitle>
                    <CardDescription className="flex items-center gap-2 mt-1 text-xs text-[#42526e] dark:text-[#b7b9be]">
                      <Calendar className="h-3.5 w-3.5 text-[#1868db]" />
                      {format(new Date(item.tanggal_pelaksanaan), 'dd MMMM yyyy', { locale: localeID })}
                    </CardDescription>
                  </CardHeader>

                  <CardContent className="p-0 pt-1 flex-1">
                    <p className="text-sm text-[#42526e] dark:text-[#b7b9be] line-clamp-3 leading-relaxed">
                      {item.deskripsi}
                    </p>
                  </CardContent>

                  <div className="pt-4 mt-4 border-t border-[#f0f1f2] dark:border-[#292a2e]">
                    <Link href={`/kegiatan/${item.slug}`} className="inline-flex items-center text-sm font-semibold text-[#1868db] hover:underline">
                      Baca Selengkapnya <ArrowRight className="ml-1.5 h-3.5 w-3.5" />
                    </Link>
                  </div>
                </Card>
              ))
            )}
          </div>
          
          <div className="mt-14 text-center">
            <Link href="/kegiatan">
              <Button 
                variant="outline" 
                size="lg"
                className="rounded-full px-8 h-11 text-sm border-[#101214] dark:border-white text-[#101214] dark:text-white hover:bg-[#f0f1f2] dark:hover:bg-white/10"
              >
                Lihat Semua Kegiatan & Program Kerja
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Signature Atlassian Lavender Feature Band Divider as defined in DESIGN.md */}
      <section className="py-20 bg-[#eed7fc] text-[#101214] dark:bg-[#20152e] dark:text-white transition-colors">
        <div className="container mx-auto px-4 md:px-6 max-w-[1200px] text-center">
          <div className="max-w-3xl mx-auto space-y-6">
            <h2 className="font-heading text-3xl sm:text-4xl font-bold tracking-tight text-[#101214] dark:text-white">
              Menjalin Persatuan, Menggerakkan Kemajuan
            </h2>
            <p className="text-base sm:text-lg text-[#101214]/85 dark:text-gray-200 leading-relaxed font-normal">
              Karang Taruna Tirtajaya 01 berkomitmen menjadi ruang kolaborasi bagi seluruh pemuda Dusun Sumurgintung. Dari kepemudaan, sosial, hingga olahraga, kami terus hadir memberi kontribusi nyata.
            </p>
            <div className="pt-4 flex flex-wrap justify-center gap-4">
              <Link href="/struktur">
                <Button 
                  className="rounded-full px-7 h-11 bg-[#1868db] text-white hover:bg-[#1558be] font-medium shadow-none"
                >
                  Kenali Tim Pengurus Kami
                </Button>
              </Link>
              <Link href="/kontak">
                <Button 
                  variant="outline"
                  className="rounded-full px-7 h-11 border-[#101214] text-[#101214] dark:border-white dark:text-white hover:bg-black/5 dark:hover:bg-white/10"
                >
                  Hubungi Karang Taruna
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
