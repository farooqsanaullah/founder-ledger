'use client'

import { useState, useEffect } from 'react'
import { ChevronDown, Building2, Plus, Check } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

interface Startup {
  id: string
  name: string
  slug: string
}

interface StartupSelectorProps {
  currentStartup?: Startup | null
  onStartupChange?: (startup: Startup) => void
}

export function StartupSelector({ currentStartup, onStartupChange }: StartupSelectorProps) {
  const [startups, setStartups] = useState<Startup[]>([])
  const [isOpen, setIsOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    fetchStartups()
  }, [])

  const fetchStartups = async () => {
    try {
      setIsLoading(true)
      const response = await fetch('/api/user/startups')
      if (response.ok) {
        const data = await response.json()
        setStartups(data.startups)
      }
    } catch (error) {
      console.error('Error fetching startups:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleStartupSelect = (startup: Startup) => {
    setIsOpen(false)
    if (onStartupChange) {
      onStartupChange(startup)
    }
    // Store in localStorage for persistence
    localStorage.setItem('selectedStartupId', startup.id)
  }

  const truncateName = (name: string, maxLength: number = 20) => {
    return name.length > maxLength ? `${name.substring(0, maxLength)}...` : name
  }

  return (
    <div className="relative">
      <Button
        variant="ghost"
        onClick={() => setIsOpen(!isOpen)}
        className={cn(
          'w-full justify-between px-3 py-2 h-auto text-left font-normal',
          'hover:bg-gray-50 border border-gray-200 rounded-lg'
        )}
      >
        <div className="flex items-center space-x-2 min-w-0">
          <Building2 className="h-4 w-4 text-indigo-600 flex-shrink-0" />
          <div className="min-w-0">
            <div className="font-medium text-sm text-gray-900 truncate">
              {currentStartup ? truncateName(currentStartup.name) : 'Select Startup'}
            </div>
            {startups.length > 1 && (
              <div className="text-xs text-gray-500">
                {startups.length} startups
              </div>
            )}
          </div>
        </div>
        <ChevronDown className={cn(
          'h-4 w-4 text-gray-400 transition-transform flex-shrink-0',
          isOpen && 'transform rotate-180'
        )} />
      </Button>

      {/* Dropdown */}
      {isOpen && (
        <>
          {/* Overlay */}
          <div 
            className="fixed inset-0 z-10" 
            onClick={() => setIsOpen(false)}
          />
          
          {/* Dropdown content */}
          <div className="absolute top-full mt-1 w-full bg-white border border-gray-200 rounded-lg shadow-lg z-20 max-h-64 overflow-y-auto">
            {isLoading ? (
              <div className="p-3 text-sm text-gray-500">Loading startups...</div>
            ) : (
              <>
                {startups.map((startup) => (
                  <button
                    key={startup.id}
                    onClick={() => handleStartupSelect(startup)}
                    className={cn(
                      'w-full flex items-center justify-between px-3 py-2 text-left hover:bg-gray-50',
                      'first:rounded-t-lg last:rounded-b-lg'
                    )}
                  >
                    <div className="flex items-center space-x-2 min-w-0">
                      <Building2 className="h-4 w-4 text-gray-400 flex-shrink-0" />
                      <div className="min-w-0">
                        <div className="font-medium text-sm text-gray-900 truncate">
                          {startup.name}
                        </div>
                        <div className="text-xs text-gray-500 truncate">
                          {startup.slug}
                        </div>
                      </div>
                    </div>
                    {currentStartup?.id === startup.id && (
                      <Check className="h-4 w-4 text-indigo-600 flex-shrink-0" />
                    )}
                  </button>
                ))}
                
                {/* Add new startup option */}
                <div className="border-t border-gray-100">
                  <button
                    onClick={() => {
                      setIsOpen(false)
                      window.location.href = '/onboarding'
                    }}
                    className="w-full flex items-center space-x-2 px-3 py-2 text-left hover:bg-gray-50 rounded-b-lg"
                  >
                    <Plus className="h-4 w-4 text-gray-400" />
                    <span className="text-sm text-gray-700">Add new startup</span>
                  </button>
                </div>
              </>
            )}
          </div>
        </>
      )}
    </div>
  )
}