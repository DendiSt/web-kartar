'use server'

import { prisma } from '@/lib/prisma'
import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'

export async function getKegiatan() {
  try {
    const data = await prisma.kegiatan.findMany({
      orderBy: { tanggal_pelaksanaan: 'desc' }
    })
    return data.map((item) => ({
      ...item,
      tanggal_pelaksanaan: item.tanggal_pelaksanaan.toISOString()
    }))
  } catch (error) {
    console.error('Error fetching kegiatan:', error)
    return []
  }
}

export async function createKegiatan(formData: FormData) {
  const judul = formData.get('judul') as string
  const deskripsi = formData.get('deskripsi') as string
  const tanggal_pelaksanaan = formData.get('tanggal_pelaksanaan') as string
  const lokasi = formData.get('lokasi') as string
  const status = (formData.get('status') as string) || 'selesai'
  let foto_cover = (formData.get('foto_cover') as string) || null
  const foto_galeri_raw = formData.get('foto_galeri') as string | null
  let foto_galeri: string[] = []

  if (foto_galeri_raw) {
    try {
      foto_galeri = JSON.parse(foto_galeri_raw)
    } catch {
      foto_galeri = []
    }
  }

  // Ensure cover is set from gallery if empty
  if (!foto_cover && foto_galeri.length > 0) {
    foto_cover = foto_galeri[0]
  }

  // Ensure cover is part of gallery
  if (foto_cover && !foto_galeri.includes(foto_cover)) {
    foto_galeri = [foto_cover, ...foto_galeri]
  }

  if (!judul || !deskripsi || !tanggal_pelaksanaan) {
    return { error: 'Judul, deskripsi, dan tanggal harus diisi' }
  }

  // Generate a simple slug
  const slug = judul.toLowerCase().replace(/[^a-z0-9]+/g, '-') + '-' + Math.floor(Math.random() * 1000)

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
    await prisma.kegiatan.create({
      data: {
        judul,
        slug,
        deskripsi,
        tanggal_pelaksanaan: new Date(tanggal_pelaksanaan),
        lokasi,
        status,
        foto_cover,
        foto_galeri,
        created_by: adminId
      }
    })

    revalidatePath('/dashboard/kegiatan')
    revalidatePath('/kegiatan')
    revalidatePath('/')
    return { success: true }
  } catch (error: any) {
    return { error: error.message }
  }
}

export async function updateKegiatan(formData: FormData) {
  const id = formData.get('id') as string
  const judul = formData.get('judul') as string
  const deskripsi = formData.get('deskripsi') as string
  const tanggal_pelaksanaan = formData.get('tanggal_pelaksanaan') as string
  const lokasi = formData.get('lokasi') as string
  const status = (formData.get('status') as string) || 'selesai'
  let foto_cover = (formData.get('foto_cover') as string) || null
  const foto_galeri_raw = formData.get('foto_galeri') as string | null
  let foto_galeri: string[] = []

  if (foto_galeri_raw) {
    try {
      foto_galeri = JSON.parse(foto_galeri_raw)
    } catch {
      foto_galeri = []
    }
  }

  // Ensure cover is set from gallery if empty
  if (!foto_cover && foto_galeri.length > 0) {
    foto_cover = foto_galeri[0]
  }

  // Ensure cover is part of gallery
  if (foto_cover && !foto_galeri.includes(foto_cover)) {
    foto_galeri = [foto_cover, ...foto_galeri]
  }

  if (!id || !judul || !deskripsi || !tanggal_pelaksanaan) {
    return { error: 'Judul, deskripsi, dan tanggal harus diisi' }
  }

  try {
    await prisma.kegiatan.update({
      where: { id },
      data: {
        judul,
        deskripsi,
        tanggal_pelaksanaan: new Date(tanggal_pelaksanaan),
        lokasi,
        status,
        foto_cover: foto_cover || null,
        foto_galeri
      }
    })

    revalidatePath('/dashboard/kegiatan')
    revalidatePath('/kegiatan')
    revalidatePath('/')
    return { success: true }
  } catch (error: any) {
    return { error: error.message }
  }
}

export async function deleteKegiatan(id: string) {
  try {
    await prisma.kegiatan.delete({
      where: { id }
    })

    revalidatePath('/dashboard/kegiatan')
    revalidatePath('/kegiatan')
    return { success: true }
  } catch (error: any) {
    return { error: error.message }
  }
}
