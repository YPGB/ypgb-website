import React from 'react';
const cx=(...a)=>a.filter(Boolean).join(' ');

/* Brand lockup: seal + "Yayasan Pendidikan" kicker + GEMBALA BAIK wordmark (+ optional place line).
   chip = white circular backing for the seal on dark grounds (its line art is dark ink). */
export function Lockup({ logo, kicker = 'Yayasan Pendidikan', name = 'Gembala Baik', place, size = 'md', chip = false, tone = 'inherit', className = '', ...rest }) {
  return (
    <span className={cx('gb-lockup', 'gb-lockup--' + size, chip && 'gb-lockup--chip', tone === 'onlight' && 'gb-lockup--onlight', className)} {...rest}>
      {logo && <span className="gb-lockup__seal"><img src={logo} alt="" /></span>}
      <span className="gb-lockup__text">
        {kicker && <span className="gb-lockup__kicker">{kicker}</span>}
        <span className="gb-lockup__name">{name}</span>
        {place && <span className="gb-lockup__place">{place}</span>}
      </span>
    </span>
  );
}
