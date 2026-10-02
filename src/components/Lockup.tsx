/* eslint-disable @next/next/no-img-element */
import { cn } from '@/lib/utils'
import { FALLBACK_LOGO, mediaUrl } from '@/lib/site-settings'
import type { SiteSetting } from '@/payload-types'

type Props = {
  settings: SiteSetting
  size?: 'sm' | 'md'
  /** On dark grounds the seal sits on a white chip (its line art is dark ink). */
  onDark?: boolean
  className?: string
}

export function Lockup({ settings, size = 'sm', onDark = true, className }: Props) {
  const logo = (onDark && mediaUrl(settings.logoOnDark)) || mediaUrl(settings.logo) || FALLBACK_LOGO
  const chip = onDark && !mediaUrl(settings.logoOnDark)
  return (
    <span className={cn('inline-flex min-w-0 items-center gap-2.5', className)}>
      <span
        className={cn(
          'flex shrink-0 items-center justify-center',
          size === 'sm' ? 'size-9 sm:size-10' : 'size-14',
          chip && 'overflow-hidden rounded-full bg-white p-0.5 shadow-sm',
        )}
      >
        <img src={logo} alt="" className="size-full object-contain" width={56} height={56} />
      </span>
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
