/** 文学地点与艺术坐标分离：场景坐标不代表原著的真实方位。 */
export interface Place {
  id: string;
  name: string;
  resident: string;
  alias: string;
  mood: string;
  description: string;
  plant: string;
  chapter: number;
  source: string;
}

/** 文学条目类型：诗词曲赋、食饮、药方都算“红楼里的文字与味道”。 */
export type LiteraryKind = "poem" | "food" | "medicine";

export interface LiteraryEntry {
  id: string;
  kind: LiteraryKind;
  title: string;
  /** 诗词作者；食饮与药方无作者时留空。 */
  author: string;
  /** 正文；诗词为一联一行的诗句，食饮/药方为要点文字。 */
  lines: string[];
  chapter: number;
  context: string;
}

export interface Story {
  id: string;
  chapter: number;
  title: string;
  subtitle: string;
  description: string;
  people: string[];
  places: string[];
  poems: string[];
}

/** 人物是独立于居所的信息实体；居所仅通过 placeId 关联。 */
export interface Person {
  id: string;
  name: string;
  alias: string;
  role: string;
  placeId?: string;
  accent: string;
  /** 画像中的象征物：竹、海棠、香草、菊……用于区分人物意象。 */
  plant: string;
}

/** 关系类型：亲属、主仆、交往、情缘。边上始终配文字说明，不单靠颜色。 */
export type RelationKind = "family" | "servant" | "social" | "sentiment";

export interface Relation {
  from: string;
  to: string;
  kind: RelationKind;
  label: string;
  chapter?: number;
}

export const sourceUrl = (chapter: number) =>
  `https://zh.wikisource.org/wiki/紅樓夢/第${String(chapter).padStart(3, "0")}回`;
