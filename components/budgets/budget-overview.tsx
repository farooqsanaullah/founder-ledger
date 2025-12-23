'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import {
  PieChart,
  Plus,
  AlertTriangle,
  TrendingUp,
  TrendingDown,
  DollarSign,
  Calendar,
  Target
} from 'lucide-react'
import { useStartup } from '@/hooks/use-startup'

interface BudgetSummary {
  totalBudgets: number
  activeBudgets: number
  totalAllocated: number
  totalSpent: number
  averageUtilization: number
  alertingBudgets: number
}

export function BudgetOverview() {
  const [summary, setSummary] = useState<BudgetSummary | null>(null)
  const [loading, setLoading] = useState(true)
  const { currentStartup } = useStartup()

  useEffect(() => {
    if (currentStartup?.id) {
      fetchBudgetSummary()
    }
  }, [currentStartup?.id])

  const fetchBudgetSummary = async () => {
    try {
      // This would fetch summary data from an API endpoint
      // For now, using mock data
      const mockSummary: BudgetSummary = {
        totalBudgets: 4,
        activeBudgets: 3,
        totalAllocated: 50000,
        totalSpent: 32500,
        averageUtilization: 65,
        alertingBudgets: 1
      }
      
      setSummary(mockSummary)
    } catch (error) {
      console.error('Error fetching budget summary:', error)
    } finally {
      setLoading(false)
    }
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount)
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

  if (!summary) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <PieChart className="w-5 h-5 mr-2" />
            Budget Overview
          </CardTitle>
          <CardDescription>
            Track your budget performance and spending
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <Target className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
            <p className="text-muted-foreground mb-4">No budgets created yet</p>
            <Button>
              <Plus className="w-4 h-4 mr-2" />
              Create Your First Budget
            </Button>
          </div>
        </CardContent>
      </Card>
    )
  }

  const utilizationColor = summary.averageUtilization > 80 ? 'text-red-600' : 
                          summary.averageUtilization > 60 ? 'text-yellow-600' : 
                          'text-green-600'

  const remaining = summary.totalAllocated - summary.totalSpent
  const utilizationPercentage = summary.totalAllocated > 0 ? 
    (summary.totalSpent / summary.totalAllocated) * 100 : 0

  return (
    <>
      {/* Budget Summary Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {/* Total Allocated */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Allocated</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(summary.totalAllocated)}</div>
            <p className="text-xs text-muted-foreground">
              Across {summary.totalBudgets} budgets
            </p>
          </CardContent>
        </Card>

        {/* Total Spent */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Spent</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(summary.totalSpent)}</div>
            <p className="text-xs text-muted-foreground">
              {summary.activeBudgets} active budgets
            </p>
          </CardContent>
        </Card>

        {/* Remaining Budget */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Remaining</CardTitle>
            <TrendingDown className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className={`text-2xl font-bold ${remaining >= 0 ? 'text-green-600' : 'text-red-600'}`}>
              {formatCurrency(remaining)}
            </div>
            <p className="text-xs text-muted-foreground">
              {Math.round(utilizationPercentage)}% utilized
            </p>
          </CardContent>
        </Card>

        {/* Alerts */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Alerts</CardTitle>
            <AlertTriangle className={`h-4 w-4 ${summary.alertingBudgets > 0 ? 'text-red-500' : 'text-muted-foreground'}`} />
          </CardHeader>
          <CardContent>
            <div className={`text-2xl font-bold ${summary.alertingBudgets > 0 ? 'text-red-600' : 'text-green-600'}`}>
              {summary.alertingBudgets}
            </div>
            <p className="text-xs text-muted-foreground">
              {summary.alertingBudgets > 0 ? 'Budgets over threshold' : 'All budgets on track'}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Detailed Budget Health */}
      <div className="grid gap-6 md:grid-cols-2">
        {/* Overall Budget Health */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Target className="w-5 h-5 mr-2" />
              Budget Health
            </CardTitle>
            <CardDescription>
              Overall spending vs allocated budgets
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span>Budget Utilization</span>
                <span className={utilizationColor}>
                  {Math.round(utilizationPercentage)}%
                </span>
              </div>
              <Progress 
                value={utilizationPercentage} 
                className="w-full"
              />
            </div>
            
            <div className="grid grid-cols-2 gap-4 pt-4">
              <div>
                <div className="text-2xl font-bold text-blue-600">
                  {formatCurrency(summary.totalAllocated)}
                </div>
                <p className="text-sm text-muted-foreground">Allocated</p>
              </div>
              <div>
                <div className="text-2xl font-bold text-green-600">
                  {formatCurrency(summary.totalSpent)}
                </div>
                <p className="text-sm text-muted-foreground">Spent</p>
              </div>
            </div>

            {summary.alertingBudgets > 0 && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-3 mt-4">
                <div className="flex items-center space-x-2">
                  <AlertTriangle className="w-4 h-4 text-red-600" />
                  <span className="text-sm text-red-800 font-medium">
                    Budget Alert
                  </span>
                </div>
                <p className="text-xs text-red-700 mt-1">
                  {summary.alertingBudgets} budget{summary.alertingBudgets === 1 ? ' is' : 's are'} approaching or exceeding their limits
                </p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Calendar className="w-5 h-5 mr-2" />
              Quick Actions
            </CardTitle>
            <CardDescription>
              Manage your budgets efficiently
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <Button className="w-full justify-start">
              <Plus className="w-4 h-4 mr-2" />
              Create New Budget
            </Button>
            
            <Button variant="outline" className="w-full justify-start">
              <PieChart className="w-4 h-4 mr-2" />
              View Budget Reports
            </Button>
            
            <Button variant="outline" className="w-full justify-start">
              <AlertTriangle className="w-4 h-4 mr-2" />
              Configure Alerts
            </Button>

            <div className="border-t pt-3 mt-3">
              <h4 className="font-medium mb-2">Budget Status</h4>
              <div className="grid grid-cols-2 gap-2 text-sm">
                <div className="flex items-center justify-between">
                  <span>Active:</span>
                  <Badge variant="outline" className="text-green-600">
                    {summary.activeBudgets}
                  </Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span>Total:</span>
                  <Badge variant="secondary">
                    {summary.totalBudgets}
                  </Badge>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </>
  )
}