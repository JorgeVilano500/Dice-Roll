"use client";
import { RiFileHistoryLine, RiSettings4Line } from "react-icons/ri";



import { useState, useRef } from "react";
import { RollHistory, DiceCube3D, D20Die, Modal, Settings } from "@/components";
import { useSettings } from "@/hooks/useSettings";
import { RollEntry } from "../types/RollTypes";

function DiceRollingComponent() {
  const [diceSides, setDiceSides] = useState<number>(6);
  const [diceCount, setDiceCount] = useState<number>(1);
  const [result, setResult] = useState<number | null>(null);
  const [history, setHistory] = useState<RollEntry[]>([]);
  const [currentRolls, setCurrentRolls] = useState<number[]>([6]);
  const [isRolling, setIsRolling] = useState<boolean>(false);
  const [isHistoryOpen, setIsHistoryOpen] = useState<boolean>(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState<boolean>(false);

  const {
    useBouncy,
    setUseBouncy,
    soundEnabled,
    setSoundEnabled,
    hapticEnabled,
    setHapticEnabled,
  } = useSettings();
  const audioContextRef = useRef<AudioContext | null>(null);

  const playRollSound = () => {
    if (!soundEnabled || typeof window === "undefined") return;
    try {
      if (!audioContextRef.current) audioContextRef.current = new AudioContext();
      const ctx = audioContextRef.current;
      if (ctx.state === "suspended") ctx.resume();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.frequency.value = 120;
      osc.type = "sine";
      gain.gain.setValueAtTime(0.15, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.08);
      osc.start(ctx.currentTime);
      osc.stop(ctx.currentTime + 0.08);
    } catch {
      // Ignore audio errors (e.g. autoplay blocked)
    }
  };

  const triggerHaptic = () => {
    if (!hapticEnabled || typeof navigator === "undefined" || !navigator.vibrate) return;
    navigator.vibrate(30);
  };

  const handleCountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const target = Math.max(1, Number(e.target.value) || 1);
    setDiceCount(target);
    setCurrentRolls((prev) => {
      if (prev.length === target) return prev;
      if (prev.length < target) {
        return [
          ...prev,
          ...Array.from({ length: target - prev.length }, () => 1),
        ];
      }
      return prev.slice(0, target);
    });
  };

  const rollDice = () => {
    if(isRolling) return;

    setIsRolling(true)

    // shake with random faces for first couple animations
    const start = Date.now();
    const duration = 1000; 

    const interval = setInterval(() => {
      const now = Date.now();
      if(now - start >= duration) {
        clearInterval(interval);

        // Final Real Roll
        const rolls = Array.from(
          {length: diceCount},
          () => Math.floor(Math.random() * diceSides) + 1
        )
        const sum = rolls.reduce((a, b) => a + b, 0)
        
        setCurrentRolls(rolls);
        setResult(sum);
        playRollSound();
        triggerHaptic();

        const entry: RollEntry = {
          id: crypto.randomUUID(),
          at: Date.now(), 
          sides: diceSides, 
          rolls, 
          sum
        };
        setHistory(prev => [entry, ...prev].slice(0, 8))
        setIsRolling(false);


      } else {
        setCurrentRolls(
          Array.from(
            {length: diceCount}, 
            () => Math.floor(Math.random() * diceSides) + 1
          )
        )
      }

    }, 80)

  };

  return (
    <div className="flex min-h-0 w-full flex-1 flex-col bg-zinc-100 dark:bg-zinc-950 dark:text-zinc-100">
      {/* Icons row */}
      <div className="flex shrink-0 justify-end gap-4 p-4">
        <button className="cursor-pointer" onClick={() => setIsHistoryOpen(true)}>
          <RiFileHistoryLine size={25} />
        </button>
        <button className="cursor-pointer" onClick={() => setIsSettingsOpen(true)}>
          <RiSettings4Line size={25} />
        </button>
      </div>

      {/* Dice — centered in middle, grows to fill space */}
      <div className="flex min-h-0 flex-1 flex-col items-center justify-center px-4">
        <div className="flex flex-row flex-wrap items-center justify-center gap-6 dice-container">
          {currentRolls.map((roll, index) =>
          diceSides === 6 && roll >= 1 && roll <= 6 ? (
            <div
              key={index}
              className={isRolling ? (useBouncy ? "dice-bounce" : "dice-shake") : ""}
              style={isRolling ? { animationDelay: `${index * 0.08}s` } : undefined}
            >
              <DiceCube3D value={roll as 1 | 2 | 3 | 4 | 5 | 6} />
            </div>
          ) : diceSides > 6 ? (
            <div
              key={index}
              className={isRolling ? (useBouncy ? "dice-bounce" : "dice-shake") : ""}
              style={isRolling ? { animationDelay: `${index * 0.08}s` } : undefined}
            >
              <D20Die value={roll} />
            </div>
          ) : (
            <div
              key={index}
              className={`flex h-16 w-16 items-center justify-center rounded-xl border border-zinc-300 bg-white text-xl font-semibold shadow-md dark:border-zinc-600 dark:bg-zinc-900 ${isRolling ? (useBouncy ? "dice-bounce" : "dice-shake") : ""}`}
              style={isRolling ? { animationDelay: `${index * 0.08}s` } : undefined}
            >
              {roll}
            </div>
          )
        )}
        </div>
        {result !== null && (
          <p className="mt-4 text-lg font-semibold text-zinc-600 dark:text-zinc-300">
            Total: {result}
          </p>
        )}
      </div>

      {/* Controls — pinned near bottom */}
      <div className="shrink-0 flex flex-col items-center gap-3 border-t border-zinc-200 bg-zinc-100 p-4 pb-[max(1.5rem,env(safe-area-inset-bottom))] dark:border-zinc-800 dark:bg-zinc-950">
        <div className="flex w-full max-w-xs flex-row justify-center gap-6">
          <label className="flex flex-col items-center gap-1.5">
            <span className="text-sm font-medium text-zinc-600 dark:text-zinc-400">Sides</span>
            <select
              value={diceSides}
              onChange={(e) => setDiceSides(Number(e.currentTarget.value))}
              className="rounded-lg border border-zinc-300 bg-white px-3 py-2 dark:border-zinc-600 dark:bg-zinc-900"
            >
              <option value={4}>d4</option>
              <option value={6}>d6</option>
              <option value={8}>d8</option>
              <option value={10}>d10</option>
              <option value={12}>d12</option>
              <option value={20}>d20</option>
              <option value={100}>d100</option>
            </select>
          </label>
          <label className="flex flex-col items-center gap-1.5">
            <span className="text-sm font-medium text-zinc-600 dark:text-zinc-400">Count</span>
          <input
            type="number"
            min={1}
            max={50}
            value={diceCount}
            onChange={handleCountChange}
              className="w-20 rounded-lg border border-zinc-300 bg-white px-3 py-2 dark:border-zinc-600 dark:bg-zinc-900"
            />
          </label>
        </div>
        <button
          disabled={isRolling}
          className="w-full cursor-pointer disabled:cursor-not-allowed max-w-xs rounded-full bg-blue-500 px-4 py-3 font-semibold text-white disabled:opacity-50"
          onClick={rollDice}
        >
          {isRolling ? "Rolling..." : "Roll Dice"}
        </button>
      </div>

      <Modal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        title="Settings"
      >
        <Settings
          useBouncy={useBouncy}
          setUseBouncy={setUseBouncy}
          soundEnabled={soundEnabled}
          setSoundEnabled={setSoundEnabled}
          hapticEnabled={hapticEnabled}
          setHapticEnabled={setHapticEnabled}
        />
      </Modal>

      <Modal
        isOpen={isHistoryOpen}
        onClose={() => setIsHistoryOpen(false)}
        title="History"
      >
        {
          history.length > 0 ? (
            <RollHistory history={history} />
          ) : (
            <div>
              <p>Nothing to show</p>
              </div>
          )
        }
      </Modal>

    </div>
  );
}

export default DiceRollingComponent;