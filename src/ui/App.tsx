import GardenMusic from "./GardenMusic";
import HouseArt from "./HouseArt";
import PoemCube from "./PoemCube";
import Portrait from "./Portrait";
import { lazy, Suspense, useCallback, useEffect, useState } from "react";
import { createPortal } from "react-dom";
import * as Dialog from "@radix-ui/react-dialog";
import {
  ArrowUpRight,
  ArrowRight,
  ArrowLeft,
  BookOpen,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Compass,
  Expand,
  MapPin,
  Minus,
  Pause,
  Play,
  Plus,
  RotateCcw,
  Search,
  Users,
  X,
  Info,
  Route,
  Menu,
  Salad,
  Pill,
} from "lucide-react";
import {
  places,
  stories,
  literary,
  people,
  mainCharacters,
  relations,
  personById,
} from "../infrastructure/catalog";
import {
  searchPlaces,
  searchPeople,
  relationsFor,
  selectPlace,
  selectStory,
  storiesAt,
} from "../application/explore";
import { sourceUrl, type LiteraryEntry, type Person } from "../domain/models";
import type { CameraCommand } from "./Garden";
const Garden = lazy(() => import("./Garden"));
const RelationGraph = lazy(() => import("./RelationGraph"));

function initialState() {
  const params = new URLSearchParams(window.location.search);
  const placeId = places.some((p) => p.id === params.get("place"))
    ? params.get("place")!
    : "xiaoxiang";
  const story = stories.find((s) => s.id === params.get("story"));
  // 外部分享链接也必须遵守地点与情节的相容规则。
  return selectPlace(story, placeId);
}
const mainPeople = mainCharacters;
const mainById = (id: string) => personById(id);
const kindLabel = { poem: "诗词", food: "食饮", medicine: "药方" } as const;

