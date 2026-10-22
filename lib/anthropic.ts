// Minimal Anthropic Messages API call. Server-only: the key never reaches the browser.
export class AiError extends Error {
  constructor(public code: "no_key" | "upstream" | "empty", message: string) {
    super(message);
  }
}

export async function complete(opts: { model: string; system: string; user: string; maxTokens: number }): Promise<string> {
  const key = process.env.ANTHROPIC_API_KEY;
  if (!key) throw new AiError("no_key", "ANTHROPIC_API_KEY is not set");
  const res = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: { "x-api-key": key, "anthropic-version": "2023-06-01", "content-type": "application/json" },
    body: JSON.stringify({
      model: opts.model,
      max_tokens: opts.maxTokens,
      system: opts.system,
      messages: [{ role: "user", content: opts.user }],
    }),
    signal: AbortSignal.timeout(40_000),
  });
  if (!res.ok) throw new AiError("upstream", `Anthropic ${res.status}: ${(await res.text()).slice(0, 300)}`);
  const body = (await res.json()) as { content?: { type: string; text?: string }[] };
  const text = (body.content ?? []).filter((b) => b.type === "text").map((b) => b.text ?? "").join("");
  if (!text.trim()) throw new AiError("empty", "Empty response");
  return text;
}
