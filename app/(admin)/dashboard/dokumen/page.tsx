import { getDokumenList } from '@/app/actions/dokumen'
import DokumenClient from '@/components/admin/DokumenClient'

export const dynamic = 'force-dynamic'

export default async function DokumenAdminPage() {
  const data = await getDokumenList()
  
  return <DokumenClient data={data} />
}
