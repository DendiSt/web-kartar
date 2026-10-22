'use server'

import { prisma } from '@/lib/prisma'
import { revalidatePath } from 'next/cache'
import type { Prisma, Aspirasi } from '@prisma/client'

export interface AspirasiDTO {
  id: string
  nama: string
  kontak: string | null
  kategori: string
  pesan: string
  status: string
  tanggapan: string | null
  is_anonim: boolean
  created_at: string | null
  updated_at: string | null
}

export interface AspirasiStats {
  total: number
  pending: number
  approved: number
  rejected: number
}

// 1. Public Submission
export async function submitAspirasi(formData: FormData) {
  const nama = (formData.get('nama') as string) || 'Warga Dusun'
  const kontak = (formData.get('kontak') as string) || null
  const kategori = (formData.get('kategori') as string) || 'aspirasi'
  const pesan = formData.get('pesan') as string
  const is_anonim = formData.get('is_anonim') === 'true'

  if (!pesan || pesan.trim().length < 5) {
    return { error: 'Pesan aspirasi minimal 5 karakter' }
  }

  try {
    await prisma.aspirasi.create({
      data: {
        nama: is_anonim ? 'Anonim (Warga)' : nama.trim(),
        kontak: is_anonim ? null : kontak?.trim() || null,
        kategori,
        pesan: pesan.trim(),
        status: 'PENDING',
        is_anonim
      }
    })

    revalidatePath('/aspirasi')
    revalidatePath('/dashboard/aspirasi')
    return { success: true }
  } catch (error) {
    console.error('Error submitting aspirasi:', error)
    return { error: 'Gagal mengirim aspirasi, silakan coba lagi' }
  }
}

// 2. Public Read (Only APPROVED)
export async function getPublicAspirasiList(options?: {
  kategori?: string
  search?: string
}): Promise<AspirasiDTO[]> {
  try {
    const where: Prisma.AspirasiWhereInput = {
      status: 'APPROVED'
    }

    if (options?.kategori && options.kategori !== 'semua') {
      where.kategori = options.kategori
    }

    if (options?.search) {
      where.OR = [
        { pesan: { contains: options.search, mode: 'insensitive' } },
        { tanggapan: { contains: options.search, mode: 'insensitive' } },
        { nama: { contains: options.search, mode: 'insensitive' } }
      ]
    }

    const data = await prisma.aspirasi.findMany({
      where,
      orderBy: { created_at: 'desc' }
    })

    return data.map((item: Aspirasi) => ({
      ...item,
      created_at: item.created_at ? item.created_at.toISOString() : null,
      updated_at: item.updated_at ? item.updated_at.toISOString() : null
    }))
  } catch (error) {
    console.error('Error in getPublicAspirasiList:', error)
    return []
  }
}

// 3. Admin Read (With Counts & Status Filter)
export async function getAdminAspirasiList(options?: {
  status?: string
  kategori?: string
  search?: string
}): Promise<{ items: AspirasiDTO[]; stats: AspirasiStats }> {
  try {
    const where: Prisma.AspirasiWhereInput = {}

    if (options?.status && options.status !== 'semua') {
      where.status = options.status
    }

    if (options?.kategori && options.kategori !== 'semua') {
      where.kategori = options.kategori
    }

    if (options?.search) {
      where.OR = [
        { nama: { contains: options.search, mode: 'insensitive' } },
        { kontak: { contains: options.search, mode: 'insensitive' } },
        { pesan: { contains: options.search, mode: 'insensitive' } },
        { tanggapan: { contains: options.search, mode: 'insensitive' } }
      ]
    }

    const [itemsRaw, allCounts] = await Promise.all([
      prisma.aspirasi.findMany({
        where,
        orderBy: { created_at: 'desc' }
      }),
      prisma.aspirasi.findMany({
        select: { status: true }
      })
    ])

    const stats: AspirasiStats = {
      total: allCounts.length,
      pending: allCounts.filter((a) => a.status === 'PENDING').length,
      approved: allCounts.filter((a) => a.status === 'APPROVED').length,
      rejected: allCounts.filter((a) => a.status === 'REJECTED').length
    }

    const items = itemsRaw.map((item: Aspirasi) => ({
      ...item,
      created_at: item.created_at ? item.created_at.toISOString() : null,
      updated_at: item.updated_at ? item.updated_at.toISOString() : null
    }))

    return { items, stats }
  } catch (error) {
    console.error('Error in getAdminAspirasiList:', error)
    return {
      items: [],
      stats: { total: 0, pending: 0, approved: 0, rejected: 0 }
    }
  }
}

// 4. Admin Moderate
export async function updateAspirasiStatus(
  id: string,
  status: 'PENDING' | 'APPROVED' | 'REJECTED',
  tanggapan?: string | null
) {
  try {
    await prisma.aspirasi.update({
      where: { id },
      data: {
        status,
        tanggapan: tanggapan !== undefined ? tanggapan : undefined,
        updated_at: new Date()
      }
    })

    revalidatePath('/dashboard/aspirasi')
    revalidatePath('/aspirasi')
    return { success: true }
  } catch (error) {
    console.error('Error updating aspirasi status:', error)
    return { error: 'Gagal memperbarui status aspirasi' }
  }
}

// 5. Admin Delete
export async function deleteAspirasi(id: string) {
  try {
    await prisma.aspirasi.delete({
      where: { id }
    })

    revalidatePath('/dashboard/aspirasi')
    revalidatePath('/aspirasi')
    return { success: true }
  } catch (error) {
    console.error('Error deleting aspirasi:', error)
    return { error: 'Gagal menghapus aspirasi' }
  }
}
