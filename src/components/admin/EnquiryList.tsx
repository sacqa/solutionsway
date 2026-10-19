import React, { useState, useEffect, useTransition } from 'react';
import { supabase, isSupabaseConfigured, localDb } from '../../lib/supabase';
import { Enquiry } from '../../lib/types';
import { sanitizeForCsv } from '../../lib/utils';
import { EnquiryDetailModal } from './EnquiryDetailModal';

export const EnquiryList: React.FC = () => {
  const [enquiries, setEnquiries] = useState<Enquiry[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [selectedEnquiry, setSelectedEnquiry] = useState<Enquiry | null>(null);
  const [, startTransition] = useTransition();

  const fetchEnquiries = async () => {
    setLoading(true);
    try {
      if (isSupabaseConfigured) {
        let query = supabase
          .from('enquiries')
          .select('*')
          .order('created_at', { ascending: false });

        if (statusFilter !== 'all') {
          query = query.eq('status', statusFilter);
        }
        if (search.trim()) {
          query = query.or(
            `full_name.ilike.%${search}%,email.ilike.%${search}%,reference_no.ilike.%${search}%,company.ilike.%${search}%`
          );
        }

        const { data, error } = await query;
        if (error) throw error;
        setEnquiries(data || []);
      } else {
        // Local DB fallback for preview environment
        let items = localDb.getEnquiries();
        if (statusFilter !== 'all') {
          items = items.filter((e) => e.status === statusFilter);
        }
        if (search.trim()) {
          const q = search.trim().toLowerCase();
          items = items.filter(
            (e) =>
              e.full_name.toLowerCase().includes(q) ||
              e.email.toLowerCase().includes(q) ||
              e.reference_no.toLowerCase().includes(q) ||
              (e.company && e.company.toLowerCase().includes(q))
          );
        }
        // sort newest first
        items.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
        setEnquiries(items);
      }
    } catch (err) {
      console.error('Error fetching enquiries:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEnquiries();
  }, [statusFilter]);

  const handleExportCsv = () => {
    if (enquiries.length === 0) return;

    const headers = [
      'Reference No',
      'Created At',
      'Status',
      'Full Name',
      'Email',
      'Phone',
      'Company',
      'Service Required',
      'Estimated Budget',
      'Project Description',
      'Internal Notes',
    ];

    const rows = enquiries.map((e) => [
      sanitizeForCsv(e.reference_no),
      sanitizeForCsv(new Date(e.created_at).toISOString()),
      sanitizeForCsv(e.status),
      sanitizeForCsv(e.full_name),
      sanitizeForCsv(e.email),
      sanitizeForCsv(e.phone || ''),
      sanitizeForCsv(e.company || ''),
      sanitizeForCsv(e.service_required),
      sanitizeForCsv(e.estimated_budget || ''),
      sanitizeForCsv(e.project_description),
      sanitizeForCsv(e.internal_notes || ''),
    ]);

    const csvContent = [headers.join(','), ...rows.map((r) => r.join(','))].join('\r\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `solutions_way_enquiries_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleResetData = () => {
    if (confirm('Reload demo sample enquiry records?')) {
      localStorage.removeItem('solutions_way_enquiries_v1');
      fetchEnquiries();
    }
  };

  return (
    <div className="space-y-6">
      {/* Metrics Banner */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="p-4 bg-slate-900 border border-slate-800 rounded-xl">
          <span className="text-xs text-slate-400 block mb-1">Total Enquiries</span>
          <span className="text-2xl font-bold text-white font-mono">{enquiries.length}</span>
        </div>
        <div className="p-4 bg-slate-900 border border-slate-800 rounded-xl">
          <span className="text-xs text-slate-400 block mb-1">New Submissions</span>
          <span className="text-2xl font-bold text-blue-400 font-mono">
            {enquiries.filter((e) => e.status === 'new').length}
          </span>
        </div>
        <div className="p-4 bg-slate-900 border border-slate-800 rounded-xl">
          <span className="text-xs text-slate-400 block mb-1">In Progress</span>
          <span className="text-2xl font-bold text-indigo-400 font-mono">
            {enquiries.filter((e) => e.status === 'in_progress').length}
          </span>
        </div>
        <div className="p-4 bg-slate-900 border border-slate-800 rounded-xl">
          <span className="text-xs text-slate-400 block mb-1">Closed / Converted</span>
          <span className="text-2xl font-bold text-emerald-400 font-mono">
            {enquiries.filter((e) => e.status === 'closed').length}
          </span>
        </div>
      </div>

      {/* Controls */}
      <div className="flex flex-col sm:flex-row gap-4 justify-between items-stretch sm:items-center">
        <div className="flex flex-1 gap-3">
          <input
            type="text"
            placeholder="Search by name, email, ref, or company..."
            value={search}
            onChange={(e) => {
              const val = e.target.value;
              setSearch(val);
              startTransition(() => {
                if (!isSupabaseConfigured) {
                  const q = val.trim().toLowerCase();
                  let items = localDb.getEnquiries();
                  if (statusFilter !== 'all') items = items.filter((x) => x.status === statusFilter);
                  if (q) {
                    items = items.filter(
                      (x) =>
                        x.full_name.toLowerCase().includes(q) ||
                        x.email.toLowerCase().includes(q) ||
                        x.reference_no.toLowerCase().includes(q) ||
                        (x.company && x.company.toLowerCase().includes(q))
                    );
                  }
                  items.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
                  setEnquiries(items);
                }
              });
            }}
            onKeyDown={(e) => e.key === 'Enter' && fetchEnquiries()}
            className="w-full sm:max-w-xs px-3.5 py-2 rounded-lg bg-slate-900 border border-slate-800 text-white text-xs placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
          />
          <button
            onClick={fetchEnquiries}
            className="px-4 py-2 bg-slate-800 text-slate-200 hover:bg-slate-700 text-xs font-semibold rounded-lg transition"
          >
            Search
          </button>
        </div>

        <div className="flex flex-wrap gap-3">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3.5 py-2 rounded-lg bg-slate-900 border border-slate-800 text-white text-xs focus:outline-none"
          >
            <option value="all">All Statuses</option>
            <option value="new">New</option>
            <option value="contacted">Contacted</option>
            <option value="in_progress">In Progress</option>
            <option value="closed">Closed</option>
            <option value="spam">Spam</option>
          </select>

          <button
            onClick={handleExportCsv}
            disabled={enquiries.length === 0}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white text-xs font-semibold rounded-lg flex items-center gap-1.5 transition"
            title="Download CSV report with formula injection sanitisation"
          >
            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
            </svg>
            Export CSV
          </button>

          {!isSupabaseConfigured && (
            <button
              onClick={handleResetData}
              className="px-3 py-2 bg-slate-900 border border-slate-800 text-slate-400 hover:text-slate-200 text-xs rounded-lg transition"
              title="Reset to default demo dataset"
            >
              Reset Samples
            </button>
          )}
        </div>
      </div>

      {/* Table */}
      <div className="border border-slate-800 rounded-xl overflow-hidden bg-slate-950">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-900/80 text-slate-400 border-b border-slate-800 uppercase font-semibold">
              <tr>
                <th className="py-3.5 px-4">Ref</th>
                <th className="py-3.5 px-4">Contact</th>
                <th className="py-3.5 px-4">Service</th>
                <th className="py-3.5 px-4">Budget</th>
                <th className="py-3.5 px-4">Status</th>
                <th className="py-3.5 px-4">Date</th>
                <th className="py-3.5 px-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800 text-slate-300">
              {loading ? (
                <tr>
                  <td colSpan={7} className="py-8 text-center text-slate-500">
                    Loading enquiry records...
                  </td>
                </tr>
              ) : enquiries.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-8 text-center text-slate-500">
                    No enquiries match the current criteria.
                  </td>
                </tr>
              ) : (
                enquiries.map((enq) => (
                  <tr key={enq.id} className="hover:bg-slate-900/40 transition">
                    <td className="py-3 px-4 font-mono font-medium text-white">{enq.reference_no}</td>
                    <td className="py-3 px-4">
                      <div className="font-semibold text-white">{enq.full_name}</div>
                      <div className="text-slate-400 text-[11px]">{enq.email}</div>
                      {enq.company && <div className="text-slate-500 text-[10px]">{enq.company}</div>}
                    </td>
                    <td className="py-3 px-4 text-slate-200">{enq.service_required}</td>
                    <td className="py-3 px-4 text-slate-400">{enq.estimated_budget || '—'}</td>
                    <td className="py-3 px-4">
                      <span
                        className={`inline-block px-2 py-0.5 rounded text-[10px] font-semibold uppercase ${
                          enq.status === 'new'
                            ? 'bg-blue-900/60 text-blue-300 border border-blue-700/50'
                            : enq.status === 'contacted'
                            ? 'bg-amber-900/60 text-amber-300 border border-amber-700/50'
                            : enq.status === 'in_progress'
                            ? 'bg-indigo-900/60 text-indigo-300 border border-indigo-700/50'
                            : enq.status === 'closed'
                            ? 'bg-emerald-900/60 text-emerald-300 border border-emerald-700/50'
                            : 'bg-red-900/60 text-red-300 border border-red-700/50'
                        }`}
                      >
                        {enq.status.replace('_', ' ')}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-slate-400">
                      {new Date(enq.created_at).toLocaleDateString('en-GB')}
                    </td>
                    <td className="py-3 px-4 text-right">
                      <button
                        onClick={() => setSelectedEnquiry(enq)}
                        className="px-2.5 py-1 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded font-medium transition"
                      >
                        View &amp; Edit
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {selectedEnquiry && (
        <EnquiryDetailModal
          enquiry={selectedEnquiry}
          onClose={() => setSelectedEnquiry(null)}
          onUpdated={() => {
            setSelectedEnquiry(null);
            fetchEnquiries();
          }}
        />
      )}
    </div>
  );
};
