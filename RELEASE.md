# arcanum 发布流程

给新会话和新维护者。先看这里，不要因为本机没有 JDK / Android SDK 就认为项目不能出包。

## 快速判断

```text
问：能打 APK 吗？
答：能。推 apk-vX.Y.Z 标签，GitHub Actions 会构建。
本机没有 JDK / Android SDK 不是阻塞项。
```

发布前先确认：

```text
版本号是否已经用过
标签是否已经存在
versionCode 是否已经递增
```

已经发布的版本号和标签不回头修改。

## 1. 发布物

| 发布物 | 触发方式 | 产物 |
|---|---|---|
| 网页 PWA | push 到 `main` | GitHub Pages |
| Android APK | push `apk-*` 标签 | `arcanum-debug-apk` |

普通的 `vX.Y.Z` 标签只作网页版本记录，不会构建 APK。

## 2. 标签规则

```text
vX.Y.Z        网页版本记录
apk-vX.Y.Z    触发 Android APK 构建
```

两个标签指向同一个发布提交。

```text
不要复用已经存在的标签
不要 force push 已发布的标签
不要在同一个 versionName 下反复发新 APK
```

如果代码变了、需要新包，升版本：

```text
2.28.2 → 2.28.3
versionCode 57 → 58
新标签 apk-v2.28.3
```

不要给 2.28.2 再打一个 58，也不要重建 `apk-v2.28.2`。

## 3. 版本号同步

发布前同时检查：

```text
web/package.json              version
web/android/app/build.gradle  versionName
web/android/app/build.gradle  versionCode
web/README.md                 标题
```

规则：

```text
versionName 与 package.json 的 version 一致
versionCode 每次 APK 发布 +1
网页版本记录和 APK 标签使用同一个 X.Y.Z
```

`package.json` 的版本变更后，还要同步 `STYLE.md` 的课程词版本标记：

```powershell
cd web
npm.cmd run sync:style
```

不跑这一步，`validate:style` 会报：

```text
ERROR [COURSE-WORDS] 版本不一致：STYLE.md 为 vX.Y.Z，package.json 为 vA.B.C
```

版本语义见 `AGENTS.md`：新系统 / 新区域 / 新课程 / 一整包新事件走小版本，修复 / UI / 文本 / 平衡 / 小功能走补丁。

## 4. 发布前检查

```powershell
cd web
npm.cmd run sync:style
npm.cmd run validate:content
npm.cmd run validate:style
npm.cmd run build
```

`npm.cmd run build` 会自动先跑 `prebuild`，也就是上面两个校验。

要求：

```text
validate:content 0 errors
validate:style   0 errors
build            tsc 与 vite 构建通过
```

`validate:style` 会打印大量 INFO，INFO 不是错误。error 必须修完再发布。

## 5. 标准发布

```powershell
# 1. 同步版本号并提交
git add web/package.json web/android/app/build.gradle web/README.md STYLE.md
git commit -m "chore: bump version to X.Y.Z"

# 2. 打标签
git tag vX.Y.Z
git tag apk-vX.Y.Z

# 3. 推送 main 和两个标签
git push origin main vX.Y.Z apk-vX.Y.Z
```

推送后：

```text
main        → Deploy PWA
apk-vX.Y.Z  → Build Android APK
```

如果标签已存在，git 会拒绝。不要强制覆盖，先确认是否应该升版本。

## 6. GitHub Actions 做什么

### Deploy PWA

文件：`.github/workflows/deploy.yml`

```text
push main
  → npm ci
  → npm run build
  → 上传 web/dist
  → 部署 GitHub Pages
```

### Build Android APK

文件：`.github/workflows/android.yml`

```text
push apk-* 标签
  → checkout
  → Node 22 + Java 21
  → npm ci
  → npm run build
  → npx cap sync android
  → 解码固定签名 keystore
  → gradlew assembleDebug
  → 上传 arcanum-debug-apk
```

