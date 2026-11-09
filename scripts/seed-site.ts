/**
 * Seeds the site content planned in docs/konten/rencana-konten-website.md, with facts from docs/konten/data-ypgb.md.
 * Run scripts/seed-content.ts first (it creates Doa, Dokumen, Jurnal, Galeri, Kotak Saran and the file categories).
 *
 *   docker compose exec app pnpm payload run scripts/seed-site.ts               # pages as drafts, units, pengurus, categories
 *   docker compose exec -e SEED_FLAGS=--publish app pnpm payload run scripts/seed-site.ts     # same, but publishes the pages (empty prod DB)
 *   docker compose exec -e SEED_FLAGS=--globals app pnpm payload run scripts/seed-site.ts     # also Site Settings + Navigation
 *
 *   docker compose exec -e SEED_FLAGS=--only-globals app pnpm payload run scripts/seed-site.ts  # only Site Settings + Navigation
 *
 * Safe to run again: documents are matched by slug, name or title and updated. On a page that already exists,
 * the default mode saves a new draft and leaves the published version alone, so review and publish in the admin.
 * Publish leaf pages before the pages that link to them (subpages, then Tentang Kami, then Home), because a link
 * may only point at a published page. Navigation links are written only for pages that are already published.
 * Writes skip revalidation: clear the data cache afterwards (`.next/dev/cache/fetch-cache` in dev).
 *
 * Images are looked up by filename in Media. On an empty database put the files in scripts/seed/assets/ and they
 * are uploaded; a missing image is skipped with a warning (a block that requires it is left out).
 */
import config from '@payload-config'
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { getPayload, type RequiredDataFromCollectionSlug } from 'payload'

import type { ButtonAppearance } from '@/fields/link'
import type { IconName } from '@/fields/icon'
import type { SectionBackground } from '@/fields/section'

import { doc, embed, h, ol, p, ul } from './seed/richtext'

/** `payload run` drops command-line arguments, so the mode comes from SEED_FLAGS, e.g. SEED_FLAGS=--publish,--globals. */
const FLAGS = (process.env.SEED_FLAGS ?? '').split(/[\s,]+/).filter(Boolean)
const PUBLISH = FLAGS.includes('--publish')
const GLOBALS = FLAGS.includes('--globals')
/** Only Site Settings + Navigation, leaving pages, units and pengurus alone (e.g. after editing them in the admin). */
const ONLY_GLOBALS = FLAGS.includes('--only-globals')
const context = { disableRevalidate: true }
const here = path.dirname(fileURLToPath(import.meta.url))
/** Where images missing from Media are uploaded from: seed assets first, then the site's own brand folder (logo). */
const ASSET_DIRS = [path.resolve(here, 'seed/assets'), path.resolve(here, '../public/brand')]

const payload = await getPayload({ config })
const log = (message: string) => payload.logger.info(`[seed-site] ${message}`)
const warn = (message: string) => payload.logger.warn(`[seed-site] ${message}`)

type PageData = RequiredDataFromCollectionSlug<'pages'>
type Block = NonNullable<PageData['layout']>[number]

// ---------------------------------------------------------------------------
// Media
// ---------------------------------------------------------------------------

/** Alt text used only when the image has to be uploaded from scripts/seed/assets. */
const ALT: Record<string, string> = {
  'image.jpg': 'Peserta didik Gembala Baik',
  'IMG_0250.JPG': 'Peserta didik berlatih musik',
  'IMG_0137.JPG': 'Peserta didik SMA Gembala Baik',
  'IMG_0098.webp': 'Pengarahan pada perayaan Santo Fransiskus dari Assisi',
  'DSC_1706.JPG': 'Foto bersama keluarga besar Gembala Baik',
  'TK-1.JPG': 'Anak-anak TK Gembala Baik',
  'SD Plus.JPG': 'Peserta didik SD Plus Gembala Baik',
  'SMP.JPG': 'Peserta didik SMP Gembala Baik',
  'SMA.JPG': 'Peserta didik SMA Gembala Baik',
  'logo.png': 'Logo Yayasan Pendidikan Gembala Baik Pontianak',
}

const mediaCache = new Map<string, number | null>()

/** Media id for a filename; uploads it from scripts/seed/assets when it isn't in Media yet. */
async function media(filename: string): Promise<number | null> {
  if (mediaCache.has(filename)) return mediaCache.get(filename)!
  const webp = filename.replace(/\.[^.]+$/, '.webp') // originals are converted to webp on upload
  const { docs } = await payload.find({
    collection: 'media',
    where: { or: [{ filename: { equals: filename } }, { filename: { equals: webp } }] },
    limit: 1,
    depth: 0,
  })
  let id: number | null = docs[0]?.id ?? null
  if (!id) {
    const file = ASSET_DIRS.map((dir) => path.join(dir, filename)).find((candidate) => fs.existsSync(candidate))
    if (file) {
      const created = await payload.create({
        collection: 'media',
        data: { alt: ALT[filename] ?? filename },
        filePath: file,
        context,
      })
      id = created.id
      log(`Uploaded image ${filename}`)
    } else {
      warn(`Image ${filename} not found in Media or scripts/seed/assets; skipped`)
    }
  }
  mediaCache.set(filename, id)
  return id
}

const mediaList = async (...filenames: string[]) =>
  (await Promise.all(filenames.map(media))).filter((id): id is number => id !== null)

// ---------------------------------------------------------------------------
// Pages, links and sections
// ---------------------------------------------------------------------------

/** slug → id, filled as pages are found or written. */
const pageIds = new Map<string, number>()
const published = new Set<string>()

async function findPage(slugs: string[]) {
  const { docs } = await payload.find({
    collection: 'pages',
    where: { slug: { in: slugs } },
    draft: true,
    limit: 1,
    depth: 0,
  })
  return docs[0]
}

/** Records which pages exist and which have a published version (links may only point at those). */
async function loadPages() {
  const { docs } = await payload.find({ collection: 'pages', limit: 200, depth: 0, pagination: false })
  for (const page of docs) {
    pageIds.set(page.slug, page.id)
    if (page._status === 'published') published.add(page.slug)
  }
}

type LinkInput = {
  label: string
  /** Page slug. */
  page?: string
  anchor?: string
  url?: string
  newTab?: boolean
}
type ButtonInput = LinkInput & { appearance?: ButtonAppearance; icon?: IconName; iconPosition?: 'before' | 'after' }

function link(l: LinkInput) {
  if (l.page) {
    const id = pageIds.get(l.page)
    if (!id) throw new Error(`Link "${l.label}" points at page "${l.page}", which doesn't exist yet`)
    return { type: 'page' as const, label: l.label, page: id, anchor: l.anchor ?? null, newTab: l.newTab ?? false }
  }
  return { type: 'external' as const, label: l.label, url: l.url ?? '#', newTab: l.newTab ?? false }
}

const button = (b: ButtonInput) => ({
  link: {
    ...link(b),
    appearance: b.appearance ?? 'primary',
    icon: b.icon ?? null,
    iconPosition: b.iconPosition ?? 'before',
  },
})

