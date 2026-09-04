import { StyleSheet, Text, type TextProps } from 'react-native';

import { Type, type ThemeColor } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';

export type TextVariant = keyof typeof Type;

export interface ThemedTextProps extends TextProps {
  variant?: TextVariant;
  color?: ThemeColor;
}

export function ThemedText({ style, variant = 'body', color = 'text', ...rest }: ThemedTextProps) {
  const theme = useTheme();
  return <Text style={[styles[variant], { color: theme[color] }, style]} {...rest} />;
}

const styles = StyleSheet.create(Type);
