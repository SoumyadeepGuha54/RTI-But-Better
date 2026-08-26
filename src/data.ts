export type Status =
  | "Draft"
  | "Payment Pending"
  | "Submitted"
  | "Under Review"
  | "Response Available"
  | "First Appeal Filed"
  | "Closed";
export type Application = {
  registration: string;
  authority: string;
  date: string;
  status: Status;
  updated: string;
  subject: string;
  payment: string;
  timeline: { title: string; detail: string; time: string }[];
};

export const authorities = [
  [
    "Ministry of Education",
    "Central Ministry",
    "Education policy, grants and institutions",
  ],
  [
    "Ministry of Railways",
    "Central Ministry",
    "Rail services, infrastructure and passenger information",
  ],
  [
    "Ministry of Finance",
    "Central Ministry",
    "Economic affairs and public finance",
  ],
  [
    "Ministry of Home Affairs",
    "Central Ministry",
    "Internal security and administration",
  ],
  [
    "Ministry of Health and Family Welfare",
    "Central Ministry",
    "Public health programmes and policy",
  ],
  [
    "Central Public Works Department",
    "Organisation",
    "Government construction and public works",
  ],
  [
    "National Informatics Centre",
    "Organisation",
    "Digital government services",
  ],
  [
    "Department of Personnel & Training",
    "Central Department",
    "Public service and administrative matters",
  ],
  [
    "Ministry of Environment, Forest and Climate Change",
    "Central Ministry",
    "Environmental policy and programmes",
  ],
  ["Indian Railways", "Organisation", "Railway zones and operations"],
  [
    "Department of Telecommunications",
    "Central Department",
    "Telecom policy and services",
  ],
  [
    "Food Corporation of India",
    "Organisation",
    "Food security and procurement",
  ],
].map(([name, category, description], id) => ({
  id,
  name,
  category,
  description,
}));

export const mockApplications: Application[] = [
  {
    registration: "RTI/2026/RAIL/482917",
    authority: "Ministry of Railways",
    date: "18 Aug 2026",
    status: "Under Review",
    updated: "Today, 10:42",
    subject: "Records relating to station accessibility work",
    payment: "Paid",
    timeline: [
      {
        title: "Application submitted",
        detail: "Your RTI application was received.",
        time: "18 Aug 2026 · 10:30",
      },
      {
        title: "Received by public authority",
        detail: "The request was assigned to the CPIO.",
        time: "19 Aug 2026 · 09:15",
      },
      {
        title: "Under review",
        detail: "The authority is preparing a response.",
        time: "25 Aug 2026 · 10:42",
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
    payment: "Paid",
    timeline: [
      {
        title: "Application submitted",
        detail: "Your request was received.",
        time: "07 Aug 2026",
      },
      {
        title: "Response available",
        detail: "A response document is ready to download.",
        time: "24 Aug 2026",
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
    payment: "Pending",
    timeline: [
      {
        title: "Draft created",
        detail: "You saved an application.",
        time: "23 Aug 2026",
      },
      {
        title: "Awaiting payment",
        detail: "Complete the demo payment to submit.",
        time: "23 Aug 2026",
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
    payment: "Paid",
    timeline: [
      {
        title: "Application submitted",
        detail: "Your application was received.",
        time: "12 Jul 2026",
      },
      {
        title: "Closed",
        detail: "The application has been completed.",
        time: "14 Aug 2026",
      },
    ],
  },
  {
    registration: "DRAFT/2026/CPWD/452198",
    authority: "Central Public Works Department",
    date: "26 Aug 2026",
    status: "Draft",
    updated: "Today, 09:18",
    subject: "Project completion record request",
    payment: "Not started",
    timeline: [
      {
        title: "Draft created",
        detail: "Continue when you are ready.",
        time: "Today, 09:18",
      },
    ],
  },
];

export const help = [
  [
    "Getting started",
    "What is an RTI application?",
    "An RTI application is a request for records or information held by a public authority.",
  ],
  [
    "Filing an application",
    "How do I select an authority?",
    "Search by authority name, department, or category before you begin your request.",
  ],
  [
    "Filing an application",
    "How can I write a clear request?",
    "Ask for identifiable records, include relevant dates, and avoid unnecessary personal information.",
  ],
  [
    "Payments",
    "What happens if payment fails?",
    "No money is charged in this demonstration. You can retry safely from the application.",
  ],
  [
    "Tracking",
    "Where can I find my registration number?",
    "It appears on the acknowledgement and in your application history after submission.",
  ],
  [
    "Appeals",
    "What is a First Appeal?",
    "You may file one if no response has been received or you disagree with a decision.",
  ],
  [
    "Account help",
    "How do I view application history?",
    "Sign in and select My Applications from the main navigation.",
  ],
];
