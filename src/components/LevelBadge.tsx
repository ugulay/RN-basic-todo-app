import React from 'react';
import { Text } from 'react-native';
import styles from '../styles';
import i18n from '../i18n';

export default function LevelBadge({ level }: { level: number }) {
  return <Text style={styles.levelBadge}>{i18n.t('level_short', { n: level })}</Text>;
}
