"use client";

import { useState } from "react";
import { DiceFace, RollHistory, DiceCube3D, Modal } from "@/components";

import { RollEntry } from "../types/RollTypes";

function DiceRollingComponent() {
  const [diceSides, setDiceSides] = useState<number>(6);
  const [diceCount, setDiceCount] = useState<number>(1);
  const [result, setResult] = useState<number | null>(null);
  const [history, setHistory] = useState<RollEntry[]>([]);
  const [currentRolls, setCurrentRolls] = useState<number[]>([])

  const [isRolling, setIsRolling] = useState<boolean>(false)

  const [useBouncy, setUseBouncy] = useState<boolean>(false);
  const [isHistoryOpen, setIsHistoryOpen] = useState<boolean>(false);


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
        
        setCurrentRolls(rolls)
        setResult(sum);

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
    <div className="flex flex-col items-center justify-center bg-zinc-100 w-full h-full self-stretch justify-self-stretch">

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

      <button disabled={isRolling} className="mt-4 cursor-pointer bg-blue-500 text-white p-2 rounded-md disabled:opacity-50" onClick={rollDice}>
        {isRolling ? "Rolling..." : "Roll Dice"}
      </button>

    <div className="h-auto">
      {result !== null && (
        <p className="mt-3 flex flex-row gap-6 dice-container flex-wrap">
          {/* {result} */}
          {currentRolls.map((roll, index) =>
            diceSides === 6 && roll >= 1 && roll <= 6 ? (
              <div 
                className={isRolling ? (useBouncy ? "dice-bounce" : "dice-shake"): ""}
                // className={`${isRolling ? "dice-throw" : ""}`}
                style={isRolling ? {animationDelay: `${index * 0.08}s`} : undefined}
                 key={index}
                  >
              <DiceCube3D
                key={index}
                value={roll as 1| 2 | 3 | 4 | 5 | 6}
              />
              </div>
            ) : (
              <div key={index} className={`flex items-center justify-center rounded-xl bg-white dark:bg-zinc-900 border border-zinc-300 dark:border-zinc-600 shadow-md w-16 h-16 text-xl font-semibold ${isRolling ? (useBouncy ? "dice-bounce": "dice-shake") : ""}`}>
                {roll}
              </div>
            )
          )}
        </p>
      )}
      </div>

      <button onClick={() => setIsHistoryOpen(true)}>
        Open Modal
      </button>

      <Modal
        isOpen={isHistoryOpen}
        onClose={() => setIsHistoryOpen(false)}
        title="History"
      >
        <RollHistory history={history} />
      </Modal>

    </div>
  );
}

export default DiceRollingComponent;