'use client';

import type { GuestbookEntry, Memory, Photo, Song } from '@/lib/types';
import { PALETTE } from '@/lib/palette';
import { UnlockProvider } from './components/UnlockProvider';
import Hero from './components/Hero';
import Countdown from './components/Countdown';
import DetailsSection from './components/DetailsSection';
import AboutSection from './components/AboutSection';
import PhotoWallSection from './components/PhotoWallSection';
import GuestBookSection from './components/GuestBookSection';
import MemorySection from './components/MemorySection';
import SongSection from './components/SongSection';
import Footer from './components/Footer';

type Props = {
  photos: Photo[];
  guestbook: GuestbookEntry[];
  memories: Memory[];
  songs: Song[];
};

export default function ScrapbookPage({ photos, guestbook, memories, songs }: Props) {
  return (
    <UnlockProvider>
      <div
        style={{
          background: PALETTE.paper,
          minHeight: '100vh',
          position: 'relative',
        }}
      >
        <Hero />
        <Countdown />
        <DetailsSection />
        <AboutSection />
        <PhotoWallSection initial={photos} />
        <GuestBookSection initial={guestbook} />
        <MemorySection initial={memories} />
        <SongSection initial={songs} />
        <Footer />
      </div>
    </UnlockProvider>
  );
}
