import { slugField, type CollectionConfig } from 'payload'

import { publishedOrStaff, staff } from '@/access'
import { revalidateOnChange } from '@/hooks/revalidate'
import { albumPath, previewUrl } from '@/lib/preview'

export const Albums: CollectionConfig = {
  slug: 'albums',
  labels: { singular: 'Album', plural: 'Albums' },
  admin: {
    useAsTitle: 'title',
    group: 'Gallery',
    defaultColumns: ['title', 'publishedAt', 'unit', '_status'],
    livePreview: { url: ({ data }) => previewUrl(albumPath(data?.slug)) },
    preview: (data) => previewUrl(albumPath(data?.slug as string)),
  },
  defaultSort: '-publishedAt',
  hooks: revalidateOnChange('albums'),
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
    { name: 'unit', type: 'relationship', relationTo: 'units', admin: { position: 'sidebar' } },
    {
      name: 'cover',
      type: 'upload',
      relationTo: 'gallery-images',
      admin: { description: 'Optional. When empty, the first photo is used.' },
    },
    {
      name: 'photos',
      type: 'upload',
      relationTo: 'gallery-images',
      hasMany: true,
      required: true,
      maxRows: 15,
      admin: { description: 'Up to 15 chosen photos. Put the full album in the link below.' },
    },
    {
      name: 'moreUrl',
      type: 'text',
      label: 'See more link',
      admin: {
        placeholder: 'https://',
        description: 'Optional link to the full album, e.g. a Google Drive folder. Shown as "Lihat Semua Foto".',
      },
      validate: (value: null | string | undefined) =>
        !value || /^https?:\/\//.test(value) || 'Enter a full link starting with https://',
    },
  ],
}
