import { test, expect } from "@playwright/test";
test("院落、故事、诗词与返回上下文一致", async ({ page }) => {
  const errors: string[] = [];
  // 忽略懒加载 GLB 在 reload/导航时被中断的良性 fetch abort（不影响功能）。
  page.on("pageerror", (e) => {
    if (!/signal is aborted/i.test(e.message)) errors.push(e.message);
  });
  await page.goto("/");
  await expect(
    page.getByRole("button", { name: "游览潇湘馆", exact: true }),
  ).toBeVisible();
  await page.getByRole("button", { name: /第 37 回 偶结海棠社/ }).click();
  await expect(page.locator(".detail-heading")).toHaveText("秋爽斋梧桐");
  await expect(page.locator(".detail-content")).toContainText("林黛玉");
  await page.getByRole("button", { name: "展开诗笺", exact: true }).click();
  await expect(page.getByRole("dialog")).toContainText("半卷湘帘半掩门");
  await page.getByRole("button", { name: "回到故事", exact: true }).click();
  await expect(page.getByRole("dialog")).toHaveCount(0);
  await page.getByRole("button", { name: "栊翠庵 妙玉", exact: true }).click();
  await expect(page).toHaveURL(/place=longcui$/);
  await expect(page.locator(".poetry-preview")).toContainText("未收录文字");
  await page.goBack();
  await expect(page.locator(".detail-heading")).toContainText("秋爽斋");
  await page.reload();
  await expect(page.locator(".detail-content")).toContainText("探春");
  expect(errors).toEqual([]);
});
test("地图标签拾取、俯视、旋转与导览可操作", async ({ page }) => {
  await page.goto("/");
  await page.getByRole("button", { name: "游览蘅芜苑", exact: true }).click();
  await expect(page.locator(".detail-heading")).toContainText("蘅芜苑");
  await page.getByRole("button", { name: "俯视", exact: true }).click();
  await expect(
    page.getByRole("button", { name: "俯视", exact: true }),
  ).toHaveClass("active");
  await page.getByRole("button", { name: "返回全园", exact: true }).click();
  await page.getByRole("button", { name: /第 17 回 题额大观园/ }).click();
  await page.getByRole("button", { name: "沿故事游园", exact: true }).click();
  await expect(page.locator(".tour-bar")).toContainText("第 1 / 5 站");
  await page.getByRole("button", { name: "下一站", exact: true }).click();
  await expect(page.locator(".tour-bar")).toContainText("第 2 / 5 站 · 潇湘馆");
  await page.getByRole("button", { name: "播放导览", exact: true }).click();
  await expect(
    page.getByRole("button", { name: "暂停导览", exact: true }),
  ).toBeVisible();
  await page.getByRole("button", { name: "暂停导览", exact: true }).click();
  await page.getByRole("button", { name: "退出导览", exact: true }).click();
  await expect(page.locator(".tour-bar")).toHaveCount(0);
});
test("人物画像与关系、诗词查询、空状态、键盘关闭", async ({ page }) => {
  await page.goto("/");
  await page.getByRole("textbox", { name: "寻找院落或人物" }).fill("无此院落");
  await expect(page.locator(".place-list")).toContainText("没有找到");
  await page.getByRole("button", { name: "查看全部院落", exact: true }).click();
  await page
    .getByRole("navigation")
    .getByRole("button", { name: "人物", exact: true })
    .click();
  await page.getByRole("textbox", { name: "搜索人物" }).fill("黛玉");
  await expect(page.locator(".person-card")).toHaveCount(1);
  await page.locator(".person-card").click();
  // 打开人物详情：画像 + 关系图谱
  await expect(page.getByRole("dialog")).toContainText("林黛玉");
  await expect(page.locator(".relation-graph")).toBeVisible();
  await expect(page.locator(".person-bust")).toContainText("潇湘妃子");
  await page.keyboard.press("Escape");
  await expect(page.getByRole("dialog")).toHaveCount(0);

  await page
    .getByRole("navigation")
    .getByRole("button", { name: "诗词", exact: true })
    .click();
  await page.getByRole("textbox", { name: "搜索诗词" }).fill("珍重芳姿");
  await expect(page.locator(".poem-card")).toHaveCount(1);
  await page.locator(".poem-card").click();
  await expect(page.getByRole("dialog")).toContainText("珍重芳姿昼掩门");
  // 食饮与药方分类
  await page.keyboard.press("Escape");
  await page
    .getByRole("navigation")
    .getByRole("button", { name: "诗词", exact: true })
    .click();
  await page.getByRole("tab", { name: /食饮/ }).click();
  await expect(page.locator(".poem-card").first()).toContainText("茄鲞");
  await page.getByRole("tab", { name: /药方/ }).click();
  await expect(page.locator(".poem-card").first()).toContainText("冷香丸");
  await page.keyboard.press("Escape");
  await expect(page.getByRole("dialog")).toHaveCount(0);
});
test("手机无横向溢出，索引与详情可用", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/");
  await page.getByRole("button", { name: "院落索引", exact: true }).click();
  await page.getByRole("textbox", { name: "寻找院落或人物" }).fill("宝钗");
  await page
    .getByRole("button", { name: "蘅芜苑 薛宝钗", exact: true })
    .click();
  await expect(page.locator(".index-panel")).not.toBeVisible();
  await expect(page.locator(".detail-heading")).toContainText("蘅芜苑");
  expect(
    await page.evaluate(
      () => document.documentElement.scrollWidth <= window.innerWidth,
    ),
  ).toBe(true);
  await page.screenshot({ path: "docs/mobile-preview.png", fullPage: true });
});

test("人物关系图谱可全屏、切换人物并返回", async ({ page }) => {
  await page.goto("/");
  await page.getByRole("navigation").getByRole("button", { name: "人物" }).click();
  await page.getByRole("textbox", { name: "搜索人物" }).fill("黛玉");
  await page.locator(".person-card").first().click();
  await expect(page.getByRole("button", { name: "全屏" })).toBeVisible();
  await page.getByRole("button", { name: "全屏" }).click();
  await expect(page.locator(".graph-fullscreen")).toBeVisible();
  await expect(page.locator(".graph-full-head")).toContainText("林黛玉");
  // 全屏内点击节点切换人物
  await page
    .locator(".graph-fullscreen .rf-person")
    .filter({ hasText: "宝钗" })
    .first()
    .click();
  await expect(page.locator(".graph-full-head h3")).toContainText("薛宝钗");
  // 关闭回到人物详情
  await page.locator(".graph-full-head .icon-button").click();
  await expect(page.locator(".graph-fullscreen")).toHaveCount(0);
  await expect(page.locator(".person-bust")).toContainText("薛宝钗");
});
