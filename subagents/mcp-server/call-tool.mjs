#!/usr/bin/env node
// call-tool.mjs — 通过 MCP Server 调用 subagent 工具
import { spawn } from "child_process";
import { resolve, dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const [,, toolName, task] = process.argv;

if (!toolName || !task) {
  console.error("Usage: node call-tool.mjs <tool_name> <task>");
  process.exit(1);
}

const child = spawn("node", [resolve(__dirname, "server.mjs")], {
  stdio: ["pipe", "pipe", "pipe"],
});

let stdout = "";
let stderr = "";

child.stdout.on("data", (d) => (stdout += d.toString()));
child.stderr.on("data", (d) => (stderr += d.toString()));

await new Promise((r) => setTimeout(r, 1500));

// Call the tool
const callReq = JSON.stringify({
  jsonrpc: "2.0",
  id: 1,
  method: "tools/call",
  params: {
    name: toolName,
    arguments: { task },
  },
});
child.stdin.write(callReq + "\n");

await new Promise((r) => setTimeout(r, 2000));
child.kill();

try {
  const responses = stdout.split("\n").filter(Boolean).map((l) => JSON.parse(l));
  const resp = responses.find((r) => r.id === 1);
  if (resp?.result?.content?.[0]?.text) {
    console.log(resp.result.content[0].text);
  } else if (resp?.error) {
    console.error("Error:", JSON.stringify(resp.error));
  }
} catch (e) {
  console.error("Parse error:", e.message);
  console.error("Raw stdout:", stdout);
}
