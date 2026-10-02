import { PageView, pageMetadata } from '@/components/PageView'

export const generateMetadata = () => pageMetadata('home')

export default function HomePage() {
  return <PageView slug="home" />
}
