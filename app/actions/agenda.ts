'use server'

import { prisma } from '@/lib/prisma'
import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'

export async function getAgenda() {
  try {
    const data = await prisma.agenda.findMany({
      orderBy: { tanggal_mulai: 'asc' }
    })
    return data.map((item) => ({
      ...item,
      tanggal_mulai: item.tanggal_mulai.toISOString(),
      tanggal_selesai: item.tanggal_selesai ? item.tanggal_selesai.toISOString() : null
    }))
  } catch (error) {
    console.error('Error fetching agenda:', error)
    return []
  }
}

export async function createAgenda(formData: FormData) {
  const judul = formData.get('judul') as string
  const deskripsi = formData.get('deskripsi') as string
  const tanggal_mulai = formData.get('tanggal_mulai') as string
  const tanggal_selesai = (formData.get('tanggal_selesai') as string) || null
  const lokasi = formData.get('lokasi') as string
  const status = (formData.get('status') as string) || 'akan_datang'
  const kategori = (formData.get('kategori') as string) || null

  if (!judul || !tanggal_mulai) {
    return { error: 'Judul dan tanggal mulai harus diisi' }
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
    await prisma.agenda.create({
      data: {
        judul,
        deskripsi,
        tanggal_mulai: new Date(tanggal_mulai),
        tanggal_selesai: tanggal_selesai ? new Date(tanggal_selesai) : null,
        lokasi,
        status,
        kategori,
        created_by: adminId
      }
    })

    revalidatePath('/dashboard/agenda')
    revalidatePath('/agenda')
    return { success: true }
  } catch (error: any) {
    return { error: error.message }
  }
}

export async function updateAgenda(formData: FormData) {
  const id = formData.get('id') as string
  const judul = formData.get('judul') as string
  const deskripsi = formData.get('deskripsi') as string
  const tanggal_mulai = formData.get('tanggal_mulai') as string
  const tanggal_selesai = (formData.get('tanggal_selesai') as string) || null
  const lokasi = formData.get('lokasi') as string
  const status = (formData.get('status') as string) || 'akan_datang'
  const kategori = (formData.get('kategori') as string) || null

  if (!id || !judul || !tanggal_mulai) {
    return { error: 'Judul dan tanggal mulai harus diisi' }
  }

  try {
    await prisma.agenda.update({
      where: { id },
      data: {
        judul,
        deskripsi,
        tanggal_mulai: new Date(tanggal_mulai),
        tanggal_selesai: tanggal_selesai ? new Date(tanggal_selesai) : null,
        lokasi,
        status,
        kategori
      }
    })

    revalidatePath('/dashboard/agenda')
    revalidatePath('/agenda')
    return { success: true }
  } catch (error: any) {
    return { error: error.message }
  }
}

export async function deleteAgenda(id: string) {
  try {
    await prisma.agenda.delete({
      where: { id }
    })

    revalidatePath('/dashboard/agenda')
    revalidatePath('/agenda')
    return { success: true }
  } catch (error: any) {
    return { error: error.message }
  }
}
