import type { CSSProperties } from "react";

const colors = ["#ffe600", "#ff64c9", "#aab3ff", "#ffd5a1", "#ffffff"];

export function PartyAtmosphere() {
  return (
    <div className="confetti-layer" aria-hidden="true">
      {Array.from({ length: 28 }, (_, index) => (
        <i key={index} style={{
          "--x": `${(index * 37 + 3) % 100}%`,
          "--delay": `${-(index * 1.17)}s`,
          "--duration": `${13 + (index % 8)}s`,
          "--rotation": `${index * 43}deg`,
          "--color": colors[index % colors.length],
        } as CSSProperties} />
      ))}
    </div>
  );
}
