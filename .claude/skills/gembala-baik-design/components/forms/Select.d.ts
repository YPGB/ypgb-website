import * as React from 'react';

export interface SelectOption { value: string; label: string }
export interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  hint?: string;
  error?: string;
  required?: boolean;
  /** Strings or {value,label}. Ignored if children are passed. */
  options?: Array<string | SelectOption>;
  placeholder?: string;
}
export declare function Select(props: SelectProps): JSX.Element;
