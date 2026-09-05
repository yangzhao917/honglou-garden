import type { Person } from "../domain/models";
import { actorOf } from "../infrastructure/catalog";

/**
 * 人物头像：采用 87 版《红楼梦》真实演员形象（真实照片，非虚拟画像）。
 * 图片放在 src/assets/portraits/<id>.jpg（或 .jpeg/.png/.webp），由构建器自动拾取；
 * 尚未放入照片的人物显示中性占位，并标注饰演者，提示补充真实照片。
 */
const photos = import.meta.glob(
  "/src/assets/portraits/*.{jpg,jpeg,png,webp}",
  { eager: true, query: "?url", import: "default" },
) as Record<string, string>;

function photoUrl(id: string): string {
  const exts = [".jpg", ".jpeg", ".png", ".webp"];
  for (const ext of exts) {
    const url = photos[`/src/assets/portraits/${id}${ext}`];
    if (url) return url as string;
  }
  return "";
}

export default function Portrait({
  person,
  size = 96,
  credit = false,
}: {
  person: Person;
  size?: number;
  /** 在头像下方显示 87 版饰演者说明（详情页用）。 */
  credit?: boolean;
}) {
  const url = photoUrl(person.id);

  return (
    <div className="portrait" style={{ width: size, height: size }}>
      <svg
        viewBox="0 0 100 100"
        width={size}
        height={size}
        aria-hidden="true"
        style={{ display: "block" }}
      >
        <defs>
          <clipPath id={`pc-${person.id}`}>
            <circle cx="50" cy="50" r="48" />
          </clipPath>
        </defs>
        <g clipPath={`url(#pc-${person.id})`}>
          {url ? (
            <PhotoFace url={url} accent={person.accent} />
          ) : (
            <PlaceholderFace person={person} />
          )}
        </g>
        {/* 外圈 */}
        <circle cx="50" cy="50" r="47" fill="none" stroke="#c9c9b5" strokeWidth="1.5" />
        {/* 象征物印章 */}
        <Seal mark={person.plant.slice(0, 1)} color={person.accent} />
      </svg>
      {credit && (
        <div className="portrait-credit">
          {(actorOf(person.id) && `87版 · ${actorOf(person.id)}`) || "待补充真实照片"}
        </div>
      )}
    </div>
  );
}

function PhotoFace({ url, accent }: { url: string; accent: string }) {
  return (
    <>
      <rect x="0" y="0" width="100" height="100" fill="#f3eee0" />
      {/* 真实照片，等比裁切填满圆形 */}
      <image
        href={url}
        x="0"
        y="0"
        width="100"
        height="100"
        preserveAspectRatio="xMidYMid slice"
      />
      <rect x="0" y="0" width="100" height="100" fill={accent} opacity="0.06" />
    </>
  );
}

function PlaceholderFace({ person }: { person: Person }) {
  return (
    <>
      <circle cx="50" cy="52" r="50" fill={person.accent} opacity="0.16" />
      <circle cx="50" cy="50" r="47" fill="#f3eee0" opacity="0.45" />
      <text
        x="50"
        y="58"
        textAnchor="middle"
        fontSize="34"
        fontWeight="600"
        fill={person.accent}
        fontFamily="'Noto Serif SC','Songti SC',serif"
      >
        {person.name.slice(0, 1)}
      </text>
      <text
        x="50"
        y="72"
        textAnchor="middle"
        fontSize="9"
        fill="#334738"
        opacity="0.7"
        fontFamily="'Noto Serif SC','Songti SC',serif"
      >
        待补充照片
      </text>
    </>
  );
}

/** 角落的象征物印章，与原有画风保持一致。 */
function Seal({ mark, color }: { mark: string; color: string }) {
  return (
    <>
      <rect
        x="72"
        y="68"
        width="13"
        height="16"
        fill="#f3eee0"
        stroke={color}
        strokeWidth="0.8"
        transform="rotate(-8 78 76)"
      />
      <text
        x="78.5"
        y="80"
        textAnchor="middle"
        fontSize="10"
        fill={color}
        fontFamily="'Noto Serif SC','Songti SC',serif"
        transform="rotate(-8 78 76)"
      >
        {mark}
      </text>
    </>
  );
}
