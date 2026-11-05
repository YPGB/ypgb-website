import { formBuilderPlugin } from '@payloadcms/plugin-form-builder'
import { nestedDocsPlugin } from '@payloadcms/plugin-nested-docs'
import { seoPlugin } from '@payloadcms/plugin-seo'
import type { Block, Plugin } from 'payload'

import { admin, anyone } from '@/access'
import type { Media, News, Page } from '@/payload-types'
import { newsPath, pagePath } from '@/lib/preview'

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

export const plugins: Plugin[] = [
  nestedDocsPlugin({
    collections: ['pages'],
    generateLabel: (_, doc) => String(doc.title ?? ''),
    generateURL: (docs) => docs.reduce((url, doc) => `${url}/${doc.slug}`, ''),
  }),
  seoPlugin({
    collections: ['pages', 'news'],
    uploadsCollection: 'media',
    tabbedUI: true,
    generateTitle: ({ doc }) => (doc as Page | News)?.title ?? '',
    generateDescription: ({ doc }) => {
      const d = doc as Partial<Page & News>
      return d.excerpt ?? d.hero?.lead ?? ''
    },
    generateImage: ({ doc }) => {
      const img = (doc as Partial<News>).coverImage
      return (typeof img === 'object' ? (img as Media | null)?.id : img) ?? ''
    },
    generateURL: ({ doc, collectionSlug }) =>
      `${serverUrl}${collectionSlug === 'news' ? newsPath((doc as News).slug) : pagePath(doc as Page)}`,
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
    },
    redirectRelationships: ['pages'],
    formOverrides: {
      admin: { group: 'Forms' },
      access: { read: anyone, create: admin, update: admin, delete: admin },
    },
    formSubmissionOverrides: {
      admin: { group: 'Forms' },
      access: { read: admin, update: admin, delete: admin },
    },
  }),
]
