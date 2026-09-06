// 诗词意境图生成 hook：管理生成状态，返回图片 URL 与重新生成函数。
import { useCallback, useEffect, useRef, useState } from "react";
import type { LiteraryEntry } from "../domain/models";
import { buildPoemPrompt } from "./poemArt";
import { generateImage } from "./dashScopeImage";

export type PoemImageStatus =
  | { kind: "idle" }
  | { kind: "loading"; message: string }
  | { kind: "ready"; url: string; seed: number }
  | { kind: "error"; message: string };

export function usePoemImage(poem: LiteraryEntry) {
  const [status, setStatus] = useState<PoemImageStatus>({ kind: "idle" });
  const abortRef = useRef<AbortController | null>(null);

  const start = useCallback(
    async (seed: number) => {
      abortRef.current?.abort();
      const ctrl = new AbortController();
      abortRef.current = ctrl;

      const prompt = buildPoemPrompt(poem, seed);
      setStatus({ kind: "loading", message: "正在生成意境图…" });

      const r = await generateImage({
        prompt,
        seed,
        size: "1024*1024",
        signal: ctrl.signal,
      });

      if (ctrl.signal.aborted) return;
      if (r) {
        setStatus({ kind: "ready", url: r.url, seed });
      } else {
        setStatus({
          kind: "error",
          message:
            "未能生成意境图。可能由于 API Key、网络或模型繁忙，请稍后再试。",
        });
      }
    },
    [poem],
  );

  // 首次自动生成
  useEffect(() => {
    start(Math.floor(Math.random() * 2_000_000_000));
    return () => abortRef.current?.abort();
  }, [poem.id, start]);

  const regenerate = useCallback(() => {
    start(Math.floor(Math.random() * 2_000_000_000));
  }, [start]);

  return { status, regenerate };
}
