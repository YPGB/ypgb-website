import { PageView, pageMetadata } from '@/components/PageView'
import { PRAYER_ROOT } from '@/lib/preview'

// /doa is the CMS page with slug "doa". This route exists because the static
// `doa/` folder (prayers at /doa/[slug]) takes precedence over `/[...slug]`.
export const generateMetadata = () => pageMetadata(PRAYER_ROOT)

export default function PrayerIndex() {
  return <PageView slug={PRAYER_ROOT} />
}
