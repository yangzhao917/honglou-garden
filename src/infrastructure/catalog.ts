import type {
  Place,
  Person,
  Relation,
  LiteraryEntry,
  Story,
} from "../domain/models";

/* ------------------------------------------------------------------ *
 * 园中景致：文学地点与艺术示意
 * ------------------------------------------------------------------ */
export const places: Place[] = [
  {
    id: "xiaoxiang",
    name: "潇湘馆",
    resident: "林黛玉",
    alias: "潇湘妃子",
    mood: "竹影摇窗 · 清幽雅致",
    plant: "翠竹",
    description:
      "粉墙之内，修竹掩映。曲折游廊连着小小房舍，一带清泉绕阶缘屋，在竹影之间流出。",
    chapter: 17,
    source: "一带粉垣，里面数楹修舍，有千百竿翠竹遮映。",
  },
  {
    id: "yihong",
    name: "怡红院",
    resident: "贾宝玉",
    alias: "怡红公子",
    mood: "红香绿玉 · 富贵闲情",
    plant: "海棠",
    description:
      "芭蕉与海棠相映，红与绿构成院落的鲜明意象。这里也是宝玉日常生活的重要空间。",
    chapter: 17,
    source: "一边种着数本芭蕉；那一边乃是一棵西府海棠。",
  },
  {
    id: "hengwu",
    name: "蘅芜苑",
    resident: "薛宝钗",
    alias: "蘅芜君",
    mood: "异草清芬 · 素雅含蓄",
    plant: "香草",
    description:
      "玲珑山石遮映清厦，藤萝异草绕柱穿石。没有繁花争艳，香气却自成天地。",
    chapter: 17,
    source: "只见许多异草：或有牵藤的，或有引蔓的。",
  },
  {
    id: "daoxiang",
    name: "稻香村",
    resident: "李纨",
    alias: "稻香老农",
    mood: "杏帘在望 · 田园清趣",
    plant: "杏花",
    description:
      "矮墙、茅屋与青篱围成园中的田舍意趣。李纨在海棠结社时，自号“稻香老农”。",
    chapter: 17,
    source: "隐隐露出一带黄泥筑就矮墙，墙头皆用稻茎掩护。",
  },
  {
    id: "qiushuang",
    name: "秋爽斋",
    resident: "贾探春",
    alias: "蕉下客",
    mood: "梧桐疏朗 · 诗社初成",
    plant: "梧桐",
    description:
      "探春的一封花笺，邀来众人商议结社。海棠成为第一回诗题，少女们也在这里各取雅号。",
    chapter: 37,
    source: "一面说，一面同翠墨往秋爽斋来。",
  },
  {
    id: "longcui",
    name: "栊翠庵",
    resident: "妙玉",
    alias: "栊翠主人",
    mood: "禅院茶烟 · 花木深深",
    plant: "花木",
    description:
      "花木繁盛的清静院落。贾母带刘姥姥游园至此，妙玉以茶相待，一盏茶里映出不同性情。",
    chapter: 41,
    source: "至院中见花木繁盛。",
  },
  {
    id: "ouxiang",
    name: "藕香榭",
    resident: "贾惜春",
    alias: "藕榭",
    mood: "临水听曲 · 荷风入梦",
    plant: "荷花",
    description:
      "临水的园林空间。海棠结社时，宝钗以“藕榭”为惜春起号；第四十一回，乐声从这里穿林度水。",
    chapter: 37,
    source: "四丫头在藕香榭，就叫他“藕榭”就完了。",
  },
  {
    id: "qinfang",
    name: "沁芳亭",
    resident: "园中诸人",
    alias: "水畔小憩",
    mood: "一脉清流 · 隔岸花香",
    plant: "垂柳",
    description:
      "亭子临水而建，桥与池沿相连。宝玉在这里拟出“沁芳”二字，并题下一副七言对联。",
    chapter: 17,
    source: "绕堤柳借三篙翠，隔岸花分一脉香。",
  },
];

/* ------------------------------------------------------------------ *
 * 人物：主线人物 + 关系所需的辅助人物
 * ------------------------------------------------------------------ */
