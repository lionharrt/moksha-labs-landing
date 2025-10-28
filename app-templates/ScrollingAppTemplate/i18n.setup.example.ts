/**
 * i18n Setup Example
 * 
 * Copy this to your src/i18n/index.ts to set up internationalization.
 * Import it in your main entry point (src/main.tsx) before rendering the app.
 */

import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import enCommon from '../locales/en/common.json';

i18n
  .use(initReactI18next)
  .init({
    resources: {
      en: {
        common: enCommon,
      },
    },
    lng: 'en',
    fallbackLng: 'en',
    defaultNS: 'common',
    interpolation: {
      escapeValue: false,
    },
    react: {
      useSuspense: false,
    },
  });

export default i18n;
