'use client'

import React, { useState, useMemo } from 'react'
import {
  Calendar as CalendarIcon,
  Clock,
  MapPin,
  ChevronLeft,
  ChevronRight,
  Search,
  Filter,
  CheckCircle2,
  CalendarPlus,
  Layers,
  Sparkles,
  Info
} from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { format, isSameDay, isSameMonth, isToday, addMonths, subMonths, startOfMonth, endOfMonth, startOfWeek, endOfWeek, eachDayOfInterval } from 'date-fns'
import { id as localeID } from 'date-fns/locale/id'

export interface AgendaItem {
  id: string
  judul: string
  deskripsi: string | null
  tanggal_mulai: string
  tanggal_selesai: string | null
  lokasi: string | null
  status: string
  kategori: string | null
}

interface AgendaCalendarClientProps {
  initialData: AgendaItem[]
}

function getGoogleCalendarUrl(item: AgendaItem) {
  const startDate = new Date(item.tanggal_mulai)
  const endDate = item.tanggal_selesai
    ? new Date(item.tanggal_selesai)
    : new Date(startDate.getTime() + 2 * 60 * 60 * 1000)

  const formatUtc = (date: Date) =>
    date.toISOString().replace(/-|:|\.\d+/g, '')

  const params = new URLSearchParams({
    action: 'TEMPLATE',
    text: item.judul,
    dates: `${formatUtc(startDate)}/${formatUtc(endDate)}`,
    details: item.deskripsi || 'Agenda resmi Karang Taruna Tirtajaya 01',
    location: item.lokasi || 'Dusun Sumurgintung, Pagaden Barat'
  })

  return `https://calendar.google.com/calendar/render?${params.toString()}`
}

const KATEGORI_COLORS: Record<string, { bg: string; text: string; border: string; dot: string }> = {
  rapat: { bg: 'bg-blue-500/10', text: 'text-blue-600 dark:text-blue-400', border: 'border-blue-500/20', dot: 'bg-blue-500' },
  sosial: { bg: 'bg-emerald-500/10', text: 'text-emerald-600 dark:text-emerald-400', border: 'border-emerald-500/20', dot: 'bg-emerald-500' },
  kerja_bakti: { bg: 'bg-emerald-500/10', text: 'text-emerald-600 dark:text-emerald-400', border: 'border-emerald-500/20', dot: 'bg-emerald-500' },
  olahraga: { bg: 'bg-amber-500/10', text: 'text-amber-600 dark:text-amber-400', border: 'border-amber-500/20', dot: 'bg-amber-500' },
  peringatan: { bg: 'bg-purple-500/10', text: 'text-purple-600 dark:text-purple-400', border: 'border-purple-500/20', dot: 'bg-purple-500' },
  default: { bg: 'bg-primary/10', text: 'text-primary', border: 'border-primary/20', dot: 'bg-primary' }
}

