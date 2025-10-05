import React from 'react';
import { Atom, Beaker, Image } from 'lucide-react';

interface NavigationProps {
  currentPage: 'table' | 'playground' | 'analyzer' | 'quiz';
  onNavigate: (page: 'table' | 'playground' | 'analyzer' | 'quiz') => void;
}

export const Navigation: React.FC<NavigationProps> = ({ currentPage, onNavigate }) => {
  return (
    <header className="sticky top-0 z-50 bg-white/95 border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center h-16">
          {/* Left: Logo */}
          <div className="flex items-center mr-6">
            <div className="bg-gradient-to-br from-blue-500 to-purple-600 p-2 rounded-xl mr-3">
              <Atom className="h-6 w-6 text-white" />
            </div>
            <div>
              <div className="text-lg font-semibold text-slate-800">Sam's ChemLab</div>
            </div>
          </div>

          {/* Center: navigation links */}
          <nav className="flex-1 flex justify-center">
            <div className="inline-flex items-center space-x-3">
              {/** shared styles for nav buttons; active gets teal pill */}
              <button
                onClick={() => onNavigate('table')}
                aria-current={currentPage === 'table' ? 'page' : undefined}
                className={`px-3 py-2 rounded-md text-sm font-medium inline-flex items-center space-x-2 transition-transform transform ${currentPage === 'table' ? 'bg-teal-500 text-white shadow scale-100' : 'text-teal-700 hover:text-teal-900 hover:bg-teal-50 hover:scale-105'}`}>
                <span className="inline-flex items-center space-x-2"><Atom className="h-4 w-4" /><span>Periodic Table</span></span>
              </button>

              <button
                onClick={() => onNavigate('playground')}
                aria-current={currentPage === 'playground' ? 'page' : undefined}
                className={`px-3 py-2 rounded-md text-sm font-medium inline-flex items-center space-x-2 transition-transform transform ${currentPage === 'playground' ? 'bg-purple-600 text-white shadow scale-100' : 'text-purple-700 hover:text-purple-900 hover:bg-purple-50 hover:scale-105'}`}>
                <span className="inline-flex items-center space-x-2"><Beaker className="h-4 w-4" /><span>Playground</span></span>
              </button>

              <button
                onClick={() => onNavigate('analyzer')}
                aria-current={currentPage === 'analyzer' ? 'page' : undefined}
                className={`px-3 py-2 rounded-md text-sm font-medium inline-flex items-center space-x-2 transition-transform transform ${currentPage === 'analyzer' ? 'bg-orange-500 text-white shadow scale-100' : 'text-orange-700 hover:text-orange-900 hover:bg-orange-50 hover:scale-105'}`}>
                <span className="inline-flex items-center space-x-2"><Image className="h-4 w-4" /><span>Chemscan</span></span>
              </button>
              
              <button
                onClick={() => onNavigate('quiz')}
                aria-current={currentPage === 'quiz' ? 'page' : undefined}
                className={`px-3 py-2 rounded-md text-sm font-medium inline-flex items-center space-x-2 transition-transform transform ${currentPage === 'quiz' ? 'bg-indigo-600 text-white shadow scale-100' : 'text-indigo-700 hover:text-indigo-900 hover:bg-indigo-50 hover:scale-105'}`}>
                <span className="inline-flex items-center space-x-2"><Atom className="h-4 w-4" /><span>Quiz</span></span>
              </button>
            </div>
          </nav>

          <div className="ml-auto" />
          {/* Right: Quiz button */}
          {/* right-side pill removed to avoid duplicate Quiz button */}
        </div>
      </div>
    </header>
  );
};