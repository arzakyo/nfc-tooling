import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useColorScheme as useDeviceColorScheme } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { darkTheme, lightTheme, ThemeColors } from './colors';

export type ThemePreference = 'system' | 'light' | 'dark';

interface ThemeContextType {
  preference: ThemePreference;
  activeTheme: 'light' | 'dark';
  colors: ThemeColors;
  setPreference: (pref: ThemePreference) => Promise<void>;
}

const THEME_STORAGE_KEY = '@nfc_tooling_theme_preference_v1';

const ThemeContext = createContext<ThemeContextType>({
  preference: 'system',
  activeTheme: 'dark',
  colors: darkTheme,
  setPreference: async () => {},
});

export const ThemeProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const deviceColorScheme = useDeviceColorScheme();
  const [preference, setPreferenceState] = useState<ThemePreference>('system');
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    AsyncStorage.getItem(THEME_STORAGE_KEY).then((saved) => {
      if (saved === 'light' || saved === 'dark' || saved === 'system') {
        setPreferenceState(saved);
      }
      setIsLoaded(true);
    }).catch(() => {
      setIsLoaded(true);
    });
  }, []);

  const setPreference = async (pref: ThemePreference) => {
    setPreferenceState(pref);
    try {
      await AsyncStorage.setItem(THEME_STORAGE_KEY, pref);
    } catch (e) {
      console.warn('Failed to save theme preference', e);
    }
  };

  const activeTheme: 'light' | 'dark' =
    preference === 'system'
      ? deviceColorScheme === 'light'
        ? 'light'
        : 'dark'
      : preference;

  const colors = activeTheme === 'light' ? lightTheme : darkTheme;

  return (
    <ThemeContext.Provider value={{ preference, activeTheme, colors, setPreference }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => useContext(ThemeContext);
