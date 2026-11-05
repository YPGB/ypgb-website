/* eslint-disable @next/next/no-img-element */
import { cn } from '@/lib/utils'
import { FALLBACK_LOGO, mediaUrl } from '@/lib/site-settings'
import type { SiteSetting } from '@/payload-types'

type Props = {
  settings: SiteSetting
  size?: 'sm' | 'md'
  /** Prefer the optional "logo on dark" upload from Site Settings. */
  onDark?: boolean
  className?: string
}

export function Lockup({ settings, size = 'sm', onDark = true, className }: Props) {
  const logo = (onDark && mediaUrl(settings.logoOnDark)) || mediaUrl(settings.logo) || FALLBACK_LOGO
  return (
    <span className={cn('inline-flex min-w-0 items-center gap-2.5', className)}>
      {/* Original shape at a fixed height; the width follows the file. */}
      <img src={logo} alt="" className={cn('w-auto shrink-0', size === 'sm' ? 'h-12' : 'h-14')} />

      <span className="flex min-w-0 flex-col leading-none">
        {settings.kicker && (
          <span
            className={cn(
              'font-semibold uppercase tracking-[0.12em] opacity-75',
              size === 'sm' ? 'hidden text-[10px] leading-3.5 sm:block' : 'text-[11px] leading-4',
            )}
          >
            {settings.kicker}
          </span>
        )}
        <span
          className={cn(
            'truncate font-display font-black uppercase tracking-tight',
            size === 'sm' ? 'text-[20px] leading-5 sm:text-[22px]' : 'text-[28px] leading-7',
          )}
        >
          {settings.wordmark}
        </span>
      </span>
    </span>
  )
}
