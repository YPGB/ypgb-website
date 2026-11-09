import type { CollectionConfig } from 'payload'

import { anyone, staff } from '@/access'
import { revalidateOnChange } from '@/hooks/revalidate'

/** Downloadable files: announcements, letters, calendars, logos, journal PDFs. Listed by the Downloads block. */
export const Files: CollectionConfig = {
  slug: 'files',
  labels: { singular: 'File', plural: 'Files' },
  admin: {
    useAsTitle: 'title',
    group: 'Files',
    enableRichTextLink: false,
    defaultColumns: ['title', 'category', 'date', 'filename'],
    description: 'Semua file dapat diakses publik. Jangan mengunggah dokumen internal atau data pribadi.',
  },
  defaultSort: '-date',
  hooks: revalidateOnChange('files'),
  access: { read: anyone, create: staff, update: staff, delete: staff },
  fields: [
    { name: 'title', type: 'text', required: true },
    {
      name: 'category',
      type: 'relationship',
      relationTo: 'file-categories',
      required: true,
      admin: { position: 'sidebar' },
    },
    {
      name: 'date',
      type: 'date',
      required: true,
      defaultValue: () => new Date().toISOString(),
      admin: { position: 'sidebar', date: { pickerAppearance: 'dayOnly', displayFormat: 'd MMMM yyyy' } },
    },
    { name: 'description', type: 'textarea' },
  ],
  upload: {
    staticDir: 'files',
    mimeTypes: [
      'application/pdf',
      'image/png',
      'image/jpeg',
      'image/svg+xml',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      'application/zip',
      'application/x-zip-compressed',
    ],
    crop: false,
    focalPoint: false,
    adminThumbnail: 'thumbnail',
    imageSizes: [{ name: 'thumbnail', width: 160, withoutEnlargement: true }],
  },
}
