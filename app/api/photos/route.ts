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
  if (!isUnlocked(req)) {
    return NextResponse.json({ error: 'locked' }, { status: 401 });
  }
  const rl = await rateLimit(getIp(req), 'photos', 3);
  if (!rl.ok) {
    return NextResponse.json({ error: 'rate limited' }, { status: 429 });
  }

  let form: FormData;
  try {
    form = await req.formData();
  } catch {
    return NextResponse.json({ error: 'bad form' }, { status: 400 });
  }

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

  const sb = supabaseService();
  const arrayBuffer = await file.arrayBuffer();
  const { error: uploadError } = await sb.storage
    .from(PHOTO_BUCKET)
    .upload(filename, arrayBuffer, { contentType: type, upsert: false });
  if (uploadError) {
    console.error('[photos] storage upload failed', uploadError);
    const hint =
      /not found|does not exist/i.test(uploadError.message)
        ? `storage bucket "${PHOTO_BUCKET}" not found — create it in Supabase → Storage (public, see supabase/SETUP.md step 3)`
        : uploadError.message;
    return NextResponse.json({ error: `upload: ${hint}` }, { status: 500 });
  }

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
