import {
  pgTable,
  text,
  timestamp,
  uuid,
  varchar,
  decimal,
  integer,
  boolean,
  jsonb,
  serial,
  date,
  pgEnum,
} from 'drizzle-orm/pg-core'
import { relations } from 'drizzle-orm'

// Enums
export const memberRole = pgEnum('member_role', ['owner', 'admin', 'member', 'viewer'])
export const expenseStatus = pgEnum('expense_status', [
  'draft',
  'pending',
  'approved', 
  'rejected',
  'reimbursed',
  'partially_paid'
])
export const investmentType = pgEnum('investment_type', [
  'equity',
  'safe',
  'convertible_note',
  'loan',
  'grant',
  'personal_funds'
])
export const paymentMethodType = pgEnum('payment_method_type', [
  'personal_card',
  'company_card',
  'bank_transfer',
  'cash',
  'paypal',
  'other'
])
export const recurrenceType = pgEnum('recurrence_type', [
  'one_time',
  'daily',
  'weekly', 
  'monthly',
  'quarterly',
  'yearly'
])
export const reimbursementStatus = pgEnum('reimbursement_status', [
  'pending',
  'approved',
  'paid',
  'cancelled'
])

// Users table (synced from Clerk)
export const users = pgTable('users', {
  id: uuid('id').primaryKey().defaultRandom(),
  clerkId: varchar('clerk_id', { length: 255 }).unique().notNull(),
  email: varchar('email', { length: 255 }).unique().notNull(),
  firstName: varchar('first_name', { length: 100 }),
  lastName: varchar('last_name', { length: 100 }),
  avatarUrl: text('avatar_url'),
  phone: varchar('phone', { length: 20 }),
  timezone: varchar('timezone', { length: 50 }).default('UTC'),
  defaultCurrency: varchar('default_currency', { length: 3 }).default('USD'),
  dateFormat: varchar('date_format', { length: 20 }).default('MM/DD/YYYY'),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
})

// Startups table
export const startups = pgTable('startups', {
  id: uuid('id').primaryKey().defaultRandom(),
  name: varchar('name', { length: 255 }).notNull(),
  slug: varchar('slug', { length: 255 }).unique().notNull(),
  description: text('description'),
  logoUrl: text('logo_url'),
  industry: varchar('industry', { length: 100 }),
  foundedDate: date('founded_date'),
  website: varchar('website', { length: 255 }),
  defaultCurrency: varchar('default_currency', { length: 3 }).default('USD'),
  fiscalYearStart: integer('fiscal_year_start').default(1), // 1 = January
  taxId: varchar('tax_id', { length: 50 }),
  requireApprovalAbove: decimal('require_approval_above', { precision: 15, scale: 2 }).default('500.00'),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
})

// Startup Members (junction table with roles)
export const startupMembers = pgTable('startup_members', {
  id: uuid('id').primaryKey().defaultRandom(),
  startupId: uuid('startup_id').references(() => startups.id).notNull(),
  userId: uuid('user_id').references(() => users.id).notNull(),
  role: memberRole('role').notNull(),
  title: varchar('title', { length: 100 }),
  canApproveExpenses: boolean('can_approve_expenses').default(false),
  canManageMembers: boolean('can_manage_members').default(false),
  canViewFinancials: boolean('can_view_financials').default(true),
  canExportData: boolean('can_export_data').default(false),
  approvalLimit: decimal('approval_limit', { precision: 15, scale: 2 }),
  invitedBy: uuid('invited_by').references(() => users.id),
  invitedAt: timestamp('invited_at'),
  joinedAt: timestamp('joined_at').defaultNow(),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
})

// Categories
export const categories: any = pgTable('categories', {
  id: uuid('id').primaryKey().defaultRandom(),
  startupId: uuid('startup_id').references(() => startups.id).notNull(),
  name: varchar('name', { length: 255 }).notNull(),
  slug: varchar('slug', { length: 255 }).notNull(),
  description: text('description'),
  color: varchar('color', { length: 7 }).default('#6366f1'), // hex color
  icon: varchar('icon', { length: 50 }),
  parentId: uuid('parent_id').references(() => categories.id),
  sortOrder: integer('sort_order').default(0),
  isDefault: boolean('is_default').default(false),
  isActive: boolean('is_active').default(true),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
})

