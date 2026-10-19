import React, { useEffect } from 'react';

interface LegalModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  content: string;
}

export const LegalModal: React.FC<LegalModalProps> = ({ isOpen, onClose, title, content }) => {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="legal-modal-title"
      className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4"
    >
      <div 
        className="fixed inset-0" 
        onClick={onClose} 
        aria-hidden="true" 
      />
      <div className="relative w-full max-w-2xl bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl p-6 sm:p-8 z-10">
        <div className="flex items-center justify-between pb-4 border-b border-slate-800 mb-4">
          <h3 id="legal-modal-title" className="text-lg font-bold text-white">
            {title}
          </h3>
          <button
            type="button"
            onClick={onClose}
            className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800 transition"
            aria-label="Close modal"
          >
            ✕
          </button>
        </div>

        <div className="text-slate-300 text-sm leading-relaxed max-h-[60vh] overflow-y-auto space-y-4 pr-2 whitespace-pre-line font-sans">
          {content}
        </div>

        <div className="mt-6 pt-4 border-t border-slate-800 flex justify-end">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-xs font-semibold text-white bg-slate-800 hover:bg-slate-700 rounded-lg transition"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
