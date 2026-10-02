/* eslint-disable @next/next/no-img-element */
import { FALLBACK_LOGO, getSiteSettings, mediaUrl } from '@/lib/site-settings'

export async function Logo() {
  const settings = await getSiteSettings()
  return (
    <img
      src={mediaUrl(settings.logo) ?? FALLBACK_LOGO}
      alt={settings.name}
      style={{ display: 'block', height: 160, width: 'auto', maxWidth: '100%', objectFit: 'contain' }}
    />
  )
}
