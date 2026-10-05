---
title: 在 Obsidian 中高效写作并同步至暖黄博客
description: 介绍如何使用 Obsidian 本地编写 Markdown 知识库，并无缝同步发布到此极简博客。
pubDate: 2026-09-17
tags:
  - Obsidian
  - 写作流
  - 知识管理
draft: true
---
## 写作流程与 Frontmatter 规范

在你的 Obsidian Vault 中，你可以直接新建笔记，并在文件开头添加 Frontmatter 元数据块：
```yaml
---
title: "你的文章标题"
description: "简短的一句话描述"
pubDate: "2026-09-18"
tags: ["标签A", "标签B"]
draft: false
---
```
### 字段说明
- `title`：文章标题，首页文章列表中点击此标题即可直达正文。
- `description`：文章简介，展示在文章页头部或搜索引擎描述中。
- `pubDate`：发布时间，首页会自动按年份和此日期进行倒序排列。
- `tags`：标签列表，点击标签可以查看该领域下的所有文章。
- `draft`：设为 `true` 时，文章仅保留在本地，不会在博客中公开发布。

## 支持的常用格式与语法

### 1. 代码块与语法高亮

代码块采用深色暖调高亮主题，对比度适中且不刺眼：

```python
def calculate_reading_time(content: str) -> int:
    """估算文章阅读时间（按中文每分钟 350 字计算）"""
    word_count = len(content)
    minutes = max(1, round(word_count / 350))
    return minutes

print(f"预计阅读时间: {calculate_reading_time('Hello world')} 分钟")
```


