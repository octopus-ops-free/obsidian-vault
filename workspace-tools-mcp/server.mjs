#!/usr/bin/env node
// ============================================================
// 老马工具箱 MCP Server 🐴
// 系统监控 · 工作区管理 · Git 辅助 · 快速笔记
// ============================================================
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { z } from "zod";
import { execSync } from "child_process";
import { readFileSync, readdirSync, statSync, appendFileSync, existsSync, mkdirSync } from "fs";
import { resolve, join, relative } from "path";
import os from "os";

const WORKSPACE = process.env.WORKSPACE || "/root/.openclaw/workspace";
const NOTES_DIR = resolve(WORKSPACE, "data");
const NOTES_FILE = resolve(NOTES_DIR, "quick-notes.md");
const CHAR_LIMIT = 25000;

// ---- Helpers ----
function run(cmd, timeout = 8000) {
  try {
    return execSync(cmd, { timeout, encoding: "utf-8" }).trim();
  } catch (e) {
    return `ERROR: ${e.message}`;
  }
}

function truncate(str, max = CHAR_LIMIT) {
  if (!str) return "";
  if (str.length <= max) return str;
  return str.slice(0, max) + `\n... (truncated, ${str.length - max} chars omitted)`;
}

function formatBytes(bytes) {
  if (bytes < 1024) return bytes + " B";
  if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + " KB";
  if (bytes < 1024 * 1024 * 1024) return (bytes / (1024 * 1024)).toFixed(1) + " MB";
  return (bytes / (1024 * 1024 * 1024)).toFixed(2) + " GB";
}

function walkDir(dir, depth = 0, maxDepth = 3) {
  if (depth > maxDepth) return { files: 0, dirs: 0, size: 0 };
  let files = 0, dirs = 0, size = 0;
  try {
    for (const entry of readdirSync(dir, { withFileTypes: true })) {
      if (entry.name.startsWith(".") || entry.name === "node_modules" || entry.name === "__pycache__") continue;
      const full = join(dir, entry.name);
      if (entry.isDirectory()) {
        dirs++;
        const sub = walkDir(full, depth + 1, maxDepth);
        files += sub.files;
        dirs += sub.dirs;
        size += sub.size;
      } else {
        files++;
        try { size += statSync(full).size; } catch {}
      }
    }
  } catch {}
  return { files, dirs, size };
}

// ---- Server ----
const server = new McpServer({
  name: "workspace-tools",
  version: "1.0.0",
});

// ============================================================
// 🖥️ System Tools
// ============================================================

server.tool(
  "system_dashboard",
  "系统概览仪表盘：CPU、内存、磁盘、负载、运行时间。适合快速了解服务器健康状态。",
  {
    format: z.enum(["concise", "detailed"]).default("concise").describe("输出格式：concise=简洁一行，detailed=详细"),
  },
  async ({ format }) => {
    const uptime = run("uptime -p 2>/dev/null || uptime");
    const load = run("cat /proc/loadavg 2>/dev/null || uptime | awk -F'load average:' '{print $2}'");
    const memInfo = run("free -h | grep Mem");
    const memParts = memInfo.split(/\s+/);
    const diskInfo = run("df -h / | tail -1");
    const cpuCount = os.cpus().length;
    const cpuModel = os.cpus()[0]?.model || "unknown";

    if (format === "concise") {
      const diskParts = diskInfo.split(/\s+/);
      const text = `🖥️ 负载:${load.split(" ").slice(0, 3).join("/")} | 内存:${memParts[2]}/${memParts[1]} | 磁盘:${diskParts[2]}/${diskParts[1]} | ${uptime}`;
      return { content: [{ type: "text", text }] };
    }

    const text = [
      `## 🖥️ 系统概览`,
      ``,
      `**主机**: ${os.hostname()}`,
      `**系统**: ${os.type()} ${os.release()} (${os.arch()})`,
      `**CPU**: ${cpuModel} × ${cpuCount} 核`,
      `**运行时间**: ${uptime}`,
      `**负载**: ${load}`,
      ``,
      `### 内存`,
      `${memInfo}`,
      ``,
      `### 磁盘 (/)`,
      `${diskInfo}`,
    ].join("\n");

    return { content: [{ type: "text", text: truncate(text) }] };
  }
);

