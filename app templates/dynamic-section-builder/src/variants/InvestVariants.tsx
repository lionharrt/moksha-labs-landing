import React from 'react';
import { useTranslation } from 'react-i18next';
import { YourCompanySection } from '../components/YourCompanySection';

// Variant A: Benefits List (Original)
export const InvestVariantA: React.FC = () => {
  const { t } = useTranslation(['home', 'common']);

  return (
    <YourCompanySection id="invest" background="light" height="auto">
      <div className="max-w-4xl mx-auto">
        <h2 className="text-4xl font-bold text-gray-900 mb-8 text-center font-display">
          {t('home:invest.title')}
        </h2>

        <div className="bg-gradient-to-br from-primary-50 to-accent-50 rounded-2xl p-8 lg:p-12 mb-8">
          <p className="text-gray-700 leading-relaxed mb-6">
            Not only is installing solar panels beneficial for the environment, providing a sustainable,
            renewable and clean source of free electricity for your home or business, but it also offers
            significant financial advantages.
          </p>

          <ul className="space-y-4 mb-6">
            {(t('home:invest.benefits', { returnObjects: true }) as string[]).map((benefit: string, index: number) => (
              <li key={index} className="flex items-start gap-3">
                <span className="text-primary-600 text-xl flex-shrink-0 font-bold">{index + 1}.</span>
                <span className="text-gray-700 leading-relaxed">{benefit}</span>
              </li>
            ))}
          </ul>

          <p className="text-gray-700 leading-relaxed font-semibold">
            {t('home:invest.payback')}
          </p>
        </div>

        <div className="space-y-6 text-gray-700 leading-relaxed">
          <p>{t('home:invest.familyBusiness')}</p>
          <p>{t('home:invest.closing')}</p>
        </div>

        <div className="text-center mt-8">
          <button
            onClick={() => {/* TODO: Open quote modal */}}
            className="px-8 py-4 bg-secondary-500 hover:bg-secondary-600 text-white font-bold text-lg rounded-lg transition-colors shadow-lg"
          >
            {t('common:cta.getQuote')}
          </button>
        </div>
      </div>
    </YourCompanySection>
  );
};

// Variant B: Two Column Layout
export const InvestVariantB: React.FC = () => {
  const { t } = useTranslation(['home', 'common']);

  return (
    <YourCompanySection id="invest" background="light" height="auto">
      <div className="max-w-7xl mx-auto">
        <h2 className="text-4xl font-bold text-gray-900 mb-12 text-center font-display">
          {t('home:invest.title')}
        </h2>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Left: Benefits */}
          <div className="bg-gradient-to-br from-primary-50 to-accent-50 rounded-2xl p-8 lg:p-10">
            <h3 className="text-2xl font-bold text-gray-900 mb-6 font-display">
              💰 Financial Benefits
            </h3>
            <ul className="space-y-4 mb-6">
              {(t('home:invest.benefits', { returnObjects: true }) as string[]).map((benefit: string, index: number) => (
                <li key={index} className="flex items-start gap-3">
                  <span className="text-primary-600 text-xl flex-shrink-0 font-bold">{index + 1}.</span>
                  <span className="text-gray-700 leading-relaxed">{benefit}</span>
                </li>
              ))}
            </ul>
            <p className="text-gray-700 leading-relaxed font-semibold border-t border-primary-200 pt-4">
              {t('home:invest.payback')}
            </p>
          </div>

          {/* Right: About Us */}
          <div className="flex flex-col justify-center space-y-6">
            <div className="bg-white rounded-2xl p-8 shadow-lg">
              <p className="text-gray-700 leading-relaxed mb-4">
                Not only is installing solar panels beneficial for the environment, providing a sustainable,
                renewable and clean source of free electricity for your home or business, but it also offers
                significant financial advantages.
              </p>
              <p className="text-gray-700 leading-relaxed mb-4">
                {t('home:invest.familyBusiness')}
              </p>
              <p className="text-gray-700 leading-relaxed">
                {t('home:invest.closing')}
              </p>
            </div>

            <div className="text-center">
              <button
                onClick={() => {/* TODO: Open quote modal */}}
                className="px-8 py-4 bg-secondary-500 hover:bg-secondary-600 text-white font-bold text-lg rounded-lg transition-colors shadow-lg w-full lg:w-auto"
              >
                {t('common:cta.getQuote')}
              </button>
            </div>
          </div>
        </div>
      </div>
    </YourCompanySection>
  );
};

// Variant C: Benefit Cards
export const InvestVariantC: React.FC = () => {
  const { t } = useTranslation(['home', 'common']);

  return (
    <YourCompanySection id="invest" background="light" height="auto">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-gray-900 mb-4 font-display">
            {t('home:invest.title')}
          </h2>
          <p className="text-gray-700 leading-relaxed max-w-3xl mx-auto">
            Not only is installing solar panels beneficial for the environment, providing a sustainable,
            renewable and clean source of free electricity for your home or business, but it also offers
            significant financial advantages.
          </p>
        </div>

        {/* Benefit Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {(t('home:invest.benefits', { returnObjects: true }) as string[]).map((benefit: string, index: number) => (
            <div 
              key={index} 
              className="bg-gradient-to-br from-primary-50 to-accent-50 rounded-xl p-6 shadow-md hover:shadow-lg transition-shadow"
            >
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0 w-10 h-10 bg-primary-600 text-white rounded-full flex items-center justify-center font-bold text-lg">
                  {index + 1}
                </div>
                <p className="text-gray-700 leading-relaxed flex-1">{benefit}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Payback Info */}
        <div className="bg-white rounded-2xl p-8 shadow-lg mb-8 text-center">
          <p className="text-gray-700 leading-relaxed font-semibold text-lg">
            {t('home:invest.payback')}
          </p>
        </div>

        {/* Family Business Info */}
        <div className="max-w-3xl mx-auto space-y-6 text-center text-gray-700 leading-relaxed mb-8">
          <p>{t('home:invest.familyBusiness')}</p>
          <p>{t('home:invest.closing')}</p>
        </div>

        {/* CTA */}
        <div className="text-center">
          <button
            onClick={() => {/* TODO: Open quote modal */}}
            className="px-8 py-4 bg-secondary-500 hover:bg-secondary-600 text-white font-bold text-lg rounded-lg transition-colors shadow-lg"
          >
            {t('common:cta.getQuote')}
          </button>
        </div>
      </div>
    </YourCompanySection>
  );
};

