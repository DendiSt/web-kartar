'use client'

import * as React from 'react'
import {
  MessageSquare,
  CheckCircle2,
  XCircle,
  Clock,
  Search,
  Trash2,
  Edit3
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter
} from '@/components/ui/dialog'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select'
import {
  AspirasiDTO,
  AspirasiStats,
  updateAspirasiStatus,
  deleteAspirasi
} from '@/app/actions/aspirasi'

interface AspirasiAdminClientProps {
  initialItems: AspirasiDTO[]
  initialStats: AspirasiStats
}

export default function AspirasiAdminClient({
  initialItems,
  initialStats
}: AspirasiAdminClientProps) {
  const [items, setItems] = React.useState<AspirasiDTO[]>(initialItems)
  const [stats, setStats] = React.useState<AspirasiStats>(initialStats)

  // Filters
  const [activeTab, setActiveTab] = React.useState<'semua' | 'PENDING' | 'APPROVED' | 'REJECTED'>('semua')
  const [categoryFilter, setCategoryFilter] = React.useState('semua')
  const [search, setSearch] = React.useState('')

  // Modals
  const [selectedItem, setSelectedItem] = React.useState<AspirasiDTO | null>(null)
  const [isResponseOpen, setIsResponseOpen] = React.useState(false)
  const [isDeleteOpen, setIsDeleteOpen] = React.useState(false)

  // Response Form
  const [tanggapanText, setTanggapanText] = React.useState('')
  const [isSubmitting, setIsSubmitting] = React.useState(false)

  const filteredItems = React.useMemo(() => {
    return items.filter((item) => {
      if (activeTab !== 'semua' && item.status !== activeTab) return false
      if (categoryFilter !== 'semua' && item.kategori !== categoryFilter) return false
      if (search) {
        const q = search.toLowerCase()
        const matchNama = item.nama.toLowerCase().includes(q)
        const matchPesan = item.pesan.toLowerCase().includes(q)
        const matchKontak = item.kontak?.toLowerCase().includes(q)
        const matchTanggapan = item.tanggapan?.toLowerCase().includes(q)
        if (!matchNama && !matchPesan && !matchKontak && !matchTanggapan) return false
      }
      return true
    })
  }, [items, activeTab, categoryFilter, search])

  // Quick Approve
  const handleQuickApprove = async (item: AspirasiDTO) => {
    setIsSubmitting(true)
    try {
      const res = await updateAspirasiStatus(item.id, 'APPROVED')
      if (res.success) {
        setItems((prev) =>
          prev.map((i) => (i.id === item.id ? { ...i, status: 'APPROVED' } : i))
        )
        setStats((prev) => ({
          ...prev,
          pending: Math.max(0, prev.pending - (item.status === 'PENDING' ? 1 : 0)),
          approved: prev.approved + 1
        }))
      }
    } finally {
      setIsSubmitting(false)
    }
  }

  // Quick Reject
  const handleQuickReject = async (item: AspirasiDTO) => {
    setIsSubmitting(true)
    try {
      const res = await updateAspirasiStatus(item.id, 'REJECTED')
      if (res.success) {
        setItems((prev) =>
          prev.map((i) => (i.id === item.id ? { ...i, status: 'REJECTED' } : i))
        )
        setStats((prev) => ({
          ...prev,
          pending: Math.max(0, prev.pending - (item.status === 'PENDING' ? 1 : 0)),
          rejected: prev.rejected + 1
        }))
      }
    } finally {
      setIsSubmitting(false)
    }
  }

  // Open Response Modal
  const openResponseModal = (item: AspirasiDTO) => {
    setSelectedItem(item)
    setTanggapanText(item.tanggapan || '')
    setIsResponseOpen(true)
  }

  // Submit Response & Approve
  const handleSubmitResponse = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!selectedItem) return
    setIsSubmitting(true)
    try {
      const res = await updateAspirasiStatus(
        selectedItem.id,
        'APPROVED',
        tanggapanText.trim() || null
      )
      if (res.success) {
        setItems((prev) =>
          prev.map((i) =>
            i.id === selectedItem.id
              ? { ...i, status: 'APPROVED', tanggapan: tanggapanText.trim() || null }
              : i
          )
        )
        setIsResponseOpen(false)
      }
    } finally {
      setIsSubmitting(false)
    }
  }

  // Handle Delete
  const handleDelete = async () => {
    if (!selectedItem) return
    setIsSubmitting(true)
    try {
      const res = await deleteAspirasi(selectedItem.id)
      if (res.success) {
        setItems((prev) => prev.filter((i) => i.id !== selectedItem.id))
        setIsDeleteOpen(false)
      }
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="space-y-6">
      {/* Metrics Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div
          onClick={() => setActiveTab('semua')}
          className={`p-4 rounded-xl border bg-card text-card-foreground shadow-sm cursor-pointer transition-all ${
            activeTab === 'semua' ? 'ring-2 ring-primary border-transparent' : 'hover:border-primary/50'
          }`}
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-medium text-muted-foreground uppercase">Total Masuk</p>
              <p className="text-2xl font-bold mt-1">{stats.total} Pesan</p>
            </div>
            <div className="h-10 w-10 rounded-lg bg-blue-500/10 text-blue-600 dark:text-blue-400 flex items-center justify-center">
              <MessageSquare className="h-5 w-5" />
            </div>
          </div>
        </div>

        <div
          onClick={() => setActiveTab('PENDING')}
          className={`p-4 rounded-xl border bg-card text-card-foreground shadow-sm cursor-pointer transition-all ${
            activeTab === 'PENDING' ? 'ring-2 ring-amber-500 border-transparent' : 'hover:border-amber-500/50'
          }`}
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-medium text-muted-foreground uppercase">Butuh Review</p>
              <p className="text-2xl font-bold mt-1 text-amber-600 dark:text-amber-400">
                {stats.pending} Pesan
              </p>
            </div>
            <div className="h-10 w-10 rounded-lg bg-amber-500/10 text-amber-600 dark:text-amber-400 flex items-center justify-center">
              <Clock className="h-5 w-5" />
            </div>
          </div>
        </div>

        <div
          onClick={() => setActiveTab('APPROVED')}
          className={`p-4 rounded-xl border bg-card text-card-foreground shadow-sm cursor-pointer transition-all ${
            activeTab === 'APPROVED' ? 'ring-2 ring-emerald-500 border-transparent' : 'hover:border-emerald-500/50'
          }`}
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-medium text-muted-foreground uppercase">Disetujui / Publik</p>
              <p className="text-2xl font-bold mt-1 text-emerald-600 dark:text-emerald-400">
                {stats.approved} Pesan
              </p>
            </div>
            <div className="h-10 w-10 rounded-lg bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
              <CheckCircle2 className="h-5 w-5" />
            </div>
          </div>
        </div>

        <div
          onClick={() => setActiveTab('REJECTED')}
          className={`p-4 rounded-xl border bg-card text-card-foreground shadow-sm cursor-pointer transition-all ${
            activeTab === 'REJECTED' ? 'ring-2 ring-rose-500 border-transparent' : 'hover:border-rose-500/50'
          }`}
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-medium text-muted-foreground uppercase">Ditolak / Arsip</p>
              <p className="text-2xl font-bold mt-1 text-rose-600 dark:text-rose-400">
                {stats.rejected} Pesan
              </p>
            </div>
            <div className="h-10 w-10 rounded-lg bg-rose-500/10 text-rose-600 dark:text-rose-400 flex items-center justify-center">
              <XCircle className="h-5 w-5" />
            </div>
          </div>
        </div>
      </div>

      {/* Filter Toolbar */}
      <div className="flex flex-col md:flex-row gap-3 items-stretch md:items-center justify-between bg-card p-4 rounded-xl border shadow-sm">
        <div className="flex flex-1 flex-wrap gap-2 items-center">
          {/* Search */}
          <div className="relative min-w-[220px] max-w-sm flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Cari pengirim, kontak, pesan..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9 h-9 text-xs"
            />
          </div>

          {/* Kategori Filter */}
          <Select value={categoryFilter} onValueChange={(val) => setCategoryFilter(val || 'semua')}>
            <SelectTrigger className="h-9 w-[150px] text-xs">
              <SelectValue placeholder="Kategori" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="semua">Semua Kategori</SelectItem>
              <SelectItem value="aspirasi">Aspirasi / Ide</SelectItem>
              <SelectItem value="saran">Saran Perbaikan</SelectItem>
              <SelectItem value="pengaduan">Pengaduan</SelectItem>
              <SelectItem value="apresiasi">Apresiasi</SelectItem>
              <SelectItem value="pertanyaan">Pertanyaan</SelectItem>
            </SelectContent>
          </Select>

          {(search || categoryFilter !== 'semua' || activeTab !== 'semua') && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => {
                setSearch('')
                setCategoryFilter('semua')
                setActiveTab('semua')
              }}
              className="h-9 px-2 text-xs text-muted-foreground"
            >
              Reset Filter
            </Button>
          )}
        </div>
      </div>

      {/* Non-draggable Table with Ellipsis */}
      <div className="rounded-xl border bg-card shadow-sm overflow-hidden">
        <div className="overflow-x-hidden">
          <table className="w-full text-sm text-left table-fixed">
            <thead className="bg-muted/50 text-xs font-semibold uppercase text-muted-foreground border-b">
              <tr>
                <th scope="col" className="py-3 px-4 w-[20%]">
                  Pengirim & Kontak
                </th>
                <th scope="col" className="py-3 px-3 w-[14%]">
                  Kategori & Status
                </th>
                <th scope="col" className="py-3 px-3 w-[34%]">
                  Isi Aspirasi / Pesan
                </th>
                <th scope="col" className="py-3 px-3 w-[18%]">
                  Tanggapan Pengurus
                </th>
                <th scope="col" className="py-3 px-4 w-[14%] text-right">
                  Aksi Moderasi
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {filteredItems.length === 0 ? (
                <tr>
                  <td colSpan={5} className="py-12 text-center text-muted-foreground">
                    <MessageSquare className="h-10 w-10 mx-auto text-muted-foreground/30 mb-2" />
                    <p className="font-medium text-sm">Tidak ada pesan di kategori ini.</p>
                  </td>
                </tr>
              ) : (
                filteredItems.map((item) => (
                  <tr key={item.id} className="hover:bg-muted/30 transition-colors">
                    {/* Pengirim */}
                    <td className="py-3 px-4">
                      <div className="min-w-0">
                        <p className="font-semibold text-foreground text-xs truncate" title={item.nama}>
                          {item.nama}
                        </p>
                        <p className="text-[11px] text-muted-foreground truncate">
                          {item.kontak || (item.is_anonim ? 'Anonim' : 'Tanpa Kontak')}
                        </p>
                        <p className="text-[10px] text-muted-foreground mt-0.5">
                          {item.created_at ? item.created_at.split('T')[0] : ''}
                        </p>
                      </div>
                    </td>

                    {/* Kategori & Status */}
                    <td className="py-3 px-3">
                      <div className="space-y-1">
                        <Badge variant="outline" className="text-[10px] uppercase font-semibold">
                          {item.kategori}
                        </Badge>
                        <div>
                          <Badge
                            className={`text-[10px] py-0 px-1.5 font-medium ${
                              item.status === 'APPROVED'
                                ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20'
                                : item.status === 'PENDING'
                                ? 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20'
                                : 'bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-500/20'
                            }`}
                          >
                            {item.status}
                          </Badge>
                        </div>
                      </div>
                    </td>

                    {/* Isi Pesan (Truncate with Ellipsis) */}
                    <td className="py-3 px-3">
                      <p className="text-xs text-foreground/90 truncate max-w-full" title={item.pesan}>
                        &ldquo;{item.pesan}&rdquo;
                      </p>
                    </td>

                    {/* Tanggapan Pengurus */}
                    <td className="py-3 px-3">
                      {item.tanggapan ? (
                        <p className="text-xs text-primary truncate max-w-full" title={item.tanggapan}>
                          {item.tanggapan}
                        </p>
                      ) : (
                        <span className="text-xs text-muted-foreground italic">Belum ditanggapi</span>
                      )}
                    </td>

                    {/* Actions */}
                    <td className="py-3 px-4 text-right">
                      <div className="flex items-center justify-end gap-1">
                        {item.status !== 'APPROVED' && (
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleQuickApprove(item)}
                            title="Setujui (Approve)"
                            className="h-8 w-8 text-emerald-600 hover:text-emerald-700 hover:bg-emerald-500/10"
                          >
                            <CheckCircle2 className="h-4 w-4" />
                          </Button>
                        )}
                        {item.status !== 'REJECTED' && (
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleQuickReject(item)}
                            title="Tolak (Reject)"
                            className="h-8 w-8 text-amber-600 hover:text-amber-700 hover:bg-amber-500/10"
                          >
                            <XCircle className="h-4 w-4" />
                          </Button>
                        )}
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => openResponseModal(item)}
                          title="Beri Tanggapan"
                          className="h-8 w-8 text-muted-foreground hover:text-primary"
                        >
                          <Edit3 className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => {
                            setSelectedItem(item)
                            setIsDeleteOpen(true)
                          }}
                          title="Hapus"
                          className="h-8 w-8 text-muted-foreground hover:text-destructive"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* RESPONSE MODAL */}
      <Dialog open={isResponseOpen} onOpenChange={setIsResponseOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Tanggapi Aspirasi Warga</DialogTitle>
            <DialogDescription>
              Tuliskan tanggapan resmi dari pengurus Karang Taruna untuk pesan ini.
            </DialogDescription>
          </DialogHeader>

          {selectedItem && (
            <div className="space-y-4 py-2">
              <div className="p-3 rounded-lg bg-muted/40 border space-y-1">
                <div className="flex justify-between items-center text-xs">
                  <span className="font-semibold text-foreground">{selectedItem.nama}</span>
                  <Badge variant="outline" className="text-[10px]">
                    {selectedItem.kategori}
                  </Badge>
                </div>
                <p className="text-xs text-muted-foreground italic">&ldquo;{selectedItem.pesan}&rdquo;</p>
              </div>

              <form onSubmit={handleSubmitResponse} className="space-y-4">
                <div>
                  <Label htmlFor="tanggapan" className="text-xs font-semibold">
                    Tanggapan Resmi Pengurus
                  </Label>
                  <Textarea
                    id="tanggapan"
                    rows={4}
                    value={tanggapanText}
                    onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setTanggapanText(e.target.value)}
                    placeholder="Tuliskan respon atau penjelasan resmi dari pengurus..."
                    className="mt-1 text-xs resize-none"
                    required
                  />
                </div>

                <DialogFooter>
                  <Button type="button" variant="outline" onClick={() => setIsResponseOpen(false)}>
                    Batal
                  </Button>
                  <Button type="submit" disabled={isSubmitting}>
                    {isSubmitting ? 'Menyimpan...' : 'Simpan & Publikasikan'}
                  </Button>
                </DialogFooter>
              </form>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* DELETE MODAL */}
      <Dialog open={isDeleteOpen} onOpenChange={setIsDeleteOpen}>
        <DialogContent className="sm:max-w-[400px]">
          <DialogHeader>
            <DialogTitle>Hapus Aspirasi?</DialogTitle>
            <DialogDescription>
              Apakah Anda yakin ingin menghapus pesan dari <strong>{selectedItem?.nama}</strong>?
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDeleteOpen(false)}>
              Batal
            </Button>
            <Button variant="destructive" onClick={handleDelete} disabled={isSubmitting}>
              {isSubmitting ? 'Menghapus...' : 'Ya, Hapus'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
