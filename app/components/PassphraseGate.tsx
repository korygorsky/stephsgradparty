'use client';

import { useEffect, useState } from 'react';
import { track } from '@vercel/analytics';
import { PALETTE } from '@/lib/palette';
import Btn, { inputStyle } from './primitives/Btn';

type Props = {
  onClose: () => void;
  onUnlocked: () => void;
};

export default function PassphraseGate({ onClose, onUnlocked }: Props) {
  const [value, setValue] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [onClose]);

  const submit = async () => {
    if (!value.trim() || submitting) return;
    setSubmitting(true);
    setError(null);
    try {
      const res = await fetch('/api/unlock', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ passphrase: value.trim() }),
      });
      if (!res.ok) {
        track('passphrase_failed');
        setError('that word doesn\u2019t ring a bell. try again?');
        setSubmitting(false);
        return;
      }
      track('passphrase_unlocked');
      onUnlocked();
    } catch {
      track('passphrase_error');
      setError('something went sideways. try again.');
      setSubmitting(false);
    }
  };

  return (
    <div
      onClick={onClose}
      style={{
        position: 'fixed',
        inset: 0,
        background: 'rgba(30,28,24,0.55)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 2000,
        padding: 20,
      }}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          background: PALETTE.paper,
          border: `2px solid ${PALETTE.ink}`,
          padding: 24,
          maxWidth: 360,
          width: '100%',
          boxShadow: '4px 6px 0 rgba(0,0,0,0.22)',
          position: 'relative',
          transform: 'rotate(-0.6deg)',
        }}
      >
        <div
          style={{
            fontFamily: '"Courier Prime", monospace',
            fontSize: 10,
            letterSpacing: 3,
            color: PALETTE.inkSoft,
            textTransform: 'uppercase',
          }}
        >
          one quick thing
        </div>
        <div
          style={{
            fontFamily: '"Caveat", cursive',
            fontSize: 40,
            fontWeight: 700,
            color: PALETTE.ink,
            lineHeight: 1,
            marginTop: 2,
          }}
        >
          what&apos;s the party word?
        </div>
        <div
          style={{
            fontFamily: '"Kalam", cursive',
            fontSize: 14,
            color: PALETTE.inkSoft,
            marginTop: 8,
            lineHeight: 1.4,
          }}
        >
          it&apos;s on the invite card — or ask someone wearing a lanyard.
        </div>

        <input
          type="text"
          value={value}
          autoFocus
          onChange={(e) => {
            setValue(e.target.value);
            if (error) setError(null);
          }}
          onKeyDown={(e) => {
            if (e.key === 'Enter') submit();
          }}
          placeholder="the word"
          style={{ ...inputStyle(), marginTop: 14 }}
        />

        {error && (
          <div
            style={{
              fontFamily: '"Kalam", cursive',
              fontSize: 13,
              color: '#a14a3a',
              marginTop: 8,
            }}
          >
            {error}
          </div>
        )}

        <div style={{ display: 'flex', gap: 8, marginTop: 14 }}>
          <Btn variant="ghost" onClick={onClose} style={{ flex: 1 }}>
            later
          </Btn>
          <Btn onClick={submit} disabled={submitting} style={{ flex: 2 }}>
            {submitting ? 'checking…' : 'let me in'}
          </Btn>
        </div>
      </div>
    </div>
  );
}
