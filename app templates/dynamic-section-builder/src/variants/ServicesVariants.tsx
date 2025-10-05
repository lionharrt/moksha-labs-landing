import React from 'react';
import { useTranslation } from 'react-i18next';
import { YourCompanySection } from '../components/YourCompanySection';

// Variant A: Side-by-Side Cards (current)
export const ServicesVariantA: React.FC = () => {
  const { t } = useTranslation('services');

  return (
    <YourCompanySection id="services" background="light" height="auto">
      <div className="text-center mb-16">
        <h2 className="text-4xl font-bold text-gray-900 mb-4 font-display">
          {t('services:title')}
        </h2>
        <p className="text-xl text-gray-600 max-w-3xl mx-auto">
          {t('services:subtitle')}
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-gradient-to-br from-primary-50 to-primary-100 rounded-2xl p-8 shadow-xl">
          <h3 className="text-2xl font-bold text-gray-900 mb-4 font-display">
            {t('services:residential.title')}
          </h3>
          <ul className="space-y-3 text-gray-700">
            {(t('services:residential.benefits', { returnObjects: true }) as string[]).map((benefit: string, index: number) => (
              <li key={index} className="flex items-start">
                <span className="text-primary-600 mr-2">✓</span>
                {benefit}
              </li>
            ))}
          </ul>
          <button
            onClick={() => {/* TODO: Open quote modal */}}
            className="mt-6 px-6 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors font-semibold"
          >
            {t('services:residential.cta')}
          </button>
        </div>

        <div className="bg-gradient-to-br from-secondary-50 to-secondary-100 rounded-2xl p-8 shadow-xl">
          <h3 className="text-2xl font-bold text-gray-900 mb-4 font-display">
            {t('services:commercial.title')}
          </h3>
          <ul className="space-y-3 text-gray-700">
            {(t('services:commercial.benefits', { returnObjects: true }) as string[]).map((benefit: string, index: number) => (
              <li key={index} className="flex items-start">
                <span className="text-secondary-600 mr-2">✓</span>
                {benefit}
              </li>
            ))}
          </ul>
          <button
            onClick={() => {/* TODO: Open quote modal */}}
            className="mt-6 px-6 py-3 bg-secondary-600 text-white rounded-lg hover:bg-secondary-700 transition-colors font-semibold"
          >
            {t('services:commercial.cta')}
          </button>
        </div>
      </div>
    </YourCompanySection>
  );
};

