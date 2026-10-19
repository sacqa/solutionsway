import React, { useState } from 'react';
import { supabase, isSupabaseConfigured, localDb } from '../../lib/supabase';
import { useSiteSettings } from '../../context/SiteSettingsContext';
import { ContactDetails, LegalDocuments } from '../../lib/types';

export const SiteSettingsEditor: React.FC = () => {
  const { contact, legal, refreshSettings } = useSiteSettings();

  const [contactForm, setContactForm] = useState<ContactDetails>({ ...contact });
  const [legalForm, setLegalForm] = useState<LegalDocuments>({ ...legal });
  const [saving, setSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);

  const handleSaveAll = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setSaveError(null);
    setSaveSuccess(false);

    try {
      if (isSupabaseConfigured) {
        const { error: contactErr } = await supabase
          .from('site_settings')
          .upsert({ key: 'contact_details', value: contactForm, updated_at: new Date().toISOString() });
        if (contactErr) throw contactErr;

        const { error: legalErr } = await supabase
          .from('site_settings')
          .upsert({ key: 'legal_documents', value: legalForm, updated_at: new Date().toISOString() });
        if (legalErr) throw legalErr;
      } else {
        localDb.saveContactDetails(contactForm);
        localDb.saveLegalDocuments(legalForm);
      }

      await refreshSettings();
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 4000);
    } catch (err: any) {
      setSaveError(err.message || 'Could not save settings.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <form onSubmit={handleSaveAll} className="space-y-8 max-w-4xl">
      {saveSuccess && (
        <div className="p-4 bg-emerald-950/40 border border-emerald-800 text-emerald-300 rounded-lg text-xs font-semibold flex items-center gap-2">
          <span>✓</span>
          <span>Site settings successfully saved and applied to the public portal.</span>
        </div>
      )}
      {saveError && (
        <div className="p-4 bg-red-950/40 border border-red-800 text-red-300 rounded-lg text-xs">
          {saveError}
        </div>
      )}

      {/* Office & Contact Configurations */}
      <div className="p-6 bg-slate-950 border border-slate-800 rounded-2xl">
        <h3 className="text-base font-bold text-white mb-2">Contact Information &amp; Office Details</h3>
        <p className="text-xs text-slate-400 mb-6">
          Changes here update the header, contact section, and footer across the public application.
        </p>

        <div className="grid sm:grid-cols-2 gap-4 text-xs">
          <div>
            <label className="block font-semibold text-slate-300 mb-1">Address Line 1</label>
            <input
              type="text"
              value={contactForm.address_line1}
              onChange={(e) => setContactForm({ ...contactForm, address_line1: e.target.value })}
              className="w-full px-3 py-2 bg-slate-900 border border-slate-800 text-white rounded-lg focus:ring-1 focus:ring-blue-500 focus:outline-none"
            />
          </div>

          <div>
            <label className="block font-semibold text-slate-300 mb-1">City</label>
            <input
              type="text"
              value={contactForm.city}
              onChange={(e) => setContactForm({ ...contactForm, city: e.target.value })}
              className="w-full px-3 py-2 bg-slate-900 border border-slate-800 text-white rounded-lg focus:ring-1 focus:ring-blue-500 focus:outline-none"
            />
          </div>

          <div>
            <label className="block font-semibold text-slate-300 mb-1">Country</label>
            <input
              type="text"
              value={contactForm.country}
              onChange={(e) => setContactForm({ ...contactForm, country: e.target.value })}
              className="w-full px-3 py-2 bg-slate-900 border border-slate-800 text-white rounded-lg focus:ring-1 focus:ring-blue-500 focus:outline-none"
            />
          </div>

          <div>
            <label className="block font-semibold text-slate-300 mb-1">Postcode</label>
            <input
              type="text"
              value={contactForm.postcode}
              onChange={(e) => setContactForm({ ...contactForm, postcode: e.target.value })}
              className="w-full px-3 py-2 bg-slate-900 border border-slate-800 text-white rounded-lg focus:ring-1 focus:ring-blue-500 focus:outline-none"
            />
          </div>

          <div>
            <label className="block font-semibold text-slate-300 mb-1">Telephone (Optional)</label>
            <input
              type="text"
              value={contactForm.phone || ''}
              onChange={(e) => setContactForm({ ...contactForm, phone: e.target.value })}
              placeholder="Leave blank to hide on public site"
              className="w-full px-3 py-2 bg-slate-900 border border-slate-800 text-white rounded-lg focus:ring-1 focus:ring-blue-500 focus:outline-none"
            />
          </div>

          <div>
            <label className="block font-semibold text-slate-300 mb-1">Public Email (Optional)</label>
            <input
              type="email"
              value={contactForm.email || ''}
              onChange={(e) => setContactForm({ ...contactForm, email: e.target.value })}
              placeholder="Leave blank to hide on public site"
              className="w-full px-3 py-2 bg-slate-900 border border-slate-800 text-white rounded-lg focus:ring-1 focus:ring-blue-500 focus:outline-none"
            />
          </div>

          <div className="sm:col-span-2">
            <label className="block font-semibold text-slate-300 mb-1">Google Maps Link</label>
            <input
              type="url"
              value={contactForm.maps_url}
              onChange={(e) => setContactForm({ ...contactForm, maps_url: e.target.value })}
              className="w-full px-3 py-2 bg-slate-900 border border-slate-800 text-white rounded-lg focus:ring-1 focus:ring-blue-500 focus:outline-none"
            />
          </div>
        </div>
      </div>

      {/* Legal & Policy Texts */}
      <div className="p-6 bg-slate-950 border border-slate-800 rounded-2xl">
        <h3 className="text-base font-bold text-white mb-2">Legal Notices (UK GDPR &amp; Terms)</h3>
        <p className="text-xs text-slate-400 mb-6">
          Editable policy content accessible from the footer modals. Initial text requires corporate legal review.
        </p>

        <div className="space-y-4 text-xs">
          <div>
            <label className="block font-semibold text-slate-300 mb-1">Privacy Notice</label>
            <textarea
              rows={8}
              value={legalForm.privacy_policy}
              onChange={(e) => setLegalForm({ ...legalForm, privacy_policy: e.target.value })}
              className="w-full px-3 py-2 bg-slate-900 border border-slate-800 text-white rounded-lg font-mono text-[11px] leading-relaxed focus:ring-1 focus:ring-blue-500 focus:outline-none"
            />
          </div>

          <div>
            <label className="block font-semibold text-slate-300 mb-1">Terms of Service</label>
            <textarea
              rows={8}
              value={legalForm.terms_of_service}
              onChange={(e) => setLegalForm({ ...legalForm, terms_of_service: e.target.value })}
              className="w-full px-3 py-2 bg-slate-900 border border-slate-800 text-white rounded-lg font-mono text-[11px] leading-relaxed focus:ring-1 focus:ring-blue-500 focus:outline-none"
            />
          </div>
        </div>
      </div>

      <div className="flex justify-end">
        <button
          type="submit"
          disabled={saving}
          className="px-6 py-2.5 bg-blue-600 hover:bg-blue-500 text-white font-semibold rounded-lg text-xs transition disabled:opacity-50 shadow-md shadow-blue-600/20"
        >
          {saving ? 'Updating Settings...' : 'Save Site Settings'}
        </button>
      </div>
    </form>
  );
};
