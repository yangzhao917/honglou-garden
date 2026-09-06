// 诗词阅读器：保留卡片翻转的空间感，但内容使用 DOM 层渲染，避免 WebGL 遮挡文字与图片。
import { useState } from "react";
import { ArrowRight, ArrowUpRight } from "lucide-react";
import type { LiteraryEntry } from "../domain/models";
import { sourceUrl } from "../domain/models";
import PoemArt from "./PoemArt";

type ReaderTab = "text" | "art";

interface Props {
  entry: LiteraryEntry;
  onGotoStory: () => void;
}

export default function PoemCube({ entry, onGotoStory }: Props) {
  const [tab, setTab] = useState<ReaderTab>("text");

  return (
    <div className="poem-cube">
      <div className="reader-tabs" role="tablist" aria-label="诗词视图">
        <div className="reader-tab-track" data-pos={tab} aria-hidden="true" />
        <button
          id="poem-text-tab"
          role="tab"
          aria-selected={tab === "text"}
          aria-controls="poem-reader-panel"
          className={`reader-tab ${tab === "text" ? "active" : ""}`}
          onClick={() => setTab("text")}
        >
          文字
        </button>
        <button
          id="poem-art-tab"
          role="tab"
          aria-selected={tab === "art"}
          aria-controls="poem-reader-panel"
          className={`reader-tab ${tab === "art" ? "active" : ""}`}
          onClick={() => setTab("art")}
        >
          意境
        </button>
      </div>

      <section
        id="poem-reader-panel"
        className={`poem-cube-stage poem-reader-stage is-${tab}`}
        role="tabpanel"
        aria-labelledby={tab === "text" ? "poem-text-tab" : "poem-art-tab"}
      >
        <div
          className={`poem-reader-card poem-reader-text ${entry.lines.length > 6 ? "has-long-text" : ""}`}
          aria-hidden={tab !== "text"}
          inert={tab !== "text"}
        >
          <div className="poem-reader-lines">
            {entry.lines.map((line, index) => (
              <p key={`${index}-${line}`}>{line}</p>
            ))}
          </div>
          <p className="poem-reader-context">{entry.context}</p>
          <div className="poem-reader-footer">
            <a href={sourceUrl(entry.chapter)} target="_blank" rel="noreferrer">
              查看原文出处 <ArrowUpRight size={13} />
            </a>
            <button onClick={onGotoStory}>
              回到故事 <ArrowRight size={14} />
            </button>
          </div>
        </div>
        <div
          className="poem-reader-card poem-reader-art"
          aria-hidden={tab !== "art"}
          inert={tab !== "art"}
        >
          <PoemArt key={entry.id} poem={entry} compact />
        </div>
      </section>
    </div>
  );
}
