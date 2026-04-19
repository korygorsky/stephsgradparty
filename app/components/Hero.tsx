import Image from 'next/image';
import { PALETTE } from '@/lib/palette';
import { EVENT_NAME, EVENT_TAGLINE_L1, EVENT_TAGLINE_L2 } from '@/lib/event';
import { Squiggle2 } from './primitives/Squiggle';
import Polaroid from './primitives/Polaroid';
import Tape from './primitives/Tape';

const HERO_IMG_STYLE = {
  width: '100%',
  display: 'block',
  aspectRatio: '1',
  objectFit: 'cover',
  height: 'auto',
} as const;

export default function Hero() {
  return (
    <div style={{ padding: '32px 20px 10px', textAlign: 'center', position: 'relative' }}>
      <div
        style={{
          fontFamily: '"Courier Prime", "Courier New", monospace',
          fontSize: 11,
          letterSpacing: 3,
          color: PALETTE.inkSoft,
          textTransform: 'uppercase',
        }}
      >
        — you&apos;re invited —
      </div>
      <div
        style={{
          fontFamily: '"Caveat", cursive',
          fontSize: 72,
          fontWeight: 700,
          lineHeight: 0.95,
          color: PALETTE.ink,
          marginTop: 4,
          transform: 'rotate(-1.5deg)',
        }}
      >
        {EVENT_NAME}&apos;s<br />
        <span style={{ color: PALETTE.accent2 }}>Grad Party</span>
      </div>
      <div style={{ display: 'flex', justifyContent: 'center', marginTop: 10 }}>
        <Squiggle2 w={200} color={PALETTE.ink} />
      </div>
      <div
        style={{
          fontFamily: '"Kalam", cursive',
          fontSize: 18,
          color: PALETTE.ink,
          marginTop: 12,
          lineHeight: 1.4,
        }}
      >
        {EVENT_TAGLINE_L1}
        <br />
        {EVENT_TAGLINE_L2}
      </div>

      <div style={{ position: 'relative', height: 230, marginTop: 24 }}>
        <div style={{ position: 'absolute', top: 0, left: 10, width: 130, zIndex: 1 }}>
          <Polaroid rotate={-6} caption="study pile, 2024">
            <Image
              src="/hero/study-pile.jpeg"
              alt="Steph with her study pile"
              width={400}
              height={400}
              style={HERO_IMG_STYLE}
              priority
            />
            <Tape color={PALETTE.tape} top={-8} left={30} rotate={-10} />
          </Polaroid>
        </div>
        <div style={{ position: 'absolute', top: 10, right: 10, width: 130, zIndex: 2 }}>
          <Polaroid rotate={8} caption="graduation day!">
            <Image
              src="/hero/graduating.jpg"
              alt="Steph on graduation day"
              width={400}
              height={400}
              style={HERO_IMG_STYLE}
              priority
            />
            <Tape color={PALETTE.tape} top={-8} right={30} rotate={12} />
          </Polaroid>
        </div>
        <div
          style={{
            position: 'absolute',
            bottom: 0,
            left: '50%',
            transform: 'translateX(-50%)',
            width: 140,
            zIndex: 3,
          }}
        >
          <Polaroid rotate={-2} caption="RMT, here i come">
            <Image
              src="/hero/atlast.PNG"
              alt="Steph, RMT portrait"
              width={400}
              height={400}
              style={HERO_IMG_STYLE}
              priority
            />
            <Tape color={PALETTE.tape} top={-8} left="50%" rotate={3} />
          </Polaroid>
        </div>
      </div>
    </div>
  );
}
