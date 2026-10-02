import { redirect } from 'next/navigation'

import { PageView, pageMetadata } from '@/components/PageView'
import { getPageSlugs } from '@/lib/queries'

type Props = { params: Promise<{ slug: string }> }

export async function generateStaticParams() {
  try {
    return (await getPageSlugs()).filter((slug) => slug !== 'home').map((slug) => ({ slug }))
  } catch {
    return []
  }
}

export async function generateMetadata({ params }: Props) {
  return pageMetadata((await params).slug)
}

export default async function Page({ params }: Props) {
  const { slug } = await params
  if (slug === 'home') redirect('/')
  return <PageView slug={decodeURIComponent(slug)} />
}
