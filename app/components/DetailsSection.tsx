'use client';

import { track } from '@vercel/analytics';
import { PALETTE } from '@/lib/palette';
import { EVENT_NAME, EVENT_DATE_LABEL, VENUE } from '@/lib/event';
import SectionWrap from './SectionWrap';
import TicketStub from './primitives/TicketStub';

export default function DetailsSection() {
  return (
    <SectionWrap title="The Details" subtitle="here's what you need to know">
      <TicketStub name={EVENT_NAME} date={EVENT_DATE_LABEL} venue={VENUE} />
      <div style={{ marginTop: 16, display: 'flex', justifyContent: 'center' }}>
        <a
          href="https://maps.app.goo.gl/zrRcH6eQ8kqMZSfM8"
          target="_blank"
          rel="noopener noreferrer"
          onClick={() => track('directions_click')}
          style={{
            display: 'inline-block',
            fontFamily: '"Caveat", cursive',
            fontSize: 22,
            fontWeight: 700,
            color: PALETTE.ink,
            background: PALETTE.accent,
            border: `2px solid ${PALETTE.ink}`,
            borderRadius: 999,
            padding: '6px 20px',
            textDecoration: 'none',
            boxShadow: '2px 3px 0 rgba(0,0,0,0.12)',
            transform: 'rotate(-1.5deg)',
          }}
        >
          Get Directions →
        </a>
      </div>
      <div
        style={{
          marginTop: 16,
          fontFamily: '"Kalam", cursive',
          fontSize: 14,
          color: PALETTE.ink,
          lineHeight: 1.6,
          padding: '0 4px',
        }}
      >
        The patio&apos;s ours til 9pm, so linger.
      </div>
    </SectionWrap>
  );
}
