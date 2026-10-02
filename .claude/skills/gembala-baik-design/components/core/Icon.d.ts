import * as React from 'react';

export interface IconProps extends React.HTMLAttributes<HTMLSpanElement> {
  /** Lucide icon name in kebab-case, e.g. "graduation-cap", "map-pin". */
  name: string;
  /** Square edge in px. 16 inline with caption text, 20 default, 24 in nav. */
  size?: number;
  /** Accessible label. Omit for decorative icons (they become aria-hidden). */
  title?: string;
}
export declare const LUCIDE_VERSION: string;
export declare function Icon(props: IconProps): JSX.Element;
