import { useEffect } from 'react';
import { Sparkles, Beaker } from 'lucide-react';

// Import the main periodic table app
import PeriodicTableApp from '../apps/Periodic_Table/src/App';

// Import the CSS from the periodic table app
import '../apps/Periodic_Table/src/index.css';

export default function PeriodicTableSideBySide() {
  useEffect(() => {
    // Modify the periodic table's navigation instead of hiding it
    const style = document.createElement('style');
    style.textContent = `
      /* Style the Sam's ChemLab navigation to look different */
      #periodic-table-root nav {
        background: linear-gradient(135deg, #10b981, #14b8a6) !important;
        border-radius: 0 0 1rem 1rem !important;
        margin: 0 1rem !important;
        box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1) !important;
      }
      
      #periodic-table-root nav h1,
      #periodic-table-root nav .logo {
        color: white !important;
        font-size: 1.125rem !important;
      }
      
      #periodic-table-root nav button {
        color: rgba(255, 255, 255, 0.9) !important;
        border: 1px solid rgba(255, 255, 255, 0.2) !important;
      }
      
      #periodic-table-root nav button:hover {
        background: rgba(255, 255, 255, 0.1) !important;
        color: white !important;
      }
    `;
    document.head.appendChild(style);

    return () => {
      document.head.removeChild(style);
    };
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* TheEdzy Main Navigation - Distinctive Design */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-xl border-b-4 border-blue-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <div className="w-10 h-10 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center mr-3">
                <Sparkles className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-black">TheEdzy Platform</h1>
                <p className="text-xs text-blue-200">Educational Apps Collection</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <span className="px-3 py-1 bg-white/20 rounded-full text-sm font-medium">
                Chemistry Lab
              </span>
              <div className="w-8 h-8 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-lg flex items-center justify-center">
                <Beaker className="w-5 h-5 text-white" />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Add visual separator */}
      <div className="h-2 bg-gradient-to-r from-emerald-400 to-teal-400"></div>

      {/* Periodic Table Content with modified navigation */}
      <div id="periodic-table-root">
        <PeriodicTableApp />
      </div>
    </div>
  );
}