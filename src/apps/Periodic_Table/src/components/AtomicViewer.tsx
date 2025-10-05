import React, { Suspense } from 'react';

const LazyViewer = React.lazy(() => import('./AtomicViewerLazy'));

export const AtomicViewer: React.FC<{ electrons?: number; symbol?: string }> = ({ electrons = 1, symbol }) => {
  return (
    <div className="w-full h-64 bg-gray-50 rounded-lg overflow-hidden">
      <Suspense fallback={<div className="flex items-center justify-center h-full">Loading 3D viewer...</div>}>
        <LazyViewer electrons={electrons} symbol={symbol} />
      </Suspense>
    </div>
  );
};

export default AtomicViewer;
