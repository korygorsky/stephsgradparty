'use client';

import { useRef, useState } from 'react';
import { track } from '@vercel/analytics';
import { PALETTE } from '@/lib/palette';
import type { GuestbookEntry } from '@/lib/types';
import SectionWrap from './SectionWrap';
import Tape from './primitives/Tape';
import Btn, { inputStyle } from './primitives/Btn';
import { useUnlock } from './UnlockProvider';
import { postJson } from './apiClient';

type Props = { initial: GuestbookEntry[] };

const PLACEHOLDERS: GuestbookEntry[] = [
  {
    id: -1,
    name: 'Mom',
    message:
      'Watching you finish this has been one of the proudest moments of my life. Love you always.',
    rotation: -1.5,
    accent: true,
    created_at: '',
  },
  {
    id: -2,
    name: 'Jen',
    message:
      "from study buddy to actual RMT — you make it look easy (i know it wasn't)",
    rotation: 2,
    accent: false,
    created_at: '',
  },
  {
    id: -3,
    name: 'Marcus',
    message: 'dibs on the first free massage 💆',
    rotation: -0.8,
    accent: false,
    created_at: '',
  },
];

export default function GuestBookSection({ initial }: Props) {
  const { requireUnlock } = useUnlock();
  const [entries, setEntries] = useState<GuestbookEntry[]>(initial);
  const [name, setName] = useState('');
  const [msg, setMsg] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const startedRef = useRef(false);
  const trackStarted = () => {
    if (!startedRef.current) {
      startedRef.current = true;
      track('guestbook_started');
    }
  };

  const sign = async () => {
    if (!msg.trim() || submitting) return;
    const ok = await requireUnlock();
    if (!ok) return;
    setSubmitting(true);
    setError(null);
    const res = await postJson<{ entry: GuestbookEntry }>('/api/guestbook', {
      name: name.trim(),
      message: msg.trim(),
    });
    if (!res.ok) {
      setError(
        res.status === 429
          ? 'whoa, slow down — try again in a minute'
          : 'couldn\u2019t sign the book. try again?',
      );
      setSubmitting(false);
      return;
    }
    track('guestbook_signed', { hasName: name.trim().length > 0 });
    setEntries((prev) => [res.data.entry, ...prev]);
    setName('');
    setMsg('');
    setSubmitting(false);
  };

  const display = entries.length > 0 ? entries : PLACEHOLDERS;

  return (
    <SectionWrap
      title="The Guest Book"
      subtitle="leave her a note to read tomorrow"
    >
      <div
        style={{
          background: '#fffdf5',
          border: `1px solid ${PALETTE.inkSoft}44`,
          padding: 16,
          boxShadow: '2px 3px 0 rgba(0,0,0,0.08)',
          position: 'relative',
          backgroundImage: `repeating-linear-gradient(to bottom, transparent 0 28px, ${PALETTE.accent}44 28px 29px)`,
          backgroundSize: '100% 29px',
        }}
      >
        <Tape color={PALETTE.tape} top={-10} left="50%" rotate={-3} />
        <input
          type="text"
          placeholder="your name"
          value={name}
          onChange={(e) => {
            trackStarted();
            setName(e.target.value);
          }}
          style={{
            ...inputStyle(),
            border: 'none',
            borderBottom: `1px solid ${PALETTE.ink}`,
            borderRadius: 0,
            background: 'transparent',
            padding: '6px 0',
            fontFamily: '"Caveat", cursive',
            fontSize: 20,
          }}
        />
        <textarea
          placeholder="dear steph,"
          value={msg}
          onChange={(e) => {
            trackStarted();
            setMsg(e.target.value);
          }}
          rows={4}
          style={{
            width: '100%',
            marginTop: 10,
            border: 'none',
            background: 'transparent',
            resize: 'none',
            outline: 'none',
            fontFamily: '"Kalam", cursive',
            fontSize: 16,
            color: PALETTE.ink,
            lineHeight: '29px',
            padding: 0,
          }}
        />
        {error && (
          <div
            style={{
              fontFamily: '"Kalam", cursive',
              fontSize: 13,
              color: '#a14a3a',
              marginTop: 4,
            }}
          >
            {error}
          </div>
        )}
        <div style={{ marginTop: 8, textAlign: 'right' }}>
          <Btn onClick={sign} disabled={submitting}>
            {submitting ? 'signing…' : 'sign the book ✒️'}
          </Btn>
        </div>
      </div>

      <div style={{ marginTop: 24 }}>
        {display.map((e, i) => (
          <div
            key={e.id}
            style={{
              background: e.accent ? PALETTE.accent + '55' : '#fff',
              border: `1px solid ${PALETTE.inkSoft}44`,
              padding: '14px 16px',
              marginBottom: 14,
              transform: `rotate(${e.rotation}deg)`,
              boxShadow: '2px 3px 0 rgba(0,0,0,0.08)',
              position: 'relative',
            }}
          >
            {i === 0 && <Tape color={PALETTE.tape} top={-8} right={30} rotate={8} />}
            <div
              style={{
                fontFamily: '"Kalam", cursive',
                fontSize: 15,
                color: PALETTE.ink,
                lineHeight: 1.5,
              }}
            >
              &ldquo;{e.message}&rdquo;
            </div>
            <div
              style={{
                fontFamily: '"Caveat", cursive',
                fontSize: 20,
                color: PALETTE.accent2,
                marginTop: 6,
                textAlign: 'right',
              }}
            >
              — {e.name}
            </div>
          </div>
        ))}
      </div>
    </SectionWrap>
  );
}
