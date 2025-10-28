import React from 'react';
import { useTranslation } from 'react-i18next';
import { YourCompanySection } from '../components/YourCompanySection';

const steps = ['step1', 'step2', 'step3'];

// Variant A: Cards (current)
export const ProcessVariantA: React.FC = () => {
  const { t } = useTranslation('home');

  return (
    <YourCompanySection id="process" background="dark" height="auto">
      <div className="text-center mb-12">
        <h2 className="text-4xl font-bold text-white mb-2 font-display">
          {t('process.title')}
        </h2>
        <p className="text-2xl text-white/90">{t('process.subtitle')}</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
        {steps.map((step, index) => (
          <div
            key={step}
            className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 hover:bg-white/20 transition-all"
          >
            <div className="text-4xl font-bold text-secondary-400 mb-4">
              {index + 1}
            </div>
            <h3 className="text-2xl font-bold text-white mb-3 font-display">
              {t(`process.${step}.title`)}
            </h3>
            <p className="text-white/80 leading-relaxed">
              {t(`process.${step}.description`)}
            </p>
          </div>
        ))}
      </div>

      <div className="text-center">
        <p className="text-xl text-white/90">{t('process.cta')}</p>
      </div>
    </YourCompanySection>
  );
};

// Variant B: Timeline
export const ProcessVariantB: React.FC = () => {
  const { t } = useTranslation('home');

  return (
    <YourCompanySection id="process" background="dark" height="auto">
      <div className="text-center mb-16">
        <h2 className="text-4xl font-bold text-white mb-2 font-display">
          {t('process.title')}
        </h2>
        <p className="text-2xl text-white/90">{t('process.subtitle')}</p>
      </div>

      <div className="max-w-5xl mx-auto">
        <div className="relative">
          {/* Timeline line */}
          <div className="absolute top-16 left-0 right-0 h-1 bg-secondary-400/30 hidden md:block" />

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
            {steps.map((step, index) => (
              <div key={step} className="text-center relative">
                {/* Number circle */}
                <div className="w-16 h-16 bg-secondary-500 rounded-full flex items-center justify-center text-white text-2xl font-bold mx-auto mb-6 relative z-10 shadow-lg">
                  {index + 1}
                </div>

                {/* Arrow (except last) */}
                {index < steps.length - 1 && (
                  <div className="hidden md:block absolute top-8 left-1/2 w-full text-secondary-400/50 text-4xl">
                    →
                  </div>
                )}

                <div className="bg-white/5 backdrop-blur-sm rounded-xl p-6">
                  <h3 className="text-xl font-bold text-white mb-3">
                    {t(`process.${step}.title`)}
                  </h3>
                  <p className="text-white/70 text-sm leading-relaxed">
                    {t(`process.${step}.description`)}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="text-center mt-12">
        <p className="text-xl text-white/90">{t('process.cta')}</p>
      </div>
    </YourCompanySection>
  );
};

// Variant C: Vertical Stepper
export const ProcessVariantC: React.FC = () => {
  const { t } = useTranslation('home');

  return (
    <YourCompanySection id="process" background="dark" height="auto">
      <div className="text-center mb-12">
        <h2 className="text-4xl font-bold text-white mb-2 font-display">
          {t('process.title')}
        </h2>
        <p className="text-2xl text-white/90">{t('process.subtitle')}</p>
      </div>

      <div className="max-w-3xl mx-auto">
        <div className="space-y-8">
          {steps.map((step, index) => (
            <div key={step} className="flex gap-6">
              {/* Left: Number */}
              <div className="flex-shrink-0">
                <div className="w-14 h-14 bg-secondary-500 rounded-full flex items-center justify-center text-white text-xl font-bold shadow-lg">
                  {index + 1}
                </div>
                {index < steps.length - 1 && (
                  <div className="w-0.5 h-16 bg-secondary-400/30 mx-auto mt-4" />
                )}
              </div>

              {/* Right: Content */}
              <div className="flex-1 bg-white/10 backdrop-blur-sm rounded-xl p-6 hover:bg-white/15 transition-all">
                <h3 className="text-2xl font-bold text-white mb-3 font-display">
                  {t(`process.${step}.title`)}
                </h3>
                <p className="text-white/80 leading-relaxed">
                  {t(`process.${step}.description`)}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="text-center mt-12">
        <p className="text-xl text-white/90">{t('process.cta')}</p>
      </div>
    </YourCompanySection>
  );
};

