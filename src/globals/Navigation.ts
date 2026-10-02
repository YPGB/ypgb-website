import type { GlobalConfig } from 'payload'
import { revalidateTag } from 'next/cache'

import { admin, anyone } from '@/access'
import { link } from '@/fields/link'

export const NAVIGATION_TAG = 'navigation'

export const Navigation: GlobalConfig = {
  slug: 'navigation',
  admin: { group: 'Settings' },
  access: { read: anyone, update: admin },
  hooks: {
    afterChange: [
      ({ req: { context } }) => {
        if (!context.disableRevalidate) revalidateTag(NAVIGATION_TAG, { expire: 0 })
      },
    ],
  },
  fields: [
    {
      type: 'tabs',
      tabs: [
        {
          label: 'Header',
          fields: [
            {
              name: 'headerItems',
              type: 'array',
              label: 'Menu items',
              maxRows: 7,
              admin: { initCollapsed: true },
              fields: [link()],
            },
            { name: 'hasHeaderButton', type: 'checkbox', label: 'Show highlighted button (e.g. "Daftar")' },
            {
              ...link({ name: 'headerButton' }),
              admin: { hideGutter: true, condition: (data) => Boolean(data?.hasHeaderButton) },
            },
          ],
        },
        {
          label: 'Footer',
          fields: [
            {
              name: 'footerColumns',
              type: 'array',
              label: 'Link columns',
              maxRows: 4,
              admin: { initCollapsed: true },
              fields: [
                { name: 'title', type: 'text', required: true },
                {
                  name: 'links',
                  type: 'array',
                  admin: { initCollapsed: true },
                  fields: [link()],
                },
              ],
            },
            {
              name: 'bottomText',
              type: 'text',
              admin: { description: 'Shown next to the copyright line, e.g. the city.' },
            },
          ],
        },
      ],
    },
  ],
}
