/** Small builders for Lexical rich text JSON, so seed content reads like the page it makes. */
import { randomBytes } from 'node:crypto'

type Node = { type: string; version: number; [k: string]: unknown }

const base = { version: 1, format: '' as const, indent: 0, direction: 'ltr' as const }

/** Plain text, or `{ text, italic: true }` / `{ text, bold: true }`. */
export type Segment = string | { text: string; italic?: boolean; bold?: boolean }

const text = (segment: Segment): Node => {
  const s = typeof segment === 'string' ? { text: segment } : segment
  const format = (s.bold ? 1 : 0) | (s.italic ? 2 : 0)
  return { type: 'text', version: 1, text: s.text, format, style: '', mode: 'normal', detail: 0 }
}

const inline = (content: Segment | Segment[]) => (Array.isArray(content) ? content : [content]).map(text)

export const p = (content: Segment | Segment[]): Node => ({
  ...base,
  type: 'paragraph',
  textFormat: 0,
  children: inline(content),
})

export const h = (tag: 'h2' | 'h3' | 'h4', content: string): Node => ({ ...base, type: 'heading', tag, children: inline(content) })

const list = (listType: 'number' | 'bullet', items: (Segment | Segment[])[]): Node => ({
  ...base,
  type: 'list',
  listType,
  tag: listType === 'number' ? 'ol' : 'ul',
  start: 1,
  children: items.map((item, i) => ({ ...base, type: 'listitem', value: i + 1, children: inline(item) })),
})

export const ol = (items: (Segment | Segment[])[]) => list('number', items)
export const ul = (items: (Segment | Segment[])[]) => list('bullet', items)

export const quote = (content: Segment | Segment[]): Node => ({ ...base, type: 'quote', children: inline(content) })

/** A block embedded in the editor (Big Quote, Image Carousel, Button, Inline CTA). */
export const embed = (blockType: 'bigQuote' | 'imageCarousel' | 'button' | 'inlineCta', fields: Record<string, unknown>): Node => ({
  type: 'block',
  version: 2,
  format: '',
  fields: { id: randomBytes(12).toString('hex'), blockName: '', blockType, ...fields },
})

/** The editor state a richText field stores. */
export const doc = (...children: Node[]) => ({
  root: { ...base, type: 'root', children },
})
