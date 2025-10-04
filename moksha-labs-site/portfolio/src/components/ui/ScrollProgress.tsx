'use client';

import { useStore } from '@/stores/useStore';
import styles from './ScrollProgress.module.css';

export function ScrollProgress() {
  const scrollProgress = useStore((state) => state.scrollProgress);

  return (
    <div className={styles.progress}>
      <div
        className={styles.bar}
        style={{ width: `${scrollProgress * 100}%` }}
      />
    </div>
  );
}

