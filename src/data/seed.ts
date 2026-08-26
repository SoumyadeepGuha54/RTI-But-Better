/**
 * Seed mock data. This is what a judge sees on first load, before they file
 * anything themselves. It deliberately covers every status so the whole
 * colour system and every action is visible immediately.
 */

import type { Appeal, Application, Notification, Profile } from "../lib/types";

export const demoProfile: Profile = {
  name: "Soumy Prakash",
  email: "demo@example.com",
  phone: "9876543210",
  address1: "212, Rajendra Nagar",
  address2: "Near Community Hall",
  city: "Patna",
  state: "Bihar",
  pin: "800016",
};

const applicantFromProfile = { ...demoProfile };

export const seedApplications: Application[] = [
  {
    registration: "RTI/2026/RAIL/482917",
    authority: "Ministry of Railways",
    date: "18 Aug 2026",
    status: "Under Review",
    updated: "Today, 10:42",
    subject: "Records relating to station accessibility work",
    request:
      "Please provide certified copies of the sanction order, tender documents and completion certificates for the installation of ramps and tactile paving at Patna Junction between April 2025 and March 2026, along with the total expenditure incurred.",
    applicant: applicantFromProfile,
    fee: 10,
    feePaid: true,
    paymentMethod: "UPI",
    transactionId: "DEMOTXN40128873",
    timeline: [
      {
        stage: "created",
        detail: "You created this application.",
        time: "18 Aug 2026 · 10:12",
      },
      {
        stage: "fee",
        detail: "₹10 paid via UPI.",
        time: "18 Aug 2026 · 10:28",
      },
      {
        stage: "submitted",
        detail: "Lodged with the Ministry of Railways.",
        time: "18 Aug 2026 · 10:30",
      },
      {
        stage: "assigned",
        detail: "Assigned to Director (Public Grievances), Railway Board.",
        time: "19 Aug 2026 · 09:15",
      },
      {
        stage: "review",
        detail: "The CPIO is collecting records from the divisional office.",
        time: "26 Aug 2026 · 10:42",
      },
    ],
  },
  {
    registration: "RTI/2026/EDU/238491",
    authority: "Ministry of Education",
    date: "07 Aug 2026",
    status: "Response Available",
    updated: "24 Aug 2026",
    subject: "Institutional scholarship allocation records",
    request:
      "Please provide the year-wise allocation and disbursement figures for the National Means-cum-Merit Scholarship in Bihar for the financial years 2023-24, 2024-25 and 2025-26, together with the number of beneficiaries in each district.",
    applicant: applicantFromProfile,
    fee: 10,
    feePaid: true,
    paymentMethod: "Net Banking",
    transactionId: "DEMOTXN33910244",
    response: {
      summary:
        "The Department of School Education has provided district-wise allocation and disbursement figures for all three financial years, along with beneficiary counts. Two annexures are attached.",
      document: "Response-RTI-2026-EDU-238491.pdf",
      date: "24 Aug 2026",
    },
    timeline: [
      {
        stage: "created",
        detail: "You created this application.",
        time: "07 Aug 2026 · 18:40",
      },
      {
        stage: "fee",
        detail: "₹10 paid via net banking.",
        time: "07 Aug 2026 · 18:44",
      },
      {
        stage: "submitted",
        detail: "Lodged with the Ministry of Education.",
        time: "07 Aug 2026 · 18:45",
      },
      {
        stage: "assigned",
        detail:
          "Assigned to Under Secretary (RTI), Department of Higher Education.",
        time: "09 Aug 2026 · 11:05",
      },
      {
        stage: "review",
        detail: "Records were requisitioned from the scholarship division.",
        time: "14 Aug 2026 · 15:20",
      },
      {
        stage: "response",
        detail: "A response document is ready to download.",
        time: "24 Aug 2026 · 12:30",
      },
    ],
  },
  {
    registration: "RTI/2026/FIN/781204",
    authority: "Ministry of Finance",
    date: "23 Aug 2026",
    status: "Payment Pending",
    updated: "23 Aug 2026",
    subject: "Annual programme expenditure details",
    request:
      "Please provide the head-wise actual expenditure against the budget estimates for centrally sponsored schemes administered by the Department of Expenditure during the financial year 2025-26.",
    applicant: applicantFromProfile,
    fee: 10,
    feePaid: false,
    timeline: [
      {
        stage: "created",
        detail: "You created this application.",
        time: "23 Aug 2026 · 20:02",
      },
    ],
  },
  {
    registration: "RTI/2026/CPWD/905613",
    authority: "Central Public Works Department",
    date: "02 Aug 2026",
    status: "First Appeal Filed",
    updated: "21 Aug 2026",
    subject: "Maintenance expenditure on government quarters",
    request:
      "Please provide the work-wise maintenance expenditure incurred on Type-III and Type-IV government residential quarters in the Patna Central Division during 2025-26, along with copies of the relevant work orders.",
    applicant: applicantFromProfile,
    fee: 10,
    feePaid: true,
    paymentMethod: "UPI",
    transactionId: "DEMOTXN29774310",
    appealNumber: "APL/2026/CPWD/3471",
    response: {
      summary:
        "The CPIO stated that the information sought is voluminous and would disproportionately divert the resources of the public authority, and declined to provide it under section 7(9).",
      document: "Response-RTI-2026-CPWD-905613.pdf",
      date: "19 Aug 2026",
    },
    timeline: [
      {
        stage: "created",
        detail: "You created this application.",
        time: "02 Aug 2026 · 09:30",
      },
      {
        stage: "fee",
        detail: "₹10 paid via UPI.",
        time: "02 Aug 2026 · 09:33",
      },
      {
        stage: "submitted",
        detail: "Lodged with the Central Public Works Department.",
        time: "02 Aug 2026 · 09:34",
      },
      {
        stage: "assigned",
        detail: "Assigned to Executive Engineer (RTI Cell), CPWD.",
        time: "04 Aug 2026 · 10:00",
      },
      {
        stage: "review",
        detail: "The CPIO examined the request.",
        time: "11 Aug 2026 · 16:10",
      },
      {
        stage: "response",
        detail: "Information declined under section 7(9).",
        time: "19 Aug 2026 · 14:05",
      },
    ],
  },
  {
    registration: "RTI/2026/MHA/619827",
    authority: "Ministry of Home Affairs",
    date: "12 Jul 2026",
    status: "Closed",
    updated: "14 Aug 2026",
    subject: "Circulars issued during July 2026",
    request:
      "Please provide copies of all circulars and office memoranda issued by the Ministry of Home Affairs to state governments during July 2026 concerning disaster preparedness.",
    applicant: applicantFromProfile,
    fee: 10,
    feePaid: true,
    paymentMethod: "Debit / Credit Card",
    transactionId: "DEMOTXN18220945",
    response: {
      summary:
        "Eleven circulars issued during the period were provided as a single compiled annexure. The applicant confirmed the information was complete and the file was closed.",
      document: "Response-RTI-2026-MHA-619827.pdf",
      date: "09 Aug 2026",
    },
    timeline: [
      {
        stage: "created",
        detail: "You created this application.",
        time: "12 Jul 2026 · 11:15",
      },
      {
        stage: "fee",
        detail: "₹10 paid by card.",
        time: "12 Jul 2026 · 11:18",
      },
      {
        stage: "submitted",
        detail: "Lodged with the Ministry of Home Affairs.",
        time: "12 Jul 2026 · 11:19",
      },
      {
        stage: "assigned",
        detail: "Assigned to Under Secretary (RTI Cell).",
        time: "15 Jul 2026 · 10:40",
      },
      {
        stage: "review",
        detail: "Circulars were compiled by the disaster management division.",
        time: "28 Jul 2026 · 13:00",
      },
      {
        stage: "response",
        detail: "Compiled annexure of 11 circulars provided.",
        time: "09 Aug 2026 · 17:25",
      },
      {
        stage: "closed",
        detail: "You marked this application as resolved.",
        time: "14 Aug 2026 · 08:50",
      },
    ],
  },
  {
    registration: "RTI/2026/NIC/117340",
    authority: "National Informatics Centre",
    date: "25 Aug 2026",
    status: "Submitted",
    updated: "Yesterday, 17:05",
    subject: "Uptime records for public service portals",
    request:
      "Please provide the monthly availability and downtime records for citizen-facing portals hosted by the National Informatics Centre between January 2026 and July 2026.",
    applicant: applicantFromProfile,
    fee: 10,
    feePaid: true,
    paymentMethod: "UPI",
    transactionId: "DEMOTXN51043662",
    timeline: [
      {
        stage: "created",
        detail: "You created this application.",
        time: "25 Aug 2026 · 16:58",
      },
      {
        stage: "fee",
        detail: "₹10 paid via UPI.",
        time: "25 Aug 2026 · 17:04",
      },
      {
        stage: "submitted",
        detail: "Lodged with the National Informatics Centre.",
        time: "25 Aug 2026 · 17:05",
      },
    ],
  },
  {
    registration: "DRAFT/2026/UGC/452198",
    authority: "University Grants Commission",
    date: "26 Aug 2026",
    status: "Draft",
    updated: "Today, 09:18",
    subject: "Autonomous college recognition records",
    request:
      "Please provide the list of colleges granted autonomous status in Bihar since 2023 along with the inspection reports relied upon.",
    applicant: applicantFromProfile,
    fee: 10,
    feePaid: false,
    timeline: [
      {
        stage: "created",
        detail: "Saved as a draft. Continue when you are ready.",
        time: "26 Aug 2026 · 09:18",
      },
    ],
  },
];

