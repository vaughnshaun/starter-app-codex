import { Link } from 'expo-router';
import {
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';

import { appRoutes } from '../../domain/navigation/routes';

interface AuthLinkErrorScreenProps {
  email?: string | null;
  isResending?: boolean;
  message: string;
  onResend: () => Promise<void>;
}

export function AuthLinkErrorScreen({
  email,
  isResending = false,
  message,
  onResend,
}: AuthLinkErrorScreenProps) {
  return (
    <View style={styles.container}>
      <Text style={styles.eyebrow}>Link problem</Text>
      <Text style={styles.title}>This email action could not be completed.</Text>
      <Text style={styles.message}>{message}</Text>
      {email ? (
        <Text style={styles.supporting}>
          You can resend another verification link to {email}.
        </Text>
      ) : (
        <Text style={styles.supporting}>
          Return to a safe page and request a fresh email.
        </Text>
      )}

      {email ? (
        <Pressable
          accessibilityRole="button"
          disabled={isResending}
          onPress={() => {
            void onResend();
          }}
          style={({ pressed }) => [
            styles.primaryButton,
            pressed && styles.pressed,
            isResending && styles.disabled,
          ]}
        >
          <Text style={styles.primaryButtonText}>
            {isResending ? 'Sending...' : 'Resend verification email'}
          </Text>
        </Pressable>
      ) : null}

      <Link asChild href={appRoutes.login}>
        <Pressable accessibilityRole="link" style={({ pressed }) => [styles.secondaryButton, pressed && styles.pressed]}>
          <Text style={styles.secondaryButtonText}>Back to login</Text>
        </Pressable>
      </Link>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff7f0',
    borderRadius: 28,
    gap: 14,
    maxWidth: 480,
    padding: 28,
    width: '100%',
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
  message: {
    color: '#5d352a',
    fontSize: 15,
    lineHeight: 22,
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
  supporting: {
    color: '#81503c',
    fontSize: 14,
    lineHeight: 20,
  },
  title: {
    color: '#28160f',
    fontSize: 28,
    fontWeight: '800',
  },
});

