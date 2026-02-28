import { Link } from 'react-router-dom';
import { ArrowRight, CheckCircle2, Star, Users, Building2, TrendingUp, Zap, Shield, Leaf, Sparkles, Bot, Wand2, MessageSquare } from 'lucide-react';
import { companies } from '../data/mockData';

function Hero3D() {
  return (
    <div className="relative min-h-[90vh] overflow-hidden bg-gradient-to-br from-gray-900 via-primary-900 to-gray-900">
      {/* Animated gradient background */}
      <div className="absolute inset-0 opacity-30">
        <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(ellipse_at_20%_50%,rgba(59,130,246,0.3),transparent_50%)]" />
        <div className="absolute top-0 right-0 w-full h-full bg-[radial-gradient(ellipse_at_80%_20%,rgba(249,115,22,0.3),transparent_50%)]" />
        <div className="absolute bottom-0 left-1/2 w-full h-full bg-[radial-gradient(ellipse_at_50%_100%,rgba(59,130,246,0.2),transparent_50%)]" />
      </div>

      {/* 3D Floating Elements */}
      <div className="absolute inset-0 perspective-1000">
        {/* 3D Building Block 1 */}
        <div className="absolute top-[15%] left-[8%] animate-float preserve-3d">
          <div className="w-20 h-20 md:w-28 md:h-28 rounded-2xl bg-gradient-to-br from-primary-500/30 to-primary-600/30 backdrop-blur-sm border border-primary-400/20 flex items-center justify-center shadow-2xl shadow-primary-500/20">
            <span className="text-3xl md:text-4xl">🏗️</span>
          </div>
        </div>

        {/* 3D Building Block 2 */}
        <div className="absolute top-[25%] right-[10%] animate-float-delayed preserve-3d">
          <div className="w-16 h-16 md:w-24 md:h-24 rounded-2xl bg-gradient-to-br from-accent-500/30 to-accent-600/30 backdrop-blur-sm border border-accent-400/20 flex items-center justify-center shadow-2xl shadow-accent-500/20">
            <span className="text-2xl md:text-3xl">🏠</span>
          </div>
        </div>

        {/* 3D Blueprint */}
        <div className="absolute bottom-[25%] left-[12%] animate-float-slow preserve-3d">
          <div className="w-18 h-18 md:w-22 md:h-22 rounded-2xl bg-gradient-to-br from-green-500/30 to-emerald-600/30 backdrop-blur-sm border border-green-400/20 flex items-center justify-center shadow-2xl shadow-green-500/20 p-4 md:p-5">
            <span className="text-2xl md:text-3xl">📐</span>
          </div>
        </div>

        {/* 3D Tools */}
        <div className="absolute bottom-[30%] right-[15%] animate-float preserve-3d" style={{ animationDelay: '2s' }}>
          <div className="w-16 h-16 md:w-20 md:h-20 rounded-2xl bg-gradient-to-br from-yellow-500/30 to-amber-600/30 backdrop-blur-sm border border-yellow-400/20 flex items-center justify-center shadow-2xl shadow-yellow-500/20">
            <span className="text-2xl md:text-3xl">🔨</span>
          </div>
        </div>

        {/* 3D Rotating Cube */}
        <div className="absolute top-[40%] right-[30%] hidden lg:block perspective-1000">
          <div className="animate-spin-slow preserve-3d w-16 h-16">
            <div className="absolute inset-0 rounded-lg bg-gradient-to-br from-primary-400/20 to-primary-600/20 border border-primary-300/20 backdrop-blur-sm" style={{ transform: 'translateZ(32px)' }} />
            <div className="absolute inset-0 rounded-lg bg-gradient-to-br from-accent-400/20 to-accent-600/20 border border-accent-300/20 backdrop-blur-sm" style={{ transform: 'rotateY(90deg) translateZ(32px)' }} />
            <div className="absolute inset-0 rounded-lg bg-gradient-to-br from-green-400/20 to-green-600/20 border border-green-300/20 backdrop-blur-sm" style={{ transform: 'rotateY(180deg) translateZ(32px)' }} />
            <div className="absolute inset-0 rounded-lg bg-gradient-to-br from-purple-400/20 to-purple-600/20 border border-purple-300/20 backdrop-blur-sm" style={{ transform: 'rotateY(270deg) translateZ(32px)' }} />
          </div>
        </div>

        {/* Floating particles */}
        {[...Array(20)].map((_, i) => (
          <div key={i}
            className="absolute w-1 h-1 bg-white/20 rounded-full"
            style={{
              top: `${Math.random() * 100}%`,
              left: `${Math.random() * 100}%`,
              animation: `float ${5 + Math.random() * 5}s ease-in-out infinite ${Math.random() * 3}s`,
            }}
          />
        ))}

        {/* Grid lines */}
        <div className="absolute inset-0 opacity-5">
          <div className="h-full w-full" style={{
            backgroundImage: 'linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)',
            backgroundSize: '60px 60px'
          }} />
        </div>
      </div>

      {/* Hero Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 flex items-center min-h-[90vh]">
        <div className="w-full grid lg:grid-cols-2 gap-12 items-center py-20">
          <div className="animate-slide-up">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary-500/10 border border-primary-400/20 text-primary-300 text-sm font-medium mb-6">
              <Zap size={14} /> India's #1 Construction Marketplace
            </div>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white leading-tight mb-6">
              Get the Best Quotation for Your{' '}
              <span className="bg-gradient-to-r from-primary-400 to-accent-400 bg-clip-text text-transparent">Dream Project</span>
            </h1>
            <p className="text-lg text-gray-300 mb-8 max-w-xl leading-relaxed">
              Connect with verified construction companies, compare competitive bids, and bring your vision to life with transparent pricing and AI-powered estimates.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Link to="/quotation"
                className="inline-flex items-center justify-center gap-2 px-6 py-3.5 bg-gradient-to-r from-primary-500 to-primary-600 text-white font-semibold rounded-xl hover:shadow-xl hover:shadow-primary-500/30 transition-all transform hover:-translate-y-0.5">
                Get Quotation <ArrowRight size={18} />
              </Link>
              <Link to="/auth?type=company"
                className="inline-flex items-center justify-center gap-2 px-6 py-3.5 bg-white/10 backdrop-blur text-white font-semibold rounded-xl border border-white/20 hover:bg-white/20 transition-all">
                Join as Company <Building2 size={18} />
              </Link>
            </div>
            <div className="flex items-center gap-6 mt-8 text-sm text-gray-400">
              <span className="flex items-center gap-1.5"><CheckCircle2 size={16} className="text-green-400" /> Verified Companies</span>
              <span className="flex items-center gap-1.5"><CheckCircle2 size={16} className="text-green-400" /> Escrow Payments</span>
              <span className="flex items-center gap-1.5"><CheckCircle2 size={16} className="text-green-400" /> AI Estimates</span>
            </div>
          </div>

          {/* 3D Stats Cards */}
          <div className="hidden lg:block perspective-1000">
            <div className="preserve-3d space-y-4" style={{ transform: 'rotateY(-5deg) rotateX(2deg)' }}>
              <div className="glass rounded-2xl p-6 animate-pulse-glow">
                <div className="flex items-center justify-between mb-4">
                  <span className="text-white/80 text-sm font-medium">Live Platform Stats</span>
                  <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  {[
                    { label: 'Active Projects', value: '1,234', icon: '📊' },
                    { label: 'Verified Companies', value: '856+', icon: '✅' },
                    { label: 'Happy Customers', value: '12,450', icon: '😊' },
                    { label: 'Success Rate', value: '94.5%', icon: '🎯' },
                  ].map((stat, i) => (
                    <div key={i} className="bg-white/5 rounded-xl p-3 border border-white/5">
                      <span className="text-lg">{stat.icon}</span>
                      <p className="text-white font-bold text-xl mt-1">{stat.value}</p>
                      <p className="text-white/50 text-xs mt-0.5">{stat.label}</p>
                    </div>
                  ))}
                </div>
              </div>
              <div className="glass rounded-2xl p-4 ml-8 max-w-xs">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-green-500/20 flex items-center justify-center">
                    <TrendingUp size={18} className="text-green-400" />
                  </div>
                  <div>
                    <p className="text-white text-sm font-medium">New bid received!</p>
                    <p className="text-white/50 text-xs">Kitchen Renovation - ₹2,80,000</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom wave */}
      <div className="absolute bottom-0 left-0 right-0">
        <svg viewBox="0 0 1440 80" fill="none" className="w-full">
          <path d="M0 80L48 74.7C96 69 192 59 288 53.3C384 48 480 48 576 53.3C672 59 768 69 864 69.3C960 69 1056 59 1152 53.3C1248 48 1344 48 1392 48L1440 48V80H1392C1344 80 1248 80 1152 80C1056 80 960 80 864 80C768 80 672 80 576 80C480 80 384 80 288 80C192 80 96 80 48 80H0Z" fill="#f9fafb"/>
        </svg>
      </div>
    </div>
  );
}

