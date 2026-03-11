/**
 * Below are the colors that are used in the app. The colors are defined in the light and dark mode.
 * Línea gráfica aplicada según mockup del FrontEnd 
 */

import { Platform } from 'react-native';

const tintColorLight = '#1e40af'; // Azul institucional
const tintColorDark = '#3b82f6';

export const Colors = {
  light: {
    text: '#1e293b',
    background: '#ffffff',

    tint: tintColorLight,

    icon: '#64748b',

    tabIconDefault: '#64748b',
    tabIconSelected: tintColorLight,

    // Colores institucionales
    primary: '#1e40af',
    primaryLight: '#3b82f6',
    primaryDark: '#1e3a8a',

    secondary: '#059669',
    secondaryLight: '#10b981',
    secondaryDark: '#047857',

    accent: '#ea580c',
    accentLight: '#f97316',

    // Estados
    success: '#10b981',
    warning: '#f59e0b',
    error: '#ef4444',

    // Neutrales
    border: '#e2e8f0',
    muted: '#f1f5f9',
    textSecondary: '#64748b',

    // Niveles (gamificación)
    levelBronze: '#ea580c',
    levelSilver: '#64748b',
    levelGold: '#f59e0b',
    levelDiamond: '#3b82f6',
  },

  dark: {
    text: '#ECEDEE',
    background: '#151718',

    tint: tintColorDark,

    icon: '#9BA1A6',

    tabIconDefault: '#9BA1A6',
    tabIconSelected: tintColorDark,

    primary: '#3b82f6',
    secondary: '#10b981',
    accent: '#f97316',

    success: '#10b981',
    warning: '#f59e0b',
    error: '#ef4444',

    border: '#2a2a2a',
  },
};

export const Fonts = Platform.select({
  ios: {
    sans: 'system-ui',
    serif: 'ui-serif',
    rounded: 'ui-rounded',
    mono: 'ui-monospace',
  },
  default: {
    sans: 'normal',
    serif: 'serif',
    rounded: 'normal',
    mono: 'monospace',
  },
  web: {
    sans: "system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif",
    serif: "Georgia, 'Times New Roman', serif",
    rounded: "'SF Pro Rounded', 'Hiragino Maru Gothic ProN', Meiryo, 'MS PGothic', sans-serif",
    mono: "SFMono-Regular, Menlo, Monaco, Consolas, 'Liberation Mono', 'Courier New', monospace",
  },
});