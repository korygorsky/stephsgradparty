'use client';

import { useState } from 'react';
import { PALETTE } from '@/lib/palette';
import type { Song } from '@/lib/types';
import SectionWrap from './SectionWrap';
import Tape from './primitives/Tape';
import Btn, { inputStyle } from './primitives/Btn';
import { useUnlock } from './UnlockProvider';
import { postJson } from './apiClient';

type Props = { initial: Song[] };

const PLACEHOLDERS: Song[] = [
  { id: -1, title: 'September', artist: 'Earth, Wind & Fire', requested_by: 'Jen', created_at: '' },
  { id: -2, title: 'Landslide', artist: 'Fleetwood Mac', requested_by: 'Mom', created_at: '' },
  { id: -3, title: 'Dancing Queen', artist: 'ABBA', requested_by: 'Marcus', created_at: '' },
];

export default function SongSection({ initial }: Props) {
  const { requireUnlock } = useUnlock();
  const [songs, setSongs] = useState<Song[]>(initial);
  const [title, setTitle] = useState('');
  const [artist, setArtist] = useState('');
  const [requester, setRequester] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const add = async () => {
    if (!title.trim() || submitting) return;
    const ok = await requireUnlock();
    if (!ok) return;
    setSubmitting(true);
    setError(null);
    const res = await postJson<{ song: Song }>('/api/songs', {
      title: title.trim(),
      artist: artist.trim(),
      requested_by: requester.trim(),
    });
    if (!res.ok) {
      setError(
        res.status === 429
          ? 'slow down — too many song requests'
          : 'couldn\u2019t queue that song. try again?',
      );
      setSubmitting(false);
      return;
    }
    setSongs((prev) => [res.data.song, ...prev]);
    setTitle('');
    setArtist('');
    setRequester('');
    setSubmitting(false);
  };

  const display = songs.length > 0 ? songs : PLACEHOLDERS;

  return (
    <SectionWrap title="The Playlist" subtitle="what should the patio be playing?">
      <div
        style={{
          background: '#fff',
          border: `1px solid ${PALETTE.inkSoft}44`,
          padding: 16,
          boxShadow: '2px 3px 0 rgba(0,0,0,0.08)',
        }}
      >
        <input
          type="text"
          placeholder="song title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          style={inputStyle()}
        />
        <input
          type="text"
          placeholder="artist"
          value={artist}
          onChange={(e) => setArtist(e.target.value)}
          style={{ ...inputStyle(), marginTop: 8 }}
        />
        <input
          type="text"
          placeholder="requested by"
          value={requester}
          onChange={(e) => setRequester(e.target.value)}
          style={{ ...inputStyle(), marginTop: 8 }}
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
        <div style={{ marginTop: 12, textAlign: 'right' }}>
          <Btn onClick={add} disabled={submitting}>
            {submitting ? 'adding…' : '+ add to queue'}
          </Btn>
        </div>
      </div>

      <div
        style={{
          marginTop: 20,
          background: '#fff',
          border: `1px solid ${PALETTE.inkSoft}44`,
          boxShadow: '2px 3px 0 rgba(0,0,0,0.08)',
          position: 'relative',
        }}
      >
        <Tape color={PALETTE.tape} top={-10} left="50%" rotate={2} width={80} />
        <div
          style={{
            padding: '14px 16px',
            borderBottom: `2px solid ${PALETTE.ink}`,
            textAlign: 'center',
            background: PALETTE.accent + '55',
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
            MIXTAPE · side A
          </div>
          <div
            style={{
              fontFamily: '"Caveat", cursive',
              fontSize: 28,
              fontWeight: 700,
              color: PALETTE.ink,
              lineHeight: 1,
              marginTop: 2,
            }}
          >
            For Steph ♡
          </div>
        </div>
        <div>
          {display.map((s, i) => (
            <div
              key={s.id}
              style={{
                padding: '12px 16px',
                borderBottom:
                  i < display.length - 1
                    ? `1px dashed ${PALETTE.inkSoft}55`
                    : 'none',
                display: 'flex',
                alignItems: 'center',
                gap: 12,
              }}
            >
              <div
                style={{
                  width: 24,
                  fontFamily: '"Courier Prime", monospace',
                  fontSize: 12,
                  color: PALETTE.inkSoft,
                }}
              >
                {String(i + 1).padStart(2, '0')}
              </div>
              <div style={{ flex: 1 }}>
                <div
                  style={{
                    fontFamily: '"Kalam", cursive',
                    fontSize: 15,
                    fontWeight: 700,
                    color: PALETTE.ink,
                    lineHeight: 1.2,
                  }}
                >
                  {s.title}
                </div>
                {s.artist && (
                  <div
                    style={{
                      fontFamily: '"Kalam", cursive',
                      fontSize: 12,
                      color: PALETTE.inkSoft,
                    }}
                  >
                    {s.artist}
                  </div>
                )}
              </div>
              <div
                style={{
                  fontFamily: '"Caveat", cursive',
                  fontSize: 16,
                  color: PALETTE.accent2,
                }}
              >
                — {s.requested_by}
              </div>
            </div>
          ))}
        </div>
      </div>
    </SectionWrap>
  );
}
