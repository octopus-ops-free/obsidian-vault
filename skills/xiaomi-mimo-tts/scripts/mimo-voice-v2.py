#!/usr/bin/env python3
"""
MiMo VoiceClone & VoiceDesign v2
支持 TTS / VoiceClone / VoiceDesign 三种模式
"""

import sys, os, json, base64, argparse, urllib.request, mimetypes

API_BASE = "https://api.xiaomimimo.com/v1/chat/completions"

def get_api_key():
    # 优先级: 环境变量 > bashrc > openclaw config
    key = os.environ.get("XIAOMI_API_KEY") or os.environ.get("MIMO_API_KEY") or os.environ.get("MIMO_KEY")
    if not key:
        try:
            with open(os.path.expanduser("~/.bashrc")) as f:
                for line in f:
                    for var in ["XIAOMI_API_KEY", "MIMO_API_KEY", "MIMO_KEY"]:
                        if var in line and "=" in line:
                            key = line.split("=", 1)[-1].strip().strip('"').strip("'")
                            if key: break
        except: pass
    return key

def call_api(payload, api_key):
    req = urllib.request.Request(API_BASE,
        data=json.dumps(payload).encode("utf-8"),
        headers={"Authorization": f"Bearer {api_key}", "Content-Type": "application/json"})
    with urllib.request.urlopen(req, timeout=120) as resp:
        return json.loads(resp.read().decode("utf-8"))

def extract_audio(response, output_path):
    if "choices" in response and response["choices"]:
        audio_b64 = response["choices"][0].get("message", {}).get("audio", {}).get("data", "")
        if audio_b64:
            audio_bytes = base64.b64decode(audio_b64)
            with open(output_path, "wb") as f:
                f.write(audio_bytes)
            print(f"✅ {output_path} ({len(audio_bytes)} bytes)")
            return True
    print(f"❌ API Error: {json.dumps(response, ensure_ascii=False)[:300]}", file=sys.stderr)
    return False

def voice_clone(audio_path, text, instruction, output, api_key):
    mime = mimetypes.guess_type(audio_path)[0] or "audio/wav"
    with open(audio_path, "rb") as f:
        audio_b64 = base64.b64encode(f.read()).decode("utf-8")
    payload = {
        "model": "mimo-v2.5-tts-voiceclone",
        "messages": [
            {"role": "user", "content": instruction or "请用参考音频的音色朗读"},
            {"role": "assistant", "content": text}
        ],
        "audio": {"format": "wav", "voice": f"data:{mime};base64,{audio_b64}"}
    }
    print(f"🎤 VoiceClone: {os.path.basename(audio_path)}")
    return extract_audio(call_api(payload, api_key), output)

def voice_design(description, text, output, api_key):
    payload = {
        "model": "mimo-v2.5-tts-voicedesign",
        "messages": [
            {"role": "user", "content": description},
            {"role": "assistant", "content": text}
        ],
        "audio": {"format": "wav"}
    }
    print(f"🎨 VoiceDesign: {description[:40]}...")
    return extract_audio(call_api(payload, api_key), output)

def simple_tts(text, voice, style, output, api_key):
    if style:
        text = f"<style>{style}</style>{text}"
    payload = {
        "model": "mimo-v2-tts",
        "messages": [
            {"role": "user", "content": "请朗读"},
            {"role": "assistant", "content": text}
        ],
        "audio": {"format": "wav", "voice": voice or "mimo_default"}
    }
    print(f"🔊 TTS: {text[:50]}...")
    return extract_audio(call_api(payload, api_key), output)

def main():
    parser = argparse.ArgumentParser()
    sub = parser.add_subparsers(dest="cmd")
    
    p = sub.add_parser("clone")
    p.add_argument("--audio", "-a", required=True)
    p.add_argument("--text", "-t", required=True)
    p.add_argument("--instruction", "-i", default="")
    p.add_argument("--output", "-o", default="output.wav")
    
    p = sub.add_parser("design")
    p.add_argument("--description", "-d", required=True)
    p.add_argument("--text", "-t", required=True)
    p.add_argument("--output", "-o", default="output.wav")
    
    p = sub.add_parser("tts")
    p.add_argument("--text", "-t", required=True)
    p.add_argument("--voice", "-v", default="mimo_default")
    p.add_argument("--style", "-s", default="")
    p.add_argument("--output", "-o", default="output.wav")
    
    args = parser.parse_args()
    if not args.cmd:
        parser.print_help(); sys.exit(1)
    
    api_key = get_api_key()
    if not api_key:
        print("❌ No API Key", file=sys.stderr); sys.exit(1)
    
    if args.cmd == "clone":
        voice_clone(args.audio, args.text, args.instruction, args.output, api_key)
    elif args.cmd == "design":
        voice_design(args.description, args.text, args.output, api_key)
    elif args.cmd == "tts":
        simple_tts(args.text, args.voice, args.style, args.output, api_key)

if __name__ == "__main__":
    main()
