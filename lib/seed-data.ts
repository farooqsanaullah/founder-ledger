export const defaultCurrencies = [
  { code: 'USD', name: 'US Dollar', symbol: '$', decimalPlaces: 2 },
  { code: 'EUR', name: 'Euro', symbol: '€', decimalPlaces: 2 },
  { code: 'GBP', name: 'British Pound', symbol: '£', decimalPlaces: 2 },
  { code: 'CAD', name: 'Canadian Dollar', symbol: 'C$', decimalPlaces: 2 },
  { code: 'AUD', name: 'Australian Dollar', symbol: 'A$', decimalPlaces: 2 },
  { code: 'JPY', name: 'Japanese Yen', symbol: '¥', decimalPlaces: 0 },
  { code: 'CHF', name: 'Swiss Franc', symbol: 'CHF', decimalPlaces: 2 },
  { code: 'CNY', name: 'Chinese Yuan', symbol: '¥', decimalPlaces: 2 },
  { code: 'INR', name: 'Indian Rupee', symbol: '₹', decimalPlaces: 2 },
  { code: 'PKR', name: 'Pakistani Rupee', symbol: 'Rs', decimalPlaces: 2 },
  { code: 'BRL', name: 'Brazilian Real', symbol: 'R$', decimalPlaces: 2 },
  { code: 'MXN', name: 'Mexican Peso', symbol: '$', decimalPlaces: 2 },
  { code: 'SGD', name: 'Singapore Dollar', symbol: 'S$', decimalPlaces: 2 },
  { code: 'HKD', name: 'Hong Kong Dollar', symbol: 'HK$', decimalPlaces: 2 },
  { code: 'KRW', name: 'South Korean Won', symbol: '₩', decimalPlaces: 0 },
  { code: 'SEK', name: 'Swedish Krona', symbol: 'kr', decimalPlaces: 2 },
  { code: 'NOK', name: 'Norwegian Krone', symbol: 'kr', decimalPlaces: 2 },
  { code: 'DKK', name: 'Danish Krone', symbol: 'kr', decimalPlaces: 2 },
  { code: 'PLN', name: 'Polish Zloty', symbol: 'zł', decimalPlaces: 2 },
  { code: 'RUB', name: 'Russian Ruble', symbol: '₽', decimalPlaces: 2 },
]

export const defaultCategoryTemplates = [
  // Core startup categories
  {
    name: 'Software & Tools',
    slug: 'software-tools',
    description: 'SaaS subscriptions, development tools, software licenses',
    color: '#3b82f6',
    icon: 'laptop',
    isDefault: true,
    children: [
      { name: 'SaaS Subscriptions', slug: 'saas-subscriptions', color: '#3b82f6' },
      { name: 'Development Tools', slug: 'development-tools', color: '#3b82f6' },
      { name: 'Design Software', slug: 'design-software', color: '#3b82f6' },
      { name: 'Productivity Apps', slug: 'productivity-apps', color: '#3b82f6' },
    ]
  },
  {
    name: 'Marketing & Advertising',
    slug: 'marketing-advertising',
    description: 'Digital ads, content creation, marketing tools',
    color: '#f59e0b',
    icon: 'megaphone',
    isDefault: true,
    children: [
      { name: 'Google Ads', slug: 'google-ads', color: '#f59e0b' },
      { name: 'Facebook Ads', slug: 'facebook-ads', color: '#f59e0b' },
      { name: 'Content Creation', slug: 'content-creation', color: '#f59e0b' },
      { name: 'SEO Tools', slug: 'seo-tools', color: '#f59e0b' },
    ]
  },
  {
    name: 'Office & Equipment',
    slug: 'office-equipment',
    description: 'Hardware, office supplies, furniture',
    color: '#8b5cf6',
    icon: 'monitor',
    isDefault: true,
    children: [
      { name: 'Computers & Hardware', slug: 'computers-hardware', color: '#8b5cf6' },
      { name: 'Office Furniture', slug: 'office-furniture', color: '#8b5cf6' },
      { name: 'Office Supplies', slug: 'office-supplies', color: '#8b5cf6' },
    ]
  },
  {
    name: 'Travel & Meals',
    slug: 'travel-meals',
    description: 'Business travel, client meals, team lunches',
    color: '#ef4444',
    icon: 'plane',
    isDefault: true,
    children: [
      { name: 'Flights', slug: 'flights', color: '#ef4444' },
      { name: 'Hotels', slug: 'hotels', color: '#ef4444' },
      { name: 'Meals & Entertainment', slug: 'meals-entertainment', color: '#ef4444' },
      { name: 'Transportation', slug: 'transportation', color: '#ef4444' },
    ]
  },
  {
    name: 'Legal & Professional',
    slug: 'legal-professional',
    description: 'Legal fees, accounting, consulting services',
    color: '#06b6d4',
    icon: 'scales',
    isDefault: true,
    children: [
      { name: 'Legal Fees', slug: 'legal-fees', color: '#06b6d4' },
      { name: 'Accounting', slug: 'accounting', color: '#06b6d4' },
      { name: 'Consulting', slug: 'consulting', color: '#06b6d4' },
      { name: 'Insurance', slug: 'insurance', color: '#06b6d4' },
    ]
  },
  {
    name: 'Operations',
    slug: 'operations',
    description: 'Rent, utilities, operational expenses',
    color: '#84cc16',
    icon: 'building',
    isDefault: true,
    children: [
      { name: 'Office Rent', slug: 'office-rent', color: '#84cc16' },
      { name: 'Utilities', slug: 'utilities', color: '#84cc16' },
      { name: 'Internet & Phone', slug: 'internet-phone', color: '#84cc16' },
      { name: 'Banking & Fees', slug: 'banking-fees', color: '#84cc16' },
    ]
  },
  {
    name: 'Research & Development',
    slug: 'research-development',
    description: 'R&D expenses, patents, prototyping',
    color: '#ec4899',
    icon: 'beaker',
    isDefault: true,
    children: [
      { name: 'Prototyping', slug: 'prototyping', color: '#ec4899' },
      { name: 'Testing', slug: 'testing', color: '#ec4899' },
      { name: 'Patents & IP', slug: 'patents-ip', color: '#ec4899' },
    ]
  },
  {
    name: 'Miscellaneous',
    slug: 'miscellaneous',
    description: 'Other business expenses',
    color: '#6b7280',
    icon: 'dots-horizontal',
    isDefault: true,
    children: [
      { name: 'Other', slug: 'other', color: '#6b7280' },
    ]
  },
]