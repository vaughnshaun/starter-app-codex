import { useState } from 'react';
import {
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';

import type { SignUpInput } from '../../application/auth/sign-up';
import type { ValidationErrors } from '../../application/auth/validation-error';

interface SignUpFormProps {
  fieldErrors?: ValidationErrors;
  isSubmitting?: boolean;
  message?: string;
  onSubmit: (input: SignUpInput) => Promise<void>;
}

export function SignUpForm({
  fieldErrors,
  isSubmitting = false,
  message,
  onSubmit,
}: SignUpFormProps) {
  const [confirmPassword, setConfirmPassword] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  return (
    <View style={styles.form}>
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
          void onSubmit({
            confirmPassword,
            email,
            password,
          });
        }}
        style={({ pressed }) => [
          styles.button,
          pressed && styles.buttonPressed,
          isSubmitting && styles.buttonDisabled,
        ]}
      >
        <Text style={styles.buttonText}>
          {isSubmitting ? 'Creating account...' : 'Create account'}
        </Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  button: {
    backgroundColor: '#204060',
    borderRadius: 16,
    paddingHorizontal: 18,
    paddingVertical: 14,
  },
  buttonDisabled: {
    opacity: 0.7,
  },
  buttonPressed: {
    opacity: 0.85,
  },
  buttonText: {
    color: '#f7f6ef',
    fontSize: 16,
    fontWeight: '700',
    textAlign: 'center',
  },
  error: {
    color: '#a01c2f',
    fontSize: 14,
    marginTop: 6,
  },
  form: {
    gap: 8,
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
    marginTop: 4,
  },
});
