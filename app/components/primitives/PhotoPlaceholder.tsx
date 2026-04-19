import { PALETTE } from '@/lib/palette';

type Props = { label?: string; aspectRatio?: string };

export default function PhotoPlaceholder({ label = '', aspectRatio = '1' }: Props) {
  return (
    <div
      style={{
        aspectRatio,
        background: `repeating-linear-gradient(135deg, ${PALETTE.paper} 0 10px, ${PALETTE.inkSoft}1f 10px 11px)`,
        border: `1px solid ${PALETTE.inkSoft}44`,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontFamily: '"Kalam", cursive',
        fontSize: 12,
        color: PALETTE.inkSoft,
        padding: 8,
        textAlign: 'center',
        lineHeight: 1.3,
      }}
    >
      {label}
    </div>
  );
}
