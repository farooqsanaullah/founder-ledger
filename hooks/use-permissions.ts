'use client'

import { useUser } from '@clerk/nextjs'
import { useStartup } from './use-startup'
import { useState, useEffect } from 'react'
import { Permission, Role, hasPermission, hasAnyPermission, hasAllPermissions } from '@/lib/permissions'

interface TeamMember {
  id: string
  userId: string
  role: Role
  joinedAt: string
  isActive: boolean
  permissions?: any
}

export function usePermissions() {
  const { user } = useUser()
  const { currentStartup } = useStartup()
  const [userRole, setUserRole] = useState<Role | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function fetchUserRole() {
      if (!user || !currentStartup) {
        setUserRole(null)
        setLoading(false)
        return
      }

      try {
        const response = await fetch(`/api/team/members?startupId=${currentStartup.id}`)
        if (!response.ok) {
          throw new Error('Failed to fetch team members')
        }

        const members: TeamMember[] = await response.json()
        
        // Handle case where members might be null/undefined
        if (!Array.isArray(members)) {
          throw new Error('Invalid response from team members API')
        }
        
        const currentUserMember = members.find(member => member.userId === user.id)
        
        if (currentUserMember) {
          setUserRole(currentUserMember.role)
        } else {
          setUserRole(null)
          setError('User is not a member of this startup')
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Unknown error')
        setUserRole(null)
      } finally {
        setLoading(false)
      }
    }

    fetchUserRole()
  }, [user, currentStartup])

  const can = (permission: Permission): boolean => {
    if (!userRole) return false
    return hasPermission(userRole, permission)
  }

  const canAny = (permissions: Permission[]): boolean => {
    if (!userRole) return false
    return hasAnyPermission(userRole, permissions)
  }

  const canAll = (permissions: Permission[]): boolean => {
    if (!userRole) return false
    return hasAllPermissions(userRole, permissions)
  }

  const isOwner = userRole === 'owner'
  const isAdmin = userRole === 'admin'
  const isMember = userRole === 'member'
  const isViewer = userRole === 'viewer'
  const isOwnerOrAdmin = userRole === 'owner' || userRole === 'admin'

  // Common permission checks
  const permissions = {
    // Expenses
    createExpense: can('expenses.create'),
    readExpenses: can('expenses.read'),
    updateExpense: can('expenses.update'),
    deleteExpense: can('expenses.delete'),
    approveExpense: can('expenses.approve'),

    // Investments
    createInvestment: can('investments.create'),
    readInvestments: can('investments.read'),
    updateInvestment: can('investments.update'),
    deleteInvestment: can('investments.delete'),

    // Budgets
    createBudget: can('budgets.create'),
    readBudgets: can('budgets.read'),
    updateBudget: can('budgets.update'),
    deleteBudget: can('budgets.delete'),

    // Reports
    readReports: can('reports.read'),
    exportReports: can('reports.export'),

    // Team
    readTeam: can('team.read'),
    inviteMembers: can('team.invite'),
    manageTeam: can('team.manage'),
    removeMembers: can('team.remove'),

    // Startup
    readStartup: can('startup.read'),
    updateStartup: can('startup.update'),
    deleteStartup: can('startup.delete'),
    manageSettings: can('startup.settings'),

    // Categories
    createCategory: can('categories.create'),
    readCategories: can('categories.read'),
    updateCategory: can('categories.update'),
    deleteCategory: can('categories.delete'),
  }

  return {
    userRole,
    loading,
    error,
    can,
    canAny,
    canAll,
    isOwner,
    isAdmin,
    isMember,
    isViewer,
    isOwnerOrAdmin,
    permissions,
  }
}