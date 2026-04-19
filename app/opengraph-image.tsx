import { readFile } from 'node:fs/promises';
import { join } from 'node:path';
import { ImageResponse } from 'next/og';
import {
  EVENT_DATE_LABEL,
  EVENT_NAME,
  EVENT_TAGLINE_L1,
  EVENT_TAGLINE_L2,
  VENUE,
} from '@/lib/event';

export const runtime = 'nodejs';
export const alt = `${EVENT_NAME}'s Grad Party — you're invited`;
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

const PAPER = '#faf7f0';
const INK = '#2b2a26';
const INK_SOFT = '#6b6860';
const ACCENT = '#a8c4a2';
const ACCENT2 = '#d4a574';
const ACCENT_DARK = '#c9914f';
const TAPE = 'rgba(255,220,120,0.7)';

async function loadLocalFont(filename: string): Promise<Buffer> {
  return readFile(join(process.cwd(), 'app', 'og-fonts', filename));
}

const shortVenue = (v: string): string => {
  const emDash = v.indexOf('—');
  return emDash === -1 ? v : v.slice(0, emDash).trim();
};

export default async function Image() {
  const [caveatB, kalam, kalamB, courier] = await Promise.all([
    loadLocalFont('Caveat-Bold.ttf'),
    loadLocalFont('Kalam-Regular.ttf'),
    loadLocalFont('Kalam-Bold.ttf'),
    loadLocalFont('CourierPrime-Regular.ttf'),
  ]);

  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          background: PAPER,
          color: INK,
          position: 'relative',
          display: 'flex',
          fontFamily: 'Kalam',
          overflow: 'hidden',
        }}
      >
        {/* paper wash — two soft color pools. Satori can't compose multi-layer
            backgrounds, so we stack two separate divs. */}
        <div
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: 600,
            height: 500,
            background:
              'radial-gradient(circle at 20% 25%, rgba(168,196,162,0.18), transparent 55%)',
            display: 'flex',
          }}
        />
        <div
          style={{
            position: 'absolute',
            right: 0,
            bottom: 0,
            width: 600,
            height: 500,
            background:
              'radial-gradient(circle at 80% 75%, rgba(212,165,116,0.18), transparent 55%)',
            display: 'flex',
          }}
        />

        {/* dashed border inset */}
        <div
          style={{
            position: 'absolute',
            top: 18,
            left: 18,
            right: 18,
            bottom: 18,
            border: '2px dashed rgba(43,42,38,0.25)',
            display: 'flex',
          }}
        />

        {/* GRAD 2026 stamp — top-right corner, above the polaroid cluster */}
        <div
          style={{
            position: 'absolute',
            top: 38,
            right: 44,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '8px 14px',
            border: `2.5px solid ${ACCENT_DARK}`,
            color: ACCENT_DARK,
            fontFamily: 'Courier Prime',
            fontSize: 12,
            letterSpacing: 3,
            textTransform: 'uppercase',
            lineHeight: 1.05,
            transform: 'rotate(8deg)',
            background: 'rgba(250,247,240,0.92)',
          }}
        >
          <div>GRAD</div>
          <div style={{ fontSize: 16, fontWeight: 700, marginTop: 2 }}>2026</div>
        </div>

        {/* Left block: title + tagline. Narrower so it never collides with
            the polaroid cluster on the right. */}
        <div
          style={{
            position: 'absolute',
            top: 58,
            left: 60,
            width: 580,
            display: 'flex',
            flexDirection: 'column',
          }}
        >
          <div
            style={{
              fontFamily: 'Courier Prime',
              fontSize: 15,
              letterSpacing: 5,
              textTransform: 'uppercase',
              color: INK_SOFT,
            }}
          >
            — you&apos;re invited —
          </div>

          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              fontFamily: 'Caveat',
              fontWeight: 700,
              fontSize: 124,
              lineHeight: 0.9,
              color: INK,
              marginTop: 8,
              transform: 'rotate(-1.5deg)',
              transformOrigin: 'left',
            }}
          >
            <div>{`${EVENT_NAME.split(/\s+/)[0]}'s`}</div>
            <div style={{ color: ACCENT_DARK, marginTop: -6 }}>Grad Party</div>
          </div>

          {/* squiggle */}
          <svg width="200" height="14" viewBox="0 0 200 14" style={{ marginTop: 20 }}>
            <path
              d="M0 7 Q 16 0, 32 7 T 64 7 T 96 7 T 128 7 T 160 7 T 200 7"
              fill="none"
              stroke={INK}
              strokeWidth="2.5"
              strokeLinecap="round"
            />
          </svg>

          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              fontFamily: 'Kalam',
              fontSize: 24,
              lineHeight: 1.35,
              color: INK,
              marginTop: 18,
              maxWidth: 520,
            }}
          >
            <div>{EVENT_TAGLINE_L1}</div>
            <div style={{ color: INK_SOFT }}>{EVENT_TAGLINE_L2}</div>
          </div>
        </div>

        {/* Right cluster: polaroids. Sized + positioned so (a) the title
            never hits them, (b) the stamp stays visible above p1, and
            (c) the bottom p3 doesn't overlap the foot stamp. */}
        <Polaroid
          emoji="🎓"
          caption="graduation day"
          gradient={`linear-gradient(135deg, ${ACCENT} 0%, ${ACCENT2} 100%)`}
          width={200}
          top={118}
          right={250}
          rotate={-7}
          tape={{ side: 'left', offset: 26, rotate: -12, width: 72 }}
        />
        <Polaroid
          emoji="🥂"
          caption="cheers to that"
          gradient={`linear-gradient(135deg, ${ACCENT2} 0%, ${ACCENT} 100%)`}
          width={200}
          top={150}
          right={52}
          rotate={6}
          tape={{ side: 'right', offset: 26, rotate: 10, width: 78 }}
        />
        <Polaroid
          emoji="💆"
          caption="RMT at last"
          gradient={`linear-gradient(135deg, #e8c9a5 0%, ${ACCENT_DARK} 100%)`}
          bg="#fffdf5"
          width={218}
          top={360}
          right={140}
          rotate={-2}
          tape={{ side: 'center', offset: 0, rotate: 3, width: 66 }}
        />

        {/* Ticket stub */}
        <div
          style={{
            position: 'absolute',
            bottom: 70,
            left: 60,
            background: '#fff',
            border: `2.5px solid ${INK}`,
            borderRadius: 4,
            padding: '14px 24px',
            display: 'flex',
            alignItems: 'center',
            gap: 18,
            boxShadow: '4px 5px 0 rgba(0,0,0,0.12)',
            transform: 'rotate(-1deg)',
          }}
        >
          {/* perforation dots */}
          <div
            style={{
              position: 'absolute',
              left: -9,
              top: '50%',
              transform: 'translateY(-50%)',
              width: 16,
              height: 16,
              borderRadius: 999,
              background: PAPER,
              border: `2.5px solid ${INK}`,
              display: 'flex',
            }}
          />
          <div
            style={{
              position: 'absolute',
              right: -9,
              top: '50%',
              transform: 'translateY(-50%)',
              width: 16,
              height: 16,
              borderRadius: 999,
              background: PAPER,
              border: `2.5px solid ${INK}`,
              display: 'flex',
            }}
          />

          <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            <div
              style={{
                fontFamily: 'Courier Prime',
                fontSize: 12,
                letterSpacing: 2.5,
                color: INK_SOFT,
                textTransform: 'uppercase',
              }}
            >
              {EVENT_DATE_LABEL}
            </div>
            <div
              style={{
                fontFamily: 'Caveat',
                fontWeight: 700,
                fontSize: 40,
                lineHeight: 1,
                color: INK,
              }}
            >
              {shortVenue(VENUE)}
            </div>
            <div
              style={{
                fontFamily: 'Kalam',
                fontSize: 18,
                color: INK,
                marginTop: 2,
              }}
            >
              scan · photo wall · guest book
            </div>
          </div>

          <div
            style={{
              borderLeft: `2.5px dashed ${INK}`,
              paddingLeft: 18,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: 2,
            }}
          >
            <div
              style={{
                fontFamily: 'Courier Prime',
                fontSize: 11,
                letterSpacing: 2,
                color: INK_SOFT,
              }}
            >
              NO. 2026
            </div>
            <div
              style={{
                fontFamily: 'Caveat',
                fontWeight: 700,
                fontSize: 62,
                lineHeight: 1,
                color: ACCENT_DARK,
              }}
            >
              {EVENT_NAME.charAt(0)}
            </div>
            <div
              style={{
                fontFamily: 'Courier Prime',
                fontSize: 11,
                letterSpacing: 2,
                color: INK_SOFT,
              }}
            >
              RMT
            </div>
          </div>
        </div>

        {/* foot — bottom-center, clear of the bottom-right polaroid */}
        <div
          style={{
            position: 'absolute',
            bottom: 30,
            left: 520,
            fontFamily: 'Courier Prime',
            fontSize: 12,
            letterSpacing: 3,
            color: INK_SOFT,
            textTransform: 'uppercase',
            display: 'flex',
          }}
        >
          {`${EVENT_NAME}'s grad · 04·2026`}
        </div>
      </div>
    ),
    {
      ...size,
      fonts: [
        { name: 'Caveat', data: caveatB, weight: 700, style: 'normal' },
        { name: 'Kalam', data: kalam, weight: 400, style: 'normal' },
        { name: 'Kalam', data: kalamB, weight: 700, style: 'normal' },
        { name: 'Courier Prime', data: courier, weight: 400, style: 'normal' },
      ],
      emoji: 'twemoji',
    },
  );
}

