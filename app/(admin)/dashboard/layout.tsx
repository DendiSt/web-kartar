import Sidebar from '@/components/admin/Sidebar'

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="flex h-screen w-full overflow-hidden bg-background text-foreground transition-colors duration-400">
      {/* Sidebar Desktop: Berbagi canvas background yang identik dengan konten utama agar transisi menyatu */}
      <aside className="hidden md:flex h-full w-64 shrink-0 flex-col border-r border-border/60 bg-background overflow-hidden overscroll-contain select-none transition-colors duration-400">
        <Sidebar />
      </aside>

      {/* Konten Utama: Berbagi canvas background yang sama, bertransisi serentak tanpa efek dua halaman terpisah */}
      <main className="flex-1 h-full overflow-y-auto overscroll-contain flex flex-col min-w-0 bg-background transition-colors duration-400">
        <div className="flex-1 p-4 md:p-8">
          {children}
        </div>
      </main>
    </div>
  )
}
