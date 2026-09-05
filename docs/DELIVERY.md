# 首版游园样板交付记录

日期：2026-09-06。用户授权“先做一版，看看效果”，本轮按可运行视觉样板交付，不以全部 PRD 功能完成作为状态。

## 已实现与差异

实现八处场景、五段故事，并扩充文学条目：诗词、食饮、药方三类共 34 条。支持旋转/点选/导览/上下文切换。八处院落建筑与索引小景均为各自造型。人物采用目录 + 详情页：18 位主线人物各有水墨小像，点开可见身份、居所、关联情节与文字，并呈现一跳人物关系图谱。首条可连续导览为第 17 回题额，选取沁芳亭、潇湘馆、稻香村、蘅芜苑、怡红院五个节点；连线是精选地点间的叙事示意，省略原文中的其他地点。

第 37 回为秋爽斋结社；第 40 回仅提取沁芳亭中刘姥姥赞园的片段；第 41 回提取栊翠庵品茶。没有把其他章节内容强行映射到园中。

## 内容依据

核查日期为本文件日期。采用维基文库所列《红楼梦》在线文本，不声称统一为某一校勘底本；第 17 回页面本身列有回目版本差异。界面做繁简转换及摘要整理；摘要不是原文，引号中的短摘录保留对应出处。

