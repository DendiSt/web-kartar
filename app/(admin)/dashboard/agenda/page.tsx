import { getAgenda } from '@/app/actions/agenda'
import AgendaClient from '@/components/admin/AgendaClient'

export const metadata = {
  title: 'Manajemen Agenda | Tirtajaya 01'
}

export default async function AgendaPage() {
  const data = await getAgenda()
  
  return (
    <AgendaClient data={data} />
  )
}
