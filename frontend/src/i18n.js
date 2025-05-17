// src/i18n.js
import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

const resources = {
  en: {
    translation: {
      welcome: 'Welcome',
      language: 'Language',
    },
  },
  de: {
    translation: {
      welcome: 'Willkommen',
      language: 'Sprache',
    },
  },
  fr: {
    translation: {
      welcome: 'Bienvenue',
      language: 'Langue',
    },
  },
  uk: {
    translation: {
      welcome: 'Ласкаво просимо',
      language: 'Мова',
    },
  },
};

i18n
  .use(initReactI18next)
  .init({
    resources,
    lng: 'en', // Язык по умолчанию
    fallbackLng: 'en',
    interpolation: {
      escapeValue: false,
    },
  });

export default i18n;