server.tool(
  "health_check",
  "综合健康检查：系统资源 + 关键服务 + 磁盘空间 + 网络连通性。发现异常自动标注 ⚠️。",
  {},
  async () => {
    const checks = [];

    // 1. 系统负载
    const load1 = parseFloat(run("cat /proc/loadavg").split(" ")[0]);
    const cpuCount = os.cpus().length;
    const loadStatus = load1 > cpuCount * 2 ? "⚠️ 高" : load1 > cpuCount ? "⚡ 中" : "✅ 正常";
    checks.push(`**负载**: ${loadStatus} (${load1}/${cpuCount}核)`);

    // 2. 内存
    const memLine = run("free | grep Mem");
    const [, total, , avail] = memLine.split(/\s+/);
    const memPct = ((1 - parseFloat(avail) / parseFloat(total)) * 100).toFixed(1);
    const memStatus = memPct > 90 ? "⚠️ 危险" : memPct > 75 ? "⚡ 偏高" : "✅ 正常";
    checks.push(`**内存**: ${memStatus} (已用 ${memPct}%)`);

    // 3. 磁盘
    const diskLine = run("df / | tail -1");
    const diskPct = parseInt(diskLine.split(/\s+/)[4]);
    const diskStatus = diskPct > 90 ? "⚠️ 危险" : diskPct > 75 ? "⚡ 偏高" : "✅ 正常";
    checks.push(`**磁盘**: ${diskStatus} (已用 ${diskPct}%)`);

    // 4. 关键进程
    const processes = ["openclaw", "node"];
    for (const proc of processes) {
      const count = run(`pgrep -c ${proc} 2>/dev/null || echo 0`);
      const status = parseInt(count) > 0 ? "✅ 运行中" : "❌ 未运行";
      checks.push(`**${proc}**: ${status} (进程数: ${count})`);
    }

    // 5. 网络
    const networkCheck = run("curl -s -o /dev/null -w '%{http_code}' --connect-timeout 3 https://www.baidu.com 2>/dev/null || echo '000'");
    const netStatus = networkCheck === "200" ? "✅ 正常" : "⚠️ 异常";
    checks.push(`**网络**: ${netStatus}`);

    // 6. 关键目录
    const workspaceExists = existsSync(WORKSPACE);
    checks.push(`**工作区**: ${workspaceExists ? "✅ 存在" : "❌ 缺失"}`);

    const text = `## 🏥 健康检查报告\n\n${checks.join("\n")}`;
    return { content: [{ type: "text", text }] };
  }
);

// ============================================================
// 📁 Workspace Tools
// ============================================================

server.tool(
  "workspace_overview",
  "工作区概览：目录结构、文件统计、磁盘占用、Git 状态。快速了解项目全貌。",
  {},
  async () => {
    const stats = walkDir(WORKSPACE, 0, 2);
    const gitBranch = run(`cd ${WORKSPACE} && git branch --show-current 2>/dev/null || echo "not a git repo"`);
    const gitStatus = run(`cd ${WORKSPACE} && git status --short 2>/dev/null | head -20 || echo ""`);
    const gitLastCommit = run(`cd ${WORKSPACE} && git log --oneline -3 2>/dev/null || echo "no commits"`);

    // Top-level dirs
    const topDirs = [];
    try {
      for (const entry of readdirSync(WORKSPACE, { withFileTypes: true })) {
        if (entry.isDirectory() && !entry.name.startsWith(".")) {
          const subStats = walkDir(join(WORKSPACE, entry.name), 0, 1);
          topDirs.push({ name: entry.name, ...subStats });
        }
      }
    } catch {}
    topDirs.sort((a, b) => b.size - a.size);

    const dirTable = topDirs.slice(0, 10).map(d =>
      `  ${d.name}/ — ${d.files}文件 ${d.dirs}目录 ${formatBytes(d.size)}`
    ).join("\n");

    const text = [
      `## 📁 工作区概览`,
      ``,
      `**路径**: ${WORKSPACE}`,
      `**总文件**: ${stats.files}`,
      `**总目录**: ${stats.dirs}`,
      `**总大小**: ${formatBytes(stats.size)}`,
      ``,
      `### 目录结构 (按大小排序)`,
      dirTable || "  (空)  ",
      ``,
      `### Git 状态`,
      `**分支**: ${gitBranch}`,
      gitStatus ? `**变更**:\n\`\`\`\n${gitStatus}\n\`\`\`` : "**变更**: 干净 ✅",
      ``,
      `### 最近提交`,
      `\`\`\`\n${gitLastCommit}\n\`\`\``,
    ].join("\n");

    return { content: [{ type: "text", text: truncate(text) }] };
  }
);

