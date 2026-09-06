import {
  Canvas,
  useFrame,
  useThree,
  type ThreeEvent,
} from "@react-three/fiber";
import { Html, OrbitControls, Line, useGLTF } from "@react-three/drei";
import {
  Suspense,
  useEffect,
  useMemo,
  useRef,
  useState,
  Component,
  type ReactNode,
} from "react";
import * as THREE from "three";
import type { OrbitControls as OrbitControlsImpl } from "three-stdlib";
import { places } from "../infrastructure/catalog";
import { hasModel } from "./gardenModels";
import { grassMat, barkMat, waterMat } from "./garden/env";

// 以下坐标只控制艺术构图；文学地点与原文动线保存在独立内容层。
export const layout: Record<string, [number, number]> = {
  xiaoxiang: [-7, -4.8],
  yihong: [7, 4.7],
  hengwu: [7, -5.5],
  daoxiang: [-7, 5.7],
  qiushuang: [0, -8],
  longcui: [-11, 0.1],
  ouxiang: [2.6, 0.8],
  qinfang: [-0.6, 6],
};
const colors = {
  roof: "#526a60",
  wall: "#ece8d6",
  wood: "#79735b",
  trim: "#b7b59e",
  ground: "#c6c9ac",
};
const box = new THREE.BoxGeometry(1, 1, 1);
const sphere = new THREE.IcosahedronGeometry(1, 1);
const trunkGeo = new THREE.CylinderGeometry(0.075, 0.11, 1, 5);
const stoneGeo = new THREE.DodecahedronGeometry(1, 0);
const mat = (color: string) =>
  new THREE.MeshStandardMaterial({ color, roughness: 1 });
