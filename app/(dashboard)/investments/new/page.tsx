'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Header } from '@/components/dashboard/header'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { ArrowLeft, DollarSign, TrendingUp, Users, FileText } from 'lucide-react'
import Link from 'next/link'

export default function NewInvestmentPage() {
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [formData, setFormData] = useState({
    roundName: '',
    investorName: '',
    type: 'equity',
    amount: '',
    currency: 'USD',
    equityPercentage: '',
    premoneyValuation: '',
    postmoneyValuation: '',
    investmentDate: '',
    boardSeat: false,
    leadInvestor: false,
    preferenceMultiple: '1.0',
    participationRights: false,
    antiDilutionRights: 'weighted_average',
    notes: ''
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      const response = await fetch('/api/investments', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      })

      if (response.ok) {
        router.push('/investments')
      } else {
        const errorData = await response.json()
        console.error('Failed to create investment:', errorData)
        alert(`Failed to create investment: ${errorData.error}`)
      }
    } catch (error) {
      console.error('Error creating investment:', error)
      alert('Error creating investment. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleChange = (field: string, value: string | boolean) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }))

    // Auto-calculate post-money valuation if we have pre-money and investment amount
    if (field === 'premoneyValuation' || field === 'amount') {
      const premoney = parseFloat(field === 'premoneyValuation' ? value as string : formData.premoneyValuation)
      const amount = parseFloat(field === 'amount' ? value as string : formData.amount)
      
      if (premoney && amount) {
        setFormData(prev => ({
          ...prev,
          postmoneyValuation: (premoney + amount).toString()
        }))
      }
    }

    // Auto-calculate equity percentage if we have investment amount and post-money valuation
    if (field === 'amount' || field === 'postmoneyValuation') {
      const amount = parseFloat(field === 'amount' ? value as string : formData.amount)
      const postmoney = parseFloat(field === 'postmoneyValuation' ? value as string : formData.postmoneyValuation)
      
      if (amount && postmoney && postmoney > 0) {
        const equity = (amount / postmoney) * 100
        setFormData(prev => ({
          ...prev,
          equityPercentage: equity.toFixed(2)
        }))
      }
    }
  }

  return (
    <div className="flex flex-col h-full">
      <Header 
        title="Add Investment"
        description="Record a new funding round or investment"
      />
      
      <div className="flex-1 p-6">
        <div className="max-w-4xl mx-auto">
          <div className="mb-6">
            <Link 
              href="/investments" 
              className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground"
            >
              <ArrowLeft className="w-4 h-4 mr-1" />
              Back to investments
            </Link>
          </div>

          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Basic Information */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <FileText className="w-5 h-5 mr-2" />
                  Investment Details
                </CardTitle>
                <CardDescription>
                  Basic information about this investment round
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <label htmlFor="roundName" className="text-sm font-medium">
                      Round Name *
                    </label>
                    <Input
                      id="roundName"
                      placeholder="e.g., Seed, Series A, Pre-Seed"
                      value={formData.roundName}
                      onChange={(e) => handleChange('roundName', e.target.value)}
                      required
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <label htmlFor="investorName" className="text-sm font-medium">
                      Investor Name *
                    </label>
                    <Input
                      id="investorName"
                      placeholder="e.g., Acme Ventures, John Smith"
                      value={formData.investorName}
                      onChange={(e) => handleChange('investorName', e.target.value)}
                      required
                    />
                  </div>
                </div>

                <div className="grid gap-4 md:grid-cols-3">
                  <div className="space-y-2">
                    <label htmlFor="type" className="text-sm font-medium">
                      Investment Type *
                    </label>
                    <select
                      id="type"
                      className="w-full px-3 py-2 border border-input rounded-md bg-background text-sm"
                      value={formData.type}
                      onChange={(e) => handleChange('type', e.target.value)}
                      required
                    >
                      <option value="equity">Equity</option>
                      <option value="safe">SAFE</option>
                      <option value="convertible_note">Convertible Note</option>
                      <option value="loan">Loan</option>
                      <option value="grant">Grant</option>
                      <option value="personal_funds">Personal Funds</option>
                    </select>
                  </div>

                  <div className="space-y-2">
                    <label htmlFor="amount" className="text-sm font-medium">
                      Investment Amount *
                    </label>
                    <Input
                      id="amount"
                      type="number"
                      step="0.01"
                      placeholder="0.00"
                      value={formData.amount}
                      onChange={(e) => handleChange('amount', e.target.value)}
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <label htmlFor="investmentDate" className="text-sm font-medium">
                      Investment Date *
                    </label>
                    <Input
                      id="investmentDate"
                      type="date"
                      value={formData.investmentDate}
                      onChange={(e) => handleChange('investmentDate', e.target.value)}
                      required
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Valuation & Equity */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <TrendingUp className="w-5 h-5 mr-2" />
                  Valuation & Equity
                </CardTitle>
                <CardDescription>
                  Company valuation and equity details
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid gap-4 md:grid-cols-3">
                  <div className="space-y-2">
                    <label htmlFor="premoneyValuation" className="text-sm font-medium">
                      Pre-Money Valuation
                    </label>
                    <Input
                      id="premoneyValuation"
                      type="number"
                      step="0.01"
                      placeholder="0.00"
                      value={formData.premoneyValuation}
                      onChange={(e) => handleChange('premoneyValuation', e.target.value)}
                    />
                  </div>

                  <div className="space-y-2">
                    <label htmlFor="postmoneyValuation" className="text-sm font-medium">
                      Post-Money Valuation
                    </label>
                    <Input
                      id="postmoneyValuation"
                      type="number"
                      step="0.01"
                      placeholder="0.00"
                      value={formData.postmoneyValuation}
                      onChange={(e) => handleChange('postmoneyValuation', e.target.value)}
                    />
                  </div>

                  <div className="space-y-2">
                    <label htmlFor="equityPercentage" className="text-sm font-medium">
                      Equity Percentage
                    </label>
                    <Input
                      id="equityPercentage"
                      type="number"
                      step="0.01"
                      placeholder="0.00"
                      value={formData.equityPercentage}
                      onChange={(e) => handleChange('equityPercentage', e.target.value)}
                    />
                    <p className="text-xs text-muted-foreground">%</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Terms & Rights */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Users className="w-5 h-5 mr-2" />
                  Terms & Rights
                </CardTitle>
                <CardDescription>
                  Investor rights and terms
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-4">
                    <div className="flex items-center space-x-2">
                      <input
                        id="leadInvestor"
                        type="checkbox"
                        checked={formData.leadInvestor}
                        onChange={(e) => handleChange('leadInvestor', e.target.checked)}
                        className="h-4 w-4 rounded border-gray-300"
                      />
                      <label htmlFor="leadInvestor" className="text-sm font-medium">
                        Lead Investor
                      </label>
                    </div>

                    <div className="flex items-center space-x-2">
                      <input
                        id="boardSeat"
                        type="checkbox"
                        checked={formData.boardSeat}
                        onChange={(e) => handleChange('boardSeat', e.target.checked)}
                        className="h-4 w-4 rounded border-gray-300"
                      />
                      <label htmlFor="boardSeat" className="text-sm font-medium">
                        Board Seat
                      </label>
                    </div>

                    <div className="flex items-center space-x-2">
                      <input
                        id="participationRights"
                        type="checkbox"
                        checked={formData.participationRights}
                        onChange={(e) => handleChange('participationRights', e.target.checked)}
                        className="h-4 w-4 rounded border-gray-300"
                      />
                      <label htmlFor="participationRights" className="text-sm font-medium">
                        Participation Rights
                      </label>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div className="space-y-2">
                      <label htmlFor="preferenceMultiple" className="text-sm font-medium">
                        Preference Multiple
                      </label>
                      <Input
                        id="preferenceMultiple"
                        type="number"
                        step="0.1"
                        value={formData.preferenceMultiple}
                        onChange={(e) => handleChange('preferenceMultiple', e.target.value)}
                      />
                    </div>

                    <div className="space-y-2">
                      <label htmlFor="antiDilutionRights" className="text-sm font-medium">
                        Anti-Dilution Rights
                      </label>
                      <select
                        id="antiDilutionRights"
                        className="w-full px-3 py-2 border border-input rounded-md bg-background text-sm"
                        value={formData.antiDilutionRights}
                        onChange={(e) => handleChange('antiDilutionRights', e.target.value)}
                      >
                        <option value="none">None</option>
                        <option value="weighted_average">Weighted Average</option>
                        <option value="ratchet">Full Ratchet</option>
                      </select>
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <label htmlFor="notes" className="text-sm font-medium">
                    Notes
                  </label>
                  <textarea
                    id="notes"
                    className="w-full px-3 py-2 border border-input rounded-md bg-background text-sm min-h-[100px]"
                    placeholder="Additional notes about this investment..."
                    value={formData.notes}
                    onChange={(e) => handleChange('notes', e.target.value)}
                  />
                </div>
              </CardContent>
            </Card>

            {/* Submit Buttons */}
            <div className="flex gap-3">
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? 'Creating...' : 'Create Investment'}
              </Button>
              <Link href="/investments">
                <Button type="button" variant="outline">
                  Cancel
                </Button>
              </Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}