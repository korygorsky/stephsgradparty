import { PALETTE } from '@/lib/palette';
import { FOOTER_YEAR } from '@/lib/event';
import { Squiggle } from './primitives/Squiggle';

export default function Footer() {
  return (
    <div
      style={{
        padding: '40px 20px',
        textAlign: 'center',
        borderTop: `1px dashed ${PALETTE.inkSoft}66`,
      }}
    >
      <div
        style={{
          fontFamily: '"Caveat", cursive',
          fontSize: 32,
          fontWeight: 700,
          color: PALETTE.ink,
          lineHeight: 1,
        }}
      >
        see you on the patio
      </div>
      <div style={{ marginTop: 10, display: 'flex', justifyContent: 'center' }}>
        <Squiggle w={100} color={PALETTE.accent2} />
      </div>
      <div
        style={{
          marginTop: 14,
          fontFamily: '"Courier Prime", monospace',
          fontSize: 10,
          letterSpacing: 2,
          color: PALETTE.inkSoft,
          textTransform: 'uppercase',
        }}
      >
        with love · {FOOTER_YEAR}
      </div>
    </div>
  );
}
