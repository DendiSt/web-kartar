import { MapPin, Mail, Phone } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'

export const metadata = {
  title: 'Hubungi Kami | Tirtajaya 01'
}

export default function KontakPage() {
  return (
    <div className="container mx-auto px-4 sm:px-6 md:px-8 py-10 md:py-20 max-w-5xl space-y-10 md:space-y-12">
      <div className="text-center max-w-2xl mx-auto space-y-4">
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-heading font-bold tracking-tight">Hubungi Kami</h1>
        <p className="text-base sm:text-xl text-muted-foreground">
          Punya pertanyaan, saran, atau ingin berkolaborasi? Jangan ragu untuk menghubungi kami.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
        <Card className="bg-primary/5 border border-primary/10 shadow-xs text-center rounded-2xl">
          <CardContent className="p-6 space-y-4">
            <div className="mx-auto w-12 h-12 bg-primary/20 rounded-full flex items-center justify-center">
              <MapPin className="h-6 w-6 text-primary" />
            </div>
            <h3 className="font-bold font-heading">Alamat Sekretariat</h3>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Dusun Sumurgintung RT 07 / RW 02<br />
              Desa Sumurgintung<br />
              Pagaden Barat, Subang
            </p>
          </CardContent>
        </Card>

        <Card className="bg-secondary/5 border border-secondary/10 shadow-xs text-center rounded-2xl">
          <CardContent className="p-6 space-y-4">
            <div className="mx-auto w-12 h-12 bg-secondary/20 rounded-full flex items-center justify-center">
              <Phone className="h-6 w-6 text-secondary-foreground" />
            </div>
            <h3 className="font-bold font-heading">Kontak Langsung</h3>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Telp / WhatsApp:<br />
              <a href="https://wa.me/6281223772603" target="_blank" rel="noopener noreferrer" className="hover:text-primary transition-colors font-medium">0812-2377-2603 (Ketua)</a><br />
              <a href="https://wa.me/6285794364390" target="_blank" rel="noopener noreferrer" className="hover:text-primary transition-colors font-medium">0857-9436-4390 (Wakil Ketua)</a>
            </p>
          </CardContent>
        </Card>

        <Card className="bg-muted/50 border border-border/80 shadow-xs text-center rounded-2xl">
          <CardContent className="p-6 space-y-4">
            <div className="mx-auto w-12 h-12 bg-muted-foreground/20 rounded-full flex items-center justify-center">
              <Mail className="h-6 w-6 text-muted-foreground" />
            </div>
            <h3 className="font-bold font-heading">Email Kami</h3>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Untuk urusan surat menyurat atau kemitraan formal.<br />
              <a href="mailto:kartar1sumurgintung@gmail.com" className="hover:text-primary transition-colors font-medium mt-1 inline-block break-all">kartar1sumurgintung@gmail.com</a>
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="rounded-2xl overflow-hidden border bg-muted h-[320px] sm:h-[400px] relative group shadow-xs">
        <iframe
          src="https://maps.google.com/maps?q=-6.507167,107.751361&hl=id&z=17&output=embed"
          width="100%"
          height="100%"
          style={{ border: 0 }}
          allowFullScreen={true}
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
          title="Peta Lokasi Karang Taruna"
        ></iframe>
      </div>
    </div>
  )
}
