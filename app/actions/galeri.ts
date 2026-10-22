'use server'

import { prisma } from '@/lib/prisma'
import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'
import type { Prisma } from '@prisma/client'

export interface GaleriItem {
  id: string
  judul: string
  album: string
  kategori: string
  foto_url: string
  deskripsi: string | null
  tanggal: string | null
  source: 'galeri' | 'kegiatan'
  created_at: string | null
}

export interface AlbumSummary {
  nama: string
  count: number
  coverUrl: string
}

export async function getGaleriList(options?: {
  album?: string
  kategori?: string
  search?: string
}): Promise<GaleriItem[]> {
  try {
    const where: Prisma.GaleriWhereInput = {}

    if (options?.album && options.album !== 'semua') {
      where.album = options.album
    }

    if (options?.kategori && options.kategori !== 'semua') {
      where.kategori = options.kategori
    }

    if (options?.search) {
      where.OR = [
        { judul: { contains: options.search, mode: 'insensitive' } },
        { deskripsi: { contains: options.search, mode: 'insensitive' } },
        { album: { contains: options.search, mode: 'insensitive' } }
      ]
    }

    // 1. Fetch from dedicated Galeri table
    const galeriData = await prisma.galeri.findMany({
      where,
      orderBy: { created_at: 'desc' }
    })

    const items: GaleriItem[] = galeriData.map((g) => ({
      id: g.id,
      judul: g.judul,
      album: g.album,
      kategori: g.kategori,
      foto_url: g.foto_url,
      deskripsi: g.deskripsi,
      tanggal: g.tanggal ? g.tanggal.toISOString().split('T')[0] : null,
      source: 'galeri',
      created_at: g.created_at ? g.created_at.toISOString() : null
    }))

    // 2. Also incorporate photos from Kegiatan if album is 'semua' or 'Kegiatan'
    if (!options?.album || options.album === 'semua' || options.album === 'Dokumentasi Kegiatan') {
      const kegiatanData = await prisma.kegiatan.findMany({
        orderBy: { tanggal_pelaksanaan: 'desc' }
      })

      kegiatanData.forEach((k) => {
        const tglStr = k.tanggal_pelaksanaan.toISOString().split('T')[0]
        
        // Add cover if exists and not already in items
        if (k.foto_cover && !items.some((i) => i.foto_url === k.foto_cover)) {
          if (!options?.search || k.judul.toLowerCase().includes(options.search.toLowerCase())) {
            items.push({
              id: `kg-cover-${k.id}`,
              judul: `${k.judul} (Cover)`,
              album: 'Dokumentasi Kegiatan',
              kategori: 'kegiatan',
              foto_url: k.foto_cover,
              deskripsi: k.deskripsi.slice(0, 160),
              tanggal: tglStr,
              source: 'kegiatan',
              created_at: k.created_at ? k.created_at.toISOString() : null
            })
          }
        }

        // Add additional gallery photos
        if (Array.isArray(k.foto_galeri)) {
          k.foto_galeri.forEach((url, idx) => {
            if (url && url !== k.foto_cover && !items.some((i) => i.foto_url === url)) {
              if (!options?.search || k.judul.toLowerCase().includes(options.search.toLowerCase())) {
                items.push({
                  id: `kg-${k.id}-${idx}`,
                  judul: `${k.judul} #${idx + 1}`,
                  album: 'Dokumentasi Kegiatan',
                  kategori: 'kegiatan',
                  foto_url: url,
                  deskripsi: k.deskripsi.slice(0, 160),
                  tanggal: tglStr,
                  source: 'kegiatan',
                  created_at: k.created_at ? k.created_at.toISOString() : null
                })
              }
            }
          })
        }
      })
    }

    return items
  } catch (error) {
    console.error('Error fetching galeri list:', error)
    return []
  }
}

export async function getGaleriAlbums(): Promise<AlbumSummary[]> {
  try {
    const list = await getGaleriList()
    const map = new Map<string, { count: number; coverUrl: string }>()

    list.forEach((item) => {
      const albumName = item.album || 'Umum'
      const existing = map.get(albumName)
      if (!existing) {
        map.set(albumName, { count: 1, coverUrl: item.foto_url })
      } else {
        map.set(albumName, { count: existing.count + 1, coverUrl: existing.coverUrl })
      }
    })

    return Array.from(map.entries()).map(([nama, val]) => ({
      nama,
      count: val.count,
      coverUrl: val.coverUrl
    }))
  } catch (error) {
    console.error('Error fetching galeri albums:', error)
    return []
  }
}

export async function createFotoGaleri(formData: FormData) {
  const judul = formData.get('judul') as string
  const album = (formData.get('album') as string) || 'Umum'
  const kategori = (formData.get('kategori') as string) || 'kegiatan'
  const foto_url = formData.get('foto_url') as string
  const deskripsi = (formData.get('deskripsi') as string) || null
  const tanggal_raw = formData.get('tanggal') as string
  const tanggal = tanggal_raw ? new Date(tanggal_raw) : new Date()

  if (!judul || !foto_url) {
    return { error: 'Judul dan URL Foto wajib diisi' }
  }

  // Get current user (admin)
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  let adminId = null
  if (user) {
    const admin = await prisma.admin.findFirst({
      where: { user_id: user.id }
    })
    if (admin) adminId = admin.id
  }

  try {
    await prisma.galeri.create({
      data: {
        judul,
        album,
        kategori,
        foto_url,
        deskripsi,
        tanggal,
        created_by: adminId
      }
    })

    revalidatePath('/dashboard/galeri')
    revalidatePath('/galeri')
    revalidatePath('/')
    return { success: true }
  } catch (error) {
    return { error: error instanceof Error ? error.message : 'Terjadi kesalahan sistem' }
  }
}

export async function updateFotoGaleri(formData: FormData) {
  const id = formData.get('id') as string
  const judul = formData.get('judul') as string
  const album = (formData.get('album') as string) || 'Umum'
  const kategori = (formData.get('kategori') as string) || 'kegiatan'
  const foto_url = formData.get('foto_url') as string
  const deskripsi = (formData.get('deskripsi') as string) || null
  const tanggal_raw = formData.get('tanggal') as string
  const tanggal = tanggal_raw ? new Date(tanggal_raw) : new Date()

  if (!id || !judul || !foto_url) {
    return { error: 'ID, Judul, dan Foto wajib diisi' }
  }

  try {
    await prisma.galeri.update({
      where: { id },
      data: {
        judul,
        album,
        kategori,
        foto_url,
        deskripsi,
        tanggal
      }
    })

    revalidatePath('/dashboard/galeri')
    revalidatePath('/galeri')
    revalidatePath('/')
    return { success: true }
  } catch (error) {
    return { error: error instanceof Error ? error.message : 'Terjadi kesalahan sistem' }
  }
}

export async function deleteFotoGaleri(id: string) {
  try {
    await prisma.galeri.delete({
      where: { id }
    })

    revalidatePath('/dashboard/galeri')
    revalidatePath('/galeri')
    revalidatePath('/')
    return { success: true }
  } catch (error) {
    return { error: error instanceof Error ? error.message : 'Terjadi kesalahan sistem' }
  }
}