export default function AgendaCalendarClient({ initialData }: AgendaCalendarClientProps) {
  const [currentMonth, setCurrentMonth] = useState<Date>(new Date())
  const [selectedDate, setSelectedDate] = useState<Date>(new Date())
  const [viewMode, setViewMode] = useState<'calendar' | 'timeline'>('calendar')
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState<string>('semua')
  const [selectedStatus, setSelectedStatus] = useState<string>('semua')

  // Available categories
  const categories = useMemo(() => {
    const set = new Set<string>()
    initialData.forEach((item) => {
      if (item.kategori) set.add(item.kategori.toLowerCase())
    })
    return ['semua', ...Array.from(set)]
  }, [initialData])

  // Filtered items
  const filteredData = useMemo(() => {
    return initialData.filter((item) => {
      const matchSearch =
        searchQuery === '' ||
        item.judul.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (item.deskripsi && item.deskripsi.toLowerCase().includes(searchQuery.toLowerCase())) ||
        (item.lokasi && item.lokasi.toLowerCase().includes(searchQuery.toLowerCase()))

      const matchCategory =
        selectedCategory === 'semua' ||
        (item.kategori && item.kategori.toLowerCase() === selectedCategory.toLowerCase())

      const matchStatus =
        selectedStatus === 'semua' || item.status === selectedStatus

      return matchSearch && matchCategory && matchStatus
    })
  }, [initialData, searchQuery, selectedCategory, selectedStatus])

  // Calendar days calculation
  const calendarDays = useMemo(() => {
    const monthStart = startOfMonth(currentMonth)
    const monthEnd = endOfMonth(monthStart)
    const startDate = startOfWeek(monthStart, { weekStartsOn: 1 }) // Senin
    const endDate = endOfWeek(monthEnd, { weekStartsOn: 1 }) // Minggu

    return eachDayOfInterval({ start: startDate, end: endDate })
  }, [currentMonth])

  // Group agenda by date
  const eventsByDate = useMemo(() => {
    const map = new Map<string, AgendaItem[]>()
    filteredData.forEach((item) => {
      const key = format(new Date(item.tanggal_mulai), 'yyyy-MM-dd')
      const existing = map.get(key) || []
      map.set(key, [...existing, item])
    })
    return map
  }, [filteredData])

  // Events on selected day
  const selectedDateEvents = useMemo(() => {
    const key = format(selectedDate, 'yyyy-MM-dd')
    return eventsByDate.get(key) || []
  }, [selectedDate, eventsByDate])

  // Upcoming vs Past for Timeline View
  const now = new Date()
  const upcomingEvents = filteredData.filter(
    (item) => new Date(item.tanggal_mulai) >= now || item.status === 'akan_datang' || item.status === 'sedang_berlangsung'
  )
  const pastEvents = filteredData.filter(
    (item) => new Date(item.tanggal_mulai) < now && item.status !== 'akan_datang' && item.status !== 'sedang_berlangsung'
  )

  const nextMonth = () => setCurrentMonth(addMonths(currentMonth, 1))
  const prevMonth = () => setCurrentMonth(subMonths(currentMonth, 1))
  const goToToday = () => {
    const today = new Date()
    setCurrentMonth(today)
    setSelectedDate(today)
  }

  const weekDayNames = ['Sen', 'Sel', 'Rab', 'Kam', 'Jum', 'Sab', 'Min']

  return (
    <div className="space-y-8">
      {/* 1. Header Toolbar: Search, Filters, and View Switch */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-card p-4 sm:p-5 rounded-2xl border border-border shadow-xs">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            type="text"
            placeholder="Cari agenda, rapat, gotong royong, lokasi..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 h-10 rounded-xl bg-background text-sm"
          />
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {/* Category Filter */}
          <div className="flex items-center gap-1.5 bg-background p-1 rounded-xl border border-border">
            <Filter className="w-3.5 h-3.5 ml-2 text-muted-foreground shrink-0" />
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="bg-transparent text-xs font-medium focus:outline-none pr-3 py-1 text-foreground cursor-pointer"
            >
              <option value="semua">Semua Kategori</option>
              {categories.filter((c) => c !== 'semua').map((c) => (
                <option key={c} value={c}>
                  {c.replace('_', ' ').toUpperCase()}
                </option>
              ))}
            </select>
          </div>

          {/* Status Filter */}
          <div className="flex items-center gap-1.5 bg-background p-1 rounded-xl border border-border">
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="bg-transparent text-xs font-medium focus:outline-none px-3 py-1 text-foreground cursor-pointer"
            >
              <option value="semua">Semua Status</option>
              <option value="akan_datang">Akan Datang</option>
              <option value="sedang_berlangsung">Sedang Berlangsung</option>
              <option value="selesai">Selesai</option>
            </select>
          </div>

          {/* View Mode Toggle */}
          <div className="flex items-center bg-muted/60 p-1 rounded-xl border border-border">
            <button
              type="button"
              onClick={() => setViewMode('calendar')}
              className={`flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-medium transition-all cursor-pointer ${
                viewMode === 'calendar'
                  ? 'bg-card text-foreground shadow-xs font-semibold'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              <CalendarIcon className="w-3.5 h-3.5" />
              Kalender
            </button>
            <button
              type="button"
              onClick={() => setViewMode('timeline')}
              className={`flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-medium transition-all cursor-pointer ${
                viewMode === 'timeline'
                  ? 'bg-card text-foreground shadow-xs font-semibold'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              <Layers className="w-3.5 h-3.5" />
              Daftar Waktu
            </button>
          </div>
        </div>
      </div>

      {/* 2. Interactive Monthly Calendar View */}
      {viewMode === 'calendar' ? (
        <div className="grid gap-6 lg:grid-cols-12">
          {/* Left/Main: Calendar Month Grid (8 Cols) */}
          <div className="lg:col-span-8 bg-card rounded-2xl border border-border p-4 sm:p-6 shadow-xs">
            {/* Month Header Nav */}
            <div className="flex items-center justify-between pb-4 border-b border-border/70">
              <div className="flex items-center gap-2">
                <h2 className="text-xl sm:text-2xl font-bold font-heading text-foreground capitalize">
                  {format(currentMonth, 'MMMM yyyy', { locale: localeID })}
                </h2>
                <Badge variant="outline" className="text-xs px-2 py-0 font-normal text-muted-foreground">
                  {filteredData.length} Kegiatan
                </Badge>
              </div>

              <div className="flex items-center gap-1">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={goToToday}
                  className="rounded-lg text-xs h-8 px-2.5 border-border hover:bg-muted"
                >
                  Hari Ini
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={prevMonth}
                  className="w-8 h-8 rounded-lg"
                  title="Bulan sebelumnya"
                >
                  <ChevronLeft className="w-4 h-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={nextMonth}
                  className="w-8 h-8 rounded-lg"
                  title="Bulan berikutnya"
                >
                  <ChevronRight className="w-4 h-4" />
                </Button>
              </div>
            </div>

            {/* Days of Week Header */}
            <div className="grid grid-cols-7 gap-1 sm:gap-2 pt-4 pb-2 text-center text-xs font-semibold text-muted-foreground">
              {weekDayNames.map((d, i) => (
                <div key={i} className="py-1">
                  {d}
                </div>
              ))}
            </div>

            {/* Calendar Days Matrix */}
            <div className="grid grid-cols-7 gap-1 sm:gap-2">
              {calendarDays.map((day, idx) => {
                const dateKey = format(day, 'yyyy-MM-dd')
                const dayEvents = eventsByDate.get(dateKey) || []
                const isCurrentMonth = isSameMonth(day, currentMonth)
                const isSelected = isSameDay(day, selectedDate)
                const isTodayDate = isToday(day)

                return (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => setSelectedDate(day)}
                    className={`relative min-h-[72px] sm:min-h-[92px] p-1.5 sm:p-2 rounded-xl text-left transition-all border flex flex-col justify-between cursor-pointer ${
                      isSelected
                        ? 'border-primary ring-2 ring-primary/20 bg-primary/5 font-bold shadow-xs'
                        : isTodayDate
                        ? 'border-primary/50 bg-accent/40 font-semibold'
                        : 'border-border/40 hover:border-border hover:bg-muted/40'
                    } ${!isCurrentMonth ? 'opacity-35 bg-muted/10' : 'bg-card'}`}
                  >
                    <div className="flex items-center justify-between w-full">
                      <span
                        className={`text-xs sm:text-sm inline-flex items-center justify-center w-6 h-6 rounded-full ${
                          isTodayDate
                            ? 'bg-primary text-primary-foreground font-bold shadow-xs'
                            : isSelected
                            ? 'text-primary font-bold'
                            : 'text-foreground'
                        }`}
                      >
                        {format(day, 'd')}
                      </span>

                      {dayEvents.length > 0 && (
                        <span className="hidden sm:inline-flex text-[10px] px-1.5 py-0.2 rounded-full bg-primary/10 text-primary font-semibold">
                          {dayEvents.length}
                        </span>
                      )}
                    </div>

                    {/* Events Display Inside Cell */}
                    <div className="w-full space-y-1 mt-1">
                      {/* Mobile view: colored dots */}
                      <div className="flex sm:hidden items-center gap-1 flex-wrap">
                        {dayEvents.slice(0, 3).map((ev, eIdx) => {
                          const catColor = KATEGORI_COLORS[ev.kategori || 'default'] || KATEGORI_COLORS.default
                          return (
                            <span key={eIdx} className={`w-1.5 h-1.5 rounded-full ${catColor.dot}`} />
                          )
                        })}
                      </div>

                      {/* Desktop view: Event preview pill */}
                      <div className="hidden sm:block space-y-1">
                        {dayEvents.slice(0, 2).map((ev) => {
                          const catColor = KATEGORI_COLORS[ev.kategori || 'default'] || KATEGORI_COLORS.default
                          return (
                            <div
                              key={ev.id}
                              className={`text-[10px] px-1.5 py-0.5 rounded truncate border ${catColor.bg} ${catColor.text} ${catColor.border}`}
                            >
                              {ev.judul}
                            </div>
                          )
                        })}
                        {dayEvents.length > 2 && (
                          <span className="text-[9px] text-muted-foreground block pl-1">
                            +{dayEvents.length - 2} lainnya
                          </span>
                        )}
                      </div>
                    </div>
                  </button>
                )
              })}
            </div>

            {/* Calendar Legend */}
            <div className="flex flex-wrap items-center gap-3 pt-4 mt-4 border-t border-border/70 text-xs text-muted-foreground">
              <span className="font-semibold text-foreground">Keterangan:</span>
              <div className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-blue-500" />
                <span>Rapat Pengurus</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
                <span>Sosial / Kerja Bakti</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-amber-500" />
                <span>Olahraga &amp; Turnamen</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-purple-500" />
                <span>Peringatan Hari Besar</span>
              </div>
            </div>
          </div>

          {/* Right: Selected Date Event Details (4 Cols) */}
          <div className="lg:col-span-4 space-y-4">
            <Card className="rounded-2xl border-border p-5 shadow-xs bg-gradient-to-br from-card via-card to-primary/5">
              <div className="border-b border-border/70 pb-3">
                <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-primary">
                  <CalendarIcon className="w-3.5 h-3.5" />
                  Rincian Tanggal Terpilih
                </div>
                <h3 className="text-lg font-bold font-heading text-foreground mt-1 capitalize">
                  {format(selectedDate, 'EEEE, dd MMMM yyyy', { locale: localeID })}
                </h3>
              </div>

              <div className="space-y-3 pt-3">
                {selectedDateEvents.length === 0 ? (
                  <div className="text-center py-10 space-y-2">
                    <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center mx-auto text-muted-foreground">
                      <CalendarIcon className="w-5 h-5" />
                    </div>
                    <p className="text-sm font-medium text-foreground">Tidak ada agenda</p>
                    <p className="text-xs text-muted-foreground max-w-[200px] mx-auto">
                      Belum ada kegiatan dijadwalkan pada tanggal ini.
                    </p>
                  </div>
                ) : (
                  selectedDateEvents.map((item) => {
                    const catColor = KATEGORI_COLORS[item.kategori || 'default'] || KATEGORI_COLORS.default
                    const googleUrl = getGoogleCalendarUrl(item)

                    return (
                      <div
                        key={item.id}
                        className="p-4 rounded-xl border border-border bg-card space-y-3 shadow-xs hover:border-primary/40 transition-colors"
                      >
                        <div className="flex items-start justify-between gap-2">
                          <h4 className="font-bold text-sm text-foreground leading-snug">{item.judul}</h4>
                          <Badge variant="outline" className={`text-[10px] shrink-0 capitalize ${catColor.text} ${catColor.border} ${catColor.bg}`}>
                            {item.status.replace('_', ' ')}
                          </Badge>
                        </div>

                        <div className="space-y-1.5 text-xs text-muted-foreground">
                          <div className="flex items-center gap-2">
                            <Clock className="w-3.5 h-3.5 text-primary" />
                            <span>
                              {format(new Date(item.tanggal_mulai), 'HH:mm')}
                              {item.tanggal_selesai && ` - ${format(new Date(item.tanggal_selesai), 'HH:mm')}`} WIB
                            </span>
                          </div>
                          {item.lokasi && (
                            <div className="flex items-center gap-2">
                              <MapPin className="w-3.5 h-3.5 text-primary" />
                              <span>{item.lokasi}</span>
                            </div>
                          )}
                        </div>

                        {item.deskripsi && (
                          <p className="text-xs text-muted-foreground/90 border-t border-border/60 pt-2 leading-relaxed">
                            {item.deskripsi}
                          </p>
                        )}

                        <div className="pt-1">
                          <a
                            href={googleUrl}
                            target="_blank"
                            rel="noreferrer"
                            className="inline-flex items-center gap-1.5 text-xs font-medium text-primary hover:underline"
                          >
                            <CalendarPlus className="w-3.5 h-3.5" />
                            Simpan ke Google Calendar
                          </a>
                        </div>
                      </div>
                    )
                  })
                )}
              </div>
            </Card>

            {/* Quick Dusun Info Box */}
            <Card className="rounded-2xl border-border p-4 bg-muted/30">
              <div className="flex items-start gap-2.5">
                <Info className="w-4 h-4 text-primary shrink-0 mt-0.5" />
                <p className="text-xs text-muted-foreground leading-relaxed">
                  Jadwal agenda diperbarui langsung oleh pengurus Karang Taruna Tirtajaya 01. Warga dapat mengklik tanggal mana pun untuk memeriksa detail rapat atau kerja bakti dusun.
                </p>
              </div>
            </Card>
          </div>
        </div>
      ) : (
        /* 3. Timeline List View */
        <div className="space-y-8">
          <div>
            <div className="flex items-center gap-2 mb-4">
              <Sparkles className="w-4 h-4 text-primary" />
              <h2 className="text-xl font-bold font-heading">Agenda Mendatang &amp; Berjalan</h2>
            </div>

            {upcomingEvents.length === 0 ? (
              <div className="bg-card p-12 text-center rounded-2xl border border-border">
                <p className="text-muted-foreground text-sm">Tidak ada agenda mendatang saat ini.</p>
              </div>
            ) : (
              <div className="space-y-4">
                {upcomingEvents.map((item) => {
                  const googleUrl = getGoogleCalendarUrl(item)
                  const catColor = KATEGORI_COLORS[item.kategori || 'default'] || KATEGORI_COLORS.default

                  return (
                    <Card
                      key={item.id}
                      className="rounded-2xl border-border p-5 hover:border-primary/40 transition-all shadow-xs"
                    >
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                        <div className="space-y-2">
                          <div className="flex items-center gap-2 flex-wrap">
                            <h3 className="text-base font-bold font-heading text-foreground">{item.judul}</h3>
                            <Badge variant="outline" className={`text-xs ${catColor.text} ${catColor.border} ${catColor.bg}`}>
                              {item.status.replace('_', ' ')}
                            </Badge>
                            {item.kategori && (
                              <Badge variant="secondary" className="text-xs uppercase">
                                {item.kategori}
                              </Badge>
                            )}
                          </div>

                          <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-muted-foreground">
                            <span className="flex items-center gap-1.5">
                              <CalendarIcon className="w-3.5 h-3.5 text-primary" />
                              {format(new Date(item.tanggal_mulai), 'EEEE, dd MMMM yyyy', { locale: localeID })}
                            </span>
                            <span className="flex items-center gap-1.5">
                              <Clock className="w-3.5 h-3.5 text-primary" />
                              {format(new Date(item.tanggal_mulai), 'HH:mm')} WIB
                            </span>
                            {item.lokasi && (
                              <span className="flex items-center gap-1.5">
                                <MapPin className="w-3.5 h-3.5 text-primary" />
                                {item.lokasi}
                              </span>
                            )}
                          </div>

                          {item.deskripsi && (
                            <p className="text-xs text-muted-foreground pt-1">{item.deskripsi}</p>
                          )}
                        </div>

                        <a
                          href={googleUrl}
                          target="_blank"
                          rel="noreferrer"
                          className="shrink-0"
                        >
                          <Button variant="outline" size="sm" className="rounded-xl gap-2 text-xs h-9 cursor-pointer border-border hover:bg-muted">
                            <CalendarPlus className="w-3.5 h-3.5 text-primary" />
                            Google Calendar
                          </Button>
                        </a>
                      </div>
                    </Card>
                  )
                })}
              </div>
            )}
          </div>

          {pastEvents.length > 0 && (
            <div className="pt-6 border-t border-border">
              <h3 className="text-lg font-bold font-heading text-muted-foreground mb-4">Agenda Selesai</h3>
              <div className="grid gap-3 sm:grid-cols-2">
                {pastEvents.map((item) => (
                  <Card key={item.id} className="p-4 rounded-xl border border-border/60 bg-muted/30">
                    <CardContent className="p-0 space-y-1">
                      <div className="flex items-center justify-between">
                        <h4 className="font-semibold text-sm text-foreground/80">{item.judul}</h4>
                        <CheckCircle2 className="w-3.5 h-3.5 text-muted-foreground" />
                      </div>
                      <p className="text-xs text-muted-foreground">
                        {format(new Date(item.tanggal_mulai), 'dd MMMM yyyy', { locale: localeID })}
                        {item.lokasi ? ` • ${item.lokasi}` : ''}
                      </p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
