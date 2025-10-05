import { ArrowRight, Sparkles, Target, Eye, Heart, Zap, Star, TrendingUp } from 'lucide-react';

interface HomeProps {
  onNavigate: (page: string) => void;
}

export default function Home({ onNavigate }: HomeProps) {
  const apps = [
    {
      name: 'Interactive Periodic Table',
      description: 'Explore elements with dynamic visualizations and detailed information.',
      gradient: 'from-emerald-500 via-teal-500 to-cyan-500',
      icon: '🧪',
      tag: 'Science',
      comingSoon: true,
      link: null,
    },
    {
      name: 'Algebra Quiz',
      description: 'Practice algebra problems with instant feedback and step-by-step solutions.',
      gradient: 'from-rose-500 via-pink-500 to-fuchsia-500',
      icon: '📐',
      tag: 'Mathematics',
      comingSoon: true,
      link: null,
    },
    {
      name: 'AI Study Notes',
      description: 'RAG-based assistant that helps you create and organize study materials.',
      gradient: 'from-violet-500 via-purple-500 to-indigo-500',
      icon: '🤖',
      tag: 'AI Powered',
      comingSoon: false,
      link: 'ai-study-notes',
    },
  ];

  const values = [
    { icon: Sparkles, text: 'Innovation', color: 'from-yellow-400 to-orange-500' },
    { icon: Target, text: 'Curiosity', color: 'from-blue-400 to-cyan-500' },
    { icon: Heart, text: 'Simplicity', color: 'from-pink-400 to-rose-500' },
    { icon: Eye, text: 'Learning for All', color: 'from-violet-400 to-purple-500' },
  ];

  const stats = [
    { number: '10K+', label: 'Students', icon: Star },
    { number: '50+', label: 'Educators', icon: TrendingUp },
    { number: '3', label: 'Learning Apps', icon: Zap },
  ];

  return (
    <div className="min-h-screen">
      <section className="relative min-h-[90vh] flex items-center overflow-hidden">
        <div
          className="absolute inset-0 hero-bg-responsive bg-no-repeat"
          style={{
            backgroundImage: 'url(https://images.pexels.com/photos/5212703/pexels-photo-5212703.jpeg?auto=compress&cs=tinysrgb&w=3840&h=2160&dpr=2)',
          }}
        ></div>

        <div className="absolute inset-0 bg-gradient-to-br from-violet-900/60 via-blue-900/50 to-cyan-900/60"></div>
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-black/20"></div>

        <div className="absolute top-20 left-10 w-72 h-72 bg-violet-400/20 rounded-full blur-3xl animate-float"></div>
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-cyan-400/20 rounded-full blur-3xl animate-float" style={{ animationDelay: '2s' }}></div>


        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="text-center animate-slide-up">
            <div className="inline-flex items-center justify-center w-24 h-24 bg-white/95 backdrop-blur-md rounded-3xl shadow-2xl shadow-black/40 mb-8 transform hover:scale-110 hover:rotate-3 transition-all duration-500">
              <span className="bg-gradient-to-br from-violet-600 via-blue-600 to-cyan-600 bg-clip-text text-transparent font-black text-5xl">E</span>
            </div>

            <h1 className="text-6xl sm:text-7xl lg:text-8xl font-black mb-6 drop-shadow-2xl">
              <span className="text-white">
                TheEdzy
              </span>
            </h1>

            <p className="text-2xl sm:text-3xl text-white font-semibold mb-4 max-w-4xl mx-auto drop-shadow-lg">
              Interactive learning tools that make education
            </p>
            <p className="text-2xl sm:text-3xl font-bold text-cyan-300 mb-10 drop-shadow-lg">
              engaging, fun, and effective
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12">
              <button
                onClick={() => onNavigate('apps')}
                className="group relative px-8 py-4 bg-gradient-to-r from-violet-600 via-blue-600 to-cyan-600 text-white font-bold rounded-2xl shadow-2xl shadow-blue-500/50 hover:shadow-blue-500/70 transition-all duration-300 transform hover:scale-105 hover:-translate-y-1"
              >
                <span className="flex items-center">
                  Explore Apps
                  <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </span>
              </button>

              <button
                onClick={() => onNavigate('about')}
                className="px-8 py-4 bg-white/95 backdrop-blur-md text-gray-700 font-bold rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-105 border-2 border-white/50 hover:border-violet-300"
              >
                Learn More
              </button>
            </div>

            <div className="grid grid-cols-3 gap-8 max-w-2xl mx-auto">
              {stats.map((stat, index) => (
                <div key={index} className="text-center bg-white/10 backdrop-blur-md rounded-2xl p-4 border border-white/20">
                  <div className="inline-flex items-center justify-center w-10 h-10 bg-white/90 rounded-xl mb-2">
                    <stat.icon className="w-5 h-5 text-violet-600" />
                  </div>
                  <div className="text-3xl font-black text-white drop-shadow-lg">
                    {stat.number}
                  </div>
                  <div className="text-sm text-white/90 font-semibold">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="py-24 bg-white relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom,_var(--tw-gradient-stops))] from-blue-100/50 via-transparent to-transparent"></div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto text-center mb-16">
            <span className="inline-block px-4 py-2 bg-gradient-to-r from-violet-100 to-blue-100 text-violet-700 font-bold rounded-full text-sm mb-4">
              Our Mission
            </span>
            <p className="text-xl text-gray-700 leading-relaxed mb-6">
              TheEdzy builds interactive learning tools that make education engaging, fun, and effective.
              From science visualizations to AI-powered study assistants, our mission is to help students
              learn smarter.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8 mb-20">
            <div className="group relative bg-gradient-to-br from-violet-500 via-blue-600 to-cyan-600 rounded-3xl p-1 shadow-2xl hover:shadow-violet-500/30 transition-all duration-300 transform hover:scale-105">
              <div className="bg-white rounded-3xl p-8 h-full">
                <div className="inline-flex items-center justify-center w-14 h-14 bg-gradient-to-br from-violet-100 to-blue-100 rounded-2xl mb-6">
                  <Target className="w-7 h-7 text-violet-600" />
                </div>
                <h2 className="text-3xl font-black text-gray-900 mb-4">Mission</h2>
                <p className="text-gray-600 leading-relaxed text-lg">
                  Empower students to explore, understand, and apply concepts through technology.
                </p>
              </div>
            </div>

            <div className="group relative bg-gradient-to-br from-cyan-500 via-blue-600 to-violet-600 rounded-3xl p-1 shadow-2xl hover:shadow-cyan-500/30 transition-all duration-300 transform hover:scale-105">
              <div className="bg-white rounded-3xl p-8 h-full">
                <div className="inline-flex items-center justify-center w-14 h-14 bg-gradient-to-br from-cyan-100 to-blue-100 rounded-2xl mb-6">
                  <Eye className="w-7 h-7 text-cyan-600" />
                </div>
                <h2 className="text-3xl font-black text-gray-900 mb-4">Vision</h2>
                <p className="text-gray-600 leading-relaxed text-lg">
                  To make quality, interactive education accessible for every student.
                </p>
              </div>
            </div>
          </div>

          <div className="text-center mb-12">
            <span className="inline-block px-4 py-2 bg-gradient-to-r from-violet-100 to-blue-100 text-violet-700 font-bold rounded-full text-sm mb-4">
              What We Stand For
            </span>
            <h2 className="text-4xl font-black text-gray-900 mb-12">Core Values</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {values.map((value, index) => (
                <div
                  key={index}
                  className="group relative bg-white rounded-2xl p-6 shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:scale-110 hover:-translate-y-2 border-2 border-transparent hover:border-violet-200"
                >
                  <div className={`inline-flex items-center justify-center w-14 h-14 bg-gradient-to-br ${value.color} rounded-2xl mb-4 shadow-lg`}>
                    <value.icon className="w-7 h-7 text-white" />
                  </div>
                  <span className="text-gray-900 font-bold text-lg block">{value.text}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="py-24 bg-gradient-to-br from-gray-50 via-blue-50 to-violet-50 relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,_var(--tw-gradient-stops))] from-violet-200/30 via-transparent to-transparent"></div>


        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <span className="inline-block px-4 py-2 bg-gradient-to-r from-violet-600 to-blue-600 text-white font-bold rounded-full text-sm mb-4 shadow-lg">
              Start Learning Today
            </span>
            <h2 className="text-5xl font-black text-gray-900 mb-4">Featured Apps</h2>
            <p className="text-xl text-gray-600">Explore our interactive learning tools</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 mb-16">
            {apps.map((app, index) => (
              <div
                key={index}
                className="group relative bg-white rounded-3xl shadow-xl hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-3 overflow-hidden cursor-pointer"
                onClick={() => app.link && onNavigate(app.link)}
              >
                <div className={`h-48 bg-gradient-to-br ${app.gradient} flex items-center justify-center relative overflow-hidden`}>
                  <div className="absolute inset-0 bg-white/10 backdrop-blur-sm"></div>
                  <span className="text-7xl relative z-10 transform group-hover:scale-125 transition-transform duration-500">
                    {app.icon}
                  </span>
                  <div className="absolute top-4 right-4">
                    <span className="px-3 py-1.5 bg-white/90 backdrop-blur-sm text-gray-900 text-xs font-bold rounded-full shadow-lg">
                      {app.tag}
                    </span>
                  </div>
                </div>

                <div className="p-8">
                  <h3 className="text-2xl font-black text-gray-900 mb-3">{app.name}</h3>
                  <p className="text-gray-600 mb-6 leading-relaxed">{app.description}</p>

                  {app.comingSoon ? (
                    <div className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-yellow-400 to-orange-500 text-white text-sm font-bold rounded-xl shadow-lg">
                      <Sparkles className="w-4 h-4 mr-2" />
                      Coming Soon
                    </div>
                  ) : (
                    <div className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-green-400 to-green-500 text-white text-sm font-bold rounded-xl shadow-lg">
                      <Sparkles className="w-4 h-4 mr-2" />
                      Available Now
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>

          <div className="text-center">
            <button
              onClick={() => onNavigate('apps')}
              className="group inline-flex items-center px-10 py-5 bg-gradient-to-r from-violet-600 via-blue-600 to-cyan-600 text-white font-black text-lg rounded-2xl shadow-2xl shadow-blue-500/50 hover:shadow-blue-500/70 transition-all duration-300 transform hover:scale-105 hover:-translate-y-1"
            >
              Start Learning
              <ArrowRight className="ml-3 w-6 h-6 group-hover:translate-x-2 transition-transform" />
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}
