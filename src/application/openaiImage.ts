// 诗词意境图的浏览器用例：只发送条目 ID 与随机种子，密钥和最终提示词留在服务端。

export interface ImageGenOptions {
  poemId: string;
  seed: number;
  signal?: AbortSignal;
}

export interface ImageGenResult {
  url: string;
}

export async function generateImage(
  options: ImageGenOptions,
): Promise<ImageGenResult | null> {
  const response = await fetch("/api/poem-image", {
    method: "POST",
    signal: options.signal,
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ poemId: options.poemId, seed: options.seed }),
  });
  const payload = await response.json().catch(() => null);

  if (!response.ok || !payload?.image?.b64_json || !payload?.image?.mime_type) {
    return null;
  }

  return {
    url: `data:${payload.image.mime_type};base64,${payload.image.b64_json}`,
  };
}
