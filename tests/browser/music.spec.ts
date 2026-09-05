import { test, expect } from "@playwright/test";
test("听园音符悬浮于角落、默认自动播放、点击开关", async ({ page }) => {
  const errors: string[] = [];
  page.on("pageerror", (e) => errors.push(e.message));
  await page.goto("/");
  const dock = page.locator(".music-dock");
  await expect(dock).toBeVisible();

  // 悬浮在角落（fixed 定位），音符 + 状态徽标。
  expect(await dock.evaluate((el) => getComputedStyle(el).position)).toBe(
    "fixed",
  );
  await expect(dock.locator("svg").first()).toBeVisible();
  await expect(dock.locator(".music-dock-state")).toBeVisible();

  // 默认自动播放。
  await expect(dock).toHaveAttribute("aria-pressed", "true");

  // 点击即停止。
  await dock.click();
  await expect(dock).toHaveAttribute("aria-pressed", "false");

  // 再点恢复播放。
  await dock.click();
  await expect(dock).toHaveAttribute("aria-pressed", "true");

  expect(errors).toEqual([]);
});
