export type Photo = {
  id: number;
  url: string;
  caption: string | null;
  name: string;
  rotation: number;
  created_at: string;
};

export type GuestbookEntry = {
  id: number;
  name: string;
  message: string;
  rotation: number;
  accent: boolean;
  created_at: string;
};

export type Memory = {
  id: number;
  prompt: string | null;
  body: string;
  author: string;
  created_at: string;
};

export type Song = {
  id: number;
  title: string;
  artist: string | null;
  requested_by: string;
  created_at: string;
};
