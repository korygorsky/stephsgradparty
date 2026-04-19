import type { CSSProperties, ReactNode } from 'react';
import { PALETTE } from '@/lib/palette';

type Props = {
  children: ReactNode;
  onClick?: () => void;
  variant?: 'primary' | 'ghost';
  full?: boolean;
  style?: CSSProperties;
  disabled?: boolean;
  type?: 'button' | 'submit';
};

export default function Btn({
  children,
  onClick,
  variant = 'primary',
  full,
  style,
  disabled,
  type = 'button',
}: Props) {
  const bg = variant === 'primary' ? PALETTE.ink : 'transparent';
  const fg = variant === 'primary' ? PALETTE.paper : PALETTE.ink;
  return (
    <button
      onClick={onClick}
      type={type}
      disabled={disabled}
      style={{
        background: bg,
        color: fg,
        border: `2px solid ${PALETTE.ink}`,
        borderRadius: 999,
        padding: '12px 22px',
        fontFamily: '"Kalam", cursive',
        fontSize: 16,
        fontWeight: 700,
        cursor: disabled ? 'not-allowed' : 'pointer',
        opacity: disabled ? 0.55 : 1,
        width: full ? '100%' : undefined,
        boxShadow: '2px 3px 0 rgba(0,0,0,0.12)',
        transform: 'rotate(-0.3deg)',
        ...style,
      }}
    >
      {children}
    </button>
  );
}

export function inputStyle(): CSSProperties {
  return {
    width: '100%',
    padding: '10px 12px',
    border: `1px solid ${PALETTE.inkSoft}88`,
    borderRadius: 4,
    fontFamily: '"Kalam", cursive',
    fontSize: 15,
    background: '#fff',
    color: PALETTE.ink,
    outline: 'none',
    boxSizing: 'border-box',
  };
}
