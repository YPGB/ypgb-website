/**
 * Creates the pages, form and file categories the newer features rely on, with placeholder copy.
 * Safe to run again: anything that already exists is left alone.
 *
 *   docker compose exec app pnpm payload run scripts/seed-content.ts
 */
import config from '@payload-config'
import { getPayload } from 'payload'

const paragraph = (text: string) => ({
  root: {
    type: 'root',
    version: 1,
    format: '' as const,
    indent: 0,
    direction: 'ltr' as const,
    children: [
      {
        type: 'paragraph',
        version: 1,
        format: '' as const,
        indent: 0,
        direction: 'ltr' as const,
        textFormat: 0,
        children: [{ type: 'text', version: 1, text, format: 0, style: '', mode: 'normal', detail: 0 }],
      },
    ],
  },
})

const context = { disableRevalidate: true }

const payload = await getPayload({ config })

const categoryIds: Record<string, number> = {}
for (const title of ['Pengumuman', 'Surat', 'Kalender Pendidikan', 'Logo', 'Jurnal']) {
  const { docs } = await payload.find({ collection: 'file-categories', where: { title: { equals: title } }, limit: 1 })
  const slug = title.toLowerCase().replace(/\s+/g, '-')
  const category = docs[0] ?? (await payload.create({ collection: 'file-categories', data: { title, slug }, context }))
  categoryIds[title] = category.id
}

const existingForm = await payload.find({ collection: 'forms', where: { title: { equals: 'Kotak Saran' } }, limit: 1 })
const form =
  existingForm.docs[0] ??
  (await payload.create({
    collection: 'forms',
    context,
    data: {
      title: 'Kotak Saran',
      submitButtonLabel: 'Kirim Saran',
      confirmationType: 'message',
      confirmationMessage: paragraph('Terima kasih. Saran Anda telah kami terima.'),
      fields: [
        { blockType: 'text', name: 'nama', label: 'Nama (opsional)', width: 50 },
        { blockType: 'text', name: 'kontak', label: 'Email atau telepon (opsional)', width: 50 },
        { blockType: 'unit', name: 'unit', label: 'Unit' },
        { blockType: 'textarea', name: 'saran', label: 'Saran', required: true },
      ],
    },
  }))

const minimalHero = (title: string, lead: string) => ({ type: 'minimal' as const, title, lead })

const pages = [
  { slug: 'doa', title: 'Doa', hero: minimalHero('Doa', 'Kumpulan doa di lingkungan Yayasan Pendidikan Gembala Baik.'), layout: [] },
  {
    slug: 'dokumen',
    title: 'Dokumen',
    hero: minimalHero('Dokumen', 'Pengumuman, surat, kalender pendidikan dan logo yang dapat diunduh.'),
    layout: [
      {
        blockType: 'downloads' as const,
        categories: ['Pengumuman', 'Surat', 'Kalender Pendidikan', 'Logo'].map((title) => categoryIds[title]),
        limit: 10,
      },
    ],
  },
  {
    slug: 'jurnal',
    title: 'Jurnal',
    hero: minimalHero('Jurnal', 'Terbitan jurnal Yayasan Pendidikan Gembala Baik.'),
    layout: [
      {
        blockType: 'cardGrid' as const,
        columns: '3' as const,
        style: 'photo' as const,
        source: 'collection' as const,
        sourceCollection: 'journals' as const,
      },
    ],
  },
  {
    slug: 'galeri',
    title: 'Galeri',
    hero: minimalHero('Galeri', 'Dokumentasi kegiatan Yayasan Pendidikan Gembala Baik.'),
    layout: [
      {
        blockType: 'cardGrid' as const,
        columns: '3' as const,
        style: 'photo' as const,
        source: 'collection' as const,
        sourceCollection: 'albums' as const,
      },
    ],
  },
  {
    slug: 'kotak-saran',
    title: 'Kotak Saran',
    hero: minimalHero('Kotak Saran', 'Sampaikan saran Anda. Nama dan kontak boleh dikosongkan.'),
    layout: [{ blockType: 'contact' as const, showDetails: false, form: form.id }],
  },
]

for (const page of pages) {
  const { totalDocs } = await payload.find({
    collection: 'pages',
    where: { slug: { equals: page.slug } },
    limit: 1,
    draft: true,
  })
  if (totalDocs) {
    payload.logger.info(`Page "${page.slug}" already exists`)
    continue
  }
  await payload.create({ collection: 'pages', data: { ...page, _status: 'published' }, context })
  payload.logger.info(`Created page "${page.slug}"`)
}

process.exit(0)
