import { getBeritaList } from '@/app/actions/berita'
import BeritaListClient from '@/components/public/BeritaListClient'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Berita & Pengumuman | Karang Taruna Tirtajaya 01',
  description: 'Pusat informasi, pengumuman warga, dan kabar terkini seputar kegiatan kepemudaan Karang Taruna Tirtajaya 01 Dusun Sumurgintung.',
  openGraph: {
    title: 'Berita & Pengumuman | Karang Taruna Tirtajaya 01',
    description: 'Pusat informasi, pengumuman warga, dan kabar terkini seputar kegiatan kepemudaan Karang Taruna Tirtajaya 01.',
  }
}

export const revalidate = 60

export default async function BeritaPage() {
  const data = await getBeritaList({ status: 'published' })

  return (
    <div className="container mx-auto px-4 sm:px-6 md:px-8 py-10 md:py-20 max-w-6xl space-y-10 md:space-y-12">
      {/* Header Section */}
      <div className="text-center max-w-2xl mx-auto space-y-4">
        <span className="text-xs uppercase tracking-wider font-bold text-[#1868db] bg-[#1868db]/10 px-3.5 py-1 rounded-full inline-block">
          Informasi & Kabar Terkini
        </span>
        <h1 className="text-3xl font-heading font-bold tracking-tight sm:text-5xl text-[#101214] dark:text-white">
          Berita & Pengumuman
        </h1>
        <p className="text-base sm:text-lg text-[#42526e] dark:text-[#b7b9be] leading-relaxed">
          Dapatkan pengumuman resmi dari pengurus, info kegiatan dusun, dan kabar seputar kepemudaan Karang Taruna Tirtajaya 01.
        </p>
      </div>

      {/* Interactive List Client */}
      <BeritaListClient initialData={data} />
    </div>
  )
}