type SectionInput = {
  bg?: SectionBackground
  anchor?: string
  title?: string
  subtitle?: string
  align?: 'left' | 'center'
  action?: LinkInput
}

const section = (s: SectionInput = {}) => ({
  anchorId: s.anchor ?? null,
  background: s.bg ?? 'page',
  heading: {
    title: s.title ?? null,
    subtitle: s.subtitle ?? null,
    align: s.align ?? 'left',
    hasAction: Boolean(s.action),
    ...(s.action && { action: link(s.action) }),
  },
})

const meta = (title: string, description: string) => ({ title, description })

async function upsertPage(data: PageData, { aliases = [] as string[], publish = PUBLISH } = {}) {
  const existing = await findPage([data.slug, ...aliases])
  const status = publish ? 'published' : 'draft'
  const payloadData = { ...data, generateSlug: false, _status: status } as PageData
  const page = existing
    ? await payload.update({ collection: 'pages', id: existing.id, data: payloadData, draft: !publish, context })
    : await payload.create({ collection: 'pages', data: payloadData, draft: !publish, context })
  pageIds.set(data.slug, page.id)
  if (publish) published.add(data.slug)
  log(`${existing ? 'Updated' : 'Created'} page "${data.slug}" (${status})`)
  return page
}

/** Updates only the hero lead and SEO of a page made by seed-content.ts, as a draft unless --publish. */
async function touchPage(slug: string, lead: string | null, description: string) {
  const existing = await findPage([slug])
  if (!existing) {
    warn(`Page "${slug}" not found; run scripts/seed-content.ts first`)
    return
  }
  await payload.update({
    collection: 'pages',
    id: existing.id,
    data: {
      ...(lead !== null && { hero: { ...existing.hero, lead } }),
      meta: { ...existing.meta, description },
      _status: PUBLISH ? 'published' : 'draft',
    },
    draft: !PUBLISH,
    context,
  })
  log(`Updated hero/SEO of "${slug}"`)
}

// ---------------------------------------------------------------------------
// Categories, units, pengurus
// ---------------------------------------------------------------------------

async function upsertCategory(collection: 'news-categories' | 'file-categories', title: string, slug: string) {
  const { docs } = await payload.find({ collection, where: { title: { equals: title } }, limit: 1, depth: 0 })
  if (docs[0]) return docs[0].id
  const created = await payload.create({ collection, data: { title, slug }, context })
  log(`Created ${collection} "${title}"`)
  return created.id
}

const AHMAD_YANI = 'Kompleks Persekolahan Gembala Baik, Jl. Jenderal Ahmad Yani, Kec. Pontianak Tenggara, Kota Pontianak'
const A = 'Terakreditasi A'

/** docs/konten/data-ypgb.md §5. Photos are left as they are. */
const UNITS: RequiredDataFromCollectionSlug<'units'>[] = [
  {
    abbreviation: 'TK GB',
    name: 'TK Gembala Baik',
    level: 'TK',
    address: AHMAD_YANI,
    principal: 'Kartini, S.Pd., M.Pd. (Sr. Epifania, OSA)',
    accreditation: A,
    phone: '0853-4504-5425',
    email: 'tkgembalabaikptk@gmail.com',
    website: 'http://tkgembalabaik.sch.id',
  },
  {
    abbreviation: 'SD GB I',
    name: 'SD Gembala Baik I',
    level: 'SD',
    address: 'Jl. Pangsuma No. 2, Kel. Benua Melayu Laut, Kec. Pontianak Selatan, Kota Pontianak',
    principal: 'Winarno, S.Pd.',
  },
  {
    abbreviation: 'SD GB II',
    name: 'SD Gembala Baik II',
    level: 'SD',
    address: AHMAD_YANI,
    principal: 'Edy Susanto, S.Pd.Gr.',
    accreditation: A,
    phone: '0896-6314-4578',
    email: 'sdsgembalabaik2@gmail.com',
    website: 'http://sdsgb2.sch.id',
  },
  {
    abbreviation: 'SD Plus GB',
    name: 'SD Plus Gembala Baik',
    level: 'SD',
    address: AHMAD_YANI,
    principal: 'Antonius Yayan, S.Pd.Gr.',
    accreditation: A,
    phone: '0851-0302-6568',
    email: 'sdplusgembalabaik@yahoo.com',
    website: 'http://www.sdplusgembalabaik.sch.id',
  },
  {
    abbreviation: 'SMP GB',
    name: 'SMP Gembala Baik',
    level: 'SMP',
    address: AHMAD_YANI,
    principal: 'Susanto, S.Pd.',
    accreditation: A,
    phone: '(0561) 673-0057',
    email: 'smpgbptk@gmail.com',
    website: 'http://www.smpgembalabaik.sch.id',
  },
  {
    // Administratively part of SMP Gembala Baik (same NPSN and accreditation), shown on its own on purpose.
    abbreviation: 'SMP Plus GB',
    name: 'SMP Plus Gembala Baik',
    level: 'SMP',
    address: AHMAD_YANI,
    principal: 'Hutanto, S.T. (Koordinator)',
    accreditation: A,
    phone: '(0561) 673-0057',
    email: 'smpgbptk@gmail.com',
    website: 'http://www.smpgembalabaik.sch.id',
  },
  {
    abbreviation: 'SMA GB',
    name: 'SMA Gembala Baik',
    level: 'SMA',
    address: AHMAD_YANI,
    principal: 'Anastasia Kran, S.Ag., M.Th.',
    accreditation: A,
    phone: '0821-5353-7190',
    email: 'gb@smagb.sch.id',
    website: 'http://www.smagb.sch.id',
  },
]

/** docs/konten/data-ypgb.md §7. Term and photo are left as they are. */
const PENGURUS: RequiredDataFromCollectionSlug<'pengurus'>[] = [
  { titlePrefix: 'Pastor Dr.', name: 'Paulus Toni Tantiono', titleSuffix: 'OFM Cap.', position: 'Ketua', organ: 'pengurus' },
  { titlePrefix: 'Pastor', name: 'Fransiskus Robertus', titleSuffix: 'OFM Cap.', position: 'Wakil Ketua', organ: 'pengurus' },
  { titlePrefix: 'Pastor', name: 'Kosmas Jang', titleSuffix: 'OFM Cap.', position: 'Bendahara I', organ: 'pengurus' },
  { titlePrefix: 'Pastor', name: 'Paskalis Leonard Nojo', titleSuffix: 'OFM Cap.', position: 'Bendahara II', organ: 'pengurus' },
  { titlePrefix: 'Pastor', name: 'Nobertus Desiderius', titleSuffix: 'OFM Cap.', position: 'Sekretaris I', organ: 'pengurus' },
  { titlePrefix: 'Pastor', name: 'Yohanes Wahyudi', titleSuffix: 'M.P., OFM Cap.', position: 'Sekretaris II', organ: 'pengurus' },
  { titlePrefix: 'Bruder', name: 'Antonius Primaldo', titleSuffix: 'OFM Cap.', position: 'Anggota', organ: 'pengurus' },
]

