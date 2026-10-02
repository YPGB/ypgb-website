import React from 'react';
import { Icon } from '../core/Icon.jsx';
import { Lockup } from '../core/Lockup.jsx';
const cx=(...a)=>a.filter(Boolean).join(' ');

/* Seal logo sits on a white chip (its line art is dark ink, drawn for light
   grounds) so it reads on the dark brand band; omit `logo` for text-only. */
export function NavBar({ tone = 'brand', logo, mark = 'Gembala Baik', kicker = 'Yayasan Pendidikan', items = [], activeId, onNavigate, actions, className = '', ...rest }) {
  return (
    <header className={cx('gb-nav', tone === 'light' && 'gb-nav--light', className)} {...rest}>
      <div className="gb-nav__inner">
        <a className="gb-nav__mark" href="#" onClick={(e) => { e.preventDefault(); onNavigate && onNavigate(items[0] && items[0].id); }}>
          <Lockup logo={logo} kicker={kicker} name={mark} size="sm" chip={tone === 'brand'} tone={tone === 'light' ? 'onlight' : 'inherit'} />
        </a>
        <nav className="gb-nav__links">
          {items.map((it) => (
            <a key={it.id} href={it.href || '#'}
              className={cx('gb-nav__link', it.id === activeId && 'gb-nav__link--active')}
              onClick={(e) => { if (!it.href) { e.preventDefault(); onNavigate && onNavigate(it.id); } }}>
              {it.label}{it.external && <Icon name="external-link" size={13} />}
            </a>
          ))}
          {actions}
        </nav>
      </div>
    </header>
  );
}
