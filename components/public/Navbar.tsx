'use client'

import * as React from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Menu } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger, SheetTitle, SheetDescription } from "@/components/ui/sheet"

const navLinks = [
  { href: "/", label: "Beranda" },
  { href: "/kegiatan", label: "Kegiatan" },
  { href: "/agenda", label: "Agenda" },
  { href: "/struktur", label: "Pengurus" },
  { href: "/keuangan", label: "Transparansi" },
  { href: "/tentang", label: "Tentang Kami" },
  { href: "/kontak", label: "Kontak" },
]

export default function Navbar() {
  const pathname = usePathname()
  const [isOpen, setIsOpen] = React.useState(false)

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/80 backdrop-blur-md">
      <div className="container mx-auto flex h-16 items-center justify-between px-4 md:px-6">
        <Link href="/" className="flex items-center gap-2">
          <img src="/images/logo.png" alt="Logo Karang Taruna" className="h-12 w-auto object-contain drop-shadow-sm" />
          <span className="font-heading font-bold text-lg text-primary hidden sm:inline-block">
            Tirtajaya 01
          </span>
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-6 text-sm font-medium">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`transition-colors hover:text-primary ${pathname === link.href ? "text-primary font-semibold" : "text-muted-foreground"
                }`}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="hidden md:flex items-center gap-4">
          <Link href="/login">
            <Button variant="default" className="bg-primary text-primary-foreground hover:bg-primary/90 rounded-full px-6">
              Admin
            </Button>
          </Link>
        </div>

        {/* Mobile Nav */}
        <Sheet open={isOpen} onOpenChange={setIsOpen}>
          <SheetTrigger render={<Button variant="ghost" size="icon" className="md:hidden" />}>
            <Menu className="h-6 w-6" />
            <span className="sr-only">Toggle Menu</span>
          </SheetTrigger>
          <SheetContent side="right" className="w-[300px] sm:w-[400px]">
            <SheetTitle className="text-left font-heading text-primary">Menu Navigasi</SheetTitle>
            <SheetDescription className="sr-only">Navigasi halaman untuk mobile</SheetDescription>
            <nav className="flex flex-col gap-4 mt-8">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setIsOpen(false)}
                  className={`block px-2 py-1 text-lg transition-colors hover:text-primary ${pathname === link.href ? "text-primary font-semibold" : "text-foreground/70"
                    }`}
                >
                  {link.label}
                </Link>
              ))}
              <div className="mt-4 pt-4 border-t">
                <Link href="/login">
                  <Button className="w-full bg-primary hover:bg-primary/90 rounded-full">
                    Admin Login
                  </Button>
                </Link>
              </div>
            </nav>
          </SheetContent>
        </Sheet>
      </div>
    </header>
  )
}
