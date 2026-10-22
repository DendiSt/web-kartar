import { getGaleriList, getGaleriAlbums } from '@/app/actions/galeri'
import GaleriListClient from '@/components/public/GaleriListClient'
import { Camera } from 'lucide-react'

export const revalidate = 60

export const metadata = {
  title: 'Galeri Foto & Dokumentasi | Karang Taruna Tirtajaya 01',
  description: 'Dokumentasi album foto kegiatan, gotong royong, peringatan 17 Agustus, dan potret pemuda Karang Taruna Dusun Sumurgintung.'
}

export default async function GaleriPublicPage() {
  const [items, albums] = await Promise.all([
    getGaleriList(),
    getGaleriAlbums()
  ])

  return (
    <div className="container py-10 md:py-16 max-w-7xl mx-auto space-y-8">
      {/* Title Header */}
      <div className="text-center max-w-3xl mx-auto space-y-3">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-semibold">
          <Camera className="w-3.5 h-3.5" />
          Dokumentasi &amp; Arsip Visual
        </div>
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-heading font-extrabold tracking-tight text-foreground">
          Galeri Foto Kegiatan
        </h1>
        <p className="text-muted-foreground text-sm sm:text-base leading-relaxed">
          Kumpulan momen kebersamaan, aksi sosial gotong royong, turnamen olahraga, dan dokumentasi sejarah pemuda Dusun Sumurgintung.
        </p>
      </div>

      {/* Interactive Gallery Component */}
      <GaleriListClient initialItems={items} albums={albums} />
    </div>
  )
}
