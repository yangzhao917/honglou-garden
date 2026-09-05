import { Music2, Pause, Play } from "lucide-react";
import { useEffect, useRef, useState } from "react";

const audioSrc = "/audio/honglou-theme.mp3";
const DEFAULT_VOLUME = 0.4; // 默认低音量

/**
 * 听园：悬浮在角落的常驻背景乐开关。
 * 背景乐取自《红楼梦》插曲《枉凝眉》的中国乐器演奏（王立平作曲），
 * 以贴合大观园之境与主题。默认自动播放；点击即停止，再点恢复，音量淡入淡出。
 */
export default function GardenMusic() {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const fadeRef = useRef<number | null>(null);
  const [playing, setPlaying] = useState(false);

  const fade = (to: number, ms: number) => {
    const el = audioRef.current;
    if (!el) return;
    if (fadeRef.current) cancelAnimationFrame(fadeRef.current);
    const from = el.volume;
    const start = performance.now();
    const step = (now: number) => {
      const t = Math.min((now - start) / ms, 1);
      el.volume = Math.max(0, Math.min(1, from + (to - from) * t));
      if (t < 1) fadeRef.current = requestAnimationFrame(step);
      else fadeRef.current = null;
    };
    fadeRef.current = requestAnimationFrame(step);
  };

  const play = () => {
    const el = audioRef.current;
    if (!el || !el.paused) return;
    void el.play().catch(() => {});
    fade(DEFAULT_VOLUME, 1200);
  };

  const pause = () => {
    const el = audioRef.current;
    if (!el || el.paused) return;
    fade(0, 600);
    window.setTimeout(() => {
      if (!el.paused) el.pause();
    }, 600);
  };

  // 点击切换：播放中点击即停止，暂停时点击恢复。
  const toggle = () => {
    const el = audioRef.current;
    if (!el) return;
    if (el.paused) play();
    else pause();
  };

  useEffect(() => {
    const el = audioRef.current;
    if (!el) return;
    el.volume = 0.0001;

    // 默认自动播放；若被浏览器自动播放策略拦截，则在用户首次交互时播放。
    const attempt = () => {
      if (!el.paused) return;
      void el
        .play()
        .then(() => fade(DEFAULT_VOLUME, 1500))
        .catch(() => {
          // 真实浏览器会拦截首次无声播放；等待用户首次交互补播。
        });
    };
    // 首次尝试自动播放（若浏览器允许则直接响）。
    attempt();
    // 兜底：页面任意位置的点击/按键/触摸都会立刻起播，并移除监听。
    const firstEvents = ["pointerdown", "click", "keydown", "touchstart"];
    const onFirst = () => {
      attempt();
      firstEvents.forEach((e) => document.removeEventListener(e, onFirst));
    };
    firstEvents.forEach((e) =>
      document.addEventListener(e, onFirst, { passive: true }),
    );

    return () => {
      if (fadeRef.current) cancelAnimationFrame(fadeRef.current);
      firstEvents.forEach((e) => document.removeEventListener(e, onFirst));
      el.pause();
    };
  }, []);

  return (
    <>
      <audio
        ref={audioRef}
        src={audioSrc}
        loop
        preload="auto"
        onPlay={() => setPlaying(true)}
        onPause={() => setPlaying(false)}
      />
      <button
        type="button"
        className={`music-dock ${playing ? "is-playing" : ""}`}
        aria-pressed={playing}
        aria-label={playing ? "停止《枉凝眉》背景乐" : "播放《枉凝眉》背景乐"}
        title={playing ? "停止背景乐" : "播放背景乐"}
        onClick={toggle}
      >
        <Music2 size={18} />
        <span className="music-dock-state" aria-hidden="true">
          {playing ? <Pause size={9} /> : <Play size={9} />}
        </span>
      </button>
    </>
  );
}
