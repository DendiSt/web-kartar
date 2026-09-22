import { createServerClient, type CookieOptions } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

export async function middleware(request: NextRequest) {
  let supabaseResponse = NextResponse.next({
    request,
  })

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll()
        },
        setAll(cookiesToSet: { name: string; value: string; options: CookieOptions }[]) {
          cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value))
          supabaseResponse = NextResponse.next({
            request,
          })
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          )
        },
      },
    }
  )

  // Melakukan refresh session jika dibutuhkan dan mendapatkan user
  const {
    data: { user },
  } = await supabase.auth.getUser()

  // 1. Proteksi route /dashboard (Admin Area)
  if (request.nextUrl.pathname.startsWith('/dashboard')) {
    if (!user) {
      // Jika belum login, redirect ke halaman login
      return NextResponse.redirect(new URL('/login', request.url))
    }

    // Cek apakah user yang login terdaftar di tabel admins
    const { data: admin } = await supabase
      .from('admins')
      .select('*')
      .eq('user_id', user.id)
      .single()

    if (!admin) {
      // Jika login tapi bukan admin, kembalikan ke halaman utama
      return NextResponse.redirect(new URL('/', request.url))
    }
  }

  // 2. Redirect admin yang sudah login agar tidak bisa mengakses halaman /login lagi
  if (request.nextUrl.pathname.startsWith('/login')) {
    if (user) {
      const { data: admin } = await supabase
        .from('admins')
        .select('*')
        .eq('user_id', user.id)
        .single()
        
      if (admin) {
        return NextResponse.redirect(new URL('/dashboard', request.url))
      }
    }
  }

  return supabaseResponse
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - images, dll (public assets)
     */
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}
