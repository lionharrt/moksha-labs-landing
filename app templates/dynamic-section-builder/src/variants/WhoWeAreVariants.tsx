import React from 'react';
import { useTranslation } from 'react-i18next';
import { YourCompanySection } from '../components/YourCompanySection';
import { MEDIA_CONFIG } from '../config/media';

interface WhoWeAreProps {
  onGetQuote: () => void;
}

// Variant A: Founder Story with Team Photo
export const WhoWeAreVariantA: React.FC<WhoWeAreProps> = ({ onGetQuote }) => {
  const { t } = useTranslation(['home', 'common']);

  return (
    <YourCompanySection id="who-we-are" background="light" height="auto">
      <div className="text-center mb-8">
        <p className="text-primary-600 font-semibold text-sm uppercase tracking-wide mb-2">
          {t('home:whoWeAre.heading')}
        </p>
        <h2 className="text-4xl font-bold text-gray-900 mb-8 font-display">
          {t('home:whoWeAre.title')}
        </h2>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
        {/* Team Photo on Left */}
        <div className="relative">
          <div className="aspect-[4/3] rounded-2xl overflow-hidden shadow-2xl">
            <img 
              src={MEDIA_CONFIG.images.teamPhoto} 
              alt="Your Company Team"
              className="w-full h-full object-cover"
            />
          </div>
          
          {/* Founder Quote Card Overlay */}
          <div className="mt-6 bg-white rounded-xl p-6 shadow-lg border-l-4 border-primary-500">
            <div className="flex items-start gap-4">
              {/* Founder Photo Placeholder */}
              <div className="flex-shrink-0 w-16 h-16 rounded-full bg-gradient-to-br from-secondary-400 to-secondary-600 flex items-center justify-center">
                <svg className="w-8 h-8 text-white/60" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              </div>
              <div className="flex-1">
                <p className="text-sm text-gray-700 italic mb-2">"{t('home:whoWeAre.brendanQuote')}"</p>
                <div>
                  <p className="font-bold text-gray-900">{t('home:whoWeAre.brendanName')}</p>
                  <p className="text-xs text-gray-600">{t('home:whoWeAre.brendanRole')}</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Content on Right */}
        <div>
          <div className="mb-6">
            <span className="inline-block bg-accent-100 text-accent-800 text-sm font-semibold px-4 py-2 rounded-full mb-4">
              🇮🇪 Family-Owned Since 2012
            </span>
            <h3 className="text-3xl font-bold text-gray-900 mb-4 font-display">
              {t('home:whoWeAre.whatWeDo.title')}
            </h3>
          </div>
          <p className="text-gray-700 mb-4 leading-relaxed">
            {t('home:whoWeAre.whatWeDo.description')}
          </p>
          <p className="text-gray-700 mb-4 leading-relaxed">
            {t('home:whoWeAre.whatWeDo.approach')}
          </p>
          <p className="text-gray-700 mb-6 leading-relaxed">
            {t('home:whoWeAre.whatWeDo.coverage')}
          </p>

          {/* Trust Badges */}
          <div className="flex flex-wrap gap-4 mb-6">
            <div className="flex items-center gap-2 bg-primary-50 px-4 py-2 rounded-lg">
              <svg className="w-5 h-5 text-primary-600" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              <span className="text-sm font-semibold text-primary-900">SEAI Registered</span>
            </div>
            <div className="flex items-center gap-2 bg-accent-50 px-4 py-2 rounded-lg">
              <svg className="w-5 h-5 text-accent-600" fill="currentColor" viewBox="0 0 20 20">
                <path d="M9 2a1 1 0 000 2h2a1 1 0 100-2H9z" />
                <path fillRule="evenodd" d="M4 5a2 2 0 012-2 3 3 0 003 3h2a3 3 0 003-3 2 2 0 012 2v11a2 2 0 01-2 2H6a2 2 0 01-2-2V5zm9.707 5.707a1 1 0 00-1.414-1.414L9 12.586l-1.293-1.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              <span className="text-sm font-semibold text-accent-900">Fully Insured</span>
            </div>
          </div>

          <button
            onClick={onGetQuote}
            className="px-8 py-4 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-all duration-200 font-semibold shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
          >
            {t('common:cta.getQuote')}
          </button>
        </div>
      </div>
    </YourCompanySection>
  );
};

