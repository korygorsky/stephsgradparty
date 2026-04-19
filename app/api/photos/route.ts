import { NextResponse, type NextRequest } from 'next/server';
import { randomUUID } from 'node:crypto';
import { PHOTO_BUCKET, supabaseService } from '@/lib/supabase-server';
import { isUnlocked } from '@/lib/passphrase';
import { getIp, rateLimit } from '@/lib/rate-limit';
import type { Photo } from '@/lib/types';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

const MAX_BYTES = 6 * 1024 * 1024;
const MAX_CAPTION = 200;
const MAX_NAME = 60;
const ALLOWED_TYPES = new Set(['image/jpeg', 'image/png', 'image/webp']);

export async function GET() {
  const sb = supabaseService();
  const { data, error } = await sb
    .from('photos')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(200);
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ photos: data });
}

export async function POST(req: NextRequest) {
  try {
    return await handlePost(req);
  } catch (err) {
    const e = err as Error & { cause?: unknown; statusCode?: unknown };
    console.error('[photos] THREW', {
      message: e?.message,
      name: e?.name,
      cause: e?.cause,
      statusCode: e?.statusCode,
      stack: e?.stack,
      raw: JSON.stringify(err, Object.getOwnPropertyNames(err ?? {})),
    });
    return NextResponse.json(
      { error: `threw: ${e?.message || e?.name || 'unknown error — see server log'}` },
      { status: 500 },
    );
  }
}

async function handlePost(req: NextRequest) {
  console.log('[photos] step: enter');
  if (!isUnlocked(req)) {
    return NextResponse.json({ error: 'locked' }, { status: 401 });
  }
  console.log('[photos] step: unlocked ok');

  try {
    const rl = await rateLimit(getIp(req), 'photos', 3);
    if (!rl.ok) {
      return NextResponse.json({ error: 'rate limited' }, { status: 429 });
    }
    console.log('[photos] step: rate-limit ok');
  } catch (err) {
    const e = err as { message?: string; code?: string; details?: string; hint?: string };
    console.error('[photos] rate-limit THREW', {
      message: e?.message,
      code: e?.code,
      details: e?.details,
      hint: e?.hint,
      raw: JSON.stringify(err, Object.getOwnPropertyNames(err ?? {})),
    });
    // Fail-open so rate_log issues don't block the upload path while we diagnose.
  }

  let form: FormData;
  try {
    form = await req.formData();
  } catch {
    return NextResponse.json({ error: 'bad form' }, { status: 400 });
  }
  console.log('[photos] step: formData parsed');

  const file = form.get('photo');
  if (!(file instanceof Blob)) {
    return NextResponse.json({ error: 'photo required' }, { status: 400 });
  }
  if (file.size > MAX_BYTES) {
    return NextResponse.json({ error: 'photo too large' }, { status: 413 });
  }
  const type = file.type || 'image/jpeg';
  if (!ALLOWED_TYPES.has(type)) {
    return NextResponse.json({ error: 'unsupported image type' }, { status: 415 });
  }

  const captionRaw = String(form.get('caption') ?? '').trim();
  const caption = captionRaw ? captionRaw.slice(0, MAX_CAPTION) : null;
  const name =
    String(form.get('name') ?? '')
      .trim()
      .slice(0, MAX_NAME) || 'anonymous';

  const ext = type === 'image/png' ? 'png' : type === 'image/webp' ? 'webp' : 'jpg';
  const filename = `${Date.now()}-${randomUUID()}.${ext}`;

  const buffer = Buffer.from(await file.arrayBuffer());
  console.log('[photos] uploading', { filename, type, bytes: buffer.length });

  // Bypass supabase-js storage client — hit the REST API directly so we can
  // see the raw HTTP status + body on failure.
  const supaUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;
  const uploadRes = await fetch(
    `${supaUrl}/storage/v1/object/${PHOTO_BUCKET}/${encodeURIComponent(filename)}`,
    {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${serviceKey}`,
        'Content-Type': type,
        'x-upsert': 'false',
      },
      body: buffer,
    },
  );
  if (!uploadRes.ok) {
    const bodyText = await uploadRes.text();
    console.error('[photos] storage HTTP', {
      status: uploadRes.status,
      statusText: uploadRes.statusText,
      body: bodyText.slice(0, 500),
    });
    const hint =
      uploadRes.status === 404
        ? `storage bucket "${PHOTO_BUCKET}" not found — create it in Supabase → Storage (public, see supabase/SETUP.md step 3)`
        : uploadRes.status === 401 || uploadRes.status === 403
          ? `auth rejected (${uploadRes.status}) — check SUPABASE_SERVICE_ROLE_KEY`
          : `HTTP ${uploadRes.status}: ${bodyText.slice(0, 200)}`;
    return NextResponse.json({ error: `upload: ${hint}` }, { status: 500 });
  }
  console.log('[photos] storage upload ok', { filename });

  const sb = supabaseService();
  const { data: publicData } = sb.storage.from(PHOTO_BUCKET).getPublicUrl(filename);
  const url = publicData.publicUrl;

  const rotation = (Math.random() - 0.5) * 10;
  const { data, error } = await sb
    .from('photos')
    .insert({ url, caption, name, rotation })
    .select('*')
    .single();
  if (error) {
    console.error('[photos] db insert failed', error);
    await sb.storage.from(PHOTO_BUCKET).remove([filename]);
    return NextResponse.json({ error: `db: ${error.message}` }, { status: 500 });
  }
  return NextResponse.json({ photo: data as Photo });
}
