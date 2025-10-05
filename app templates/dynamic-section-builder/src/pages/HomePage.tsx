import React from 'react';
import { Helmet } from 'react-helmet-async';
import { useTranslation } from 'react-i18next';
import { useVariants } from '../contexts/VariantContext';
import { YourCompanyVideoHero } from '../components/YourCompanyVideoHero';
import { MEDIA_CONFIG } from '../config/media';
import {
  WhoWeAreVariantA,
  WhoWeAreVariantB,
  WhoWeAreVariantC,
} from '../variants/WhoWeAreVariants';
import {
  BenefitsVariantA,
  BenefitsVariantB,
  BenefitsVariantC,
} from '../variants/BenefitsVariants';
import {
  ProcessVariantA,
  ProcessVariantB,
  ProcessVariantC,
} from '../variants/ProcessVariants';
import {
  DidYouKnowVariantA,
  DidYouKnowVariantB,
  DidYouKnowVariantC,
} from '../variants/DidYouKnowVariants';
import {
  ContactVariantA,
  ContactVariantB,
  ContactVariantC,
} from '../variants/ContactVariants';
import {
  InvestVariantA,
  InvestVariantB,
  InvestVariantC,
} from '../variants/InvestVariants';
import {
  ShowcaseVariantA,
  ShowcaseVariantB,
  ShowcaseVariantC,
} from '../variants/ShowcaseVariants';
import {
  ServicesVariantA,
  ServicesVariantB,
  ServicesVariantC,
} from '../variants/ServicesVariants';

export const YourCompanyHomePage: React.FC = () => {
  const { t } = useTranslation(['home', 'services', 'common']);
  const { state } = useVariants();

  // Variant component mappings
  const whoWeAreVariants = {
    A: WhoWeAreVariantA,
    B: WhoWeAreVariantB,
    C: WhoWeAreVariantC,
  };

  const benefitsVariants = {
    A: BenefitsVariantA,
    B: BenefitsVariantB,
    C: BenefitsVariantC,
  };

  const showcaseVariants = {
    A: ShowcaseVariantA,
    B: ShowcaseVariantB,
    C: ShowcaseVariantC,
  };

  const servicesVariants = {
    A: ServicesVariantA,
    B: ServicesVariantB,
    C: ServicesVariantC,
  };

  const processVariants = {
    A: ProcessVariantA,
    B: ProcessVariantB,
    C: ProcessVariantC,
  };

  const didYouKnowVariants = {
    A: DidYouKnowVariantA,
    B: DidYouKnowVariantB,
    C: DidYouKnowVariantC,
  };

  const contactVariants = {
    A: ContactVariantA,
    B: ContactVariantB,
    C: ContactVariantC,
  };

  const investVariants = {
    A: InvestVariantA,
    B: InvestVariantB,
    C: InvestVariantC,
  };

  // Get selected variants (with fallbacks for backwards compatibility)
  const WhoWeAreComponent = whoWeAreVariants[(state.sections.whoWeAre || 'A') as keyof typeof whoWeAreVariants];
  const BenefitsComponent = benefitsVariants[(state.sections.benefits || 'A') as keyof typeof benefitsVariants];
  const ServicesComponent = servicesVariants[(state.sections.services || 'A') as keyof typeof servicesVariants];
  const ShowcaseComponent = showcaseVariants[(state.sections.showcase || 'A') as keyof typeof showcaseVariants];
  const ProcessComponent = processVariants[(state.sections.process || 'A') as keyof typeof processVariants];
  const DidYouKnowComponent = didYouKnowVariants[(state.sections.didYouKnow || 'A') as keyof typeof didYouKnowVariants];
  const InvestComponent = investVariants[(state.sections.invest || 'A') as keyof typeof investVariants];
  const ContactComponent = contactVariants[(state.sections.contact || 'A') as keyof typeof contactVariants];

  // Section component map for dynamic ordering
  const sectionMap: Record<string, React.ReactNode> = {
    whoWeAre: <WhoWeAreComponent key="whoWeAre" onGetQuote={() => {/* TODO: Open quote modal */}} />,
    benefits: <BenefitsComponent key="benefits" />,
    services: <ServicesComponent key="services" />,
    showcase: <ShowcaseComponent key="showcase" />,
    process: <ProcessComponent key="process" />,
    didYouKnow: <DidYouKnowComponent key="didYouKnow" />,
    invest: <InvestComponent key="invest" />,
    contact: <ContactComponent key="contact" />,
  };

  // Render sections in the order specified by state.sectionOrder
  const orderedSections = (state.sectionOrder || Object.keys(sectionMap)).map(
    (sectionKey) => sectionMap[sectionKey]
  );

  return (
    <>
      <Helmet>
        <title>{t('common:company.name')} - Solar Panel Installation Dublin & Leinster</title>
        <meta
          name="description"
          content="Family-owned solar PV specialists in Dublin & Leinster. Save up to 90% on electricity bills. SEAI grants up to €2,100. Premium panels with 30-year warranty."
        />
      </Helmet>

      {/* Hero Section - Always First */}
      <section id="home" className="scroll-snap-section">
      <YourCompanyVideoHero
          videoUrl={MEDIA_CONFIG.videos.hero}
          onGetQuote={() => {/* TODO: Open quote modal */}}
        />
      </section>

      {/* Dynamically Ordered Sections */}
      {orderedSections}
    </>
  );
};

