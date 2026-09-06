import { chromium } from '@playwright/test';
const browser = await chromium.launch({ channel: 'chrome' });
const page = await browser.newPage({ viewport: { width: 1400, height: 900 } });
await page.goto('http://localhost:5173/');
await page.waitForLoadState('networkidle');
await page.click('text=诗词');
await page.waitForTimeout(500);
await page.locator('.poem-card').first().click();
await page.waitForTimeout(1000);

// 检查 canvas 存在
const hasCanvas = await page.evaluate(() => {
  const c = document.querySelector('.poem-cube-stage canvas');
  return c ? { w: c.width, h: c.height } : null;
});
console.log('canvas:', JSON.stringify(hasCanvas));

await page.screenshot({ path: '/tmp/cube-text.png', clip: { x: 350, y: 80, width: 700, height: 760 } });

// 点意境
await page.locator('button[role="tab"]', { hasText: '意境' }).click();
await page.waitForTimeout(450);
await page.screenshot({ path: '/tmp/cube-mid.png', clip: { x: 350, y: 80, width: 700, height: 760 } });
await page.waitForTimeout(800);
await page.screenshot({ path: '/tmp/cube-art.png', clip: { x: 350, y: 80, width: 700, height: 760 } });

// 采样旋转
const s = await page.evaluate(() => {
  const el = document.querySelector('.poem-cube-stage canvas');
  return el ? { w: el.clientWidth, h: el.clientHeight } : null;
});
console.log('stage:', JSON.stringify(s));
await browser.close();
