import React, { createContext, useContext, useState, ReactNode } from 'react';
import { lightColors, darkColors } from '../theme/colors';

type ThemeContextType = {
  isDark: boolean;
  toggleDarkMode: (value: boolean) => void;
  colors: typeof lightColors;
};

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [isDark, setIsDark] = useState(false);

  const toggleDarkMode = (value: boolean) => setIsDark(value);

  return (
    <ThemeContext.Provider value={{ isDark, toggleDarkMode, colors: isDark ? darkColors : lightColors }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error('useTheme debe usarse dentro de ThemeProvider');
  return ctx;
}
