import {
  getLaporanKeuanganData,
  getLaporanKegiatanData,
  getLaporanAnggotaData,
  getOrganisasiInfo
} from '@/app/actions/laporan'
import LaporanClient from '@/components/admin/LaporanClient'

export const dynamic = 'force-dynamic'

export const metadata = {
  title: 'Pusat Laporan & Cetak | Admin Karang Taruna',
  description: 'Pusat cetak dokumen resmi, rekapitulasi keuangan, dan ekspor data Karang Taruna Tirtajaya 01'
}

export default async function DashboardLaporanPage() {
  const [keuanganData, kegiatanData, anggotaData, orgInfo] = await Promise.all([
    getLaporanKeuanganData(),
    getLaporanKegiatanData(),
    getLaporanAnggotaData(),
    getOrganisasiInfo()
  ])

  return (
    <div className="space-y-6">
      <div className="print:hidden">
        <h1 className="text-2xl font-bold tracking-tight">Pusat Laporan & Ekspor Dokumen</h1>
        <p className="text-sm text-muted-foreground mt-1">
          Cetak berkas resmi organisasi berformat kop surat standar atau ekspor rekapitulasi data ke format Excel (CSV).
        </p>
      </div>

      <LaporanClient
        keuanganData={keuanganData}
        kegiatanData={kegiatanData}
        anggotaData={anggotaData}
        orgInfo={orgInfo}
      />
    </div>
  )
}
