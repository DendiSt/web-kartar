import { getBeritaList } from '@/app/actions/berita'
import BeritaClient from '@/components/admin/BeritaClient'

export const dynamic = 'force-dynamic'

export default async function BeritaAdminPage() {
  const data = await getBeritaList()
  
  return <BeritaClient data={data} />
}
