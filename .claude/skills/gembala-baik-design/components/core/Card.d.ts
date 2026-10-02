import * as React from 'react';

export interface CardProps extends React.HTMLAttributes<HTMLElement> {
  /** default = white on the sand page. warm = sand block, no shadow. brand = blue, inverse text. flat = white, no shadow. */
  tone?: 'default' | 'flat' | 'warm' | 'brand';
  pad?: 'none' | 'sm' | 'md' | 'lg';
  /** Adds hover lift + pointer. Implied by href. */
  interactive?: boolean;
  /** Terracotta rule down the left inner edge — use sparingly, for pull-quotes and prayers. */
  rule?: boolean;
  href?: string;
  as?: keyof JSX.IntrinsicElements;
  children?: React.ReactNode;
}
export declare function Card(props: CardProps): JSX.Element;
