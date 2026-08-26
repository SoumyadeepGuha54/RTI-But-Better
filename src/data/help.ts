/** Help centre content: grouped FAQs rendered as an accordion. */

export type HelpTopic = {
  category: string;
  question: string;
  answer: string;
};

export const helpCategories = [
  "Getting started",
  "Filing an application",
  "Fees and payment",
  "Tracking",
  "Appeals",
  "Your account",
];

export const helpTopics: HelpTopic[] = [
  {
    category: "Getting started",
    question: "What is an RTI application?",
    answer:
      "Under the Right to Information Act, 2005, any citizen of India may request records or information held by a public authority. The authority must normally reply within 30 days.",
  },
  {
    category: "Getting started",
    question: "Who can file an RTI application?",
    answer:
      "Any citizen of India. You do not need to give a reason for your request, and you cannot be asked to justify why you want the information.",
  },
  {
    category: "Getting started",
    question: "Is this a real government portal?",
    answer:
      "No. This is a demonstration built for a hackathon. Every application, payment, notification and response you see is mock data stored only in your own browser.",
  },
  {
    category: "Filing an application",
    question: "How do I choose the right public authority?",
    answer:
      "Pick the authority most likely to actually hold the records. Search by ministry, department or organisation name. If you choose wrongly, the authority is required to transfer your application within five days.",
  },
  {
    category: "Filing an application",
    question: "How do I write a clear request?",
    answer:
      'Ask for identifiable records rather than opinions or explanations. Include relevant dates, file numbers or locations. Requests that ask "why" tend to be refused; requests that ask for a specific document tend to succeed.',
  },
  {
    category: "Filing an application",
    question: "What information cannot be requested?",
    answer:
      "Section 8 of the Act exempts certain categories, including information affecting national security, matters that would impede an investigation, and unwarranted invasions of personal privacy.",
  },
  {
    category: "Filing an application",
    question: "Do I need to attach documents?",
    answer:
      "Usually not. Attach something only if it helps identify the records you want, such as a previous reference number. Never upload identity documents you were not asked for.",
  },
  {
    category: "Fees and payment",
    question: "What does an application cost?",
    answer:
      'The standard application fee is ₹10. Applicants below the poverty line are exempt on production of proof. In this demo you can select "Fee exempt" to see that path.',
  },
  {
    category: "Fees and payment",
    question: "What happens if payment fails?",
    answer:
      'No money is ever charged in this demonstration. If a payment does not complete, the application stays in your dashboard as "Payment Pending" and you can retry from the application page.',
  },
  {
    category: "Tracking",
    question: "Where do I find my registration number?",
    answer:
      "It appears on the acknowledgement screen immediately after you submit, and on every application in your dashboard. It looks like RTI/2026/RAIL/482917.",
  },
  {
    category: "Tracking",
    question: "Can I track an application without signing in?",
    answer:
      "Yes. Enter the registration number on the tracking page and confirm the one-time code sent to the registered mobile number. You will see the current status without needing an account.",
  },
  {
    category: "Appeals",
    question: "What is a first appeal?",
    answer:
      "If you receive no reply within 30 days, or you are unhappy with the reply, you may appeal to the First Appellate Authority of the same public authority. There is no fee for a first appeal.",
  },
  {
    category: "Appeals",
    question: "How long do I have to appeal?",
    answer:
      "A first appeal should normally be filed within 30 days of receiving the decision, or within 30 days of the date a reply was due. The appellate authority should decide within 30 days.",
  },
  {
    category: "Appeals",
    question: "What if my appeal is also rejected?",
    answer:
      "You may then file a second appeal with the Central Information Commission. That stage is outside the scope of this demo.",
  },
  {
    category: "Your account",
    question: "How do I sign in to the demo?",
    answer:
      "Use demo@example.com with the password demo1234. The sign-in screen pre-fills these for you, and a single button fills them in if you clear the fields.",
  },
  {
    category: "Your account",
    question: "Where is my data stored?",
    answer:
      'Entirely in your browser, using local storage. Nothing is sent to a server. Clearing your browser data — or using "Reset demo data" on your profile — returns the app to its starting state.',
  },
];
