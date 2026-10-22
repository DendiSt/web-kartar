import { getAgenda } from '@/app/actions/agenda'
import AgendaCalendarClient from '@/components/public/AgendaCalendarClient'
import { Calendar } from 'lucide-react'

export const dynamic = 'force-dynamic'

export const metadata = {
  title: 'Kalender & Jadwal Agenda | Karang Taruna Tirtajaya 01',
  description: 'Kalender visual interaktif jadwal pertemuan, kerja bakti, turnamen, dan agenda kegiatan Karang Taruna Tirtajaya 01.'
}

export default async function AgendaPublicPage() {
  const data = await getAgenda()

  return (
    <div className="container py-10 md:py-16 max-w-6xl mx-auto space-y-8">
      {/* Title Header */}
      <div className="text-center max-w-3xl mx-auto space-y-3">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-semibold">
          <Calendar className="w-3.5 h-3.5" />
          Agenda &amp; Jadwal Dusun
        </div>
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-heading font-extrabold tracking-tight text-foreground">
          Kalender Agenda Kegiatan
        </h1>
        <p className="text-muted-foreground text-sm sm:text-base leading-relaxed">
          Temukan jadwal pertemuan warga, musyawarah pemuda, kerja bakti lingkungan, dan turnamen olahraga. Klik tanggal untuk melihat rincian atau simpan ke Google Calendar.
        </p>
      </div>

      {/* Interactive Calendar Component */}
      <AgendaCalendarClient initialData={data} />
    </div>
  )
}
