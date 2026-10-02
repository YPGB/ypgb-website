import { slugField, type CollectionConfig } from 'payload'

import { anyone, staff } from '@/access'
import { revalidateOnChange } from '@/hooks/revalidate'

export const NewsCategories: CollectionConfig = {
  slug: 'news-categories',
  labels: { singular: 'News Category', plural: 'News Categories' },
  admin: { useAsTitle: 'title', group: 'News' },
  hooks: revalidateOnChange('news'),
  access: { read: anyone, create: staff, update: staff, delete: staff },
  fields: [{ name: 'title', type: 'text', required: true }, slugField({ position: 'sidebar' })],
}
