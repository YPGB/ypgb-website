import type { ReactNode } from 'react'

import { CMSLink, type LinkData } from '@/components/CMSLink'
import type { SectionBackground } from '@/fields/section'
import { cn } from '@/lib/utils'

export type SectionSettings = {
  anchorId?: string | null
  background?: SectionBackground | null
  heading?: {
    overline?: string | null
    title?: string | null
    subtitle?: string | null
    align?: 'left' | 'center' | null
    hasAction?: boolean | null
    action?: LinkData | null
  } | null
}

const backgrounds: Record<SectionBackground, string> = {
  page: 'bg-background',
  warm: 'bg-muted',
  brand: 'bg-brand text-brand-foreground',
  brandDeep: 'bg-brand-deep text-brand-foreground',
}

export const isDarkBackground = (bg?: string | null) => bg === 'brand' || bg === 'brandDeep'

export function Container({ className, children }: { className?: string; children: ReactNode }) {
  return <div className={cn('mx-auto w-full max-w-site px-6', className)}>{children}</div>
}

export function Overline({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <span
      className={cn(
        'flex items-center gap-2 text-overline font-bold uppercase text-seal-700 before:h-0.5 before:w-5.5 before:bg-seal-600 in-data-[tone=dark]:text-wheat-300 in-data-[tone=dark]:before:bg-wheat-500',
        className,
      )}
    >
      {children}
    </span>
  )
}

export function SectionHeading({ heading, as: Tag = 'h2' }: { heading: SectionSettings['heading']; as?: 'h1' | 'h2' }) {
  if (!heading?.title && !heading?.overline) return null
  const center = heading.align === 'center'
  const action = heading.hasAction && heading.action ? { ...heading.action, appearance: 'link' as const } : null
  return (
    <div className={cn('flex flex-wrap items-end justify-between gap-4', center && 'justify-center text-center')}>
      <div className={cn('flex min-w-0 flex-col gap-3', center && 'mx-auto items-center')}>
        {heading.overline && <Overline>{heading.overline}</Overline>}
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
}: {
  section?: SectionSettings | null
  children: ReactNode
  className?: string
}) {
  const bg = section?.background ?? 'page'
  const hasHeading = Boolean(section?.heading?.title || section?.heading?.overline)
  return (
    <section
      id={section?.anchorId || undefined}
      data-tone={isDarkBackground(bg) ? 'dark' : undefined}
      className={cn(backgrounds[bg], 'py-18 md:py-26', className)}
    >
      <Container>
        <SectionHeading heading={section?.heading} />
        <div className={cn(hasHeading && 'mt-6.5 md:mt-9')}>{children}</div>
      </Container>
    </section>
  )
}
