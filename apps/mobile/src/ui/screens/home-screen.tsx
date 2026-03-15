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

import { useAuth } from '../../application/auth/auth-provider';
import { getCurrentProfile } from '../../application/profile/get-current-profile';
import { selectWelcomeLabel } from '../../application/profile/profile-selectors';
import type { ProfileView } from '../../domain/profile/profile';
import { appRoutes } from '../../domain/navigation/routes';
import { getSupabaseProfileRepository } from '../../infrastructure/supabase/supabase-profile-repository';
import { AuthNav } from '../navigation/auth-nav';

export function HomeScreen() {
  const auth = useAuth();
  const router = useRouter();
  const [profile, setProfile] = useState<ProfileView | null>(null);
  const [profileMessage, setProfileMessage] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;

    if (!auth.session) {
      return undefined;
    }

    void getCurrentProfile(getSupabaseProfileRepository(), auth.session)
      .then((nextProfile) => {
        if (isMounted) {
          setProfile(nextProfile);
        }
      })
      .catch(() => {
        if (isMounted) {
          setProfileMessage(
            'Profile details are temporarily unavailable, but navigation is still safe.',
          );
        }
      });

    return () => {
      isMounted = false;
    };
  }, [auth.session]);

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

  const welcomeLabel = selectWelcomeLabel(profile, auth.session.email);

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.card}>
          <AuthNav onSignOut={handleSignOut} />

          <View style={styles.hero}>
            <Text style={styles.eyebrow}>Home</Text>
            <Text style={styles.title}>Signed in as {welcomeLabel}</Text>
            <Text style={styles.subtitle}>
              This is the default protected destination for login and successful
              email verification callbacks.
            </Text>
          </View>

          <View style={styles.callout}>
            <Text style={styles.calloutLabel}>Current session</Text>
            <Text style={styles.calloutValue}>{auth.session.email}</Text>
          </View>

          {profileMessage ? <Text style={styles.message}>{profileMessage}</Text> : null}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  callout: {
    backgroundColor: '#f4ead9',
    borderRadius: 20,
    gap: 6,
    padding: 18,
  },
  calloutLabel: {
    color: '#81503c',
    fontSize: 13,
    fontWeight: '700',
    textTransform: 'uppercase',
  },
  calloutValue: {
    color: '#28160f',
    fontSize: 20,
    fontWeight: '700',
  },
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
  loader: {
    alignItems: 'center',
    flex: 1,
    justifyContent: 'center',
  },
  message: {
    color: '#6a2c1f',
    fontSize: 14,
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
  title: {
    color: '#2d1e15',
    fontSize: 34,
    fontWeight: '800',
    lineHeight: 40,
  },
});
