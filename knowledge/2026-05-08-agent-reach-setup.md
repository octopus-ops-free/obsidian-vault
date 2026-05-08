# Agent Reach 安装与配置指南

## 已安装渠道

| 渠道 | 工具 | 状态 |
|------|------|------|
| 任意网页 | Jina Reader (`curl https://r.jina.ai/URL`) | ✅ |
| YouTube | yt-dlp | ✅ |
| B站 | yt-dlp | ✅ |
| 微信公众号 | Exa MCP | ✅ |
| RSS/Atom | feedparser | ✅ |
| 全网搜索 | Exa MCP (免费) | ✅ |
| 抖音 | douyin-mcp-server (port 18070) | ✅ 基础解析 |
| 小红书 | xiaohongshu-cli (xhs) | ✅ |

## 待配置渠道

- Twitter: 需要 Cookie
- Reddit: 需要 rdt-cli + Cookie
- LinkedIn: 需要浏览器登录
- 微博: 网络可达即可
- gh CLI: 需要代理下载

## 关键配置文件

- 小红书 Cookie: `/root/.xiaohongshu-cli/cookies.json`
- Agent Reach Cookie: `/root/.agent-reach/xhs-cookies.json`
- 抖音 MCP 启动脚本: `~/.agent-reach/tools/start-douyin.sh`
- mcporter 配置: `config/mcporter.json`
- 抖音 MCP 服务: `127.0.0.1:18070`

## DashScope API Key

抖音语音识别需要 `DASHSCOPE_API_KEY`（阿里云百炼），待配置。
