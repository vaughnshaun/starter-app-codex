import * as Linking from 'expo-linking';
import { useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';

import { useAuth } from '../../src/application/auth/auth-provider';
import { appRoutes } from '../../src/domain/navigation/routes';
import { AuthLinkErrorScreen } from '../../src/ui/screens/auth-link-error-screen';

export default function AuthCallbackRoute() {
  const auth = useAuth();
  const router = useRouter();
  const currentUrl = Linking.useURL();
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(true);
  const [isResending, setIsResending] = useState(false);

  useEffect(() => {
    let isMounted = true;

    async function resolveLink() {
      const url = currentUrl ?? (await Linking.getInitialURL());

      if (!url) {
        if (isMounted) {
          setErrorMessage('The auth link was missing from this session.');
          setIsProcessing(false);
        }
        return;
      }

      const result = await auth.handleEmailLink(url);

      if (!isMounted) {
        return;
      }

      if (!result.ok) {
        setErrorMessage(result.message);
        setIsProcessing(false);
        return;
      }

      router.replace(
        result.data.action === 'recovery'
          ? appRoutes.resetPassword
          : appRoutes.home,
      );
    }

    void resolveLink();

    return () => {
      isMounted = false;
    };
  }, [auth, currentUrl, router]);

  async function handleResend() {
    setIsResending(true);
    const result = await auth.resendVerification();
    setIsResending(false);

    setErrorMessage(
      result.ok
        ? 'A fresh verification email has been sent.'
        : result.message,
    );
  }

  if (isProcessing) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.loader}>
          <ActivityIndicator color="#204060" size="large" />
          <Text style={styles.loaderText}>Processing auth link...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.content}>
        <AuthLinkErrorScreen
          email={auth.pendingVerificationEmail}
          isResending={isResending}
          message={errorMessage ?? 'The auth link could not be processed.'}
          onResend={handleResend}
        />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  content: {
    alignItems: 'center',
    flexGrow: 1,
    justifyContent: 'center',
    padding: 24,
  },
  loader: {
    alignItems: 'center',
    flex: 1,
    gap: 12,
    justifyContent: 'center',
  },
  loaderText: {
    color: '#204060',
    fontSize: 15,
    fontWeight: '600',
  },
  safeArea: {
    backgroundColor: '#f0e3cf',
    flex: 1,
  },
});

