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
  const foto_cover = (formData.get('foto_cover') as string) || null

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
        foto_galeri: [],
        created_by: adminId
      }
    })

    revalidatePath('/dashboard/kegiatan')
    revalidatePath('/kegiatan')
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
  const foto_cover = formData.get('foto_cover') as string | null

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
        ...(foto_cover !== null && foto_cover !== '' ? { foto_cover } : {})
      }
    })

    revalidatePath('/dashboard/kegiatan')
    revalidatePath('/kegiatan')
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
