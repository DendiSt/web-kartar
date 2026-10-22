'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { 
  LayoutDashboard, 
  Calendar, 
  Users, 
  FileText, 
  Settings, 
  LogOut, 
  Image as ImageIcon, 
  Newspaper, 
  FolderArchive, 
  Camera, 
  UserCheck, 
  MessageSquare, 
  Printer 
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { logout } from '@/app/actions/auth'
import { ThemeToggle } from '@/components/ThemeToggle'

const sidebarLinks = [
  { name: 'Overview', href: '/dashboard', icon: LayoutDashboard },
  { name: 'Berita & Info', href: '/dashboard/berita', icon: Newspaper },
  { name: 'Dokumen & Arsip', href: '/dashboard/dokumen', icon: FolderArchive },
  { name: 'Kegiatan', href: '/dashboard/kegiatan', icon: ImageIcon },
  { name: 'Galeri Foto', href: '/dashboard/galeri', icon: Camera },
  { name: 'Agenda', href: '/dashboard/agenda', icon: Calendar },
  { name: 'Data Anggota', href: '/dashboard/anggota', icon: UserCheck },
  { name: 'Aspirasi Warga', href: '/dashboard/aspirasi', icon: MessageSquare },
  { name: 'Pengurus', href: '/dashboard/struktur', icon: Users },
  { name: 'Keuangan', href: '/dashboard/keuangan', icon: FileText },
  { name: 'Pusat Laporan', href: '/dashboard/laporan', icon: Printer },
  { name: 'Pengaturan', href: '/dashboard/pengaturan', icon: Settings },
]

export default function Sidebar() {
  const pathname = usePathname()

  return (
    <div className="flex h-full w-full flex-col bg-background px-4 py-6 select-none overflow-hidden overscroll-contain">
      {/* Header Logo & Brand (Terkunci di atas) */}
      <div className="flex items-center gap-3 px-2 mb-6 shrink-0">
        <img src="/images/logo.png" alt="Logo" className="h-8 w-auto object-contain" />
        <span className="font-heading font-bold text-lg text-primary tracking-tight">Admin Panel</span>
      </div>
      
      {/* Navigation List: Scroll mandiri terisolasi jika layar pendek, overscroll-contain agar tidak tembus ke konten utama */}
      <nav className="flex-1 space-y-1 overflow-y-auto overscroll-contain pr-1">
        {sidebarLinks.map((link) => {
          const isActive = pathname === link.href || (pathname.startsWith(link.href) && link.href !== '/dashboard')
          return (
            <Link
              key={link.name}
              href={link.href}
              className={cn(
                "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                isActive 
                  ? "bg-primary text-primary-foreground font-semibold shadow-xs" 
                  : "text-muted-foreground hover:bg-muted hover:text-foreground"
              )}
            >
              <link.icon className="h-4 w-4 shrink-0" />
              <span className="truncate">{link.name}</span>
            </Link>
          )
        })}
      </nav>

      {/* Footer Area: Mode Tampilan & Tombol Keluar (Terkunci di bawah) */}
      <div className="pt-4 border-t border-border mt-auto space-y-3 shrink-0">
        <div className="flex items-center justify-between px-2">
          <span className="text-xs font-medium text-muted-foreground">Mode Tampilan</span>
          <ThemeToggle />
        </div>
        <form action={logout}>
          <Button 
            variant="ghost" 
            type="submit" 
            className="w-full justify-start text-muted-foreground hover:text-destructive hover:bg-destructive/10 rounded-lg text-sm"
          >
            <LogOut className="mr-2 h-4 w-4 shrink-0" />
            Keluar
          </Button>
        </form>
      </div>
    </div>
  )
}
