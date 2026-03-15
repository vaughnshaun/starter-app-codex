import { Link } from 'expo-router';
import { useState } from 'react';
import {
  Pressable,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';

import { useAuth } from '../../application/auth/auth-provider';
import type { ValidationErrors } from '../../application/auth/validation-error';
import { appRoutes } from '../../domain/navigation/routes';

export function ForgotPasswordScreen() {
  const auth = useAuth();
  const [email, setEmail] = useState('');
  const [fieldErrors, setFieldErrors] = useState<ValidationErrors | undefined>();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState<string | undefined>();
  const [submitted, setSubmitted] = useState(false);

  async function handleSubmit() {
    setFieldErrors(undefined);
    setMessage(undefined);
    setIsSubmitting(true);

    const result = await auth.requestPasswordReset({ email });
    setIsSubmitting(false);

    if (!result.ok) {
      setFieldErrors(result.fieldErrors);
      setMessage(result.message);
      return;
    }

    setSubmitted(true);
    setMessage(
      'If that account exists, password reset instructions are on the way.',
    );
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.card}>
          <Text style={styles.eyebrow}>Password recovery</Text>
          <Text style={styles.title}>Request a reset email.</Text>
          <Text style={styles.subtitle}>
            This flow always responds neutrally so the app never exposes whether
            an account exists.
          </Text>

          <Text style={styles.label}>Email</Text>
          <TextInput
            accessibilityLabel="Email"
            autoCapitalize="none"
            autoCorrect={false}
            keyboardType="email-address"
            onChangeText={setEmail}
            placeholder="you@example.com"
            style={styles.input}
            textContentType="emailAddress"
            value={email}
          />

          {fieldErrors?.email ? <Text style={styles.error}>{fieldErrors.email}</Text> : null}
          {message ? (
            <Text style={submitted ? styles.info : styles.error}>{message}</Text>
          ) : null}

          <Pressable
            accessibilityRole="button"
            disabled={isSubmitting}
            onPress={() => {
              void handleSubmit();
            }}
            style={({ pressed }) => [
              styles.primaryButton,
              pressed && styles.pressed,
              isSubmitting && styles.disabled,
            ]}
          >
            <Text style={styles.primaryButtonText}>
              {isSubmitting ? 'Sending...' : 'Send reset email'}
            </Text>
          </Pressable>

          <Link href={appRoutes.login} style={styles.inlineLink}>
            Back to login
          </Link>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#fff7ec',
    borderRadius: 30,
    gap: 12,
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
  error: {
    color: '#a01c2f',
    fontSize: 14,
  },
  eyebrow: {
    color: '#b2532d',
    fontSize: 13,
    fontWeight: '700',
    letterSpacing: 1,
    textTransform: 'uppercase',
  },
  info: {
    color: '#204060',
    fontSize: 14,
  },
  inlineLink: {
    color: '#204060',
    fontWeight: '700',
    marginTop: 6,
  },
  input: {
    backgroundColor: '#fffef8',
    borderColor: '#d9c9ae',
    borderRadius: 14,
    borderWidth: 1,
    paddingHorizontal: 14,
    paddingVertical: 14,
  },
  label: {
    color: '#3f3127',
    fontSize: 14,
    fontWeight: '600',
    marginTop: 6,
  },
  pressed: {
    opacity: 0.85,
  },
  primaryButton: {
    backgroundColor: '#204060',
    borderRadius: 16,
    marginTop: 6,
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
