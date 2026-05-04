#!/usr/bin/env node
// test-server.mjs — 测试 MCP Server 工具注册和响应
import { spawn } from "child_process";
import { resolve, dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));

const child = spawn("node", [resolve(__dirname, "server.mjs")], {
  stdio: ["pipe", "pipe", "pipe"],
});

let stdout = "";
let stderr = "";

child.stdout.on("data", (d) => (stdout += d.toString()));
child.stderr.on("data", (d) => (stderr += d.toString()));

// Wait for server to start
await new Promise((r) => setTimeout(r, 1500));

// Send tools/list request
const listReq = JSON.stringify({
  jsonrpc: "2.0",
  id: 1,
  method: "tools/list",
  params: {},
});
child.stdin.write(listReq + "\n");

await new Promise((r) => setTimeout(r, 1000));

// Send a test tool call
const callReq = JSON.stringify({
  jsonrpc: "2.0",
  id: 2,
  method: "tools/call",
  params: {
    name: "call_subagent_dev_backend_python",
    arguments: { task: "写一个 hello world 接口" },
  },
});
child.stdin.write(callReq + "\n");

await new Promise((r) => setTimeout(r, 2000));

child.kill();

console.log("=== STDERR (server logs) ===");
console.log(stderr);
console.log("\n=== STDOUT (responses) ===");

try {
  const responses = stdout
    .split("\n")
    .filter(Boolean)
    .map((l) => JSON.parse(l));
  for (const r of responses) {
    if (r.method === "tools/list" || r.id === 1) {
      const tools = r.result?.tools || [];
      console.log(`\n✅ Registered ${tools.length} tools:`);
      tools.forEach((t) => console.log(`  - ${t.name}: ${t.description}`));
    }
    if (r.id === 2) {
      console.log("\n✅ Tool call response:");
      const text = r.result?.content?.[0]?.text;
      if (text) {
        console.log(text.slice(0, 300) + "...");
      }
    }
  }
} catch (e) {
  console.log("Raw output:", stdout.slice(0, 500));
}
