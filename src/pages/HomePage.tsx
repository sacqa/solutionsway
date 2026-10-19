import React, { useState } from 'react';
import { Header } from '../components/layout/Header';
import { Hero } from '../components/sections/Hero';
import { Services } from '../components/sections/Services';
import { WhyUs } from '../components/sections/WhyUs';
import { Approach } from '../components/sections/Approach';
import { FAQs } from '../components/sections/FAQs';
import { ContactSection } from '../components/sections/ContactSection';
import { Footer } from '../components/layout/Footer';
import { LegalModal } from '../components/ui/LegalModal';
import { useSiteSettings } from '../context/SiteSettingsContext';

interface HomePageProps {
  onNavigateToAdmin?: () => void;
}

export const HomePage: React.FC<HomePageProps> = ({ onNavigateToAdmin }) => {
  const [selectedService, setSelectedService] = useState<string>('');
  const [legalModal, setLegalModal] = useState<{ isOpen: boolean; title: string; content: string }>({
    isOpen: false,
    title: '',
    content: '',
  });

  const { legal } = useSiteSettings();

  const handleSelectService = (serviceName: string) => {
    setSelectedService(serviceName);
    const formElement = document.getElementById('contact');
    if (formElement) {
      formElement.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-blue-600 selection:text-white">
      <Header onNavigateToAdmin={onNavigateToAdmin} />
      <main className="flex-grow">
        <Hero />
        <Services onSelectService={handleSelectService} />
        <WhyUs />
        <Approach />
        <FAQs />
        <ContactSection
          selectedService={selectedService}
          onServiceChange={setSelectedService}
          onOpenPrivacyNotice={() =>
            setLegalModal({
              isOpen: true,
              title: 'Privacy Notice',
              content: legal.privacy_policy,
            })
          }
        />
      </main>
      <Footer
        onOpenPrivacy={() =>
          setLegalModal({
            isOpen: true,
            title: 'Privacy Notice',
            content: legal.privacy_policy,
          })
        }
        onOpenTerms={() =>
          setLegalModal({
            isOpen: true,
            title: 'Terms of Service',
            content: legal.terms_of_service,
          })
        }
        onNavigateToAdmin={onNavigateToAdmin}
      />

      <LegalModal
        isOpen={legalModal.isOpen}
        title={legalModal.title}
        content={legalModal.content}
        onClose={() => setLegalModal({ ...legalModal, isOpen: false })}
      />
    </div>
  );
};
