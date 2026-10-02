import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Localization from 'expo-localization';
import { en } from './translations/en';
import { id } from './translations/id';

export type SupportedLanguage = 'en' | 'id';

export const SUPPORTED_LANGUAGES: { code: SupportedLanguage; label: string; nativeLabel: string }[] = [
  { code: 'en', label: 'English', nativeLabel: 'English' },
  { code: 'id', label: 'Indonesian', nativeLabel: 'Bahasa Indonesia' },
];

const LANGUAGE_STORAGE_KEY = '@nfc_tooling_language_preference_v1';

export type Translations = typeof en;

const translationsMap: Record<SupportedLanguage, Translations> = {
  en,
  id,
};

interface I18nContextType {
  language: SupportedLanguage;
  setLanguage: (lang: SupportedLanguage) => Promise<void>;
  t: Translations;
}

const I18nContext = createContext<I18nContextType>({
  language: 'en',
  setLanguage: async () => {},
  t: en,
});

/**
 * Detect the best matching default language based on user's device locales
 */
export function getSystemDefaultLanguage(): SupportedLanguage {
  try {
    const locales = Localization.getLocales();
    if (locales && locales.length > 0) {
      for (const loc of locales) {
        const langCode = loc.languageCode?.toLowerCase();
        if (langCode === 'id' || langCode === 'in') {
          return 'id';
        }
      }
    }
  } catch (e) {
    console.warn('Failed to detect system locale', e);
  }
  return 'en';
}

export const I18nProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [language, setLanguageState] = useState<SupportedLanguage>('en');

  useEffect(() => {
    AsyncStorage.getItem(LANGUAGE_STORAGE_KEY).then((saved) => {
      if (saved === 'en' || saved === 'id') {
        setLanguageState(saved);
      } else {
        const detected = getSystemDefaultLanguage();
        setLanguageState(detected);
      }
    }).catch(() => {
      setLanguageState(getSystemDefaultLanguage());
    });
  }, []);

  const setLanguage = async (lang: SupportedLanguage) => {
    setLanguageState(lang);
    try {
      await AsyncStorage.setItem(LANGUAGE_STORAGE_KEY, lang);
    } catch (e) {
      console.warn('Failed to save language preference', e);
    }
  };

  const t = translationsMap[language] || en;

  return (
    <I18nContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </I18nContext.Provider>
  );
};

export const useI18n = () => useContext(I18nContext);
