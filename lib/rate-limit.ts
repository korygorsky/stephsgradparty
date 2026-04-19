import type { NextRequest } from 'next/server';
import { supabaseService } from './supabase-server';

export function getIp(req: NextRequest): string {
  const xff = req.headers.get('x-forwarded-for');
  if (xff) return xff.split(',')[0]!.trim();
  const real = req.headers.get('x-real-ip');
  if (real) return real.trim();
  return '0.0.0.0';
}

export async function rateLimit(
  ip: string,
  kind: string,
  maxPerMinute: number,
): Promise<{ ok: true } | { ok: false; retryAfter: number }> {
  const sb = supabaseService();
  const sinceIso = new Date(Date.now() - 60_000).toISOString();
  const { count, error } = await sb
    .from('rate_log')
    .select('*', { count: 'exact', head: true })
    .eq('ip', ip)
    .eq('kind', kind)
    .gte('at', sinceIso);
  if (error) throw error;
  if ((count ?? 0) >= maxPerMinute) {
    return { ok: false, retryAfter: 60 };
  }
  await sb.from('rate_log').insert({ ip, kind });
  return { ok: true };
}
