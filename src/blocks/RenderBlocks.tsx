import { Clock, Mail, MapPin, MessageCircle, Phone } from 'lucide-react'
import NextLink from 'next/link'

import { NewsCard } from '@/components/cards/NewsCard'
import { PengurusCard } from '@/components/cards/PengurusCard'
import { UnitCard } from '@/components/cards/UnitCard'
import { CMSLink, resolveHref } from '@/components/CMSLink'
import { CmsForm } from '@/components/forms/CmsForm'
import { Icon } from '@/components/Icon'
import { Media } from '@/components/Media'
import { RichText } from '@/components/RichText'
import { isDarkBackground, Section } from '@/components/Section'
import { Card } from '@/components/ui/card'
import { getNewsList, getPengurus, getTestimonials, getUnits } from '@/lib/queries'
import { getSiteSettings } from '@/lib/site-settings'
import { cn } from '@/lib/utils'
import type { Page } from '@/payload-types'

import { ArchiveFilters } from './ArchiveFilters'
import { ArchivePager, EmptyResult, readArchive, ResultCount } from './ArchiveNav'
import { type CardData, getCardArchive, getCards, isCardArchive } from './cardData'
import { containBlocks } from './contain'
import { ContentGroupSection, NestedSection } from './ContentBlocks'
import { DownloadsList } from './DownloadsList'
import { type ArchiveParams, NewsArchive } from './NewsArchive'
import { TabsClient } from './TabsClient'
import { TestimonialCarousel } from './TestimonialCarousel'

type Block = NonNullable<Page['layout']>[number]
type B<T extends Block['blockType']> = Extract<Block, { blockType: T }>

const ids = (xs?: (number | { id: number })[] | null) =>
  (xs ?? []).map((x) => (typeof x === 'object' ? x.id : x))

function Buttons({ links }: { links?: B<'cta'>['links'] }) {
  if (!links?.length) return null
  return (
    <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap">
      {links.map((l, i) => (
        <CMSLink key={l.id ?? i} link={l.link} size="xl" className="w-full sm:w-auto" />
      ))}
    </div>
  )
}

function RichTextSection({ block }: { block: B<'richText'> }) {
  return (
    <Section section={block.section}>
      <RichText
        data={block.content}
        invert={isDarkBackground(block.section?.background)}
        className={block.layout === 'twoColumns' ? 'gap-9 @2xl:columns-2' : undefined}
      />
    </Section>
  )
}

function TabsSection({ block }: { block: B<'tabs'> }) {
  const items = (block.tabs ?? []).map((t, i) => ({
    id: t.id ?? String(i),
    label: t.label,
    content: <RichText data={t.content} />,
  }))
  return (
    <Section section={block.section}>
      <TabsClient items={items} />
    </Section>
  )
}

function MediaTextSection({ block }: { block: B<'mediaText'> }) {
  const left = block.mediaPosition !== 'right'
  return (
    <Section section={block.section}>
      <div className="grid items-center gap-9 @2xl:grid-cols-2 @4xl:gap-13">
        <div className={cn('relative aspect-[4/3] overflow-hidden rounded-2xl bg-muted', !left && 'md:order-2')}>
          <Media media={block.media} sizes="(min-width: 1120px) 540px, (min-width: 768px) 50vw, 100vw" />
        </div>
        <div className="flex min-w-0 flex-col gap-6.5">
          <RichText data={block.content} invert={isDarkBackground(block.section?.background)} />
          <Buttons links={block.links} />
        </div>
      </div>
    </Section>
  )
}

const gridCols: Record<string, string> = {
  '2': '@xl:grid-cols-2',
  '3': '@xl:grid-cols-2 @4xl:grid-cols-3',
  '4': '@xl:grid-cols-2 @4xl:grid-cols-4',
}

async function CardGridSection({ block, ctx }: { block: B<'cardGrid'>; ctx: BlockContext }) {
  if (isCardArchive(block)) return <CardGridArchive block={block} ctx={ctx} />
  const cards = await getCards(block, ctx.pageId)
  if (!cards.length) return null
  return (
    <Section section={block.section}>
      <div className={cn('grid gap-6', gridCols[block.columns ?? '3'])}>
        {cards.map((c) => (block.style === 'photo' ? <PhotoCard key={c.id} card={c} /> : <StandardCard key={c.id} card={c} />))}
      </div>
    </Section>
  )
}

