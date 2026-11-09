import { BlocksFeature, lexicalEditor } from '@payloadcms/richtext-lexical'
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

/** Inserted between paragraphs; Rich Text block and News content. Rendered by `src/components/richtext/blockConverters.tsx`. */
export const richTextEmbeds: Block[] = [
  {
    slug: 'bigQuote',
    labels: { singular: 'Big Quote', plural: 'Big Quotes' },
    fields: [
      { name: 'text', type: 'textarea', required: true },
      { name: 'description', type: 'textarea', admin: { description: 'Optional line shown below the quote.' } },
      {
        name: 'align',
        type: 'radio',
        defaultValue: 'center',
        required: true,
        options: [
          { label: 'Center', value: 'center' },
          { label: 'Left', value: 'left' },
        ],
        admin: { layout: 'horizontal' },
      },
    ],
  },
  {
    slug: 'imageCarousel',
    labels: { singular: 'Image Carousel', plural: 'Image Carousels' },
    fields: [
      {
        name: 'images',
        type: 'upload',
        relationTo: 'media',
        hasMany: true,
        required: true,
        admin: { description: 'One image shows as a picture; two or more become a carousel.' },
      },
      { name: 'caption', type: 'text' },
    ],
  },
  {
    slug: 'button',
    labels: { singular: 'Button', plural: 'Buttons' },
    fields: [
      link({ appearance: true }),
      {
        name: 'align',
        type: 'radio',
        defaultValue: 'left',
        required: true,
        options: [
          { label: 'Left', value: 'left' },
          { label: 'Center', value: 'center' },
        ],
        admin: { layout: 'horizontal' },
      },
    ],
  },
  {
    slug: 'inlineCta',
    labels: { singular: 'Inline CTA', plural: 'Inline CTAs' },
    fields: [{ name: 'title', type: 'text', required: true }, link({ defaultLabel: 'Pelajari Lebih Lanjut' })],
  },
]

