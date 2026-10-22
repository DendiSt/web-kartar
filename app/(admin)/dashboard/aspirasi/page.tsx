import { getAdminAspirasiList } from '@/app/actions/aspirasi'
import AspirasiAdminClient from '@/components/admin/AspirasiAdminClient'

export const dynamic = 'force-dynamic'

export const metadata = {
  title: 'Moderasi Aspirasi Warga | Admin Karang Taruna',
  description: 'Pusat moderasi aspirasi, usulan, dan pesan buku tamu warga Dusun Sumurgintung'
}

export default async function DashboardAspirasiPage() {
  const { items, stats } = await getAdminAspirasiList()

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Kotak Aspirasi & Buku Tamu Warga</h1>
        <p className="text-sm text-muted-foreground mt-1">
          Tinjau pesan warga, beri tanggapan resmi, dan moderasi konten sebelum dipublikasikan ke halaman umum.
        </p>
      </div>

      <AspirasiAdminClient initialItems={items} initialStats={stats} />
    </div>
  )
}
