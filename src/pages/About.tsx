import { Quote, Lightbulb, Users, Rocket, Target, Heart, Sparkles, TrendingUp } from 'lucide-react';

export default function About() {
  const principles = [
    {
      icon: Lightbulb,
      title: 'Innovation',
      description: 'We embrace cutting-edge technology to create learning experiences that weren\'t possible before.',
      gradient: 'from-yellow-400 to-orange-500',
      bgGradient: 'from-yellow-50 to-orange-50',
    },
    {
      icon: Users,
      title: 'Accessibility',
      description: 'Quality education should be available to everyone, regardless of background or resources.',
      gradient: 'from-blue-500 to-cyan-500',
      bgGradient: 'from-blue-50 to-cyan-50',
    },
    {
      icon: Rocket,
      title: 'Impact',
      description: 'We measure our success by the learning outcomes and confidence we help students achieve.',
      gradient: 'from-violet-500 to-purple-500',
      bgGradient: 'from-violet-50 to-purple-50',
    },
  ];

  const timeline = [
    { year: '2024', title: 'Foundation', description: 'TheEdzy was founded with a vision to transform education' },
    { year: '2024', title: 'First Apps', description: 'Launched Interactive Periodic Table and Algebra Quiz' },
    { year: '2025', title: 'AI Integration', description: 'Developing AI-powered study assistant with RAG technology' },
    { year: 'Future', title: 'Global Reach', description: 'Expanding to serve millions of students worldwide' },
  ];

  return (
    <div className="min-h-screen bg-white relative overflow-hidden">
      <section className="relative py-24 bg-gradient-to-br from-violet-50 via-blue-50 to-cyan-50 overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-violet-300/20 via-transparent to-transparent"></div>
        <div className="absolute top-20 left-10 w-96 h-96 bg-violet-400/20 rounded-full blur-3xl animate-float"></div>
        <div className="absolute bottom-20 right-10 w-72 h-72 bg-cyan-400/20 rounded-full blur-3xl animate-float" style={{ animationDelay: '2s' }}></div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16 animate-slide-up">
            <span className="inline-block px-4 py-2 bg-gradient-to-r from-violet-600 to-blue-600 text-white font-bold rounded-full text-sm mb-6 shadow-lg">
              Our Story
            </span>
            <h1 className="text-6xl sm:text-7xl font-black mb-6">
              <span className="bg-gradient-to-r from-violet-600 via-blue-600 to-cyan-600 bg-clip-text text-transparent">
                About TheEdzy
              </span>
            </h1>
            <p className="text-xl text-gray-700 max-w-3xl mx-auto leading-relaxed">
              Transforming education through innovative technology and AI integration
            </p>
          </div>
        </div>
      </section>

      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-5xl mx-auto">
            <div className="relative bg-gradient-to-br from-violet-600 via-blue-600 to-cyan-600 rounded-3xl p-1 shadow-2xl mb-20">
              <div className="bg-white rounded-3xl p-10 sm:p-16">
                <Quote className="w-16 h-16 text-violet-600 mb-8" />
                <blockquote className="text-4xl sm:text-5xl font-black text-gray-900 mb-6 leading-tight">
                  "Learning should be simple, accessible, and exciting."
                </blockquote>
                <div className="flex items-center">
                  <div className="w-1 h-16 bg-gradient-to-b from-violet-600 to-blue-600 rounded-full mr-4"></div>
                  <div>
                    <p className="text-lg font-bold text-gray-900">TheEdzy Team</p>
                    <p className="text-gray-600">Building the future of education</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="mb-20">
              <div className="flex items-center mb-8">
                <div className="w-12 h-12 bg-gradient-to-br from-violet-600 to-blue-600 rounded-2xl flex items-center justify-center mr-4 shadow-lg">
                  <Sparkles className="w-6 h-6 text-white" />
                </div>
                <h2 className="text-4xl font-black text-gray-900">Our Story</h2>
              </div>

              <div className="space-y-6 text-lg text-gray-700 leading-relaxed">
                <p className="p-6 bg-gradient-to-br from-violet-50 to-blue-50 rounded-2xl border-l-4 border-violet-600">
                  TheEdzy was born from a simple observation: students learn best when they're
                  actively engaged with the material. Traditional textbooks and lectures have their
                  place, but modern technology offers unprecedented opportunities to make learning
                  interactive, personalized, and fun.
                </p>
                <p className="p-6 bg-gradient-to-br from-blue-50 to-cyan-50 rounded-2xl border-l-4 border-blue-600">
                  We saw the potential of artificial intelligence and interactive web technologies
                  to transform how students explore new concepts. From visualizing the periodic table
                  in ways that bring chemistry to life, to creating adaptive quizzes that meet students
                  at their level, we're committed to building tools that make learning more effective
                  and enjoyable.
                </p>
                <p className="p-6 bg-gradient-to-br from-cyan-50 to-teal-50 rounded-2xl border-l-4 border-cyan-600">
                  Our team combines expertise in education, software development, and AI to create
                  products that truly serve students, parents, and educators. Every app we build is
                  designed with real classroom needs in mind, tested with real students, and refined
                  based on actual learning outcomes.
                </p>
                <p className="p-6 bg-gradient-to-br from-purple-50 to-pink-50 rounded-2xl border-l-4 border-purple-600">
                  As education continues to evolve, we're dedicated to staying at the forefront of
                  educational technology, always asking: "How can we make this concept easier to
                  understand? How can we make learning more engaging? How can we help every student
                  reach their full potential?"
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-20 bg-gradient-to-br from-gray-50 via-blue-50 to-violet-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <span className="inline-block px-4 py-2 bg-gradient-to-r from-violet-100 to-blue-100 text-violet-700 font-bold rounded-full text-sm mb-4">
              What Drives Us
            </span>
            <h2 className="text-5xl font-black text-gray-900 mb-4">Core Principles</h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              The values that guide everything we do
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 mb-20">
            {principles.map((principle, index) => (
              <div
                key={index}
                className="group relative bg-white rounded-3xl p-8 shadow-xl hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-4"
              >
                <div className={`w-16 h-16 bg-gradient-to-br ${principle.gradient} rounded-2xl flex items-center justify-center mb-6 shadow-xl transform group-hover:scale-110 group-hover:rotate-3 transition-all duration-300`}>
                  <principle.icon className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-2xl font-black text-gray-900 mb-4">{principle.title}</h3>
                <p className="text-gray-600 leading-relaxed">{principle.description}</p>
                <div className={`absolute bottom-0 left-0 right-0 h-1.5 bg-gradient-to-r ${principle.gradient} rounded-b-3xl transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500`}></div>
              </div>
            ))}
          </div>

          <div className="bg-white rounded-3xl p-10 shadow-xl mb-20">
            <div className="flex items-center mb-10">
              <div className="w-12 h-12 bg-gradient-to-br from-violet-600 to-blue-600 rounded-2xl flex items-center justify-center mr-4 shadow-lg">
                <TrendingUp className="w-6 h-6 text-white" />
              </div>
              <h2 className="text-4xl font-black text-gray-900">Our Journey</h2>
            </div>

            <div className="grid md:grid-cols-4 gap-6">
              {timeline.map((item, index) => (
                <div key={index} className="relative">
                  <div className="flex flex-col items-center text-center">
                    <div className="w-20 h-20 bg-gradient-to-br from-violet-600 via-blue-600 to-cyan-600 rounded-2xl flex items-center justify-center mb-4 shadow-xl transform hover:scale-110 transition-transform">
                      <span className="text-white font-black text-xl">{item.year}</span>
                    </div>
                    <h3 className="font-black text-gray-900 text-lg mb-2">{item.title}</h3>
                    <p className="text-gray-600 text-sm">{item.description}</p>
                  </div>
                  {index < timeline.length - 1 && (
                    <div className="hidden md:block absolute top-10 left-full w-full h-0.5 bg-gradient-to-r from-violet-300 to-blue-300"></div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="relative bg-gradient-to-br from-violet-600 via-blue-600 to-cyan-600 rounded-3xl p-1 shadow-2xl overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent"></div>
            <div className="absolute top-0 right-0 w-96 h-96 bg-white/10 rounded-full blur-3xl"></div>
            <div className="absolute bottom-0 left-0 w-72 h-72 bg-cyan-400/20 rounded-full blur-3xl"></div>

            <div className="relative bg-gradient-to-br from-violet-600 via-blue-600 to-cyan-600 rounded-3xl p-12 sm:p-16 text-center text-white">
              <div className="inline-flex items-center justify-center w-20 h-20 bg-white/20 backdrop-blur-sm rounded-3xl mb-8 transform hover:scale-110 transition-transform">
                <Heart className="w-10 h-10 text-white" />
              </div>
              <h2 className="text-4xl sm:text-5xl font-black mb-6">Join Us on This Journey</h2>
              <p className="text-xl opacity-90 max-w-2xl mx-auto mb-10 leading-relaxed">
                Whether you're a student, educator, or parent, we'd love to hear from you.
                Your feedback helps us build better tools for learners everywhere.
              </p>
              <a
                href="mailto:support@theedzy.com"
                className="inline-flex items-center px-10 py-5 bg-white text-violet-600 font-black text-lg rounded-2xl shadow-2xl hover:shadow-white/20 transition-all transform hover:scale-105 hover:-translate-y-1"
              >
                <Target className="w-6 h-6 mr-3" />
                Get in Touch
              </a>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
