# 个人极简暖黄博客 (Warm Minimalist Astro Blog)

这是一个基于 **Astro 5+** 构建的极简、护眼暖黄色调（Cream / Warm Paper Aesthetic）个人技术博客与问题解决沉淀库。

## ✨ 核心特性

- **暖黄羊皮纸/书卷阅读质感**：背景采用柔和米白偏暖色（`#FAF7EE`），搭配深炭暖灰文字（`#2D2722`）与陶土暖褐强调色（`#9C5B28`），无刺眼纯白纯黑，长时间阅读护眼舒适。
- **极简内容流**：首页按年份、日期分组排列，无杂乱边栏与花哨动画，**点击标题即刻直达文章**。
- **Obsidian 写作流友好**：直接将 Obsidian 中的 Markdown 笔记放入 `src/content/blog/` 即可自动解析发布。
- **代码排版与一键复制**：内置优雅的 Shiki 语法高亮，所有代码块自带一键复制按钮。
- **纯静态 HTML 打包**：0 运行时客户端冗余，秒级渲染，极速构建。
- **云服务器就绪**：内置多阶段构建 `Dockerfile`、高并发压缩 `nginx.conf` 和 `docker-compose.yml`。

---

## 🚀 本地开发与管理

```bash
# 启动本地开发服务（后台模式，遵守项目规范）
astro dev --background

# 查看运行状态与日志
astro dev status
astro dev logs

# 停止开发服务
astro dev stop

# 生产环境静态打包（生成 dist 文件夹）
npm run build
```

---

## ✍️ 使用 Obsidian 写作指南

博客的文章存放于：`c:\myblog\src\content\blog/`

### 1. 文章 Frontmatter 格式
在 Obsidian 中创建任意 `.md` 文件，头部加入标准元数据：

```markdown
---
title: "记录一次生产环境 Docker 容器 DNS 解析超时排查"
description: "排查思路与最终解决方案复盘"
pubDate: "2026-09-18"
tags: ["Docker", "Linux", "问题排查"]
draft: false
---

正文内容...
```

- `title`：文章标题（首页文章列表直接展示并点击进入）。
- `pubDate`：发布时间（格式 `YYYY-MM-DD`，自动决定年份分组与先后排序）。
- `tags`：标签数组（可在 `/tags` 页面统一分类检索）。
- `draft`：设为 `true` 时为草稿，不会在正式页面中显示。

### 2. 将 Obsidian 笔记库与本博客联通
你可以通过以下任一方式无缝写作：
- **方案 A（软链接，最推荐）**：在 Obsidian 笔记库中专门建一个 `Blog` 文件夹，然后建立软链接（Symbolic Link）映射到 `src/content/blog`，在 Obsidian 里写完直接生效。
  - Windows PowerShell 管理员执行：
    ```powershell
    New-Item -ItemType SymbolicLink -Path "C:\myblog\src\content\blog\my-notes" -Target "C:\Path\To\YourObsidianVault\Blog"
    ```
- **方案 B（直接打开）**：在 Obsidian 中选择“打开文件夹作为库”，直接选择 `c:\myblog\src\content\blog` 目录进行书写。

---

## 🌐 部署到个人云服务器

### 方式一：Docker 一键部署（最推荐、最省心）

将本项目推送至 Git 仓库，在云服务器上拉取代码后直接运行：

```bash
docker compose up -d --build
```

Nginx 会自动启动并监听 80 端口，服务你的纯静态博客。

### 方式二：传统 Nginx 静态托管

1. 在本地或 CI 中执行构建：
   ```bash
   npm run build
   ```
2. 将生成的 `dist/` 文件夹上传至服务器目录（例如 `/var/www/myblog`）：
   ```bash
   scp -r dist/* user@your-server-ip:/var/www/myblog/
   ```
3. 在云服务器的 Nginx 虚拟主机配置中指向该路径，参考项目根目录下的 [`nginx.conf`](./nginx.conf)。

---

## 📁 目录结构概览

```text
myblog/
├── src/
│   ├── content/
│   │   └── blog/                   # Obsidian 文章 Markdown 存放处
│   ├── layouts/
│   │   └── BaseLayout.astro        # 暖黄色调基础框架
│   ├── pages/
│   │   ├── index.astro             # 首页（年份 + 文章标题极简流）
│   │   ├── 404.astro               # 404 页面
│   │   ├── about.astro             # 关于页面
│   │   ├── posts/[...slug].astro   # 文章正文排版与代码复制
│   │   └── tags/                   # 标签聚合检索
│   └── styles/
│       └── global.css              # 暖黄色板与排版细节
├── public/                         # 静态静态资源与图标
├── Dockerfile                      # 云服务器容器镜像构建
├── docker-compose.yml              # 容器编排
├── nginx.conf                      # 生产级 Nginx 配置
└── astro.config.mjs
```
