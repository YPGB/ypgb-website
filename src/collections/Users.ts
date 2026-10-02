import type { CollectionConfig } from 'payload'

import { admin, adminField, adminOrSelf, isAdminUser } from '@/access'

export const Users: CollectionConfig = {
  slug: 'users',
  admin: {
    useAsTitle: 'email',
    defaultColumns: ['name', 'email', 'role'],
    group: 'Settings',
    hidden: ({ user }) => !isAdminUser(user),
  },
  auth: true,
  access: {
    create: admin,
    delete: admin,
    read: adminOrSelf,
    update: adminOrSelf,
  },
  hooks: {
    beforeChange: [
      async ({ data, operation, req }) => {
        if (operation !== 'create') return data
        const { totalDocs } = await req.payload.count({ collection: 'users', req })
        return totalDocs === 0 ? { ...data, role: 'admin' } : data
      },
    ],
  },
  fields: [
    { name: 'name', type: 'text' },
    {
      name: 'role',
      type: 'select',
      required: true,
      defaultValue: 'editor',
      saveToJWT: true,
      options: [
        { label: 'Admin', value: 'admin' },
        { label: 'Editor', value: 'editor' },
      ],
      access: { create: adminField, update: adminField },
      admin: {
        position: 'sidebar',
        description: 'Admin: everything. Editor: pages, news, units, pengurus and media.',
      },
    },
  ],
}
