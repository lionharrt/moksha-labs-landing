'use client';

import { useEffect, useRef } from 'react';
import { useStore } from '@/stores/useStore';
import styles from './CustomCursor.module.css';

export function CustomCursor() {
  const cursorRef = useRef<HTMLDivElement>(null);
  const cursorType = useStore((state) => state.cursorType);
  const selectedCursor = useStore((state) => state.selectedCursor);
  
  useEffect(() => {
    const cursor = cursorRef.current;
    if (!cursor) return;

    const moveCursor = (e: MouseEvent) => {
      cursor.style.left = `${e.clientX}px`;
      cursor.style.top = `${e.clientY}px`;
    };

    window.addEventListener('mousemove', moveCursor);
    document.body.classList.add('custom-cursor-active');

    return () => {
      window.removeEventListener('mousemove', moveCursor);
      document.body.classList.remove('custom-cursor-active');
    };
  }, []);

  const activeCursor = selectedCursor || cursorType;

  return (
    <div
      ref={cursorRef}
      className={`${styles.cursor} ${styles[activeCursor]}`}
      data-cursor-type={activeCursor}
    />
  );
}

