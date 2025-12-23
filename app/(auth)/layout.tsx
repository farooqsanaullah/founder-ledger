import Link from 'next/link'
import { DollarSign, ArrowLeft } from 'lucide-react'
import { Button } from '@/components/ui/button'

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50">
      {/* Navigation */}
      <nav className="container mx-auto px-4 py-6">
        <div className="flex justify-between items-center">
          <Link href="/" className="flex items-center space-x-2">
            <DollarSign className="h-8 w-8 text-indigo-600" />
            <span className="text-2xl font-bold text-gray-900">FounderLedger</span>
          </Link>
          <Button variant="ghost" asChild>
            <Link href="/" className="flex items-center space-x-2">
              <ArrowLeft className="h-4 w-4" />
              <span>Back to Home</span>
            </Link>
          </Button>
        </div>
      </nav>

      {/* Auth Content */}
      <div className="flex min-h-[calc(100vh-120px)] items-center justify-center p-4">
        <div className="w-full max-w-md space-y-8">
          <div className="text-center">
            <h1 className="text-3xl font-bold text-gray-900">Welcome</h1>
            <p className="text-gray-600 mt-2">
              Join thousands of founders tracking their startup expenses
            </p>
          </div>
          <div className="bg-white p-8 rounded-xl shadow-lg">
            {children}
          </div>
        </div>
      </div>
    </div>
  )
}