import type { Block } from 'payload'

import { icon } from '@/fields/icon'
import { link, links } from '@/fields/link'
import { section } from '@/fields/section'

const columns = (options: string[], defaultValue: string) =>
  ({
    name: 'columns',
    type: 'select',
    defaultValue,
    required: true,
    options: options.map((value) => ({ label: `${value} per row`, value })),
  }) as const

export const RichTextBlock: Block = {
  slug: 'richText',
  labels: { singular: 'Rich Text', plural: 'Rich Text' },
  fields: [
    section(),
    { name: 'content', type: 'richText', required: true },
    {
      name: 'layout',
      type: 'radio',
      defaultValue: 'single',
      options: [
        { label: 'Single column', value: 'single' },
        { label: 'Two columns', value: 'twoColumns' },
      ],
      admin: { layout: 'horizontal' },
    },
  ],
}

export const TabsBlock: Block = {
  slug: 'tabs',
  labels: { singular: 'Tabs', plural: 'Tabs' },
  fields: [
    section(),
    {
      name: 'tabs',
      type: 'array',
      minRows: 1,
      required: true,
      admin: { initCollapsed: true },
      fields: [
        { name: 'label', type: 'text', required: true },
        { name: 'content', type: 'richText', required: true },
      ],
    },
  ],
}

export const MediaTextBlock: Block = {
  slug: 'mediaText',
  labels: { singular: 'Media + Text', plural: 'Media + Text' },
  fields: [
    section(),
    {
      type: 'row',
      fields: [
        { name: 'media', type: 'upload', relationTo: 'media', required: true, admin: { width: '70%' } },
        {
          name: 'mediaPosition',
          type: 'radio',
          defaultValue: 'left',
          options: [
            { label: 'Image left', value: 'left' },
            { label: 'Image right', value: 'right' },
          ],
          admin: { width: '30%' },
        },
      ],
    },
    { name: 'content', type: 'richText', required: true },
    links(),
  ],
}

export const CardGridBlock: Block = {
  slug: 'cardGrid',
  labels: { singular: 'Card Grid', plural: 'Card Grids' },
  fields: [
    section(),
    columns(['2', '3', '4'], '3'),
    {
      name: 'cards',
      type: 'array',
      minRows: 1,
      required: true,
      admin: { initCollapsed: true },
      fields: [
        {
          type: 'row',
          fields: [icon({ admin: { width: '30%' } }), { name: 'title', type: 'text', required: true, admin: { width: '70%' } }],
        },
        { name: 'text', type: 'textarea' },
        { name: 'hasLink', type: 'checkbox', label: 'Add link' },
        { ...link(), admin: { hideGutter: true, condition: (_, s) => Boolean(s?.hasLink) } },
      ],
    },
  ],
}

export const CTABlock: Block = {
  slug: 'cta',
  labels: { singular: 'CTA Band', plural: 'CTA Bands' },
  fields: [
    section(),
    icon(),
    { name: 'title', type: 'text', required: true },
    { name: 'text', type: 'textarea' },
    links(),
  ],
}

export const UnitListBlock: Block = {
  slug: 'unitList',
  labels: { singular: 'Unit List', plural: 'Unit Lists' },
  fields: [
    section(),
    {
      type: 'row',
      fields: [
        {
          name: 'mode',
          type: 'radio',
          defaultValue: 'all',
          options: [
            { label: 'All units', value: 'all' },
            { label: 'Choose units', value: 'selected' },
          ],
          admin: { width: '50%' },
        },
        columns(['3', '4'], '4'),
      ],
    },
    {
      name: 'level',
      type: 'select',
      hasMany: true,
      options: ['TK', 'SD', 'SMP', 'SMA'],
      admin: { description: 'Leave empty to show every level.', condition: (_, s) => s?.mode !== 'selected' },
    },
    {
      name: 'units',
      type: 'relationship',
      relationTo: 'units',
      hasMany: true,
      required: true,
      admin: { condition: (_, s) => s?.mode === 'selected' },
    },
  ],
}

export const NewsListBlock: Block = {
  slug: 'newsList',
  labels: { singular: 'News List', plural: 'News Lists' },
  fields: [
    section(),
    {
      type: 'row',
      fields: [
        {
          name: 'mode',
          type: 'radio',
          defaultValue: 'latest',
          options: [
            { label: 'Latest', value: 'latest' },
            { label: 'Choose articles', value: 'selected' },
          ],
          admin: { width: '50%' },
        },
        {
          name: 'layout',
          type: 'radio',
          defaultValue: 'grid',
          options: [
            { label: 'Grid', value: 'grid' },
            { label: 'List', value: 'list' },
          ],
          admin: { width: '50%' },
        },
      ],
    },
    {
      type: 'row',
      admin: { condition: (_, s) => s?.mode !== 'selected' },
      fields: [
        { name: 'limit', type: 'number', defaultValue: 3, min: 1, max: 12, admin: { width: '30%' } },
        {
          name: 'categories',
          type: 'relationship',
          relationTo: 'news-categories',
          hasMany: true,
          admin: { width: '70%', description: 'Leave empty for all categories.' },
        },
      ],
    },
    {
      name: 'items',
      type: 'relationship',
      relationTo: 'news',
      hasMany: true,
      required: true,
      admin: { condition: (_, s) => s?.mode === 'selected' },
    },
  ],
}

export const PengurusListBlock: Block = {
  slug: 'pengurusList',
  labels: { singular: 'Pengurus List', plural: 'Pengurus Lists' },
  fields: [
    section(),
    {
      type: 'row',
      fields: [
        {
          name: 'organ',
          type: 'select',
          hasMany: true,
          label: 'Body',
          options: [
            { label: 'Pembina', value: 'pembina' },
            { label: 'Pengurus', value: 'pengurus' },
            { label: 'Pengawas', value: 'pengawas' },
          ],
          admin: { width: '50%', description: 'Leave empty to show all active members.' },
        },
        {
          name: 'groupByOrgan',
          type: 'checkbox',
          label: 'Group by body (Pembina / Pengurus / Pengawas)',
          admin: { width: '50%', style: { alignSelf: 'flex-end' } },
        },
      ],
    },
  ],
}

export const ContactBlock: Block = {
  slug: 'contact',
  labels: { singular: 'Contact', plural: 'Contact' },
  fields: [
    section(),
    {
      name: 'showDetails',
      type: 'checkbox',
      defaultValue: true,
      label: 'Show address, phones and office hours from Site Settings',
    },
    { name: 'form', type: 'relationship', relationTo: 'forms' },
  ],
}

export const pageBlocks: Block[] = [
  RichTextBlock,
  TabsBlock,
  MediaTextBlock,
  CardGridBlock,
  CTABlock,
  UnitListBlock,
  NewsListBlock,
  PengurusListBlock,
  ContactBlock,
]
