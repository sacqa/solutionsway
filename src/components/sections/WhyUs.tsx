import React from 'react';

export const WhyUs: React.FC = () => {
  const pillars = [
    {
      title: 'Business-Focused Delivery',
      desc: 'We do not build technology for the sake of technology. Every feature or campaign directly links back to your verified commercial requirements.',
    },
    {
      title: 'Direct Communication',
      desc: 'You work closely with the people responsible for delivering your project. No intermediaries, no inflated promises, and no ambiguity.',
    },
    {
      title: 'Maintainable Engineering',
      desc: 'Our codebases and systems follow recognised standards. They are documented, tested, and built to scale as your operations expand.',
    },
    {
      title: 'Long-Term Reliability',
      desc: 'Launch day is just the starting point. We provide structured ongoing maintenance, updates, and monitoring to keep systems secure and online.',
    },
  ];

  return (
    <section id="why-us" className="py-24 bg-slate-950">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-12 gap-12 items-center">
          <div className="lg:col-span-5">
            <h2 className="text-xs uppercase tracking-widest text-teal-400 font-semibold mb-2">Values & Standards</h2>
            <p className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
              A Practical Approach to Digital Delivery
            </p>
            <p className="mt-4 text-slate-400 leading-relaxed">
              We focus on measurable utility and clean execution. Rather than relying on buzzwords or speculative claims, we build dependable digital products and manageable growth strategies.
            </p>
            <div className="mt-6 flex items-center gap-3 text-xs text-slate-400">
              <span className="w-2 h-2 rounded-full bg-teal-400" />
              <span>Full compliance with UK technology and data standards</span>
            </div>
          </div>

          <div className="lg:col-span-7 grid sm:grid-cols-2 gap-6">
            {pillars.map((pillar, idx) => (
              <div key={idx} className="p-6 bg-slate-900/50 border border-slate-800 rounded-xl hover:border-slate-700 transition">
                <div className="text-blue-500 font-mono text-sm font-semibold mb-2">0{idx + 1}.</div>
                <h3 className="text-base font-bold text-white mb-2">{pillar.title}</h3>
                <p className="text-sm text-slate-400 leading-relaxed">{pillar.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};
