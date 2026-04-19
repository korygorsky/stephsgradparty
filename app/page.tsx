import ScrapbookPage from './ScrapbookPage';
import { hasSupabaseEnv, supabaseAnon } from '@/lib/supabase-server';
import type { GuestbookEntry, Memory, Photo, Song } from '@/lib/types';

export const dynamic = 'force-dynamic';

async function loadInitial(): Promise<{
  photos: Photo[];
  guestbook: GuestbookEntry[];
  memories: Memory[];
  songs: Song[];
}> {
  if (!hasSupabaseEnv()) {
    return { photos: [], guestbook: [], memories: [], songs: [] };
  }
  const sb = supabaseAnon();
  const [photos, guestbook, memories, songs] = await Promise.all([
    sb.from('photos').select('*').order('created_at', { ascending: false }).limit(60),
    sb.from('guestbook_entries').select('*').order('created_at', { ascending: false }).limit(100),
    sb.from('memories').select('*').order('created_at', { ascending: false }).limit(100),
    sb.from('songs').select('*').order('created_at', { ascending: false }).limit(100),
  ]);
  return {
    photos: (photos.data ?? []) as Photo[],
    guestbook: (guestbook.data ?? []) as GuestbookEntry[],
    memories: (memories.data ?? []) as Memory[],
    songs: (songs.data ?? []) as Song[],
  };
}

export default async function Page() {
  const initial = await loadInitial();
  return (
    <div className="page">
      <ScrapbookPage {...initial} />
    </div>
  );
}
