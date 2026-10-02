/* eslint-disable @next/next/no-img-element */
import { FALLBACK_LOGO, getSiteSettings, mediaUrl } from '@/lib/site-settings'

export async function Icon() {
  const settings = await getSiteSettings()
  return (
    <img
      src={mediaUrl(settings.logo) ?? FALLBACK_LOGO}
      alt={settings.wordmark}
      style={{ display: 'block', height: 30, width: 'auto', objectFit: 'contain' }}
    />
  )
}
