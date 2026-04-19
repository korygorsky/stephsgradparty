'use client';

import { useEffect, useState } from 'react';
import { PALETTE } from '@/lib/palette';
import { EVENT_DATE_ISO } from '@/lib/event';
import SectionWrap from './SectionWrap';

export default function Countdown() {
  const target = new Date(EVENT_DATE_ISO).getTime();
  const [now, setNow] = useState<number | null>(null);

  useEffect(() => {
    setNow(Date.now());
    const i = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(i);
  }, []);

  const diff = now === null ? 0 : Math.max(0, target - now);
  const d = Math.floor(diff / 86400000);
  const h = Math.floor((diff % 86400000) / 3600000);
  const m = Math.floor((diff % 3600000) / 60000);
  const s = Math.floor((diff % 60000) / 1000);

  const units = [
    { n: d, l: 'days' },
    { n: h, l: 'hours' },
    { n: m, l: 'min' },
    { n: s, l: 'sec' },
  ];

  return (
    <SectionWrap title="Almost Time" subtitle="countdown to the patio">
      <div
        style={{
          background: PALETTE.ink,
          color: PALETTE.paper,
          padding: '24px 16px',
          textAlign: 'center',
          boxShadow: '3px 4px 0 rgba(0,0,0,0.12)',
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-around', gap: 8 }}>
          {units.map((u) => (
            <div key={u.l}>
              <div
                suppressHydrationWarning
                style={{
                  fontFamily: '"Caveat", cursive',
                  fontSize: 56,
                  fontWeight: 700,
                  lineHeight: 1,
                }}
              >
                {now === null ? '--' : String(u.n).padStart(2, '0')}
              </div>
              <div
                style={{
                  fontFamily: '"Courier Prime", monospace',
                  fontSize: 10,
                  letterSpacing: 2,
                  textTransform: 'uppercase',
                  opacity: 0.7,
                  marginTop: 2,
                }}
              >
                {u.l}
              </div>
            </div>
          ))}
        </div>
      </div>
    </SectionWrap>
  );
}
