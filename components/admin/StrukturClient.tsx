'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import { Plus, Trash2, Pencil, Users, Mail, Phone } from 'lucide-react'
import { createStruktur, updateStruktur, deleteStruktur } from '@/app/actions/struktur'
import { ImageUploader } from './ImageUploader'
import Image from 'next/image'

export default function StrukturClient({ data }: { data: any[] }) {
  const [isOpen, setIsOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  
  // Edit State
  const [editItem, setEditItem] = useState<any>(null)
  const [fotoUrl, setFotoUrl] = useState('')
  
  // Delete State
  const [deleteId, setDeleteId] = useState<string | null>(null)

  function openCreate() {
    setEditItem(null)
    setFotoUrl('')
    setIsOpen(true)
  }

  function openEdit(item: any) {
    setEditItem(item)
    setFotoUrl(item.foto_url || '')
    setIsOpen(true)
  }

  async function handleSubmit(formData: FormData) {
    setLoading(true)
    formData.append('foto_url', fotoUrl)
    
    const result = editItem 
      ? await updateStruktur(formData) 
      : await createStruktur(formData)
      
    setLoading(false)
    
    if (result.error) {
      alert(result.error)
    } else {
      setIsOpen(false)
      setEditItem(null)
      setFotoUrl('')
    }
  }

  async function confirmDelete() {
    if (!deleteId) return
    setLoading(true)
    await deleteStruktur(deleteId)
    setLoading(false)
    setDeleteId(null)
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-heading font-bold tracking-tight">Struktur Organisasi</h2>
          <p className="text-muted-foreground text-sm mt-1">Kelola data pengurus Karang Taruna.</p>
        </div>
        
        <Button className="bg-primary hover:bg-primary/90" onClick={openCreate}>
          <Plus className="mr-2 h-4 w-4" /> Tambah Pengurus
        </Button>
      </div>

      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{editItem ? 'Edit Pengurus' : 'Tambah Pengurus Baru'}</DialogTitle>
          </DialogHeader>
          <form action={handleSubmit} className="space-y-4 pt-4">
            {editItem && <input type="hidden" name="id" value={editItem.id} />}
            
            <div className="space-y-2">
              <Label>Foto Pengurus (Opsional)</Label>
              <ImageUploader 
                folder="pengurus"
                defaultImage={editItem?.foto_url}
                onUploadSuccess={(url) => setFotoUrl(url)}
                onUploadError={(err) => alert(err.message)}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="nama_lengkap">Nama Lengkap</Label>
                <Input id="nama_lengkap" name="nama_lengkap" required defaultValue={editItem?.nama_lengkap || ''} placeholder="Contoh: Budi Santoso" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="jabatan">Jabatan</Label>
                <Input id="jabatan" name="jabatan" required defaultValue={editItem?.jabatan || ''} placeholder="Contoh: Ketua" />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="periode">Periode</Label>
                <Input id="periode" name="periode" required defaultValue={editItem?.periode || ''} placeholder="Contoh: 2024-2027" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="divisi">Divisi (Opsional)</Label>
                <Input id="divisi" name="divisi" defaultValue={editItem?.divisi || ''} placeholder="Contoh: Olahraga" />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="no_telepon">No. Telepon (Opsional)</Label>
                <Input id="no_telepon" name="no_telepon" defaultValue={editItem?.no_telepon || ''} placeholder="Contoh: 08123456789" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email (Opsional)</Label>
                <Input id="email" name="email" type="email" defaultValue={editItem?.email || ''} placeholder="Contoh: budi@gmail.com" />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="urutan">Nomor Urut Tampil</Label>
                <Input id="urutan" name="urutan" type="number" defaultValue={editItem?.urutan || '0'} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="is_active">Status Aktif</Label>
                <select 
                  id="is_active" 
                  name="is_active" 
                  defaultValue={editItem ? String(editItem.is_active) : 'true'}
                  className="flex h-9 w-full items-center justify-between rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
                >
                  <option value="true">Aktif</option>
                  <option value="false">Tidak Aktif</option>
                </select>
              </div>
            </div>
            
            <div className="flex justify-end gap-3 pt-4">
              <Button type="button" variant="outline" onClick={() => setIsOpen(false)}>Batal</Button>
              <Button type="submit" disabled={loading}>
                {loading ? 'Menyimpan...' : 'Simpan Pengurus'}
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
              Tindakan ini tidak dapat dibatalkan. Ini akan menghapus data pengurus ini secara permanen dari server.
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
              <TableHead className="w-[80px]">Foto</TableHead>
              <TableHead>Pengurus</TableHead>
              <TableHead>Jabatan</TableHead>
              <TableHead>Kontak</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Aksi</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {data.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center h-32 text-muted-foreground">
                  Belum ada data pengurus.
                </TableCell>
              </TableRow>
            ) : (
              data.map((item) => (
                <TableRow key={item.id}>
                  <TableCell>
                    <div className="h-10 w-10 rounded-full overflow-hidden bg-muted relative border">
                      {item.foto_url ? (
                        <Image src={item.foto_url} alt={item.nama_lengkap} fill className="object-cover" sizes="40px" />
                      ) : (
                        <div className="flex h-full w-full items-center justify-center bg-secondary">
                          <Users className="h-5 w-5 text-muted-foreground" />
                        </div>
                      )}
                    </div>
                  </TableCell>
                  <TableCell className="font-medium">
                    {item.nama_lengkap}
                    <div className="text-xs text-muted-foreground font-normal">
                      Periode: {item.periode}
                    </div>
                  </TableCell>
                  <TableCell>
                    {item.jabatan}
                    {item.divisi && (
                      <div className="text-xs text-muted-foreground">Divisi: {item.divisi}</div>
                    )}
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-col gap-1 text-xs">
                      {item.no_telepon && (
                        <div className="flex items-center text-muted-foreground">
                          <Phone className="mr-1.5 h-3 w-3" /> {item.no_telepon}
                        </div>
                      )}
                      {item.email && (
                        <div className="flex items-center text-muted-foreground">
                          <Mail className="mr-1.5 h-3 w-3" /> {item.email}
                        </div>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant={item.is_active ? 'default' : 'secondary'}>
                      {item.is_active ? 'Aktif' : 'Non-Aktif'}
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
