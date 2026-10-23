'use client'

import * as React from 'react'
import {
  MessageSquare,
  Send,
  CheckCircle2,
  Clock,
  Sparkles,
  HelpCircle,
  AlertCircle,
  ThumbsUp,
  Search,
  MessageCircle,
  User,
  ShieldCheck,
  Building2,
  Calendar,
  Lock
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select'
import { AspirasiDTO, submitAspirasi } from '@/app/actions/aspirasi'

interface AspirasiClientProps {
  initialAspirasi: AspirasiDTO[]
}

const CATEGORIES = [
  { id: 'semua', label: 'Semua Kategori', icon: MessageSquare },
  { id: 'aspirasi', label: 'Aspirasi / Ide', icon: Sparkles, color: 'text-blue-500 bg-blue-500/10 border-blue-500/20' },
  { id: 'saran', label: 'Saran Perbaikan', icon: HelpCircle, color: 'text-amber-500 bg-amber-500/10 border-amber-500/20' },
  { id: 'pengaduan', label: 'Pengaduan', icon: AlertCircle, color: 'text-rose-500 bg-rose-500/10 border-rose-500/20' },
  { id: 'apresiasi', label: 'Apresiasi & Dukungan', icon: ThumbsUp, color: 'text-emerald-500 bg-emerald-500/10 border-emerald-500/20' },
  { id: 'pertanyaan', label: 'Pertanyaan', icon: MessageCircle, color: 'text-purple-500 bg-purple-500/10 border-purple-500/20' }
]

export default function AspirasiClient({ initialAspirasi }: AspirasiClientProps) {
  const [items] = React.useState<AspirasiDTO[]>(initialAspirasi)
  const [selectedCategory, setSelectedCategory] = React.useState('semua')
  const [search, setSearch] = React.useState('')

  // Form State
  const [nama, setNama] = React.useState('')
  const [kontak, setKontak] = React.useState('')
  const [kategori, setKategori] = React.useState('aspirasi')
  const [pesan, setPesan] = React.useState('')
  const [isAnonim, setIsAnonim] = React.useState(false)
  const [isSubmitting, setIsSubmitting] = React.useState(false)
  const [submitSuccess, setSubmitSuccess] = React.useState(false)
  const [submitError, setSubmitError] = React.useState<string | null>(null)

  // Filtered public messages
  const filteredItems = React.useMemo(() => {
    return items.filter((item) => {
      if (selectedCategory !== 'semua' && item.kategori !== selectedCategory) return false
      if (search) {
        const q = search.toLowerCase()
        const matchPesan = item.pesan.toLowerCase().includes(q)
        const matchNama = item.nama.toLowerCase().includes(q)
        const matchTanggapan = item.tanggapan?.toLowerCase().includes(q)
        if (!matchPesan && !matchNama && !matchTanggapan) return false
      }
      return true
    })
  }, [items, selectedCategory, search])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setSubmitError(null)

    const formData = new FormData()
    formData.set('nama', isAnonim ? 'Anonim (Warga)' : nama)
    formData.set('kontak', kontak)
    formData.set('kategori', kategori)
    formData.set('pesan', pesan)
    formData.set('is_anonim', isAnonim ? 'true' : 'false')

    try {
      const res = await submitAspirasi(formData)
      if (res.error) {
        setSubmitError(res.error)
      } else {
        setSubmitSuccess(true)
        setNama('')
        setKontak('')
        setPesan('')
        setIsAnonim(false)
      }
    } catch {
      setSubmitError('Terjadi gangguan jaringan, coba beberapa saat lagi.')
    } finally {
      setIsSubmitting(false)
    }
  }

  const getCategoryMeta = (cat: string) => {
    return CATEGORIES.find((c) => c.id === cat) || CATEGORIES[1]
  }

  return (
    <div className="space-y-12">
      {/* 1. Header & Submission Form */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Context & Stats */}
        <div className="lg:col-span-5 space-y-6">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-primary/10 text-primary border border-primary/20">
            <MessageSquare className="h-3.5 w-3.5" />
            Suara Warga Dusun
          </div>
          <h2 className="text-3xl font-bold tracking-tight text-foreground font-heading">
            Kotak Aspirasi & Buku Tamu
          </h2>
          <p className="text-muted-foreground text-sm leading-relaxed">
            Sampaikan gagasan, masukan, pengaduan lingkungan, atau apresiasi Anda untuk kemajuan bersama Dusun Sumurgintung. Setiap pesan akan ditinjau dan ditindaklanjuti secara terbuka oleh pengurus Karang Taruna.
          </p>

          <div className="grid grid-cols-2 gap-3 pt-2">
            <div className="p-3.5 sm:p-4 rounded-xl border bg-card/60 backdrop-blur-sm flex flex-col justify-between">
              <span className="text-[11px] sm:text-xs text-muted-foreground block truncate">Pesan Dipublikasikan</span>
              <div className="flex items-baseline gap-1.5 my-1">
                <span className="text-2xl sm:text-3xl font-extrabold text-foreground font-heading">
                  {items.length}
                </span>
                <span className="text-xs font-semibold text-muted-foreground">Masukan</span>
              </div>
              <span className="text-[11px] text-emerald-600 dark:text-emerald-400 font-medium block truncate">
                Telah lolos moderasi
              </span>
            </div>

            <div className="p-3.5 sm:p-4 rounded-xl border bg-card/60 backdrop-blur-sm flex flex-col justify-between">
              <span className="text-[11px] sm:text-xs text-muted-foreground block truncate">Tanggapan Resmi</span>
              <div className="flex items-baseline gap-1.5 my-1">
                <span className="text-2xl sm:text-3xl font-extrabold text-primary font-heading">
                  {items.filter((i) => i.tanggapan).length}
                </span>
                <span className="text-xs font-semibold text-primary">Ditanggapi</span>
              </div>
              <span className="text-[11px] text-muted-foreground block truncate">
                Oleh Pengurus Harian
              </span>
            </div>
          </div>

          <div className="p-4 rounded-xl border bg-muted/40 text-xs text-muted-foreground space-y-2">
            <div className="flex items-center gap-2 text-foreground font-medium">
              <ShieldCheck className="h-4 w-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
              Kebijakan Moderasi & Privasi
            </div>
            <p className="leading-relaxed">
              Anda dapat mengirim masukan secara <strong>Anonim</strong> jika tidak ingin nama Anda dipublikasikan. Kontak yang Anda masukkan bersifat privat dan hanya digunakan pengurus untuk klarifikasi lanjutan.
            </p>
          </div>
        </div>

        {/* Right Column: Form Card */}
        <div className="lg:col-span-7">
          <div className="rounded-2xl border bg-card text-card-foreground p-6 sm:p-8 shadow-sm">
            <h3 className="text-lg font-bold font-heading mb-1 text-foreground flex items-center gap-2">
              <Send className="h-4 w-4 text-primary" />
              Tulis Pesan / Masukan Anda
            </h3>
            <p className="text-xs text-muted-foreground mb-6">
              Isi formulir di bawah ini dengan santun dan bertanggung jawab.
            </p>

            {submitSuccess ? (
              <div className="p-6 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-center space-y-3">
                <CheckCircle2 className="h-12 w-12 text-emerald-600 dark:text-emerald-400 mx-auto" />
                <h4 className="font-bold text-base text-foreground">Terima Kasih! Aspirasi Anda Diterima</h4>
                <p className="text-xs text-muted-foreground max-w-md mx-auto leading-relaxed">
                  Pesan Anda telah berhasil masuk ke sistem kami dan sedang menunggu verifikasi oleh pengurus sebelum ditampilkan di ruang publik.
                </p>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => setSubmitSuccess(false)}
                  className="mt-2 text-xs"
                >
                  Kirim Pesan Lainnya
                </Button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                {submitError && (
                  <div className="p-3 rounded-lg bg-destructive/10 text-destructive text-xs font-medium">
                    {submitError}
                  </div>
                )}

                {/* Anonim Toggle */}
                <div className="flex items-center justify-between p-3 rounded-lg bg-muted/40 border">
                  <div className="flex items-center gap-2">
                    <Lock className="h-4 w-4 text-muted-foreground" />
                    <div>
                      <p className="text-xs font-semibold text-foreground">Kirim sebagai Anonim</p>
                      <p className="text-[11px] text-muted-foreground">Nama Anda akan disamarkan sebagai &ldquo;Anonim (Warga)&rdquo;</p>
                    </div>
                  </div>
                  <input
                    type="checkbox"
                    id="anonim_check"
                    checked={isAnonim}
                    onChange={(e) => setIsAnonim(e.target.checked)}
                    className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary cursor-pointer"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Nama */}
                  <div>
                    <Label htmlFor="nama_input" className="text-xs font-semibold">
                      Nama Anda {isAnonim ? '(Disamarkan)' : '*'}
                    </Label>
                    <Input
                      id="nama_input"
                      value={isAnonim ? 'Anonim' : nama}
                      onChange={(e) => setNama(e.target.value)}
                      disabled={isAnonim}
                      required={!isAnonim}
                      placeholder="Misal: Bapak Dadang (RT 02)"
                      className="mt-1 h-9 text-xs"
                    />
                  </div>

                  {/* Kategori */}
                  <div>
                    <Label className="text-xs font-semibold">Kategori Masukan *</Label>
                    <Select value={kategori} onValueChange={(val) => setKategori(val || 'aspirasi')}>
                      <SelectTrigger className="mt-1 h-9 text-xs">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="aspirasi">💡 Aspirasi / Usulan Ide</SelectItem>
                        <SelectItem value="saran">🤝 Saran Perbaikan</SelectItem>
                        <SelectItem value="pengaduan">⚠️ Pengaduan Lingkungan</SelectItem>
                        <SelectItem value="apresiasi">👏 Apresiasi & Dukungan</SelectItem>
                        <SelectItem value="pertanyaan">❓ Pertanyaan</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                {/* Kontak */}
                <div>
                  <Label htmlFor="kontak_input" className="text-xs font-semibold">
                    Kontak WhatsApp / No HP (Opsional)
                  </Label>
                  <Input
                    id="kontak_input"
                    value={kontak}
                    onChange={(e) => setKontak(e.target.value)}
                    disabled={isAnonim}
                    placeholder="08123456789 (Hanya untuk keperluan tindak lanjut pengurus, tidak ditampilkan ke publik)"
                    className="mt-1 h-9 text-xs"
                  />
                </div>

                {/* Isi Pesan */}
                <div>
                  <div className="flex justify-between items-center">
                    <Label htmlFor="pesan_input" className="text-xs font-semibold">
                      Isi Aspirasi / Pesan *
                    </Label>
                    <span className="text-[11px] text-muted-foreground">{pesan.length} karakter</span>
                  </div>
                  <Textarea
                    id="pesan_input"
                    value={pesan}
                    onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setPesan(e.target.value)}
                    required
                    rows={4}
                    placeholder="Tuliskan aspirasi, masukan, atau pertanyaan Anda dengan jelas..."
                    className="mt-1 text-xs resize-none"
                  />
                </div>

                <Button
                  type="submit"
                  disabled={isSubmitting || !pesan.trim()}
                  className="w-full h-10 text-xs font-semibold gap-2 bg-primary text-primary-foreground hover:bg-primary/90"
                >
                  <Send className="h-3.5 w-3.5" />
                  {isSubmitting ? 'Mengirim Masukan...' : 'Kirim Aspirasi Sekarang'}
                </Button>
              </form>
            )}
          </div>
        </div>
      </div>

      {/* 2. Public Approved Messages Stream */}
      <div className="pt-8 border-t space-y-6">
        <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
          <div>
            <h3 className="text-xl font-bold font-heading text-foreground">
              Aspirasi & Suara Warga Terverifikasi
            </h3>
            <p className="text-xs text-muted-foreground mt-0.5">
              Daftar masukan yang telah disetujui dan ditanggapi oleh pengurus Karang Taruna.
            </p>
          </div>

          {/* Search */}
          <div className="relative w-full sm:w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Cari aspirasi..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9 h-9 text-xs"
            />
          </div>
        </div>

        {/* Category Pills */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
          {CATEGORIES.map((cat) => {
            const Icon = cat.icon
            const isSelected = selectedCategory === cat.id
            return (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-colors border ${
                  isSelected
                    ? 'bg-primary text-primary-foreground border-primary shadow-sm'
                    : 'bg-card text-muted-foreground hover:bg-muted border-border'
                }`}
              >
                <Icon className="h-3.5 w-3.5" />
                {cat.label}
              </button>
            )
          })}
        </div>

        {/* Messages Grid */}
        {filteredItems.length === 0 ? (
          <div className="text-center py-12 border rounded-xl bg-card">
            <MessageSquare className="h-10 w-10 text-muted-foreground/30 mx-auto mb-2" />
            <p className="text-sm font-semibold text-foreground">Belum ada aspirasi di kategori ini.</p>
            <p className="text-xs text-muted-foreground mt-0.5">
              Jadilah warga pertama yang menyampaikan masukan melalui formulir di atas!
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredItems.map((item) => {
              const catMeta = getCategoryMeta(item.kategori)
              const CatIcon = catMeta.icon

              return (
                <div
                  key={item.id}
                  className="rounded-xl border bg-card p-5 shadow-sm space-y-4 hover:border-primary/40 transition-colors flex flex-col justify-between overflow-hidden"
                >
                  <div className="space-y-3">
                    {/* Header Card */}
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-center gap-2.5 min-w-0">
                        <div className="h-8 w-8 rounded-full bg-primary/10 text-primary font-bold text-xs flex items-center justify-center shrink-0">
                          {item.is_anonim ? <User className="h-4 w-4" /> : item.nama.charAt(0).toUpperCase()}
                        </div>
                        <div className="min-w-0">
                          <p className="text-xs font-semibold text-foreground truncate">
                            {item.is_anonim ? 'Warga Dusun (Anonim)' : item.nama}
                          </p>
                          <p className="text-[11px] text-muted-foreground flex items-center gap-1">
                            <Calendar className="h-3 w-3" />
                            {item.created_at ? item.created_at.split('T')[0] : 'Baru saja'}
                          </p>
                        </div>
                      </div>

                      <Badge variant="outline" className={`text-[11px] font-medium shrink-0 ${catMeta.color}`}>
                        <CatIcon className="h-3 w-3 mr-1" />
                        {catMeta.label}
                      </Badge>
                    </div>

                    {/* Message Body */}
                    <p className="text-xs text-foreground/90 leading-relaxed italic bg-muted/30 p-3 rounded-lg border-l-2 border-primary/50 break-words [overflow-wrap:anywhere]">
                      &ldquo;{item.pesan}&rdquo;
                    </p>
                  </div>

                  {/* Pengurus Response */}
                  {item.tanggapan ? (
                    <div className="pt-3 border-t space-y-1.5 bg-primary/5 -mx-5 -mb-5 p-4 rounded-b-xl border-t border-primary/10">
                      <div className="flex items-center gap-1.5 text-xs font-semibold text-primary">
                        <Building2 className="h-3.5 w-3.5 shrink-0" />
                        <span>Tanggapan Resmi Karang Taruna</span>
                      </div>
                      <p className="text-xs text-muted-foreground leading-relaxed break-words [overflow-wrap:anywhere]">
                        {item.tanggapan}
                      </p>
                    </div>
                  ) : (
                    <div className="pt-2 text-[11px] text-muted-foreground flex items-center gap-1 italic">
                      <Clock className="h-3 w-3" />
                      Sedang dalam peninjauan tindak lanjut pengurus
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}
