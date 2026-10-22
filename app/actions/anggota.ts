'use server'

import { prisma } from '@/lib/prisma'
import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'
import type { Prisma, Anggota } from '@prisma/client'

export interface AnggotaDTO {
  id: string
  nama: string
  nik: string | null
  jenis_kelamin: string
  tempat_lahir: string | null
  tanggal_lahir: string | null
  no_hp: string | null
  email: string | null
  alamat: string | null
  rt: string
  rw: string
  dusun: string
  status: string
  jabatan: string | null
  minat_bakat: string | null
  foto_url: string | null
  created_at: string | null
  updated_at: string | null
}

export interface AnggotaStats {
  total: number
  aktif: number
  pengurus: number
  alumni: number
  pria: number
  wanita: number
  rtDistribution: { rt: string; count: number }[]
}

export async function getAnggotaList(options?: {
  search?: string
  status?: string
  rt?: string
  jenis_kelamin?: string
}): Promise<AnggotaDTO[]> {
  try {
    const where: Prisma.AnggotaWhereInput = {}

    if (options?.status && options.status !== 'semua') {
      where.status = options.status
    }

    if (options?.rt && options.rt !== 'semua') {
      where.rt = options.rt
    }

    if (options?.jenis_kelamin && options.jenis_kelamin !== 'semua') {
      where.jenis_kelamin = options.jenis_kelamin
    }

    if (options?.search) {
      where.OR = [
        { nama: { contains: options.search, mode: 'insensitive' } },
        { no_hp: { contains: options.search, mode: 'insensitive' } },
        { jabatan: { contains: options.search, mode: 'insensitive' } },
        { minat_bakat: { contains: options.search, mode: 'insensitive' } },
        { alamat: { contains: options.search, mode: 'insensitive' } }
      ]
    }

    const data = await prisma.anggota.findMany({
      where,
      orderBy: [
        { rt: 'asc' },
        { nama: 'asc' }
      ]
    })

    return data.map((item: Anggota) => ({
      ...item,
      tanggal_lahir: item.tanggal_lahir ? item.tanggal_lahir.toISOString() : null,
      created_at: item.created_at ? item.created_at.toISOString() : null,
      updated_at: item.updated_at ? item.updated_at.toISOString() : null
    }))
  } catch (error) {
    console.error('Error in getAnggotaList:', error)
    return []
  }
}

export async function getAnggotaStats(): Promise<AnggotaStats> {
  try {
    const all = await prisma.anggota.findMany({
      select: { status: true, jenis_kelamin: true, rt: true }
    })

    const stats: AnggotaStats = {
      total: all.length,
      aktif: all.filter((a) => a.status === 'Aktif').length,
      pengurus: all.filter((a) => a.status === 'Pengurus').length,
      alumni: all.filter((a) => a.status === 'Alumni').length,
      pria: all.filter((a) => a.jenis_kelamin === 'L').length,
      wanita: all.filter((a) => a.jenis_kelamin === 'P').length,
      rtDistribution: []
    }

    const rtCounts: Record<string, number> = {}
    for (const a of all) {
      rtCounts[a.rt] = (rtCounts[a.rt] || 0) + 1
    }

    stats.rtDistribution = Object.keys(rtCounts)
      .sort()
      .map((rt) => ({
        rt: `RT ${rt}`,
        count: rtCounts[rt]
      }))

    return stats
  } catch (error) {
    console.error('Error in getAnggotaStats:', error)
    return {
      total: 0,
      aktif: 0,
      pengurus: 0,
      alumni: 0,
      pria: 0,
      wanita: 0,
      rtDistribution: []
    }
  }
}

