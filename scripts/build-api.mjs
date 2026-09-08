import { build } from "esbuild";

// Vercel 的 ESM 函数不会自动携带 src 下的 TypeScript 依赖，部署前将入口及其
// 领域目录打成单文件，避免线上运行时出现 ERR_MODULE_NOT_FOUND。
await build({
  entryPoints: ["api/poem-image.ts"],
  bundle: true,
  platform: "node",
  format: "esm",
  target: "node20",
  outfile: "api/poem-image.js",
  packages: "external",
  sourcemap: false,
});