export default function App() {
  const [selection, setSelection] = useState(initialState),
    [query, setQuery] = useState(""),
    [detailTab, setDetailTab] = useState("景致"),
    [dialog, setDialog] = useState<"people" | "poems" | "about" | null>(null),
    [reading, setReading] = useState<LiteraryEntry | null>(null),
    [libraryQuery, setLibraryQuery] = useState(""),
    [literaryKind, setLiteraryKind] = useState<"poem" | "food" | "medicine">(
      "poem",
    ),
    [selPersonId, setSelPersonId] = useState<string | null>(null),
    [graphPerson, setGraphPerson] = useState<Person | null>(null),
    [mobileIndex, setMobileIndex] = useState(false),
    [ready, setReady] = useState(false),
    [showLabelsInfo, setShowLabelsInfo] = useState(false),
    [full, setFull] = useState(false);
  const [command, setCommand] = useState<CameraCommand>({
    mode: "perspective",
    tick: 0,
  });
  const [tour, setTour] = useState(false),
    [tourStep, setTourStep] = useState(0),
    [playing, setPlaying] = useState(false);
  const place = places.find((p) => p.id === selection.placeId)!;
  const story = stories.find((s) => s.id === selection.storyId);
  const filtered = searchPlaces(places, query);
  const related = storiesAt(stories, place.id);
  const camera = useCallback(
    (mode: CameraCommand["mode"]) =>
      setCommand((c) => ({ mode, tick: c.tick + 1 })),
    [],
  );
  const update = useCallback((next: typeof selection) => {
    setSelection(next);
    const p = new URLSearchParams();
    p.set("place", next.placeId);
    if (next.storyId) p.set("story", next.storyId);
    window.history.pushState({}, "", `?${p}`);
  }, []);
  useEffect(() => {
    const pop = () => {
      setSelection(initialState());
      setTour(false);
      setPlaying(false);
    };
    window.addEventListener("popstate", pop);
    return () => window.removeEventListener("popstate", pop);
  }, []);

  const choosePlace = useCallback(
    (id: string) => {
      update(selectPlace(story, id));
      camera("focus");
      setTour(false);
      setPlaying(false);
      setMobileIndex(false);
    },
    [story, update, camera],
  );
  const chooseStory = (id: string) => {
    const next = stories.find((s) => s.id === id)!;
    update(selectStory(next, place.id));
    setTour(false);
    setPlaying(false);
    setDetailTab("故事");
    camera("focus");
  };

  // 阅读抽屉内"回到故事"按钮的事件通道
  useEffect(() => {
    const handler = (e: Event) => {
      const id = (e as CustomEvent<string>).detail;
      if (id) chooseStory(id);
    };
    window.addEventListener("reader:goto-story", handler);
    return () => window.removeEventListener("reader:goto-story", handler);
  }, [chooseStory]);
  const tourRoute = story?.places ?? [];
  const moveTour = useCallback(
    (index: number) => {
      if (!story) return;
      setTourStep(index);
      update({ placeId: story.places[index], storyId: story.id });
      camera("focus");
    },
    [story, update, camera],
  );
  useEffect(() => {
    if (!playing || !tour || !story) return;
    const timer = setTimeout(() => {
      if (tourStep + 1 >= story.places.length) {
        setPlaying(false);
        return;
      }
      moveTour(tourStep + 1);
    }, 4000);
    return () => clearTimeout(timer);
  }, [playing, tour, story, tourStep, moveTour]);
  useEffect(() => {
    const escape = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setFull(false);
        setMobileIndex(false);
        if (graphPerson) {
          const back = graphPerson.id;
          setGraphPerson(null);
          setDialog("people");
          setSelPersonId(back);
        }
      }
    };
    window.addEventListener("keydown", escape);
    return () => window.removeEventListener("keydown", escape);
  }, [graphPerson]);
  const onReady = useCallback(() => setReady(true), []);
  const onManual = useCallback(() => setPlaying(false), []);
  const beginTour = () => {
    if (!story) {
      chooseStory("naming");
      return;
    }
    setTour(true);
    moveTour(0);
    setPlaying(false);
  };
  const displayedPoems = story
    ? literary.filter((p) => story.poems.includes(p.id))
    : literary.filter((p) => related.some((s) => s.poems.includes(p.id)));

  const openPeople = () => {
    setDialog("people");
    setSelPersonId(null);
    setLibraryQuery("");
  };
  const selPerson: Person | undefined = selPersonId
    ? personById(selPersonId)
    : undefined;

  // 文学条目按当前分类筛选；诗词、食饮、药方共用一套结构。
  const entries = literary.filter((l) => l.kind === literaryKind);
  const entryFiltered = entries.filter((l) =>
    `${l.title}${l.author}${l.lines.join("")}${l.context}`.includes(
      libraryQuery.trim(),
    ),
  );

  return (
    <div className={`app ${full ? "expanded" : ""}`}>
      <header className="header">
        <a href="/" className="brand">
          <span className="seal">
            红<br />楼
          </span>
          <div>
            <strong>红楼游园</strong>
            <span>A GARDEN OF DREAMS</span>
          </div>
        </a>
        <nav aria-label="主导航">
          <button
            className={!dialog ? "active" : ""}
            onClick={() => setDialog(null)}
          >
            <Compass size={17} />
            游园
          </button>
          <button
            className={dialog === "people" ? "active" : ""}
            onClick={openPeople}
          >
            <Users size={17} />
            人物
          </button>
          <button
            className={dialog === "poems" ? "active" : ""}
            onClick={() => {
              setDialog("poems");
              setLibraryQuery("");
              setLiteraryKind("poem");
            }}
          >
            <BookOpen size={17} />
            诗词
          </button>
        </nav>
        <div className="header-tools">
          <button className="about-button" onClick={() => setDialog("about")}>
            关于这座园 <ArrowUpRight size={15} />
          </button>
        </div>
      </header>
      <section className="intro">
        <div className="intro-title">
          <span className="eyebrow">步 入 红 楼 · 以 园 读 梦</span>
          <h1>
            一园一梦，<span>一景一情。</span>
          </h1>
        </div>
        <div className="intro-copy">
          循着人物与诗词，走进大观园。
          <br />
          <span>在一草一木间，读懂书中人。</span>
        </div>
        <div className="edition">
          <span>曹雪芹 · 红楼梦</span>
          <small>前八十回 / 精选导览</small>
        </div>
      </section>
      <main className="workspace">
        <aside className={`index-panel ${mobileIndex ? "mobile-open" : ""}`}>
          <div className="panel-title">
            <h2>院落索引</h2>
            <span>八处园景</span>
            <button
              className="mobile-close icon-button"
              aria-label="关闭索引"
              onClick={() => setMobileIndex(false)}
            >
              <X size={18} />
            </button>
          </div>
          <label className="search">
            <Search size={16} />
            <input
              aria-label="寻找院落或人物"
              placeholder="寻找院落或人物"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
            {query && (
              <button aria-label="清空搜索" onClick={() => setQuery("")}>
                <X size={14} />
              </button>
            )}
          </label>
          <div className="index-meta">
            <span>大观园</span>
            <span>{filtered.length.toString().padStart(2, "0")} / 08</span>
          </div>
          <div className="place-list">
            {filtered.map((p) => (
              <button
                key={p.id}
                className={`place-item ${p.id === place.id ? "active" : ""}`}
                onClick={() => choosePlace(p.id)}
                aria-pressed={p.id === place.id}
              >
                <HouseArt id={p.id} photo />
                <span>
                  <strong>{p.name}</strong>
                  <small>{p.resident}</small>
                </span>
                {p.id === place.id ? (
                  <MapPin size={16} />
                ) : (
                  <ChevronRight size={14} />
                )}
              </button>
            ))}
            {!filtered.length && (
              <div className="empty">
                没有找到这处园景
                <button onClick={() => setQuery("")}>查看全部院落</button>
              </div>
            )}
          </div>
          <div className="index-foot">
            <span className="mini-seal">园</span>
            <p>
              不必读完红楼，
              <br />
              也能先来园中走走。
            </p>
          </div>
        </aside>
        <section className="garden-panel" aria-label="大观园立体地图">
          <div className="map-top">
            <div className="breadcrumb">
              <span>贾府</span>
              <ChevronRight size={12} />
              <strong>大观园</strong>
              <span className="dot" />
              <span>立体游园</span>
            </div>
            <button
              className="icon-button"
              title={full ? "退出全屏" : "展开园林"}
              aria-label={full ? "退出全屏" : "展开园林"}
              onClick={() => setFull(!full)}
            >
              {full ? <X size={18} /> : <Expand size={17} />}
            </button>
          </div>
          <div className="map-heading">
            <h2>大观园</h2>
            <p>THE GRAND VIEW GARDEN</p>
          </div>
          <div className="compass-rose">
            <span>北</span>
            <svg viewBox="0 0 60 60" aria-hidden="true">
              <circle cx="30" cy="30" r="22" />
              <path d="M30 2V58M2 30H58" />
              <path
                d="M30 10L23 39L30 34L37 39Z"
                fill="#536a57"
                stroke="none"
              />
            </svg>
            <small>示意朝向</small>
          </div>
          <div className="canvas-wrap">
            <Suspense
              fallback={
                <div className="loading">
                  正在展开园林画卷
                  <span />
                </div>
              }
            >
              <Garden
                selected={place.id}
                onSelect={choosePlace}
                command={command}
                route={tour ? tourRoute : []}
                onManual={onManual}
                onReady={onReady}
              />
            </Suspense>
          </div>
          <button
            className="mobile-index-button"
            onClick={() => setMobileIndex(true)}
          >
            <Menu size={16} />
            院落索引
          </button>
          <div className="map-bottom">
            <div className="map-legend">
              <span className="legend-dot" />
              当前院落
              <span className="legend-line" />
              文学空间示意
            </div>
            <div className="map-controls">
              <div className="view-switch">
                <button
                  className={command.mode !== "top" ? "active" : ""}
                  onClick={() => camera("perspective")}
                >
                  立体
                </button>
                <button
                  className={command.mode === "top" ? "active" : ""}
                  onClick={() => camera("top")}
                >
                  俯视
                </button>
              </div>
              <span className="control-divider" />
              <button
                className="icon-button"
                aria-label="向左旋转"
                onClick={() => camera("left")}
              >
                <ChevronLeft size={17} />
              </button>
              <button
                className="icon-button"
                aria-label="向右旋转"
                onClick={() => camera("right")}
              >
                <ChevronRight size={17} />
              </button>
              <button
                className="icon-button"
                aria-label="放大园林"
                onClick={() => camera("zoomIn")}
              >
                <Plus size={17} />
              </button>
              <button
                className="icon-button"
                aria-label="缩小园林"
                onClick={() => camera("zoomOut")}
              >
                <Minus size={17} />
              </button>
              <button
                className="icon-button"
                aria-label="返回全园"
                onClick={() => camera("reset")}
              >
                <RotateCcw size={16} />
              </button>
            </div>
          </div>
          <div className="map-instruction">
            <span>
              {ready ? "拖动旋转 · 滚轮缩放 · 点选院落" : "园林加载中"}
            </span>
            <span>青绿园林 · 艺术构想</span>
          </div>
          {tour && story && (
            <div className="tour-bar">
              <Route size={17} />
              <div>
                <strong>{story.title}</strong>
                <small>
                  第 {tourStep + 1} / {tourRoute.length} 站 · {place.name}
                </small>
              </div>
              <button
                className="icon-button"
                aria-label="上一站"
                disabled={tourStep === 0}
                onClick={() => {
                  setPlaying(false);
                  moveTour(tourStep - 1);
                }}
              >
                <ChevronLeft size={18} />
              </button>
              <button
                className="icon-button"
                aria-label={playing ? "暂停导览" : "播放导览"}
                disabled={tourStep === tourRoute.length - 1 && !playing}
                onClick={() => setPlaying(!playing)}
              >
                {playing ? <Pause size={17} /> : <Play size={17} />}
              </button>
              <button
                className="icon-button"
                aria-label="下一站"
                disabled={tourStep >= tourRoute.length - 1}
                onClick={() => {
                  setPlaying(false);
                  moveTour(tourStep + 1);
                }}
              >
                <ChevronRight size={18} />
              </button>
              <button
                className="icon-button"
                aria-label="退出导览"
                onClick={() => {
                  setTour(false);
                  setPlaying(false);
                }}
              >
                <X size={17} />
              </button>
              <p>精选地点顺序 · 连线为示意，非精确路径</p>
            </div>
          )}
        </section>
        <aside className="detail-panel" aria-live="polite">
          <div className="place-eyebrow">
            <span>园 中 一 景</span>
            <span>
              {String(places.indexOf(place) + 1).padStart(2, "0")} / 08
            </span>
          </div>
          <div className="detail-heading">
            <h2>{place.name}</h2>
            <span className="place-stamp">{place.plant}</span>
          </div>
          <p className="resident">
            <MapPin size={13} />
            {place.resident}
            {place.id === "qinfang" ? " · 共享园景" : " · 关联人物"}
          </p>
          <div className="place-illustration">
            <HouseArt id={place.id} />
            <span>{place.mood.split(" · ")[0]}</span>
            <i>园林意象</i>
          </div>
          <div className="detail-tabs" role="tablist" aria-label="院落详情">
            {["景致", "人物", "故事"].map((t) => (
              <button
                key={t}
                role="tab"
                aria-selected={detailTab === t}
                onClick={() => setDetailTab(t)}
              >
                {t}
              </button>
            ))}
          </div>
          <div className="detail-content" role="tabpanel">
            {detailTab === "景致" && (
              <>
                <h3>{place.mood}</h3>
                <p>{place.description}</p>
                <blockquote>
                  “{place.source}”
                  <a
                    href={sourceUrl(place.chapter)}
                    target="_blank"
                    rel="noreferrer"
                  >
                    第{place.chapter}回 · 查看原文 <ArrowUpRight size={12} />
                  </a>
                </blockquote>
              </>
            )}
            {detailTab === "人物" && (
              <PersonDetail
                person={personByName(place.resident)}
                onOpenDialog={openPeople}
                onFocus={(id) => {
                  setSelPersonId(id);
                  setDialog("people");
                }}
              />
            )}
            {detailTab === "故事" && (
              <>
                {story ? (
                  <>
                    <span className="chapter-tag">第 {story.chapter} 回</span>
                    <h3 className="story-title">{story.title}</h3>
                    <p>{story.description}</p>
                    <div className="people-chips">
                      {story.people.map((p) => (
                        <span key={p}>{p}</span>
                      ))}
                    </div>
                    <a
                      className="source-link"
                      href={sourceUrl(story.chapter)}
                      target="_blank"
                      rel="noreferrer"
                    >
                      阅读本回原文 <ArrowUpRight size={13} />
                    </a>
                  </>
                ) : related.length ? (
                  related.map((s) => (
                    <button
                      className="related-story"
                      key={s.id}
                      onClick={() => chooseStory(s.id)}
                    >
                      <span>第{s.chapter}回</span>
                      <strong>{s.title}</strong>
                      <ArrowRight size={15} />
                    </button>
                  ))
                ) : (
                  <p>这里的情节仍待整理，可先阅读景致与原文。</p>
                )}
              </>
            )}
          </div>
          <div className="detail-actions">
            <button
              className="primary"
              onClick={() => {
                if (story) beginTour();
                else if (related[0]) chooseStory(related[0].id);
                else camera("focus");
              }}
            >
              <Route size={16} />
              {story
                ? "沿故事游园"
                : related.length
                  ? "看看这里的故事"
                  : "靠近这处院落"}
              <ArrowRight size={16} />
            </button>
            <button
              className="evidence-toggle"
              onClick={() => setShowLabelsInfo(!showLabelsInfo)}
            >
              <Info size={13} />
              空间依据 <span>原文线索 · 布局示意</span>
              <ChevronDown size={13} />
            </button>
            {showLabelsInfo && (
              <p className="evidence-note">
                地点名称与描写参照原文。建筑造型、比例及相对位置为本次艺术设计，不作历史复原依据。
              </p>
            )}
          </div>
        </aside>
      </main>
      <section className="story-strip">
        <div className="strip-heading">
          <span className="eyebrow">循 故 事 · 入 园 林</span>
          <h2>红楼拾章</h2>
          <p>几段故事，几重园景</p>
        </div>
        <div className="story-options">
          {stories.map((s) => (
            <button
              key={s.id}
              className={`story-option ${s.id === story?.id ? "active" : ""}`}
              aria-pressed={s.id === story?.id}
              onClick={() => chooseStory(s.id)}
            >
              <span>
                第 <b>{s.chapter}</b> 回
              </span>
              <strong>{s.title}</strong>
              <small>{s.subtitle}</small>
              <ArrowUpRight size={17} />
            </button>
          ))}
        </div>
      </section>
      <section className="poetry-preview">
        <div>
          <span className="eyebrow">诗 中 有 园</span>
          <h2>{displayedPoems[0]?.lines[0] ?? "一草一木，皆有来处。"}</h2>
          <p>
            {displayedPoems[0]
              ? `${displayedPoems[0].author} · ${displayedPoems[0].title}`
              : "这段情节未收录文字，可在诗词笺中读其他篇章。"}
          </p>
        </div>
        <button
          onClick={() => {
            if (displayedPoems[0]) setReading(displayedPoems[0]);
            else {
              setDialog("poems");
              setLibraryQuery("");
              setLiteraryKind("poem");
            }
          }}
        >
          展开诗笺 <BookOpen size={17} />
        </button>
      </section>
      <footer>
        <span>
          红楼游园 <i>·</i> 一部可以走进去的书
        </span>
        <span>
          首版体验 · 8 处园景 / {stories.length} 段情节 / {literary.length} 条文字{" "}
          <button onClick={() => setDialog("about")}>内容与来源</button>
        </span>
      </footer>

      {/* —— 人物 / 文学 / 关于 —— */}
      <Dialog.Root open={!!dialog} onOpenChange={(open) => !open && setDialog(null)}>
        <Dialog.Portal>
          <Dialog.Overlay className="dialog-overlay" />
          <Dialog.Content className="library-dialog">
            <Dialog.Title>
              {dialog === "people" && selPerson
                ? selPerson.name
                : dialog === "people"
                  ? "园中人物"
                  : dialog === "poems"
                    ? "红楼诗文笺"
                    : "关于这座园"}
            </Dialog.Title>
            <Dialog.Description>
              {dialog === "people" && selPerson
                ? selPerson.alias
                  ? `${selPerson.alias} · ${selPerson.role}`
                  : selPerson.role
                : dialog === "people"
                  ? "从人物的小像与关系，读起一段红楼。"
                  : dialog === "poems"
                    ? "诗词、食饮与药方，都是园中的人与日子。"
                    : "一座从文字里生长出来的园林。"}
            </Dialog.Description>
            <Dialog.Close
              className="dialog-close icon-button"
              aria-label="关闭"
            >
              <X size={21} />
            </Dialog.Close>

            {dialog === "about" ? (
              <div className="about-content">
                <span className="seal large">
                  入<br />梦
                </span>
                <h3>以园读梦，以景见人。</h3>
                <p>
                  这是《红楼游园》的第一版交互样板，先呈现 8 处园景、{stories.length}{" "}
                  段精选情节与 {literary.length}{" "}
                  条文学条目（诗词、食饮、药方）。你可以旋转园林、点选院落，也可以循着人物查看关系与原文。
                </p>
                <h4>内容与空间</h4>
                <p>
                  情节与引文参考维基文库《红楼梦》前
                  80 回若干回目，展示文字作简体转换。地图属于艺术示意，建筑与相对方位不代表考证结论。题额导览仅连接本版收录地点，并非完整游览轨迹。
                </p>
                <h4>素材与参考</h4>
                <p>
                  园林几何、院落小景与人物小像由本项目制作；潇湘馆插画由 AI
                  生成，属于艺术意象。人物画像与关系为编辑整理，不承担考证。功能参考
                  HonglouData，视觉参考项目方提供的概念图。
                </p>
                <a
                  href="https://hongloudata.com/"
                  target="_blank"
                  rel="noreferrer"
                >
                  访问 HonglouData <ArrowUpRight size={14} />
                </a>
              </div>
            ) : dialog === "people" ? (
              selPerson ? (
                <div className="person-profile">
                  <button
                    className="person-back"
                    onClick={() => setSelPersonId(null)}
                  >
                    <ArrowLeft size={14} /> 返回人物列表
                  </button>
                  <div className="person-hero">
                    <div className="person-bust">
                      <Portrait person={selPerson} size={126} credit />
                      <div>
                        <h3>{selPerson.name}</h3>
                        <span className="eyebrow">{selPerson.alias}</span>
                        <p>{selPerson.role}</p>
                      </div>
                    </div>
                    <div className="person-relations">
                      <Suspense
                        fallback={<div className="graph-loading">正在绘制关系…</div>}
                      >
                        <RelationGraph
                          person={selPerson}
                          edges={relationsFor(selPerson, relations, people)}
                          relations={relations}
                          people={people}
                          onFocus={(id) => setSelPersonId(id)}
                          onFullscreen={() => {
                            setGraphPerson(selPerson);
                            setDialog(null);
                            setSelPersonId(null);
                          }}
                        />
                      </Suspense>
                    </div>
                  </div>
                  <PersonLinks
                    person={selPerson}
                    onPlace={(id) => {
                      choosePlace(id);
                      setSelPersonId(null);
                      setDialog(null);
                      setDetailTab("人物");
                    }}
                    onRead={(l) => {
                      setSelPersonId(null);
                      setDialog(null);
                      setReading(l);
                    }}
                  />
                </div>
              ) : (
                <>
                  <label className="search library-search">
                    <Search size={17} />
                    <input
                      aria-label="搜索人物"
                      value={libraryQuery}
                      onChange={(e) => setLibraryQuery(e.target.value)}
                      placeholder="输入人物姓名或雅号"
                    />
                  </label>
                  <div className="library-grid person-grid">
                    {searchPeople(mainPeople, libraryQuery).map((p) => (
                      <button
                        key={p.id}
                        className="person-card person-portrait-card"
                        onClick={() => setSelPersonId(p.id)}
                      >
                        <Portrait person={p} size={112} />
                        <span className="eyebrow">{p.alias}</span>
                        <h3>{p.name}</h3>
                        <span>{p.role.split("·")[0]}</span>
                      </button>
                    ))}
                  </div>
                  {!searchPeople(mainPeople, libraryQuery).length && (
                    <div className="empty">
                      没有找到相关内容
                      <button onClick={() => setLibraryQuery("")}>
                        清除搜索
                      </button>
                    </div>
                  )}
                </>
              )
            ) : (
              <>
                <div className="library-tabs" role="tablist" aria-label="文学分类">
                  {(["poem", "food", "medicine"] as const).map((k) => (
                    <button
                      key={k}
                      role="tab"
                      aria-selected={literaryKind === k}
                      onClick={() => setLiteraryKind(k)}
                    >
                      {k === "poem" ? (
                        <BookOpen size={14} />
                      ) : k === "food" ? (
                        <Salad size={14} />
                      ) : (
                        <Pill size={14} />
                      )}
                      {kindLabel[k]}
                      <b>{literary.filter((l) => l.kind === k).length}</b>
                    </button>
                  ))}
                </div>
                <label className="search library-search">
                  <Search size={17} />
                  <input
                    aria-label={`搜索${kindLabel[literaryKind]}`}
                    value={libraryQuery}
                    onChange={(e) => setLibraryQuery(e.target.value)}
                    placeholder={`搜索${kindLabel[literaryKind]}标题、作者或文字`}
                  />
                </label>
                <div className="library-grid">
                  {entryFiltered.map((p) => (
                    <button
                      key={p.id}
                      className="poem-card"
                      onClick={() => {
                        setDialog(null);
                        setReading(p);
                      }}
                    >
                      <span className="eyebrow">
                        第{p.chapter}回 ·{" "}
                        {p.author ? p.author : kindLabel[p.kind]}
                      </span>
                      <h3>{p.title}</h3>
                      <p>{p.lines[0]}</p>
                      <span>
                        展开{p.kind === "poem" ? "诗笺" : "内容"}
                        <ArrowRight size={15} />
                      </span>
                    </button>
                  ))}
                </div>
                {!entryFiltered.length && (
                  <div className="empty">
                    没有找到相关内容
                    <button onClick={() => setLibraryQuery("")}>清除搜索</button>
                  </div>
                )}
              </>
            )}
          </Dialog.Content>
        </Dialog.Portal>
      </Dialog.Root>

      {/* —— 诵读/阅读抽屉（诗词正文 / 食饮做法 / 药方） —— */}
      <Dialog.Root
        open={!!reading}
        onOpenChange={(open) => !open && setReading(null)}
      >
        <Dialog.Portal>
          <Dialog.Overlay className="dialog-overlay" />
          <Dialog.Content className="poem-dialog">
            <Dialog.Close
              className="dialog-close icon-button"
              aria-label="收起"
            >
              <X size={21} />
            </Dialog.Close>
            <span className="eyebrow">
              红 楼 {kindLabel[reading?.kind ?? "poem"]} · 第 {reading?.chapter} 回
            </span>
            <Dialog.Title>{reading?.title}</Dialog.Title>
            <Dialog.Description>
              {reading?.author
                ? `${reading.author} · 曹雪芹《红楼梦》`
                : reading?.kind === "medicine"
                  ? "药方 · 曹雪芹《红楼梦》"
                  : "食饮 · 曹雪芹《红楼梦》"}
            </Dialog.Description>
            {reading?.kind === "poem" ? (
              <ReadingReader entry={reading} onClose={() => setReading(null)} />
            ) : (
              <>
                <div className="poem-lines">
                  {reading?.lines.map((l) => (
                    <p key={l}>{l}</p>
                  ))}
                </div>
                <p className="poem-context">{reading?.context}</p>
                <div className="poem-footer">
                  <a
                    href={sourceUrl(reading?.chapter ?? 17)}
                    target="_blank"
                    rel="noreferrer"
                  >
                    查看原文出处 <ArrowUpRight size={14} />
                  </a>
                  <button
                    onClick={() => {
                      const s = stories.find((s) =>
                        s.poems.includes(reading!.id),
                      );
                      if (s) chooseStory(s.id);
                      setReading(null);
                    }}
                  >
                    回到故事 <ArrowRight size={15} />
                  </button>
                </div>
              </>
            )}
          </Dialog.Content>
        </Dialog.Portal>
      </Dialog.Root>

      {graphPerson &&
        createPortal(
          <div className="graph-fullscreen">
            <div className="graph-full-head">
              <div>
                <span className="eyebrow">红 楼 人 物 · 关 系 图 谱</span>
                <h3>{graphPerson.name}</h3>
              </div>
              <button
                className="icon-button"
                aria-label="关闭全屏图谱"
                onClick={() => {
                  const back = graphPerson.id;
                  setGraphPerson(null);
                  setDialog("people");
                  setSelPersonId(back);
                }}
              >
                <X size={22} />
              </button>
            </div>
            <div className="graph-full-body">
              <Suspense fallback={<div className="graph-loading">正在绘制关系…</div>}>
                <RelationGraph
                  person={graphPerson}
                  edges={relationsFor(graphPerson, relations, people)}
                  relations={relations}
                  people={people}
                  onFocus={(id) => {
                    const next = personById(id);
                    if (next) setGraphPerson(next);
                  }}
                />
              </Suspense>
            </div>
          </div>,
          document.body,
        )}

      <GardenMusic />
    </div>
  );
}

