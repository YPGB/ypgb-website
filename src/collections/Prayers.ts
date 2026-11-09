import { slugField, type CollectionConfig } from 'payload'

import { publishedOrStaff, staff } from '@/access'
import { revalidateOnChange } from '@/hooks/revalidate'
import { prayerPath, previewUrl } from '@/lib/preview'

/** Shown like subpages of the CMS page with slug `doa`, but managed only here. */
export const Prayers: CollectionConfig = {
  slug: 'prayers',
  labels: { singular: 'Prayer', plural: 'Prayers' },
  orderable: true,
  admin: {
    useAsTitle: 'name',
    defaultColumns: ['name', '_status', 'updatedAt'],
    description: 'Drag rows to set the order in the prayer sidebar.',
    livePreview: { url: ({ data }) => previewUrl(prayerPath(data?.slug)) },
    preview: (data) => previewUrl(prayerPath(data?.slug as string)),
  },
  hooks: revalidateOnChange('prayers'),
  access: { read: publishedOrStaff, create: staff, update: staff, delete: staff },
  versions: {
    drafts: { autosave: { interval: 375 }, schedulePublish: false },
    maxPerDoc: 10,
  },
  fields: [
    { name: 'name', type: 'text', label: 'Prayer name', required: true },
    slugField({ useAsSlug: 'name', position: 'sidebar' }),
    { name: 'prayer', type: 'richText', required: true },
  ],
}
