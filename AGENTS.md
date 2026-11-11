# arcanum 项目指令

## 项目

- 文字驱动的沙盒生活模拟 RPG。
- 技术栈：React 18 + TypeScript + Zustand + Vite，PWA + Capacitor。
- 游戏内容在 `web/src/game/content/`，按领域拆分；`text*.ts` 是纯文本表。

## 构建与校验

Windows PowerShell 使用 `npm.cmd`，CI / Unix 使用 `npm`。

```powershell
cd web
npm.cmd run dev
npm.cmd run build
npm.cmd run validate:content
```

`npm.cmd run build` 会先自动运行 `prebuild`，也就是内容校验。

## 内容改动规范

任何修改 `web/src/game/content/` 下文件的任务，完成后必须：

1. 运行 `npm.cmd run validate:content`
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

- 新系统 / 新区域 / 新课程 / 一整包新事件：小版本
- 修复 / UI / 文本 / 平衡 / 小功能：补丁
- 已发布的版本号和标签不回头修改
- APK 的 `versionCode` 每次 APK 发布 +1
