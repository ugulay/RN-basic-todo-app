import React, { useEffect, useRef } from 'react';
import { Animated, Text } from 'react-native';
import { BADGES } from '../achievements';
import styles from '../styles';
import i18n from '../i18n';

export default function UnlockToast({
  badgeId,
  onHide,
}: {
  badgeId: string | null;
  onHide: () => void;
}) {
  const anim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (!badgeId) {
      return;
    }
    Animated.timing(anim, {
      toValue: 1,
      duration: 250,
      useNativeDriver: true,
    }).start();
    const t = setTimeout(() => {
      Animated.timing(anim, {
        toValue: 0,
        duration: 250,
        useNativeDriver: true,
      }).start(({ finished }) => {
        if (finished) {
          onHide();
        }
      });
    }, 2500);
    return () => clearTimeout(t);
  }, [badgeId, anim, onHide]);

  if (!badgeId) {
    return null;
  }
  const badge = BADGES.find(b => b.id === badgeId);
  return (
    <Animated.View
      style={[
        styles.unlockToast,
        {
          opacity: anim,
          transform: [
            {
              translateY: anim.interpolate({
                inputRange: [0, 1],
                outputRange: [-20, 0],
              }),
            },
          ],
        },
      ]}
    >
      <Text style={styles.unlockToastIcon}>{badge?.icon ?? '🏅'}</Text>
      <Text style={styles.unlockToastText}>
        {i18n.t('unlocked_badge', { name: i18n.t(`badge_${badgeId}`) })}
      </Text>
    </Animated.View>
  );
}
