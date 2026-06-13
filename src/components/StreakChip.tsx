import React from 'react';
import { View, Text } from 'react-native';
import styles from '../styles';

export default function StreakChip({ streak }: { streak: number }) {
  return (
    <View style={styles.streakChip}>
      <Text style={styles.streakFlame}>🔥</Text>
      <Text style={styles.streakNum}>{streak}</Text>
    </View>
  );
}
