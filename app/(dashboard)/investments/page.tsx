import { auth } from '@clerk/nextjs/server'
import { Header } from '@/components/dashboard/header'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { InvestmentList } from '@/components/investments/investment-list'
import { Plus, TrendingUp, Users, DollarSign, Percent } from 'lucide-react'
import Link from 'next/link'

export const dynamic = 'force-dynamic'

export default async function InvestmentsPage() {
  const { userId } = await auth()

  if (!userId) {
    return null
  }

  return (
    <div className="flex flex-col h-full">
      <Header 
        title="Investments"
        description="Track funding rounds and equity ownership"
      />
      
      <div className="flex-1 p-6 space-y-8">
        {/* Quick Actions */}
        <div className="flex justify-between items-center">
          <div className="flex gap-4">
            <Link href="/investments/new">
              <Button>
                <Plus className="w-4 h-4 mr-2" />
                Add Investment
              </Button>
            </Link>
          </div>
        </div>

        {/* Investment Stats */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Raised</CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">$150,000</div>
              <p className="text-xs text-muted-foreground">
                Across 2 rounds
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Valuation</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">$600K</div>
              <p className="text-xs text-muted-foreground">
                Post-money
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Equity Diluted</CardTitle>
              <Percent className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">25%</div>
              <p className="text-xs text-muted-foreground">
                Founders retain 75%
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Investors</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">4</div>
              <p className="text-xs text-muted-foreground">
                Active investors
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Cap Table Overview */}
        <div className="grid gap-4 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>Cap Table</CardTitle>
              <CardDescription>Current ownership breakdown</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="font-medium">Founders</span>
                <span className="text-2xl font-bold">75%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div className="bg-blue-600 h-2 rounded-full" style={{ width: '75%' }}></div>
              </div>
              
              <div className="flex items-center justify-between">
                <span className="font-medium">Seed Investors</span>
                <span className="text-2xl font-bold">20%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div className="bg-green-600 h-2 rounded-full" style={{ width: '20%' }}></div>
              </div>

              <div className="flex items-center justify-between">
                <span className="font-medium">Employee Pool</span>
                <span className="text-2xl font-bold">5%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div className="bg-purple-600 h-2 rounded-full" style={{ width: '5%' }}></div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Funding Progress</CardTitle>
              <CardDescription>Runway and milestones</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Current Runway</span>
                  <span className="text-sm">18 months</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div className="bg-orange-600 h-2 rounded-full" style={{ width: '60%' }}></div>
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Next Milestone</span>
                  <span className="text-sm">Series A Target</span>
                </div>
                <p className="text-xs text-muted-foreground">
                  Planning $1M Series A round in 12 months
                </p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Investments List */}
        <InvestmentList />
      </div>
    </div>
  )
}