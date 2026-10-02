import React from 'react';
import { Icon } from './Icon.jsx';
const cx=(...a)=>a.filter(Boolean).join(' ');

export function Tag({ selected = false, onRemove, onClick, children, className = '', ...rest }) {
  return (
    <span onClick={onClick} className={cx('gb-tag', selected && 'gb-tag--selected', !onRemove && 'gb-tag--plain', className)}
      style={onClick ? { cursor: 'pointer' } : undefined} {...rest}>
      {children}
      {onRemove && (
        <button type="button" className="gb-tag__x" aria-label="Hapus" onClick={(e) => { e.stopPropagation(); onRemove(e); }}>
          <Icon name="x" size={12} />
        </button>
      )}
    </span>
  );
}
