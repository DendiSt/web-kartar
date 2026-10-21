'use server'

import { prisma } from '@/lib/prisma'
import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'

export async function getKeuangan() {
  try {
    const data = await prisma.keuangan.findMany({
      orderBy: { tanggal: 'desc' }
    })
    return data.map((item) => ({
      ...item,
      jumlah: Number(item.jumlah),
      tanggal: item.tanggal.toISOString().split('T')[0]
    }))
  } catch (error) {
    console.error('Error fetching keuangan:', error)
    return []
  }
}

export async function getSaldoKas() {
  try {
    const data = await prisma.keuangan.findMany({
      select: {
        tipe: true,
        jumlah: true
      }
    })

    let totalPemasukan = 0
    let totalPengeluaran = 0

    data.forEach((item) => {
      const val = Number(item.jumlah)
      if (item.tipe === 'pemasukan') {
        totalPemasukan += val
      } else if (item.tipe === 'pengeluaran') {
        totalPengeluaran += val
      }
    })

    return totalPemasukan - totalPengeluaran
  } catch (error) {
    console.error('Error fetching for saldo calculation:', error)
    return 0
  }
}

export async function createKeuangan(formData: FormData) {
  const tanggal = formData.get('tanggal') as string
  const tipe = formData.get('tipe') as string
  const kategori = formData.get('kategori') as string
  const jumlah = parseFloat(formData.get('jumlah') as string)
  const keterangan = formData.get('keterangan') as string
  const bukti_url = (formData.get('bukti_url') as string) || null

  if (!tanggal || !tipe || !kategori || isNaN(jumlah) || !keterangan) {
    return { error: 'Semua field wajib harus diisi' }
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
    await prisma.keuangan.create({
      data: {
        tanggal: new Date(tanggal),
        tipe,
        kategori,
        jumlah,
        keterangan,
        bukti_url,
        created_by: adminId
      }
    })

    revalidatePath('/dashboard/keuangan')
    revalidatePath('/keuangan')
    revalidatePath('/dashboard')
    return { success: true }
  } catch (error: any) {
    return { error: error.message }
  }
}

export async function updateKeuangan(formData: FormData) {
  const id = formData.get('id') as string
  const tanggal = formData.get('tanggal') as string
  const tipe = formData.get('tipe') as string
  const kategori = formData.get('kategori') as string
  const jumlah = parseFloat(formData.get('jumlah') as string)
  const keterangan = formData.get('keterangan') as string
  const bukti_url = (formData.get('bukti_url') as string) || null

  if (!id || !tanggal || !tipe || !kategori || isNaN(jumlah) || !keterangan) {
    return { error: 'Semua field wajib harus diisi' }
  }

  try {
    await prisma.keuangan.update({
      where: { id },
      data: {
        tanggal: new Date(tanggal),
        tipe,
        kategori,
        jumlah,
        keterangan,
        ...(bukti_url !== null && bukti_url !== '' ? { bukti_url } : {})
      }
    })

    revalidatePath('/dashboard/keuangan')
    revalidatePath('/keuangan')
    revalidatePath('/dashboard')
    return { success: true }
  } catch (error: any) {
    return { error: error.message }
  }
}

export async function deleteKeuangan(id: string) {
  try {
    await prisma.keuangan.delete({
      where: { id }
    })

    revalidatePath('/dashboard/keuangan')
    revalidatePath('/keuangan')
    revalidatePath('/dashboard')
    return { success: true }
  } catch (error: any) {
    return { error: error.message }
  }
}