// Variant B: Stacked with Icons
export const ServicesVariantB: React.FC = () => {
  const { t } = useTranslation('services');

  return (
    <YourCompanySection id="services" background="light" height="auto">
      <div className="text-center mb-12">
        <h2 className="text-4xl font-bold text-gray-900 mb-4 font-display">
          {t('services:title')}
        </h2>
        <p className="text-xl text-gray-600 max-w-3xl mx-auto">
          {t('services:subtitle')}
        </p>
      </div>

      <div className="space-y-8 max-w-5xl mx-auto">
        {/* Residential */}
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
          <div className="bg-gradient-to-r from-primary-500 to-primary-600 p-6 flex items-center gap-4">
            <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center">
              <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
              </svg>
            </div>
            <div className="flex-1">
              <h3 className="text-2xl font-bold text-white font-display">
                {t('services:residential.title')}
              </h3>
            </div>
            <button
              onClick={() => {/* TODO: Open quote modal */}}
              className="px-6 py-3 bg-white text-primary-700 rounded-lg hover:bg-gray-100 transition-colors font-semibold"
            >
              {t('services:residential.cta')}
            </button>
          </div>
          <div className="p-8">
            <ul className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {(t('services:residential.benefits', { returnObjects: true }) as string[]).map((benefit: string, index: number) => (
                <li key={index} className="flex items-start gap-2">
                  <span className="text-primary-600 text-xl flex-shrink-0">✓</span>
                  <span className="text-gray-700">{benefit}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Commercial */}
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
          <div className="bg-gradient-to-r from-secondary-500 to-secondary-600 p-6 flex items-center gap-4">
            <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center">
              <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
              </svg>
            </div>
            <div className="flex-1">
              <h3 className="text-2xl font-bold text-white font-display">
                {t('services:commercial.title')}
              </h3>
            </div>
            <button
              onClick={() => {/* TODO: Open quote modal */}}
              className="px-6 py-3 bg-white text-secondary-700 rounded-lg hover:bg-gray-100 transition-colors font-semibold"
            >
              {t('services:commercial.cta')}
            </button>
          </div>
          <div className="p-8">
            <ul className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {(t('services:commercial.benefits', { returnObjects: true }) as string[]).map((benefit: string, index: number) => (
                <li key={index} className="flex items-start gap-2">
                  <span className="text-secondary-600 text-xl flex-shrink-0">✓</span>
                  <span className="text-gray-700">{benefit}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </YourCompanySection>
  );
};

// Variant C: Tabbed Layout
export const ServicesVariantC: React.FC = () => {
  const { t } = useTranslation('services');
  const [activeTab, setActiveTab] = React.useState<'residential' | 'commercial'>('residential');

  return (
    <YourCompanySection id="services" background="light" height="auto">
      <div className="text-center mb-12">
        <h2 className="text-4xl font-bold text-gray-900 mb-4 font-display">
          {t('services:title')}
        </h2>
        <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-8">
          {t('services:subtitle')}
        </p>

        {/* Tab Buttons */}
        <div className="inline-flex bg-gray-100 rounded-lg p-1 gap-1">
          <button
            onClick={() => setActiveTab('residential')}
            className={`px-8 py-3 rounded-lg font-semibold transition-all ${
              activeTab === 'residential'
                ? 'bg-primary-600 text-white shadow-lg'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            <span className="mr-2">🏠</span>
            {t('services:residential.title')}
          </button>
          <button
            onClick={() => setActiveTab('commercial')}
            className={`px-8 py-3 rounded-lg font-semibold transition-all ${
              activeTab === 'commercial'
                ? 'bg-secondary-600 text-white shadow-lg'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            <span className="mr-2">🏢</span>
            {t('services:commercial.title')}
          </button>
        </div>
      </div>

      {/* Tab Content */}
      <div className="max-w-4xl mx-auto">
        {activeTab === 'residential' ? (
          <div className="bg-gradient-to-br from-primary-50 to-primary-100 rounded-2xl p-8 lg:p-12 shadow-xl">
            <h3 className="text-3xl font-bold text-gray-900 mb-6 font-display">
              {t('services:residential.title')}
            </h3>
            <ul className="space-y-4 mb-8">
              {(t('services:residential.benefits', { returnObjects: true }) as string[]).map((benefit: string, index: number) => (
                <li key={index} className="flex items-start gap-3">
                  <span className="text-primary-600 text-2xl flex-shrink-0">✓</span>
                  <span className="text-gray-700 text-lg">{benefit}</span>
                </li>
              ))}
            </ul>
            <button
              onClick={() => {/* TODO: Open quote modal */}}
              className="w-full md:w-auto px-8 py-4 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors font-semibold text-lg shadow-lg hover:shadow-xl"
            >
              {t('services:residential.cta')}
            </button>
          </div>
        ) : (
          <div className="bg-gradient-to-br from-secondary-50 to-secondary-100 rounded-2xl p-8 lg:p-12 shadow-xl">
            <h3 className="text-3xl font-bold text-gray-900 mb-6 font-display">
              {t('services:commercial.title')}
            </h3>
            <ul className="space-y-4 mb-8">
              {(t('services:commercial.benefits', { returnObjects: true }) as string[]).map((benefit: string, index: number) => (
                <li key={index} className="flex items-start gap-3">
                  <span className="text-secondary-600 text-2xl flex-shrink-0">✓</span>
                  <span className="text-gray-700 text-lg">{benefit}</span>
                </li>
              ))}
            </ul>
            <button
              onClick={() => {/* TODO: Open quote modal */}}
              className="w-full md:w-auto px-8 py-4 bg-secondary-600 text-white rounded-lg hover:bg-secondary-700 transition-colors font-semibold text-lg shadow-lg hover:shadow-xl"
            >
              {t('services:commercial.cta')}
            </button>
          </div>
        )}
      </div>
    </YourCompanySection>
  );
};

