/**
 * The lifecycle timeline shown inside an application or an appeal.
 *
 * It always renders *every* stage, not only the ones that have happened, so
 * the applicant can see what is still ahead. Everything from the first stage
 * up to the last completed one is blue; the remainder stays grey.
 */

import { Check } from "lucide-react";
import type { Stage } from "../lib/lifecycle";
import type { TimelineEntry } from "../lib/types";

export function Timeline({
  stages,
  entries,
  reached,
}: {
  stages: Stage[];
  entries: TimelineEntry[];
  /** Index of the last completed stage. */
  reached: number;
}) {
  return (
    <ol className="timeline">
      {stages.map((stage, index) => {
        const entry = entries.find((item) => item.stage === stage.key);
        const state =
          index < reached ? "done" : index === reached ? "current" : "upcoming";
        // The connector below this node is blue only while the next node is
        // also reached, so the rail stops exactly at the current stage.
        const linkClass = index < reached ? "link-done" : "link-upcoming";

        return (
          <li key={stage.key} className={`${state} ${linkClass}`}>
            <span className="timeline-mark" aria-hidden>
              {state === "upcoming" ? null : (
                <Check size={10} strokeWidth={3.5} />
              )}
            </span>
            <div className="timeline-body">
              <b>{stage.title}</b>
              <p>{entry?.detail ?? stage.upcoming}</p>
              <small>
                {entry?.time ??
                  (state === "current" ? "In progress" : "Not yet reached")}
              </small>
            </div>
          </li>
        );
      })}
    </ol>
  );
}
