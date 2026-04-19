import type { CSSProperties, ReactNode } from 'react';
import { PALETTE } from '@/lib/palette';

type Props = {
  children: ReactNode;
  rotate?: number;
  caption?: string;
  style?: CSSProperties;
  onClick?: () => void;
  showTilt?: boolean;
};

export default function Polaroid({
  children,
  rotate = 0,
  caption,
  style,
  onClick,
  showTilt = true,
}: Props) {
  return (
    <div
      onClick={onClick}
      style={{
        background: '#fff',
        padding: '10px 10px 36px',
        border: `1px solid ${PALETTE.inkSoft}33`,
        boxShadow:
          '0 2px 8px rgba(0,0,0,0.12), 0 6px 20px rgba(0,0,0,0.06)',
        transform: showTilt ? `rotate(${rotate}deg)` : 'rotate(0deg)',
        position: 'relative',
        cursor: onClick ? 'pointer' : 'default',
        transition: 'transform 0.2s',
        ...style,
      }}
    >
      {children}
      {caption && (
        <div
          style={{
            position: 'absolute',
            bottom: 8,
            left: 12,
            right: 12,
            fontFamily: '"Caveat", cursive',
            fontSize: 16,
            color: PALETTE.ink,
            textAlign: 'center',
            lineHeight: 1,
            whiteSpace: 'nowrap',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
          }}
        >
          {caption}
        </div>
      )}
    </div>
  );
}
