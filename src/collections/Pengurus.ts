import type { CollectionConfig } from 'payload'

import { anyone, staff } from '@/access'
import { revalidateOnChange } from '@/hooks/revalidate'

export const Pengurus: CollectionConfig = {
  slug: 'pengurus',
  labels: { singular: 'Pengurus', plural: 'Pengurus' },
  orderable: true,
  admin: {
    useAsTitle: 'name',
    defaultColumns: ['name', 'position', 'organ', 'active'],
    description: 'Drag rows to set the display order.',
  },
  hooks: revalidateOnChange('pengurus'),
  access: { read: anyone, create: staff, update: staff, delete: staff },
  fields: [
    {
      type: 'row',
      fields: [
        { name: 'titlePrefix', type: 'text', label: 'Title before', admin: { width: '20%', placeholder: 'Br.' } },
        { name: 'name', type: 'text', required: true, admin: { width: '55%' } },
        { name: 'titleSuffix', type: 'text', label: 'Title after', admin: { width: '25%', placeholder: 'S.Pd.' } },
      ],
    },
    {
      type: 'row',
      fields: [
        { name: 'position', type: 'text', required: true, admin: { width: '40%', placeholder: 'Ketua' } },
        {
          name: 'organ',
          type: 'select',
          label: 'Body',
          required: true,
          defaultValue: 'pengurus',
          options: [
            { label: 'Pembina', value: 'pembina' },
            { label: 'Pengurus', value: 'pengurus' },
            { label: 'Pengawas', value: 'pengawas' },
          ],
          admin: { width: '30%' },
        },
        { name: 'term', type: 'text', label: 'Term', admin: { width: '30%', placeholder: '2024–2029' } },
      ],
    },
    { name: 'photo', type: 'upload', relationTo: 'media' },
    { name: 'bio', type: 'textarea', admin: { description: 'Optional. Shown in a dialog when the card is clicked.' } },
    {
      name: 'active',
      type: 'checkbox',
      defaultValue: true,
      admin: { position: 'sidebar', description: 'Inactive members are kept on record but not shown.' },
    },
  ],
}
