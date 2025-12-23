'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { 
  DollarSign, 
  TrendingUp, 
  TrendingDown, 
  Clock, 
  AlertCircle,
  BarChart3,
  PieChart
} from 'lucide-react'

interface DashboardMetrics {
  totalBalance: number
  monthlyBurn: number
  runwayMonths: number
  pendingExpenses: number
  pendingTotal: number
  totalRaised: number
  totalExpenses: number
  investmentCount: number
  burnRateChange: number
}

interface ExpensesByStatus {
  status: string
  count: number
  total: number
}

export function DashboardMetrics() {
  const [metrics, setMetrics] = useState<DashboardMetrics | null>(null)
  const [trends, setTrends] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchAnalytics()
  }, [])

  const fetchAnalytics = async () => {
    try {
      const response = await fetch('/api/dashboard/analytics')
      if (response.ok) {
        const data = await response.json()
        setMetrics(data.metrics)
        setTrends(data.trends)
      }
    } catch (error) {
      console.error('Error fetching analytics:', error)
    } finally {
      setLoading(false)
    }
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount)
  }

  const formatPercentage = (value: number) => {
    const sign = value >= 0 ? '+' : ''
    return `${sign}${value.toFixed(1)}%`
  }

  const getRunwayColor = (months: number) => {
    if (months >= 12) return 'text-green-600'
    if (months >= 6) return 'text-yellow-600' 
    return 'text-red-600'
  }

  const getBurnRateIcon = (change: number) => {
    return change >= 0 ? TrendingUp : TrendingDown
  }

  const getBurnRateColor = (change: number) => {
    return change >= 0 ? 'text-red-600' : 'text-green-600'
  }

  if (loading) {
    return (
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {[...Array(4)].map((_, i) => (
          <Card key={i}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <div className="h-4 bg-gray-200 rounded w-20 animate-pulse"></div>
            </CardHeader>
            <CardContent>
              <div className="h-8 bg-gray-200 rounded w-24 mb-1 animate-pulse"></div>
              <div className="h-3 bg-gray-200 rounded w-32 animate-pulse"></div>
            </CardContent>
          </Card>
        ))}
      </div>
    )
  }

  if (!metrics) {
    return (
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardContent className="pt-6">
            <div className="text-center text-muted-foreground">
              Unable to load metrics
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  const BurnIcon = getBurnRateIcon(metrics.burnRateChange)

  return (
    <>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {/* Total Balance */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Current Balance</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(metrics.totalBalance)}</div>
            <p className="text-xs text-muted-foreground">
              From {formatCurrency(metrics.totalRaised)} raised
            </p>
          </CardContent>
        </Card>

        {/* Monthly Burn */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Monthly Burn</CardTitle>
            <BurnIcon className={`h-4 w-4 ${getBurnRateColor(metrics.burnRateChange)}`} />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(metrics.monthlyBurn)}</div>
            <p className={`text-xs ${getBurnRateColor(metrics.burnRateChange)}`}>
              {formatPercentage(metrics.burnRateChange)} from last month
            </p>
          </CardContent>
        </Card>

        {/* Runway */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Runway</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className={`text-2xl font-bold ${getRunwayColor(metrics.runwayMonths)}`}>
              {metrics.runwayMonths} months
            </div>
            <p className="text-xs text-muted-foreground">
              At current burn rate
            </p>
          </CardContent>
        </Card>

        {/* Pending Expenses */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending</CardTitle>
            <AlertCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{metrics.pendingExpenses}</div>
            <p className="text-xs text-muted-foreground">
              {formatCurrency(metrics.pendingTotal)} awaiting approval
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Additional Analytics Cards */}
      <div className="grid gap-4 md:grid-cols-2">
        {/* Financial Summary */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <BarChart3 className="w-5 h-5 mr-2" />
              Financial Summary
            </CardTitle>
            <CardDescription>
              Overview of your startup's finances
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Total Raised</span>
              <span className="text-lg font-bold text-green-600">
                {formatCurrency(metrics.totalRaised)}
              </span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div className="bg-green-600 h-2 rounded-full" style={{ width: '100%' }}></div>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Total Spent</span>
              <span className="text-lg font-bold text-red-600">
                {formatCurrency(metrics.totalExpenses)}
              </span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className="bg-red-600 h-2 rounded-full" 
                style={{ 
                  width: `${metrics.totalRaised > 0 ? (metrics.totalExpenses / metrics.totalRaised) * 100 : 0}%` 
                }}
              ></div>
            </div>

            <div className="flex items-center justify-between pt-2 border-t">
              <span className="text-sm font-medium">Remaining Balance</span>
              <span className={`text-lg font-bold ${metrics.totalBalance >= 0 ? 'text-blue-600' : 'text-red-600'}`}>
                {formatCurrency(metrics.totalBalance)}
              </span>
            </div>
          </CardContent>
        </Card>

        {/* Runway Analysis */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <PieChart className="w-5 h-5 mr-2" />
              Runway Analysis
            </CardTitle>
            <CardDescription>
              Burn rate and funding timeline
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600">
                  {metrics.investmentCount}
                </div>
                <p className="text-xs text-muted-foreground">Investment Rounds</p>
              </div>
              <div className="text-center">
                <div className={`text-2xl font-bold ${getRunwayColor(metrics.runwayMonths)}`}>
                  {metrics.runwayMonths}mo
                </div>
                <p className="text-xs text-muted-foreground">Runway Left</p>
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm">Funding Progress</span>
                <span className="text-sm">
                  {metrics.totalRaised > 0 ? Math.round((metrics.totalExpenses / metrics.totalRaised) * 100) : 0}% used
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-gradient-to-r from-green-500 to-yellow-500 h-2 rounded-full" 
                  style={{ 
                    width: `${metrics.totalRaised > 0 ? Math.min((metrics.totalExpenses / metrics.totalRaised) * 100, 100) : 0}%` 
                  }}
                ></div>
              </div>
            </div>

            {metrics.runwayMonths <= 6 && metrics.runwayMonths > 0 && (
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
                <div className="flex items-center space-x-2">
                  <AlertCircle className="w-4 h-4 text-yellow-600" />
                  <span className="text-sm text-yellow-800 font-medium">
                    Low runway warning
                  </span>
                </div>
                <p className="text-xs text-yellow-700 mt-1">
                  Consider reducing burn rate or raising additional funds
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </>
  )
}