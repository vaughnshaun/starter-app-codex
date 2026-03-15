import { Link, useLocalSearchParams, useRouter } from 'expo-router';
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

export function LoginScreen() {
  const auth = useAuth();
  const params = useLocalSearchParams<{ message?: string }>();
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [fieldErrors, setFieldErrors] = useState<ValidationErrors | undefined>();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState<string | undefined>(params.message);
  const [password, setPassword] = useState('');

  async function handleSubmit() {
    setFieldErrors(undefined);
    setMessage(undefined);
    setIsSubmitting(true);
    const result = await auth.signIn({
      email,
      password,
    });
    setIsSubmitting(false);

    if (!result.ok) {
      setFieldErrors(result.fieldErrors);
      setMessage(result.message);
      return;
    }

    router.replace(appRoutes.home);
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.card}>
          <Text style={styles.eyebrow}>Welcome back</Text>
          <Text style={styles.title}>Sign in to the authenticated shell.</Text>
          <Text style={styles.subtitle}>
            Verified users land on home immediately. Unverified accounts stay on
            this screen until the email link is completed.
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

          <Text style={styles.label}>Password</Text>
          <TextInput
            accessibilityLabel="Password"
            autoCapitalize="none"
            onChangeText={setPassword}
            placeholder="Your password"
            secureTextEntry
            style={styles.input}
            textContentType="password"
            value={password}
          />
          {fieldErrors?.password ? (
            <Text style={styles.error}>{fieldErrors.password}</Text>
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
              {isSubmitting ? 'Signing in...' : 'Sign in'}
            </Text>
          </Pressable>

          <View style={styles.linkRow}>
            <Link href={appRoutes.forgotPassword} style={styles.inlineLink}>
              Forgot password
            </Link>
            <Text style={styles.linkDivider}>•</Text>
            <Link href={appRoutes.signUp} style={styles.inlineLink}>
              Create account
            </Link>
          </View>
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
  linkDivider: {
    color: '#8a7159',
  },
  linkRow: {
    flexDirection: 'row',
    gap: 10,
    justifyContent: 'center',
    marginTop: 8,
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

