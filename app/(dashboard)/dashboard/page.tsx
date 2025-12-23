import { auth } from '@clerk/nextjs/server'
import { Header } from '@/components/dashboard/header'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'

export const dynamic = 'force-dynamic'

export default async function DashboardPage() {
  const { userId } = await auth()

  if (!userId) {
    return null
  }

  return (
    <div className="flex flex-col h-full">
      <Header 
        title="Dashboard"
        description="Track your startup's financial health at a glance"
      />
      
      <div className="flex-1 p-6 space-y-8">
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Balance</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">$45,231.89</div>
              <p className="text-xs text-muted-foreground">
                +20.1% from last month
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Monthly Burn</CardTitle>
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
              <CardTitle className="text-sm font-medium">Runway</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">19 months</div>
              <p className="text-xs text-muted-foreground">
                At current burn rate
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Pending</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">3</div>
              <p className="text-xs text-muted-foreground">
                Expenses awaiting approval
              </p>
            </CardContent>
          </Card>
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
          <Card className="col-span-4">
            <CardHeader>
              <CardTitle>Recent Expenses</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                No expenses yet. Add your first expense to get started.
              </p>
            </CardContent>
          </Card>

          <Card className="col-span-3">
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
              <CardDescription>
                Get started with FounderLedger
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="rounded-lg border p-3">
                <h4 className="font-medium">Add First Expense</h4>
                <p className="text-sm text-muted-foreground">
                  Track your startup expenses
                </p>
              </div>
              <div className="rounded-lg border p-3">
                <h4 className="font-medium">Invite Co-founder</h4>
                <p className="text-sm text-muted-foreground">
                  Collaborate with your team
                </p>
              </div>
              <div className="rounded-lg border p-3">
                <h4 className="font-medium">Setup Payment Methods</h4>
                <p className="text-sm text-muted-foreground">
                  Add cards and accounts
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}