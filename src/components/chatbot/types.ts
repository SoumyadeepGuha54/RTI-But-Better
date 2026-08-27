import type { Authority } from "../../data/authorities";

export type ChatAction = { label: string; kind: "navigate" | "select_authority" | "use_suggestion"; value?: string | number };
export type ChatMessage = { id: string; role: "assistant" | "user"; content: string; kind?: "text" | "analysis"; actions?: ChatAction[]; timestamp?: number };
export type DraftSnapshot = { subject: string; request: string; authority?: { id: number; name: string; category: string; description: string } | null };
export type FormBridge = DraftSnapshot & { selectAuthority?: (authority: Authority) => void; useSuggestion?: (request: string) => void };
