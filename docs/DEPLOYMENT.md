# GitHub 与 Vercel 部署

- GitHub 仓库：https://github.com/yangzhao917/honglou
- 仓库可见性：私有（Private）。
- Vercel 团队：yzhao3112-3221s-projects。
- Vercel 项目：honglou。
- 连接方式：Vercel 原生 GitHub 集成，直接拉取仓库代码构建。
- 生产分支：main；其他分支由 Vercel 生成预览部署。
- 框架：Vite；Node.js：24.x；安装：npm ci；构建：npm run build；输出：dist。

日常更新：完成本地检查，以中文提交信息提交代码，推送至 main 后由 Vercel 自动部署。

站点运行不需要模型生成接口密钥。模型生成使用的本地环境文件、临时签名地址任务记录、node_modules 和本地产物未纳入仓库。Vercel 从 GitHub 拉取并构建，不上传本地 dist。

GitHub 私有控制源码访问；Vercel 的生产站点访问权限单独管理。
