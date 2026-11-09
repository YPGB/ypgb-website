import type { ArchiveParams } from '@/blocks/NewsArchive'
import { PageView, pageMetadata } from '@/components/PageView'
import { ALBUM_ROOT } from '@/lib/preview'

// /galeri is the CMS page with slug "galeri". This route exists because the static
// `galeri/` folder (albums at /galeri/[slug]) takes precedence over `/[...slug]`.
export const generateMetadata = () => pageMetadata(ALBUM_ROOT)

export default function GalleryIndex({ searchParams }: { searchParams: Promise<ArchiveParams> }) {
  return <PageView slug={ALBUM_ROOT} searchParams={searchParams} />
}
