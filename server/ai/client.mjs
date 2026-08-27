import { systemPrompt } from "./prompt.mjs";

const GEMINI_FALLBACK_MODELS = [
  "gemini-3.6-flash",
  "gemini-3.7-flash",
  "gemini-flash-latest",
  "gemini-3.5-flash"
];

async function callGemini({ apiKey, model, message, history, context }) {
  const contextMessage = context ? `Portal context (use only if present): ${JSON.stringify(context)}` : "";
  const fullSystemPrompt = contextMessage ? `${systemPrompt}\n\n${contextMessage}` : systemPrompt;

  const contents = [];
  if (Array.isArray(history)) {
    for (const item of history) {
      if (item && typeof item.content === "string" && item.content.trim()) {
        const role = item.role === "assistant" ? "model" : "user";
        contents.push({
          role,
          parts: [{ text: item.content }]
        });
      }
    }
  }
  contents.push({
    role: "user",
    parts: [{ text: message }]
  });

  const payload = {
    system_instruction: {
      parts: [{ text: fullSystemPrompt }]
    },
    contents,
    generationConfig: {
      temperature: 0.2,
      maxOutputTokens: 800
    }
  };

  const modelsToTry = [model, ...GEMINI_FALLBACK_MODELS.filter((m) => m !== model)];
  let lastError = null;

  for (const currentModel of modelsToTry) {
    if (!currentModel) continue;
    try {
      const cleanModel = currentModel.replace(/^models\//, "");
      const endpoint = `https://generativelanguage.googleapis.com/v1beta/models/${cleanModel}:generateContent?key=${encodeURIComponent(apiKey)}`;
      const response = await fetch(endpoint, {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify(payload),
        signal: AbortSignal.timeout(20000)
      });

      if (response.status === 404) {
        lastError = new Error(`Gemini model ${cleanModel} not available (404)`);
        continue;
      }

      if (!response.ok) {
        const errBody = await response.text();
        throw new Error(`Gemini API error (${response.status}): ${errBody}`);
      }

      const data = await response.json();
      const text = data?.candidates?.[0]?.content?.parts?.[0]?.text;
      if (typeof text !== "string" || !text.trim()) {
        throw new Error("Gemini API returned empty response");
      }

      return { configured: true, content: text.trim().slice(0, 5000) };
    } catch (err) {
      lastError = err;
      if (err.message && err.message.includes("404")) {
        continue;
      }
      throw err;
    }
  }

  throw lastError || new Error("Failed to get response from Gemini API");
}

async function callOpenAi({ apiKey, endpoint, model, message, history, context }) {
  const contextMessage = context ? `Portal context (use only if present): ${JSON.stringify(context)}` : "";
  const messages = [
    { role: "system", content: systemPrompt },
    ...(contextMessage ? [{ role: "system", content: contextMessage }] : []),
    ...(Array.isArray(history) ? history : []),
    { role: "user", content: message }
  ];

  const response = await fetch(endpoint, {
    method: "POST",
    headers: {
      "content-type": "application/json",
      authorization: `Bearer ${apiKey}`
    },
    body: JSON.stringify({
      model,
      temperature: 0.2,
      max_tokens: 600,
      messages
    }),
    signal: AbortSignal.timeout(20000)
  });

  if (!response.ok) {
    const errText = await response.text();
    throw new Error(`OpenAI provider error (${response.status}): ${errText}`);
  }

  const body = await response.json();
  const content = body?.choices?.[0]?.message?.content;
  if (typeof content !== "string" || !content.trim()) {
    throw new Error("AI provider returned no content");
  }

  return { configured: true, content: content.trim().slice(0, 5000) };
}

export async function generateAiResponse({ message, history, context }) {
  const geminiKey = process.env.GEMINI_API_KEY || process.env.GOOGLE_API_KEY;
  const genericKey = process.env.AI_API_KEY || process.env.OPENAI_API_KEY;
  const provider = (process.env.AI_PROVIDER || (geminiKey ? "gemini" : genericKey ? "openai" : "")).toLowerCase();

  const apiKey = geminiKey || genericKey;
  if (!apiKey) {
    return {
      configured: false,
      content: "AI assistance is not currently configured. You can still use the available RTI help topics."
    };
  }

  if (provider === "gemini" || (!process.env.AI_PROVIDER && geminiKey)) {
    const model = process.env.GEMINI_MODEL || process.env.AI_MODEL || "gemini-3.6-flash";
    return await callGemini({ apiKey: geminiKey || apiKey, model, message, history, context });
  }

  const endpoint = process.env.AI_API_URL || "https://api.openai.com/v1/chat/completions";
  const model = process.env.AI_MODEL || process.env.OPENAI_MODEL || "gpt-4o-mini";
  return await callOpenAi({ apiKey, endpoint, model, message, history, context });
}

