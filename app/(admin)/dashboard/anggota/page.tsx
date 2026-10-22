import { getAnggotaList, getAnggotaStats } from '@/app/actions/anggota'
import AnggotaClient from '@/components/admin/AnggotaClient'

export const dynamic = 'force-dynamic'

export const metadata = {
  title: 'Manajemen Anggota | Admin Karang Taruna',
  description: 'Pendataan dan pengelolaan anggota Karang Taruna Tirtajaya 01'
}

export default async function DashboardAnggotaPage() {
  const [initialAnggota, initialStats] = await Promise.all([
    getAnggotaList(),
    getAnggotaStats()
  ])

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Database & Manajemen Anggota</h1>
        <p className="text-sm text-muted-foreground mt-1">
          Pendataan pemuda dan anggota Karang Taruna Tirtajaya 01 per wilayah RT/RW dan status keaktifan.
        </p>
      </div>

      <AnggotaClient initialAnggota={initialAnggota} initialStats={initialStats} />
    </div>
  )
}
