import type { ArrayField, Field, GroupField } from 'payload'

export const BUTTON_APPEARANCES = ['primary', 'secondary', 'accent', 'link'] as const
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
            condition: (_, s) => s?.type !== 'external',
          },
        },
        {
          name: 'anchor',
          type: 'text',
          admin: {
            width: '20%',
            placeholder: 'unit',
            description: 'Section anchor ID (optional)',
            condition: (_, s) => s?.type !== 'external',
          },
        },
        {
          name: 'url',
          type: 'text',
          label: 'URL',
          required,
          admin: { width: '50%', condition: (_, s) => s?.type === 'external' },
        },
      ],
    },
  ]

  if (appearance) {
    fields.push({
      name: 'appearance',
      type: 'select',
      defaultValue: 'primary',
      options: [
        { label: 'Primary (wheat gold)', value: 'primary' },
        { label: 'Secondary', value: 'secondary' },
        { label: 'Accent (wax seal) — max one per page', value: 'accent' },
        { label: 'Link', value: 'link' },
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
