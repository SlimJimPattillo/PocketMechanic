// Design system based on PRD requirements
// Color Scheme: Calming, friendly colors to reduce anxiety
// Soft blues and greens as primary colors, with muted purples and teals as accents

export const Colors = {
  // Primary - Soft Blues
  primary: '#4A90E2',
  primaryLight: '#6FA8ED',
  primaryDark: '#2E5C8F',

  // Secondary - Calming Greens
  secondary: '#5DBB63',
  secondaryLight: '#7ECB84',
  secondaryDark: '#3D9943',

  // Accents
  accent: '#8B7EC5', // Muted purple
  accentTeal: '#4DB8B8', // Muted teal

  // Semantic Colors
  success: '#5DBB63',
  warning: '#F5A623',
  error: '#E74C3C',
  info: '#4A90E2',

  // Urgency Levels (for dashboard lights and repairs)
  urgencyCritical: '#E74C3C',
  urgencyHigh: '#F5A623',
  urgencyMedium: '#F8C547',
  urgencyLow: '#5DBB63',

  // Neutrals
  background: '#FFFFFF',
  backgroundSecondary: '#F8F9FA',
  backgroundTertiary: '#E9ECEF',

  text: '#2C3E50',
  textSecondary: '#7F8C8D',
  textLight: '#95A5A6',

  border: '#DEE2E6',
  borderLight: '#E9ECEF',

  // Overlays
  overlay: 'rgba(0, 0, 0, 0.5)',
  overlayLight: 'rgba(0, 0, 0, 0.3)',
};

export const Typography = {
  // Font Sizes
  h1: 32,
  h2: 28,
  h3: 24,
  h4: 20,
  body: 16,
  bodySmall: 14,
  caption: 12,

  // Font Weights
  light: '300' as const,
  regular: '400' as const,
  medium: '500' as const,
  semibold: '600' as const,
  bold: '700' as const,

  // Line Heights
  lineHeightTight: 1.2,
  lineHeightNormal: 1.5,
  lineHeightRelaxed: 1.7,
};

export const Spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48,
};

export const BorderRadius = {
  sm: 4,
  md: 8,
  lg: 12,
  xl: 16,
  round: 999,
};

export const Shadows = {
  sm: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  md: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  lg: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 5,
  },
};

export const Layout = {
  screenPadding: Spacing.md,
  cardPadding: Spacing.md,
  sectionSpacing: Spacing.lg,
};
