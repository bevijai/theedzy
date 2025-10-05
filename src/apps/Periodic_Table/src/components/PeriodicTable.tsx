import React, { useState, useMemo, useRef } from 'react';
import useFocusTrap from '../utils/useFocusTrap';
import { Search, Filter } from 'lucide-react';
import { Element, ElementCategory } from '../types/chemistry';
import { elements, elementCategories } from '../data/elements';
import { ElementModal } from './ElementModal';
// CompoundBuilder intentionally not imported here (moved to Playground)
import Sparkle from './Sparkle';
import FiltersAndCharts from './FiltersAndCharts';

interface PeriodicTableProps {
  // quiz modal removed: this component no longer accepts quizOpen/setQuizOpen
}

export const PeriodicTable: React.FC<PeriodicTableProps> = () => {
  // Feature flag: set to false to hide Filters & Charts while debugging
  const SHOW_FILTERS = false;
  const [selectedElement, setSelectedElement] = useState<Element | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<ElementCategory | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedMassRange, setSelectedMassRange] = useState<string | null>(null);
  // quiz modal removed
  const [builderOpen] = useState(false);
  const [filtersOpen, setFiltersOpen] = useState(false);
  const filtersCloseRef = useRef<HTMLButtonElement | null>(null);
  // quiz modal removed; drop quizContainerRef
  const builderContainerRef = useRef<HTMLDivElement | null>(null);
  const filtersContainerRef = useRef<HTMLDivElement | null>(null);

  // focus trap for quiz removed
  useFocusTrap(builderContainerRef, builderOpen);
  useFocusTrap(filtersContainerRef, filtersOpen);

  // header does not display quiz progress; progress kept inside Quiz modal/localStorage

  React.useEffect(() => {
    if (filtersOpen) {
      // move focus to close button for accessibility
      filtersCloseRef.current?.focus();
      const onKey = (e: KeyboardEvent) => {
        if (e.key === 'Escape') setFiltersOpen(false);
      };
      window.addEventListener('keydown', onKey);
      return () => window.removeEventListener('keydown', onKey);
    }
  }, [filtersOpen]);

  const displayedElements = useMemo(() => {
    let filtered = elements;

    // Category filter
    if (selectedCategory) {
      filtered = filtered.filter(element => element.category === selectedCategory);
    }

    // Mass range filter (format: "low-high")
    if (selectedMassRange) {
      const parts = selectedMassRange.split('-').map(s => parseFloat(s));
      if (parts.length === 2 && !Number.isNaN(parts[0]) && !Number.isNaN(parts[1])) {
        const low = parts[0];
        const high = parts[1];
        filtered = filtered.filter(el => el.atomicMass >= low && el.atomicMass < high);
      }
    }

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(element =>
        element.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        element.symbol.toLowerCase().includes(searchTerm.toLowerCase()) ||
        element.atomicNumber.toString().includes(searchTerm)
      );
    }

    return filtered;
  }, [searchTerm, selectedCategory, selectedMassRange]);

  const handleCategoryClick = (category: ElementCategory) => {
    setSelectedCategory(selectedCategory === category ? null : category);
  };

  const clearFilters = () => {
    setSelectedCategory(null);
    setSearchTerm('');
  };

  const createPeriodicTableGrid = (elementsToDisplay: Element[]) => {
    const grid: (Element | null)[][] = Array(10).fill(null).map(() => Array(18).fill(null));
    
    elementsToDisplay.forEach(element => {
      const row = element.position.row - 1;
      const col = element.position.col - 1;
      if (row < 10 && col < 18) {
        grid[row][col] = element;
      }
    });

    return grid;
  };

  const gridElements = (selectedCategory || searchTerm || selectedMassRange) ? displayedElements : elements;
  const grid = createPeriodicTableGrid(gridElements);

  const particleContainerRef = useRef<HTMLDivElement | null>(null);

  const handleElementClick = (element: Element) => {
    setSelectedElement(element);
    setModalOpen(true);
  };

  const spawnParticles = (container: HTMLDivElement | null) => {
    if (!container) return;
    const count = 6;
    for (let i = 0; i < count; i++) {
      const p = document.createElement('div');
      p.className = 'particle';
      p.style.background = 'rgba(255,255,255,0.9)';
      const angle = (Math.PI * 2 * i) / count;
      const dist = 24 + Math.random() * 16;
      p.style.setProperty('--dx', `${Math.cos(angle) * dist}px`);
      p.style.setProperty('--dy', `${Math.sin(angle) * dist}px`);
      container.appendChild(p);
      setTimeout(() => p.remove(), 700);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-4">
            Interactive Periodic Table
          </h1>
          <div className="mb-4 flex justify-center space-x-2">
            {SHOW_FILTERS && (
              <button onClick={() => setFiltersOpen(true)} className="px-3 py-1 bg-sky-600 text-white rounded-md">Filters & Charts</button>
            )}
          </div>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Explore the fundamental building blocks of matter. Click on any element to discover its properties, uses, and fascinating facts.
          </p>
        </div>

        {/* Search */}
        <div className="mb-8 max-w-md mx-auto">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
            <input
              type="text"
              placeholder="Search elements..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        </div>

        {/* Header controls: Filters button (opens modal) */}
  {/* Removed duplicate Filters & Charts button */}

        {/* Legend */}
        <div className="mb-8 bg-white/70 backdrop-blur-sm rounded-2xl p-6 shadow-lg">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold text-gray-800 flex items-center">
              <Filter className="h-5 w-5 mr-2" />
              Element Categories
            </h3>
            {(selectedCategory || searchTerm) && (
              <button
                onClick={clearFilters}
                className="px-3 py-1 text-sm bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
              >
                Show All
              </button>
            )}
          </div>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
            {Object.entries(elementCategories).map(([key, name]) => {
              const exampleElement = elements.find(e => e.category === key);
              if (!exampleElement) return null;
              
              const isSelected = selectedCategory === key;
              
              return (
                <button
                  key={key}
                  onClick={() => handleCategoryClick(key as ElementCategory)}
                  className={`flex items-center space-x-2 p-2 rounded-lg transition-all duration-200 hover:bg-gray-100 ${
                    isSelected ? 'bg-blue-100 border-2 border-blue-300' : 'border-2 border-transparent'
                  }`}
                >
                  <div 
                    className="w-4 h-4 rounded-full"
                    style={{ backgroundColor: exampleElement.color }}
                  />
                  <span className="text-sm text-gray-700">{name}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Search Results (if searching) */}
        {(searchTerm || selectedCategory) && (
          <div className="mb-8 bg-white/70 backdrop-blur-sm rounded-2xl p-6 shadow-lg">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">
              {searchTerm ? 'Search Results' : `${elementCategories[selectedCategory!]}`} ({displayedElements.length})
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-3">
              {displayedElements.map(element => (
                <button
                  key={element.atomicNumber}
                  onClick={() => handleElementClick(element)}
                  className="p-3 rounded-lg transition-all duration-200 hover:scale-105 hover:shadow-lg text-white font-semibold"
                  style={{ backgroundColor: element.color }}
                >
                  <div className="text-xs">{element.atomicNumber}</div>
                  <div className="text-lg font-bold">{element.symbol}</div>
                  <div className="text-xs truncate">{element.name}</div>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Periodic Table Grid */}
        <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-6 shadow-lg overflow-x-auto relative">
          {/* subtle chemistry lab SVG pattern */}
          <svg className="pointer-events-none absolute inset-0 w-full h-full opacity-6 mix-blend-overlay" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="xMidYMid slice">
            <defs>
              <pattern id="lab" width="120" height="120" patternUnits="userSpaceOnUse">
                <g fill="none" stroke="#e6eef8" strokeWidth="0.8" opacity="0.6">
                  <rect x="6" y="10" width="44" height="24" rx="4" />
                  <path d="M8 10c6-8 34-8 44 0" />
                  <circle cx="92" cy="24" r="10" />
                  <path d="M74 10v36" />
                </g>
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#lab)" />
          </svg>
          <div className="min-w-[1000px]" ref={particleContainerRef}>
            {grid.map((row, rowIndex) => (
              <div key={rowIndex} className="flex mb-1">
                {row.map((element, colIndex) => (
                  <div key={`${rowIndex}-${colIndex}`} className="w-14 h-16 m-0.5">
                        {element ? (
                          <button
                            onClick={(e) => { handleElementClick(element); spawnParticles(particleContainerRef.current); (e.currentTarget as HTMLElement).classList.add('animate-click-pop'); setTimeout(()=> (e.currentTarget as HTMLElement).classList.remove('animate-click-pop'), 300); }}
                            className="w-full h-full rounded-lg transition-all duration-200 hover:scale-105 hover:shadow-lg text-white font-semibold text-xs relative group overflow-hidden"
                            style={{ backgroundColor: element.color }}
                          >
                            <div className="absolute top-1 left-1 text-xs opacity-80">
                              {element.atomicNumber}
                            </div>
                            <div className="text-lg font-bold mt-1">{element.symbol}</div>
                            <div className="text-xs truncate px-1">{element.name}</div>
                        
                            {/* Tooltip */}
                            <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 bg-black text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap pointer-events-none z-10">
                              {element.name}
                            </div>
                            {/* Sparkle placeholder - animation plays when added */}
                            <Sparkle />
                          </button>
                        ) : null}
                  </div>
                ))}
              </div>
            ))}
          </div>
        </div>

        {/* Modal */}
        {selectedElement && (
          <ElementModal
            element={selectedElement}
            isOpen={modalOpen}
            onClose={() => setModalOpen(false)}
          />
        )}
  {/* Quiz is now a dedicated page; modal removed. */}
  {/* CompoundBuilder modal removed; use Playground page for compound building */}
  {SHOW_FILTERS && filtersOpen && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-60 p-4" role="dialog" aria-modal="true" aria-labelledby="filters-modal-title" onClick={() => setFiltersOpen(false)}>
            <div ref={filtersContainerRef} className="bg-white rounded-xl p-4 max-w-3xl w-full text-gray-900 dark:text-gray-100 dark:bg-gray-800/95" onClick={(e) => e.stopPropagation()}>
              <div className="flex justify-between items-center mb-4">
                <h2 id="filters-modal-title" className="font-semibold">Filters & Charts</h2>
                <button ref={filtersCloseRef} onClick={() => setFiltersOpen(false)} className="px-2 py-1 rounded bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-100">Close</button>
              </div>
              <FiltersAndCharts elements={elements} onCategorySelect={(cat) => setSelectedCategory(cat as any)} onMassSelect={(r) => setSelectedMassRange(r)} />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};