import React from 'react';
import { View, Text } from 'react-native';
import { BADGES } from '../achievements';
import styles from '../styles';

export default function BadgeGrid({ unlocked }: { unlocked: string[] }) {
  return (
    <View style={styles.badgeGrid}>
      {BADGES.map(b => {
        const on = unlocked.includes(b.id);
        return (
          <Text
            key={b.id}
            style={[styles.badgeIcon, !on && styles.badgeLocked]}
          >
            {b.icon}
          </Text>
        );
      })}
    </View>
  );
}