async function upsertUnits() {
  for (const row of UNITS) {
    const { docs } = await payload.find({ collection: 'units', where: { name: { equals: row.name } }, limit: 1, depth: 0 })
    if (docs[0]) await payload.update({ collection: 'units', id: docs[0].id, data: row, context })
    else await payload.create({ collection: 'units', data: row, context })
    log(`${docs[0] ? 'Updated' : 'Created'} unit "${row.name}"`)
  }
}

async function upsertPengurus() {
  for (const row of PENGURUS) {
    const { docs } = await payload.find({ collection: 'pengurus', where: { name: { equals: row.name } }, limit: 1, depth: 0 })
    if (docs[0]) await payload.update({ collection: 'pengurus', id: docs[0].id, data: row, context })
    else await payload.create({ collection: 'pengurus', data: row, context })
    log(`${docs[0] ? 'Updated' : 'Created'} pengurus "${row.name}"`)
  }
}

// ---------------------------------------------------------------------------
// Shared copy
// ---------------------------------------------------------------------------

const VISI = 'Menjadi komunitas pendidikan Katolik–Kapusin yang unggul, inklusif, transformatif, dan berdaya saing global.'

const MISI = [
  'Mengembangkan pendidikan iman dan karakter yang berlandaskan kasih, keadilan, dan penghargaan terhadap martabat manusia dalam kehidupan sehari-hari.',
  'Menyelenggarakan pendidikan yang berkualitas, inklusif, dan berkeadilan, dengan menciptakan lingkungan belajar yang aman, menghargai keberagaman, dan menjunjung tinggi persaudaraan.',
  'Mewujudkan pendidikan yang berintegritas dan profesional, melalui pengelolaan yang transparan, akuntabel, dan berorientasi pada peningkatan mutu berkelanjutan.',
  'Mengembangkan pembelajaran yang bermakna dan holistik, yang mengintegrasikan iman, ilmu pengetahuan, teknologi, serta pengembangan kompetensi sesuai perkembangan zaman.',
  'Menumbuhkan kepemimpinan yang melayani, yang berlandaskan keteladanan, partisipasi, dan pemberdayaan seluruh keluarga besar yayasan.',
  'Membangun kesadaran dan tanggung jawab ekologis, melalui pendidikan dan budaya yang peduli terhadap kelestarian lingkungan hidup.',
  'Mendorong inovasi dan kemampuan adaptasi terhadap perkembangan global, melalui pemanfaatan teknologi, penguatan literasi dan numerasi, serta pengembangan kreativitas dan kemandirian.',
]

const TUJUAN_UMUM = [
  'Beriman dan menghayati nilai kasih dalam kehidupan sehari-hari.',
  'Berkarakter kuat, berintegritas, dan memiliki sikap hidup sederhana.',
  'Mampu hidup dalam keberagaman dengan semangat persaudaraan dan sikap inklusif.',
  'Memiliki kepedulian terhadap lingkungan dan tanggung jawab sosial.',
  'Menunjukkan jiwa kepemimpinan yang melayani dan berorientasi pada kebaikan bersama.',
  'Memiliki semangat belajar sepanjang hayat serta kemampuan berpikir kritis dan kreatif.',
  'Adaptif, inovatif, dan siap menghadapi perkembangan zaman dalam konteks global.',
]

const items = (rows: [string, string][]) => rows.map(([title, description]) => ({ title, description }))

const ABOUT_PARAGRAPHS = [
  p(
    'Yayasan Pendidikan Gembala Baik Pontianak berakar dari sekolah misi yang dibuka para imam, bruder, dan suster pada tahun 1932 di dekat Pelabuhan Seng Hie. Masyarakat mengenalnya sebagai Sekolah "San Muk", yang berarti Gembala Baik. Kini yayasan menaungi tujuh unit sekolah, dari TK hingga SMA, di Jl. Jenderal Ahmad Yani dan Jl. Pangsuma.',
  ),
  p(
    'Yayasan dikelola oleh Ordo Saudara Dina Kapusin Provinsi Pontianak. Dalam semangat Santo Fransiskus dari Assisi, kami mendampingi setiap peserta didik agar bertumbuh dalam iman, ilmu, dan karakter, dengan sederhana, bersaudara, dan peduli terhadap sesama serta alam ciptaan.',
  ),
]

// ---------------------------------------------------------------------------
// Run
// ---------------------------------------------------------------------------

const karierCategory = await upsertCategory('news-categories', 'Karier', 'karier')
const ppdbCategory = await upsertCategory('file-categories', 'PPDB', 'ppdb')
if (!ONLY_GLOBALS) {
  await upsertUnits()
  await upsertPengurus()
}
await loadPages()

const settings = await payload.findGlobal({ slug: 'site-settings', depth: 0 })
const whatsappUrl = settings.whatsapp ? `https://wa.me/${settings.whatsapp}` : '#'