export const people: Person[] = [
  { id: "daiyu", name: "林黛玉", alias: "潇湘妃子", role: "黛玉 · 前身绛珠 · 咏絮之才", placeId: "xiaoxiang", accent: "#6f896b", plant: "竹" },
  { id: "baoyu", name: "贾宝玉", alias: "怡红公子", role: "宝玉 · 衔玉而生 · 痴情公子", placeId: "yihong", accent: "#a24e3a", plant: "玉" },
  { id: "baochai", name: "薛宝钗", alias: "蘅芜君", role: "宝钗 · 博学稳重 · 蘅芜之香", placeId: "hengwu", accent: "#b48a4e", plant: "菊" },
  { id: "xifeng", name: "王熙凤", alias: "凤辣子", role: "凤姐 · 荣府当家 · 明艳泼辣", accent: "#bd6744", plant: "凤" },
  { id: "jiamu", name: "贾母", alias: "史太君", role: "贾母 · 贾府太上 · 慈爱大家长", accent: "#8a7a5c", plant: "寿" },
  { id: "xiangyun", name: "史湘云", alias: "枕霞旧友", role: "湘云 · 豪爽娇憨 · 诗情天真", accent: "#8b8397", plant: "芍药" },
  { id: "tanchun", name: "贾探春", alias: "蕉下客", role: "探春 · 精明敏锐 · 结社立社", placeId: "qiushuang", accent: "#aa7350", plant: "蕉" },
  { id: "yingchun", name: "贾迎春", alias: "菱洲", role: "迎春 · 懦弱善良 · 二木头", accent: "#9d8b74", plant: "菱" },
  { id: "xichun", name: "贾惜春", alias: "藕榭", role: "惜春 · 孤介冷清 · 习画参禅", placeId: "ouxiang", accent: "#6d8b78", plant: "莲" },
  { id: "liwan", name: "李纨", alias: "稻香老农", role: "李纨 · 守节教子 · 朴淡幽居", placeId: "daoxiang", accent: "#838b6a", plant: "稻" },
  { id: "miaoyu", name: "妙玉", alias: "栊翠主人", role: "妙玉 · 带发修行 · 洁净孤高", placeId: "longcui", accent: "#7d8ba0", plant: "梅" },
  { id: "yuanchun", name: "贾元春", alias: "贵妃", role: "元春 · 荣府长女 · 归省省亲", accent: "#b5896a", plant: "牡丹" },
  { id: "xiangling", name: "香菱", alias: "甄英莲", role: "香菱 · 命途坎坷 · 痴心学诗", accent: "#a86f7c", plant: "莲" },
  { id: "qingwen", name: "晴雯", alias: "芙蓉", role: "晴雯 · 心比天高 · 风流灵巧", accent: "#9d7ba0", plant: "芙蓉" },
  { id: "xiren", name: "袭人", alias: "花袭人", role: "袭人 · 温柔和顺 · 贴心周全", accent: "#b48f96", plant: "花" },
  { id: "zijuan", name: "紫鹃", alias: "鹃儿", role: "紫鹃 · 黛玉知己 · 忠心一片", accent: "#7d94a8", plant: "鹃" },
  { id: "pingr", name: "平儿", alias: "平姑娘", role: "平儿 · 凤姐臂膀 · 忠厚和善", accent: "#b07f6a", plant: "钗" },
  { id: "liulaolao", name: "刘姥姥", alias: "刘老老", role: "刘姥姥 · 村野老妪 · 二进荣国府", accent: "#7d8a5e", plant: "蔬" },
  {
    id: "jiazheng", name: "贾政", alias: "", role: "贾政 · 宝玉之父 · 端方严正", accent: "#7f866e", plant: "书",
  },
  {
    id: "wangfuren", name: "王夫人", alias: "", role: "王夫人 · 宝玉之母 · 持重寡言", accent: "#8a7a6a", plant: "佛",
  },
  {
    id: "jialian", name: "贾琏", alias: "", role: "贾琏 · 凤姐之夫 · 荣府子弟", accent: "#8d846c", plant: "佩",
  },
  {
    id: "xuepan", name: "薛蟠", alias: "", role: "薛蟠 · 宝钗之兄 · 呆霸王", accent: "#9d765c", plant: "酒",
  },
  { id: "jialan", name: "贾兰", alias: "", role: "贾兰 · 李纨之子 · 勤学科举", accent: "#7f8a74", plant: "兰" },
];

export const personById = (id: string) => people.find((p) => p.id === id);
export const personByName = (name: string) => people.find((p) => p.name === name);

/* ------------------------------------------------------------------ *
 * 人物头像：采用 87 版《红楼梦》真实演员形象。
 * 头像图片放到 src/assets/portraits/<id>.jpg（或 .jpeg/.png/.webp），
 * 构建时会自动被 import.meta.glob 拾取；缺图时界面显示占位并提示需补充。
 * ------------------------------------------------------------------ */
/** 87版《红楼梦》饰演者：人物头像采用真实演员形象，非虚拟画像。 */
export const cast: Record<string, string> = {
  daiyu: "陈晓旭",
  baoyu: "欧阳奋强",
  baochai: "张莉",
  xifeng: "邓婕",
  jiamu: "李婷",
  xiangyun: "郭霄珍",
  tanchun: "东方闻樱",
  yingchun: "金莉莉（后牟一）",
  xichun: "胡泽红",
  liwan: "孙梦泉",
  miaoyu: "姬玉（姬培杰）",
  yuanchun: "成梅",
  xiangling: "陈剑月",
  qingwen: "安雯（张静林）",
  xiren: "袁玫",
  zijuan: "徐丽霞",
  pingr: "沈琳",
  liulaolao: "沙玉华",
  jiazheng: "马加奇",
  wangfuren: "周贤珍",
  jialian: "高宏亮",
  xuepan: "陈洪海",
  jialan: "小演员",
};
export const actorOf = (id: string) => cast[id] ?? "";

