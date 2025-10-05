import { useEffect } from 'react';
// Import the main periodic table app
import PeriodicTableApp from '../apps/Periodic_Table/src/App';

// Import the CSS from the periodic table app
import '../apps/Periodic_Table/src/index.css';

export default function InteractivePeriodicTable() {
  useEffect(() => {
    // Add custom CSS to hide the periodic table's navigation
    const style = document.createElement('style');
    style.textContent = `
      #periodic-table-root nav {
        display: none !important;
      }
      #periodic-table-root .navigation-container {
        display: none !important;
      }
      /* Hide Sam's ChemLab header */
      #periodic-table-root header {
        display: none !important;
      }
    `;
    document.head.appendChild(style);

    return () => {
      // Cleanup on component unmount
      document.head.removeChild(style);
    };
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-teal-50 to-cyan-50">
      {/* TheEdzy-branded header for the periodic table */}
      <div className="bg-white/80 backdrop-blur-xl shadow-sm border-b border-gray-100 py-4">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <div className="w-12 h-12 bg-gradient-to-br from-emerald-500 to-teal-500 rounded-2xl flex items-center justify-center shadow-lg mr-4">
                <span className="text-2xl">🧪</span>
              </div>
              <div>
                <h1 className="text-2xl font-black text-gray-900">Interactive Periodic Table</h1>
                <p className="text-sm text-gray-600">Powered by TheEdzy</p>
              </div>
            </div>
            <div className="flex items-center space-x-4 text-sm text-gray-600">
              <span className="px-3 py-1 bg-emerald-100 text-emerald-700 rounded-full font-medium">Chemistry</span>
              <span className="px-3 py-1 bg-teal-100 text-teal-700 rounded-full font-medium">Interactive</span>
            </div>
          </div>
        </div>
      </div>

      {/* Wrapper div to ensure proper styling */}
      <div id="periodic-table-root" className="pt-0">
        <PeriodicTableApp />
      </div>
    </div>
  );
}