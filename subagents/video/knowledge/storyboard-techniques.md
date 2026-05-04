# 分镜技巧指南

## 镜头语言基础

### 景别 (Shot Size)

| 景别 | 英文 | 描述 | 适用场景 |
|------|------|------|----------|
| 大远景 | Extreme Wide | 展示环境全貌 | 开场、转场、建立空间感 |
| 远景 | Wide/Long | 人物+环境 | 场景设定 |
| 全景 | Full | 人物全身 | 动作展示 |
| 中景 | Medium | 膝盖以上 | 对话、互动 |
| 中近景 | Medium Close | 胸部以上 | 对话特写 |
| 近景 | Close-up | 肩部以上 | 情感表达 |
| 特写 | Extreme Close | 面部 | 强烈情感 |
| 大特写 | Insert/Detail | 局部细节 | 关键道具、线索 |

### 运镜 (Camera Movement)

| 运镜 | 英文 | 效果 |
|------|------|------|
| 推 | Push In/Dolly In | 聚焦、紧张感 |
| 拉 | Pull Out/Dolly Out | 揭示、距离感 |
| 摇 | Pan (水平) | 跟随、扫视 |
| 俯仰 | Tilt (垂直) | 打量、揭示 |
| 跟 | Follow | 代入感、运动 |
| 升降 | Crane/Jib | 宏大、转折 |
| 手持 | Handheld | 纪实、紧迫 |
| 稳定器 | Steadicam | 流畅跟随 |

### 构图法则

1. **三分法** — 主体放在三分线交叉点
2. **引导线** — 用线条引导视线
3. **对称构图** — 庄严、仪式感
4. **负空间** — 留白表达孤独/渺小
5. **框中框** — 门框、窗户作为画框
6. **对角线** — 动感、不稳定

## 转场设计

| 转场 | 效果 | 使用场景 |
|------|------|----------|
| 切 (Cut) | 直接、快节奏 | 最常用 |
| 叠化 (Dissolve) | 柔和、时间流逝 | 回忆、转场 |
| 淡入/淡出 | 开始/结束 | 场景起止 |
| 匹配剪辑 | 连贯、创意 | 形状/动作匹配 |
| 闪白 | 冲击、回忆 | 强转折 |
| 黑场 | 停顿、重量 | 重大事件后 |

## 节奏控制

### 快剪 (Rapid Editing)
- 镜头时长: 0.5-2 秒
- 场景: 动作、追逐、紧张
- 技巧: 动作连贯、声音先导

### 长镜头 (Long Take)
- 镜头时长: 30 秒以上
- 场景: 沉浸、写实、人物内心
- 技巧: 运镜代替剪辑

### 蒙太奇 (Montage)
- 快速切换多场景
- 场景: 时间压缩、信息密集
- 技巧: 主题统一、音乐驱动

## AI 视频分镜提示词格式

```
镜头 [序号]:
prompt: "[运镜] [景别] of [主体], [动作], [环境], [光照], [风格], [技术参数]"
duration: [秒数]
transition: [转场类型]
audio: [音效/音乐提示]
```

### 示例

```
镜头 1:
prompt: "Cinematic wide shot of a lone astronaut standing on Mars surface, 
         looking at two moons in the sky, golden hour lighting, 
         photorealistic, 4K, 24fps, anamorphic lens flare"
duration: 5s
transition: dissolve
audio: ambient wind, distant rumble
```
