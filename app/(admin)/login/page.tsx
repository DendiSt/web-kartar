'use client'

import { useState } from 'react'
import { login } from '@/app/actions/auth'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import Link from 'next/link'
import { Eye, EyeOff } from 'lucide-react'

export default function LoginPage() {
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)

  async function handleSubmit(formData: FormData) {
    setLoading(true)
    setError(null)
    const result = await login(formData)
    
    // login function will redirect on success, so we only handle errors here
    if (result?.error) {
      setError(result.error)
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-muted/40 p-4">
      <Card className="w-full max-w-md shadow-lg border-none bg-background/80 backdrop-blur-sm">
        <CardHeader className="text-center">
          <div className="flex justify-center mb-4">
            {/* Menggunakan fallback ekstensi .png atau .webp yang sudah ada */}
            <img src="/images/logo.png" alt="Logo" className="h-20 w-auto object-contain drop-shadow-sm" />
          </div>
          <CardTitle className="font-heading text-2xl font-bold text-primary">Login Admin</CardTitle>
          <CardDescription>
            Masukkan kredensial Anda untuk mengelola website Tirtajaya 01
          </CardDescription>
        </CardHeader>
        <form action={handleSubmit}>
          <CardContent className="space-y-4">
            {error && (
              <div className="bg-destructive/10 border border-destructive/20 text-destructive text-sm p-3 rounded-md text-center">
                {error}
              </div>
            )}
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input id="email" name="email" type="email" placeholder="admin@tirtajaya01.id" required className="bg-background" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <div className="relative">
                <Input 
                  id="password" 
                  name="password" 
                  type={showPassword ? "text" : "password"} 
                  required 
                  className="bg-background pr-10" 
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground focus:outline-none"
                  aria-label={showPassword ? "Sembunyikan password" : "Tampilkan password"}
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>
          </CardContent>
          <CardFooter className="flex flex-col gap-4 mt-2">
            <Button type="submit" className="w-full rounded-full" disabled={loading}>
              {loading ? 'Memverifikasi...' : 'Masuk Dashboard'}
            </Button>
            <Link href="/" className="text-sm text-muted-foreground hover:text-primary transition-colors mt-2">
              &larr; Kembali ke Beranda
            </Link>
          </CardFooter>
        </form>
      </Card>
    </div>
  )
}
