import { useState, useEffect, lazy, Suspense } from 'react';
import Navigation from './components/Navigation';
import Footer from './components/Footer';
import Home from './pages/Home';
import Apps from './pages/Apps';
import About from './pages/About';
import Contact from './pages/Contact';

// Lazy load heavy components to improve initial page load
const AIStudyNotes = lazy(() => import('./pages/AIStudyNotes'));
const InteractivePeriodicTable = lazy(() => import('./pages/InteractivePeriodicTable'));
const PeriodicTableBreadcrumb = lazy(() => import('./pages/PeriodicTableBreadcrumb'));

function App() {
  const [currentPage, setCurrentPage] = useState('home');

  useEffect(() => {
    document.title = 'TheEdzy - Interactive Learning Tools for Students';
  }, []);

  const renderPage = () => {
    switch (currentPage) {
      case 'home':
        return <Home onNavigate={setCurrentPage} />;
      case 'apps':
        return <Apps onNavigate={setCurrentPage} />;
      case 'ai-study-notes':
        return (
          <Suspense fallback={
            <div className="min-h-screen bg-gradient-to-br from-violet-50 via-purple-50 to-indigo-50 flex items-center justify-center">
              <div className="text-center">
                <div className="w-16 h-16 bg-gradient-to-br from-violet-500 to-purple-500 rounded-3xl flex items-center justify-center mx-auto mb-4 animate-pulse">
                  <span className="text-2xl">🤖</span>
                </div>
                <p className="text-lg font-semibold text-gray-700">Loading AI Study Notes...</p>
              </div>
            </div>
          }>
            <AIStudyNotes />
          </Suspense>
        );
      case 'periodic-table':
        return (
          <Suspense fallback={
            <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-teal-50 to-cyan-50 flex items-center justify-center">
              <div className="text-center">
                <div className="w-16 h-16 bg-gradient-to-br from-emerald-500 to-teal-500 rounded-3xl flex items-center justify-center mx-auto mb-4 animate-pulse">
                  <span className="text-2xl">🧪</span>
                </div>
                <p className="text-lg font-semibold text-gray-700">Loading Periodic Table...</p>
              </div>
            </div>
          }>
            <PeriodicTableBreadcrumb onNavigateHome={() => setCurrentPage('home')} onNavigateApps={() => setCurrentPage('apps')} />
          </Suspense>
        );
      case 'about':
        return <About />;
      case 'contact':
        return <Contact />;
      default:
        return <Home onNavigate={setCurrentPage} />;
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navigation currentPage={currentPage} onNavigate={setCurrentPage} />
      <main className="flex-grow pt-16">
        {renderPage()}
      </main>
      <Footer />
    </div>
  );
}

export default App;
