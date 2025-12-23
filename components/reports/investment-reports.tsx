'use client'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { TrendingUp, Download, Building2, Calendar } from 'lucide-react'
import { ExportDropdown } from './export-dropdown'

const mockInvestments = [
  {
    id: '1',
    roundName: 'Seed Round',
    investorName: 'Acme Ventures',
    amount: 50000,
    type: 'equity',
    date: '2024-01-15',
    equityPercentage: 10,
  },
  {
    id: '2',
    roundName: 'Pre-Series A',
    investorName: 'Growth Partners LP',
    amount: 75000,
    type: 'safe',
    date: '2024-03-20',
    equityPercentage: 8,
  },
  {
    id: '3',
    roundName: 'Bridge Round',
    investorName: 'Angel Group',
    amount: 25000,
    type: 'convertible_note',
    date: '2024-06-10',
    equityPercentage: 3,
  },
]

export function InvestmentReports() {
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
    }).format(amount)
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    })
  }

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'equity':
        return 'bg-green-100 text-green-800'
      case 'safe':
        return 'bg-blue-100 text-blue-800'
      case 'convertible_note':
        return 'bg-purple-100 text-purple-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const totalRaised = mockInvestments.reduce((sum, inv) => sum + inv.amount, 0)
  const totalEquity = mockInvestments.reduce((sum, inv) => sum + inv.equityPercentage, 0)

  const exportData = {
    title: 'Investment Report',
    data: mockInvestments,
    columns: ['roundName', 'investorName', 'amount', 'type', 'date', 'equityPercentage'],
    summary: [
      { label: 'Total Raised', value: totalRaised },
      { label: 'Funding Rounds', value: mockInvestments.length },
      { label: 'Equity Given', value: `${totalEquity}%` },
    ]
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle className="flex items-center">
            <TrendingUp className="w-5 h-5 mr-2" />
            Investment Reports
          </CardTitle>
          <CardDescription>
            Funding rounds and investment analysis
          </CardDescription>
        </div>
        <ExportDropdown data={exportData} />
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-3 gap-4 mb-6">
          <div className="text-center">
            <div className="text-2xl font-bold text-green-600">
              {formatCurrency(totalRaised)}
            </div>
            <p className="text-sm text-muted-foreground">Total Raised</p>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-blue-600">
              {mockInvestments.length}
            </div>
            <p className="text-sm text-muted-foreground">Funding Rounds</p>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-purple-600">
              {totalEquity}%
            </div>
            <p className="text-sm text-muted-foreground">Equity Given</p>
          </div>
        </div>

        <div className="space-y-4">
          {mockInvestments.map((investment) => (
            <div
              key={investment.id}
              className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors"
            >
              <div className="flex items-center space-x-4">
                <Building2 className="w-8 h-8 text-muted-foreground" />
                <div>
                  <h4 className="font-medium">{investment.roundName}</h4>
                  <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                    <span>{investment.investorName}</span>
                    <span>•</span>
                    <Calendar className="w-3 h-3" />
                    <span>{formatDate(investment.date)}</span>
                  </div>
                </div>
              </div>
              <div className="flex items-center space-x-4">
                <Badge className={getTypeColor(investment.type)}>
                  {investment.type.replace('_', ' ')}
                </Badge>
                <div className="text-right">
                  <p className="font-semibold">{formatCurrency(investment.amount)}</p>
                  <p className="text-sm text-muted-foreground">{investment.equityPercentage}% equity</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-6 pt-4 border-t">
          <div className="flex justify-between items-center">
            <span className="text-sm text-muted-foreground">
              Portfolio Summary
            </span>
            <span className="text-sm text-muted-foreground">
              Remaining Equity: {100 - totalEquity}%
            </span>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}