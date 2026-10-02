import * as React from 'react';

/**
 * Brand lockup — seal logo + kicker + wordmark. Use wherever the brand mark appears (header, footer, documents).
 */
export interface LockupProps extends React.HTMLAttributes<HTMLSpanElement> {
  /** Seal logo URL (assets/logo.png, path relative to the page). Omit for text-only. */
  logo?: string;
  /** Upper line, Figtree uppercase tracked. Default "Yayasan Pendidikan". */
  kicker?: string;
  /** Wordmark, Geist 900 uppercase. Default "Gembala Baik". */
  name?: string;
  /** Optional place line under the wordmark, e.g. "Pontianak". */
  place?: string;
  /** sm = header (seal 40), md = footer (seal 52), lg = standalone/documents (seal 136). */
  size?: 'sm' | 'md' | 'lg';
  /** White circular backing behind the seal — required on dark grounds. */
  chip?: boolean;
  /** inherit = takes text color from parent (use on dark bands). onlight = heading ink + muted kicker. */
  tone?: 'inherit' | 'onlight';
}
export declare function Lockup(props: LockupProps): JSX.Element;
