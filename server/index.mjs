import http from "node:http";
import fs from "node:fs";
import { generateAiResponse } from "./ai/client.mjs";

// Load local development secrets without sending them to the Vite client.
try {
  const envFile = fs.readFileSync(new URL("../.env", import.meta.url), "utf8");
  for (const line of envFile.split(/\r?\n/)) {
    const match = line.match(/^\s*([A-Z0-9_]+)\s*=\s*(.*)\s*$/);
    if (match && !process.env[match[1]]) process.env[match[1]] = match[2].replace(/^['"]|['"]$/g, "");
  }
} catch { /* .env is optional: the API returns a safe fallback when absent. */ }

const port = Number(process.env.PORT || 8787);
const windows = new Map();
function allowRequest(ip) { const now = Date.now(); const active = (windows.get(ip) || []).filter((time) => now - time < 60_000); if (active.length >= 20) return false; active.push(now); windows.set(ip, active); return true; }
function send(res, status, body) { res.writeHead(status, { "content-type": "application/json", "cache-control": "no-store" }); res.end(JSON.stringify(body)); }
const server = http.createServer(async (req, res) => {
  if (req.method !== "POST" || req.url !== "/api/chat") return send(res, 404, { error: "Not found" });
  if (!allowRequest(req.socket.remoteAddress || "unknown")) return send(res, 429, { error: "Too many requests" });
  let raw = ""; for await (const chunk of req) { raw += chunk; if (raw.length > 20_000) return send(res, 413, { error: "Request too large" }); }
  try {
    const body = JSON.parse(raw || "{}"); const message = typeof body.message === "string" ? body.message.trim() : "";
    if (!message || message.length > 1200) return send(res, 400, { error: "Invalid message" });
    const history = Array.isArray(body.conversationHistory) ? body.conversationHistory.slice(-12).filter((item) => item && (item.role === "user" || item.role === "assistant") && typeof item.content === "string").map((item) => ({ role: item.role, content: item.content.slice(0, 2000) })) : [];
    const context = body.context && typeof body.context === "object" ? body.context : undefined;
    const answer = await generateAiResponse({ message, history, context });
    return send(res, 200, answer);
  } catch (error) { console.error("Chat API error", error instanceof Error ? error.message : "unknown"); return send(res, 502, { error: "Assistant unavailable" }); }
});
server.listen(port, () => console.log(`RTI chat API listening on ${port}`));
