import type { CSSProperties } from 'react';
import { PALETTE } from '@/lib/palette';

type Props = { name: string; date: string; venue: string };

export default function TicketStub({ name, date, venue }: Props) {
  return (
    <div
      style={{
        position: 'relative',
        background: '#fff',
        border: `2px solid ${PALETTE.ink}`,
        borderRadius: 6,
        padding: '18px 20px',
        display: 'grid',
        gridTemplateColumns: '1fr auto',
        gap: 16,
        alignItems: 'center',
        boxShadow: '3px 4px 0 rgba(0,0,0,0.08)',
      }}
    >
      <div>
        <div
          style={{
            fontFamily: '"Courier Prime", "Courier New", monospace',
            fontSize: 10,
            letterSpacing: 2,
            color: PALETTE.inkSoft,
            textTransform: 'uppercase',
          }}
        >
          ADMIT ONE · graduation celebration
        </div>
        <div
          style={{
            fontFamily: '"Caveat", cursive',
            fontSize: 38,
            fontWeight: 700,
            lineHeight: 1,
            color: PALETTE.ink,
            marginTop: 2,
          }}
        >
          {name}, RMT
        </div>
        <div
          style={{
            marginTop: 8,
            display: 'flex',
            flexDirection: 'column',
            gap: 3,
            fontFamily: '"Kalam", cursive',
            fontSize: 14,
            color: PALETTE.ink,
          }}
        >
          <div>
            <span style={stubLabel}>WHEN&nbsp;&nbsp;</span>
            {date}
          </div>
          <div>
            <span style={stubLabel}>WHERE&nbsp;</span>
            {venue}
          </div>
          <div>
            <span style={stubLabel}>DRESS&nbsp;</span>whatever feels good
          </div>
        </div>
      </div>
      <div
        style={{
          borderLeft: `2px dashed ${PALETTE.ink}`,
          paddingLeft: 14,
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        <div style={stubMicro}>NO. 2026</div>
        <div
          style={{
            fontFamily: '"Caveat", cursive',
            fontSize: 48,
            fontWeight: 700,
            lineHeight: 1,
            color: PALETTE.accent2,
          }}
        >
          {name.charAt(0)}
        </div>
        <div style={stubMicro}>SEAT: ANY</div>
      </div>
      <div style={perfDot('left')} />
      <div style={perfDot('right')} />
    </div>
  );
}

const stubLabel = {
  color: PALETTE.inkSoft,
  fontSize: 11,
  fontFamily: '"Courier Prime", monospace',
  letterSpacing: 1.5,
} as const;

const stubMicro = {
  fontFamily: '"Courier Prime", monospace',
  fontSize: 9,
  letterSpacing: 1.5,
  color: PALETTE.inkSoft,
} as const;

function perfDot(side: 'left' | 'right'): CSSProperties {
  return {
    position: 'absolute',
    left: side === 'left' ? -6 : undefined,
    right: side === 'right' ? -6 : undefined,
    top: '50%',
    transform: 'translateY(-50%)',
    width: 12,
    height: 12,
    borderRadius: '50%',
    background: PALETTE.paper,
    border: `2px solid ${PALETTE.ink}`,
  };
}
