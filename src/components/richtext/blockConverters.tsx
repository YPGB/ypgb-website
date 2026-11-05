import type { ReactNode } from 'react'

import { QuoteContent } from '@/blocks/ContentBlocks'
import { CMSLink, type LinkData } from '@/components/CMSLink'
import { cn } from '@/lib/utils'
import type { Media, QuoteBlock } from '@/payload-types'

import { ImageCarousel } from './ImageCarousel'

/** Opts out of the surrounding `prose` styling, which would otherwise restyle these blocks. */
function Embed({ children, className }: { children: ReactNode; className?: string }) {
  return <div className={cn('not-prose my-9 first:mt-0 last:mb-0', className)}>{children}</div>
}

type Converter<F> = (args: { node: { fields: F } }) => ReactNode

const bigQuote: Converter<Pick<QuoteBlock, 'text' | 'description' | 'align'>> = ({ node }) => (
  <Embed>
    <QuoteContent block={node.fields} />
  </Embed>
)

const imageCarousel: Converter<{ images?: (number | Media)[] | null; caption?: string | null }> = ({ node }) => {
  const images = (node.fields.images ?? []).filter((m): m is Media => typeof m === 'object' && !!m?.url)
  if (!images.length) return null
  return (
    <Embed>
      <ImageCarousel images={images} caption={node.fields.caption} />
    </Embed>
  )
}

const button: Converter<{ link?: LinkData | null; align?: 'left' | 'center' | null }> = ({ node }) => (
  <Embed className={cn('flex', node.fields.align === 'center' && 'justify-center')}>
    <CMSLink link={node.fields.link} />
  </Embed>
)

const inlineCta: Converter<{ title: string; link?: LinkData | null }> = ({ node }) => (
  <Embed>
    <div className="flex flex-col gap-4.5 rounded-xl border border-border bg-card p-6.5 text-card-foreground shadow-sm sm:flex-row sm:items-center sm:justify-between">
      <p className="min-w-0 font-heading text-h3 font-semibold">{node.fields.title}</p>
      <CMSLink link={node.fields.link} className="w-full shrink-0 sm:w-auto" />
    </div>
  </Embed>
)

export const blockConverters = { bigQuote, imageCarousel, button, inlineCta }
