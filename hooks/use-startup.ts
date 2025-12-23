'use client'

import { useState, useEffect } from 'react'
import { useUser } from '@clerk/nextjs'

interface Startup {
  id: string
  name: string
  description?: string
  industry?: string
  foundedDate?: string
  website?: string
  logoUrl?: string
}

interface UseStartupReturn {
  currentStartup: Startup | null
  startups: Startup[]
  loading: boolean
  setCurrentStartup: (startup: Startup | null) => void
  refreshStartups: () => Promise<void>
}

export function useStartup(): UseStartupReturn {
  const { user, isLoaded } = useUser()
  const [currentStartup, setCurrentStartupState] = useState<Startup | null>(null)
  const [startups, setStartups] = useState<Startup[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (isLoaded && user) {
      loadStartups()
    }
  }, [isLoaded, user])

  const loadStartups = async () => {
    try {
      const response = await fetch('/api/user/startups')
      if (response.ok) {
        const data = await response.json()
        setStartups(data.startups || [])
        
        // Set current startup from localStorage or first startup
        const savedStartupId = localStorage.getItem('currentStartupId')
        if (savedStartupId && data.startups) {
          const savedStartup = data.startups.find((s: Startup) => s.id === savedStartupId)
          if (savedStartup) {
            setCurrentStartupState(savedStartup)
          } else if (data.startups.length > 0) {
            setCurrentStartupState(data.startups[0])
          }
        } else if (data.startups && data.startups.length > 0) {
          setCurrentStartupState(data.startups[0])
        }
      }
    } catch (error) {
      console.error('Error loading startups:', error)
    } finally {
      setLoading(false)
    }
  }

  const setCurrentStartup = (startup: Startup | null) => {
    setCurrentStartupState(startup)
    if (startup) {
      localStorage.setItem('currentStartupId', startup.id)
    } else {
      localStorage.removeItem('currentStartupId')
    }
  }

  const refreshStartups = async () => {
    setLoading(true)
    await loadStartups()
  }

  return {
    currentStartup,
    startups,
    loading,
    setCurrentStartup,
    refreshStartups
  }
}