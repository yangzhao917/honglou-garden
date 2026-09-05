// 阿里云百炼 Tripo-3D：提交/轮询/下载 GLB 与预览图。
// 用法：node --env-file=.env scripts/generate_ali.mjs <task_id>  （轮询已完成的任务并下载）
import { readFileSync, writeFileSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";
const __dirname = dirname(fileURLToPath(import.meta.url));
const ws = process.env.ALIYUN_WORKSPACE_ID, key = process.env.DASHSCOPE_API_KEY;
const task = process.argv[2];
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
if (!task) {
  console.error("need task_id");
  process.exit(1);
}
const outDir = join(__dirname, "..", "public", "models");
for (let i = 0; i < 200; i++) {
  const r = await fetch(`https://${ws}.cn-beijing.maas.aliyuncs.com/api/v1/tasks/${task}`, {
    headers: { Authorization: `Bearer ${key}` },
  });
  const j = await r.json();
  const st = j.output?.task_status;
  console.log(i, st);
  if (st === "SUCCEEDED") {
    const res = j.output.results?.[0] || {};
    writeFileSync(join(outDir, `ali_task-${task}.json`), JSON.stringify(j, null, 2));
    if (res.pbr_model_url) {
      const b = await (await fetch(res.pbr_model_url)).arrayBuffer();
      const f = join(outDir, "ali_model.glb");
      writeFileSync(f, Buffer.from(b));
      console.log("GLB saved", f, Buffer.from(b).length, "bytes");
    }
    if (res.rendered_image_url) {
      const b = await (await fetch(res.rendered_image_url)).arrayBuffer();
      // 判断类型再命名
      const ext = res.rendered_image_url.includes(".png") ? "png" : "webp";
      const f = join(outDir, "ali_preview." + ext);
      writeFileSync(f, Buffer.from(b));
      console.log("PREVIEW saved", f, Buffer.from(b).length, "bytes");
    }
    process.exit(0);
  }
  if (st === "FAILED" || st === "CANCELED" || st === "UNKNOWN") {
    console.log("TERMINAL", JSON.stringify(j));
    process.exit(1);
  }
  await sleep(15000);
}
console.log("TIMEOUT polling");
process.exit(1);
