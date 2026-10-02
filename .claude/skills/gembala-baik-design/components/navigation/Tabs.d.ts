import * as React from 'react';

export interface TabItem { id: string; label: string }
export interface TabsProps extends React.HTMLAttributes<HTMLDivElement> {
  items?: Array<string | TabItem>;
  value?: string;
  onChange?: (id: string) => void;
  /** underline = terracotta rule under the active tab. pill = sand track, white active pill. */
  variant?: 'underline' | 'pill';
}
export declare function Tabs(props: TabsProps): JSX.Element;