server.tool(
  "find_recent_files",
  "查找最近修改的文件，支持按扩展名过滤和时间范围。",
  {
    dir: z.string().default(WORKSPACE).describe("搜索目录"),
    hours: z.number().default(24).describe("最近多少小时内修改的文件"),
    ext: z.string().optional().describe("文件扩展名过滤，如 '.js,.mjs,.json'"),
    limit: z.number().default(20).describe("最多返回条数"),
  },
  async ({ dir, hours, ext, limit }) => {
    const extFilter = ext ? `\\( ${ext.split(",").map(e => `-name "*${e.trim()}"`).join(" -o ")} \\)` : "";
    const cmd = `find ${dir} -type f ${extFilter} -mtime -${hours / 24} -not -path "*/node_modules/*" -not -path "*/.git/*" -not -path "*/__pycache__/*" -printf "%T@ %Tc %p\n" 2>/dev/null | sort -rn | head -${limit}`;
    const result = run(cmd);

    if (!result || result.startsWith("ERROR")) {
      return { content: [{ type: "text", text: "📭 未找到最近修改的文件" }] };
    }

    const lines = result.split("\n").map(line => {
      const parts = line.split(" ");
      const path = parts.slice(7).join(" ");
      const relPath = relative(WORKSPACE, path);
      return `  ${relPath}`;
    });

    const text = `## 📝 最近 ${hours}h 内修改的文件 (${lines.length}个)\n\n${lines.join("\n")}`;
    return { content: [{ type: "text", text: truncate(text) }] };
  }
);

// ============================================================
// 🔧 Git Tools
// ============================================================

server.tool(
  "git_summary",
  "Git 仓库摘要：分支、状态、最近提交、远程同步状态。",
  {
    repo_dir: z.string().default(WORKSPACE).describe("Git 仓库路径"),
  },
  async ({ repo_dir }) => {
    const branch = run(`cd ${repo_dir} && git branch --show-current 2>/dev/null`);
    if (branch.startsWith("ERROR")) {
      return { content: [{ type: "text", text: "❌ 不是一个 Git 仓库" }] };
    }

    const status = run(`cd ${repo_dir} && git status --short 2>/dev/null`);
    const log = run(`cd ${repo_dir} && git log --oneline -10 --decorate 2>/dev/null`);
    const remote = run(`cd ${repo_dir} && git remote -v 2>/dev/null | head -2`);
    const diff = run(`cd ${repo_dir} && git diff --stat HEAD~3..HEAD 2>/dev/null || echo "no diff"`);
    const aheadBehind = run(`cd ${repo_dir} && git rev-list --left-right --count HEAD...@{upstream} 2>/dev/null || echo "no upstream"`);

    let syncInfo = "";
    if (!aheadBehind.startsWith("ERROR") && aheadBehind !== "no upstream") {
      const [behind, ahead] = aheadBehind.split("\t").map(Number);
      syncInfo = ahead || behind
        ? `**同步**: ↑${ahead} ahead ↓${behind} behind`
        : `**同步**: 已同步 ✅`;
    }

    const text = [
      `## 🔧 Git 摘要`,
      ``,
      `**分支**: ${branch}`,
      syncInfo,
      ``,
      status
        ? `### 变更文件\n\`\`\`\n${truncate(status, 2000)}\n\`\`\``
        : `### 变更文件\n干净 ✅`,
      ``,
      `### 最近提交\n\`\`\`\n${log}\n\`\`\``,
      remote ? `\n**远程**: ${remote.split("\n")[0]}` : "",
    ].join("\n");

    return { content: [{ type: "text", text: truncate(text) }] };
  }
);

// ============================================================
// 📝 Notes Tools
// ============================================================

