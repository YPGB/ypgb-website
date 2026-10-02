import { ChevronDown } from 'lucide-react'
import NextLink from 'next/link'

import { CMSLink } from '@/components/CMSLink'
import { Media } from '@/components/Media'
import { Container, Overline } from '@/components/Section'
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb'
import { cn } from '@/lib/utils'
import type { Media as MediaDoc, Page } from '@/payload-types'

import { HeroCarousel } from './HeroCarousel'

type Hero = Page['hero']

const tones = {
  brand: 'bg-brand text-brand-foreground',
  brandDeep: 'bg-brand-deep text-brand-foreground',
  warm: 'bg-muted text-foreground',
} as const

const toneProps = (bg?: string | null) => ({
  'data-tone': bg === 'warm' ? undefined : 'dark',
  className: tones[(bg as keyof typeof tones) ?? 'brand'] ?? tones.brand,
})

function Buttons({ hero, center }: { hero: Hero; center?: boolean }) {
  if (!hero?.links?.length) return null
  return (
    <div className={cn('mt-9 flex flex-col gap-3 sm:flex-row', center && 'sm:justify-center')}>
      {hero.links.map((l, i) => (
        <CMSLink key={l.id ?? i} link={l.link} size="xl" className="w-full sm:w-auto" arrow={i === 0} />
      ))}
    </div>
  )
}

function Lead({ text, className }: { text?: string | null; className?: string }) {
  if (!text) return null
  return (
    <p className={cn('mt-4.5 max-w-[60ch] text-lead text-pretty opacity-85', className)}>{text}</p>
  )
}

function Split({ hero }: { hero: Hero }) {
  const images = (hero.media ?? []).filter((m): m is MediaDoc => typeof m === 'object' && !!m?.url)
  const { className, ...rest } = toneProps(hero.background)
  return (
    <section {...rest} className={cn(className, 'overflow-hidden')}>
      <Container
        className={cn(
          'grid items-center gap-13 py-18 md:py-26',
          images.length && 'md:grid-cols-[minmax(0,1.1fr)_minmax(0,.9fr)]',
          hero.mediaPosition === 'left' && images.length && 'md:grid-cols-[minmax(0,.9fr)_minmax(0,1.1fr)]',
        )}
      >
        <div className={cn('min-w-0', hero.mediaPosition === 'left' && 'md:order-2')}>
          {hero.overline && <Overline>{hero.overline}</Overline>}
          <h1 className="mt-3 font-display text-h1 font-bold uppercase md:text-display-2">{hero.title}</h1>
          <Lead text={hero.lead} />
          <Buttons hero={hero} />
        </div>
        {images.length > 1 && <HeroCarousel images={images} />}
        {images.length === 1 && (
          <div className="relative aspect-[4/3] overflow-hidden rounded-2xl bg-white/10">
            <Media media={images[0]} sizes="(min-width: 1120px) 520px, (min-width: 768px) 45vw, 100vw" priority />
          </div>
        )}
      </Container>
    </section>
  )
}

function Centered({ hero, full }: { hero: Hero; full: boolean }) {
  const bgImage = typeof hero.backgroundImage === 'object' ? hero.backgroundImage : null
  const { className, ...rest } = bgImage ? { 'data-tone': 'dark', className: tones.brandDeep } : toneProps(hero.background)
  return (
    <section
      {...rest}
      className={cn(
        className,
        'relative isolate flex items-center overflow-hidden',
        full ? 'min-h-[calc(100svh-4.5rem)]' : 'py-26 md:py-36',
      )}
    >
      {bgImage && (
        <>
          <Media media={bgImage} priority className="-z-20" />
          <div className="absolute inset-0 -z-10 bg-umber-950/70" />
        </>
      )}
      <Container className={cn('flex flex-col items-center text-center', full && 'py-26')}>
        {hero.overline && <Overline className="justify-center">{hero.overline}</Overline>}
        <h1 className="mt-3 max-w-4xl font-display text-h1 font-bold uppercase md:text-display-2 lg:text-display-1">
          {hero.title}
        </h1>
        <Lead text={hero.lead} className="mx-auto" />
        <Buttons hero={hero} center />
      </Container>
      {full && (
        <ChevronDown aria-hidden className="absolute bottom-6 left-1/2 size-6 -translate-x-1/2 opacity-60" />
      )}
    </section>
  )
}

function Compact({ hero }: { hero: Hero }) {
  const { className, ...rest } = toneProps(hero.background)
  return (
    <section {...rest} className={cn(className, 'py-13 md:py-18')}>
      <Container>
        {hero.showBreadcrumb && (
          <Breadcrumb className="mb-4.5">
            <BreadcrumbList className="text-inherit opacity-75">
              <BreadcrumbItem>
                <BreadcrumbLink render={<NextLink href="/" />} className="hover:text-wheat-300">
                  Beranda
                </BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbPage className="text-inherit">{hero.title}</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        )}
        {hero.overline && <Overline className="mb-3">{hero.overline}</Overline>}
        <h1 className="text-[28px] leading-tight md:text-h1">{hero.title}</h1>
        <Lead text={hero.lead} />
      </Container>
    </section>
  )
}

function Minimal({ hero }: { hero: Hero }) {
  return (
    <section className="pt-18 pb-6.5 md:pt-26">
      <Container>
        {hero.overline && <Overline className="mb-3">{hero.overline}</Overline>}
        <h1 className="text-h1 md:text-display-2">{hero.title}</h1>
        <Lead text={hero.lead} className="text-muted-foreground opacity-100" />
      </Container>
    </section>
  )
}

export function RenderHero({ hero }: { hero?: Hero | null }) {
  switch (hero?.type) {
    case 'split':
      return <Split hero={hero} />
    case 'centeredFull':
      return <Centered hero={hero} full />
    case 'centered':
      return <Centered hero={hero} full={false} />
    case 'compact':
      return <Compact hero={hero} />
    case 'minimal':
      return <Minimal hero={hero} />
    default:
      return null
  }
}
