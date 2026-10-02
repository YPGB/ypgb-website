import React from 'react';

/* Brand icon set: Lucide (stroke 2, round caps). SVGs are fetched from the
   lucide-static CDN, cached, and inlined so stroke="currentColor" in the
   source SVG paints correctly — CSS mask-image is unreliable cross-origin. */
export const LUCIDE_VERSION = '0.544.0';
const BASE = `https://unpkg.com/lucide-static@${LUCIDE_VERSION}/icons/`;
const cache = {};

function loadSvg(name) {
  if (!cache[name]) {
    cache[name] = fetch(`${BASE}${name}.svg`).then((r) => r.text());
  }
  return cache[name];
}

export function Icon({ name, size = 20, title, className = '', style, ...rest }) {
  const [markup, setMarkup] = React.useState(cache[name] && typeof cache[name] !== 'object' ? cache[name] : null);
  React.useEffect(() => {
    let live = true;
    loadSvg(name).then((svg) => { if (live) setMarkup(svg); });
    return () => { live = false; };
  }, [name]);
  return (
    <span
      className={['gb-icon-wrap', className].filter(Boolean).join(' ')}
      role={title ? 'img' : undefined}
      aria-label={title || undefined}
      aria-hidden={title ? undefined : 'true'}
      style={{ display: 'inline-flex', flex: 'none', width: size, height: size, color: 'inherit', ...style }}
      dangerouslySetInnerHTML={markup ? { __html: markup } : undefined}
      {...rest}
    />
  );
}
