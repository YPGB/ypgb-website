import * as React from 'react';

export interface NavItem { id: string; label: string; href?: string; external?: boolean }
export interface NavBarProps extends React.HTMLAttributes<HTMLElement> {
  /** brand = solid brand band, dark umber (default, used on the foundation site). light = white with hairline. */
  tone?: 'brand' | 'light';
  /** Seal logo URL. Rendered in a white circular chip (the mark's line art is dark ink, drawn for light grounds). Omit for a text-only wordmark. */
  logo?: string;
  /** Wordmark text (Geist 900, uppercase) — the lower, larger line of the lockup. */
  mark?: string;
  /** Upper line of the lockup (Figtree, uppercase, tracked). Default "Yayasan Pendidikan". */
  kicker?: string;
  /** Small uppercase line beside the mark. */
  kicker?: string;
  items?: NavItem[];
  activeId?: string;
  onNavigate?: (id: string) => void;
  /** Extra nodes after the links, e.g. an accent Button. */
  actions?: React.ReactNode;
}
export declare function NavBar(props: NavBarProps): JSX.Element;
