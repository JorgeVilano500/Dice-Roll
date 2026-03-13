"use client";

import { useState } from "react";
import { DiceFace } from "@/components";

type RollEntry = {
  id: string;
  at: number;
  sides: number;
  rolls: number[];
  sum: number;
};

function DiceRollingComponent() {
  const [diceSides, setDiceSides] = useState<number>(6);
  const [diceCount, setDiceCount] = useState<number>(1);
  const [result, setResult] = useState<number | null>(null);
  const [history, setHistory] = useState<RollEntry[]>([]);
  const [currentRolls, setCurrentRolls] = useState<number[]>([])

  const rollDice = () => {
    const rolls = Array.from({ length: diceCount }, () => Math.floor(Math.random() * diceSides) + 1);
    const sum = rolls.reduce((a, b) => a + b, 0);
    setResult(sum);
    setCurrentRolls(rolls)

    const entry: RollEntry = {
      id: crypto.randomUUID(),
      at: Date.now(),
      sides: diceSides,
      rolls,
      sum,
    };

    setHistory((prev) => [entry, ...prev].slice(0, 8));
  };

  return (
    <div className="flex flex-col items-center justify-center w-full h-full self-stretch justify-self-stretch">
      <h1>Dice Roll</h1>

      <div className="mt-3 flex items-center gap-3">
        <label className="flex items-center gap-2">
          Sides
          <select
            value={diceSides}
            onChange={(e) => setDiceSides(Number(e.currentTarget.value))}
            className="border border-zinc-300 rounded px-2 py-1"
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

        <label className="flex items-center gap-2">
          Count
          <input
            type="number"
            min={1}
            max={50}
            value={diceCount}
            onChange={(e) => setDiceCount(Math.max(1, Number(e.currentTarget.value)))}
            className="border border-zinc-300 rounded px-2 py-1 w-20"
          />
        </label>
      </div>

      <button className="mt-4 cursor-pointer bg-blue-500 text-white p-2 rounded-md" onClick={rollDice}>
        Roll Dice
      </button>

      {result !== null && (
        <p className="mt-3 flex flex-row gap-6">
          {/* {result} */}
          {currentRolls.map((roll, index) =>
            diceSides === 6 && roll >= 1 && roll <= 6 ? (
              <DiceFace
                key={index}
                value={roll as 1| 2 | 3 | 4 | 5 | 6}
              />
            ) : (
              <div key={index} className="flex items-center justify-center rounded-xl bg-white dark:bg-zinc-900 border border-zinc-300 dark:border-zinc-600 shadow-md w-16 h-16 text-xl font-semibold">
                {roll}
              </div>
            )
          )}
        </p>
      )}

      {history.length > 0 && (
        <div className="mt-6 w-full max-w-md">
          <h2 className="font-semibold mb-2">Roll history</h2>
          <ul className="flex flex-col gap-2">
            {history.map((h) => (
              <li key={h.id} className="border border-zinc-200 rounded p-3">
                <div className="flex items-baseline justify-between gap-3">
                  <span className="font-medium">
                    {h.rolls.length}d{h.sides} = {h.sum}
                  </span>
                  <span className="text-xs text-zinc-500">{new Date(h.at).toLocaleTimeString()}</span>
                </div>
                <div className="text-sm text-zinc-700 mt-1">Rolls: {h.rolls.join(", ")}</div>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

export default DiceRollingComponent;