import { NextResponse, type NextRequest } from 'next/server';
import { supabaseService } from '@/lib/supabase-server';
import { isUnlocked } from '@/lib/passphrase';
import { getIp, rateLimit } from '@/lib/rate-limit';
import type { Memory } from '@/lib/types';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

const MAX_BODY = 2000;
const MAX_PROMPT = 200;
const MAX_AUTHOR = 60;

export async function GET() {
  const sb = supabaseService();
  const { data, error } = await sb
    .from('memories')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(200);
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ memories: data });
}

export async function POST(req: NextRequest) {
  if (!isUnlocked(req)) {
    return NextResponse.json({ error: 'locked' }, { status: 401 });
  }
  const rl = await rateLimit(getIp(req), 'memories', 5);
  if (!rl.ok) {
    return NextResponse.json({ error: 'rate limited' }, { status: 429 });
  }

  let body: { prompt?: unknown; body?: unknown; author?: unknown };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: 'bad json' }, { status: 400 });
  }

  const promptRaw = typeof body.prompt === 'string' ? body.prompt.trim() : '';
  const prompt = promptRaw ? promptRaw.slice(0, MAX_PROMPT) : null;
  const text = typeof body.body === 'string' ? body.body.trim() : '';
  if (!text) {
    return NextResponse.json({ error: 'body required' }, { status: 400 });
  }
  const author =
    (typeof body.author === 'string' ? body.author.trim() : '').slice(0, MAX_AUTHOR) ||
    'anonymous';

  const sb = supabaseService();
  const { data, error } = await sb
    .from('memories')
    .insert({ prompt, body: text.slice(0, MAX_BODY), author })
    .select('*')
    .single();
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ memory: data as Memory });
}
