import type { Page } from '@/payload-types'

/**
 * For blocks rendered inside `data-contained` (next to a sidebar, or in a Content Group row):
 * they sit on their parent's background, so their own bands and photos are dropped.
 */
export const containBlocks = (blocks: Page['layout']): Page['layout'] =>
  blocks?.map((block) => ({
    ...block,
    section: { ...block.section, background: 'page' },
    ...(block.blockType === 'cta' && { backgroundImage: null }),
  })) as Page['layout']
