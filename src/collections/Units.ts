import type { CollectionConfig } from 'payload'

import { anyone, staff } from '@/access'
import { revalidateOnChange } from '@/hooks/revalidate'

export const Units: CollectionConfig = {
  slug: 'units',
  labels: { singular: 'Unit', plural: 'Units' },
  orderable: true,
  admin: {
    useAsTitle: 'name',
    defaultColumns: ['name', 'abbreviation', 'level', 'accreditation'],
    description: 'Drag rows to set the display order.',
  },
  hooks: revalidateOnChange('units'),
  access: { read: anyone, create: staff, update: staff, delete: staff },
  fields: [
    {
      type: 'row',
      fields: [
        { name: 'abbreviation', type: 'text', required: true, admin: { width: '25%', placeholder: 'SD I' } },
        { name: 'name', type: 'text', required: true, admin: { width: '50%', placeholder: 'SD Gembala Baik I' } },
        {
          name: 'level',
          type: 'select',
          required: true,
          options: ['TK', 'SD', 'SMP', 'SMA'],
          admin: { width: '25%' },
        },
      ],
    },
    { name: 'photo', type: 'upload', relationTo: 'media' },
    { name: 'address', type: 'textarea' },
    {
      type: 'row',
      fields: [
        { name: 'principal', type: 'text', label: 'Kepala Sekolah', admin: { width: '50%' } },
        { name: 'accreditation', type: 'text', admin: { width: '50%', placeholder: 'Terakreditasi A' } },
      ],
    },
    {
      type: 'row',
      fields: [
        { name: 'phone', type: 'text', admin: { width: '33%' } },
        { name: 'email', type: 'email', admin: { width: '33%' } },
        { name: 'website', type: 'text', admin: { width: '34%', placeholder: 'https://' } },
      ],
    },
  ],
}
