import { generateAiResponse } from "../server/ai/client.mjs";

export default async function handler(req, res) {
  // Set CORS and headers
  res.setHeader("Cache-Control", "no-store, max-age=0");

  if (req.method !== "POST") {
    res.setHeader("Allow", ["POST"]);
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    let body = req.body;
    if (typeof body === "string") {
      try {
        body = JSON.parse(body);
      } catch {
        body = {};
      }
    } else if (!body || typeof body !== "object") {
      body = {};
    }

    const message = typeof body.message === "string" ? body.message.trim() : "";
    if (!message || message.length > 1200) {
      return res.status(400).json({ error: "Invalid message" });
    }

    const history = Array.isArray(body.conversationHistory)
      ? body.conversationHistory
          .slice(-12)
          .filter(
            (item) =>
              item &&
              (item.role === "user" || item.role === "assistant") &&
              typeof item.content === "string"
          )
          .map((item) => ({ role: item.role, content: item.content.slice(0, 2000) }))
      : [];

    const context = body.context && typeof body.context === "object" ? body.context : undefined;
    const answer = await generateAiResponse({ message, history, context });

    return res.status(200).json(answer);
  } catch (error) {
    console.error("Chat API error:", error instanceof Error ? error.message : error);
    return res.status(502).json({ error: "Assistant unavailable" });
  }
}
