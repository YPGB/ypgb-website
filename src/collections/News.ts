import { slugField, type CollectionConfig } from 'payload'

import { publishedOrStaff, staff } from '@/access'
import { revalidateOnChange } from '@/hooks/revalidate'
import { previewUrl } from '@/lib/preview'

export const News: CollectionConfig = {
  slug: 'news',
  labels: { singular: 'News', plural: 'News' },
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'category', 'publishedAt', '_status'],
    livePreview: { url: ({ data }) => previewUrl('news', data?.slug) },
    preview: (data) => previewUrl('news', data?.slug as string),
  },
  defaultSort: '-publishedAt',
  hooks: revalidateOnChange('news'),
  access: {
    read: publishedOrStaff,
    create: staff,
    update: staff,
    delete: staff,
  },
  versions: {
    drafts: { autosave: { interval: 375 }, schedulePublish: false },
    maxPerDoc: 30,
  },
  fields: [
    { name: 'title', type: 'text', required: true },
    slugField({ position: 'sidebar' }),
    {
      name: 'publishedAt',
      type: 'date',
      required: true,
      defaultValue: () => new Date().toISOString(),
      admin: { position: 'sidebar', date: { pickerAppearance: 'dayOnly', displayFormat: 'd MMMM yyyy' } },
    },
    {
      name: 'category',
      type: 'relationship',
      relationTo: 'news-categories',
      admin: { position: 'sidebar' },
    },
    {
      name: 'author',
      type: 'text',
      required: true,
      defaultValue: async ({ req }) => {
        const settings = await req.payload.findGlobal({ slug: 'site-settings', depth: 0, req })
        return settings.name
      },
      admin: { position: 'sidebar' },
    },
    { name: 'coverImage', type: 'upload', relationTo: 'media' },
    {
      name: 'excerpt',
      type: 'textarea',
      admin: { description: 'One or two sentences shown on news cards.' },
    },
    { name: 'content', type: 'richText', required: true },
  ],
}
