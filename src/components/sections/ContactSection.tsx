import React, { useState } from 'react';
import { useSiteSettings } from '../../context/SiteSettingsContext';
import { generateUUID } from '../../lib/utils';
import { isSupabaseConfigured, localDb } from '../../lib/supabase';

interface ContactSectionProps {
  selectedService: string;
  onServiceChange: (service: string) => void;
  onOpenPrivacyNotice: () => void;
}

export const ContactSection: React.FC<ContactSectionProps> = ({
  selectedService,
  onServiceChange,
  onOpenPrivacyNotice,
}) => {
  const { contact } = useSiteSettings();

  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    company: '',
    budget: '',
    description: '',
    privacyConsent: false,
    honeypot: '', // bot trap
  });

  const [idempotencyKey, setIdempotencyKey] = useState<string>(() => generateUUID());
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [successReference, setSuccessReference] = useState<string | null>(null);

  const budgetOptions = [
    'Under £5,000',
    '£5,000 - £15,000',
    '£15,000 - £35,000',
    '£35,000+',
    'Not sure yet',
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitError(null);

    // Front-end validation checks
    if (!formData.fullName.trim() || formData.fullName.trim().length < 2) {
      setSubmitError('Please enter your full name (at least 2 characters).');
      return;
    }
    const emailRegex = /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/;
    if (!formData.email.trim() || !emailRegex.test(formData.email.trim())) {
      setSubmitError('Please provide a valid email address.');
      return;
    }
    if (!selectedService) {
      setSubmitError('Please select a service requirement.');
      return;
    }
    if (formData.description.trim().length < 20) {
      setSubmitError('Please describe your project in at least 20 characters.');
      return;
    }
    if (!formData.privacyConsent) {
      setSubmitError('You must acknowledge the privacy notice to submit an enquiry.');
      return;
    }

    setSubmitting(true);

    try {
      if (isSupabaseConfigured) {
        const response = await fetch(
          `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/submit-enquiry`,
          {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              apikey: import.meta.env.VITE_SUPABASE_ANON_KEY,
            },
            body: JSON.stringify({
              fullName: formData.fullName,
              email: formData.email,
              phone: formData.phone || undefined,
              company: formData.company || undefined,
              serviceRequired: selectedService,
              estimatedBudget: formData.budget || undefined,
              projectDescription: formData.description,
              privacyConsent: formData.privacyConsent,
              honeypot: formData.honeypot,
              idempotencyKey: idempotencyKey,
            }),
          }
        );

        const result = await response.json();

        if (!response.ok) {
          throw new Error(result.error || 'Submission could not be completed.');
        }

        setSuccessReference(result.referenceNo);
      } else {
        // Fallback to local persistence store for immediate preview testing
        const result = localDb.saveEnquiry({
          fullName: formData.fullName,
          email: formData.email,
          phone: formData.phone || undefined,
          company: formData.company || undefined,
          serviceRequired: selectedService,
          estimatedBudget: formData.budget || undefined,
          projectDescription: formData.description,
          privacyConsent: formData.privacyConsent,
          honeypot: formData.honeypot,
          idempotencyKey: idempotencyKey,
        });

        setSuccessReference(result.referenceNo);
      }

      // Reset form but generate fresh idempotency key for next run
      setIdempotencyKey(generateUUID());
    } catch (err: any) {
      setSubmitError(err.message || 'An unexpected error occurred. Please check your network and try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section id="contact" className="py-24 bg-slate-900 border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-12 gap-12">
          {/* Company Details Column */}
          <div className="lg:col-span-5">
            <h2 className="text-xs uppercase tracking-widest text-blue-400 font-semibold mb-2">Get In Touch</h2>
            <p className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
              Tell Us What You Want to Build.
            </p>
            <p className="mt-4 text-slate-400 leading-relaxed">
              Submit your project scope and requirements. We will review your specification and get back to you with structured next steps.
            </p>

            <div className="mt-8 space-y-4">
              <div className="p-5 bg-slate-950 rounded-xl border border-slate-800">
                <span className="text-xs font-semibold uppercase tracking-wider text-teal-400 block mb-1">
                  Registered Office
                </span>
                <p className="text-white text-base font-medium">
                  {contact.address_line1}<br />
                  {contact.city}, {contact.country}<br />
                  {contact.postcode}
                </p>
                {contact.maps_url && (
                  <a
                    href={contact.maps_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 mt-3 text-xs font-semibold text-blue-400 hover:text-blue-300"
                  >
                    Open in Google Maps →
                  </a>
                )}
              </div>

              {contact.phone && (
                <div className="p-5 bg-slate-950 rounded-xl border border-slate-800">
                  <span className="text-xs font-semibold uppercase tracking-wider text-teal-400 block mb-1">
                    Telephone
                  </span>
                  <a href={`tel:${contact.phone}`} className="text-white text-base hover:text-blue-400 transition font-medium">
                    {contact.phone}
                  </a>
                </div>
              )}

              {contact.email && (
                <div className="p-5 bg-slate-950 rounded-xl border border-slate-800">
                  <span className="text-xs font-semibold uppercase tracking-wider text-teal-400 block mb-1">
                    Email Enquiries
                  </span>
                  <a href={`mailto:${contact.email}`} className="text-white text-base hover:text-blue-400 transition font-medium">
                    {contact.email}
                  </a>
                </div>
              )}

              <div className="p-4 bg-slate-950/60 rounded-xl border border-slate-800/80 text-xs text-slate-400">
                <p className="font-semibold text-slate-300 mb-1">Response Timeframe</p>
                <p>All direct enquiries are reviewed by senior consultants within 24 business hours.</p>
              </div>
            </div>
          </div>

          {/* Form Column */}
          <div className="lg:col-span-7">
            <div className="bg-slate-950 p-6 sm:p-8 rounded-2xl border border-slate-800 shadow-xl">
              {successReference ? (
                <div className="py-12 text-center">
                  <div className="w-14 h-14 bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 rounded-full flex items-center justify-center mx-auto mb-4 text-2xl font-bold">
                    ✓
                  </div>
                  <h3 className="text-2xl font-bold text-white mb-2">Enquiry Received</h3>
                  <p className="text-slate-300 max-w-md mx-auto mb-6 text-sm">
                    Thank you for reaching out. We have registered your enquiry and assigned it the unique reference number below.
                  </p>
                  <div className="inline-block py-2.5 px-5 bg-slate-900 border border-slate-800 rounded-lg text-emerald-400 font-mono text-base font-semibold tracking-wide mb-8">
                    {successReference}
                  </div>
                  <div className="space-y-3">
                    <button
                      type="button"
                      onClick={() => {
                        setSuccessReference(null);
                        setFormData({
                          fullName: '',
                          email: '',
                          phone: '',
                          company: '',
                          budget: '',
                          description: '',
                          privacyConsent: false,
                          honeypot: '',
                        });
                      }}
                      className="px-5 py-2.5 text-xs font-semibold text-slate-300 bg-slate-800 hover:bg-slate-700 rounded-lg transition"
                    >
                      Submit Another Enquiry
                    </button>
                    <div className="text-[11px] text-slate-500">
                      You can quote this reference number in all follow-up correspondence.
                    </div>
                  </div>
                </div>
              ) : (
                <form onSubmit={handleSubmit} noValidate className="space-y-5">
                  {/* Honeypot field (hidden from genuine users) */}
                  <div className="hidden" aria-hidden="true">
                    <label htmlFor="website_hp">Do not fill this out</label>
                    <input
                      id="website_hp"
                      type="text"
                      tabIndex={-1}
                      autoComplete="off"
                      value={formData.honeypot}
                      onChange={(e) => setFormData({ ...formData, honeypot: e.target.value })}
                    />
                  </div>

                  {submitError && (
                    <div
                      role="alert"
                      className="p-4 rounded-lg bg-red-950/40 border border-red-800/60 text-red-300 text-sm"
                    >
                      {submitError}
                    </div>
                  )}

                  <div className="grid sm:grid-cols-2 gap-4">
                    <div>
                      <label htmlFor="fullName" className="block text-xs font-semibold text-slate-300 mb-1">
                        Full Name <span className="text-red-400">*</span>
                      </label>
                      <input
                        id="fullName"
                        type="text"
                        required
                        value={formData.fullName}
                        onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                        className="w-full px-3.5 py-2.5 rounded-lg bg-slate-900 border border-slate-800 text-white placeholder-slate-500 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                        placeholder="e.g. Eleanor Vance"
                      />
                    </div>

                    <div>
                      <label htmlFor="email" className="block text-xs font-semibold text-slate-300 mb-1">
                        Email Address <span className="text-red-400">*</span>
                      </label>
                      <input
                        id="email"
                        type="email"
                        required
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        className="w-full px-3.5 py-2.5 rounded-lg bg-slate-900 border border-slate-800 text-white placeholder-slate-500 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                        placeholder="eleanor@company.co.uk"
                      />
                    </div>
                  </div>

                  <div className="grid sm:grid-cols-2 gap-4">
                    <div>
                      <label htmlFor="phone" className="block text-xs font-semibold text-slate-300 mb-1">
                        Telephone <span className="text-slate-500">(Optional)</span>
                      </label>
                      <input
                        id="phone"
                        type="tel"
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        className="w-full px-3.5 py-2.5 rounded-lg bg-slate-900 border border-slate-800 text-white placeholder-slate-500 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                        placeholder="e.g. +44 20 7946 0000"
                      />
                    </div>

                    <div>
                      <label htmlFor="company" className="block text-xs font-semibold text-slate-300 mb-1">
                        Company Name <span className="text-slate-500">(Optional)</span>
                      </label>
                      <input
                        id="company"
                        type="text"
                        value={formData.company}
                        onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                        className="w-full px-3.5 py-2.5 rounded-lg bg-slate-900 border border-slate-800 text-white placeholder-slate-500 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                        placeholder="Your organisation"
                      />
                    </div>
                  </div>

                  <div className="grid sm:grid-cols-2 gap-4">
                    <div>
                      <label htmlFor="serviceRequired" className="block text-xs font-semibold text-slate-300 mb-1">
                        Service Required <span className="text-red-400">*</span>
                      </label>
                      <select
                        id="serviceRequired"
                        required
                        value={selectedService}
                        onChange={(e) => onServiceChange(e.target.value)}
                        className="w-full px-3.5 py-2.5 rounded-lg bg-slate-900 border border-slate-800 text-white text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                      >
                        <option value="">Select a service...</option>
                        <option value="Digital Marketing">Digital Marketing</option>
                        <option value="SEO">SEO</option>
                        <option value="Mobile App Development">Mobile App Development</option>
                        <option value="Software Development">Software Development</option>
                      </select>
                    </div>

                    <div>
                      <label htmlFor="budget" className="block text-xs font-semibold text-slate-300 mb-1">
                        Estimated Budget <span className="text-slate-500">(Optional)</span>
                      </label>
                      <select
                        id="budget"
                        value={formData.budget}
                        onChange={(e) => setFormData({ ...formData, budget: e.target.value })}
                        className="w-full px-3.5 py-2.5 rounded-lg bg-slate-900 border border-slate-800 text-white text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                      >
                        <option value="">Select budget range...</option>
                        {budgetOptions.map((opt) => (
                          <option key={opt} value={opt}>
                            {opt}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div>
                    <label htmlFor="description" className="block text-xs font-semibold text-slate-300 mb-1">
                      Project Description <span className="text-red-400">*</span>
                    </label>
                    <textarea
                      id="description"
                      required
                      rows={4}
                      value={formData.description}
                      onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-lg bg-slate-900 border border-slate-800 text-white placeholder-slate-500 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                      placeholder="Outline your requirements, current challenges, and project timeline goals (minimum 20 characters)..."
                    />
                  </div>

                  <div className="flex items-start gap-3">
                    <input
                      id="privacyConsent"
                      type="checkbox"
                      checked={formData.privacyConsent}
                      onChange={(e) => setFormData({ ...formData, privacyConsent: e.target.checked })}
                      className="mt-1 h-4 w-4 rounded border-slate-800 bg-slate-900 text-blue-600 focus:ring-blue-500"
                    />
                    <label htmlFor="privacyConsent" className="text-xs text-slate-400 leading-normal">
                      I acknowledge that my information is submitted to Solutions Way for the sole purpose of assessing
                      and responding to this enquiry in accordance with the{' '}
                      <button
                        type="button"
                        onClick={onOpenPrivacyNotice}
                        className="text-blue-400 underline hover:text-blue-300 focus:outline-none"
                      >
                        Privacy Policy
                      </button>
                      . <span className="text-red-400">*</span>
                    </label>
                  </div>

                  <button
                    type="submit"
                    disabled={submitting}
                    className="w-full py-3.5 px-6 rounded-xl font-semibold text-white bg-blue-600 hover:bg-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition shadow-lg shadow-blue-600/20 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-400"
                  >
                    {submitting ? 'Submitting Enquiry...' : 'Submit Project Enquiry'}
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
