import { chromium } from '@playwright/test';
const browser = await chromium.launch({ channel: 'chrome' });
const page = await browser.newPage({ viewport: { width: 1400, height: 900 } });
await page.goto('http://localhost:5173/');
await page.waitForLoadState('networkidle');
await page.click('text=诗词');
await page.waitForTimeout(500);
await page.locator('.poem-card').first().click();
await page.waitForTimeout(2000);

// 截取 canvas 区域并分析中心像素 —— 用 canvas.toDataURL 检查是否非纯背景
const analysis = await page.evaluate(() => {
  const canvas = document.querySelector('.poem-cube-stage canvas');
  const gl = canvas.getContext('webgl2') || canvas.getContext('webgl');
  if (!gl) return { gl: false };
  // 读取中心区域像素
  const w = 50, h = 50;
  const px = new Uint8Array(w * h * 4);
  gl.readPixels(gl.drawingBufferWidth/2 - w/2, gl.drawingBufferHeight/2 - h/2, w, h, gl.RGBA, gl.UNSIGNED_BYTE, px);
  // 统计非透明像素比例 & 平均色
  let solid = 0;
  const avg = [0,0,0];
  for (let i = 0; i < px.length; i += 4) {
    if (px[i+3] > 30) { solid++; avg[0]+=px[i]; avg[1]+=px[i+1]; avg[2]+=px[i+2]; }
  }
  if (solid > 0) { avg[0]/=solid; avg[1]/=solid; avg[2]/=solid; }
  return { gl: true, solidRatio: solid / (w*h), avgColor: avg.map(Math.round) };
});
console.log('analysis:', JSON.stringify(analysis));
await browser.close();
