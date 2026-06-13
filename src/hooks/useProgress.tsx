import { useEffect, useState, useCallback } from 'react';
import {
  storage,
  getProgress,
  getStats,
  setDailyGoal as _setGoal,
} from '../progress';
import { PROGRESS_KEY } from '../progress.types';

/** Live progress + derived stats, refreshed via the MMKV change listener. */
export const useProgress = () => {
  const [progress, setProgress] = useState(getProgress());
  const [stats, setStats] = useState(getStats());

  const refresh = useCallback(() => {
    setProgress(getProgress());
    setStats(getStats());
  }, []);

  useEffect(() => {
    const sub = storage.addOnValueChangedListener((key: string) => {
      if (key === PROGRESS_KEY) {
        refresh();
      }
    });
    return () => sub.remove();
  }, [refresh]);

  const setDailyGoal = useCallback(
    (n: number) => {
      _setGoal(n);
      refresh();
    },
    [refresh],
  );

  return { progress, stats, refresh, setDailyGoal };
};
