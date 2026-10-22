'use client'

import * as React from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Menu } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger, SheetTitle, SheetDescription } from "@/components/ui/sheet"
import { ThemeToggle } from "@/components/ThemeToggle"

const navLinks = [
  { href: "/", label: "Beranda" },
  { href: "/berita", label: "Berita" },
  { href: "/kegiatan", label: "Kegiatan" },
  { href: "/galeri", label: "Galeri" },
  { href: "/agenda", label: "Agenda" },
  { href: "/dokumen", label: "Dokumen" },
  { href: "/aspirasi", label: "Aspirasi" },
  { href: "/struktur", label: "Pengurus" },
  { href: "/keuangan", label: "Transparansi" },
  { href: "/tentang", label: "Tentang" },
  { href: "/kontak", label: "Kontak" },
]

export default function Navbar() {
  const pathname = usePathname()
  const [isOpen, setIsOpen] = React.useState(false)

  return (
    <header className="sticky top-0 z-50 w-full border-b border-[#f0f1f2] dark:border-[#292a2e] bg-white/95 dark:bg-[#101214]/95 backdrop-blur-sm transition-colors">
      <div className="container mx-auto flex h-16 items-center justify-between px-4 md:px-6 max-w-[1200px]">
        <Link href="/" className="flex items-center gap-2.5">
          <img src="/images/logo.png" alt="Logo Karang Taruna" className="h-10 w-auto object-contain drop-shadow-sm" />
          <span className="font-heading font-bold text-lg text-[#101214] dark:text-white hidden sm:inline-block tracking-tight">
            Tirtajaya <span className="text-[#1868db]">01</span>
          </span>
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-7 text-sm font-medium">
          {navLinks.map((link) => {
            const isActive = pathname === link.href
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`transition-colors py-1 ${
                  isActive
                    ? "text-[#1868db] font-semibold"
                    : "text-[#101214] dark:text-gray-300 hover:text-[#1868db] dark:hover:text-[#1868db]"
                }`}
              >
                {link.label}
              </Link>
            )
          })}
        </nav>

        <div className="hidden md:flex items-center gap-3">
          <ThemeToggle />
        </div>

        {/* Mobile Nav */}
        <Sheet open={isOpen} onOpenChange={setIsOpen}>
          <SheetTrigger render={<Button variant="ghost" size="icon" className="md:hidden" />}>
            <Menu className="h-5 w-5" />
            <span className="sr-only">Toggle Menu</span>
          </SheetTrigger>
          <SheetContent side="right" className="w-[300px] sm:w-[400px]">
            <SheetTitle className="text-left font-heading font-bold text-xl mb-4">Menu Navigasi</SheetTitle>
            <SheetDescription className="sr-only">Navigasi mobile Karang Taruna Tirtajaya 01</SheetDescription>
            <nav className="flex flex-col gap-4 mt-6">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setIsOpen(false)}
                  className={`text-base font-medium transition-colors hover:text-[#1868db] ${
                    pathname === link.href ? "text-[#1868db] font-semibold" : "text-muted-foreground"
                  }`}
                >
                  {link.label}
                </Link>
              ))}
              <div className="pt-4 border-t flex items-center justify-between">
                <span className="text-sm font-medium">Mode Tampilan</span>
                <ThemeToggle />
              </div>
            </nav>
          </SheetContent>
        </Sheet>
      </div>
    </header>
  )
}
