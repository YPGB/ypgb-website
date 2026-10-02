import React from 'react';
import { Card } from '../core/Card.jsx';
import { Badge } from '../core/Badge.jsx';
const cx=(...a)=>a.filter(Boolean).join(' ');

export function NewsCard({ title, date, category, excerpt, image, imageNote = 'Foto kegiatan', layout = 'stack', href, onOpen }) {
  return (
    <Card pad="none" className={cx('gb-news', layout === 'row' && 'gb-news--row')} href={href} interactive={!!onOpen} onClick={onOpen}>
      <div className="gb-news__figure">
        {image ? <img src={image} alt="" /> : <span className="gb-news__ph">{imageNote}</span>}
        {category && <Badge tone="accent">{category}</Badge>}
      </div>
      <div className="gb-news__body">
        {date && <span className="gb-news__date">{date}</span>}
        <h3 className="gb-news__title">{title}</h3>
        {excerpt && <p className="gb-news__excerpt">{excerpt}</p>}
      </div>
    </Card>
  );
}
