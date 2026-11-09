import { ArrowRight, Download, ExternalLink } from 'lucide-react'
import NextLink from 'next/link'
import type { ComponentProps, ReactNode } from 'react'

import { Icon } from '@/components/Icon'
import { toSrc } from '@/components/Media'
import { Button } from '@/components/ui/button'
import type { IconName } from '@/fields/icon'
import type { ButtonAppearance } from '@/fields/link'
import { pagePath } from '@/lib/preview'
import type { File as FileDoc, Page } from '@/payload-types'

export type LinkData = {
  type?: 'page' | 'external' | 'file' | null
  newTab?: boolean | null
  label?: string | null
  page?: number | Page | null
  anchor?: string | null
  url?: string | null
  file?: number | FileDoc | null
  appearance?: ButtonAppearance | null
  icon?: IconName | null
  iconPosition?: 'before' | 'after' | null
}

export const resolveHref = (link?: LinkData | null): string | null => {
  if (!link) return null
  if (link.type === 'external') return link.url || null
  if (link.type === 'file') return typeof link.file === 'object' && link.file?.url ? toSrc(link.file.url) : null
  const page = typeof link.page === 'object' ? link.page : null
  const anchor = link.anchor ? `#${link.anchor}` : ''
  if (!page?.slug) return anchor || null
  return `${pagePath(page)}${anchor}`
}

const variants: Record<ButtonAppearance, ComponentProps<typeof Button>['variant']> = {
  primary: 'default',
  secondary: 'outline',
  soft: 'secondary',
  ghost: 'ghost',
  accent: 'accent',
  parchment: 'parchment',
  brandDeep: 'brandDeep',
  white: 'white',
  black: 'black',
  link: 'link',
}

type Props = {
  link?: LinkData | null
  /** Render as a button using the link's appearance; otherwise a plain text link. */
  asButton?: boolean
  size?: ComponentProps<typeof Button>['size']
  className?: string
  children?: ReactNode
  /** Default arrow after the label, used when the editor chose no icon. */
  arrow?: boolean
}

/** The editor's icon, else a download icon for files, an external-link icon for new tabs, or the default arrow. */
function LinkIcons({ link, arrow, external, children }: { link: LinkData; arrow?: boolean; external: boolean; children: ReactNode }) {
  if (link.icon) {
    const after = link.icon === 'arrow-right' || link.iconPosition === 'after'
    const glyph = <Icon name={link.icon} data-icon={after ? 'inline-end' : 'inline-start'} />
    return (
      <>
        {!after && glyph}
        {children}
        {after && glyph}
      </>
    )
  }
  if (link.type === 'file') {
    return (
      <>
        <Download aria-hidden data-icon="inline-start" />
        {children}
      </>
    )
  }
  return (
    <>
      {children}
      {external && link.newTab ? (
        <ExternalLink aria-hidden data-icon="inline-end" />
      ) : arrow ? (
        <ArrowRight aria-hidden data-icon="inline-end" />
      ) : null}
    </>
  )
}

export function CMSLink({ link, asButton = true, size = 'lg', className, children, arrow }: Props) {
  const href = resolveHref(link)
  if (!href || !link) return null
  const isFile = link.type === 'file'
  const external = (link.type === 'external' && !href.startsWith('/')) || isFile
  const newTab = link.newTab || false
  const fileName = isFile && typeof link.file === 'object' ? (link.file?.filename ?? true) : undefined
  const content = (
    <LinkIcons link={link} arrow={arrow} external={external}>
      {children ?? link.label}
    </LinkIcons>
  )
  const anchorProps = {
    ...(newTab ? { target: '_blank', rel: 'noopener noreferrer' } : {}),
    ...(fileName ? { download: fileName } : {}),
  }

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
