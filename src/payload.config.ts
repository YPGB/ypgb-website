import { postgresAdapter } from '@payloadcms/db-postgres'
import { FixedToolbarFeature, HeadingFeature, lexicalEditor } from '@payloadcms/richtext-lexical'
import path from 'path'
import { buildConfig } from 'payload'
import { fileURLToPath } from 'url'
import sharp from 'sharp'

import { Albums } from './collections/Albums'
import { FileCategories } from './collections/FileCategories'
import { Files } from './collections/Files'
import { GalleryImages } from './collections/GalleryImages'
import { Journals } from './collections/Journals'
import { Media } from './collections/Media'
import { News } from './collections/News'
import { NewsCategories } from './collections/NewsCategories'
import { Pages } from './collections/Pages'
import { Pengurus } from './collections/Pengurus'
import { Prayers } from './collections/Prayers'
import { Testimonials } from './collections/Testimonials'
import { Units } from './collections/Units'
import { Users } from './collections/Users'
import { Navigation } from './globals/Navigation'
import { SiteSettings } from './globals/SiteSettings'
import { plugins } from './plugins'

const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)

export default buildConfig({
  serverURL: process.env.NEXT_PUBLIC_SERVER_URL || 'http://localhost:3000',
  admin: {
    user: Users.slug,
    importMap: {
      baseDir: path.resolve(dirname),
    },
    components: {
      graphics: {
        Logo: '/components/admin/Logo#Logo',
        Icon: '/components/admin/Icon#Icon',
      },
    },
    livePreview: {
      breakpoints: [
        { name: 'mobile', label: 'Mobile', width: 375, height: 667 },
        { name: 'tablet', label: 'Tablet', width: 768, height: 1024 },
        { name: 'desktop', label: 'Desktop', width: 1440, height: 900 },
      ],
    },
  },
  collections: [
    Pages,
    News,
    NewsCategories,
    Prayers,
    Journals,
    Albums,
    GalleryImages,
    Files,
    FileCategories,
    Units,
    Pengurus,
    Testimonials,
    Media,
    Users,
  ],
  globals: [SiteSettings, Navigation],
  editor: lexicalEditor({
    features: ({ defaultFeatures }) => [
      ...defaultFeatures.filter((feature) => feature.key !== 'heading'),
      // No H1: the page title is the only main heading.
      HeadingFeature({ enabledHeadingSizes: ['h2', 'h3', 'h4', 'h5', 'h6'] }),
      FixedToolbarFeature(),
    ],
  }),
  secret: process.env.PAYLOAD_SECRET || '',
  typescript: {
    outputFile: path.resolve(dirname, 'payload-types.ts'),
  },
  db: postgresAdapter({
    pool: {
      connectionString: process.env.DATABASE_URL || '',
    },
  }),
  sharp,
  plugins,
})
