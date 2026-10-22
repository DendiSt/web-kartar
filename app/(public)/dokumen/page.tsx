import { getDokumenList } from '@/app/actions/dokumen'
import DokumenListClient from '@/components/public/DokumenListClient'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Dokumen & Arsip Resmi | Karang Taruna Tirtajaya 01',
  description: 'Pusat unduhan berkas resmi organisasi Karang Taruna Tirtajaya 01, meliputi SK Pengurus, AD/ART, Proposal, dan Laporan Pertanggungjawaban (LPJ).',
}

export const revalidate = 60

export default async function DokumenPage() {
  const data = await getDokumenList({ isPublicOnly: true })

  return (
    <div className="container py-12 md:py-20 max-w-6xl mx-auto px-4 md:px-6 space-y-12">
      {/* Header Section */}
      <div className="text-center max-w-2xl mx-auto space-y-4">
        <span className="text-xs uppercase tracking-wider font-bold text-[#1868db] bg-[#1868db]/10 px-3.5 py-1 rounded-full inline-block">
          Transparansi & Akuntabilitas
        </span>
        <h1 className="text-3xl font-heading font-bold tracking-tight sm:text-5xl text-[#101214] dark:text-white">
          Dokumen & Arsip Organisasi
        </h1>
        <p className="text-base sm:text-lg text-[#42526e] dark:text-[#b7b9be] leading-relaxed">
          Akses dan unduh berkas resmi Karang Taruna Tirtajaya 01 seperti SK Pengurus, AD/ART, proposal kegiatan, dan laporan pertanggungjawaban.
        </p>
      </div>

      {/* Interactive List Client */}
      <DokumenListClient initialData={data} />
    </div>
  )
}
