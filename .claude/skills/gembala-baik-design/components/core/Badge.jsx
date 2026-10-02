import React from 'react';
const cx=(...a)=>a.filter(Boolean).join(' ');

export function Badge({ tone = 'neutral', icon, children, className = '', ...rest }) {
  return (
    <span className={cx('gb-badge', `gb-badge--${tone}`, className)} {...rest}>
      {icon}{children}
    </span>
  );
}
