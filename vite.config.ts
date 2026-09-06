import { defineConfig, loadEnv, type Plugin } from "vite";
import react from "@vitejs/plugin-react";

const MAX_PROMPT_LENGTH = 6_000;

/**
 * Vite 不会运行 Vercel Function；本地开发时用同一路径代理图片请求，
 * 保持浏览器端与线上都只调用 /api/poem-image，且 API Key 不会发送到浏览器。
 */
function poemImageDevApi(apiKey: string | undefined): Plugin {
  return {
    name: "poem-image-dev-api",
    configureServer(server) {
      server.middlewares.use("/api/poem-image", (request, response, next) => {
        if (request.method !== "POST") return next();

        const chunks: Buffer[] = [];
        request.on("data", (chunk: Buffer) => chunks.push(chunk));
        request.on("error", () => response.statusCode = 400);
        request.on("end", () => {
          void (async () => {
            const rawBody = Buffer.concat(chunks).toString("utf8");
            const prompt = (() => {
              try {
                const body = JSON.parse(rawBody);
                return typeof body?.prompt === "string" ? body.prompt.trim() : "";
              } catch {
                return "";
              }
            })();

            if (!prompt || prompt.length > MAX_PROMPT_LENGTH) {
              response.statusCode = 400;
              response.setHeader("Content-Type", "application/json");
              response.end(JSON.stringify({ error: "invalid_prompt" }));
              return;
            }
            if (!apiKey) {
              response.statusCode = 503;
              response.setHeader("Content-Type", "application/json");
              response.end(JSON.stringify({ error: "image_generation_unavailable" }));
              return;
            }

            try {
              const upstream = await fetch("https://api.openai.com/v1/images/generations", {
                method: "POST",
                headers: {
                  Authorization: `Bearer ${apiKey}`,
                  "Content-Type": "application/json",
                },
                body: JSON.stringify({
                  model: "gpt-image-2",
                  prompt,
                  n: 1,
                  size: "1024x1024",
                  quality: "low",
                  output_format: "webp",
                }),
              });
              const body = await upstream.json().catch(() => null);
              const image = body?.data?.[0];

              response.setHeader("Content-Type", "application/json");
              if (!upstream.ok || !image?.b64_json) {
                response.statusCode = 502;
                response.end(JSON.stringify({ error: "image_generation_failed" }));
                return;
              }
              response.statusCode = 200;
              response.end(JSON.stringify({
                image: { b64_json: image.b64_json, mime_type: "image/webp" },
              }));
            } catch {
              response.statusCode = 502;
              response.setHeader("Content-Type", "application/json");
              response.end(JSON.stringify({ error: "image_generation_failed" }));
            }
          })();
        });
      });
    },
  };
}

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), "");
  const dashscopeTarget = env.ALIYUN_WORKSPACE_ID
    ? `${env.ALIYUN_WORKSPACE_ID}.cn-beijing.maas.aliyuncs.com`
    : "ws-7xqji8kqvqf94jvv.cn-beijing.maas.aliyuncs.com";

  return {
    plugins: [react(), poemImageDevApi(env.OPENAI_API_KEY)],
    server: {
      port: 5173,
      strictPort: true,
      proxy: {
        "/api/dashscope": {
          target: `https://${dashscopeTarget}`,
          changeOrigin: true,
          secure: true,
          rewrite: (path) => path.replace(/^\/api\/dashscope/, "/api/v1"),
          configure: (proxy) => {
            proxy.on("proxyReq", (proxyRequest) => {
              const key = env.DASHSCOPE_API_KEY;
              if (key) proxyRequest.setHeader("Authorization", `Bearer ${key}`);
            });
          },
        },
      },
    },
    build: {
      rollupOptions: {
        output: {
          manualChunks: {
            three: ["three", "@react-three/fiber", "@react-three/drei"],
          },
        },
      },
    },
  };
});