// Variant B: Credentials Wall with Stats
export const WhoWeAreVariantB: React.FC<WhoWeAreProps> = ({ onGetQuote }) => {
  const { t } = useTranslation(['home', 'common']);

  return (
    <YourCompanySection id="who-we-are" background="light" height="auto">
      <div className="text-center mb-12">
        <p className="text-primary-600 font-semibold text-sm uppercase tracking-wide mb-2">
          {t('home:whoWeAre.heading')}
        </p>
        <h2 className="text-4xl font-bold text-gray-900 mb-4 font-display">
          {t('home:whoWeAre.title')}
        </h2>
        <p className="text-xl text-gray-600 max-w-3xl mx-auto">
          {t('home:whoWeAre.whatWeDo.description')}
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
        <div className="bg-gradient-to-br from-primary-50 to-primary-100 rounded-xl p-6 text-center">
          <div className="text-4xl font-bold text-primary-700 mb-2">{t('home:hero.stats.installations')}</div>
          <div className="text-sm font-semibold text-gray-700">{t('home:hero.stats.installationsLabel')}</div>
        </div>
        <div className="bg-gradient-to-br from-secondary-50 to-secondary-100 rounded-xl p-6 text-center">
          <div className="text-4xl font-bold text-secondary-700 mb-2">{t('home:hero.stats.experience')}</div>
          <div className="text-sm font-semibold text-gray-700">{t('home:hero.stats.experienceLabel')}</div>
        </div>
        <div className="bg-gradient-to-br from-accent-50 to-accent-100 rounded-xl p-6 text-center">
          <div className="text-4xl font-bold text-accent-700 mb-2">{t('home:hero.stats.warranty')}</div>
          <div className="text-sm font-semibold text-gray-700">{t('home:hero.stats.warrantyLabel')}</div>
        </div>
        <div className="bg-gradient-to-br from-primary-100 to-accent-100 rounded-xl p-6 text-center">
          <div className="text-4xl font-bold text-primary-700 mb-2">4.9★</div>
          <div className="text-sm font-semibold text-gray-700">Customer Rating</div>
        </div>
      </div>

      {/* Certifications & Badges */}
      <div className="bg-white rounded-2xl shadow-xl p-8 lg:p-12 mb-8">
        <h3 className="text-2xl font-bold text-gray-900 mb-6 text-center font-display">
          Certifications & Partnerships
        </h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {/* Placeholder for certification logos */}
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="aspect-square rounded-lg bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center border-2 border-gray-300 hover:border-primary-400 transition-colors">
              <div className="text-center p-4">
                <svg className="w-12 h-12 mx-auto mb-2 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
                </svg>
                <p className="text-xs text-gray-500 font-semibold">Logo {i}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Content & CTA */}
      <div className="text-center max-w-3xl mx-auto">
        <p className="text-gray-700 mb-4 leading-relaxed">
          {t('home:whoWeAre.whatWeDo.approach')}
        </p>
        <p className="text-gray-700 mb-8 leading-relaxed">
          {t('home:whoWeAre.whatWeDo.coverage')}
        </p>
        <button
          onClick={onGetQuote}
          className="px-8 py-4 bg-secondary-600 text-white rounded-lg hover:bg-secondary-700 transition-all duration-200 font-semibold shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
        >
          {t('common:cta.getQuote')}
        </button>
      </div>
    </YourCompanySection>
  );
};

// Variant C: Video Introduction
export const WhoWeAreVariantC: React.FC<WhoWeAreProps> = ({ onGetQuote }) => {
  const { t } = useTranslation(['home', 'common']);

  return (
    <YourCompanySection id="who-we-are" background="light" height="auto">
      <div className="text-center mb-8">
        <p className="text-primary-600 font-semibold text-sm uppercase tracking-wide mb-2">
          {t('home:whoWeAre.heading')}
        </p>
        <h2 className="text-4xl font-bold text-gray-900 mb-4 font-display">
          {t('home:whoWeAre.title')}
        </h2>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
          Meet the family behind YourCompany
        </p>
      </div>

      {/* Video Placeholder */}
      <div className="max-w-4xl mx-auto mb-8">
        <div className="relative aspect-video rounded-2xl bg-gradient-to-br from-primary-600 via-primary-500 to-accent-500 shadow-2xl overflow-hidden group cursor-pointer">
          <div className="absolute inset-0 bg-black/20"></div>
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-center">
              <div className="w-24 h-24 mx-auto mb-4 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center group-hover:bg-white/30 transition-colors">
                <svg className="w-12 h-12 text-white ml-1" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M8 5v14l11-7z" />
                </svg>
              </div>
              <p className="text-white font-semibold text-xl mb-2">Add Company Video Here</p>
              <p className="text-white/80 text-sm">Recommended: 1920x1080px, MP4 format</p>
            </div>
          </div>
          {/* Decorative video timeline at bottom */}
          <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/60 to-transparent">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-white/90 rounded-full flex items-center justify-center">
                <svg className="w-4 h-4 text-gray-800" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M6 4h4v16H6V4zm8 0h4v16h-4V4z" />
                </svg>
              </div>
              <div className="flex-1 h-1 bg-white/30 rounded-full">
                <div className="h-full w-1/3 bg-white rounded-full"></div>
              </div>
              <span className="text-white text-sm font-mono">2:34</span>
            </div>
          </div>
        </div>
      </div>

      {/* Content Below Video */}
      <div className="max-w-3xl mx-auto">
        <div className="bg-gradient-to-br from-primary-50 to-accent-50 rounded-2xl p-8 mb-8">
          <div className="flex items-start gap-4">
            <svg className="w-12 h-12 text-primary-400 flex-shrink-0" fill="currentColor" viewBox="0 0 24 24">
              <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z" />
            </svg>
            <div>
              <p className="text-lg text-gray-700 italic leading-relaxed mb-4">
                {t('home:whoWeAre.brendanQuote')}
              </p>
              <div>
                <p className="font-semibold text-gray-900">{t('home:whoWeAre.brendanName')}</p>
                <p className="text-sm text-gray-600">{t('home:whoWeAre.brendanRole')}</p>
              </div>
            </div>
          </div>
        </div>

        <div className="text-center">
          <h3 className="text-2xl font-bold text-gray-900 mb-4 font-display">
            {t('home:whoWeAre.whatWeDo.title')}
          </h3>
          <p className="text-gray-700 mb-4 leading-relaxed">
            {t('home:whoWeAre.whatWeDo.description')}
          </p>
          <p className="text-gray-700 mb-4 leading-relaxed">
            {t('home:whoWeAre.whatWeDo.approach')}
          </p>
          <p className="text-gray-700 mb-8 leading-relaxed">
            {t('home:whoWeAre.whatWeDo.coverage')}
          </p>
          <button
            onClick={onGetQuote}
            className="px-8 py-4 bg-accent-600 text-white rounded-lg hover:bg-accent-700 transition-all duration-200 font-semibold shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
          >
            {t('common:cta.getQuote')}
          </button>
        </div>
      </div>
    </YourCompanySection>
  );
};

