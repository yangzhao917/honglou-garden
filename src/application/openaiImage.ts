// 诗词意境图的浏览器用例：只向同源服务端发送提示词，密钥始终留在服务端环境变量中。

export interface ImageGenOptions {
  prompt: string;
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
    body: JSON.stringify({ prompt: options.prompt }),
  });
  const payload = await response.json().catch(() => null);

  if (!response.ok || !payload?.image?.b64_json || !payload?.image?.mime_type) {
    return null;
  }

  return {
    url: `data:${payload.image.mime_type};base64,${payload.image.b64_json}`,
  };
}
