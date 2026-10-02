import * as React from 'react';

/**
 * Berita (news) teaser used on the home page and the news archive.
 */
export interface NewsCardProps {
  title: React.ReactNode;
  /** Long-form Indonesian date, e.g. "25 November 2025". */
  date?: string;
  /** Terracotta badge over the image, e.g. "Kegiatan". */
  category?: string;
  excerpt?: string;
  /** Image URL. When absent a sand placeholder with imageNote is shown. */
  image?: string;
  /** Placeholder caption naming the photo that belongs here. */
  imageNote?: string;
  layout?: 'stack' | 'row';
  href?: string;
  onOpen?: () => void;
}
export declare function NewsCard(props: NewsCardProps): JSX.Element;
