import React, { useState } from 'react';
import { supabase, isSupabaseConfigured, localDb } from '../../lib/supabase';
import { Enquiry, EnquiryStatus } from '../../lib/types';

interface EnquiryDetailModalProps {
  enquiry: Enquiry;
  onClose: () => void;
  onUpdated: () => void;
}

export const EnquiryDetailModal: React.FC<EnquiryDetailModalProps> = ({ enquiry, onClose, onUpdated }) => {
  const [status, setStatus] = useState<EnquiryStatus>(enquiry.status);
  const [notes, setNotes] = useState<string>(enquiry.internal_notes || '');
  const [saving, setSaving] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleSave = async () => {
    setSaving(true);
    setErrorMsg(null);
    try {
      if (isSupabaseConfigured) {
        const { error } = await supabase
          .from('enquiries')
          .update({
            status: status,
            internal_notes: notes,
            updated_at: new Date().toISOString(),
          })
          .eq('id', enquiry.id);

        if (error) throw error;
      } else {
        localDb.updateEnquiry(enquiry.id, {
          status,
          internal_notes: notes,
        });
      }
      onUpdated();
    } catch (err: any) {
      setErrorMsg(err.message || 'Failed to update enquiry.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="relative w-full max-w-2xl bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl p-6">
        <div className="flex justify-between items-center pb-4 border-b border-slate-800 mb-4">
          <div>
            <span className="text-xs font-mono text-blue-400 font-semibold">{enquiry.reference_no}</span>
            <h3 className="text-lg font-bold text-white">{enquiry.full_name}</h3>
          </div>
          <button 
            onClick={onClose} 
            className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800 transition"
            aria-label="Close modal"
          >
            ✕
          </button>
        </div>

        {errorMsg && (
          <div className="mb-4 p-3 bg-red-950/40 border border-red-800 text-red-300 text-xs rounded">
            {errorMsg}
          </div>
        )}

        <div className="grid grid-cols-2 gap-4 text-xs mb-4">
          <div>
            <span className="text-slate-500 block">Email Address</span>
            <a href={`mailto:${enquiry.email}`} className="text-blue-400 font-medium hover:underline">
              {enquiry.email}
            </a>
          </div>
          <div>
            <span className="text-slate-500 block">Telephone</span>
            <span className="text-slate-200">{enquiry.phone || 'Not provided'}</span>
          </div>
          <div>
            <span className="text-slate-500 block">Company</span>
            <span className="text-slate-200">{enquiry.company || 'Not provided'}</span>
          </div>
          <div>
            <span className="text-slate-500 block">Estimated Budget</span>
            <span className="text-slate-200 font-medium">{enquiry.estimated_budget || 'Unspecified'}</span>
          </div>
          <div>
            <span className="text-slate-500 block">Service Requested</span>
            <span className="text-teal-400 font-semibold">{enquiry.service_required}</span>
          </div>
          <div>
            <span className="text-slate-500 block">Submission Date</span>
            <span className="text-slate-200">{new Date(enquiry.created_at).toLocaleString('en-GB')}</span>
          </div>
        </div>

        <div className="mb-4">
          <span className="text-xs text-slate-500 block mb-1">Project Description</span>
          <div className="p-3 bg-slate-950 rounded-lg border border-slate-800 text-xs text-slate-300 whitespace-pre-line leading-relaxed max-h-40 overflow-y-auto font-sans">
            {enquiry.project_description}
          </div>
        </div>

        <div className="grid sm:grid-cols-2 gap-4 mb-4">
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">Status Workflow</label>
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value as EnquiryStatus)}
              className="w-full px-3 py-2 bg-slate-950 border border-slate-800 text-white rounded-lg text-xs focus:ring-1 focus:ring-blue-500 focus:outline-none"
            >
              <option value="new">New</option>
              <option value="contacted">Contacted</option>
              <option value="in_progress">In Progress</option>
              <option value="closed">Closed</option>
              <option value="spam">Spam</option>
            </select>
          </div>
        </div>

        <div className="mb-4">
          <label className="block text-xs font-semibold text-slate-300 mb-1">Internal Notes</label>
          <textarea
            rows={3}
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="Add internal consultation notes, follow-up dates, or staff assignments..."
            className="w-full px-3 py-2 bg-slate-950 border border-slate-800 text-white text-xs rounded-lg focus:ring-1 focus:ring-blue-500 focus:outline-none"
          />
        </div>

        <div className="pt-4 border-t border-slate-800 flex justify-end gap-3">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-xs font-semibold text-slate-300 bg-slate-800 hover:bg-slate-700 rounded-lg transition"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleSave}
            disabled={saving}
            className="px-4 py-2 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-500 rounded-lg transition disabled:opacity-50"
          >
            {saving ? 'Saving...' : 'Save Changes'}
          </button>
        </div>
      </div>
    </div>
  );
};