/** Journals or albums with search, year, unit (albums) and page numbers. */
async function CardGridArchive({ block, ctx }: { block: B<'cardGrid'>; ctx: BlockContext }) {
  const { state, page } = await readArchive(ctx.searchParams)
  const archive = await getCardArchive(block, state, page)
  return (
    <Section section={block.section}>
      <div className="flex flex-col gap-6.5">
        <ArchiveFilters
          basePath={ctx.path}
          state={state}
          years={archive.years}
          units={archive.units}
          placeholder={archive.placeholder}
        />
        <ResultCount total={archive.totalDocs} noun={archive.noun} state={state} />
        {archive.cards.length ? (
          <div className={cn('grid gap-6', gridCols[block.columns ?? '3'])}>
            {archive.cards.map((c) =>
              block.style === 'photo' ? <PhotoCard key={c.id} card={c} /> : <StandardCard key={c.id} card={c} />,
            )}
          </div>
        ) : (
          <EmptyResult state={state} noun={archive.noun} />
        )}
        <ArchivePager basePath={ctx.path} state={state} page={page} totalPages={archive.totalPages} />
      </div>
    </Section>
  )
}

function StandardCard({ card }: { card: CardData }) {
  return (
    <Card className="gap-3 px-6.5 py-6.5">
      {card.icon && (
        <span className="flex size-11 items-center justify-center rounded-full bg-wheat-100 text-umber-900">
          <Icon name={card.icon} className="size-5" />
        </span>
      )}
      <h3 className="text-h3 leading-snug">{card.title}</h3>
      {card.text && <p className="whitespace-pre-line text-muted-foreground">{card.text}</p>}
      {card.link && (
        <CMSLink link={{ ...card.link, appearance: 'link' }} size="default" arrow className="mt-auto w-fit font-semibold" />
      )}
    </Card>
  )
}

const photoCard = 'group relative block aspect-[4/5] rounded-xl shadow-sm transition-shadow hover:shadow-md'

/**
 * The whole card is the link. The description opens on hover or keyboard focus, and stays open where there is no hover.
 * Photo and overlay are clipped once as a group (`clip-path`): clipping each to the rounded corners on its own lets
 * the photo and the background show along the bottom corners.
 */
function PhotoCard({ card }: { card: CardData }) {
  const href = resolveHref(card.link)
  const content = (
    <div className="absolute inset-0 bg-muted [clip-path:inset(0_round_var(--radius-xl))]">
      <Media media={card.image} sizes="(min-width: 1024px) 25vw, (min-width: 576px) 50vw, 100vw" />
      <div className="absolute inset-x-0 bottom-0 bg-black/75 px-4.5 py-3.5 text-brand-foreground">
        <h3 className={cn('text-h4', href && 'transition-colors group-hover:text-wheat-300')}>{card.title}</h3>
        {card.text && (
          <div className="grid grid-rows-[0fr] transition-[grid-template-rows] duration-200 group-hover:grid-rows-[1fr] group-focus-visible:grid-rows-[1fr] motion-reduce:transition-none [@media(hover:none)]:grid-rows-[1fr]">
            <div className="min-h-0 overflow-hidden">
              <p className="line-clamp-5 pt-1 text-white/75">{card.text}</p>
            </div>
          </div>
        )}
      </div>
    </div>
  )
  if (!href) return <div className={photoCard}>{content}</div>
  return (
    <NextLink
      href={href}
      target={card.link?.newTab ? '_blank' : undefined}
      rel={card.link?.newTab ? 'noopener noreferrer' : undefined}
      className={photoCard}
    >
      {content}
    </NextLink>
  )
}

