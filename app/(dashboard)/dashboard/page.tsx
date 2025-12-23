import { auth } from '@clerk/nextjs/server'
import { Header } from '@/components/dashboard/header'
import { DashboardMetrics } from '@/components/dashboard/dashboard-metrics'
import { RecentActivity } from '@/components/dashboard/recent-activity'
import { FinancialCharts } from '@/components/dashboard/financial-charts'

export const dynamic = 'force-dynamic'

export default async function DashboardPage() {
  const { userId } = await auth()

  if (!userId) {
    return null
  }

  return (
    <div className="flex flex-col min-h-screen">
      <Header 
        title="Dashboard"
        description="Track your startup's financial health at a glance"
      />
      
      <div className="flex-1 p-6 space-y-8 pb-12">
        {/* Real Metrics from Database */}
        <DashboardMetrics />

        {/* Recent Activity */}
        <RecentActivity />

        {/* Financial Charts */}
        <FinancialCharts />
      </div>
    </div>
  )
}