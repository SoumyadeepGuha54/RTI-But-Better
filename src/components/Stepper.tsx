/** Horizontal progress rail for the two wizards. */

import { Check } from "lucide-react";

export function Stepper({
  steps,
  current,
}: {
  steps: string[];
  current: number;
}) {
  return (
    <ol className="stepper" aria-label="Progress">
      {steps.map((label, index) => {
        const state =
          index < current
            ? "complete"
            : index === current
              ? "current"
              : "upcoming";
        return (
          <li
            key={label}
            className={state}
            aria-current={state === "current" ? "step" : undefined}
          >
            <span className="stepper-mark">
              {state === "complete" ? (
                <Check size={12} strokeWidth={3} aria-hidden />
              ) : (
                index + 1
              )}
            </span>
            <b>{label}</b>
          </li>
        );
      })}
    </ol>
  );
}
