# TOOLS.md - Local Notes

Skills define _how_ tools work. This file is for _your_ specifics — the stuff that's unique to your setup.

## What Goes Here

Things like:

- Camera names and locations
- SSH hosts and aliases
- Preferred voices for TTS
- Speaker/room names
- Device nicknames
- Anything environment-specific

## Examples

```markdown
### Cameras

- living-room → Main area, 180° wide angle
- front-door → Entrance, motion-triggered

### SSH

- home-server → 192.168.1.100, user: admin

### TTS

- Preferred voice: "Nova" (warm, slightly British)
- Default speaker: Kitchen HomePod
```

## Why Separate?

Skills are shared. Your setup is yours. Keeping them apart means you can update skills without losing your notes, and share skills without leaking your infrastructure.

---

Add whatever helps you do your job. This is your cheat sheet.

### MiMo TTS 音色

- **老马 (laoma)** — 老张音色克隆
  - 参考音频：`skills/xiaomi-mimo-tts/voices/laoma-ref.wav`
  - 声音样本：`skills/xiaomi-mimo-tts/voices/laoma-sample.wav`
  - 模型：`mimo-v2.5-tts-voiceclone`
  - 创建：2026-05-03

### MiMo TTS API

- 端点：`https://api.xiaomimimo.com/v1/chat/completions`
- Key：`MIMO_KEY`（环境变量）
- 普通 TTS：`mimo-v2-tts`
- VoiceClone：`mimo-v2.5-tts-voiceclone`
- VoiceDesign：`mimo-v2.5-tts-voicedesign`
