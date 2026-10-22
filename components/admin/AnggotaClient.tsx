'use client'

import * as React from 'react'
import {
  Users,
  Search,
  Plus,
  Download,
  Edit2,
  Trash2,
  Eye,
  UserCheck,
  GraduationCap,
  Briefcase,
  Phone,
  Mail
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
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
  AnggotaDTO,
  AnggotaStats,
  createAnggota,
  updateAnggota,
  deleteAnggota
} from '@/app/actions/anggota'
import { ImageUploader } from '@/components/admin/ImageUploader'

interface AnggotaClientProps {
  initialAnggota: AnggotaDTO[]
  initialStats: AnggotaStats
}

export default function AnggotaClient({
  initialAnggota,
  initialStats
}: AnggotaClientProps) {
  const [anggotaList, setAnggotaList] = React.useState<AnggotaDTO[]>(initialAnggota)
  const [stats] = React.useState<AnggotaStats>(initialStats)

  // Filters
  const [search, setSearch] = React.useState('')
  const [statusFilter, setStatusFilter] = React.useState('semua')
  const [rtFilter, setRtFilter] = React.useState('semua')
  const [genderFilter, setGenderFilter] = React.useState('semua')

  // Modals
  const [isFormOpen, setIsFormOpen] = React.useState(false)
  const [isDetailOpen, setIsDetailOpen] = React.useState(false)
  const [isDeleteOpen, setIsDeleteOpen] = React.useState(false)

  // Selected for edit/detail/delete
  const [selectedAnggota, setSelectedAnggota] = React.useState<AnggotaDTO | null>(null)
  const [isSubmitting, setIsSubmitting] = React.useState(false)
  const [errorMessage, setErrorMessage] = React.useState<string | null>(null)

  // Form State
  const [formFotoUrl, setFormFotoUrl] = React.useState<string>('')
  const [formGender, setFormGender] = React.useState<string>('L')
  const [formStatus, setFormStatus] = React.useState<string>('Aktif')
  const [formRt, setFormRt] = React.useState<string>('01')

  // Filtered List
  const filteredAnggota = React.useMemo(() => {
    return anggotaList.filter((item) => {
      if (statusFilter !== 'semua' && item.status !== statusFilter) return false
      if (rtFilter !== 'semua' && item.rt !== rtFilter) return false
      if (genderFilter !== 'semua' && item.jenis_kelamin !== genderFilter) return false
      if (search) {
        const q = search.toLowerCase()
        const matchNama = item.nama.toLowerCase().includes(q)
        const matchHp = item.no_hp?.toLowerCase().includes(q)
        const matchJabatan = item.jabatan?.toLowerCase().includes(q)
        const matchMinat = item.minat_bakat?.toLowerCase().includes(q)
        if (!matchNama && !matchHp && !matchJabatan && !matchMinat) return false
      }
      return true
    })
  }, [anggotaList, statusFilter, rtFilter, genderFilter, search])

  const openAddModal = () => {
    setSelectedAnggota(null)
    setFormFotoUrl('')
    setFormGender('L')
    setFormStatus('Aktif')
    setFormRt('01')
    setErrorMessage(null)
    setIsFormOpen(true)
  }

  const openEditModal = (item: AnggotaDTO) => {
    setSelectedAnggota(item)
    setFormFotoUrl(item.foto_url || '')
    setFormGender(item.jenis_kelamin || 'L')
    setFormStatus(item.status || 'Aktif')
    setFormRt(item.rt || '01')
    setErrorMessage(null)
    setIsFormOpen(true)
  }

  const openDetailModal = (item: AnggotaDTO) => {
    setSelectedAnggota(item)
    setIsDetailOpen(true)
  }

  const openDeleteModal = (item: AnggotaDTO) => {
    setSelectedAnggota(item)
    setIsDeleteOpen(true)
  }

  // Handle Form Submit
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsSubmitting(true)
    setErrorMessage(null)

    const form = e.currentTarget
    const formData = new FormData(form)
    formData.set('foto_url', formFotoUrl)
    formData.set('jenis_kelamin', formGender)
    formData.set('status', formStatus)
    formData.set('rt', formRt)

    try {
      let res
      if (selectedAnggota) {
        res = await updateAnggota(selectedAnggota.id, formData)
      } else {
        res = await createAnggota(formData)
      }

      if (res.error) {
        setErrorMessage(res.error)
      } else {
        setIsFormOpen(false)
        window.location.reload()
      }
    } catch {
      setErrorMessage('Terjadi kesalahan jaringan.')
    } finally {
      setIsSubmitting(false)
    }
  }

  // Handle Delete
  const handleDelete = async () => {
    if (!selectedAnggota) return
    setIsSubmitting(true)
    try {
      const res = await deleteAnggota(selectedAnggota.id)
      if (res.error) {
        alert(res.error)
      } else {
        setIsDeleteOpen(false)
        setAnggotaList((prev) => prev.filter((a) => a.id !== selectedAnggota.id))
      }
    } catch {
      alert('Gagal menghapus anggota')
    } finally {
      setIsSubmitting(false)
    }
  }

  // Export to Excel/CSV
  const handleExportCSV = () => {
    const headers = [
      'No',
      'Nama Lengkap',
      'NIK',
      'Jenis Kelamin',
      'Tempat Lahir',
      'Tanggal Lahir',
      'No HP/WA',
      'Email',
      'RT',
      'RW',
      'Dusun',
      'Status',
      'Jabatan',
      'Minat & Bakat',
      'Alamat'
    ]

    const rows = filteredAnggota.map((a, idx) => [
      idx + 1,
      `"${a.nama.replace(/"/g, '""')}"`,
      `"${a.nik || '-'}"`,
      a.jenis_kelamin === 'L' ? 'Laki-laki' : 'Perempuan',
      `"${a.tempat_lahir || '-'}"`,
      a.tanggal_lahir ? a.tanggal_lahir.split('T')[0] : '-',
      `"${a.no_hp || '-'}"`,
      `"${a.email || '-'}"`,
      `"${a.rt}"`,
      `"${a.rw}"`,
      `"${a.dusun}"`,
      `"${a.status}"`,
      `"${a.jabatan || '-'}"`,
      `"${(a.minat_bakat || '-').replace(/"/g, '""')}"`,
      `"${(a.alamat || '-').replace(/"/g, '""')}"`
    ])

    const csvContent = '\uFEFF' + [headers.join(','), ...rows.map((r) => r.join(','))].join('\r\n')
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.setAttribute('download', `data_anggota_kartar_${new Date().toISOString().split('T')[0]}.csv`)
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  return (
    <div className="space-y-6">
      {/* Top Banner / Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-4 rounded-xl border bg-card text-card-foreground shadow-sm flex items-center justify-between">
          <div>
            <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Total Terdata</p>
            <p className="text-2xl font-bold mt-1">{stats.total} Orang</p>
            <p className="text-xs text-muted-foreground mt-0.5">
              {stats.pria} Laki-laki · {stats.wanita} Perempuan
            </p>
          </div>
          <div className="h-11 w-11 rounded-lg bg-blue-500/10 text-blue-600 dark:text-blue-400 flex items-center justify-center">
            <Users className="h-6 w-6" />
          </div>
        </div>

        <div className="p-4 rounded-xl border bg-card text-card-foreground shadow-sm flex items-center justify-between">
          <div>
            <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Anggota Aktif</p>
            <p className="text-2xl font-bold mt-1 text-emerald-600 dark:text-emerald-400">{stats.aktif}</p>
            <p className="text-xs text-muted-foreground mt-0.5">Siap diterjunkan berkegiatan</p>
          </div>
          <div className="h-11 w-11 rounded-lg bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
            <UserCheck className="h-6 w-6" />
          </div>
        </div>

        <div className="p-4 rounded-xl border bg-card text-card-foreground shadow-sm flex items-center justify-between">
          <div>
            <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Struktur Pengurus</p>
            <p className="text-2xl font-bold mt-1 text-primary">{stats.pengurus}</p>
            <p className="text-xs text-muted-foreground mt-0.5">Badan Pengurus Harian & Divisi</p>
          </div>
          <div className="h-11 w-11 rounded-lg bg-primary/10 text-primary flex items-center justify-center">
            <Briefcase className="h-6 w-6" />
          </div>
        </div>

        <div className="p-4 rounded-xl border bg-card text-card-foreground shadow-sm flex items-center justify-between">
          <div>
            <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Alumni / Senior</p>
            <p className="text-2xl font-bold mt-1 text-amber-600 dark:text-amber-400">{stats.alumni}</p>
            <p className="text-xs text-muted-foreground mt-0.5">Penasihat & Kader Pembina</p>
          </div>
          <div className="h-11 w-11 rounded-lg bg-amber-500/10 text-amber-600 dark:text-amber-400 flex items-center justify-center">
            <GraduationCap className="h-6 w-6" />
          </div>
        </div>
      </div>

      {/* Toolbar & Filter Bar */}
      <div className="flex flex-col md:flex-row gap-3 items-stretch md:items-center justify-between bg-card p-4 rounded-xl border shadow-sm">
        <div className="flex flex-1 flex-wrap gap-2 items-center">
          {/* Search */}
          <div className="relative min-w-[220px] max-w-sm flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Cari nama, no HP, minat..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9 h-9"
            />
          </div>

          {/* Filter Status */}
          <Select value={statusFilter} onValueChange={(val) => setStatusFilter(val || 'semua')}>
            <SelectTrigger className="h-9 w-[130px] text-xs">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="semua">Semua Status</SelectItem>
              <SelectItem value="Aktif">Aktif</SelectItem>
              <SelectItem value="Pengurus">Pengurus</SelectItem>
              <SelectItem value="Alumni">Alumni</SelectItem>
              <SelectItem value="Nonaktif">Nonaktif</SelectItem>
            </SelectContent>
          </Select>

          {/* Filter RT */}
          <Select value={rtFilter} onValueChange={(val) => setRtFilter(val || 'semua')}>
            <SelectTrigger className="h-9 w-[120px] text-xs">
              <SelectValue placeholder="Wilayah RT" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="semua">Semua RT</SelectItem>
              <SelectItem value="01">RT 01</SelectItem>
              <SelectItem value="02">RT 02</SelectItem>
              <SelectItem value="03">RT 03</SelectItem>
              <SelectItem value="04">RT 04</SelectItem>
              <SelectItem value="05">RT 05</SelectItem>
            </SelectContent>
          </Select>

          {/* Filter Gender */}
          <Select value={genderFilter} onValueChange={(val) => setGenderFilter(val || 'semua')}>
            <SelectTrigger className="h-9 w-[120px] text-xs">
              <SelectValue placeholder="Gender" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="semua">Semua Gender</SelectItem>
              <SelectItem value="L">Laki-laki</SelectItem>
              <SelectItem value="P">Perempuan</SelectItem>
            </SelectContent>
          </Select>

          {(search || statusFilter !== 'semua' || rtFilter !== 'semua' || genderFilter !== 'semua') && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => {
                setSearch('')
                setStatusFilter('semua')
                setRtFilter('semua')
                setGenderFilter('semua')
              }}
              className="h-9 px-2 text-xs text-muted-foreground"
            >
              Reset
            </Button>
          )}
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={handleExportCSV}
            className="h-9 gap-1.5 text-xs font-medium"
          >
            <Download className="h-3.5 w-3.5" />
            Export Excel (CSV)
          </Button>
          <Button
            size="sm"
            onClick={openAddModal}
            className="h-9 gap-1.5 text-xs font-medium bg-primary text-primary-foreground hover:bg-primary/90"
          >
            <Plus className="h-3.5 w-3.5" />
            Tambah Anggota
          </Button>
        </div>
      </div>

      {/* Main Table Container: Strictly Non-Draggable, Ellipsis text truncation */}
      <div className="rounded-xl border bg-card shadow-sm overflow-hidden">
        <div className="overflow-x-hidden">
          <table className="w-full text-sm text-left table-fixed">
            <thead className="bg-muted/50 text-xs font-semibold uppercase text-muted-foreground border-b">
              <tr>
                <th scope="col" className="py-3 px-4 w-[28%]">
                  Nama & Identitas
                </th>
                <th scope="col" className="py-3 px-3 w-[16%]">
                  Status & Jabatan
                </th>
                <th scope="col" className="py-3 px-3 w-[12%]">
                  Wilayah
                </th>
                <th scope="col" className="py-3 px-3 w-[18%]">
                  Kontak
                </th>
                <th scope="col" className="py-3 px-3 w-[14%]">
                  Minat & Bakat
                </th>
                <th scope="col" className="py-3 px-4 w-[12%] text-right">
                  Aksi
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {filteredAnggota.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-muted-foreground">
                    <Users className="h-10 w-10 mx-auto text-muted-foreground/40 mb-2" />
                    <p className="font-medium text-sm">Tidak ada data anggota yang cocok.</p>
                    <p className="text-xs text-muted-foreground mt-0.5">
                      Coba ganti filter pencarian atau tambahkan data anggota baru.
                    </p>
                  </td>
                </tr>
              ) : (
                filteredAnggota.map((item) => (
                  <tr key={item.id} className="hover:bg-muted/30 transition-colors">
                    {/* Nama & Foto */}
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-3 min-w-0">
                        {item.foto_url ? (
                          <img
                            src={item.foto_url}
                            alt={item.nama}
                            className="h-9 w-9 rounded-full object-cover shrink-0 border"
                          />
                        ) : (
                          <div className="h-9 w-9 rounded-full bg-primary/10 text-primary font-bold flex items-center justify-center shrink-0 text-xs">
                            {item.nama.charAt(0).toUpperCase()}
                          </div>
                        )}
                        <div className="min-w-0 flex-1">
                          <p className="font-semibold text-foreground truncate" title={item.nama}>
                            {item.nama}
                          </p>
                          <p className="text-xs text-muted-foreground truncate">
                            {item.jenis_kelamin === 'L' ? 'Laki-laki' : 'Perempuan'}
                            {item.nik ? ` · NIK: ${item.nik}` : ''}
                          </p>
                        </div>
                      </div>
                    </td>

                    {/* Status & Jabatan */}
                    <td className="py-3 px-3">
                      <div className="min-w-0 space-y-1">
                        <div>
                          <Badge
                            variant={
                              item.status === 'Pengurus'
                                ? 'default'
                                : item.status === 'Aktif'
                                ? 'secondary'
                                : 'outline'
                            }
                            className={`text-[11px] font-medium py-0 px-1.5 ${
                              item.status === 'Aktif'
                                ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20'
                                : item.status === 'Alumni'
                                ? 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20'
                                : ''
                            }`}
                          >
                            {item.status}
                          </Badge>
                        </div>
                        <p className="text-xs text-muted-foreground truncate" title={item.jabatan || '-'}>
                          {item.jabatan || 'Anggota'}
                        </p>
                      </div>
                    </td>

                    {/* Wilayah */}
                    <td className="py-3 px-3">
                      <Badge variant="outline" className="text-xs bg-muted/50 font-normal">
                        RT {item.rt} / RW {item.rw}
                      </Badge>
                      <p className="text-[11px] text-muted-foreground mt-0.5 truncate">{item.dusun}</p>
                    </td>

                    {/* Kontak */}
                    <td className="py-3 px-3">
                      <div className="min-w-0 text-xs space-y-0.5">
                        {item.no_hp ? (
                          <p className="text-foreground flex items-center gap-1.5 truncate" title={item.no_hp}>
                            <Phone className="h-3 w-3 text-muted-foreground shrink-0" />
                            <span className="truncate">{item.no_hp}</span>
                          </p>
                        ) : (
                          <span className="text-muted-foreground italic text-[11px]">Tanpa No HP</span>
                        )}
                        {item.email && (
                          <p className="text-muted-foreground flex items-center gap-1.5 truncate" title={item.email}>
                            <Mail className="h-3 w-3 text-muted-foreground shrink-0" />
                            <span className="truncate">{item.email}</span>
                          </p>
                        )}
                      </div>
                    </td>

                    {/* Minat & Bakat */}
                    <td className="py-3 px-3">
                      <p className="text-xs text-muted-foreground truncate" title={item.minat_bakat || '-'}>
                        {item.minat_bakat || '-'}
                      </p>
                    </td>

                    {/* Action Buttons */}
                    <td className="py-3 px-4 text-right">
                      <div className="flex items-center justify-end gap-1">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => openDetailModal(item)}
                          title="Lihat Profil"
                          className="h-8 w-8 text-muted-foreground hover:text-foreground"
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => openEditModal(item)}
                          title="Edit Anggota"
                          className="h-8 w-8 text-muted-foreground hover:text-primary"
                        >
                          <Edit2 className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => openDeleteModal(item)}
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

      {/* DETAIL MODAL: Profil Anggota */}
      <Dialog open={isDetailOpen} onOpenChange={setIsDetailOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Profil Anggota</DialogTitle>
            <DialogDescription>Rincian lengkap data anggota pemuda Karang Taruna.</DialogDescription>
          </DialogHeader>

          {selectedAnggota && (
            <div className="space-y-4 py-2">
              <div className="flex items-center gap-4 p-4 rounded-xl bg-muted/40 border">
                {selectedAnggota.foto_url ? (
                  <img
                    src={selectedAnggota.foto_url}
                    alt={selectedAnggota.nama}
                    className="h-16 w-16 rounded-full object-cover border-2 border-primary/20"
                  />
                ) : (
                  <div className="h-16 w-16 rounded-full bg-primary/10 text-primary font-bold text-xl flex items-center justify-center">
                    {selectedAnggota.nama.charAt(0).toUpperCase()}
                  </div>
                )}
                <div>
                  <h4 className="font-bold text-base text-foreground">{selectedAnggota.nama}</h4>
                  <div className="flex items-center gap-2 mt-1">
                    <Badge variant="default" className="text-xs">
                      {selectedAnggota.status}
                    </Badge>
                    <span className="text-xs text-muted-foreground">{selectedAnggota.jabatan || 'Anggota'}</span>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3 text-xs">
                <div className="p-3 rounded-lg border bg-card">
                  <span className="text-muted-foreground block mb-0.5">Jenis Kelamin</span>
                  <span className="font-semibold text-foreground">
                    {selectedAnggota.jenis_kelamin === 'L' ? 'Laki-laki' : 'Perempuan'}
                  </span>
                </div>
                <div className="p-3 rounded-lg border bg-card">
                  <span className="text-muted-foreground block mb-0.5">NIK KTP</span>
                  <span className="font-semibold text-foreground">{selectedAnggota.nik || '-'}</span>
                </div>
                <div className="p-3 rounded-lg border bg-card">
                  <span className="text-muted-foreground block mb-0.5">Wilayah Domisili</span>
                  <span className="font-semibold text-foreground">
                    RT {selectedAnggota.rt} / RW {selectedAnggota.rw}, {selectedAnggota.dusun}
                  </span>
                </div>
                <div className="p-3 rounded-lg border bg-card">
                  <span className="text-muted-foreground block mb-0.5">No WhatsApp / HP</span>
                  <span className="font-semibold text-foreground">{selectedAnggota.no_hp || '-'}</span>
                </div>
                <div className="p-3 rounded-lg border bg-card col-span-2">
                  <span className="text-muted-foreground block mb-0.5">Tempat & Tanggal Lahir</span>
                  <span className="font-semibold text-foreground">
                    {selectedAnggota.tempat_lahir || '-'}{' '}
                    {selectedAnggota.tanggal_lahir ? `, ${selectedAnggota.tanggal_lahir.split('T')[0]}` : ''}
                  </span>
                </div>
                <div className="p-3 rounded-lg border bg-card col-span-2">
                  <span className="text-muted-foreground block mb-0.5">Alamat Lengkap</span>
                  <span className="font-semibold text-foreground">{selectedAnggota.alamat || '-'}</span>
                </div>
                <div className="p-3 rounded-lg border bg-card col-span-2">
                  <span className="text-muted-foreground block mb-0.5">Minat & Keahlian Khusus</span>
                  <span className="font-semibold text-foreground">{selectedAnggota.minat_bakat || '-'}</span>
                </div>
              </div>
            </div>
          )}

          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDetailOpen(false)}>
              Tutup
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* FORM MODAL: Tambah / Edit Anggota */}
      <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
        <DialogContent className="sm:max-w-[620px] max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{selectedAnggota ? 'Edit Data Anggota' : 'Tambah Anggota Baru'}</DialogTitle>
            <DialogDescription>
              Lengkapi formulir di bawah ini untuk mendata pemuda/anggota organisasi.
            </DialogDescription>
          </DialogHeader>

          {errorMessage && (
            <div className="p-3 rounded-md bg-destructive/10 text-destructive text-sm font-medium">
              {errorMessage}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4 py-2">
            {/* Foto Profil */}
            <div>
              <Label className="text-xs font-semibold mb-1.5 block">Foto Profil (Opsional)</Label>
              <ImageUploader
                defaultImage={formFotoUrl}
                onUploadSuccess={(url) => setFormFotoUrl(url)}
                bucket="kegiatan"
                folder="anggota"
              />
            </div>

            {/* Nama & NIK */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <Label htmlFor="nama" className="text-xs font-semibold">
                  Nama Lengkap *
                </Label>
                <Input
                  id="nama"
                  name="nama"
                  required
                  defaultValue={selectedAnggota?.nama || ''}
                  placeholder="Misal: Ahmad Fauzi"
                  className="mt-1 h-9 text-xs"
                />
              </div>
              <div>
                <Label htmlFor="nik" className="text-xs font-semibold">
                  NIK KTP (Opsional)
                </Label>
                <Input
                  id="nik"
                  name="nik"
                  defaultValue={selectedAnggota?.nik || ''}
                  placeholder="3209..."
                  className="mt-1 h-9 text-xs"
                />
              </div>
            </div>

            {/* Gender & TTL */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <Label className="text-xs font-semibold">Jenis Kelamin</Label>
                <Select value={formGender} onValueChange={(val) => setFormGender(val || 'L')}>
                  <SelectTrigger className="mt-1 h-9 text-xs">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="L">Laki-laki</SelectItem>
                    <SelectItem value="P">Perempuan</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="tempat_lahir" className="text-xs font-semibold">
                  Tempat Lahir
                </Label>
                <Input
                  id="tempat_lahir"
                  name="tempat_lahir"
                  defaultValue={selectedAnggota?.tempat_lahir || ''}
                  placeholder="Cirebon"
                  className="mt-1 h-9 text-xs"
                />
              </div>
              <div>
                <Label htmlFor="tanggal_lahir" className="text-xs font-semibold">
                  Tanggal Lahir
                </Label>
                <Input
                  id="tanggal_lahir"
                  name="tanggal_lahir"
                  type="date"
                  defaultValue={
                    selectedAnggota?.tanggal_lahir
                      ? selectedAnggota.tanggal_lahir.split('T')[0]
                      : ''
                  }
                  className="mt-1 h-9 text-xs"
                />
              </div>
            </div>

            {/* Kontak: HP & Email */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <Label htmlFor="no_hp" className="text-xs font-semibold">
                  Nomor HP / WhatsApp
                </Label>
                <Input
                  id="no_hp"
                  name="no_hp"
                  defaultValue={selectedAnggota?.no_hp || ''}
                  placeholder="081234567890"
                  className="mt-1 h-9 text-xs"
                />
              </div>
              <div>
                <Label htmlFor="email" className="text-xs font-semibold">
                  Email (Opsional)
                </Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  defaultValue={selectedAnggota?.email || ''}
                  placeholder="email@gmail.com"
                  className="mt-1 h-9 text-xs"
                />
              </div>
            </div>

            {/* Wilayah RT, RW, Dusun */}
            <div className="grid grid-cols-3 gap-3">
              <div>
                <Label className="text-xs font-semibold">Wilayah RT</Label>
                <Select value={formRt} onValueChange={(val) => setFormRt(val || '01')}>
                  <SelectTrigger className="mt-1 h-9 text-xs">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="01">RT 01</SelectItem>
                    <SelectItem value="02">RT 02</SelectItem>
                    <SelectItem value="03">RT 03</SelectItem>
                    <SelectItem value="04">RT 04</SelectItem>
                    <SelectItem value="05">RT 05</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="rw" className="text-xs font-semibold">
                  RW
                </Label>
                <Input
                  id="rw"
                  name="rw"
                  defaultValue={selectedAnggota?.rw || '01'}
                  placeholder="01"
                  className="mt-1 h-9 text-xs"
                />
              </div>
              <div>
                <Label htmlFor="dusun" className="text-xs font-semibold">
                  Dusun
                </Label>
                <Input
                  id="dusun"
                  name="dusun"
                  defaultValue={selectedAnggota?.dusun || 'Sumurgintung'}
                  className="mt-1 h-9 text-xs"
                />
              </div>
            </div>

            {/* Status & Jabatan */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <Label className="text-xs font-semibold">Status Anggota</Label>
                <Select value={formStatus} onValueChange={(val) => setFormStatus(val || 'Aktif')}>
                  <SelectTrigger className="mt-1 h-9 text-xs">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Aktif">Aktif</SelectItem>
                    <SelectItem value="Pengurus">Pengurus</SelectItem>
                    <SelectItem value="Alumni">Alumni</SelectItem>
                    <SelectItem value="Nonaktif">Nonaktif</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="jabatan" className="text-xs font-semibold">
                  Jabatan / Posisi
                </Label>
                <Input
                  id="jabatan"
                  name="jabatan"
                  defaultValue={selectedAnggota?.jabatan || 'Anggota'}
                  placeholder="Anggota / Koordinator..."
                  className="mt-1 h-9 text-xs"
                />
              </div>
            </div>

            {/* Minat & Bakat */}
            <div>
              <Label htmlFor="minat_bakat" className="text-xs font-semibold">
                Minat & Bakat (Opsional)
              </Label>
              <Input
                id="minat_bakat"
                name="minat_bakat"
                defaultValue={selectedAnggota?.minat_bakat || ''}
                placeholder="Misal: Olahraga (Voli), Desain Grafis, Musik, dll."
                className="mt-1 h-9 text-xs"
              />
            </div>

            {/* Alamat Lengkap */}
            <div>
              <Label htmlFor="alamat" className="text-xs font-semibold">
                Alamat Lengkap (Opsional)
              </Label>
              <Input
                id="alamat"
                name="alamat"
                defaultValue={selectedAnggota?.alamat || ''}
                placeholder="Gang / Blok / Nomor Rumah"
                className="mt-1 h-9 text-xs"
              />
            </div>

            <DialogFooter className="pt-2">
              <Button type="button" variant="outline" onClick={() => setIsFormOpen(false)}>
                Batal
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? 'Menyimpan...' : selectedAnggota ? 'Simpan Perubahan' : 'Tambah Anggota'}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* DELETE MODAL */}
      <Dialog open={isDeleteOpen} onOpenChange={setIsDeleteOpen}>
        <DialogContent className="sm:max-w-[400px]">
          <DialogHeader>
            <DialogTitle>Hapus Anggota?</DialogTitle>
            <DialogDescription>
              Apakah Anda yakin ingin menghapus data anggota <strong>{selectedAnggota?.nama}</strong>? Tindakan
              ini tidak dapat dibatalkan.
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
