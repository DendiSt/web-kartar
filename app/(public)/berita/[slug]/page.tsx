import { prisma } from '@/lib/prisma'
import { notFound } from 'next/navigation'
import { Calendar, User, Eye, ArrowLeft, Pin, Newspaper } from 'lucide-react'
import { format } from 'date-fns'
import { id as localeID } from 'date-fns/locale/id'
import Link from 'next/link'
import Image from 'next/image'
import { Badge } from '@/components/ui/badge'
import { Card } from '@/components/ui/card'
import { incrementBeritaViews } from '@/app/actions/berita'
import { ShareButtons } from '@/components/public/ShareButtons'
import type { Metadata } from 'next'

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params
  const item = await prisma.berita.findUnique({
    where: { slug },
    select: { judul: true, ringkasan: true, foto_cover: true }
  })

  if (!item) {
    return { title: 'Berita Tidak Ditemukan | Tirtajaya 01' }
  }

  return {
    title: `${item.judul} | Karang Taruna Tirtajaya 01`,
    description: item.ringkasan || item.judul,
    openGraph: {
      title: item.judul,
      description: item.ringkasan || item.judul,
      images: item.foto_cover ? [item.foto_cover] : []
    }
  }
}

export default async function BeritaDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const item = await prisma.berita.findUnique({
    where: { slug }
  })

  if (!item || item.status === 'draft') {
    notFound()
  }

  // Increment view counter in background
  incrementBeritaViews(slug)

  // Fetch other latest news for recommendation
  const related = await prisma.berita.findMany({
    where: {
      slug: { not: slug },
      status: 'published'
    },
    orderBy: { created_at: 'desc' },
    take: 3
  })

  const getKategoriBadge = (kategori: string) => {
    switch (kategori) {
      case 'pengumuman':
        return { label: 'Pengumuman', class: 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300 border-amber-200 dark:border-amber-800' }
      case 'info_dusun':
        return { label: 'Info Dusun', class: 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800' }
      case 'kegiatan':
        return { label: 'Kegiatan', class: 'bg-purple-100 text-purple-800 dark:bg-purple-950 dark:text-purple-300 border-purple-200 dark:border-purple-800' }
      default:
        return { label: 'Berita', class: 'bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-300 border-blue-200 dark:border-blue-800' }
    }
  }

  const badge = getKategoriBadge(item.kategori)

  return (
    <div className="container py-10 md:py-16 max-w-4xl mx-auto px-4 md:px-6 space-y-10">
      {/* Back button */}
      <Link 
        href="/berita" 
        className="inline-flex items-center text-sm font-semibold text-muted-foreground hover:text-[#1868db] transition-colors"
      >
        <ArrowLeft className="mr-2 h-4 w-4" /> Kembali ke Berita & Pengumuman
      </Link>

      {/* Article Header */}
      <div className="space-y-4">
        <div className="flex flex-wrap items-center gap-2">
          <Badge variant="outline" className={`rounded-full text-xs font-semibold px-3 py-0.5 ${badge.class}`}>
            {badge.label}
          </Badge>
          {item.is_pinned && (
            <Badge variant="outline" className="bg-amber-50 text-amber-700 dark:bg-amber-950 dark:text-amber-400 border-amber-300 gap-1 text-xs font-semibold py-0.5">
              <Pin className="w-3 h-3 fill-amber-500 text-amber-500" /> Disematkan
            </Badge>
          )}
        </div>

        <h1 className="text-3xl font-heading font-bold tracking-tight sm:text-4xl md:text-5xl text-[#101214] dark:text-white leading-tight">
          {item.judul}
        </h1>

        <div className="flex flex-wrap items-center gap-4 text-xs sm:text-sm text-[#42526e] dark:text-[#b7b9be] pt-2 border-b border-border pb-4">
          <div className="flex items-center gap-1.5 font-medium text-foreground">
            <User className="h-4 w-4 text-[#1868db]" />
            <span>Oleh: {item.penulis || 'Pengurus Karang Taruna'}</span>
          </div>
          <span>•</span>
          <div className="flex items-center gap-1.5">
            <Calendar className="h-4 w-4 text-[#1868db]" />
            <span>{item.created_at ? format(new Date(item.created_at), 'EEEE, dd MMMM yyyy', { locale: localeID }) : '-'}</span>
          </div>
          <span>•</span>
          <div className="flex items-center gap-1.5">
            <Eye className="h-4 w-4" />
            <span>{item.views + 1} kali dibaca</span>
          </div>
        </div>
      </div>

      {/* Cover Image */}
      {item.foto_cover && (
        <div className="aspect-[16/9] relative rounded-[16px] overflow-hidden bg-muted shadow-sm border border-border">
          <Image
            src={item.foto_cover}
            alt={item.judul}
            fill
            priority
            className="object-cover"
            sizes="(max-width: 896px) 100vw, 896px"
          />
        </div>
      )}

      {/* Lead Summary Callout (if available) */}
      {item.ringkasan && (
        <div className="bg-[#eed7fc]/30 dark:bg-[#20152e]/50 border-l-4 border-[#1868db] p-5 rounded-r-xl">
          <p className="text-base sm:text-lg font-medium text-[#101214] dark:text-gray-200 leading-relaxed italic">
            &ldquo;{item.ringkasan}&rdquo;
          </p>
        </div>
      )}

      {/* Full Content Body */}
      <article className="prose dark:prose-invert max-w-none text-[#101214] dark:text-gray-200 leading-relaxed text-base sm:text-lg space-y-6">
        <div className="whitespace-pre-line font-sans leading-loose">
          {item.konten}
        </div>
      </article>

      {/* Share Section */}
      <ShareButtons title={item.judul} slug={item.slug} />

      {/* Related News Section */}
      {related.length > 0 && (
        <div className="pt-12 border-t border-border space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="font-heading text-2xl font-bold text-[#101214] dark:text-white">
              Berita & Pengumuman Lainnya
            </h2>
            <Link href="/berita" className="text-sm font-semibold text-[#1868db] hover:underline">
              Lihat Semua
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {related.map((rel) => {
              const relBadge = getKategoriBadge(rel.kategori)
              return (
                <Card 
                  key={rel.id}
                  className="rounded-[16px] bg-white dark:bg-[#181b20] border border-[#f0f1f2] dark:border-[#292a2e] p-4 flex flex-col group hover:shadow-md transition-all"
                >
                  <div className="aspect-video relative rounded-[6px] overflow-hidden bg-muted mb-3">
                    {rel.foto_cover ? (
                      <Image 
                        src={rel.foto_cover} 
                        alt={rel.judul} 
                        fill 
                        className="object-cover group-hover:scale-105 transition-transform duration-300" 
                        sizes="(max-width: 768px) 100vw, 33vw"
                      />
                    ) : (
                      <div className="h-full w-full flex items-center justify-center bg-secondary/50 text-muted-foreground">
                        <Newspaper className="w-6 h-6 opacity-40" />
                      </div>
                    )}
                  </div>

                  <Badge variant="outline" className={`w-fit mb-2 text-[10px] font-semibold ${relBadge.class}`}>
                    {relBadge.label}
                  </Badge>

                  <h4 className="font-heading font-bold text-sm line-clamp-2 group-hover:text-[#1868db] transition-colors leading-snug mb-2">
                    <Link href={`/berita/${rel.slug}`}>
                      {rel.judul}
                    </Link>
                  </h4>

                  <span className="text-[11px] text-muted-foreground mt-auto">
                    {rel.created_at ? format(new Date(rel.created_at), 'dd MMM yyyy', { locale: localeID }) : '-'}
                  </span>
                </Card>
              )
            })}
          </div>
        </div>
      )}
    </div>
  )
}
