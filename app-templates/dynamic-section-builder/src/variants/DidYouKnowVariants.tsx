import React from 'react';
import { useTranslation } from 'react-i18next';
import { YourCompanySection } from '../components/YourCompanySection';

// Variant A: List (current)
export const DidYouKnowVariantA: React.FC = () => {
  const { t } = useTranslation('home');
  const facts = t('didYouKnow.facts', { returnObjects: true }) as string[];

  return (
    <YourCompanySection id="did-you-know" background="light" height="auto">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <p className="text-primary-600 font-semibold text-sm uppercase tracking-wide mb-2">
            {t('didYouKnow.subtitle')}
          </p>
          <h2 className="text-4xl font-bold text-gray-900 mb-8 font-display">
            {t('didYouKnow.title')}
          </h2>
        </div>

        <div className="bg-gradient-to-br from-primary-50 to-accent-50 rounded-2xl p-8 lg:p-12">
          <ul className="space-y-4">
            {facts.map((fact, index) => (
              <li key={index} className="flex items-start gap-4">
                <span className="text-primary-600 text-2xl flex-shrink-0">✓</span>
                <span className="text-gray-700 text-lg leading-relaxed">{fact}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </YourCompanySection>
  );
};

// Variant B: Cards
export const DidYouKnowVariantB: React.FC = () => {
  const { t } = useTranslation('home');
  const facts = t('didYouKnow.facts', { returnObjects: true }) as string[];

  const icons = ['☀️', '🌧️', '❄️', '💰', '💧', '⚡'];

  return (
    <YourCompanySection id="did-you-know" background="light" height="auto">
      <div className="text-center mb-12">
        <p className="text-primary-600 font-semibold text-sm uppercase tracking-wide mb-2">
          {t('didYouKnow.subtitle')}
        </p>
        <h2 className="text-4xl font-bold text-gray-900 mb-8 font-display">
          {t('didYouKnow.title')}
        </h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {facts.map((fact, index) => (
          <div
            key={index}
            className="bg-white rounded-xl p-6 shadow-sm hover:shadow-md transition-all hover:-translate-y-1"
          >
            <div className="text-4xl mb-4">{icons[index]}</div>
            <p className="text-gray-700 leading-relaxed">{fact}</p>
          </div>
        ))}
      </div>
    </YourCompanySection>
  );
};

// Variant C: Two Column
export const DidYouKnowVariantC: React.FC = () => {
  const { t } = useTranslation('home');
  const facts = t('didYouKnow.facts', { returnObjects: true }) as string[];

  const leftFacts = facts.slice(0, 3);
  const rightFacts = facts.slice(3);

  return (
    <YourCompanySection id="did-you-know" background="light" height="auto">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <p className="text-primary-600 font-semibold text-sm uppercase tracking-wide mb-2">
            {t('didYouKnow.subtitle')}
          </p>
          <h2 className="text-4xl font-bold text-gray-900 mb-8 font-display">
            {t('didYouKnow.title')}
          </h2>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Left Column */}
          <div className="bg-gradient-to-br from-primary-50 to-primary-100 rounded-2xl p-8">
            <ul className="space-y-6">
              {leftFacts.map((fact, index) => (
                <li key={index} className="flex items-start gap-3">
                  <span className="text-primary-600 text-xl flex-shrink-0 font-bold">
                    {index + 1}.
                  </span>
                  <span className="text-gray-700 leading-relaxed">{fact}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Right Column */}
          <div className="bg-gradient-to-br from-accent-50 to-secondary-50 rounded-2xl p-8">
            <ul className="space-y-6">
              {rightFacts.map((fact, index) => (
                <li key={index} className="flex items-start gap-3">
                  <span className="text-secondary-600 text-xl flex-shrink-0 font-bold">
                    {index + 4}.
                  </span>
                  <span className="text-gray-700 leading-relaxed">{fact}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </YourCompanySection>
  );
};