export async function createAnggota(formData: FormData) {
  const nama = formData.get('nama') as string
  const nik = (formData.get('nik') as string) || null
  const jenis_kelamin = (formData.get('jenis_kelamin') as string) || 'L'
  const tempat_lahir = (formData.get('tempat_lahir') as string) || null
  const tanggal_lahir_raw = formData.get('tanggal_lahir') as string
  const no_hp = (formData.get('no_hp') as string) || null
  const email = (formData.get('email') as string) || null
  const alamat = (formData.get('alamat') as string) || null
  const rt = (formData.get('rt') as string) || '01'
  const rw = (formData.get('rw') as string) || '01'
  const dusun = (formData.get('dusun') as string) || 'Sumurgintung'
  const status = (formData.get('status') as string) || 'Aktif'
  const jabatan = (formData.get('jabatan') as string) || 'Anggota'
  const minat_bakat = (formData.get('minat_bakat') as string) || null
  const foto_url = (formData.get('foto_url') as string) || null

  if (!nama || nama.trim().length === 0) {
    return { error: 'Nama anggota wajib diisi' }
  }

  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    let adminId: string | null = null
    if (user?.email) {
      const admin = await prisma.admin.findUnique({
        where: { email: user.email }
      })
      if (admin) adminId = admin.id
    }

    const tanggal_lahir = tanggal_lahir_raw ? new Date(tanggal_lahir_raw) : null

    await prisma.anggota.create({
      data: {
        nama,
        nik,
        jenis_kelamin,
        tempat_lahir,
        tanggal_lahir,
        no_hp,
        email,
        alamat,
        rt,
        rw,
        dusun,
        status,
        jabatan,
        minat_bakat,
        foto_url,
        created_by: adminId
      }
    })

    revalidatePath('/dashboard/anggota')
    revalidatePath('/dashboard')
    return { success: true }
  } catch (error) {
    console.error('Error creating anggota:', error)
    return { error: 'Gagal menambahkan anggota' }
  }
}

export async function updateAnggota(id: string, formData: FormData) {
  const nama = formData.get('nama') as string
  const nik = (formData.get('nik') as string) || null
  const jenis_kelamin = (formData.get('jenis_kelamin') as string) || 'L'
  const tempat_lahir = (formData.get('tempat_lahir') as string) || null
  const tanggal_lahir_raw = formData.get('tanggal_lahir') as string
  const no_hp = (formData.get('no_hp') as string) || null
  const email = (formData.get('email') as string) || null
  const alamat = (formData.get('alamat') as string) || null
  const rt = (formData.get('rt') as string) || '01'
  const rw = (formData.get('rw') as string) || '01'
  const dusun = (formData.get('dusun') as string) || 'Sumurgintung'
  const status = (formData.get('status') as string) || 'Aktif'
  const jabatan = (formData.get('jabatan') as string) || 'Anggota'
  const minat_bakat = (formData.get('minat_bakat') as string) || null
  const foto_url = (formData.get('foto_url') as string) || null

  if (!nama || nama.trim().length === 0) {
    return { error: 'Nama anggota wajib diisi' }
  }

  try {
    const tanggal_lahir = tanggal_lahir_raw ? new Date(tanggal_lahir_raw) : null

    await prisma.anggota.update({
      where: { id },
      data: {
        nama,
        nik,
        jenis_kelamin,
        tempat_lahir,
        tanggal_lahir,
        no_hp,
        email,
        alamat,
        rt,
        rw,
        dusun,
        status,
        jabatan,
        minat_bakat,
        foto_url,
        updated_at: new Date()
      }
    })

    revalidatePath('/dashboard/anggota')
    revalidatePath('/dashboard')
    return { success: true }
  } catch (error) {
    console.error('Error updating anggota:', error)
    return { error: 'Gagal memperbarui data anggota' }
  }
}

export async function deleteAnggota(id: string) {
  try {
    await prisma.anggota.delete({
      where: { id }
    })

    revalidatePath('/dashboard/anggota')
    revalidatePath('/dashboard')
    return { success: true }
  } catch (error) {
    console.error('Error deleting anggota:', error)
    return { error: 'Gagal menghapus data anggota' }
  }
}
