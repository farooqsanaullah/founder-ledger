import { db } from '@/lib/db'
import { categories } from '@/lib/db/schema'
import { defaultCategoryTemplates } from '@/lib/seed-data'

export async function seedStartupCategories(startupId: string) {
  console.log(`🏷️ Creating default categories for startup: ${startupId}`)
  
  try {
    for (const template of defaultCategoryTemplates) {
      // Create parent category
      const [parentCategory] = await db.insert(categories).values({
        startupId,
        name: template.name,
        slug: template.slug,
        description: template.description,
        color: template.color,
        icon: template.icon,
        isDefault: template.isDefault,
        sortOrder: defaultCategoryTemplates.indexOf(template),
      }).returning() as any

      // Create child categories if they exist
      if (template.children && template.children.length > 0) {
        for (let i = 0; i < template.children.length; i++) {
          const child = template.children[i]
          await db.insert(categories).values({
            startupId,
            name: child.name,
            slug: child.slug,
            color: child.color,
            parentId: parentCategory.id,
            sortOrder: i,
            isDefault: false,
          })
        }
      }
    }

    console.log(`✅ Created ${defaultCategoryTemplates.length} parent categories with subcategories`)
    return true
  } catch (error) {
    console.error('❌ Error seeding startup categories:', error)
    throw error
  }
}