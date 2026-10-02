import * as React from 'react';

/**
 * Primary action control.
 */
export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  /** primary = wheat gold, one per view. accent = wax seal, for admissions/apply CTAs, used sparingly. onbrand = on a dark umber band. */
  variant?: 'primary' | 'accent' | 'secondary' | 'ghost' | 'link' | 'onbrand';
  size?: 'sm' | 'md' | 'lg';
  block?: boolean;
  /** Renders an <a> when set. */
  href?: string;
  as?: keyof JSX.IntrinsicElements;
  /** Lucide icon name placed before the label. */
  iconLeft?: string;
  /** Lucide icon name placed after the label — usually "arrow-right". */
  iconRight?: string;
  children?: React.ReactNode;
}
export declare function Button(props: ButtonProps): JSX.Element;
