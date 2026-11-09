import type { ArchiveParams } from '@/blocks/NewsArchive'
import { PageView, pageMetadata } from '@/components/PageView'
import { ALBUM_ROOT, JOURNAL_ROOT, PRAYER_ROOT } from '@/lib/preview'
import { getPagePaths } from '@/lib/queries'

type Props = { params: Promise<{ slug: string[] }>; searchParams: Promise<ArchiveParams> }

const toSegments = (slug: string[]) => slug.map(decodeURIComponent)

export async function generateStaticParams() {
  try {
    return (await getPagePaths())
      .filter((path) => !['/', '/berita', `/${PRAYER_ROOT}`, `/${JOURNAL_ROOT}`, `/${ALBUM_ROOT}`].includes(path))
      .map((path) => ({ slug: path.split('/').filter(Boolean) }))
  } catch {
    return []
  }
}

export async function generateMetadata({ params }: Props) {
  return pageMetadata(toSegments((await params).slug).at(-1)!)
}

export default async function Page({ params, searchParams }: Props) {
  const segments = toSegments((await params).slug)
  return <PageView slug={segments.at(-1)!} requestedPath={`/${segments.join('/')}`} searchParams={searchParams} />
}
