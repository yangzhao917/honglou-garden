// DashScope 通义万相文生图客户端。
// 通过同源代理 /api/dashscope/* 调用，避免浏览器跨域与 API Key 泄露。
// 当前百炼文生图统一走 wan2.6 异步任务流：POST 创建任务 → GET 轮询结果。
import { NEGATIVE_PROMPT } from "./poemArt";

const BASE = "/api/dashscope";

export interface ImageGenOptions {
  prompt: string;
  /** 随机种子；相同种子得到更接近的图 */
  seed?: number;
  /** 1:1 / 3:4 / 16:9 等 */
  size?: string;
  signal?: AbortSignal;
}

export interface ImageGenResult {
  url: string;
}

/** 异步调用 wan2.6-t2i：先创建任务，再轮询。 */
export async function generateImage(
  opts: ImageGenOptions,
): Promise<ImageGenResult | null> {
  const {
    prompt,
    seed = Math.floor(Math.random() * 2_000_000_000),
    size = "1024*1024",
    signal,
  } = opts;

  // 1) 创建任务
  const create = await fetch(
    `${BASE}/services/aigc/image-generation/generation`,
    {
      method: "POST",
      signal,
      headers: {
        "Content-Type": "application/json",
        "X-DashScope-Async": "enable",
      },
      body: JSON.stringify({
        model: "wan2.6-t2i",
        input: {
          messages: [{ role: "user", content: [{ text: prompt }] }],
        },
        parameters: {
          prompt_extend: true,
          watermark: false,
          n: 1,
          negative_prompt: NEGATIVE_PROMPT,
          size,
          seed,
        },
      }),
    },
  );
  const cj = await create.json().catch(() => null);
  if (!create.ok || !cj?.output?.task_id) {
    console.warn("[dashScope] async create failed", cj);
    return null;
  }
  const taskId: string = cj.output.task_id;

  // 2) 轮询：起始 2s，递增到 4s，最长 110s
  const startedAt = Date.now();
  let delay = 2000;
  while (Date.now() - startedAt < 110_000) {
    if (signal?.aborted) return null;
    await new Promise((r) => setTimeout(r, delay));
    delay = Math.min(4000, Math.floor(delay * 1.2));
    const r = await fetch(`${BASE}/tasks/${taskId}`, { signal });
    if (!r.ok) continue;
    const j = await r.json().catch(() => null);
    if (!j?.output) continue;
    const st = j.output.task_status;
    if (st === "SUCCEEDED") {
      const url = j.output?.results?.[0]?.url;
      if (url) return { url };
      return null;
    }
    if (st === "FAILED" || st === "CANCELED" || st === "UNKNOWN") {
      console.warn("[dashScope] async task terminal", st, j.output);
      return null;
    }
  }
  console.warn("[dashScope] async timeout");
  return null;
}

/** 仅检查代理是否可达（首屏可探测，方便 UI 给出更准的提示） */
export async function checkReachable(signal?: AbortSignal): Promise<boolean> {
  try {
    const r = await fetch(`${BASE}/services/aigc/image-generation/generation`, {
      method: "OPTIONS",
      signal,
    });
    return r.ok || r.status === 204 || r.status === 405;
  } catch {
    return false;
  }
}