/* —— 人物详情（右侧页签版）—— */
function PersonDetail({
  person,
  onOpenDialog,
  onFocus,
}: {
  person: Person | undefined;
  onOpenDialog: () => void;
  onFocus: (id: string) => void;
}) {
  if (!person)
    return (
      <>
        <div className="person-focus">
          <span>诸</span>
          <div>
            <h3>园中诸人</h3>
            <p>这处亭榭由众人共享。</p>
          </div>
        </div>
        <p>可打开人物目录，从任意一位开始。</p>
      </>
    );
  if (!mainById(person.id))
    return (
      <p>
        这位是关系中的辅助人物，可到人物目录查看主线人物与其关系。
      </p>
    );
  return (
    <>
      <div className="person-focus">
        <Portrait person={person} size={46} />
        <div>
          <h3>{person.name}</h3>
          <p>{person.alias}</p>
        </div>
      </div>
      <Suspense fallback={<div className="graph-loading">正在绘制关系…</div>}>
        <RelationGraph
          person={person}
          edges={relationsFor(person, relations, people)}
          relations={relations}
          people={people}
          onFocus={onFocus}
        />
      </Suspense>
      <p>点击人物目录，查看更多关系与诗词。</p>
      <button className="see-people" onClick={onOpenDialog}>
        打开人物目录 <ArrowRight size={14} />
      </button>
    </>
  );
}

