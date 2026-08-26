/**
 * The canonical lifecycle of an RTI application and its first appeal.
 *
 * The detail page renders *every* stage, not just the ones that have happened,
 * so an applicant can see what is still ahead of them. Stages up to and
 * including the latest reached one are drawn in blue; the rest stay grey.
 */

import type { AppealStatus, Application, Status } from "./types";

export type Stage = {
  key: string;
  title: string;
  /** Shown when the stage has not happened yet. */
  upcoming: string;
};

/** Ordered stages every application passes through. */
export const applicationStages: Stage[] = [
  {
    key: "created",
    title: "Application created",
    upcoming: "Your application will be saved as a draft.",
  },
  {
    key: "fee",
    title: "Fee paid",
    upcoming: "Pay the ₹10 application fee to submit.",
  },
  {
    key: "submitted",
    title: "Submitted to public authority",
    upcoming: "Your application will be lodged with the authority.",
  },
  {
    key: "assigned",
    title: "Assigned to CPIO",
    upcoming: "The authority will assign a Central Public Information Officer.",
  },
  {
    key: "review",
    title: "Under review",
    upcoming: "The CPIO will examine the records you asked for.",
  },
  {
    key: "response",
    title: "Response issued",
    upcoming: "A reply is due within 30 days of submission.",
  },
  {
    key: "closed",
    title: "Application closed",
    upcoming: "The application closes once you have the information.",
  },
];

/** Ordered stages a first appeal passes through. */
export const appealStages: Stage[] = [
  {
    key: "appeal-filed",
    title: "First appeal filed",
    upcoming: "Your appeal will be recorded.",
  },
  {
    key: "appeal-registered",
    title: "Registered with appellate authority",
    upcoming: "The First Appellate Authority will register the appeal.",
  },
  {
    key: "appeal-review",
    title: "Appeal under review",
    upcoming: "The appellate authority will review the CPIO decision.",
  },
  {
    key: "appeal-decided",
    title: "Appeal decided",
    upcoming: "A decision is due within 30 days of filing.",
  },
];

/**
 * How far along the lifecycle a given status sits.
 * Returns the index of the last *completed* stage in `applicationStages`.
 */
export function reachedStageIndex(app: Application): number {
  switch (app.status) {
    case "Draft":
      return 0;
    case "Payment Pending":
      return 0;
    case "Submitted":
      return 2;
    case "Under Review":
      return 4;
    case "Response Available":
      return 5;
    case "First Appeal Filed":
      // The application itself stalled at the response stage; the appeal
      // timeline continues the story.
      return 5;
    case "Closed":
      return 6;
  }
}

export function appealReachedStageIndex(status: AppealStatus): number {
  switch (status) {
    case "Appeal Submitted":
      return 1;
    case "Appeal Under Review":
      return 2;
    case "Appeal Decided":
      return 3;
  }
}

/** Statuses that make an application eligible for a first appeal. */
const appealable: Status[] = [
  "Submitted",
  "Under Review",
  "Response Available",
];

export function canAppeal(app: Application): boolean {
  return appealable.includes(app.status) && !app.appealNumber;
}

/** Plain-language reason an application can be appealed, shown in the picker. */
export function appealEligibilityNote(app: Application): string {
  if (app.status === "Response Available")
    return "A response was issued — appeal if it is incomplete or unsatisfactory.";
  if (app.status === "Under Review")
    return "Still under review — appeal if the 30-day deadline has passed.";
  return "Submitted but not yet answered.";
}

/** Grounds an appellant can choose from, per section 19 of the RTI Act. */
export const appealGrounds = [
  "No response received within 30 days",
  "Information was refused or denied",
  "Information provided was incomplete or misleading",
  "An excessive or unreasonable fee was demanded",
  "Response was received after the statutory deadline",
];
