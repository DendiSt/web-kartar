import { getStruktur } from '@/app/actions/struktur'
import StrukturOrganisasiClient from '@/components/public/StrukturOrganisasiClient'
import { Network } from 'lucide-react'

export const metadata = {
  title: 'Struktur Organisasi | Karang Taruna Tirtajaya 01',
  description: 'Bagan dan susunan struktur kepengurusan Karang Taruna Tirtajaya 01 Dusun Sumurgintung periode 2026-sekarang.'
}

export const revalidate = 60

export default async function StrukturPublicPage() {
  const data = await getStruktur()
  
  // Filter only active members
  const activeMembers = data.filter(item => item.is_active)

  return (
    <div className="container mx-auto px-2 sm:px-6 md:px-8 py-6 sm:py-10 md:py-16 max-w-6xl space-y-6 sm:space-y-10">
      {/* Header Section */}
      <div className="text-center max-w-2xl mx-auto space-y-3">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-primary/10 text-primary border border-primary/20">
          <Network className="h-3.5 w-3.5" />
          Bagan Kepengurusan Resmi
        </div>
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-heading font-extrabold tracking-tight text-foreground">
          Struktur Organisasi
        </h1>
        <p className="text-base sm:text-lg text-muted-foreground leading-relaxed">
          Mengenal susunan pembina dan penggerak Karang Taruna Tirtajaya 01 dalam mengemban amanah kemajuan pemuda dan warga dusun.
        </p>
      </div>

      {/* Interactive Struktur Client (Bagan Hierarki + Grid View) */}
      <StrukturOrganisasiClient initialMembers={activeMembers} />
    </div>
  )
}

