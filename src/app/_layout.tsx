import { DarkTheme, DefaultTheme, Stack, ThemeProvider } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { StatusBar } from 'expo-status-bar';
import { useEffect } from 'react';

import { ToastHost } from '@/components/toast';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { useTheme } from '@/hooks/use-theme';
import { copy } from '@/lib/copy';
import { useAllHydrated } from '@/stores/hydration';
import { useSession } from '@/stores/session';

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const scheme = useColorScheme();
  const theme = useTheme();
  const hydrated = useAllHydrated();
  const onboarded = useSession((s) => s.me.onboarded);

  useEffect(() => {
    if (hydrated) SplashScreen.hideAsync();
  }, [hydrated]);

  // Hold the splash until every store has read disk, so the onboarding guard
  // below flips exactly once instead of welcome flashing for returning users.
  if (!hydrated) return null;

  const base = scheme === 'dark' ? DarkTheme : DefaultTheme;
  const navTheme = {
    ...base,
    colors: {
      ...base.colors,
      primary: theme.accent,
      background: theme.canvas,
      card: theme.canvas,
      text: theme.text,
      border: theme.hairline,
      notification: theme.accent,
    },
  };

  return (
    <ThemeProvider value={navTheme}>
      <StatusBar style="auto" />
      <Stack
        screenOptions={{
          headerBackButtonDisplayMode: 'minimal',
          headerTintColor: theme.accent,
          headerTitleStyle: { color: theme.text },
          headerShadowVisible: false,
          contentStyle: { backgroundColor: theme.canvas },
        }}>
        <Stack.Protected guard={!!onboarded}>
          <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
          <Stack.Screen name="compose" options={{ presentation: 'modal', title: copy.compose.title }} />
          <Stack.Screen name="user/[id]" options={{ title: '' }} />
          <Stack.Screen name="post/[id]" options={{ title: copy.post.title }} />
        </Stack.Protected>
        <Stack.Protected guard={!onboarded}>
          <Stack.Screen name="welcome" options={{ headerShown: false }} />
        </Stack.Protected>
        <Stack.Screen name="rules" options={{ presentation: 'modal', title: copy.rules.title }} />
      </Stack>
      <ToastHost />
    </ThemeProvider>
  );
}
