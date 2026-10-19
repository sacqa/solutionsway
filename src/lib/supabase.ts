import { createClient } from '@supabase/supabase-js';
import { Enquiry, ContactDetails, LegalDocuments } from './types';
import { generateLocalEnquiryReference, generateUUID } from './utils';

const envUrl = import.meta.env.VITE_SUPABASE_URL;
const envKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

export const isSupabaseConfigured = Boolean(
  envUrl &&
  envKey &&
  envUrl.trim() !== '' &&
  envKey.trim() !== '' &&
  !envUrl.includes('your-project')
);

// Fallback dummy URL to prevent supabase client from crashing on instantiation
const fallbackUrl = 'https://dummy-solutions-way.supabase.co';
const fallbackKey = 'dummy-anon-key-solutions-way-placeholder';

export const supabase = createClient(
  isSupabaseConfigured ? envUrl : fallbackUrl,
  isSupabaseConfigured ? envKey : fallbackKey
);

// --- Local Storage fallback repository for immediate live preview functionality ---
const LOCAL_STORAGE_ENQUIRIES_KEY = 'solutions_way_enquiries_v1';
const LOCAL_STORAGE_CONTACT_KEY = 'solutions_way_contact_v1';
const LOCAL_STORAGE_LEGAL_KEY = 'solutions_way_legal_v1';
const LOCAL_STORAGE_ADMIN_AUTH_KEY = 'solutions_way_admin_auth_v1';

const INITIAL_DEMO_ENQUIRIES: Enquiry[] = [
  {
    id: 'demo-1',
    reference_no: 'SW-20261019-1001',
    full_name: 'David Harrington',
    email: 'd.harrington@apexlogistics.co.uk',
    phone: '+44 20 7946 0812',
    company: 'Apex Logistics Ltd',
    service_required: 'Software Development',
    estimated_budget: '£15,000 - £35,000',
    project_description: 'We need a bespoke multi-depot fleet dispatching web dashboard with real-time telematics integration and automated route scheduling.',
    status: 'in_progress',
    internal_notes: 'Initial technical scoping call held on Monday. Architecture proposal and SOW being drafted.',
    created_at: new Date(Date.now() - 36 * 3600 * 1000).toISOString(),
    updated_at: new Date(Date.now() - 12 * 3600 * 1000).toISOString(),
  },
  {
    id: 'demo-2',
    reference_no: 'SW-20261019-1002',
    full_name: 'Fiona MacIntyre',
    email: 'fiona@kensingtonhealth.com',
    phone: '+44 7700 900421',
    company: 'Kensington Health & Wellness',
    service_required: 'Mobile App Development',
    estimated_budget: '£15,000 - £35,000',
    project_description: 'Looking to engineer an iOS and Android companion app for clinic patients to manage appointments, view care plans, and communicate securely.',
    status: 'contacted',
    internal_notes: 'Sent preliminary questionnaire and NDA. Awaiting response on NHS compliance requirements.',
    created_at: new Date(Date.now() - 18 * 3600 * 1000).toISOString(),
    updated_at: new Date(Date.now() - 6 * 3600 * 1000).toISOString(),
  },
  {
    id: 'demo-3',
    reference_no: 'SW-20261019-1003',
    full_name: 'Oliver Thorne',
    email: 'oliver.t@beaconadvisory.co.uk',
    phone: null,
    company: 'Beacon Advisory Partners',
    service_required: 'SEO',
    estimated_budget: '£5,000 - £15,000',
    project_description: 'Our organic visibility in Google UK has stagnated following our rebrand. We need a comprehensive technical SEO audit, backlink review, and on-page overhaul.',
    status: 'new',
    internal_notes: null,
    created_at: new Date(Date.now() - 2 * 3600 * 1000).toISOString(),
    updated_at: new Date(Date.now() - 2 * 3600 * 1000).toISOString(),
  },
];

