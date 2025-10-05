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
    // Add custom CSS to hide only Sam's ChemLab branding, keep navigation buttons
    const style = document.createElement('style');
    style.textContent = `
      /* Hide only the left side with Sam's ChemLab logo and title */
      #periodic-table-root header .flex.items-center.mr-6 {
        display: none !important;
      }
      
      /* Alternatively, hide the entire header and show only nav buttons */
      #periodic-table-root header {
        background: transparent !important;
        border: none !important;
        box-shadow: none !important;
      }
      
      /* Style the navigation buttons to integrate better */
      #periodic-table-root nav {
        background: rgba(255, 255, 255, 0.9) !important;
        backdrop-filter: blur(10px) !important;
        padding: 0.75rem !important;
        border-radius: 1rem !important;
        margin: 1rem auto !important;
        width: fit-content !important;
        box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1) !important;
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