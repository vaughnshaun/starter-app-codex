import { Link } from 'expo-router';
import { Pressable, StyleSheet, Text } from 'react-native';

import type { NavItem } from '../../domain/navigation/nav-item';

interface NavLinkProps {
  active?: boolean;
  item: NavItem;
}

export function NavLink({ active = false, item }: NavLinkProps) {
  return (
    <Link asChild href={item.href}>
      <Pressable
        accessibilityRole="link"
        style={({ pressed }) => [
          styles.link,
          active && styles.activeLink,
          pressed && styles.pressedLink,
        ]}
      >
        <Text style={[styles.label, active && styles.activeLabel]}>{item.label}</Text>
      </Pressable>
    </Link>
  );
}

const styles = StyleSheet.create({
  activeLabel: {
    color: '#f7f6ef',
  },
  activeLink: {
    backgroundColor: '#204060',
  },
  label: {
    color: '#204060',
    fontSize: 14,
    fontWeight: '700',
  },
  link: {
    borderColor: '#204060',
    borderRadius: 999,
    borderWidth: 1,
    paddingHorizontal: 14,
    paddingVertical: 10,
  },
  pressedLink: {
    opacity: 0.85,
  },
});