export default function HomePage() {
  const steps = [
    { num: '01', title: 'Describe Your Project', desc: 'Fill out a simple form with your requirements, budget, and preferences.', icon: '📝', color: 'from-primary-500 to-primary-600' },
    { num: '02', title: 'Receive Competitive Bids', desc: 'Verified companies submit detailed quotations with price breakdowns.', icon: '📊', color: 'from-accent-500 to-accent-600' },
    { num: '03', title: 'Choose & Build', desc: 'Compare bids, select the best company, and start your dream project.', icon: '🏗️', color: 'from-green-500 to-green-600' },
  ];

  const features = [
    { icon: Zap, title: 'AI Cost Estimator', desc: 'Get instant rough estimates before bidding to set realistic budgets.', color: 'bg-purple-50 text-purple-600' },
    { icon: Shield, title: 'Escrow Payments', desc: 'Money released only after milestone completion for full protection.', color: 'bg-blue-50 text-blue-600' },
    { icon: TrendingUp, title: 'Material Price Tracker', desc: 'Real-time market prices prevent overcharging on materials.', color: 'bg-green-50 text-green-600' },
    { icon: Leaf, title: 'Green Construction', desc: 'Eco-friendly material suggestions with carbon footprint scoring.', color: 'bg-emerald-50 text-emerald-600' },
    { icon: Star, title: 'Verified Companies', desc: 'GST verified, licensed, and platform-verified professionals only.', color: 'bg-yellow-50 text-yellow-600' },
    { icon: Users, title: 'Warranty Tracking', desc: 'Digital warranty cards and automatic service reminders.', color: 'bg-red-50 text-red-600' },
  ];

  return (
    <div>
      <Hero3D />

      {/* How It Works */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-16">
            <span className="text-primary-600 font-semibold text-sm uppercase tracking-wider">Simple Process</span>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mt-2">How It Works</h2>
            <p className="text-gray-500 mt-3 max-w-2xl mx-auto">Three simple steps to get the best quotation for your construction or renovation project.</p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {steps.map((step, i) => (
              <div key={i} className="relative group">
                <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100 hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
                  <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${step.color} flex items-center justify-center text-2xl mb-5 shadow-lg`}>
                    {step.icon}
                  </div>
                  <span className="text-5xl font-black text-gray-100 absolute top-4 right-6">{step.num}</span>
                  <h3 className="text-xl font-bold text-gray-900 mb-2">{step.title}</h3>
                  <p className="text-gray-500 leading-relaxed">{step.desc}</p>
                </div>
                {i < 2 && (
                  <div className="hidden md:block absolute top-1/2 -right-4 w-8 text-gray-300">
                    <ArrowRight size={24} />
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-16">
            <span className="text-primary-600 font-semibold text-sm uppercase tracking-wider">Smart Features</span>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mt-2">Why Choose BuildBid?</h2>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((f, i) => (
              <div key={i} className="rounded-2xl p-6 border border-gray-100 hover:shadow-lg hover:border-primary-100 transition-all duration-300 group">
                <div className={`w-12 h-12 rounded-xl ${f.color} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                  <f.icon size={22} />
                </div>
                <h3 className="text-lg font-bold text-gray-900 mb-2">{f.title}</h3>
                <p className="text-gray-500 text-sm leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Companies */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-12">
            <span className="text-primary-600 font-semibold text-sm uppercase tracking-wider">Trusted Partners</span>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mt-2">Featured Companies</h2>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {companies.slice(0, 6).map(c => (
              <Link key={c.id} to={`/company/${c.id}`}
                className="bg-white rounded-2xl p-6 border border-gray-100 hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-14 h-14 rounded-2xl bg-gray-50 flex items-center justify-center text-3xl">{c.logo}</div>
                  <div>
                    <h3 className="font-bold text-gray-900">{c.name}</h3>
                    <p className="text-sm text-gray-500">{c.location}</p>
                  </div>
                </div>
                <div className="flex items-center gap-4 mb-3">
                  <span className="flex items-center gap-1 text-sm"><Star size={14} className="text-yellow-400 fill-yellow-400" /> {c.rating}</span>
                  <span className="text-sm text-gray-400">{c.completedProjects} projects</span>
                  <span className="text-sm text-gray-400">{c.experience} yrs</span>
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {c.services.map(s => (
                    <span key={s} className="px-2.5 py-1 rounded-full bg-primary-50 text-primary-600 text-xs font-medium">{s}</span>
                  ))}
                  {c.gstVerified && <span className="px-2.5 py-1 rounded-full bg-green-50 text-green-600 text-xs font-medium">GST ✓</span>}
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* AI Designer Section */}
      <section className="py-20 bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900 relative overflow-hidden">
        {/* Animated background */}
        <div className="absolute inset-0 opacity-20">
          <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(ellipse_at_30%_50%,rgba(168,85,247,0.4),transparent_50%)]" />
          <div className="absolute top-0 right-0 w-full h-full bg-[radial-gradient(ellipse_at_70%_30%,rgba(236,72,153,0.4),transparent_50%)]" />
        </div>
        <div className="absolute inset-0 opacity-5">
          <div className="h-full w-full" style={{
            backgroundImage: 'linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)',
            backgroundSize: '50px 50px'
          }} />
        </div>

        {/* Floating 3D elements */}
        <div className="absolute top-[10%] left-[5%] animate-float">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-purple-500/20 to-pink-500/20 backdrop-blur-sm border border-purple-400/10 flex items-center justify-center">
            <span className="text-2xl">🎨</span>
          </div>
        </div>
        <div className="absolute top-[20%] right-[8%] animate-float-delayed">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-pink-500/20 to-rose-500/20 backdrop-blur-sm border border-pink-400/10 flex items-center justify-center">
            <span className="text-xl">✨</span>
          </div>
        </div>
        <div className="absolute bottom-[15%] left-[10%] animate-float-slow">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-cyan-500/20 to-blue-500/20 backdrop-blur-sm border border-cyan-400/10 flex items-center justify-center">
            <span className="text-xl">🏠</span>
          </div>
        </div>
        <div className="absolute bottom-[25%] right-[12%] animate-float" style={{ animationDelay: '3s' }}>
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-amber-500/20 to-orange-500/20 backdrop-blur-sm border border-amber-400/10 flex items-center justify-center">
            <span className="text-xl">📐</span>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 relative z-10">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-purple-500/10 border border-purple-400/20 text-purple-300 text-sm font-medium mb-6">
                <Sparkles size={14} /> AI-Powered Design Tool
              </div>
              <h2 className="text-3xl md:text-5xl font-bold text-white leading-tight mb-6">
                Visualize Your Dream{' '}
                <span className="bg-gradient-to-r from-purple-400 via-pink-400 to-rose-400 bg-clip-text text-transparent">Interior & Architecture</span>
              </h2>
              <p className="text-lg text-gray-300 mb-8 leading-relaxed">
                Chat with our AI architect, brainstorm design ideas, get cost estimates, and generate stunning visual renders of your dream spaces — all powered by cutting-edge AI.
              </p>

              <div className="space-y-4 mb-8">
                {[
                  { icon: Bot, text: 'Chat with AI Architect for expert design advice', color: 'text-purple-400' },
                  { icon: Wand2, text: 'Generate photorealistic interior & exterior renders', color: 'text-pink-400' },
                  { icon: MessageSquare, text: 'Get instant cost estimates in INR with material breakdowns', color: 'text-cyan-400' },
                ].map((item, i) => (
                  <div key={i} className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center">
                      <item.icon size={16} className={item.color} />
                    </div>
                    <span className="text-gray-300 text-sm">{item.text}</span>
                  </div>
                ))}
              </div>

              <Link to="/ai-designer"
                className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-purple-600 via-pink-600 to-rose-600 text-white font-bold rounded-xl hover:shadow-2xl hover:shadow-purple-500/30 transition-all transform hover:-translate-y-1">
                <Sparkles size={18} /> Launch AI Designer <ArrowRight size={18} />
              </Link>
            </div>

            {/* Preview Card */}
            <div className="hidden lg:block">
              <div className="bg-white/5 backdrop-blur-xl rounded-3xl border border-white/10 p-6 shadow-2xl">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center">
                    <Bot size={20} className="text-white" />
                  </div>
                  <div>
                    <p className="text-white font-semibold text-sm">BuildBidBot</p>
                    <p className="text-white/40 text-xs">AI Architect & Designer</p>
                  </div>
                  <span className="ml-auto w-2 h-2 rounded-full bg-green-400 animate-pulse" />
                </div>

                <div className="space-y-3 mb-4">
                  <div className="bg-white/5 rounded-2xl rounded-tl-md p-3 max-w-[85%]">
                    <p className="text-white/80 text-sm">Here's a modern living room design with an L-shaped sofa, wooden accents, and warm lighting. Estimated cost: ₹3.5-5.5L</p>
                  </div>
                  <div className="bg-purple-500/20 rounded-2xl rounded-tr-md p-3 max-w-[75%] ml-auto">
                    <p className="text-white/90 text-sm">Can you make it more minimalist with a Scandinavian touch?</p>
                  </div>
                  <div className="bg-white/5 rounded-2xl rounded-tl-md p-3 max-w-[85%]">
                    <p className="text-white/80 text-sm">Great choice! I'll add light wood tones, neutral colors, and clean lines. Use "Generate Image" to see it! ✨</p>
                  </div>
                </div>

                <div className="bg-gradient-to-r from-purple-500/20 to-pink-500/20 rounded-xl p-3 border border-purple-400/10">
                  <div className="flex items-center gap-2 text-purple-300 text-xs mb-2">
                    <Wand2 size={12} /> Generated Design Preview
                  </div>
                  <div className="h-32 rounded-lg bg-gradient-to-br from-purple-900/50 to-pink-900/50 flex items-center justify-center border border-white/5">
                    <div className="text-center">
                      <span className="text-4xl">🏡</span>
                      <p className="text-white/40 text-xs mt-1">AI-Generated Render</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 bg-gradient-to-br from-primary-600 to-primary-800 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="h-full w-full" style={{
            backgroundImage: 'linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)',
            backgroundSize: '40px 40px'
          }} />
        </div>
        <div className="max-w-4xl mx-auto px-4 sm:px-6 text-center relative z-10">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">Ready to Start Your Project?</h2>
          <p className="text-primary-100 text-lg mb-8 max-w-2xl mx-auto">Join thousands of homeowners who have found their perfect construction partner through BuildBid.</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/quotation" className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-white text-primary-700 font-bold rounded-xl hover:shadow-2xl transition-all transform hover:-translate-y-1">
              Get Free Quotation <ArrowRight size={18} />
            </Link>
            <Link to="/auth?type=company" className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-white/10 text-white font-bold rounded-xl border-2 border-white/30 hover:bg-white/20 transition-all">
              Register Your Company
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