function CTASection({ block }: { block: B<'cta'> }) {
  const center = block.section?.heading?.align !== 'left'
  const section = { ...block.section, heading: null }

  if (block.size === 'narrow') {
    const first = block.links?.[0]
    return (
      <Section section={section} className="py-13 md:py-18">
        <div
          className={cn(
            'flex flex-col gap-6 rounded-xl border border-border bg-card p-6.5 shadow-sm md:p-9',
            'in-data-[tone=dark]:border-white/15 in-data-[tone=dark]:bg-white/8 in-data-[tone=dark]:shadow-none',
            center ? 'items-center text-center' : '@2xl:flex-row @2xl:items-center @2xl:justify-between',
          )}
        >
          <div className={cn('flex min-w-0 gap-4.5', center ? 'flex-col items-center' : 'items-start')}>
            {block.icon && (
              <Icon name={block.icon} className="size-7 shrink-0 text-seal-700 in-data-[tone=dark]:text-wheat-500" />
            )}
            <div>
              <h2 className="text-h3 md:text-h2">{block.title}</h2>
              {block.text && (
                <p className="mt-2 max-w-prose text-base text-muted-foreground in-data-[tone=dark]:text-white/75">
                  {block.text}
                </p>
              )}
            </div>
          </div>
          {first && <CMSLink link={first.link} size="xl" className="w-full shrink-0 sm:w-auto" />}
        </div>
      </Section>
    )
  }

  const photo = typeof block.backgroundImage === 'object' ? block.backgroundImage : null
  return (
    <Section
      section={photo ? { ...section, background: 'brandDeep' } : section}
      backdrop={
        photo && (
          <>
            <Media media={photo} className="-z-20" />
            <div className="absolute inset-0 -z-10 bg-black/55" />
          </>
        )
      }
    >
      <div className={cn('flex max-w-prose flex-col gap-4.5', center ? 'mx-auto items-center text-center' : 'items-start')}>
        {block.icon && <Icon name={block.icon} className="size-8 text-wheat-500" />}
        <h2 className="text-[28px] leading-tight md:text-h1">{block.title}</h2>
        {block.text && <p className="text-lead opacity-80">{block.text}</p>}
        <div className="mt-2 w-full sm:w-auto">
          <Buttons links={block.links} />
        </div>
      </div>
    </Section>
  )
}

async function UnitListSection({ block }: { block: B<'unitList'> }) {
  const units = await getUnits(
    block.mode === 'selected' ? { ids: ids(block.units) } : { levels: block.level ?? undefined },
  )
  const width = block.columns === '3' ? '@4xl:w-[calc((100%-3rem)/3)]' : '@4xl:w-[calc((100%-4.5rem)/4)]'
  return (
    <Section section={block.section}>
      <div className="flex flex-wrap justify-center gap-6">
        {units.map((u) => (
          <div key={u.id} className={cn('w-full @xl:w-[calc((100%-1.5rem)/2)]', width)}>
            <UnitCard unit={u} />
          </div>
        ))}
      </div>
    </Section>
  )
}

async function NewsListSection({ block, ctx }: { block: B<'newsList'>; ctx: BlockContext }) {
  if (block.mode === 'archive') {
    return (
      <Section section={block.section}>
        <NewsArchive
          basePath={ctx.path}
          params={ctx.searchParams}
          perPage={block.limit ?? 9}
          categoryIds={ids(block.categories)}
          list={block.layout === 'list'}
        />
      </Section>
    )
  }
  const { docs } = await getNewsList(
    block.mode === 'selected'
      ? { ids: ids(block.items), limit: 12 }
      : { limit: block.limit ?? 3, categoryIds: ids(block.categories) },
  )
  const list = block.layout === 'list'
  return (
    <Section section={block.section}>
      <div className={cn('grid gap-6', list ? 'mx-auto max-w-4xl' : '@2xl:grid-cols-2 @4xl:grid-cols-3')}>
        {docs.map((n) => (
          <NewsCard key={n.id} item={n} layout={list ? 'list' : 'grid'} />
        ))}
      </div>
    </Section>
  )
}