export const RichTextBlock: Block = {
  slug: 'richText',
  labels: { singular: 'Rich Text', plural: 'Rich Text' },
  fields: [
    section(),
    {
      name: 'content',
      type: 'richText',
      required: true,
      editor: lexicalEditor({
        features: ({ rootFeatures }) => [...rootFeatures, BlocksFeature({ blocks: richTextEmbeds })],
      }),
    },
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
    {
      type: 'row',
      fields: [
        { ...columns(['2', '3', '4'], '3'), admin: { width: '50%' } },
        {
          name: 'style',
          type: 'radio',
          defaultValue: 'standard',
          options: [
            { label: 'Standard', value: 'standard' },
            { label: 'Photo cards', value: 'photo' },
          ],
          admin: { width: '50%', layout: 'horizontal' },
        },
      ],
    },
    {
      type: 'row',
      fields: [
        {
          name: 'source',
          type: 'radio',
          defaultValue: 'manual',
          options: [
            { label: 'Manual', value: 'manual' },
            { label: 'Collection', value: 'collection' },
          ],
          admin: { width: '34%', layout: 'horizontal' },
        },
        {
          name: 'sourceCollection',
          type: 'select',
          label: 'Collection',
          required: true,
          options: [
            { label: 'News', value: 'news' },
            { label: 'Units', value: 'units' },
            { label: 'Pengurus', value: 'pengurus' },
            { label: 'Testimonials', value: 'testimonials' },
            { label: 'Journals', value: 'journals' },
            { label: 'Albums', value: 'albums' },
            { label: 'Subpages of this page', value: 'subpages' },
          ],
          admin: { width: '33%', condition: (_, s) => s?.source === 'collection' },
        },
        {
          name: 'limit',
          type: 'number',
          min: 1,
          admin: {
            width: '33%',
            description: 'Leave empty to show all.',
            condition: (_, s) => s?.source === 'collection',
          },
        },
      ],
    },
    {
      name: 'cards',
      type: 'array',
      minRows: 1,
      required: true,
      admin: { initCollapsed: true, condition: (_, s) => s?.source !== 'collection' },
      fields: [
        {
          type: 'row',
          fields: [icon({ admin: { width: '30%' } }), { name: 'title', type: 'text', required: true, admin: { width: '70%' } }],
        },
        {
          name: 'image',
          type: 'upload',
          relationTo: 'media',
          admin: { condition: (_, __, { blockData }) => blockData?.style === 'photo' },
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
  interfaceName: 'CTABlock',
  labels: { singular: 'CTA Band', plural: 'CTA Bands' },
  fields: [
    section({ alignOnly: true }),
    {
      name: 'size',
      type: 'radio',
      defaultValue: 'big',
      required: true,
      options: [
        { label: 'Big', value: 'big' },
        { label: 'Narrow', value: 'narrow' },
      ],
      admin: { layout: 'horizontal', description: 'Narrow is a compact panel with one button.' },
    },
    {
      name: 'backgroundImage',
      type: 'upload',
      relationTo: 'media',
      admin: {
        description: 'Optional photo behind the text, with a dark overlay. Big size only; not shown next to a page sidebar.',
        condition: (_, s) => s?.size !== 'narrow',
      },
    },
    icon(),
    { name: 'title', type: 'text', required: true },
    { name: 'text', type: 'textarea' },
    {
      ...links(),
      admin: { initCollapsed: true, description: 'Narrow shows only the first button.' },
    },
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
            { label: 'Archive (filters + pages)', value: 'archive' },
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
        {
          name: 'limit',
          type: 'number',
          defaultValue: 3,
          min: 1,
          max: 12,
          admin: { width: '30%', description: 'In Archive mode: articles per page.' },
        },
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

export const DownloadsBlock: Block = {
  slug: 'downloads',
  labels: { singular: 'Downloads', plural: 'Downloads' },
  fields: [
    section(),
    {
      type: 'row',
      fields: [
        {
          name: 'categories',
          type: 'relationship',
          relationTo: 'file-categories',
          hasMany: true,
          required: true,
          admin: { width: '70%', description: 'Only files in these categories are listed. Two or more show filter chips.' },
        },
        { name: 'limit', type: 'number', label: 'Files per page', defaultValue: 10, min: 1, max: 50, admin: { width: '30%' } },
      ],
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

const blockHeading = [
  { name: 'heading', type: 'text' },
  { name: 'intro', type: 'textarea' },
] as const

/** Nestable blocks: standalone on a page (with section settings) or inside a Content Group row. */
export const QuoteBlock: Block = {
  slug: 'quote',
  interfaceName: 'QuoteBlock',
  labels: { singular: 'Quote', plural: 'Quotes' },
  fields: [
    section({ nestable: true }),
    {
      name: 'text',
      type: 'textarea',
      required: true,
      admin: { description: 'Quotation marks at the start or end are removed on the page.' },
    },
    { name: 'description', type: 'textarea', admin: { description: 'Optional line shown below the quote.' } },
    {
      name: 'align',
      type: 'radio',
      defaultValue: 'center',
      required: true,
      options: [
        { label: 'Center', value: 'center' },
        { label: 'Left', value: 'left' },
      ],
      admin: { layout: 'horizontal' },
    },
  ],
}

export const ListBlock: Block = {
  slug: 'list',
  interfaceName: 'ListBlock',
  labels: { singular: 'List', plural: 'Lists' },
  fields: [
    section({ nestable: true }),
    ...blockHeading,
    {
      type: 'row',
      fields: [
        {
          name: 'style',
          type: 'select',
          defaultValue: 'numbered',
          required: true,
          options: [
            { label: 'Numbered', value: 'numbered' },
            { label: 'Bulleted', value: 'bulleted' },
          ],
          admin: { width: '50%' },
        },
        { ...columns(['1', '2', '3'], '1'), admin: { width: '50%' } },
      ],
    },
    {
      name: 'items',
      type: 'array',
      minRows: 1,
      required: true,
      admin: { initCollapsed: true },
      fields: [{ name: 'text', type: 'textarea', required: true }],
    },
  ],
}

export const GridListBlock: Block = {
  slug: 'gridList',
  interfaceName: 'GridListBlock',
  labels: { singular: 'Grid List', plural: 'Grid Lists' },
  fields: [
    section({ nestable: true }),
    ...blockHeading,
    columns(['1', '2', '3', '4'], '3'),
    {
      name: 'items',
      type: 'array',
      minRows: 1,
      required: true,
      admin: { initCollapsed: true },
      fields: [
        { name: 'title', type: 'text', required: true },
        { name: 'description', type: 'textarea', required: true },
      ],
    },
  ],
}

export const StatsBlock: Block = {
  slug: 'stats',
  interfaceName: 'StatsBlock',
  labels: { singular: 'Stats', plural: 'Stats' },
  fields: [
    section({ nestable: true }),
    ...blockHeading,
    {
      name: 'items',
      type: 'array',
      minRows: 2,
      maxRows: 6,
      required: true,
      admin: {
        initCollapsed: true,
        description: 'Columns follow the number of items (up to 4 per row).',
      },
      fields: [
        {
          type: 'row',
          fields: [
            icon({ admin: { width: '25%' } }),
            {
              name: 'value',
              type: 'text',
              required: true,
              admin: { width: '25%', description: 'Typed as shown, e.g. 2.861 or 1932.' },
            },
            { name: 'suffix', type: 'text', admin: { width: '15%', description: 'e.g. + or %' } },
            { name: 'label', type: 'text', required: true, admin: { width: '35%' } },
          ],
        },
        { name: 'description', type: 'textarea' },
      ],
    },
  ],
}

export const TestimonialsBlock: Block = {
  slug: 'testimonials',
  labels: { singular: 'Testimonials', plural: 'Testimonials' },
  fields: [
    section(),
    {
      name: 'mode',
      type: 'radio',
      defaultValue: 'all',
      options: [
        { label: 'All testimonials', value: 'all' },
        { label: 'Choose testimonials', value: 'selected' },
      ],
      admin: { layout: 'horizontal' },
    },
    {
      name: 'items',
      type: 'relationship',
      relationTo: 'testimonials',
      hasMany: true,
      required: true,
      admin: { condition: (_, s) => s?.mode === 'selected' },
    },
  ],
}

/** Everything except Content Group itself, so groups can't nest inside groups. */
const contentBlocks: Block[] = [
  RichTextBlock,
  TabsBlock,
  QuoteBlock,
  ListBlock,
  GridListBlock,
  StatsBlock,
  MediaTextBlock,
  CardGridBlock,
  CTABlock,
  UnitListBlock,
  NewsListBlock,
  DownloadsBlock,
  PengurusListBlock,
  TestimonialsBlock,
  ContactBlock,
]

export const ContentGroupBlock: Block = {
  slug: 'contentGroup',
  labels: { singular: 'Content Group', plural: 'Content Groups' },
  fields: [
    section(),
    {
      name: 'rows',
      type: 'array',
      minRows: 1,
      required: true,
      admin: { description: 'Each row has an optional label (left column on desktop) and one or more blocks.' },
      fields: [
        { name: 'label', type: 'text' },
        { name: 'blocks', type: 'blocks', minRows: 1, required: true, blocks: contentBlocks },
      ],
    },
  ],
}

export const pageBlocks: Block[] = [ContentGroupBlock, ...contentBlocks]
