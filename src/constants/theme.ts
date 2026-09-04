import '@/global.css';

import { Platform, type TextStyle } from 'react-native';

/**
 * Hearth. Cream and clay, one terracotta accent. Every neutral is tinted
 * toward the clay hue; there is no pure black or white anywhere. See
 * docs/brand-kit.md for the reasoning behind each token.
 */
export const Palette = {
  light: {
    canvas: '#FBF7F2',
    surface: '#FFFFFF',
    surfaceRaised: '#F3EDE6',
    hairline: '#EADFD5',
    text: '#2A2320',
    textSecondary: '#7A6E66',
    textTertiary: '#8C7F76',
    accent: '#A84E2F',
    accentSoft: '#F6E7E0',
    onAccent: '#FFF8F4',
    danger: '#FF3B30',
    scrim: 'rgba(42, 35, 32, 0.45)',
  },
  dark: {
    canvas: '#1A1614',
    surface: '#251F1B',
    surfaceRaised: '#2F2823',
    hairline: '#3A322C',
    text: '#F2EAE2',
    textSecondary: '#A3968C',
    textTertiary: '#8E8279',
    accent: '#E08A66',
    accentSoft: '#3A2A22',
    onAccent: '#1A1614',
    danger: '#FF453A',
    scrim: 'rgba(0, 0, 0, 0.55)',
  },
} as const;

export type ThemeColor = keyof typeof Palette.light;
export type Theme = { readonly [K in ThemeColor]: string };
export type Scheme = keyof typeof Palette;

export const Fonts = Platform.select({
  ios: {
    /** SF Pro */
    sans: 'system-ui',
    /** SF Pro Rounded. RN 0.86 maps this to UIFontDescriptorSystemDesignRounded. */
    rounded: 'ui-rounded',
    /** SF Mono */
    mono: 'ui-monospace',
  },
  default: {
    sans: 'normal',
    rounded: 'normal',
    mono: 'monospace',
  },
  web: {
    sans: 'var(--font-display)',
    rounded: 'var(--font-rounded)',
    mono: 'var(--font-mono)',
  },
})!;

/** HIG-aligned scale. Headings rounded, everything else SF Pro. */
export const Type = {
  largeTitle: { fontFamily: Fonts.rounded, fontSize: 34, lineHeight: 39, fontWeight: '700', letterSpacing: -0.4 },
  title: { fontFamily: Fonts.rounded, fontSize: 22, lineHeight: 26, fontWeight: '700', letterSpacing: -0.2 },
  headline: { fontFamily: Fonts.sans, fontSize: 17, lineHeight: 22, fontWeight: '600' },
  body: { fontFamily: Fonts.sans, fontSize: 17, lineHeight: 24, fontWeight: '400' },
  subhead: { fontFamily: Fonts.sans, fontSize: 15, lineHeight: 20, fontWeight: '400' },
  footnote: { fontFamily: Fonts.sans, fontSize: 13, lineHeight: 18, fontWeight: '400' },
  label: { fontFamily: Fonts.sans, fontSize: 12, lineHeight: 16, fontWeight: '600', letterSpacing: 0.6, textTransform: 'uppercase' },
  /** Insights only. Tabular figures so columns of numbers line up. */
  number: { fontFamily: Fonts.rounded, fontSize: 34, lineHeight: 39, fontWeight: '700', letterSpacing: -0.4, fontVariant: ['tabular-nums'] },
} as const satisfies Record<string, TextStyle>;

export const Spacing = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 24,
  xxl: 32,
  xxxl: 48,
} as const;

export const Radius = {
  sheet: 20,
  photo: 16,
  button: 12,
  chip: 8,
} as const;

export const Motion = {
  /** Press feedback, ms. */
  press: 120,
  pressScale: 0.97,
  /** Symbol swaps and small fades, ms. */
  fade: 200,
  /** The one designed peak: a face appearing under your post, ms. */
  peak: 250,
} as const;

export const TouchTarget = 44;
export const ScreenMargin = Spacing.lg;
