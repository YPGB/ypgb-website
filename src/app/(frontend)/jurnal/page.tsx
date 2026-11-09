import type { ArchiveParams } from '@/blocks/NewsArchive'
import { PageView, pageMetadata } from '@/components/PageView'
import { JOURNAL_ROOT } from '@/lib/preview'

// /jurnal is the CMS page with slug "jurnal". This route exists because the static
// `jurnal/` folder (issues at /jurnal/[slug]) takes precedence over `/[...slug]`.
export const generateMetadata = () => pageMetadata(JOURNAL_ROOT)

export default function JournalIndex({ searchParams }: { searchParams: Promise<ArchiveParams> }) {
  return <PageView slug={JOURNAL_ROOT} searchParams={searchParams} />
}
