import * as React from 'react';

export interface RadioProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'type'> {
  label: React.ReactNode;
  description?: string;
  checked?: boolean;
}
export interface RadioGroupProps {
  label?: React.ReactNode;
  inline?: boolean;
  children?: React.ReactNode;
}
export declare function Radio(props: RadioProps): JSX.Element;
export declare function RadioGroup(props: RadioGroupProps): JSX.Element;
