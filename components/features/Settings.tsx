"use client";

import { ThemeToggle } from "../ui/ThemeToggle";

type SettingRowProps = {
  label: string;
  description?: string;
  children: React.ReactNode;
};

function SettingRow({ label, description, children }: SettingRowProps) {
  return (
    <div className="flex items-center justify-between gap-4 py-4 first:pt-0 last:pb-0 border-b border-zinc-200 dark:border-zinc-700 last:border-0">
      <div>
        <p className="font-medium text-zinc-900 dark:text-zinc-100">{label}</p>
        {description && (
          <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-0.5">
            {description}
          </p>
        )}
      </div>
      {children}
    </div>
  );
}

type ToggleProps = {
  checked: boolean;
  onChange: (checked: boolean) => void;
};

function Toggle({ checked, onChange }: ToggleProps) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      onClick={() => onChange(!checked)}
      className={`relative inline-flex h-7 w-12 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 ${
        checked ? "bg-blue-500" : "bg-zinc-300 dark:bg-zinc-600"
      }`}
    >
      <span
        className={`pointer-events-none inline-block h-6 w-6 transform rounded-full bg-white shadow ring-0 transition-transform ${
          checked ? "translate-x-5" : "translate-x-1"
        }`}
      />
    </button>
  );
}

type SettingsProps = {
  useBouncy: boolean;
  setUseBouncy: (v: boolean) => void;
  soundEnabled: boolean;
  setSoundEnabled: (v: boolean) => void;
  hapticEnabled: boolean;
  setHapticEnabled: (v: boolean) => void;
};

export function Settings({
  useBouncy,
  setUseBouncy,
  soundEnabled,
  setSoundEnabled,
  hapticEnabled,
  setHapticEnabled,
}: SettingsProps) {
  return (
    <div className="flex flex-col divide-y divide-zinc-200 dark:divide-zinc-700 -mx-1">
      <SettingRow
        label="Animation"
        description="Shake or bouncy when rolling"
      >
        <div className="flex gap-2">
          <button
            type="button"
            onClick={() => setUseBouncy(false)}
            className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
              !useBouncy
                ? "bg-blue-500 text-white"
                : "bg-zinc-100 text-zinc-600 hover:bg-zinc-200 dark:bg-zinc-800 dark:text-zinc-400 dark:hover:bg-zinc-700"
            }`}
          >
            Shake
          </button>
          <button
            type="button"
            onClick={() => setUseBouncy(true)}
            className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
              useBouncy
                ? "bg-blue-500 text-white"
                : "bg-zinc-100 text-zinc-600 hover:bg-zinc-200 dark:bg-zinc-800 dark:text-zinc-400 dark:hover:bg-zinc-700"
            }`}
          >
            Bouncy
          </button>
        </div>
      </SettingRow>

      <SettingRow label="Sound" description="Play sound when dice land">
        <Toggle checked={soundEnabled} onChange={setSoundEnabled} />
      </SettingRow>

      <SettingRow
        label="Haptic feedback"
        description="Vibrate on roll (mobile)"
      >
        <Toggle checked={hapticEnabled} onChange={setHapticEnabled} />
      </SettingRow>

      <SettingRow label="Theme" description="Light or dark mode">
        <ThemeToggle />
      </SettingRow>
    </div>
  );
}
