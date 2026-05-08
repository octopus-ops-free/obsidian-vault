#!/usr/bin/env python3
"""
MiMo VoiceClone & VoiceDesign - 音色克隆和音色设计

VoiceClone: 上传参考音频 + 文本 → 克隆音色生成语音
VoiceDesign: 文字描述音色 → 生成全新音色语音

用法:
  # VoiceClone (克隆音色)
  python3 mimo-voice.py clone --audio ref.wav --text "要合成的文本" --output out.wav

  # VoiceDesign (设计音色)
  python3 mimo-voice.py design --description "温柔甜美的女声" --text "要合成的文本" --output out.wav

  # 普通 TTS (已有技能的简化版)
  python3 mimo-voice.py tts --text "你好世界" --output out.wav
"""

import sys
import os
import json
import base64
import argparse
import urllib.request
import mimetypes

API_BASE = "https://api.xiaomimimo.com/v1/chat/completions"

def get_api_key():
    key = os.environ.get("XIAOMI_API_KEY") or os.environ.get("MIMO_API_KEY")
    if not key:
        # 尝试从 bashrc 读取
        try:
            with open(os.path.expanduser("~/.bashrc")) as f:
                for line in f:
                    if "XIAOMI_API_KEY" in line or "MIMO_API_KEY" in line:
                        key = line.split("=", 1)[-1].strip().strip('"').strip("'")
                        if key:
                            break
        except:
            pass
    if not key:
        # 用 OpenClaw 配置的 xiaomi key
        try:
            with open(os.path.expanduser("~/.openclaw/agents/main/agent/auth-profiles.json")) as f:
                data = json.load(f)
                profile = data.get("profiles", {}).get("xiaomi:default", {})
                key = profile.get("key", "")
        except:
            pass
    return key

def call_api(payload, api_key):
    req = urllib.request.Request(
        API_BASE,
        data=json.dumps(payload).encode("utf-8"),
        headers={
            "Authorization": f"Bearer {api_key}",
            "Content-Type": "application/json"
        }
    )
    try:
        with urllib.request.urlopen(req, timeout=120) as resp:
            resp_text = resp.read().decode("utf-8")
            return json.loads(resp_text)
    except urllib.error.HTTPError as e:
        error_body = e.read().decode("utf-8", errors="replace")
        print(f"API Error {e.code}: {error_body}", file=sys.stderr)
        sys.exit(1)
    except Exception as e:
        print(f"Request failed: {e}", file=sys.stderr)
        sys.exit(1)

def extract_audio(response, output_path):
    """从 API 响应中提取音频数据"""
    if "choices" in response and response["choices"]:
        choice = response["choices"][0]
        if "message" in choice and "audio" in choice["message"]:
            audio_data = choice["message"]["audio"]
            # 可能是 base64 或 URL
            if audio_data.startswith("http"):
                # 下载音频
                urllib.request.urlretrieve(audio_data, output_path)
            else:
                # base64 解码
                if audio_data.startswith("data:"):
                    audio_data = audio_data.split(",", 1)[1]
                audio_bytes = base64.b64decode(audio_data)
                with open(output_path, "wb") as f:
                    f.write(audio_bytes)
            print(f"✅ 音频已保存: {output_path} ({os.path.getsize(output_path)} bytes)")
            return True
    # 打印完整响应用于调试
    print(f"❌ 无法提取音频，API 响应:", file=sys.stderr)
    print(json.dumps(response, ensure_ascii=False, indent=2)[:1000], file=sys.stderr)
    return False

def voice_clone(audio_path, text, instruction, output, api_key):
    """VoiceClone: 用参考音频克隆音色"""
    mime = mimetypes.guess_type(audio_path)[0] or "audio/wav"
    
    with open(audio_path, "rb") as f:
        audio_b64 = base64.b64encode(f.read()).decode("utf-8")
    
    payload = {
        "model": "mimo-v2.5-tts-voiceclone",
        "messages": [
            {"role": "user", "content": instruction or "请用参考音频的音色朗读以下文本"},
            {"role": "assistant", "content": text}
        ],
        "audio": {
            "format": "wav",
            "voice": f"data:{mime};base64,{audio_b64}"
        }
    }
    
    print(f"🎤 VoiceClone: 从 {audio_path} 克隆音色...")
    print(f"📝 文本: {text[:50]}...")
    
    response = call_api(payload, api_key)
    return extract_audio(response, output)

def voice_design(description, text, output, api_key):
    """VoiceDesign: 通过文字描述设计音色"""
    payload = {
        "model": "mimo-v2.5-tts-voicedesign",
        "messages": [
            {"role": "user", "content": description},
            {"role": "assistant", "content": text}
        ],
        "audio": {
            "format": "wav"
        }
    }
    
    print(f"🎨 VoiceDesign: 设计音色 - {description}")
    print(f"📝 文本: {text[:50]}...")
    
    response = call_api(payload, api_key)
    return extract_audio(response, output)

def simple_tts(text, voice, style, output, api_key):
    """普通 TTS"""
    if style:
        text = f"<style>{style}</style>{text}"
    
    payload = {
        "model": "mimo-v2-tts",
        "messages": [
            {"role": "user", "content": "请朗读"},
            {"role": "assistant", "content": text}
        ],
        "audio": {
            "format": "wav",
            "voice": voice or "mimo_default"
        }
    }
    
    print(f"🔊 TTS: {text[:50]}...")
    
    response = call_api(payload, api_key)
    return extract_audio(response, output)

def main():
    parser = argparse.ArgumentParser(description="MiMo VoiceClone & VoiceDesign")
    subparsers = parser.add_subparsers(dest="command", help="命令")
    
    # clone 子命令
    clone_parser = subparsers.add_parser("clone", help="音色克隆")
    clone_parser.add_argument("--audio", "-a", required=True, help="参考音频文件")
    clone_parser.add_argument("--text", "-t", required=True, help="要合成的文本")
    clone_parser.add_argument("--instruction", "-i", default="", help="导演指令（情感/风格）")
    clone_parser.add_argument("--output", "-o", default="output.wav", help="输出文件")
    
    # design 子命令
    design_parser = subparsers.add_parser("design", help="音色设计")
    design_parser.add_argument("--description", "-d", required=True, help="音色描述")
    design_parser.add_argument("--text", "-t", required=True, help="要合成的文本")
    design_parser.add_argument("--output", "-o", default="output.wav", help="输出文件")
    
    # tts 子命令
    tts_parser = subparsers.add_parser("tts", help="普通 TTS")
    tts_parser.add_argument("--text", "-t", required=True, help="要合成的文本")
    tts_parser.add_argument("--voice", "-v", default="mimo_default", help="音色")
    tts_parser.add_argument("--style", "-s", default="", help="风格")
    tts_parser.add_argument("--output", "-o", default="output.wav", help="输出文件")
    
    args = parser.parse_args()
    
    if not args.command:
        parser.print_help()
        sys.exit(1)
    
    api_key = get_api_key()
    if not api_key:
        print("❌ 未找到 API Key，请设置 XIAOMI_API_KEY 或 MIMO_API_KEY", file=sys.stderr)
        sys.exit(1)
    
    if args.command == "clone":
        if not os.path.exists(args.audio):
            print(f"❌ 参考音频不存在: {args.audio}", file=sys.stderr)
            sys.exit(1)
        voice_clone(args.audio, args.text, args.instruction, args.output, api_key)
    elif args.command == "design":
        voice_design(args.description, args.text, args.output, api_key)
    elif args.command == "tts":
        simple_tts(args.text, args.voice, args.style, args.output, api_key)

if __name__ == "__main__":
    main()