const materials = {
  wall: mat(colors.wall),
  roof: mat(colors.roof),
  wood: mat(colors.wood),
  trim: mat(colors.trim),
  stone: mat("#b0b5a6"),
  paving: mat("#dfdbc6"),
  dark: mat("#3d5147"),
  ground: mat("#98a380"),
  beam: mat("#6e4528"),
  lattice: mat("#9f967b"),
  rail: mat("#7a5432"),
  finial: mat("#3a4b40"),
};
function Block({
  position,
  scale,
  material = materials.wall,
  rotation,
}: {
  position: [number, number, number];
  scale: [number, number, number];
  material?: THREE.Material;
  rotation?: [number, number, number];
}) {
  return (
    <mesh
      geometry={box}
      material={material}
      position={position}
      scale={scale}
      rotation={rotation}
      castShadow
      receiveShadow
    />
  );
}
function roofShape(w: number, d: number, h = 0.62, eave = 0.3) {
  const vertices: number[] = [],
    indices: number[] = [],
    ribs: number[] = [];
  const nx = 12,
    nz = 16;
  const pos = (u: number, v: number): [number, number, number] => {
    const t = Math.abs(v * 2 - 1);
    // 出檐：檐口低于梁枋并微微外挑，从下方看不到梁枋与屋面之间的露空。
    const flare = 0.2 * Math.pow(t, 3);
    return [
      (u - 0.5) * (w + 2 * flare),
      (h + eave) * (1 - Math.pow(t, 1.6)) - eave,
      (v - 0.5) * d,
    ];
  };
  for (let i = 0; i <= nx; i++)
    for (let j = 0; j <= nz; j++) vertices.push(...pos(i / nx, j / nz));
  for (let i = 0; i < nx; i++)
    for (let j = 0; j < nz; j++) {
      const a = i * (nz + 1) + j,
        b = a + nz + 1;
      indices.push(a, b, a + 1, b, b + 1, a + 1);
    }
  for (let i = 0; i <= Math.round(w / 0.17); i++) {
    const u = i / Math.round(w / 0.17);
    for (let j = 0; j < nz; j++) {
      const a = pos(u, j / nz),
        b = pos(u, (j + 1) / nz);
      a[1] += 0.013;
      b[1] += 0.013;
      ribs.push(...a, ...b);
    }
  }
  const geo = new THREE.BufferGeometry();
  geo.setAttribute("position", new THREE.Float32BufferAttribute(vertices, 3));
  geo.setIndex(indices);
  geo.computeVertexNormals();
  const rib = new THREE.BufferGeometry();
  rib.setAttribute("position", new THREE.Float32BufferAttribute(ribs, 3));
  return { geo, rib };
}
function Roof({
  w,
  d,
  h = 0.62,
  color,
  pyramid = false,
  eave = 0.3,
}: {
  w: number;
  d: number;
  h?: number;
  color?: string;
  pyramid?: boolean;
  eave?: number;
}) {
  const { geo, rib } = useMemo(() => roofShape(w, d, h, eave), [w, d, h, eave]);
  useEffect(
    () => () => {
      geo.dispose();
      rib.dispose();
    },
    [geo, rib],
  );
  return (
    <group>
      <mesh geometry={geo} castShadow receiveShadow>
        <meshStandardMaterial
          color={color ?? colors.roof}
          side={THREE.DoubleSide}
          roughness={1}
        />
      </mesh>
      <lineSegments geometry={rib}>
        <lineBasicMaterial color="#91a08a" transparent opacity={0.52} />
      </lineSegments>
      {pyramid ? (
        // 攒尖顶：宝顶收顶
        <group>
          <Block
            position={[0, h + 0.04, 0]}
            scale={[0.17, 0.14, 0.17]}
            material={materials.finial}
          />
          <mesh
            geometry={sphere}
            position={[0, h + 0.26, 0]}
            scale={[0.18, 0.24, 0.18]}
            material={materials.finial}
          />
        </group>
      ) : (
        <>
          <Block
            position={[0, h + 0.03, 0]}
            scale={[w - 0.15, 0.1, 0.08]}
            material={materials.trim}
          />
          {[-1, 1].map((s) => (
            <Block
              key={s}
              position={[(s * w) / 2, h - 0.04, 0]}
              scale={[0.15, 0.13, 0.1]}
              rotation={[0, 0, s * 0.5]}
              material={materials.trim}
            />
          ))}
        </>
      )}
    </group>
  );
}
function Column({
  x,
  z,
  base,
  top,
  size = 0.1,
  material = materials.wood,
}: {
  x: number;
  z: number;
  base: number;
  top: number;
  size?: number;
  material?: THREE.Material;
}) {
  return (
    <Block
      position={[x, (base + top) / 2, z]}
      scale={[size, top - base, size]}
      material={material}
    />
  );
}
/** 围合主体：四周墙体 + 前檐柱 + 明间门扇 + 两侧槛窗 + 檐枋，杜绝任何透视露空。 */
function ClosedBody({
  w,
  d,
  plinth,
  wallH,
  colH,
  posts = 5,
  thatch = false,
}: {
  w: number;
  d: number;
  plinth: number;
  wallH: number;
  colH: number;
  posts?: number;
  thatch?: boolean;
}) {
  const zF = d / 2,
    zB = -d / 2,
    wallY = plinth + wallH / 2;
  const bodyMat = thatch ? materials.dark : materials.wall;
  const cols = Array.from({ length: posts }, (_, i) => -w / 2 + (i * w) / (posts - 1));
  return (
    <group>
      {/* 后墙与左右山墙 */}
      <Block position={[0, wallY, zB + 0.04]} scale={[w - 0.14, wallH, 0.07]} material={bodyMat} />
      <Block position={[-w / 2 + 0.04, wallY, 0]} scale={[0.07, wallH, d - 0.1]} material={bodyMat} />
      <Block position={[w / 2 - 0.04, wallY, 0]} scale={[0.07, wallH, d - 0.1]} material={bodyMat} />
      {/* 前檐墙（托住屋檐下沿） */}
      <Block position={[0, wallY, zF - 0.02]} scale={[w - 0.14, wallH, 0.07]} material={bodyMat} />
      {/* 檐柱 */}
      {cols.map((x, i) => (
        <Column key={i} x={x} z={zF + 0.02} base={plinth} top={plinth + colH} size={0.11} />
      ))}
      {/* 每间：明间开门扇，其余开槛窗 */}
      {cols.slice(0, -1).map((x, i) => {
        const bay = w / (posts - 1),
          cx = x + bay / 2,
          isDoor = Math.abs(cx) < bay * 0.55;
        return isDoor ? (
          <group key={i}>
            <Block position={[cx, plinth + 0.58, zF + 0.02]} scale={[0.86, 1.16, 0.05]} material={materials.lattice} />
            {[-0.45, 0.45].map((s) => (
              <Block key={s} position={[cx + s * 0.44, plinth + 0.58, zF + 0.035]} scale={[0.08, 1.16, 0.06]} material={materials.beam} />
            ))}
            <Block position={[cx, plinth + 1.2, zF + 0.035]} scale={[0.98, 0.1, 0.06]} material={materials.beam} />
          </group>
        ) : (
          <group key={i}>
            <Block position={[cx, plinth + 0.26, zF + 0.02]} scale={[bay - 0.18, 0.52, 0.05]} material={bodyMat} />
            {[0.62, 0.92].map((y) => (
              <Block key={y} position={[cx, plinth + y, zF + 0.03]} scale={[bay - 0.16, 0.045, 0.05]} material={materials.trim} />
            ))}
            <Block position={[cx, plinth + 0.62, zF + 0.035]} scale={[0.045, 0.68, 0.05]} material={materials.trim} />
          </group>
        );
      })}
      {/* 檐枋（四周围合，遮住檐下缝隙） */}
      <Block position={[0, plinth + colH - 0.06, zF + 0.02]} scale={[w + 0.3, 0.15, 0.12]} material={materials.beam} />
      <Block position={[0, plinth + colH - 0.06, zB]} scale={[w + 0.3, 0.15, 0.12]} material={materials.beam} />
      {[-1, 1].map((s) => (
        <Block key={s} position={[s * w / 2, plinth + colH - 0.06, 0]} scale={[0.12, 0.15, d + 0.3]} material={materials.beam} />
      ))}
    </group>
  );
}
/** 敞轩/亭榭主体：四檐柱 + 坐凳栏杆围合 + 地面坐板 + 檐枋，不再“只有一片屋顶挂在柱上”。 */
function OpenBody({
  w,
  d,
  plinth,
  colH,
  posts = 4,
}: {
  w: number;
  d: number;
  plinth: number;
  colH: number;
  posts?: number;
}) {
  const cols = Array.from({ length: posts }, (_, i) => -w / 2 + (i * w) / (posts - 1));
  const rail = (yH: number, len: number, cx: number, cz: number, rot = 0) => (
    <Block
      position={[cx, plinth + yH, cz]}
      scale={[len, 0.06, 0.05]}
      rotation={[0, rot, 0]}
      material={materials.rail}
    />
  );
  return (
    <group>
      {/* 地面坐板台 */}
      <Block position={[0, plinth - 0.02, 0]} scale={[w + 0.35, 0.09, d + 0.35]} material={materials.paving} />
      {/* 四圈檐柱 */}
      {cols.map((x, i) => (
        <Column key={i} x={x} z={d / 2 - 0.05} base={plinth} top={plinth + colH} size={0.11} />
      ))}
      {cols.map((x, i) => (
        <Column key={i} x={x} z={-d / 2 + 0.05} base={plinth} top={plinth + colH} size={0.11} />
      ))}
      {/* 坐凳栏杆：前、后、左、右四边 */}
      <Block position={[0, plinth + 0.22, d / 2 - 0.14]} scale={[w - 0.1, 0.12, 0.2]} material={materials.wood} />
      <Block position={[0, plinth + 0.22, -d / 2 + 0.14]} scale={[w - 0.1, 0.12, 0.2]} material={materials.wood} />
      {[-1, 1].map((s) => (
        <Block key={s} position={[s * w / 2, plinth + 0.22, 0]} scale={[0.2, 0.12, d - 0.1]} material={materials.wood} />
      ))}
      {rail(0.52, w - 0.12, 0, d / 2 - 0.08)}
      {rail(0.52, w - 0.12, 0, -d / 2 + 0.08)}
      {[-1, 1].map((s) => (
        <Block key={s} position={[s * w / 2, plinth + 0.52, 0]} scale={[0.05, 0.06, d - 0.12]} material={materials.rail} />
      ))}
      {/* 檐枋（挂落） */}
      <Block position={[0, plinth + colH - 0.05, d / 2 - 0.05]} scale={[w + 0.3, 0.13, 0.1]} material={materials.beam} />
      <Block position={[0, plinth + colH - 0.05, -d / 2 + 0.05]} scale={[w + 0.3, 0.13, 0.1]} material={materials.beam} />
      {[-1, 1].map((s) => (
        <Block key={s} position={[s * w / 2, plinth + colH - 0.05, 0]} scale={[0.1, 0.13, d]} material={materials.beam} />
      ))}
    </group>
  );
}
function Building({
  position = [0, 0, 0],
  w = 3,
  d = 1.65,
  rotation = 0,
  open = false,
  color,
  height = 1.36,
  thatch = false,
  posts = 5,
}: {
  position?: [number, number, number];
  w?: number;
  d?: number;
  rotation?: number;
  open?: boolean;
  color?: string;
  height?: number;
  thatch?: boolean;
  posts?: number;
}) {
  const plinth = 0.34,
    colH = height + 0.12,
    wallH = open ? 0 : height;
  const pyramid = open && Math.abs(w - d) < 0.5;
  return (
    <group position={position} rotation={[0, rotation, 0]}>
      {/* 台基与阶沿 */}
      <Block position={[0, 0.17, 0]} scale={[w + 0.75, 0.34, d + 0.85]} material={materials.paving} />
      <Block position={[0, 0.345, 0]} scale={[w + 0.6, 0.05, d + 0.68]} material={materials.trim} />
      {open ? (
        <OpenBody w={w} d={d} plinth={plinth} colH={colH} posts={posts} />
      ) : (
        <ClosedBody w={w} d={d} plinth={plinth} wallH={wallH} colH={colH} posts={posts} thatch={thatch} />
      )}
      {/* 屋顶：坐于梁枋之上，檐口包住檐枋 */}
      <group position={[0, plinth + colH, 0]}>
        <Roof w={w + 1.15} d={d + 1.25} h={pyramid ? 0.9 : 0.68} color={color} pyramid={pyramid} />
      </group>
      <Block position={[0, 0.06, d / 2 + 0.62]} scale={[0.95, 0.14, 0.55]} material={materials.stone} />
    </group>
  );
}

