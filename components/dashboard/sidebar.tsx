'use client'

import { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'
import {
  DollarSign,
  BarChart3,
  Receipt,
  TrendingUp,
  CreditCard,
  Users,
  Settings,
  PieChart,
  FileText,
  Menu,
  X
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { StartupSelector } from './startup-selector'

const navigation = [
  {
    name: 'Dashboard',
    href: '/dashboard',
    icon: BarChart3,
  },
  {
    name: 'Expenses',
    href: '/expenses',
    icon: Receipt,
  },
  {
    name: 'Investments',
    href: '/investments',
    icon: TrendingUp,
  },
  {
    name: 'Budgets',
    href: '/dashboard/budgets',
    icon: PieChart,
  },
  {
    name: 'Reports',
    href: '/dashboard/reports',
    icon: FileText,
  },
  {
    name: 'Team',
    href: '/dashboard/team',
    icon: Users,
  },
  {
    name: 'Settings',
    href: '/dashboard/settings',
    icon: Settings,
  },
]

export function Sidebar() {
  const pathname = usePathname()
  const [isOpen, setIsOpen] = useState(false)

  return (
    <>
      {/* Mobile menu button */}
      <div className="lg:hidden fixed top-4 left-4 z-50">
        <Button
          variant="outline"
          size="icon"
          onClick={() => setIsOpen(!isOpen)}
          className="bg-white"
        >
          {isOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
        </Button>
      </div>

      {/* Sidebar overlay for mobile */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={cn(
          'fixed left-0 top-0 h-full w-64 bg-white border-r border-gray-200 transform transition-transform duration-300 ease-in-out z-40',
          'lg:translate-x-0 lg:static lg:block',
          isOpen ? 'translate-x-0' : '-translate-x-full'
        )}
      >
        <div className="flex flex-col h-full">
          {/* Logo */}
          <div className="flex items-center px-6 py-4 border-b">
            <DollarSign className="h-8 w-8 text-indigo-600" />
            <span className="ml-2 text-xl font-bold text-gray-900">FounderLedger</span>
          </div>

          {/* Startup Selector */}
          <div className="px-4 py-4 border-b">
            <StartupSelector />
          </div>

          {/* Navigation */}
          <nav className="flex-1 px-4 py-6 space-y-1 overflow-y-auto">
            {navigation.map((item) => {
              const isActive = pathname === item.href
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  onClick={() => setIsOpen(false)}
                  className={cn(
                    'group flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors',
                    isActive
                      ? 'bg-indigo-50 text-indigo-700 border-r-2 border-indigo-700'
                      : 'text-gray-700 hover:bg-gray-50 hover:text-gray-900'
                  )}
                >
                  <item.icon
                    className={cn(
                      'mr-3 h-5 w-5',
                      isActive 
                        ? 'text-indigo-500' 
                        : 'text-gray-400 group-hover:text-gray-500'
                    )}
                  />
                  {item.name}
                </Link>
              )
            })}
          </nav>

          {/* Bottom section */}
          <div className="p-4 border-t">
            <div className="bg-indigo-50 rounded-lg p-3">
              <div className="text-sm font-medium text-indigo-900">
                Free Plan
              </div>
              <div className="text-xs text-indigo-700 mt-1">
                Upgrade for unlimited expenses
              </div>
              <Button size="sm" className="w-full mt-2 bg-indigo-600 hover:bg-indigo-700">
                Upgrade
              </Button>
            </div>
          </div>
        </div>
      </aside>
    </>
  )
}