/** Site Settings + Navigation. Links only pages that are published. */
async function writeGlobals() {
  const groupPhoto = await media('DSC_1706.JPG')
  await payload.updateGlobal({
    slug: 'site-settings',
    data: {
      description: 'Pendidikan Katolik–Kapusin sejak 1932. Tujuh unit sekolah dari TK hingga SMA di Pontianak.',
      foundedYear: 1973,
      address: settings.address?.replace(/\b78117\b/, '78124') ?? settings.address,
    },
    context,
  })
  log('Updated Site Settings')

  await loadPages()
  const admission: LinkInput = published.has('penerimaan')
    ? { label: 'Penerimaan Siswa Baru', page: 'penerimaan' }
    : { label: 'Lihat Unit Sekolah', page: 'unit' }
  /** Only published pages can be linked; the rest are left out and reported. */
  const navLink = (label: string, page: string, anchor?: string) => {
    if (!published.has(page)) {
      warn(`Navigation: "${label}" left out, page "${page}" is not published yet`)
      return null
    }
    return { link: link({ label, page, anchor }) }
  }
  const present = <T>(rows: (T | null)[]) => rows.filter((row): row is T => row !== null)
  const spp = { link: link({ label: 'Cek SPP', url: 'https://spp.ypgb.or.id', newTab: true }) }
  const ppdbReady = published.has('penerimaan')

  const headerItems = present([
    navLink('Tentang Kami', 'tentang-kami') && {
      ...navLink('Tentang Kami', 'tentang-kami')!,
      showInBar: true,
      children: present([
        navLink('Sejarah', 'sejarah'),
        navLink('Motto dan Nilai', 'motto-dan-nilai'),
        navLink('Unit Sekolah', 'unit'),
        navLink('Pengurus', 'pengurus'),
      ]),
    },
    navLink('Unit Sekolah', 'unit') && { ...navLink('Unit Sekolah', 'unit')!, showInBar: true },
    navLink('Berita', 'berita') && { ...navLink('Berita', 'berita')!, showInBar: true },
    navLink('Galeri', 'galeri') && { ...navLink('Galeri', 'galeri')!, showInBar: true },
    navLink('Jurnal', 'jurnal'),
    navLink('Doa', 'doa'),
    navLink('Karier', 'karier') && { ...navLink('Karier', 'karier')!, showInBar: true },
  ])

  await payload.updateGlobal({
    slug: 'navigation',
    data: {
      headerItems,
      secondaryLinks: present([spp, navLink('Dokumen', 'dokumen'), navLink('Kotak Saran', 'kotak-saran')]),
      linkGroups: [],
      hasHeaderButton: ppdbReady,
      ...(ppdbReady && { headerButton: link({ label: 'Penerimaan Siswa Baru', page: 'penerimaan' }) }),
      footerBlocks: [
        {
          blockType: 'cta',
          section: { heading: { align: 'center' } },
          size: 'big',
          backgroundImage: groupPhoto,
          icon: 'heart-handshake',
          title: 'Bergabung Bersama Kami',
          text: 'Mari tumbuh bersama keluarga besar Gembala Baik, sebagai peserta didik maupun sebagai pendidik dan tenaga kependidikan.',
          links: present([
            published.has(admission.page!) ? button({ ...admission, appearance: 'accent', icon: 'school', iconPosition: 'after' }) : null,
            published.has('karier') ? button({ label: 'Karier di YPGB', page: 'karier', appearance: 'parchment' }) : null,
          ]),
        },
      ],
      footerColumns: [
        {
          title: 'Yayasan',
          links: present([
            navLink('Tentang Kami', 'tentang-kami'),
            navLink('Sejarah', 'sejarah'),
            navLink('Motto dan Nilai', 'motto-dan-nilai'),
            navLink('Pengurus', 'pengurus'),
            navLink('Karier', 'karier'),
          ]),
        },
        {
          title: 'Pendidikan',
          links: present([
            navLink('Unit Sekolah', 'unit'),
            ppdbReady ? navLink('Penerimaan Siswa Baru', 'penerimaan') : null,
            spp,
            navLink('Dokumen', 'dokumen'),
          ]),
        },
        {
          title: 'Kehidupan Sekolah',
          links: present([
            navLink('Berita', 'berita'),
            navLink('Galeri', 'galeri'),
            navLink('Jurnal', 'jurnal'),
            navLink('Doa', 'doa'),
            navLink('Kotak Saran', 'kotak-saran'),
          ]),
        },
      ],
    },
    context,
  })
  log('Updated Navigation')
}

if (ONLY_GLOBALS) {
  await writeGlobals()
  log('Done (globals only). Clear the data cache (.next/dev/cache/fetch-cache in dev).')
  process.exit(0)
}

// Berita: thin route, needs the CMS page.
if (!pageIds.has('berita')) {
  await upsertPage({
    title: 'Berita',
    slug: 'berita',
    hero: { type: 'minimal', title: 'Berita', lead: 'Kabar, kegiatan, prestasi, dan pengumuman dari seluruh unit.' },
    layout: [{ blockType: 'newsList', section: section(), mode: 'archive', layout: 'grid', limit: 9 }],
    meta: meta('Berita', 'Kabar, kegiatan, prestasi, dan pengumuman dari ketujuh unit Yayasan Pendidikan Gembala Baik Pontianak.'),
  })
}

// --- Tentang Kami ------------------------------------------------------------

const groupPhoto = await media('DSC_1706.JPG')

await upsertPage(
  {
    title: 'Tentang Kami',
    slug: 'tentang-kami',
    showSidebar: true,
    hero: {
      type: 'centered',
      background: 'brand',
      size: 'medium',
      backgroundImage: groupPhoto,
      title: 'Tentang Kami',
      lead: 'Komunitas pendidikan Katolik–Kapusin yang bertumbuh bersama sejak 1932.',
    },
    layout: [
      {
        blockType: 'richText',
        section: section(),
        layout: 'single',
        content: doc(
          ...ABOUT_PARAGRAPHS,
          p(
            'Kami percaya pendidikan bukan sekadar pengalihan ilmu, melainkan perjumpaan pribadi yang menumbuhkan manusia seutuhnya: hati, akal budi, dan tindakan.',
          ),
        ),
      },
      {
        blockType: 'quote',
        section: section({ anchor: 'visi' }),
        text: VISI,
        description: 'Visi Yayasan Pendidikan Gembala Baik Pontianak',
        align: 'center',
      },
      {
        blockType: 'list',
        section: section({ anchor: 'misi' }),
        heading: 'Misi',
        intro: 'Untuk mewujudkan visi tersebut, yayasan menjalankan misi berikut.',
        style: 'numbered',
        columns: '1',
        items: MISI.map((text) => ({ text })),
      },
      {
        blockType: 'list',
        section: section({ anchor: 'tujuan' }),
        heading: 'Tujuan Umum',
        intro: 'Pendidikan di Gembala Baik bertujuan membentuk pribadi yang:',
        style: 'numbered',
        columns: '1',
        items: TUJUAN_UMUM.map((text) => ({ text })),
      },
      {
        blockType: 'gridList',
        section: section({ anchor: 'arah-pengembangan' }),
        heading: 'Arah Pengembangan',
        intro: 'Tujuh arah yang kami tempuh untuk mencapai tujuan tersebut.',
        columns: '2',
        items: items([
          ['Iman dan Karakter', 'Menumbuhkan iman yang hidup, sikap berbelarasa, serta perilaku yang mencerminkan kasih, keadilan, dan penghormatan terhadap martabat manusia.'],
          ['Integritas dan Disiplin', 'Membentuk pribadi yang jujur, bertanggung jawab, dan disiplin, serta memiliki etika dan komitmen dalam menjalankan tugas.'],
          ['Inklusivitas dan Persaudaraan', 'Menciptakan lingkungan yang menghargai keberagaman, mendorong kerja sama, dan membangun relasi yang harmonis.'],
          ['Kepedulian Ekologis', 'Menanamkan tanggung jawab terhadap pelestarian lingkungan sebagai bagian dari pembentukan karakter dan iman.'],
          ['Pembelajaran Holistik', 'Pembelajaran bermakna yang berpusat pada peserta didik serta mengembangkan pengetahuan, keterampilan, dan sikap.'],
          ['Kepemimpinan dan Partisipasi', 'Menumbuhkan kepemimpinan yang melayani, partisipasi aktif, dan tanggung jawab sosial.'],
          ['Inovasi dan Adaptasi', 'Mengembangkan kreativitas, pemanfaatan teknologi secara bijak, dan kesiapan menghadapi tantangan global.'],
        ]),
      },
    ],
    meta: meta('Tentang Kami', 'Visi, misi, dan tujuan Yayasan Pendidikan Gembala Baik Pontianak, komunitas pendidikan Katolik–Kapusin.'),
  },
  { aliases: ['about-us'] },
)

const parent = pageIds.get('tentang-kami')!
const compact = (title: string, lead: string) => ({ type: 'compact' as const, background: 'brand' as const, title, lead })

// --- Sejarah -------------------------------------------------------------------

