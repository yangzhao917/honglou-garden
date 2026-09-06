import { chromium } from '@playwright/test';
const browser = await chromium.launch({ channel: 'chrome' });
const page = await browser.newPage({ viewport: { width: 1400, height: 900 } });
await page.goto('http://localhost:5173/');
await page.waitForLoadState('networkidle');
await page.click('text=诗词');
await page.waitForTimeout(500);
await page.locator('.poem-card').first().click();
await page.waitForTimeout(1200);

const info = await page.evaluate(() => {
  const cubeFace = document.querySelector('.cube-face');
  const cubeText = document.querySelector('.cube-text');
  const cubeArt = document.querySelector('.cube-art');
  const tabs = [...document.querySelectorAll('.reader-tab')].map(t => ({text: t.textContent.trim(), selected: t.getAttribute('aria-selected')}));
  const canvas = document.querySelector('.poem-cube-stage canvas');
  const html3d = [...document.querySelectorAll('.poem-cube-stage [class*="Html"]')];
  return {
    hasCubeFace: !!cubeFace,
    hasCubeText: !!cubeText,
    hasCubeArt: !!cubeArt,
    tabs,
    canvasSize: canvas ? `${canvas.width}x${canvas.height}` : null,
    // 检查 drei Html 是否渲染
    htmlCount: html3d.length,
    // 文字内容是否在 cube 里
    textSample: cubeText ? cubeText.querySelector('.cube-text-lines p')?.textContent : null,
  };
});
console.log(JSON.stringify(info, null, 2));
await browser.close();
