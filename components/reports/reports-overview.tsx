'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import {
  FileText,
  Download,
  Calendar,
  DollarSign,
  TrendingUp,
  TrendingDown,
  BarChart3,
  PieChart,
  FileBarChart,
  FileSpreadsheet
} from 'lucide-react'

interface ReportSummary {
  totalExpenses: number
  totalInvestments: number
  netPosition: number
  expenseCount: number
  investmentCount: number
  burnRate: number
  runway: number
}

export function ReportsOverview() {
  const [summary, setSummary] = useState<ReportSummary | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchReportSummary()
  }, [])

  const fetchReportSummary = async () => {
    try {
      // This would fetch from the reports API
      // For now, using mock data
      const mockSummary: ReportSummary = {
        totalExpenses: 45000,
        totalInvestments: 150000,
        netPosition: 105000,
        expenseCount: 156,
        investmentCount: 3,
        burnRate: 15000,
        runway: 10
      }
      
      setSummary(mockSummary)
    } catch (error) {
      console.error('Error fetching report summary:', error)
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

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
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
        <CardContent className="pt-6">
          <div className="text-center text-muted-foreground">
            Unable to load report summary
          </div>
        </CardContent>
      </Card>
    )
  }

  const netPositionColor = summary.netPosition >= 0 ? 'text-green-600' : 'text-red-600'

  return (
    <>
      {/* Key Metrics */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {/* Total Expenses */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Expenses</CardTitle>
            <TrendingDown className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">{formatCurrency(summary.totalExpenses)}</div>
            <p className="text-xs text-muted-foreground">
              {summary.expenseCount} transactions
            </p>
          </CardContent>
        </Card>

        {/* Total Investments */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Raised</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{formatCurrency(summary.totalInvestments)}</div>
            <p className="text-xs text-muted-foreground">
              {summary.investmentCount} funding rounds
            </p>
          </CardContent>
        </Card>

        {/* Net Position */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Net Position</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className={`text-2xl font-bold ${netPositionColor}`}>
              {formatCurrency(summary.netPosition)}
            </div>
            <p className="text-xs text-muted-foreground">
              Remaining capital
            </p>
          </CardContent>
        </Card>

        {/* Runway */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Runway</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">{summary.runway} months</div>
            <p className="text-xs text-muted-foreground">
              At current burn rate
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Report Actions */}
      <div className="grid gap-6 md:grid-cols-2">
        {/* Quick Reports */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <FileText className="w-5 h-5 mr-2" />
              Quick Reports
            </CardTitle>
            <CardDescription>
              Generate commonly used reports
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <Button variant="outline" className="w-full justify-start">
              <BarChart3 className="w-4 h-4 mr-2" />
              Monthly Expense Report
            </Button>
            <Button variant="outline" className="w-full justify-start">
              <PieChart className="w-4 h-4 mr-2" />
              Category Breakdown
            </Button>
            <Button variant="outline" className="w-full justify-start">
              <TrendingUp className="w-4 h-4 mr-2" />
              Investment Summary
            </Button>
            <Button variant="outline" className="w-full justify-start">
              <FileBarChart className="w-4 h-4 mr-2" />
              Budget vs Actual
            </Button>
          </CardContent>
        </Card>

        {/* Export Options */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Download className="w-5 h-5 mr-2" />
              Export Data
            </CardTitle>
            <CardDescription>
              Export your financial data in various formats
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <Button variant="outline" className="w-full justify-start">
              <FileText className="w-4 h-4 mr-2" />
              Export to PDF
            </Button>
            <Button variant="outline" className="w-full justify-start">
              <FileSpreadsheet className="w-4 h-4 mr-2" />
              Export to Excel
            </Button>
            <Button variant="outline" className="w-full justify-start">
              <FileSpreadsheet className="w-4 h-4 mr-2" />
              Export to CSV
            </Button>

            <div className="border-t pt-3">
              <h4 className="text-sm font-medium mb-2">Report Period</h4>
              <div className="text-sm text-muted-foreground space-y-1">
                <p>Generated: {formatDate(new Date())}</p>
                <p>Period: All time</p>
                <Badge variant="outline" className="text-xs">
                  Live Data
                </Badge>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </>
  )
}