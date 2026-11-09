import { slugField, type CollectionConfig } from 'payload'

import { publishedOrStaff, staff } from '@/access'
import { revalidateOnChange } from '@/hooks/revalidate'
import { journalPath, previewUrl } from '@/lib/preview'

export const Journals: CollectionConfig = {
  slug: 'journals',
  labels: { singular: 'Journal', plural: 'Journals' },
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'issue', 'publishedAt', '_status'],
    livePreview: { url: ({ data }) => previewUrl(journalPath(data?.slug)) },
    preview: (data) => previewUrl(journalPath(data?.slug as string)),
  },
  defaultSort: '-publishedAt',
  hooks: revalidateOnChange('journals'),
  access: { read: publishedOrStaff, create: staff, update: staff, delete: staff },
  versions: {
    drafts: { autosave: { interval: 375 }, schedulePublish: false },
    maxPerDoc: 10,
  },
  fields: [
    { name: 'title', type: 'text', required: true },
    slugField({ position: 'sidebar' }),
    {
      name: 'publishedAt',
      type: 'date',
      label: 'Date',
      required: true,
      defaultValue: () => new Date().toISOString(),
      admin: { position: 'sidebar', date: { pickerAppearance: 'dayOnly', displayFormat: 'd MMMM yyyy' } },
    },
    {
      name: 'issue',
      type: 'text',
      label: 'Volume / number',
      admin: { position: 'sidebar', placeholder: 'Vol. 3, No. 1' },
    },
    { name: 'issn', type: 'text', label: 'ISSN', admin: { position: 'sidebar' } },
    { name: 'coverImage', type: 'upload', relationTo: 'media' },
    { name: 'abstract', type: 'textarea' },
    {
      name: 'pdf',
      type: 'upload',
      relationTo: 'files',
      label: 'PDF',
      required: true,
      filterOptions: { mimeType: { equals: 'application/pdf' } },
    },
    {
      name: 'articles',
      type: 'array',
      labels: { singular: 'Article', plural: 'Articles' },
      admin: {
        initCollapsed: true,
        description: 'Optional table of contents. Clicking an article opens the viewer at its start page.',
      },
      fields: [
        { name: 'title', type: 'text', required: true },
        {
          type: 'row',
          fields: [
            { name: 'authors', type: 'text', admin: { width: '70%' } },
            { name: 'page', type: 'number', label: 'Start page', required: true, min: 1, admin: { width: '30%' } },
          ],
        },
      ],
    },
  ],
}
