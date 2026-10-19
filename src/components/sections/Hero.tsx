import React from 'react';

export const Hero: React.FC = () => {
  const scrollTo = (id: string) => {
    document.querySelector(id)?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section id="home" className="relative pt-32 pb-20 md:pt-44 md:pb-32 overflow-hidden bg-slate-950">
      {/* Background radial gradient */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[500px] bg-blue-600/10 blur-[130px] rounded-full pointer-events-none" />
      <div className="absolute top-2/3 right-10 w-[400px] h-[350px] bg-teal-500/5 blur-[120px] rounded-full pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          {/* Left Column: Messaging */}
          <div className="lg:col-span-7 text-center lg:text-left">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-blue-500/30 bg-blue-500/10 text-blue-400 text-xs font-semibold uppercase tracking-wider mb-6">
              <span className="w-2 h-2 rounded-full bg-teal-400 animate-pulse" />
              London-Based Digital Consultancy
            </div>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-white tracking-tight leading-[1.12]">
              Digital Solutions That Move Your Business Forward.
            </h1>
            <p className="mt-6 text-lg sm:text-xl text-slate-300 max-w-2xl leading-relaxed">
              From digital marketing and SEO to mobile apps and custom software, Solutions Way helps businesses
              strengthen their online presence and build technology around their goals.
            </p>

            <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
              <button
                onClick={() => scrollTo('#contact')}
                className="px-6 py-3.5 text-base font-semibold text-white bg-blue-600 hover:bg-blue-500 active:scale-95 transition rounded-xl shadow-lg shadow-blue-600/20 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-400"
              >
                Discuss Your Project
              </button>
              <button
                onClick={() => scrollTo('#services')}
                className="px-6 py-3.5 text-base font-semibold text-slate-200 bg-slate-900 border border-slate-700 hover:bg-slate-800 hover:text-white transition rounded-xl focus:outline-none focus-visible:ring-2 focus-visible:ring-slate-400"
              >
                Explore Our Services
              </button>
            </div>

            <div className="mt-10 pt-8 border-t border-slate-900 flex flex-wrap items-center justify-center lg:justify-start gap-8 text-xs text-slate-400">
              <div className="flex items-center gap-2">
                <span className="text-emerald-400 font-bold">✓</span>
                <span>London Office: SW6 7DU</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-emerald-400 font-bold">✓</span>
                <span>UK GDPR Compliant</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-emerald-400 font-bold">✓</span>
                <span>Prompt Project Scoping</span>
              </div>
            </div>
          </div>

          {/* Right Column: Abstract Technology Architecture Visual */}
          <div className="lg:col-span-5 flex justify-center">
            <div className="relative w-full max-w-md p-6 bg-slate-900/80 border border-slate-800 rounded-2xl shadow-2xl backdrop-blur-sm">
              <div className="flex items-center justify-between border-b border-slate-800 pb-4 mb-4">
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 rounded-full bg-red-500/80" />
                  <div className="w-3 h-3 rounded-full bg-yellow-500/80" />
                  <div className="w-3 h-3 rounded-full bg-green-500/80" />
                </div>
                <span className="text-xs font-mono text-slate-500">solutions-way-system.io</span>
              </div>

              <div className="space-y-3 font-mono text-xs">
                <div className="p-3 bg-slate-950/60 rounded-lg border border-slate-800/80 flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <div className="w-2 h-2 rounded-full bg-blue-400" />
                    <span className="text-slate-300">Software Architecture</span>
                  </div>
                  <span className="text-teal-400 font-medium">Scalable &amp; Typed</span>
                </div>

                <div className="p-3 bg-slate-950/60 rounded-lg border border-slate-800/80 flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <div className="w-2 h-2 rounded-full bg-teal-400" />
                    <span className="text-slate-300">Mobile Engineering</span>
                  </div>
                  <span className="text-blue-400 font-medium">iOS &amp; Android</span>
                </div>

                <div className="p-3 bg-slate-950/60 rounded-lg border border-slate-800/80 flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <div className="w-2 h-2 rounded-full bg-indigo-400" />
                    <span className="text-slate-300">Organic Visibility</span>
                  </div>
                  <span className="text-indigo-400 font-medium">Technical SEO</span>
                </div>

                <div className="p-3 bg-slate-950/60 rounded-lg border border-slate-800/80 flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <div className="w-2 h-2 rounded-full bg-emerald-400" />
                    <span className="text-slate-300">Growth Strategy</span>
                  </div>
                  <span className="text-emerald-400 font-medium">Targeted Campaigns</span>
                </div>
              </div>

              <div className="mt-5 p-3 rounded-lg bg-blue-950/30 border border-blue-800/30 text-xs text-blue-300 flex items-center justify-between">
                <span>Infrastructure: London, UK</span>
                <span className="text-emerald-400 font-semibold flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                  Ready for deployment
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
