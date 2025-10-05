import React from 'react';

export const Sparkle: React.FC<{ className?: string }> = ({ className = '' }) => (
  <svg className={`absolute inset-0 m-auto w-12 h-12 opacity-0 pointer-events-none animate-spark ${className}`} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <g stroke="white" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 2v4" />
      <path d="M12 18v4" />
      <path d="M4.93 4.93l2.83 2.83" />
      <path d="M16.24 16.24l2.83 2.83" />
      <path d="M2 12h4" />
      <path d="M18 12h4" />
      <path d="M4.93 19.07l2.83-2.83" />
      <path d="M16.24 7.76l2.83-2.83" />
    </g>
  </svg>
);

export default Sparkle;
