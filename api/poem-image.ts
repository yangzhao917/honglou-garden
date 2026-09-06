// Vercel Function：浏览器只提交已收录诗词 ID，密钥与最终提示词均留在服务端。
import type { VercelRequest, VercelResponse } from "@vercel/node";
import { buildPoemPrompt } from "../src/application/poemArt";
import { literary } from "../src/infrastructure/catalog";

const MAX_BODY_BYTES = 512;
const WINDOW_MS = 10 * 60 * 1_000;
const MAX_REQUESTS_PER_WINDOW = 6;
const MAX_CONCURRENT_REQUESTS = 2;
const UPSTREAM_TIMEOUT_MS = 50_000;

type RateState = { count: number; resetAt: number };
const rateByAddress = new Map<string, RateState>();
let activeRequests = 0;

function callerAddress(req: VercelRequest): string {
  const forwarded = req.headers["x-forwarded-for"];
  const value = Array.isArray(forwarded) ? forwarded[0] : forwarded;
  return value?.split(",")[0]?.trim() || "unknown";
}

function isSameOrigin(req: VercelRequest): boolean {
  const origin = req.headers.origin;
  const host = req.headers["x-forwarded-host"] || req.headers.host;
  if (!origin || !host || Array.isArray(origin) || Array.isArray(host)) return false;

  try {
    return new URL(origin).host === host;
  } catch {
    return false;
  }
}

function consumeRateLimit(address: string, now = Date.now()): RateState | null {
  // Serverless 实例可能复用；定期清理过期地址，避免限流表随访问量持续增长。
  if (rateByAddress.size > 5_000) {
    for (const [key, state] of rateByAddress) {
      if (state.resetAt <= now) rateByAddress.delete(key);
    }
  }
  const current = rateByAddress.get(address);
  if (!current || current.resetAt <= now) {
    const next = { count: 1, resetAt: now + WINDOW_MS };
    rateByAddress.set(address, next);
    return next;
  }
  if (current.count >= MAX_REQUESTS_PER_WINDOW) return null;
  current.count += 1;
  return current;
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  res.setHeader("Cache-Control", "no-store");
  res.setHeader("X-Content-Type-Options", "nosniff");

  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    return res.status(405).json({ error: "method_not_allowed" });
  }
  if (!isSameOrigin(req)) return res.status(403).json({ error: "invalid_origin" });

  const contentLength = Number(req.headers["content-length"] ?? 0);
  if (!Number.isFinite(contentLength) || contentLength > MAX_BODY_BYTES) {
    return res.status(413).json({ error: "request_too_large" });
  }

  const poemId = typeof req.body?.poemId === "string" ? req.body.poemId : "";
  const seed = Number(req.body?.seed);
  const poem = literary.find((entry) => entry.kind === "poem" && entry.id === poemId);
  if (!poem || !Number.isSafeInteger(seed) || seed < 0 || seed > 2_000_000_000) {
    return res.status(400).json({ error: "invalid_request" });
  }

  const rate = consumeRateLimit(callerAddress(req));
  if (!rate) {
    res.setHeader("Retry-After", String(Math.ceil(WINDOW_MS / 1_000)));
    return res.status(429).json({ error: "rate_limited" });
  }
  res.setHeader("X-RateLimit-Remaining", String(MAX_REQUESTS_PER_WINDOW - rate.count));

  if (activeRequests >= MAX_CONCURRENT_REQUESTS) {
    res.setHeader("Retry-After", "10");
    return res.status(429).json({ error: "service_busy" });
  }

  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) return res.status(503).json({ error: "image_generation_unavailable" });

  activeRequests += 1;
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), UPSTREAM_TIMEOUT_MS);

  try {
    const upstream = await fetch("https://api.openai.com/v1/images/generations", {
      method: "POST",
      signal: controller.signal,
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "gpt-image-2",
        prompt: buildPoemPrompt(poem, seed),
        n: 1,
        size: "1024x1024",
        quality: "low",
        output_format: "webp",
      }),
    });
    const body = await upstream.json().catch(() => null);
    const image = body?.data?.[0];

    if (!upstream.ok || !image?.b64_json) {
      console.error("OpenAI image generation failed", {
        status: upstream.status,
        requestId: upstream.headers.get("x-request-id"),
      });
      return res.status(502).json({ error: "image_generation_failed" });
    }

    // 不记录提示词或图像内容，避免在函数日志中留下创作内容。
    return res.status(200).json({
      image: { b64_json: image.b64_json, mime_type: "image/webp" },
    });
  } catch {
    return res.status(502).json({ error: "image_generation_failed" });
  } finally {
    clearTimeout(timeout);
    activeRequests -= 1;
  }
}
