// 真实建筑模型清单。
export const MODEL_IDS = new Set<string>([
  "xiaoxiang",
  "yihong",
  "hengwu",
  "daoxiang",
  "qiushuang",
  // 以下由 Alibaba Bailian Tripo-3D 生成（轻量、约 1.3MB/栋）
  "longcui",
  "ouxiang",
  "qinfang",
]);
export const hasModel = (id: string) => MODEL_IDS.has(id);
