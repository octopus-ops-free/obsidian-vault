# 夜间自主学习日志 📚

> 老马夜间学习记录 - 2026-05-07 23:30 ~ 2026-05-08 09:00
> 每30分钟一次，深入研究有价值的项目/工具/平台

---

## 学习目标
- 搜索 ClawHub、GitHub 等平台上的新 skill/tool
- 了解 oh-my-claude-code、codex、newapi 等项目
- 发现能提升能力的新东西
- 尝试安装有用的 skill

---

## 学习记录

<!-- 每次学习后在这里追加记录 -->

---

## 2026-05-08 00:13 - 夜间学习 #1

### 📦 新安装技能

#### 1. github (4.565⭐)
- **来源**: clawhub install github
- **用途**: GitHub 仓库操作、Issue 管理、PR 工作流
- **集成**: 已安装到 `/root/.openclaw/workspace/skills/github`
- **使用场景**: 
  - 自动检查项目更新
  - 管理 Issue 和 PR
  - 搜索热门项目

#### 2. mcp (4.225⭐)
- **来源**: clawhub install mcp
- **用途**: MCP (Model Context Protocol) Builder
- **集成**: 已安装到 `/root/.openclaw/workspace/skills/mcp`
- **使用场景**:
  - 构建自定义 MCP 服务器
  - 连接外部工具和服务
  - 扩展 AI agent 能力边界

---

### 🔍 发现的有价值项目

#### 1. LangChain Deep Agents 架构
- **发现**: LangChain 推出了 Deep Agents 架构，采用 coordinator-worker 模式
- **为什么有用**: 
  - 支持多 agent 协作
  - 子 agent 可以独立执行任务
  - 适合复杂工作流编排
- **怎么集成**:
  ```typescript
  // 使用 createDeepAgent() 创建协调器
  // 子 agent 通过 delegate 分发任务
  // 前端使用 useStream() 接收实时流
  ```
- **文档**: https://docs.langchain.com/oss/javascript/deepagents/frontend/overview

#### 2. OpenAI Responses API (替代 Chat Completions)
- **发现**: OpenAI 推出新的 Responses API，是 Chat Completions 的升级版
- **为什么有用**:
  - 更简洁的 API 设计
  - 支持 `instructions` 参数设置系统行为
  - 返回 `output_text` 直接获取结果
- **怎么使用**:
  ```python
  from openai import OpenAI
  client = OpenAI(api_key=os.environ.get("OPENAI_API_KEY"))
  response = client.responses.create(
      model="gpt-5.2",
      instructions="You are a coding assistant",
      input="你的问题"
  )
  print(response.output_text)
  ```
- **版本**: openai-python v2.x+

#### 3. Anthropic SDK
- **发现**: Anthropic 官方 SDK 支持 TypeScript 和 Python
- **库 ID**: 
  - `/anthropics/anthropic-sdk-typescript` (77.06分)
  - `/anthropics/anthropic-sdk-python` (78.55分)
- **特性**: 支持流式响应、批量消息、工具调用

---

### 📊 ClawHub 高分技能推荐

| 技能 | 评分 | 说明 | 状态 |
|------|------|------|------|
| github | 4.565 | GitHub 操作 | ✅ 已安装 |
| playwright | 4.428 | 浏览器自动化 | ✅ 已安装 |
| browser | 4.364 | 浏览器控制 | ✅ ws-agent-browser |
| context7 | 4.321 | 文档查询 | ✅ context7-docs |
| mcp | 4.225 | MCP Builder | ✅ 已安装 |
| agent-browser-clawdbot | 3.857 | 浏览器控制 | ⏸ 已有替代 |

---

### 🎯 下一步行动

1. **测试新技能**: 尝试使用 github 技能管理仓库
2. **探索 MCP**: 研究 mcp 技能，看能否集成更多外部服务
3. **更新工作流**: 考虑将 OpenAI Responses API 集成到现有代码
4. **学习 Deep Agents**: 研究 LangChain 的多 agent 架构，优化 agent-team-orchestration 技能

---

## 2026-05-08 00:45 - 夜间学习 #2 (MCP & Multi-Agent)

### 🔍 深入学习：MCP (Model Context Protocol)

#### MCP 是什么
MCP 是一个协议，让 AI agent 能够连接外部工具和服务。类似于"USB-C for AI"。

#### 快速入门
```bash
# 创建 MCP 服务器项目
mkdir weather
cd weather
npm init -y
npm install @modelcontextprotocol/server zod
npm install -D @types/node typescript
mkdir src
touch src/index.ts
```

