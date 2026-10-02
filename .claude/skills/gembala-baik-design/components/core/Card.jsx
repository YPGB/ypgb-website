import React from 'react';
const cx=(...a)=>a.filter(Boolean).join(' ');

export function Card({ tone = 'default', pad = 'md', interactive = false, rule = false, as, href, children, className = '', ...rest }) {
  const Tag = as || (href ? 'a' : 'div');
  return (
    <Tag href={href}
      className={cx('gb-card', tone !== 'default' && `gb-card--${tone}`, `gb-card--pad-${pad}`,
        (interactive || href) && 'gb-card--interactive', rule && 'gb-card--rule', className)} {...rest}>
      {children}
    </Tag>
  );
}