/** 人物目录展示的主线人物（辅助人物仅用于关系，不作为独立主页）。 */
const mainIds = new Set<string>([
  "daiyu", "baoyu", "baochai", "xifeng", "jiamu", "xiangyun",
  "tanchun", "yingchun", "xichun", "liwan", "miaoyu", "yuanchun",
  "xiangling", "qingwen", "xiren", "zijuan", "pingr", "liulaolao",
]);
export const mainCharacters = people.filter((p) => mainIds.has(p.id));

/* ------------------------------------------------------------------ *
 * 人物关系：亲属 / 主仆 / 交往 / 情缘
 * ------------------------------------------------------------------ */
export const relations: Relation[] = [
  // —— 贾府长辈与宝玉 ——
  { from: "jiamu", to: "baoyu", kind: "family", label: "祖母—孙", chapter: 3 },
  { from: "jiazheng", to: "baoyu", kind: "family", label: "父子", chapter: 9 },
  { from: "wangfuren", to: "baoyu", kind: "family", label: "母子", chapter: 3 },
  { from: "jialian", to: "baoyu", kind: "family", label: "堂兄—堂弟" },
  { from: "xifeng", to: "baoyu", kind: "family", label: "堂嫂—小叔", chapter: 7 },
  // —— 宝玉与姐妹 ——
  { from: "yuanchun", to: "baoyu", kind: "family", label: "亲姐—弟", chapter: 17 },
  { from: "tanchun", to: "baoyu", kind: "family", label: "同父兄妹" },
  { from: "baochai", to: "baoyu", kind: "family", label: "姨表姐—弟", chapter: 8 },
  { from: "daiyu", to: "baoyu", kind: "sentiment", label: "姑表兄妹 · 知己", chapter: 23 },
  { from: "daiyu", to: "baochai", kind: "sentiment", label: "金兰契", chapter: 45 },
  { from: "xiangyun", to: "baoyu", kind: "family", label: "表兄妹 · 诗友", chapter: 31 },
  { from: "xiangyun", to: "baochai", kind: "social", label: "金兰诗友", chapter: 37 },
  // —— 黛玉 ——
  { from: "jiamu", to: "daiyu", kind: "family", label: "外祖母—外孙女", chapter: 3 },
  { from: "jiazheng", to: "daiyu", kind: "family", label: "舅父—外甥女", chapter: 3 },
  { from: "wangfuren", to: "daiyu", kind: "family", label: "舅母—外甥女", chapter: 3 },
  { from: "xiangyun", to: "daiyu", kind: "social", label: "联诗 · 斗草", chapter: 37 },
  { from: "xiangling", to: "daiyu", kind: "social", label: "拜师学诗", chapter: 48 },
  // —— 宝钗 ——
  { from: "jiamu", to: "baochai", kind: "family", label: "姨外祖母—甥孙女", chapter: 35 },
  { from: "xuepan", to: "baochai", kind: "family", label: "亲兄—妹", chapter: 4 },
  { from: "xiangling", to: "baochai", kind: "family", label: "兄妾—姑", chapter: 7 },
  // —— 凤姐 ——
  { from: "jialian", to: "xifeng", kind: "family", label: "夫妻", chapter: 6 },
  { from: "jiamu", to: "xifeng", kind: "family", label: "祖母—孙媳", chapter: 6 },
  { from: "xifeng", to: "liulaolao", kind: "social", label: "周济 · 刘姥姥求助", chapter: 6 },
  { from: "jiamu", to: "liulaolao", kind: "social", label: "老亲 · 款待", chapter: 40 },
  { from: "xifeng", to: "daiyu", kind: "family", label: "堂嫂—表妹", chapter: 7 },
  { from: "xifeng", to: "yuanchun", kind: "family", label: "堂嫂—堂姑" },
  { from: "xifeng", to: "zijuan", kind: "servant", label: "主子—丫鬟" },
  // —— 主仆与园中 ——
  { from: "baoyu", to: "xiren", kind: "servant", label: "贴身丫鬟", chapter: 3 },
  { from: "baoyu", to: "qingwen", kind: "servant", label: "贴身丫鬟", chapter: 52 },
  { from: "daiyu", to: "zijuan", kind: "servant", label: "贴身丫鬟", chapter: 8 },
  { from: "xifeng", to: "pingr", kind: "servant", label: "通房丫鬟", chapter: 21 },
  { from: "baochai", to: "daiyu", kind: "social", label: "同起诗社 · 金兰", chapter: 45 },
  { from: "liwan", to: "jialan", kind: "family", label: "母子", chapter: 4 },
  { from: "liwan", to: "tanchun", kind: "social", label: "诗社社长 · 社员", chapter: 37 },
  { from: "miaoyu", to: "daiyu", kind: "social", label: "栊翠庵品茶", chapter: 41 },
  { from: "miaoyu", to: "baochai", kind: "social", label: "栊翠庵品茶", chapter: 41 },
  { from: "miaoyu", to: "baoyu", kind: "social", label: "奉茶论器", chapter: 41 },
  { from: "tanchun", to: "baoyu", kind: "family", label: "兄妹", chapter: 37 },
  { from: "xichun", to: "jiamu", kind: "family", label: "祖母—孙女" },
  { from: "yingchun", to: "jiamu", kind: "family", label: "祖母—孙女" },
];

