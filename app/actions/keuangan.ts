'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'

export async function getKeuangan() {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('keuangan')
    .select('*')
    .order('tanggal', { ascending: false })
  
  if (error) {
    console.error('Error fetching keuangan:', error)
    return []
  }
  return data
}

export async function getSaldoKas() {
  const supabase = await createClient()
  
  // To calculate balance, we need total pemasukan and pengeluaran
  const { data, error } = await supabase
    .from('keuangan')
    .select('tipe, jumlah')
    
  if (error) {
    console.error('Error fetching for saldo calculation:', error)
    return 0
  }
  
  let totalPemasukan = 0
  let totalPengeluaran = 0
  
  data.forEach((item) => {
    if (item.tipe === 'pemasukan') {
      totalPemasukan += Number(item.jumlah)
    } else if (item.tipe === 'pengeluaran') {
      totalPengeluaran += Number(item.jumlah)
    }
  })
  
  return totalPemasukan - totalPengeluaran
}

export async function createKeuangan(formData: FormData) {
  const supabase = await createClient()
  
  const tanggal = formData.get('tanggal') as string
  const tipe = formData.get('tipe') as string
  const kategori = formData.get('kategori') as string
  const jumlah = parseFloat(formData.get('jumlah') as string)
  const keterangan = formData.get('keterangan') as string
  const bukti_url = formData.get('bukti_url') as string || null
  
  if (!tanggal || !tipe || !kategori || !jumlah || !keterangan) {
    return { error: 'Semua field wajib harus diisi' }
  }

  // Get current user (admin)
  const { data: { user } } = await supabase.auth.getUser()
  
  let adminId = null
  if (user) {
    const { data: admin } = await supabase.from('admins').select('id').eq('user_id', user.id).single()
    if (admin) adminId = admin.id
  }

  const { error } = await supabase
    .from('keuangan')
    .insert({
      tanggal,
      tipe,
      kategori,
      jumlah,
      keterangan,
      bukti_url,
      created_by: adminId
    })

  if (error) {
    return { error: error.message }
  }

  revalidatePath('/dashboard/keuangan')
  revalidatePath('/keuangan')
  revalidatePath('/dashboard') // Update dashboard overview
  return { success: true }
}

export async function updateKeuangan(formData: FormData) {
  const supabase = await createClient()
  
  const id = formData.get('id') as string
  const tanggal = formData.get('tanggal') as string
  const tipe = formData.get('tipe') as string
  const kategori = formData.get('kategori') as string
  const jumlah = parseFloat(formData.get('jumlah') as string)
  const keterangan = formData.get('keterangan') as string
  const bukti_url = formData.get('bukti_url') as string || null
  
  if (!id || !tanggal || !tipe || !kategori || !jumlah || !keterangan) {
    return { error: 'Semua field wajib harus diisi' }
  }

  const { error } = await supabase
    .from('keuangan')
    .update({
      tanggal,
      tipe,
      kategori,
      jumlah,
      keterangan,
      bukti_url
    })
    .eq('id', id)

  if (error) {
    return { error: error.message }
  }

  revalidatePath('/dashboard/keuangan')
  revalidatePath('/keuangan')
  revalidatePath('/dashboard') // Update dashboard overview
  return { success: true }
}

export async function deleteKeuangan(id: string) {
  const supabase = await createClient()
  const { error } = await supabase.from('keuangan').delete().eq('id', id)
  
  if (error) {
    return { error: error.message }
  }
  
  revalidatePath('/dashboard/keuangan')
  revalidatePath('/keuangan')
  revalidatePath('/dashboard')
  return { success: true }
}
