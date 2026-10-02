import * as React from 'react';

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  tone?: 'neutral' | 'brand' | 'accent' | 'success' | 'warning' | 'danger' | 'info';
  /** Optional leading node, usually an <Icon size={12} />. */
  icon?: React.ReactNode;
  children?: React.ReactNode;
}
export declare function Badge(props: BadgeProps): JSX.Element;
