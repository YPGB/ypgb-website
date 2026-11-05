import type { ReactNode } from 'react'

import { CMSLink, type LinkData } from '@/components/CMSLink'
import type { SectionBackground } from '@/fields/section'
import { cn } from '@/lib/utils'

export type SectionSettings = {
  anchorId?: string | null
  background?: SectionBackground | null
  heading?: {
    title?: string | null
    subtitle?: string | null
    align?: 'left' | 'center' | null
    hasAction?: boolean | null
    action?: LinkData | null
  } | null
}

const backgrounds: Record<SectionBackground, string> = {
  page: 'bg-background',
  white: 'bg-white',
  warm: 'bg-muted',
  brand: 'bg-brand text-brand-foreground',
  brandDeep: 'bg-brand-deep text-brand-foreground',
}

export const isDarkBackground = (bg?: string | null) => bg === 'brand' || bg === 'brandDeep'

export function Container({ className, children }: { className?: string; children: ReactNode }) {
  return <div className={cn('w-full px-4 md:px-8 min-[75rem]:px-20 in-data-[contained]:px-0!', className)}>{children}</div>
}

export function SectionHeading({ heading, as: Tag = 'h2' }: { heading: SectionSettings['heading']; as?: 'h1' | 'h2' }) {
  if (!heading?.title) return null
  const center = heading.align === 'center'
  const action = heading.hasAction && heading.action ? { ...heading.action, appearance: 'link' as const } : null
  return (
    <div className={cn('flex flex-wrap items-end justify-between gap-4', center && 'justify-center text-center')}>
      <div className={cn('flex min-w-0 flex-col gap-3', center && 'mx-auto items-center')}>
        {heading.title && <Tag className="text-[24px] leading-tight tracking-tight md:text-h2">{heading.title}</Tag>}
        {heading.subtitle && (
          <p className="max-w-[68ch] text-base text-muted-foreground in-data-[tone=dark]:text-white/75">
            {heading.subtitle}
          </p>
        )}
      </div>
      {action && <CMSLink link={action} size="default" arrow className="font-semibold" />}
    </div>
  )
}

export function Section({
  section,
  children,
  className,
  backdrop,
}: {
  section?: SectionSettings | null
  children: ReactNode
  className?: string
  /** Rendered behind the content, filling the section (e.g. a photo with overlay). */
  backdrop?: ReactNode
}) {
  const bg = section?.background ?? 'page'
  const hasHeading = Boolean(section?.heading?.title)
  return (
    <section
      id={section?.anchorId || undefined}
      data-tone={isDarkBackground(bg) ? 'dark' : undefined}
      className={cn(backgrounds[bg], 'py-18 md:py-26 in-data-[contained]:bg-transparent! in-data-[contained]:py-0!', backdrop && 'relative isolate overflow-hidden', className)}
    >
      {backdrop}
      <Container>
        <SectionHeading heading={section?.heading} />
        <div className={cn('@container', hasHeading && 'mt-6.5 md:mt-9')}>{children}</div>
      </Container>
    </section>
  )
}