/** 把混元生3D 的 GLB 归一化：缩放到目标宽度、底边落地、xz 居中。 */
function normalizeGltf(src: THREE.Group, width: number) {
  const o = src.clone(true);
  o.traverse((n) => {
    if ((n as THREE.Mesh).isMesh) {
      n.castShadow = true;
      n.receiveShadow = true;
    }
  });
  const bbox = new THREE.Box3().setFromObject(o);
  const size = bbox.getSize(new THREE.Vector3());
  const s = width / Math.max(size.x, size.z || 1);
  o.scale.multiplyScalar(s);
  const b2 = new THREE.Box3().setFromObject(o);
  const c = b2.getCenter(new THREE.Vector3());
  o.position.set(-c.x, -b2.min.y, -c.z);
  return o;
}
function RealInner({
  model,
  position = [0, 0, 0] as [number, number, number],
  rotation = 0,
  width,
}: {
  model: string;
  position?: [number, number, number];
  rotation?: number;
  width: number;
}) {
  const { scene } = useGLTF(model);
  const object = useMemo(() => normalizeGltf(scene, width), [scene, width]);
  return <primitive object={object} position={position} rotation={[0, rotation, 0]} />;
}
/** 加载失败时回退到程序化建筑，避免整园崩溃。 */
function RealBuilding({
  model,
  position,
  rotation = 0,
  width,
  fallback,
}: {
  model: string;
  position?: [number, number, number];
  rotation?: number;
  width: number;
  fallback: ReactNode;
}) {
  const [err, setErr] = useState(false);
  const id = model.replace(/^\/models\//, "").replace(/\.glb$/, "");
  if (err || !hasModel(id)) return <>{fallback}</>;
  return (
    <ModelBoundary onError={() => setErr(true)} fallback={fallback}>
      <Suspense fallback={<>{fallback}</>}>
        <RealInner model={model} position={position} rotation={rotation} width={width} />
      </Suspense>
    </ModelBoundary>
  );
}
/** 捕获挂载 under 的加载错误并回退，不冒泡到整园边界。 */
class ModelBoundary extends Component<
  { fallback: ReactNode; onError: () => void; children: ReactNode },
  { error: boolean }
> {
  state = { error: false };
  static getDerivedStateFromError() {
    return { error: true };
  }
  componentDidCatch() {
    this.props.onError();
  }
  render() {
    return this.state.error ? this.props.fallback : this.props.children;
  }
}

function Tower({
  position,
  color = "#9c6f4a",
  height = 2.6,
}: {
  position: [number, number, number];
  color?: string;
  height?: number;
}) {
  const tiers = Math.round(height / 0.75);
  return (
    <group position={position}>
      {Array.from({ length: tiers }, (_, i) => {
        const bs = 0.72 - i * 0.09;
        return (
          <group key={i} position={[0, 0.78 + i * 0.74, 0]}>
            <Block
              position={[0, 0, 0]}
              scale={[bs, 0.74, bs]}
              material={materials.wall}
            />
            <group position={[0, 0.37, 0]}>
              <Roof
                w={bs + 0.9}
                d={bs + 0.9}
                h={0.4}
                color={color}
                pyramid
              />
            </group>
          </group>
        );
      })}
      <Block
        position={[0, 0.78, 0]}
        scale={[0.62, 0.5, 0.62]}
        material={materials.dark}
      />
      <Block
        position={[0, 2.4 + tiers * 0.06, 0]}
        scale={[0.07, 0.7, 0.07]}
        material={materials.wood}
      />
      <mesh
        geometry={sphere}
        position={[0, 2.86 + tiers * 0.06, 0]}
        scale={[0.14, 0.2, 0.14]}
        material={materials.finial}
      />
    </group>
  );
}

function BambooScreen({
  position,
  n = 5,
}: {
  position: [number, number, number];
  n?: number;
}) {
  return (
    <group position={position}>
      {Array.from({ length: n }, (_, i) => (
        <Block
          key={i}
          position={[i * 0.26, 0.9, Math.sin(i * 2.2) * 0.12]}
          scale={[0.07, 1.8, 0.07]}
          material={materials.roof}
        />
      ))}
    </group>
  );
}

function blossom(x: number, z: number, color = "#b45a6b", s = 0.5) {
  return (
    <mesh
      geometry={sphere}
      position={[x, 1.15, z]}
      scale={[s, s * 0.7, s]}
      castShadow
    >
      <meshStandardMaterial color={color} roughness={1} />
    </mesh>
  );
}

function Courtyard({
  id,
  selected,
  onSelect,
}: {
  id: string;
  selected: boolean;
  onSelect: (id: string) => void;
}) {
  const [x, z] = layout[id];
  const [hover, setHover] = useState(false);
  const place = places.find((p) => p.id === id)!;
  const pavilion = id === "qinfang" || id === "ouxiang";
  const pick = (e: ThreeEvent<MouseEvent>) => {
    e.stopPropagation();
    if (e.delta < 5) onSelect(id);
  };
  return (
    <group
      position={[x, 0.12, z]}
      onClick={pick}
      onPointerOver={(e) => {
        e.stopPropagation();
        setHover(true);
        document.body.style.cursor = "pointer";
      }}
      onPointerOut={() => {
        setHover(false);
        document.body.style.cursor = "auto";
      }}
    >
      {!pavilion && (
        <>
          <Block
            position={[0, 0.035, 0]}
            scale={[4.8, 0.07, 4.25]}
            material={materials.paving}
          />
          {/* 墙体：稻香村黄泥、蘅芜苑石绿，其余粉墙 */}
          <Block
            position={[-2.35, 0.45, 0]}
            scale={[0.12, 0.9, 4.15]}
            material={id === "daoxiang" ? materials.stone : materials.wall}
          />
          <Block
            position={[2.35, 0.45, 0]}
            scale={[0.12, 0.9, 4.15]}
            material={id === "hengwu" ? materials.stone : materials.wall}
          />
          {id !== "hengwu" && (
            <Block position={[0, 0.45, -2]} scale={[4.8, 0.9, 0.12]} />
          )}
          {id === "hengwu" ? (
            /* 蘅芜苑：山石围合的低平院落 */
            <>
              <mesh
                geometry={stoneGeo}
                material={materials.stone}
                scale={[1.5, 1.2, 1]}
                position={[0, 0.7, -2.1]}
                castShadow
              />
              <mesh
                geometry={stoneGeo}
                material={materials.stone}
                scale={[0.9, 0.9, 0.8]}
                position={[-1.4, 0.5, -1.8]}
                castShadow
              />
              <RealBuilding
                model="/models/hengwu.glb"
                position={[0, 0, -0.7]}
                width={3}
                fallback={<Building position={[0, 0, -0.7]} w={2.9} d={1.5} color="#6b7f6a" height={1.1} />}
              />
              <Building
                position={[1.9, 0, 0.5]}
                w={1.5}
                d={0.8}
                rotation={Math.PI / 2}
                color="#6b7f6a"
                height={1}
              />
            </>
          ) : id === "daoxiang" ? (
            /* 稻香村：黄泥茅屋与杏花 */
            <>
              <RealBuilding
                model="/models/daoxiang.glb"
                position={[0, 0, -0.8]}
                width={3.2}
                fallback={<Building position={[0, 0, -0.8]} w={3.1} d={1.5} color="#b28a4e" height={1.15} thatch />}
              />
              <Building
                position={[-1.6, 0, 0.6]}
                w={1.4}
                d={0.7}
                rotation={Math.PI / 2}
                color="#b28a4e"
                height={1}
                thatch
              />
              <group position={[2.1, 0, -0.4]}>
                <Block position={[0, 0.5, 0]} scale={[0.1, 1, 0.1]} material={materials.wood} />
                {blossom(0, 0, "#d3a5b4", 0.9)}
                {blossom(0.7, 0.2, "#d8b3bf", 0.6)}
                {blossom(-0.5, 0.3, "#c98f9f", 0.55)}
              </group>
            </>
          ) : id === "qiushuang" ? (
            /* 秋爽斋：阔朗大厅与梧桐 */
            <>
              <RealBuilding
                model="/models/qiushuang.glb"
                position={[0, 0, -0.7]}
                width={3.6}
                fallback={<Building position={[0, 0, -0.7]} w={4.1} d={1.6} color="#55644e" height={1.5} posts={7} />}
              />
              <Building
                position={[0, 0, 0.8]}
                w={2.4}
                d={0.8}
                color="#55644e"
                height={1.15}
              />
              <group position={[2.5, 0, -0.1]}>
                {blossom(0, 0, "#6c8464", 0.9)}
                {blossom(0.6, 0.3, "#7d946c", 0.7)}
                {blossom(-0.5, 0.35, "#5f7a56", 0.6)}
                <Block position={[0, 0.4, 0]} scale={[0.12, 0.8, 0.12]} material={materials.wood} />
              </group>
            </>
          ) : id === "longcui" ? (
            /* 栊翠庵：禅院与小塔花木 */
            <>
              <RealBuilding
                model="/models/longcui.glb"
                position={[-1.3, 0, -0.6]}
                width={2.7}
                fallback={<Building position={[-1.3, 0, -0.6]} w={2.6} d={1.4} color="#9c6f4a" height={1.3} />}
              />
              <Tower position={[1.7, 0, -1.4]} color="#9c6f4a" />
              <group position={[1.4, 0, 0.6]}>
                {blossom(0, 0, "#c993a4", 0.7)}
                {blossom(0.7, 0.2, "#c3a0a8", 0.55)}
              </group>
              <group position={[-1.6, 0, 0.7]}>
                {[0, 1, 2, 3].map((i) => (
                  <Block
                    key={i}
                    position={[i * 0.24, 0.6, Math.sin(i) * 0.1]}
                    scale={[0.06, 1.2, 0.06]}
                    material={materials.roof}
                  />
                ))}
              </group>
            </>
          ) : (
            /* 潇湘馆 / 怡红院：粉墙书斋、修竹与海棠 */
            <>
              <RealBuilding
                model={`/models/${id}.glb`}
                position={[0, 0, -0.9]}
                width={id === "yihong" ? 3.7 : 3.3}
                fallback={
                  <Building
                    position={[0, 0, -0.9]}
                    w={id === "yihong" ? 3.9 : 3.3}
                    d={1.6}
                    color={id === "yihong" ? "#8d4434" : "#637b6b"}
                    height={id === "yihong" ? 1.5 : 1.3}
                    posts={id === "yihong" ? 6 : 5}
                  />
                }
              />
              {id === "yihong" ? (
                <>
                  <Building
                    position={[-1.7, 0, 0.7]}
                    w={1.6}
                    d={0.8}
                    rotation={Math.PI / 2}
                    color="#8d4434"
                    height={1.2}
                  />
                  <Building
                    position={[1.7, 0, 0.7]}
                    w={1.6}
                    d={0.8}
                    rotation={Math.PI / 2}
                    color="#8d4434"
                    height={1.2}
                  />
                  <group position={[2.4, 0, 0.2]}>
                    {blossom(0, 0, "#b45a6b", 0.9)}
                    {blossom(0.6, 0.2, "#c26b79", 0.65)}
                    {blossom(-0.4, 0.3, "#a94f60", 0.55)}
                  </group>
                  <Block
                    position={[0, 0.9, 1.6]}
                    scale={[0.1, 0.5, 0.1]}
                    material={materials.dark}
                  />
                </>
              ) : (
                <>
                  <Building
                    position={[-1.5, 0, 0.7]}
                    w={1.6}
                    d={0.8}
                    rotation={Math.PI / 2}
                    color="#637b6b"
                    height={1.15}
                  />
                  <BambooScreen position={[1.9, 0, -0.2]} n={6} />
                  {[0, 1, 2, 3].map((i) => (
                    <Block
                      key={i}
                      position={[2.6 + (i % 2) * 0.2, 1 + Math.floor(i / 2) * 0.2, 1.2]}
                      scale={[0.05, 1.4, 0.05]}
                      material={materials.roof}
                    />
                  ))}
                </>
              )}
            </>
          )}
          <Block
            position={[0, 0.06, 0.9]}
            scale={[0.9, 0.06, 2]}
            material={materials.stone}
          />
        </>
      )}
      {pavilion && id === "qinfang" && (
        <RealBuilding
          model="/models/qinfang.glb"
          position={[0, 0, 0]}
          width={2.4}
          fallback={<Building w={1.8} d={1.8} open color="#7c8b6d" height={1.1} posts={4} />}
        />
      )}
      {pavilion && id === "ouxiang" && (
        <>
          <RealBuilding
            model="/models/ouxiang.glb"
            position={[0, 0, 0]}
            width={3}
            fallback={<Building w={2.7} d={1.9} open color="#6d8570" height={1.2} posts={5} />}
          />
          {/* 临水荷池 */}
          <mesh
            geometry={sphere}
            position={[-1.9, 0.4, 1.6]}
            scale={[0.6, 0.3, 0.6]}
          >
            <meshStandardMaterial color="#6f9a54" roughness={1} />
          </mesh>
          <mesh
            geometry={sphere}
            position={[-1.3, 0.42, 1.9]}
            scale={[0.45, 0.22, 0.45]}
          >
            <meshStandardMaterial color="#79a35c" roughness={1} />
          </mesh>
          <mesh position={[-1.6, 0.7, 1.7]}>
            <sphereGeometry args={[0.14, 12, 12]} />
            <meshStandardMaterial color="#d98a9e" roughness={1} />
          </mesh>
        </>
      )}
      {(selected || hover) && (
        <Line
          points={
            pavilion
              ? [
                  [-1.7, 0.1, -1.5],
                  [1.7, 0.1, -1.5],
                  [1.7, 0.1, 1.5],
                  [-1.7, 0.1, 1.5],
                  [-1.7, 0.1, -1.5],
                ]
              : [
                  [-2.5, 0.1, -2.2],
                  [2.5, 0.1, -2.2],
                  [2.5, 0.1, 2.2],
                  [-2.5, 0.1, 2.2],
                  [-2.5, 0.1, -2.2],
                ]
          }
          color={selected ? "#a24e3a" : "#8b9b79"}
          lineWidth={1.8}
          dashed
          dashSize={0.18}
          gapSize={0.1}
        />
      )}
      <Html position={[0, 3.1, -0.4]} center zIndexRange={[20, 0]}>
        <button
          className={`map-label ${selected ? "selected" : ""}`}
          onClick={(e) => {
            e.stopPropagation();
            onSelect(id);
          }}
          aria-label={`游览${place.name}`}
        >
          <span>{place.name}</span>
          {selected && <i />}
        </button>
      </Html>
    </group>
  );
}
function Forest() {
  const leaves = useRef<THREE.InstancedMesh>(null),
    trunks = useRef<THREE.InstancedMesh>(null),
    rocks = useRef<THREE.InstancedMesh>(null);
  const data = useMemo(() => {
    let seed = 42;
    const random = () => {
      seed = (seed * 16807) % 2147483647;
      return (seed - 1) / 2147483646;
    };
    const trees: { x: number; z: number; s: number; c: THREE.Color }[] = [];
    for (let i = 0; i < 72; i++) {
      const x = random() * 27 - 13.5,
        z = random() * 22 - 11;
      const inCourt = Object.values(layout).some(
        ([a, b]) => Math.abs(x - a) < 3.4 && Math.abs(z - b) < 3,
      );
      const inWater = Math.abs(x - Math.sin(z * 0.32) * 2) < 2.6;
      if (inCourt || inWater) continue;
      trees.push({
        x,
        z,
        s: 0.45 + random() * 0.5,
        c: new THREE.Color(
          ["#5a6b4f", "#4e6247", "#6b7a55", "#3f5238", "#596a4c"][
            Math.floor(random() * 5)
          ],
        ),
      });
    }
    for (let i = 0; i < 12; i++)
      trees.push({
        x: -9 + random() * 4,
        z: -7.3 - random(),
        s: 0.4 + random() * 0.3,
        c: new THREE.Color("#4c6247"),
      });
    return {
      trees,
      stones: Array.from({ length: 26 }, () => ({
        x: random() * 28 - 14,
        z: random() * 23 - 11.5,
        s: 0.25 + random() * 0.65,
      })),
    };
  }, []);
  useEffect(() => {
    const dummy = new THREE.Object3D();
    const clumps: [number, number, number, number][] = [
      [0, 1.62, 0, 1.1],
      [-0.42, 1.2, 0.18, 0.82],
      [0.42, 1.2, -0.16, 0.82],
      [0.05, 1.14, 0.46, 0.76],
    ];
    data.trees.forEach((t, i) => {
      dummy.position.set(t.x, 0.66 * t.s, t.z);
      dummy.scale.set(t.s, t.s * 2.1, t.s);
      dummy.updateMatrix();
      trunks.current!.setMatrixAt(i, dummy.matrix);
      clumps.forEach(([dx, dy, dz, cs], j) => {
        dummy.position.set(t.x + dx * t.s, dy * t.s, t.z + dz * t.s);
        dummy.scale.set(cs * t.s, cs * t.s, cs * t.s);
        dummy.updateMatrix();
        leaves.current!.setMatrixAt(i * clumps.length + j, dummy.matrix);
        leaves.current!.setColorAt(i * clumps.length + j, t.c);
      });
    });
    data.stones.forEach((t, i) => {
      dummy.position.set(t.x, 0.15, t.z);
      dummy.scale.set(t.s, t.s * 1.3, t.s * 0.75);
      dummy.rotation.set(i * 0.5, i, 0);
      dummy.updateMatrix();
      rocks.current!.setMatrixAt(i, dummy.matrix);
    });
    leaves.current!.instanceMatrix.needsUpdate = true;
    leaves.current!.instanceColor!.needsUpdate = true;
    trunks.current!.instanceMatrix.needsUpdate = true;
    rocks.current!.instanceMatrix.needsUpdate = true;
  }, [data]);
  return (
    <>
      <instancedMesh
        ref={trunks}
        args={[trunkGeo, barkMat(), data.trees.length]}
        castShadow
      />
      <instancedMesh
        ref={leaves}
        args={[sphere, undefined, data.trees.length * 4]}
        castShadow
        receiveShadow
      >
        <meshStandardMaterial roughness={1} />
      </instancedMesh>
      <instancedMesh
        ref={rocks}
        args={[stoneGeo, materials.stone, data.stones.length]}
        castShadow
        receiveShadow
      />
    </>
  );
}
function Water() {
  const shape = useMemo(() => {
    const s = new THREE.Shape();
    s.moveTo(-1, -11);
    s.bezierCurveTo(8, -9, 5, -5, 1, -3);
    s.bezierCurveTo(-3, 0, 4, 1, 4, 4);
    s.bezierCurveTo(3, 8, -2, 9, -2, 11);
    s.lineTo(-4, 11);
    s.bezierCurveTo(-6, 5, 0, 5, -2, 2);
    s.bezierCurveTo(-6, -1, -2, -5, 1, -6);
    s.bezierCurveTo(4, -9, 0, -9, -1, -11);
    return s;
  }, []);
  return (
    <group rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.08, 0]}>
      <mesh>
        <shapeGeometry args={[shape, 48]} />
        <primitive object={waterMat()} attach="material" />
      </mesh>
      {Array.from({ length: 18 }, (_, i) => (
        <mesh
          key={i}
          position={[
            Math.sin(i * 1.7) * 1.3 + 1,
            Math.cos(i * 2.1) * 3 - 3,
            0.02,
          ]}
        >
          <ringGeometry
            args={[
              0.16 + (i % 3) * 0.09,
              0.18 + (i % 3) * 0.09,
              32,
              1,
              0,
              Math.PI * 1.3,
            ]}
          />
          <meshBasicMaterial
            color="#c1d1b8"
            transparent
            opacity={0.45}
            side={THREE.DoubleSide}
          />
        </mesh>
      ))}
    </group>
  );
}
function Bridge({
  position,
  rotation = 0,
}: {
  position: [number, number, number];
  rotation?: number;
}) {
  return (
    <group position={position} rotation={[0, rotation, 0]}>
      {Array.from({ length: 15 }, (_, i) => {
        const x = (i - 7) * 0.25,
          y = 0.2 + Math.sin((i / 14) * Math.PI) * 0.5;
        return (
          <group key={i}>
            <Block
              position={[x, y, 0]}
              scale={[0.27, 0.13, 1.1]}
              material={materials.paving}
            />
            {i % 2 === 0 &&
              [-1, 1].map((s) => (
                <Block
                  key={s}
                  position={[x, y + 0.28, s * 0.47]}
                  scale={[0.07, 0.6, 0.07]}
                  material={materials.trim}
                />
              ))}
          </group>
        );
      })}
      {[-1, 1].map((s) => (
        <Line
          key={s}
          points={Array.from(
            { length: 25 },
            (_, i) =>
              [
                (i - 12) * 0.15,
                0.72 + Math.sin((i / 24) * Math.PI) * 0.5,
                s * 0.47,
              ] as [number, number, number],
          )}
          color="#b1b49b"
          lineWidth={3}
        />
      ))}
    </group>
  );
}
function BambooGrove() {
  const stems = useRef<THREE.InstancedMesh>(null);
  const leaves = useRef<THREE.InstancedMesh>(null);
  useEffect(() => {
    const item = new THREE.Object3D();
    for (let i = 0; i < 30; i++) {
      const x = -9.2 + (i % 10) * 0.47;
      const z = -7.4 + Math.floor(i / 10) * 0.32;
      const height = 2.1 + Math.sin(i * 13) * 0.6;
      item.position.set(x, height / 2, z);
      item.rotation.set(0, 0, Math.sin(i) * 0.07);
      item.scale.set(0.4, height, 0.4);
      item.updateMatrix();
      stems.current!.setMatrixAt(i, item.matrix);
      for (let j = 0; j < 6; j++) {
        const angle = j * 2.4 + i;
        item.position.set(
          x + Math.cos(angle) * 0.24,
          height - j * 0.15,
          z + Math.sin(angle) * 0.24,
        );
        item.rotation.set(0.2, angle, -0.4);
        item.scale.set(0.2, 0.07, 0.65);
        item.updateMatrix();
        leaves.current!.setMatrixAt(i * 6 + j, item.matrix);
      }
    }
    stems.current!.instanceMatrix.needsUpdate = true;
    leaves.current!.instanceMatrix.needsUpdate = true;
  }, []);
  return (
    <>
      <instancedMesh
        ref={stems}
        args={[trunkGeo, materials.roof, 30]}
        castShadow
      />
      <instancedMesh
        ref={leaves}
        args={[sphere, materials.dark, 180]}
        castShadow
      />
    </>
  );
}
function Landscape() {
  return (
    <>
      <Block
        position={[0, -0.32, 0]}
        scale={[29, 0.6, 24]}
        material={grassMat()}
      />
      <Block
        position={[0, -0.65, 0]}
        scale={[29.15, 0.13, 24.15]}
        material={materials.paving}
      />
      <Water />
      {[
        [0, 0, 11.55, 28.5, 0.8, 0.16],
        [0, 0, -11.55, 28.5, 0.8, 0.16],
        [-14.2, 0, 0, 0.16, 0.8, 23],
        [14.2, 0, 0, 0.16, 0.8, 23],
      ].map((a, i) => (
        <group key={i}>
          <Block position={[a[0], 0.4, a[2]]} scale={[a[3], a[4], a[5]]} />
          <Block
            position={[a[0], 0.85, a[2]]}
            scale={[a[3] + 0.1, 0.1, a[5] + 0.1]}
            material={materials.roof}
          />
        </group>
      ))}
      <Forest />
      <BambooGrove />
      <Bridge position={[0.1, 0, 3.6]} rotation={0.15} />
      <Bridge position={[1.9, 0, -4]} rotation={-0.3} />
      <Building position={[0, 0, 11.6]} w={3.7} d={1.25} open />
      {[-1, 1].map((s) => (
        <group
          key={s}
          position={[s * 4, 0.12, 9.7]}
          rotation={[0, s * 0.28, 0]}
        >
          <Block
            position={[0, 0, 0]}
            scale={[5, 0.1, 0.7]}
            material={materials.paving}
          />
          <group position={[0, 1.05, 0]}>
            <Roof w={5.3} d={1} h={0.35} />
          </group>
          {[-2, -1, 0, 1, 2].map((x) => (
            <Block
              key={x}
              position={[x, 0.5, 0.2]}
              scale={[0.06, 1, 0.06]}
              material={materials.wood}
            />
          ))}
        </group>
      ))}
      {[
        [-11, -9],
        [10, 9],
        [11, -9],
      ].map(([x, z], i) => (
        <group key={i} position={[x, 0.1, z]}>
          <mesh
            geometry={stoneGeo}
            material={materials.stone}
            scale={[1.4, 1.6, 1.1]}
            position={[0, 0.8, 0]}
            castShadow
          />
          <mesh
            geometry={stoneGeo}
            material={materials.stone}
            scale={[0.8, 1.2, 1]}
            position={[1, 0.5, 0.4]}
            castShadow
          />
        </group>
      ))}
      {Array.from({ length: 28 }, (_, i) => {
        const t = i / 27;
        return (
          <Block
            key={i}
            position={[-12 + 24 * t, 0.05, Math.sin(t * Math.PI * 3) * 1.2]}
            scale={[0.52, 0.08, 0.65]}
            material={materials.paving}
            rotation={[0, Math.cos(t * Math.PI * 3) * 0.2, 0]}
          />
        );
      })}
    </>
  );
}
export interface CameraCommand {
  mode:
    | "perspective"
    | "top"
    | "focus"
    | "reset"
    | "zoomIn"
    | "zoomOut"
    | "left"
    | "right";
  tick: number;
}
function CameraRig({
  command,
  selected,
  onManual,
}: {
  command: CameraCommand;
  selected: string;
  onManual: () => void;
}) {
  const ref = useRef<OrbitControlsImpl>(null);
  const camera = useThree((s) => s.camera);
  const motion = useRef<{
    position: THREE.Vector3;
    target: THREE.Vector3;
  } | null>(null);
  useEffect(() => {
    const controls = ref.current;
    if (!controls) return;
    const target = controls.target.clone(),
      position = camera.position.clone();
    const [x, z] = layout[selected];
    if (command.mode === "focus") {
      target.set(x, 0, z);
      position.set(x + 13, 17, z + 19);
    } else if (command.mode === "top") {
      target.set(0, 0, 0);
      position.set(0, 42, 0.1);
    } else if (command.mode === "perspective" || command.mode === "reset") {
      target.set(0, 0, 0);
      position.set(21, 25, 28);
    } else if (command.mode === "zoomIn" || command.mode === "zoomOut") {
      position
        .sub(target)
        .multiplyScalar(command.mode === "zoomIn" ? 0.8 : 1.25)
        .clampLength(12, 65)
        .add(target);
    } else {
      position
        .sub(target)
        .applyAxisAngle(
          new THREE.Vector3(0, 1, 0),
          command.mode === "left" ? 0.3 : -0.3,
        )
        .add(target);
    }
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      camera.position.copy(position);
      controls.target.copy(target);
      controls.update();
    } else motion.current = { position, target };
  }, [command, selected, camera]);
  useFrame((_, delta) => {
    if (motion.current && ref.current) {
      const a = 1 - Math.exp(-5 * delta);
      camera.position.lerp(motion.current.position, a);
      ref.current.target.lerp(motion.current.target, a);
      ref.current.update();
      if (camera.position.distanceTo(motion.current.position) < 0.02)
        motion.current = null;
    }
  });
  return (
    <OrbitControls
      ref={ref}
      makeDefault
      enablePan={false}
      minDistance={12}
      maxDistance={65}
      minPolarAngle={0.02}
      maxPolarAngle={Math.PI / 2.65}
      enableDamping
      dampingFactor={0.08}
      onStart={() => {
        motion.current = null;
        onManual();
      }}
    />
  );
}
class GardenBoundary extends Component<
  { children: ReactNode },
  { error: boolean }
