import { NextResponse, type NextRequest } from 'next/server';
import { supabaseService } from '@/lib/supabase-server';
import { isUnlocked } from '@/lib/passphrase';
import { getIp, rateLimit } from '@/lib/rate-limit';
import type { GuestbookEntry } from '@/lib/types';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

const MAX_MESSAGE = 800;
const MAX_NAME = 60;

export async function GET() {
  const sb = supabaseService();
  const { data, error } = await sb
    .from('guestbook_entries')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(200);
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ entries: data });
}

export async function POST(req: NextRequest) {
  if (!isUnlocked(req)) {
    return NextResponse.json({ error: 'locked' }, { status: 401 });
  }
  const rl = await rateLimit(getIp(req), 'guestbook', 5);
  if (!rl.ok) {
    return NextResponse.json({ error: 'rate limited' }, { status: 429 });
  }

  let body: { name?: unknown; message?: unknown };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: 'bad json' }, { status: 400 });
  }

  const name =
    (typeof body.name === 'string' ? body.name.trim() : '').slice(0, MAX_NAME) ||
    'anonymous';
  const message = typeof body.message === 'string' ? body.message.trim() : '';
  if (!message) {
    return NextResponse.json({ error: 'message required' }, { status: 400 });
  }
  if (message.length > MAX_MESSAGE) {
    return NextResponse.json({ error: 'message too long' }, { status: 400 });
  }

  const rotation = (Math.random() - 0.5) * 4;
  const accent = Math.random() > 0.7;

  const sb = supabaseService();
  const { data, error } = await sb
    .from('guestbook_entries')
    .insert({ name, message: message.slice(0, MAX_MESSAGE), rotation, accent })
    .select('*')
    .single();
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ entry: data as GuestbookEntry });
}
