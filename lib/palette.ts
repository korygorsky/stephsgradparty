export const PALETTE = {
  paper: '#faf7f0',
  ink: '#2b2a26',
  inkSoft: '#6b6860',
  accent: '#a8c4a2',
  accent2: '#d4a574',
  tape: 'rgba(255,220,120,0.55)',
} as const;

export type Palette = typeof PALETTE;
