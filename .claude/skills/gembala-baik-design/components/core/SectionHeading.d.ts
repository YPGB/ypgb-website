import * as React from 'react';

/**
 * Section title block: terracotta overline rule, slab title, optional lead paragraph.
 */
export interface SectionHeadingProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Short uppercase kicker, e.g. "Unit Sekolah". */
  overline?: string;
  title: React.ReactNode;
  subtitle?: React.ReactNode;
  level?: 'h1' | 'h2' | 'h3';
  align?: 'left' | 'center';
  /** Right-aligned node, typically a "See All ->" link button. */
  action?: React.ReactNode;
}
export declare function SectionHeading(props: SectionHeadingProps): JSX.Element;
