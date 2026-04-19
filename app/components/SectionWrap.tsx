import type { ReactNode } from 'react';
import { PALETTE } from '@/lib/palette';
import Tape from './primitives/Tape';

type Props = {
  title: string;
  subtitle: string;
  children: ReactNode;
};

export default function SectionWrap({ title, subtitle, children }: Props) {
  return (
    <section
      style={{
        padding: '36px 20px 20px',
        borderTop: `1px dashed ${PALETTE.inkSoft}66`,
        position: 'relative',
      }}
    >
      <Tape color={PALETTE.tape} top={-10} left="50%" rotate={-3} width={70} />
      <div style={{ textAlign: 'center', marginBottom: 20 }}>
        <div
          style={{
            fontFamily: '"Courier Prime", monospace',
            fontSize: 10,
            letterSpacing: 3,
            color: PALETTE.inkSoft,
            textTransform: 'uppercase',
          }}
        >
          {subtitle}
        </div>
        <div
          style={{
            fontFamily: '"Caveat", cursive',
            fontSize: 44,
            fontWeight: 700,
            color: PALETTE.ink,
            lineHeight: 1,
            marginTop: 2,
            transform: 'rotate(-0.8deg)',
          }}
        >
          {title}
        </div>
      </div>
      {children}
    </section>
  );
}
