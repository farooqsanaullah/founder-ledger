import { auth } from '@clerk/nextjs/server'
import { Header } from '@/components/dashboard/header'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { ExpenseList } from '@/components/expenses/expense-list'
import { Plus } from 'lucide-react'
import Link from 'next/link'

export const dynamic = 'force-dynamic'

export default async function ExpensesPage() {
  const { userId } = await auth()

  if (!userId) {
    return null
  }

  return (
    <div className="flex flex-col h-full">
      <Header 
        title="Expenses"
        description="Track and manage your startup expenses"
      />
      
      <div className="flex-1 p-6 space-y-8">
        {/* Quick Actions */}
        <div className="flex justify-between items-center">
          <div className="flex gap-4">
            <Link href="/expenses/new">
              <Button>
                <Plus className="w-4 h-4 mr-2" />
                Add Expense
              </Button>
            </Link>
          </div>
        </div>

        {/* Expense Stats */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">This Month</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">$2,350</div>
              <p className="text-xs text-muted-foreground">
                +4% from last month
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Pending Approval</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">3</div>
              <p className="text-xs text-muted-foreground">
                $456 total
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Reimbursements</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">$128</div>
              <p className="text-xs text-muted-foreground">
                2 pending
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Top Category</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">Software</div>
              <p className="text-xs text-muted-foreground">
                $1,240 this month
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Expenses List */}
        <ExpenseList />
      </div>
    </div>
  )
}