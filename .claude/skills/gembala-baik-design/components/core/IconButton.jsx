import React from 'react';
import { Icon } from './Icon.jsx';
const cx=(...a)=>a.filter(Boolean).join(' ');

export function IconButton({ icon, label, variant = 'quiet', size = 'md', className = '', ...rest }) {
  return (
    <button type="button" aria-label={label} title={label}
      className={cx('gb-iconbtn', `gb-iconbtn--${variant}`, `gb-iconbtn--${size}`, className)} {...rest}>
      <Icon name={icon} size={size === 'sm' ? 16 : size === 'lg' ? 22 : 18} />
    </button>
  );
}
