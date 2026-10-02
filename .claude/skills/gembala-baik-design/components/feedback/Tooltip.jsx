import React from 'react';
const cx=(...a)=>a.filter(Boolean).join(' ');

export function Tooltip({ label, side = 'top', children, className = '', ...rest }) {
  const [open, setOpen] = React.useState(false);
  return (
    <span className={cx('gb-tip', open && 'gb-tip--open', className)}
      onMouseEnter={() => setOpen(true)} onMouseLeave={() => setOpen(false)}
      onFocus={() => setOpen(true)} onBlur={() => setOpen(false)} {...rest}>
      {children}
      <span role="tooltip" className={cx('gb-tip__bubble', `gb-tip__bubble--${side}`)}>{label}</span>
    </span>
  );
}
