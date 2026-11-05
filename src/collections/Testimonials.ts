import type { CollectionConfig } from 'payload'

import { anyone, staff } from '@/access'
import { revalidateOnChange } from '@/hooks/revalidate'

export const Testimonials: CollectionConfig = {
  slug: 'testimonials',
  labels: { singular: 'Testimonial', plural: 'Testimonials' },
  orderable: true,
  admin: {
    useAsTitle: 'name',
    defaultColumns: ['name', 'detail', 'role'],
    description: 'Drag rows to set the display order. Shown through the Testimonials block on any page.',
  },
  hooks: revalidateOnChange('testimonials'),
  access: { read: anyone, create: staff, update: staff, delete: staff },
  fields: [
    { name: 'quote', type: 'textarea', required: true },
    {
      type: 'row',
      fields: [
        { name: 'name', type: 'text', required: true, admin: { width: '34%' } },
        { name: 'detail', type: 'text', admin: { width: '33%', placeholder: 'Alumni SMA, 2011' } },
        { name: 'role', type: 'text', admin: { width: '33%', placeholder: 'Guru' } },
      ],
    },
    { name: 'photo', type: 'upload', relationTo: 'media' },
  ],
}
