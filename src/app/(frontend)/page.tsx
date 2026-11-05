import type { ArchiveParams } from '@/blocks/NewsArchive'
import { PageView, pageMetadata } from '@/components/PageView'

export const generateMetadata = () => pageMetadata('home')

export default function HomePage({ searchParams }: { searchParams: Promise<ArchiveParams> }) {
  return <PageView slug="home" searchParams={searchParams} />
}
