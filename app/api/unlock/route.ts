import { NextResponse, type NextRequest } from 'next/server';
import {
  UNLOCK_COOKIE,
  UNLOCK_HINT_COOKIE,
  UNLOCK_MAX_AGE_SECONDS,
  passphraseMatches,
} from '@/lib/passphrase';

export const runtime = 'nodejs';

export async function POST(req: NextRequest) {
  let body: { passphrase?: unknown };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: 'bad json' }, { status: 400 });
  }
  const candidate = typeof body.passphrase === 'string' ? body.passphrase : '';
  if (!passphraseMatches(candidate)) {
    return NextResponse.json({ error: 'wrong passphrase' }, { status: 401 });
  }

  const res = NextResponse.json({ ok: true });
  const common = {
    path: '/',
    sameSite: 'lax' as const,
    secure: process.env.NODE_ENV === 'production',
    maxAge: UNLOCK_MAX_AGE_SECONDS,
  };
  res.cookies.set(UNLOCK_COOKIE, '1', { ...common, httpOnly: true });
  res.cookies.set(UNLOCK_HINT_COOKIE, '1', { ...common, httpOnly: false });
  return res;
}