| 来源 | 本版使用内容 |
| --- | --- |
| [第 17 回](https://zh.wikisource.org/wiki/紅樓夢/第017回) | 翠竹粉垣、稻香村矮墙、蘅芜苑异草、怡红院芭蕉海棠、题额顺序、两副题联 |
| [第 23 回](https://zh.wikisource.org/wiki/紅樓夢/第023回) | 黛玉、宝玉、宝钗、探春、李纨的入园居所对应 |
| [第 37 回](https://zh.wikisource.org/wiki/紅樓夢/第037回) | 秋爽斋结社、雅号、惜春与藕香榭关联、黛玉与宝钗的咏白海棠 |
| [第 40 回](https://zh.wikisource.org/wiki/紅樓夢/第040回) | 沁芳亭赞园片段 |
| [第 41 回](https://zh.wikisource.org/wiki/紅樓夢/第041回) | 栊翠庵品茶、花木描写、藕香榭乐声 |
| [第 27 回](https://zh.wikisource.org/wiki/紅樓夢/第027回) | 黛玉《葬花吟》 |
| [第 38 回](https://zh.wikisource.org/wiki/紅樓夢/第038回) | 藕香榭蟹宴、菊花诗、螃蟹咏 |
| [第 45 回](https://zh.wikisource.org/wiki/紅樓夢/第045回) | 黛玉《秋窗风雨夕》、宝钗送燕窝 |
| [第 50 回](https://zh.wikisource.org/wiki/紅樓夢/第050回) | 芦雪庵联句、咏红梅花 |
| [第 70 回](https://zh.wikisource.org/wiki/紅樓夢/第070回) | 黛玉《桃花行》、柳絮词 |

人物画像与关系图谱为编辑整理的示意，药方、食饮条文经摘录整理，正式发布前应逐条回原文复核，本版不声称已按某校勘底本统一核查。

参考网站 HonglouData 仅用作功能组织参考，本版未导入其结构化数据或图片。

## 素材台账

| 素材 | 文件或位置 | 产生方式 | 使用边界 |
| --- | --- | --- | --- |
| 园林建筑、地面、水面、树木、竹林、桥 | src/ui/Garden.tsx | 本项目的参数化几何，Three.js 渲染 | 艺术示意，未复用不明许可模型 |
| 简化院落插画 | src/ui/HouseArt.tsx | 本项目 SVG | 院落预览，不是考证图 |
| 人物水墨小像 | src/ui/Portrait.tsx | 本项目 SVG | 统一笔意、艺术演绎，非真实形象 |
| 人物关系图谱 | src/ui/RelationGraph.tsx + @xyflow/react | React Flow（MIT）+ 本项目定制节点样式 | 交互式只读图谱，节点/关系为编辑整理的示意，非考证结论 |
| 节点与连线的中文标签 | src/infrastructure/catalog.ts | 本项目整理 | 关系文字说明，颜色仅辅助，不单靠颜色 |
| 潇湘馆水墨插画 | public/art/xiaoxiang.png | 内置 imagegen 工具生成 | AI 艺术意象，不是历史照片或考证证据 |
| 用户参考图 | docs/references | 用户提供 | 内部需求参考，不包含在网站发布目录 |
| 图标 | lucide-react | 开源图标库 | 保留依赖许可 |
| 字体 | Noto Serif SC / 系统宋体 | Google Fonts 在线样式、系统字体 | Google 字体网络不可达时按字体栈使用系统宋体 |
| 图库/交互 | @xyflow/react | React Flow v12（MIT 许可） | 保留官方 attribution；图谱按需懒加载 |

### 潇湘馆生成提示词

生成方式：内置 imagegen，非 CLI。保留原始 PNG，网页直接使用工作区副本。

> Use case: stylized-concept. Create a refined Chinese ink and light mineral watercolor illustration for a literary garden web app, horizontal landscape 3:2. A quiet Jiangnan courtyard evoking Xiaoxiang Guan from Dream of the Red Chamber: elegant small Qing-era scholar residence with grey-green tiled curved roof, off-white plaster walls, delicate timber lattice windows, layered bamboo groves, a winding pale stone path and tiny clear stream. View from slightly above at intimate garden scale, richly detailed pen-and-ink architectural linework, moss, rocks, bamboo leaves, subtle mist fading into warm ivory rice paper at the edges. Palette strictly muted celadon, sage, warm parchment, charcoal ink, restrained warm brown wood. Sophisticated antique Chinese garden album painting, not cartoon, not photorealistic, not glossy 3D. Composition architecture centered-right and bamboo foreground left, no people, no text, no calligraphy, no seals, no border, no UI. The illustration should feel calm, spacious and genuinely handcrafted.

## 验收记录

- TypeScript 检查与生产构建通过；Three.js 资源块原始约 1.1MB、gzip 约 307KB，仍有构建体积提醒。
- 八项领域测试：不相容情节清除、故事地点选择、检索语义、内容关联有效性、人物目录与检索、关系节点完整性、人物一跳关系、文学条目分类。
- 五项 Playwright 真实 Chrome 流程：人物/故事/诗词联动与历史恢复，地图标签与导览，人物画像与关系、诗词/食饮/药方查询、空状态与 Esc 关闭，手机布局。
- 额外视觉检查：1440px 桌面、1280px 桌面、768px 平板、390px 手机；详见 browser-check.json。

上述浏览器检查不等于真实中低端设备性能认证，也不等于已完成 PRD 中的五人可用性测试。插画原始资源约 3.5MB；公开上线前可另做格式优化与实际网络性能验收。

## 状态

**3D 建筑模型（追加）**：经用户提供阿里云百炼 `DASHSCOPE_API_KEY`、`WorkspaceId`（华北2北京），用 [Tripo-3D](https://help.aliyun.com/zh/model-studio/tripo-3d-generation-api-reference)（`Tripo/Tripo-P1.0`）为**全部 8 处院落主建筑**生成写实古建（`scripts/generate_ali_*.mjs`），GLB 位于 `public/models/<id>.glb`，单栋约 1.1–1.4MB、合计约 10MB；`src/ui/Garden.tsx` 经 `useGLTF` 加载并自动缩放/落地，`src/ui/gardenModels.ts` 清单控制加载与兜底。此前腾讯云混元生成的重模型（单栋约 20MB）已迁移至 `backup-models/`（gitignore）。环境（树丛、草地、水面）已做写实化与疏树协调。模型为单栋写实古建，比例/造型为艺术重构，非考证复原。注意：Tripo 有并发/日生成配额，需逐个或少量提交，避免 `Throttling.RateQuota`。

背景乐选曲：原 `public/audio/garden-theme.mp3` 为《飞花点翠》琵琶独奏，意境虽柔美但并非《红楼梦》主题之曲。因用户要求背景乐贴合《红楼梦》主题与意境，已改为**《枉凝眉》中国乐器演奏版**（曹雪芹作词、王立平作曲、87 版电视剧《红楼梦》插曲的纯器乐演奏），取自 Internet Archive（opensource_audio 集合，条目 identifier `hope-betrayed-chinese-instrument-cover`），用 ffmpeg 压至 128 kbps 立体声，并做首尾淡入淡出以便无缝循环，导出为 `public/audio/honglou-theme.mp3`（约 4.4 MB、时长约 4 分 41 秒）；`src/ui/GardenMusic.tsx` 的 `audioSrc` 与播报文案已同步更新。原 `public/audio/garden-theme.mp3` 已删除。说明：该演奏为网络用户上传到 Internet Archive 的翻录版本，非官方授权音源；若用于公开或商业发布，建议另行取得授权音源后替换 `public/audio/honglou-theme.mp3`。交互为**悬浮在页面右下角的圆形音符按钮（带播放/暂停状态徽标），进入页面即默认自动播放，点击即停止、再点恢复**（`src/ui/GardenMusic.tsx` 以 `<audio>` 循环播放、默认低音量、音量淡入淡出；播放受浏览器自动播放策略限定时，在用户首次交互时自动补播）。

本地可运行，未公开部署，未做 Git 提交或推送。下一轮应根据用户对园林造型、画风和界面密度的反馈继续打磨游园，再推进人物图谱。
