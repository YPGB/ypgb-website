import { Clock, Mail, MapPin, MessageCircle, Phone } from 'lucide-react'
import type { ReactNode } from 'react'

import { NewsCard } from '@/components/cards/NewsCard'
import { PengurusCard } from '@/components/cards/PengurusCard'
import { UnitCard } from '@/components/cards/UnitCard'
import { CMSLink } from '@/components/CMSLink'
import { Icon } from '@/components/Icon'
import { Media } from '@/components/Media'
import { RichText } from '@/components/RichText'
import { isDarkBackground, Section } from '@/components/Section'
import { Card } from '@/components/ui/card'
import { getNewsList, getPengurus, getUnits } from '@/lib/queries'
import { getSiteSettings } from '@/lib/site-settings'
import { cn } from '@/lib/utils'
import type { Page } from '@/payload-types'

import { TabsClient } from './TabsClient'

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
        className={block.layout === 'twoColumns' ? 'gap-9 md:columns-2' : 'max-w-prose'}
      />
    </Section>
  )
}

function TabsSection({ block }: { block: B<'tabs'> }) {
  const items = (block.tabs ?? []).map((t, i) => ({
    id: t.id ?? String(i),
    label: t.label,
    content: <RichText data={t.content} className="text-base" />,
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
      <div className="grid items-center gap-9 md:grid-cols-2 lg:gap-13">
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
  '2': 'sm:grid-cols-2',
  '3': 'sm:grid-cols-2 lg:grid-cols-3',
  '4': 'sm:grid-cols-2 lg:grid-cols-4',
}

function CardGridSection({ block }: { block: B<'cardGrid'> }) {
  return (
    <Section section={block.section}>
      <div className={cn('grid gap-6', gridCols[block.columns ?? '3'])}>
        {(block.cards ?? []).map((c, i) => (
          <Card key={c.id ?? i} className="gap-3 px-6.5 py-6.5">
            {c.icon && (
              <span className="flex size-11 items-center justify-center rounded-full bg-wheat-100 text-umber-900">
                <Icon name={c.icon} className="size-5" />
              </span>
            )}
            <h3 className="text-h3 leading-snug">{c.title}</h3>
            {c.text && <p className="whitespace-pre-line text-muted-foreground">{c.text}</p>}
            {c.hasLink && c.link && (
              <CMSLink link={{ ...c.link, appearance: 'link' }} size="default" arrow className="mt-auto w-fit font-semibold" />
            )}
          </Card>
        ))}
      </div>
    </Section>
  )
}

function CTASection({ block }: { block: B<'cta'> }) {
  return (
    <Section section={{ ...block.section, heading: null }}>
      <div className="mx-auto flex max-w-prose flex-col items-center gap-4.5 text-center">
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
  const width = block.columns === '3' ? 'lg:w-[calc((100%-3rem)/3)]' : 'lg:w-[calc((100%-4.5rem)/4)]'
  return (
    <Section section={block.section}>
      <div className="flex flex-wrap justify-center gap-6">
        {units.map((u) => (
          <div key={u.id} className={cn('w-full sm:w-[calc((100%-1.5rem)/2)]', width)}>
            <UnitCard unit={u} />
          </div>
        ))}
      </div>
    </Section>
  )
}

async function NewsListSection({ block }: { block: B<'newsList'> }) {
  const { docs } = await getNewsList(
    block.mode === 'selected'
      ? { ids: ids(block.items), limit: 12 }
      : { limit: block.limit ?? 3, categoryIds: ids(block.categories) },
  )
  const list = block.layout === 'list'
  return (
    <Section section={block.section}>
      <div className={cn('grid gap-6', list ? 'mx-auto max-w-4xl' : 'md:grid-cols-2 lg:grid-cols-3')}>
        {docs.map((n) => (
          <NewsCard key={n.id} item={n} layout={list ? 'list' : 'grid'} />
        ))}
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
  const grid = 'grid grid-cols-1 gap-6 min-[420px]:grid-cols-2 md:grid-cols-3 lg:grid-cols-4'
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

async function ContactSection({ block, formSlot }: { block: B<'contact'>; formSlot?: ReactNode }) {
  const s = await getSiteSettings()
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
      <div className={cn('grid gap-9', details && formSlot && 'lg:grid-cols-[minmax(0,1fr)_minmax(0,1.3fr)]')}>
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
        {formSlot}
      </div>
    </Section>
  )
}

export function RenderBlocks({ blocks }: { blocks?: Page['layout'] }) {
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
          case 'mediaText':
            return <MediaTextSection key={key} block={block} />
          case 'cardGrid':
            return <CardGridSection key={key} block={block} />
          case 'cta':
            return <CTASection key={key} block={block} />
          case 'unitList':
            return <UnitListSection key={key} block={block} />
          case 'newsList':
            return <NewsListSection key={key} block={block} />
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
