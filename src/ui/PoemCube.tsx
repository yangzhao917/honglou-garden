// 诗词阅读器的 3D 立方体卡牌切换。
// 用 Three.js 渲染两张独立的卡片，分别作为立方体的两个面，
// 点击 Tab 时整组绕 Y 轴旋转 90°，露出另一张卡。
import { Canvas, useFrame } from "@react-three/fiber";
import { Html } from "@react-three/drei";
import { Suspense, useRef, useState } from "react";
import * as THREE from "three";
import type { LiteraryEntry } from "../domain/models";
import PoemArt from "./PoemArt";
import {
  ArrowUpRight,
  ArrowRight,
} from "lucide-react";
import { sourceUrl } from "../domain/models";

type ReaderTab = "text" | "art";

interface Props {
  entry: LiteraryEntry;
  onGotoStory: () => void;
}

/* 卡片在 3D 空间里的尺寸（世界单位） */
const CARD_W = 4.6;
const CARD_H = 4.6;
const CARD_T = 0.16; // 厚度

/**
 * 单张卡片：带厚度的薄板，正面（+Z）显示内容。
 * `faceOffset` 控制它在立方体里的位置（左右两面之一）。
 */
function Card({
  faceOffset, // 文字 0 在前方，意境 Math.PI/2 在右面
  side,
  entry,
  active,
  onGotoStory,
}: {
  faceOffset: number;
  side: ReaderTab;
  entry: LiteraryEntry;
  active: boolean;
  onGotoStory: () => void;
}) {
  const ref = useRef<THREE.Group>(null);

  // 整组围绕 Y 轴缓慢呼吸 / 微微倾斜，呈现"立体的卡片感"
  useFrame((state) => {
    if (!ref.current) return;
    const t = state.clock.getElapsedTime();
    // 让卡面有非常轻的 Z 轴浮沉
    ref.current.position.z = Math.sin(t * 0.8 + faceOffset) * 0.04;
  });

  return (
    <group ref={ref} rotation={[0, faceOffset, 0]} position={[0, 0, 0]}>
      {/* 卡片主体（带厚度） */}
      <mesh castShadow receiveShadow>
        <boxGeometry args={[CARD_W, CARD_H, CARD_T]} />
        {/* 顶面 / 底面 / 侧面都是同一个奶白纸色；正反面用子 mesh 覆盖 */}
        <meshStandardMaterial
          color="#f0ecdb"
          roughness={0.85}
          metalness={0.05}
        />
      </mesh>

      {/* 正面：用 <Html> 直接把 DOM 渲染成 3D 平面 */}
      <Html
        // 把 DOM 贴在 box 的 +Z 面
        transform
        occlude="blending"
        distanceFactor={8}
        position={[0, 0, CARD_T / 2 + 0.001]}
        zIndexRange={[20, 0]}
        style={{
          width: "420px",
          height: "420px",
          pointerEvents: active ? "auto" : "none",
          userSelect: "none",
        }}
      >
        {side === "text" ? (
          <div className="cube-face cube-text">
            <div className="cube-text-lines">
              {entry.lines.slice(0, 16).map((l) => (
                <p key={l}>{l}</p>
              ))}
            </div>
            <p className="cube-text-context">{entry.context}</p>
            <div className="cube-text-footer">
              <a
                href={sourceUrl(entry.chapter)}
                target="_blank"
                rel="noreferrer"
              >
                查看原文出处 <ArrowUpRight size={12} />
              </a>
              <button onClick={onGotoStory}>
                回到故事 <ArrowRight size={13} />
              </button>
            </div>
          </div>
        ) : (
          <div className="cube-face cube-art">
            <PoemArt poem={entry} compact />
          </div>
        )}
      </Html>
    </group>
  );
}

/**
 * 整个立方体卡堆 —— 内部状态管动画。
 */
