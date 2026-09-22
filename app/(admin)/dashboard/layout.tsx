import Sidebar from '@/components/admin/Sidebar'

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="flex h-screen bg-muted/20">
      <aside className="hidden md:block">
        <Sidebar />
      </aside>
      <main className="flex-1 flex flex-col overflow-hidden">
        <div className="flex-1 overflow-auto p-4 md:p-8">
          {children}
        </div>
      </main>
    </div>
  )
}
