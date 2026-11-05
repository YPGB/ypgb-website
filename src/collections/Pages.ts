import { createBreadcrumbsField, createParentField } from '@payloadcms/plugin-nested-docs'
import { slugField, type CollectionConfig } from 'payload'

import { publishedOrStaff, staff } from '@/access'
import { pageBlocks } from '@/blocks/config'
import { hero } from '@/heros/config'
import { limitAccentButtons } from '@/hooks/limitAccentButtons'
import { revalidateOnChange } from '@/hooks/revalidate'
import { ROOT_ONLY, validatePageParent } from '@/hooks/validatePageParent'
import { pagePath, previewUrl } from '@/lib/preview'

export const Pages: CollectionConfig = {
  slug: 'pages',
  orderable: true,
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'slug', '_status', 'updatedAt'],
    description:
      'The page with slug "home" is the homepage; slug "berita" is the news index (/berita). Renaming either breaks that URL. Slugs must be unique across all pages, even under different parents.',
    livePreview: { url: ({ data }) => previewUrl(pagePath(data)) },
    preview: (data) => previewUrl(pagePath(data)),
  },
  access: {
    read: publishedOrStaff,
    create: staff,
    update: staff,
    delete: staff,
  },
  versions: {
    drafts: { autosave: { interval: 375 }, schedulePublish: false },
    maxPerDoc: 30,
  },
  hooks: {
    ...revalidateOnChange('pages'),
    beforeValidate: [validatePageParent, limitAccentButtons],
  },
  fields: [
    { name: 'title', type: 'text', required: true },
    slugField({ position: 'sidebar' }),
    createParentField('pages', {
      label: 'Parent page',
      admin: {
        position: 'sidebar',
        description: 'Nests this page under another; its URL follows, e.g. /parent/this-page.',
        condition: (data) => !ROOT_ONLY.includes(data?.slug),
      },
      // Not itself or its descendants (a loop), nor pages whose URL can't have children.
      filterOptions: ({ id }) => ({
        slug: { not_in: ROOT_ONLY },
        ...(id && { id: { not_equals: id }, 'breadcrumbs.doc': { not_in: [id] } }),
      }),
    }),
    createBreadcrumbsField('pages', { admin: { hidden: true } }),
    {
      name: 'showSidebar',
      type: 'checkbox',
      label: 'Show sidebar',
      admin: {
        position: 'sidebar',
        description: 'Lists the subpages of this page, or its sibling pages if it has none. Order pages by dragging them in the list view.',
        condition: (data) => !ROOT_ONLY.includes(data?.slug),
      },
    },
    {
      type: 'tabs',
      tabs: [
        { label: 'Hero', fields: [hero] },
        {
          label: 'Content',
          fields: [
            {
              name: 'layout',
              type: 'blocks',
              blocks: pageBlocks,
              admin: { initCollapsed: true },
            },
          ],
        },
      ],
    },
  ],
}
