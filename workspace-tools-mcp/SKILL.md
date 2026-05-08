---
name: workspace-tools
description: 老马工具箱 MCP Server — 系统监控、工作区管理、Git 辅助、快速笔记、Cron/Subagent 状态查看
---

# 老马工具箱 🐴

统一管理工作区日常运维和开发辅助工具。

## 可用工具

### 🖥️ 系统监控
- **system_dashboard** — 系统概览（CPU/内存/磁盘/负载）
  - `format`: "concise" (一行) 或 "detailed" (完整报告)
- **health_check** — 综合健康检查（资源 + 服务 + 网络）

### 📁 工作区管理
- **workspace_overview** — 工作区全貌（目录结构、文件统计、Git 状态）
- **find_recent_files** — 查找最近修改的文件
  - `hours`: 时间范围 (默认24h)
  - `ext`: 扩展名过滤 (如 ".js,.json")
  - `limit`: 返回条数

### 🔧 Git 辅助
- **git_summary** — Git 仓库摘要（分支、变更、提交历史、远程同步）

### 📝 快速笔记
- **quick_note** — Scratchpad 笔记
  - `action`: "add" / "read" / "search"
  - `content`: 笔记内容
  - `query`: 搜索关键词
- 笔记存储在 `data/quick-notes.md`

### ⏰ 任务状态
- **cron_status** — 定时任务状态概览
- **subagent_overview** — Subagent 注册表概览

## 配置

在 `openclaw.json` 的 `mcp.servers` 中已注册为 `workspace-tools`。

## 文件位置

```
workspace-tools-mcp/
├── server.mjs       # 主服务器
├── package.json     # 依赖配置
└── node_modules -> ../subagents/mcp-server/node_modules  (共享)
```

## 扩展指南

添加新工具：
1. 在 `server.mjs` 中用 `server.tool()` 注册
2. 遵循 Zod schema 定义参数
3. 返回 `{ content: [{ type: "text", text: "..." }] }`
4. 保持返回内容在 25000 字符以内
