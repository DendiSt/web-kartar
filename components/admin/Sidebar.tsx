'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { LayoutDashboard, Calendar, Users, FileText, Settings, LogOut, Image as ImageIcon } from 'lucide-react'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { logout } from '@/app/actions/auth'

const sidebarLinks = [
  { name: 'Overview', href: '/dashboard', icon: LayoutDashboard },
  { name: 'Kegiatan', href: '/dashboard/kegiatan', icon: ImageIcon },
  { name: 'Agenda', href: '/dashboard/agenda', icon: Calendar },
  { name: 'Pengurus', href: '/dashboard/struktur', icon: Users },
  { name: 'Keuangan', href: '/dashboard/keuangan', icon: FileText },
  { name: 'Pengaturan', href: '/dashboard/pengaturan', icon: Settings },
]

export default function Sidebar() {
  const pathname = usePathname()

  return (
    <div className="flex h-full w-64 flex-col border-r bg-background px-4 py-6 shadow-sm">
      <div className="flex items-center gap-3 px-2 mb-8">
        <img src="/images/logo.png" alt="Logo" className="h-8 w-auto object-contain" />
        <span className="font-heading font-bold text-lg text-primary tracking-tight">Admin Panel</span>
      </div>
      
      <nav className="flex-1 space-y-2">
        {sidebarLinks.map((link) => {
          const isActive = pathname === link.href || (pathname.startsWith(link.href) && link.href !== '/dashboard')
          return (
            <Link
              key={link.name}
              href={link.href}
              className={cn(
                "flex items-center gap-3 rounded-md px-3 py-2.5 text-sm font-medium transition-colors",
                isActive 
                  ? "bg-primary text-primary-foreground" 
                  : "text-muted-foreground hover:bg-muted hover:text-foreground"
              )}
            >
              <link.icon className="h-4 w-4 shrink-0" />
              {link.name}
            </Link>
          )
        })}
      </nav>

      <div className="pt-6 border-t mt-auto">
        <form action={logout}>
          <Button variant="ghost" type="submit" className="w-full justify-start text-muted-foreground hover:text-destructive hover:bg-destructive/10">
            <LogOut className="mr-2 h-4 w-4" />
            Keluar
          </Button>
        </form>
      </div>
    </div>
  )
}
