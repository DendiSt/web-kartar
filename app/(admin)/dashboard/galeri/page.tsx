import { getGaleriList, getGaleriAlbums } from '@/app/actions/galeri'
import GaleriClient from '@/components/admin/GaleriClient'

export const dynamic = 'force-dynamic'

export const metadata = {
  title: 'Kelola Galeri & Dokumentasi | Admin Tirtajaya 01'
}

export default async function DashboardGaleriPage() {
  const [items, albums] = await Promise.all([
    getGaleriList(),
    getGaleriAlbums()
  ])

  return <GaleriClient initialItems={items} albums={albums} />
}
