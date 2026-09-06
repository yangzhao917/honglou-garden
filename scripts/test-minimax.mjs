// 独立测试：直接调用 MiniMax 文生图 API，验证 MINIMAX_API_KEY 是否可用。
// 用黛玉《葬花吟》的 SCENE_BASE 拼一段英文 prompt，避开项目里所有代理逻辑。
// 用法：node scripts/test-minimax.mjs

import fs from "node:fs/promises";
import path from "node:path";

const API = "https://api.minimax.cn/v1/image_generation";
const KEY = process.env.MINIMAX_API_KEY;
if (!KEY) {
  console.error("❌ MINIMAX_API_KEY 未设置（检查 .env 或运行环境）");
  process.exit(1);
}

// 直接复用 src/application/poemArt.ts 里 zanghua 的画面基线，
// 保证 prompt 风格与项目正式调用一致。
const PROMPT = `[Style] classical Chinese gongbi painting blended with soft cinematic realism, hanging scroll composition with poetic negative space.
[Scene] a young woman in Hanfu burying fallen flower petals under a bamboo grove at dusk.
[Subjects] fallen peach and pear blossoms covering the ground, a flower hoe in her hand, bamboo basket on her back, long trailing weeping willows, mossy stone path and wooden garden door, wisteria trellis in the background.
[Mood] elegiac, fateful, spring sorrow, lone beauty.
[Palette] muted pink, ash brown, dusk indigo, bamboo green.
[Composition] profile of a solitary woman walking through drifts of fallen petals, soft golden hour light from behind.
[Quality] high detail, soft natural light, ink-wash atmosphere, no text, no watermark, no signature, no people faces in close-up, no modern elements, no anime.`;

const body = {
  model: "image-01",
  prompt: PROMPT,
  aspect_ratio: "1:1",
  response_format: "url", // 先拿 url，肉眼可见；通过后再考虑 base64
  n: 1,
  prompt_optimizer: true,
};

console.log("→ POST", API);
console.log("→ model:", body.model, "  aspect:", body.aspect_ratio, "  n:", body.n);

const t0 = Date.now();
const res = await fetch(API, {
  method: "POST",
  headers: {
    "Authorization": `Bearer ${KEY}`,
    "Content-Type": "application/json",
  },
  body: JSON.stringify(body),
});
const ms = Date.now() - t0;
console.log("← HTTP", res.status, "in", ms, "ms");

const text = await res.text();
let json;
try {
  json = JSON.parse(text);
} catch {
  console.error("❌ 响应不是 JSON：");
  console.error(text.slice(0, 800));
  process.exit(2);
}

if (!res.ok) {
  console.error("❌ HTTP 非 2xx：");
  console.error(JSON.stringify(json, null, 2).slice(0, 1500));
  process.exit(3);
}

const urls = json?.data?.image_urls ?? json?.data?.image_base64 ?? null;
console.log("← meta:", JSON.stringify({
  has_urls: Array.isArray(json?.data?.image_urls),
  has_b64: Array.isArray(json?.data?.image_base64),
  usage: json?.usage ?? null,
  base_resp: json?.base_resp ?? null,
}, null, 2));

if (Array.isArray(json?.data?.image_urls) && json.data.image_urls.length > 0) {
  const url = json.data.image_urls[0];
  console.log("✅ 拿到 URL:", url);
  // 顺手把 URL 写到文件，方便人工核对
  const out = path.resolve("test-results", "minimax-last-url.txt");
  await fs.mkdir(path.dirname(out), { recursive: true });
  await fs.writeFile(out, `${new Date().toISOString()}\n${url}\n`, "utf8");
  console.log("→ 已写入:", out);
  process.exit(0);
}

if (Array.isArray(json?.data?.image_base64) && json.data.image_base64.length > 0) {
  const b64 = json.data.image_base64[0];
  const buf = Buffer.from(b64, "base64");
  const out = path.resolve("test-results", "minimax-sample.png");
  await fs.mkdir(path.dirname(out), { recursive: true });
  await fs.writeFile(out, buf);
  console.log(`✅ 拿到 base64（${buf.length} bytes），已写入:`, out);
  process.exit(0);
}

console.error("⚠️  响应里没有 image_urls 也没有 image_base64：");
console.error(JSON.stringify(json, null, 2).slice(0, 1500));
process.exit(4);
