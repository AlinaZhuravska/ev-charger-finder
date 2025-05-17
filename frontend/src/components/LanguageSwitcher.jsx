// src/components/LanguageSwitcher.jsx
import React from 'react';
import { useTranslation } from 'react-i18next';

export default function LanguageSwitcher() {
  const { i18n } = useTranslation();

  const changeLanguage = (e) => {
    i18n.changeLanguage(e.target.value);
  };

  return (
    <select
      value={i18n.language}
      onChange={changeLanguage}
      className="bg-transparent text-sm text-gray-800 dark:text-white border-none outline-none appearance-none cursor-pointer"
    >
      <option className="text-black" value="en">EN</option>
      <option className="text-black" value="de">DE</option>
      <option className="text-black" value="fr">FR</option>
      <option className="text-black" value="uk">UA</option>
    </select>
  );
}


