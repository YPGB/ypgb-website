import React from 'react';
import { Icon } from '../core/Icon.jsx';
const cx=(...a)=>a.filter(Boolean).join(' ');

export function Checkbox({ label, description, checked = false, disabled = false, onChange, className = '', ...rest }) {
  return (
    <label className={cx('gb-choice', disabled && 'gb-choice--disabled', className)} style={{ position: 'relative' }}>
      <input type="checkbox" checked={checked} disabled={disabled} onChange={onChange} {...rest} />
      <span className={cx('gb-choice__box', checked && 'gb-choice__box--on')}>
        {checked && <Icon name="check" size={13} />}
      </span>
      <span className="gb-choice__text">
        <span>{label}</span>
        {description && <span className="gb-choice__desc">{description}</span>}
      </span>
    </label>
  );
}
