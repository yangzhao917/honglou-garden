import type { ReactNode } from "react";

/** 每个院落一幅独立的示意小景：屋顶轮廓、植被与庭院都不相同。 */
export default function HouseArt({
  id,
  className = "house-art",
  photo = false,
}: {
  id: string;
  className?: string;
  /** 左侧索引小图：使用真实园景照片（public/places/<id>.jpg） */
  photo?: boolean;
}) {
  if (photo)
    return (
      <img
        className={`${className} photo-art`}
        src={`/places/${id}.jpg`}
        alt=""
        loading="lazy"
      />
    );
  if (id === "xiaoxiang")
    return (
      <img className={`${className} painted-art`} src="/art/xiaoxiang.png" alt="" />
    );
  const s = scenes[id];
  if (!s) return null;
  return (
    <svg
      className={className}
      viewBox={s.viewBox ?? "0 0 120 90"}
      aria-hidden="true"
    >
      {s.render()}
    </svg>
  );
}

/* 简笔设色的小景，仅供识别，不承担考证。 */
type Scene = { viewBox?: string; render: () => ReactNode };

const scenes: Record<string, Scene> = {
  /* 怡红院：红墙绿蕉，海棠满枝 */
  yihong: {
    render: () => (
      <>
        <ellipse cx="62" cy="78" rx="52" ry="10" fill="#d8dcc2" />
        <rect x="16" y="52" width="66" height="26" fill="#e9e2cf" />
        <path d="M16 52L49 34L82 52Z" fill="#8d4434" />
        <path d="M20 56V78M36 58V78M52 60V78M68 58V78" stroke="#82755b" strokeWidth="3" />
        <rect x="20" y="62" width="12" height="10" fill="#3d5147" />
        <rect x="40" y="64" width="12" height="10" fill="#3d5147" />
        <path d="M10 76C18 60 30 58 40 62" stroke="#55704f" strokeWidth="4" fill="none" />
        <path d="M98 60C92 46 80 42 68 46" stroke="#4c6a49" strokeWidth="5" fill="none" />
        <g fill="#c98a9b">
          {[[28, 40], [34, 34], [40, 42], [90, 46], [96, 40], [86, 38], [72, 40]].map(([x, y], i) => (
            <circle key={i} cx={x} cy={y} r="7" />
          ))}
        </g>
        <g fill="#d9aab8">
          {[[31, 44], [37, 39], [93, 44], [90, 35], [75, 43]].map(([x, y], i) => (
            <circle key={i} cx={x} cy={y} r="4" />
          ))}
        </g>
      </>
    ),
  },
  /* 蘅芜苑：山石藏厦，异草垂藤 */
  hengwu: {
    render: () => (
      <>
        <ellipse cx="58" cy="74" rx="48" ry="9" fill="#cfd5ba" />
        <rect x="38" y="48" width="42" height="26" fill="#eee7d4" />
        <path d="M38 48L59 36L80 48Z" fill="#6b7f6a" />
        <path d="M46 52V74M58 54V74M70 52V74" stroke="#7d7560" strokeWidth="2.6" />
        <path d="M22 66l6-18 6 20 6-22 6 20 7-16 6 18" fill="none" stroke="#5c7a53" strokeWidth="2.4" />
        <path d="M100 62c-2-9-10-13-18-10" stroke="#6b8a5e" strokeWidth="3.4" fill="none" />
        <path d="M16 68c4-4 12-4 16 0M12 72c5-4 14-4 19 0" stroke="#9a997e" strokeWidth="2.2" fill="none" />
        <g fill="#83976e">
          <circle cx="28" cy="52" r="4" /><circle cx="92" cy="46" r="3" />
        </g>
      </>
    ),
  },
  /* 稻香村：黄泥茅屋，杏花疏篱 */
  daoxiang: {
    render: () => (
      <>
        <ellipse cx="58" cy="78" rx="50" ry="9" fill="#d6d1ac" />
        <rect x="30" y="54" width="42" height="24" fill="#c8ad7c" />
        <path d="M24 54l13-11h42l13 11Z" fill="#a98a51" />
        <path d="M28 54h52" stroke="#8a6f3f" strokeWidth="2" />
        <rect x="44" y="62" width="12" height="16" fill="#6b5a36" />
        <path d="M32 58V78M56 58V78M66 58V78" stroke="#8a6d3c" strokeWidth="2.4" />
        <path d="M8 72l3-10 3 10 3-10 3 10 3-10 3 10" stroke="#c58a6b" strokeWidth="1.8" fill="none" />
        <g fill="#d3a5b4">
          <circle cx="100" cy="46" r="5" /><circle cx="106" cy="40" r="4" /><circle cx="94" cy="42" r="4" />
        </g>
        <path d="M14 60h14M16 64h10" stroke="#9a8a5e" strokeWidth="1.6" />
        {/* 稻穗 */}
        <g stroke="#b8a34f" strokeWidth="1.4">
          <path d="M10 70c0-5 2-9 2-12M104 72c0-5 2-8 2-11M96 74c0-4 1-7 1-10" />
        </g>
      </>
    ),
  },
  /* 秋爽斋：阔朗书斋，桐叶疏朗 */
  qiushuang: {
    render: () => (
      <>
        <ellipse cx="60" cy="78" rx="52" ry="9" fill="#d8dccb" />
        <rect x="20" y="46" width="70" height="32" fill="#ece6d2" />
        <path d="M20 46L55 32L90 46Z" fill="#55644e" />
        <path d="M26 52V78M40 50V78M54 48V78M68 50V78M80 52V78" stroke="#7a7459" strokeWidth="2.8" />
        <path d="M104 44c-2-14-10-20-17-16" stroke="#6c8464" strokeWidth="3" fill="none" />
        <g fill="#8fa67a">
          <path d="M104 44c-8-2-12-6-12-10 6-1 10 2 12 10Z" />
          <path d="M90 30c-2-6 2-9 6-8 1 4-2 7-6 8Z" />
        </g>
      </>
    ),
  },
  /* 栊翠庵：清净禅院，花木掩映 */
  longcui: {
    render: () => (
      <>
        <ellipse cx="58" cy="78" rx="48" ry="9" fill="#d3d8c6" />
        <rect x="30" y="50" width="46" height="28" fill="#ece5d0" />
        <path d="M30 50L53 38L76 50Z" fill="#9c6f4a" />
        <path d="M36 54V78M56 56V78M66 54V78" stroke="#7d7560" strokeWidth="2.6" />
        <rect x="42" y="62" width="12" height="16" fill="#4a4038" />
        {/* 小塔 */}
        <rect x="94" y="46" width="14" height="32" fill="#a8885f" />
        <path d="M92 46h18l-9-12Z" fill="#8a6f4a" />
        <path d="M94 52h14M94 60h14M94 68h14" stroke="#c9b18a" strokeWidth="1.4" />
        <g fill="none" stroke="#7d8a66" strokeWidth="1.6">
          <circle cx="22" cy="56" r="10" /><circle cx="22" cy="56" r="6" />
        </g>
        <g fill="#c993a4">
          <circle cx="20" cy="54" r="3" /><circle cx="25" cy="59" r="3" />
        </g>
        <path d="M18 74h20M20 78h16" stroke="#9aa078" strokeWidth="2" />
      </>
    ),
  },
  /* 藕香榭：临水水榭，莲叶田田 */
  ouxiang: {
    render: () => (
      <>
        <path d="M6 78c0-8 18-12 30-10h48c12-2 30 2 30 10Z" fill="#a9c6bb" />
        <rect x="36" y="48" width="48" height="24" fill="#eee7d2" />
        <path d="M36 48L60 36L84 48Z" fill="#6d8570" />
        <path d="M44 52V70M60 52V70M74 52V70" stroke="#7b7459" strokeWidth="2.6" />
        {/* 桥 */}
        <path d="M28 72c8-6 16-6 22 0" stroke="#8a8a6e" strokeWidth="2" fill="none" />
        <g fill="#6f9a54">
          <ellipse cx="20" cy="78" rx="7" ry="3" /><ellipse cx="50" cy="80" rx="8" ry="3" />
          <ellipse cx="84" cy="78" rx="7" ry="3" /><ellipse cx="106" cy="80" rx="7" ry="3" />
        </g>
        <g fill="#d98a9e">
          <path d="M50 74l4-8 4 8Z" /><path d="M84 72l4-8 4 8Z" />
        </g>
      </>
    ),
  },
  /* 沁芳亭：水畔小亭，垂柳隔岸 */
  qinfang: {
    render: () => (
      <>
        <path d="M8 78c0-7 20-10 34-9h36c16-1 34 2 34 9Z" fill="#a9c6bb" />
        <rect x="42" y="42" width="36" height="26" fill="#efe8d3" />
        <path d="M38 46h44l-22-13Z" fill="#7c8b6d" />
        <path d="M46 46V66M56 46V66M66 46V66M76 46V66" stroke="#7b7459" strokeWidth="2.4" />
        <path d="M48 42c0-6-4-9-8-9M72 42c0-6 4-9 8-9" stroke="#6c8464" strokeWidth="2" fill="none" />
        {/* 垂柳 */}
        <path d="M14 34c0 22 2 34 8 44" stroke="#6f8a62" strokeWidth="2" fill="none" />
        <path d="M14 34c-4-2-6 2-4 5M14 34c4-3 8 0 6 4" stroke="#5f7a56" strokeWidth="2" fill="none" />
        <g stroke="#7f9b70" strokeWidth="1.4">
          <path d="M16 40c-3 5-2 9 2 12M15 52c-3 6-1 10 4 12" fill="none" />
        </g>
      </>
    ),
  },
};
