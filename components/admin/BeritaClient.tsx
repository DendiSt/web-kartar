'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import { Plus, Trash2, Pencil, Pin, PinOff, Eye, Search, Calendar, Newspaper, CheckCircle2, Clock } from 'lucide-react'
import { format } from 'date-fns'
import { id as localeID } from 'date-fns/locale/id'
import { createBerita, updateBerita, deleteBerita, togglePinBerita } from '@/app/actions/berita'
import { ImageUploader } from '@/components/admin/ImageUploader'

interface BeritaItem {
  id: string
  judul: string
  slug: string
  ringkasan: string | null
  konten: string
  kategori: string
  status: string
  foto_cover: string | null
  penulis: string | null
  is_pinned: boolean
  views: number
  created_at: string | null
  updated_at: string | null
}

export default function BeritaClient({ data }: { data: BeritaItem[] }) {
  const [isOpen, setIsOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const [search, setSearch] = useState('')
  const [filterKategori, setFilterKategori] = useState('semua')
  
  // Edit State
  const [editItem, setEditItem] = useState<BeritaItem | null>(null)
  const [coverUrl, setCoverUrl] = useState<string>('')
  
  // Delete State
  const [deleteId, setDeleteId] = useState<string | null>(null)

  function openCreate() {
    setEditItem(null)
    setCoverUrl('')
    setIsOpen(true)
  }

  function openEdit(item: BeritaItem) {
    setEditItem(item)
    setCoverUrl(item.foto_cover || '')
    setIsOpen(true)
  }

  async function handleSubmit(formData: FormData) {
    setLoading(true)
    formData.set('foto_cover', coverUrl)
    
    const result = editItem 
      ? await updateBerita(formData) 
      : await createBerita(formData)
      
    setLoading(false)
    
    if (result.error) {
      alert(result.error)
    } else {
      setIsOpen(false)
      setEditItem(null)
      setCoverUrl('')
    }
  }

  async function handleTogglePin(item: BeritaItem) {
    setLoading(true)
    await togglePinBerita(item.id, !item.is_pinned)
    setLoading(false)
  }

  async function confirmDelete() {
    if (!deleteId) return
    setLoading(true)
    await deleteBerita(deleteId)
    setLoading(false)
    setDeleteId(null)
  }

  const filteredData = data.filter((item) => {
    const matchesSearch = item.judul.toLowerCase().includes(search.toLowerCase()) ||
      (item.ringkasan && item.ringkasan.toLowerCase().includes(search.toLowerCase()))
    const matchesKategori = filterKategori === 'semua' || item.kategori === filterKategori
    return matchesSearch && matchesKategori
  })

  const getKategoriBadgeColor = (kategori: string) => {
    switch (kategori) {
      case 'pengumuman':
        return 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300 border-amber-200 dark:border-amber-800'
      case 'info_dusun':
        return 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800'
      case 'kegiatan':
        return 'bg-purple-100 text-purple-800 dark:bg-purple-950 dark:text-purple-300 border-purple-200 dark:border-purple-800'
      default:
        return 'bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-300 border-blue-200 dark:border-blue-800'
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-heading font-bold tracking-tight">Berita & Pengumuman</h2>
          <p className="text-muted-foreground text-sm mt-1">
            Publikasikan pengumuman penting, kabar terkini, dan info kegiatan untuk warga dusun.
          </p>
        </div>
        
        <Button className="bg-[#1868db] hover:bg-[#1558be] text-white shrink-0" onClick={openCreate}>
          <Plus className="mr-2 h-4 w-4" /> Tambah Berita / Pengumuman
        </Button>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3 items-center justify-between bg-card p-4 rounded-xl border border-border">
        <div className="relative w-full sm:w-80">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Cari berita atau pengumuman..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9 bg-background"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto overflow-x-auto">
          {['semua', 'pengumuman', 'berita', 'info_dusun', 'kegiatan'].map((kat) => (
            <Button
              key={kat}
              variant={filterKategori === kat ? 'default' : 'outline'}
              size="sm"
              onClick={() => setFilterKategori(kat)}
              className="text-xs capitalize rounded-full h-8"
            >
              {kat.replace('_', ' ')}
            </Button>
          ))}
        </div>
      </div>

      {/* Dialog Form Create / Edit */}
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="sm:max-w-[650px] max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="font-heading text-xl">
              {editItem ? 'Edit Berita / Pengumuman' : 'Tambah Berita / Pengumuman Baru'}
            </DialogTitle>
          </DialogHeader>
          <form action={handleSubmit} className="space-y-4 pt-2">
            {editItem && <input type="hidden" name="id" value={editItem.id} />}

            <div className="space-y-2">
              <Label htmlFor="judul">Judul Berita / Pengumuman</Label>
              <Input 
                id="judul" 
                name="judul" 
                required 
                defaultValue={editItem?.judul || ''} 
                placeholder="Contoh: Pengumuman Kerja Bakti Dusun Minggu Ini" 
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="kategori">Kategori</Label>
                <select 
                  id="kategori" 
                  name="kategori" 
                  defaultValue={editItem?.kategori || 'pengumuman'}
                  className="flex h-9 w-full rounded-md border border-input bg-background dark:bg-[#181b20] text-foreground dark:text-white px-3 py-1 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring dark:border-[#292a2e]"
                >
                  <option value="pengumuman" className="bg-white dark:bg-[#181b20] text-[#101214] dark:text-white">📢 Pengumuman</option>
                  <option value="berita" className="bg-white dark:bg-[#181b20] text-[#101214] dark:text-white">📰 Berita Umum</option>
                  <option value="info_dusun" className="bg-white dark:bg-[#181b20] text-[#101214] dark:text-white">🏡 Info Dusun</option>
                  <option value="kegiatan" className="bg-white dark:bg-[#181b20] text-[#101214] dark:text-white">🎯 Kegiatan / Proker</option>
                </select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="status">Status Publikasi</Label>
                <select 
                  id="status" 
                  name="status" 
                  defaultValue={editItem?.status || 'published'}
                  className="flex h-9 w-full rounded-md border border-input bg-background dark:bg-[#181b20] text-foreground dark:text-white px-3 py-1 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring dark:border-[#292a2e]"
                >
                  <option value="published" className="bg-white dark:bg-[#181b20] text-[#101214] dark:text-white">Tayang (Published)</option>
                  <option value="draft" className="bg-white dark:bg-[#181b20] text-[#101214] dark:text-white">Draft (Disimpan)</option>
                </select>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="penulis">Nama Penulis / Sumber</Label>
              <Input 
                id="penulis" 
                name="penulis" 
                defaultValue={editItem?.penulis || 'Pengurus Karang Taruna'} 
                placeholder="Contoh: Humas Karang Taruna" 
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="ringkasan">Ringkasan Singkat (Lead / Excerpt)</Label>
              <textarea 
                id="ringkasan" 
                name="ringkasan" 
                rows={2}
                defaultValue={editItem?.ringkasan || ''} 
                placeholder="Ringkasan 1-2 kalimat yang tampil di kartu berita dan pratinjau..."
                className="flex w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="konten">Isi Konten Lengkap</Label>
              <textarea 
                id="konten" 
                name="konten" 
                required 
                rows={7}
                defaultValue={editItem?.konten || ''} 
                placeholder="Tuliskan isi berita atau pengumuman secara rinci di sini..."
                className="flex w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring font-sans leading-relaxed"
              />
            </div>

            {/* Cover Image Upload */}
            <div className="space-y-2 pt-1 border-t">
              <Label>Foto Sampul (Opsional)</Label>
              <ImageUploader 
                bucket="kegiatan"
                folder="berita"
                defaultImage={coverUrl}
                onUploadSuccess={(url) => setCoverUrl(url)}
              />
            </div>

            {/* Pin Switch */}
            <div className="flex items-center gap-3 p-3 bg-muted/40 rounded-lg border">
              <input 
                type="checkbox" 
                id="is_pinned" 
                name="is_pinned" 
                value="true"
                defaultChecked={editItem?.is_pinned || false}
                className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
              />
              <div className="flex flex-col">
                <Label htmlFor="is_pinned" className="font-medium cursor-pointer flex items-center gap-1.5 text-sm">
                  <Pin className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
                  Sematkan di Bagian Atas (Pin Pengumuman)
                </Label>
                <span className="text-xs text-muted-foreground">
                  Berita ini akan selalu tampil di baris terdepan sebagai informasi penting.
                </span>
              </div>
            </div>

            <div className="flex justify-end gap-3 pt-4 border-t">
              <Button type="button" variant="outline" onClick={() => setIsOpen(false)}>Batal</Button>
              <Button type="submit" disabled={loading} className="bg-[#1868db] hover:bg-[#1558be] text-white">
                {loading ? 'Menyimpan...' : (editItem ? 'Simpan Perubahan' : 'Terbitkan Berita')}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Alert */}
      <AlertDialog open={!!deleteId} onOpenChange={(open) => !open && setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Hapus Berita / Pengumuman?</AlertDialogTitle>
            <AlertDialogDescription>
              Tindakan ini tidak dapat dibatalkan. Berita yang dihapus tidak akan bisa diakses lagi oleh pengunjung website.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Batal</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDelete} className="bg-destructive hover:bg-destructive/90 text-destructive-foreground">
              {loading ? 'Menghapus...' : 'Ya, Hapus'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Data Table */}
      <div className="rounded-xl border border-border bg-card overflow-hidden shadow-sm">
        <Table className="table-fixed w-full" containerClassName="overflow-x-hidden">
          <TableHeader>
            <TableRow className="bg-muted/50">
              <TableHead className="w-[60px] pl-3 pr-2">Cover</TableHead>
              <TableHead className="w-auto px-2">Judul & Ringkasan</TableHead>
              <TableHead className="w-[110px] px-2">Kategori</TableHead>
              <TableHead className="w-[90px] px-2">Status</TableHead>
              <TableHead className="w-[120px] px-2">Tanggal & Dibaca</TableHead>
              <TableHead className="w-[105px] pr-3 pl-2 text-right">Aksi</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredData.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="h-32 text-center text-muted-foreground">
                  <div className="flex flex-col items-center justify-center gap-2">
                    <Newspaper className="h-8 w-8 text-muted-foreground/50" />
                    <p>Belum ada berita atau pengumuman yang sesuai.</p>
                  </div>
                </TableCell>
              </TableRow>
            ) : (
              filteredData.map((item) => (
                <TableRow key={item.id} className="hover:bg-muted/30 transition-colors">
                  <TableCell className="w-[60px] pl-3 pr-2 py-2.5">
                    <div className="h-10 w-12 bg-muted rounded-md overflow-hidden relative border border-border shrink-0">
                      {item.foto_cover ? (
                        <img 
                          src={item.foto_cover} 
                          alt={item.judul} 
                          className="h-full w-full object-cover" 
                        />
                      ) : (
                        <div className="h-full w-full flex items-center justify-center bg-secondary/60 text-muted-foreground">
                          <Newspaper className="h-4 w-4" />
                        </div>
                      )}
                    </div>
                  </TableCell>
                  
                  <TableCell className="px-2 py-2.5 min-w-0 max-w-0 overflow-hidden">
                    <div className="space-y-0.5 min-w-0 max-w-full">
                      <div className="flex items-center gap-1.5 min-w-0 max-w-full">
                        {item.is_pinned && (
                          <Badge variant="outline" className="bg-amber-50 text-amber-700 dark:bg-amber-950/60 dark:text-amber-400 border-amber-300 gap-1 text-[10px] font-semibold py-0 shrink-0">
                            <Pin className="w-2.5 h-2.5 fill-amber-500 text-amber-500" /> Disematkan
                          </Badge>
                        )}
                        <span className="font-semibold text-foreground truncate min-w-0 flex-1 text-sm" title={item.judul}>
                          {item.judul}
                        </span>
                      </div>
                      <p className="text-xs text-muted-foreground truncate min-w-0" title={item.ringkasan || item.konten}>
                        {item.ringkasan || item.konten}
                      </p>
                      <span className="text-[11px] text-muted-foreground/80 truncate block min-w-0">
                        Oleh: {item.penulis || 'Admin'}
                      </span>
                    </div>
                  </TableCell>

                  <TableCell className="w-[110px] px-2 py-2.5">
                    <Badge variant="outline" className={`capitalize font-medium text-xs truncate max-w-full block text-center ${getKategoriBadgeColor(item.kategori)}`}>
                      {item.kategori.replace('_', ' ')}
                    </Badge>
                  </TableCell>

                  <TableCell className="w-[90px] px-2 py-2.5">
                    {item.status === 'published' ? (
                      <Badge variant="outline" className="bg-emerald-50 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-400 border-emerald-300 gap-1 text-[11px] font-medium whitespace-nowrap">
                        <CheckCircle2 className="w-3 h-3 text-emerald-500 shrink-0" /> Tayang
                      </Badge>
                    ) : (
                      <Badge variant="outline" className="bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300 border-slate-300 gap-1 text-[11px] font-medium whitespace-nowrap">
                        <Clock className="w-3 h-3 text-slate-500 shrink-0" /> Draft
                      </Badge>
                    )}
                  </TableCell>

                  <TableCell className="w-[120px] px-2 py-2.5">
                    <div className="space-y-0.5 text-xs text-muted-foreground">
                      <div className="flex items-center gap-1.5 whitespace-nowrap">
                        <Calendar className="w-3 h-3 shrink-0" />
                        <span>
                          {item.created_at ? format(new Date(item.created_at), 'dd MMM yyyy', { locale: localeID }) : '-'}
                        </span>
                      </div>
                      <div className="flex items-center gap-1.5 text-[11px] whitespace-nowrap">
                        <Eye className="w-3 h-3 shrink-0" />
                        <span>{item.views} kali</span>
                      </div>
                    </div>
                  </TableCell>

                  <TableCell className="w-[105px] pr-3 pl-2 py-2.5 text-right">
                    <div className="flex items-center justify-end gap-1">
                      <Button 
                        size="icon" 
                        variant="ghost" 
                        className={`h-7 w-7 ${item.is_pinned ? 'text-amber-500 hover:text-amber-600' : 'text-muted-foreground hover:text-foreground'}`}
                        title={item.is_pinned ? 'Lepas sematan' : 'Sematkan berita'}
                        onClick={() => handleTogglePin(item)}
                      >
                        {item.is_pinned ? <PinOff className="h-3.5 w-3.5" /> : <Pin className="h-3.5 w-3.5" />}
                      </Button>
                      <Button 
                        size="icon" 
                        variant="ghost" 
                        className="h-7 w-7 text-blue-600 hover:text-blue-700 hover:bg-blue-50 dark:hover:bg-blue-950/40"
                        title="Edit Berita"
                        onClick={() => openEdit(item)}
                      >
                        <Pencil className="h-3.5 w-3.5" />
                      </Button>
                      <Button 
                        size="icon" 
                        variant="ghost" 
                        className="h-7 w-7 text-destructive hover:text-destructive hover:bg-destructive/10"
                        title="Hapus Berita"
                        onClick={() => setDeleteId(item.id)}
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </Button>
                    </div>
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
