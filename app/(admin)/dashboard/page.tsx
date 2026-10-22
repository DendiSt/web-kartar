import { getDashboardAnalytics } from '@/app/actions/analytics'
import DashboardAnalyticsClient from '@/components/admin/analytics/DashboardAnalyticsClient'

export const dynamic = 'force-dynamic'

export const metadata = {
  title: 'Dashboard Analitik & Pusat Kendali | Tirtajaya 01'
}

export default async function DashboardOverview() {
  const analyticsData = await getDashboardAnalytics()

  return <DashboardAnalyticsClient data={analyticsData} />
}
