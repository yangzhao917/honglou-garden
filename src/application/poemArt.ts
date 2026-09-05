// 把红楼梦诗词翻译为英文意境 prompt，喂给 DashScope 通义万相文生图。
// 不直接喂中文：通义万相支持中文，但英文描述对国际通用美术词汇更稳定，
// 而且能避开具体人物名（宝玉/黛玉）触发人名审核导致失败的问题。
import type { LiteraryEntry } from "../domain/models";

/** 每一首诗词预先给一段"画面基线"，避免 prompt_extend 自己加戏偏离原著。 */
interface SceneBase {
  /** 一两句英文意象，作为画面定调 */
  motif: string;
  /** 主要元素 / 主体 */
  subjects: string[];
  /** 关键氛围词 */
  mood: string[];
  /** 配色倾向 */
  palette: string[];
  /** 构图 */
  composition: string;
}

const SCENE_TABLE: Record<string, SceneBase> = {
  qinfang: {
    motif: "a waterside pavilion named Qinfang beside a lotus pond, willows lining the embankment",
    subjects: [
      "ancient Chinese pavilion with upturned eaves",
      "weeping willows dipping into water",
      "lotus leaves and a few pale pink blossoms",
      "stone embankment with wooden railing",
    ],
    mood: ["serene", "fresh spring", "gentle breeze", "literati elegance"],
    palette: ["emerald green", "jade white", "soft willow yellow", "pale pink"],
    composition:
      "eye-level medium shot, pavilion centered with reflection in water, soft morning light",
  },
  bamboo: {
    motif:
      "a study flanked by dense emerald bamboo groves, named 'Phoenix Comes to Rest'",
    subjects: [
      "tall slender bamboo forest",
      "small traditional Chinese study with green-tiled roof",
      "wooden lattice window glowing warm light",
      "stone path winding into the grove",
    ],
    mood: ["quiet", "literary", "cool shade", "refined solitude"],
    palette: ["bamboo green", "mist grey", "warm amber", "ink black"],
    composition:
      "perspective looking into bamboo grove with study half-hidden, soft diffused light filtering through leaves",
  },
  "haitang-daiyu": {
    motif: "white begonia blossoms in a scholar's courtyard at dusk, melancholic feminine mood",
    subjects: [
      "potted white begonia flowers",
      "half-closed wooden door with bamboo curtain",
      "jade basin and porcelain",
      "scattered fallen petals on mossy stone",
    ],
    mood: ["delicate", "sorrowful", "moonlit", "paper-white purity"],
    palette: ["snow white", "cold silver", "ash grey", "pale jade"],
    composition:
      "low-angle close-up of white begonia against a misty grey wall, single bloom in focus",
  },
  "haitang-baochai": {
    motif: "a plump white begonia heavy with dew in a refined courtyard, dignified and composed",
    subjects: [
      "lush white begonia blossoms in celadon pot",
      "mossy stone steps",
      "tall garden wall casting long shadow",
      "dewdrops on plump petals",
    ],
    mood: ["noble", "lush", "gentle", "afternoon stillness"],
    palette: ["warm white", "celadon green", "soft amber", "mossy grey"],
    composition:
      "balanced symmetrical framing of begonia bush with architectural wall backdrop",
  },
  "haitang-baoyu": {
    motif: "a moonlit white begonia that looks like a beauty stepping from a bath, yearning gaze",
    subjects: [
      "white begonia in stone basin",
      "blue-green porcelain bowl",
      "fallen petals on lacquered railing",
      "distant moon through gauze clouds",
    ],
    mood: ["dreamy", "sentimental", "evening glow", "tender melancholy"],
    palette: ["cool white", "moonlight blue", "pear grey", "porcelain teal"],
    composition:
      "three-quarter view with begonia in foreground, distant garden wall and moon behind",
  },
  "haitang-tanchun": {
    motif: "white begonia after autumn rain, a determined and upright feminine presence",
    subjects: [
      "white begonia with wet leaves",
      "tangled green moss on garden rock",
      "painted balcony railing",
      "chrysanthemums nearby",
    ],
    mood: ["vigorous", "rain-washed", "fresh", "spirited"],
    palette: ["fresh white", "rain-soaked green", "ink shadow", "soft amber"],
    composition:
      "wide-angle garden scene after rain, begonia prominent in mid-ground",
  },
  "haitang-xiangyun": {
    motif: "an enchanted white begonia descended from the heavens, bright and carefree mood",
    subjects: [
      "abundant white begonia spilling over a celadon pot",
      "two young women in traditional Hanfu smiling",
      "blue garden door slightly ajar",
      "fallen petals like snow",
    ],
    mood: ["joyful", "bright", "social", "poetic enthusiasm"],
    palette: ["snow white", "sky blue", "jade green", "warm skin tone"],
    composition:
      "wide social scene in a courtyard with begonia centerpiece",
  },
  zanghua: {
    motif:
      "a young woman in Hanfu burying fallen flower petals under a bamboo grove at dusk",
    subjects: [
      "fallen peach and pear blossoms covering the ground",
      "a flower hoe in her hand, bamboo basket on her back",
      "long trailing weeping willows",
      "mossy stone path and wooden garden door",
      "wisteria trellis in the background",
    ],
    mood: ["elegiac", "fateful", "spring sorrow", "lone beauty"],
    palette: ["muted pink", "ash brown", "dusk indigo", "bamboo green"],
    composition:
      "profile of a solitary woman walking through drifts of fallen petals, soft golden hour light from behind",
  },
  qiuchuang: {
    motif:
      "autumn rain lashing a small study window beside sparse bamboo, lonely candle inside",
    subjects: [
      "wooden lattice window streaming rain",
      "slender bamboo outside trembling in wind",
      "a single candle on the desk with a sorrowful book",
      "cold tea in a celadon cup",
    ],
    mood: ["withering", "rain-soaked", "haunting", "melancholic"],
    palette: ["ink black", "ash grey", "cold jade", "dim amber"],
    composition:
      "first-person view through rain-streaked window, candle flame reflected on wet wood",
  },
  yongju: {
    motif:
      "chrysanthemums blooming alone by a stone fence in late autumn moonlight",
    subjects: [
      "clusters of golden and white chrysanthemums",
      "tilted scholar's rock by the fence",
      "long bamboo shadow",
      "an inkstone and brush abandoned on a stone bench",
    ],
    mood: ["solitary", "elevated", "moonlit", "poetic obsession"],
    palette: ["chrysanthemum yellow", "frost white", "ink grey", "dark pine"],
    composition:
      "asymmetric close-up with chrysanthemums filling lower frame, moon and bare branches above",
  },
  wenju: {
    motif:
      "a single chrysanthemum standing alone against autumn wind, addressed as a confidante",
    subjects: [
      "one proud chrysanthemum bloom against a garden wall",
      "a hand reaching gently toward the petals",
      "fallen petals at the base",
      "sparse bamboo nearby",
    ],
    mood: ["questioning", "intimate", "regretful", "tender"],
    palette: ["dusk amber", "faded yellow", "smoky grey", "soft pine"],
    composition:
      "tight portrait composition, single bloom centered, soft autumnal bokeh",
  },
  yiju: {
    motif:
      "autumn dusk over an empty fenced garden where chrysanthemums once bloomed",
    subjects: [
      "empty bamboo fence",
      "withered chrysanthemum stems",
      "a distant moonlit hill",
      "frosted cobblestones",
    ],
    mood: ["nostalgic", "longing", "late autumn", "recollection"],
    palette: ["frost white", "twilight purple", "smoky blue", "faded ochre"],
    composition:
      "wide contemplative scene with empty garden leading eye to distant moon",
  },
  pangxie: {
    motif:
      "an autumn riverside pavilion where ladies in Hanfu eat crabs under osmanthus shade",
    subjects: [
      "long banquet table with crab shells, wine cups, chrysanthemums",
      "rows of women in elegant Hanfu robes",
      "osmanthus tree with golden blossoms overhead",
      "reed-covered pond behind the pavilion",
    ],
    mood: ["convivial", "biting satire", "autumn gaiety", "literary wit"],
    palette: ["golden osmanthus", "autumn ochre", "jade green", "ink black"],
    composition:
      "wide horizontal banquet scene with pavilion, table and pond in single sweep",
  },
  taohua: {
    motif:
      "a curtain of pink peach blossoms surrounding a young woman combing her hair",
    subjects: [
      "endless pink peach blossoms like falling snow",
      "peach petal curtain drawn half open",
      "young woman in pale Hanfu with hairpin",
      "garden wall and emerald leaves",
      "curved wooden bridge in distance",
    ],
    mood: ["bewitching", "sorrowful spring", "misty", "veiled beauty"],
    palette: ["peach pink", "pale jade", "soft crimson", "garden green"],
    composition:
      "frontal portrait of woman through half-open blossom curtain, soft focus petals",
  },
  "liuxu-baochai": {
    motif:
      "white willow catkins drifting upward on a spring breeze toward blue sky",
    subjects: [
      "soft white willow fluff floating in air",
      "jade-white steps and railing",
      "a hand reaching to catch a drifting tuft",
      "distant sky in pale cobalt blue",
    ],
    mood: ["uplifted", "aspirational", "light", "rising spirit"],
    palette: ["sky blue", "white jade", "fresh willow green", "silver"],
    composition:
      "low-angle view looking up at drifting willow fluff against open sky",
  },
  "liuxu-daiyu": {
    motif:
      "white willow catkins scattering sadly over an abandoned garden path",
    subjects: [
      "white willow fluff falling over mossy flagstones",
      "empty swing hanging from a tree",
      "wilting daffodil near a broken vase",
      "raindrops on scattered petals",
    ],
    mood: ["forsaken", "wistful", "drifting", "lamenting"],
    palette: ["ash grey", "pear white", "dusk purple", "muted moss"],
    composition:
      "diagonal path strewn with willow fluff leading to a faded garden gate",
  },
  hongmei: {
    motif: "red plum blossoms blooming defiantly after snow by a mountain stream",
    subjects: [
      "vivid red plum blossoms against white snow",
      "ancient twisted plum tree trunk",
      "rocky stream with thin ice",
      "distant pale mountains",
    ],
    mood: ["heroic", "stark beauty", "winter vitality", "proud"],
    palette: ["vermilion red", "snow white", "mountain blue", "ink branch"],
    composition:
      "vertical composition with plum branch cutting across snow scene, single accent bloom",
  },
};

