import type { CollectionConfig } from 'payload'

import { anyone, staff } from '@/access'

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
  upload: {
    focalPoint: true,
    mimeTypes: ['image/*'],
    imageSizes: [400, 768, 1600].map((width, i) => ({
      name: ['thumbnail', 'card', 'large'][i],
      width,
      withoutEnlargement: true,
      formatOptions: { format: 'webp' as const, options: { quality: 82 } },
    })),
  },
}
