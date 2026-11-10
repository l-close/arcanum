# APK 签名备份

`arcanum-signing-backup.7z` 是 arcanum 安卓 APK 的固定签名备份。

## 里面有什么

| 文件 | 作用 |
|---|---|
| `arcanum-release.p12` | 固定签名 keystore，包含私钥和证书 |
| `arcanum-release.p12.b64` | 同一个 keystore 的 base64 文本，用于 GitHub Secret |
| `SIGNING_SECRETS.txt` | 四个 GitHub Secrets 的值 |
| `README.txt` | 原始说明 |

## 为什么需要它

Android 只允许**包名相同、签名证书相同**的 APK 覆盖安装。固定签名后，后续版本才能直接更新，不需要每次卸载重装。

这个归档是应用签名身份的备份。更换电脑、重装系统或 GitHub Actions 配置丢失时，用它恢复签名。

## 加密方式

- 7-Zip AES-256
- 文件名也加密（`-mhe=on`）
- 归档里包含密码，所以密码不能和归档放在一起

## 密码放在哪里

密码**不存放在本仓库**。

当前机器上的密码文件在仓库外：

```text
C:\Users\ASUS\Documents\arcanum-signing\BACKUP_PASSWORD.txt
```

更换电脑前，请把密码复制到密码管理器、加密 U 盘或其他独立的安全位置。不要把它提交进仓库，也不要和这个 `.7z` 放在同一个公开目录。

## 恢复步骤

1. 安装 7-Zip。
2. 把 `arcanum-signing-backup.7z` 解压到**仓库外**的目录。
3. 确认解压出 `arcanum-release.p12`。
4. 打开 `SIGNING_SECRETS.txt`，在 GitHub 仓库设置里添加四个 Secrets：
   - `ANDROID_KEYSTORE_BASE64`
   - `ANDROID_KEYSTORE_PASSWORD`
   - `ANDROID_KEY_ALIAS`
   - `ANDROID_KEY_PASSWORD`
5. 保留 `arcanum-release.p12` 的仓库外备份。
6. 不要提交解压后的 keystore 或密码文本。

GitHub Secrets 页面：

```text
https://github.com/l-close/arcanum/settings/secrets/actions
```

## 注意

- 解压后的 `*.p12`、`*.jks`、`*.keystore` 已被 `.gitignore` 排除。
- `SIGNING_SECRETS.txt`、`arcanum-release.p12.b64`、`BACKUP_PASSWORD.txt` 也已加入 `.gitignore`。
- 不要把解压后的文件放进 `web/`、`android/` 或任何会被构建或提交的目录。
- 如果密码丢失，这个归档无法打开。请同时保留仓库外的未加密备份，或把密码存入密码管理器。
