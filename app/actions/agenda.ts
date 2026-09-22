'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'

export async function getAgenda() {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('agenda')
    .select('*')
    .order('tanggal_mulai', { ascending: true })
  
  if (error) {
    console.error('Error fetching agenda:', error)
    return []
  }
  return data
}

export async function createAgenda(formData: FormData) {
  const supabase = await createClient()
  
  const judul = formData.get('judul') as string
  const deskripsi = formData.get('deskripsi') as string
  const tanggal_mulai = formData.get('tanggal_mulai') as string
  const tanggal_selesai = formData.get('tanggal_selesai') as string || null
  const lokasi = formData.get('lokasi') as string
  const status = formData.get('status') as string || 'akan_datang'
  const kategori = formData.get('kategori') as string || null
  
  if (!judul || !tanggal_mulai) {
    return { error: 'Judul dan tanggal mulai harus diisi' }
  }

  // Get current user (admin)
  const { data: { user } } = await supabase.auth.getUser()
  
  let adminId = null
  if (user) {
    const { data: admin } = await supabase.from('admins').select('id').eq('user_id', user.id).single()
    if (admin) adminId = admin.id
  }

  const { error } = await supabase
    .from('agenda')
    .insert({
      judul,
      deskripsi,
      tanggal_mulai,
      tanggal_selesai,
      lokasi,
      status,
      kategori,
      created_by: adminId
    })

  if (error) {
    return { error: error.message }
  }

  revalidatePath('/dashboard/agenda')
  revalidatePath('/agenda')
  return { success: true }
}

export async function deleteAgenda(id: string) {
  const supabase = await createClient()
  const { error } = await supabase.from('agenda').delete().eq('id', id)
  
  if (error) {
    return { error: error.message }
  }
  
  revalidatePath('/dashboard/agenda')
  revalidatePath('/agenda')
  return { success: true }
}
