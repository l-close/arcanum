# arcanum 项目指令

## 项目

- 文字驱动的沙盒生活模拟 RPG。
- 技术栈：React 18 + TypeScript + Zustand + Vite，PWA + Capacitor。
- 游戏内容在 `web/src/game/content/`，按领域拆分；`text*.ts` 是纯文本表。
- 文本规范见 `STYLE.md`。

## 构建与校验

Windows PowerShell 使用 `npm.cmd`，CI / Unix 使用 `npm`。

```powershell
cd web
npm.cmd run dev
npm.cmd run build
npm.cmd run validate:content
```

`npm.cmd run build` 会先自动运行 `prebuild`，也就是内容校验与文本规范校验。

## 发布

- 完整发布流程见根目录 `RELEASE.md`。
- APK 由 GitHub Actions 构建：推送 `apk-vX.Y.Z` 标签即可，本机不需要 JDK / Android SDK。
- 已发布的版本号和标签不回头修改。

## 提交与推送

- 每次完成更新并通过校验后立即提交并推送 `main`，不把改动留在工作区。
- 推送 `main` 会自动触发 PWA 部署；APK 仍只由 `apk-*` 标签触发。
- 提交前先看 `git status`，只暂存本次相关的文件。

## 正式发布

- 只有影响 App 的代码/内容更新才发正式版；纯文档、CI、工具改动只提交推送，不升版本、不出 APK。
- 每次正式版按版本规则升 `versionName`，`versionCode` +1；同步 `package.json`、`package-lock.json`、`build.gradle`、`web/README.md`，并跑 `sync:style`。
- 校验通过后提交，打 `vX.Y.Z` 和 `apk-vX.Y.Z`，推送 `main` 和两个标签。
- APK 由 `apk-*` 工作流构建：artifact 保留 14 天，正式包附到 `vX.Y.Z` 的 GitHub Release。
- 已发布的版本号和标签不回头修改。

## 内容改动规范

任何修改 `web/src/game/content/` 下文件的任务，完成后必须：

1. 运行 `npm.cmd run validate:content` 与 `npm.cmd run validate:style`
2. 把完整输出贴给用户
3. 有 `error` 时不得宣称完成；先修复或明确报告

`warning` 不阻断构建，但要在结果里说明。

## 应急绕过

只有在确认是校验器误报时，才可以使用：

```powershell
npm.cmd run build --ignore-scripts
```

使用后必须在回复里说明绕过了 `prebuild` 以及原因。

## 版本规则

```text
主版本 . 小版本 . 补丁
x      . y      . z
```

- 新系统 / 新区域 / 新课程 / 大型玩法扩展：小版本
- 修复 / UI / 文本 / 平衡 / 小功能 / 事件与内容扩充：补丁
- 一整包新事件不再自动算小版本；是否小版本看有没有引入新玩法、新系统或新区域
- 版本号最终由项目负责人确认
- 已发布的版本号和标签不回头修改
- APK 的 `versionCode` 每次 APK 发布 +1