export const seedAppeals: Appeal[] = [
  {
    reference: "APL/2026/CPWD/3471",
    applicationRegistration: "RTI/2026/CPWD/905613",
    authority: "Central Public Works Department",
    subject: "Maintenance expenditure on government quarters",
    date: "21 Aug 2026",
    status: "Appeal Under Review",
    updated: "25 Aug 2026",
    ground: "Information was refused or denied",
    explanation:
      "The CPIO declined the request under section 7(9), which permits a change in the form of access but is not a ground for refusing information altogether. The records sought are held in a single divisional register and are not voluminous.",
    relief:
      "Direct the CPIO to provide the work-wise maintenance expenditure and copies of the work orders, in electronic form if that is less burdensome.",
    timeline: [
      {
        stage: "appeal-filed",
        detail: "You filed a first appeal.",
        time: "21 Aug 2026 · 12:40",
      },
      {
        stage: "appeal-registered",
        detail: "Registered with Superintending Engineer (Coordination), CPWD.",
        time: "22 Aug 2026 · 10:15",
      },
      {
        stage: "appeal-review",
        detail: "The appellate authority sought comments from the CPIO.",
        time: "25 Aug 2026 · 15:30",
      },
    ],
  },
];

function iso(daysAgo: number, hour: number, minute: number): string {
  const date = new Date();
  date.setDate(date.getDate() - daysAgo);
  date.setHours(hour, minute, 0, 0);
  return date.toISOString();
}

