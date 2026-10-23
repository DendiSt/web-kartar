import { getKeuangan, getSaldoKas } from '@/app/actions/keuangan'
import { Card, CardContent } from '@/components/ui/card'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { format } from 'date-fns'
import { id as localeID } from 'date-fns/locale/id'
import { TrendingUp, TrendingDown, Calendar, Wallet } from 'lucide-react'

export const metadata = {
  title: 'Transparansi Keuangan | Tirtajaya 01'
}

export const revalidate = 60

export default async function KeuanganPublicPage() {
  const data = await getKeuangan()
  const saldoKas = await getSaldoKas()

  const formatRupiah = (angka: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0
    }).format(angka)
  }

  return (
    <div className="container mx-auto px-4 sm:px-6 md:px-8 py-10 md:py-20 max-w-5xl space-y-10 md:space-y-12">
      <div className="text-center max-w-2xl mx-auto space-y-4">
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-heading font-bold tracking-tight">Transparansi Dana</h1>
        <p className="text-base sm:text-xl text-muted-foreground">
          Laporan kas masuk dan keluar sebagai bentuk pertanggungjawaban Karang Taruna kepada masyarakat.
        </p>
      </div>

      <div className="flex justify-center px-2">
        <Card className="w-full max-w-md bg-primary text-primary-foreground border-none shadow-lg rounded-2xl">
          <CardContent className="p-6 sm:p-8 text-center space-y-2">
            <div className="mx-auto w-12 h-12 bg-white/20 rounded-full flex items-center justify-center mb-4">
              <Wallet className="h-6 w-6 text-white" />
            </div>
            <p className="text-sm font-medium opacity-90">Total Saldo Kas Saat Ini</p>
            <p className="text-2xl sm:text-4xl font-bold font-heading">{formatRupiah(saldoKas)}</p>
          </CardContent>
        </Card>
      </div>

      <div className="rounded-2xl border bg-card shadow-sm overflow-hidden">
        <div className="p-4 sm:p-6 border-b bg-muted/30">
          <h2 className="text-base sm:text-lg font-bold font-heading">Riwayat Transaksi</h2>
        </div>
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="bg-muted/50 hover:bg-muted/50">
                <TableHead className="w-[150px]">Tanggal</TableHead>
                <TableHead>Keterangan</TableHead>
                <TableHead className="w-[150px]">Kategori</TableHead>
                <TableHead className="text-right w-[200px]">Pemasukan</TableHead>
                <TableHead className="text-right w-[200px]">Pengeluaran</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {data.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} className="text-center h-32 text-muted-foreground">
                    Belum ada catatan transaksi keuangan.
                  </TableCell>
                </TableRow>
              ) : (
                data.map((item) => (
                  <TableRow key={item.id}>
                    <TableCell className="font-medium whitespace-nowrap">
                      <div className="flex items-center text-muted-foreground">
                        <Calendar className="mr-2 h-3.5 w-3.5" />
                        {format(new Date(item.tanggal), 'dd MMM yyyy', { locale: localeID })}
                      </div>
                    </TableCell>
                    <TableCell>{item.keterangan}</TableCell>
                    <TableCell>
                      <span className="px-2.5 py-0.5 rounded-full bg-secondary text-[11px] font-medium text-secondary-foreground">
                        {item.kategori}
                      </span>
                    </TableCell>
                    <TableCell className="text-right">
                      {item.tipe === 'pemasukan' ? (
                        <div className="flex items-center justify-end text-green-600 font-medium">
                          <TrendingUp className="mr-1 h-3.5 w-3.5" />
                          {formatRupiah(item.jumlah)}
                        </div>
                      ) : '-'}
                    </TableCell>
                    <TableCell className="text-right">
                      {item.tipe === 'pengeluaran' ? (
                        <div className="flex items-center justify-end text-red-600 font-medium">
                          <TrendingDown className="mr-1 h-3.5 w-3.5" />
                          {formatRupiah(item.jumlah)}
                        </div>
                      ) : '-'}
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  )
}
