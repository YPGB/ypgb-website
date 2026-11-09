import type { ArrayField, Field, GroupField } from 'payload'

import { icon } from './icon'

/** `secondary` is shown as "Outline" in the admin; the stored value stays for existing content. */
export const BUTTON_APPEARANCES = [
  'primary',
  'secondary',
  'soft',
  'ghost',
  'accent',
  'parchment',
  'brandDeep',
  'white',
  'black',
  'link',
] as const
export type ButtonAppearance = (typeof BUTTON_APPEARANCES)[number]

type LinkOptions = {
  name?: string
  label?: string
  /** Adds the button style select (Primary / Secondary / Accent / Link). */
  appearance?: boolean
  required?: boolean
  /** Prefills the label, e.g. a standard button text. */
  defaultLabel?: string
}

export const link = ({
  name = 'link',
  label,
  appearance = false,
  required = true,
  defaultLabel,
}: LinkOptions = {}): GroupField => {
  const fields: Field[] = [
    {
      type: 'row',
      fields: [
        {
          name: 'type',
          type: 'radio',
          defaultValue: 'page',
          options: [
            { label: 'Page', value: 'page' },
            { label: 'External URL', value: 'external' },
            { label: 'File', value: 'file' },
          ],
          admin: { layout: 'horizontal', width: '50%' },
        },
        {
          name: 'newTab',
          type: 'checkbox',
          label: 'Open in new tab',
          admin: { width: '50%', style: { alignSelf: 'flex-end' } },
        },
      ],
    },
    {
      type: 'row',
      fields: [
        {
          name: 'label',
          type: 'text',
          required,
          defaultValue: defaultLabel,
          admin: { width: '50%' },
        },
        {
          name: 'page',
          type: 'relationship',
          relationTo: 'pages',
          required,
          // Unpublished pages have no public URL, so a link to one would silently disappear.
          filterOptions: { _status: { equals: 'published' } },
          admin: {
            width: '30%',
            description: 'Published pages only.',
            condition: (_, s) => !s?.type || s.type === 'page',
          },
        },
        {
          name: 'anchor',
          type: 'text',
          admin: {
            width: '20%',
            placeholder: 'unit',
            description: 'Section anchor ID (optional)',
            condition: (_, s) => !s?.type || s.type === 'page',
          },
        },
        {
          name: 'url',
          type: 'text',
          label: 'URL',
          required,
          admin: { width: '50%', condition: (_, s) => s?.type === 'external' },
        },
        {
          name: 'file',
          type: 'upload',
          relationTo: 'files',
          required,
          admin: {
            width: '50%',
            description: 'Downloads the file. Shows a download icon unless another icon is chosen.',
            condition: (_, s) => s?.type === 'file',
          },
        },
      ],
    },
  ]

  if (appearance) {
    fields.push({
      type: 'row',
      fields: [
        {
          name: 'appearance',
          type: 'select',
          label: 'Style',
          defaultValue: 'primary',
          options: [
            { label: 'Primary (wheat gold): the main action', value: 'primary' },
            { label: 'Outline: a second action next to Primary', value: 'secondary' },
            { label: 'Soft (sand fill): quieter than Primary', value: 'soft' },
            { label: 'Ghost: minor actions, fill on hover only', value: 'ghost' },
            { label: 'Accent (wax seal): max one per page', value: 'accent' },
            { label: 'Parchment: light, for dark bands and photos', value: 'parchment' },
            { label: 'Brand deep (dark umber)', value: 'brandDeep' },
            { label: 'White', value: 'white' },
            { label: 'Black', value: 'black' },
            { label: 'Link: text only', value: 'link' },
          ],
          admin: { width: '50%' },
        },
        icon({
          label: 'Icon',
          admin: { width: '25%', description: 'Optional. Arrow always sits after the label.' },
        }),
        {
          name: 'iconPosition',
          type: 'radio',
          label: 'Icon position',
          defaultValue: 'before',
          options: [
            { label: 'Before', value: 'before' },
            { label: 'After', value: 'after' },
          ],
          admin: {
            width: '25%',
            layout: 'horizontal',
            condition: (_, s) => Boolean(s?.icon) && s?.icon !== 'arrow-right',
          },
        },
      ],
    })
  }

  return {
    name,
    label,
    type: 'group',
    admin: { hideGutter: true },
    fields,
  }
}

export const links = ({
  name = 'links',
  maxRows = 2,
  appearance = true,
}: { name?: string; maxRows?: number; appearance?: boolean } = {}): ArrayField => ({
  name,
  type: 'array',
  maxRows,
  labels: { singular: 'Button', plural: 'Buttons' },
  admin: { initCollapsed: true },
  fields: [link({ appearance })],
})