async function TestimonialsSection({ block }: { block: B<'testimonials'> }) {
  const items = await getTestimonials(block.mode === 'selected' ? { ids: ids(block.items) } : {})
  if (!items.length) return null
  const { title, subtitle, hasAction, action } = block.section?.heading ?? {}
  const hasHead = Boolean(title || subtitle || (hasAction && action))
  return (
    <Section section={{ ...block.section, heading: null }}>
      <div className="grid gap-9 @4xl:grid-cols-[minmax(0,1fr)_minmax(0,3fr)]">
        {hasHead && (
          <div className="flex flex-col items-start gap-3">
            {title && <h2 className="text-[24px] leading-tight tracking-tight md:text-h2">{title}</h2>}
            {subtitle && <p className="text-base text-muted-foreground in-data-[tone=dark]:text-white/75">{subtitle}</p>}
            {hasAction && action && (
              <CMSLink link={{ ...action, appearance: 'secondary' }} size="default" className="mt-2" />
            )}
          </div>
        )}
        <div className={cn('min-w-0', !hasHead && '@4xl:col-span-2')}>
          <TestimonialCarousel>
            {items.map((t) => {
              const hasPhoto = typeof t.photo === 'object' && t.photo?.url
              return (
                <div key={t.id} className="@container h-full">
                  <figure
                    className={cn(
                      'grid h-full overflow-hidden rounded-xl bg-card text-card-foreground',
                      hasPhoto && '@lg:grid-cols-[minmax(0,1fr)_minmax(0,2fr)]',
                    )}
                  >
                    {hasPhoto && (
                      <div className="relative aspect-square @lg:aspect-auto">
                        <Media media={t.photo} sizes="(min-width: 1024px) 280px, 100vw" />
                      </div>
                    )}
                    <div className="flex flex-col justify-between gap-6.5 p-6.5 md:p-9">
                      <blockquote className="text-base leading-relaxed">{t.quote}</blockquote>
                      <figcaption>
                        <p className="font-heading text-base font-semibold">{t.name}</p>
                        {t.detail && <p className="text-xs text-muted-foreground">{t.detail}</p>}
                        {t.role && <p className="text-xs text-muted-foreground">{t.role}</p>}
                      </figcaption>
                    </div>
                  </figure>
                </div>
              )
            })}
          </TestimonialCarousel>
        </div>
      </div>
    </Section>
  )
}

const ORGANS = [
  { value: 'pembina', label: 'Pembina' },
  { value: 'pengurus', label: 'Pengurus' },
  { value: 'pengawas', label: 'Pengawas' },
] as const

async function PengurusListSection({ block }: { block: B<'pengurusList'> }) {
  const members = await getPengurus({ organs: block.organ ?? undefined })
  const grid = 'grid grid-cols-1 gap-6 @sm:grid-cols-2 @2xl:grid-cols-3 @4xl:grid-cols-4'
  const groups = block.groupByOrgan
    ? ORGANS.map((o) => ({ ...o, members: members.filter((m) => m.organ === o.value) })).filter((g) => g.members.length)
    : [{ value: 'all', label: '', members }]
  return (
    <Section section={block.section}>
      <div className="flex flex-col gap-13">
        {groups.map((g) => (
          <div key={g.value} className="flex flex-col gap-6">
            {g.label && <h3 className="text-h3">{g.label}</h3>}
            <div className={grid}>
              {g.members.map((m) => (
                <PengurusCard key={m.id} member={m} />
              ))}
            </div>
          </div>
        ))}
      </div>
    </Section>
  )
}

function DownloadsSection({ block, ctx }: { block: B<'downloads'>; ctx: BlockContext }) {
  return (
    <Section section={block.section}>
      <DownloadsList
        basePath={ctx.path}
        params={ctx.searchParams}
        perPage={block.limit ?? 10}
        categoryIds={ids(block.categories)}
      />
    </Section>
  )
}

