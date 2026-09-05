import * as THREE from "three";

/** 程序化环境贴图：草地、树皮、水面。低频连续，避免明显重复感。 */
function canvasTex(
  w: number,
  h: number,
  draw: (ctx: CanvasRenderingContext2D, w: number, h: number) => void,
) {
  const c = document.createElement("canvas");
  c.width = w;
  c.height = h;
  const ctx = c.getContext("2d")!;
  draw(ctx, w, h);
  const t = new THREE.CanvasTexture(c);
  t.colorSpace = THREE.SRGBColorSpace;
  t.anisotropy = 8;
  t.wrapS = t.wrapT = THREE.RepeatWrapping;
  return t;
}

function grass(): THREE.CanvasTexture {
  return canvasTex(256, 256, (ctx, w, h) => {
    ctx.fillStyle = "#6f7d57";
    ctx.fillRect(0, 0, w, h);
    for (let i = 0; i < 1400; i++) {
      const g = 90 + Math.random() * 90;
      ctx.strokeStyle = `rgba(${g * 0.6 | 0},${g | 0},${g * 0.45 | 0},${0.25 + Math.random() * 0.3})`;
      ctx.lineWidth = 1;
      const x = Math.random() * w, y = Math.random() * h;
      ctx.beginPath();
      ctx.moveTo(x, y);
      ctx.lineTo(x + (Math.random() - 0.5) * 4, y - 3 - Math.random() * 5);
      ctx.stroke();
    }
    // 草色斑块
    for (let i = 0; i < 40; i++) {
      ctx.fillStyle = `rgba(${110 + Math.random() * 40},${130 + Math.random() * 40},${80 + Math.random() * 30},0.08)`;
      ctx.beginPath();
      ctx.ellipse(Math.random() * w, Math.random() * h, 20 + Math.random() * 40, 12 + Math.random() * 24, Math.random() * 3, 0, 7);
      ctx.fill();
    }
  });
}

function bark(): THREE.CanvasTexture {
  return canvasTex(128, 128, (ctx, w, h) => {
    ctx.fillStyle = "#5b4630";
    ctx.fillRect(0, 0, w, h);
    for (let i = -2; i < 20; i++) {
      ctx.strokeStyle = `rgba(${70 + Math.random() * 60},${50 + Math.random() * 40},${30 + Math.random() * 20},${0.4})`;
      ctx.lineWidth = 1 + Math.random() * 2;
      const x = (i / 20) * w;
      ctx.beginPath();
      ctx.moveTo(x, 0);
      for (let y = 0; y <= h; y += 8) ctx.lineTo(x + Math.sin(y * 0.2 + i) * 3, y);
      ctx.stroke();
    }
    // 苔藓绿
    for (let i = 0; i < 40; i++) {
      ctx.fillStyle = `rgba(80,110,70,${0.15 + Math.random() * 0.15})`;
      ctx.fillRect(Math.random() * w, Math.random() * h, 4 + Math.random() * 8, 2 + Math.random() * 4);
    }
  });
}

function water(): THREE.CanvasTexture {
  return canvasTex(256, 256, (ctx, w, h) => {
    ctx.fillStyle = "#4f7d78";
    ctx.fillRect(0, 0, w, h);
    for (let i = 0; i < 220; i++) {
      ctx.strokeStyle = `rgba(${150 + Math.random() * 60},${180 + Math.random() * 50},${170 + Math.random() * 40},${0.06 + Math.random() * 0.12})`;
      ctx.lineWidth = 1;
      const x = Math.random() * w, y = Math.random() * h;
      ctx.beginPath();
      ctx.moveTo(x, y);
      ctx.quadraticCurveTo(x + 10, y + 6, x + 22, y + (Math.random() - 0.5) * 6);
      ctx.stroke();
    }
  });
}

export interface EnvTextures {
  grass: THREE.CanvasTexture;
  bark: THREE.CanvasTexture;
  water: THREE.CanvasTexture;
}
let cached: EnvTextures | null = null;
export function envTextures(): EnvTextures {
  if (cached) return cached;
  cached = { grass: grass(), bark: bark(), water: water() };
  return cached;
}

export const grassMat = () =>
  new THREE.MeshStandardMaterial({ map: envTextures().grass, roughness: 1, metalness: 0, color: new THREE.Color("#8fa276") });
export const barkMat = () =>
  new THREE.MeshStandardMaterial({ map: envTextures().bark, roughness: 0.95, metalness: 0 });
export const waterMat = () =>
  new THREE.MeshStandardMaterial({ map: envTextures().water, roughness: 0.35, metalness: 0.1, color: new THREE.Color("#6fa89b") });
