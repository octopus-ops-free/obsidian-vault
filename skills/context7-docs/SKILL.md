---
name: context7-docs
displayName: "📚 Context7 — 实时代码文档查询"
description: >
  通过 Context7 API 查询最新的开源库文档和代码示例。
  避免 LLM 使用过时 API，获取最新版本的官方文档。
emoji: "📚"
license: MIT
metadata:
  openclaw:
    requires:
      bins: ["ctx7", "node"]
---

# 📚 Context7 — 实时代码文档

> Up-to-date code docs for any prompt.

Context7 从源码仓库实时拉取最新的文档和代码示例，避免 LLM 使用过时的 API。

## 触发条件

- 用户询问某个库/框架的用法
- 用户需要代码示例
- 用户提到 "最新文档"、"查看官方文档"
- 写代码前需要确认 API 用法

## 环境变量

```bash
export CONTEXT7_KEY="ctx7sk-xxx"  # 在 context7.com/dashboard 获取
```

## 用法

### 1. 搜索库

```bash
ctx7 library <库名> [关键词]
```

示例：
```bash
ctx7 library react "hooks"
ctx7 library fastapi "routing"
ctx7 library playwright "screenshot"
```

### 2. 查询文档

```bash
ctx7 docs <库ID> <查询内容>
```

示例：
```bash
ctx7 docs "/facebook/react" "useState hook"
ctx7 docs "/fastapi/fastapi" "create GET endpoint"
ctx7 docs "/vercel/next.js" "app router middleware"
```

### 3. 库 ID 格式

Context7 的库 ID 是 `/<owner>/<repo>` 格式：
- `/facebook/react` — React
- `/vercel/next.js` — Next.js
- `/fastapi/fastapi` — FastAPI
- `/microsoft/playwright` — Playwright
- `/tailwindlabs/tailwindcss` — Tailwind CSS

用 `ctx7 library <name>` 搜索可以获取正确的库 ID。

## 常用库速查

| 库 | ID |
|---|---|
| React | `/facebook/react` |
| Next.js | `/vercel/next.js` |
| FastAPI | `/fastapi/fastapi` |
| Playwright | `/microsoft/playwright` |
| Tailwind | `/tailwindlabs/tailwindcss` |
| Vue | `/vuejs/core` |
| Express | `/expressjs/express` |
| Prisma | `/prisma/prisma` |

## 优势

- ✅ 实时最新文档，不是训练数据
- ✅ 带代码示例，可直接复制
- ✅ 验证过的 API，不会幻觉
- ✅ 支持版本特定文档

## 相关技能

- [[Frontend Design]] — 前端开发
- [[Playwright]] — 浏览器自动化
- [[superpowers]] — TDD 开发

---

#技能 #文档 #编程 #API
