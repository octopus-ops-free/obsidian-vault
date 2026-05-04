#!/usr/bin/env node
// Subagent MCP Server — registers call_subagent_xxx tools
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { z } from "zod";
import { readFileSync, readdirSync, existsSync } from "fs";
import { resolve, dirname, join } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const SUBAGENTS_DIR = resolve(__dirname, "..");

// ---- YAML parser (minimal, supports our registry format) ----
function parseYaml(text) {
  const lines = text.split("\n");
  const result = { subagents: {} };
  let currentAgent = null;
  let currentSection = null;
  let listItems = [];

  for (const line of lines) {
    const trimmed = line.trimEnd();
    if (!trimmed || trimmed.startsWith("#")) continue;

    const indent = trimmed.length - trimmed.trimStart().length;
    const content = trimmed.trim();

    // Top-level key
    if (indent === 0 && content.endsWith(":")) {
      continue;
    }

    // Subagent key (e.g., "  dev:frontend-react:")
    if (indent === 2 && content.endsWith(":") && !content.includes(" ")) {
      if (currentAgent && currentSection) {
        result.subagents[currentAgent][currentSection] = listItems;
        listItems = [];
      }
      currentAgent = content.slice(0, -1);
      currentSection = null;
      result.subagents[currentAgent] = {};
      continue;
    }

    // Property (e.g., "    tool_name: call_subagent_dev_frontend_react")
    if (indent === 4 && content.includes(":")) {
      if (currentSection && listItems.length > 0) {
        result.subagents[currentAgent][currentSection] = listItems;
        listItems = [];
        currentSection = null;
      }
      const colonIdx = content.indexOf(":");
      const key = content.slice(0, colonIdx).trim();
      let val = content.slice(colonIdx + 1).trim();
      if (val === "true") val = true;
      else if (val === "false") val = false;
      else if (val.startsWith('"') && val.endsWith('"')) val = val.slice(1, -1);
      else if (val.startsWith("'") && val.endsWith("'")) val = val.slice(1, -1);
      result.subagents[currentAgent][key] = val;
      continue;
    }

    // List item (e.g., "    - frontend")
    if (indent === 4 && content.startsWith("- ")) {
      if (!currentSection) {
        // Look back to find section name
        const prevIdx = lines.indexOf(trimmed);
        for (let i = prevIdx - 1; i >= 0; i--) {
          const pl = lines[i].trim();
          if (pl.endsWith(":") && !pl.startsWith("-")) {
            currentSection = pl.slice(0, -1);
            break;
          }
        }
      }
      listItems.push(content.slice(2));
      continue;
    }
  }

  // Flush last section
  if (currentAgent && currentSection && listItems.length > 0) {
    result.subagents[currentAgent][currentSection] = listItems;
  }

  return result;
}

// ---- Load registry ----
function loadRegistry() {
  const registryPath = resolve(SUBAGENTS_DIR, "registry.yaml");
  const content = readFileSync(registryPath, "utf-8");
  return parseYaml(content);
}

// ---- Read file helper ----
function readFileSafe(path) {
  try {
    return readFileSync(path, "utf-8");
  } catch {
    return "";
  }
}

// ---- Build full prompt for a subagent ----
function buildSubagentPrompt(agentName, config, userTask) {
  const parts = [];

  // System prompt
  if (config.prompts) {
    const promptPath = resolve(SUBAGENTS_DIR, config.prompts);
    const systemPrompt = readFileSafe(promptPath);
    if (systemPrompt) {
      parts.push(systemPrompt);
    }
  }

  // Knowledge files
  if (config.knowledge && Array.isArray(config.knowledge)) {
    for (const kPath of config.knowledge) {
      const fullPath = resolve(SUBAGENTS_DIR, kPath);
      const knowledge = readFileSafe(fullPath);
      if (knowledge) {
        parts.push(`\n--- 参考知识: ${kPath} ---\n${knowledge}`);
      }
    }
  }

  parts.push(`\n--- 当前任务 ---\n${userTask}`);

  return parts.join("\n\n");
}

// ---- Create server ----
const server = new McpServer({
  name: "subagent-dispatcher",
  version: "1.0.0",
});

// ---- Load and register tools ----
const registry = loadRegistry();

for (const [agentName, config] of Object.entries(registry.subagents)) {
  if (config.enabled === false) continue;

  const toolName = config.tool_name || `call_subagent_${agentName.replace(/:/g, "_")}`;
  const description = config.description || `调用 ${agentName} subagent`;

  server.tool(
    toolName,
    description,
    {
      task: z.string().describe("需要 subagent 完成的任务描述"),
    },
    async ({ task }) => {
      const fullPrompt = buildSubagentPrompt(agentName, config, task);

      return {
        content: [
          {
            type: "text",
            text: `🎯 Subagent: ${agentName}\n📝 Tool: ${toolName}\n\n请使用 sessions_spawn 启动此 subagent，将以下内容作为 task 参数：\n\n---\n${fullPrompt}`,
          },
        ],
      };
    }
  );
}

// ---- Start server ----
async function main() {
  const transport = new StdioServerTransport();
  await server.connect(transport);
  console.error(`Subagent MCP Server started. Registered ${Object.keys(registry.subagents).filter(k => registry.subagents[k].enabled !== false).length} tools.`);
}

main().catch(console.error);
