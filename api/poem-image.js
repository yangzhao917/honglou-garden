// src/application/poemArt.ts
var SCENE_TABLE = {
  qinfang: {
    motif: "a waterside pavilion named Qinfang beside a lotus pond, willows lining the embankment",
    subjects: [
      "ancient Chinese pavilion with upturned eaves",
      "weeping willows dipping into water",
      "lotus leaves and a few pale pink blossoms",
      "stone embankment with wooden railing"
    ],
    mood: ["serene", "fresh spring", "gentle breeze", "literati elegance"],
    palette: ["emerald green", "jade white", "soft willow yellow", "pale pink"],
    composition: "eye-level medium shot, pavilion centered with reflection in water, soft morning light"
  },
  bamboo: {
    motif: "a study flanked by dense emerald bamboo groves, named 'Phoenix Comes to Rest'",
    subjects: [
      "tall slender bamboo forest",
      "small traditional Chinese study with green-tiled roof",
      "wooden lattice window glowing warm light",
      "stone path winding into the grove"
    ],
    mood: ["quiet", "literary", "cool shade", "refined solitude"],
    palette: ["bamboo green", "mist grey", "warm amber", "ink black"],
    composition: "perspective looking into bamboo grove with study half-hidden, soft diffused light filtering through leaves"
  },
  "haitang-daiyu": {
    motif: "white begonia blossoms in a scholar's courtyard at dusk, melancholic feminine mood",
    subjects: [
      "potted white begonia flowers",
      "half-closed wooden door with bamboo curtain",
      "jade basin and porcelain",
      "scattered fallen petals on mossy stone"
    ],
    mood: ["delicate", "sorrowful", "moonlit", "paper-white purity"],
    palette: ["snow white", "cold silver", "ash grey", "pale jade"],
    composition: "low-angle close-up of white begonia against a misty grey wall, single bloom in focus"
  },
  "haitang-baochai": {
    motif: "a plump white begonia heavy with dew in a refined courtyard, dignified and composed",
    subjects: [
      "lush white begonia blossoms in celadon pot",
      "mossy stone steps",
      "tall garden wall casting long shadow",
      "dewdrops on plump petals"
    ],
    mood: ["noble", "lush", "gentle", "afternoon stillness"],
    palette: ["warm white", "celadon green", "soft amber", "mossy grey"],
    composition: "balanced symmetrical framing of begonia bush with architectural wall backdrop"
  },
  "haitang-baoyu": {
    motif: "a moonlit white begonia that looks like a beauty stepping from a bath, yearning gaze",
    subjects: [
      "white begonia in stone basin",
      "blue-green porcelain bowl",
      "fallen petals on lacquered railing",
      "distant moon through gauze clouds"
    ],
    mood: ["dreamy", "sentimental", "evening glow", "tender melancholy"],
    palette: ["cool white", "moonlight blue", "pear grey", "porcelain teal"],
    composition: "three-quarter view with begonia in foreground, distant garden wall and moon behind"
  },
  "haitang-tanchun": {
    motif: "white begonia after autumn rain, a determined and upright feminine presence",
    subjects: [
      "white begonia with wet leaves",
      "tangled green moss on garden rock",
      "painted balcony railing",
      "chrysanthemums nearby"
    ],
    mood: ["vigorous", "rain-washed", "fresh", "spirited"],
    palette: ["fresh white", "rain-soaked green", "ink shadow", "soft amber"],
    composition: "wide-angle garden scene after rain, begonia prominent in mid-ground"
  },
  "haitang-xiangyun": {
    motif: "an enchanted white begonia descended from the heavens, bright and carefree mood",
    subjects: [
      "abundant white begonia spilling over a celadon pot",
      "two young women in traditional Hanfu smiling",
      "blue garden door slightly ajar",
      "fallen petals like snow"
    ],
    mood: ["joyful", "bright", "social", "poetic enthusiasm"],
    palette: ["snow white", "sky blue", "jade green", "warm skin tone"],
    composition: "wide social scene in a courtyard with begonia centerpiece"
  },
  zanghua: {
    motif: "a young woman in Hanfu burying fallen flower petals under a bamboo grove at dusk",
    subjects: [
      "fallen peach and pear blossoms covering the ground",
      "a flower hoe in her hand, bamboo basket on her back",
      "long trailing weeping willows",
      "mossy stone path and wooden garden door",
      "wisteria trellis in the background"
    ],
    mood: ["elegiac", "fateful", "spring sorrow", "lone beauty"],
    palette: ["muted pink", "ash brown", "dusk indigo", "bamboo green"],
    composition: "profile of a solitary woman walking through drifts of fallen petals, soft golden hour light from behind"
  },
  qiuchuang: {
    motif: "autumn rain lashing a small study window beside sparse bamboo, lonely candle inside",
    subjects: [
      "wooden lattice window streaming rain",
      "slender bamboo outside trembling in wind",
      "a single candle on the desk with a sorrowful book",
      "cold tea in a celadon cup"
    ],
    mood: ["withering", "rain-soaked", "haunting", "melancholic"],
    palette: ["ink black", "ash grey", "cold jade", "dim amber"],
    composition: "first-person view through rain-streaked window, candle flame reflected on wet wood"
  },
  yongju: {
    motif: "chrysanthemums blooming alone by a stone fence in late autumn moonlight",
    subjects: [
      "clusters of golden and white chrysanthemums",
      "tilted scholar's rock by the fence",
      "long bamboo shadow",
      "an inkstone and brush abandoned on a stone bench"
    ],
    mood: ["solitary", "elevated", "moonlit", "poetic obsession"],
    palette: ["chrysanthemum yellow", "frost white", "ink grey", "dark pine"],
    composition: "asymmetric close-up with chrysanthemums filling lower frame, moon and bare branches above"
  },
  wenju: {
    motif: "a single chrysanthemum standing alone against autumn wind, addressed as a confidante",
    subjects: [
      "one proud chrysanthemum bloom against a garden wall",
      "a hand reaching gently toward the petals",
      "fallen petals at the base",
      "sparse bamboo nearby"
    ],
    mood: ["questioning", "intimate", "regretful", "tender"],
    palette: ["dusk amber", "faded yellow", "smoky grey", "soft pine"],
    composition: "tight portrait composition, single bloom centered, soft autumnal bokeh"
  },
  yiju: {
    motif: "autumn dusk over an empty fenced garden where chrysanthemums once bloomed",
    subjects: [
      "empty bamboo fence",
      "withered chrysanthemum stems",
      "a distant moonlit hill",
      "frosted cobblestones"
    ],
    mood: ["nostalgic", "longing", "late autumn", "recollection"],
    palette: ["frost white", "twilight purple", "smoky blue", "faded ochre"],
    composition: "wide contemplative scene with empty garden leading eye to distant moon"
  },
  pangxie: {
    motif: "an autumn riverside pavilion where ladies in Hanfu eat crabs under osmanthus shade",
    subjects: [
      "long banquet table with crab shells, wine cups, chrysanthemums",
      "rows of women in elegant Hanfu robes",
      "osmanthus tree with golden blossoms overhead",
      "reed-covered pond behind the pavilion"
    ],
    mood: ["convivial", "biting satire", "autumn gaiety", "literary wit"],
    palette: ["golden osmanthus", "autumn ochre", "jade green", "ink black"],
    composition: "wide horizontal banquet scene with pavilion, table and pond in single sweep"
  },
  taohua: {
    motif: "a curtain of pink peach blossoms surrounding a young woman combing her hair",
    subjects: [
      "endless pink peach blossoms like falling snow",
      "peach petal curtain drawn half open",
      "young woman in pale Hanfu with hairpin",
      "garden wall and emerald leaves",
      "curved wooden bridge in distance"
    ],
    mood: ["bewitching", "sorrowful spring", "misty", "veiled beauty"],
    palette: ["peach pink", "pale jade", "soft crimson", "garden green"],
    composition: "frontal portrait of woman through half-open blossom curtain, soft focus petals"
  },
  "liuxu-baochai": {
    motif: "white willow catkins drifting upward on a spring breeze toward blue sky",
    subjects: [
      "soft white willow fluff floating in air",
      "jade-white steps and railing",
      "a hand reaching to catch a drifting tuft",
      "distant sky in pale cobalt blue"
    ],
    mood: ["uplifted", "aspirational", "light", "rising spirit"],
    palette: ["sky blue", "white jade", "fresh willow green", "silver"],
    composition: "low-angle view looking up at drifting willow fluff against open sky"
  },
  "liuxu-daiyu": {
    motif: "white willow catkins scattering sadly over an abandoned garden path",
    subjects: [
      "white willow fluff falling over mossy flagstones",
      "empty swing hanging from a tree",
      "wilting daffodil near a broken vase",
      "raindrops on scattered petals"
    ],
    mood: ["forsaken", "wistful", "drifting", "lamenting"],
    palette: ["ash grey", "pear white", "dusk purple", "muted moss"],
    composition: "diagonal path strewn with willow fluff leading to a faded garden gate"
  },
  hongmei: {
    motif: "red plum blossoms blooming defiantly after snow by a mountain stream",
    subjects: [
      "vivid red plum blossoms against white snow",
      "ancient twisted plum tree trunk",
      "rocky stream with thin ice",
      "distant pale mountains"
    ],
    mood: ["heroic", "stark beauty", "winter vitality", "proud"],
    palette: ["vermilion red", "snow white", "mountain blue", "ink branch"],
    composition: "vertical composition with plum branch cutting across snow scene, single accent bloom"
  }
};
var FALLBACK = {
  motif: "a quiet scene from a classical Chinese scholar's garden, evoking a poem from the Qing dynasty novel Dream of the Red Chamber",
  subjects: [
    "traditional Chinese garden pavilion",
    "seasonal flowers or trees",
    "stone path and railing"
  ],
  mood: ["literary", "contemplative", "classical Chinese painting mood"],
  palette: ["rice paper white", "ink black", "garden green", "muted ochre"],
  composition: "balanced wide shot, like a hanging scroll painting, with ample negative space"
};
function buildPoemPrompt(poem, seed) {
  const base = SCENE_TABLE[poem.id] ?? FALLBACK;
  const lines = `[Style] classical Chinese gongbi painting blended with soft cinematic realism, hanging scroll composition with poetic negative space.
[Scene] ${base.motif}.
[Subjects] ${base.subjects.join(", ")}.
[Setting] ${poem.title} by ${poem.author || "Cao Xueqin"} \u2014 ${poem.context}.
[Mood] ${base.mood.join(", ")}.
[Palette] ${base.palette.join(", ")}.
[Composition] ${base.composition}.
[Quality] high detail, soft natural light, ink-wash atmosphere, no text, no watermark, no signature, no people faces in close-up, no modern elements, no anime.
[Seed] ${seed}.`;
  return lines;
}

