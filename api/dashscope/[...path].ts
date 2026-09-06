// Vercel Serverless: 代理 DashScope API，注入 API Key，避免浏览器暴露。
// 浏览器调用：POST /api/dashscope/services/aigc/multimodal-generation/generation
// 或 POST /api/dashscope/services/aigc/image-generation/generation
// 或 GET  /api/dashscope/tasks/<task_id>
import type { VercelRequest, VercelResponse } from "@vercel/node";
import { Readable } from "node:stream";

const ALLOW_ORIGIN = "*";
const WORKSPACE = process.env.ALIYUN_WORKSPACE_ID!;
const KEY = process.env.DASHSCOPE_API_KEY!;

// Node 18+ 在 Vercel 默认 fetch 已可用。
async function readBody(req: VercelRequest): Promise<string> {
  return await new Promise<string>((resolve, reject) => {
    const chunks: Buffer[] = [];
    req.on("data", (c: Buffer) => chunks.push(c));
    req.on("end", () => resolve(Buffer.concat(chunks).toString("utf8")));
    req.on("error", reject);
  });
}

export default async function handler(
  req: VercelRequest,
  res: VercelResponse,
) {
  // CORS 预检
  if (req.method === "OPTIONS") {
    res.setHeader("Access-Control-Allow-Origin", ALLOW_ORIGIN);
    res.setHeader(
      "Access-Control-Allow-Headers",
      "Content-Type, X-DashScope-Async",
    );
    res.setHeader(
      "Access-Control-Allow-Methods",
      "GET, POST, OPTIONS",
    );
    return res.status(204).end();
  }

  if (!WORKSPACE || !KEY) {
    return res.status(500).json({ error: "missing env" });
  }

  const path = (req.query.path as string[] | undefined)?.join("/") || "";
  const upstream = `https://${WORKSPACE}.cn-beijing.maas.aliyuncs.com/api/v1/${path}`;

  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    Authorization: `Bearer ${KEY}`,
  };
  const asyncFlag = req.headers["x-dashscope-async"];
  if (asyncFlag) headers["X-DashScope-Async"] = String(asyncFlag);

  try {
    const body =
      req.method === "GET" || req.method === "HEAD"
        ? undefined
        : await readBody(req);

    const upstreamRes = await fetch(upstream, {
      method: req.method,
      headers,
      body,
    });

    res.setHeader("Access-Control-Allow-Origin", ALLOW_ORIGIN);
    res.setHeader(
      "Access-Control-Allow-Headers",
      "Content-Type, X-DashScope-Async",
    );
    res.setHeader(
      "Access-Control-Allow-Methods",
      "GET, POST, OPTIONS",
    );

    res.status(upstreamRes.status);
    upstreamRes.headers.forEach((value, key) => {
      // 不要透传 content-encoding，避免解码混乱
      if (key.toLowerCase() === "content-encoding") return;
      res.setHeader(key, value);
    });

    if (upstreamRes.body) {
      // @ts-expect-error - web ReadableStream 与 node Readable 互通
      Readable.fromWeb(upstreamRes.body).pipe(res);
    } else {
      res.end();
    }
  } catch (e) {
    res.setHeader("Access-Control-Allow-Origin", ALLOW_ORIGIN);
    res.status(502).json({ error: String(e) });
  }
}

export const config = {
  api: { bodyParser: false },
};
