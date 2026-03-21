"use client";

import { useState, useCallback } from "react";

const STORAGE_KEYS = {
  useBouncy: "dice-useBouncy",
  soundEnabled: "dice-sound",
  hapticEnabled: "dice-haptic",
} as const;

function getStored<T>(key: string, defaultValue: T): T {
  if (typeof window === "undefined") return defaultValue;
  try {
    const v = localStorage.getItem(key);
    if (v === null) return defaultValue;
    return JSON.parse(v) as T;
  } catch {
    return defaultValue;
  }
}

function setStored(key: string, value: boolean) {
  if (typeof window === "undefined") return;
  localStorage.setItem(key, JSON.stringify(value));
}

export function useSettings() {
  const [useBouncy, setUseBouncyState] = useState(() =>
    getStored(STORAGE_KEYS.useBouncy, false)
  );
  const [soundEnabled, setSoundEnabledState] = useState(() =>
    getStored(STORAGE_KEYS.soundEnabled, true)
  );
  const [hapticEnabled, setHapticEnabledState] = useState(() =>
    getStored(STORAGE_KEYS.hapticEnabled, true)
  );

  const setUseBouncy = useCallback((v: boolean) => {
    setUseBouncyState(v);
    setStored(STORAGE_KEYS.useBouncy, v);
  }, []);

  const setSoundEnabled = useCallback((v: boolean) => {
    setSoundEnabledState(v);
    setStored(STORAGE_KEYS.soundEnabled, v);
  }, []);

  const setHapticEnabled = useCallback((v: boolean) => {
    setHapticEnabledState(v);
    setStored(STORAGE_KEYS.hapticEnabled, v);
  }, []);

  return {
    useBouncy,
    setUseBouncy,
    soundEnabled,
    setSoundEnabled,
    hapticEnabled,
    setHapticEnabled,
  };
}
