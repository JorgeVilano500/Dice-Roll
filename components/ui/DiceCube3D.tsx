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
    border: "1px solid rgba(0,0,0,0.10)",
  };

  return (
    <div
      className={`relative overflow-visible ${className}`}
      style={{ width: size * 1.4, height: size * 1.3, perspective: "400px" }}
      aria-label={`Dice showing ${value}`}
    >
      {/* Ground shadow */}
      <div
        style={{
          position: "absolute",
          bottom: -6,
          left: "50%",
          transform: "translateX(-50%) rotate(-8deg)",
          width: size * 1.05,
          height: size * 0.34,
          borderRadius: "999px",
          background: "radial-gradient(closest-side, rgba(0,0,0,0.20), rgba(0,0,0,0.0) 72%)",
          filter: "blur(8px)",
          opacity: 0.85,
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
            backgroundImage: "linear-gradient(145deg, #ffffff 0%, #fbfbfb 55%, #f0f0f0 100%)",
            boxShadow: "inset 0 1px 0 rgba(255,255,255,0.85), inset 0 -10px 20px rgba(0,0,0,0.05)",
            overflow: "visible",
          }}
        >
          <PipGrid value={value} faceSize={size} />
        </div>

        {/* Left/front face (blank, no pips) - stronger definition */}
        <div
          style={{
            ...faceStyle,
            top: half * 0.9,
            left: half,
            transform: `translate(-50%, -50%) translateZ(${half}px)`,
            // Make the left face clearly separate from the page:
            // - slightly darker overall
            // - strong dark seam on the right (meeting the right face)
            // - subtle outside shadow on the left edge
            backgroundImage:
              "linear-gradient(90deg, #efefef 0%, #e4e4e4 62%, #cdcdcd 100%), linear-gradient(180deg, rgba(0,0,0,0) 0%, rgba(0,0,0,0.07) 100%)",
            // Slightly stronger outline so this face doesn't disappear into light backgrounds
            border: "1px solid rgba(0,0,0,0.14)",
            boxShadow: [
              // stroke reinforcement (keeps edges crisp on white backgrounds)
              "0 0 0 1px rgba(0,0,0,0.06)",
              "inset 0 10px 18px rgba(255,255,255,0.14)",
              "inset 0 -16px 26px rgba(0,0,0,0.14)",
              // seam with right face
              "inset -3px 0 0 rgba(0,0,0,0.18)",
              "inset -1px 0 0 rgba(255,255,255,0.08)",
              // outside separation from page (left edge + bottom) + crisp rim
              "-8px 10px 18px rgba(0,0,0,0.10)",
              "-2px 0 0 rgba(0,0,0,0.10)",
            ].join(", "),
          }}
        />

<div
          style={{
            ...faceStyle,
            top: half * 0.9,
            left: half,
            transform: `translate(-100%, -50%)   rotateY(-90deg)`,
            // Make the left face cleary separate from the page:
            // - slightly darker overall
            // - strong dark seam on the right (meeting the right face)
            // - subtle outside shadow on the left edge
            backgroundImage:
              "linear-gradient(90deg, #efefef 0%, #e4e4e4 62%, #cdcdcd 100%), linear-gradient(180deg, rgba(0,0,0,0) 0%, rgba(0,0,0,0.07) 100%)",
            // Slightly stronger outline so this face doesn't disappear into light backgrounds
            border: "1px solid rgba(0,0,0,0.14)",
            boxShadow: [
              // stroke reinforcement (keeps edges crisp on white backgrounds)
              "0 0 0 1px rgba(0,0,0,0.06)",
              "inset 0 10px 18px rgba(255,255,255,0.14)",
              "inset 0 -16px 26px rgba(0,0,0,0.14)",
              // seam with right face
              "inset -3px 0 0 rgba(0,0,0,0.18)",
              "inset -1px 0 0 rgba(255,255,255,0.08)",
              // outside separation from page (left edge + bottom) + crisp rim
              "-8px 10px 18px rgba(0,0,0,0.10)",
              "-2px 0 0 rgba(0,0,0,0.10)",
            ].join(", "),
          }}
        />

        {/* Right face (blank, no pips) */}
        <div
          style={{
            ...faceStyle,
            top: half * 0.7,
            left: half + half * 0.7,
            transform: `translate(-50%, -50%) rotateY(90deg) translateZ(${half}px)`,
            backgroundImage:
              // Darken toward the far right edge so the plane reads clearly
              "linear-gradient(135deg, #e9e9e9 0%, #dddddd 55%, #cfcfcf 100%)",
            boxShadow: [
              // interior lighting
              "inset 12px 0 18px rgba(255,255,255,0.16)",
              "inset -18px 0 26px rgba(0,0,0,0.12)",
              // crisp crease on the left edge (where it meets the front face)
              "inset 2px 0 0 rgba(0,0,0,0.14)",
              "inset 1px 0 0 rgba(255,255,255,0.10)",
              // slight lift from page
              "6px 10px 18px rgba(0,0,0,0.06)",
            ].join(", "),
          }}
        />
      </div>
    </div>
  );
}
