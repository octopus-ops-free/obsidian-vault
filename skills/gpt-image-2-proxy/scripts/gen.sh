#!/usr/bin/env bash
# GPT Image 2 代理版生图脚本
# 通过 API 代理调用 OpenAI GPT Image 2 生成图片
#
# Usage:
#   gen.sh --prompt "描述" --out output.png [--size 1024x1024] [--quality high]

set -euo pipefail

PROMPT=""
OUT=""
SIZE="1024x1536"
QUALITY="high"

while [[ $# -gt 0 ]]; do
  case "$1" in
    --prompt)   PROMPT="$2"; shift 2 ;;
    --out)      OUT="$2"; shift 2 ;;
    --size)     SIZE="$2"; shift 2 ;;
    --quality)  QUALITY="$2"; shift 2 ;;
    -h|--help)  echo "Usage: gen.sh --prompt \"描述\" --out output.png [--size 1024x1024] [--quality high]"; exit 0 ;;
    *) echo "Unknown arg: $1" >&2; exit 1 ;;
  esac
done

[[ -z "$PROMPT" ]] && { echo "Missing --prompt" >&2; exit 1; }
[[ -z "$OUT" ]]    && { echo "Missing --out" >&2; exit 1; }

# 从环境变量或配置文件获取配置
BASE_URL="${ANTHROPIC_BASE_URL:-}"
TOKEN="${ANTHROPIC_AUTH_TOKEN:-}"

# 如果环境变量为空，尝试从 .bashrc 读取
if [[ -z "$BASE_URL" ]]; then
  BASE_URL=$(grep 'ANTHROPIC_BASE_URL' ~/.bashrc 2>/dev/null | cut -d'"' -f2 || true)
fi
if [[ -z "$TOKEN" ]]; then
  TOKEN=$(grep 'ANTHROPIC_AUTH_TOKEN' ~/.bashrc 2>/dev/null | cut -d'"' -f2 || true)
fi

[[ -z "$BASE_URL" ]] && { echo "ANTHROPIC_BASE_URL not set" >&2; exit 1; }
[[ -z "$TOKEN" ]]    && { echo "ANTHROPIC_AUTH_TOKEN not set" >&2; exit 1; }

echo "Generating image with GPT Image 2..."
echo "Prompt: ${PROMPT:0:80}..."
echo "Size: $SIZE | Quality: $QUALITY"

RESPONSE=$(curl -s "$BASE_URL/v1/images/generations" \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d "{
    \"model\": \"gpt-image-2\",
    \"prompt\": $(python3 -c "import json; print(json.dumps('$PROMPT'))"),
    \"n\": 1,
    \"size\": \"$SIZE\",
    \"quality\": \"$QUALITY\"
  }")

# 解析响应
python3 -c "
import json, base64, sys

data = json.loads('''$RESPONSE''')

if 'error' in data:
    print(f\"Error: {data['error'].get('message', 'Unknown')}\", file=sys.stderr)
    sys.exit(1)

if 'data' in data and data['data']:
    item = data['data'][0]
    if 'b64_json' in item:
        img_bytes = base64.b64decode(item['b64_json'])
        with open('$OUT', 'wb') as f:
            f.write(img_bytes)
        print(f'Saved: $OUT ({len(img_bytes)} bytes)')
    elif 'url' in item:
        print(f'URL: {item[\"url\"]}')
    else:
        print('No image data in response', file=sys.stderr)
        sys.exit(1)
else:
    print('Unexpected response format', file=sys.stderr)
    sys.exit(1)
"

echo "Done!"
