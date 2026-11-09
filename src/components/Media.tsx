import Image from 'next/image'

import { cn } from '@/lib/utils'
import type { Media as MediaDoc } from '@/payload-types'

/** Any image document: Media or Gallery Images. */
export type MediaLike = Pick<MediaDoc, 'url' | 'width' | 'height' | 'focalX' | 'focalY'> & { alt?: string | null }

type Props = {
  media?: number | MediaLike | null
  className?: string
  /** Fill the parent (parent must be positioned and sized, e.g. aspect-* relative). */
  fill?: boolean
  sizes?: string
  priority?: boolean
}

/** Payload returns absolute URLs; same-site ones become relative so next/image treats them as local. */
export const toSrc = (url: string) => {
  try {
    const u = new URL(url)
    return u.origin === serverOrigin ? `${u.pathname}${u.search}` : url
  } catch {
    return url
  }
}
const serverOrigin = new URL(process.env.NEXT_PUBLIC_SERVER_URL || 'http://localhost:3000').origin

export function Media({ media, className, fill = true, sizes = '100vw', priority }: Props) {
  if (!media || typeof media !== 'object' || !media.url) return null
  const src = toSrc(media.url)
  const position = `${media.focalX ?? 50}% ${media.focalY ?? 50}%`
  return fill ? (
    <Image
      src={src}
      alt={media.alt ?? ''}
      fill
      sizes={sizes}
      priority={priority}
      className={cn('object-cover', className)}
      style={{ objectPosition: position }}
    />
  ) : (
    <Image
      src={src}
      alt={media.alt ?? ''}
      width={media.width ?? 1200}
      height={media.height ?? 800}
      sizes={sizes}
      priority={priority}
      className={cn('h-auto w-full', className)}
    />
  )
}
