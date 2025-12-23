'use client'

import { ReactNode } from 'react'
import { usePermissions } from '@/hooks/use-permissions'
import { Permission, Role } from '@/lib/permissions'

interface PermissionGateProps {
  children: ReactNode
  permission?: Permission
  permissions?: Permission[]
  role?: Role
  roles?: Role[]
  requireAll?: boolean
  fallback?: ReactNode
}

export function PermissionGate({
  children,
  permission,
  permissions,
  role,
  roles,
  requireAll = false,
  fallback = null,
}: PermissionGateProps) {
  const { userRole, can, canAny, canAll } = usePermissions()

  // Check role-based access
  if (role && userRole !== role) {
    return <>{fallback}</>
  }

  if (roles && !roles.includes(userRole as Role)) {
    return <>{fallback}</>
  }

  // Check permission-based access
  if (permission && !can(permission)) {
    return <>{fallback}</>
  }

  if (permissions) {
    const hasAccess = requireAll ? canAll(permissions) : canAny(permissions)
    if (!hasAccess) {
      return <>{fallback}</>
    }
  }

  return <>{children}</>
}

// Convenience components for common permission patterns
export function OwnerOnly({ children, fallback = null }: { children: ReactNode; fallback?: ReactNode }) {
  return (
    <PermissionGate role="owner" fallback={fallback}>
      {children}
    </PermissionGate>
  )
}

export function AdminOnly({ children, fallback = null }: { children: ReactNode; fallback?: ReactNode }) {
  return (
    <PermissionGate roles={['owner', 'admin']} fallback={fallback}>
      {children}
    </PermissionGate>
  )
}

export function MemberOnly({ children, fallback = null }: { children: ReactNode; fallback?: ReactNode }) {
  return (
    <PermissionGate roles={['owner', 'admin', 'member']} fallback={fallback}>
      {children}
    </PermissionGate>
  )
}

// Permission-specific gates
export function CanCreateExpense({ children, fallback = null }: { children: ReactNode; fallback?: ReactNode }) {
  return (
    <PermissionGate permission="expenses.create" fallback={fallback}>
      {children}
    </PermissionGate>
  )
}

export function CanApproveExpense({ children, fallback = null }: { children: ReactNode; fallback?: ReactNode }) {
  return (
    <PermissionGate permission="expenses.approve" fallback={fallback}>
      {children}
    </PermissionGate>
  )
}

export function CanManageTeam({ children, fallback = null }: { children: ReactNode; fallback?: ReactNode }) {
  return (
    <PermissionGate permission="team.manage" fallback={fallback}>
      {children}
    </PermissionGate>
  )
}

export function CanInviteMembers({ children, fallback = null }: { children: ReactNode; fallback?: ReactNode }) {
  return (
    <PermissionGate permission="team.invite" fallback={fallback}>
      {children}
    </PermissionGate>
  )
}

export function CanExportReports({ children, fallback = null }: { children: ReactNode; fallback?: ReactNode }) {
  return (
    <PermissionGate permission="reports.export" fallback={fallback}>
      {children}
    </PermissionGate>
  )
}

export function CanManageStartup({ children, fallback = null }: { children: ReactNode; fallback?: ReactNode }) {
  return (
    <PermissionGate permission="startup.settings" fallback={fallback}>
      {children}
    </PermissionGate>
  )
}