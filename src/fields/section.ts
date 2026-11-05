import type { GroupField } from 'payload'

import { link } from './link'

export const SECTION_BACKGROUNDS = ['page', 'white', 'warm', 'brand', 'brandDeep'] as const
export type SectionBackground = (typeof SECTION_BACKGROUNDS)[number]

const anchorPattern = /^[a-z0-9]+(?:-[a-z0-9]+)*$/

/** True when a field sits directly on a page-layout block (`layout.N.field`), not inside a Content Group. */
const isTopLevelBlock = (path: (string | number)[]) => path[0] === 'layout' && path.length === 3

/**
 * Settings shared by every section block: anchor, background, heading.
 * `nestable` blocks can also sit inside a Content Group, where the group owns the section, so it's hidden there.
 * `alignOnly` keeps just the heading's alignment, for blocks with their own title (CTA).
 */
export const section = ({
  nestable = false,
  alignOnly = false,
}: { nestable?: boolean; alignOnly?: boolean } = {}): GroupField => ({
  name: 'section',
  type: 'group',
  label: 'Section settings',
  admin: {
    hideGutter: true,
    ...(nestable && { condition: (_data, _siblingData, { path }) => isTopLevelBlock(path) }),
  },
  fields: [
    {
      type: 'row',
      fields: [
        {
          name: 'anchorId',
          type: 'text',
          label: 'Anchor ID',
          admin: {
            width: '50%',
            placeholder: 'unit',
            description: 'Lowercase letters, numbers and dashes. Used by menu links (/#unit).',
          },
          validate: (value: string | null | undefined) =>
            !value || anchorPattern.test(value) || 'Use lowercase letters, numbers and dashes only.',
        },
        {
          name: 'background',
          type: 'select',
          defaultValue: 'page',
          required: true,
          options: [
            { label: 'Page (parchment)', value: 'page' },
            { label: 'White', value: 'white' },
            { label: 'Warm (sand tint)', value: 'warm' },
            { label: 'Brand (dark umber)', value: 'brand' },
            { label: 'Brand deep', value: 'brandDeep' },
          ],
          // `blocks.N.section.background`; deeper means inside a Content Group, which owns the background.
          admin: { width: '50%', condition: (_data, _siblingData, { path }) => path.length <= 4 },
        },
      ],
    },
    {
      name: 'heading',
      type: 'group',
      label: alignOnly ? 'Layout' : undefined,
      fields: [
        { name: 'title', type: 'text', admin: { hidden: alignOnly } },
        { name: 'subtitle', type: 'textarea', admin: { hidden: alignOnly } },
        {
          type: 'row',
          fields: [
            {
              name: 'align',
              type: 'radio',
              defaultValue: alignOnly ? 'center' : 'left',
              options: [
                { label: 'Left', value: 'left' },
                { label: 'Center', value: 'center' },
              ],
              admin: { layout: 'horizontal', width: '50%' },
            },
            {
              name: 'hasAction',
              type: 'checkbox',
              label: 'Add action link (e.g. "Lihat Semua")',
              admin: { width: '50%', style: { alignSelf: 'flex-end' }, hidden: alignOnly },
            },
          ],
        },
        {
          ...link({ name: 'action' }),
          admin: { hideGutter: true, condition: (_, s) => !alignOnly && Boolean(s?.hasAction) },
        },
      ],
    },
  ],
})
