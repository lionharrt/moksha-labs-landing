import React from 'react';
import { useTranslation } from 'react-i18next';
import { YourCompanySection } from '../components/YourCompanySection';

const benefits = [
  { icon: '💰', key: 'saveMoney' },
  { icon: '🏠', key: 'increaseValue' },
  { icon: '🌱', key: 'greenEnergy' },
  { icon: '💳', key: 'greenMortgage' },
  { icon: '📈', key: 'roi' },
  { icon: '🛡️', key: 'warranty' },
];

// Variant A: Grid 3x2 (current)
export const BenefitsVariantA: React.FC = () => {
  const { t } = useTranslation('home');

  return (
    <YourCompanySection id="benefits" background="gradient" height="auto">
      <div className="text-center mb-16">
        <h2 className="text-4xl font-bold text-gray-900 mb-4 font-display">
          {t('benefits.title')}
        </h2>
        <p className="text-xl text-gray-600 max-w-3xl mx-auto">
          {t('benefits.subtitle')}
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {benefits.map((benefit) => (
          <div
            key={benefit.key}
            className="bg-white rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow"
          >
            <div className="text-4xl mb-4">{benefit.icon}</div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">
              {t(`benefits.${benefit.key}.title`)}
            </h3>
            <p className="text-gray-600">
              {t(`benefits.${benefit.key}.description`)}
            </p>
          </div>
        ))}
      </div>
    </YourCompanySection>
  );
};

// Variant B: Cards with Larger Icons
export const BenefitsVariantB: React.FC = () => {
  const { t } = useTranslation('home');

  return (
    <YourCompanySection id="benefits" background="gradient" height="auto">
      <div className="text-center mb-16">
        <h2 className="text-4xl font-bold text-gray-900 mb-4 font-display">
          {t('benefits.title')}
        </h2>
        <p className="text-xl text-gray-600 max-w-3xl mx-auto">
          {t('benefits.subtitle')}
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {benefits.map((benefit) => (
          <div
            key={benefit.key}
            className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all hover:-translate-y-1"
          >
            <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center text-4xl mb-6">
              {benefit.icon}
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-3">
              {t(`benefits.${benefit.key}.title`)}
            </h3>
            <p className="text-gray-600 leading-relaxed">
              {t(`benefits.${benefit.key}.description`)}
            </p>
          </div>
        ))}
      </div>
    </YourCompanySection>
  );
};

// Variant C: Simple List
export const BenefitsVariantC: React.FC = () => {
  const { t } = useTranslation('home');

  return (
    <YourCompanySection id="benefits" background="gradient" height="auto">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-gray-900 mb-4 font-display">
            {t('benefits.title')}
          </h2>
          <p className="text-xl text-gray-600">
            {t('benefits.subtitle')}
          </p>
        </div>

        <div className="space-y-6">
          {benefits.map((benefit) => (
            <div
              key={benefit.key}
              className="bg-white rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow flex items-start gap-4"
            >
              <div className="text-4xl flex-shrink-0">{benefit.icon}</div>
              <div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">
                  {t(`benefits.${benefit.key}.title`)}
                </h3>
                <p className="text-gray-600">
                  {t(`benefits.${benefit.key}.description`)}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </YourCompanySection>
  );
};

