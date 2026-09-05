// 用阿里云百炼 Tripo-3D 重做 5 栋主建筑（原本由混元生成的 20MB/栋）→ 轻量写实版。
// 用法：node --env-file=.env scripts/generate_ali_redo.mjs
import { writeFileSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";
const __dirname = dirname(fileURLToPath(import.meta.url));
const ws = process.env.ALIYUN_WORKSPACE_ID, key = process.env.DASHSCOPE_API_KEY;
const OUT = join(__dirname, "..", "public", "models");
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

const SPECS = [
  { id: "xiaoxiang", prompt: "一座江南古典书斋建筑，青灰瓦曲面悬山顶，白粉墙，木格扇门窗与柱础，屋旁修竹，写实材质，单栋完整可旋转的独立模型" },
  { id: "yihong", prompt: "一座富丽古典庭院正房建筑，红色琉璃歇山顶，朱红立柱，彩绘额枋与格扇门窗，窗旁芭蕉，写实材质，单栋完整可旋转的独立模型" },
  { id: "hengwu", prompt: "一座被太湖石与山石掩映的古典低平院落厅堂，青瓦悬山顶，素净墙面，四周藤萝奇石，写实材质，单栋完整可旋转的独立模型" },
  { id: "daoxiang", prompt: "一座黄泥茅顶乡村茅屋建筑，茅草屋顶，土黄色泥墙，木门窗，屋旁杏树，写实材质，单栋完整可旋转的独立模型" },
  { id: "qiushuang", prompt: "一座阔朗三开间古典大厅建筑，青瓦悬山顶，白粉墙，宽大木格扇门窗，门前梧桐，写实材质，单栋完整可旋转的独立模型" },
];

async function submit(spec) {
  const r = await fetch(
    `https://${ws}.cn-beijing.maas.aliyuncs.com/api/v1/services/aigc/video-generation/3d-generation`,
    {
      method: "POST",
      headers: {
        "X-DashScope-Async": "enable",
        Authorization: `Bearer ${key}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "Tripo/Tripo-P1.0",
        input: { prompt: spec.prompt },
        parameters: { texture_quality: "standard" },
      }),
    },
  );
  const j = await r.json();
  if (!j.output?.task_id) throw new Error(`${spec.id} submit: ${JSON.stringify(j)}`);
  console.log(`[${spec.id}] task=${j.output.task_id}`);
  return j.output.task_id;
}

async function poll(spec, task) {
  for (let i = 0; i < 200; i++) {
    const r = await fetch(
      `https://${ws}.cn-beijing.maas.aliyuncs.com/api/v1/tasks/${task}`,
      { headers: { Authorization: `Bearer ${key}` } },
    );
    const j = await r.json();
    const st = j.output?.task_status;
    if (i % 4 === 0 || st === "SUCCEEDED" || st === "FAILED")
      console.log(`  [${spec.id}] ${st}`);
    if (st === "SUCCEEDED") {
      const g = j.output.results?.[0]?.pbr_model_url;
      if (!g) throw new Error(`${spec.id} no glb url`);
      const b = await (await fetch(g)).arrayBuffer();
      const f = join(OUT, `${spec.id}.glb`);
      writeFileSync(f, Buffer.from(b));
      console.log(`  [${spec.id}] saved ${f} (${Buffer.from(b).length} bytes)`);
      return;
    }
    if (st === "FAILED" || st === "CANCELED" || st === "UNKNOWN") {
      console.log(`  [${spec.id}] TERMINAL ${JSON.stringify(j)}`);
      throw new Error(`${spec.id} failed`);
    }
    await sleep(15000);
  }
  throw new Error(`${spec.id} timeout`);
}

async function main() {
  const ids = [];
  for (const s of SPECS) {
    try {
      ids.push({ id: s.id, task: await submit(s) });
    } catch (e) {
      console.error(e.message);
    }
  }
  await Promise.all(
    SPECS.map((s) =>
      (async () => {
        const t = ids.find((x) => x.id === s.id);
        if (t) await poll(s, t.task);
      })(),
    ),
  );
  console.log("done");
}
main();