await upsertPage({
  title: 'Sejarah',
  slug: 'sejarah',
  parent,
  showSidebar: true,
  hero: compact('Sejarah', 'Dari Sekolah "San Muk" di tepian Sungai Kapuas hingga tujuh unit sekolah hari ini.'),
  layout: [
    {
      blockType: 'richText',
      section: section(),
      layout: 'single',
      content: doc(
        h('h2', 'Sekolah "San Muk"'),
        p(
          'Pada tahun 1932, Prefek Apostolik P. Pacificus Bos, OFM Cap. membeli bangunan milik saudagar Than Seng Hie di dekat Pelabuhan Seng Hie, Pontianak. Di sana P. Elias, OFM Cap. bersama para bruder Kapusin dan suster SFIC membuka sekolah misi bernama Sekolah Dasar "Tjahaja".',
        ),
        p(
          'Setelah gereja dan Paroki Gembala Baik berdiri di kompleks yang sama, sekolah ini lebih dikenal sebagai Sekolah "San Muk" atau "Siang Mok", sebutan dalam dialek Hakka dan Tio Ciu untuk 善牧, yang berarti Gembala Baik.',
        ),
        embed('bigQuote', { text: 'San Muk, Siang Mok, Gembala Baik.', description: 'Asal nama sekolah, dari kata Mandarin 善牧', align: 'center' }),
      ),
    },
    {
      blockType: 'gridList',
      section: section({ anchor: 'garis-waktu' }),
      heading: 'Garis Waktu',
      columns: '2',
      items: items([
        ['1932', 'Sekolah misi dibuka di dekat Pelabuhan Seng Hie dan dikenal sebagai Sekolah "San Muk".'],
        ['1942–1945', 'Kegiatan belajar terhenti selama masa pendudukan Jepang.'],
        ['1966', 'Sekolah mulai memakai Bahasa Indonesia dan kurikulum nasional.'],
        ['1971', 'Kurikulum nasional diterapkan penuh; TK Gembala Baik mulai diselenggarakan secara formal.'],
        ['1973', 'Yayasan Pendidikan Gembala Baik memulai karyanya pada 17 Agustus 1973.'],
        ['1975', 'Akta Pendirian yayasan ditandatangani; kelas siang dibuka dan menjadi cikal bakal SD Gembala Baik II.'],
        ['1983', 'SMP Gembala Baik berdiri di Jl. Jenderal Ahmad Yani.'],
        ['1986', 'SMA Gembala Baik berdiri.'],
        ['2007', 'SD Plus Gembala Baik dirintis sebagai sekolah dasar bilingual.'],
        ['2008', 'Yayasan diperbarui menjadi Yayasan Pendidikan Gembala Baik Pontianak; SMP membuka kelas bilingual.'],
        ['2011', 'SMA membuka kelas Plus.'],
        ['2014', 'TK dibuka di kompleks Jl. Jenderal Ahmad Yani; SD Gembala Baik II menempati gedung barunya.'],
      ]),
    },
    {
      blockType: 'richText',
      section: section(),
      layout: 'single',
      content: doc(
        p('Sejak menjadi sekolah misi yang terbuka, Gembala Baik menerima peserta didik dari beragam suku dan agama. Semangat itu terus dijaga hingga kini.'),
        p({
          text: 'Sejarah ini disusun dari dokumen dan penuturan lisan yang terbatas. Kami menerima masukan untuk melengkapinya melalui Kotak Saran.',
          italic: true,
        }),
        ...(pageIds.has('kotak-saran')
          ? [embed('button', { ...button({ label: 'Kirim Masukan', page: 'kotak-saran', appearance: 'secondary' }), align: 'left' })]
          : []),
      ),
    },
  ],
  meta: meta('Sejarah', 'Perjalanan Gembala Baik dari Sekolah "San Muk" tahun 1932 hingga tujuh unit sekolah hari ini.'),
})

// --- Motto dan Nilai -----------------------------------------------------------

const logoBlocks: Block[] = []
const logoImage = await media('logo.png')
if (logoImage) {
  logoBlocks.push({
    blockType: 'mediaText',
    section: section({ anchor: 'logo', title: 'Makna Logo' }),
    media: logoImage,
    mediaPosition: 'left',
    content: doc(
      ul([
        'Yesus bertongkat gembala: guru sejati yang menjadi pemimpin, teladan, dan penuntun.',
        'Yesus memikul domba: kasih, perlindungan, dan tanggung jawab guru terhadap murid-muridnya.',
        'Segel elips: yayasan sebagai komunitas tempat bertumbuh bersama yang dinamis dan kokoh.',
        'Salib Tau: spiritualitas Kapusin, yaitu sederhana, persaudaraan, damai, dan mengasihi ciptaan.',
        'Warna cokelat tua: warna tanah dan jubah Santo Fransiskus, lambang kesederhanaan dan kerendahan hati.',
      ]),
    ),
  })
}