async function ContactSection({ block }: { block: B<'contact'> }) {
  const s = await getSiteSettings()
  const form = typeof block.form === 'object' ? block.form : null
  const rows = [
    s.address && { icon: MapPin, label: 'Alamat', value: s.address, href: s.mapUrl || undefined },
    ...(s.phones ?? []).map((p) => ({
      icon: Phone,
      label: p.label || 'Telepon',
      value: p.number,
      href: `tel:${p.number.replace(/[^\d+]/g, '')}`,
    })),
    s.whatsapp && { icon: MessageCircle, label: 'WhatsApp', value: `+${s.whatsapp}`, href: `https://wa.me/${s.whatsapp}` },
    s.email && { icon: Mail, label: 'Email', value: s.email, href: `mailto:${s.email}` },
    ...(s.officeHours ?? []).map((h) => ({ icon: Clock, label: h.days, value: h.hours, href: undefined })),
  ].filter((r): r is { icon: typeof MapPin; label: string; value: string; href: string | undefined } => Boolean(r))

  const details = block.showDetails !== false && rows.length > 0
  return (
    <Section section={block.section}>
      <div className={cn('grid gap-9', details && form && '@4xl:grid-cols-[minmax(0,1fr)_minmax(0,1.3fr)]')}>
        {details && (
          <ul className="flex flex-col gap-4.5">
            {rows.map(({ icon: I, label, value, href }, i) => (
              <li key={i} className="flex items-start gap-3">
                <span className="flex size-10 shrink-0 items-center justify-center rounded-full bg-wheat-100 text-umber-900">
                  <I className="size-4.5" aria-hidden />
                </span>
                <div className="min-w-0">
                  <div className="text-xs font-semibold uppercase tracking-wide opacity-70">{label}</div>
                  {href ? (
                    <a
                      href={href}
                      target={href.startsWith('http') ? '_blank' : undefined}
                      rel="noopener noreferrer"
                      className="whitespace-pre-line text-base hover:text-seal-700"
                    >
                      {value}
                    </a>
                  ) : (
                    <p className="whitespace-pre-line text-base">{value}</p>
                  )}
                </div>
              </li>
            ))}
          </ul>
        )}
        {form && <CmsForm form={form} className={details ? undefined : 'mx-auto w-full max-w-(--container-prose)'} />}
      </div>
    </Section>
  )
}

/** Request context for blocks that depend on the URL (News List archive). */
export type BlockContext = {
  path: string
  searchParams?: Promise<ArchiveParams>
  /** The current page, for blocks that list its subpages. */
  pageId?: number
  /** Heading level for Quote, List and Grid List; h4 under a Content Group row label. */
  nestedHeading?: 'h3' | 'h4'
}

export function RenderBlocks({ blocks, ctx }: { blocks?: Page['layout']; ctx: BlockContext }) {
  if (!blocks?.length) return null
  return (
    <>
      {blocks.map((block) => {
        const key = block.id ?? block.blockType
        switch (block.blockType) {
          case 'richText':
            return <RichTextSection key={key} block={block} />
          case 'tabs':
            return <TabsSection key={key} block={block} />
          case 'contentGroup':
            return (
              <ContentGroupSection
                key={key}
                block={block}
                renderBlocks={(rowBlocks, labelled) => (
                  <RenderBlocks
                    blocks={containBlocks(rowBlocks as Page['layout'])}
                    ctx={{ ...ctx, nestedHeading: labelled ? 'h4' : 'h3' }}
                  />
                )}
              />
            )
          case 'quote':
          case 'list':
          case 'gridList':
          case 'stats':
            return <NestedSection key={key} block={block} headingAs={ctx.nestedHeading} />
          case 'mediaText':
            return <MediaTextSection key={key} block={block} />
          case 'cardGrid':
            return <CardGridSection key={key} block={block} ctx={ctx} />
          case 'cta':
            return <CTASection key={key} block={block} />
          case 'unitList':
            return <UnitListSection key={key} block={block} />
          case 'newsList':
            return <NewsListSection key={key} block={block} ctx={ctx} />
          case 'downloads':
            return <DownloadsSection key={key} block={block} ctx={ctx} />
          case 'testimonials':
            return <TestimonialsSection key={key} block={block} />
          case 'pengurusList':
            return <PengurusListSection key={key} block={block} />
          case 'contact':
            return <ContactSection key={key} block={block} />
          default:
            return null
        }
      })}
    </>
  )
}
