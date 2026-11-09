import { formBuilderPlugin } from '@payloadcms/plugin-form-builder'
import { nestedDocsPlugin } from '@payloadcms/plugin-nested-docs'
import { seoPlugin } from '@payloadcms/plugin-seo'
import type { Block, Plugin } from 'payload'

import { admin, anyone } from '@/access'
import type { Journal, Media, News, Page, Prayer } from '@/payload-types'
import { albumPath, journalPath, newsPath, pagePath, prayerPath } from '@/lib/preview'

const serverUrl = process.env.NEXT_PUBLIC_SERVER_URL || 'http://localhost:3000'

const phoneField: Block = {
  slug: 'phone',
  labels: { singular: 'Phone', plural: 'Phone' },
  fields: [
    {
      type: 'row',
      fields: [
        { name: 'name', type: 'text', required: true, admin: { width: '50%' } },
        { name: 'label', type: 'text', admin: { width: '50%' } },
      ],
    },
    {
      type: 'row',
      fields: [
        { name: 'width', type: 'number', label: 'Field width (%)', admin: { width: '50%' } },
        { name: 'required', type: 'checkbox', admin: { width: '50%' } },
      ],
    },
  ],
}

/** Dropdown filled from the Units collection on the site, with "Yayasan / Umum" chosen by default. */
const unitField: Block = {
  slug: 'unit',
  labels: { singular: 'Unit', plural: 'Unit' },
  fields: [
    {
      type: 'row',
      fields: [
        { name: 'name', type: 'text', required: true, defaultValue: 'unit', admin: { width: '50%' } },
        { name: 'label', type: 'text', defaultValue: 'Unit', admin: { width: '50%' } },
      ],
    },
    { name: 'width', type: 'number', label: 'Field width (%)' },
  ],
}

const seoPaths: Record<string, (slug?: string | null) => string> = {
  news: newsPath,
  prayers: prayerPath,
  journals: journalPath,
  albums: albumPath,
}

export const plugins: Plugin[] = [
  nestedDocsPlugin({
    collections: ['pages'],
    generateLabel: (_, doc) => String(doc.title ?? ''),
    generateURL: (docs) => docs.reduce((url, doc) => `${url}/${doc.slug}`, ''),
  }),
  seoPlugin({
    collections: ['pages', 'news', 'prayers', 'journals', 'albums'],
    uploadsCollection: 'media',
    tabbedUI: true,
    generateTitle: ({ doc }) => {
      const d = doc as Partial<Page & Prayer>
      return d.title ?? d.name ?? ''
    },
    generateDescription: ({ doc }) => {
      const d = doc as Partial<Page & News & Journal>
      return d.excerpt ?? d.abstract ?? d.hero?.lead ?? ''
    },
    generateImage: ({ doc }) => {
      const img = (doc as Partial<News>).coverImage
      return (typeof img === 'object' ? (img as Media | null)?.id : img) ?? ''
    },
    generateURL: ({ doc, collectionSlug }) => {
      const toPath = collectionSlug ? seoPaths[collectionSlug] : undefined
      return `${serverUrl}${toPath ? toPath((doc as News).slug) : pagePath(doc as Page)}`
    },
  }),
  formBuilderPlugin({
    fields: {
      text: true,
      email: true,
      textarea: true,
      select: true,
      checkbox: true,
      message: true,
      number: false,
      state: false,
      country: false,
      payment: false,
      phone: phoneField,
      unit: unitField,
    },
    redirectRelationships: ['pages'],
    formOverrides: {
      admin: { group: 'Forms' },
      access: { read: anyone, create: admin, update: admin, delete: admin },
    },
    formSubmissionOverrides: {
      admin: { group: 'Forms', defaultColumns: ['form', 'unit', 'createdAt'] },
      // Created only by `submitForm`, which checks for spam and validates the fields first.
      access: { create: () => false, read: admin, update: admin, delete: admin },
      fields: ({ defaultFields }) => [
        ...defaultFields,
        {
          name: 'unit',
          type: 'relationship',
          relationTo: 'units',
          admin: {
            position: 'sidebar',
            readOnly: true,
            description: 'From the Unit form field, for filtering. Empty means Yayasan / Umum.',
          },
        },
      ],
    },
  }),
]
