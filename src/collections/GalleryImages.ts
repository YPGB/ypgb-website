import type { CollectionConfig } from 'payload'

import { anyone, staff } from '@/access'

import { imageUpload } from './imageUpload'

/** Album photos only. Kept apart from Media so they have their own folder in storage. */
export const GalleryImages: CollectionConfig = {
  slug: 'gallery-images',
  labels: { singular: 'Gallery Image', plural: 'Gallery Images' },
  admin: { group: 'Gallery', enableRichTextLink: false },
  access: { read: anyone, create: staff, update: staff, delete: staff },
  fields: [
    {
      name: 'alt',
      type: 'text',
      admin: { description: 'Optional. When empty, the album title and photo number are used.' },
    },
  ],
  upload: { ...imageUpload, staticDir: 'gallery-images' },
}
