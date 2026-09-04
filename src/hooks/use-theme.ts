import { Palette, type Theme } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';

export function useTheme(): Theme {
  const scheme = useColorScheme();
  return scheme === 'dark' ? Palette.dark : Palette.light;
}
