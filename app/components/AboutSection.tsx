import { PALETTE } from '@/lib/palette';
import { ABOUT_FACTS } from '@/lib/event';
import SectionWrap from './SectionWrap';
import Tape from './primitives/Tape';

export default function AboutSection() {
  return (
    <SectionWrap title="About the grad" subtitle="a little dossier">
      <div
        style={{
          background: '#fff',
          border: `1px solid ${PALETTE.inkSoft}44`,
          padding: '20px 22px',
          boxShadow: '2px 3px 0 rgba(0,0,0,0.06)',
          position: 'relative',
        }}
      >
        <Tape color={PALETTE.tape} top={-10} left={20} rotate={-4} />
        <Tape color={PALETTE.tape} top={-10} right={20} rotate={6} />
        {ABOUT_FACTS.map((f, i) => (
          <div
            key={f.label}
            style={{
              borderBottom:
                i < ABOUT_FACTS.length - 1
                  ? `1px dashed ${PALETTE.inkSoft}66`
                  : 'none',
              padding: '10px 0',
            }}
          >
            <div
              style={{
                fontFamily: '"Courier Prime", monospace',
                fontSize: 10,
                letterSpacing: 2,
                color: PALETTE.inkSoft,
                textTransform: 'uppercase',
              }}
            >
              {f.label}
            </div>
            <div
              style={{
                fontFamily: '"Kalam", cursive',
                fontSize: 16,
                color: PALETTE.ink,
                marginTop: 2,
              }}
            >
              {f.val}
            </div>
          </div>
        ))}
      </div>
    </SectionWrap>
  );
}
