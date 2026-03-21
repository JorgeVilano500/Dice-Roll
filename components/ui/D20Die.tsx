"use client";

type D20DieProps = {
  value: number;
  size?: number;
  className?: string;
};

// Octagon: regular 8-sided silhouette
const OCTAGON_PATH =
  "polygon(50% 6%, 81% 19%, 94% 50%, 81% 81%, 50% 94%, 19% 81%, 6% 50%, 19% 19%)";

// 8 vertices of the octagon (cx, cy) = center, for drawing facet lines
const VERTICES = [
  [50, 6],
  [81, 19],
  [94, 50],
  [81, 81],
  [50, 94],
  [19, 81],
  [6, 50],
  [19, 19],
] as const;

export function D20Die({ value, size = 76, className = "" }: D20DieProps) {
  const fontSize = Math.max(14, Math.floor(size * 0.32));
  const cx = 50;
  const cy = 50;

  return (
    <div
      className={`relative ${className}`}
      style={{ width: size, height: size }}
      aria-label={`Polyhedral die showing ${value}`}
    >
      {/* Base octagon — clean edges, dice-like gradient */}
      <div
        className="absolute inset-0 shadow-lg dark:shadow-zinc-900/50"
        style={{
          clipPath: OCTAGON_PATH,
          background:
            "linear-gradient(160deg, #f8f8f8 0%, #e8e8e8 50%, #d0d0d0 100%)",
          border: "2px solid rgba(0,0,0,0.12)",
          boxShadow:
            "inset 0 1px 0 rgba(255,255,255,0.9), inset 0 -2px 8px rgba(0,0,0,0.08), 0 4px 12px rgba(0,0,0,0.15)",
        }}
      />

      {/* Dark mode tint */}
      <div
        className="absolute inset-0 opacity-0 dark:opacity-100 pointer-events-none"
        style={{
          clipPath: OCTAGON_PATH,
          background:
            "linear-gradient(160deg, rgba(24,24,27,0.92) 0%, rgba(39,39,42,0.95) 50%, rgba(63,63,70,0.98) 100%)",
          border: "2px solid rgba(255,255,255,0.12)",
        }}
      />

      {/* Facet lines: center to each vertex (readable as triangular faces) */}
      <svg
        className="absolute inset-0 w-full h-full dark:hidden"
        style={{ clipPath: OCTAGON_PATH, pointerEvents: "none" }}
      >
        {VERTICES.map(([x, y], i) => (
          <line
            key={i}
            x1={`${cx}%`}
            y1={`${cy}%`}
            x2={`${x}%`}
            y2={`${y}%`}
            stroke="rgba(0,0,0,0.22)"
            strokeWidth="1"
          />
        ))}
      </svg>
      <svg
        className="absolute inset-0 hidden w-full h-full dark:block"
        style={{ clipPath: OCTAGON_PATH, pointerEvents: "none" }}
      >
        {VERTICES.map(([x, y], i) => (
          <line
            key={i}
            x1={`${cx}%`}
            y1={`${cy}%`}
            x2={`${x}%`}
            y2={`${y}%`}
            stroke="rgba(255,255,255,0.2)"
            strokeWidth="1"
          />
        ))}
      </svg>

      {/* Value */}
      <div
        className="absolute inset-0 flex items-center justify-center"
        style={{ clipPath: OCTAGON_PATH }}
      >
        <span
          className="font-black text-zinc-900 dark:text-zinc-50"
          style={{
            fontSize,
            textShadow: "0 1px 1px rgba(255,255,255,0.5)",
          }}
        >
          {value}
        </span>
      </div>
    </div>
  );
}
