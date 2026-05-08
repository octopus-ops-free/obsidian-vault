# TOOLS.md - 老马技能清单 🐴

> 最后更新: 2026-05-08

## 🔍 搜索 & 信息获取

| 工具 | 状态 | 说明 |
|------|------|------|
| web_search (Kimi) | ✅ | 全网语义搜索，免费 |
| web_fetch (Jina) | ✅ | 任意 URL 转 Markdown |
| YouTube (yt-dlp) | ✅ | 字幕提取 + 视频搜索 |
| B站 (yt-dlp) | ✅ | 字幕 + 搜索 |
| 小红书 (xhs-cli) | ✅ 已登录 | 搜索、阅读、评论 |
| 抖音 (douyin-mcp) | ✅ 基础 | 视频解析 + 无水印下载 |
| 微信公众号 (Exa) | ✅ | 搜索 + 阅读 |
| RSS (feedparser) | ✅ | 订阅源解析 |
| markitdown | ✅ v0.1.5 | PDF/Word/PPT/Excel → MD |

### 待配置渠道
- 🐦 Twitter — 需要 Cookie
- 📖 Reddit — 需要 rdt-cli + Cookie
- 🎵 抖音语音识别 — 需要 DASHSCOPE_API_KEY（今晚8点配）

## 💻 编程 & 开发

| 技能 | 来源 | 说明 |
|------|------|------|
| github | clawhub | gh CLI 操作 |
| mcp-builder | clawhub | MCP 服务器开发指南 |
| playwright | clawhub | 浏览器自动化 |
| frontend | clawhub | React/Next.js/Tailwind |
| superpowers | clawhub | TDD + 调试工作流 |
| agent-team-orchestration | clawhub | 多 agent 团队编排 |
| context7-docs | clawhub | 实时代码文档查询 |
| brainstorming | clawhub | 创意工作前的需求探索 |
| skill-creator | clawhub | 创建新 skill 指南 |
| skill-vetter | clawhub | Skill 安全审查 |

## 🎨 创作

| 技能 | 说明 |
|------|------|
| gpt-image-2-chatgpt | ChatGPT 图片生成 |
| gpt-image-2-proxy | 代理 API 图片生成 |
| nano-banana-pro | Gemini 3 Pro 图片生成 |
| video_generate | 多 provider 视频生成 |
| xiaomi-mimo-tts | 小米 MiMo 语音合成（含老马音色克隆） |
| voice-transcription | 语音转文字（硅基流动） |

## 📝 文档 & 办公

| 技能 | 说明 |
|------|------|
| feishu-doc | 飞书文档读写 |
| feishu-drive | 飞书云盘管理 |
| feishu-wiki | 飞书知识库 |
| feishu-perm | 飞书权限管理 |
| feishu-voice-sender | 飞书语音消息 |
| notion | Notion API |
| obsidian | Obsidian 笔记管理 |
| excel-xlsx | Excel 读写 |
| word-docx | Word 读写 |

## 🤖 自动化 & 运维

| 工具 | 说明 |
|------|------|
| cron | 定时任务管理 |
| healthcheck | 安全审计 & 硬化 |
| workspace-tools MCP | 8 工具（系统仪表盘、健康检查、Git 摘要、快速笔记、cron/subagent 状态） |
| auto-updater | Skill 自动更新 |

## 🧠 自我进化

| 技能 | 说明 |
|------|------|
| self-improvement | 错误记录 & 自修复 |
| self-improving-proactive-agent | 主动工作 + 记忆恢复 |
| memory | 无限分类记忆存储 |
| humanizer | 去除 AI 味文字 |

## 📞 通讯 & 其他

| 技能 | 说明 |
|------|------|
| pollyreach | AI 电话 |
| qqbot-channel | QQ 频道管理 |
| qqbot-media | QQ 富媒体 |
| qqbot-remind | QQ 定时提醒 |
| tmux | 远程控制 tmux |

## 🛠️ MCP 服务器

| 服务器 | 工具数 | 说明 |
|--------|--------|------|
| subagent-dispatcher | 11 | Subagent 团队调度 |
| workspace-tools | 8 | 老马工具箱 |
| douyin | 5 | 抖音视频解析 |
| exa | 2 | 全网搜索 |

## 🌐 Agent Reach 渠道 (8/16)

| 渠道 | 状态 |
|------|------|
| 任意网页 | ✅ |
| YouTube | ✅ |
| B站 | ✅ |
| 微信公众号 | ✅ |
| RSS/Atom | ✅ |
| 全网搜索 | ✅ |
| 抖音 | ✅ |
| 小红书 | ✅ |
| Twitter | ⏳ 需 Cookie |
| Reddit | ⏳ 需 rdt-cli |
| 微博 | ⏳ |
| LinkedIn | ⏳ |
| 雪球 | ⏳ |
| 小宇宙播客 | ⏳ 需 Groq Key |

## 🐴 MiMo TTS 音色

- **老马 (laoma)** — 老张音色克隆
  - 参考音频: `skills/xiaomi-mimo-tts/voices/laoma-ref.wav`
  - 模型: `mimo-v2.5-tts-voiceclone`

## API Key 环境变量

| 变量 | 用途 |
|------|------|
| KIMI_KEY | Kimi 搜索 |
| MIMO_KEY | 小米 MiMo TTS |
| SILICONFLOW_API_KEY | 语音转文字 |
| GITHUB_PERSONAL_ACCESS_TOKEN | GitHub 操作 |
| CONTEXT7_KEY | Context7 文档查询 |
| ANTHROPIC_AUTH_TOKEN | Anthropic API |
| API_YI_KEY | 零一万物 API |
