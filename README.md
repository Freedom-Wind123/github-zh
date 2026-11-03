# GitHub 汉化（GitHub 中文界面）

一个 Tampermonkey / Violentmonkey 用户脚本，把 GitHub 网页上常见的英文界面文案替换成中文。

> 非官方项目，与 GitHub 无关。只翻译界面文本，不改动仓库内容、代码与你的输入。

## 安装

1. 浏览器安装 [Tampermonkey](https://www.tampermonkey.net/) 或 [Violentmonkey](https://violentmonkey.github.io/)
2. 打开脚本文件 [`github-zh.user.js`](./github-zh.user.js)，点「安装」
   - 或直接访问 raw 地址安装：`https://raw.githubusercontent.com/Freedom-Wind123/github-zh/main/github-zh.user.js`
3. 打开任意 GitHub 页面，界面文案会自动变成中文

## 使用

- 默认开启，无需配置
- 脚本菜单里有一项「暂停/恢复汉化（刷新生效）」，状态存在本地
- 支持 `github.com` 与 `gist.github.com`

## 覆盖范围（v0.1.0）

| 区域 | 示例 |
|---|---|
| 顶部导航 | Dashboard、Explore、Marketplace、Notifications |
| 仓库页 | Code、Issues、Pull requests、Actions、Projects、Wiki、Security、Insights |
| 仓库操作 | Star、Fork、Watch、Clone、Download ZIP、Latest commit |
| 议题 / PR | Open、Closed、Merged、Draft、Assignees、Labels、Milestone、Merge pull request |
| 发行版 | Latest、Pre-release、Assets、Source code (zip) |
| 账号菜单 | Your profile、Your repositories、Settings、Sign out |
| 通用按钮 | New、Create、Edit、Delete、Save、Cancel、Confirm、Copy |

约 150 条精确词条 + 10 条带数字的短语规则（如 `12 Issues` → `12 个议题`）。

## 原理

1. 一张「英文 → 中文」精确匹配词典，只替换**整段文本完全相等**的节点，避免把句子里的单词拆坏
2. `MutationObserver` 监听 DOM 变化，适配 GitHub 的单页路由
3. 跳过 `pre`、`code`、`.markdown-body`、代码编辑器等区域，不翻译代码与 README 正文
4. 同时处理 `placeholder`、`aria-label`、`title` 属性

## 已知限制

- **覆盖率有限**：GitHub 文案量大，未收录的仍是英文；GitHub 改版后旧词条可能失效
- **可能误伤**：如果你的仓库描述恰好等于某个词条（比如就叫 `Code`），也会被替换
- 不翻译 README 正文、议题内容等用户生成内容（这是有意为之）
- 不处理图表、图片中的文字

## 贡献

加词条很简单：编辑 `github-zh.user.js` 里的 `DICT` 对象，在对应分类下加一行 `'English': '中文'`，提 PR 即可。

建议遵守：

- 只加**完整界面文案**，不要加会出现在正文里的普通单词
- 术语统一：Issues → 议题、Pull requests → 拉取请求、Fork → 复刻、Star → 标星

## 许可证

[MIT](./LICENSE)
