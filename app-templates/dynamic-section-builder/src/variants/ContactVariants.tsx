import React from 'react';
import { useTranslation } from 'react-i18next';
import { YourCompanySection } from '../components/YourCompanySection';

// Variant A: Centered (current - placeholder)
export const ContactVariantA: React.FC = () => {
  const { t } = useTranslation(['home', 'common']);

  return (
    <YourCompanySection id="contact" background="gradient" height="auto">
      <div className="max-w-3xl mx-auto text-center">
        <h2 className="text-4xl font-bold text-gray-900 mb-4 font-display">
          {t('home:contact.title')}
        </h2>
        <p className="text-xl text-gray-600 mb-8">
          {t('home:contact.subtitle')} <strong>+1-555-0100</strong>
        </p>

        <div className="bg-white rounded-2xl p-8 shadow-lg">
          <h3 className="text-2xl font-bold text-gray-900 mb-6">
            {t('home:contact.formTitle')}
          </h3>

          <form className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <input
                type="text"
                placeholder="First Name"
                className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              />
              <input
                type="text"
                placeholder="Last Name"
                className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              />
            </div>
            <input
              type="email"
              placeholder="Email"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            />
            <input
              type="tel"
              placeholder="Phone"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            />
            <input
              type="text"
              placeholder="Eircode"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            />
            <textarea
              placeholder="Additional Notes"
              rows={4}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            />
            <button
              type="submit"
              className="w-full bg-secondary-500 hover:bg-secondary-600 text-white font-bold py-4 px-8 rounded-lg transition-colors"
            >
              {t('common:cta.getQuote')}
            </button>
          </form>

          <p className="text-xs text-gray-500 mt-4">{t('home:contact.formNote')}</p>
        </div>
      </div>
    </YourCompanySection>
  );
};

// Variant B: Split
export const ContactVariantB: React.FC = () => {
  const { t } = useTranslation(['home', 'common']);

  return (
    <YourCompanySection id="contact" background="gradient" height="auto">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
        {/* Left: Info */}
        <div>
          <h2 className="text-4xl font-bold text-gray-900 mb-4 font-display">
            {t('home:contact.title')}
          </h2>
          <p className="text-xl text-gray-600 mb-8">
            {t('home:contact.subtitle')}
          </p>

          <div className="space-y-6">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 bg-primary-100 rounded-full flex items-center justify-center flex-shrink-0">
                <span className="text-2xl">📞</span>
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 mb-1">Phone</h3>
                <p className="text-gray-600">+1-555-0100</p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="w-12 h-12 bg-primary-100 rounded-full flex items-center justify-center flex-shrink-0">
                <span className="text-2xl">📍</span>
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 mb-1">Service Area</h3>
                <p className="text-gray-600">Dublin & All of Leinster</p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="w-12 h-12 bg-primary-100 rounded-full flex items-center justify-center flex-shrink-0">
                <span className="text-2xl">⚡</span>
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 mb-1">Response Time</h3>
                <p className="text-gray-600">Free consultation within 24 hours</p>
              </div>
            </div>
          </div>
        </div>

        {/* Right: Form */}
        <div className="bg-white rounded-2xl p-8 shadow-lg">
          <h3 className="text-2xl font-bold text-gray-900 mb-6">
            {t('home:contact.formTitle')}
          </h3>

          <form className="space-y-4">
            <input
              type="text"
              placeholder="Full Name"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            />
            <input
              type="email"
              placeholder="Email"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            />
            <input
              type="tel"
              placeholder="Phone"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            />
            <input
              type="text"
              placeholder="Eircode"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            />
            <textarea
              placeholder="Tell us about your project"
              rows={3}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            />
            <button
              type="submit"
              className="w-full bg-secondary-500 hover:bg-secondary-600 text-white font-bold py-3 px-6 rounded-lg transition-colors"
            >
              {t('common:cta.getQuote')}
            </button>
          </form>

          <p className="text-xs text-gray-500 mt-4">{t('home:contact.formNote')}</p>
        </div>
      </div>
    </YourCompanySection>
  );
};

// Variant C: Compact
export const ContactVariantC: React.FC = () => {
  const { t } = useTranslation(['home', 'common']);

  return (
    <YourCompanySection id="contact" background="gradient" height="auto">
      <div className="max-w-2xl mx-auto">
        <div className="text-center mb-8">
          <h2 className="text-4xl font-bold text-gray-900 mb-4 font-display">
            {t('home:contact.title')}
          </h2>
          <p className="text-xl text-gray-600">
            Call <strong>+1-555-0100</strong> or fill out the form below
          </p>
        </div>

        <div className="bg-white rounded-2xl p-6 shadow-lg">
          <form className="space-y-3">
            <div className="grid grid-cols-2 gap-3">
              <input
                type="text"
                placeholder="Name"
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent text-sm"
              />
              <input
                type="tel"
                placeholder="Phone"
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent text-sm"
              />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <input
                type="email"
                placeholder="Email"
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent text-sm"
              />
              <input
                type="text"
                placeholder="Eircode"
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent text-sm"
              />
            </div>
            <textarea
              placeholder="Message (optional)"
              rows={2}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent text-sm"
            />
            <button
              type="submit"
              className="w-full bg-secondary-500 hover:bg-secondary-600 text-white font-bold py-3 px-6 rounded-lg transition-colors"
            >
              {t('common:cta.getQuote')}
            </button>
          </form>
        </div>
      </div>
    </YourCompanySection>
  );
};

