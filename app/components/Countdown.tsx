'use client';

import { useEffect, useState } from 'react';
import { PALETTE } from '@/lib/palette';
import { EVENT_DATE_ISO, EVENT_END_ISO } from '@/lib/event';
import SectionWrap from './SectionWrap';

type Phase = 'pre' | 'live' | 'post';

function phaseFor(now: number, start: number, end: number): Phase {
  if (now < start) return 'pre';
  if (now < end) return 'live';
  return 'post';
}

export default function Countdown() {
  const start = new Date(EVENT_DATE_ISO).getTime();
  const end = new Date(EVENT_END_ISO).getTime();
  const [now, setNow] = useState<number | null>(null);

  useEffect(() => {
    setNow(Date.now());
    const i = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(i);
  }, []);

  // Server render + first hydration: stay in 'pre' to avoid mismatch.
  const phase: Phase = now === null ? 'pre' : phaseFor(now, start, end);

  if (phase === 'post') {
    return (
      <SectionWrap title="That's a Wrap" subtitle="thanks for being there">
        <Panel>
          <div
            style={{
              fontFamily: '"Caveat", cursive',
              fontSize: 44,
              fontWeight: 700,
              lineHeight: 1.05,
            }}
          >
            party&apos;s over ♡
          </div>
          <div
            style={{
              fontFamily: '"Kalam", cursive',
              fontSize: 16,
              marginTop: 10,
              lineHeight: 1.5,
              opacity: 0.9,
            }}
          >
            thanks for coming out —<br />
            the photos, notes &amp; songs are still here below.
          </div>
        </Panel>
      </SectionWrap>
    );
  }

  if (phase === 'live') {
    const remaining = Math.max(0, end - (now ?? end));
    const mm = Math.floor(remaining / 60000);
    const ss = Math.floor((remaining % 60000) / 1000);
    return (
      <SectionWrap title="It's Party Time" subtitle="you're here, she's here">
        <Panel>
          <div
            style={{
              fontFamily: '"Caveat", cursive',
              fontSize: 56,
              fontWeight: 700,
              lineHeight: 1,
            }}
          >
            it&apos;s happening!
          </div>
          <div
            style={{
              fontFamily: '"Kalam", cursive',
              fontSize: 15,
              marginTop: 10,
              lineHeight: 1.5,
              opacity: 0.9,
            }}
          >
            drop a photo. sign the book.<br />
            queue up a song.
          </div>
          <div
            suppressHydrationWarning
            style={{
              fontFamily: '"Courier Prime", monospace',
              fontSize: 11,
              letterSpacing: 2,
              textTransform: 'uppercase',
              opacity: 0.7,
              marginTop: 16,
            }}
          >
            patio wraps in {String(mm).padStart(2, '0')}:{String(ss).padStart(2, '0')}
          </div>
        </Panel>
      </SectionWrap>
    );
  }

  // 'pre' — countdown.
  const diff = now === null ? 0 : Math.max(0, start - now);
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
      <Panel>
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
      </Panel>
    </SectionWrap>
  );
}

function Panel({ children }: { children: React.ReactNode }) {
  return (
    <div
      style={{
        background: PALETTE.ink,
        color: PALETTE.paper,
        padding: '24px 16px',
        textAlign: 'center',
        boxShadow: '3px 4px 0 rgba(0,0,0,0.12)',
      }}
    >
      {children}
    </div>
  );
}
