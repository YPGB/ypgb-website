import React from 'react';
const cx=(...a)=>a.filter(Boolean).join(' ');

export function Select({ label, hint, error, required = false, options = [], placeholder, id, className = '', children, ...rest }) {
  const fid = id || `gb-${Math.random().toString(36).slice(2, 8)}`;
  return (
    <div className="gb-field">
      {label && <label className="gb-field__label" htmlFor={fid}>{label}{required && <span className="gb-field__req">*</span>}</label>}
      <select id={fid} className={cx('gb-control', 'gb-select', error && 'gb-control--invalid', className)} {...rest}>
        {placeholder && <option value="">{placeholder}</option>}
        {children || options.map((o) => {
          const v = typeof o === 'string' ? o : o.value;
          const l = typeof o === 'string' ? o : o.label;
          return <option key={v} value={v}>{l}</option>;
        })}
      </select>
      {error ? <span className="gb-field__err">{error}</span> : hint ? <span className="gb-field__hint">{hint}</span> : null}
    </div>
  );
}
