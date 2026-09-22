'use client'

import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import { ImageUploader } from './ImageUploader'
import { updateAdminProfile, updatePassword } from '@/app/actions/pengaturan'
import { User, Lock, Eye, EyeOff, Save, Loader2 } from 'lucide-react'

export default function PengaturanClient({ profile }: { profile: any }) {
  const [activeTab, setActiveTab] = useState<'profil' | 'keamanan'>('profil')
  
  // Profile State
  const [fotoUrl, setFotoUrl] = useState(profile?.foto_url || '')
  const [loadingProfile, setLoadingProfile] = useState(false)
  const [profileSuccess, setProfileSuccess] = useState('')

  // Password State
  const [showPassword, setShowPassword] = useState(false)
  const [loadingPassword, setLoadingPassword] = useState(false)
  const [passwordSuccess, setPasswordSuccess] = useState('')
  const [passwordError, setPasswordError] = useState('')

  async function handleUpdateProfile(formData: FormData) {
    setLoadingProfile(true)
    setProfileSuccess('')
    formData.append('foto_url', fotoUrl)
    
    const result = await updateAdminProfile(formData)
    setLoadingProfile(false)
    
    if (result.error) {
      alert(result.error)
    } else {
      setProfileSuccess('Profil berhasil diperbarui!')
      setTimeout(() => setProfileSuccess(''), 3000)
    }
  }

  async function handleUpdatePassword(formData: FormData) {
    setLoadingPassword(true)
    setPasswordSuccess('')
    setPasswordError('')
    
    const result = await updatePassword(formData)
    setLoadingPassword(false)
    
    if (result.error) {
      setPasswordError(result.error)
    } else {
      setPasswordSuccess('Password berhasil diubah! Gunakan password baru ini untuk login berikutnya.')
      // Reset form fields conceptually (controlled components not used here for simplicity, so we just clear via success message)
      const form = document.getElementById('form-password') as HTMLFormElement
      if (form) form.reset()
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-heading font-bold tracking-tight">Pengaturan Akun</h2>
        <p className="text-muted-foreground text-sm mt-1">Kelola informasi profil dan keamanan akun admin Anda.</p>
      </div>

      <div className="flex flex-col md:flex-row gap-6">
        {/* Sidebar Nav */}
        <div className="w-full md:w-64 space-y-1">
          <button 
            onClick={() => setActiveTab('profil')}
            className={`w-full flex items-center gap-2 px-3 py-2 text-sm font-medium rounded-md transition-colors ${
              activeTab === 'profil' ? 'bg-primary text-primary-foreground' : 'hover:bg-muted text-muted-foreground'
            }`}
          >
            <User className="w-4 h-4" /> Profil Admin
          </button>
          <button 
            onClick={() => setActiveTab('keamanan')}
            className={`w-full flex items-center gap-2 px-3 py-2 text-sm font-medium rounded-md transition-colors ${
              activeTab === 'keamanan' ? 'bg-primary text-primary-foreground' : 'hover:bg-muted text-muted-foreground'
            }`}
          >
            <Lock className="w-4 h-4" /> Keamanan & Password
          </button>
        </div>

        {/* Content Area */}
        <div className="flex-1">
          {activeTab === 'profil' && (
            <Card>
              <CardHeader>
                <CardTitle>Profil Admin</CardTitle>
                <CardDescription>
                  Perbarui nama lengkap dan foto profil yang akan ditampilkan di sistem.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form action={handleUpdateProfile} className="space-y-6">
                  
                  <div className="space-y-2">
                    <Label>Foto Profil</Label>
                    <div className="max-w-xs">
                      <ImageUploader 
                        folder="admins"
                        defaultImage={profile?.foto_url}
                        onUploadSuccess={(url) => setFotoUrl(url)}
                      />
                    </div>
                  </div>

                  <div className="grid gap-4 max-w-md">
                    <div className="space-y-2">
                      <Label htmlFor="nama_lengkap">Nama Lengkap</Label>
                      <Input 
                        id="nama_lengkap" 
                        name="nama_lengkap" 
                        defaultValue={profile?.nama_lengkap || ''} 
                        required 
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="email">Email Login (Hanya Baca)</Label>
                      <Input 
                        id="email" 
                        value={profile?.email || ''} 
                        disabled 
                        className="bg-muted/50 cursor-not-allowed"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Role</Label>
                      <Input 
                        value={profile?.role === 'super_admin' ? 'Super Admin' : 'Admin Biasa'} 
                        disabled 
                        className="bg-muted/50 cursor-not-allowed"
                      />
                    </div>
                  </div>

                  {profileSuccess && (
                    <div className="p-3 bg-green-50 text-green-600 text-sm rounded-md border border-green-200">
                      {profileSuccess}
                    </div>
                  )}

                  <Button type="submit" disabled={loadingProfile} className="gap-2">
                    {loadingProfile ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                    Simpan Profil
                  </Button>
                </form>
              </CardContent>
            </Card>
          )}

          {activeTab === 'keamanan' && (
            <Card>
              <CardHeader>
                <CardTitle>Ganti Password</CardTitle>
                <CardDescription>
                  Pastikan akun Anda tetap aman dengan menggunakan password yang kuat dan unik.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form id="form-password" action={handleUpdatePassword} className="space-y-4 max-w-md">
                  <div className="space-y-2">
                    <Label htmlFor="new_password">Password Baru</Label>
                    <div className="relative">
                      <Input 
                        id="new_password" 
                        name="new_password" 
                        type={showPassword ? 'text' : 'password'} 
                        required 
                        minLength={6}
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent text-muted-foreground"
                        onClick={() => setShowPassword(!showPassword)}
                      >
                        {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </Button>
                    </div>
                    <p className="text-xs text-muted-foreground">Minimal 6 karakter.</p>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="confirm_password">Konfirmasi Password Baru</Label>
                    <div className="relative">
                      <Input 
                        id="confirm_password" 
                        name="confirm_password" 
                        type={showPassword ? 'text' : 'password'} 
                        required 
                        minLength={6}
                      />
                    </div>
                  </div>

                  {passwordError && (
                    <div className="p-3 bg-red-50 text-red-600 text-sm rounded-md border border-red-200">
                      {passwordError}
                    </div>
                  )}

                  {passwordSuccess && (
                    <div className="p-3 bg-green-50 text-green-600 text-sm rounded-md border border-green-200">
                      {passwordSuccess}
                    </div>
                  )}

                  <Button type="submit" disabled={loadingPassword} className="gap-2 mt-2">
                    {loadingPassword ? <Loader2 className="w-4 h-4 animate-spin" /> : <Lock className="w-4 h-4" />}
                    Perbarui Password
                  </Button>
                </form>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  )
}
