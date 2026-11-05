import type { ArchiveParams } from '@/blocks/NewsArchive'
import { PageView, pageMetadata } from '@/components/PageView'

// /berita is the CMS page with slug "berita". This route exists because the static
// `berita/` folder (articles at /berita/[slug]) takes precedence over `/[slug]`.
export const generateMetadata = () => pageMetadata('berita')

export default function NewsIndex({ searchParams }: { searchParams: Promise<ArchiveParams> }) {
  return <PageView slug="berita" searchParams={searchParams} />
}
