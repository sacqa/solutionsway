import React, { createContext, useContext, useEffect, useState } from 'react';
import { supabase, isSupabaseConfigured, localDb } from '../lib/supabase';
import { ContactDetails, LegalDocuments } from '../lib/types';

interface SiteSettingsContextType {
  contact: ContactDetails;
  legal: LegalDocuments;
  refreshSettings: () => Promise<void>;
  loading: boolean;
}

const defaultContact: ContactDetails = {
  address_line1: '103, Dawes Road',
  city: 'London',
  country: 'United Kingdom',
  postcode: 'SW67DU',
  phone: '+44 20 7946 0910',
  email: 'enquiries@solutionsway.co.uk',
  maps_url: 'https://maps.google.com/?q=103+Dawes+Road+London+SW67DU',
};

const defaultLegal: LegalDocuments = {
  privacy_policy: `Solutions Way is committed to protecting your privacy. This notice explains how we collect and process data submitted through our website enquiry form in compliance with the UK General Data Protection Regulation (UK GDPR) and Data Protection Act 2018.

1. Information We Collect: When you submit an enquiry, we collect your full name, email address, optional telephone number, company name, service requirements, and project description.

2. Purpose of Processing: We process this data solely to respond to your enquiry, provide quotations, and discuss potential work.

3. Retention: Enquiry records are retained for client relationship management and archived or deleted when no longer required.

4. Contact: For data protection requests, contact us at 103, Dawes Road, London SW67DU.

Note: This legal document is an operational draft and requires legal review before formal launch.`,
  terms_of_service: `Terms of Service for Solutions Way.

1. Scope: These terms govern the preliminary use of this website. Formal agreements for services (Digital Marketing, SEO, Mobile App Development, Software Development) are subject to individual written contracts and agreed Statements of Work (SOW).

2. Intellectual Property: All materials, branding, and layouts are the intellectual property of Solutions Way.

3. Disclaimers: Information presented is for informational purposes. Estimates provided via enquiry forms are non-binding.

Note: This text is an operational draft and requires formal company review before commercial execution.`,
};

const SiteSettingsContext = createContext<SiteSettingsContextType>({
  contact: defaultContact,
  legal: defaultLegal,
  refreshSettings: async () => {},
  loading: true,
});

export const SiteSettingsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [contact, setContact] = useState<ContactDetails>(() => localDb.getContactDetails(defaultContact));
  const [legal, setLegal] = useState<LegalDocuments>(() => localDb.getLegalDocuments(defaultLegal));
  const [loading, setLoading] = useState<boolean>(true);

  const fetchSettings = async () => {
    if (!isSupabaseConfigured) {
      setContact(localDb.getContactDetails(defaultContact));
      setLegal(localDb.getLegalDocuments(defaultLegal));
      setLoading(false);
      return;
    }

    try {
      const { data, error } = await supabase.from('site_settings').select('key, value');
      if (error) throw error;
      if (data && data.length > 0) {
        data.forEach(item => {
          if (item.key === 'contact_details') setContact(item.value);
          if (item.key === 'legal_documents') setLegal(item.value);
        });
      }
    } catch (err) {
      console.warn('Using local settings fallback:', err);
      setContact(localDb.getContactDetails(defaultContact));
      setLegal(localDb.getLegalDocuments(defaultLegal));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSettings();
  }, []);

  return (
    <SiteSettingsContext.Provider value={{ contact, legal, refreshSettings: fetchSettings, loading }}>
      {children}
    </SiteSettingsContext.Provider>
  );
};

export const useSiteSettings = () => useContext(SiteSettingsContext);
