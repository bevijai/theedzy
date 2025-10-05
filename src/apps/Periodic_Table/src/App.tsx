import { useState, useEffect } from 'react';
import { Navigation } from './components/Navigation';
import { PeriodicTable } from './components/PeriodicTable';
import Quiz from './components/Quiz';
import { Playground } from './components/Playground';
import ImageAnalyzer from './components/ImageAnalyzer';

function App() {
  const [currentPage, setCurrentPage] = useState<'table' | 'playground' | 'analyzer' | 'quiz'>('table');
  const [theme, _setTheme] = useState<'light' | 'dark'>(() => (localStorage.getItem('theme') as 'light' | 'dark') || 'light');
  // Hoisted quiz state so header can open the quiz modal
  const [quizOpen, setQuizOpen] = useState(false);

  useEffect(() => {
    const root = document.documentElement;
    if (theme === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
    localStorage.setItem('theme', theme);
  }, [theme]);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
  <Navigation currentPage={currentPage} onNavigate={setCurrentPage} onOpenQuiz={() => setQuizOpen(true)} />
  {currentPage === 'table' ? (
    <PeriodicTable quizOpen={quizOpen} setQuizOpen={setQuizOpen} />
  ) : currentPage === 'playground' ? (
    <Playground />
  ) : currentPage === 'quiz' ? (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <Quiz />
    </div>
  ) : (
    <ImageAnalyzer />
  )}
      <footer className="mt-8 bg-white/80 dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 text-center text-sm text-gray-700 dark:text-gray-300">
          © {new Date().getFullYear()} Samyuktha Vijai. All rights reserved.
        </div>
      </footer>
    </div>
  );
}

export default App;