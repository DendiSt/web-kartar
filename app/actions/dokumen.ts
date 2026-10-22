'use server'

import { prisma } from '@/lib/prisma'
import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'
import type { Dokumen, Prisma } from '@prisma/client'

export async function getDokumenList(options?: {
  kategori?: string
  tahun?: number
  search?: string
  isPublicOnly?: boolean
}) {
  try {
    const where: Prisma.DokumenWhereInput = {}

    if (options?.isPublicOnly) {
      where.is_public = true
    }

    if (options?.kategori && options.kategori !== 'semua') {
      where.kategori = options.kategori
    }

    if (options?.tahun && !isNaN(options.tahun)) {
      where.tahun = options.tahun
    }

    if (options?.search) {
      where.OR = [
        { judul: { contains: options.search, mode: 'insensitive' } },
        { nomor_surat: { contains: options.search, mode: 'insensitive' } },
        { deskripsi: { contains: options.search, mode: 'insensitive' } }
      ]
    }

    const data = await prisma.dokumen.findMany({
      where,
      orderBy: [
        { tahun: 'desc' },
        { created_at: 'desc' }
      ]
    })

    return data.map((item: Dokumen) => ({
      ...item,
      created_at: item.created_at ? item.created_at.toISOString() : null,
      updated_at: item.updated_at ? item.updated_at.toISOString() : null
    }))
  } catch (error) {
    console.error('Error fetching dokumen list:', error)
    return []
  }
}

export async function createDokumen(formData: FormData) {
  const judul = formData.get('judul') as string
  const nomor_surat = (formData.get('nomor_surat') as string) || null
  const kategori = (formData.get('kategori') as string) || 'sk'
  const deskripsi = (formData.get('deskripsi') as string) || null
  const file_url = formData.get('file_url') as string
  const file_name = (formData.get('file_name') as string) || null
  const file_size = (formData.get('file_size') as string) || null
  const file_type = (formData.get('file_type') as string) || 'pdf'
  const tahun_raw = formData.get('tahun') as string
  const tahun = tahun_raw ? parseInt(tahun_raw, 10) : new Date().getFullYear()
  const is_public = formData.get('is_public') !== 'false'

  if (!judul || !file_url) {
    return { error: 'Judul dan File Dokumen wajib diisi' }
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
    await prisma.dokumen.create({
      data: {
        judul,
        nomor_surat,
        kategori,
        deskripsi,
        file_url,
        file_name,
        file_size,
        file_type: file_type.toLowerCase(),
        tahun,
        is_public,
        created_by: adminId
      }
    })

    revalidatePath('/dashboard/dokumen')
    revalidatePath('/dokumen')
    return { success: true }
  } catch (error) {
    return { error: error instanceof Error ? error.message : 'Terjadi kesalahan' }
  }
}

export async function updateDokumen(formData: FormData) {
  const id = formData.get('id') as string
  const judul = formData.get('judul') as string
  const nomor_surat = (formData.get('nomor_surat') as string) || null
  const kategori = (formData.get('kategori') as string) || 'sk'
  const deskripsi = (formData.get('deskripsi') as string) || null
  const file_url = formData.get('file_url') as string
  const file_name = (formData.get('file_name') as string) || null
  const file_size = (formData.get('file_size') as string) || null
  const file_type = (formData.get('file_type') as string) || 'pdf'
  const tahun_raw = formData.get('tahun') as string
  const tahun = tahun_raw ? parseInt(tahun_raw, 10) : new Date().getFullYear()
  const is_public = formData.get('is_public') !== 'false'

  if (!id || !judul || !file_url) {
    return { error: 'ID, Judul, dan File Dokumen wajib diisi' }
  }

  try {
    await prisma.dokumen.update({
      where: { id },
      data: {
        judul,
        nomor_surat,
        kategori,
        deskripsi,
        file_url,
        file_name,
        file_size,
        file_type: file_type.toLowerCase(),
        tahun,
        is_public
      }
    })

    revalidatePath('/dashboard/dokumen')
    revalidatePath('/dokumen')
    return { success: true }
  } catch (error) {
    return { error: error instanceof Error ? error.message : 'Terjadi kesalahan' }
  }
}

export async function deleteDokumen(id: string) {
  try {
    await prisma.dokumen.delete({
      where: { id }
    })

    revalidatePath('/dashboard/dokumen')
    revalidatePath('/dokumen')
    return { success: true }
  } catch (error) {
    return { error: error instanceof Error ? error.message : 'Terjadi kesalahan' }
  }
}

export async function incrementDokumenDownload(id: string) {
  try {
    await prisma.dokumen.update({
      where: { id },
      data: {
        downloads: { increment: 1 }
      }
    })
    return { success: true }
  } catch (error) {
    console.error('Error incrementing download count:', error)
    return { success: false }
  }
}
