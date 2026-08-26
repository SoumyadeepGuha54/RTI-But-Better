/**
 * A QR-code *lookalike* for the simulated payment step.
 *
 * This encodes nothing. It draws the three finder squares, an alignment
 * square and a deterministic pattern of modules seeded from the reference
 * string, so the same application always renders the same picture.
 */

import { useMemo } from "react";
import { seededRandom } from "../lib/format";

const MODULES = 25;
const QUIET = 2;

function isFinder(row: number, col: number): boolean {
  const inBox = (top: number, left: number) =>
    row >= top && row < top + 7 && col >= left && col < left + 7;
  return inBox(0, 0) || inBox(0, MODULES - 7) || inBox(MODULES - 7, 0);
}

function finderFilled(row: number, col: number): boolean {
  // Normalise into the local 7x7 box, then draw ring + centre.
  const r = row < 7 ? row : row - (MODULES - 7);
  const c = col < 7 ? col : col - (MODULES - 7);
  const onRing = r === 0 || r === 6 || c === 0 || c === 6;
  const inCentre = r >= 2 && r <= 4 && c >= 2 && c <= 4;
  return onRing || inCentre;
}

function alignmentState(row: number, col: number): "outside" | "on" | "off" {
  const r = row - (MODULES - 9);
  const c = col - (MODULES - 9);
  if (r < 0 || r > 4 || c < 0 || c > 4) return "outside";
  const onRing = r === 0 || r === 4 || c === 0 || c === 4;
  return onRing || (r === 2 && c === 2) ? "on" : "off";
}

export function QrCode({
  value,
  size = 172,
}: {
  value: string;
  size?: number;
}) {
  const cells = useMemo(() => {
    const random = seededRandom(value);
    const out: { row: number; col: number }[] = [];
    for (let row = 0; row < MODULES; row += 1) {
      for (let col = 0; col < MODULES; col += 1) {
        if (isFinder(row, col)) {
          if (finderFilled(row, col)) out.push({ row, col });
          continue;
        }
        const alignment = alignmentState(row, col);
        if (alignment !== "outside") {
          if (alignment === "on") out.push({ row, col });
          continue;
        }
        // Timing rows/columns, as on a real symbol.
        if (row === 6 || col === 6) {
          if ((row === 6 ? col : row) % 2 === 0) out.push({ row, col });
          continue;
        }
        if (random() > 0.52) out.push({ row, col });
      }
    }
    return out;
  }, [value]);

  const span = MODULES + QUIET * 2;

  return (
    <svg
      className="qr"
      width={size}
      height={size}
      viewBox={`0 0 ${span} ${span}`}
      role="img"
      aria-label="Simulated payment QR code. This is a demo graphic and encodes nothing."
    >
      <rect width={span} height={span} fill="#ffffff" />
      {cells.map((cell) => (
        <rect
          key={`${cell.row}-${cell.col}`}
          x={cell.col + QUIET}
          y={cell.row + QUIET}
          width={1}
          height={1}
          fill="#101112"
        />
      ))}
    </svg>
  );
}
