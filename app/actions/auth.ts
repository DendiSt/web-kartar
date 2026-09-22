'use server'

import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'

export async function login(formData: FormData) {
  const email = formData.get('email') as string
  const password = formData.get('password') as string

  if (!email || !password) {
    return { error: 'Email dan password harus diisi' }
  }

  const supabase = await createClient()

  // Authenticate user
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  })

  if (error) {
    console.error('Auth error:', error.message)
    return { error: 'Kredensial tidak valid atau akun tidak ditemukan' }
  }

  // Use the access token from the sign-in response to query admins
  // This avoids RLS issues where the cookie hasn't been set yet
  const cookieStore = await cookies()
  const supabaseWithAuth = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll()
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options)
            )
          } catch {
            // ignore in Server Component
          }
        },
      },
      global: {
        headers: {
          Authorization: `Bearer ${data.session.access_token}`,
        },
      },
    }
  )

  // Now query admins with the authenticated token
  const { data: adminData, error: adminError } = await supabaseWithAuth
    .from('admins')
    .select('*')
    .eq('user_id', data.user.id)
    .single()

  if (adminError) {
    console.error('Admin check error:', adminError.message)
  }

  if (!adminData) {
    await supabase.auth.signOut()
    return { error: 'Anda tidak memiliki akses admin' }
  }

  redirect('/dashboard')
}

export async function logout() {
  const supabase = await createClient()
  await supabase.auth.signOut()
  redirect('/login')
}
