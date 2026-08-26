/**
 * Status pill. Every status has its own light tint plus a saturated dot and
 * label from the same hue, so the badges read as one family:
 *
 *   Draft purple · Payment Pending red · Submitted blue · Under Review yellow
 *   Response Available green · First Appeal Filed teal · Closed black
 */

import type { AppealStatus, Status } from "../lib/types";

function slug(status: string): string {
  return status.toLowerCase().replace(/[^a-z0-9]+/g, "-");
}

export function StatusBadge({
  status,
  size = "default",
}: {
  status: Status | AppealStatus;
  size?: "default" | "large";
}) {
  return (
    <span
      className={`status status-${slug(status)}${size === "large" ? " status-large" : ""}`}
    >
      <i aria-hidden />
      {status}
    </span>
  );
}
