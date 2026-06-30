// App default font: Outfit. To change the app font, see the swap procedure in
// constants/fonts.ts (3 surfaces: this useFonts import, tailwind.config.js, and
// constants/fonts.ts). The other 9 families in @expo-google-fonts are installed.
import {
  Outfit_400Regular,
  Outfit_500Medium,
  Outfit_600SemiBold,
  Outfit_700Bold,
  Outfit_800ExtraBold,
  Outfit_900Black,
} from '@expo-google-fonts/outfit';
import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useFonts } from 'expo-font';
import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { useEffect } from 'react';
import 'react-native-reanimated';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import '../global.css';

import { useColorScheme } from '@/components/useColorScheme';
import { FONT_SEMIBOLD } from '@/constants/fonts';

// The app ships LIGHT-only. The dark-mode code is kept intact (the DarkTheme
// branch below and the `dark:` utility classes in screens) but stays inert:
// tailwind.config.js uses `darkMode: 'class'`, so `dark:` utilities only apply
// when a dark class is manually toggled (we never do), and
// components/useColorScheme.ts is pinned to 'light' for the navigation theme.
// To re-enable system dark mode: set darkMode back to 'media' in
// tailwind.config.js and restore the system value in components/useColorScheme.ts.

export {
  // Catch any errors thrown by the Layout component.
  ErrorBoundary
} from 'expo-router';

export const unstable_settings = {
  initialRouteName: '(tabs)',
};

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [loaded, error] = useFonts({
    Outfit_400Regular,
    Outfit_500Medium,
    Outfit_600SemiBold,
    Outfit_700Bold,
    Outfit_800ExtraBold,
    Outfit_900Black,
  });

  // Expo Router uses Error Boundaries to catch errors in the navigation tree.
  useEffect(() => {
    if (error) throw error;
  }, [error]);

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded]);

  if (!loaded) {
    return null;
  }

  return <RootLayoutNav />;
}

const queryClient = new QueryClient();

function RootLayoutNav() {
  // Always 'light' (pinned above); kept so the dark branch stays in the code.
  const scheme = useColorScheme();

  return (
    <SafeAreaProvider>
      <QueryClientProvider client={queryClient}>
        <ThemeProvider value={scheme === 'dark' ? DarkTheme : DefaultTheme}>
          <Stack screenOptions={{ headerTitleStyle: { fontFamily: FONT_SEMIBOLD } }}>
            <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
          </Stack>
        </ThemeProvider>
      </QueryClientProvider>
    </SafeAreaProvider>
  );
}
