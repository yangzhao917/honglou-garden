// 诗词意境图组件：调用服务端 GPT Image 2 → 显示加载 → 显示图片 → 支持重生成。
import { useCallback, useEffect, useState } from "react";
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

type CachedArt = { url: string; prompt: string; seed: number };
const artCache = new Map<string, CachedArt>();
const pendingArt = new Map<string, ReturnType<typeof generateImage>>();
const MAX_CACHED_ARTS = 12;

function cacheArt(poemId: string, art: CachedArt) {
  artCache.delete(poemId);
  artCache.set(poemId, art);
  if (artCache.size > MAX_CACHED_ARTS) {
    artCache.delete(artCache.keys().next().value!);
  }
}

export default function PoemArt({ poem, compact = false }: Props) {
  const [status, setStatus] = useState<Status>(() => {
    const cached = artCache.get(poem.id);
    return cached ? { kind: "ready", ...cached } : { kind: "idle" };
  });
  const [fadeKey, setFadeKey] = useState(0); // 切图时强制重放淡入

  const start = useCallback(
    async (seed: number) => {
      const prompt = buildPoemPrompt(poem, seed);
      setStatus({ kind: "loading", message: "正在为这首诗铺陈意境…" });

      try {
        let task = pendingArt.get(poem.id);
        if (!task) {
          task = generateImage({ prompt });
          pendingArt.set(poem.id, task);
        }
        const r = await task;
        if (pendingArt.get(poem.id) === task) pendingArt.delete(poem.id);

        if (r) {
          const art = { url: r.url, prompt, seed };
          cacheArt(poem.id, art);
          setStatus({ kind: "ready", ...art });
          setFadeKey((k) => k + 1);
          return;
        }
        setStatus({
          kind: "error",
          message:
            "未能生成意境图。可能由于 API Key、网络或模型繁忙，请稍后再试。",
        });
      } catch {
        pendingArt.delete(poem.id);
        setStatus({
          kind: "error",
          message: "未能连接图片生成服务，请稍后重试。",
        });
      }
    },
    [poem],
  );

  // 自动开始一次
  useEffect(() => {
    const cached = artCache.get(poem.id);
    if (cached) {
      setStatus({ kind: "ready", ...cached });
      return;
    }
    start(Math.floor(Math.random() * 2_000_000_000));
  }, [poem.id, start]);

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
          </div>
        )}

        {status.kind === "error" && (
          <div className="poem-art-error poem-art-fallback">
            <div className="poem-art-ink" />
            <AlertCircle size={20} />
            <p>意境暂未显现</p>
            <button onClick={() => start(Math.floor(Math.random() * 2_000_000_000))}>
              <RefreshCw size={13} /> 再试一次
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
