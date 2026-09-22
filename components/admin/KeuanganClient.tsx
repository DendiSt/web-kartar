'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Plus, Trash2, Pencil, Calendar as CalendarIcon, TrendingUp, TrendingDown, DollarSign } from 'lucide-react'
import { format } from 'date-fns'
import { id as localeID } from 'date-fns/locale/id'
import { createKeuangan, deleteKeuangan } from '@/app/actions/keuangan'
import { ImageUploader } from './ImageUploader'
import { Card, CardContent } from '@/components/ui/card'

export default function KeuanganClient({ data, saldo }: { data: any[], saldo: number }) {
  const [isOpen, setIsOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const [buktiUrl, setBuktiUrl] = useState('')

  async function handleCreate(formData: FormData) {
    setLoading(true)
    formData.append('bukti_url', buktiUrl)
    const result = await createKeuangan(formData)
    setLoading(false)
    
    if (result.error) {
      alert(result.error)
    } else {
      setIsOpen(false)
      setBuktiUrl('')
    }
  }

  async function handleDelete(id: string) {
    if (confirm('Apakah Anda yakin ingin menghapus transaksi ini? Saldo akan disesuaikan kembali.')) {
      await deleteKeuangan(id)
    }
  }

  const formatRupiah = (angka: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0
    }).format(angka)
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-heading font-bold tracking-tight">Manajemen Keuangan</h2>
          <p className="text-muted-foreground text-sm mt-1">Kelola transparansi dana, kas masuk, dan keluar.</p>
        </div>
        
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
          <DialogTrigger render={<Button className="bg-primary hover:bg-primary/90" />}>
            <Plus className="mr-2 h-4 w-4" /> Catat Transaksi
          </DialogTrigger>
          <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Catat Transaksi Baru</DialogTitle>
            </DialogHeader>
            <form action={handleCreate} className="space-y-4 pt-4">
              
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="tanggal">Tanggal Transaksi</Label>
                  <Input id="tanggal" name="tanggal" type="date" required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="tipe">Tipe Transaksi</Label>
                  <select 
                    id="tipe" 
                    name="tipe" 
                    className="flex h-9 w-full items-center justify-between rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    <option value="pemasukan">Pemasukan (+)</option>
                    <option value="pengeluaran">Pengeluaran (-)</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="kategori">Kategori</Label>
                  <Input id="kategori" name="kategori" required placeholder="Contoh: Iuran Anggota, Konsumsi" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="jumlah">Jumlah (Rp)</Label>
                  <Input id="jumlah" name="jumlah" type="number" required placeholder="150000" />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="keterangan">Keterangan / Rincian</Label>
                <textarea 
                  id="keterangan" 
                  name="keterangan" 
                  required
                  className="flex min-h-[80px] w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
                  placeholder="Keterangan lengkap untuk transaksi ini..."
                />
              </div>

              <div className="space-y-2">
                <Label>Bukti Transaksi (Struk/Nota/Kwitansi)</Label>
                <ImageUploader 
                  folder="keuangan"
                  onUploadSuccess={(url) => setBuktiUrl(url)}
                  onUploadError={(err) => alert(err.message)}
                />
              </div>
              
              <div className="flex justify-end gap-3 pt-4">
                <Button type="button" variant="outline" onClick={() => setIsOpen(false)}>Batal</Button>
                <Button type="submit" disabled={loading}>
                  {loading ? 'Menyimpan...' : 'Simpan Transaksi'}
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Card className="bg-primary text-primary-foreground">
          <CardContent className="p-6">
            <div className="flex items-center space-x-4">
              <div className="p-2 bg-primary-foreground/20 rounded-full">
                <DollarSign className="h-6 w-6" />
              </div>
              <div>
                <p className="text-sm font-medium opacity-80">Total Saldo Kas</p>
                <p className="text-2xl font-bold">{formatRupiah(saldo)}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="rounded-md border bg-card">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Tanggal</TableHead>
              <TableHead>Keterangan & Kategori</TableHead>
              <TableHead>Tipe</TableHead>
              <TableHead className="text-right">Jumlah</TableHead>
              <TableHead className="text-right">Aksi</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {data.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="text-center h-32 text-muted-foreground">
                  Belum ada data transaksi keuangan.
                </TableCell>
              </TableRow>
            ) : (
              data.map((item) => (
                <TableRow key={item.id}>
                  <TableCell>
                    <div className="flex items-center text-sm">
                      <CalendarIcon className="mr-2 h-3.5 w-3.5 text-muted-foreground" />
                      {format(new Date(item.tanggal), 'dd MMM yyyy', { locale: localeID })}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="font-medium">{item.keterangan}</div>
                    <div className="text-xs text-muted-foreground mt-0.5">{item.kategori}</div>
                    {item.bukti_url && (
                      <a href={item.bukti_url} target="_blank" rel="noreferrer" className="text-xs text-blue-500 hover:underline mt-1 inline-block">
                        Lihat Bukti
                      </a>
                    )}
                  </TableCell>
                  <TableCell>
                    {item.tipe === 'pemasukan' ? (
                      <div className="flex items-center text-green-600 text-sm font-medium">
                        <TrendingUp className="mr-1 h-3.5 w-3.5" /> Pemasukan
                      </div>
                    ) : (
                      <div className="flex items-center text-red-600 text-sm font-medium">
                        <TrendingDown className="mr-1 h-3.5 w-3.5" /> Pengeluaran
                      </div>
                    )}
                  </TableCell>
                  <TableCell className={`text-right font-semibold ${item.tipe === 'pemasukan' ? 'text-green-600' : 'text-red-600'}`}>
                    {item.tipe === 'pemasukan' ? '+' : '-'} {formatRupiah(item.jumlah)}
                  </TableCell>
                  <TableCell className="text-right space-x-2">
                    <Button 
                      variant="ghost" 
                      size="icon-sm" 
                      className="h-8 w-8 text-red-500 hover:text-red-600 hover:bg-red-50"
                      onClick={() => handleDelete(item.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}
