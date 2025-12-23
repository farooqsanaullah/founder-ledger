'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { 
  MoreHorizontal, 
  Search, 
  Filter, 
  Download,
  Eye,
  Edit,
  TrendingUp,
  DollarSign,
  Calendar,
  Users
} from 'lucide-react'
import Link from 'next/link'

interface Investment {
  id: string
  roundName: string
  investorName: string
  type: 'equity' | 'safe' | 'convertible_note' | 'loan' | 'grant' | 'personal_funds'
  amount: string
  currency: string
  equityPercentage: string | null
  premoneyValuation: string | null
  postmoneyValuation: string | null
  investmentDate: string
  boardSeat: boolean
  leadInvestor: boolean
  notes: string | null
  createdAt: string
}

export function InvestmentList() {
  const [investments, setInvestments] = useState<Investment[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [typeFilter, setTypeFilter] = useState<string>('all')

  useEffect(() => {
    fetchInvestments()
  }, [])

  const fetchInvestments = async () => {
    try {
      const response = await fetch('/api/investments')
      if (response.ok) {
        const data = await response.json()
        setInvestments(data.investments || [])
      }
    } catch (error) {
      console.error('Error fetching investments:', error)
    } finally {
      setLoading(false)
    }
  }

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'equity':
        return 'bg-blue-100 text-blue-800'
      case 'safe':
        return 'bg-green-100 text-green-800'
      case 'convertible_note':
        return 'bg-purple-100 text-purple-800'
      case 'loan':
        return 'bg-orange-100 text-orange-800'
      case 'grant':
        return 'bg-emerald-100 text-emerald-800'
      case 'personal_funds':
        return 'bg-gray-100 text-gray-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString()
  }

  const formatAmount = (amount: string, currency: string) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency || 'USD'
    }).format(parseFloat(amount))
  }

  const formatType = (type: string) => {
    switch (type) {
      case 'convertible_note':
        return 'Convertible Note'
      case 'personal_funds':
        return 'Personal Funds'
      default:
        return type.charAt(0).toUpperCase() + type.slice(1)
    }
  }

  const filteredInvestments = investments.filter(investment => {
    const matchesSearch = investment.investorName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         investment.roundName.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesType = typeFilter === 'all' || investment.type === typeFilter
    return matchesSearch && matchesType
  })

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Investments</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <p className="text-muted-foreground">Loading investments...</p>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <CardTitle>Investment Rounds</CardTitle>
          
          <div className="flex gap-2">
            <div className="relative">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search investments..."
                className="pl-8 w-[200px]"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            
            <select
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value)}
              className="px-3 py-2 border border-input rounded-md bg-background text-sm"
            >
              <option value="all">All Types</option>
              <option value="equity">Equity</option>
              <option value="safe">SAFE</option>
              <option value="convertible_note">Convertible Note</option>
              <option value="loan">Loan</option>
              <option value="grant">Grant</option>
              <option value="personal_funds">Personal Funds</option>
            </select>

            <Button variant="outline" size="sm">
              <Download className="w-4 h-4 mr-1" />
              Export
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {filteredInvestments.length === 0 ? (
          <div className="text-center py-8">
            <TrendingUp className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
            <p className="text-muted-foreground mb-4">
              {searchTerm || typeFilter !== 'all' 
                ? 'No investments match your filters' 
                : 'No investments yet'
              }
            </p>
            {!searchTerm && typeFilter === 'all' && (
              <Link href="/investments/new">
                <Button>Record your first investment</Button>
              </Link>
            )}
          </div>
        ) : (
          <div className="space-y-4">
            {filteredInvestments.map((investment) => (
              <div 
                key={investment.id} 
                className="border rounded-lg p-6 hover:bg-muted/50 transition-colors"
              >
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center space-x-3">
                    <div>
                      <h3 className="font-semibold text-lg">{investment.roundName}</h3>
                      <p className="text-muted-foreground">{investment.investorName}</p>
                    </div>
                    <Badge 
                      variant="secondary" 
                      className={getTypeColor(investment.type)}
                    >
                      {formatType(investment.type)}
                    </Badge>
                    {investment.leadInvestor && (
                      <Badge variant="outline">Lead</Badge>
                    )}
                  </div>
                  <div className="text-right">
                    <div className="text-2xl font-bold">
                      {formatAmount(investment.amount, investment.currency)}
                    </div>
                    {investment.equityPercentage && (
                      <p className="text-sm text-muted-foreground">
                        {investment.equityPercentage}% equity
                      </p>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                  <div className="flex items-center space-x-2">
                    <Calendar className="w-4 h-4 text-muted-foreground" />
                    <span>{formatDate(investment.investmentDate)}</span>
                  </div>
                  
                  {investment.postmoneyValuation && (
                    <div className="flex items-center space-x-2">
                      <TrendingUp className="w-4 h-4 text-muted-foreground" />
                      <span>
                        {formatAmount(investment.postmoneyValuation, investment.currency)} valuation
                      </span>
                    </div>
                  )}
                  
                  {investment.boardSeat && (
                    <div className="flex items-center space-x-2">
                      <Users className="w-4 h-4 text-muted-foreground" />
                      <span>Board seat</span>
                    </div>
                  )}

                  <div className="flex justify-end space-x-1">
                    <Button variant="ghost" size="sm">
                      <Eye className="w-4 h-4" />
                    </Button>
                    <Button variant="ghost" size="sm">
                      <Edit className="w-4 h-4" />
                    </Button>
                    <Button variant="ghost" size="sm">
                      <MoreHorizontal className="w-4 h-4" />
                    </Button>
                  </div>
                </div>

                {investment.notes && (
                  <div className="mt-3 pt-3 border-t">
                    <p className="text-sm text-muted-foreground">{investment.notes}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  )
}