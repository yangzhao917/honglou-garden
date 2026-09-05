// 按 "id:taskId" 对轮询并下载到 public/models/<id>.glb
// 用法：node --env-file=.env scripts/ali_download.mjs "xiaoxiang:C8..." "yihong:5443..."
import { writeFileSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";
const __dirname = dirname(fileURLToPath(import.meta.url));
const ws = process.env.ALIYUN_WORKSPACE_ID, key = process.env.DASHSCOPE_API_KEY;
const OUT = join(__dirname, "..", "public", "models");
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
const pairs = process.argv.slice(2).map((s) => {
  const [id, task] = s.split(":");
  return { id, task };
});
async function poll({ id, task }) {
  for (let i = 0; i < 200; i++) {
    const r = await fetch(`https://${ws}.cn-beijing.maas.aliyuncs.com/api/v1/tasks/${task}`, {
      headers: { Authorization: `Bearer ${key}` },
    });
    const j = await r.json();
    const st = j.output?.task_status;
    if (i % 4 === 0 || st === "SUCCEEDED" || st === "FAILED") console.log(`  [${id}] ${st}`);
    if (st === "SUCCEEDED") {
      const g = j.output.results?.[0]?.pbr_model_url;
      if (!g) throw new Error(`${id} no glb`);
      const b = await (await fetch(g)).arrayBuffer();
      writeFileSync(join(OUT, `${id}.glb`), Buffer.from(b));
      console.log(`  [${id}] saved ${id}.glb (${Buffer.from(b).length} bytes)`);
      return;
    }
    if (st === "FAILED" || st === "CANCELED" || st === "UNKNOWN") {
      console.log(`  [${id}] TERMINAL ${JSON.stringify(j)}`);
      return;
    }
    await sleep(15000);
  }
}
let ok = 0;
for (const p of pairs) {
  try { await poll(p); ok++; } catch (e) { console.error(`[${p.id}]`, e.message); }
}
console.log(`done ok=${ok}/${pairs.length}`);
