import Sidebar from '@/components/admin/Sidebar'

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="min-h-screen bg-muted/20">
      {/* Sidebar Desktop: Fixed secara permanen di sisi kiri viewport */}
      <aside className="hidden md:block fixed inset-y-0 left-0 z-40 w-64 border-r border-border bg-background shadow-xs">
        <Sidebar />
      </aside>

      {/* Konten Utama: Tergeser selebar sidebar dan mengalir bebas tanpa membuat sidebar bergeser */}
      <main className="flex-1 md:pl-64 flex flex-col min-h-screen min-w-0">
        <div className="flex-1 p-4 md:p-8">
          {children}
        </div>
      </main>
    </div>
  )
}
