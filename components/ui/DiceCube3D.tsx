"use client";

type DiceCube3DProps = {
  value: 1 | 2 | 3 | 4 | 5 | 6;
  size?: number;
  className?: string;
};

const PIP_POSITIONS: Record<1 | 2 | 3 | 4 | 5 | 6, string[]> = {
  1: ["center"],
  2: ["top-left", "bottom-right"],
  3: ["top-left", "bottom-right", "center"],
  4: ["top-left", "bottom-right", "top-right", "bottom-left"],
  5: ["top-left", "bottom-right", "top-right", "bottom-left", "center"],
  6: ["top-left", "bottom-right", "top-right", "bottom-left", "top-center", "bottom-center"],
};

function PipGrid({ value, faceSize }: { value: 1 | 2 | 3 | 4 | 5 | 6; faceSize: number }) {
  const positions = PIP_POSITIONS[value];
  const pipSize = Math.max(6, faceSize * 0.16);
  const margin = faceSize * 0.22; // keep pips well inside the face

  const getStyle = (pos: string): React.CSSProperties => {
    const base: React.CSSProperties = { position: "absolute", width: pipSize, height: pipSize, borderRadius: "50%", backgroundColor: "#171717" };
    switch (pos) {
      case "top-left": return { ...base, top: margin, left: margin };
      case "top-right": return { ...base, top: margin, right: margin };
      case "bottom-left": return { ...base, bottom: margin, left: margin };
      case "bottom-right": return { ...base, bottom: margin, right: margin };
      case "top-center": return { ...base, top: margin, left: "50%", transform: "translateX(-50%)" };
      case "bottom-center": return { ...base, bottom: margin, left: "50%", transform: "translateX(-50%)" };
      case "center": return { ...base, top: "50%", left: "50%", transform: "translate(-50%, -50%)" };
      default: return base;
    }
  };

  return (
    <div className="absolute inset-0 flex items-center justify-center" style={{ overflow: "visible" }}>
      {positions.map((pos) => (
        <span key={pos} style={getStyle(pos)} aria-hidden />
      ))}
    </div>
  );
}

export function DiceCube3D({ value, size = 72, className = "" }: DiceCube3DProps) {
  const half = size / 2;
  const faceStyle: React.CSSProperties = {
    position: "absolute",
    width: size,
    height: size,
    borderRadius: "12%",
    backfaceVisibility: "hidden",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  };

  return (
    <div
      className={`relative overflow-visible ${className}`}
      style={{ width: size * 1.4, height: size * 1.3, perspective: "400px" }}
      aria-label={`Dice showing ${value}`}
    >
      {/* Soft elliptical shadow */}
      <div
        style={{
          position: "absolute",
          bottom: -4,
          left: "50%",
          transform: "translateX(-50%)",
          width: size * 0.9,
          height: size * 0.2,
          borderRadius: "50%",
          backgroundColor: "rgba(0,0,0,0.12)",
          filter: "blur(4px)",
        }}
      />

      {/* Isometric cube wrapper */}
      <div
        style={{
          position: "relative",
          width: size,
          height: size,
          transformStyle: "preserve-3d",
          transform: "rotateX(-35deg) rotateY(45deg)",
          overflow: "visible",
        }}
      >
        {/* Top face (brightest - light source from top) */}
        <div
          style={{
            ...faceStyle,
            top: 0,
            left: half,
            transform: `translateX(-50%) rotateX(90deg) translateZ(${half}px)`,
            backgroundColor: "#ffffff",
            boxShadow: "inset 0 1px 0 rgba(255,255,255,0.8)",
            overflow: "visible",
          }}
        >
          <PipGrid value={value} faceSize={size} />
        </div>

        {/* Front face (slightly darker) - blank, no pips */}
        <div
          style={{
            ...faceStyle,
            top: half * 0.9,
            left: half,
            transform: `translate(-50%, -50%) translateZ(${half}px)`,
            backgroundColor: "#f5f5f5",
            boxShadow: "inset 0 -1px 0 rgba(0,0,0,0.04)",
          }}
        />

        {/* Right face (darkest - receives least light) - blank, no pips */}
        <div
          style={{
            ...faceStyle,
            top: half * 0.7,
            left: half + half * 0.7,
            transform: `translate(-50%, -50%) rotateY(90deg) translateZ(${half}px)`,
            backgroundColor: "#ebebeb",
            boxShadow: "inset -1px 0 0 rgba(0,0,0,0.05)",
          }}
        />
      </div>
    </div>
  );
}