> {
  state = { error: false };
  static getDerivedStateFromError() {
    return { error: true };
  }
  render() {
    return this.state.error ? (
      <div className="scene-error">
        <h3>立体园林暂未加载</h3>
        <p>仍可从左侧院落索引阅读故事。</p>
        <button onClick={() => window.location.reload()}>重新加载</button>
      </div>
    ) : (
      this.props.children
    );
  }
}
export default function Garden({
  selected,
  onSelect,
  command,
  route,
  onManual,
  onReady,
}: {
  selected: string;
  onSelect: (id: string) => void;
  command: CameraCommand;
  route: string[];
  onManual: () => void;
  onReady: () => void;
}) {
  return (
    <GardenBoundary>
      <Canvas
        shadows
        dpr={[1, 1.5]}
        camera={{ position: [21, 25, 28], fov: 30, near: 0.1, far: 150 }}
        gl={{ antialias: true, alpha: true }}
        onCreated={({ gl }) => {
          gl.setClearColor("#edf0e6", 0);
          onReady();
        }}
      >
        <ambientLight intensity={1.15} />
        <hemisphereLight args={["#eef3ff", "#7f8f72", 0.95]} />
        <directionalLight
          position={[-15, 30, 15]}
          intensity={2.6}
          castShadow
          shadow-mapSize={[2048, 2048]}
          shadow-camera-left={-24}
          shadow-camera-right={24}
          shadow-camera-top={24}
          shadow-camera-bottom={-24}
          shadow-bias={-0.0004}
        />
        <fog attach="fog" args={["#a9b7a5", 55, 130]} />
        <Landscape />
        {places.map((p) => (
          <Courtyard
            key={p.id}
            id={p.id}
            selected={selected === p.id}
            onSelect={onSelect}
          />
        ))}
        {route.length > 1 && (
          <Line
            points={route.map(
              (id) =>
                [layout[id][0], 0.3, layout[id][1]] as [number, number, number],
            )}
            color="#aa593f"
            dashed
            dashSize={0.22}
            gapSize={0.15}
            lineWidth={2}
          />
        )}
        <mesh
          rotation={[-Math.PI / 2, 0, 0]}
          position={[0, -0.76, 0]}
          receiveShadow
        >
          <planeGeometry args={[200, 200]} />
          <shadowMaterial transparent opacity={0.16} />
        </mesh>
        <CameraRig command={command} selected={selected} onManual={onManual} />
      </Canvas>
    </GardenBoundary>
  );
}
