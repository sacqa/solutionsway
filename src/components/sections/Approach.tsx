import React from 'react';

export const Approach: React.FC = () => {
  const steps = [
    {
      num: '01',
      title: 'Discover',
      tagline: 'Requirements & Objectives',
      desc: 'We examine your business landscape, target audience, and precise technical or commercial requirements before proposing any technical path.',
    },
    {
      num: '02',
      title: 'Plan',
      tagline: 'Architecture & Scope',
      desc: 'We outline the technical specification, timeline, UX flows, and defined deliverables, giving you complete visibility into the roadmap.',
    },
    {
      num: '03',
      title: 'Deliver',
      tagline: 'Execution & Quality Assurance',
      desc: 'We design, develop, test, and deploy the solution or campaign with continuous integration checks and thorough staging reviews.',
    },
    {
      num: '04',
      title: 'Improve',
      tagline: 'Measurement & Refinement',
      desc: 'Post-launch, we review system metrics, address feedback, and provide incremental updates to maintain long-term stability and relevance.',
    },
  ];

  return (
    <section id="approach" className="py-24 bg-slate-900 border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-xs uppercase tracking-widest text-blue-400 font-semibold mb-2">Process</h2>
          <p className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
            How We Execute Projects
          </p>
          <p className="mt-4 text-slate-400">
            A four-stage methodology designed to minimise project risks and deliver dependable solutions on schedule.
          </p>
        </div>

        <div className="grid md:grid-cols-4 gap-6">
          {steps.map((step) => (
            <div
              key={step.num}
              className="relative p-6 bg-slate-950 rounded-2xl border border-slate-800 hover:border-slate-700 transition flex flex-col justify-between"
            >
              <div>
                <span className="text-3xl font-extrabold font-mono text-blue-500/40 block mb-4">
                  {step.num}
                </span>
                <h3 className="text-xl font-bold text-white mb-1">{step.title}</h3>
                <span className="text-xs font-medium text-teal-400 block mb-3">{step.tagline}</span>
                <p className="text-sm text-slate-400 leading-relaxed">{step.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
