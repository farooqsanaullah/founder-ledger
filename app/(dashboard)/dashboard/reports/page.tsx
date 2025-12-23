import { auth } from '@clerk/nextjs/server'
import { Header } from '@/components/dashboard/header'
import { ReportsOverview } from '@/components/reports/reports-overview'
import { ReportsFilters } from '@/components/reports/reports-filters'
import { FinancialSummary } from '@/components/reports/financial-summary'
import { ExpenseReports } from '@/components/reports/expense-reports'
import { InvestmentReports } from '@/components/reports/investment-reports'
import { BudgetReports } from '@/components/reports/budget-reports'
import { TaxReports } from '@/components/reports/tax-reports'

export const dynamic = 'force-dynamic'

export default async function ReportsPage() {
  const { userId } = await auth()

  if (!userId) {
    return null
  }

  return (
    <div className="flex flex-col min-h-screen">
      <Header 
        title="Reports & Analytics"
        description="Comprehensive financial reports and insights"
      />
      
      <div className="flex-1 p-6 space-y-8 pb-12">
        {/* Reports Overview */}
        <ReportsOverview />

        {/* Filters */}
        <ReportsFilters />

        {/* Financial Summary */}
        <FinancialSummary />

        {/* Report Sections */}
        <div className="grid gap-8 lg:grid-cols-1">
          <ExpenseReports />
          <InvestmentReports />
          <BudgetReports />
          <TaxReports />
        </div>
      </div>
    </div>
  )
}