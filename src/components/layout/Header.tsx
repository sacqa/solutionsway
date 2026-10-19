import React, { useState, useEffect } from 'react';

interface HeaderProps {
  onNavigateToAdmin?: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onNavigateToAdmin }) => {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { label: 'Home', href: '#home' },
    { label: 'Services', href: '#services' },
    { label: 'Why Us', href: '#why-us' },
    { label: 'Approach', href: '#approach' },
    { label: 'FAQs', href: '#faqs' },
    { label: 'Contact', href: '#contact' },
  ];

  const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    e.preventDefault();
    setMobileMenuOpen(false);
    const target = document.querySelector(href);
    if (target) {
      target.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleAdminClick = (e: React.MouseEvent) => {
    e.preventDefault();
    setMobileMenuOpen(false);
    if (onNavigateToAdmin) {
      onNavigateToAdmin();
    } else {
      window.history.pushState({}, '', '/admin');
      window.dispatchEvent(new PopStateEvent('popstate'));
    }
  };

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? 'bg-slate-950/92 backdrop-blur-md border-b border-slate-800/80 shadow-lg py-3'
          : 'bg-transparent py-5'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <a
            href="#home"
            onClick={(e) => handleNavClick(e, '#home')}
            className="flex items-center gap-3 group focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 rounded-lg p-1"
          >
            <div className="w-10 h-10 rounded-xl bg-blue-600 flex items-center justify-center shadow-md shadow-blue-500/25 group-hover:bg-blue-500 transition-colors">
              <span className="text-white font-black text-lg tracking-wider">SW</span>
            </div>
            <div className="flex flex-col">
              <span className="text-xl font-bold tracking-tight text-white leading-none">
                Solutions<span className="text-blue-500">Way</span>
              </span>
              <span className="text-[10px] text-slate-400 tracking-wider uppercase mt-1">
                London Digital Consultancy
              </span>
            </div>
          </a>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-1 lg:space-x-2">
            {navLinks.map((link) => (
              <a
                key={link.label}
                href={link.href}
                onClick={(e) => handleNavClick(e, link.href)}
                className="px-3.5 py-2 text-sm font-medium text-slate-300 hover:text-white hover:bg-slate-800/60 rounded-md transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
              >
                {link.label}
              </a>
            ))}
          </nav>

          {/* Actions & Mobile Toggle */}
          <div className="flex items-center gap-3">
            <button
              onClick={handleAdminClick}
              className="hidden lg:inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-400 hover:text-white bg-slate-900/80 hover:bg-slate-800 border border-slate-800 rounded-lg transition"
              title="Open Admin Portal to view enquiries & manage content"
            >
              <span className="w-2 h-2 rounded-full bg-emerald-500 inline-block" />
              Admin Portal
            </button>

            <a
              href="#contact"
              onClick={(e) => handleNavClick(e, '#contact')}
              className="inline-flex items-center justify-center px-4 py-2 text-sm font-semibold text-white bg-blue-600 hover:bg-blue-500 active:scale-95 transition rounded-lg shadow-sm focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-400"
            >
              Discuss Your Project
            </a>

            <button
              type="button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
              aria-label={mobileMenuOpen ? 'Close menu' : 'Open menu'}
              aria-expanded={mobileMenuOpen}
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                {mobileMenuOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile Dropdown Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden mt-3 pt-3 border-t border-slate-800 bg-slate-950/95 backdrop-blur-xl rounded-2xl p-4 shadow-2xl border border-slate-800/80">
            <div className="flex flex-col space-y-2">
              {navLinks.map((link) => (
                <a
                  key={link.label}
                  href={link.href}
                  onClick={(e) => handleNavClick(e, link.href)}
                  className="px-3 py-2 rounded-lg text-base font-medium text-slate-300 hover:text-white hover:bg-slate-800 transition"
                >
                  {link.label}
                </a>
              ))}
              <hr className="border-slate-800 my-2" />
              <button
                onClick={handleAdminClick}
                className="w-full text-left px-3 py-2 rounded-lg text-sm text-slate-400 hover:text-white hover:bg-slate-800 transition flex items-center justify-between"
              >
                <span>Access Admin Control Centre</span>
                <span className="text-xs text-blue-400 font-mono">/admin →</span>
              </button>
              <a
                href="#contact"
                onClick={(e) => handleNavClick(e, '#contact')}
                className="mt-2 w-full text-center px-4 py-2.5 text-sm font-semibold text-white bg-blue-600 hover:bg-blue-500 rounded-lg shadow transition"
              >
                Discuss Your Project
              </a>
            </div>
          </div>
        )}
      </div>
    </header>
  );
};