CI 使用：

```text
compileSdk 36
Gradle 8.14.3
AGP 8.13.0
Java 21
```

以 `web/android/variables.gradle`、`web/android/build.gradle`、`web/android/gradle/wrapper/gradle-wrapper.properties` 为准。

## 7. 发布后验证

```text
Actions 里 Deploy PWA 是 success
Actions 里 Build Android APK 是 success
线上页面页脚显示 vX.Y.Z
APK artifact 可以下载
```

线上地址：

```text
https://l-close.github.io/arcanum/
```

APK 下载位置：

```text
Actions 对应运行页面底部 Artifacts
arcanum-debug-apk
```

GitHub Actions 的 artifact 会过期。过期后不要重建旧标签，升版本重新发布。

## 8. 本机出包（可选）

本机没有 JDK / Android SDK 时，不需要做这一步。CI 已经能出包。

需要本地出包时：

```text
JDK 17+（CI 使用 21）
Android SDK（compileSdk 36）
Gradle 使用项目自带 wrapper
```

```powershell
cd web
npm.cmd run build
npx.cmd cap sync android
cd android
.\gradlew.bat assembleDebug
```

产物：

```text
web/android/app/build/outputs/apk/debug/app-debug.apk
```

本地需要 `local.properties` 指向 Android SDK。该文件不进 git。

## 9. 签名

### CI

GitHub Secrets：

```text
ANDROID_KEYSTORE_BASE64
ANDROID_KEYSTORE_PASSWORD
ANDROID_KEY_ALIAS
ANDROID_KEY_PASSWORD
```

CI 会把 base64 解码成：

```text
web/android/arcanum-release.p12
```

并设置：

```text
ANDROID_KEYSTORE_PATH
ANDROID_KEYSTORE_PASSWORD
ANDROID_KEY_ALIAS
ANDROID_KEY_PASSWORD
```

日志里出现：

```text
Using fixed signing keystore.
```

才说明固定签名生效。

如果缺少 `ANDROID_KEYSTORE_BASE64`，CI 会回退到安卓默认调试签名。两版签名不同，覆盖安装会失败。

### 本机

```powershell
$env:ANDROID_KEYSTORE_PATH = "C:\path\to\arcanum-release.p12"
$env:ANDROID_KEYSTORE_PASSWORD = "..."
$env:ANDROID_KEY_ALIAS = "..."
$env:ANDROID_KEY_PASSWORD = "..."
```

注意区别：

```text
CI 使用 base64 secret
本机使用 p12 文件路径
```

缺 `ANDROID_KEYSTORE_PATH` 时，`signingConfigs` 不会创建，debug 会退回默认调试签名。

### release

`release` 目前没有 `signingConfig`。`assembleRelease` 产出的是未签名包，不能直接安装或分发。

当前分发路径是：

```text
assembleDebug + 固定 keystore
```

不要用 `assembleRelease` 的未签名包发布。

## 10. 常见错误

```text
APK 不要提交进 git
web/android/.gitignore 已忽略 *.apk 和 build/
不要复用已发布的 vX.Y.Z / apk-vX.Y.Z 标签
不要只改 versionCode 不改 versionName
不要在同一个 versionName 下重发 APK
不要发布 assembleRelease 的未签名包
不要因为本机没有 JDK / SDK 就说项目不能出包
```

APK 不进 git，进 git 的是版本号和标签。

## 11. 新会话检查清单

```text
[ ] 读 AGENTS.md 和本文件
[ ] 确认 .github/workflows/android.yml 存在
[ ] 检查当前 versionCode / versionName
[ ] 检查目标标签是否已经存在
[ ] 确认本机没有 JDK / SDK 不是阻塞项
[ ] 发布时同步 package.json、build.gradle、README
[ ] 推送 main 和两个标签
[ ] 等两个 workflow 成功
[ ] 验证线上页脚和 APK artifact
```
