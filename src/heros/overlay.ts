import type { Page } from '@/payload-types'

/**
 * Whether the header can sit transparently over this hero: it needs a dark surface behind the light header text
 * (a photo with its overlay, or a dark band), and enough room at the top.
 */
export const heroSitsUnderHeader = (hero?: Page['hero'] | null): boolean => {
  if (hero?.type === 'centeredCarousel' && hero.media?.length) return true
  if (hero?.type !== 'split' && hero?.type !== 'centered' && hero?.type !== 'centeredFull' && hero?.type !== 'centeredCarousel') return false
  if ((hero.type === 'centered' || hero.type === 'centeredFull') && hero.backgroundImage) return true
  return hero.background !== 'warm'
}