server.tool(
  "quick_note",
  "快速笔记：追加一条笔记到 scratchpad，或查看最近的笔记。",
  {
    action: z.enum(["add", "read", "search"]).describe("操作：add=添加笔记，read=查看最近笔记，search=搜索"),
    content: z.string().optional().describe("笔记内容（add 时必填）"),
    query: z.string().optional().describe("搜索关键词（search 时必填）"),
    limit: z.number().default(10).describe("read 时返回最近多少条"),
  },
  async ({ action, content, query, limit }) => {
    if (!existsSync(NOTES_DIR)) mkdirSync(NOTES_DIR, { recursive: true });

    if (action === "add") {
      if (!content) {
        return { content: [{ type: "text", text: "❌ 添加笔记需要 content 参数" }] };
      }
      const ts = new Date().toLocaleString("zh-CN", { timeZone: "Asia/Shanghai" });
      const entry = `\n### ${ts}\n${content}\n`;
      appendFileSync(NOTES_FILE, entry);
      return { content: [{ type: "text", text: `✅ 笔记已保存到 quick-notes.md` }] };
    }

    if (action === "read") {
      if (!existsSync(NOTES_FILE)) {
        return { content: [{ type: "text", text: "📭 还没有任何笔记" }] };
      }
      const all = readFileSync(NOTES_FILE, "utf-8");
      const sections = all.split(/\n### /).filter(Boolean);
      const recent = sections.slice(-limit);
      const text = `## 📝 最近 ${recent.length} 条笔记\n\n${recent.map(s => `### ${s.trim()}`).join("\n\n")}`;
      return { content: [{ type: "text", text: truncate(text) }] };
    }

    if (action === "search") {
      if (!query) {
        return { content: [{ type: "text", text: "❌ 搜索需要 query 参数" }] };
      }
      if (!existsSync(NOTES_FILE)) {
        return { content: [{ type: "text", text: "📭 还没有任何笔记" }] };
      }
      const all = readFileSync(NOTES_FILE, "utf-8");
      const lines = all.split("\n");
      const matches = lines.filter(l => l.toLowerCase().includes(query.toLowerCase()));
      const text = matches.length
        ? `## 🔍 搜索 "${query}" 找到 ${matches.length} 条\n\n${matches.join("\n")}`
        : `🔍 未找到包含 "${query}" 的笔记`;
      return { content: [{ type: "text", text: truncate(text) }] };
    }

    return { content: [{ type: "text", text: "❌ 未知操作" }] };
  }
);

// ============================================================
// 📊 Cron & Subagent Tools
// ============================================================

server.tool(
  "cron_status",
  "查看定时任务状态：活跃任务列表、下次执行时间、最近执行结果。",
  {},
  async () => {
    const cronFile = resolve(os.homedir(), ".openclaw/cron/jobs.json");
    if (!existsSync(cronFile)) {
      return { content: [{ type: "text", text: "📭 未找到 cron 任务配置" }] };
    }

    try {
      const data = JSON.parse(readFileSync(cronFile, "utf-8"));
      const jobs = data.jobs || [];
      const now = Date.now();

      const lines = jobs.map(j => {
        const enabled = j.enabled !== false ? "🟢" : "🔴";
        const nextRun = j.state?.nextRunAtMs
          ? new Date(j.state.nextRunAtMs).toLocaleString("zh-CN", { timeZone: "Asia/Shanghai" })
          : "未调度";
        const lastStatus = j.state?.lastRunStatus || "未执行";
        const errors = j.state?.consecutiveErrors || 0;
        const errBadge = errors > 0 ? ` ⚠️ 连续${errors}次错误` : "";
        return `${enabled} **${j.name}** — 下次: ${nextRun} | 状态: ${lastStatus}${errBadge}`;
      });

      const text = `## ⏰ 定时任务 (${jobs.length}个)\n\n${lines.join("\n")}`;
      return { content: [{ type: "text", text: truncate(text) }] };
    } catch (e) {
      return { content: [{ type: "text", text: `❌ 读取 cron 配置失败: ${e.message}` }] };
    }
  }
);

server.tool(
  "subagent_overview",
  "查看 Subagent 注册表：已注册角色、启用状态、技能配置。",
  {},
  async () => {
    const registryFile = resolve(WORKSPACE, "subagents/registry.yaml");
    if (!existsSync(registryFile)) {
      return { content: [{ type: "text", text: "📭 未找到 subagent 注册表" }] };
    }

    const content = readFileSync(registryFile, "utf-8");
    // Simple parse - extract agent names and descriptions
    const agents = [];
    let current = null;
    for (const line of content.split("\n")) {
      const trimmed = line.trim();
      if (trimmed.match(/^[a-z]+:[a-z-]+:$/)) {
        if (current) agents.push(current);
        current = { name: trimmed.slice(0, -1), enabled: true, skills: [] };
      } else if (current) {
        if (trimmed.startsWith("enabled:")) current.enabled = trimmed.includes("true");
        if (trimmed.startsWith("description:")) current.desc = trimmed.replace("description:", "").trim().replace(/^["']|["']$/g, "");
        if (trimmed.startsWith("- ")) current.skills.push(trimmed.slice(2));
      }
    }
    if (current) agents.push(current);

    const lines = agents.map(a => {
      const status = a.enabled ? "🟢" : "🔴";
      const skills = a.skills.length ? ` [${a.skills.join(", ")}]` : "";
      return `${status} **${a.name}** — ${a.desc || "无描述"}${skills}`;
    });

    const text = `## 🤖 Subagent 团队 (${agents.length}个)\n\n${lines.join("\n")}`;
    return { content: [{ type: "text", text: truncate(text) }] };
  }
);

// ============================================================
// 🚀 Start Server
// ============================================================

async function main() {
  const transport = new StdioServerTransport();
  await server.connect(transport);
  console.error(`🐴 老马工具箱 MCP Server 启动成功`);
}

main().catch((err) => {
  console.error("Fatal:", err);
  process.exit(1);
});
