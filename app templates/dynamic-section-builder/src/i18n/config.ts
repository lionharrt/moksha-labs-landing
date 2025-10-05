import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

// Import translation files
import commonEN from '../locales/en/common.json';
import homeEN from '../locales/en/home.json';
import navigationEN from '../locales/en/navigation.json';
import servicesEN from '../locales/en/services.json';
import formsEN from '../locales/en/forms.json';

// Translation resources
const resources = {
  en: {
    common: commonEN,
    home: homeEN,
    navigation: navigationEN,
    services: servicesEN,
    forms: formsEN,
  },
};

// Get default language from environment or use 'en'
const defaultLanguage = import.meta.env.VITE_DEFAULT_LANGUAGE || 'en';

i18n
  .use(initReactI18next)
  .init({
    resources,
    lng: defaultLanguage,
    fallbackLng: 'en',
    defaultNS: 'common',
    ns: ['common', 'home', 'navigation', 'services', 'forms'],
    
    interpolation: {
      escapeValue: false, // React already does escaping
    },

    react: {
      useSuspense: true,
    },

    // Development options
    debug: import.meta.env.DEV,
  });

export default i18n;

