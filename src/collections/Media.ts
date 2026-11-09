import type { CollectionConfig } from 'payload'

import { anyone, staff } from '@/access'

import { imageUpload } from './imageUpload'

export const Media: CollectionConfig = {
  slug: 'media',
  access: { read: anyone, create: staff, update: staff, delete: staff },
  fields: [
    {
      name: 'alt',
      type: 'text',
      required: true,
      admin: { description: 'Describe the image in Bahasa Indonesia, e.g. "Siswa SD mengikuti upacara".' },
    },
  ],
  upload: imageUpload,
}
