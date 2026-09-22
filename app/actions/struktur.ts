'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'

export async function getStruktur() {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('struktur_organisasi')
    .select('*')
    .order('urutan', { ascending: true })
  
  if (error) {
    console.error('Error fetching struktur:', error)
    return []
  }
  return data
}

export async function createStruktur(formData: FormData) {
  const supabase = await createClient()
  
  const nama_lengkap = formData.get('nama_lengkap') as string
  const jabatan = formData.get('jabatan') as string
  const periode = formData.get('periode') as string
  const divisi = formData.get('divisi') as string || null
  const urutan = parseInt(formData.get('urutan') as string || '0')
  const foto_url = formData.get('foto_url') as string || null
  const no_telepon = formData.get('no_telepon') as string || null
  const email = formData.get('email') as string || null
  const is_active = formData.get('is_active') !== 'false'
  
  if (!nama_lengkap || !jabatan || !periode) {
    return { error: 'Nama, jabatan, dan periode harus diisi' }
  }

  const { error } = await supabase
    .from('struktur_organisasi')
    .insert({
      nama_lengkap,
      jabatan,
      periode,
      divisi,
      urutan,
      foto_url,
      no_telepon,
      email,
      is_active
    })

  if (error) {
    return { error: error.message }
  }

  revalidatePath('/dashboard/struktur')
  revalidatePath('/struktur')
  return { success: true }
}

export async function deleteStruktur(id: string) {
  const supabase = await createClient()
  const { error } = await supabase.from('struktur_organisasi').delete().eq('id', id)
  
  if (error) {
    return { error: error.message }
  }
  
  revalidatePath('/dashboard/struktur')
  revalidatePath('/struktur')
  return { success: true }
}
