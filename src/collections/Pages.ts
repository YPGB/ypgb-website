import { slugField, type CollectionConfig } from 'payload'

import { publishedOrStaff, staff } from '@/access'
import { pageBlocks } from '@/blocks/config'
import { hero } from '@/heros/config'
import { limitAccentButtons } from '@/hooks/limitAccentButtons'
import { revalidateOnChange } from '@/hooks/revalidate'
import { previewUrl } from '@/lib/preview'

export const Pages: CollectionConfig = {
  slug: 'pages',
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'slug', '_status', 'updatedAt'],
    description: 'The page with slug "home" is the homepage.',
    livePreview: { url: ({ data }) => previewUrl('pages', data?.slug) },
    preview: (data) => previewUrl('pages', data?.slug as string),
  },
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
  hooks: {
    ...revalidateOnChange('pages'),
    beforeValidate: [limitAccentButtons],
  },
  fields: [
    { name: 'title', type: 'text', required: true },
    slugField({ position: 'sidebar' }),
    {
      type: 'tabs',
      tabs: [
        { label: 'Hero', fields: [hero] },
        {
          label: 'Content',
          fields: [
            {
              name: 'layout',
              type: 'blocks',
              blocks: pageBlocks,
              admin: { initCollapsed: true },
            },
          ],
        },
      ],
    },
  ],
}
