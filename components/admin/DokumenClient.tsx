'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import { Plus, Trash2, Pencil, Search, FileText, Download, ExternalLink, CheckCircle2, Lock, FileSpreadsheet, FileArchive } from 'lucide-react'
import { createDokumen, updateDokumen, deleteDokumen } from '@/app/actions/dokumen'
import { DokumenUploader } from '@/components/admin/DokumenUploader'

interface DokumenItem {
  id: string
  judul: string
  nomor_surat: string | null
  kategori: string
  deskripsi: string | null
  file_url: string
  file_name: string | null
  file_size: string | null
  file_type: string | null
  tahun: number | null
  downloads: number
  is_public: boolean
  created_at: string | null
  updated_at: string | null
}

export default function DokumenClient({ data }: { data: DokumenItem[] }) {
  const [isOpen, setIsOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const [search, setSearch] = useState('')
  const [filterKategori, setFilterKategori] = useState('semua')
  
  // Edit State
  const [editItem, setEditItem] = useState<DokumenItem | null>(null)
  const [fileInfo, setFileInfo] = useState<{
    url: string
    name: string
    size: string
    type: string
  }>({
    url: '',
    name: '',
    size: '',
    type: 'pdf'
  })
  
  // Delete State
  const [deleteId, setDeleteId] = useState<string | null>(null)

  function openCreate() {
    setEditItem(null)
    setFileInfo({ url: '', name: '', size: '', type: 'pdf' })
    setIsOpen(true)
  }

  function openEdit(item: DokumenItem) {
    setEditItem(item)
    setFileInfo({
      url: item.file_url,
      name: item.file_name || '',
      size: item.file_size || '',
      type: item.file_type || 'pdf'
    })
    setIsOpen(true)
  }

  async function handleSubmit(formData: FormData) {
    if (!fileInfo.url) {
      alert('Silakan unggah berkas dokumen terlebih dahulu.')
      return
    }

    setLoading(true)
    formData.set('file_url', fileInfo.url)
    formData.set('file_name', fileInfo.name)
    formData.set('file_size', fileInfo.size)
    formData.set('file_type', fileInfo.type)
    
    const result = editItem 
      ? await updateDokumen(formData) 
      : await createDokumen(formData)
      
    setLoading(false)
    
    if (result.error) {
      alert(result.error)
    } else {
      setIsOpen(false)
      setEditItem(null)
      setFileInfo({ url: '', name: '', size: '', type: 'pdf' })
    }
  }

  async function confirmDelete() {
    if (!deleteId) return
    setLoading(true)
    await deleteDokumen(deleteId)
    setLoading(false)
    setDeleteId(null)
  }

  const filteredData = data.filter((item) => {
    const matchesSearch = item.judul.toLowerCase().includes(search.toLowerCase()) ||
      (item.nomor_surat && item.nomor_surat.toLowerCase().includes(search.toLowerCase())) ||
      (item.deskripsi && item.deskripsi.toLowerCase().includes(search.toLowerCase()))
    const matchesKategori = filterKategori === 'semua' || item.kategori === filterKategori
    return matchesSearch && matchesKategori
  })

  const getKategoriBadgeColor = (kategori: string) => {
    switch (kategori) {
      case 'sk':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-300 border-blue-200 dark:border-blue-800'
      case 'ad_art':
        return 'bg-purple-100 text-purple-800 dark:bg-purple-950 dark:text-purple-300 border-purple-200 dark:border-purple-800'
      case 'proposal':
        return 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300 border-amber-200 dark:border-amber-800'
      case 'lpj':
        return 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800'
      case 'surat':
        return 'bg-cyan-100 text-cyan-800 dark:bg-cyan-950 dark:text-cyan-300 border-cyan-200 dark:border-cyan-800'
      default:
        return 'bg-slate-100 text-slate-800 dark:bg-slate-800 dark:text-slate-300 border-slate-200 dark:border-slate-700'
    }
  }

  const getFileIcon = (fileType: string | null) => {
    const ft = (fileType || 'pdf').toLowerCase()
    if (ft.includes('xls')) return <FileSpreadsheet className="w-4 h-4 text-emerald-600" />
    if (ft.includes('zip') || ft.includes('rar')) return <FileArchive className="w-4 h-4 text-amber-600" />
    return <FileText className="w-4 h-4 text-red-500" />
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-heading font-bold tracking-tight">Dokumen & Arsip Digital</h2>
          <p className="text-muted-foreground text-sm mt-1">
            Kelola arsip resmi organisasi seperti SK Kepengurusan, AD/ART, Proposal, dan LPJ.
          </p>
        </div>
        
        <Button className="bg-[#1868db] hover:bg-[#1558be] text-white shrink-0" onClick={openCreate}>
          <Plus className="mr-2 h-4 w-4" /> Unggah Dokumen Baru
        </Button>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3 items-center justify-between bg-card p-4 rounded-xl border border-border">
        <div className="relative w-full sm:w-80">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Cari judul atau nomor surat..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9 bg-background"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto overflow-x-auto">
          {[
            { id: 'semua', label: 'Semua' },
            { id: 'sk', label: 'SK Pengurus' },
            { id: 'ad_art', label: 'AD / ART' },
            { id: 'proposal', label: 'Proposal' },
            { id: 'lpj', label: 'LPJ' },
            { id: 'surat', label: 'Surat Resmi' },
            { id: 'lain_lain', label: 'Lainnya' }
          ].map((kat) => (
            <Button
              key={kat.id}
              variant={filterKategori === kat.id ? 'default' : 'outline'}
              size="sm"
              onClick={() => setFilterKategori(kat.id)}
              className="text-xs rounded-full h-8 shrink-0"
            >
              {kat.label}
            </Button>
          ))}
        </div>
      </div>

      {/* Dialog Form Create / Edit */}
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="sm:max-w-[620px] max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="font-heading text-xl">
              {editItem ? 'Edit Informasi Dokumen' : 'Unggah Dokumen Baru'}
            </DialogTitle>
          </DialogHeader>
          <form action={handleSubmit} className="space-y-4 pt-2">
            {editItem && <input type="hidden" name="id" value={editItem.id} />}

            <div className="space-y-2">
              <Label htmlFor="judul">Judul Dokumen</Label>
              <Input 
                id="judul" 
                name="judul" 
                required 
                defaultValue={editItem?.judul || ''} 
                placeholder="Contoh: SK Pengurus Karang Taruna Periode 2026-2028" 
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="space-y-2 sm:col-span-2">
                <Label htmlFor="nomor_surat">Nomor Surat / SK (Opsional)</Label>
                <Input 
                  id="nomor_surat" 
                  name="nomor_surat" 
                  defaultValue={editItem?.nomor_surat || ''} 
                  placeholder="Contoh: 004/SK-KT/X/2026" 
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="tahun">Tahun Dokumen</Label>
                <Input 
                  id="tahun" 
                  name="tahun" 
                  type="number" 
                  defaultValue={editItem?.tahun || new Date().getFullYear()} 
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="kategori">Kategori Dokumen</Label>
                <select 
                  id="kategori" 
                  name="kategori" 
                  defaultValue={editItem?.kategori || 'sk'}
                  className="flex h-9 w-full rounded-md border border-input bg-background dark:bg-[#181b20] text-foreground dark:text-white px-3 py-1 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring dark:border-[#292a2e]"
                >
                  <option value="sk" className="bg-white dark:bg-[#181b20] text-[#101214] dark:text-white">📄 SK Pengurus</option>
                  <option value="ad_art" className="bg-white dark:bg-[#181b20] text-[#101214] dark:text-white">📜 AD / ART</option>
                  <option value="proposal" className="bg-white dark:bg-[#181b20] text-[#101214] dark:text-white">📑 Proposal Kegiatan</option>
                  <option value="lpj" className="bg-white dark:bg-[#181b20] text-[#101214] dark:text-white">📊 Laporan Pertanggungjawaban (LPJ)</option>
                  <option value="surat" className="bg-white dark:bg-[#181b20] text-[#101214] dark:text-white">✉️ Surat Resmi</option>
                  <option value="lain_lain" className="bg-white dark:bg-[#181b20] text-[#101214] dark:text-white">📁 Berkas Lainnya</option>
                </select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="is_public">Akses Pengunjung</Label>
                <select 
                  id="is_public" 
                  name="is_public" 
                  defaultValue={editItem ? String(editItem.is_public) : 'true'}
                  className="flex h-9 w-full rounded-md border border-input bg-background dark:bg-[#181b20] text-foreground dark:text-white px-3 py-1 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring dark:border-[#292a2e]"
                >
                  <option value="true" className="bg-white dark:bg-[#181b20] text-[#101214] dark:text-white">Publik (Dapat Diunduh Warga)</option>
                  <option value="false" className="bg-white dark:bg-[#181b20] text-[#101214] dark:text-white">Internal (Khusus Arsip Admin)</option>
                </select>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="deskripsi">Keterangan / Ringkasan Isi</Label>
              <textarea 
                id="deskripsi" 
                name="deskripsi" 
                rows={3}
                defaultValue={editItem?.deskripsi || ''} 
                placeholder="Penjelasan singkat mengenai dokumen ini..."
                className="flex w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
              />
            </div>

            {/* Document File Uploader */}
            <div className="space-y-2 pt-2 border-t">
              <Label>Berkas Dokumen *</Label>
              <DokumenUploader 
                defaultUrl={fileInfo.url}
                defaultName={fileInfo.name}
                defaultSize={fileInfo.size}
                defaultType={fileInfo.type}
                onUploadSuccess={(info) => setFileInfo(info)}
              />
            </div>

            <div className="flex justify-end gap-3 pt-4 border-t">
              <Button type="button" variant="outline" onClick={() => setIsOpen(false)}>Batal</Button>
              <Button type="submit" disabled={loading} className="bg-[#1868db] hover:bg-[#1558be] text-white">
                {loading ? 'Menyimpan...' : (editItem ? 'Simpan Perubahan' : 'Simpan Dokumen')}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Alert */}
      <AlertDialog open={!!deleteId} onOpenChange={(open) => !open && setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Hapus Dokumen Arsip?</AlertDialogTitle>
            <AlertDialogDescription>
              Tindakan ini tidak dapat dibatalkan. Dokumen ini akan dihapus permanen dari daftar arsip website.
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
              <TableHead className="w-[50px] pl-3 pr-1 text-center">Format</TableHead>
              <TableHead className="w-auto px-2">Judul & Keterangan</TableHead>
              <TableHead className="w-[110px] px-2">Kategori</TableHead>
              <TableHead className="w-[80px] px-2 text-center">Tahun</TableHead>
              <TableHead className="w-[85px] px-2 text-center">Unduhan</TableHead>
              <TableHead className="w-[95px] px-2 text-center">Akses</TableHead>
              <TableHead className="w-[110px] pr-3 pl-2 text-right">Aksi</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredData.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="h-32 text-center text-muted-foreground">
                  <div className="flex flex-col items-center justify-center gap-2">
                    <FileText className="h-8 w-8 text-muted-foreground/50" />
                    <p>Belum ada berkas dokumen yang tersimpan.</p>
                  </div>
                </TableCell>
              </TableRow>
            ) : (
              filteredData.map((item) => (
                <TableRow key={item.id} className="hover:bg-muted/30 transition-colors">
                  <TableCell className="w-[50px] pl-3 pr-1 py-2.5 text-center">
                    <div className="h-9 w-9 mx-auto rounded-lg bg-muted flex items-center justify-center border border-border">
                      {getFileIcon(item.file_type)}
                    </div>
                  </TableCell>
                  
                  <TableCell className="px-2 py-2.5 min-w-0 max-w-0 overflow-hidden">
                    <div className="space-y-0.5 min-w-0 max-w-full">
                      <span className="font-semibold text-foreground truncate block min-w-0 text-sm" title={item.judul}>
                        {item.judul}
                      </span>
                      {item.nomor_surat && (
                        <span className="text-[11px] font-mono text-muted-foreground block truncate" title={item.nomor_surat}>
                          No: {item.nomor_surat}
                        </span>
                      )}
                      <p className="text-xs text-muted-foreground truncate block min-w-0" title={item.deskripsi || item.file_name || ''}>
                        {item.deskripsi || item.file_name || 'Tidak ada deskripsi'}
                      </p>
                    </div>
                  </TableCell>

                  <TableCell className="w-[110px] px-2 py-2.5">
                    <Badge variant="outline" className={`capitalize font-medium text-xs truncate max-w-full block text-center ${getKategoriBadgeColor(item.kategori)}`}>
                      {item.kategori.replace('_', ' ')}
                    </Badge>
                  </TableCell>

                  <TableCell className="w-[80px] px-2 py-2.5 text-center text-xs font-medium text-muted-foreground">
                    {item.tahun || '-'}
                  </TableCell>

                  <TableCell className="w-[85px] px-2 py-2.5 text-center">
                    <div className="flex items-center justify-center gap-1 text-xs text-muted-foreground">
                      <Download className="w-3 h-3 text-[#1868db]" />
                      <span>{item.downloads}x</span>
                    </div>
                  </TableCell>

                  <TableCell className="w-[95px] px-2 py-2.5 text-center">
                    {item.is_public ? (
                      <Badge variant="outline" className="bg-emerald-50 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-400 border-emerald-300 gap-1 text-[10px] font-medium mx-auto">
                        <CheckCircle2 className="w-2.5 h-2.5" /> Publik
                      </Badge>
                    ) : (
                      <Badge variant="outline" className="bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300 border-slate-300 gap-1 text-[10px] font-medium mx-auto">
                        <Lock className="w-2.5 h-2.5" /> Internal
                      </Badge>
                    )}
                  </TableCell>

                  <TableCell className="w-[110px] pr-3 pl-2 py-2.5 text-right">
                    <div className="flex items-center justify-end gap-1">
                      <a
                        href={item.file_url}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center justify-center h-7 w-7 rounded-md text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
                        title="Buka / Unduh Dokumen"
                      >
                        <ExternalLink className="h-3.5 w-3.5" />
                      </a>
                      <Button 
                        size="icon" 
                        variant="ghost" 
                        className="h-7 w-7 text-blue-600 hover:text-blue-700 hover:bg-blue-50 dark:hover:bg-blue-950/40"
                        title="Edit Dokumen"
                        onClick={() => openEdit(item)}
                      >
                        <Pencil className="h-3.5 w-3.5" />
                      </Button>
                      <Button 
                        size="icon" 
                        variant="ghost" 
                        className="h-7 w-7 text-destructive hover:text-destructive hover:bg-destructive/10"
                        title="Hapus Dokumen"
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
