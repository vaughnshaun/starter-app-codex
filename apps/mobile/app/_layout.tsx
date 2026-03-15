import { Redirect, Stack, useSegments } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import {
  ActivityIndicator,
  SafeAreaView,
  StyleSheet,
  View,
} from 'react-native';

import { AuthProvider, useAuth } from '../src/application/auth/auth-provider';
import { publicRouteSegments } from '../src/domain/navigation/routes';

export function AppShell() {
  const { status } = useAuth();
  const [topSegment] = useSegments();
  const isAuthCallback = topSegment === 'auth';
  const isPublicRoute = topSegment ? publicRouteSegments.has(topSegment) : false;
  const isResetPassword = topSegment === 'reset-password';

  if (status === 'loading') {
    return (
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.loader}>
          <ActivityIndicator color="#204060" size="large" />
        </View>
      </SafeAreaView>
    );
  }

  if (status === 'guest' && !isPublicRoute) {
    return <Redirect href="/login" />;
  }

  if (status === 'authenticated' && isPublicRoute && !isAuthCallback) {
    return <Redirect href="/" />;
  }

  if (status === 'recovery' && !isResetPassword && !isAuthCallback) {
    return <Redirect href="/reset-password" />;
  }

  return (
    <>
      <StatusBar style="dark" />
      <Stack screenOptions={{ headerShown: false }} />
    </>
  );
}

export default function RootLayout() {
  return (
    <AuthProvider>
      <AppShell />
    </AuthProvider>
  );
}

const styles = StyleSheet.create({
  loader: {
    alignItems: 'center',
    flex: 1,
    justifyContent: 'center',
  },
  safeArea: {
    backgroundColor: '#f0e3cf',
    flex: 1,
  },
});
