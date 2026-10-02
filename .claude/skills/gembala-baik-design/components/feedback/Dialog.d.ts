import * as React from 'react';

export interface DialogProps {
  open?: boolean;
  title?: React.ReactNode;
  /** Optional leading node in the header, usually an <Icon size={22} />. */
  icon?: React.ReactNode;
  onClose?: () => void;
  /** Right-aligned action row on the sand footer. */
  footer?: React.ReactNode;
  /** Max width in px. 520 default; 640 for forms. */
  width?: number;
  children?: React.ReactNode;
}
export declare function Dialog(props: DialogProps): JSX.Element | null;
