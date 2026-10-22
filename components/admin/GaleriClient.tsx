'use client'

import React, { useState, useMemo } from 'react'
import Image from 'next/image'
import {
  Plus,
  Trash2,
  Pencil,
  Search,
  ExternalLink,
  Layers,
  Calendar,
  Filter
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle
} from '@/components/ui/alert-dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import { ImageUploader } from '@/components/admin/ImageUploader'
import { createFotoGaleri, updateFotoGaleri, deleteFotoGaleri } from '@/app/actions/galeri'
import type { GaleriItem, AlbumSummary } from '@/app/actions/galeri'

interface GaleriClientProps {
  initialItems: GaleriItem[]
  albums: AlbumSummary[]
}

const KATEGORI_BADGES: Record<string, string> = {
  kegiatan: 'bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20',
  pemuda: 'bg-purple-500/10 text-purple-600 dark:text-purple-400 border-purple-500/20',
  sosial: 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20',
  olahraga: 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20',
  dusun: 'bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 border-cyan-500/20',
  default: 'bg-primary/10 text-primary border-primary/20'
}

export default function GaleriClient({ initialItems, albums }: GaleriClientProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const [editItem, setEditItem] = useState<GaleriItem | null>(null)
  const [deleteId, setDeleteId] = useState<string | null>(null)

  // Form State
  const [fotoUrl, setFotoUrl] = useState('')
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedAlbum, setSelectedAlbum] = useState('semua')
  const [selectedKategori, setSelectedKategori] = useState('semua')

  // Filtered Items
  const filteredData = useMemo(() => {
    return initialItems.filter((item) => {
      const matchSearch =
        searchQuery === '' ||
        item.judul.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.album.toLowerCase().includes(searchQuery.toLowerCase())

      const matchAlbum = selectedAlbum === 'semua' || item.album === selectedAlbum
      const matchKategori = selectedKategori === 'semua' || item.kategori === selectedKategori

      return matchSearch && matchAlbum && matchKategori
    })
  }, [initialItems, searchQuery, selectedAlbum, selectedKategori])

  const openCreate = () => {
    setEditItem(null)
    setFotoUrl('')
    setIsOpen(true)
  }

  const openEdit = (item: GaleriItem) => {
    setEditItem(item)
    setFotoUrl(item.foto_url)
    setIsOpen(true)
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (!fotoUrl) {
      alert('Silakan unggah atau isi URL foto terlebih dahulu.')
      return
    }

    setLoading(true)
    const formData = new FormData(e.currentTarget)
    formData.set('foto_url', fotoUrl)

    const result = editItem
      ? await updateFotoGaleri(formData)
      : await createFotoGaleri(formData)

    setLoading(false)

    if (result.error) {
      alert(result.error)
    } else {
      setIsOpen(false)
      window.location.reload()
    }
  }

  const confirmDelete = async () => {
    if (!deleteId) return
    setLoading(true)
    const result = await deleteFotoGaleri(deleteId)
    setLoading(false)

    if (result.error) {
      alert(result.error)
    } else {
      setDeleteId(null)
      window.location.reload()
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-heading font-bold tracking-tight text-foreground">
            Kelola Galeri &amp; Dokumentasi
          </h1>
          <p className="text-muted-foreground text-sm mt-1">
            Unggah dan kelompokkan foto dokumentasi kegiatan pemuda dan warga dusun ke dalam album.
          </p>
        </div>

        <Button onClick={openCreate} className="rounded-xl gap-2 text-xs font-semibold h-10 px-4 self-start sm:self-auto cursor-pointer">
          <Plus className="h-4 w-4" />
          Tambah Foto Baru
        </Button>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 bg-card p-4 rounded-2xl border border-border">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            type="text"
            placeholder="Cari judul foto atau album..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 h-9 rounded-xl text-xs bg-background"
          />
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {/* Album Filter */}
          <div className="flex items-center gap-1.5 bg-background p-1 rounded-xl border border-border">
            <Layers className="w-3.5 h-3.5 ml-2 text-muted-foreground shrink-0" />
            <select
              value={selectedAlbum}
              onChange={(e) => setSelectedAlbum(e.target.value)}
              className="bg-transparent text-xs font-medium focus:outline-none pr-3 py-0.5 text-foreground cursor-pointer dark:bg-[#181b20]"
            >
              <option value="semua">Semua Album ({initialItems.length})</option>
              {albums.map((a) => (
                <option key={a.nama} value={a.nama}>
                  {a.nama} ({a.count})
                </option>
              ))}
            </select>
          </div>

          {/* Kategori Filter */}
          <div className="flex items-center gap-1.5 bg-background p-1 rounded-xl border border-border">
            <Filter className="w-3.5 h-3.5 ml-2 text-muted-foreground shrink-0" />
            <select
              value={selectedKategori}
              onChange={(e) => setSelectedKategori(e.target.value)}
              className="bg-transparent text-xs font-medium focus:outline-none pr-3 py-0.5 text-foreground cursor-pointer dark:bg-[#181b20]"
            >
              <option value="semua">Semua Kategori</option>
              <option value="kegiatan">Kegiatan</option>
              <option value="pemuda">Pemuda</option>
              <option value="sosial">Sosial &amp; Warga</option>
              <option value="olahraga">Olahraga</option>
              <option value="dusun">Wilayah Dusun</option>
            </select>
          </div>

          <Badge variant="outline" className="text-xs px-2.5 py-1 rounded-xl border-border font-medium">
            {filteredData.length} Foto
          </Badge>
        </div>
      </div>

      {/* Fixed Non-Draggable Table */}
      <div className="rounded-2xl border border-border bg-card overflow-hidden">
        <Table containerClassName="overflow-x-hidden">
          <TableHeader>
            <TableRow>
              <TableHead className="w-[80px]">Foto</TableHead>
              <TableHead className="w-[30%] min-w-0 max-w-0">Judul &amp; Deskripsi</TableHead>
              <TableHead className="w-[20%] min-w-0 max-w-0">Album</TableHead>
              <TableHead className="w-[15%]">Kategori</TableHead>
              <TableHead className="w-[15%]">Tanggal</TableHead>
              <TableHead className="w-[100px] text-right">Aksi</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredData.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center h-32 text-muted-foreground text-xs">
                  Belum ada foto galeri yang cocok. Klik tombol &quot;Tambah Foto Baru&quot; untuk menambahkan.
                </TableCell>
              </TableRow>
            ) : (
              filteredData.map((item) => {
                const isKegiatanSource = item.source === 'kegiatan'
                const catClass = KATEGORI_BADGES[item.kategori] || KATEGORI_BADGES.default

                return (
                  <TableRow key={item.id} className="group">
                    {/* Thumbnail */}
                    <TableCell>
                      <div className="relative w-12 h-12 rounded-xl overflow-hidden bg-muted border border-border shrink-0">
                        <Image
                          src={item.foto_url}
                          alt={item.judul}
                          fill
                          sizes="48px"
                          className="object-cover"
                        />
                      </div>
                    </TableCell>

                    {/* Judul & Deskripsi with Ellipsis */}
                    <TableCell className="min-w-0 max-w-0">
                      <div className="min-w-0">
                        <p className="font-semibold text-xs text-foreground truncate block min-w-0" title={item.judul}>
                          {item.judul}
                        </p>
                        {item.deskripsi ? (
                          <p className="text-[11px] text-muted-foreground truncate block min-w-0 mt-0.5" title={item.deskripsi}>
                            {item.deskripsi}
                          </p>
                        ) : (
                          <span className="text-[10px] text-muted-foreground italic">Tanpa deskripsi</span>
                        )}
                      </div>
                    </TableCell>

                    {/* Album with Ellipsis */}
                    <TableCell className="min-w-0 max-w-0">
                      <div className="flex items-center gap-1.5 min-w-0">
                        <Layers className="w-3.5 h-3.5 text-muted-foreground shrink-0" />
                        <span className="text-xs font-medium text-foreground truncate block min-w-0" title={item.album}>
                          {item.album}
                        </span>
                      </div>
                      {isKegiatanSource && (
                        <span className="text-[9px] text-primary/80 font-medium block mt-0.5">
                          (Otomatis dari Kegiatan)
                        </span>
                      )}
                    </TableCell>

                    {/* Kategori */}
                    <TableCell>
                      <Badge variant="outline" className={`text-[10px] px-2 py-0.5 capitalize ${catClass}`}>
                        {item.kategori}
                      </Badge>
                    </TableCell>

                    {/* Tanggal */}
                    <TableCell>
                      <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                        <Calendar className="w-3.5 h-3.5 shrink-0" />
                        <span>{item.tanggal || '-'}</span>
                      </div>
                    </TableCell>

                    {/* Action */}
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-1">
                        <a
                          href={item.foto_url}
                          target="_blank"
                          rel="noreferrer"
                          className="w-8 h-8 rounded-lg hover:bg-muted text-muted-foreground hover:text-foreground flex items-center justify-center transition-colors"
                          title="Lihat Foto Asli"
                        >
                          <ExternalLink className="w-3.5 h-3.5" />
                        </a>

                        {!isKegiatanSource ? (
                          <>
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => openEdit(item)}
                              className="w-8 h-8 rounded-lg text-muted-foreground hover:text-foreground"
                              title="Edit Foto"
                            >
                              <Pencil className="w-3.5 h-3.5" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => setDeleteId(item.id)}
                              className="w-8 h-8 rounded-lg text-destructive hover:bg-destructive/10"
                              title="Hapus Foto"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </Button>
                          </>
                        ) : (
                          <span className="text-[10px] text-muted-foreground px-1" title="Foto ini bersumber dari modul Kegiatan">
                            Locked
                          </span>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                )
              })
            )}
          </TableBody>
        </Table>
      </div>

      {/* Modal Add / Edit */}
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="max-w-lg rounded-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="font-heading font-bold text-lg">
              {editItem ? 'Edit Informasi Foto' : 'Unggah Foto Baru ke Galeri'}
            </DialogTitle>
          </DialogHeader>

          <form onSubmit={handleSubmit} className="space-y-4 pt-2">
            {editItem && <input type="hidden" name="id" value={editItem.id} />}

            {/* Photo Uploader */}
            <div className="space-y-1.5">
              <Label className="text-xs font-semibold">Foto Dokumentasi</Label>
              <ImageUploader
                bucket="kegiatan"
                folder="galeri"
                defaultImage={fotoUrl}
                onUploadSuccess={(url) => setFotoUrl(url)}
              />
            </div>

            {/* Judul Foto */}
            <div className="space-y-1.5">
              <Label htmlFor="judul" className="text-xs font-semibold">Judul Foto</Label>
              <Input
                id="judul"
                name="judul"
                required
                defaultValue={editItem?.judul || ''}
                placeholder="Misal: Penyerahan Hadiah Turnamen Voli 2026"
                className="rounded-xl text-xs"
              />
            </div>

            {/* Album & Kategori Grid */}
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label htmlFor="album" className="text-xs font-semibold">Nama Album</Label>
                <Input
                  id="album"
                  name="album"
                  required
                  defaultValue={editItem?.album || 'Umum'}
                  placeholder="Misal: Peringatan 17 Agustus"
                  className="rounded-xl text-xs"
                />
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="kategori" className="text-xs font-semibold">Kategori</Label>
                <select
                  id="kategori"
                  name="kategori"
                  defaultValue={editItem?.kategori || 'kegiatan'}
                  className="flex h-9 w-full rounded-xl border border-input bg-transparent px-3 py-1 text-xs shadow-xs focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring text-foreground dark:bg-[#181b20]"
                >
                  <option value="kegiatan">Kegiatan</option>
                  <option value="pemuda">Pemuda</option>
                  <option value="sosial">Sosial &amp; Warga</option>
                  <option value="olahraga">Olahraga</option>
                  <option value="dusun">Wilayah Dusun</option>
                </select>
              </div>
            </div>

            {/* Tanggal Pelaksanaan */}
            <div className="space-y-1.5">
              <Label htmlFor="tanggal" className="text-xs font-semibold">Tanggal Dokumentasi</Label>
              <Input
                id="tanggal"
                name="tanggal"
                type="date"
                defaultValue={editItem?.tanggal || new Date().toISOString().split('T')[0]}
                className="rounded-xl text-xs"
              />
            </div>

            {/* Deskripsi */}
            <div className="space-y-1.5">
              <Label htmlFor="deskripsi" className="text-xs font-semibold">Keterangan / Cerita Momen (Opsional)</Label>
              <textarea
                id="deskripsi"
                name="deskripsi"
                rows={3}
                defaultValue={editItem?.deskripsi || ''}
                placeholder="Cerita singkat mengenai momen pada foto ini..."
                className="w-full rounded-xl border border-input bg-transparent p-3 text-xs shadow-xs focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
              />
            </div>

            {/* Submit Buttons */}
            <div className="flex items-center justify-end gap-2 pt-2 border-t border-border">
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsOpen(false)}
                disabled={loading}
                className="rounded-xl text-xs h-9 cursor-pointer"
              >
                Batal
              </Button>
              <Button
                type="submit"
                disabled={loading}
                className="rounded-xl text-xs h-9 font-semibold bg-primary hover:bg-primary/90 text-primary-foreground cursor-pointer"
              >
                {loading ? 'Menyimpan...' : editItem ? 'Simpan Perubahan' : 'Unggah ke Galeri'}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Alert */}
      <AlertDialog open={!!deleteId} onOpenChange={(open) => !open && setDeleteId(null)}>
        <AlertDialogContent className="rounded-2xl max-w-md">
          <AlertDialogHeader>
            <AlertDialogTitle className="font-heading font-bold text-base">
              Hapus Foto dari Galeri?
            </AlertDialogTitle>
            <AlertDialogDescription className="text-xs text-muted-foreground leading-relaxed">
              Tindakan ini akan menghapus foto dari album galeri publik. Foto yang bersumber otomatis dari kegiatan tidak terhapus dari kegiatan induknya.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={loading} className="rounded-xl text-xs h-9">
              Batal
            </AlertDialogCancel>
            <AlertDialogAction
              disabled={loading}
              onClick={confirmDelete}
              className="rounded-xl text-xs h-9 bg-destructive hover:bg-destructive/90 text-destructive-foreground font-semibold"
            >
              {loading ? 'Menghapus...' : 'Ya, Hapus'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
