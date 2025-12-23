export type Role = 'owner' | 'admin' | 'member' | 'viewer'

export type Permission = 
  // Financial permissions
  | 'expenses.create'
  | 'expenses.read'
  | 'expenses.update'
  | 'expenses.delete'
  | 'expenses.approve'
  // Investment permissions
  | 'investments.create'
  | 'investments.read'
  | 'investments.update'
  | 'investments.delete'
  // Budget permissions
  | 'budgets.create'
  | 'budgets.read'
  | 'budgets.update'
  | 'budgets.delete'
  // Report permissions
  | 'reports.read'
  | 'reports.export'
  // Team permissions
  | 'team.read'
  | 'team.invite'
  | 'team.manage'
  | 'team.remove'
  // Startup permissions
  | 'startup.read'
  | 'startup.update'
  | 'startup.delete'
  | 'startup.settings'
  // Category permissions
  | 'categories.create'
  | 'categories.read'
  | 'categories.update'
  | 'categories.delete'

// Role-based permission matrix
export const ROLE_PERMISSIONS: Record<Role, Permission[]> = {
  owner: [
    // All permissions
    'expenses.create',
    'expenses.read',
    'expenses.update',
    'expenses.delete',
    'expenses.approve',
    'investments.create',
    'investments.read',
    'investments.update',
    'investments.delete',
    'budgets.create',
    'budgets.read',
    'budgets.update',
    'budgets.delete',
    'reports.read',
    'reports.export',
    'team.read',
    'team.invite',
    'team.manage',
    'team.remove',
    'startup.read',
    'startup.update',
    'startup.delete',
    'startup.settings',
    'categories.create',
    'categories.read',
    'categories.update',
    'categories.delete',
  ],
  admin: [
    // Most permissions except startup deletion and some team management
    'expenses.create',
    'expenses.read',
    'expenses.update',
    'expenses.delete',
    'expenses.approve',
    'investments.create',
    'investments.read',
    'investments.update',
    'investments.delete',
    'budgets.create',
    'budgets.read',
    'budgets.update',
    'budgets.delete',
    'reports.read',
    'reports.export',
    'team.read',
    'team.invite',
    'team.manage',
    'startup.read',
    'startup.update',
    'startup.settings',
    'categories.create',
    'categories.read',
    'categories.update',
    'categories.delete',
  ],
  member: [
    // Standard member permissions
    'expenses.create',
    'expenses.read',
    'expenses.update',
    'investments.read',
    'budgets.read',
    'reports.read',
    'team.read',
    'startup.read',
    'categories.read',
  ],
  viewer: [
    // Read-only permissions
    'expenses.read',
    'investments.read',
    'budgets.read',
    'reports.read',
    'team.read',
    'startup.read',
    'categories.read',
  ],
}

export function hasPermission(role: Role, permission: Permission): boolean {
  return ROLE_PERMISSIONS[role].includes(permission)
}

export function hasAnyPermission(role: Role, permissions: Permission[]): boolean {
  return permissions.some(permission => hasPermission(role, permission))
}

export function hasAllPermissions(role: Role, permissions: Permission[]): boolean {
  return permissions.every(permission => hasPermission(role, permission))
}

export function canManageRole(userRole: Role, targetRole: Role): boolean {
  // Only owners can manage other owners
  if (targetRole === 'owner') {
    return userRole === 'owner'
  }
  
  // Owners and admins can manage non-owners
  return ['owner', 'admin'].includes(userRole)
}

export function canAssignRole(userRole: Role, targetRole: Role): boolean {
  // Only owners can assign owner role
  if (targetRole === 'owner') {
    return userRole === 'owner'
  }
  
  // Owners and admins can assign non-owner roles
  return ['owner', 'admin'].includes(userRole)
}

// UI permission helpers
export function canCreateExpense(role: Role): boolean {
  return hasPermission(role, 'expenses.create')
}

export function canApproveExpense(role: Role): boolean {
  return hasPermission(role, 'expenses.approve')
}

export function canManageTeam(role: Role): boolean {
  return hasPermission(role, 'team.manage')
}

export function canInviteMembers(role: Role): boolean {
  return hasPermission(role, 'team.invite')
}

export function canExportReports(role: Role): boolean {
  return hasPermission(role, 'reports.export')
}

export function canManageStartup(role: Role): boolean {
  return hasPermission(role, 'startup.settings')
}

export function canDeleteStartup(role: Role): boolean {
  return hasPermission(role, 'startup.delete')
}

// Resource access helpers
export function canAccessResource(role: Role, resource: 'expenses' | 'investments' | 'budgets' | 'reports' | 'team'): boolean {
  const readPermission = `${resource}.read` as Permission
  return hasPermission(role, readPermission)
}

export function canModifyResource(role: Role, resource: 'expenses' | 'investments' | 'budgets'): boolean {
  const updatePermission = `${resource}.update` as Permission
  return hasPermission(role, updatePermission)
}

export function canCreateResource(role: Role, resource: 'expenses' | 'investments' | 'budgets' | 'categories'): boolean {
  const createPermission = `${resource}.create` as Permission
  return hasPermission(role, createPermission)
}

export function canDeleteResource(role: Role, resource: 'expenses' | 'investments' | 'budgets' | 'categories'): boolean {
  const deletePermission = `${resource}.delete` as Permission
  return hasPermission(role, deletePermission)
}

// Permission descriptions for UI
export const PERMISSION_DESCRIPTIONS: Record<Permission, string> = {
  'expenses.create': 'Create new expenses',
  'expenses.read': 'View expenses',
  'expenses.update': 'Edit expenses',
  'expenses.delete': 'Delete expenses',
  'expenses.approve': 'Approve/reject expenses',
  'investments.create': 'Record new investments',
  'investments.read': 'View investments',
  'investments.update': 'Edit investments',
  'investments.delete': 'Delete investments',
  'budgets.create': 'Create budgets',
  'budgets.read': 'View budgets',
  'budgets.update': 'Edit budgets',
  'budgets.delete': 'Delete budgets',
  'reports.read': 'View reports',
  'reports.export': 'Export reports',
  'team.read': 'View team members',
  'team.invite': 'Invite team members',
  'team.manage': 'Manage team member roles',
  'team.remove': 'Remove team members',
  'startup.read': 'View startup details',
  'startup.update': 'Edit startup details',
  'startup.delete': 'Delete startup',
  'startup.settings': 'Manage startup settings',
  'categories.create': 'Create categories',
  'categories.read': 'View categories',
  'categories.update': 'Edit categories',
  'categories.delete': 'Delete categories',
}

// Role descriptions for UI
export const ROLE_DESCRIPTIONS: Record<Role, string> = {
  owner: 'Full access to all features and settings. Can manage other owners.',
  admin: 'Manage team and most features. Cannot delete startup or manage other owners.',
  member: 'Create and manage own expenses. View most data.',
  viewer: 'Read-only access to view data and reports.',
}