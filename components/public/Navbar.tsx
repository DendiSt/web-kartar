'use client'

import * as React from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import {
  Home,
  Newspaper,
  Calendar,
  Images,
  CalendarDays,
  FileText,
  MessageSquareQuote,
  Users,
  Wallet,
  Info,
  PhoneCall
} from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import { ThemeToggle } from "@/components/ThemeToggle"

const navLinks = [
  { href: "/", label: "Beranda", icon: Home },
  { href: "/berita", label: "Berita", icon: Newspaper },
  { href: "/kegiatan", label: "Kegiatan", icon: Calendar },
  { href: "/galeri", label: "Galeri", icon: Images },
  { href: "/agenda", label: "Agenda", icon: CalendarDays },
  { href: "/dokumen", label: "Dokumen", icon: FileText },
  { href: "/aspirasi", label: "Aspirasi", icon: MessageSquareQuote },
  { href: "/struktur", label: "Pengurus", icon: Users },
  { href: "/keuangan", label: "Transparansi", icon: Wallet },
  { href: "/tentang", label: "Tentang", icon: Info },
  { href: "/kontak", label: "Kontak", icon: PhoneCall },
]

export default function Navbar() {
  const pathname = usePathname()
  const [isOpen, setIsOpen] = React.useState(false)

  // Auto-close menu saat berpindah rute
  React.useEffect(() => {
    setIsOpen(false)
  }, [pathname])

  // Cegah scroll pada body saat menu mobile terbuka
  React.useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
    return () => {
      document.body.style.overflow = ''
    }
  }, [isOpen])

  // Menutup menu jika menekan tombol Escape
  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setIsOpen(false)
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [])

  return (
    <header className="sticky top-0 z-50 w-full border-b border-[#f0f1f2] dark:border-[#292a2e] bg-white/95 dark:bg-[#101214]/95 backdrop-blur-md transition-colors">
      <div className="container mx-auto flex h-16 items-center justify-between px-4 md:px-6 max-w-[1200px]">
        {/* Brand Logo & Title */}
        <Link 
          href="/" 
          onClick={() => setIsOpen(false)}
          className="flex items-center gap-2.5 z-50 select-none group"
        >
          <img 
            src="/images/logo.png" 
            alt="Logo Karang Taruna" 
            className="h-10 w-auto object-contain drop-shadow-sm group-hover:scale-105 transition-transform" 
          />
          <span className="font-heading font-bold text-lg text-[#101214] dark:text-white hidden sm:inline-block tracking-tight">
            Tirtajaya <span className="text-[#1868db]">01</span>
          </span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-6 lg:gap-7 text-sm font-medium">
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

        {/* Header Right Actions (Theme Toggle & Hamburger Button) */}
        <div className="flex items-center gap-2 z-50">
          <ThemeToggle />

          {/* Smooth Morphing Hamburger to X Button for Mobile */}
          <button
            type="button"
            onClick={() => setIsOpen(!isOpen)}
            aria-label={isOpen ? "Tutup menu navigasi" : "Buka menu navigasi"}
            aria-expanded={isOpen}
            className="md:hidden relative flex flex-col justify-center items-center w-10 h-10 rounded-xl hover:bg-muted/70 active:scale-95 transition-all text-foreground focus:outline-none focus-visible:ring-2 focus-visible:ring-primary"
          >
            <span className="sr-only">Toggle Menu</span>
            <div className="w-5 h-4 relative flex flex-col justify-between items-center pointer-events-none">
              {/* Top Bar */}
              <span
                className={`h-0.5 w-5 bg-foreground rounded-full transition-all duration-300 ease-in-out origin-center ${
                  isOpen ? 'rotate-45 translate-y-[7px]' : ''
                }`}
              />
              {/* Middle Bar */}
              <span
                className={`h-0.5 w-5 bg-foreground rounded-full transition-all duration-200 ease-in-out ${
                  isOpen ? 'opacity-0 scale-x-0' : 'opacity-100 scale-x-100'
                }`}
              />
              {/* Bottom Bar */}
              <span
                className={`h-0.5 w-5 bg-foreground rounded-full transition-all duration-300 ease-in-out origin-center ${
                  isOpen ? '-rotate-45 -translate-y-[7px]' : ''
                }`}
              />
            </div>
          </button>
        </div>
      </div>

      {/* Mobile Dropdown Menu (Slide Down from Top under Headbar) */}
      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop Blur Overlay */}
            <motion.div
              key="mobile-nav-backdrop"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.25 }}
              onClick={() => setIsOpen(false)}
              className="fixed inset-0 top-16 bg-black/40 backdrop-blur-sm z-40 md:hidden"
            />

            {/* Slide Down Content */}
            <motion.div
              key="mobile-nav-panel"
              initial={{ opacity: 0, y: -16, height: 0 }}
              animate={{ opacity: 1, y: 0, height: "auto" }}
              exit={{ opacity: 0, y: -16, height: 0 }}
              transition={{ duration: 0.28, ease: [0.16, 1, 0.3, 1] }}
              className="fixed top-16 left-0 right-0 z-50 bg-white/95 dark:bg-[#101214]/95 backdrop-blur-xl border-b border-[#f0f1f2] dark:border-[#292a2e] shadow-2xl overflow-hidden md:hidden"
            >
              <div className="container mx-auto px-4 sm:px-6 py-5 max-w-[1200px] space-y-4 max-h-[calc(100vh-5rem)] overflow-y-auto">
                {/* Menu items: 1 column on compact mobile, 2 columns on larger mobile */}
                <div className="grid grid-cols-1 min-[420px]:grid-cols-2 gap-1.5 sm:gap-2">
                  {navLinks.map((link) => {
                    const isActive = pathname === link.href
                    const Icon = link.icon
                    return (
                      <Link
                        key={link.href}
                        href={link.href}
                        onClick={() => setIsOpen(false)}
                        className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all ${
                          isActive
                            ? "bg-[#1868db] text-white font-semibold shadow-md shadow-[#1868db]/25 scale-[1.01]"
                            : "bg-muted/40 hover:bg-muted text-foreground/85 hover:text-foreground active:scale-[0.98]"
                        }`}
                      >
                        <Icon 
                          className={`w-4 h-4 shrink-0 transition-colors ${
                            isActive ? 'text-white' : 'text-[#1868db]'
                          }`} 
                        />
                        <span className="font-medium whitespace-nowrap">{link.label}</span>
                      </Link>
                    )
                  })}
                </div>

                {/* Footer note inside mobile menu */}
                <div className="pt-3 border-t border-border/60 flex items-center justify-center text-xs text-muted-foreground text-center">
                  <span>Karang Taruna Tirtajaya 01 &bull; Dusun Sumurgintung</span>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </header>
  )
}
