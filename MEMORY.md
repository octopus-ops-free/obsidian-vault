# MEMORY.md - 老马的长期记忆 🧠

> 始于 2026-05-06 | 最后更新 2026-05-08

---

## 关于老张

- 程序员，喜欢幽默有趣的互动方式
- 主要希望我能：逗他开心、帮助解决工作和生活问题、保持学习的态度
- GitHub 账号: octopus-ops-free
- 飞书: 主要聊天渠道

---

## 2026-05-08 上午大事记

### 搜索 API 修复
- Kimi 搜索之前 403，原因是配置缺 apiKey
- 环境变量叫 KIMI_KEY，已添加到 openclaw.json

### 夜间学习修复
- 连续失败 11 次（qwen 免费额度耗尽）
- 模型从 qwen/qwen3.5-plus 改为 xiaomi/mimo-v2-pro
- 搜索恢复后补了一轮学习，发现 6 个热门 GitHub 项目

### Agent Reach 安装
- v1.4.0，8/16 渠道可用
- 小红书用 xhs-cli，Cookie 已配置（账号: 却道）
- 抖音用 douyin-mcp-server (port 18070)，基础解析可用
- 语音识别待配 DASHSCOPE_API_KEY

### 自建 MCP Server
- workspace-tools-mcp，8 个工具
- 系统仪表盘、健康检查、工作区概览、Git 摘要、快速笔记等

### Skill 更新
- github、obsidian、find-skills-skill、memory 已 force update
- auto-updater 和 xiaomi-mimo-tts 被 VirusTotal 标记为 suspicious，未更新

### 知识库 & GitHub
- 知识库推送到 octopus-ops-free/obsidian-vault
- Obsidian vault 已同步

---

## 已安装的 Skills (28个)

### 核心技能
- `agent-team-orchestration` — 多 agent 团队编排
- `self-improvement` / `self-improving-proactive-agent` — 自我改进
- `brainstorming` — 创意脑暴
- `superpowers` — Spec-first TDD 开发流程
- `skill-creator` / `skill-vetter` — Skill 创建和安全审查

### 开发工具
- `playwright` — 浏览器自动化
- `github` — GitHub 仓库操作
- `mcp` — MCP 服务器构建器
- `context7-docs` — 实时库文档查询
- `frontend-design` — React/Next.js 前端开发

### 通信/平台
- `feishu-doc` / `feishu-drive` / `feishu-wiki` / `feishu-perm` — 飞书集成
- `feishu-voice-sender` — 飞书语音消息
- `notion` — Notion API
- `obsidian` — Obsidian 笔记
- `qqbot-channel` / `qqbot-media` / `qqbot-remind` — QQ 频道

### 内容创作
- `humanizer` — 去 AI 味
- `gpt-image-2-chatgpt` / `gpt-image-2-proxy` / `nano-banana-pro` — 图片生成
- `voice-transcription` — 语音转文字
- `xiaomi-mimo-tts` — 小米 TTS（含老马音色克隆）

### 办公工具
- `excel-xlsx` — Excel 读写
- `word-docx` — Word 读写

### 运维 & 搜索
- `auto-updater` — Skill 自动更新
- `healthcheck` — 安全审计
- `prismfy-search` / `find-skills-skill` / `claw-find-skills` — Skill 搜索
- `pollyreach` — AI 电话
- `ui-ux` — UI/UX 设计数据库

### Agent Reach (外部工具)
- xhs-cli (小红书) — 已登录
- douyin-mcp-server (抖音) — 基础解析可用
- yt-dlp (YouTube/B站)
- feedparser (RSS)
- Exa MCP (全网搜索)

---

## 环境变量

| 变量 | 用途 |
|------|------|
| KIMI_KEY | Kimi 搜索 |
| MIMO_KEY | 小米 MiMo TTS |
| SILICONFLOW_API_KEY | 语音转文字 |
| GITHUB_PERSONAL_ACCESS_TOKEN | GitHub |
| CONTEXT7_KEY | Context7 |
| ANTHROPIC_AUTH_TOKEN | Anthropic |
| API_YI_KEY | 零一万物 |

---

## 待办

- [ ] 晚8点配置 DASHSCOPE_API_KEY（百炼 Key）
- [ ] 给老张的项目创建 CONTEXT.md 模板
- [ ] brainstorming skill 加入 grill 对抗式提问模式
- [ ] 评估 Stash 替代 memory/*.md 文件方案
- [ ] gh CLI 安装（需要代理）
- [ ] Twitter/Reddit Cookie 配置

---

_老马的记忆就像硬盘，定期整理才能不丢数据 🐴_
