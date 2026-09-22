import { getAgenda } from '@/app/actions/agenda'
import { Card, CardContent } from '@/components/ui/card'
import { Calendar, Clock, MapPin } from 'lucide-react'
import { format } from 'date-fns'
import { id as localeID } from 'date-fns/locale/id'
import { Badge } from '@/components/ui/badge'

export const metadata = {
  title: 'Agenda & Jadwal | Tirtajaya 01'
}

export default async function AgendaPublicPage() {
  const data = await getAgenda()
  
  // Pisahkan agenda mendatang dan yang sudah lewat
  const now = new Date()
  const upcoming = data.filter(item => new Date(item.tanggal_mulai) >= now || item.status === 'akan_datang' || item.status === 'sedang_berlangsung')
  const past = data.filter(item => new Date(item.tanggal_mulai) < now && item.status !== 'akan_datang' && item.status !== 'sedang_berlangsung')

  return (
    <div className="container py-12 md:py-24 max-w-4xl mx-auto space-y-12">
      <div className="text-center space-y-4">
        <h1 className="text-4xl font-heading font-bold tracking-tight sm:text-5xl">Agenda Kegiatan</h1>
        <p className="text-xl text-muted-foreground">
          Jadwal pertemuan, rapat, dan rencana kegiatan Karang Taruna ke depan.
        </p>
      </div>

      <div className="space-y-8">
        <h2 className="text-2xl font-bold font-heading border-b pb-2">Agenda Mendatang</h2>
        {upcoming.length === 0 ? (
          <p className="text-muted-foreground text-center py-8">Tidak ada agenda mendatang saat ini.</p>
        ) : (
          <div className="space-y-6 relative before:absolute before:inset-0 before:ml-5 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-border before:to-transparent">
            {upcoming.map((item, idx) => (
              <div key={item.id} className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">
                <div className="flex items-center justify-center w-10 h-10 rounded-full border border-white bg-primary text-white shadow shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2">
                  <Calendar className="w-4 h-4" />
                </div>
                <div className="w-[calc(100%-4rem)] md:w-[calc(50%-2.5rem)] p-4 rounded-xl border bg-card shadow-sm">
                  <div className="flex items-center justify-between space-x-2 mb-1">
                    <div className="font-bold font-heading">{item.judul}</div>
                    <Badge variant={item.status === 'sedang_berlangsung' ? 'default' : 'outline'}>
                      {item.status.replace('_', ' ')}
                    </Badge>
                  </div>
                  <div className="flex flex-col gap-1 text-sm text-muted-foreground mt-3">
                    <div className="flex items-center">
                      <Calendar className="mr-2 h-4 w-4" />
                      {format(new Date(item.tanggal_mulai), 'EEEE, dd MMM yyyy', { locale: localeID })}
                    </div>
                    <div className="flex items-center">
                      <Clock className="mr-2 h-4 w-4" />
                      {format(new Date(item.tanggal_mulai), 'HH:mm')}
                      {item.tanggal_selesai && ` - ${format(new Date(item.tanggal_selesai), 'HH:mm')}`}
                    </div>
                    {item.lokasi && (
                      <div className="flex items-center">
                        <MapPin className="mr-2 h-4 w-4" />
                        {item.lokasi}
                      </div>
                    )}
                  </div>
                  {item.deskripsi && (
                    <p className="text-sm mt-3 pt-3 border-t text-muted-foreground">{item.deskripsi}</p>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
      
      {past.length > 0 && (
        <div className="space-y-8 pt-12">
          <h2 className="text-2xl font-bold font-heading border-b pb-2 text-muted-foreground">Agenda Selesai</h2>
          <div className="grid gap-4 md:grid-cols-2">
            {past.map(item => (
              <Card key={item.id} className="bg-muted/30">
                <CardContent className="p-4">
                  <h3 className="font-bold text-muted-foreground">{item.judul}</h3>
                  <div className="text-sm text-muted-foreground mt-2">
                    {format(new Date(item.tanggal_mulai), 'dd MMM yyyy', { locale: localeID })}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
