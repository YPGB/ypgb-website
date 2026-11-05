import type { ComponentType } from 'react'
import { Facebook, Instagram, Linkedin, Tiktok, TwitterX, Youtube } from 'react-bootstrap-icons'

export type SocialPlatform = 'instagram' | 'facebook' | 'youtube' | 'tiktok' | 'x' | 'linkedin'

const icons: Record<SocialPlatform, ComponentType<{ className?: string; 'aria-hidden'?: boolean }>> = {
  instagram: Instagram,
  facebook: Facebook,
  youtube: Youtube,
  tiktok: Tiktok,
  x: TwitterX,
  linkedin: Linkedin,
}

export const socialLabel = (platform: SocialPlatform) =>
  platform === 'x' ? 'X' : platform === 'tiktok' ? 'TikTok' : platform === 'youtube' ? 'YouTube' : platform === 'linkedin' ? 'LinkedIn' : platform[0].toUpperCase() + platform.slice(1)

/** Brand logos (Bootstrap Icons, MIT). Lucide stays the icon set for everything else. */
export function SocialIcon({ platform, className }: { platform: SocialPlatform; className?: string }) {
  const Icon = icons[platform]
  return <Icon className={className} aria-hidden />
}
