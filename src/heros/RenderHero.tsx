import { ChevronDown } from 'lucide-react'

import { CMSLink } from '@/components/CMSLink'
import { Media } from '@/components/Media'
import { Container } from '@/components/Section'
import { cn } from '@/lib/utils'
import type { Media as MediaDoc, Page } from '@/payload-types'

import { HeroCarousel } from './HeroCarousel'
import { HeroSlides } from './HeroSlides'

const PHOTO_OVERLAY = 'bg-black/55'

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

/** `titleAs="p"`: the hero is shared and the page has its own main heading. */
type TitleTag = 'h1' | 'p'

function Split({ hero, overlaid, titleAs: Title = 'h1' }: { hero: Hero; overlaid?: boolean; titleAs?: TitleTag }) {
  const images = (hero.media ?? []).filter((m): m is MediaDoc => typeof m === 'object' && !!m?.url)
  const { className, ...rest } = toneProps(hero.background)
  return (
    <section {...rest} className={cn(className, 'overflow-hidden')}>
      <Container
        className={cn(
          'grid items-center gap-13 py-18 md:py-26',
          overlaid && 'pt-36 md:pt-36',
          images.length && 'md:grid-cols-[minmax(0,1.1fr)_minmax(0,.9fr)]',
          hero.mediaPosition === 'left' && images.length && 'md:grid-cols-[minmax(0,.9fr)_minmax(0,1.1fr)]',
        )}
      >
        <div className={cn('min-w-0', hero.mediaPosition === 'left' && 'md:order-2')}>
          <Title className="font-display text-h1 font-bold uppercase md:text-display-2">{hero.title}</Title>
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

const heights = {
  small: 'py-18 md:py-26',
  medium: 'py-26 md:py-36',
  large: 'py-36 md:py-52',
} as const

function Centered({
  hero,
  full,
  overlaid,
  titleAs: Title = 'h1',
}: {
  hero: Hero
  full: boolean
  overlaid?: boolean
  titleAs?: TitleTag
}) {
  const slides =
    hero.type === 'centeredCarousel'
      ? (hero.media ?? []).filter((m): m is MediaDoc => typeof m === 'object' && !!m?.url)
      : []
  const bgImage = hero.type !== 'centeredCarousel' && typeof hero.backgroundImage === 'object' ? hero.backgroundImage : null
  const { className, ...rest } =
    bgImage || slides.length ? { 'data-tone': 'dark', className: tones.brandDeep } : toneProps(hero.background)
  return (
    <section
      {...rest}
      className={cn(
        className,
        'relative isolate flex items-center overflow-hidden',
        full ? (overlaid ? 'min-h-svh' : 'min-h-[calc(100svh-4.5rem)]') : heights[hero.size ?? 'medium'],
      )}
    >
      {slides.length > 0 && <HeroSlides images={slides} overlayClassName={PHOTO_OVERLAY} />}
      {!slides.length && bgImage && (
        <>
          <Media media={bgImage} priority className="-z-20" />
          <div className={cn('absolute inset-0 -z-10', PHOTO_OVERLAY)} />
        </>
      )}
      {/* Lets drags and clicks through to the slideshow behind; only the buttons stay interactive. */}
      <Container className={cn('flex flex-col items-center text-center', full && 'py-26', slides.length > 1 && 'pointer-events-none')}>
        <Title className="max-w-4xl font-display text-h1 font-bold uppercase md:text-display-2 lg:text-display-1">
          {hero.title}
        </Title>
        <Lead text={hero.lead} className="mx-auto" />
        <div className="pointer-events-auto">
          <Buttons hero={hero} center />
        </div>
      </Container>
      {full && slides.length < 2 && (
        <ChevronDown aria-hidden className="absolute bottom-6 left-1/2 size-6 -translate-x-1/2 opacity-60" />
      )}
    </section>
  )
}

function Compact({ hero, titleAs: Title = 'h1' }: { hero: Hero; titleAs?: TitleTag }) {
  const { className, ...rest } = toneProps(hero.background)
  return (
    <section {...rest} className={cn(className, 'py-13 md:py-18')}>
      <Container>
        <Title className="font-heading text-[28px] leading-tight font-semibold text-balance md:text-h1">{hero.title}</Title>
        <Lead text={hero.lead} />
      </Container>
    </section>
  )
}

function Minimal({ hero, titleAs: Title = 'h1' }: { hero: Hero; titleAs?: TitleTag }) {
  return (
    <section className="pt-9 last:pb-9 md:pt-13 [&+*]:pt-6.5 md:[&+*]:pt-9">
      <Container>
        <Title className="font-heading text-h1 font-semibold text-balance md:text-display-2">{hero.title}</Title>
        <Lead text={hero.lead} className="text-muted-foreground opacity-100" />
      </Container>
    </section>
  )
}

/** `overlaid`: the transparent header sits on top of this hero (home page only). */
export function RenderHero({
  hero,
  overlaid,
  titleAs,
}: {
  hero?: Hero | null
  overlaid?: boolean
  titleAs?: TitleTag
}) {
  switch (hero?.type) {
    case 'split':
      return <Split hero={hero} overlaid={overlaid} titleAs={titleAs} />
    case 'centeredFull':
    case 'centeredCarousel':
      return <Centered hero={hero} full overlaid={overlaid} titleAs={titleAs} />
    case 'centered':
      return <Centered hero={hero} full={false} overlaid={overlaid} titleAs={titleAs} />
    case 'compact':
      return <Compact hero={hero} titleAs={titleAs} />
    case 'minimal':
      return <Minimal hero={hero} titleAs={titleAs} />
    default:
      return null
  }
}
