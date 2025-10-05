import { Heart } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="relative bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 border-t border-gray-700 py-12 mt-auto overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-violet-600/10 via-transparent to-transparent"></div>
      <div className="absolute inset-0 bg-grid-white/[0.02]"></div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <div className="flex items-center justify-center mb-4">
            <span className="text-gray-400 text-sm">Made with</span>
            <Heart className="w-4 h-4 text-red-500 mx-2 animate-pulse" />
            <span className="text-gray-400 text-sm">for learners everywhere</span>
          </div>
          <p className="text-gray-500 text-sm">
            © 2025 TheEdzy. All rights reserved.
          </p>
          <div className="mt-4">
            <span className="inline-block px-4 py-1.5 bg-gradient-to-r from-violet-600/20 via-blue-600/20 to-cyan-600/20 border border-violet-500/30 rounded-full text-xs text-violet-300 font-semibold">
              Empowering Education Through Technology
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}
