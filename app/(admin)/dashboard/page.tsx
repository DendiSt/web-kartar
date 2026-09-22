import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Calendar, Users, FileText, Image as ImageIcon } from 'lucide-react'
import { createClient } from '@/lib/supabase/server'
import { getSaldoKas, getKeuangan } from '@/app/actions/keuangan'
import { KeuanganChart } from '@/components/admin/KeuanganChart'

export const metadata = {
  title: 'Dashboard Admin | Tirtajaya 01'
}

export default async function DashboardOverview() {
  const supabase = await createClient()

  const [
    { count: countKegiatan },
    { count: countAgenda },
    { count: countPengurus },
    saldoKas,
    dataKeuangan
  ] = await Promise.all([
    supabase.from('kegiatan').select('*', { count: 'exact', head: true }),
    supabase.from('agenda').select('*', { count: 'exact', head: true }).eq('status', 'akan_datang'),
    supabase.from('struktur_organisasi').select('*', { count: 'exact', head: true }).eq('is_active', true),
    getSaldoKas(),
    getKeuangan()
  ])

  const formatRupiah = (angka: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0
    }).format(angka)
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-heading font-bold tracking-tight">Selamat Datang, Admin</h1>
        <p className="text-muted-foreground mt-2">Ini adalah halaman utama pengelolaan website Tirtajaya 01.</p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Kegiatan</CardTitle>
            <ImageIcon className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{countKegiatan || 0}</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Agenda Mendatang</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{countAgenda || 0}</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pengurus Aktif</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{countPengurus || 0}</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Saldo Kas</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-primary">{formatRupiah(saldoKas)}</div>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-1 lg:grid-cols-1">
        <KeuanganChart data={dataKeuangan} />
      </div>
    </div>
  )
}
