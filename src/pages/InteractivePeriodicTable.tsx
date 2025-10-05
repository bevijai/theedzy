import React from 'react';
// Import the main periodic table app
import PeriodicTableApp from '../apps/Periodic_Table/src/App';

// Import the CSS from the periodic table app
import '../apps/Periodic_Table/src/index.css';

export default function InteractivePeriodicTable() {
  return (
    <div className="min-h-screen">
      {/* Wrapper div to ensure proper styling */}
      <div id="periodic-table-root">
        <PeriodicTableApp />
      </div>
    </div>
  );
}