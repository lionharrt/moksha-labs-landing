import React from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { MEDIA_CONFIG } from '../config/media';
import { useVariants } from '../contexts/VariantContext';

interface FooterProps {
  className?: string;
}

const Footer: React.FC<FooterProps> = ({ className = '' }) => {
  const { t } = useTranslation(['common', 'navigation']);
  const navigate = useNavigate();
  const { state } = useVariants();

  const scrollToSection = (sectionId: string) => {
    navigate(`/#${sectionId}`);
    setTimeout(() => {
      const element = document.getElementById(sectionId);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }, 100);
  };

  // Section key to nav ID mapping (same as Navigation component)
  const sectionToNavId: Record<string, string> = {
    whoWeAre: 'who-we-are',
    benefits: 'benefits',
    services: 'services',
    showcase: 'recent-jobs',
    process: 'process',
    didYouKnow: 'did-you-know',
    invest: 'invest',
    contact: 'contact',
  };

  // Section key to translation key mapping
  const sectionToTranslationKey: Record<string, string> = {
    whoWeAre: 'whoWeAre',
    benefits: 'benefits',
    services: 'services',
    showcase: 'recentJobs',
    process: 'process',
    didYouKnow: 'didYouKnow',
    invest: 'invest',
    contact: 'contact',
  };

  // Dynamic navigation items based on enabled sections
  const footerNavItems = [
    { id: 'home', label: t('navigation:home') },
    ...state.sectionOrder
      .filter(sectionKey => sectionToNavId[sectionKey])
      .map(sectionKey => ({
        id: sectionToNavId[sectionKey],
        label: t(`navigation:${sectionToTranslationKey[sectionKey]}`),
      })),
  ];

  const currentYear = new Date().getFullYear();

  return (
    <footer className={`bg-gray-900 text-white ${className}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Company Info */}
          <div>
            <img 
              src={MEDIA_CONFIG.images.logo} 
              alt={t('common:company.name')}
              className="h-16 w-auto min-w-[120px] mb-4"
              style={{ objectFit: 'contain' }}
            />
            <p className="text-gray-400 mb-4">{t('common:company.tagline')}</p>
            
            <div className="space-y-2 text-gray-400">
              <div className="flex items-start">
                <svg className="w-5 h-5 mr-2 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                <div>
                  <p>{t('common:company.address')}</p>
                  <p>{t('common:company.eircode')}</p>
                </div>
              </div>
              
              <div className="flex items-center">
                <svg className="w-5 h-5 mr-2 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                </svg>
                <a href={`tel:${t('common:company.phone')}`} className="hover:text-primary-400 transition-colors">
                  {t('common:company.phone')}
                </a>
              </div>

              <div className="flex items-center">
                <svg className="w-5 h-5 mr-2 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
                <a href={`mailto:${t('common:company.email')}`} className="hover:text-primary-400 transition-colors">
                  {t('common:company.email')}
                </a>
              </div>
            </div>
          </div>

          {/* Sitemap */}
          <div>
            <h4 className="text-lg font-semibold mb-4">{t('common:footer.sitemap')}</h4>
            <ul className="space-y-2">
              {footerNavItems.map((item) => (
                <li key={item.id}>
                  <button
                    onClick={() => scrollToSection(item.id)}
                    className="text-gray-400 hover:text-primary-400 transition-colors"
                  >
                    {item.label}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Business Hours & Legal */}
          <div>
            <h4 className="text-lg font-semibold mb-4">Information</h4>
            <ul className="space-y-2">
              <li>
                <a href="/privacy-policy" className="text-gray-400 hover:text-primary-400 transition-colors">
                  {t('common:footer.privacyPolicy')}
                </a>
              </li>
              <li>
                <a href="/terms" className="text-gray-400 hover:text-primary-400 transition-colors">
                  {t('common:footer.termsConditions')}
                </a>
              </li>
            </ul>

            <div className="mt-6">
              <p className="text-sm text-gray-500">SEAI Registered</p>
              <p className="text-sm text-gray-500">Fully Insured</p>
            </div>
          </div>
        </div>

        {/* Copyright */}
        <div className="mt-12 pt-8 border-t border-gray-800 text-center text-gray-500 text-sm">
          <p>{t('common:footer.copyright')}</p>
          <p className="mt-2">
            &copy; {currentYear} {t('common:company.name')}
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

