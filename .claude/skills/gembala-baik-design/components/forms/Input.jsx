import React from 'react';
import { Icon } from '../core/Icon.jsx';
const cx=(...a)=>a.filter(Boolean).join(' ');

export function Input({
  label, hint, error, required = false, icon, multiline = false, size = 'md',
  id, className = '', ...rest
}) {
  const fid = id || `gb-${Math.random().toString(36).slice(2, 8)}`;
  const Tag = multiline ? 'textarea' : 'input';
  const control = (
    <Tag id={fid} aria-invalid={error ? 'true' : undefined}
      className={cx('gb-control', 'gb-input', multiline && 'gb-input--textarea', size === 'sm' && 'gb-input--sm',
        icon && 'gb-input--withicon', error && 'gb-control--invalid', className)} {...rest} />
  );
  return (
    <div className="gb-field">
      {label && <label className="gb-field__label" htmlFor={fid}>{label}{required && <span className="gb-field__req">*</span>}</label>}
      {icon ? (
        <span className="gb-input__wrap">
          <span className="gb-input__icon"><Icon name={icon} size={16} /></span>
          {control}
        </span>
      ) : control}
      {error ? <span className="gb-field__err">{error}</span> : hint ? <span className="gb-field__hint">{hint}</span> : null}
    </div>
  );
}