/* ------------------------------------------------------------------ *
 * 文学条目：诗词曲赋 + 食饮 + 药方
 * ------------------------------------------------------------------ */
export const literary: LiteraryEntry[] = [
  /* ———— 诗词 ———— */
  {
    id: "qinfang", kind: "poem", title: "沁芳亭题联", author: "贾宝玉", chapter: 17,
    lines: ["绕堤柳借三篙翠", "隔岸花分一脉香"],
    context: "宝玉为临水之亭拟名“沁芳”，再应父亲之命题下一联。",
  },
  {
    id: "bamboo", kind: "poem", title: "有凤来仪题联", author: "贾宝玉", chapter: 17,
    lines: ["宝鼎茶闲烟尚绿", "幽窗棋罢指犹凉"],
    context: "宝玉随贾政游园，为翠竹掩映的院落题额作联。此处后名潇湘馆。",
  },
  {
    id: "haitang-daiyu", kind: "poem", title: "咏白海棠（黛玉）", author: "林黛玉", chapter: 37,
    lines: [
      "半卷湘帘半掩门", "碾冰为土玉为盆", "偷来梨蕊三分白", "借得梅花一缕魂",
      "月窟仙人缝缟袂", "秋闺怨女拭啼痕", "娇羞默默同谁诉", "倦倚西风夜已昏",
    ],
    context: "秋爽斋初结海棠社，众人以“门、盆、魂、痕、昏”为韵。黛玉借白海棠寄托幽微情思。",
  },
  {
    id: "haitang-baochai", kind: "poem", title: "咏白海棠（宝钗）", author: "薛宝钗", chapter: 37,
    lines: [
      "珍重芳姿昼掩门", "自携手瓮灌苔盆", "胭脂洗出秋阶影", "冰雪招来露砌魂",
      "淡极始知花更艳", "愁多焉得玉无痕", "欲偿白帝凭清洁", "不语婷婷日又昏",
    ],
    context: "同题限韵，宝钗的作品被李纨评为含蓄浑厚。可与黛玉之作对照阅读。",
  },
  {
    id: "haitang-baoyu", kind: "poem", title: "咏白海棠（宝玉）", author: "贾宝玉", chapter: 37,
    lines: [
      "秋容浅淡映重门", "七节攒成雪满盆", "出浴太真冰作影", "捧心西子玉为魂",
      "晓风不散愁千点", "宿雨还添泪一痕", "独倚画栏如有意", "清砧怨笛送黄昏",
    ],
    context: "宝玉同题赋诗，以“太真”“西子”写海棠之姿，自有一种痴情笔触。",
  },
  {
    id: "haitang-tanchun", kind: "poem", title: "咏白海棠（探春）", author: "贾探春", chapter: 37,
    lines: [
      "斜阳寒草带重门", "苔翠盈铺雨后盆", "玉是精神难比洁", "雪为肌骨易销魂",
      "芳心一点娇难比", "倩影三更月有痕", "莫谓缟仙能羽化", "多情伴我咏黄昏",
    ],
    context: "探春开社定韵，先成此篇，气格清朗而有担当。",
  },
  {
    id: "haitang-xiangyun", kind: "poem", title: "咏白海棠（湘云）", author: "史湘云", chapter: 37,
    lines: [
      "神仙昨日降都门", "种得蓝田玉一盆", "自是霜娥偏爱冷", "非关倩女亦离魂",
      "秋阴捧出何方雪", "雨渍添来隔宿痕", "却喜诗人吟不倦", "岂令寂寞度朝昏",
    ],
    context: "湘云后来赶到，一口气和成两首，第一首被众人称“这诗更好”。",
  },
  {
    id: "zanghua", kind: "poem", title: "葬花吟", author: "林黛玉", chapter: 27,
    lines: [
      "花谢花飞花满天", "红消香断有谁怜", "游丝软系飘春榭", "落絮轻沾扑绣帘",
      "闺中女儿惜春暮", "愁绪满怀无释处", "手把花锄出绣闺", "忍踏落花来复去",
      "柳丝榆荚自芳菲", "不管桃飘与李飞", "桃李明年能再发", "明年闺中知有谁",
      "三月香巢已垒成", "梁间燕子太无情", "明年花发虽可啄", "却不道人去梁空巢也倾",
      "一年三百六十日", "风刀霜剑严相逼", "明媚鲜妍能几时", "一朝飘泊难寻觅",
      "花开易见落难寻", "阶前闷杀葬花人", "独倚花锄泪暗洒", "洒上空枝见血痕",
      "杜鹃无语正黄昏", "荷锄归去掩重门", "青灯照壁人初睡", "冷雨敲窗被未温",
      "怪侬底事倍伤神", "半为怜春半恼春", "怜春忽至恼忽去", "至又无言去不闻",
      "昨宵庭外悲歌发", "知是花魂与鸟魂", "花魂鸟魂总难留", "鸟自无言花自羞",
      "愿侬胁下生双翼", "随花飞到天尽头", "天尽头", "何处有香丘",
      "未若锦囊收艳骨", "一抔净土掩风流", "质本洁来还洁去", "强于污淖陷渠沟",
      "尔今死去侬收葬", "未卜侬身何日丧", "侬今葬花人笑痴", "他年葬侬知是谁",
      "试看春残花渐落", "便是红颜老死时", "一朝春尽红颜老", "花落人亡两不知",
    ],
    context: "四月二十六日芒种节，黛玉在花园中感怀落花，一面吟唱一面掩埋。宝玉隔山听到，不觉恸倒。",
  },
  {
    id: "qiuchuang", kind: "poem", title: "秋窗风雨夕", author: "林黛玉", chapter: 45,
    lines: [
      "秋花惨淡秋草黄", "耿耿秋灯秋夜长", "已觉秋窗秋不尽", "那堪风雨助凄凉",
      "助秋风雨来何速", "惊破秋窗秋梦绿", "抱得秋情不忍眠", "自向秋屏移泪烛",
      "泪烛摇摇爇短檠", "牵愁照恨动离情", "谁家秋院无风入", "何处秋窗无雨声",
      "罗衾不奈秋风力", "残漏声催秋雨急", "连宵脉脉复飕飕", "灯前似伴离人泣",
      "寒烟小院转萧条", "疏竹虚窗时滴沥", "不知风雨几时休", "已教泪洒窗纱湿",
    ],
    context: "秋霖脉脉的黄昏，黛玉卧病潇湘馆，拟张若虚《春江花月夜》之格作此，秋窗风雨尤见孤清。",
  },
  {
    id: "yongju", kind: "poem", title: "咏菊（黛玉）", author: "林黛玉", chapter: 38,
    lines: [
      "无赖诗魔昏晓侵", "绕篱欹石自沉音", "毫端蕴秀临霜写", "口角噙香对月吟",
      "满纸自怜题素怨", "片言谁解诉秋心", "一从陶令平章后", "千古高风说到今",
    ],
    context: "菊花诗社中，黛玉《咏菊》《问菊》《菊梦》连中三首，名列第一，众人赞其“风流别致”。",
  },
  {
    id: "wenju", kind: "poem", title: "问菊（黛玉）", author: "林黛玉", chapter: 38,
    lines: [
      "欲讯秋情众莫知", "喃喃负手叩东篱", "孤标傲世偕谁隐", "一样花开为底迟",
      "圃露庭霜何寂寞", "鸿归蛩病可相思", "休言举世无谈者", "解语何妨片语时",
    ],
    context: "《问菊》以设问写菊之孤高，也问出了黛玉自己的心事。",
  },
  {
    id: "yiju", kind: "poem", title: "忆菊（宝钗）", author: "薛宝钗", chapter: 38,
    lines: [
      "怅望西风抱闷思", "蓼红苇白断肠时", "空篱旧圃秋无迹", "瘦月清霜梦有知",
      "念念心随归雁远", "寥寥坐听晚砧痴", "谁怜我为黄花病", "慰语重阳会有期",
    ],
    context: "宝钗《忆菊》被李纨评为“含蓄浑厚”，是菊花诗中的上品。",
  },
  {
    id: "pangxie", kind: "poem", title: "螃蟹咏（宝钗）", author: "薛宝钗", chapter: 38,
    lines: [
      "桂霭桐阴坐举觞", "长安涎口盼重阳", "眼前道路无经纬", "皮里春秋空黑黄",
      "酒未敌腥还用菊", "性防积冷定须姜", "于今落釜成何益", "月浦空余禾黍香",
    ],
    context: "藕香榭设螃蟹宴，众人吃蟹赋诗。宝钗这首诗借蟹讽世，被众人誉为“食螃蟹的绝唱”。",
  },
  {
    id: "taohua", kind: "poem", title: "桃花行", author: "林黛玉", chapter: 70,
    lines: [
      "桃花帘外东风软", "桃花帘内晨妆懒", "帘外桃花帘内人", "人与桃花隔不远",
      "东风有意揭帘栊", "花欲窥人帘不卷", "桃花帘外开仍旧", "帘中人比桃花瘦",
      "花解怜人花也愁", "隔帘消息风吹透", "风透湘帘花满庭", "庭前春色倍伤情",
      "闲苔院落门空掩", "斜日栏杆人自凭", "凭栏人向东风泣", "茜裙偷傍桃花立",
      "桃花桃叶乱纷纷", "花绽新红叶凝碧", "雾裹烟封一万株", "烘楼照壁红模糊",
      "天机烧破鸳鸯锦", "春酣欲醒移珊枕", "侍女金盆进水来", "香泉影蘸胭脂冷",
      "胭脂鲜艳何相类", "花之颜色人之泪", "若将人泪比桃花", "泪自长流花自媚",
      "泪眼观花泪易干", "泪干春尽花憔悴", "憔悴花遮憔悴人", "花飞人倦易黄昏",
      "一声杜宇春归尽", "寂寞帘栊空月痕",
    ],
    context: "暮春时节，宝玉在沁芳桥上看到黛玉这首《桃花行》，只觉“哀音凄婉”，不用看署名便知是她所作。",
  },
  {
    id: "liuxu-baochai", kind: "poem", title: "临江仙·柳絮（宝钗）", author: "薛宝钗", chapter: 70,
    lines: [
      "白玉堂前春解舞", "东风卷得均匀", "蜂团蝶阵乱纷纷", "几曾随逝水", "岂必委芳尘",
      "万缕千丝终不改", "任他随聚随分", "韶华休笑本无根", "好风凭借力", "送我上青云",
    ],
    context: "史湘云起社填柳絮词，宝钗这首立意翻新，借柳絮言志，众人称其“独有兴致”。",
  },
  {
    id: "liuxu-daiyu", kind: "poem", title: "唐多令·柳絮（黛玉）", author: "林黛玉", chapter: 70,
    lines: [
      "粉堕百花洲", "香残燕子楼", "一团团逐对成毬", "飘泊亦如人命薄", "空缱绻", "说风流",
      "草木也知愁", "韶华竟白头", "叹今生谁舍谁收", "嫁与东风春不管", "凭尔去", "忍淹留",
    ],
    context: "同题填词，黛玉以柳絮自况漂泊飘零，众人叹其太作悲音。",
  },
  {
    id: "hongmei", kind: "poem", title: "咏红梅花（宝琴）", author: "薛宝琴", chapter: 50,
    lines: [
      "疏是枝条艳是花", "春妆儿女竞奢华", "闲庭曲槛无余雪", "流水空山有落霞",
      "幽梦冷随红袖笛", "游仙香泛绛河槎", "前身定是瑶台种", "无复相疑色相差",
    ],
    context: "芦雪庵联句之后，众人又即景赋红梅，薛宝琴这首被称“这一首最好”。",
  },

  /* ———— 食饮 ———— */
  {
    id: "qiexiang", kind: "food", title: "茄鲞", author: "", chapter: 41,
    lines: [
      "用了十几只鸡来配它，把茄子切成碎钉子，用鸡油炸了，再用鸡脯子肉并香菌、新笋、蘑菇、五香腐干、各色干果子，俱切成钉子，用鸡汤煨干，将香油一收，外加糟油一拌，盛在瓷罐子里封严。",
      "刘姥姥听了摇头吐舌：“我的佛祖！倒得十来只鸡来配它，怪道这个味儿。”",
    ],
    context: "贾母在宴上让凤姐夹给刘姥姥，说出这味“鸡”的茄鲞的做法，是红楼宴中最负盛名的一道。",
  },
  {
    id: "crab", kind: "food", title: "螃蟹宴", author: "", chapter: 38,
    lines: [
      "藕香榭里摆开螃蟹宴，众人席间剥蟹饮酒，又作了咏蟹诗。",
      "凤姐吩咐：“多者吃完了再添。”又命把酒烫得滚热的来。",
    ],
    context: "史湘云还席，在藕香榭设螃蟹宴。不但吃出热闹，也吃出凤姐的机敏与众人各异的性情。",
  },
  {
    id: "sulao", kind: "food", title: "糖蒸酥酪", author: "", chapter: 19,
    lines: [
      "贾妃赐出糖蒸酥酪，宝玉舍不得吃，留给袭人。",
      "李嬷嬷见盖着是酥酪，拿匙便吃：“我不信他这样坏了。”",
    ],
    context: "一碗酥酪牵出主仆与奶妈之间的细小心思，也见宝玉待袭人的体贴。",
  },
  {
    id: "sunsun", kind: "food", title: "酸笋鸡皮汤", author: "", chapter: 8,
    lines: ["薛姨妈作了酸笋鸡皮汤，宝玉痛喝了两碗，又吃了半碗碧粳粥。"],
    context: "宝玉到梨香院探望宝钗，在薛姨妈处吃的这碗醒酒开胃的汤，写得极有家常烟火气。",
  },
  {
    id: "lianye", kind: "food", title: "莲叶羹 · 荷叶莲蓬汤", author: "", chapter: 35,
    lines: [
      "用银模子印出莲叶、莲蓬、菱角等花样的小面，配了新荷叶熬汤。",
      "凤姐说“口味不算高贵，只是太磨牙了”，一匣子精巧的银模引得玉钏儿也凑来看。",
    ],
    context: "宝玉挨打后想喝此汤，王夫人让凤姐做了。一份家常汤水，写出贾府生活的考究。",
  },
  {
    id: "ougeng", kind: "food", title: "藕粉桂花糖糕", author: "", chapter: 41,
    lines: [
      "侍奉的婆子捧来两盒点心，揭开一看，是藕粉桂花糖糕和松瓤鹅油卷。",
      "贾母拣了桂花糖糕，又让刘姥姥尝尝这“没吃过的东西”。",
    ],
    context: "游园到缀锦阁用点心，这味甜糕是红楼点心里的清雅代表。",
  },
  {
    id: "yanwo", kind: "food", title: "燕窝", author: "", chapter: 45,
    lines: [
      "宝钗见黛玉又咳，说“每日早起拿上等燕窝一两，冰糖五钱，用银铫子熬出粥来吃，比药还强”。",
      "当夜便命婆子送来一大包上等燕窝，还有一包洁粉梅片雪花洋糖。",
    ],
    context: "潇湘馆的深夜，一盅燕窝不只养病，也写尽钗黛之间从隔阂到相知的情分。",
  },
  {
    id: "yanzhimi", kind: "food", title: "御田胭脂米", author: "", chapter: 53,
    lines: [
      "黑山村的乌庄头交租，单子上写着“御田胭脂米二石”。",
      "贾母等吃的红稻米粥，就是这胭脂米熬的。",
    ],
    context: "年下进租的单子一开，贾府由盛而衰的家底也顺着这几石米显了出来。",
  },
  {
    id: "xingrencha", kind: "food", title: "杏仁茶", author: "", chapter: 54,
    lines: [
      "元宵夜宴后，贾母觉得饿了，凤姐忙说“有预备的鸭子肉粥”，贾母却嫌油腻，最后上了杏仁茶。",
    ],
    context: "荣府夜宴的尾声，一碗清淡的杏仁茶映出贾母养尊处优的胃口与分寸。",
  },
  {
    id: "meiguilu", kind: "food", title: "玫瑰露与茯苓霜", author: "", chapter: 60,
    lines: [
      "王夫人拿了两瓶玫瑰露给宝玉，又有个小丫头送来一包茯苓霜。",
      "这“上用的”东西招来厨房里的风波，也牵出赵姨娘一房的暗流。",
    ],
    context: "玫瑰露、茯苓霜本是寻常补品，却因下人间的争宠生出一场是非。",
  },

  /* ———— 药方 ———— */
  {
    id: "lengxiang", kind: "medicine", title: "冷香丸", author: "", chapter: 7,
    lines: [
      "春天开的白牡丹花蕊、夏天开的白荷花、秋天开的白芙蓉、冬天开的白梅花蕊，于春分日晒干。",
      "再用雨水这日的雨、白露这日的露、霜降这日的霜、小雪这日的雪，四样水调匀，和了药，再加十二钱蜂蜜、十二钱白糖，团成龙眼大的丸子，盛在旧磁坛内，埋在花根底下。",
      "发病时吃一丸，用十二分黄柏煎汤送下。",
    ],
    context: "宝钗从胎里带来的一股热毒，靠这“可巧”得齐了四时花蕊与雨露霜雪的奇方平复，也暗合她处世的周全。",
  },
  {
    id: "renshenyangrong", kind: "medicine", title: "人参养荣丸", author: "", chapter: 3,
    lines: ["黛玉常服人参养荣丸，林如海在时，原说“请多少太医，也只好将养着”。"],
    context: "黛玉进贾府，众人见她身子怯弱，问起常吃什么药，她答便服人参养荣丸。",
  },
  {
    id: "yiqi", kind: "medicine", title: "益气养荣补脾和肝汤", author: "", chapter: 10,
    lines: [
      "张友士为秦可卿开方：人参、白术、云苓、熟地、归身、白芍、川芎、黄芪、香附米、醋柴胡、怀山药、真阿胶、延胡索、炙甘草，引用建莲子七粒、去心红枣二枚。",
      "并说这病“算得个缓症”，只管“安心养病”。",
    ],
    context: "这是全书写得最完整的一张药方，也借秦可卿之病写出贾府为这位重病媳妇的尽心与隐忧。",
  },
  {
    id: "dushen", kind: "medicine", title: "独参汤", author: "", chapter: 12,
    lines: ["贾瑞病重，要吃独参汤。代儒只得往荣府来寻，凤姐却用“渣末泡须”搪塞过去。"],
    context: "独参汤是急救元气的人参大补之剂。凤姐的刻薄与敷衍，为贾瑞的结局再添一层凉薄。",
  },
  {
    id: "liaodu", kind: "medicine", title: "疗妒汤", author: "", chapter: 80,
    lines: [
      "王一贴包治百病，被问治“妒病”的方子，笑道：用秋梨一个，二钱冰糖，一钱陈皮，水三碗，梨熟为度。每日清早吃这么一个梨，吃来吃去就好了。",
      "他又笑说：“这三味药都是润肺开胃不伤人的，甜丝丝的，又止咳嗽，又好吃。吃过一百岁，人横竖要死的，死了还妒什么！”",
    ],
    context: "《红楼梦》里最妙的一则“笑话药方”，借道士王一贴之口，把妒病与生死看透。",
  },
  {
    id: "tianwang", kind: "medicine", title: "天王补心丹", author: "", chapter: 28,
    lines: [
      "王夫人问黛玉常吃何药，宝玉说“林妹妹是内症，先天生的弱，所以禁不住一点风寒”，随手写下一个方子。",
      "后来王夫人又问，黛玉说“也不过是些人参、肉桂，或是天王补心丹之类”。",
    ],
    context: "天王补心丹是安神养心之剂。宝玉与黛玉围绕“吃的什么药”的一问，透出他时时挂念的心思。",
  },
  {
    id: "bazhen", kind: "medicine", title: "八珍益母丸", author: "", chapter: 28,
    lines: ["王夫人让去问太医，若黛玉这病该吃八珍益母丸就开方子。"],
    context: "八珍益母丸养血调经，是给体弱女眷常备的丸药。一丸药名也见长辈对黛玉的照看。",
  },
];