export const localDb = {
  getEnquiries(): Enquiry[] {
    try {
      const stored = localStorage.getItem(LOCAL_STORAGE_ENQUIRIES_KEY);
      if (!stored) {
        localStorage.setItem(LOCAL_STORAGE_ENQUIRIES_KEY, JSON.stringify(INITIAL_DEMO_ENQUIRIES));
        return INITIAL_DEMO_ENQUIRIES;
      }
      return JSON.parse(stored);
    } catch {
      return INITIAL_DEMO_ENQUIRIES;
    }
  },

  saveEnquiry(payload: {
    fullName: string;
    email: string;
    phone?: string;
    company?: string;
    serviceRequired: string;
    estimatedBudget?: string;
    projectDescription: string;
    privacyConsent: boolean;
    honeypot?: string;
    idempotencyKey?: string;
  }): { success: boolean; referenceNo: string; message: string } {
    if (payload.honeypot && payload.honeypot.trim().length > 0) {
      throw new Error('Invalid submission detected.');
    }

    const enquiries = this.getEnquiries();

    // Check idempotency
    if (payload.idempotencyKey) {
      const existing = enquiries.find(e => (e as any).idempotency_key === payload.idempotencyKey);
      if (existing) {
        return {
          success: true,
          referenceNo: existing.reference_no,
          message: 'Enquiry already recorded.',
        };
      }
    }

    const referenceNo = generateLocalEnquiryReference();
    const newEnquiry: Enquiry = {
      id: generateUUID(),
      reference_no: referenceNo,
      full_name: payload.fullName.trim(),
      email: payload.email.trim().toLowerCase(),
      phone: payload.phone?.trim() || null,
      company: payload.company?.trim() || null,
      service_required: payload.serviceRequired,
      estimated_budget: payload.estimatedBudget || null,
      project_description: payload.projectDescription.trim(),
      status: 'new',
      internal_notes: null,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    (newEnquiry as any).idempotency_key = payload.idempotencyKey;

    enquiries.unshift(newEnquiry);
    localStorage.setItem(LOCAL_STORAGE_ENQUIRIES_KEY, JSON.stringify(enquiries));

    return {
      success: true,
      referenceNo,
      message: 'Enquiry submitted successfully.',
    };
  },

  updateEnquiry(id: string, updates: Partial<Enquiry>): void {
    const list = this.getEnquiries();
    const idx = list.findIndex(e => e.id === id);
    if (idx !== -1) {
      list[idx] = {
        ...list[idx],
        ...updates,
        updated_at: new Date().toISOString(),
      };
      localStorage.setItem(LOCAL_STORAGE_ENQUIRIES_KEY, JSON.stringify(list));
    }
  },

  getContactDetails(defaults: ContactDetails): ContactDetails {
    try {
      const stored = localStorage.getItem(LOCAL_STORAGE_CONTACT_KEY);
      return stored ? JSON.parse(stored) : defaults;
    } catch {
      return defaults;
    }
  },

  saveContactDetails(details: ContactDetails): void {
    localStorage.setItem(LOCAL_STORAGE_CONTACT_KEY, JSON.stringify(details));
  },

  getLegalDocuments(defaults: LegalDocuments): LegalDocuments {
    try {
      const stored = localStorage.getItem(LOCAL_STORAGE_LEGAL_KEY);
      return stored ? JSON.parse(stored) : defaults;
    } catch {
      return defaults;
    }
  },

  saveLegalDocuments(legal: LegalDocuments): void {
    localStorage.setItem(LOCAL_STORAGE_LEGAL_KEY, JSON.stringify(legal));
  },

  isLocalAdminLoggedIn(): boolean {
    return localStorage.getItem(LOCAL_STORAGE_ADMIN_AUTH_KEY) === 'true';
  },

  setLocalAdminLoggedIn(val: boolean): void {
    if (val) {
      localStorage.setItem(LOCAL_STORAGE_ADMIN_AUTH_KEY, 'true');
    } else {
      localStorage.removeItem(LOCAL_STORAGE_ADMIN_AUTH_KEY);
    }
  },
};