type TapeSpec = {
  side: 'left' | 'right' | 'center';
  offset: number;
  rotate: number;
  width: number;
};

function Polaroid({
  emoji,
  caption,
  gradient,
  bg = '#fff',
  width,
  top,
  right,
  rotate,
  tape,
}: {
  emoji: string;
  caption: string;
  gradient: string;
  bg?: string;
  width: number;
  top: number;
  right: number;
  rotate: number;
  tape: TapeSpec;
}) {
  const photoSize = width - 28;
  return (
    <div
      style={{
        position: 'absolute',
        top,
        right,
        width,
        background: bg,
        padding: '14px 14px 52px',
        border: '1px solid rgba(43,42,38,0.15)',
        boxShadow: '0 6px 20px rgba(0,0,0,0.15), 0 2px 6px rgba(0,0,0,0.1)',
        transform: `rotate(${rotate}deg)`,
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      <div
        style={{
          width: photoSize,
          height: photoSize,
          background: gradient,
          border: '1px solid rgba(43,42,38,0.2)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: 86,
        }}
      >
        {emoji}
      </div>
      <div
        style={{
          position: 'absolute',
          left: 14,
          right: 14,
          bottom: 14,
          fontFamily: 'Caveat',
          fontWeight: 700,
          fontSize: 26,
          color: INK,
          textAlign: 'center',
          lineHeight: 1,
          display: 'flex',
          justifyContent: 'center',
        }}
      >
        {caption}
      </div>
      <div
        style={{
          position: 'absolute',
          top: -8,
          ...(tape.side === 'left'
            ? { left: tape.offset }
            : tape.side === 'right'
              ? { right: tape.offset }
              : { left: Math.round((width - tape.width) / 2) }),
          width: tape.width,
          height: 22,
          background: TAPE,
          boxShadow: '0 1px 2px rgba(0,0,0,0.08)',
          transform: `rotate(${tape.rotate}deg)`,
          display: 'flex',
        }}
      />
    </div>
  );
}
