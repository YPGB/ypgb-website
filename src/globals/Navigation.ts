import type { GlobalConfig } from 'payload'
import { revalidateTag } from 'next/cache'
import { array } from 'payload/shared'

import { admin, anyone } from '@/access'
import { CTABlock } from '@/blocks/config'
import { link } from '@/fields/link'

export const NAVIGATION_TAG = 'navigation'

/** More than this won't fit beside the logo at 1024px. */
const MAX_BAR_LINKS = 5

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
              validate: (value, args) => {
                const ticked = ((value ?? []) as { showInBar?: boolean }[]).filter((row) => row.showInBar).length
                if (ticked > MAX_BAR_LINKS) return `At most ${MAX_BAR_LINKS} items can show in the navbar.`
                return array(value, args)
              },
              fields: [
                link(),
                {
                  name: 'showInBar',
                  type: 'checkbox',
                  label: 'Show in navbar',
                  admin: {
                    description: `Also shows this link beside the menu button on large screens (at most ${MAX_BAR_LINKS}).`,
                  },
                },
                {
                  name: 'children',
                  type: 'array',
                  label: 'Submenu',
                  labels: { singular: 'Submenu item', plural: 'Submenu items' },
                  admin: { initCollapsed: true },
                  fields: [link()],
                },
              ],
            },
            {
              name: 'secondaryLinks',
              type: 'array',
              label: 'Secondary links',
              admin: { initCollapsed: true, description: 'Smaller links beside the main menu.' },
              fields: [link()],
            },
            {
              name: 'linkGroups',
              type: 'array',
              label: 'Link groups',
              admin: { initCollapsed: true, description: 'Titled groups under the secondary links, e.g. "Unit Sekolah".' },
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
              name: 'footerBlocks',
              type: 'blocks',
              label: 'Band above the footer',
              blocks: [CTABlock],
              maxRows: 2,
              admin: { initCollapsed: true, description: 'Shown on every page. Leave empty for none.' },
            },
            {
              name: 'footerColumns',
              type: 'array',
              label: 'Link groups',
              maxRows: 12,
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