await upsertPage({
  title: 'Motto dan Nilai',
  slug: 'motto-dan-nilai',
  parent,
  showSidebar: true,
  hero: compact('Motto dan Nilai', 'Nilai-nilai yang menuntun cara kami mendidik dan bertumbuh bersama.'),
  layout: [
    {
      blockType: 'quote',
      section: section({ anchor: 'motto' }),
      text: 'Sub Cura Pastoris Boni Crescimus',
      description: 'Di bawah tuntunan Gembala yang Baik, kita bertumbuh.',
      align: 'center',
    },
    {
      blockType: 'gridList',
      section: section(),
      heading: 'Makna Motto',
      columns: '2',
      items: items([
        ['Sub', 'Kesediaan untuk berada di bawah tuntunan. Pendidikan dijalani dalam kepercayaan kepada Kristus.'],
        ['Cura', 'Asuhan yang penuh perhatian, tanggung jawab, dan kasih. Pendidikan adalah pelayanan pembentukan pribadi secara utuh.'],
        ['Pastoris Boni', 'Kristus Sang Gembala yang Baik (Yoh 10:11), teladan kepemimpinan yang melayani, membimbing, dan melindungi.'],
        ['Crescimus', '"Kita bertumbuh": seluruh warga yayasan bertumbuh bersama sebagai satu kawanan.'],
      ]),
    },
    {
      blockType: 'quote',
      section: section({ anchor: 'slogan' }),
      text: 'Tumbuh Bersama – Bercahaya Selamanya',
      description: 'Slogan Yayasan Pendidikan Gembala Baik Pontianak',
      align: 'center',
    },
    {
      blockType: 'richText',
      section: section(),
      layout: 'single',
      content: doc(
        p(
          '"Tumbuh bersama" berarti tidak ada yang ditinggalkan: peserta didik, guru, dan seluruh warga yayasan bertumbuh sebagai satu komunitas. "Bercahaya selamanya" berarti nilai yang ditanamkan tidak berhenti saat lulus, tetapi terus memancar dalam keluarga, masyarakat, Gereja, dan dunia.',
        ),
      ),
    },
    {
      blockType: 'gridList',
      section: section({ anchor: 'nilai-utama' }),
      heading: 'Tujuh Nilai Utama',
      intro: 'Disusun dari ajaran Gereja Katolik, spiritualitas Kapusin, pembelajaran mendalam, dan Standar Nasional Pendidikan.',
      columns: '2',
      items: items([
        ['Kasih Setia yang Berbelarasa', 'Iman yang hidup melalui tindakan kasih yang inklusif, meneladani Kristus Sang Gembala Baik yang melayani tanpa diskriminasi.'],
        ['Integritas Kapusin', 'Hidup jujur, sederhana, dan bertanggung jawab, seturut teladan Santo Fransiskus dari Assisi.'],
        ['Persaudaraan Inklusif', 'Komunitas yang menerima, menghargai, dan merangkul keberagaman sebagai saudara.'],
        ['Tanggung Jawab Ekologis', 'Menjaga kelestarian lingkungan sebagai bagian dari iman dan tanggung jawab bersama.'],
        ['Kepemimpinan Melayani', 'Kepemimpinan yang memberdayakan dan memberi teladan, bukan menguasai.'],
        ['Pembelajaran Mendalam Holistik', 'Belajar yang bermakna dan kontekstual, mengembangkan pribadi seutuhnya: tahu, menghayati, melakukan, dan menjadi.'],
        ['Inovasi Adaptif', 'Berinovasi dan beradaptasi terhadap perubahan zaman dengan tetap berpegang pada nilai Katolik–Kapusin.'],
      ]),
    },
    {
      blockType: 'gridList',
      section: section({ anchor: 'growth' }),
      heading: 'Enam Dimensi GROWTH',
      columns: '3',
      items: items([
        ['Guided: Dituntun', 'Guru menjadi gembala yang menuntun dengan teladan dan kepedulian.'],
        ['Rooted: Berakar', 'Fondasi iman dan integritas yang kokoh di tengah perubahan zaman.'],
        ['Open: Terbuka', 'Terbuka terhadap kebenaran, ilmu pengetahuan, dan keberagaman.'],
        ['Whole: Utuh', 'Pendidikan menyentuh aspek intelektual, emosional, sosial, dan spiritual.'],
        ['Transformative: Berubah', 'Pembelajaran yang mendorong perubahan nyata, dari diri sendiri bagi masyarakat.'],
        ['Humane: Manusiawi', 'Seluruh proses pendidikan berakar pada kasih dan martabat manusia.'],
      ]),
    },
    ...logoBlocks,
  ],
  meta: meta('Motto dan Nilai', 'Sub Cura Pastoris Boni Crescimus: motto, slogan, tujuh nilai utama, dan makna logo YPGB Pontianak.'),
})

// --- Unit Sekolah --------------------------------------------------------------

const unitLevel = (level: 'TK' | 'SD' | 'SMP' | 'SMA', title: string): Block => ({
  blockType: 'unitList',
  section: section({ anchor: level.toLowerCase(), title }),
  mode: 'all',
  columns: '3',
  level: [level],
})

await upsertPage({
  title: 'Unit Sekolah',
  slug: 'unit',
  parent,
  showSidebar: true,
  hero: compact('Unit Sekolah', 'Tujuh unit sekolah, satu visi pendidikan.'),
  layout: [
    {
      blockType: 'richText',
      section: section(),
      layout: 'single',
      content: doc(
        p(
          'Yayasan Pendidikan Gembala Baik menaungi tujuh unit sekolah, dari Taman Kanak-Kanak hingga Sekolah Menengah Atas. Enam unit berada di kompleks Persekolahan Gembala Baik, Jl. Jenderal Ahmad Yani, dan SD Gembala Baik I berada di Jl. Pangsuma No. 2. Setiap unit memiliki kekhasannya, namun berjalan dalam visi dan nilai yang sama.',
        ),
      ),
    },
    unitLevel('TK', 'Taman Kanak-Kanak'),
    unitLevel('SD', 'Sekolah Dasar'),
    unitLevel('SMP', 'Sekolah Menengah Pertama'),
    unitLevel('SMA', 'Sekolah Menengah Atas'),
    {
      blockType: 'gridList',
      section: section({ anchor: 'program' }),
      heading: 'Program Bilingual dan Plus',
      columns: '2',
      items: items([
        ['SD Plus Gembala Baik', 'Sekolah dasar bilingual sejak 2007, memadukan Kurikulum Nasional dengan kurikulum Pearson Edexcel berstandar global.'],
        ['SMP Plus Gembala Baik', 'Kelas bilingual dengan tambahan English, Mathematics, dan Science dalam bahasa Inggris (UK Curriculum).'],
        ['SMA Gembala Baik Kelas Plus', 'Kurikulum yang sama dengan kelas reguler, ditambah penguasaan Karya Tulis Ilmiah dan Bahasa Inggris untuk persiapan perguruan tinggi.'],
        ['Pearson Edexcel Exam Center', 'Gembala Baik merupakan pusat ujian resmi Pearson Edexcel (ID 96051).'],
      ]),
    },
    {
      blockType: 'cta',
      section: { heading: { align: 'center' } },
      size: 'narrow',
      title: 'Ingin mengenal unit lebih dekat?',
      text: 'Sekretariat kami siap membantu pada Senin–Jumat, pukul 07.30–14.00 WIB.',
      links: [button({ label: 'Hubungi Sekretariat', url: whatsappUrl, newTab: true, icon: 'message-circle' })],
    },
  ],
  meta: meta('Unit Sekolah', 'TK, SD, SMP, dan SMA Gembala Baik di Pontianak, termasuk program bilingual dan kelas Plus.'),
})

// --- Pengurus ------------------------------------------------------------------

await upsertPage({
  title: 'Pengurus',
  slug: 'pengurus',
  parent,
  showSidebar: true,
  hero: compact('Pengurus Yayasan', 'Yayasan dikelola oleh Ordo Saudara Dina Kapusin Provinsi Pontianak.'),
  layout: [
    {
      blockType: 'pengurusList',
      section: section({ subtitle: 'Para imam dan bruder Kapusin yang mendampingi seluruh unit dalam semangat pelayanan.' }),
      organ: ['pengurus'],
      groupByOrgan: false,
    },
    {
      blockType: 'gridList',
      section: section({ anchor: 'kepala-unit' }),
      heading: 'Kepala Unit Sekolah',
      columns: '3',
      items: UNITS.filter((u) => u.principal).map((u) => ({ title: u.name, description: u.principal! })),
    },
  ],
  meta: meta('Pengurus Yayasan', 'Pengurus Yayasan Pendidikan Gembala Baik Pontianak dan kepala unit sekolah.'),
})

// --- Karier --------------------------------------------------------------------

