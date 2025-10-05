import React, { useEffect } from 'react';

const COLORS = ['#ef4444','#f97316','#f59e0b','#10b981','#3b82f6','#8b5cf6'];

export const Confetti: React.FC<{count?: number}> = ({ count = 18 }) => {
  useEffect(() => {
    const timer = setTimeout(() => {}, 2200);
    return () => clearTimeout(timer);
  }, [count]);

  return (
    <div aria-hidden className="pointer-events-none fixed inset-0 z-60">
      {Array.from({ length: count }).map((_, i) => {
        const left = Math.round(Math.random() * 100);
        const delay = Math.round(Math.random() * 600);
        const color = COLORS[i % COLORS.length];
        const style: React.CSSProperties = {
          left: `${left}%`,
          top: `-10vh`,
          background: color,
          transform: `rotate(${Math.round(Math.random() * 360)}deg)`,
          animationDelay: `${delay}ms`,
        };
        return <div key={i} className="confetti-piece" style={style} />;
      })}
    </div>
  );
};

export default Confetti;
