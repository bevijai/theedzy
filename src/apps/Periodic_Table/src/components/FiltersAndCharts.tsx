import React, { useMemo } from 'react';
import { Chart as ChartJS, BarElement, CategoryScale, LinearScale, Tooltip, Legend } from 'chart.js';
import { Bar } from 'react-chartjs-2';
import { Element } from '../types/chemistry';

ChartJS.register(BarElement, CategoryScale, LinearScale, Tooltip, Legend);

interface Props {
  elements: Element[];
  onCategorySelect?: (category: string | null) => void;
  onMassSelect?: (range: string | null) => void;
}

const FiltersAndCharts: React.FC<Props> = ({ elements, onCategorySelect, onMassSelect }) => {
  const categoryCounts = useMemo(() => {
    const counts: Record<string, number> = {};
    elements.forEach(e => {
      counts[e.category] = (counts[e.category] || 0) + 1;
    });
    return counts;
  }, [elements]);

  const massBuckets = useMemo(() => {
    const buckets: Record<string, number> = {};
    const step = 20;
    elements.forEach(e => {
      const bucket = `${Math.floor(e.atomicMass / step) * step}-${Math.floor(e.atomicMass / step) * step + step}`;
      buckets[bucket] = (buckets[bucket] || 0) + 1;
    });
    return buckets;
  }, [elements]);

  const categoryData = {
    labels: Object.keys(categoryCounts),
    datasets: [
      {
        label: 'Count by Category',
        data: Object.values(categoryCounts),
        backgroundColor: 'rgba(59,130,246,0.7)'
      }
    ]
  };

  const massData = {
    labels: Object.keys(massBuckets),
    datasets: [
      {
        label: 'Atomic Mass distribution',
        data: Object.values(massBuckets),
        backgroundColor: 'rgba(16,185,129,0.7)'
      }
    ]
  };

  const optionsForCategory: any = {
  onClick: (_evt: any, elementsClicked: any[]) => {
      if (!elementsClicked.length) return;
      const idx = elementsClicked[0].index;
      const label = categoryData.labels[idx];
      onCategorySelect?.(label as any);
    },
    plugins: { legend: { display: false } },
    aria: { enabled: true, label: 'Category counts bar chart' }
  };

  const optionsForMass: any = {
    onClick: (_evt: any, elementsClicked: any[]) => {
      if (!elementsClicked.length) return;
      const idx = elementsClicked[0].index;
      const label = Object.keys(massBuckets)[idx];
      onMassSelect?.(label as any);
    },
    plugins: { legend: { display: false } },
    aria: { enabled: true, label: 'Atomic mass distribution histogram' }
  };

  // Sorted lists for accessibility
  const sortedCategories = Object.keys(categoryCounts).sort((a, b) => categoryCounts[b] - categoryCounts[a]);
  const sortedMassBuckets = Object.keys(massBuckets).sort((a, b) => {
    const pa = parseInt(a.split('-')[0], 10);
    const pb = parseInt(b.split('-')[0], 10);
    return pa - pb;
  });

  return (
    <div className="mb-6 bg-white/80 rounded-xl p-4 shadow-sm dark:bg-gray-900/80 dark:border dark:border-gray-700">
      <h3 className="text-lg font-semibold mb-3 text-gray-900 dark:text-gray-100">Filters & Charts</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <h4 className="font-medium text-sm mb-2">Categories (keyboard accessible)</h4>
          <ul className="flex flex-wrap gap-2" role="list" aria-label="Categories list">
            {sortedCategories.map(cat => (
              <li key={cat}>
                <button
                  onClick={() => onCategorySelect?.(cat)}
                  onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') onCategorySelect?.(cat); }}
                  className="px-2 py-1 bg-gray-100 rounded text-sm text-gray-800 dark:bg-gray-700 dark:text-gray-100"
                  aria-pressed="false"
                  tabIndex={0}
                >
                  {cat} ({categoryCounts[cat]})
                </button>
              </li>
            ))}
            <li>
              <button onClick={() => onCategorySelect?.(null)} className="px-2 py-1 bg-gray-50 rounded text-sm text-gray-800 dark:bg-gray-700 dark:text-gray-100">Show All</button>
            </li>
          </ul>
        </div>
        <div className="bg-transparent">
          <Bar data={categoryData} options={optionsForCategory} aria-label="Category chart" />
        </div>

        <div className="md:col-span-2">
      <h4 className="font-medium text-sm mb-2 text-gray-900 dark:text-gray-100">Atomic mass ranges (keyboard accessible)</h4>
          <div className="flex flex-col md:flex-row md:items-start md:space-x-4">
            <ul className="space-y-2 md:w-1/3" role="list" aria-label="Mass ranges list">
              {sortedMassBuckets.map(bucket => (
                <li key={bucket}>
                  <button
                    onClick={() => onMassSelect?.(bucket)}
                    onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') onMassSelect?.(bucket); }}
          className="w-full text-left px-2 py-1 bg-gray-100 rounded text-sm text-gray-800 dark:bg-gray-700 dark:text-gray-100"
                    tabIndex={0}
                  >
                    {bucket} ({massBuckets[bucket]})
                  </button>
                </li>
              ))}
              <li>
        <button onClick={() => onMassSelect?.(null)} className="px-2 py-1 bg-gray-50 rounded text-sm text-gray-800 dark:bg-gray-700 dark:text-gray-100">Show All Ranges</button>
              </li>
            </ul>
            <div className="md:flex-1">
              <Bar data={massData} options={optionsForMass} aria-label="Mass distribution chart" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FiltersAndCharts;
