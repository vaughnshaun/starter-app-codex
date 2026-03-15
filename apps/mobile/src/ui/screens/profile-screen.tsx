import { useRouter } from 'expo-router';
import { useCallback, useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Pressable,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';

import { useAuth } from '../../application/auth/auth-provider';
import { getCurrentProfile } from '../../application/profile/get-current-profile';
import { createLoadingProfileState } from '../../application/profile/profile-state';
import type { ProfileState } from '../../application/profile/profile-state';
import { appRoutes } from '../../domain/navigation/routes';
import { getSupabaseProfileRepository } from '../../infrastructure/supabase/supabase-profile-repository';
import { AuthNav } from '../navigation/auth-nav';

export function ProfileScreen() {
  const auth = useAuth();
  const router = useRouter();
  const [state, setState] = useState<ProfileState>(createLoadingProfileState());

  const loadProfile = useCallback(async () => {
    if (!auth.session) {
      return;
    }

    setState(createLoadingProfileState());

    try {
      const profile = await getCurrentProfile(
        getSupabaseProfileRepository(),
        auth.session,
      );
      setState({
        profile,
        status: 'ready',
      });
    } catch (error) {
      setState({
        message:
          error instanceof Error
            ? error.message
            : 'Profile data could not be loaded.',
        status: 'error',
      });
    }
  }, [auth.session]);

  useEffect(() => {
    void loadProfile();
  }, [loadProfile]);

  if (!auth.session) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.loader}>
          <ActivityIndicator color="#204060" />
        </View>
      </SafeAreaView>
    );
  }

  async function handleSignOut() {
    const result = await auth.signOut();

    if (result.ok) {
      router.replace(appRoutes.login);
    }
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.card}>
          <AuthNav onSignOut={handleSignOut} />

          <View style={styles.hero}>
            <Text style={styles.eyebrow}>Profile</Text>
            <Text style={styles.title}>Review the current account details.</Text>
            <Text style={styles.subtitle}>
              Optional fields render as placeholders instead of breaking the
              page.
            </Text>
          </View>

          {state.status === 'loading' ? (
            <View style={styles.loaderRow}>
              <ActivityIndicator color="#204060" />
              <Text style={styles.supporting}>Loading profile...</Text>
            </View>
          ) : null}

          {state.status === 'error' ? (
            <View style={styles.errorPanel}>
              <Text style={styles.errorText}>{state.message}</Text>
              <Pressable
                accessibilityRole="button"
                onPress={() => {
                  void loadProfile();
                }}
                style={({ pressed }) => [styles.retryButton, pressed && styles.pressed]}
              >
                <Text style={styles.retryText}>Retry profile load</Text>
              </Pressable>
            </View>
          ) : null}

          {state.status === 'ready' ? (
            <View style={styles.details}>
              <View style={styles.row}>
                <Text style={styles.label}>Email</Text>
                <Text style={styles.value}>{state.profile.email}</Text>
              </View>
              <View style={styles.row}>
                <Text style={styles.label}>Display name</Text>
                <Text style={styles.value}>
                  {state.profile.displayName ?? 'Not set yet'}
                </Text>
              </View>
              <View style={styles.row}>
                <Text style={styles.label}>Avatar URL</Text>
                <Text style={styles.value}>
                  {state.profile.avatarUrl ?? 'No avatar configured'}
                </Text>
              </View>
            </View>
          ) : null}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#fff7ec',
    borderRadius: 30,
    gap: 24,
    maxWidth: 720,
    padding: 28,
    width: '100%',
  },
  content: {
    alignItems: 'center',
    flexGrow: 1,
    padding: 24,
  },
  details: {
    gap: 16,
  },
  errorPanel: {
    backgroundColor: '#fff0eb',
    borderRadius: 20,
    gap: 12,
    padding: 18,
  },
  errorText: {
    color: '#8c312a',
    fontSize: 15,
    lineHeight: 22,
  },
  eyebrow: {
    color: '#b2532d',
    fontSize: 13,
    fontWeight: '700',
    letterSpacing: 1,
    textTransform: 'uppercase',
  },
  hero: {
    gap: 12,
  },
  label: {
    color: '#81503c',
    fontSize: 13,
    fontWeight: '700',
    textTransform: 'uppercase',
  },
  loader: {
    alignItems: 'center',
    flex: 1,
    justifyContent: 'center',
  },
  loaderRow: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: 12,
  },
  pressed: {
    opacity: 0.85,
  },
  retryButton: {
    alignSelf: 'flex-start',
    backgroundColor: '#204060',
    borderRadius: 16,
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  retryText: {
    color: '#f7f6ef',
    fontWeight: '700',
  },
  row: {
    backgroundColor: '#f4ead9',
    borderRadius: 20,
    gap: 6,
    padding: 18,
  },
  safeArea: {
    backgroundColor: '#f0e3cf',
    flex: 1,
  },
  subtitle: {
    color: '#5f4936',
    fontSize: 15,
    lineHeight: 22,
  },
  supporting: {
    color: '#5f4936',
    fontSize: 14,
  },
  title: {
    color: '#2d1e15',
    fontSize: 34,
    fontWeight: '800',
    lineHeight: 40,
  },
  value: {
    color: '#28160f',
    fontSize: 16,
    lineHeight: 22,
  },
});
