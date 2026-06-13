import React from 'react';
import { View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { useProgress } from '../hooks/useProgress';
import { BADGES } from '../achievements';
import BadgeGrid from '../components/BadgeGrid';
import styles, { Colors } from '../styles';
import i18n from '../i18n';

export default function StatsScreen() {
  const navigation = useNavigation<any>();
  const { stats, setDailyGoal } = useProgress();
  const maxBar = Math.max(1, ...stats.last7.map(d => d.completed));

  return (
    <SafeAreaView style={styles.statsContainer} edges={['top']}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.statsHeaderRow}>
          <TouchableOpacity
            style={styles.statsBackBtn}
            onPress={() => navigation.goBack()}
            accessibilityRole="button"
            accessibilityLabel={i18n.t('cancel')}
          >
            <Icon name="arrow-back" size={24} color={Colors.onBackground} />
          </TouchableOpacity>
          <Text style={styles.statsTitle}>{i18n.t('stats_title')}</Text>
        </View>

        <View style={styles.statRow}>
          <View style={styles.statCard}>
            <Text style={styles.statEmoji}>🔥</Text>
            <Text style={styles.statBig}>{stats.currentStreak}</Text>
            <Text style={styles.statSub}>
              {i18n.t('streak')} · {i18n.t('best_streak', { n: stats.bestStreak })}
            </Text>
          </View>
          <View style={styles.statCard}>
            <View style={styles.levelTopRow}>
              <Text style={styles.levelBadge}>
                {i18n.t('level_short', { n: stats.level })}
              </Text>
            </View>
            <Text style={styles.xpText}>
              {stats.xpIntoLevel}
              <Text style={styles.xpSub}>/{stats.xpSpan} XP</Text>
            </Text>
            <View style={styles.xpBarTrack}>
              <View
                style={[styles.xpBarFill, { width: `${stats.levelProgress * 100}%` }]}
              />
            </View>
          </View>
        </View>

        <View style={styles.sectionCard}>
          <Text style={styles.sectionTitle}>{i18n.t('last_7_days')}</Text>
          <View style={styles.chartRow}>
            {stats.last7.map(d => {
              const h = d.completed > 0 ? Math.max(6, (d.completed / maxBar) * 64) : 4;
              return (
                <View key={d.key} style={styles.chartBarWrap}>
                  <Text style={styles.chartCount}>
                    {d.completed > 0 ? d.completed : ''}
                  </Text>
                  <View
                    style={[
                      styles.chartBar,
                      { height: h },
                      d.completed === 0 && styles.chartBarEmpty,
                      d.isToday && styles.chartBarToday,
                    ]}
                  />
                  <Text
                    style={[styles.chartLabel, d.isToday && { color: Colors.secondary }]}
                  >
                    {i18n.t(`dow_${d.dow}`)}
                  </Text>
                </View>
              );
            })}
          </View>
        </View>

        <View style={styles.sectionCard}>
          <Text style={styles.sectionTitle}>
            {i18n.t('badges')} ·{' '}
            {i18n.t('badges_count', {
              n: stats.unlockedBadges.length,
              total: BADGES.length,
            })}
          </Text>
          <BadgeGrid unlocked={stats.unlockedBadges} />
        </View>

        <View style={[styles.sectionCard, styles.goalStepperRow]}>
          <Text style={styles.goalStepperLabel}>{i18n.t('daily_goal')}</Text>
          <View style={styles.stepperControls}>
            <TouchableOpacity
              style={styles.stepBtn}
              onPress={() => setDailyGoal(stats.dailyGoal - 1)}
              accessibilityRole="button"
              accessibilityLabel="-"
            >
              <Text style={styles.stepBtnText}>−</Text>
            </TouchableOpacity>
            <Text style={styles.goalValue}>{stats.dailyGoal}</Text>
            <TouchableOpacity
              style={styles.stepBtn}
              onPress={() => setDailyGoal(stats.dailyGoal + 1)}
              accessibilityRole="button"
              accessibilityLabel="+"
            >
              <Text style={styles.stepBtnText}>+</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
