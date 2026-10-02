import * as React from 'react';

/**
 * One school unit under the foundation (TK / SD / SMP / SMA, regular or Kelas Plus).
 */
export interface UnitCardProps {
  /** Short unit code shown in the dark umber band, e.g. "SMA GB". */
  abbr: string;
  /** Full unit name, e.g. "Sekolah Menengah Atas Gembala Baik". */
  name: string;
  /** Jenjang label: TK, SD, SMP, SMA, or "SMA Kelas Plus". */
  level?: string;
  address?: string;
  coordinator?: string;
  /** e.g. "Terakreditasi A". */
  accreditation?: string;
  /** Unit's own site, e.g. https://www.smagb.sch.id. */
  website?: string;
  onOpen?: () => void;
}
export declare function UnitCard(props: UnitCardProps): JSX.Element;
