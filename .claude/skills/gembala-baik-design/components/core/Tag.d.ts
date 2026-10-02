import * as React from 'react';

export interface TagProps extends React.HTMLAttributes<HTMLSpanElement> {
  selected?: boolean;
  /** Renders the remove affordance when provided. */
  onRemove?: (e: React.MouseEvent) => void;
  children?: React.ReactNode;
}
export declare function Tag(props: TagProps): JSX.Element;
