'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import { Plus, Trash2, Pencil, MapPin, Calendar as CalendarIcon, Clock } from 'lucide-react'
import { format } from 'date-fns'
import { id as localeID } from 'date-fns/locale/id'
import { createAgenda, updateAgenda, deleteAgenda } from '@/app/actions/agenda'

export default function AgendaClient({ data }: { data: any[] }) {
  const [isOpen, setIsOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  
  // Edit State
  const [editItem, setEditItem] = useState<any>(null)
  
  // Delete State
  const [deleteId, setDeleteId] = useState<string | null>(null)

  function openCreate() {
    setEditItem(null)
    setIsOpen(true)
  }

  function openEdit(item: any) {
    setEditItem(item)
    setIsOpen(true)
  }

  async function handleSubmit(formData: FormData) {
    setLoading(true)
    const result = editItem 
      ? await updateAgenda(formData) 
      : await createAgenda(formData)
      
    setLoading(false)
    
    if (result.error) {
      alert(result.error)
    } else {
      setIsOpen(false)
      setEditItem(null)
    }
  }

  async function confirmDelete() {
    if (!deleteId) return
    setLoading(true)
    await deleteAgenda(deleteId)
    setLoading(false)
    setDeleteId(null)
  }

  // Helper for datetime-local input formatting
  const formatForInput = (dateStr: string) => {
    if (!dateStr) return ''
    // Format YYYY-MM-DDThh:mm
    return new Date(dateStr).toISOString().slice(0, 16)
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-heading font-bold tracking-tight">Data Agenda</h2>
          <p className="text-muted-foreground text-sm mt-1">Kelola jadwal pertemuan dan kegiatan mendatang.</p>
        </div>
        
        <Button className="bg-primary hover:bg-primary/90" onClick={openCreate}>
          <Plus className="mr-2 h-4 w-4" /> Tambah Agenda
        </Button>
      </div>

      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>{editItem ? 'Edit Agenda' : 'Tambah Agenda Baru'}</DialogTitle>
          </DialogHeader>
          <form action={handleSubmit} className="space-y-4 pt-4">
            {editItem && <input type="hidden" name="id" value={editItem.id} />}
            <div className="space-y-2">
              <Label htmlFor="judul">Judul Agenda</Label>
              <Input id="judul" name="judul" required defaultValue={editItem?.judul || ''} placeholder="Contoh: Rapat Rutin Bulanan" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="deskripsi">Deskripsi</Label>
              <textarea 
                id="deskripsi" 
                name="deskripsi" 
                defaultValue={editItem?.deskripsi || ''}
                className="flex min-h-[80px] w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
                placeholder="Penjelasan detail agenda..."
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="tanggal_mulai">Tanggal & Waktu Mulai</Label>
                <Input id="tanggal_mulai" name="tanggal_mulai" type="datetime-local" required defaultValue={editItem ? formatForInput(editItem.tanggal_mulai) : ''} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="tanggal_selesai">Tanggal & Waktu Selesai</Label>
                <Input id="tanggal_selesai" name="tanggal_selesai" type="datetime-local" defaultValue={editItem?.tanggal_selesai ? formatForInput(editItem.tanggal_selesai) : ''} />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="status">Status</Label>
                <select 
                  id="status" 
                  name="status" 
                  defaultValue={editItem?.status || 'akan_datang'}
                  className="flex h-9 w-full items-center justify-between rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
                >
                  <option value="akan_datang">Akan Datang</option>
                  <option value="sedang_berlangsung">Sedang Berlangsung</option>
                  <option value="selesai">Selesai</option>
                  <option value="dibatalkan">Dibatalkan</option>
                </select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="kategori">Kategori</Label>
                <Input id="kategori" name="kategori" defaultValue={editItem?.kategori || ''} placeholder="Contoh: Rapat" />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="lokasi">Lokasi</Label>
              <Input id="lokasi" name="lokasi" defaultValue={editItem?.lokasi || ''} placeholder="Contoh: Balai Desa" />
            </div>
            <div className="flex justify-end gap-3 pt-4">
              <Button type="button" variant="outline" onClick={() => setIsOpen(false)}>Batal</Button>
              <Button type="submit" disabled={loading}>
                {loading ? 'Menyimpan...' : 'Simpan Agenda'}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      <AlertDialog open={!!deleteId} onOpenChange={(open) => !open && setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Apakah Anda yakin?</AlertDialogTitle>
            <AlertDialogDescription>
              Tindakan ini tidak dapat dibatalkan. Ini akan menghapus data agenda ini secara permanen dari server.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={loading}>Batal</AlertDialogCancel>
            <AlertDialogAction disabled={loading} onClick={confirmDelete} className="bg-destructive hover:bg-destructive/90">
              {loading ? 'Menghapus...' : 'Ya, Hapus'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <div className="rounded-md border bg-card">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Agenda</TableHead>
              <TableHead>Jadwal</TableHead>
              <TableHead>Lokasi</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Aksi</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {data.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="text-center h-32 text-muted-foreground">
                  Belum ada data agenda.
                </TableCell>
              </TableRow>
            ) : (
              data.map((item) => (
                <TableRow key={item.id}>
                  <TableCell className="font-medium">
                    {item.judul}
                    {item.kategori && (
                      <span className="ml-2 inline-block px-2 py-0.5 rounded-full bg-muted text-[10px] text-muted-foreground">
                        {item.kategori}
                      </span>
                    )}
                    <div className="text-xs text-muted-foreground truncate max-w-[250px] mt-1">
                      {item.deskripsi}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-col gap-1 text-sm">
                      <div className="flex items-center">
                        <CalendarIcon className="mr-2 h-3.5 w-3.5 text-muted-foreground" />
                        {format(new Date(item.tanggal_mulai), 'dd MMM yyyy', { locale: localeID })}
                      </div>
                      <div className="flex items-center text-muted-foreground text-xs">
                        <Clock className="mr-2 h-3 w-3" />
                        {format(new Date(item.tanggal_mulai), 'HH:mm')}
                        {item.tanggal_selesai && ` - ${format(new Date(item.tanggal_selesai), 'HH:mm')}`}
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center text-sm">
                      <MapPin className="mr-2 h-3.5 w-3.5 text-muted-foreground" />
                      {item.lokasi || '-'}
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant={item.status === 'akan_datang' ? 'default' : item.status === 'selesai' ? 'secondary' : 'outline'}>
                      {item.status.replace('_', ' ')}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right space-x-2">
                    <Button variant="ghost" size="icon-sm" onClick={() => openEdit(item)} className="h-8 w-8 text-blue-500 hover:text-blue-600 hover:bg-blue-50">
                      <Pencil className="h-4 w-4" />
                    </Button>
                    <Button 
                      variant="ghost" 
                      size="icon-sm" 
                      onClick={() => setDeleteId(item.id)}
                      className="h-8 w-8 text-red-500 hover:text-red-600 hover:bg-red-50"
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
