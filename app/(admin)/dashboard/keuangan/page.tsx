import { getKeuangan, getSaldoKas } from '@/app/actions/keuangan'
import KeuanganClient from '@/components/admin/KeuanganClient'

export const metadata = {
  title: 'Manajemen Keuangan | Tirtajaya 01'
}

export default async function KeuanganPage() {
  const data = await getKeuangan()
  const saldo = await getSaldoKas()
  
  return (
    <KeuanganClient data={data} saldo={saldo} />
  )
}
