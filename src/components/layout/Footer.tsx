import React from 'react';
import { useSiteSettings } from '../../context/SiteSettingsContext';

interface FooterProps {
  onOpenPrivacy: () => void;
  onOpenTerms: () => void;
  onNavigateToAdmin?: () => void;
}

export const Footer: React.FC<FooterProps> = ({ onOpenPrivacy, onOpenTerms, onNavigateToAdmin }) => {
  const { contact } = useSiteSettings();
  const currentYear = new Date().getFullYear();

  const handleScroll = (id: string) => {
    document.querySelector(id)?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleAdminClick = (e: React.MouseEvent) => {
    e.preventDefault();
    if (onNavigateToAdmin) {
      onNavigateToAdmin();
    } else {
      window.history.pushState({}, '', '/admin');
      window.dispatchEvent(new PopStateEvent('popstate'));
    }
  };

  return (
    <footer className="bg-slate-950 border-t border-slate-800 pt-16 pb-12 text-slate-400 text-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 mb-12">
          {/* Brand Column */}
          <div className="md:col-span-1">
            <div className="flex items-center gap-2.5 mb-4">
              <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center text-white font-bold text-sm shadow">
                SW
              </div>
              <span className="text-lg font-bold text-white tracking-tight">
                Solutions<span className="text-blue-500">Way</span>
              </span>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed mb-4">
              Digital Marketing, Technical SEO, Mobile App Development, and Bespoke Software Engineering delivered from London.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-xs font-semibold uppercase tracking-wider text-white mb-4">Navigation</h4>
            <ul className="space-y-2 text-xs">
              <li>
                <button onClick={() => handleScroll('#home')} className="hover:text-white transition">Home</button>
              </li>
              <li>
                <button onClick={() => handleScroll('#services')} className="hover:text-white transition">Services</button>
              </li>
              <li>
                <button onClick={() => handleScroll('#why-us')} className="hover:text-white transition">Why Us</button>
              </li>
              <li>
                <button onClick={() => handleScroll('#approach')} className="hover:text-white transition">Our Approach</button>
              </li>
              <li>
                <button onClick={() => handleScroll('#faqs')} className="hover:text-white transition">FAQs</button>
              </li>
            </ul>
          </div>

          {/* Location & Details */}
          <div>
            <h4 className="text-xs font-semibold uppercase tracking-wider text-white mb-4">Location</h4>
            <p className="text-xs text-slate-300 leading-relaxed">
              {contact.address_line1}<br />
              {contact.city}, {contact.country}<br />
              {contact.postcode}
            </p>
            {contact.phone && (
              <p className="text-xs text-slate-300 mt-2">
                Tel: <a href={`tel:${contact.phone}`} className="hover:text-white transition">{contact.phone}</a>
              </p>
            )}
            {contact.email && (
              <p className="text-xs text-slate-300 mt-1">
                Email: <a href={`mailto:${contact.email}`} className="hover:text-white transition">{contact.email}</a>
              </p>
            )}
          </div>

          {/* Governance & Admin Access */}
          <div>
            <h4 className="text-xs font-semibold uppercase tracking-wider text-white mb-4">Governance</h4>
            <ul className="space-y-2 text-xs">
              <li>
                <button onClick={onOpenPrivacy} className="hover:text-white transition text-left">Privacy Notice</button>
              </li>
              <li>
                <button onClick={onOpenTerms} className="hover:text-white transition text-left">Terms of Service</button>
              </li>
              <li className="pt-2">
                <button
                  onClick={handleAdminClick}
                  className="text-xs text-slate-400 hover:text-blue-400 transition flex items-center gap-1 group"
                >
                  <span>Admin Control Centre</span>
                  <span className="group-hover:translate-x-0.5 transition-transform">→</span>
                </button>
              </li>
            </ul>
          </div>
        </div>

        <div className="pt-8 border-t border-slate-900 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-4">
          <p>© {currentYear} Solutions Way. All rights reserved.</p>
          <p>Initial legal drafts require company review prior to formal execution.</p>
        </div>
      </div>
    </footer>
  );
};
