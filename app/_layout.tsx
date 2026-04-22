import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { Stack, useRouter, useSegments } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useEffect, useState } from 'react';
import 'react-native-reanimated';

import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { apiService } from '../services/api.service';
import { loadAuthData } from '../services/authService';

export const unstable_settings = {
  initialRouteName: 'login',
};

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const segments = useSegments();
  const router = useRouter();
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    // Inicializar los datos de AsyncStorage apenas la app cargue (Evita deslogueos aparentes en refresh Web)
    loadAuthData().catch(console.error).finally(() => {
      setIsReady(true);
    });
  }, []);

  useEffect(() => {
    // Simple authentication check placeholder
    // In a real app, you'd check a secure store or global state
    const inAuthGroup = segments[0] === 'login';

    // If the user is not logged in and not in the login screen, redirect to login
    // This is a basic implementation; a more robust one would use a proper AuthProvider
    /*
    if (!apiService.getToken() && !inAuthGroup) {
      router.replace('/login');
    } else if (apiService.getToken() && inAuthGroup) {
      router.replace('/(tabs)');
    }
    */
  }, [segments, isReady]);

  if (!isReady) return null;

  const navigationTheme =
    colorScheme === 'dark'
      ? {
          ...DarkTheme,
          colors: {
            ...DarkTheme.colors,
            primary: Colors.dark.primary,
            background: Colors.dark.background,
            text: Colors.dark.text,
          },
        }
      : {
          ...DefaultTheme,
          colors: {
            ...DefaultTheme.colors,
            primary: Colors.light.primary,
            background: Colors.light.background,
            text: Colors.light.text,
          },
        };

  return (
    <ThemeProvider value={navigationTheme}>
      <Stack>
        <Stack.Screen name="login" options={{ headerShown: false }} />
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen name="modal" options={{ presentation: 'modal', title: 'Modal' }} />
      </Stack>
      <StatusBar style="auto" />
    </ThemeProvider>
  );
}