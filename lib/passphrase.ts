import type { NextRequest } from 'next/server';

export const UNLOCK_COOKIE = 'party_unlocked';
export const UNLOCK_HINT_COOKIE = 'party_has_unlocked';
export const UNLOCK_MAX_AGE_SECONDS = 60 * 60 * 24 * 30;

export function isUnlocked(req: NextRequest): boolean {
  return req.cookies.get(UNLOCK_COOKIE)?.value === '1';
}

export function passphraseMatches(candidate: string): boolean {
  const expected = process.env.PARTY_PASSPHRASE;
  if (!expected) return false;
  if (typeof candidate !== 'string') return false;
  if (candidate.length !== expected.length) return false;
  let diff = 0;
  for (let i = 0; i < expected.length; i++) {
    diff |= expected.charCodeAt(i) ^ candidate.charCodeAt(i);
  }
  return diff === 0;
}