// src/infrastructure/catalog.ts
var people = [
  { id: "daiyu", name: "\u6797\u9EDB\u7389", alias: "\u6F47\u6E58\u5983\u5B50", role: "\u9EDB\u7389 \xB7 \u524D\u8EAB\u7EDB\u73E0 \xB7 \u548F\u7D6E\u4E4B\u624D", placeId: "xiaoxiang", accent: "#6f896b", plant: "\u7AF9" },
  { id: "baoyu", name: "\u8D3E\u5B9D\u7389", alias: "\u6021\u7EA2\u516C\u5B50", role: "\u5B9D\u7389 \xB7 \u8854\u7389\u800C\u751F \xB7 \u75F4\u60C5\u516C\u5B50", placeId: "yihong", accent: "#a24e3a", plant: "\u7389" },
  { id: "baochai", name: "\u859B\u5B9D\u9497", alias: "\u8605\u829C\u541B", role: "\u5B9D\u9497 \xB7 \u535A\u5B66\u7A33\u91CD \xB7 \u8605\u829C\u4E4B\u9999", placeId: "hengwu", accent: "#b48a4e", plant: "\u83CA" },
  { id: "xifeng", name: "\u738B\u7199\u51E4", alias: "\u51E4\u8FA3\u5B50", role: "\u51E4\u59D0 \xB7 \u8363\u5E9C\u5F53\u5BB6 \xB7 \u660E\u8273\u6CFC\u8FA3", accent: "#bd6744", plant: "\u51E4" },
  { id: "jiamu", name: "\u8D3E\u6BCD", alias: "\u53F2\u592A\u541B", role: "\u8D3E\u6BCD \xB7 \u8D3E\u5E9C\u592A\u4E0A \xB7 \u6148\u7231\u5927\u5BB6\u957F", accent: "#8a7a5c", plant: "\u5BFF" },
  { id: "xiangyun", name: "\u53F2\u6E58\u4E91", alias: "\u6795\u971E\u65E7\u53CB", role: "\u6E58\u4E91 \xB7 \u8C6A\u723D\u5A07\u61A8 \xB7 \u8BD7\u60C5\u5929\u771F", accent: "#8b8397", plant: "\u828D\u836F" },
  { id: "tanchun", name: "\u8D3E\u63A2\u6625", alias: "\u8549\u4E0B\u5BA2", role: "\u63A2\u6625 \xB7 \u7CBE\u660E\u654F\u9510 \xB7 \u7ED3\u793E\u7ACB\u793E", placeId: "qiushuang", accent: "#aa7350", plant: "\u8549" },
  { id: "yingchun", name: "\u8D3E\u8FCE\u6625", alias: "\u83F1\u6D32", role: "\u8FCE\u6625 \xB7 \u61E6\u5F31\u5584\u826F \xB7 \u4E8C\u6728\u5934", accent: "#9d8b74", plant: "\u83F1" },
  { id: "xichun", name: "\u8D3E\u60DC\u6625", alias: "\u85D5\u69AD", role: "\u60DC\u6625 \xB7 \u5B64\u4ECB\u51B7\u6E05 \xB7 \u4E60\u753B\u53C2\u7985", placeId: "ouxiang", accent: "#6d8b78", plant: "\u83B2" },
  { id: "liwan", name: "\u674E\u7EA8", alias: "\u7A3B\u9999\u8001\u519C", role: "\u674E\u7EA8 \xB7 \u5B88\u8282\u6559\u5B50 \xB7 \u6734\u6DE1\u5E7D\u5C45", placeId: "daoxiang", accent: "#838b6a", plant: "\u7A3B" },
  { id: "miaoyu", name: "\u5999\u7389", alias: "\u680A\u7FE0\u4E3B\u4EBA", role: "\u5999\u7389 \xB7 \u5E26\u53D1\u4FEE\u884C \xB7 \u6D01\u51C0\u5B64\u9AD8", placeId: "longcui", accent: "#7d8ba0", plant: "\u6885" },
  { id: "yuanchun", name: "\u8D3E\u5143\u6625", alias: "\u8D35\u5983", role: "\u5143\u6625 \xB7 \u8363\u5E9C\u957F\u5973 \xB7 \u5F52\u7701\u7701\u4EB2", accent: "#b5896a", plant: "\u7261\u4E39" },
  { id: "xiangling", name: "\u9999\u83F1", alias: "\u7504\u82F1\u83B2", role: "\u9999\u83F1 \xB7 \u547D\u9014\u574E\u5777 \xB7 \u75F4\u5FC3\u5B66\u8BD7", accent: "#a86f7c", plant: "\u83B2" },
  { id: "qingwen", name: "\u6674\u96EF", alias: "\u8299\u84C9", role: "\u6674\u96EF \xB7 \u5FC3\u6BD4\u5929\u9AD8 \xB7 \u98CE\u6D41\u7075\u5DE7", accent: "#9d7ba0", plant: "\u8299\u84C9" },
  { id: "xiren", name: "\u88AD\u4EBA", alias: "\u82B1\u88AD\u4EBA", role: "\u88AD\u4EBA \xB7 \u6E29\u67D4\u548C\u987A \xB7 \u8D34\u5FC3\u5468\u5168", accent: "#b48f96", plant: "\u82B1" },
  { id: "zijuan", name: "\u7D2B\u9E43", alias: "\u9E43\u513F", role: "\u7D2B\u9E43 \xB7 \u9EDB\u7389\u77E5\u5DF1 \xB7 \u5FE0\u5FC3\u4E00\u7247", accent: "#7d94a8", plant: "\u9E43" },
  { id: "pingr", name: "\u5E73\u513F", alias: "\u5E73\u59D1\u5A18", role: "\u5E73\u513F \xB7 \u51E4\u59D0\u81C2\u8180 \xB7 \u5FE0\u539A\u548C\u5584", accent: "#b07f6a", plant: "\u9497" },
  { id: "liulaolao", name: "\u5218\u59E5\u59E5", alias: "\u5218\u8001\u8001", role: "\u5218\u59E5\u59E5 \xB7 \u6751\u91CE\u8001\u59AA \xB7 \u4E8C\u8FDB\u8363\u56FD\u5E9C", accent: "#7d8a5e", plant: "\u852C" },
  {
    id: "jiazheng",
    name: "\u8D3E\u653F",
    alias: "",
    role: "\u8D3E\u653F \xB7 \u5B9D\u7389\u4E4B\u7236 \xB7 \u7AEF\u65B9\u4E25\u6B63",
    accent: "#7f866e",
    plant: "\u4E66"
  },
  {
    id: "wangfuren",
    name: "\u738B\u592B\u4EBA",
    alias: "",
    role: "\u738B\u592B\u4EBA \xB7 \u5B9D\u7389\u4E4B\u6BCD \xB7 \u6301\u91CD\u5BE1\u8A00",
    accent: "#8a7a6a",
    plant: "\u4F5B"
  },
  {
    id: "jialian",
    name: "\u8D3E\u740F",
    alias: "",
    role: "\u8D3E\u740F \xB7 \u51E4\u59D0\u4E4B\u592B \xB7 \u8363\u5E9C\u5B50\u5F1F",
    accent: "#8d846c",
    plant: "\u4F69"
  },
  {
    id: "xuepan",
    name: "\u859B\u87E0",
    alias: "",
    role: "\u859B\u87E0 \xB7 \u5B9D\u9497\u4E4B\u5144 \xB7 \u5446\u9738\u738B",
    accent: "#9d765c",
    plant: "\u9152"
  },
  { id: "jialan", name: "\u8D3E\u5170", alias: "", role: "\u8D3E\u5170 \xB7 \u674E\u7EA8\u4E4B\u5B50 \xB7 \u52E4\u5B66\u79D1\u4E3E", accent: "#7f8a74", plant: "\u5170" }
];
var mainIds = /* @__PURE__ */ new Set([
  "daiyu",
  "baoyu",
  "baochai",
  "xifeng",
  "jiamu",
  "xiangyun",
  "tanchun",
  "yingchun",
  "xichun",
  "liwan",
  "miaoyu",
  "yuanchun",
  "xiangling",
  "qingwen",
  "xiren",
  "zijuan",
  "pingr",
  "liulaolao"
]);
var mainCharacters = people.filter((p) => mainIds.has(p.id));
var literary = [
  /* ———— 诗词 ———— */
  {
    id: "qinfang",
    kind: "poem",
    title: "\u6C81\u82B3\u4EAD\u9898\u8054",
    author: "\u8D3E\u5B9D\u7389",
    chapter: 17,
    lines: ["\u7ED5\u5824\u67F3\u501F\u4E09\u7BD9\u7FE0", "\u9694\u5CB8\u82B1\u5206\u4E00\u8109\u9999"],
    context: "\u5B9D\u7389\u4E3A\u4E34\u6C34\u4E4B\u4EAD\u62DF\u540D\u201C\u6C81\u82B3\u201D\uFF0C\u518D\u5E94\u7236\u4EB2\u4E4B\u547D\u9898\u4E0B\u4E00\u8054\u3002"
  },
  {
    id: "bamboo",
    kind: "poem",
    title: "\u6709\u51E4\u6765\u4EEA\u9898\u8054",
    author: "\u8D3E\u5B9D\u7389",
    chapter: 17,
    lines: ["\u5B9D\u9F0E\u8336\u95F2\u70DF\u5C1A\u7EFF", "\u5E7D\u7A97\u68CB\u7F62\u6307\u72B9\u51C9"],
    context: "\u5B9D\u7389\u968F\u8D3E\u653F\u6E38\u56ED\uFF0C\u4E3A\u7FE0\u7AF9\u63A9\u6620\u7684\u9662\u843D\u9898\u989D\u4F5C\u8054\u3002\u6B64\u5904\u540E\u540D\u6F47\u6E58\u9986\u3002"
  },
  {
    id: "haitang-daiyu",
    kind: "poem",
    title: "\u548F\u767D\u6D77\u68E0\uFF08\u9EDB\u7389\uFF09",
    author: "\u6797\u9EDB\u7389",
    chapter: 37,
    lines: [
      "\u534A\u5377\u6E58\u5E18\u534A\u63A9\u95E8",
      "\u78BE\u51B0\u4E3A\u571F\u7389\u4E3A\u76C6",
      "\u5077\u6765\u68A8\u854A\u4E09\u5206\u767D",
      "\u501F\u5F97\u6885\u82B1\u4E00\u7F15\u9B42",
      "\u6708\u7A9F\u4ED9\u4EBA\u7F1D\u7F1F\u8882",
      "\u79CB\u95FA\u6028\u5973\u62ED\u557C\u75D5",
      "\u5A07\u7F9E\u9ED8\u9ED8\u540C\u8C01\u8BC9",
      "\u5026\u501A\u897F\u98CE\u591C\u5DF2\u660F"
    ],
    context: "\u79CB\u723D\u658B\u521D\u7ED3\u6D77\u68E0\u793E\uFF0C\u4F17\u4EBA\u4EE5\u201C\u95E8\u3001\u76C6\u3001\u9B42\u3001\u75D5\u3001\u660F\u201D\u4E3A\u97F5\u3002\u9EDB\u7389\u501F\u767D\u6D77\u68E0\u5BC4\u6258\u5E7D\u5FAE\u60C5\u601D\u3002"
  },
  {
    id: "haitang-baochai",
    kind: "poem",
    title: "\u548F\u767D\u6D77\u68E0\uFF08\u5B9D\u9497\uFF09",
    author: "\u859B\u5B9D\u9497",
    chapter: 37,
    lines: [
      "\u73CD\u91CD\u82B3\u59FF\u663C\u63A9\u95E8",
      "\u81EA\u643A\u624B\u74EE\u704C\u82D4\u76C6",
      "\u80ED\u8102\u6D17\u51FA\u79CB\u9636\u5F71",
      "\u51B0\u96EA\u62DB\u6765\u9732\u780C\u9B42",
      "\u6DE1\u6781\u59CB\u77E5\u82B1\u66F4\u8273",
      "\u6101\u591A\u7109\u5F97\u7389\u65E0\u75D5",
      "\u6B32\u507F\u767D\u5E1D\u51ED\u6E05\u6D01",
      "\u4E0D\u8BED\u5A77\u5A77\u65E5\u53C8\u660F"
    ],
    context: "\u540C\u9898\u9650\u97F5\uFF0C\u5B9D\u9497\u7684\u4F5C\u54C1\u88AB\u674E\u7EA8\u8BC4\u4E3A\u542B\u84C4\u6D51\u539A\u3002\u53EF\u4E0E\u9EDB\u7389\u4E4B\u4F5C\u5BF9\u7167\u9605\u8BFB\u3002"
  },
  {
    id: "haitang-baoyu",
    kind: "poem",
    title: "\u548F\u767D\u6D77\u68E0\uFF08\u5B9D\u7389\uFF09",
    author: "\u8D3E\u5B9D\u7389",
    chapter: 37,
    lines: [
      "\u79CB\u5BB9\u6D45\u6DE1\u6620\u91CD\u95E8",
      "\u4E03\u8282\u6512\u6210\u96EA\u6EE1\u76C6",
      "\u51FA\u6D74\u592A\u771F\u51B0\u4F5C\u5F71",
      "\u6367\u5FC3\u897F\u5B50\u7389\u4E3A\u9B42",
      "\u6653\u98CE\u4E0D\u6563\u6101\u5343\u70B9",
      "\u5BBF\u96E8\u8FD8\u6DFB\u6CEA\u4E00\u75D5",
      "\u72EC\u501A\u753B\u680F\u5982\u6709\u610F",
      "\u6E05\u7827\u6028\u7B1B\u9001\u9EC4\u660F"
    ],
    context: "\u5B9D\u7389\u540C\u9898\u8D4B\u8BD7\uFF0C\u4EE5\u201C\u592A\u771F\u201D\u201C\u897F\u5B50\u201D\u5199\u6D77\u68E0\u4E4B\u59FF\uFF0C\u81EA\u6709\u4E00\u79CD\u75F4\u60C5\u7B14\u89E6\u3002"
  },
  {
    id: "haitang-tanchun",
    kind: "poem",
    title: "\u548F\u767D\u6D77\u68E0\uFF08\u63A2\u6625\uFF09",
    author: "\u8D3E\u63A2\u6625",
    chapter: 37,
    lines: [
      "\u659C\u9633\u5BD2\u8349\u5E26\u91CD\u95E8",
      "\u82D4\u7FE0\u76C8\u94FA\u96E8\u540E\u76C6",
      "\u7389\u662F\u7CBE\u795E\u96BE\u6BD4\u6D01",
      "\u96EA\u4E3A\u808C\u9AA8\u6613\u9500\u9B42",
      "\u82B3\u5FC3\u4E00\u70B9\u5A07\u96BE\u6BD4",
      "\u5029\u5F71\u4E09\u66F4\u6708\u6709\u75D5",
      "\u83AB\u8C13\u7F1F\u4ED9\u80FD\u7FBD\u5316",
      "\u591A\u60C5\u4F34\u6211\u548F\u9EC4\u660F"
    ],
    context: "\u63A2\u6625\u5F00\u793E\u5B9A\u97F5\uFF0C\u5148\u6210\u6B64\u7BC7\uFF0C\u6C14\u683C\u6E05\u6717\u800C\u6709\u62C5\u5F53\u3002"
  },
  {
    id: "haitang-xiangyun",
    kind: "poem",
    title: "\u548F\u767D\u6D77\u68E0\uFF08\u6E58\u4E91\uFF09",
    author: "\u53F2\u6E58\u4E91",
    chapter: 37,
    lines: [
      "\u795E\u4ED9\u6628\u65E5\u964D\u90FD\u95E8",
      "\u79CD\u5F97\u84DD\u7530\u7389\u4E00\u76C6",
      "\u81EA\u662F\u971C\u5A25\u504F\u7231\u51B7",
      "\u975E\u5173\u5029\u5973\u4EA6\u79BB\u9B42",
      "\u79CB\u9634\u6367\u51FA\u4F55\u65B9\u96EA",
      "\u96E8\u6E0D\u6DFB\u6765\u9694\u5BBF\u75D5",
      "\u5374\u559C\u8BD7\u4EBA\u541F\u4E0D\u5026",
      "\u5C82\u4EE4\u5BC2\u5BDE\u5EA6\u671D\u660F"
    ],
    context: "\u6E58\u4E91\u540E\u6765\u8D76\u5230\uFF0C\u4E00\u53E3\u6C14\u548C\u6210\u4E24\u9996\uFF0C\u7B2C\u4E00\u9996\u88AB\u4F17\u4EBA\u79F0\u201C\u8FD9\u8BD7\u66F4\u597D\u201D\u3002"
  },
  {
    id: "zanghua",
    kind: "poem",
    title: "\u846C\u82B1\u541F",
    author: "\u6797\u9EDB\u7389",
    chapter: 27,
    lines: [
      "\u82B1\u8C22\u82B1\u98DE\u82B1\u6EE1\u5929",
      "\u7EA2\u6D88\u9999\u65AD\u6709\u8C01\u601C",
      "\u6E38\u4E1D\u8F6F\u7CFB\u98D8\u6625\u69AD",
      "\u843D\u7D6E\u8F7B\u6CBE\u6251\u7EE3\u5E18",
      "\u95FA\u4E2D\u5973\u513F\u60DC\u6625\u66AE",
      "\u6101\u7EEA\u6EE1\u6000\u65E0\u91CA\u5904",
      "\u624B\u628A\u82B1\u9504\u51FA\u7EE3\u95FA",
      "\u5FCD\u8E0F\u843D\u82B1\u6765\u590D\u53BB",
      "\u67F3\u4E1D\u6986\u835A\u81EA\u82B3\u83F2",
      "\u4E0D\u7BA1\u6843\u98D8\u4E0E\u674E\u98DE",
      "\u6843\u674E\u660E\u5E74\u80FD\u518D\u53D1",
      "\u660E\u5E74\u95FA\u4E2D\u77E5\u6709\u8C01",
      "\u4E09\u6708\u9999\u5DE2\u5DF2\u5792\u6210",
      "\u6881\u95F4\u71D5\u5B50\u592A\u65E0\u60C5",
      "\u660E\u5E74\u82B1\u53D1\u867D\u53EF\u5544",
      "\u5374\u4E0D\u9053\u4EBA\u53BB\u6881\u7A7A\u5DE2\u4E5F\u503E",
      "\u4E00\u5E74\u4E09\u767E\u516D\u5341\u65E5",
      "\u98CE\u5200\u971C\u5251\u4E25\u76F8\u903C",
      "\u660E\u5A9A\u9C9C\u598D\u80FD\u51E0\u65F6",
      "\u4E00\u671D\u98D8\u6CCA\u96BE\u5BFB\u89C5",
      "\u82B1\u5F00\u6613\u89C1\u843D\u96BE\u5BFB",
      "\u9636\u524D\u95F7\u6740\u846C\u82B1\u4EBA",
      "\u72EC\u501A\u82B1\u9504\u6CEA\u6697\u6D12",
      "\u6D12\u4E0A\u7A7A\u679D\u89C1\u8840\u75D5",
      "\u675C\u9E43\u65E0\u8BED\u6B63\u9EC4\u660F",
      "\u8377\u9504\u5F52\u53BB\u63A9\u91CD\u95E8",
      "\u9752\u706F\u7167\u58C1\u4EBA\u521D\u7761",
      "\u51B7\u96E8\u6572\u7A97\u88AB\u672A\u6E29",
      "\u602A\u4FAC\u5E95\u4E8B\u500D\u4F24\u795E",
      "\u534A\u4E3A\u601C\u6625\u534A\u607C\u6625",
      "\u601C\u6625\u5FFD\u81F3\u607C\u5FFD\u53BB",
      "\u81F3\u53C8\u65E0\u8A00\u53BB\u4E0D\u95FB",
      "\u6628\u5BB5\u5EAD\u5916\u60B2\u6B4C\u53D1",
      "\u77E5\u662F\u82B1\u9B42\u4E0E\u9E1F\u9B42",
      "\u82B1\u9B42\u9E1F\u9B42\u603B\u96BE\u7559",
      "\u9E1F\u81EA\u65E0\u8A00\u82B1\u81EA\u7F9E",
      "\u613F\u4FAC\u80C1\u4E0B\u751F\u53CC\u7FFC",
      "\u968F\u82B1\u98DE\u5230\u5929\u5C3D\u5934",
      "\u5929\u5C3D\u5934",
      "\u4F55\u5904\u6709\u9999\u4E18",
      "\u672A\u82E5\u9526\u56CA\u6536\u8273\u9AA8",
      "\u4E00\u6294\u51C0\u571F\u63A9\u98CE\u6D41",
      "\u8D28\u672C\u6D01\u6765\u8FD8\u6D01\u53BB",
      "\u5F3A\u4E8E\u6C61\u6DD6\u9677\u6E20\u6C9F",
      "\u5C14\u4ECA\u6B7B\u53BB\u4FAC\u6536\u846C",
      "\u672A\u535C\u4FAC\u8EAB\u4F55\u65E5\u4E27",
      "\u4FAC\u4ECA\u846C\u82B1\u4EBA\u7B11\u75F4",
      "\u4ED6\u5E74\u846C\u4FAC\u77E5\u662F\u8C01",
      "\u8BD5\u770B\u6625\u6B8B\u82B1\u6E10\u843D",
      "\u4FBF\u662F\u7EA2\u989C\u8001\u6B7B\u65F6",
      "\u4E00\u671D\u6625\u5C3D\u7EA2\u989C\u8001",
      "\u82B1\u843D\u4EBA\u4EA1\u4E24\u4E0D\u77E5"
    ],
    context: "\u56DB\u6708\u4E8C\u5341\u516D\u65E5\u8292\u79CD\u8282\uFF0C\u9EDB\u7389\u5728\u82B1\u56ED\u4E2D\u611F\u6000\u843D\u82B1\uFF0C\u4E00\u9762\u541F\u5531\u4E00\u9762\u63A9\u57CB\u3002\u5B9D\u7389\u9694\u5C71\u542C\u5230\uFF0C\u4E0D\u89C9\u6078\u5012\u3002"
  },
  {
    id: "qiuchuang",
    kind: "poem",
    title: "\u79CB\u7A97\u98CE\u96E8\u5915",
    author: "\u6797\u9EDB\u7389",
    chapter: 45,
    lines: [
      "\u79CB\u82B1\u60E8\u6DE1\u79CB\u8349\u9EC4",
      "\u803F\u803F\u79CB\u706F\u79CB\u591C\u957F",
      "\u5DF2\u89C9\u79CB\u7A97\u79CB\u4E0D\u5C3D",
      "\u90A3\u582A\u98CE\u96E8\u52A9\u51C4\u51C9",
      "\u52A9\u79CB\u98CE\u96E8\u6765\u4F55\u901F",
      "\u60CA\u7834\u79CB\u7A97\u79CB\u68A6\u7EFF",
      "\u62B1\u5F97\u79CB\u60C5\u4E0D\u5FCD\u7720",
      "\u81EA\u5411\u79CB\u5C4F\u79FB\u6CEA\u70DB",
      "\u6CEA\u70DB\u6447\u6447\u7207\u77ED\u6AA0",
      "\u7275\u6101\u7167\u6068\u52A8\u79BB\u60C5",
      "\u8C01\u5BB6\u79CB\u9662\u65E0\u98CE\u5165",
      "\u4F55\u5904\u79CB\u7A97\u65E0\u96E8\u58F0",
      "\u7F57\u887E\u4E0D\u5948\u79CB\u98CE\u529B",
      "\u6B8B\u6F0F\u58F0\u50AC\u79CB\u96E8\u6025",
      "\u8FDE\u5BB5\u8109\u8109\u590D\u98D5\u98D5",
      "\u706F\u524D\u4F3C\u4F34\u79BB\u4EBA\u6CE3",
      "\u5BD2\u70DF\u5C0F\u9662\u8F6C\u8427\u6761",
      "\u758F\u7AF9\u865A\u7A97\u65F6\u6EF4\u6CA5",
      "\u4E0D\u77E5\u98CE\u96E8\u51E0\u65F6\u4F11",
      "\u5DF2\u6559\u6CEA\u6D12\u7A97\u7EB1\u6E7F"
    ],
    context: "\u79CB\u9716\u8109\u8109\u7684\u9EC4\u660F\uFF0C\u9EDB\u7389\u5367\u75C5\u6F47\u6E58\u9986\uFF0C\u62DF\u5F20\u82E5\u865A\u300A\u6625\u6C5F\u82B1\u6708\u591C\u300B\u4E4B\u683C\u4F5C\u6B64\uFF0C\u79CB\u7A97\u98CE\u96E8\u5C24\u89C1\u5B64\u6E05\u3002"
  },
  {
    id: "yongju",
    kind: "poem",
    title: "\u548F\u83CA\uFF08\u9EDB\u7389\uFF09",
    author: "\u6797\u9EDB\u7389",
    chapter: 38,
    lines: [
      "\u65E0\u8D56\u8BD7\u9B54\u660F\u6653\u4FB5",
      "\u7ED5\u7BF1\u6B39\u77F3\u81EA\u6C89\u97F3",
      "\u6BEB\u7AEF\u8574\u79C0\u4E34\u971C\u5199",
      "\u53E3\u89D2\u5659\u9999\u5BF9\u6708\u541F",
      "\u6EE1\u7EB8\u81EA\u601C\u9898\u7D20\u6028",
      "\u7247\u8A00\u8C01\u89E3\u8BC9\u79CB\u5FC3",
      "\u4E00\u4ECE\u9676\u4EE4\u5E73\u7AE0\u540E",
      "\u5343\u53E4\u9AD8\u98CE\u8BF4\u5230\u4ECA"
    ],
    context: "\u83CA\u82B1\u8BD7\u793E\u4E2D\uFF0C\u9EDB\u7389\u300A\u548F\u83CA\u300B\u300A\u95EE\u83CA\u300B\u300A\u83CA\u68A6\u300B\u8FDE\u4E2D\u4E09\u9996\uFF0C\u540D\u5217\u7B2C\u4E00\uFF0C\u4F17\u4EBA\u8D5E\u5176\u201C\u98CE\u6D41\u522B\u81F4\u201D\u3002"
  },
  {
    id: "wenju",
    kind: "poem",
    title: "\u95EE\u83CA\uFF08\u9EDB\u7389\uFF09",
    author: "\u6797\u9EDB\u7389",
    chapter: 38,
    lines: [
      "\u6B32\u8BAF\u79CB\u60C5\u4F17\u83AB\u77E5",
      "\u5583\u5583\u8D1F\u624B\u53E9\u4E1C\u7BF1",
      "\u5B64\u6807\u50B2\u4E16\u5055\u8C01\u9690",
      "\u4E00\u6837\u82B1\u5F00\u4E3A\u5E95\u8FDF",
      "\u5703\u9732\u5EAD\u971C\u4F55\u5BC2\u5BDE",
      "\u9E3F\u5F52\u86E9\u75C5\u53EF\u76F8\u601D",
      "\u4F11\u8A00\u4E3E\u4E16\u65E0\u8C08\u8005",
      "\u89E3\u8BED\u4F55\u59A8\u7247\u8BED\u65F6"
    ],
    context: "\u300A\u95EE\u83CA\u300B\u4EE5\u8BBE\u95EE\u5199\u83CA\u4E4B\u5B64\u9AD8\uFF0C\u4E5F\u95EE\u51FA\u4E86\u9EDB\u7389\u81EA\u5DF1\u7684\u5FC3\u4E8B\u3002"
  },
  {
    id: "yiju",
    kind: "poem",
    title: "\u5FC6\u83CA\uFF08\u5B9D\u9497\uFF09",
    author: "\u859B\u5B9D\u9497",
    chapter: 38,
    lines: [
      "\u6005\u671B\u897F\u98CE\u62B1\u95F7\u601D",
      "\u84FC\u7EA2\u82C7\u767D\u65AD\u80A0\u65F6",
      "\u7A7A\u7BF1\u65E7\u5703\u79CB\u65E0\u8FF9",
      "\u7626\u6708\u6E05\u971C\u68A6\u6709\u77E5",
      "\u5FF5\u5FF5\u5FC3\u968F\u5F52\u96C1\u8FDC",
      "\u5BE5\u5BE5\u5750\u542C\u665A\u7827\u75F4",
      "\u8C01\u601C\u6211\u4E3A\u9EC4\u82B1\u75C5",
      "\u6170\u8BED\u91CD\u9633\u4F1A\u6709\u671F"
    ],
    context: "\u5B9D\u9497\u300A\u5FC6\u83CA\u300B\u88AB\u674E\u7EA8\u8BC4\u4E3A\u201C\u542B\u84C4\u6D51\u539A\u201D\uFF0C\u662F\u83CA\u82B1\u8BD7\u4E2D\u7684\u4E0A\u54C1\u3002"
  },
  {
    id: "pangxie",
    kind: "poem",
    title: "\u8783\u87F9\u548F\uFF08\u5B9D\u9497\uFF09",
    author: "\u859B\u5B9D\u9497",
    chapter: 38,
    lines: [
      "\u6842\u972D\u6850\u9634\u5750\u4E3E\u89DE",
      "\u957F\u5B89\u6D8E\u53E3\u76FC\u91CD\u9633",
      "\u773C\u524D\u9053\u8DEF\u65E0\u7ECF\u7EAC",
      "\u76AE\u91CC\u6625\u79CB\u7A7A\u9ED1\u9EC4",
      "\u9152\u672A\u654C\u8165\u8FD8\u7528\u83CA",
      "\u6027\u9632\u79EF\u51B7\u5B9A\u987B\u59DC",
      "\u4E8E\u4ECA\u843D\u91DC\u6210\u4F55\u76CA",
      "\u6708\u6D66\u7A7A\u4F59\u79BE\u9ECD\u9999"
    ],
    context: "\u85D5\u9999\u69AD\u8BBE\u8783\u87F9\u5BB4\uFF0C\u4F17\u4EBA\u5403\u87F9\u8D4B\u8BD7\u3002\u5B9D\u9497\u8FD9\u9996\u8BD7\u501F\u87F9\u8BBD\u4E16\uFF0C\u88AB\u4F17\u4EBA\u8A89\u4E3A\u201C\u98DF\u8783\u87F9\u7684\u7EDD\u5531\u201D\u3002"
  },
  {
    id: "taohua",
    kind: "poem",
    title: "\u6843\u82B1\u884C",
    author: "\u6797\u9EDB\u7389",
    chapter: 70,
    lines: [
      "\u6843\u82B1\u5E18\u5916\u4E1C\u98CE\u8F6F",
      "\u6843\u82B1\u5E18\u5185\u6668\u5986\u61D2",
      "\u5E18\u5916\u6843\u82B1\u5E18\u5185\u4EBA",
      "\u4EBA\u4E0E\u6843\u82B1\u9694\u4E0D\u8FDC",
      "\u4E1C\u98CE\u6709\u610F\u63ED\u5E18\u680A",
      "\u82B1\u6B32\u7AA5\u4EBA\u5E18\u4E0D\u5377",
      "\u6843\u82B1\u5E18\u5916\u5F00\u4ECD\u65E7",
      "\u5E18\u4E2D\u4EBA\u6BD4\u6843\u82B1\u7626",
      "\u82B1\u89E3\u601C\u4EBA\u82B1\u4E5F\u6101",
      "\u9694\u5E18\u6D88\u606F\u98CE\u5439\u900F",
      "\u98CE\u900F\u6E58\u5E18\u82B1\u6EE1\u5EAD",
      "\u5EAD\u524D\u6625\u8272\u500D\u4F24\u60C5",
      "\u95F2\u82D4\u9662\u843D\u95E8\u7A7A\u63A9",
      "\u659C\u65E5\u680F\u6746\u4EBA\u81EA\u51ED",
      "\u51ED\u680F\u4EBA\u5411\u4E1C\u98CE\u6CE3",
      "\u831C\u88D9\u5077\u508D\u6843\u82B1\u7ACB",
      "\u6843\u82B1\u6843\u53F6\u4E71\u7EB7\u7EB7",
      "\u82B1\u7EFD\u65B0\u7EA2\u53F6\u51DD\u78A7",
      "\u96FE\u88F9\u70DF\u5C01\u4E00\u4E07\u682A",
      "\u70D8\u697C\u7167\u58C1\u7EA2\u6A21\u7CCA",
      "\u5929\u673A\u70E7\u7834\u9E33\u9E2F\u9526",
      "\u6625\u9163\u6B32\u9192\u79FB\u73CA\u6795",
      "\u4F8D\u5973\u91D1\u76C6\u8FDB\u6C34\u6765",
      "\u9999\u6CC9\u5F71\u8638\u80ED\u8102\u51B7",
      "\u80ED\u8102\u9C9C\u8273\u4F55\u76F8\u7C7B",
      "\u82B1\u4E4B\u989C\u8272\u4EBA\u4E4B\u6CEA",
      "\u82E5\u5C06\u4EBA\u6CEA\u6BD4\u6843\u82B1",
      "\u6CEA\u81EA\u957F\u6D41\u82B1\u81EA\u5A9A",
      "\u6CEA\u773C\u89C2\u82B1\u6CEA\u6613\u5E72",
      "\u6CEA\u5E72\u6625\u5C3D\u82B1\u6194\u60B4",
      "\u6194\u60B4\u82B1\u906E\u6194\u60B4\u4EBA",
      "\u82B1\u98DE\u4EBA\u5026\u6613\u9EC4\u660F",
      "\u4E00\u58F0\u675C\u5B87\u6625\u5F52\u5C3D",
      "\u5BC2\u5BDE\u5E18\u680A\u7A7A\u6708\u75D5"
    ],
    context: "\u66AE\u6625\u65F6\u8282\uFF0C\u5B9D\u7389\u5728\u6C81\u82B3\u6865\u4E0A\u770B\u5230\u9EDB\u7389\u8FD9\u9996\u300A\u6843\u82B1\u884C\u300B\uFF0C\u53EA\u89C9\u201C\u54C0\u97F3\u51C4\u5A49\u201D\uFF0C\u4E0D\u7528\u770B\u7F72\u540D\u4FBF\u77E5\u662F\u5979\u6240\u4F5C\u3002"
  },
  {
    id: "liuxu-baochai",
    kind: "poem",
    title: "\u4E34\u6C5F\u4ED9\xB7\u67F3\u7D6E\uFF08\u5B9D\u9497\uFF09",
    author: "\u859B\u5B9D\u9497",
    chapter: 70,
    lines: [
      "\u767D\u7389\u5802\u524D\u6625\u89E3\u821E",
      "\u4E1C\u98CE\u5377\u5F97\u5747\u5300",
      "\u8702\u56E2\u8776\u9635\u4E71\u7EB7\u7EB7",
      "\u51E0\u66FE\u968F\u901D\u6C34",
      "\u5C82\u5FC5\u59D4\u82B3\u5C18",
      "\u4E07\u7F15\u5343\u4E1D\u7EC8\u4E0D\u6539",
      "\u4EFB\u4ED6\u968F\u805A\u968F\u5206",
      "\u97F6\u534E\u4F11\u7B11\u672C\u65E0\u6839",
      "\u597D\u98CE\u51ED\u501F\u529B",
      "\u9001\u6211\u4E0A\u9752\u4E91"
    ],
    context: "\u53F2\u6E58\u4E91\u8D77\u793E\u586B\u67F3\u7D6E\u8BCD\uFF0C\u5B9D\u9497\u8FD9\u9996\u7ACB\u610F\u7FFB\u65B0\uFF0C\u501F\u67F3\u7D6E\u8A00\u5FD7\uFF0C\u4F17\u4EBA\u79F0\u5176\u201C\u72EC\u6709\u5174\u81F4\u201D\u3002"
  },
  {
    id: "liuxu-daiyu",
    kind: "poem",
    title: "\u5510\u591A\u4EE4\xB7\u67F3\u7D6E\uFF08\u9EDB\u7389\uFF09",
    author: "\u6797\u9EDB\u7389",
    chapter: 70,
    lines: [
      "\u7C89\u5815\u767E\u82B1\u6D32",
      "\u9999\u6B8B\u71D5\u5B50\u697C",
      "\u4E00\u56E2\u56E2\u9010\u5BF9\u6210\u6BEC",
      "\u98D8\u6CCA\u4EA6\u5982\u4EBA\u547D\u8584",
      "\u7A7A\u7F31\u7EFB",
      "\u8BF4\u98CE\u6D41",
      "\u8349\u6728\u4E5F\u77E5\u6101",
      "\u97F6\u534E\u7ADF\u767D\u5934",
      "\u53F9\u4ECA\u751F\u8C01\u820D\u8C01\u6536",
      "\u5AC1\u4E0E\u4E1C\u98CE\u6625\u4E0D\u7BA1",
      "\u51ED\u5C14\u53BB",
      "\u5FCD\u6DF9\u7559"
    ],
    context: "\u540C\u9898\u586B\u8BCD\uFF0C\u9EDB\u7389\u4EE5\u67F3\u7D6E\u81EA\u51B5\u6F02\u6CCA\u98D8\u96F6\uFF0C\u4F17\u4EBA\u53F9\u5176\u592A\u4F5C\u60B2\u97F3\u3002"
  },
  {
    id: "hongmei",
    kind: "poem",
    title: "\u548F\u7EA2\u6885\u82B1\uFF08\u5B9D\u7434\uFF09",
    author: "\u859B\u5B9D\u7434",
    chapter: 50,
    lines: [
      "\u758F\u662F\u679D\u6761\u8273\u662F\u82B1",
      "\u6625\u5986\u513F\u5973\u7ADE\u5962\u534E",
      "\u95F2\u5EAD\u66F2\u69DB\u65E0\u4F59\u96EA",
      "\u6D41\u6C34\u7A7A\u5C71\u6709\u843D\u971E",
      "\u5E7D\u68A6\u51B7\u968F\u7EA2\u8896\u7B1B",
      "\u6E38\u4ED9\u9999\u6CDB\u7EDB\u6CB3\u69CE",
      "\u524D\u8EAB\u5B9A\u662F\u7476\u53F0\u79CD",
      "\u65E0\u590D\u76F8\u7591\u8272\u76F8\u5DEE"
    ],
    context: "\u82A6\u96EA\u5EB5\u8054\u53E5\u4E4B\u540E\uFF0C\u4F17\u4EBA\u53C8\u5373\u666F\u8D4B\u7EA2\u6885\uFF0C\u859B\u5B9D\u7434\u8FD9\u9996\u88AB\u79F0\u201C\u8FD9\u4E00\u9996\u6700\u597D\u201D\u3002"
  },
  /* ———— 食饮 ———— */
  {
    id: "qiexiang",
    kind: "food",
    title: "\u8304\u9C9E",
    author: "",
    chapter: 41,
    lines: [
      "\u7528\u4E86\u5341\u51E0\u53EA\u9E21\u6765\u914D\u5B83\uFF0C\u628A\u8304\u5B50\u5207\u6210\u788E\u9489\u5B50\uFF0C\u7528\u9E21\u6CB9\u70B8\u4E86\uFF0C\u518D\u7528\u9E21\u812F\u5B50\u8089\u5E76\u9999\u83CC\u3001\u65B0\u7B0B\u3001\u8611\u83C7\u3001\u4E94\u9999\u8150\u5E72\u3001\u5404\u8272\u5E72\u679C\u5B50\uFF0C\u4FF1\u5207\u6210\u9489\u5B50\uFF0C\u7528\u9E21\u6C64\u7168\u5E72\uFF0C\u5C06\u9999\u6CB9\u4E00\u6536\uFF0C\u5916\u52A0\u7CDF\u6CB9\u4E00\u62CC\uFF0C\u76DB\u5728\u74F7\u7F50\u5B50\u91CC\u5C01\u4E25\u3002",
      "\u5218\u59E5\u59E5\u542C\u4E86\u6447\u5934\u5410\u820C\uFF1A\u201C\u6211\u7684\u4F5B\u7956\uFF01\u5012\u5F97\u5341\u6765\u53EA\u9E21\u6765\u914D\u5B83\uFF0C\u602A\u9053\u8FD9\u4E2A\u5473\u513F\u3002\u201D"
    ],
    context: "\u8D3E\u6BCD\u5728\u5BB4\u4E0A\u8BA9\u51E4\u59D0\u5939\u7ED9\u5218\u59E5\u59E5\uFF0C\u8BF4\u51FA\u8FD9\u5473\u201C\u9E21\u201D\u7684\u8304\u9C9E\u7684\u505A\u6CD5\uFF0C\u662F\u7EA2\u697C\u5BB4\u4E2D\u6700\u8D1F\u76DB\u540D\u7684\u4E00\u9053\u3002"
  },
  {
    id: "crab",
    kind: "food",
    title: "\u8783\u87F9\u5BB4",
    author: "",
    chapter: 38,
    lines: [
      "\u85D5\u9999\u69AD\u91CC\u6446\u5F00\u8783\u87F9\u5BB4\uFF0C\u4F17\u4EBA\u5E2D\u95F4\u5265\u87F9\u996E\u9152\uFF0C\u53C8\u4F5C\u4E86\u548F\u87F9\u8BD7\u3002",
      "\u51E4\u59D0\u5429\u5490\uFF1A\u201C\u591A\u8005\u5403\u5B8C\u4E86\u518D\u6DFB\u3002\u201D\u53C8\u547D\u628A\u9152\u70EB\u5F97\u6EDA\u70ED\u7684\u6765\u3002"
    ],
    context: "\u53F2\u6E58\u4E91\u8FD8\u5E2D\uFF0C\u5728\u85D5\u9999\u69AD\u8BBE\u8783\u87F9\u5BB4\u3002\u4E0D\u4F46\u5403\u51FA\u70ED\u95F9\uFF0C\u4E5F\u5403\u51FA\u51E4\u59D0\u7684\u673A\u654F\u4E0E\u4F17\u4EBA\u5404\u5F02\u7684\u6027\u60C5\u3002"
  },
  {
    id: "sulao",
    kind: "food",
    title: "\u7CD6\u84B8\u9165\u916A",
    author: "",
    chapter: 19,
    lines: [
      "\u8D3E\u5983\u8D50\u51FA\u7CD6\u84B8\u9165\u916A\uFF0C\u5B9D\u7389\u820D\u4E0D\u5F97\u5403\uFF0C\u7559\u7ED9\u88AD\u4EBA\u3002",
      "\u674E\u5B37\u5B37\u89C1\u76D6\u7740\u662F\u9165\u916A\uFF0C\u62FF\u5319\u4FBF\u5403\uFF1A\u201C\u6211\u4E0D\u4FE1\u4ED6\u8FD9\u6837\u574F\u4E86\u3002\u201D"
    ],
    context: "\u4E00\u7897\u9165\u916A\u7275\u51FA\u4E3B\u4EC6\u4E0E\u5976\u5988\u4E4B\u95F4\u7684\u7EC6\u5C0F\u5FC3\u601D\uFF0C\u4E5F\u89C1\u5B9D\u7389\u5F85\u88AD\u4EBA\u7684\u4F53\u8D34\u3002"
  },
  {
    id: "sunsun",
    kind: "food",
    title: "\u9178\u7B0B\u9E21\u76AE\u6C64",
    author: "",
    chapter: 8,
    lines: ["\u859B\u59E8\u5988\u4F5C\u4E86\u9178\u7B0B\u9E21\u76AE\u6C64\uFF0C\u5B9D\u7389\u75DB\u559D\u4E86\u4E24\u7897\uFF0C\u53C8\u5403\u4E86\u534A\u7897\u78A7\u7CB3\u7CA5\u3002"],
    context: "\u5B9D\u7389\u5230\u68A8\u9999\u9662\u63A2\u671B\u5B9D\u9497\uFF0C\u5728\u859B\u59E8\u5988\u5904\u5403\u7684\u8FD9\u7897\u9192\u9152\u5F00\u80C3\u7684\u6C64\uFF0C\u5199\u5F97\u6781\u6709\u5BB6\u5E38\u70DF\u706B\u6C14\u3002"
  },
  {
    id: "lianye",
    kind: "food",
    title: "\u83B2\u53F6\u7FB9 \xB7 \u8377\u53F6\u83B2\u84EC\u6C64",
    author: "",
    chapter: 35,
    lines: [
      "\u7528\u94F6\u6A21\u5B50\u5370\u51FA\u83B2\u53F6\u3001\u83B2\u84EC\u3001\u83F1\u89D2\u7B49\u82B1\u6837\u7684\u5C0F\u9762\uFF0C\u914D\u4E86\u65B0\u8377\u53F6\u71AC\u6C64\u3002",
      "\u51E4\u59D0\u8BF4\u201C\u53E3\u5473\u4E0D\u7B97\u9AD8\u8D35\uFF0C\u53EA\u662F\u592A\u78E8\u7259\u4E86\u201D\uFF0C\u4E00\u5323\u5B50\u7CBE\u5DE7\u7684\u94F6\u6A21\u5F15\u5F97\u7389\u948F\u513F\u4E5F\u51D1\u6765\u770B\u3002"
    ],
    context: "\u5B9D\u7389\u6328\u6253\u540E\u60F3\u559D\u6B64\u6C64\uFF0C\u738B\u592B\u4EBA\u8BA9\u51E4\u59D0\u505A\u4E86\u3002\u4E00\u4EFD\u5BB6\u5E38\u6C64\u6C34\uFF0C\u5199\u51FA\u8D3E\u5E9C\u751F\u6D3B\u7684\u8003\u7A76\u3002"
  },
  {
    id: "ougeng",
    kind: "food",
    title: "\u85D5\u7C89\u6842\u82B1\u7CD6\u7CD5",
    author: "",
    chapter: 41,
    lines: [
      "\u4F8D\u5949\u7684\u5A46\u5B50\u6367\u6765\u4E24\u76D2\u70B9\u5FC3\uFF0C\u63ED\u5F00\u4E00\u770B\uFF0C\u662F\u85D5\u7C89\u6842\u82B1\u7CD6\u7CD5\u548C\u677E\u74E4\u9E45\u6CB9\u5377\u3002",
      "\u8D3E\u6BCD\u62E3\u4E86\u6842\u82B1\u7CD6\u7CD5\uFF0C\u53C8\u8BA9\u5218\u59E5\u59E5\u5C1D\u5C1D\u8FD9\u201C\u6CA1\u5403\u8FC7\u7684\u4E1C\u897F\u201D\u3002"
    ],
    context: "\u6E38\u56ED\u5230\u7F00\u9526\u9601\u7528\u70B9\u5FC3\uFF0C\u8FD9\u5473\u751C\u7CD5\u662F\u7EA2\u697C\u70B9\u5FC3\u91CC\u7684\u6E05\u96C5\u4EE3\u8868\u3002"
  },
  {
    id: "yanwo",
    kind: "food",
    title: "\u71D5\u7A9D",
    author: "",
    chapter: 45,
    lines: [
      "\u5B9D\u9497\u89C1\u9EDB\u7389\u53C8\u54B3\uFF0C\u8BF4\u201C\u6BCF\u65E5\u65E9\u8D77\u62FF\u4E0A\u7B49\u71D5\u7A9D\u4E00\u4E24\uFF0C\u51B0\u7CD6\u4E94\u94B1\uFF0C\u7528\u94F6\u94EB\u5B50\u71AC\u51FA\u7CA5\u6765\u5403\uFF0C\u6BD4\u836F\u8FD8\u5F3A\u201D\u3002",
      "\u5F53\u591C\u4FBF\u547D\u5A46\u5B50\u9001\u6765\u4E00\u5927\u5305\u4E0A\u7B49\u71D5\u7A9D\uFF0C\u8FD8\u6709\u4E00\u5305\u6D01\u7C89\u6885\u7247\u96EA\u82B1\u6D0B\u7CD6\u3002"
    ],
    context: "\u6F47\u6E58\u9986\u7684\u6DF1\u591C\uFF0C\u4E00\u76C5\u71D5\u7A9D\u4E0D\u53EA\u517B\u75C5\uFF0C\u4E5F\u5199\u5C3D\u9497\u9EDB\u4E4B\u95F4\u4ECE\u9694\u9602\u5230\u76F8\u77E5\u7684\u60C5\u5206\u3002"
  },
  {
    id: "yanzhimi",
    kind: "food",
    title: "\u5FA1\u7530\u80ED\u8102\u7C73",
    author: "",
    chapter: 53,
    lines: [
      "\u9ED1\u5C71\u6751\u7684\u4E4C\u5E84\u5934\u4EA4\u79DF\uFF0C\u5355\u5B50\u4E0A\u5199\u7740\u201C\u5FA1\u7530\u80ED\u8102\u7C73\u4E8C\u77F3\u201D\u3002",
      "\u8D3E\u6BCD\u7B49\u5403\u7684\u7EA2\u7A3B\u7C73\u7CA5\uFF0C\u5C31\u662F\u8FD9\u80ED\u8102\u7C73\u71AC\u7684\u3002"
    ],
    context: "\u5E74\u4E0B\u8FDB\u79DF\u7684\u5355\u5B50\u4E00\u5F00\uFF0C\u8D3E\u5E9C\u7531\u76DB\u800C\u8870\u7684\u5BB6\u5E95\u4E5F\u987A\u7740\u8FD9\u51E0\u77F3\u7C73\u663E\u4E86\u51FA\u6765\u3002"
  },
  {
    id: "xingrencha",
    kind: "food",
    title: "\u674F\u4EC1\u8336",
    author: "",
    chapter: 54,
    lines: [
      "\u5143\u5BB5\u591C\u5BB4\u540E\uFF0C\u8D3E\u6BCD\u89C9\u5F97\u997F\u4E86\uFF0C\u51E4\u59D0\u5FD9\u8BF4\u201C\u6709\u9884\u5907\u7684\u9E2D\u5B50\u8089\u7CA5\u201D\uFF0C\u8D3E\u6BCD\u5374\u5ACC\u6CB9\u817B\uFF0C\u6700\u540E\u4E0A\u4E86\u674F\u4EC1\u8336\u3002"
    ],
    context: "\u8363\u5E9C\u591C\u5BB4\u7684\u5C3E\u58F0\uFF0C\u4E00\u7897\u6E05\u6DE1\u7684\u674F\u4EC1\u8336\u6620\u51FA\u8D3E\u6BCD\u517B\u5C0A\u5904\u4F18\u7684\u80C3\u53E3\u4E0E\u5206\u5BF8\u3002"
  },
  {
    id: "meiguilu",
    kind: "food",
    title: "\u73AB\u7470\u9732\u4E0E\u832F\u82D3\u971C",
    author: "",
    chapter: 60,
    lines: [
      "\u738B\u592B\u4EBA\u62FF\u4E86\u4E24\u74F6\u73AB\u7470\u9732\u7ED9\u5B9D\u7389\uFF0C\u53C8\u6709\u4E2A\u5C0F\u4E2B\u5934\u9001\u6765\u4E00\u5305\u832F\u82D3\u971C\u3002",
      "\u8FD9\u201C\u4E0A\u7528\u7684\u201D\u4E1C\u897F\u62DB\u6765\u53A8\u623F\u91CC\u7684\u98CE\u6CE2\uFF0C\u4E5F\u7275\u51FA\u8D75\u59E8\u5A18\u4E00\u623F\u7684\u6697\u6D41\u3002"
    ],
    context: "\u73AB\u7470\u9732\u3001\u832F\u82D3\u971C\u672C\u662F\u5BFB\u5E38\u8865\u54C1\uFF0C\u5374\u56E0\u4E0B\u4EBA\u95F4\u7684\u4E89\u5BA0\u751F\u51FA\u4E00\u573A\u662F\u975E\u3002"
  },
  /* ———— 药方 ———— */
  {
    id: "lengxiang",
    kind: "medicine",
    title: "\u51B7\u9999\u4E38",
    author: "",
    chapter: 7,
    lines: [
      "\u6625\u5929\u5F00\u7684\u767D\u7261\u4E39\u82B1\u854A\u3001\u590F\u5929\u5F00\u7684\u767D\u8377\u82B1\u3001\u79CB\u5929\u5F00\u7684\u767D\u8299\u84C9\u3001\u51AC\u5929\u5F00\u7684\u767D\u6885\u82B1\u854A\uFF0C\u4E8E\u6625\u5206\u65E5\u6652\u5E72\u3002",
      "\u518D\u7528\u96E8\u6C34\u8FD9\u65E5\u7684\u96E8\u3001\u767D\u9732\u8FD9\u65E5\u7684\u9732\u3001\u971C\u964D\u8FD9\u65E5\u7684\u971C\u3001\u5C0F\u96EA\u8FD9\u65E5\u7684\u96EA\uFF0C\u56DB\u6837\u6C34\u8C03\u5300\uFF0C\u548C\u4E86\u836F\uFF0C\u518D\u52A0\u5341\u4E8C\u94B1\u8702\u871C\u3001\u5341\u4E8C\u94B1\u767D\u7CD6\uFF0C\u56E2\u6210\u9F99\u773C\u5927\u7684\u4E38\u5B50\uFF0C\u76DB\u5728\u65E7\u78C1\u575B\u5185\uFF0C\u57CB\u5728\u82B1\u6839\u5E95\u4E0B\u3002",
      "\u53D1\u75C5\u65F6\u5403\u4E00\u4E38\uFF0C\u7528\u5341\u4E8C\u5206\u9EC4\u67CF\u714E\u6C64\u9001\u4E0B\u3002"
    ],
    context: "\u5B9D\u9497\u4ECE\u80CE\u91CC\u5E26\u6765\u7684\u4E00\u80A1\u70ED\u6BD2\uFF0C\u9760\u8FD9\u201C\u53EF\u5DE7\u201D\u5F97\u9F50\u4E86\u56DB\u65F6\u82B1\u854A\u4E0E\u96E8\u9732\u971C\u96EA\u7684\u5947\u65B9\u5E73\u590D\uFF0C\u4E5F\u6697\u5408\u5979\u5904\u4E16\u7684\u5468\u5168\u3002"
  },
  {
    id: "renshenyangrong",
    kind: "medicine",
    title: "\u4EBA\u53C2\u517B\u8363\u4E38",
    author: "",
    chapter: 3,
    lines: ["\u9EDB\u7389\u5E38\u670D\u4EBA\u53C2\u517B\u8363\u4E38\uFF0C\u6797\u5982\u6D77\u5728\u65F6\uFF0C\u539F\u8BF4\u201C\u8BF7\u591A\u5C11\u592A\u533B\uFF0C\u4E5F\u53EA\u597D\u5C06\u517B\u7740\u201D\u3002"],
    context: "\u9EDB\u7389\u8FDB\u8D3E\u5E9C\uFF0C\u4F17\u4EBA\u89C1\u5979\u8EAB\u5B50\u602F\u5F31\uFF0C\u95EE\u8D77\u5E38\u5403\u4EC0\u4E48\u836F\uFF0C\u5979\u7B54\u4FBF\u670D\u4EBA\u53C2\u517B\u8363\u4E38\u3002"
  },
  {
    id: "yiqi",
    kind: "medicine",
    title: "\u76CA\u6C14\u517B\u8363\u8865\u813E\u548C\u809D\u6C64",
    author: "",
    chapter: 10,
    lines: [
      "\u5F20\u53CB\u58EB\u4E3A\u79E6\u53EF\u537F\u5F00\u65B9\uFF1A\u4EBA\u53C2\u3001\u767D\u672F\u3001\u4E91\u82D3\u3001\u719F\u5730\u3001\u5F52\u8EAB\u3001\u767D\u828D\u3001\u5DDD\u828E\u3001\u9EC4\u82AA\u3001\u9999\u9644\u7C73\u3001\u918B\u67F4\u80E1\u3001\u6000\u5C71\u836F\u3001\u771F\u963F\u80F6\u3001\u5EF6\u80E1\u7D22\u3001\u7099\u7518\u8349\uFF0C\u5F15\u7528\u5EFA\u83B2\u5B50\u4E03\u7C92\u3001\u53BB\u5FC3\u7EA2\u67A3\u4E8C\u679A\u3002",
      "\u5E76\u8BF4\u8FD9\u75C5\u201C\u7B97\u5F97\u4E2A\u7F13\u75C7\u201D\uFF0C\u53EA\u7BA1\u201C\u5B89\u5FC3\u517B\u75C5\u201D\u3002"
    ],
    context: "\u8FD9\u662F\u5168\u4E66\u5199\u5F97\u6700\u5B8C\u6574\u7684\u4E00\u5F20\u836F\u65B9\uFF0C\u4E5F\u501F\u79E6\u53EF\u537F\u4E4B\u75C5\u5199\u51FA\u8D3E\u5E9C\u4E3A\u8FD9\u4F4D\u91CD\u75C5\u5AB3\u5987\u7684\u5C3D\u5FC3\u4E0E\u9690\u5FE7\u3002"
  },
  {
    id: "dushen",
    kind: "medicine",
    title: "\u72EC\u53C2\u6C64",
    author: "",
    chapter: 12,
    lines: ["\u8D3E\u745E\u75C5\u91CD\uFF0C\u8981\u5403\u72EC\u53C2\u6C64\u3002\u4EE3\u5112\u53EA\u5F97\u5F80\u8363\u5E9C\u6765\u5BFB\uFF0C\u51E4\u59D0\u5374\u7528\u201C\u6E23\u672B\u6CE1\u987B\u201D\u642A\u585E\u8FC7\u53BB\u3002"],
    context: "\u72EC\u53C2\u6C64\u662F\u6025\u6551\u5143\u6C14\u7684\u4EBA\u53C2\u5927\u8865\u4E4B\u5242\u3002\u51E4\u59D0\u7684\u523B\u8584\u4E0E\u6577\u884D\uFF0C\u4E3A\u8D3E\u745E\u7684\u7ED3\u5C40\u518D\u6DFB\u4E00\u5C42\u51C9\u8584\u3002"
  },
  {
    id: "liaodu",
    kind: "medicine",
    title: "\u7597\u5992\u6C64",
    author: "",
    chapter: 80,
    lines: [
      "\u738B\u4E00\u8D34\u5305\u6CBB\u767E\u75C5\uFF0C\u88AB\u95EE\u6CBB\u201C\u5992\u75C5\u201D\u7684\u65B9\u5B50\uFF0C\u7B11\u9053\uFF1A\u7528\u79CB\u68A8\u4E00\u4E2A\uFF0C\u4E8C\u94B1\u51B0\u7CD6\uFF0C\u4E00\u94B1\u9648\u76AE\uFF0C\u6C34\u4E09\u7897\uFF0C\u68A8\u719F\u4E3A\u5EA6\u3002\u6BCF\u65E5\u6E05\u65E9\u5403\u8FD9\u4E48\u4E00\u4E2A\u68A8\uFF0C\u5403\u6765\u5403\u53BB\u5C31\u597D\u4E86\u3002",
      "\u4ED6\u53C8\u7B11\u8BF4\uFF1A\u201C\u8FD9\u4E09\u5473\u836F\u90FD\u662F\u6DA6\u80BA\u5F00\u80C3\u4E0D\u4F24\u4EBA\u7684\uFF0C\u751C\u4E1D\u4E1D\u7684\uFF0C\u53C8\u6B62\u54B3\u55FD\uFF0C\u53C8\u597D\u5403\u3002\u5403\u8FC7\u4E00\u767E\u5C81\uFF0C\u4EBA\u6A2A\u7AD6\u8981\u6B7B\u7684\uFF0C\u6B7B\u4E86\u8FD8\u5992\u4EC0\u4E48\uFF01\u201D"
    ],
    context: "\u300A\u7EA2\u697C\u68A6\u300B\u91CC\u6700\u5999\u7684\u4E00\u5219\u201C\u7B11\u8BDD\u836F\u65B9\u201D\uFF0C\u501F\u9053\u58EB\u738B\u4E00\u8D34\u4E4B\u53E3\uFF0C\u628A\u5992\u75C5\u4E0E\u751F\u6B7B\u770B\u900F\u3002"
  },
  {
    id: "tianwang",
    kind: "medicine",
    title: "\u5929\u738B\u8865\u5FC3\u4E39",
    author: "",
    chapter: 28,
    lines: [
      "\u738B\u592B\u4EBA\u95EE\u9EDB\u7389\u5E38\u5403\u4F55\u836F\uFF0C\u5B9D\u7389\u8BF4\u201C\u6797\u59B9\u59B9\u662F\u5185\u75C7\uFF0C\u5148\u5929\u751F\u7684\u5F31\uFF0C\u6240\u4EE5\u7981\u4E0D\u4F4F\u4E00\u70B9\u98CE\u5BD2\u201D\uFF0C\u968F\u624B\u5199\u4E0B\u4E00\u4E2A\u65B9\u5B50\u3002",
      "\u540E\u6765\u738B\u592B\u4EBA\u53C8\u95EE\uFF0C\u9EDB\u7389\u8BF4\u201C\u4E5F\u4E0D\u8FC7\u662F\u4E9B\u4EBA\u53C2\u3001\u8089\u6842\uFF0C\u6216\u662F\u5929\u738B\u8865\u5FC3\u4E39\u4E4B\u7C7B\u201D\u3002"
    ],
    context: "\u5929\u738B\u8865\u5FC3\u4E39\u662F\u5B89\u795E\u517B\u5FC3\u4E4B\u5242\u3002\u5B9D\u7389\u4E0E\u9EDB\u7389\u56F4\u7ED5\u201C\u5403\u7684\u4EC0\u4E48\u836F\u201D\u7684\u4E00\u95EE\uFF0C\u900F\u51FA\u4ED6\u65F6\u65F6\u6302\u5FF5\u7684\u5FC3\u601D\u3002"
  },
  {
    id: "bazhen",
    kind: "medicine",
    title: "\u516B\u73CD\u76CA\u6BCD\u4E38",
    author: "",
    chapter: 28,
    lines: ["\u738B\u592B\u4EBA\u8BA9\u53BB\u95EE\u592A\u533B\uFF0C\u82E5\u9EDB\u7389\u8FD9\u75C5\u8BE5\u5403\u516B\u73CD\u76CA\u6BCD\u4E38\u5C31\u5F00\u65B9\u5B50\u3002"],
    context: "\u516B\u73CD\u76CA\u6BCD\u4E38\u517B\u8840\u8C03\u7ECF\uFF0C\u662F\u7ED9\u4F53\u5F31\u5973\u7737\u5E38\u5907\u7684\u4E38\u836F\u3002\u4E00\u4E38\u836F\u540D\u4E5F\u89C1\u957F\u8F88\u5BF9\u9EDB\u7389\u7684\u7167\u770B\u3002"
  }
];
var poems = literary.filter((l) => l.kind === "poem");
var foods = literary.filter((l) => l.kind === "food");
var medicines = literary.filter((l) => l.kind === "medicine");

