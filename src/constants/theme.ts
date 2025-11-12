// Design system - Modern, vibrant color scheme
// Vibrant purples, greens, and cyans with gradient support

export const Colors = {
  // Primary - Vibrant Indigo (85% intensity)
  primary: '#7477F3',
  primaryLight: '#9395F6',
  primaryDark: '#4F46E5',

  // Secondary - Vibrant Mint Green (85% intensity)
  secondary: '#2BC794',
  secondaryLight: '#4DD4A8',
  secondaryDark: '#0F9D70',

  // Accents
  accent: '#A78BFA', // Vibrant purple
  accentTeal: '#1FC0DB', // Vibrant cyan (85% intensity)
  accentCyan: '#06B6D4', // Bright cyan
  accentMint: '#2DD4BF', // Bright teal/mint

  // Gradient Colors (for card backgrounds)
  gradientPurpleStart: '#7477F3',
  gradientPurpleEnd: '#A78BFA',
  gradientGreenStart: '#2BC794',
  gradientGreenEnd: '#2DD4BF',
  gradientCyanStart: '#1FC0DB',
  gradientCyanEnd: '#06B6D4',
  gradientIndigoStart: '#4F46E5',
  gradientIndigoEnd: '#7477F3',

  // Semantic Colors
  success: '#2BC794',
  warning: '#F59E0B',
  error: '#EF4444',
  info: '#7477F3',

  // Urgency Levels (for dashboard lights and repairs)
  urgencyCritical: '#EF4444',
  urgencyHigh: '#F59E0B',
  urgencyMedium: '#FBBF24',
  urgencyLow: '#2BC794',

  // Neutrals
  background: '#FFFFFF',
  backgroundSecondary: '#F9FAFB',
  backgroundTertiary: '#F3F4F6',

  text: '#1F2937',
  textSecondary: '#6B7280',
  textLight: '#9CA3AF',

  border: '#E5E7EB',
  borderLight: '#F3F4F6',

  // Decorative background elements
  decorativePurple: 'rgba(116, 119, 243, 0.1)',
  decorativeGreen: 'rgba(43, 199, 148, 0.1)',
  decorativeCyan: 'rgba(31, 192, 219, 0.1)',

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
  sm: 8,
  md: 12,
  lg: 20,
  xl: 24,
  xxl: 32,
  round: 999,
};

export const Shadows = {
  sm: {
    shadowColor: '#7477F3',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 3,
    elevation: 2,
  },
  md: {
    shadowColor: '#7477F3',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 4,
  },
  lg: {
    shadowColor: '#4F46E5',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.2,
    shadowRadius: 16,
    elevation: 8,
  },
  // Colored shadow variants
  purple: {
    shadowColor: '#7477F3',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.18,
    shadowRadius: 12,
    elevation: 6,
  },
  green: {
    shadowColor: '#2BC794',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.18,
    shadowRadius: 12,
    elevation: 6,
  },
  cyan: {
    shadowColor: '#1FC0DB',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.18,
    shadowRadius: 12,
    elevation: 6,
  },
};

export const Layout = {
  screenPadding: Spacing.md,
  cardPadding: Spacing.md,
  sectionSpacing: Spacing.lg,
};
