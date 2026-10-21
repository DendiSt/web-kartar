import { getKegiatan } from '@/app/actions/kegiatan'
import KegiatanClient from '@/components/admin/KegiatanClient'

export const dynamic = 'force-dynamic'

export default async function KegiatanPage() {
  const data = await getKegiatan()
  
  return <KegiatanClient data={data} />
}
