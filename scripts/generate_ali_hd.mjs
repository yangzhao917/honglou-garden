// 用 Tripo-H3.1 高保真生成一栋/一景，保存 GLB 与高清预览渲染图。
// 用法：node --env-file=.env scripts/generate_ali_hd.mjs <id> "<prompt>"
import { writeFileSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";
const __dirname = dirname(fileURLToPath(import.meta.url));
const ws = process.env.ALIYUN_WORKSPACE_ID, key = process.env.DASHSCOPE_API_KEY;
const OUT = join(__dirname, "..", "public", "models");
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
const id = process.argv[2], prompt = process.argv[3];
if (!id || !prompt) { console.error("usage: id prompt"); process.exit(1); }
const sub = await fetch(`https://${ws}.cn-beijing.maas.aliyuncs.com/api/v1/services/aigc/video-generation/3d-generation`, {
  method: "POST",
  headers: { "X-DashScope-Async": "enable", Authorization: `Bearer ${key}`, "Content-Type": "application/json" },
  body: JSON.stringify({
    model: "Tripo/Tripo-H3.1",
    input: { prompt },
    parameters: { texture_quality: "detailed", geometry_quality: "ultra" },
  }),
});
const sj = await sub.json();
if (!sj.output?.task_id) { console.error("submit error", JSON.stringify(sj)); process.exit(1); }
console.log(`[${id}] task=${sj.output.task_id}`);
for (let i = 0; i < 300; i++) {
  const r = await fetch(`https://${ws}.cn-beijing.maas.aliyuncs.com/api/v1/tasks/${sj.output.task_id}`, { headers: { Authorization: `Bearer ${key}` } });
  const j = await r.json();
  const st = j.output?.task_status;
  if (i % 4 === 0 || st === "SUCCEEDED" || st === "FAILED") console.log(`  [${id}] ${st}`);
  if (st === "SUCCEEDED") {
    const res = j.output.results?.[0] || {};
    if (res.pbr_model_url) {
      const b = await (await fetch(res.pbr_model_url)).arrayBuffer();
      writeFileSync(join(OUT, `${id}.glb`), Buffer.from(b));
      console.log(`  [${id}] saved ${id}.glb (${Buffer.from(b).length} bytes)`);
    } else { console.log(`  [${id}] no pbr_model_url`); }
    if (res.rendered_image_url) {
      const b = await (await fetch(res.rendered_image_url)).arrayBuffer();
      const ext = res.rendered_image_url.includes(".png") ? "png" : "webp";
      writeFileSync(join(OUT, `${id}_preview.${ext}`), Buffer.from(b));
      console.log(`  [${id}] saved ${id}_preview.${ext}`);
    }
    process.exit(0);
  }
  if (st === "FAILED" || st === "CANCELED" || st === "UNKNOWN") { console.log(`  [${id}] TERMINAL`, JSON.stringify(j)); process.exit(2); }
  await sleep(20000);
}
process.exit(3);
