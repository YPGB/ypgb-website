import React from 'react';
import { Card } from '../core/Card.jsx';
import { Badge } from '../core/Badge.jsx';
import { Button } from '../core/Button.jsx';
import { Icon } from '../core/Icon.jsx';

export function UnitCard({ abbr, name, level, address, coordinator, accreditation, website, onOpen }) {
  return (
    <Card pad="none" className="gb-unit" interactive={!!onOpen} onClick={onOpen}>
      <div className="gb-unit__band">
        <span className="gb-unit__abbr">{abbr}</span>
        {level && <Badge style={{ background: 'rgba(255,255,255,.18)', color: '#fff' }}>{level}</Badge>}
      </div>
      <div className="gb-unit__body">
        <span className="gb-unit__name">{name}</span>
        <div className="gb-unit__meta">
          {address && <span className="gb-unit__row"><Icon name="map-pin" size={14} />{address}</span>}
          {coordinator && <span className="gb-unit__row"><Icon name="user-round" size={14} />{coordinator}</span>}
          {accreditation && <span className="gb-unit__row"><Icon name="award" size={14} />{accreditation}</span>}
        </div>
        {website && (
          <div className="gb-unit__foot">
            <Button variant="link" href={website} iconRight="external-link">Website</Button>
          </div>
        )}
      </div>
    </Card>
  );
}
