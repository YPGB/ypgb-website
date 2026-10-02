import * as React from 'react';

export interface IconButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  /** Lucide icon name. */
  icon: string;
  /** Required — becomes aria-label and the tooltip title. */
  label: string;
  variant?: 'quiet' | 'outline' | 'solid' | 'onbrand';
  size?: 'sm' | 'md' | 'lg';
}
export declare function IconButton(props: IconButtonProps): JSX.Element;