// Payment Methods
export const paymentMethods = pgTable('payment_methods', {
  id: uuid('id').primaryKey().defaultRandom(),
  startupId: uuid('startup_id').references(() => startups.id).notNull(),
  userId: uuid('user_id').references(() => users.id), // null = company-wide
  name: varchar('name', { length: 255 }).notNull(),
  type: paymentMethodType('type').notNull(),
  lastFourDigits: varchar('last_four_digits', { length: 4 }),
  isCompanyAccount: boolean('is_company_account').default(false),
  isActive: boolean('is_active').default(true),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
})

// Expenses
export const expenses = pgTable('expenses', {
  id: uuid('id').primaryKey().defaultRandom(),
  startupId: uuid('startup_id').references(() => startups.id).notNull(),
  title: varchar('title', { length: 255 }).notNull(),
  description: text('description'),
  amount: decimal('amount', { precision: 15, scale: 2 }).notNull(),
  currency: varchar('currency', { length: 3 }).notNull(),
  convertedAmount: decimal('converted_amount', { precision: 15, scale: 2 }),
  exchangeRate: decimal('exchange_rate', { precision: 10, scale: 6 }),
  expenseDate: date('expense_date').notNull(),
  dueDate: date('due_date'),
  categoryId: uuid('category_id').references(() => categories.id).notNull(),
  taxCategoryId: uuid('tax_category_id'),
  paidById: uuid('paid_by_id').references(() => users.id).notNull(),
  paymentMethodId: uuid('payment_method_id').references(() => paymentMethods.id),
  status: expenseStatus('status').default('draft'),
  recurrenceType: recurrenceType('recurrence_type').default('one_time'),
  recurringExpenseId: uuid('recurring_expense_id'),
  taxAmount: decimal('tax_amount', { precision: 15, scale: 2 }),
  taxRate: decimal('tax_rate', { precision: 5, scale: 2 }),
  isTaxDeductible: boolean('is_tax_deductible').default(false),
  vendorName: varchar('vendor_name', { length: 255 }),
  vendorId: uuid('vendor_id'),
  invoiceNumber: varchar('invoice_number', { length: 100 }),
  notes: text('notes'),
  metadata: jsonb('metadata'),
  createdById: uuid('created_by_id').references(() => users.id).notNull(),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
})

// Currencies
export const currencies = pgTable('currencies', {
  code: varchar('code', { length: 3 }).primaryKey(), // USD, EUR, etc.
  name: varchar('name', { length: 100 }).notNull(),
  symbol: varchar('symbol', { length: 10 }).notNull(),
  decimalPlaces: integer('decimal_places').default(2),
})

// Relations
export const usersRelations = relations(users, ({ many }) => ({
  startupMembers: many(startupMembers),
  expenses: many(expenses),
  paymentMethods: many(paymentMethods),
}))

export const startupsRelations = relations(startups, ({ many }) => ({
  members: many(startupMembers),
  categories: many(categories),
  expenses: many(expenses),
  paymentMethods: many(paymentMethods),
}))

export const startupMembersRelations = relations(startupMembers, ({ one }) => ({
  startup: one(startups, {
    fields: [startupMembers.startupId],
    references: [startups.id],
  }),
  user: one(users, {
    fields: [startupMembers.userId],
    references: [users.id],
  }),
  invitedByUser: one(users, {
    fields: [startupMembers.invitedBy],
    references: [users.id],
  }),
}))

export const categoriesRelations = relations(categories, ({ one, many }) => ({
  startup: one(startups, {
    fields: [categories.startupId],
    references: [startups.id],
  }),
  parent: one(categories, {
    fields: [categories.parentId],
    references: [categories.id],
  }),
  children: many(categories),
  expenses: many(expenses),
}))

export const paymentMethodsRelations = relations(paymentMethods, ({ one, many }) => ({
  startup: one(startups, {
    fields: [paymentMethods.startupId],
    references: [startups.id],
  }),
  user: one(users, {
    fields: [paymentMethods.userId],
    references: [users.id],
  }),
  expenses: many(expenses),
}))

export const expensesRelations = relations(expenses, ({ one }) => ({
  startup: one(startups, {
    fields: [expenses.startupId],
    references: [startups.id],
  }),
  category: one(categories, {
    fields: [expenses.categoryId],
    references: [categories.id],
  }),
  paidBy: one(users, {
    fields: [expenses.paidById],
    references: [users.id],
  }),
  paymentMethod: one(paymentMethods, {
    fields: [expenses.paymentMethodId],
    references: [paymentMethods.id],
  }),
  createdBy: one(users, {
    fields: [expenses.createdById],
    references: [users.id],
  }),
}))