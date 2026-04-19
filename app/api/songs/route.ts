import { NextResponse, type NextRequest } from 'next/server';
import { supabaseService } from '@/lib/supabase-server';
import { isUnlocked } from '@/lib/passphrase';
import { getIp, rateLimit } from '@/lib/rate-limit';
import type { Song } from '@/lib/types';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

const MAX_TITLE = 200;
const MAX_ARTIST = 200;
const MAX_REQUESTER = 60;

export async function GET() {
  const sb = supabaseService();
  const { data, error } = await sb
    .from('songs')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(200);
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ songs: data });
}

export async function POST(req: NextRequest) {
  if (!isUnlocked(req)) {
    return NextResponse.json({ error: 'locked' }, { status: 401 });
  }
  const rl = await rateLimit(getIp(req), 'songs', 10);
  if (!rl.ok) {
    return NextResponse.json({ error: 'rate limited' }, { status: 429 });
  }

  let body: { title?: unknown; artist?: unknown; requested_by?: unknown };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: 'bad json' }, { status: 400 });
  }

  const title = typeof body.title === 'string' ? body.title.trim() : '';
  if (!title) {
    return NextResponse.json({ error: 'title required' }, { status: 400 });
  }
  const artistRaw = typeof body.artist === 'string' ? body.artist.trim() : '';
  const artist = artistRaw ? artistRaw.slice(0, MAX_ARTIST) : null;
  const requestedBy =
    (typeof body.requested_by === 'string' ? body.requested_by.trim() : '').slice(
      0,
      MAX_REQUESTER,
    ) || 'anonymous';

  const sb = supabaseService();
  const { data, error } = await sb
    .from('songs')
    .insert({
      title: title.slice(0, MAX_TITLE),
      artist,
      requested_by: requestedBy,
    })
    .select('*')
    .single();
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ song: data as Song });
}
