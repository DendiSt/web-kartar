import Link from "next/link"

export default function Footer() {
  return (
    <footer className="border-t bg-muted/40 py-12 mt-12">
      <div className="container mx-auto px-4 md:px-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="md:col-span-2">
            <Link href="/" className="flex items-center gap-2 mb-4">
              <img src="/images/logo.png" alt="Logo Karang Taruna" className="h-16 w-auto object-contain drop-shadow-sm" />
              <span className="font-heading font-bold text-2xl text-primary">Tirtajaya 01</span>
            </Link>
            <p className="text-muted-foreground text-sm max-w-sm mt-4">
              Wadah pembinaan dan pengembangan generasi muda yang aktif, kreatif, dan inovatif di lingkungan Dusun Tirtajaya 01.
            </p>
          </div>
          <div>
            <h3 className="font-heading font-semibold mb-4 text-foreground text-lg">Navigasi Cepat</h3>
            <ul className="space-y-3 text-sm text-muted-foreground">
              <li><Link href="/kegiatan" className="hover:text-primary transition-colors">Galeri Kegiatan</Link></li>
              <li><Link href="/agenda" className="hover:text-primary transition-colors">Jadwal Agenda</Link></li>
              <li><Link href="/struktur" className="hover:text-primary transition-colors">Struktur Pengurus</Link></li>
              <li><Link href="/keuangan" className="hover:text-primary transition-colors">Transparansi Keuangan</Link></li>
            </ul>
          </div>
          <div>
            <h3 className="font-heading font-semibold mb-4 text-foreground text-lg">Kontak Kami</h3>
            <ul className="space-y-3 text-sm text-muted-foreground">
              <li className="flex gap-2"><span className="text-primary">📍</span> Dusun Tirtajaya 01, Desa Contoh</li>
              <li className="flex gap-2"><span className="text-primary">📧</span> info@tirtajaya01.id</li>
              <li className="flex gap-2"><span className="text-primary">📞</span> 0812-3456-7890</li>
            </ul>
          </div>
        </div>
        <div className="mt-12 pt-8 border-t text-center text-sm text-muted-foreground">
          <p>&copy; {new Date().getFullYear()} Karang Taruna Tirtajaya 01. Hak cipta dilindungi.</p>
        </div>
      </div>
    </footer>
  )
}
