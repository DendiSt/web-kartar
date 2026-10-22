import Sidebar from '@/components/admin/Sidebar'

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="flex h-screen w-full overflow-hidden bg-muted/20">
      {/* Sidebar Desktop: Scroll container terisolasi 100%, overscroll-contain mencegah scroll bocor ke konten */}
      <aside className="hidden md:flex h-full w-64 shrink-0 flex-col border-r border-border bg-background shadow-xs overflow-hidden overscroll-contain select-none">
        <Sidebar />
      </aside>

      {/* Konten Utama: Scroll container mandiri 100%, terpisah dari sidebar */}
      <main className="flex-1 h-full overflow-y-auto overscroll-contain flex flex-col min-w-0">
        <div className="flex-1 p-4 md:p-8">
          {children}
        </div>
      </main>
    </div>
  )
}
