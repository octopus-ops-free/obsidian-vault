# Subagent 团队设计方案

**日期:** 2026-05-04  
**作者:** 老马 🐴  

## 概述

建立一套基于 MCP 工具调用的 subagent 团队系统，支持分组管理、独立调用、多轮对话、知识库挂载。

## 命名约定

- **Subagent 格式:** `组名:角色`（如 `dev:frontend-react`）
- **MCP 工具名格式:** `call_subagent_<组名>_<角色>`（如 `call_subagent_dev_frontend_react`）

## 三组架构

### 程序员组 (dev)
| Subagent | 工具名 | 职责 |
|----------|--------|------|
| `dev:frontend-react` | `call_subagent_dev_frontend_react` | React 组件开发、UI 实现、样式调整 |
| `dev:backend-python` | `call_subagent_dev_backend_python` | Python API 开发、数据库、服务逻辑 |
| `dev:code-reviewer` | `call_subagent_dev_code_reviewer` | 代码质量审查、规范检查、安全审计 |

### 视频组 (video)
| Subagent | 工具名 | 职责 |
|----------|--------|------|
| `video:screenwriter` | `call_subagent_video_screenwriter` | 剧本创作、对白设计、剧情结构 |
| `video:character-designer` | `call_subagent_video_character_designer` | 人物外观、服装、表情系统设计 |
| `video:storyboarder` | `call_subagent_video_storyboarder` | 剧本转视觉分镜、镜头语言设计 |
| `video:generator` | `call_subagent_video_generator` | 分镜/提示词转最终视频 |

### 运营组 (ops)
| Subagent | 工具名 | 职责 |
|----------|--------|------|
| `ops:sre` | `call_subagent_ops_sre` | 架构设计、可靠性工程、容量规划 |
| `ops:devops` | `call_subagent_ops_devops` | CI/CD、自动化部署、基础设施管理 |
| `ops:monitor` | `call_subagent_ops_monitor` | 服务状态检查、日志分析、告警处理 |

## 知识库架构

### 三层知识挂载

1. **ClawHub Skills** — 直接复用已安装的 skills
2. **自定义文档** — 放在各组 `knowledge/` 目录下的 markdown 文件
3. **在线抓取** — 通过 `context7-docs` 和 `web_search` 实时获取

### Skills 挂载映射

| Subagent | Skills |
|----------|--------|
| `dev:frontend-react` | `frontend`, `superpowers`, `ui-ux` |
| `dev:backend-python` | `superpowers`, `context7-docs` |
| `dev:code-reviewer` | `superpowers`, `humanizer` |
| `video:screenwriter` | `gpt-image-2-chatgpt`, `nano-banana-pro` |
| `video:character-designer` | `gpt-image-2-chatgpt`, `nano-banana-pro` |
| `video:storyboarder` | `gpt-image-2-chatgpt`, `nano-banana-pro` |
| `video:generator` | `video_generate`, `gpt-image-2-chatgpt` |
| `ops:sre` | `agent-team-orchestration`, `healthcheck` |
| `ops:devops` | `healthcheck`, `taskflow` |
| `ops:monitor` | `healthcheck` |

## MCP 工具注册

统一配置文件 `subagents/registry.yaml` 控制所有 subagent 的注册。

主 agent 启动时扫描 registry.yaml，自动将 enabled 的 subagent 注册为可用 MCP 工具。

## 调用流程

```
用户: "call_subagent_video_screenwriter 写个科幻短片剧本"
  → 主 agent 读取 registry.yaml
  → 组装 system prompt + 挂载 skills + 注入 knowledge
  → sessions_spawn 启动 subagent（多轮对话模式）
  → subagent 返回结果 → 主 agent 传回用户
```

## 目录结构

```
subagents/
├── registry.yaml              # MCP 工具注册配置
├── dev/
│   ├── prompts/
│   │   ├── frontend-react.md
│   │   ├── backend-python.md
│   │   └── code-reviewer.md
│   └── knowledge/
│       ├── react-best-practices.md
│       └── python-style-guide.md
├── video/
│   ├── prompts/
│   │   ├── screenwriter.md
│   │   ├── character-designer.md
│   │   ├── storyboarder.md
│   │   └── generator.md
│   └── knowledge/
│       ├── awesome-gpt-image-2-templates.md
│       ├── character-design-guide.md
│       └── storyboard-techniques.md
└── ops/
    ├── prompts/
    │   ├── sre.md
    │   ├── devops.md
    │   └── monitor.md
    └── knowledge/
        ├── sre-playbook.md
        └── incident-response.md
```
