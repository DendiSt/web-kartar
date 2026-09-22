'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import { Plus, Trash2, Pencil, MapPin, Calendar as CalendarIcon } from 'lucide-react'
import { format } from 'date-fns'
import { id as localeID } from 'date-fns/locale/id'
import { createKegiatan, deleteKegiatan } from '@/app/actions/kegiatan'

export default function KegiatanClient({ data }: { data: any[] }) {
  const [isOpen, setIsOpen] = useState(false)
  const [loading, setLoading] = useState(false)

  async function handleCreate(formData: FormData) {
    setLoading(true)
    const result = await createKegiatan(formData)
    setLoading(false)
    
    if (result.error) {
      alert(result.error)
    } else {
      setIsOpen(false)
    }
  }

  async function handleDelete(id: string) {
    if (confirm('Apakah Anda yakin ingin menghapus kegiatan ini?')) {
      await deleteKegiatan(id)
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-heading font-bold tracking-tight">Data Kegiatan</h2>
          <p className="text-muted-foreground text-sm mt-1">Kelola daftar program kerja dan kegiatan desa.</p>
        </div>
        
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
          <DialogTrigger render={<Button className="bg-primary hover:bg-primary/90" />}>
            <Plus className="mr-2 h-4 w-4" /> Tambah Kegiatan
          </DialogTrigger>
          <DialogContent className="sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle>Tambah Kegiatan Baru</DialogTitle>
            </DialogHeader>
            <form action={handleCreate} className="space-y-4 pt-4">
              <div className="space-y-2">
                <Label htmlFor="judul">Judul Kegiatan</Label>
                <Input id="judul" name="judul" required placeholder="Contoh: Kerja Bakti Desa" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="deskripsi">Deskripsi</Label>
                <textarea 
                  id="deskripsi" 
                  name="deskripsi" 
                  required 
                  className="flex min-h-[80px] w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
                  placeholder="Penjelasan singkat mengenai kegiatan..."
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="tanggal_pelaksanaan">Tanggal Pelaksanaan</Label>
                  <Input id="tanggal_pelaksanaan" name="tanggal_pelaksanaan" type="date" required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="status">Status</Label>
                  <select 
                    id="status" 
                    name="status" 
                    className="flex h-9 w-full items-center justify-between rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    <option value="selesai">Selesai</option>
                    <option value="berlangsung">Sedang Berlangsung</option>
                    <option value="dibatalkan">Dibatalkan</option>
                  </select>
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="lokasi">Lokasi</Label>
                <Input id="lokasi" name="lokasi" placeholder="Contoh: Balai Desa" />
              </div>
              <div className="flex justify-end gap-3 pt-4">
                <Button type="button" variant="outline" onClick={() => setIsOpen(false)}>Batal</Button>
                <Button type="submit" disabled={loading}>
                  {loading ? 'Menyimpan...' : 'Simpan Kegiatan'}
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="rounded-md border bg-card">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Kegiatan</TableHead>
              <TableHead>Tanggal</TableHead>
              <TableHead>Lokasi</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Aksi</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {data.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="text-center h-32 text-muted-foreground">
                  Belum ada data kegiatan.
                </TableCell>
              </TableRow>
            ) : (
              data.map((item) => (
                <TableRow key={item.id}>
                  <TableCell className="font-medium">
                    {item.judul}
                    <div className="text-xs text-muted-foreground truncate max-w-[250px] mt-1">
                      {item.deskripsi}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center text-sm">
                      <CalendarIcon className="mr-2 h-3.5 w-3.5 text-muted-foreground" />
                      {format(new Date(item.tanggal_pelaksanaan), 'dd MMM yyyy', { locale: localeID })}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center text-sm">
                      <MapPin className="mr-2 h-3.5 w-3.5 text-muted-foreground" />
                      {item.lokasi || '-'}
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant={item.status === 'selesai' ? 'default' : item.status === 'berlangsung' ? 'secondary' : 'destructive'}>
                      {item.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right space-x-2">
                    <Button variant="ghost" size="icon-sm" className="h-8 w-8 text-blue-500 hover:text-blue-600 hover:bg-blue-50">
                      <Pencil className="h-4 w-4" />
                    </Button>
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
