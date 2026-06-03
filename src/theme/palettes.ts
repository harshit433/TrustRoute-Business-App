export type ColorScheme = {
  background: string;
  surface: string;
  surfaceAlt: string;
  primary: string;
  primaryDark: string;
  primaryLight: string;
  success: string;
  successLight: string;
  warning: string;
  warningLight: string;
  error: string;
  errorLight: string;
  textPrimary: string;
  textSecondary: string;
  textMuted: string;
  border: string;
  inputBackground: string;
  inputBorder: string;
  inputBorderFocus: string;
  white: string;
  black: string;
  overlay: string;
  statusBarStyle: 'light-content' | 'dark-content';
};

export const darkPalette: ColorScheme = {
  background: '#0A0B1A',
  surface: '#141528',
  surfaceAlt: '#1A1B35',
  primary: '#7C5CF6',
  primaryDark: '#5B3FD4',
  primaryLight: '#9B7FFF',
  success: '#22C55E',
  successLight: 'rgba(34, 197, 94, 0.15)',
  warning: '#F59E0B',
  warningLight: 'rgba(245, 158, 11, 0.15)',
  error: '#EF4444',
  errorLight: 'rgba(239, 68, 68, 0.15)',
  textPrimary: '#FFFFFF',
  textSecondary: '#A0AEC0',
  textMuted: '#6B7280',
  border: '#2A2D55',
  inputBackground: '#1A1B35',
  inputBorder: '#3A3D65',
  inputBorderFocus: '#7C5CF6',
  white: '#FFFFFF',
  black: '#000000',
  overlay: 'rgba(0, 0, 0, 0.55)',
  statusBarStyle: 'light-content',
};

export const lightPalette: ColorScheme = {
  background: '#F5F4F0',
  surface: '#FFFFFF',
  surfaceAlt: '#F8F7F3',
  primary: '#16A34A',
  primaryDark: '#15803D',
  primaryLight: '#22C55E',
  success: '#16A34A',
  successLight: 'rgba(22, 163, 74, 0.10)',
  warning: '#D97706',
  warningLight: 'rgba(217, 119, 6, 0.10)',
  error: '#DC2626',
  errorLight: 'rgba(220, 38, 38, 0.10)',
  textPrimary: '#111827',
  textSecondary: '#6B7280',
  textMuted: '#9CA3AF',
  border: '#ECEAE4',
  inputBackground: '#FFFFFF',
  inputBorder: '#ECEAE4',
  inputBorderFocus: '#22C55E',
  white: '#FFFFFF',
  black: '#000000',
  overlay: 'rgba(0, 0, 0, 0.35)',
  statusBarStyle: 'dark-content',
};

export function paletteForMode(mode: 'light' | 'dark'): ColorScheme {
  return mode === 'light' ? lightPalette : darkPalette;
}
