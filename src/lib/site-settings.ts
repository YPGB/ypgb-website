import config from '@payload-config'
import { unstable_cache } from 'next/cache'
import { getPayload } from 'payload'

import { SITE_SETTINGS_TAG } from '@/globals/SiteSettings'
import type { Media } from '@/payload-types'

export const FALLBACK_LOGO = '/brand/logo.png'

export const getSiteSettings = unstable_cache(
  async () => {
    const payload = await getPayload({ config })
    return payload.findGlobal({ slug: 'site-settings', depth: 1 })
  },
  [SITE_SETTINGS_TAG],
  { tags: [SITE_SETTINGS_TAG] },
)

export function mediaUrl(media: number | Pick<Media, 'url'> | null | undefined): string | undefined {
  return typeof media === 'object' && media?.url ? media.url : undefined
}
