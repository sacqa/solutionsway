import React from 'react';

interface ServiceItem {
  id: string;
  title: string;
  category: string;
  description: string;
  capabilities: string[];
  icon: React.ReactNode;
}

interface ServicesProps {
  onSelectService: (serviceName: string) => void;
}

export const Services: React.FC<ServicesProps> = ({ onSelectService }) => {
  const services: ServiceItem[] = [
    {
      id: 'digital-marketing',
      title: 'Digital Marketing',
      category: 'Growth & Reach',
      description:
        'Targeted digital marketing strategies designed to increase relevant reach and commercial engagement.',
      capabilities: [
        'Paid advertising management',
        'Social media marketing',
        'Content strategy & execution',
        'Campaign performance reporting',
      ],
      icon: (
        <svg className="w-6 h-6 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d="M11 3.055A9.001 9.001 0 1020.945 13H11V3.055z" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d="M20.488 9H15V3.512A9.025 9.025 0 0120.488 9z" />
        </svg>
      ),
    },
    {
      id: 'seo',
      title: 'SEO',
      category: 'Organic Visibility',
      description:
        'Structured search engine optimisation to ensure your digital properties are discoverable, indexable, and performant.',
      capabilities: [
        'Technical SEO audits',
        'On-page optimisation',
        'Keyword & intent research',
        'Local SEO configuration',
      ],
      icon: (
        <svg className="w-6 h-6 text-teal-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
      ),
    },
    {
      id: 'mobile-app-development',
      title: 'Mobile App Development',
      category: 'Native & Cross-Platform',
      description:
        'End-to-end mobile engineering delivering intuitive, secure applications for both iOS and Android platforms.',
      capabilities: [
        'Native iOS & Android development',
        'Cross-platform applications',
        'Mobile UI/UX architecture',
        'Testing, release & maintenance',
      ],
      icon: (
        <svg className="w-6 h-6 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
        </svg>
      ),
    },
    {
      id: 'software-development',
      title: 'Software Development',
      category: 'Bespoke Engineering',
      description:
        'Resilient web platforms, automated workflows, and bespoke business systems tailored to your technical requirements.',
      capabilities: [
        'Custom web application builds',
        'Internal business tools & portals',
        'API design & third-party integrations',
        'Workflow automation engines',
      ],
      icon: (
        <svg className="w-6 h-6 text-teal-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
        </svg>
      ),
    },
  ];

  return (
    <section id="services" className="py-24 bg-slate-900 border-t border-b border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-xs uppercase tracking-widest text-blue-400 font-semibold mb-2">Capabilities</h2>
          <p className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
            Services Built Around Practical Outcomes
          </p>
          <p className="mt-4 text-slate-400 text-base">
            Every service we provide is delivered with strict attention to code quality, usability, and your commercial objectives.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {services.map((svc) => (
            <div
              key={svc.id}
              className="flex flex-col justify-between bg-slate-950 p-6 rounded-2xl border border-slate-800 hover:border-blue-500/50 transition-all duration-300 hover:shadow-xl hover:shadow-blue-900/10 group"
            >
              <div>
                <div className="w-12 h-12 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-center mb-5 group-hover:scale-105 transition-transform">
                  {svc.icon}
                </div>
                <span className="text-xs font-medium text-teal-400">{svc.category}</span>
                <h3 className="text-xl font-bold text-white mt-1 mb-3">{svc.title}</h3>
                <p className="text-sm text-slate-400 leading-relaxed mb-6">{svc.description}</p>
                <ul className="space-y-2 mb-6">
                  {svc.capabilities.map((cap, idx) => (
                    <li key={idx} className="flex items-center text-xs text-slate-300">
                      <span className="w-1.5 h-1.5 rounded-full bg-blue-500 mr-2 flex-shrink-0" />
                      {cap}
                    </li>
                  ))}
                </ul>
              </div>

              <button
                type="button"
                onClick={() => onSelectService(svc.title)}
                className="w-full mt-2 py-2.5 px-4 text-xs font-semibold text-blue-400 bg-blue-950/40 hover:bg-blue-600 hover:text-white border border-blue-800/40 hover:border-blue-500 rounded-lg transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-400"
              >
                Enquire About This Service →
              </button>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
