import { auth } from '@clerk/nextjs/server'
import { Header } from '@/components/dashboard/header'
import { BudgetList } from '@/components/budgets/budget-list'
import { BudgetOverview } from '@/components/budgets/budget-overview'

export const dynamic = 'force-dynamic'

export default async function BudgetsPage() {
  const { userId } = await auth()

  if (!userId) {
    return null
  }

  return (
    <div className="flex flex-col min-h-screen">
      <Header 
        title="Budget Management"
        description="Create and track budgets to control spending"
      />
      
      <div className="flex-1 p-6 space-y-8 pb-12">
        {/* Budget Overview */}
        <BudgetOverview />

        {/* Budget List */}
        <BudgetList />
      </div>
    </div>
  )
}