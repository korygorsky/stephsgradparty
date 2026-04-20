'use client';

import { useState } from 'react';
import { track } from '@vercel/analytics';
import { PALETTE } from '@/lib/palette';
import { MEMORY_PROMPTS } from '@/lib/event';
import type { Memory } from '@/lib/types';
import SectionWrap from './SectionWrap';
import Btn, { inputStyle } from './primitives/Btn';
import { useUnlock } from './UnlockProvider';
import { postJson } from './apiClient';

type Props = { initial: Memory[] };

export default function MemorySection({ initial }: Props) {
  const { requireUnlock } = useUnlock();
  const [memories, setMemories] = useState<Memory[]>(initial);
  const [picked, setPicked] = useState<string | null | undefined>(undefined);
  const [text, setText] = useState('');
  const [author, setAuthor] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const submit = async () => {
    if (!text.trim() || submitting) return;
    const ok = await requireUnlock();
    if (!ok) return;
    setSubmitting(true);
    setError(null);
    const res = await postJson<{ memory: Memory }>('/api/memories', {
      prompt: picked || null,
      body: text.trim(),
      author: author.trim(),
    });
    if (!res.ok) {
      setError(
        res.status === 429
          ? 'slow down a sec — too many memories'
          : 'couldn\u2019t save that one. try again?',
      );
      setSubmitting(false);
      return;
    }
    track('memory_submitted', { prompt: picked || 'none' });
    setMemories((prev) => [res.data.memory, ...prev]);
    setText('');
    setAuthor('');
    setPicked(undefined);
    setSubmitting(false);
  };

  const showPicker = picked === undefined;

  return (
    <SectionWrap title="Memory Lane" subtitle="the stories she'll love tomorrow">
      {showPicker && (
        <>
          <div
            style={{
              fontFamily: '"Kalam", cursive',
              fontSize: 14,
              color: PALETTE.ink,
              lineHeight: 1.5,
              marginBottom: 12,
            }}
          >
            pick a prompt, or just start writing. short is fine. weird is better.
          </div>
          {MEMORY_PROMPTS.map((p, i) => (
            <div
              key={p}
              onClick={() => {
                track('memory_prompt_picked', { prompt: p });
                setPicked(p);
              }}
              style={{
                background: '#fff',
                border: `1px solid ${PALETTE.ink}`,
                padding: '14px 40px 14px 16px',
                marginBottom: 10,
                fontFamily: '"Caveat", cursive',
                fontSize: 22,
                color: PALETTE.ink,
                lineHeight: 1.2,
                cursor: 'pointer',
                boxShadow: '2px 3px 0 rgba(0,0,0,0.06)',
                transform: `rotate(${i % 2 ? 0.5 : -0.5}deg)`,
                position: 'relative',
              }}
            >
              <span>{p}</span>
              <span
                style={{
                  position: 'absolute',
                  right: 14,
                  top: '50%',
                  transform: 'translateY(-50%)',
                  color: PALETTE.inkSoft,
                  fontSize: 18,
                }}
              >
                →
              </span>
            </div>
          ))}
          <div
            onClick={() => {
              track('memory_prompt_picked', { prompt: 'skip' });
              setPicked(null);
            }}
            style={{
              background: PALETTE.accent + '33',
              border: `2px dashed ${PALETTE.ink}`,
              padding: '14px 16px',
              marginBottom: 10,
              fontFamily: '"Caveat", cursive',
              fontSize: 22,
              color: PALETTE.ink,
              cursor: 'pointer',
              textAlign: 'center',
            }}
          >
            or... write your own ↓
          </div>
        </>
      )}

      {!showPicker && (
        <div
          style={{
            background: '#fffdf5',
            border: `2px solid ${PALETTE.ink}`,
            padding: 18,
            boxShadow: '2px 3px 0 rgba(0,0,0,0.08)',
          }}
        >
          <div
            onClick={() => {
              setPicked(undefined);
              setError(null);
            }}
            style={{
              fontFamily: '"Kalam", cursive',
              fontSize: 12,
              color: PALETTE.inkSoft,
              cursor: 'pointer',
              marginBottom: 8,
            }}
          >
            ← pick a different prompt
          </div>
          {picked && (
            <div
              style={{
                fontFamily: '"Caveat", cursive',
                fontSize: 26,
                fontWeight: 700,
                color: PALETTE.accent2,
                lineHeight: 1.1,
                marginBottom: 10,
              }}
            >
              {picked}
            </div>
          )}
          <textarea
            placeholder={picked ? 'continue the thought...' : 'tell a Steph story...'}
            value={text}
            onChange={(e) => setText(e.target.value)}
            rows={6}
            style={{
              width: '100%',
              border: `1px dashed ${PALETTE.inkSoft}`,
              background: 'transparent',
              resize: 'vertical',
              outline: 'none',
              padding: 10,
              fontFamily: '"Kalam", cursive',
              fontSize: 15,
              color: PALETTE.ink,
              lineHeight: 1.5,
            }}
          />
          <input
            type="text"
            placeholder="signed, ____"
            value={author}
            onChange={(e) => setAuthor(e.target.value)}
            style={{
              ...inputStyle(),
              marginTop: 10,
              fontFamily: '"Caveat", cursive',
              fontSize: 20,
              background: 'transparent',
              border: 'none',
              borderBottom: `1px solid ${PALETTE.ink}`,
              borderRadius: 0,
              padding: '6px 0',
            }}
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
          <div style={{ marginTop: 12 }}>
            <Btn onClick={submit} full disabled={submitting}>
              {submitting ? 'tucking it in…' : "tuck it in Steph's memory book"}
            </Btn>
          </div>
        </div>
      )}

      {memories.length > 0 && (
        <div style={{ marginTop: 24 }}>
          <div
            style={{
              fontFamily: '"Courier Prime", monospace',
              fontSize: 10,
              letterSpacing: 2,
              color: PALETTE.inkSoft,
              textTransform: 'uppercase',
              marginBottom: 10,
            }}
          >
            collected memories
          </div>
          {memories.map((m, i) => (
            <div
              key={m.id}
              style={{
                background: i % 2 === 0 ? '#fff' : PALETTE.accent + '22',
                border: `1px solid ${PALETTE.inkSoft}44`,
                padding: 14,
                marginBottom: 10,
                transform: `rotate(${i % 2 ? 0.5 : -0.7}deg)`,
                boxShadow: '1px 2px 0 rgba(0,0,0,0.06)',
              }}
            >
              {m.prompt && (
                <div
                  style={{
                    fontFamily: '"Caveat", cursive',
                    fontSize: 18,
                    color: PALETTE.accent2,
                    marginBottom: 4,
                  }}
                >
                  {m.prompt}
                </div>
              )}
              <div
                style={{
                  fontFamily: '"Kalam", cursive',
                  fontSize: 14,
                  color: PALETTE.ink,
                  lineHeight: 1.5,
                }}
              >
                {m.body}
              </div>
              <div
                style={{
                  fontFamily: '"Caveat", cursive',
                  fontSize: 16,
                  color: PALETTE.inkSoft,
                  marginTop: 6,
                  textAlign: 'right',
                }}
              >
                — {m.author}
              </div>
            </div>
          ))}
        </div>
      )}
    </SectionWrap>
  );
}