#### 运行示例服务器
```bash
# 从 SDK 根目录运行
cd examples/server
pnpm tsx src/simpleStreamableHttp.ts

# 或带自定义端口
PORT=9000 pnpm tsx src/simpleTaskInteractive.ts
```

#### 为什么重要
- 标准化 AI 与外部系统的连接
- 已有 Prisma、Databricks 等官方 MCP 服务器
- 我们可以构建自定义 MCP 服务器连接内部系统

#### 怎么集成
1. 使用新安装的 `mcp` 技能创建 MCP 服务器
2. 连接内部数据库、API、文件系统
3. 让 AI agent 通过 MCP 调用这些工具

---

### 🤖 深入学习：CrewAI 多 Agent 架构

#### CrewAI 简介
- **库 ID**: `/crewaiinc/crewai`
- **评分**: 89.42 (Context7 Benchmark)
- **语言**: Python
- **用途**: 编排自主 AI agent 团队

#### 核心概念

**1. 顺序执行 (Sequential)**
```python
from crewai import Agent, Task, Crew, Process

crew = Crew(
    agents=[researcher, analyst],
    tasks=[research_task, analysis_task],
    process=Process.sequential,
    verbose=True,
    memory=True,  # 启用记忆保持上下文
    cache=True    # 缓存工具结果
)
```

**2. 层级管理 (Hierarchical)**
```python
# 管理者 agent 协调团队
manager = Agent(
    role="Project Manager",
    goal="Coordinate team efforts",
    allow_delegation=True,  # 允许委派任务
    verbose=True
)

# 专家 agent 专注特定领域
researcher = Agent(
    role="Researcher",
    allow_delegation=False,  # 不接受委派，专注执行
    verbose=True
)
```

#### 与我们现有的对比

| 特性 | CrewAI | 我们的 agent-team-orchestration |
|------|--------|----------------------------------|
| 架构 | Sequential/Hierarchical | 自定义工作流 |
| 记忆 | 内置 memory=True | 需要手动实现 |
| 缓存 | 内置 cache=True | 需要手动实现 |
| 管理委派 | allow_delegation | 需要自定义 |

#### 可以借鉴的点
1. **memory 参数**: 在 agent-team-orchestration 中添加记忆功能
2. **cache 机制**: 缓存工具调用结果，减少重复 API 调用
3. **层级管理**: 实现 manager agent 模式，协调子 agent

---

### 📚 Context7 查询技巧

**搜索库**:
```bash
ctx7 library <库名>
# 示例：ctx7 library langchain
```

**查询文档**:
```bash
ctx7 docs "<库ID>" "<查询内容>"
# 示例：ctx7 docs "/crewaiinc/crewai" "multi agent team"
```

**常用库 ID**:
- `/facebook/react` - React
- `/openai/openai-python` - OpenAI Python SDK
- `/anthropics/anthropic-sdk-python` - Anthropic Python SDK
- `/crewaiinc/crewai` - CrewAI
- `/modelcontextprotocol/typescript-sdk` - MCP TypeScript SDK

---

### 🎯 新行动计划

1. **研究 mcp 技能**: 查看 `/root/.openclaw/workspace/skills/mcp/SKILL.md`
2. **增强 agent-team-orchestration**: 添加 memory 和 cache 功能
3. **创建 MCP 服务器示例**: 连接内部数据库或 API
4. **关注 CrewAI 更新**: 定期查看最新特性

---

## 2026-05-08 01:15 - 新技能文档研究

### 📦 mcp-builder 技能详解

**文件位置**: `/root/.openclaw/workspace/skills/mcp/SKILL.md`

#### 4 阶段开发流程

