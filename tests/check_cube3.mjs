import { chromium } from '@playwright/test';
const browser = await chromium.launch({ channel: 'chrome' });
const page = await browser.newPage({ viewport: { width: 1400, height: 900 } });
await page.goto('http://localhost:5173/');
await page.waitForLoadState('networkidle');
await page.click('text=诗词');
await page.waitForTimeout(500);
await page.locator('.poem-card').first().click();
await page.waitForTimeout(1200);

const pos1 = await page.evaluate(() => {
  const f = document.querySelector('.cube-face');
  if (!f) return null;
  const r = f.getBoundingClientRect();
  return { x: r.x, y: r.y, w: r.width, h: r.height, visible: r.width > 0 && r.height > 0 };
});
console.log('text face pos:', JSON.stringify(pos1));

// 点意境
await page.locator('button[role="tab"]', { hasText: '意境' }).click();
await page.waitForTimeout(900);
const pos2 = await page.evaluate(() => {
  const f = document.querySelector('.cube-face');
  if (!f) return null;
  const r = f.getBoundingClientRect();
  return { x: r.x, y: r.y, w: r.width, h: r.height, visible: r.width > 0 && r.height > 0 };
});
console.log('after art click face pos:', JSON.stringify(pos2));

// 截图检查
await page.screenshot({ path: '/tmp/cube_after.png', clip: { x: 350, y: 80, width: 700, height: 760 } });

// 看有几个 cube-face（两个面板都会渲染）
const faces = await page.evaluate(() => {
  return [...document.querySelectorAll('.cube-face')].map(f => {
    const r = f.getBoundingClientRect();
    return { w: Math.round(r.width), h: Math.round(r.height), x: Math.round(r.x), y: Math.round(r.y) };
  });
});
console.log('all faces:', JSON.stringify(faces));
await browser.close();
