// Vercel Serverless Function：隔离 OpenAI 图片生成密钥，浏览器永远不会接触 OPENAI_API_KEY。
import type { VercelRequest, VercelResponse } from "@vercel/node";

const MAX_PROMPT_LENGTH = 6_000;

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    return res.status(405).json({ error: "method_not_allowed" });
  }

  const prompt = typeof req.body?.prompt === "string" ? req.body.prompt.trim() : "";
  if (!prompt || prompt.length > MAX_PROMPT_LENGTH) {
    return res.status(400).json({ error: "invalid_prompt" });
  }

  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) {
    return res.status(503).json({ error: "image_generation_unavailable" });
  }

  try {
    const upstream = await fetch("https://api.openai.com/v1/images/generations", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "gpt-image-2",
        prompt,
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

    // 仅返回单张 WebP 的 base64，不记录提示词或图像内容，避免在函数日志留下创作内容。
    return res.status(200).json({
      image: { b64_json: image.b64_json, mime_type: "image/webp" },
    });
  } catch {
    return res.status(502).json({ error: "image_generation_failed" });
  }
}