await upsertPage({
  title: 'Karier',
  slug: 'karier',
  hero: {
    type: 'centered',
    background: 'brand',
    size: 'small',
    backgroundImage: await media('IMG_0250.JPG'),
    title: 'Berkarya Bersama Gembala Baik',
    lead: 'Kami mengundang pendidik dan tenaga kependidikan yang ingin melayani dengan kasih dan bertumbuh bersama.',
  },
  layout: [
    {
      blockType: 'gridList',
      section: section({ bg: 'page' }),
      heading: 'Mengapa Berkarya di Sini',
      columns: '3',
      items: items([
        ['Komunitas yang bersaudara', 'Berkarya bersama lebih dari 200 guru dalam tujuh unit sekolah yang saling mendukung.'],
        ['Karya yang bermakna', 'Mendampingi peserta didik bertumbuh dalam iman, ilmu, dan karakter.'],
        ['Tumbuh bersama', 'Kesempatan mengembangkan diri, termasuk menulis di Jurnal Yayasan.'],
      ]),
    },
    {
      blockType: 'newsList',
      section: section({ bg: 'white', anchor: 'lowongan', title: 'Lowongan Tersedia' }),
      mode: 'latest',
      layout: 'list',
      limit: 10,
      categories: [karierCategory],
    },
    {
      blockType: 'list',
      section: section({ bg: 'page', anchor: 'berkas' }),
      heading: 'Berkas Lamaran',
      style: 'bulleted',
      columns: '2',
      items: [
        'Surat lamaran kerja',
        'Ijazah',
        'Transkrip nilai',
        'Fotokopi Kartu Keluarga',
        'Fotokopi KTP',
        'Foto diri 4×6, 2 lembar',
        'Surat pengalaman kerja (jika ada)',
        'Fotokopi kartu NPWP (jika ada)',
      ].map((text) => ({ text })),
    },
    {
      blockType: 'richText',
      section: section({ bg: 'page', anchor: 'cara-melamar' }),
      layout: 'single',
      content: doc(
        h('h3', 'Cara Melamar'),
        p(
          `Kirimkan berkas lamaran dalam satu berkas PDF ke ${settings.email ?? 'email yayasan'} dengan subjek "Lamaran – [Posisi] – [Nama]", atau antarkan langsung ke Kantor Yayasan Pendidikan Gembala Baik pada Senin–Jumat, pukul 07.30–14.00 WIB.`,
        ),
        ...(settings.email
          ? [embed('button', { ...button({ label: 'Kirim Lamaran', url: `mailto:${settings.email}`, icon: 'mail' }), align: 'left' })]
          : []),
      ),
    },
  ],
  meta: meta('Karier', 'Lowongan dan cara melamar sebagai pendidik atau tenaga kependidikan di Yayasan Pendidikan Gembala Baik Pontianak.'),
})

// --- Penerimaan (always a draft until the PPDB details arrive) ----------------

const PERLU_DATA = doc(p({ text: '[perlu data]', italic: true }))

await upsertPage(
  {
    title: 'Penerimaan Peserta Didik Baru',
    slug: 'penerimaan',
    hero: {
      type: 'split',
      background: 'brand',
      title: 'Penerimaan Peserta Didik Baru',
      lead: 'Tahun Ajaran [perlu data]. Kami menyambut keluarga yang ingin bertumbuh bersama Gembala Baik.',
      media: await mediaList('IMG_0137.JPG'),
      mediaPosition: 'right',
      links: [
        button({ label: 'Hubungi Sekretariat', url: whatsappUrl, newTab: true, icon: 'message-circle' }),
        button({ label: 'Lihat Unit Sekolah', page: 'unit', appearance: 'secondary' }),
      ],
    },
    layout: [
      {
        blockType: 'gridList',
        section: section({ bg: 'white', anchor: 'alur' }),
        heading: 'Alur Pendaftaran',
        columns: '4',
        items: items([['[perlu data]', 'Langkah pendaftaran menyusul.']]),
      },
      {
        blockType: 'list',
        section: section({ anchor: 'jadwal' }),
        heading: 'Jadwal Penting',
        style: 'numbered',
        columns: '1',
        items: [{ text: '[perlu data]' }],
      },
      {
        blockType: 'tabs',
        section: section({ anchor: 'persyaratan', title: 'Persyaratan' }),
        tabs: ['TK', 'SD', 'SMP', 'SMA'].map((label) => ({ label, content: PERLU_DATA })),
      },
      {
        blockType: 'downloads',
        section: section({ bg: 'warm', anchor: 'unduhan', title: 'Brosur dan Formulir' }),
        categories: [ppdbCategory],
        limit: 10,
      },
      {
        blockType: 'richText',
        section: section({ anchor: 'tanya-jawab', title: 'Pertanyaan yang Sering Diajukan' }),
        layout: 'single',
        content: doc(
          ...[
            'Apakah sekolah menerima peserta didik dari latar belakang agama yang berbeda?',
            'Apa perbedaan kelas reguler, bilingual, dan Plus?',
            'Berapa biaya pendidikan dan bagaimana cara pembayarannya?',
            'Apakah peserta didik Gembala Baik mendapat prioritas melanjutkan ke jenjang berikutnya?',
          ].flatMap((question) => [h('h3', question), p({ text: '[perlu data]', italic: true })]),
        ),
      },
      {
        blockType: 'cta',
        section: { heading: { align: 'center' } },
        size: 'big',
        backgroundImage: groupPhoto,
        title: 'Ada pertanyaan tentang pendaftaran?',
        text: 'Sekretariat kami siap membantu pada Senin–Jumat, pukul 07.30–14.00 WIB.',
        links: [button({ label: 'Hubungi Melalui WhatsApp', url: whatsappUrl, newTab: true, icon: 'message-circle' })],
      },
    ],
    meta: meta(
      'Penerimaan Peserta Didik Baru',
      'Informasi pendaftaran TK, SD, SMP, dan SMA Gembala Baik Pontianak: alur, jadwal, persyaratan, dan kontak sekretariat.',
    ),
  },
  { publish: false },
)

// --- Beranda -------------------------------------------------------------------

/** Until /penerimaan is published, admission buttons send people to the unit page. */
const admission: LinkInput = published.has('penerimaan')
  ? { label: 'Penerimaan Siswa Baru', page: 'penerimaan' }
  : { label: 'Lihat Unit Sekolah', page: 'unit' }

const aboutPhoto = await media('IMG_0098.webp')
const homeBlocks: Block[] = [
  {
    blockType: 'stats',
    section: section({ bg: 'white', anchor: 'sekilas' }),
    items: [
      { icon: 'calendar-days', value: '1932', label: 'Tahun Berdiri', description: 'Berakar dari Sekolah "San Muk" di tepian Sungai Kapuas.' },
      { icon: 'school', value: '7', label: 'Unit Sekolah', description: 'Dari Taman Kanak-Kanak hingga Sekolah Menengah Atas.' },
      { icon: 'graduation-cap', value: '2.861', label: 'Peserta Didik', description: 'Bertumbuh bersama dalam satu keluarga besar.' },
      { icon: 'users', value: '230', label: 'Guru', description: 'Mendampingi setiap peserta didik dengan kasih dan keteladanan.' },
    ],
  },
  {
    blockType: 'quote',
    section: section({ anchor: 'visi' }),
    text: VISI,
    description: 'Visi Yayasan Pendidikan Gembala Baik Pontianak',
    align: 'center',
  },
]

