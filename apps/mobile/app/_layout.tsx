import { useEffect } from 'react';
import { Stack, useRouter, useSegments } from 'expo-router';
import { AuthProvider, useAuth } from '../contexts/AuthContext';
import { LanguageProvider } from '../contexts/LanguageContext';
import { SocketProvider } from '../contexts/SocketContext';
import { NotificationsProvider } from '../contexts/NotificationsContext';
import { SearchProvider } from '../contexts/SearchContext';

function RootLayoutNav() {
  const { user, loading } = useAuth();
  const segments = useSegments();
  const router = useRouter();

  useEffect(() => {
    if (loading) return;

    const inAuthGroup = segments[0] === 'auth';
    const inTabs = segments[0] === '(tabs)';
    const isWelcome = segments.length === 0 || segments[0] === 'index';

    console.log('Auth state:', { user: !!user, segments, inAuthGroup, inTabs, isWelcome });

    if (!user) {
      // Not logged in - allow welcome screen, otherwise redirect to login if trying to access protected routes
      if (inTabs) {
        console.log('User not logged in, redirecting to welcome');
        router.replace('/');
      }
    } else {
      // Logged in - redirect from welcome/auth to tabs
      if (isWelcome || inAuthGroup) {
        console.log('User logged in, redirecting to tabs');
        router.replace('/(tabs)');
      }
    }
  }, [user, loading, segments]);

  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="index" />
      <Stack.Screen name="auth/login" />
      <Stack.Screen name="auth/signup" />
      <Stack.Screen name="(tabs)" />
      <Stack.Screen name="pro/[id]" options={{ headerShown: true, title: 'Professional' }} />
      <Stack.Screen name="booking/new" options={{ headerShown: true, title: 'Book Service' }} />
      <Stack.Screen name="booking/[id]" options={{ headerShown: true, title: 'Booking Details' }} />
      <Stack.Screen name="chat/[id]" options={{ headerShown: true, title: 'Chat' }} />
      <Stack.Screen name="search" options={{ headerShown: true, title: 'Search' }} />
      <Stack.Screen name="notifications" options={{ headerShown: true, title: 'Notifications' }} />
      <Stack.Screen name="pro/dashboard" options={{ headerShown: true, title: 'Dashboard' }} />
      <Stack.Screen name="pro/services" options={{ headerShown: true, title: 'My Services' }} />
      <Stack.Screen name="pro/profile-edit" options={{ headerShown: true, title: 'Edit Profile' }} />
      <Stack.Screen name="profile/edit" options={{ headerShown: true, title: 'Edit Profile' }} />
    </Stack>
  );
}

export default function RootLayout() {
  return (
    <LanguageProvider>
      <AuthProvider>
        <SocketProvider>
          <NotificationsProvider>
            <SearchProvider>
              <RootLayoutNav />
            </SearchProvider>
          </NotificationsProvider>
        </SocketProvider>
      </AuthProvider>
    </LanguageProvider>
  );
}
