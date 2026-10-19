export interface ContactDetails {
  address_line1: string;
  city: string;
  country: string;
  postcode: string;
  phone?: string;
  email?: string;
  maps_url: string;
}

export interface LegalDocuments {
  privacy_policy: string;
  terms_of_service: string;
}

export type EnquiryStatus = 'new' | 'contacted' | 'in_progress' | 'closed' | 'spam';

export interface Enquiry {
  id: string;
  reference_no: string;
  full_name: string;
  email: string;
  phone: string | null;
  company: string | null;
  service_required: string;
  estimated_budget: string | null;
  project_description: string;
  status: EnquiryStatus;
  internal_notes: string | null;
  created_at: string;
  updated_at: string;
}