export const seedNotifications: Notification[] = [
  {
    id: "seed-1",
    title: "Response available",
    message:
      "The Ministry of Education has replied to RTI/2026/EDU/238491. A document is ready to download.",
    read: false,
    createdAt: iso(2, 12, 30),
    href: "/applications/RTI%2F2026%2FEDU%2F238491",
    kind: "response",
  },
  {
    id: "seed-2",
    title: "Appeal under review",
    message:
      "The appellate authority has sought comments from the CPIO on APL/2026/CPWD/3471.",
    read: false,
    createdAt: iso(1, 15, 30),
    href: "/dashboard",
    kind: "appeal",
  },
  {
    id: "seed-3",
    title: "Status updated",
    message: "RTI/2026/RAIL/482917 is now under review by the CPIO.",
    read: false,
    createdAt: iso(0, 10, 42),
    href: "/applications/RTI%2F2026%2FRAIL%2F482917",
    kind: "status",
  },
  {
    id: "seed-4",
    title: "Payment pending",
    message:
      "RTI/2026/FIN/781204 has not been submitted yet. Complete the ₹10 fee payment to lodge it.",
    read: true,
    createdAt: iso(3, 20, 2),
    href: "/applications/RTI%2F2026%2FFIN%2F781204",
    kind: "payment",
  },
  {
    id: "seed-5",
    title: "Draft saved",
    message:
      "Your University Grants Commission draft is saved and ready to continue.",
    read: true,
    createdAt: iso(0, 9, 18),
    href: "/applications/DRAFT%2F2026%2FUGC%2F452198",
    kind: "draft",
  },
];
