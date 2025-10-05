import { ArrowLeft, Beaker } from 'lucide-react';

// Import the main periodic table app
import PeriodicTableApp from '../apps/Periodic_Table/src/App';

// Import the CSS from the periodic table app
import '../apps/Periodic_Table/src/index.css';

interface PeriodicTableIntegratedProps {
  onNavigateBack?: () => void;
}

export default function PeriodicTableIntegrated({ onNavigateBack }: PeriodicTableIntegratedProps) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-teal-50 to-cyan-50">
      {/* TheEdzy-styled Header */}
      <div className="bg-white/90 backdrop-blur-xl shadow-lg border-b border-emerald-100 sticky top-16 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between py-4">
            {/* Left side - Back button and title */}
            <div className="flex items-center">
              {onNavigateBack && (
                <button
                  onClick={onNavigateBack}
                  className="flex items-center px-3 py-2 text-gray-600 hover:text-emerald-600 hover:bg-emerald-50 rounded-xl transition-all mr-4"
                >
                  <ArrowLeft className="w-5 h-5 mr-1" />
                  Back to Apps
                </button>
              )}
              <div className="flex items-center">
                <div className="w-12 h-12 bg-gradient-to-br from-emerald-500 to-teal-500 rounded-2xl flex items-center justify-center shadow-lg mr-4">
                  <Beaker className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h1 className="text-2xl font-black bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">
                    Interactive Periodic Table
                  </h1>
                  <p className="text-sm text-gray-600">Chemistry made interactive • Powered by TheEdzy</p>
                </div>
              </div>
            </div>

            {/* Right side - Branding badges */}
            <div className="flex items-center space-x-3">
              <span className="px-4 py-2 bg-gradient-to-r from-emerald-100 to-teal-100 text-emerald-700 rounded-full font-semibold text-sm">
                🧪 Chemistry
              </span>
              <span className="px-4 py-2 bg-gradient-to-r from-teal-100 to-cyan-100 text-teal-700 rounded-full font-semibold text-sm">
                ⚡ Interactive
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Content Area with hidden original navigation */}
      <div className="pt-0" style={{ 
        /* Hide original navigation */ 
      }}>
        <style>
          {`
            #periodic-table-root nav,
            #periodic-table-root header {
              display: none !important;
            }
          `}
        </style>
        <div id="periodic-table-root">
          <PeriodicTableApp />
        </div>
      </div>

      {/* TheEdzy Footer */}
      <footer className="mt-12 bg-gradient-to-r from-emerald-500/10 to-teal-500/10 border-t border-emerald-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 text-center">
          <div className="flex items-center justify-center mb-2">
            <div className="w-8 h-8 bg-gradient-to-br from-emerald-500 to-teal-500 rounded-xl flex items-center justify-center mr-3">
              <span className="text-white font-bold text-sm">E</span>
            </div>
            <span className="text-lg font-bold bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">
              TheEdzy
            </span>
          </div>
          <p className="text-sm text-gray-600 mb-1">Interactive Periodic Table • Chemistry Education Platform</p>
          <p className="text-xs text-gray-500">
            © {new Date().getFullYear()} TheEdzy. Making chemistry accessible and engaging.
          </p>
        </div>
      </footer>
    </div>
  );
}