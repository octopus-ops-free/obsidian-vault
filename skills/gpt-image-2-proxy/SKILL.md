---
name: gpt-image-2-proxy
displayName: "🎨 GPT Image 2 — 通过代理 API 生成图片"
description: >
  通过 API 代理调用 OpenAI GPT Image 2 模型生成图片。
  使用 Anthropic/OpenAI 兼容代理，支持文生图、多种尺寸和质量。
emoji: "🎨"
license: MIT
---

# 🎨 GPT Image 2 — 代理版

通过 API 代理调用 OpenAI GPT Image 2 模型生成图片。

## 触发条件

当用户要求生成图片、画图、做海报时，使用此技能。

## 环境变量

```bash
export ANTHROPIC_BASE_URL="https://your-proxy.com"
export ANTHROPIC_AUTH_TOKEN="sk-your-token"
```

## 调用方式

### 文生图

```bash
bash scripts/gen.sh \
  --prompt "图片描述" \
  --out /path/to/output.png \
  [--size 1024x1024] \
  [--quality high]
```

### 尺寸选项

- `1024x1024` — 正方形（默认）
- `1024x1536` — 竖版（适合海报）
- `1536x1024` — 横版

### 质量选项

- `high` — 高质量（慢）
- `medium` — 中等（默认）

## 直接 curl 调用

```bash
curl -s "$ANTHROPIC_BASE_URL/v1/images/generations" \
  -H "Authorization: Bearer $ANTHROPIC_AUTH_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "model": "gpt-image-2",
    "prompt": "你的描述",
    "n": 1,
    "size": "1024x1536",
    "quality": "high"
  }'
```

## 注意事项

- 代理需要支持 `/v1/images/generations` 端点
- 需要有图片生成配额
- 响应格式为 `b64_json`（base64 编码的 PNG）
- token 过期需要更新

## 相关技能

- [[nano-banana-pro]] — 另一个图片生成方案（Gemini）
- [[markitdown]] — 图片转 Markdown

---

#技能 #图片生成 #GPT #API
