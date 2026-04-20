'use client';

import { useRef, useState } from 'react';
import { track } from '@vercel/analytics';
import { PALETTE } from '@/lib/palette';
import type { Photo } from '@/lib/types';
import SectionWrap from './SectionWrap';
import Polaroid from './primitives/Polaroid';
import PhotoPlaceholder from './primitives/PhotoPlaceholder';
import Tape from './primitives/Tape';
import Btn, { inputStyle } from './primitives/Btn';
import { useUnlock } from './UnlockProvider';
import { postForm } from './apiClient';

type Props = { initial: Photo[] };

const PLACEHOLDERS: Array<{ caption: string; name: string; rot: number; placeholder: string }> = [
  { caption: 'first round', name: 'Jen', rot: -5, placeholder: 'patio sunset' },
  { caption: 'the toast', name: 'Marcus', rot: 3, placeholder: 'raised glasses' },
  { caption: '', name: 'anon', rot: -2, placeholder: 'crowd shot' },
  { caption: 'cake!', name: 'Dad', rot: 6, placeholder: 'cake & candles' },
];

export default function PhotoWallSection({ initial }: Props) {
  const { requireUnlock } = useUnlock();
  const [photos, setPhotos] = useState<Photo[]>(initial);
  const fileRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [caption, setCaption] = useState('');
  const [name, setName] = useState('');
  const [pendingBlob, setPendingBlob] = useState<Blob | null>(null);
  const [pendingUrl, setPendingUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const onFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    e.target.value = '';
    if (!file) return;

    const isHeic =
      /\.(heic|heif)$/i.test(file.name) ||
      /^image\/hei[cf]/i.test(file.type);
    if (isHeic) {
      setError(
        'HEIC photos aren\'t supported — in iPhone Settings → Camera → Formats, pick "Most Compatible", or share the pic and it\'ll convert to JPEG.',
      );
      setUploading(true);
      return;
    }

    const reader = new FileReader();
    reader.onerror = () => {
      setError('could not read that file — try a different photo');
      setUploading(true);
    };
    reader.onload = (ev) => {
      const img = new Image();
      img.onerror = () => {
        setError('that photo format isn\'t supported here — try JPEG or PNG');
        setUploading(true);
      };
      img.onload = () => {
        const maxW = 800;
        const scale = Math.min(1, maxW / img.width);
        const canvas = document.createElement('canvas');
        canvas.width = img.width * scale;
        canvas.height = img.height * scale;
        const ctx = canvas.getContext('2d');
        if (!ctx) {
          setError('browser couldn\'t process that image');
          setUploading(true);
          return;
        }
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
        canvas.toBlob(
          (blob) => {
            if (!blob) {
              setError('couldn\'t encode that image — try a different one');
              setUploading(true);
              return;
            }
            setPendingBlob(blob);
            setPendingUrl(URL.createObjectURL(blob));
            setUploading(true);
          },
          'image/jpeg',
          0.7,
        );
      };
      img.src = ev.target?.result as string;
    };
    reader.readAsDataURL(file);
  };

  const cancel = () => {
    if (pendingUrl) URL.revokeObjectURL(pendingUrl);
    setPendingBlob(null);
    setPendingUrl(null);
    setCaption('');
    setName('');
    setUploading(false);
    setError(null);
  };

  const publish = async () => {
    if (!pendingBlob || submitting) return;
    const ok = await requireUnlock();
    if (!ok) return;
    setSubmitting(true);
    setError(null);
    const form = new FormData();
    form.append('photo', pendingBlob, 'photo.jpg');
    form.append('caption', caption.trim());
    form.append('name', name.trim() || 'anonymous');
    const res = await postForm<{ photo: Photo }>('/api/photos', form);
    if (!res.ok) {
      if (res.status === 401) {
        setError('still locked — tap "pin it up" again to enter the word');
      } else if (res.status === 429) {
        setError('slow down a sec — too many uploads');
      } else {
        setError(`upload failed: ${res.message}`);
      }
      setSubmitting(false);
      return;
    }
    track('photo_published', { hasCaption: caption.trim().length > 0 });
    setPhotos((prev) => [res.data.photo, ...prev]);
    cancel();
    setSubmitting(false);
  };

  const hasReal = photos.length > 0;
  const display = hasReal
    ? photos
    : PLACEHOLDERS.map((p, i) => ({ ...p, id: -(i + 1) }));

  return (
    <SectionWrap title="The Photo Wall" subtitle="pin a picture to the board">
      {!uploading && (
        <div
          style={{
            border: `2px dashed ${PALETTE.ink}`,
            borderRadius: 8,
            padding: '22px 16px',
            textAlign: 'center',
            background: `${PALETTE.accent}22`,
          }}
        >
          <div
            style={{
              fontFamily: '"Caveat", cursive',
              fontSize: 24,
              fontWeight: 700,
              color: PALETTE.ink,
              lineHeight: 1,
            }}
          >
            got a photo?
          </div>
          <div
            style={{
              fontFamily: '"Kalam", cursive',
              fontSize: 13,
              color: PALETTE.inkSoft,
              marginTop: 4,
              marginBottom: 14,
            }}
          >
            tap below to add it to the party wall
          </div>
          <Btn
            onClick={() => {
              track('photo_started');
              fileRef.current?.click();
            }}
          >
            📸 snap or pick a pic
          </Btn>
          <input
            ref={fileRef}
            type="file"
            accept="image/*"
            onChange={onFile}
            style={{ display: 'none' }}
          />
        </div>
      )}

      {uploading && (
        <div
          style={{
            border: `2px solid ${PALETTE.ink}`,
            borderRadius: 8,
            padding: 14,
            background: PALETTE.paper,
          }}
        >
          <div
            style={{
              fontFamily: '"Caveat", cursive',
              fontSize: 22,
              fontWeight: 700,
              marginBottom: 10,
            }}
          >
            almost there...
          </div>
          {pendingUrl && (
            <Polaroid showTilt={false} style={{ marginBottom: 12 }}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={pendingUrl}
                alt="your upload preview"
                style={{ width: '100%', display: 'block', aspectRatio: '1', objectFit: 'cover' }}
              />
            </Polaroid>
          )}
          <input
            type="text"
            placeholder="your name (optional)"
            value={name}
            onChange={(e) => setName(e.target.value)}
            style={inputStyle()}
          />
          <input
            type="text"
            placeholder="caption (optional)"
            value={caption}
            onChange={(e) => setCaption(e.target.value)}
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
          <div style={{ display: 'flex', gap: 8, marginTop: 12 }}>
            <Btn onClick={cancel} variant="ghost" style={{ flex: 1 }} disabled={submitting}>
              cancel
            </Btn>
            <Btn
              onClick={publish}
              style={{ flex: 2 }}
              disabled={submitting || !pendingBlob}
            >
              {submitting ? 'pinning…' : 'pin it up ↗'}
            </Btn>
          </div>
        </div>
      )}

      <div
        style={{
          marginTop: 20,
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: 16,
          padding: '8px 4px',
        }}
      >
        {display.map((p, i) => {
          const isPlaceholder = !('url' in p) || !(p as Photo).url;
          const photo = p as Photo & { placeholder?: string };
          return (
            <div key={p.id} style={{ position: 'relative' }}>
              <Polaroid
                rotate={'rotation' in p ? photo.rotation : (p as { rot: number }).rot}
                caption={'caption' in p ? photo.caption ?? '' : ''}
              >
                {!isPlaceholder ? (
                  /* eslint-disable-next-line @next/next/no-img-element */
                  <img
                    src={photo.url}
                    alt={photo.caption ?? ''}
                    style={{
                      width: '100%',
                      display: 'block',
                      aspectRatio: '1',
                      objectFit: 'cover',
                    }}
                  />
                ) : (
                  <PhotoPlaceholder
                    label={(p as { placeholder?: string }).placeholder ?? ''}
                  />
                )}
                {i % 2 === 0 && <Tape color={PALETTE.tape} top={-8} left={30} rotate={-8} />}
                {i % 2 === 1 && <Tape color={PALETTE.tape} top={-8} right={20} rotate={10} />}
              </Polaroid>
              <div
                style={{
                  fontFamily: '"Kalam", cursive',
                  fontSize: 11,
                  color: PALETTE.inkSoft,
                  textAlign: 'center',
                  marginTop: 4,
                }}
              >
                — {'name' in p ? p.name : 'anon'}
              </div>
            </div>
          );
        })}
      </div>

      {!hasReal && (
        <div
          style={{
            marginTop: 14,
            fontFamily: '"Kalam", cursive',
            fontSize: 12,
            color: PALETTE.inkSoft,
            textAlign: 'center',
            fontStyle: 'italic',
          }}
        >
          (those are placeholders — your pic will be the first real one)
        </div>
      )}
    </SectionWrap>
  );
}
