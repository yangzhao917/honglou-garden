import { describe, it, expect } from "vitest";
import {
  selectPlace,
  selectStory,
  searchPlaces,
  searchPeople,
  relationsFor,
} from "../src/application/explore";
import {
  places,
  stories,
  poems,
  literary,
  people,
  mainCharacters,
  relations,
} from "../src/infrastructure/catalog";
describe("游园上下文", () => {
  it("切换到无关院落时清除情节，避免诗词串位", () => {
    expect(selectPlace(stories[1], "longcui")).toEqual({
      placeId: "longcui",
      storyId: null,
    });
  });
  it("切换故事保留合法地点，否则选择该故事首站", () => {
    expect(selectStory(stories[0], "xiaoxiang").placeId).toBe("xiaoxiang");
    expect(selectStory(stories[1], "xiaoxiang").placeId).toBe("qiushuang");
  });
  it("姓名和雅号均可检索，空白查询不误筛选", () => {
    expect(searchPlaces(places, " 潇湘妃子 ")[0].id).toBe("xiaoxiang");
    expect(searchPlaces(places, "无此人物")).toEqual([]);
    expect(searchPlaces(places, " ")).toHaveLength(8);
  });
  it("所有情节的地点和诗词引用有效，不制造空导览", () => {
    for (const story of stories) {
      expect(story.places.length).toBeGreaterThan(0);
      for (const id of story.places)
        expect(places.some((p) => p.id === id)).toBe(true);
      for (const id of story.poems)
        expect(poems.some((p) => p.id === id)).toBe(true);
    }
    expect(new Set(places.map((p) => p.id)).size).toBe(places.length);
  });
});

describe("人物与关系", () => {
  it("人物目录仅展示主线人物，名称/雅号可检索", () => {
    expect(mainCharacters.length).toBe(18);
    expect(searchPeople(mainCharacters, "黛玉")[0].id).toBe("daiyu");
    expect(searchPeople(mainCharacters, "凤辣子")[0].id).toBe("xifeng");
    expect(searchPeople(mainCharacters, "贾政")).toEqual([]);
  });
  it("每段关系两侧都能解析到人物，不存在悬空节点", () => {
    for (const r of relations) {
      expect(people.some((p) => p.id === r.from)).toBe(true);
      expect(people.some((p) => p.id === r.to)).toBe(true);
    }
  });
  it("黛玉的一跳关系包含宝玉、宝钗与紫鹃", () => {
    const daiyu = people.find((p) => p.id === "daiyu")!;
    const edges = relationsFor(daiyu, relations, people);
    const names = edges.map((e) => e.other?.name);
    expect(names).toContain("贾宝玉");
    expect(names).toContain("薛宝钗");
    expect(names).toContain("紫鹃");
  });
  it("文学条目分类齐全且均带出处回目", () => {
    expect(new Set(literary.map((l) => l.kind))).toEqual(
      new Set(["poem", "food", "medicine"]),
    );
    for (const l of literary) expect(l.chapter).toBeGreaterThan(0);
  });
});