if (aboutPhoto) {
  homeBlocks.push({
    blockType: 'mediaText',
    section: section({ anchor: 'tentang-kami', title: 'Tentang Kami', subtitle: 'Karya pendidikan Katolik–Kapusin di Pontianak sejak 1932.' }),
    media: aboutPhoto,
    mediaPosition: 'left',
    content: doc(...ABOUT_PARAGRAPHS),
    links: [
      button({ label: 'Sejarah Kami', page: 'sejarah', appearance: 'brandDeep', icon: 'arrow-right' }),
      button({ label: 'Motto dan Nilai', page: 'motto-dan-nilai', appearance: 'secondary' }),
    ],
  })
}

const card = (icon: IconName, title: string, text: string, to?: LinkInput) => ({
  icon,
  title,
  text,
  hasLink: Boolean(to),
  ...(to && { link: link(to) }),
})

homeBlocks.push(
  {
    blockType: 'cardGrid',
    section: section({
      bg: 'white',
      anchor: 'mengapa',
      title: 'Mengapa Gembala Baik',
      subtitle: 'Enam alasan keluarga mempercayakan pendidikan putra-putrinya kepada kami.',
    }),
    columns: '3',
    style: 'standard',
    source: 'manual',
    cards: [
      card('clock', 'Lebih dari 90 tahun berkarya', 'Sejak Sekolah "San Muk" tahun 1932, Gembala Baik terus melayani pendidikan di Pontianak dari generasi ke generasi.', { label: 'Sejarah', page: 'sejarah' }),
      card('school', 'Satu kompleks, TK hingga SMA', 'Anak dapat bertumbuh berkesinambungan dari jenjang ke jenjang dalam lingkungan dan nilai yang sama.', { label: 'Unit Sekolah', page: 'unit' }),
      card('award', 'Terakreditasi A', 'Unit-unit kami terakreditasi A.'),
      card('book-open-text', 'Program bilingual', 'SD Plus menerapkan kurikulum Pearson Edexcel, SMP Plus membuka kelas bilingual, dan Gembala Baik merupakan Pearson Edexcel Exam Center.', { label: 'Program', page: 'unit', anchor: 'program' }),
      card('heart-handshake', 'Berakar pada nilai Katolik–Kapusin', 'Tujuh nilai utama membentuk pribadi yang berbelarasa, jujur, sederhana, dan melayani.', { label: 'Motto dan Nilai', page: 'motto-dan-nilai' }),
      card('users', 'Terbuka bagi semua', 'Sejak lama peserta didik kami berasal dari beragam suku dan agama, tumbuh bersama dalam persaudaraan.'),
    ],
  },
  {
    blockType: 'cardGrid',
    section: section({
      bg: 'brand',
      anchor: 'jenjang',
      title: 'Jenjang Pendidikan',
      subtitle: 'Tujuh unit sekolah dalam satu naungan, mendampingi anak sejak usia dini hingga siap melangkah ke perguruan tinggi dan dunia kerja.',
      align: 'center',
    }),
    columns: '4',
    style: 'photo',
    source: 'manual',
    cards: [
      { ...card('baby', 'Taman Kanak-Kanak', 'Anak belajar melalui bermain, mengenal kasih Tuhan, sesama, dan lingkungan, serta membangun kebiasaan baik sejak dini.', { label: 'Lihat Unit', page: 'unit', anchor: 'tk' }), icon: null, image: await media('TK-1.JPG') },
      { ...card('school', 'Sekolah Dasar', 'Fondasi literasi, numerasi, dan karakter, dengan pilihan kelas reguler atau bilingual di SD Gembala Baik I, SD Gembala Baik II, dan SD Plus Gembala Baik.', { label: 'Lihat Unit', page: 'unit', anchor: 'sd' }), icon: null, image: await media('SD Plus.JPG') },
      { ...card('school', 'Sekolah Menengah Pertama', 'Masa peralihan menuju kemandirian. Tersedia kelas reguler di SMP Gembala Baik dan kelas bilingual di SMP Plus Gembala Baik.', { label: 'Lihat Unit', page: 'unit', anchor: 'smp' }), icon: null, image: await media('SMP.JPG') },
      { ...card('school', 'Sekolah Menengah Atas', 'Mengasah nalar kritis dan menentukan arah masa depan, dengan kelas reguler dan kelas Plus untuk persiapan perguruan tinggi.', { label: 'Lihat Unit', page: 'unit', anchor: 'sma' }), icon: null, image: await media('SMA.JPG') },
    ],
  },
  {
    blockType: 'newsList',
    section: section({ bg: 'warm', anchor: 'berita', title: 'Kabar dari Sekolah', action: { label: 'Lihat Semua', page: 'berita' } }),
    mode: 'latest',
    layout: 'grid',
    limit: 3,
  },
)

await upsertPage({
  title: 'Home',
  slug: 'home',
  hero: {
    type: 'centeredCarousel',
    background: 'warm',
    title: 'Tumbuh Bersama – Bercahaya Selamanya',
    lead: 'Sub Cura Pastoris Boni Crescimus. Di bawah tuntunan Gembala yang Baik, kita bertumbuh.',
    media: await mediaList('image.jpg', 'IMG_0250.JPG', 'IMG_0137.JPG'),
    links: [
      button({ label: 'Kenali Kami', page: 'tentang-kami', appearance: 'secondary' }),
      button({ ...admission, appearance: 'primary' }),
    ],
  },
  layout: homeBlocks,
  meta: meta(
    'Yayasan Pendidikan Gembala Baik Pontianak',
    'Pendidikan Katolik–Kapusin sejak 1932. Tujuh unit sekolah dari TK hingga SMA di Pontianak, terakreditasi A, dengan program bilingual.',
  ),
})

// --- Halaman lain: hero lead + SEO only ------------------------------------------

await touchPage('galeri', 'Dokumentasi kegiatan keluarga besar Gembala Baik.', 'Dokumentasi kegiatan peserta didik, guru, dan keluarga besar Yayasan Pendidikan Gembala Baik Pontianak.')
await touchPage('jurnal', null, 'Terbitan jurnal Yayasan Pendidikan Gembala Baik Pontianak.')
await touchPage('doa', null, 'Kumpulan doa yang digunakan di lingkungan Yayasan Pendidikan Gembala Baik Pontianak.')
await touchPage('dokumen', null, 'Unduh pengumuman, surat, kalender pendidikan, dan logo resmi Yayasan Pendidikan Gembala Baik Pontianak.')
await touchPage('kotak-saran', null, 'Sampaikan saran untuk Yayasan Pendidikan Gembala Baik Pontianak. Nama dan kontak boleh dikosongkan.')

// ---------------------------------------------------------------------------
// Globals (--globals): Site Settings + Navigation
// ---------------------------------------------------------------------------

if (GLOBALS || ONLY_GLOBALS) await writeGlobals()

log('Done. Clear the data cache (.next/dev/cache/fetch-cache in dev), then review drafts in the admin.')
process.exit(0)
