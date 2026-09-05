// 使用腾讯云 SDK 生成混元生3D 专业版模型并下载 GLB。
// 运行：node --env-file=.env scripts/generate_3d.mjs [id...]
// 不含 id 时跑全部 specs；传 id 只跑指定（如 xiaoxiang qinfang）。
import * as Ai3d from "tencentcloud-sdk-nodejs-ai3d";
import { readFileSync, writeFileSync, existsSync, mkdirSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const OUT = join(__dirname, "..", "public", "models");
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

const client = new Ai3d.ai3d.v20250513.Client({
  credential: {
    secretId: process.env.TENCENT_SECRET_ID,
    secretKey: process.env.TENCENT_SECRET_KEY,
  },
  region: process.env.TENCENT_REGION || "ap-guangzhou",
  profile: { httpProfile: { endpoint: "ai3d.tencentcloudapi.com" } },
});

// 每处院落主建筑的文生3D 描述（写实古典建筑，单栋独立模型）
export const SPECS = [
  { id: "xiaoxiang", prompt: "一座江南古典书斋建筑，青灰瓦曲面悬山顶，白粉墙，木格扇门窗柱础，屋前翠竹掩映，写实材质，单栋完整可旋转模型" },
  { id: "yihong", prompt: "一座富丽古典庭院正房建筑，红色琉璃歇山顶，朱红立柱，彩绘额枋格扇门窗，窗旁芭蕉，写实材质，单栋完整可旋转模型" },
  { id: "hengwu", prompt: "一座被太湖石与山石掩映的古典低平院落厅堂，青瓦悬山，素墙，四周藤萝奇石，写实材质，单栋完整可旋转模型" },
  { id: "daoxiang", prompt: "一座黄泥茅顶乡村茅屋建筑，茅草屋顶，土黄色泥墙，木门窗，屋旁杏树，写实材质，单栋完整可旋转模型" },
  { id: "qiushuang", prompt: "一座阔朗三开间古典大厅建筑，青瓦悬山，白粉墙，宽大木格扇门窗，门前梧桐，写实材质，单栋完整可旋转模型" },
  { id: "longcui", prompt: "一座清雅禅院殿堂建筑，青灰瓦，素色墙面，简朴木门窗，庭前梅花，写实材质，单栋完整可旋转模型" },
  { id: "ouxiang", prompt: "一座临水三开间歇山水榭建筑，青瓦卷棚歇山，敞轩木柱，坐凳栏杆，下设荷花池，写实材质，单栋完整可旋转模型" },
  { id: "qinfang", prompt: "一座方形攒尖顶六角亭建筑，青瓦，四角飞檐，木柱，临水，写实材质，单栋完整可旋转模型" },
];

async function submit(spec) {
  const res = await client.SubmitHunyuanTo3DProJob({
    Model: "3.0",
    Prompt: spec.prompt,
    GenerateType: "Normal",
    EnablePBR: false,
    FaceCount: 80000,
  });
  return res.JobId;
}

async function query(jobId) {
  return client.QueryHunyuanTo3DProJob({ JobId: jobId });
}

async function download(url, dest) {
  const r = await fetch(url);
  if (!r.ok) throw new Error(`download ${r.status} ${url}`);
  writeFileSync(dest, Buffer.from(await r.arrayBuffer()));
}

async function generateOne(spec) {
  mkdirSync(OUT, { recursive: true });
  const jobId = await submit(spec);
  console.log(`[${spec.id}] submitted job=${jobId}`);
  for (let i = 0; i < 120; i++) {
    await sleep(15000);
    const q = await query(jobId);
    const st = q.Status;
    console.log(`  [${spec.id}] ${st} credits=${q.ResultCreditConsumed}`);
    if (st === "DONE") {
      const files = q.ResultFile3Ds || [];
      const glb = files.find((f) => /GLB/i.test(f.Type || ""));
      if (!glb) throw new Error(`${spec.id}: 结果中无 GLB (${files.map((f) => f.Type).join(",")})`);
      const dest = join(OUT, `${spec.id}.glb.zip`);
      await download(glb.Url, dest);
      console.log(`  [${spec.id}] downloaded ${dest} (${(existsSync(dest) ? "" : "?")})`);
      writeFileSync(join(OUT, `${spec.id}.json`), JSON.stringify(q, null, 2));
      return q;
    }
    if (st === "FAIL") throw new Error(`${spec.id} FAIL: ${q.ErrorCode} ${q.ErrorMessage}`);
  }
  throw new Error(`${spec.id} 超时`);
}

async function main() {
  const args = process.argv.slice(2);
  const ids = args.length ? new Set(args) : null;
  const specs = ids ? SPECS.filter((s) => ids.has(s.id)) : SPECS;
  if (!specs.length) return console.log("no specs for ids:", [...(ids || [])]);
  console.log(`generating ${specs.length} model(s): ${specs.map((s) => s.id).join(", ")}`);
  for (const s of specs) {
    try {
      await generateOne(s);
    } catch (e) {
      console.error(`[${s.id}] ERROR`, e.message);
    }
  }
  console.log("done");
}
main();
