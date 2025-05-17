// src/components/Welcome.jsx
import React from 'react';
import { useTranslation } from 'react-i18next';

export default function Welcome() {
  const { t } = useTranslation();

  return (
    <div>
      <h1>{t('welcome')}</h1>
      <p>{t('language')}: {t('language')}</p>
    </div>
  );
}
