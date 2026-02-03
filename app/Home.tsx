import Link from "next/link";
import Image from "next/image";
import { featuresGridList } from "./utils/data";

export default function Home() {
  return (
    <div className="relative min-h-screen bg-gradient-to-br from-slate-900 via-teal-950 to-slate-900 overflow-hidden">
      {/* Film grain texture overlay */}
      <div className="fixed inset-0 opacity-[0.03] pointer-events-none mix-blend-overlay">
        <div className="absolute inset-0" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 400 400' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
          backgroundRepeat: 'repeat',
        }}></div>
      </div>

      {/* Diagonal accent element */}
      <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-gradient-to-br from-orange-500/10 to-transparent rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
      <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-gradient-to-tr from-teal-500/10 to-transparent rounded-full translate-y-1/2 -translate-x-1/2"></div>

      {/* Hero Section */}
      <div className="relative mx-auto max-w-7xl px-6 lg:px-8 pt-20 pb-24 lg:pt-32 lg:pb-32">
        <div className="grid lg:grid-cols-12 gap-12 items-center">
          {/* Left content - Asymmetric */}
          <div className="lg:col-span-7 space-y-8">
            {/* Overline with film strip accent */}
            <div className="flex items-center gap-3 group">
              <div className="flex gap-0.5">
                <div className="w-1 h-8 bg-orange-500 animate-pulse"></div>
                <div className="w-1 h-8 bg-orange-400 animate-pulse delay-75"></div>
                <div className="w-1 h-8 bg-orange-500 animate-pulse delay-150"></div>
              </div>
              <p className="text-teal-400 uppercase tracking-[0.3em] text-sm font-medium">
                Production-Grade Video Editing
              </p>
            </div>

            {/* Main headline - Bold typography */}
            <h1 className="relative">
              <span className="block text-7xl lg:text-8xl xl:text-9xl font-black tracking-tight leading-none">
                <span className="text-white" style={{ fontFamily: '"Bebas Neue", sans-serif' }}>CLIP</span>
                <span className="relative inline-block">
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-500 via-amber-400 to-orange-500" style={{ fontFamily: '"Bebas Neue", sans-serif' }}>
                    .AI
                  </span>
                  {/* Animated underline */}
                  <div className="absolute -bottom-2 left-0 right-0 h-1 bg-gradient-to-r from-orange-500 to-amber-400 transform origin-left animate-pulse"></div>
                </span>
              </span>
              <span className="block text-2xl lg:text-3xl mt-4 text-slate-300 font-light tracking-wide" style={{ fontFamily: '"Work Sans", sans-serif' }}>
                Edit like a pro.<br className="hidden sm:block" />
                <span className="text-teal-400">No downloads. No limits.</span>
              </span>
            </h1>

            {/* Description */}
            <p className="text-lg lg:text-xl text-slate-400 max-w-xl leading-relaxed" style={{ fontFamily: '"Work Sans", sans-serif' }}>
              Browser-based video editing powered by AI. Create stunning videos from any device with professional tools that rival desktop software.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 pt-4">
              <Link
                href="/projects"
                className="group relative px-8 py-4 bg-gradient-to-r from-orange-500 to-amber-500 rounded-lg overflow-hidden transition-all hover:shadow-2xl hover:shadow-orange-500/50 hover:scale-105"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-orange-600 to-amber-600 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                <div className="relative flex items-center justify-center gap-3">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    width="24"
                    height="24"
                    fill="currentColor"
                    className="w-6 h-6 group-hover:rotate-90 transition-transform"
                  >
                    <path d="M8 5v14l11-7z" />
                  </svg>
                  <span className="text-lg font-bold text-slate-900" style={{ fontFamily: '"Bebas Neue", sans-serif', letterSpacing: '0.05em' }}>
                    START CREATING
                  </span>
                </div>
              </Link>

            </div>

            {/* Stats bar */}
            <div className="flex gap-8 pt-8 border-t border-slate-700/50">
              <div>
                <div className="text-3xl font-bold text-orange-400" style={{ fontFamily: '"Bebas Neue", sans-serif' }}>100%</div>
                <div className="text-sm text-slate-500 uppercase tracking-wider">Free & Open</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-teal-400" style={{ fontFamily: '"Bebas Neue", sans-serif' }}>0</div>
                <div className="text-sm text-slate-500 uppercase tracking-wider">Watermarks</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-orange-400" style={{ fontFamily: '"Bebas Neue", sans-serif' }}>∞</div>
                <div className="text-sm text-slate-500 uppercase tracking-wider">Possibilities</div>
              </div>
            </div>
          </div>

          {/* Right visual element - Abstract video frame */}
          <div className="lg:col-span-5 relative">
            <div className="relative aspect-square max-w-md mx-auto lg:max-w-none">
              {/* Layered frames creating depth */}
              <div className="absolute inset-0 bg-gradient-to-br from-slate-800 to-slate-900 rounded-2xl border-2 border-teal-500/30 rotate-6 transform hover:rotate-12 transition-transform duration-500"></div>
              <div className="absolute inset-0 bg-gradient-to-br from-slate-700 to-slate-800 rounded-2xl border-2 border-orange-500/30 -rotate-3 transform hover:-rotate-6 transition-transform duration-500"></div>
              <div className="relative bg-gradient-to-br from-slate-900 to-slate-950 rounded-2xl border-2 border-slate-600 p-8 backdrop-blur-sm">
                {/* Film strip holes */}
                <div className="absolute left-2 top-0 bottom-0 flex flex-col justify-around">
                  {[...Array(8)].map((_, i) => (
                    <div key={i} className="w-3 h-3 rounded-sm bg-slate-800 border border-slate-700"></div>
                  ))}
                </div>
                <div className="absolute right-2 top-0 bottom-0 flex flex-col justify-around">
                  {[...Array(8)].map((_, i) => (
                    <div key={i} className="w-3 h-3 rounded-sm bg-slate-800 border border-slate-700"></div>
                  ))}
                </div>

                {/* Center content - animated play icon */}
                <div className="flex items-center justify-center h-full">
                  <div className="relative">
                    <div className="absolute inset-0 bg-orange-500 rounded-full blur-2xl opacity-50 animate-pulse"></div>
                    <div className="relative w-32 h-32 rounded-full bg-gradient-to-br from-orange-500 to-amber-500 flex items-center justify-center group hover:scale-110 transition-transform cursor-pointer">
                      <svg className="w-16 h-16 text-slate-900 ml-2" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M8 5v14l11-7z" />
                      </svg>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="relative py-24 bg-slate-950/50 backdrop-blur-sm">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          {/* Section header */}
          <div className="text-center mb-16">
            <div className="inline-block">
              <h2 className="text-5xl lg:text-6xl font-black text-white mb-4" style={{ fontFamily: '"Bebas Neue", sans-serif', letterSpacing: '0.05em' }}>
                PROFESSIONAL TOOLS
              </h2>
              <div className="h-1 bg-gradient-to-r from-transparent via-orange-500 to-transparent"></div>
            </div>
            <p className="mt-6 text-xl text-slate-400 max-w-2xl mx-auto" style={{ fontFamily: '"Work Sans", sans-serif' }}>
              Everything you need to create stunning videos, right in your browser
            </p>
          </div>

          {/* Features grid - staggered layout */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {featuresGridList.items.map(({ id, title, description, icon }, index) => (
              <article
                key={id}
                className="group relative bg-slate-800/30 backdrop-blur-sm border border-slate-700/50 rounded-xl p-6 hover:border-teal-500/50 transition-all duration-300 hover:shadow-xl hover:shadow-teal-500/10 hover:-translate-y-1"
                style={{
                  animationDelay: `${index * 100}ms`,
                }}
              >
                {/* Gradient overlay on hover */}
                <div className="absolute inset-0 bg-gradient-to-br from-orange-500/0 to-teal-500/0 group-hover:from-orange-500/5 group-hover:to-teal-500/5 rounded-xl transition-all duration-300"></div>

                <div className="relative space-y-4">
                  {/* Icon */}
                  <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-orange-500/20 to-teal-500/20 border border-orange-500/30 flex items-center justify-center group-hover:scale-110 transition-transform">
                    <Image
                      alt={icon.alt ?? title}
                      className="invert opacity-80 group-hover:opacity-100 transition-opacity"
                      height={20}
                      src={icon.url}
                      width={20}
                    />
                  </div>

                  {/* Content */}
                  <div>
                    <h5 className="text-xl font-bold text-white mb-2 group-hover:text-orange-400 transition-colors" style={{ fontFamily: '"Bebas Neue", sans-serif', letterSpacing: '0.05em' }}>
                      {title}
                    </h5>
                    <p className="text-slate-400 leading-relaxed" style={{ fontFamily: '"Work Sans", sans-serif' }}>
                      {description}
                    </p>
                  </div>
                </div>

                {/* Corner accent */}
                <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-orange-500/10 to-transparent rounded-bl-full opacity-0 group-hover:opacity-100 transition-opacity"></div>
              </article>
            ))}
          </div>
        </div>
      </div>

      {/* Add Google Fonts */}
      <link rel="preconnect" href="https://fonts.googleapis.com" />
      <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      <link href="https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Work+Sans:wght@300;400;500;600;700&display=swap" rel="stylesheet" />
    </div>
  );
}