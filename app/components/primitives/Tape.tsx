type Props = {
  color: string;
  rotate?: number;
  top?: number | string;
  left?: number | string;
  right?: number | string;
  width?: number;
};

export default function Tape({
  color,
  rotate = -6,
  top,
  left,
  right,
  width = 60,
}: Props) {
  return (
    <div
      style={{
        position: 'absolute',
        top,
        left,
        right,
        width,
        height: 20,
        background: color,
        transform: `rotate(${rotate}deg)`,
        boxShadow: '0 1px 2px rgba(0,0,0,0.06)',
        zIndex: 3,
        mixBlendMode: 'multiply',
      }}
    />
  );
}
