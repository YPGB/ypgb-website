import { slugField, type CollectionConfig } from 'payload'

import { anyone, staff } from '@/access'
import { revalidateOnChange } from '@/hooks/revalidate'

export const FileCategories: CollectionConfig = {
  slug: 'file-categories',
  labels: { singular: 'File Category', plural: 'File Categories' },
  admin: { useAsTitle: 'title', group: 'Files', enableRichTextLink: false },
  hooks: revalidateOnChange('files'),
  access: { read: anyone, create: staff, update: staff, delete: staff },
  fields: [{ name: 'title', type: 'text', required: true }, slugField({ position: 'sidebar' })],
}