**Phase 1: 深度研究和规划**
- 学习 Agent-Centric 设计原则
- 研究 MCP 协议文档 (https://modelcontextprotocol.io/llms-full.txt)
- 学习框架文档 (Python FastMCP / TypeScript MCP SDK)
-  exhaustive 研究目标 API 文档
- 创建详细的实现计划

**Phase 2: 实现**
- 设置项目结构
- 先实现核心基础设施（API 请求助手、错误处理、响应格式化）
- 系统性实现每个工具
- 添加工具注解（readOnlyHint, destructiveHint, idempotentHint, openWorldHint）

**Phase 3: 审查和优化**
- 代码质量审查（DRY、可组合性、一致性、错误处理、类型安全）
- 测试和构建
- 使用质量检查清单

**Phase 4: 创建评估**
- 创建 10 个评估问题
- 确保问题独立、只读、复杂、真实、可验证、稳定

#### 关键设计原则

1. **为工作流构建，而非 API 端点**
   - 不要简单包装 API，要构建完整的工作流工具
   - 例如：`schedule_event` 同时检查可用性和创建事件

2. **优化有限上下文**
   - 返回高信号信息，不是详尽数据
   - 提供 "concise" vs "detailed" 响应格式选项
   - 默认使用人类可读的标识符（名称而非 ID）

3. **设计可操作的错误消息**
   - 错误消息应指导 agent 正确使用
   - 建议具体下一步："Try using filter='active_only'"

4. **遵循自然任务细分**
   - 工具名称应反映人类思考任务的方式
   - 使用一致的前缀分组相关工具

---

### 📦 github 技能详解

**文件位置**: `/root/.openclaw/workspace/skills/github/SKILL.md`

#### 核心命令

**PR 和 CI**:
```bash
gh pr checks 55 --repo owner/repo        # 检查 PR 的 CI 状态
gh run list --repo owner/repo --limit 10 # 列出最近的 workflow runs
gh run view <run-id> --repo owner/repo --log-failed  # 查看失败步骤日志
```

**Issue 管理**:
```bash
gh issue list --repo owner/repo --json number,title --jq '.[] | "\(.number): \(.title)"'
```

**API 高级查询**:
```bash
gh api repos/owner/repo/pulls/55 --jq '.title, .state, .user.login'
```

#### 使用场景

1. **自动化 PR 审查**: 检查 CI 状态、查看评论
2. **Issue 管理**: 自动分类、标签、分配
3. **Release 管理**: 创建 release、管理 changelog
4. **监控**: 监控 workflow runs、失败通知

---

### 📊 今晚学习总结

**时间**: 2026-05-08 00:13 - 01:15 (约 1 小时)

**完成的工作**:
- ✅ 搜索 ClawHub 新技能
- ✅ 安装 2 个新技能：github (4.565⭐), mcp (4.225⭐)
- ✅ 使用 Context7 查询热门库文档
- ✅ 深入学习 MCP 协议和多 Agent 架构
- ✅ 记录到 memory/nightly-study.md

**关键发现**:
1. **MCP 协议** - AI 与外部系统连接的标准协议，值得深入开发
2. **CrewAI** - 成熟的 Python 多 Agent 框架，可借鉴 memory/cache 机制
3. **OpenAI Responses API** - 新的 API 设计，替代 Chat Completions
4. **LangChain Deep Agents** - coordinator-worker 架构

**下一步**:
- 尝试使用 github 技能管理仓库
- 研究创建一个简单的 MCP 服务器
- 增强 agent-team-orchestration 技能

---

_下次学习时间：2026-05-09 00:00_


## 2026-05-08 08:50 - 补学习：GitHub 热门 AI Agent 项目

### 🔍 搜索方式
因 web_search 超时，改用 GitHub API + web_fetch 替代

---

### 📦 本周热门 AI Agent 项目

#### 1. obscura ⭐ 10,931
- **URL**: https://github.com/h4ckf0r0day/obscura
- **语言**: Rust
- **描述**: 专为 AI Agent 和爬虫打造的无头浏览器
- **为什么有用**: 
  - Rust 编写，性能优于 Playwright/Puppeteer
  - 专门为 AI agent 场景优化，抗指纹检测
  - 可以作为 playwright 技能的高性能替代
- **怎么集成**: 研究其 API，看能否作为 MCP 工具接入

#### 2. fireworks-tech-graph ⭐ 5,669
- **URL**: https://github.com/yizhiyanhua-ai/fireworks-tech-graph
- **语言**: Python
- **描述**: 从自然语言生成高质量 SVG/PNG 技术图表，支持 7 种风格和 UML
- **为什么有用**:
  - 自动生成架构图、流程图、UML
  - 支持 AI/Agent 工作流模式
  - 可以直接用来给老张生成项目架构图
- **怎么集成**: 创建一个 skill 或 MCP server，输入描述自动出图

#### 3. CubeSandbox ⭐ 5,140（腾讯）
- **URL**: https://github.com/TencentCloud/CubeSandbox
- **语言**: Rust
- **描述**: 即时、并发、安全、轻量的 AI Agent 沙箱
- **为什么有用**:
  - 安全隔离执行 agent 生成的代码
  - 比 Docker 更轻量，比裸跑更安全
  - 腾讯出品，工程质量有保障
- **怎么集成**: 用于 agent 执行不可信代码时的沙箱环境

#### 4. Stash ⭐ 666
- **URL**: https://github.com/alash3al/stash
- **语言**: Go
- **描述**: AI Agent 的持久化记忆层，基于 Postgres 存储 episodes/facts/working context，自带 MCP server，自托管单二进制
- **为什么有用**:
  - 比我们现在的文件系统记忆方案更结构化
  - 自带 MCP server，开箱即用
  - 单二进制部署，运维简单
- **怎么集成**: 评估是否替代当前 memory/*.md 文件方案

#### 5. anything-analyzer ⭐ 2,283
- **URL**: https://github.com/Mouseww/anything-analyzer
- **描述**: 全能协议分析工具：浏览器抓包 + MITM 代理 + 指纹伪装 + AI 分析 + MCP Server
- **为什么有用**:
  - 网络抓包 + AI 分析一体化
  - MCP Server 可直接对接 AI Agent/IDE
  - 中文项目，文档友好
- **怎么集成**: 调试 API 时用 AI 自动分析抓包结果

#### 6. design-extract ⭐ 2,317
- **URL**: https://github.com/Manavarya09/design-extract
- **描述**: 一条命令提取网站完整设计系统，输出 DTCG tokens + 语义化变量
- **为什么有用**:
  - 快速分析竞品/参考网站的设计风格
  - 输出标准化的设计 token，可直接用于前端
- **怎么集成**: 做 UI 项目时先提取参考站的设计系统

---

### 📊 ClawHub 最新数据
- 52.7k 工具
- 180k 用户
- 12M 下载
- 4.8 平均评分

---

### 🎯 重点推荐下一步

1. **obscura** — 如果比 playwright 快很多，考虑集成替代
2. **fireworks-tech-graph** — 给老张生成技术架构图，实用性高
3. **Stash** — 评估替代文件记忆方案的可能性

---

## 2026-05-08 09:45 - 深入研究 #1：Claude Code 插件系统

### 🔍 研究方向
Claude Code 最近推出了完整的插件系统，比之前的 skills 更强大。

### 📦 Claude Code 插件架构

**目录结构：**
```
plugin-name/
├── .claude-plugin/plugin.json  # 元数据
├── commands/                   # 斜杠命令
├── agents/                     # 专用子 agent
├── skills/                     # Agent Skills
├── hooks/                      # 事件处理器
├── .mcp.json                   # 外部工具配置
```

**关键发现：**
- 插件通过 plugin.json 定义元数据（名称、版本、作者等）
- agents/ 目录下的 markdown 文件定义子 agent，支持 example 块自动触发
- hooks 系统支持 PreToolUse（调用前验证）、Stop（停止时检查）、SessionStart（加载上下文）

### 💡 可能的应用
1. 把 OpenClaw skills 打包成 Claude Code 插件
2. 创建自动代码审查 agent（提交前自动触发）
3. 用 SessionStart hook 自动加载项目上下文

---

## 2026-05-08 09:45 - 深入研究 #2：OpenAI Agents SDK Guardrails

### 🔍 研究方向
OpenAI Agents Python SDK 的安全护栏机制。

### 📦 核心特性

**Tool Guardrails：**
- `@tool_input_guardrail` — 检查工具参数中是否包含密钥（如 sk-）
- `@tool_output_guardrail` — 检查返回值中是否包含敏感数据
- 通过 `ToolGuardrailFunctionOutput.reject_content()` 阻止执行
- 通过 `ToolGuardrailFunctionOutput.allow()` 放行

**Multi-Agent Handoff：**
- 专门 agent 定义 handoff_description
- Triage agent 通过 handoffs=[...] 配置路由
- Runner.run_sync() 自动处理 handoff 和 tool 调用

### 💡 与 OpenClaw 对比
- **Guardrails** — SDK 内置 vs 我们靠 prompt 约束
- **Handoffs** — 一行配置 vs 手动 sessions_spawn
- **Tool 装饰器** — 自动推断 schema vs 手动定义

---

## 2026-05-08 09:45 - 学习总结更新

### 📊 本轮新增深度研究
1. ✅ Claude Code 插件系统 — agents、commands、hooks、manifest
2. ✅ OpenAI Agents SDK Guardrails — 输入/输出安全护栏
3. ✅ MCP 服务器 TypeScript 实现（Microsoft 教程）

### 🔮 未来值得关注
1. **Claude Code 插件生态** — skills 打包成插件发布
2. **OpenAI Agents SDK** — GPT 系列 agent 最佳选择
3. **MCP 标准化** — 越来越多工具支持
4. **Guardrails 模式** — 借鉴防止敏感信息泄露

### 📌 行动项
- [ ] 研究把 agent-team-orchestration 打包成 Claude Code 插件
- [ ] 评估 OpenAI Agents SDK 适用场景
- [ ] 创建一个 MCP 服务器示例项目
- [ ] 在 tool 定义中加入 guardrails 校验逻辑

---

_下次学习时间：2026-05-09 00:00_
