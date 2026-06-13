import React from 'react';
import { View, Text } from 'react-native';
import styles from '../styles';

export default function DailyGoalRing({
  done,
  goal,
}: {
  done: number;
  goal: number;
}) {
  const met = goal > 0 && done >= goal;
  const pct = Math.min(1, goal > 0 ? done / goal : 0);
  return (
    <View style={styles.goalRingWrap}>
      <View style={[styles.goalRing, met && styles.goalRingMet]}>
        <Text style={styles.goalRingText}>
          {done}/{goal}
        </Text>
      </View>
      <View style={styles.goalRingTrack}>
        <View style={[styles.goalRingFill, { width: `${pct * 100}%` }]} />
      </View>
    </View>
  );
}
