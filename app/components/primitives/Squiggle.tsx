type Props = { w?: number; color: string };

export function Squiggle({ w = 120, color }: Props) {
  return (
    <svg width={w} height="12" viewBox={`0 0 ${w} 12`} style={{ display: 'block' }}>
      <path
        d={`M0 6 Q ${w * 0.125} 0, ${w * 0.25} 6 T ${w * 0.5} 6 T ${w * 0.75} 6 T ${w} 6`}
        fill="none"
        stroke={color}
        strokeWidth="2"
        strokeLinecap="round"
      />
    </svg>
  );
}

export function Squiggle2({ w = 200, color }: Props) {
  return (
    <svg width={w} height="20" viewBox={`0 0 ${w} 20`} style={{ display: 'block' }}>
      <path
        d={`M0 10 Q ${w * 0.1} 2, ${w * 0.2} 10 T ${w * 0.4} 10 T ${w * 0.6} 10 T ${w * 0.8} 10 T ${w} 10`}
        fill="none"
        stroke={color}
        strokeWidth="2.5"
        strokeLinecap="round"
      />
    </svg>
  );
}
