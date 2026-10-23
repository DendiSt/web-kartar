import Link from "next/link"

export default function Footer() {
  return (
    <footer className="border-t border-[#f0f1f2] dark:border-[#292a2e] bg-[#f0f1f2]/50 dark:bg-[#101214] py-14 mt-auto transition-colors">
      <div className="container mx-auto px-4 md:px-6 max-w-[1200px]">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10">
          <div className="md:col-span-2 space-y-4">
            <Link href="/" className="flex items-center gap-2.5">
              <img src="/images/logo.png" alt="Logo Karang Taruna" className="h-12 w-auto object-contain drop-shadow-sm" />
              <span className="font-heading font-bold text-xl text-[#101214] dark:text-white">
                Tirtajaya <span className="text-[#1868db]">01</span>
              </span>
            </Link>
            <p className="text-[#42526e] dark:text-[#b7b9be] text-sm max-w-sm leading-relaxed">
              Wadah pembinaan dan pengembangan generasi muda yang aktif, kreatif, dan inovatif di lingkungan Dusun Tirtajaya 01, Desa Sumurgintung, Pagaden Barat, Subang.
            </p>
          </div>
          <div>
            <h3 className="font-heading font-bold mb-4 text-[#101214] dark:text-white text-base">Navigasi</h3>
            <ul className="space-y-2.5 text-sm text-[#42526e] dark:text-[#b7b9be]">
              <li><Link href="/kegiatan" className="hover:text-[#1868db] transition-colors">Galeri Kegiatan</Link></li>
              <li><Link href="/agenda" className="hover:text-[#1868db] transition-colors">Jadwal Agenda</Link></li>
              <li><Link href="/struktur" className="hover:text-[#1868db] transition-colors">Struktur Pengurus</Link></li>
              <li><Link href="/keuangan" className="hover:text-[#1868db] transition-colors">Transparansi Kas</Link></li>
              <li><Link href="/tentang" className="hover:text-[#1868db] transition-colors">Tentang Organisasi</Link></li>
            </ul>
          </div>
          <div>
            <h3 className="font-heading font-bold mb-4 text-[#101214] dark:text-white text-base">Kontak & Lokasi</h3>
            <ul className="space-y-2.5 text-sm text-[#42526e] dark:text-[#b7b9be]">
              <li className="flex gap-2">
                <span className="text-[#1868db]">📍</span>
                <span>Sumurgintung, RT 07/RW 02, Desa Sumurgintung</span>
              </li>
              <li className="flex gap-2">
                <span className="text-[#1868db]">📱</span>
                <a href="https://wa.me/6281223772603" target="_blank" rel="noopener noreferrer" className="hover:text-[#1868db]">
                  0812-2377-2603 (Ketua)
                </a>
              </li>
              <li className="flex gap-2">
                <span className="text-[#1868db]">📱</span>
                <a href="https://wa.me/6285295619819" target="_blank" rel="noopener noreferrer" className="hover:text-[#1868db]">
                  0852-9561-9819 (Sekretaris)
                </a>
              </li>
            </ul>
          </div>
        </div>
        <div className="mt-12 pt-6 border-t border-[#f0f1f2] dark:border-[#292a2e] text-center text-xs text-[#42526e] dark:text-[#b7b9be]">
          <p>&copy; {new Date().getFullYear()} Karang Taruna Dusun Tirtajaya 01. Hak cipta dilindungi.</p>
        </div>
      </div>
    </footer>
  )
}
