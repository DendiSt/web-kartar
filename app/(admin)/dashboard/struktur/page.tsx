import { getStruktur } from '@/app/actions/struktur'
import StrukturClient from '@/components/admin/StrukturClient'

export const dynamic = 'force-dynamic'

export const metadata = {
  title: 'Struktur Organisasi | Tirtajaya 01'
}

export default async function StrukturPage() {
  const data = await getStruktur()
  
  return (
    <StrukturClient data={data} />
  )
}
