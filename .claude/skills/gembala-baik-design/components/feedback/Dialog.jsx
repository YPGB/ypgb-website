import React from 'react';
import { IconButton } from '../core/IconButton.jsx';

export function Dialog({ open = true, title, icon, onClose, footer, children, width = 520 }) {
  if (!open) return null;
  return (
    <div className="gb-scrim" onClick={onClose}>
      <div className="gb-dialog" role="dialog" aria-modal="true" aria-label={typeof title === 'string' ? title : undefined}
        style={{ maxWidth: width }} onClick={(e) => e.stopPropagation()}>
        <div className="gb-dialog__head">
          {icon}
          <h2 className="gb-dialog__title" style={{ flex: 1 }}>{title}</h2>
          {onClose && <IconButton icon="x" label="Tutup" size="sm" />}
        </div>
        <div className="gb-dialog__body">{children}</div>
        {footer && <div className="gb-dialog__foot">{footer}</div>}
      </div>
    </div>
  );
}
