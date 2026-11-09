import { Quote } from 'lucide-react'
import type { ReactNode } from 'react'

import { Icon } from '@/components/Icon'
import { Section } from '@/components/Section'
import { cn } from '@/lib/utils'
import type { GridListBlock, ListBlock, Page, QuoteBlock, StatsBlock } from '@/payload-types'

type ContentGroup = Extract<NonNullable<Page['layout']>[number], { blockType: 'contentGroup' }>
type HeadingLevel = 'h3' | 'h4'

const muted = 'text-muted-foreground in-data-[tone=dark]:text-white/75'
const quoteRule = 'h-px flex-1 bg-border in-data-[tone=dark]:bg-white/15'

// Static class strings so Tailwind can see them.
const listColumns = { '1': '', '2': '@4xl:columns-2', '3': '@xl:columns-2 @4xl:columns-3' } as const
const gridColumns = {
  '1': '',
  '2': '@xl:grid-cols-2',
  '3': '@xl:grid-cols-2 @4xl:grid-cols-3',
  '4': '@xl:grid-cols-2 @4xl:grid-cols-4',
} as const

function BlockHeading({
  heading,
  intro,
  as: Tag,
  className = 'mb-4.5',
}: {
  heading?: string | null
  intro?: string | null
  as: HeadingLevel
  className?: string
}) {
  if (!heading && !intro) return null
  return (
    <div className={className}>
      {heading && <Tag className={Tag === 'h3' ? 'text-h3' : 'text-h4'}>{heading}</Tag>}
      {intro && <p className={cn('max-w-prose text-base', heading && 'mt-2', muted)}>{intro}</p>}
    </div>
  )
}

export function QuoteContent({ block }: { block: Pick<QuoteBlock, 'text' | 'description' | 'align'> }) {
  const text = block.text.trim().replace(/^["“]+|["”]+$/g, '')
  const center = block.align !== 'left'
  return (
    <figure className={cn('max-w-3xl', center && 'mx-auto text-center')}>
      <div aria-hidden className="flex items-center gap-4.5">
        {center && <span className={quoteRule} />}
        <Quote className="size-9 shrink-0 rotate-180 fill-current stroke-none text-seal-600 in-data-[tone=dark]:text-wheat-500" />
        <span className={quoteRule} />
      </div>
      <blockquote className="mt-4.5 font-editorial text-h3 font-semibold italic text-balance md:text-h2 md:leading-snug">
        {text}
      </blockquote>
      {block.description && <figcaption className={cn('mt-4.5 text-sm', muted)}>{block.description}</figcaption>}
    </figure>
  )
}

export function ListContent({ block, headingAs = 'h4' }: { block: ListBlock; headingAs?: HeadingLevel }) {
  const numbered = block.style === 'numbered'
  const Tag = numbered ? 'ol' : 'ul'
  return (
    <div>
      <BlockHeading heading={block.heading} intro={block.intro} as={headingAs} />
      <Tag
        className={cn(
          'gap-13 pl-5 text-base marker:text-muted-foreground',
          numbered ? 'list-decimal marker:font-heading marker:font-semibold' : 'list-disc',
          listColumns[block.columns],
        )}
      >
        {block.items.map((item, i) => (
          <li key={item.id ?? i} className="mb-4.5 break-inside-avoid pl-1.5 last:mb-0">
            {item.text}
          </li>
        ))}
      </Tag>
    </div>
  )
}

export function GridListContent({ block, headingAs = 'h4' }: { block: GridListBlock; headingAs?: HeadingLevel }) {
  return (
    <div>
      <BlockHeading heading={block.heading} intro={block.intro} as={headingAs} className="mb-6.5" />
      <ul className={cn('grid gap-x-9 gap-y-6.5', gridColumns[block.columns])}>
        {block.items.map((item, i) => (
          <li key={item.id ?? i} className="border-t border-border pt-4.5 in-data-[tone=dark]:border-white/15">
            <p className="font-heading text-h4 font-semibold">{item.title}</p>
            <p className="mt-2 text-base">{item.description}</p>
          </li>
        ))}
      </ul>
    </div>
  )
}

// Columns follow the item count, so 3 or 6 items never leave a lone item on the last row.
const statColumns: Record<number, string> = {
  2: '@xl:grid-cols-2',
  3: '@xl:grid-cols-3',
  4: '@xl:grid-cols-2 @4xl:grid-cols-4',
  5: '@xl:grid-cols-2 @4xl:grid-cols-3',
  6: '@xl:grid-cols-2 @4xl:grid-cols-3',
}

export function StatsContent({ block, headingAs = 'h4' }: { block: StatsBlock; headingAs?: HeadingLevel }) {
  return (
    <div>
      <BlockHeading heading={block.heading} intro={block.intro} as={headingAs} className="mb-6.5" />
      <ul className={cn('grid gap-x-9 gap-y-9', statColumns[block.items.length])}>
        {block.items.map((item, i) => (
          <li key={item.id ?? i} className="flex flex-col items-center text-center">
            <Icon
              name={item.icon ?? undefined}
              strokeWidth={1.5}
              className="mb-4.5 size-12 text-seal-600 in-data-[tone=dark]:text-wheat-500"
            />
            <p className="font-heading text-display-2 font-semibold tabular-nums">
              {item.value}
              {item.suffix && <span className="ml-0.5 text-h2">{item.suffix}</span>}
            </p>
            <p className="mt-2 font-heading text-h4 font-semibold">{item.label}</p>
            {item.description && <p className="mt-2 max-w-xs text-base">{item.description}</p>}
          </li>
        ))}
      </ul>
    </div>
  )
}

type Nested = QuoteBlock | ListBlock | GridListBlock | StatsBlock

function NestedContent({ block, headingAs }: { block: Nested; headingAs?: HeadingLevel }) {
  switch (block.blockType) {
    case 'quote':
      return <QuoteContent block={block} />
    case 'list':
      return <ListContent block={block} headingAs={headingAs} />
    case 'gridList':
      return <GridListContent block={block} headingAs={headingAs} />
    case 'stats':
      return <StatsContent block={block} headingAs={headingAs} />
    default:
      return null
  }
}

/** A Quote / List / Grid List, wrapped in its own section. */
export function NestedSection({ block, headingAs = 'h3' }: { block: Nested; headingAs?: HeadingLevel }) {
  return (
    <Section section={block.section}>
      <NestedContent block={block} headingAs={headingAs} />
    </Section>
  )
}

function GroupRow({ label, children }: { label?: string | null; children: ReactNode }) {
  return (
    <div
      className={cn(
        'grid gap-4.5 border-t border-border py-9 first:border-t-0 first:pt-0 last:pb-0 md:gap-9 md:py-13 in-data-[tone=dark]:border-white/15',
        label && '@2xl:grid-cols-[9rem_minmax(0,1fr)]',
      )}
    >
      {label && <h3 className="text-h3">{label}</h3>}
      <div data-contained className="flex min-w-0 flex-col gap-13">
        {children}
      </div>
    </div>
  )
}

type Row = ContentGroup['rows'][number]

/** `renderBlocks` comes from RenderBlocks, which also renders this component. */
export function ContentGroupSection({
  block,
  renderBlocks,
}: {
  block: ContentGroup
  renderBlocks: (blocks: Row['blocks'], labelled: boolean) => ReactNode
}) {
  return (
    <Section section={block.section}>
      {block.rows.map((row, i) => (
        <GroupRow key={row.id ?? i} label={row.label}>
          {renderBlocks(row.blocks, Boolean(row.label))}
        </GroupRow>
      ))}
    </Section>
  )
}
