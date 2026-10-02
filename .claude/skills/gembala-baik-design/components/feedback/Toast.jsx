import React from 'react';
import { Icon } from '../core/Icon.jsx';
import { IconButton } from '../core/IconButton.jsx';
const cx=(...a)=>a.filter(Boolean).join(' ');

const GLYPH = { info: 'info', success: 'circle-check', warning: 'triangle-alert', danger: 'octagon-alert' };
const COLOR = { info: 'var(--blue-700)', success: 'var(--green-700)', warning: 'var(--gold-700)', danger: 'var(--red-700)' };

export function Toast({ tone = 'info', title, children, onDismiss, className = '', ...rest }) {
  return (
    <div role="status" className={cx('gb-toast', `gb-toast--${tone}`, className)} {...rest}>
      <span style={{ color: COLOR[tone], display: 'flex', marginTop: 1 }}><Icon name={GLYPH[tone]} size={18} /></span>
      <div style={{ flex: 1 }}>
        {title && <div className="gb-toast__title">{title}</div>}
        {children && <div className="gb-toast__msg">{children}</div>}
      </div>
      {onDismiss && <IconButton icon="x" label="Tutup" size="sm" onClick={onDismiss} />}
    </div>
  );
}