/* —— 人物详情：相关联的居所与文学条目 —— */
function PersonLinks({
  person,
  onPlace,
  onRead,
}: {
  person: Person;
  onPlace: (id: string) => void;
  onRead: (l: LiteraryEntry) => void;
}) {
  const place = places.find((p) => p.id === person.placeId);
  const personStories = stories.filter((s) => s.people.includes(person.name));
  const poemIds = new Set(personStories.flatMap((s) => s.poems));
  const items = literary.filter(
    (l) => l.author === person.name || (l.kind === "poem" && poemIds.has(l.id)),
  );
  return (
    <div className="person-links">
      {place && (
        <button className="link-place" onClick={() => onPlace(place.id)}>
          <HouseArt id={place.id} />
          <div>
            <span className="eyebrow">居所</span>
            <strong>{place.name}</strong>
            <small>{place.resident}</small>
          </div>
          <ArrowRight size={16} />
        </button>
      )}
      <div className="link-block">
        <h4>故事情节</h4>
        {personStories.length ? (
          personStories.map((s) => (
            <button key={s.id} onClick={() => onPlace(s.places[0])}>
              <span>第{s.chapter}回</span>
              {s.title}
            </button>
          ))
        ) : (
          <p>暂无收录该人物的精选情节。</p>
        )}
      </div>
      <div className="link-block">
        <h4>相关文字</h4>
        {items.length ? (
          items.map((l) => (
            <button key={l.id} onClick={() => onRead(l)}>
              <span>
                {kindLabel[l.kind]} · 第{l.chapter}回
              </span>
              {l.title}
            </button>
          ))
        ) : (
          <p>暂无收录该人物的诗词文字。</p>
        )}
      </div>
    </div>
  );
}

/* 人物姓名 → 对象 */
function personByName(name: string) {
  return people.find((p) => p.name === name);
}

/* —— 诗词阅读器：使用 Three.js 立方体卡牌切换 —— */
function ReadingReader({
  entry,
  onClose,
}: {
  entry: LiteraryEntry;
  onClose: () => void;
}) {
  const onGotoStory = () => {
    const s = stories.find((s) => s.poems.includes(entry.id));
    if (s) {
      window.dispatchEvent(
        new CustomEvent("reader:goto-story", { detail: s.id }),
      );
    }
    onClose();
  };

  return (
    <div className="reader">
      <PoemCube entry={entry} onGotoStory={onGotoStory} />
    </div>
  );
}
