'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'

export async function getAdminProfile() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  
  if (!user) return null

  const { data } = await supabase
    .from('admins')
    .select('*')
    .eq('user_id', user.id)
    .single()
    
  return data
}

export async function updateAdminProfile(formData: FormData) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  
  if (!user) return { error: 'Tidak ada sesi aktif' }

  const nama_lengkap = formData.get('nama_lengkap') as string
  const foto_url = formData.get('foto_url') as string
  
  if (!nama_lengkap) {
    return { error: 'Nama lengkap wajib diisi' }
  }

  const { error } = await supabase
    .from('admins')
    .update({ nama_lengkap, foto_url })
    .eq('user_id', user.id)

  if (error) {
    return { error: error.message }
  }

  revalidatePath('/dashboard/pengaturan')
  revalidatePath('/dashboard') // Also updates sidebar if we fetch from there
  return { success: true }
}

export async function updatePassword(formData: FormData) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  
  if (!user) return { error: 'Tidak ada sesi aktif' }

  const new_password = formData.get('new_password') as string
  const confirm_password = formData.get('confirm_password') as string
  
  if (!new_password || new_password.length < 6) {
    return { error: 'Password baru minimal 6 karakter' }
  }
  
  if (new_password !== confirm_password) {
    return { error: 'Konfirmasi password tidak cocok' }
  }

  // Update password in Supabase Auth
  const { error } = await supabase.auth.updateUser({
    password: new_password
  })

  if (error) {
    return { error: error.message }
  }

  return { success: true }
}
