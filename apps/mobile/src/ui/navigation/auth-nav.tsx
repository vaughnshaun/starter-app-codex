import { usePathname } from 'expo-router';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { appRoutes } from '../../domain/navigation/routes';
import { NavLink } from '../components/nav-link';

interface AuthNavProps {
  onSignOut: () => Promise<void>;
}

const items = [
  {
    href: appRoutes.home,
    label: 'Home',
  },
  {
    href: appRoutes.profile,
    label: 'Profile',
  },
] as const;

export function AuthNav({ onSignOut }: AuthNavProps) {
  const pathname = usePathname();

  return (
    <View style={styles.nav}>
      <View style={styles.links}>
        {items.map((item) => (
          <NavLink active={pathname === item.href} item={item} key={item.href} />
        ))}
      </View>

      <Pressable
        accessibilityRole="button"
        onPress={() => {
          void onSignOut();
        }}
        style={({ pressed }) => [styles.signOutButton, pressed && styles.pressed]}
      >
        <Text style={styles.signOutText}>Sign out</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  links: {
    flexDirection: 'row',
    gap: 10,
  },
  nav: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
  },
  pressed: {
    opacity: 0.85,
  },
  signOutButton: {
    backgroundColor: '#efe3cf',
    borderRadius: 999,
    paddingHorizontal: 14,
    paddingVertical: 10,
  },
  signOutText: {
    color: '#6a2c1f',
    fontWeight: '700',
  },
});

