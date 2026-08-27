import { authorities, type Authority } from "../../data/authorities";
import type { Application } from "../../lib/types";
import type { ChatAction, DraftSnapshot } from "./types";

export const welcome = "Hello. I'm your RTI Assistant.\n\nI can help you understand the filing process, choose a public authority, improve your RTI request, track applications, and guide you through the next steps.";

export function matchAuthorities(query: string): Authority[] {
  const terms = query.toLowerCase().match(/[a-z]{3,}/g) ?? [];
  const hints: Record<string, string[]> = { railways: ["train", "rail", "station", "coach", "route", "cancellation", "delay"], education: ["school", "college", "university", "scholarship", "student", "education"], health: ["hospital", "health", "medical", "medicine"], environment: ["forest", "climate", "environment", "pollution"], housing: ["housing", "metro", "urban", "construction"], finance: ["budget", "tax", "expenditure", "finance"], telecommunications: ["telecom", "phone", "spectrum", "internet"], consumer: ["consumer", "price", "standard"], personnel: ["recruitment", "government job", "service rule"] };
  return authorities.map((authority) => {
    const text = `${authority.name} ${authority.description}`.toLowerCase();
    const related = Object.entries(hints).find(([key]) => text.includes(key))?.[1] ?? [];
    const score = terms.reduce((sum, term) => sum + (text.includes(term) ? 3 : 0) + (related.some((hint) => term.includes(hint) || hint.includes(term)) ? 2 : 0), 0);
    return { authority, score };
  }).filter((item) => item.score > 0).sort((a, b) => b.score - a.score).slice(0, 3).map((item) => item.authority);
}

export function analyseRequest(draft: DraftSnapshot) {
  const text = `${draft.subject} ${draft.request}`.trim();
  const hasPeriod = /\b(20\d{2}|from|between|during|month|year|january|february|march|april|may|june|july|august|september|october|november|december)\b/i.test(text);
  const records = /\b(record|report|document|copy|correspondence|register|file|order|tender|statement|certificate)\b/i.test(text);
  const asksWhy = /\bwhy\b|explain/i.test(text);
  const missing: string[] = [];
  if (!draft.request.trim()) missing.push("Add the information or records you want to receive.");
  if (text.length < 55) missing.push("Add more detail so the records can be identified.");
  if (!hasPeriod) missing.push("Consider including a relevant date range.");
  if (!records) missing.push("Ask for identifiable records, reports, copies, or correspondence where possible.");
  if (asksWhy) missing.push("This asks for an explanation. Consider requesting the records that document the reasons instead.");
  const level = missing.length >= 3 ? "Needs improvement" : missing.length ? "Good" : "Very clear";
  const subject = draft.subject || "[Subject / service]";
  const suggestion = `Please provide the following records relating to ${subject} for [Location] during the period from [Start Date] to [End Date]:\n\n1. Copies of relevant records, reports, and correspondence.\n2. The recorded reasons for the matter, if available in the records.\n3. Details of action taken, with supporting documents.`;
  return { level, missing, suggestion };
}

export function getLocalResponse(message: string, draft: DraftSnapshot | undefined, applications: Application[]) {
  const text = message.toLowerCase().trim();
  const navigation = (label: string, value: string): ChatAction[] => [{ label, kind: "navigate", value }];
  if (/^(hi|hello|hey)\b/.test(text)) return { content: "Hello. What would you like help with today?" };
  if (/(improve|rewrite|clear|write this|request)/.test(text)) {
    const analysis = analyseRequest(draft ?? { subject: "", request: message });
    return { content: `${analysis.level}\n\n${analysis.missing.join(" ") || "Your request is focused and asks for identifiable records."}\n\nSuggested version:\n${analysis.suggestion}`, kind: "analysis" as const, actions: draft?.request ? [{ label: "Use suggested version", kind: "use_suggestion" as const, value: analysis.suggestion }] : undefined };
  }
  if (/(authority|department|ministry|rail|train|school|hospital|telecom|budget|environment)/.test(text)) {
    const found = matchAuthorities(message);
    return { content: found.length ? `Based on what you've described, these authorities may be relevant. The authority most likely to hold the records is usually the best starting point.` : "I can help narrow this down. What information are you trying to obtain, and which service or organisation is involved?", authorities: found };
  }
  if (/(document|upload|file type|identity| id\b)/.test(text)) return { content: "Supporting documents are optional unless they are relevant to processing your request. This portal accepts PDF, JPG, JPEG and PNG files up to 10 MB. Avoid uploading unnecessary identity documents or unrelated personal information." };
  if (/(pay|payment|fee)/.test(text)) return { content: "Payment in this prototype is demo/mock functionality. No real money is processed. The normal application fee displayed in this portal is ₹10 unless the selected fee exemption applies." };
  if (/(appeal|no response|denied|incomplete response)/.test(text)) return { content: "You can begin a first appeal from the First Appeal section. Select the related RTI application and describe whether there was no response, an incomplete response, a denial, or another issue. Starting an appeal never submits it automatically.", actions: navigation("Go to First Appeal", "/appeal") };
  if (/(track|status|under review|response available|application)/.test(text)) {
    const app = applications.find((item) => text.includes(item.registration.toLowerCase())) ?? applications.find((item) => item.status === "Under Review") ?? applications[0];
    if (!app) return { content: "I can't find an application in this demo profile. You can file a new RTI from the portal." };
    const explainer: Record<string, string> = { "Under Review": "generally means the authority is examining the request and collecting relevant records.", "Response Available": "means a mock response document is available in this demo.", Submitted: "means the application has been lodged with the authority.", Draft: "means it has been saved but has not been submitted." };
    return { content: `${app.registration} is currently marked as ${app.status}. ${explainer[app.status] ?? "Check the application timeline for the next step."} This is demo data, not an official record.`, actions: navigation("View application", `/applications/${encodeURIComponent(app.registration)}`) };
  }
  if (/(file|start|how do i)/.test(text)) return { content: "You can start a new application from File RTI. The portal will guide you through applicant details, the public authority, your request, documents, review, and demo payment.", actions: navigation("Go to File RTI", "/file-rti") };
  return undefined;
}

/** Compatibility entry point for the request-form improvement action. */
export function getResponse(message: string, draft: DraftSnapshot | undefined, applications: Application[]) {
  return getLocalResponse(message, draft, applications) ?? { content: "I can help with filing, choosing an authority, improving a request, documents, tracking, or a first appeal." };
}
