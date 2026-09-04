import { View, type ViewProps } from 'react-native';

import type { ThemeColor } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';

export interface ThemedViewProps extends ViewProps {
  color?: ThemeColor;
}

export function ThemedView({ style, color = 'canvas', ...rest }: ThemedViewProps) {
  const theme = useTheme();
  return <View style={[{ backgroundColor: theme[color] }, style]} {...rest} />;
}
