/**
 * Shared domain types for the RTI Online demo.
 *
 * Everything in this prototype is mock data held in the browser. No record
 * here is an official Government of India document.
 */

export type Status =
  | "Draft"
  | "Payment Pending"
  | "Submitted"
  | "Under Review"
  | "Response Available"
  | "First Appeal Filed"
  | "Closed";

export type AppealStatus =
  "Appeal Submitted" | "Appeal Under Review" | "Appeal Decided";

/** A single dated entry in an application's history. */
export type TimelineEntry = {
  /** Matches a stage key from `lifecycle.ts` so we can render future stages too. */
  stage: string;
  detail?: string;
  /** Human readable timestamp, e.g. "18 Aug 2026 · 10:30". */
  time: string;
};

export type Applicant = {
  name: string;
  email: string;
  phone: string;
  address1: string;
  address2: string;
  city: string;
  state: string;
  pin: string;
};

export type Attachment = {
  name: string;
  /** Size in bytes. */
  size: number;
};

export type Application = {
  /** Registration number, also used as the route id. */
  registration: string;
  authority: string;
  /** Date the application was created, e.g. "18 Aug 2026". */
  date: string;
  status: Status;
  /** Relative or absolute "last updated" label shown in lists. */
  updated: string;
  subject: string;
  request: string;
  applicant: Applicant;
  fee: number;
  feePaid: boolean;
  paymentMethod?: string;
  transactionId?: string;
  attachment?: Attachment;
  timeline: TimelineEntry[];
  /** Present once the authority has replied. */
  response?: {
    summary: string;
    /** Label for the mock downloadable document. */
    document: string;
    date: string;
  };
  /** Registration number of a first appeal filed against this application. */
  appealNumber?: string;
};

export type Appeal = {
  /** Appeal reference number, used as the route id. */
  reference: string;
  /** Registration number of the application being appealed. */
  applicationRegistration: string;
  authority: string;
  subject: string;
  date: string;
  status: AppealStatus;
  updated: string;
  /** Why the appellant is appealing. */
  ground: string;
  /** Free-text explanation. */
  explanation: string;
  /** What the appellant wants to happen. */
  relief: string;
  timeline: TimelineEntry[];
};

export type Notification = {
  id: string;
  title: string;
  message: string;
  read: boolean;
  /** ISO timestamp, used for ordering and relative time. */
  createdAt: string;
  /** Where clicking the notification should take the user. */
  href?: string;
  kind: "submitted" | "status" | "response" | "payment" | "appeal" | "draft";
};

export type Profile = {
  name: string;
  email: string;
  phone: string;
  address1: string;
  address2: string;
  city: string;
  state: string;
  pin: string;
};
