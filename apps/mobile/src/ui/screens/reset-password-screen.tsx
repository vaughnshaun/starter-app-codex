import { Link, useRouter } from 'expo-router';
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

export function ResetPasswordScreen() {
  const auth = useAuth();
  const router = useRouter();
  const [confirmPassword, setConfirmPassword] = useState('');
  const [fieldErrors, setFieldErrors] = useState<ValidationErrors | undefined>();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState<string | undefined>();
  const [password, setPassword] = useState('');

  if (auth.status !== 'recovery') {
    return (
      <SafeAreaView style={styles.safeArea}>
        <ScrollView contentContainerStyle={styles.content}>
          <View style={styles.card}>
            <Text style={styles.eyebrow}>Recovery required</Text>
            <Text style={styles.title}>Open the reset link from your email.</Text>
            <Text style={styles.subtitle}>
              This page only works when the app is holding a valid password
              recovery session.
            </Text>
            <Link href={appRoutes.forgotPassword} style={styles.inlineLink}>
              Request another reset email
            </Link>
          </View>
        </ScrollView>
      </SafeAreaView>
    );
  }

  async function handleSubmit() {
    setFieldErrors(undefined);
    setMessage(undefined);
    setIsSubmitting(true);

    const result = await auth.completePasswordReset({
      confirmPassword,
      password,
    });
    setIsSubmitting(false);

    if (!result.ok) {
      setFieldErrors(result.fieldErrors);
      setMessage(result.message);
      return;
    }

    router.replace({
      params: { message: 'Password updated. Sign in with your new password.' },
      pathname: appRoutes.login,
    });
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.card}>
          <Text style={styles.eyebrow}>Choose a new password</Text>
          <Text style={styles.title}>Finish the recovery flow.</Text>
          <Text style={styles.subtitle}>
            Recovery sessions stay limited to this route until the password is
            replaced and the session is cleared.
          </Text>

          <Text style={styles.label}>New password</Text>
          <TextInput
            accessibilityLabel="New password"
            autoCapitalize="none"
            onChangeText={setPassword}
            placeholder="At least 8 characters"
            secureTextEntry
            style={styles.input}
            textContentType="newPassword"
            value={password}
          />
          {fieldErrors?.password ? (
            <Text style={styles.error}>{fieldErrors.password}</Text>
          ) : null}

          <Text style={styles.label}>Confirm password</Text>
          <TextInput
            accessibilityLabel="Confirm password"
            autoCapitalize="none"
            onChangeText={setConfirmPassword}
            placeholder="Repeat your password"
            secureTextEntry
            style={styles.input}
            textContentType="newPassword"
            value={confirmPassword}
          />
          {fieldErrors?.confirmPassword ? (
            <Text style={styles.error}>{fieldErrors.confirmPassword}</Text>
          ) : null}

          {message ? <Text style={styles.error}>{message}</Text> : null}

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
              {isSubmitting ? 'Updating...' : 'Update password'}
            </Text>
          </Pressable>
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

