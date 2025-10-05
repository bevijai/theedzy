import { ExternalLink, FlaskConical, Calculator, Brain, Sparkles, Rocket, Zap } from 'lucide-react';

interface AppsProps {
  onNavigate?: (page: string) => void;
}

export default function Apps({ onNavigate }: AppsProps = {}) {
  const apps = [
    {
      name: 'Interactive Periodic Table',
      description: 'Explore elements with dynamic visualizations and detailed information. Click on any element to see its properties, electron configuration, and interesting facts.',
      icon: FlaskConical,
      gradient: 'from-emerald-500 via-teal-500 to-cyan-500',
      bgPattern: 'from-emerald-50 to-teal-50',
      link: 'periodic-table',
      comingSoon: false,
      tag: 'Science',
      emoji: '🧪',
    },
    {
      name: 'Algebra Quiz',
      description: 'Practice algebra problems with instant feedback and step-by-step solutions. Perfect for students learning linear equations, quadratic formulas, and more.',
      icon: Calculator,
      gradient: 'from-rose-500 via-pink-500 to-fuchsia-500',
      bgPattern: 'from-rose-50 to-pink-50',
      link: '#',
      comingSoon: false,
      tag: 'Mathematics',
      emoji: '📐',
    },
    {
      name: 'AI Study Notes',
      description: 'RAG-based study assistant that helps you create and organize study materials. Upload your textbooks and lecture notes to get AI-powered summaries and flashcards.',
      icon: Brain,
      gradient: 'from-violet-500 via-purple-500 to-indigo-500',
      bgPattern: 'from-violet-50 to-purple-50',
      link: 'ai-study-notes',
      comingSoon: false,
      tag: 'AI Powered',
      emoji: '🤖',
    },
  ];

  const features = [
    { icon: Rocket, text: 'Fast & Responsive', color: 'from-blue-500 to-cyan-500' },
    { icon: Sparkles, text: 'Beautiful Design', color: 'from-violet-500 to-purple-500' },
    { icon: Zap, text: 'Instant Feedback', color: 'from-yellow-500 to-orange-500' },
  ];

  const handleLaunchApp = (link: string, comingSoon: boolean) => {
    if (comingSoon) {
      return;
    }
    
    // Check if it's an internal navigation
    if ((link === 'ai-study-notes' || link === 'periodic-table') && onNavigate) {
      onNavigate(link);
      return;
    }
    
    // External link
    window.open(link, '_blank');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-violet-50 via-blue-50 to-cyan-50 py-20 relative overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_left,_var(--tw-gradient-stops))] from-violet-300/20 via-transparent to-transparent"></div>
      <div className="absolute top-20 right-10 w-96 h-96 bg-blue-400/20 rounded-full blur-3xl animate-float"></div>
      <div className="absolute bottom-20 left-10 w-72 h-72 bg-violet-400/20 rounded-full blur-3xl animate-float" style={{ animationDelay: '3s' }}></div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-20 animate-slide-up">
          <span className="inline-block px-4 py-2 bg-gradient-to-r from-violet-600 to-blue-600 text-white font-bold rounded-full text-sm mb-6 shadow-lg">
            Explore Our Tools
          </span>
          <h1 className="text-6xl sm:text-7xl font-black mb-6">
            <span className="bg-gradient-to-r from-violet-600 via-blue-600 to-cyan-600 bg-clip-text text-transparent">
              Educational Apps
            </span>
          </h1>
          <p className="text-xl text-gray-700 max-w-3xl mx-auto leading-relaxed">
            Discover our suite of interactive learning tools designed to make education
            engaging and effective for students of all ages.
          </p>

          <div className="flex flex-wrap justify-center gap-4 mt-10">
            {features.map((feature, index) => (
              <div
                key={index}
                className="flex items-center px-5 py-3 bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all transform hover:scale-105"
              >
                <div className={`w-10 h-10 bg-gradient-to-br ${feature.color} rounded-xl flex items-center justify-center mr-3 shadow-md`}>
                  <feature.icon className="w-5 h-5 text-white" />
                </div>
                <span className="font-bold text-gray-900">{feature.text}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-20">
          {apps.map((app, index) => (
            <div
              key={index}
              className="group relative bg-white rounded-3xl shadow-2xl hover:shadow-violet-500/20 transition-all duration-500 transform hover:-translate-y-4 overflow-hidden"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <div className={`relative h-56 bg-gradient-to-br ${app.gradient} flex flex-col items-center justify-center overflow-hidden`}>
                <div className="absolute inset-0 bg-white/5 backdrop-blur-sm"></div>
                <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent"></div>

                <div className="relative z-10 flex flex-col items-center">
                  <span className="text-8xl mb-4 transform group-hover:scale-125 group-hover:rotate-12 transition-all duration-500">
                    {app.emoji}
                  </span>
                  <span className="px-4 py-2 bg-white/90 backdrop-blur-sm text-gray-900 text-sm font-bold rounded-full shadow-xl">
                    {app.tag}
                  </span>
                </div>

                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
              </div>

              <div className="p-8">
                <div className="flex items-start mb-4">
                  <div className={`w-12 h-12 bg-gradient-to-br ${app.gradient} rounded-2xl flex items-center justify-center mr-4 shadow-lg`}>
                    <app.icon className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="text-2xl font-black text-gray-900 leading-tight">{app.name}</h3>
                </div>

                <p className="text-gray-600 mb-6 leading-relaxed">{app.description}</p>

                {app.comingSoon ? (
                  <div className="inline-flex items-center px-5 py-3 bg-gradient-to-r from-yellow-400 via-orange-500 to-red-500 text-white font-bold rounded-2xl shadow-lg">
                    <Sparkles className="w-5 h-5 mr-2 animate-pulse" />
                    Coming Soon
                  </div>
                ) : (
                  <button
                    onClick={() => handleLaunchApp(app.link, app.comingSoon)}
                    className={`group/btn w-full inline-flex items-center justify-center px-6 py-4 bg-gradient-to-r ${app.gradient} text-white font-bold rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-105`}
                  >
                    Launch App
                    <ExternalLink className="ml-2 w-5 h-5 group-hover/btn:translate-x-1 group-hover/btn:-translate-y-1 transition-transform" />
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>

        <div className="relative bg-gradient-to-br from-violet-600 via-blue-600 to-cyan-600 rounded-3xl p-1 shadow-2xl overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent"></div>
          <div className="relative bg-gradient-to-br from-violet-600 via-blue-600 to-cyan-600 rounded-3xl p-12 sm:p-16 text-center text-white overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl"></div>
            <div className="absolute bottom-0 left-0 w-96 h-96 bg-cyan-400/20 rounded-full blur-3xl"></div>

            <div className="relative">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-white/20 backdrop-blur-sm rounded-2xl mb-6 transform hover:scale-110 transition-transform">
                <Rocket className="w-8 h-8 text-white" />
              </div>
              <h2 className="text-4xl sm:text-5xl font-black mb-6">More Apps Coming Soon</h2>
              <p className="text-xl opacity-90 max-w-2xl mx-auto leading-relaxed">
                We're constantly developing new tools to enhance your learning experience.
                Stay tuned for exciting updates and innovative features that will transform how you learn.
              </p>
              <div className="mt-8 flex justify-center gap-2">
                <div className="w-3 h-3 bg-white rounded-full animate-pulse"></div>
                <div className="w-3 h-3 bg-white rounded-full animate-pulse" style={{ animationDelay: '0.2s' }}></div>
                <div className="w-3 h-3 bg-white rounded-full animate-pulse" style={{ animationDelay: '0.4s' }}></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
