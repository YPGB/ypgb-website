import * as React from 'react';

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  hint?: string;
  /** Replaces hint and turns the border red. */
  error?: string;
  required?: boolean;
  /** Lucide icon name rendered inside the left edge. */
  icon?: string;
  multiline?: boolean;
  size?: 'sm' | 'md';
}
export declare function Input(props: InputProps): JSX.Element;