export const poems = literary.filter((l) => l.kind === "poem");
export const foods = literary.filter((l) => l.kind === "food");
export const medicines = literary.filter((l) => l.kind === "medicine");

/* ------------------------------------------------------------------ *
 * 故事：精选情节（沿用共享 ID 关联）
 * ------------------------------------------------------------------ */
export const stories: Story[] = [
  {
    id: "naming",
    chapter: 17,
    title: "题额大观园",
    subtitle: "随宝玉，初识园中景",
    description:
      "园中工程告竣，贾政与众清客入园观览，宝玉随行题额。沿着清流与竹影，读建筑，也读匾额中的心思。",
    people: ["贾宝玉", "贾政"],
    places: ["qinfang", "xiaoxiang", "daoxiang", "hengwu", "yihong"],
    poems: ["qinfang", "bamboo"],
  },
  {
    id: "society",
    chapter: 37,
    title: "偶结海棠社",
    subtitle: "一纸花笺，邀来满园诗意",
    description:
      "探春发起诗社，众人在秋爽斋商议雅号、限韵赋诗。同一枝白海棠，在不同人笔下生出不同性情。",
    people: [
      "贾探春", "林黛玉", "薛宝钗", "贾宝玉", "李纨", "贾迎春", "贾惜春",
    ],
    places: ["qiushuang"],
    poems: [
      "haitang-daiyu", "haitang-baochai", "haitang-baoyu", "haitang-tanchun", "haitang-xiangyun",
    ],
  },
  {
    id: "visit",
    chapter: 40,
    title: "刘姥姥游园",
    subtitle: "走进画里的富贵人家",
    description:
      "贾母带刘姥姥游赏大观园。她在沁芳亭赞叹眼前景致，觉得这里比年画上的园子还要好看。",
    people: ["刘姥姥", "贾母", "王熙凤", "贾惜春"],
    places: ["qinfang"],
    poems: [],
  },
  {
    id: "tea",
    chapter: 41,
    title: "栊翠庵品茶",
    subtitle: "一盏清茶，几重人情",
    description:
      "贾母携刘姥姥来到栊翠庵，妙玉烹茶待客。宝玉、宝钗与黛玉也在这一回的品茶情节中出场。",
    people: ["妙玉", "贾母", "刘姥姥", "贾宝玉", "薛宝钗", "林黛玉"],
    places: ["longcui"],
    poems: [],
  },
  {
    id: "crab-feast",
    chapter: 38,
    title: "藕香榭蟹宴",
    subtitle: "一席秋风，几联诗情",
    description:
      "湘云在藕香榭设螃蟹宴，众人赏桂食蟹，随后赋菊花诗、咏螃蟹。热闹里藏着各人的心性。",
    people: ["史湘云", "薛宝钗", "林黛玉", "贾宝玉", "王熙凤", "贾母", "贾探春"],
    places: ["ouxiang"],
    poems: ["yiju", "yongju", "wenju", "pangxie"],
  },
];