function CubeGroup({
  entry,
  tab,
  onGotoStory,
}: {
  entry: LiteraryEntry;
  tab: ReaderTab;
  onGotoStory: () => void;
}) {
  const ref = useRef<THREE.Group>(null);
  // 当前累积的 Y 角度
  const currentY = useRef(0);

  useFrame((_, delta) => {
    if (!ref.current) return;
    // 目标角度：根据 tab 决定
    const targetY = tab === "text" ? 0 : -Math.PI / 2;
    // 用最短路径（避免 270° 跳变）
    const diff = THREE.MathUtils.euclideanModulo(
      targetY - currentY.current + Math.PI,
      Math.PI * 2,
    ) - Math.PI;
    currentY.current += diff * Math.min(1, delta * 4); // 阻尼
    ref.current.rotation.y = currentY.current;
  });

  return (
    <group ref={ref}>
      {/* 文字卡：在立方体正面（rotation.y = 0） */}
      <Card
        faceOffset={0}
        side="text"
        entry={entry}
        active={tab === "text"}
        onGotoStory={onGotoStory}
      />
      {/* 意境卡：在文字卡的右侧（rotation.y = π/2） */}
      {/* 当整组旋转 -90°，它正好转到相机方向 */}
      <group rotation={[0, Math.PI / 2, 0]}>
        <Card
          faceOffset={Math.PI / 2}
          side="art"
          entry={entry}
          active={tab === "art"}
          onGotoStory={onGotoStory}
        />
      </group>
    </group>
  );
}

/**
 * 装饰：场景下方一块"桌面"，让卡片有阴影
 */
function Floor() {
  return (
    <mesh
      rotation={[-Math.PI / 2, 0, 0]}
      position={[0, -2.6, -0.5]}
      receiveShadow
    >
      <planeGeometry args={[20, 20]} />
      <shadowMaterial transparent opacity={0.25} />
    </mesh>
  );
}

/* ============================================================ *
 * 主组件
 * ============================================================ */
export default function PoemCube({ entry, onGotoStory }: Props) {
  const [tab, setTab] = useState<ReaderTab>("text");
  const [cubeReady, setCubeReady] = useState(false);

  return (
    <div className="poem-cube">
      {/* —— 顶部 Tab —— */}
      <div className="reader-tabs" role="tablist" aria-label="诗词视图">
        <div className="reader-tab-track" data-pos={tab} aria-hidden="true" />
        <button
          role="tab"
          aria-selected={tab === "text"}
          className={`reader-tab ${tab === "text" ? "active" : ""}`}
          onClick={() => setTab("text")}
        >
          文字
        </button>
        <button
          role="tab"
          aria-selected={tab === "art"}
          className={`reader-tab ${tab === "art" ? "active" : ""}`}
          onClick={() => setTab("art")}
        >
          意境
        </button>
      </div>

      {/* —— Three.js 场景 —— */}
      <div className="poem-cube-stage">
        <Canvas
          shadows
          dpr={[1, 2]}
          camera={{ position: [0, 0, 7], fov: 38 }}
          gl={{ antialias: true, alpha: true }}
          onCreated={() => setCubeReady(true)}
        >
          {/* 环境光 */}
          <ambientLight intensity={0.55} />
          {/* 主光：右上 */}
          <directionalLight
            position={[5, 8, 6]}
            intensity={1.1}
            castShadow
            shadow-mapSize-width={1024}
            shadow-mapSize-height={1024}
            shadow-camera-near={1}
            shadow-camera-far={20}
            shadow-camera-left={-6}
            shadow-camera-right={6}
            shadow-camera-top={6}
            shadow-camera-bottom={-6}
          />
          {/* 补光：左下 */}
          <directionalLight
            position={[-4, -2, 4]}
            intensity={0.35}
            color="#a8b89c"
          />

          <Suspense fallback={null}>
            <CubeGroup entry={entry} tab={tab} onGotoStory={onGotoStory} />
          </Suspense>

          <Floor />
        </Canvas>
        {!cubeReady && (
          <div className="poem-cube-loading">
            <div className="poem-art-ink" />
            <p>正在展开立方体</p>
          </div>
        )}
      </div>
    </div>
  );
}