// scripts/poem-image.ts
var MAX_BODY_BYTES = 512;
var WINDOW_MS = 10 * 60 * 1e3;
var MAX_REQUESTS_PER_WINDOW = 6;
var MAX_CONCURRENT_REQUESTS = 2;
var UPSTREAM_TIMEOUT_MS = 5e4;
var rateByAddress = /* @__PURE__ */ new Map();
var activeRequests = 0;
function callerAddress(req) {
  const forwarded = req.headers["x-forwarded-for"];
  const value = Array.isArray(forwarded) ? forwarded[0] : forwarded;
  return value?.split(",")[0]?.trim() || "unknown";
}
function isSameOrigin(req) {
  const origin = req.headers.origin;
  const host = req.headers["x-forwarded-host"] || req.headers.host;
  if (!origin || !host || Array.isArray(origin) || Array.isArray(host)) return false;
  try {
    return new URL(origin).host === host;
  } catch {
    return false;
  }
}
function consumeRateLimit(address, now = Date.now()) {
  if (rateByAddress.size > 5e3) {
    for (const [key, state] of rateByAddress) {
      if (state.resetAt <= now) rateByAddress.delete(key);
    }
  }
  const current = rateByAddress.get(address);
  if (!current || current.resetAt <= now) {
    const next = { count: 1, resetAt: now + WINDOW_MS };
    rateByAddress.set(address, next);
    return next;
  }
  if (current.count >= MAX_REQUESTS_PER_WINDOW) return null;
  current.count += 1;
  return current;
}
async function handler(req, res) {
  res.setHeader("Cache-Control", "no-store");
  res.setHeader("X-Content-Type-Options", "nosniff");
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    return res.status(405).json({ error: "method_not_allowed" });
  }
  if (!isSameOrigin(req)) return res.status(403).json({ error: "invalid_origin" });
  const contentLength = Number(req.headers["content-length"] ?? 0);
  if (!Number.isFinite(contentLength) || contentLength > MAX_BODY_BYTES) {
    return res.status(413).json({ error: "request_too_large" });
  }
  const poemId = typeof req.body?.poemId === "string" ? req.body.poemId : "";
  const seed = Number(req.body?.seed);
  const poem = literary.find((entry) => entry.kind === "poem" && entry.id === poemId);
  if (!poem || !Number.isSafeInteger(seed) || seed < 0 || seed > 2e9) {
    return res.status(400).json({ error: "invalid_request" });
  }
  const rate = consumeRateLimit(callerAddress(req));
  if (!rate) {
    res.setHeader("Retry-After", String(Math.ceil(WINDOW_MS / 1e3)));
    return res.status(429).json({ error: "rate_limited" });
  }
  res.setHeader("X-RateLimit-Remaining", String(MAX_REQUESTS_PER_WINDOW - rate.count));
  if (activeRequests >= MAX_CONCURRENT_REQUESTS) {
    res.setHeader("Retry-After", "10");
    return res.status(429).json({ error: "service_busy" });
  }
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) return res.status(503).json({ error: "image_generation_unavailable" });
  activeRequests += 1;
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), UPSTREAM_TIMEOUT_MS);
  try {
    const upstream = await fetch("https://api.openai.com/v1/images/generations", {
      method: "POST",
      signal: controller.signal,
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        model: "gpt-image-2",
        prompt: buildPoemPrompt(poem, seed),
        n: 1,
        size: "1024x1024",
        quality: "low",
        output_format: "webp"
      })
    });
    const body = await upstream.json().catch(() => null);
    const image = body?.data?.[0];
    if (!upstream.ok || !image?.b64_json) {
      console.error("OpenAI image generation failed", {
        status: upstream.status,
        requestId: upstream.headers.get("x-request-id")
      });
      return res.status(502).json({ error: "image_generation_failed" });
    }
    return res.status(200).json({
      image: { b64_json: image.b64_json, mime_type: "image/webp" }
    });
  } catch {
    return res.status(502).json({ error: "image_generation_failed" });
  } finally {
    clearTimeout(timeout);
    activeRequests -= 1;
  }
}
export {
  handler as default
};
