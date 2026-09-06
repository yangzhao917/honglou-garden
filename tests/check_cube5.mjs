import { chromium } from '@playwright/test';
const browser = await chromium.launch({ channel: 'chrome' });
const page = await browser.newPage({ viewport: { width: 1400, height: 900 } });
await page.goto('http://localhost:5173/');
await page.waitForLoadState('networkidle');
await page.click('text=诗词');
await page.waitForTimeout(500);
await page.locator('.poem-card').first().click();
await page.waitForTimeout(1500);

// 检查 R3F 场景内部
const scene = await page.evaluate(() => {
  // R3F Canvas 内部是 ref 到 React 组件的。我们直接数 canvas 上挂的 __three 相关对象
  const canvas = document.querySelector('.poem-cube-stage canvas');
  return { hasCanvas: !!canvas };
});
console.log('scene:', JSON.stringify(scene));
await browser.close();
