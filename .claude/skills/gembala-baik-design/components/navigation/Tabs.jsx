import React from 'react';
const cx=(...a)=>a.filter(Boolean).join(' ');

export function Tabs({ items = [], value, onChange, variant = 'underline', className = '', ...rest }) {
  return (
    <div role="tablist" className={cx('gb-tabs', variant === 'pill' && 'gb-tabs--pill', className)} {...rest}>
      {items.map((it) => {
        const id = typeof it === 'string' ? it : it.id;
        const label = typeof it === 'string' ? it : it.label;
        return (
          <button key={id} role="tab" type="button" aria-selected={id === value}
            className={cx('gb-tab', id === value && 'gb-tab--active')}
            onClick={() => onChange && onChange(id)}>{label}</button>
        );
      })}
    </div>
  );
}
