import { getAdminProfile } from '@/app/actions/pengaturan'
import PengaturanClient from '@/components/admin/PengaturanClient'

export const dynamic = 'force-dynamic'

export const metadata = {
  title: 'Pengaturan Admin | Tirtajaya 01'
}

export default async function PengaturanPage() {
  const profile = await getAdminProfile()
  
  return (
    <PengaturanClient profile={profile} />
  )
}
