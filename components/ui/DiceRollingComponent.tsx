"use client";
import { RiFileHistoryLine, RiSettings4Line } from "react-icons/ri";



import { useState, useRef, useEffect } from "react";
import { RollHistory, DiceCube3D, D20Die, Modal, Settings } from "@/components";
import { useSettings } from "@/hooks/useSettings";
import { RollEntry } from "../types/RollTypes";

function DiceRollingComponent() {
  const [diceSides, setDiceSides] = useState<number>(6);
  const [diceCount, setDiceCount] = useState<number>(1);
  const [countInputValue, setCountInputValue] = useState<string>("1");
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
    advantageDisadvantageMode,
    setAdvantageDisadvantageMode,
    higherLowerGameMode,
    setHigherLowerGameMode,
  } = useSettings();
  const [isAdvantage, setIsAdvantage] = useState<boolean>(true);
  const [chosenIndex, setChosenIndex] = useState<number | null>(null);
  // Higher/Lower game state
  const [hlPoints, setHlPoints] = useState<number>(5);
  const [hlCurrentNumber, setHlCurrentNumber] = useState<number | null>(null);
  const [hlGameOver, setHlGameOver] = useState<boolean>(false);
  const [hlLastResult, setHlLastResult] = useState<"correct" | "wrong" | "tie" | null>(null);
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

  const syncCountToDice = (target: number) => {
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

  const handleCountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const raw = e.target.value.replace(/\D/g, "");
    setCountInputValue(raw);
    if (raw !== "") {
      const num = parseInt(raw, 10);
      if (!isNaN(num) && num >= 1 && num <= 50) {
        syncCountToDice(num);
      }
    }
  };

  const handleCountBlur = () => {
    const num = countInputValue === "" ? 1 : parseInt(countInputValue, 10);
    const target = Math.min(50, Math.max(1, isNaN(num) ? 1 : num));
    setCountInputValue(String(target));
    syncCountToDice(target);
  };

  useEffect(() => {
    if (advantageDisadvantageMode && !higherLowerGameMode && currentRolls.length !== 2) {
      syncCountToDice(2);
      setCountInputValue("2");
      setDiceCount(2);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps -- sync dice count when A/D mode is on at load
  }, [advantageDisadvantageMode, higherLowerGameMode]);

  useEffect(() => {
    if (higherLowerGameMode) {
      setHlPoints(5);
      setHlCurrentNumber(null);
      setHlGameOver(false);
      setHlLastResult(null);
      setCurrentRolls([1]);
    }
  }, [higherLowerGameMode]);

  const handleAdvantageDisadvantageModeChange = (v: boolean) => {
    setAdvantageDisadvantageMode(v);
    if (v) {
      setDiceCount(2);
      setCountInputValue("2");
      syncCountToDice(2);
    }
  };

  const rollDice = () => {
    if (isRolling) return;

    setIsRolling(true);
    setChosenIndex(null);

    const start = Date.now();
    const duration = 1000;
    const count = advantageDisadvantageMode ? 2 : diceCount;

    const interval = setInterval(() => {
      const now = Date.now();
      if (now - start >= duration) {
        clearInterval(interval);

        const rolls = Array.from(
          { length: count },
          () => Math.floor(Math.random() * diceSides) + 1
        );

        let finalResult: number;
        let chosen: number | null = null;
        if (advantageDisadvantageMode && rolls.length === 2) {
          chosen = isAdvantage
            ? (rolls[0] >= rolls[1] ? 0 : 1)
            : (rolls[0] <= rolls[1] ? 0 : 1);
          finalResult = rolls[chosen];
        } else {
          finalResult = rolls.reduce((a, b) => a + b, 0);
        }

        setCurrentRolls(rolls);
        setResult(finalResult);
        setChosenIndex(chosen);
        playRollSound();
        triggerHaptic();

        const entry: RollEntry = {
          id: crypto.randomUUID(),
          at: Date.now(),
          sides: diceSides,
          rolls,
          sum: finalResult,
        };
        setHistory((prev) => [entry, ...prev].slice(0, 8));
        setIsRolling(false);
      } else {
        setCurrentRolls(
          Array.from(
            { length: count },
            () => Math.floor(Math.random() * diceSides) + 1
          )
        );
      }
    }, 80);
  };

  const hlRollToStart = () => {
    if (isRolling || hlGameOver) return;
    setIsRolling(true);
    setHlLastResult(null);
    const start = Date.now();
    const duration = 1000;
    const interval = setInterval(() => {
      const now = Date.now();
      if (now - start >= duration) {
        clearInterval(interval);
        const roll = Math.floor(Math.random() * diceSides) + 1;
        setCurrentRolls([roll]);
        setHlCurrentNumber(roll);
        playRollSound();
        triggerHaptic();
        setIsRolling(false);
      } else {
        setCurrentRolls([Math.floor(Math.random() * diceSides) + 1]);
      }
    }, 80);
  };

  const hlGuessAndRoll = (guess: "higher" | "lower") => {
    if (isRolling || hlGameOver || hlCurrentNumber === null) return;
    setIsRolling(true);
    setHlLastResult(null);
    const start = Date.now();
    const duration = 1000;
    const prevNumber = hlCurrentNumber;
    const interval = setInterval(() => {
      const now = Date.now();
      if (now - start >= duration) {
        clearInterval(interval);
        const newRoll = Math.floor(Math.random() * diceSides) + 1;
        setCurrentRolls([newRoll]);
        setHlCurrentNumber(newRoll);

        let result: "correct" | "wrong" | "tie" = "tie";
        if (newRoll > prevNumber) result = guess === "higher" ? "correct" : "wrong";
        else if (newRoll < prevNumber) result = guess === "lower" ? "correct" : "wrong";

        setHlLastResult(result);
        if (result === "correct") setHlPoints((p) => p + 1);
        else if (result === "wrong") {
          const newPoints = hlPoints - 2;
          setHlPoints(newPoints);
          if (newPoints <= 0) setHlGameOver(true);
        }

        playRollSound();
        triggerHaptic();
        setIsRolling(false);
      } else {
        setCurrentRolls([Math.floor(Math.random() * diceSides) + 1]);
      }
    }, 80);
  };

  const hlRestart = () => {
    setHlPoints(5);
    setHlCurrentNumber(null);
    setHlGameOver(false);
    setHlLastResult(null);
    setCurrentRolls([1]);
  };

  const isHigherLowerMode = higherLowerGameMode;
  const isNormalOrADMode = !isHigherLowerMode;

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

      {/* Main content */}
      <div className="flex min-h-0 flex-1 flex-col items-center justify-center px-4">
        {isHigherLowerMode ? (
          /* Higher/Lower game UI */
          <div className="flex w-full max-w-sm flex-col items-center gap-6">
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium text-zinc-500 dark:text-zinc-400">Points:</span>
              <span className={`text-2xl font-bold ${hlPoints <= 1 ? "text-red-600 dark:text-red-400" : "text-zinc-900 dark:text-zinc-100"}`}>
                {hlPoints}
              </span>
            </div>
            {hlGameOver ? (
              <div className="flex flex-col items-center gap-4">
                <p className="text-xl font-semibold text-red-600 dark:text-red-400">Game Over!</p>
                <p className="text-zinc-600 dark:text-zinc-400">You ran out of points.</p>
                <button
                  type="button"
                  onClick={hlRestart}
                  className="rounded-full bg-blue-500 px-6 py-3 font-semibold text-white"
                >
                  Play Again
                </button>
              </div>
            ) : hlCurrentNumber === null ? (
              <div className="flex flex-col items-center gap-4">
                <p className="text-zinc-600 dark:text-zinc-400 my-4">Roll to get your first number</p>
                <div className="dice-container">
                  <div className={isRolling ? (useBouncy ? "dice-bounce" : "dice-shake") : ""}>
                    {diceSides === 6 && (currentRolls[0] ?? 1) >= 1 && (currentRolls[0] ?? 1) <= 6 ? (
                      <DiceCube3D value={(currentRolls[0] ?? 1) as 1 | 2 | 3 | 4 | 5 | 6} />
                    ) : diceSides > 6 ? (
                      <D20Die value={currentRolls[0] ?? 1} />
                    ) : (
                      <div className="flex h-16 w-16 items-center justify-center rounded-xl border border-zinc-300 bg-white text-xl font-semibold shadow-md dark:border-zinc-600 dark:bg-zinc-900">
                        {currentRolls[0] ?? 1}
                      </div>
                    )}
                  </div>
                </div>
                <button
                  type="button"
                  disabled={isRolling}
                  onClick={hlRollToStart}
                  className="rounded-full bg-blue-500 px-6 py-3 font-semibold text-white disabled:opacity-50"
                >
                  {isRolling ? "Rolling..." : "Roll to Start"}
                </button>
              </div>
            ) : (
              <div className="flex flex-col items-center gap-4">
                <p className="text-sm text-zinc-500 dark:text-zinc-400 my-4">Will the next roll be higher or lower?</p>
                <div className="dice-container">
                  <div className={isRolling ? (useBouncy ? "dice-bounce" : "dice-shake") : ""}>
                    {diceSides === 6 && (currentRolls[0] ?? 1) >= 1 && (currentRolls[0] ?? 1) <= 6 ? (
                      <DiceCube3D value={(currentRolls[0] ?? 1) as 1 | 2 | 3 | 4 | 5 | 6} />
                    ) : diceSides > 6 ? (
                      <D20Die value={currentRolls[0] ?? 1} />
                    ) : (
                      <div className="flex h-16 w-16 items-center justify-center rounded-xl border border-zinc-300 bg-white text-xl font-semibold shadow-md dark:border-zinc-600 dark:bg-zinc-900">
                        {currentRolls[0] ?? 1}
                      </div>
                    )}
                  </div>
                </div>
                {hlLastResult === "correct" && (
                  <p className="text-green-600 dark:text-green-400 font-medium">Correct! +1 point</p>
                )}
                {hlLastResult === "wrong" && (
                  <p className="text-red-600 dark:text-red-400 font-medium">Wrong! -2 point</p>
                )}
                {hlLastResult === "tie" && (
                  <p className="text-zinc-500 dark:text-zinc-400 font-medium">Tie — no change</p>
                )}
                <div className="flex gap-4">
                  <button
                    type="button"
                    disabled={isRolling}
                    onClick={() => hlGuessAndRoll("higher")}
                    className="rounded-full bg-green-600 px-6 py-3 font-semibold text-white disabled:opacity-50"
                  >
                    Higher
                  </button>
                  <button
                    type="button"
                    disabled={isRolling}
                    onClick={() => hlGuessAndRoll("lower")}
                    className="rounded-full bg-amber-600 px-6 py-3 font-semibold text-white disabled:opacity-50"
                  >
                    Lower
                  </button>
                </div>
              </div>
            )}
          </div>
        ) : (
          /* Normal / A-D mode */
          <>
        {advantageDisadvantageMode && (
          <p className="mb-3 text-sm font-medium text-zinc-500 dark:text-zinc-400 py-4">
            {isAdvantage ? "Roll 2, take higher" : "Roll 2, take lower"}
          </p>
        )}
        <div className="flex flex-row flex-wrap items-center justify-center gap-6 dice-container">
          {(advantageDisadvantageMode ? [currentRolls[0] ?? 1, currentRolls[1] ?? 1] : currentRolls).map((roll, index) => {
            const isChosen = advantageDisadvantageMode && chosenIndex === index && !isRolling;
            const wrapperClass = [
              isRolling ? (useBouncy ? "dice-bounce" : "dice-shake") : "",
              isChosen ? "ring-4 ring-green-500 ring-offset-2 dark:ring-offset-zinc-950 rounded-lg" : "",
            ].filter(Boolean).join(" ");
            return diceSides === 6 && roll >= 1 && roll <= 6 ? (
              <div
                key={index}
                className={wrapperClass}
                style={isRolling ? { animationDelay: `${index * 0.08}s` } : undefined}
              >
                <DiceCube3D value={roll as 1 | 2 | 3 | 4 | 5 | 6} />
              </div>
            ) : diceSides > 6 ? (
              <div
                key={index}
                className={wrapperClass}
                style={isRolling ? { animationDelay: `${index * 0.08}s` } : undefined}
              >
                <D20Die value={roll} />
              </div>
            ) : (
              <div
                key={index}
                className={`flex h-16 w-16 items-center justify-center rounded-xl border border-zinc-300 bg-white text-xl font-semibold shadow-md dark:border-zinc-600 dark:bg-zinc-900 ${wrapperClass}`}
                style={isRolling ? { animationDelay: `${index * 0.08}s` } : undefined}
              >
                {roll}
              </div>
            );
          })}
        </div>
        {result !== null && (
          <p className="mt-4 text-lg font-semibold text-zinc-600 dark:text-zinc-300">
            {advantageDisadvantageMode
              ? `${isAdvantage ? "Higher" : "Lower"}: ${result}`
              : `Total: ${result}`}
          </p>
        )}
          </>
        )}
      </div>

      {/* Controls — pinned near bottom (Sides + Mode/Count + Roll; hidden in Higher/Lower) */}
      {isNormalOrADMode && (
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
          {advantageDisadvantageMode ? (
            <div className="flex flex-col items-center gap-1.5">
              <span className="text-sm font-medium text-zinc-600 dark:text-zinc-400">Mode</span>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => setIsAdvantage(true)}
                  className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                    isAdvantage
                      ? "bg-green-600 text-white"
                      : "bg-zinc-100 text-zinc-600 hover:bg-zinc-200 dark:bg-zinc-800 dark:text-zinc-400"
                  }`}
                >
                  Advantage
                </button>
                <button
                  type="button"
                  onClick={() => setIsAdvantage(false)}
                  className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                    !isAdvantage
                      ? "bg-amber-600 text-white"
                      : "bg-zinc-100 text-zinc-600 hover:bg-zinc-200 dark:bg-zinc-800 dark:text-zinc-400"
                  }`}
                >
                  Disadvantage
                </button>
              </div>
            </div>
          ) : (
            <label className="flex flex-col items-center gap-1.5">
              <span className="text-sm font-medium text-zinc-600 dark:text-zinc-400">Count</span>
              <input
                type="text"
                inputMode="numeric"
                pattern="[0-9]*"
                autoComplete="off"
                value={countInputValue}
                onChange={handleCountChange}
                onBlur={handleCountBlur}
                className="w-20 rounded-lg border border-zinc-300 bg-white px-3 py-2 dark:border-zinc-600 dark:bg-zinc-900"
              />
            </label>
          )}
        </div>
        <button
          disabled={isRolling}
          className="w-full cursor-pointer disabled:cursor-not-allowed max-w-xs rounded-full bg-blue-500 px-4 py-3 font-semibold text-white disabled:opacity-50"
          onClick={rollDice}
        >
          {isRolling ? "Rolling..." : advantageDisadvantageMode ? "Roll 2 Dice" : "Roll Dice"}
        </button>
      </div>
      )}

      {/* Higher/Lower: Sides selector only */}
      {isHigherLowerMode && !hlGameOver && (
      <div className="shrink-0 flex flex-col items-center gap-3 border-t border-zinc-200 bg-zinc-100 p-4 pb-[max(1.5rem,env(safe-area-inset-bottom))] dark:border-zinc-800 dark:bg-zinc-950">
        <label className="flex flex-col items-center gap-1.5">
          <span className="text-sm font-medium text-zinc-600 dark:text-zinc-400">Dice</span>
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
      </div>
      )}

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
          advantageDisadvantageMode={advantageDisadvantageMode}
          setAdvantageDisadvantageMode={handleAdvantageDisadvantageModeChange}
          higherLowerGameMode={higherLowerGameMode}
          setHigherLowerGameMode={setHigherLowerGameMode}
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