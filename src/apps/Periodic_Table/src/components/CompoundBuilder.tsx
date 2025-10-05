import React, { useState } from 'react';
import { elements } from '../data/elements';

type SlotItem = { symbol: string; count: number };

export const CompoundBuilder: React.FC = () => {
  const [slots, setSlots] = useState<SlotItem[]>([]);
  const [message, setMessage] = useState('Drag elements into the box to build a compound.');

  const onDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const symbol = e.dataTransfer.getData('text/plain');
    if (!symbol) return;
    setSlots(prev => {
      const found = prev.find(p => p.symbol === symbol);
      if (found) {
        return prev.map(p => p.symbol === symbol ? { ...p, count: p.count + 1 } : p);
      }
      return [...prev, { symbol, count: 1 }];
    });
  };

  const onDragOver = (e: React.DragEvent) => e.preventDefault();

  const reset = () => { setSlots([]); setMessage('Reset. Drag elements into the box.'); };

  const formula = slots.map(s => s.symbol + (s.count > 1 ? s.count : '')).join('');

  const simpleCheck = () => {
    if (!formula) { setMessage('Add elements first'); return; }
    // Very naive valence check for common compounds (demo only)
    if (formula === 'H2O') setMessage('Great — that is water!');
    else if (formula === 'NaCl') setMessage('Salt — sodium chloride.');
    else setMessage(`You formed ${formula}. (No balancing performed in demo)`);
  };

  return (
    <div className="p-6 bg-white rounded-xl shadow space-y-4">
      <h3 className="text-lg font-semibold">Compound Builder (demo)</h3>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <div className="h-64 overflow-auto p-2 border rounded">
            {elements.slice(0, 40).map(el => (
              <div
                key={el.atomicNumber}
                draggable
                onDragStart={(e) => e.dataTransfer.setData('text/plain', el.symbol)}
                className="p-2 mb-1 rounded bg-gray-100 cursor-grab"
              >
                <div className="font-bold">{el.symbol}</div>
                <div className="text-xs text-gray-600">{el.name}</div>
              </div>
            ))}
          </div>
        </div>
        <div>
          <div className="h-64 border rounded p-4 flex flex-col items-center justify-center" onDrop={onDrop} onDragOver={onDragOver}>
            {slots.length === 0 ? (
              <div className="text-gray-400">Drop elements here</div>
            ) : (
              <div className="text-center">
                <div className="text-lg font-semibold">{formula}</div>
                <div className="text-sm text-gray-600 mt-2">{slots.map(s => `${s.symbol} x${s.count}`).join(', ')}</div>
              </div>
            )}
          </div>
          <div className="mt-3 flex space-x-2">
            <button onClick={simpleCheck} className="px-3 py-1 bg-blue-600 text-white rounded">Check</button>
            <button onClick={reset} className="px-3 py-1 bg-gray-200 rounded">Reset</button>
          </div>
          <div className="text-sm text-gray-600 mt-3">{message}</div>
        </div>
      </div>
    </div>
  );
};

export default CompoundBuilder;
