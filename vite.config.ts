import { defineConfig, loadEnv, type Plugin } from "vite";
import react from "@vitejs/plugin-react";
import { buildPoemPrompt } from "./src/application/poemArt";
import { literary } from "./src/infrastructure/catalog";

const MAX_BODY_BYTES = 512;

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
        let bodyBytes = 0;
        let bodyTooLarge = false;
        request.on("data", (chunk: Buffer) => {
          bodyBytes += chunk.length;
          if (bodyBytes > MAX_BODY_BYTES) {
            bodyTooLarge = true;
            return;
          }
          chunks.push(chunk);
        });
        request.on("error", () => response.statusCode = 400);
        request.on("end", () => {
          void (async () => {
            if (bodyTooLarge) {
              response.statusCode = 413;
              response.setHeader("Content-Type", "application/json");
              response.end(JSON.stringify({ error: "request_too_large" }));
              return;
            }
            const rawBody = Buffer.concat(chunks).toString("utf8");
            const requestData = (() => {
              try {
                const body = JSON.parse(rawBody);
                return {
                  poemId: typeof body?.poemId === "string" ? body.poemId : "",
                  seed: Number(body?.seed),
                };
              } catch {
                return { poemId: "", seed: Number.NaN };
              }
            })();
            const poem = literary.find(
              (entry) => entry.kind === "poem" && entry.id === requestData.poemId,
            );

            if (
              !poem ||
              !Number.isSafeInteger(requestData.seed) ||
              requestData.seed < 0 ||
              requestData.seed > 2_000_000_000
            ) {
              response.statusCode = 400;
              response.setHeader("Content-Type", "application/json");
              response.end(JSON.stringify({ error: "invalid_request" }));
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
                  prompt: buildPoemPrompt(poem, requestData.seed),
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

  return {
    plugins: [react(), poemImageDevApi(env.OPENAI_API_KEY)],
    server: {
      port: 5173,
      strictPort: true,
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
