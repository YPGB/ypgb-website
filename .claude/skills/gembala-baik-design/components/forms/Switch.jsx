import React from 'react';
const cx=(...a)=>a.filter(Boolean).join(' ');

export function Switch({ label, checked = false, disabled = false, onChange, className = '', ...rest }) {
  return (
    <label className={cx('gb-switch', disabled && 'gb-switch--disabled', className)} style={{ position: 'relative' }}>
      <span className={cx('gb-switch__track', checked && 'gb-switch__track--on')}>
        <span className="gb-switch__knob" />
      </span>
      <input type="checkbox" role="switch" checked={checked} disabled={disabled} onChange={onChange} {...rest} />
      {label && <span>{label}</span>}
    </label>
  );
}
