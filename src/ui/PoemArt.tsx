// 诗词意境图组件：调用服务端 GPT Image 2 → 显示加载 → 显示图片 → 支持重生成。
import { useCallback, useEffect, useRef, useState } from "react";
import type { LiteraryEntry } from "../domain/models";
import { buildPoemPrompt } from "../application/poemArt";
import { generateImage } from "../application/openaiImage";
import { RefreshCw, Sparkles, AlertCircle, ImageOff } from "lucide-react";

interface Props {
  poem: LiteraryEntry;
  /** 在 3D 卡片里嵌入时：去掉外框装饰和"重新生成"按钮外的样式 */
  compact?: boolean;
}

type Status =
  | { kind: "idle" }
  | { kind: "loading"; message: string }
  | { kind: "ready"; url: string; prompt: string; seed: number }
  | { kind: "error"; message: string };

export default function PoemArt({ poem, compact = false }: Props) {
  const [status, setStatus] = useState<Status>({ kind: "idle" });
  const [fadeKey, setFadeKey] = useState(0); // 切图时强制重放淡入
  const abortRef = useRef<AbortController | null>(null);

  const start = useCallback(
    async (seed: number) => {
      // 取消上一次
      abortRef.current?.abort();
      const ctrl = new AbortController();
      abortRef.current = ctrl;

      const prompt = buildPoemPrompt(poem, seed);
      setStatus({ kind: "loading", message: "正在生成意境图…" });

      const r = await generateImage({
        prompt,
        signal: ctrl.signal,
      });

      if (ctrl.signal.aborted) return;

      if (r) {
        setStatus({ kind: "ready", url: r.url, prompt, seed });
        setFadeKey((k) => k + 1);
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

  // 自动开始一次
  useEffect(() => {
    start(Math.floor(Math.random() * 2_000_000_000));
    return () => abortRef.current?.abort();
  }, [poem.id, start]);

  // 组件卸载 / 切换诗时取消
  useEffect(() => {
    return () => abortRef.current?.abort();
  }, []);

  return (
    <div className={"poem-art" + (compact ? " poem-art-compact" : "")}>
      <div className="poem-art-frame">
        {status.kind === "loading" && (
          <div className="poem-art-loading">
            <div className="poem-art-ink" />
            <div className="poem-art-bars">
              <span />
              <span />
              <span />
              <span />
              <span />
            </div>
            <p>
              <Sparkles size={14} />
              {status.message}
            </p>
            <small>GPT Image 2 · 实时绘制</small>
          </div>
        )}

        {status.kind === "error" && (
          <div className="poem-art-error">
            <AlertCircle size={26} />
            <p>{status.message}</p>
            <button onClick={() => start(Math.floor(Math.random() * 2_000_000_000))}>
              <RefreshCw size={13} /> 重试一次
            </button>
          </div>
        )}

        {status.kind === "ready" && (
          <img
            key={fadeKey}
            src={status.url}
            alt={`${poem.title} 意境图`}
            className="poem-art-img fade-in"
            onError={() =>
              setStatus({
                kind: "error",
                message: "图片加载失败，可能是链接已过期。",
              })
            }
          />
        )}

        {status.kind === "idle" && (
          <div className="poem-art-loading">
            <ImageOff size={26} />
            <p>点击按钮开始绘制</p>
          </div>
        )}

        <span className="poem-art-corner tl" />
        <span className="poem-art-corner tr" />
        <span className="poem-art-corner bl" />
        <span className="poem-art-corner br" />
      </div>

      <div className="poem-art-foot">
        <span className="poem-art-stamp">
          <Sparkles size={11} />
          意境 · GPT Image 2
        </span>
        <button
          className="poem-art-regen"
          onClick={() => start(Math.floor(Math.random() * 2_000_000_000))}
          disabled={status.kind === "loading"}
          aria-label="重新生成意境图"
          title="重新生成"
        >
          <RefreshCw
            size={14}
            className={status.kind === "loading" ? "spin" : ""}
          />
          重新生成
        </button>
      </div>
    </div>
  );
}
