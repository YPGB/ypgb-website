import * as React from 'react';

export interface CheckboxProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'type'> {
  label: React.ReactNode;
  /** Secondary line under the label. */
  description?: string;
  checked?: boolean;
}
export declare function Checkbox(props: CheckboxProps): JSX.Element;
