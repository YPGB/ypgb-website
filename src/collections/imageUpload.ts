import type { UploadConfig } from 'payload'

/**
 * Shared by the image collections. Originals are capped and converted so a phone photo
 * costs about 0.5 MB of storage in total instead of 5 MB or more.
 */
export const imageUpload: UploadConfig = {
  focalPoint: true,
  mimeTypes: ['image/*'],
  resizeOptions: { width: 2000, height: 2000, fit: 'inside', withoutEnlargement: true },
  formatOptions: { format: 'webp', options: { quality: 82 } },
  imageSizes: [400, 768, 1600].map((width, i) => ({
    name: ['thumbnail', 'card', 'large'][i],
    width,
    withoutEnlargement: true,
    formatOptions: { format: 'webp' as const, options: { quality: 82 } },
  })),
}
