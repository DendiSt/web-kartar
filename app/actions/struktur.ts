'use server'

import { prisma } from '@/lib/prisma'
import { revalidatePath } from 'next/cache'

export async function getStruktur() {
  try {
    const data = await prisma.strukturOrganisasi.findMany({
      orderBy: { urutan: 'asc' }
    })
    return data
  } catch (error) {
    console.error('Error fetching struktur:', error)
    return []
  }
}

export async function createStruktur(formData: FormData) {
  const nama_lengkap = formData.get('nama_lengkap') as string
  const jabatan = formData.get('jabatan') as string
  const periode = formData.get('periode') as string
  const divisi = (formData.get('divisi') as string) || null
  const urutan = parseInt((formData.get('urutan') as string) || '0')
  const foto_url = (formData.get('foto_url') as string) || null
  const no_telepon = (formData.get('no_telepon') as string) || null
  const email = (formData.get('email') as string) || null
  const is_active = formData.get('is_active') !== 'false'

  if (!nama_lengkap || !jabatan || !periode) {
    return { error: 'Nama, jabatan, dan periode harus diisi' }
  }

  try {
    await prisma.strukturOrganisasi.create({
      data: {
        nama_lengkap,
        jabatan,
        periode,
        divisi,
        urutan,
        foto_url,
        no_telepon,
        email,
        is_active
      }
    })

    revalidatePath('/dashboard/struktur')
    revalidatePath('/struktur')
    return { success: true }
  } catch (error: any) {
    return { error: error.message }
  }
}

export async function updateStruktur(formData: FormData) {
  const id = formData.get('id') as string
  const nama_lengkap = formData.get('nama_lengkap') as string
  const jabatan = formData.get('jabatan') as string
  const periode = formData.get('periode') as string
  const divisi = (formData.get('divisi') as string) || null
  const urutan = parseInt((formData.get('urutan') as string) || '0')
  const foto_url = (formData.get('foto_url') as string) || null
  const no_telepon = (formData.get('no_telepon') as string) || null
  const email = (formData.get('email') as string) || null
  const is_active = formData.get('is_active') !== 'false'

  if (!id || !nama_lengkap || !jabatan || !periode) {
    return { error: 'Nama, jabatan, dan periode harus diisi' }
  }

  try {
    await prisma.strukturOrganisasi.update({
      where: { id },
      data: {
        nama_lengkap,
        jabatan,
        periode,
        divisi,
        urutan,
        foto_url,
        no_telepon,
        email,
        is_active
      }
    })

    revalidatePath('/dashboard/struktur')
    revalidatePath('/struktur')
    return { success: true }
  } catch (error: any) {
    return { error: error.message }
  }
}

export async function deleteStruktur(id: string) {
  try {
    await prisma.strukturOrganisasi.delete({
      where: { id }
    })

    revalidatePath('/dashboard/struktur')
    revalidatePath('/struktur')
    return { success: true }
  } catch (error: any) {
    return { error: error.message }
  }
}
