import type { GroupField } from 'payload'

import { link } from './link'

export const SECTION_BACKGROUNDS = ['page', 'warm', 'brand', 'brandDeep'] as const
export type SectionBackground = (typeof SECTION_BACKGROUNDS)[number]

const anchorPattern = /^[a-z0-9]+(?:-[a-z0-9]+)*$/

/** Settings shared by every section block: anchor, background, heading. */
export const section = (): GroupField => ({
  name: 'section',
  type: 'group',
  label: 'Section settings',
  admin: { hideGutter: true },
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
            { label: 'Warm (sand tint)', value: 'warm' },
            { label: 'Brand (dark umber)', value: 'brand' },
            { label: 'Brand deep', value: 'brandDeep' },
          ],
          admin: { width: '50%' },
        },
      ],
    },
    {
      name: 'heading',
      type: 'group',
      fields: [
        {
          type: 'row',
          fields: [
            { name: 'overline', type: 'text', admin: { width: '35%' } },
            { name: 'title', type: 'text', admin: { width: '65%' } },
          ],
        },
        { name: 'subtitle', type: 'textarea' },
        {
          type: 'row',
          fields: [
            {
              name: 'align',
              type: 'radio',
              defaultValue: 'left',
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
              admin: { width: '50%', style: { alignSelf: 'flex-end' } },
            },
          ],
        },
        {
          ...link({ name: 'action' }),
          admin: { hideGutter: true, condition: (_, s) => Boolean(s?.hasAction) },
        },
      ],
    },
  ],
})
