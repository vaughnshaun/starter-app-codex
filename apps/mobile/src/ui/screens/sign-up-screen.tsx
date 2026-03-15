import { Link } from 'expo-router';
import { useState } from 'react';
import {
  Pressable,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';

import { useAuth } from '../../application/auth/auth-provider';
import type { SignUpInput } from '../../application/auth/sign-up';
import type { ValidationErrors } from '../../application/auth/validation-error';
import { appRoutes } from '../../domain/navigation/routes';
import { SignUpForm } from '../components/sign-up-form';

export function SignUpScreen() {
  const auth = useAuth();
  const [fieldErrors, setFieldErrors] = useState<ValidationErrors | undefined>();
  const [isResending, setIsResending] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState<string | undefined>();

  async function handleSubmit(input: SignUpInput) {
    setFieldErrors(undefined);
    setMessage(undefined);
    setIsSubmitting(true);

    const result = await auth.signUp(input);
    setIsSubmitting(false);

    if (!result.ok) {
      setFieldErrors(result.fieldErrors);
      setMessage(result.message);
    }
  }

  async function handleResend() {
    setMessage(undefined);
    setIsResending(true);
    const result = await auth.resendVerification();
    setIsResending(false);

    setMessage(
      result.ok
        ? 'A fresh verification email has been sent.'
        : result.message,
    );
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.card}>
          <Text style={styles.eyebrow}>Create account</Text>
          <Text style={styles.title}>Set up your account and verify your email.</Text>
          <Text style={styles.subtitle}>
            New accounts stay blocked from protected screens until the email link
            is completed.
          </Text>

          {auth.pendingVerificationEmail ? (
            <View style={styles.pendingState}>
              <Text style={styles.pendingTitle}>Check your inbox</Text>
              <Text style={styles.pendingText}>
                We sent a verification link to {auth.pendingVerificationEmail}. Open
                it on this device to finish setup and land on home.
              </Text>

              <Pressable
                accessibilityRole="button"
                disabled={isResending}
                onPress={() => {
                  void handleResend();
                }}
                style={({ pressed }) => [
                  styles.primaryButton,
                  pressed && styles.pressed,
                  isResending && styles.disabled,
                ]}
              >
                <Text style={styles.primaryButtonText}>
                  {isResending ? 'Sending...' : 'Resend verification'}
                </Text>
              </Pressable>

              {message ? <Text style={styles.infoText}>{message}</Text> : null}

              <Link asChild href={appRoutes.login}>
                <Pressable
                  accessibilityRole="link"
                  style={({ pressed }) => [styles.secondaryButton, pressed && styles.pressed]}
                >
                  <Text style={styles.secondaryButtonText}>Back to login</Text>
                </Pressable>
              </Link>
            </View>
          ) : (
            <>
              <SignUpForm
                fieldErrors={fieldErrors}
                isSubmitting={isSubmitting}
                message={message}
                onSubmit={handleSubmit}
              />

              <View style={styles.footer}>
                <Text style={styles.footerText}>Already verified?</Text>
                <Link href={appRoutes.login} style={styles.footerLink}>
                  Sign in
                </Link>
              </View>
            </>
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#fff7ec',
    borderRadius: 30,
    gap: 14,
    maxWidth: 520,
    padding: 28,
    width: '100%',
  },
  content: {
    alignItems: 'center',
    flexGrow: 1,
    justifyContent: 'center',
    padding: 24,
  },
  disabled: {
    opacity: 0.7,
  },
  eyebrow: {
    color: '#b2532d',
    fontSize: 13,
    fontWeight: '700',
    letterSpacing: 1,
    textTransform: 'uppercase',
  },
  footer: {
    flexDirection: 'row',
    gap: 8,
    justifyContent: 'center',
    marginTop: 8,
  },
  footerLink: {
    color: '#204060',
    fontWeight: '700',
  },
  footerText: {
    color: '#4f4334',
  },
  infoText: {
    color: '#204060',
  },
  pendingState: {
    gap: 12,
  },
  pendingText: {
    color: '#5f4936',
    fontSize: 15,
    lineHeight: 22,
  },
  pendingTitle: {
    color: '#2d1e15',
    fontSize: 24,
    fontWeight: '700',
  },
  pressed: {
    opacity: 0.85,
  },
  primaryButton: {
    backgroundColor: '#204060',
    borderRadius: 16,
    paddingHorizontal: 18,
    paddingVertical: 14,
  },
  primaryButtonText: {
    color: '#f7f6ef',
    fontSize: 16,
    fontWeight: '700',
    textAlign: 'center',
  },
  safeArea: {
    backgroundColor: '#f0e3cf',
    flex: 1,
  },
  secondaryButton: {
    alignItems: 'center',
    borderColor: '#d0bea5',
    borderRadius: 16,
    borderWidth: 1,
    paddingHorizontal: 18,
    paddingVertical: 14,
  },
  secondaryButtonText: {
    color: '#5d352a',
    fontSize: 16,
    fontWeight: '700',
  },
  subtitle: {
    color: '#5f4936',
    fontSize: 15,
    lineHeight: 22,
    marginBottom: 8,
  },
  title: {
    color: '#2d1e15',
    fontSize: 30,
    fontWeight: '800',
    lineHeight: 36,
  },
});