const FALLBACK: SceneBase = {
  motif:
    "a quiet scene from a classical Chinese scholar's garden, evoking a poem from the Qing dynasty novel Dream of the Red Chamber",
  subjects: [
    "traditional Chinese garden pavilion",
    "seasonal flowers or trees",
    "stone path and railing",
  ],
  mood: ["literary", "contemplative", "classical Chinese painting mood"],
  palette: ["rice paper white", "ink black", "garden green", "muted ochre"],
  composition:
    "balanced wide shot, like a hanging scroll painting, with ample negative space",
};

/** 拼接最终 prompt。所有变量都是英文，便于模型理解。 */
export function buildPoemPrompt(poem: LiteraryEntry, seed: number): string {
  const base = SCENE_TABLE[poem.id] ?? FALLBACK;
  const lines = `[Style] classical Chinese gongbi painting blended with soft cinematic realism, hanging scroll composition with poetic negative space.
[Scene] ${base.motif}.
[Subjects] ${base.subjects.join(", ")}.
[Setting] ${poem.title} by ${poem.author || "Cao Xueqin"} — ${poem.context}.
[Mood] ${base.mood.join(", ")}.
[Palette] ${base.palette.join(", ")}.
[Composition] ${base.composition}.
[Quality] high detail, soft natural light, ink-wash atmosphere, no text, no watermark, no signature, no people faces in close-up, no modern elements, no anime.
[Seed] ${seed}.`;
  return lines;
}

/** 反向提示词，避免常见瑕疵。 */
export const NEGATIVE_PROMPT =
  "low resolution, blurry, deformed hands, extra fingers, watermark, signature, modern clothing, plastic skin, oversaturated, anime style, cartoon, text, logo, frame, border, garbled characters, plastic flowers, neon colors, two-dimensional";
