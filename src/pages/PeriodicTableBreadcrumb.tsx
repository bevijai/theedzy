import { useEffect } from 'react';
import { ChevronRight, Home, Beaker } from 'lucide-react';

// Import the main periodic table app
import PeriodicTableApp from '../apps/Periodic_Table/src/App';

// Import the CSS from the periodic table app
import '../apps/Periodic_Table/src/index.css';

interface PeriodicTableBreadcrumbProps {
  onNavigateHome?: () => void;
  onNavigateApps?: () => void;
}

export default function PeriodicTableBreadcrumb({ onNavigateHome, onNavigateApps }: PeriodicTableBreadcrumbProps) {
  useEffect(() => {
    // Add custom CSS to hide the periodic table's navigation
    const style = document.createElement('style');
    style.textContent = `
      #periodic-table-root nav,
      #periodic-table-root header {
        display: none !important;
      }
    `;
    document.head.appendChild(style);

    return () => {
      document.head.removeChild(style);
    };
  }, []);

  return (
    <div className="min-h-screen">
      {/* Breadcrumb Navigation */}
      <div className="bg-gradient-to-r from-emerald-500 to-teal-500 text-white shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
          <div className="flex items-center text-sm">
            <button 
              onClick={onNavigateHome}
              className="flex items-center hover:text-emerald-200 transition-colors"
            >
              <Home className="w-4 h-4 mr-1" />
              TheEdzy
            </button>
            <ChevronRight className="w-4 h-4 mx-2 text-emerald-200" />
            <button 
              onClick={onNavigateApps}
              className="hover:text-emerald-200 transition-colors"
            >
              Apps
            </button>
            <ChevronRight className="w-4 h-4 mx-2 text-emerald-200" />
            <span className="flex items-center font-semibold">
              <Beaker className="w-4 h-4 mr-1" />
              Interactive Periodic Table
            </span>
          </div>
        </div>
      </div>

      {/* Periodic Table Content */}
      <div id="periodic-table-root">
        <PeriodicTableApp />
      </div>
    </div>
  );
}