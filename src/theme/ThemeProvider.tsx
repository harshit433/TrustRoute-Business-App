import React, { createContext, useMemo } from 'react';
import { StyleSheet } from 'react-native';
import type { Theme as NavTheme } from '@react-navigation/native';
import { lightPalette, type ColorScheme } from './palettes';

export type ThemeContextValue = {
  colors: ColorScheme;
  resolvedMode: 'light' | 'dark';
  navigationTheme: NavTheme;
};

export const ThemeContext = createContext<ThemeContextValue | null>(null);

/** Business Scan uses the TrustRoute light palette only (matches consumer app welcome). */
export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const resolvedMode: 'light' | 'dark' = 'light';
  const colors = useMemo(() => lightPalette, []);

  const navigationTheme = useMemo<NavTheme>(
    () => ({
      dark: false,
      colors: {
        primary: colors.primary,
        background: colors.background,
        card: colors.surface,
        text: colors.textPrimary,
        border: colors.border,
        notification: colors.primary,
      },
    }),
    [colors],
  );

  const value = useMemo(
    () => ({ colors, resolvedMode, navigationTheme }),
    [colors, resolvedMode, navigationTheme],
  );

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
};

export function useTheme(): ThemeContextValue {
  const ctx = React.useContext(ThemeContext);
  if (!ctx) throw new Error('useTheme must be used within ThemeProvider');
  return ctx;
}

export function useThemedStyles<T extends StyleSheet.NamedStyles<T>>(
  factory: (colors: ColorScheme) => T,
): T {
  const { colors } = useTheme();
  return useMemo(() => factory(colors), [colors, factory]);
}
