"use client"
import { RollEntry } from "../types/RollTypes"

type RollHistoryProps = {
  history: RollEntry[];
};

export function RollHistory({ history }: RollHistoryProps) {


    return (
        <div className="overflow-y-auto w-full max-w-md">
      {history.length > 0 && (
        <div className="mt-6 w-full max-w-md md:px-0 px-4">
          <h2 className="font-semibold mb-2">Roll history</h2>
          <ul className="flex flex-col gap-2">
            {history.map((h) => (
              <li key={h.id} className="border border-zinc-200 rounded p-3">
                <div className="flex items-baseline justify-between gap-3">
                  <span className="font-medium">
                    {h.rolls.length} x d{h.sides} = {h.sum}
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
    )

}

