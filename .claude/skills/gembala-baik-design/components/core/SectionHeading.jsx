import React from 'react';
const cx=(...a)=>a.filter(Boolean).join(' ');

export function SectionHeading({ overline, title, subtitle, level = 'h2', align = 'left', action, className = '', ...rest }) {
  const Tag = level;
  const head = (
    <div className={cx('gb-sec', align === 'center' && 'gb-sec--center', className)} {...rest}>
      {overline && <span className="gb-sec__over">{overline}</span>}
      <Tag className={cx('gb-sec__title', `gb-sec__title--${level}`)}>{title}</Tag>
      {subtitle && <p className="gb-sec__sub">{subtitle}</p>}
    </div>
  );
  if (!action) return head;
  return (
    <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', gap: 'var(--space-5)', flexWrap: 'wrap' }}>
      {head}{action}
    </div>
  );
}
