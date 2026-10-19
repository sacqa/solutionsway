-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. Admin Profiles table
CREATE TABLE public.admin_profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    email TEXT NOT NULL UNIQUE,
    full_name TEXT NOT NULL,
    is_active BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

ALTER TABLE public.admin_profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins can view their own profile"
    ON public.admin_profiles FOR SELECT
    USING (auth.uid() = id);

-- Helper security function to verify admin status
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN
LANGUAGE sql
SECURITY DEFINER
SET search_path = public
STABLE
AS $$
    SELECT EXISTS (
        SELECT 1 FROM public.admin_profiles
        WHERE id = auth.uid() AND is_active = true
    );
$$;

-- 2. Enquiry sequence generator
CREATE SEQUENCE IF NOT EXISTS public.enquiry_ref_seq START 1001;

CREATE OR REPLACE FUNCTION public.generate_enquiry_reference()
RETURNS TEXT
LANGUAGE plpgsql
AS $$
DECLARE
    today_str TEXT;
    next_val INT;
BEGIN
    today_str := to_char(timezone('utc'::text, now()), 'YYYYMMDD');
    next_val := nextval('public.enquiry_ref_seq');
    RETURN 'SW-' || today_str || '-' || lpad(next_val::text, 4, '0');
END;
$$;

-- 3. Enquiries Table
CREATE TYPE enquiry_status AS ENUM ('new', 'contacted', 'in_progress', 'closed', 'spam');

CREATE TABLE public.enquiries (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    reference_no TEXT NOT NULL UNIQUE DEFAULT public.generate_enquiry_reference(),
    idempotency_key TEXT UNIQUE,
    full_name TEXT NOT NULL CHECK (char_length(trim(full_name)) >= 2 AND char_length(full_name) <= 100),
    email TEXT NOT NULL CHECK (email ~* '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$'),
    phone TEXT CHECK (phone IS NULL OR char_length(phone) <= 30),
    company TEXT CHECK (company IS NULL OR char_length(company) <= 120),
    service_required TEXT NOT NULL CHECK (service_required IN ('Digital Marketing', 'SEO', 'Mobile App Development', 'Software Development')),
    estimated_budget TEXT CHECK (estimated_budget IN ('Under £5,000', '£5,000 - £15,000', '£15,000 - £35,000', '£35,000+', 'Not sure yet')),
    project_description TEXT NOT NULL CHECK (char_length(trim(project_description)) >= 20 AND char_length(project_description) <= 3000),
    privacy_consent BOOLEAN NOT NULL DEFAULT false CHECK (privacy_consent = true),
    status enquiry_status NOT NULL DEFAULT 'new',
    internal_notes TEXT,
    ip_address_hash TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

ALTER TABLE public.enquiries ENABLE ROW LEVEL SECURITY;

-- Deny public reading or tampering
CREATE POLICY "Public cannot view enquiries"
    ON public.enquiries FOR SELECT
    USING (false);

-- Only verified admins can read/update enquiries
CREATE POLICY "Admins can view enquiries"
    ON public.enquiries FOR SELECT
    TO authenticated
    USING (public.is_admin());

CREATE POLICY "Admins can update enquiries"
    ON public.enquiries FOR UPDATE
    TO authenticated
    USING (public.is_admin())
    WITH CHECK (public.is_admin());

-- 4. Site Settings & Dynamic Content Table
CREATE TABLE public.site_settings (
    key TEXT PRIMARY KEY,
    value JSONB NOT NULL,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    updated_by UUID REFERENCES public.admin_profiles(id)
);

ALTER TABLE public.site_settings ENABLE ROW LEVEL SECURITY;

-- Allow public read access to site settings
CREATE POLICY "Public read site settings"
    ON public.site_settings FOR SELECT
    USING (true);

-- Allow only admins to modify settings
CREATE POLICY "Admins update site settings"
    ON public.site_settings FOR ALL
    TO authenticated
    USING (public.is_admin())
    WITH CHECK (public.is_admin());

-- Seed initial configuration
INSERT INTO public.site_settings (key, value)
VALUES
('contact_details', '{
    "address_line1": "103, Dawes Road",
    "city": "London",
    "country": "United Kingdom",
    "postcode": "SW67DU",
    "phone": "",
    "email": "",
    "maps_url": "https://maps.google.com/?q=103+Dawes+Road+London+SW67DU"
}'::jsonb),
('legal_documents', '{
    "privacy_policy": "Solutions Way is committed to protecting your privacy. This notice explains how we collect and process data submitted through our website enquiry form in compliance with the UK General Data Protection Regulation (UK GDPR) and Data Protection Act 2018.\\n\\n1. Information We Collect: When you submit an enquiry, we collect your full name, email address, optional telephone number, company name, service requirements, and project description.\\n\\n2. Purpose of Processing: We process this data solely to respond to your enquiry, provide quotations, and discuss potential work.\\n\\n3. Retention: Enquiry records are retained for client relationship management and archived or deleted when no longer required.\\n\\nNote: This legal document is an operational draft and requires legal review before formal launch.",
    "terms_of_service": "Terms of Service for Solutions Way.\\n\\n1. Scope: These terms govern the preliminary use of this website. Formal agreements for services (Digital Marketing, SEO, Mobile App Development, Software Development) are subject to individual written contracts and agreed Statements of Work (SOW).\\n\\n2. Intellectual Property: All materials, branding, and layouts are the intellectual property of Solutions Way.\\n\\nNote: This text is an operational draft and requires formal company review before commercial execution."
}'::jsonb)
ON CONFLICT (key) DO NOTHING;
