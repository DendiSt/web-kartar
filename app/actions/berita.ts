'use server'

import { prisma } from '@/lib/prisma'
import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'
import type { Berita, Prisma } from '@prisma/client'

export async function getBeritaList(options?: {
  kategori?: string
  status?: string
  search?: string
}) {
  try {
    const where: Prisma.BeritaWhereInput = {}

    if (options?.kategori && options.kategori !== 'semua') {
      where.kategori = options.kategori
    }

    if (options?.status) {
      where.status = options.status
    }

    if (options?.search) {
      where.OR = [
        { judul: { contains: options.search, mode: 'insensitive' } },
        { ringkasan: { contains: options.search, mode: 'insensitive' } },
        { konten: { contains: options.search, mode: 'insensitive' } }
      ]
    }

    const data = await prisma.berita.findMany({
      where,
      orderBy: [
        { is_pinned: 'desc' },
        { created_at: 'desc' }
      ]
    })

    return data.map((item: Berita) => ({
      ...item,
      created_at: item.created_at ? item.created_at.toISOString() : null,
      updated_at: item.updated_at ? item.updated_at.toISOString() : null
    }))
  } catch (error) {
    console.error('Error fetching berita list:', error)
    return []
  }
}

export async function getBeritaBySlug(slug: string) {
  try {
    const berita = await prisma.berita.findUnique({
      where: { slug }
    })

    if (!berita) return null

    return {
      ...berita,
      created_at: berita.created_at ? berita.created_at.toISOString() : null,
      updated_at: berita.updated_at ? berita.updated_at.toISOString() : null
    }
  } catch (error) {
    console.error('Error fetching berita by slug:', error)
    return null
  }
}

export async function getLatestBerita(limit = 3) {
  try {
    const data = await prisma.berita.findMany({
      where: { status: 'published' },
      orderBy: [
        { is_pinned: 'desc' },
        { created_at: 'desc' }
      ],
      take: limit
    })

    return data.map((item: Berita) => ({
      ...item,
      created_at: item.created_at ? item.created_at.toISOString() : null,
      updated_at: item.updated_at ? item.updated_at.toISOString() : null
    }))
  } catch (error) {
    console.error('Error fetching latest berita:', error)
    return []
  }
}

export async function createBerita(formData: FormData) {
  const judul = formData.get('judul') as string
  const ringkasan = formData.get('ringkasan') as string
  const konten = formData.get('konten') as string
  const kategori = (formData.get('kategori') as string) || 'pengumuman'
  const status = (formData.get('status') as string) || 'published'
  const foto_cover = (formData.get('foto_cover') as string) || null
  const penulis = (formData.get('penulis') as string) || 'Pengurus Karang Taruna'
  const is_pinned = formData.get('is_pinned') === 'true'

  if (!judul || !konten) {
    return { error: 'Judul dan isi konten harus diisi' }
  }

  // Generate unique slug
  const baseSlug = judul
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '')
  const slug = `${baseSlug}-${Math.floor(1000 + Math.random() * 9000)}`

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
    await prisma.berita.create({
      data: {
        judul,
        slug,
        ringkasan: ringkasan || judul,
        konten,
        kategori,
        status,
        foto_cover,
        penulis,
        is_pinned,
        created_by: adminId
      }
    })

    revalidatePath('/dashboard/berita')
    revalidatePath('/berita')
    revalidatePath('/')
    return { success: true }
  } catch (error) {
    return { error: error instanceof Error ? error.message : 'Terjadi kesalahan' }
  }
}

export async function updateBerita(formData: FormData) {
  const id = formData.get('id') as string
  const judul = formData.get('judul') as string
  const ringkasan = formData.get('ringkasan') as string
  const konten = formData.get('konten') as string
  const kategori = (formData.get('kategori') as string) || 'pengumuman'
  const status = (formData.get('status') as string) || 'published'
  const foto_cover = (formData.get('foto_cover') as string) || null
  const penulis = (formData.get('penulis') as string) || 'Pengurus Karang Taruna'
  const is_pinned = formData.get('is_pinned') === 'true'

  if (!id || !judul || !konten) {
    return { error: 'ID, judul, dan isi konten harus diisi' }
  }

  try {
    await prisma.berita.update({
      where: { id },
      data: {
        judul,
        ringkasan: ringkasan || judul,
        konten,
        kategori,
        status,
        foto_cover,
        penulis,
        is_pinned
      }
    })

    revalidatePath('/dashboard/berita')
    revalidatePath('/berita')
    revalidatePath('/')
    return { success: true }
  } catch (error) {
    return { error: error instanceof Error ? error.message : 'Terjadi kesalahan' }
  }
}

export async function deleteBerita(id: string) {
  try {
    await prisma.berita.delete({
      where: { id }
    })

    revalidatePath('/dashboard/berita')
    revalidatePath('/berita')
    revalidatePath('/')
    return { success: true }
  } catch (error) {
    return { error: error instanceof Error ? error.message : 'Terjadi kesalahan' }
  }
}

export async function togglePinBerita(id: string, is_pinned: boolean) {
  try {
    await prisma.berita.update({
      where: { id },
      data: { is_pinned }
    })

    revalidatePath('/dashboard/berita')
    revalidatePath('/berita')
    revalidatePath('/')
    return { success: true }
  } catch (error) {
    return { error: error instanceof Error ? error.message : 'Terjadi kesalahan' }
  }
}

export async function incrementBeritaViews(slug: string) {
  try {
    await prisma.berita.update({
      where: { slug },
      data: {
        views: { increment: 1 }
      }
    })
  } catch (error) {
    // Non-blocking error
    console.error('Error incrementing views:', error)
  }
}
