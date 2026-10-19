import React, { useState } from 'react';

interface FAQItem {
  question: string;
  answer: string;
}

export const FAQs: React.FC = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const faqs: FAQItem[] = [
    {
      question: 'How do I choose the right service for my organisation?',
      answer:
        'If you are uncertain whether you require custom software development, a mobile application, or organic visibility improvements, you can submit an enquiry describing your business challenge. We will review your goals and suggest an appropriate technical scope.',
    },
    {
      question: 'How are project estimates and costs calculated?',
      answer:
        'Pricing depends strictly on agreed project requirements, technical complexity, third-party integrations, and timeline parameters. We do not use arbitrary flat rates; instead, we formulate transparent, itemised quotes following an initial discovery phase.',
    },
    {
      question: 'What are typical project timelines?',
      answer:
        'Delivery timelines vary according to scope. A targeted marketing review or focused SEO implementation may take two to four weeks, whereas a bespoke mobile application or multi-tier software system typically requires several months of iterative development and rigorous testing.',
    },
    {
      question: 'Do you offer ongoing support after launch?',
      answer:
        'Yes. We provide structured maintenance packages covering security updates, server monitoring, bug fixes, and continuous improvements to ensure software reliability and platform longevity.',
    },
    {
      question: 'Do you collaborate with clients located outside London or the UK?',
      answer:
        'Yes. Although our office is located at 103, Dawes Road in London, we collaborate effectively with domestic and international clients using modern remote communication, staging environments, and collaborative planning tools.',
    },
  ];

  const toggle = (idx: number) => {
    setOpenIndex(openIndex === idx ? null : idx);
  };

  return (
    <section id="faqs" className="py-24 bg-slate-950">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-xs uppercase tracking-widest text-teal-400 font-semibold mb-2">Clarity & Expectations</h2>
          <p className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
            Frequently Asked Questions
          </p>
          <p className="mt-4 text-slate-400">
            Answers to common questions regarding project scoping, timelines, and collaboration.
          </p>
        </div>

        <div className="space-y-4">
          {faqs.map((faq, index) => {
            const isOpen = openIndex === index;
            return (
              <div
                key={index}
                className="border border-slate-800 rounded-xl bg-slate-900/60 overflow-hidden transition-colors hover:border-slate-700"
              >
                <button
                  type="button"
                  onClick={() => toggle(index)}
                  className="w-full py-5 px-6 text-left flex justify-between items-center focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
                  aria-expanded={isOpen}
                >
                  <span className="text-base font-semibold text-white pr-4">{faq.question}</span>
                  <span className="text-blue-400 font-mono text-xl flex-shrink-0 w-6 text-center">
                    {isOpen ? '−' : '+'}
                  </span>
                </button>
                {isOpen && (
                  <div className="px-6 pb-5 pt-1 text-sm text-slate-300 leading-relaxed border-t border-slate-800/60">
                    {faq.answer}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
