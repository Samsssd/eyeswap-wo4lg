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
import { ClerkProvider } from '@clerk/expo';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useFonts } from 'expo-font';
import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { StatusBar } from 'expo-status-bar';
import { useEffect } from 'react';
import 'react-native-reanimated';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import '../global.css';

import { useColorScheme } from '@/components/useColorScheme';
import { FONT_SEMIBOLD } from '@/constants/fonts';
import { tokenCache } from '@/lib/clerk/tokenCache';

export {
  // Catch any errors thrown by the Layout component.
  ErrorBoundary
} from 'expo-router';

export const unstable_settings = {
  initialRouteName: '(tabs)',
};

SplashScreen.preventAutoHideAsync();

const queryClient = new QueryClient();

export default function RootLayout() {
  const [loaded, error] = useFonts({
    Outfit_400Regular,
    Outfit_500Medium,
    Outfit_600SemiBold,
    Outfit_700Bold,
    Outfit_800ExtraBold,
    Outfit_900Black,
  });

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

function RootLayoutNav() {
  // Always 'light' (app ships light-only — see tailwind.config.js darkMode).
  const scheme = useColorScheme();
  const clerkKey = process.env.EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY;

  const tree = (
    <SafeAreaProvider>
      <QueryClientProvider client={queryClient}>
        <ThemeProvider value={scheme === 'dark' ? DarkTheme : DefaultTheme}>
          <StatusBar style="dark" />
          <Stack
            screenOptions={{
              headerShown: false,
              headerTitleStyle: { fontFamily: FONT_SEMIBOLD },
              contentStyle: { backgroundColor: '#F7F6F3' },
            }}>
            <Stack.Screen name="(tabs)" />
            <Stack.Screen name="(auth)" />
            <Stack.Screen name="product" />
            <Stack.Screen name="conversation" />
            <Stack.Screen name="merci" />
            <Stack.Screen name="annule" />
          </Stack>
        </ThemeProvider>
      </QueryClientProvider>
    </SafeAreaProvider>
  );

  // Wrap in ClerkProvider when a publishable key is available. If the key is
  // absent (e.g. during a prerender without env), render without auth so the
  // export doesn't crash — individual route error boundaries handle the rest.
  if (!clerkKey) {
    return tree;
  }

  return (
    <ClerkProvider publishableKey={clerkKey} tokenCache={tokenCache}>
      {tree}
    </ClerkProvider>
  );
}
