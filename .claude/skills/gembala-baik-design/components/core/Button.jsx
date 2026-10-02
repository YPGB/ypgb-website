import React from 'react';
import { Icon } from './Icon.jsx';
const cx=(...a)=>a.filter(Boolean).join(' ');

export function Button({
  variant = 'primary', size = 'md', block = false, as, href,
  iconLeft, iconRight, children, className = '', ...rest
}) {
  const Tag = as || (href ? 'a' : 'button');
  const glyph = size === 'lg' ? 20 : 16;
  return (
    <Tag
      href={href}
      className={cx('gb-btn', `gb-btn--${variant}`, variant !== 'link' && `gb-btn--${size}`, block && 'gb-btn--block', className)}
      {...rest}
    >
      {iconLeft && <Icon name={iconLeft} size={glyph} />}
      {children}
      {iconRight && <Icon name={iconRight} size={glyph} />}
    </Tag>
  );
}
