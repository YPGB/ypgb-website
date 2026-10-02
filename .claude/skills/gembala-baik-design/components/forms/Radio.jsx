import React from 'react';
const cx=(...a)=>a.filter(Boolean).join(' ');

export function Radio({ label, description, checked = false, disabled = false, name, value, onChange, className = '', ...rest }) {
  return (
    <label className={cx('gb-choice', disabled && 'gb-choice--disabled', className)} style={{ position: 'relative' }}>
      <input type="radio" name={name} value={value} checked={checked} disabled={disabled} onChange={onChange} {...rest} />
      <span className={cx('gb-choice__box', 'gb-choice__box--radio', checked && 'gb-choice__box--on')}>
        {checked && <span className="gb-choice__dot" />}
      </span>
      <span className="gb-choice__text">
        <span>{label}</span>
        {description && <span className="gb-choice__desc">{description}</span>}
      </span>
    </label>
  );
}

export function RadioGroup({ label, children, inline = false }) {
  return (
    <div className="gb-field" role="radiogroup" aria-label={typeof label === 'string' ? label : undefined}>
      {label && <span className="gb-field__label">{label}</span>}
      <div style={{ display: 'flex', flexDirection: inline ? 'row' : 'column', gap: inline ? 'var(--space-5)' : 'var(--space-3)', marginTop: 2 }}>
        {children}
      </div>
    </div>
  );
}
