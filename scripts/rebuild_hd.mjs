// 用 Tripo-H3.1 高保真生成并优化压缩写入 public/models/<id>.glb（逐个提交避开限量）
// 用法：node --env-file=.env scripts/rebuild_hd.mjs
import { writeFileSync, mkdirSync, statSync } from "node:fs";
import { execFileSync } from "node:child_process";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";
const __dirname = dirname(fileURLToPath(import.meta.url));
const ws = process.env.ALIYUN_WORKSPACE_ID, key = process.env.DASHSCOPE_API_KEY;
const OUT = join(__dirname, "..", "public", "models");
const TMP = join(__dirname, "..", ".tmp3d");
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
mkdirSync(TMP, { recursive: true });

const SPECS = [
  { id: "xiaoxiang", prompt: "一座江南古典书斋建筑，青灰瓦悬山顶带垂脊，白粉墙，栗木格扇门窗与汉白玉柱础，青砖台阶，屋旁修竹，写实PBR材质，单栋完整可旋转的独立模型" },
  { id: "yihong", prompt: "一座富丽古典庭院正房建筑，红色琉璃歇山顶，朱红立柱，彩绘额枋与格扇门窗，窗旁芭蕉，写实PBR材质，单栋完整可旋转的独立模型" },
  { id: "daoxiang", prompt: "一座黄泥茅顶乡村茅屋建筑，茅草屋顶，土黄色泥墙，栗木门窗，屋旁杏树与竹篱，写实PBR材质，单栋完整可旋转的独立模型" },
  { id: "qiushuang", prompt: "一座阔朗三开间古典大厅建筑，青灰瓦悬山顶，白粉墙，宽大栗木格扇门窗，门前梧桐，写实PBR材质，单栋完整可旋转的独立模型" },
  { id: "longcui", prompt: "一座清雅禅院殿堂建筑，青灰瓦歇山顶，素净墙面，简朴栗木格扇门窗，庭前梅树，写实PBR材质，单栋完整可旋转的独立模型" },
  { id: "ouxiang", prompt: "一座临水三开间歇山水榭建筑，青瓦卷棚歇山顶，敞轩栗木柱，坐凳栏杆，下临荷花池，写实PBR材质，单栋完整可旋转的独立模型" },
  { id: "qinfang", prompt: "一座方形攒尖顶六角亭建筑，青灰瓦，四角飞檐，栗木柱，临水，写实PBR材质，单栋完整可旋转的独立模型" },
  { id: "tree", prompt: "一棵写实的中国古典园林乔木，棕色树干，枝叶繁茂的深绿色树冠，写实PBR材质，单株完整可旋转的独立模型" },
  { id: "rock", prompt: "一块太湖石假山石，孔洞玲珑透漏，青灰色，写实PBR材质，单独完整可旋转的石头模型" },
  { id: "bamboo", prompt: "一丛翠竹，几根竹竿带竹叶，嫩绿色，写实PBR材质，单丛完整可旋转的独立模型" },
];

async function gen(params) {
  const sub = await fetch(`https://${ws}.cn-beijing.maas.aliyuncs.com/api/v1/services/aigc/video-generation/3d-generation`, {
    method: "POST",
    headers: { "X-DashScope-Async": "enable", Authorization: `Bearer ${key}`, "Content-Type": "application/json" },
    body: JSON.stringify(params),
  });
  const sj = await sub.json();
  if (!sj.output?.task_id) throw new Error(`submit ${JSON.stringify(sj)}`);
  return sj.output.task_id;
}

async function genAndOptimize(spec) {
  const task = await gen({
    model: "Tripo/Tripo-H3.1",
    input: { prompt: spec.prompt },
    parameters: { texture_quality: "detailed", geometry_quality: "ultra" },
  });
  console.log(`[${spec.id}] task=${task}`);
  for (let i = 0; i < 400; i++) {
    const r = await fetch(`https://${ws}.cn-beijing.maas.aliyuncs.com/api/v1/tasks/${task}`, { headers: { Authorization: `Bearer ${key}` } });
    const j = await r.json();
    const st = j.output?.task_status;
    if (i % 4 === 0 || st === "SUCCEEDED" || st === "FAILED") console.log(`  [${spec.id}] ${st}`);
    if (st === "SUCCEEDED") {
      const g = j.output.results?.[0]?.pbr_model_url;
      if (!g) throw new Error(`${spec.id} no glb`);
      const raw = join(TMP, `${spec.id}.glb`);
      const b = await (await fetch(g)).arrayBuffer();
      writeFileSync(raw, Buffer.from(b));
      const out = join(OUT, `${spec.id}.glb`);
      execFileSync("npx", ["gltf-transform", "optimize", raw, out,
        "--compress", "draco", "--texture-compress", "webp", "--texture-size", "1024", "--simplify-error", "0.001"],
        { stdio: "pipe" });
      const fs = statSync(out).size;
      console.log(`  [${spec.id}] saved ${out} (${(fs / 1024 / 1024).toFixed(2)} MB)`);
      return;
    }
    if (st === "FAILED" || st === "CANCELED" || st === "UNKNOWN") { console.log(`  [${spec.id}] TERMINAL`, JSON.stringify(j)); return; }
    await sleep(20000);
  }
  console.log(`  [${spec.id}] TIMEOUT`);
}

async function main() {
  let ok = 0;
  for (const s of SPECS) {
    try { await genAndOptimize(s); ok++; } catch (e) { console.error(`[${s.id}] ERR`, e.message); }
  }
  console.log(`done ok=${ok}/${SPECS.length}`);
}
main();
