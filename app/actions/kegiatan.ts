'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'

export async function getKegiatan() {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('kegiatan')
    .select('*')
    .order('tanggal_pelaksanaan', { ascending: false })
  
  if (error) {
    console.error('Error fetching kegiatan:', error)
    return []
  }
  return data
}

export async function createKegiatan(formData: FormData) {
  const supabase = await createClient()
  
  const judul = formData.get('judul') as string
  const deskripsi = formData.get('deskripsi') as string
  const tanggal_pelaksanaan = formData.get('tanggal_pelaksanaan') as string
  const lokasi = formData.get('lokasi') as string
  const status = formData.get('status') as string || 'selesai'
  
  if (!judul || !deskripsi || !tanggal_pelaksanaan) {
    return { error: 'Judul, deskripsi, dan tanggal harus diisi' }
  }

  // Generate a simple slug
  const slug = judul.toLowerCase().replace(/[^a-z0-9]+/g, '-') + '-' + Math.floor(Math.random() * 1000)

  // Get current user (admin)
  const { data: { user } } = await supabase.auth.getUser()
  
  let adminId = null
  if (user) {
    const { data: admin } = await supabase.from('admins').select('id').eq('user_id', user.id).single()
    if (admin) adminId = admin.id
  }

  const { error } = await supabase
    .from('kegiatan')
    .insert({
      judul,
      slug,
      deskripsi,
      tanggal_pelaksanaan,
      lokasi,
      status,
      created_by: adminId
    })

  if (error) {
    return { error: error.message }
  }

  revalidatePath('/dashboard/kegiatan')
  revalidatePath('/kegiatan')
  return { success: true }
}

export async function deleteKegiatan(id: string) {
  const supabase = await createClient()
  const { error } = await supabase.from('kegiatan').delete().eq('id', id)
  
  if (error) {
    return { error: error.message }
  }
  
  revalidatePath('/dashboard/kegiatan')
  revalidatePath('/kegiatan')
  return { success: true }
}
