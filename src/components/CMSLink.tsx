import { ArrowRight, ExternalLink } from 'lucide-react'
import NextLink from 'next/link'
import type { ComponentProps, ReactNode } from 'react'

import { Button } from '@/components/ui/button'
import type { ButtonAppearance } from '@/fields/link'
import { pathFor } from '@/lib/preview'
import type { Page } from '@/payload-types'

export type LinkData = {
  type?: 'page' | 'external' | null
  newTab?: boolean | null
  label?: string | null
  page?: number | Page | null
  anchor?: string | null
  url?: string | null
  appearance?: ButtonAppearance | null
}

export const resolveHref = (link?: LinkData | null): string | null => {
  if (!link) return null
  if (link.type === 'external') return link.url || null
  const slug = typeof link.page === 'object' ? link.page?.slug : null
  const anchor = link.anchor ? `#${link.anchor}` : ''
  if (!slug) return anchor || null
  return `${pathFor('pages', slug)}${anchor}`
}

const variants: Record<ButtonAppearance, ComponentProps<typeof Button>['variant']> = {
  primary: 'default',
  secondary: 'outline',
  accent: 'accent',
  link: 'link',
}

type Props = {
  link?: LinkData | null
  /** Render as a button using the link's appearance; otherwise a plain text link. */
  asButton?: boolean
  size?: ComponentProps<typeof Button>['size']
  className?: string
  children?: ReactNode
  arrow?: boolean
}

export function CMSLink({ link, asButton = true, size = 'lg', className, children, arrow }: Props) {
  const href = resolveHref(link)
  if (!href || !link) return null
  const external = link.type === 'external'
  const newTab = link.newTab || false
  const content = (
    <>
      {children ?? link.label}
      {external && newTab ? (
        <ExternalLink data-icon="inline-end" />
      ) : arrow ? (
        <ArrowRight data-icon="inline-end" />
      ) : null}
    </>
  )
  const anchorProps = newTab ? { target: '_blank', rel: 'noopener noreferrer' } : {}

  if (!asButton) {
    return external ? (
      <a href={href} className={className} {...anchorProps}>
        {content}
      </a>
    ) : (
      <NextLink href={href} className={className} {...anchorProps}>
        {content}
      </NextLink>
    )
  }

  return (
    <Button
      variant={variants[link.appearance ?? 'primary']}
      size={size}
      className={className}
      nativeButton={false}
      render={external ? <a href={href} {...anchorProps} /> : <NextLink href={href} {...anchorProps} />}
    >
      {content}
    </Button>
  )
}
