"use client";

import { useState, useCallback } from "react";

const STORAGE_KEYS = {
  useBouncy: "dice-useBouncy",
  soundEnabled: "dice-sound",
  hapticEnabled: "dice-haptic",
  advantageDisadvantageMode: "dice-advantageDisadvantage",
  higherLowerGameMode: "dice-higherLowerGame",
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
  const [advantageDisadvantageMode, setAdvantageDisadvantageModeState] =
    useState(() => getStored(STORAGE_KEYS.advantageDisadvantageMode, true));
  const [higherLowerGameMode, setHigherLowerGameModeState] = useState(() =>
    getStored(STORAGE_KEYS.higherLowerGameMode, false)
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

  const setAdvantageDisadvantageMode = useCallback((v: boolean) => {
    setAdvantageDisadvantageModeState(v);
    setStored(STORAGE_KEYS.advantageDisadvantageMode, v);
  }, []);

  const setHigherLowerGameMode = useCallback((v: boolean) => {
    setHigherLowerGameModeState(v);
    setStored(STORAGE_KEYS.higherLowerGameMode, v);
  }, []);

  return {
    useBouncy,
    setUseBouncy,
    soundEnabled,
    setSoundEnabled,
    hapticEnabled,
    setHapticEnabled,
    advantageDisadvantageMode,
    setAdvantageDisadvantageMode,
    higherLowerGameMode,
    setHigherLowerGameMode,
  };
}
