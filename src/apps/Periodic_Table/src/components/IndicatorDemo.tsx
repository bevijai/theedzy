import React, { useState } from 'react';

interface Props {
  initial?: number; // pH 0-14
}

const phToColor = (ph: number) => {
  // Simple universal indicator mapping (approx)
  if (ph <= 1) return '#b30000';
  if (ph <= 3) return '#ff4500';
  if (ph <= 6) return '#ffd700';
  if (ph <= 8) return '#7fff00';
  if (ph <= 11) return '#00bfff';
  return '#800080';
};

export const IndicatorDemo: React.FC<Props> = ({ initial = 7 }) => {
  const [ph, setPh] = useState<number>(initial);

  return (
    <div className="space-y-3">
      <div className="flex items-center space-x-4">
        <div className="w-48 h-6 rounded-md overflow-hidden shadow-inner" style={{ background: `linear-gradient(90deg, ${Array.from({length:15}).map((_,i)=>phToColor(i)).join(',')})` }} />
        <div className="text-sm text-gray-700">pH: <span className="font-mono">{ph}</span></div>
      </div>

      <input
        type="range"
        min={0}
        max={14}
        value={ph}
        onChange={(e) => setPh(Number(e.target.value))}
        className="w-full"
      />

      <div className="flex space-x-2">
        <button onClick={() => setPh(1)} className="px-3 py-1 bg-red-600 text-white rounded-md">Strong Acid</button>
        <button onClick={() => setPh(4)} className="px-3 py-1 bg-orange-500 text-white rounded-md">Weak Acid</button>
        <button onClick={() => setPh(7)} className="px-3 py-1 bg-gray-300 text-gray-800 rounded-md">Neutral</button>
        <button onClick={() => setPh(10)} className="px-3 py-1 bg-blue-500 text-white rounded-md">Weak Base</button>
        <button onClick={() => setPh(13)} className="px-3 py-1 bg-purple-600 text-white rounded-md">Strong Base</button>
      </div>

      <div className="text-xs text-gray-600 mt-2">Universal indicator color shown above. Litmus: {ph < 7 ? 'Red' : ph > 7 ? 'Blue' : 'No change'}</div>
    </div>
  );
};

export default IndicatorDemo;
