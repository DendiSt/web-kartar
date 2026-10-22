import { getPublicAspirasiList } from '@/app/actions/aspirasi'
import AspirasiClient from '@/components/public/AspirasiClient'

export const dynamic = 'force-dynamic'

export const metadata = {
  title: 'Buku Tamu & Kotak Aspirasi | Karang Taruna Tirtajaya 01',
  description: 'Wadah penyampaian aspirasi, saran, pengaduan, dan apresiasi warga untuk kemajuan Dusun Sumurgintung.'
}

export default async function AspirasiPage() {
  const initialAspirasi = await getPublicAspirasiList()

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto max-w-[1200px] px-4 md:px-6 py-10 md:py-14">
        <AspirasiClient initialAspirasi={initialAspirasi} />
      </div>
    </div>
  )
}
