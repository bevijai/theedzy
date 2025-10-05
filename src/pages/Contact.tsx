import { Mail, Linkedin, Youtube, Instagram, Send, MapPin, Clock, MessageCircle } from 'lucide-react';
import { useState } from 'react';

export default function Contact() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: '',
  });
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const mailtoLink = `mailto:support@theedzy.com?subject=Contact from ${encodeURIComponent(formData.name)}&body=${encodeURIComponent(
      `Name: ${formData.name}\nEmail: ${formData.email}\n\nMessage:\n${formData.message}`
    )}`;

    window.location.href = mailtoLink;

    setIsSubmitted(true);
    setTimeout(() => {
      setFormData({ name: '', email: '', message: '' });
      setIsSubmitted(false);
    }, 3000);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const socialLinks = [
    { icon: Linkedin, name: 'LinkedIn', link: '#', gradient: 'from-blue-600 to-blue-700' },
    { icon: Youtube, name: 'YouTube', link: '#', gradient: 'from-red-600 to-red-700' },
    { icon: Instagram, name: 'Instagram', link: '#', gradient: 'from-pink-600 to-purple-600' },
  ];

  const contactInfo = [
    { icon: Mail, title: 'Email', content: 'support@theedzy.com', gradient: 'from-violet-500 to-purple-500' },
    { icon: Clock, title: 'Response Time', content: 'Within 24 hours', gradient: 'from-blue-500 to-cyan-500' },
    { icon: MapPin, title: 'Location', content: 'Serving students globally', gradient: 'from-emerald-500 to-teal-500' },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-violet-50 via-blue-50 to-cyan-50 py-20 relative overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-violet-300/20 via-transparent to-transparent"></div>
      <div className="absolute top-20 left-10 w-96 h-96 bg-violet-400/20 rounded-full blur-3xl animate-float"></div>
      <div className="absolute bottom-20 right-10 w-72 h-72 bg-cyan-400/20 rounded-full blur-3xl animate-float" style={{ animationDelay: '2s' }}></div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-20 animate-slide-up">
          <span className="inline-block px-4 py-2 bg-gradient-to-r from-violet-600 to-blue-600 text-white font-bold rounded-full text-sm mb-6 shadow-lg">
            Let's Connect
          </span>
          <h1 className="text-6xl sm:text-7xl font-black mb-6">
            <span className="bg-gradient-to-r from-violet-600 via-blue-600 to-cyan-600 bg-clip-text text-transparent">
              Get in Touch
            </span>
          </h1>
          <p className="text-xl text-gray-700 max-w-3xl mx-auto leading-relaxed">
            Have questions, feedback, or ideas? We'd love to hear from you.
            Send us a message and we'll get back to you as soon as possible.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6 mb-16">
          {contactInfo.map((info, index) => (
            <div
              key={index}
              className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all transform hover:-translate-y-2"
            >
              <div className={`w-14 h-14 bg-gradient-to-br ${info.gradient} rounded-2xl flex items-center justify-center mb-4 shadow-lg`}>
                <info.icon className="w-7 h-7 text-white" />
              </div>
              <h3 className="font-black text-gray-900 text-lg mb-2">{info.title}</h3>
              {info.title === 'Email' ? (
                <a href={`mailto:${info.content}`} className="text-violet-600 hover:text-violet-700 font-semibold">
                  {info.content}
                </a>
              ) : (
                <p className="text-gray-600 font-medium">{info.content}</p>
              )}
            </div>
          ))}
        </div>

        <div className="grid md:grid-cols-2 gap-8 mb-16">
          <div>
            <div className="bg-white rounded-3xl shadow-2xl p-8 sm:p-10">
              <div className="flex items-center mb-8">
                <div className="w-12 h-12 bg-gradient-to-br from-violet-600 to-blue-600 rounded-2xl flex items-center justify-center mr-4 shadow-lg">
                  <MessageCircle className="w-6 h-6 text-white" />
                </div>
                <h2 className="text-3xl font-black text-gray-900">Send a Message</h2>
              </div>

              {isSubmitted ? (
                <div className="relative bg-gradient-to-br from-emerald-500 to-teal-500 rounded-2xl p-1 shadow-xl">
                  <div className="bg-white rounded-2xl p-8 text-center">
                    <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-emerald-500 to-teal-500 rounded-3xl mb-6 shadow-xl">
                      <Send className="w-10 h-10 text-white" />
                    </div>
                    <p className="text-emerald-600 font-black text-xl mb-2">
                      Message Prepared!
                    </p>
                    <p className="text-gray-600">
                      Your email client will open shortly
                    </p>
                  </div>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div>
                    <label htmlFor="name" className="block text-sm font-black text-gray-900 mb-2">
                      Name
                    </label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      required
                      value={formData.name}
                      onChange={handleChange}
                      className="w-full px-5 py-4 border-2 border-gray-200 rounded-2xl focus:border-violet-500 focus:outline-none transition-all shadow-sm hover:shadow-md font-medium"
                      placeholder="Your full name"
                    />
                  </div>

                  <div>
                    <label htmlFor="email" className="block text-sm font-black text-gray-900 mb-2">
                      Email
                    </label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      required
                      value={formData.email}
                      onChange={handleChange}
                      className="w-full px-5 py-4 border-2 border-gray-200 rounded-2xl focus:border-violet-500 focus:outline-none transition-all shadow-sm hover:shadow-md font-medium"
                      placeholder="your.email@example.com"
                    />
                  </div>

                  <div>
                    <label htmlFor="message" className="block text-sm font-black text-gray-900 mb-2">
                      Message
                    </label>
                    <textarea
                      id="message"
                      name="message"
                      required
                      value={formData.message}
                      onChange={handleChange}
                      rows={6}
                      className="w-full px-5 py-4 border-2 border-gray-200 rounded-2xl focus:border-violet-500 focus:outline-none transition-all shadow-sm hover:shadow-md resize-none font-medium"
                      placeholder="Tell us what's on your mind..."
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full inline-flex items-center justify-center px-8 py-5 bg-gradient-to-r from-violet-600 via-blue-600 to-cyan-600 text-white font-black text-lg rounded-2xl shadow-xl shadow-blue-500/50 hover:shadow-2xl hover:shadow-blue-500/70 transition-all transform hover:scale-105 hover:-translate-y-1"
                  >
                    Send Message
                    <Send className="ml-3 w-6 h-6" />
                  </button>
                </form>
              )}
            </div>
          </div>

          <div className="space-y-8">
            <div className="relative bg-gradient-to-br from-violet-600 via-blue-600 to-cyan-600 rounded-3xl p-1 shadow-2xl">
              <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent rounded-3xl"></div>
              <div className="relative bg-gradient-to-br from-violet-600 via-blue-600 to-cyan-600 rounded-3xl p-8 sm:p-10 text-white overflow-hidden">
                <div className="absolute top-0 right-0 w-40 h-40 bg-white/10 rounded-full blur-2xl"></div>
                <div className="relative">
                  <h2 className="text-3xl font-black mb-4">Why Reach Out?</h2>
                  <ul className="space-y-4">
                    <li className="flex items-start">
                      <div className="w-6 h-6 bg-white/20 rounded-lg flex items-center justify-center mr-3 mt-1">
                        <span className="text-white font-bold">✓</span>
                      </div>
                      <span className="text-white/90 leading-relaxed">Get help with our educational apps</span>
                    </li>
                    <li className="flex items-start">
                      <div className="w-6 h-6 bg-white/20 rounded-lg flex items-center justify-center mr-3 mt-1">
                        <span className="text-white font-bold">✓</span>
                      </div>
                      <span className="text-white/90 leading-relaxed">Share feedback and suggestions</span>
                    </li>
                    <li className="flex items-start">
                      <div className="w-6 h-6 bg-white/20 rounded-lg flex items-center justify-center mr-3 mt-1">
                        <span className="text-white font-bold">✓</span>
                      </div>
                      <span className="text-white/90 leading-relaxed">Report bugs or technical issues</span>
                    </li>
                    <li className="flex items-start">
                      <div className="w-6 h-6 bg-white/20 rounded-lg flex items-center justify-center mr-3 mt-1">
                        <span className="text-white font-bold">✓</span>
                      </div>
                      <span className="text-white/90 leading-relaxed">Explore partnership opportunities</span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-3xl shadow-xl p-8 sm:p-10">
              <h2 className="text-2xl font-black text-gray-900 mb-6">Connect With Us</h2>
              <p className="text-gray-600 mb-8 leading-relaxed">
                Follow us on social media to stay updated with our latest apps,
                features, and educational content.
              </p>
              <div className="flex flex-wrap gap-4">
                {socialLinks.map((social, index) => (
                  <a
                    key={index}
                    href={social.link}
                    className={`group flex items-center px-6 py-3 bg-gradient-to-r ${social.gradient} rounded-2xl shadow-lg hover:shadow-xl transition-all transform hover:scale-110`}
                    aria-label={social.name}
                  >
                    <social.icon className="w-5 h-5 text-white mr-3" />
                    <span className="text-white font-bold">{social.name}</span>
                  </a>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="relative bg-gradient-to-br from-blue-500 via-cyan-500 to-teal-500 rounded-3xl p-1 shadow-2xl">
          <div className="bg-white rounded-3xl p-10 sm:p-12 text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-2xl mb-6 shadow-xl">
              <Mail className="w-8 h-8 text-white" />
            </div>
            <h2 className="text-4xl font-black text-gray-900 mb-4">
              We Value Your Feedback
            </h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto leading-relaxed">
              Your input helps us improve our educational tools and create better learning
              experiences for students everywhere. Whether you have a suggestion, found a bug,
              or just want to share your success story, we're all ears!
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
