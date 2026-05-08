# Codex Pets 桌面宠物 — 技术调研 & 实现方案

> 创建: 2026-05-08 | 作者: 老马
> 参考: OpenAI Codex Pets (商业版) + openai/codex 开源项目

---

## 1. 背景

OpenAI 在 2026 年推出了 **Codex Pets** 功能——一个悬浮在桌面上的动画小宠物，实时反映 AI Agent 的工作状态。核心价值：

> *"宠物有用不是因为可爱，而是因为它把后台不可见的工作变成了扫一眼就能看懂的状态。"*

### 与开源 Codex 的关系

| | 开源 `openai/codex` (⭐80.8K) | Codex Pets (商业版) |
|---|---|---|
| 形态 | 终端 TUI (Rust + Node.js) | 桌面悬浮窗 |
| 代码 | ✅ 开源 | ❌ 闭源 |
| 功能 | 编码 Agent | 状态指示器 + 萌宠 |
| 动画 | TUI 内 ASCII 帧动画 | 桌面 overlay 动画 |

**结论**：开源版没有桌宠功能，需要自己实现。

---

## 2. Codex Pets 功能分析

### 2.1 状态指示

| 状态 | 视觉表现 | 含义 |
|------|---------|------|
| 🔄 Working | 动画循环 | Agent 正在处理 |
| ⏳ Waiting | 红色时钟 + 眨眼 | 等待用户确认/审批 |
| ✅ Done | 绿色对勾 + 庆祝动画 | 任务完成 |
| 💭 Thought | 气泡消息 | 显示当前在做什么 |

### 2.2 宠物系统

- **8 个内置宠物**：默认蓝色"Codex"、鸭子 Dewey、太空 Rocky、BSOD 怀旧、猫、狗等
- **自定义宠物** (`/hatch`)：AI 生成，支持风格描述、照片 pet 化
- **社区创作**：悟空、派大星、回形针、Sam Altman 等

### 2.3 控制方式

| 操作 | 方法 |
|------|------|
| 开关宠物 | `/pet` 命令 |
| 生成自定义宠物 | `/hatch` + 描述 |
| 唤醒/收回 | Settings → Appearance |
| 快捷键 | `Cmd+K` (Mac) / `Ctrl+K` (Win) |

### 2.4 平台支持

| 平台 | 支持程度 | 说明 |
|------|---------|------|
| macOS | ✅ 完整 | Dynamic Island 风格悬浮 API |
| Windows | ✅ 基础 | 动画深度有限 |
| Linux | ⚠️ 有限 | 基础功能 |

---

## 3. 实现方案

### 3.1 技术选型总览

```
推荐方案：Tauri (Rust 壳) + React/Vue (WebView)
次选方案：Electron + React
轻量方案：纯 Web (Canvas + CSS)
```

### 3.2 方案一：Web 端（最轻量）

**适用场景**：已有 Web 应用，想嵌入宠物组件

**技术栈**：
- 渲染：Canvas 2D / PixiJS / 纯 CSS Sprite
- 动画：Lottie (AE 导出 JSON) 或帧动画
- 状态同步：WebSocket / SSE
- 拖拽：Pointer Events API

**核心组件结构**：
```
src/
├── components/
│   ├── Pet/
│   │   ├── PetCanvas.tsx          # Canvas 渲染引擎
│   │   ├── PetSprite.ts           # 精灵图管理
│   │   ├── PetStateMachine.ts     # 状态机
│   │   ├── ThoughtBubble.tsx      # 思考气泡
│   │   └── PetContextMenu.tsx     # 右键菜单
│   └── PetOverlay/
│       ├── PetOverlay.tsx         # 悬浮窗容器
│       ├── useDraggable.ts        # 拖拽 Hook
│       └── useAgentStatus.ts      # Agent 状态订阅
├── assets/
│   └── pets/
│       ├── default/
│       │   ├── idle.png           # 待机帧
│       │   ├── working.png        # 工作帧
│       │   ├── waiting.png        # 等待帧
│       │   └── done.png           # 完成帧
│       └── custom/
│           └── ...                # 用户自定义宠物
└── types/
    └── pet.ts                     # 类型定义
```

**关键代码**：

```typescript
// types/pet.ts
interface AgentStatus {
  state: 'idle' | 'working' | 'waiting' | 'done' | 'error';
  message?: string;        // "正在分析代码..."
  progress?: number;       // 0-100
  taskName?: string;       // 当前任务名
}

interface PetConfig {
  id: string;
  name: string;
  spriteSheet: string;     // 精灵图 URL
  frameWidth: number;
  frameHeight: number;
  animations: Record<AgentStatus['state'], FrameRange>;
}

interface FrameRange {
  start: number;
  end: number;
  fps: number;
  loop: boolean;
}
```

```tsx
// components/Pet/PetCanvas.tsx
import { useRef, useEffect } from 'react';

function PetCanvas({ config, status, size = 128 }: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const spriteRef = useRef<HTMLImageElement | null>(null);
  const frameRef = useRef(0);

  useEffect(() => {
    const img = new Image();
    img.src = config.spriteSheet;
    img.onload = () => { spriteRef.current = img; };
  }, [config.spriteSheet]);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');
    if (!ctx || !spriteRef.current) return;

    const anim = config.animations[status.state];
    let frame = anim.start;
    const interval = 1000 / anim.fps;

    const timer = setInterval(() => {
      ctx.clearRect(0, 0, size, size);
      // 从精灵图中裁剪当前帧
      ctx.drawImage(
        spriteRef.current!,
        frame * config.frameWidth, 0,
        config.frameWidth, config.frameHeight,
        0, 0, size, size
      );
      frame = frame >= anim.end
        ? (anim.loop ? anim.start : anim.end)
        : frame + 1;
      frameRef.current = frame;
    }, interval);

    return () => clearInterval(timer);
  }, [config, status.state, size]);

  return <canvas ref={canvasRef} width={size} height={size} />;
}
```

```tsx
// components/Pet/PetOverlay.tsx
function PetOverlay({ agentStatus }: { agentStatus: AgentStatus }) {
  const { position, onPointerDown } = useDraggable({ x: 100, y: 100 });
  const [showBubble, setShowBubble] = useState(true);

  return (
    <div
      style={{
        position: 'fixed',
        left: position.x,
        top: position.y,
        zIndex: 9999,
        cursor: 'grab',
        userSelect: 'none',
      }}
      onPointerDown={onPointerDown}
    >
      <PetCanvas config={currentPet} status={agentStatus} />
      {showBubble && agentStatus.message && (
        <ThoughtBubble
          message={agentStatus.message}
          progress={agentStatus.progress}
        />
      )}
    </div>
  );
}
```

```typescript
// hooks/useAgentStatus.ts
function useAgentStatus(wsUrl: string): AgentStatus {
  const [status, setStatus] = useState<AgentStatus>({ state: 'idle' });

  useEffect(() => {
    const ws = new WebSocket(wsUrl);
    ws.onmessage = (event) => {
      const data = JSON.parse(event.data);
      if (data.type === 'agent_status') {
        setStatus(data.payload);
      }
    };
    ws.onclose = () => setStatus({ state: 'idle' });
    return () => ws.close();
  }, [wsUrl]);

  return status;
}
```

**推荐库**：

| 库 | 用途 | 优势 |
|---|---|---|
| PixiJS | 2D 渲染引擎 | 性能好，WebGL 加速 |
| Lottie (lottie-web) | AE 动画播放 | 设计师友好，JSON 格式 |
| framer-motion | React 动画 | 声明式 API |
| react-draggable | 拖拽 | 简单好用 |

### 3.3 方案二：桌面端 — Electron

**适用场景**：已有 Electron 应用

```javascript
// main.js — 创建透明悬浮窗
const { BrowserWindow } = require('electron');

function createPetWindow() {
  const petWin = new BrowserWindow({
    width: 200,
    height: 200,
    transparent: true,       // 透明背景
    frame: false,            // 无边框
    alwaysOnTop: true,       // 永远置顶
    skipTaskbar: true,       // 不占任务栏
    resizable: false,
    hasShadow: false,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
    },
  });

  petWin.loadFile('pet.html');
  petWin.setIgnoreMouseEvents(false); // 需要接收拖拽
  return petWin;
}

// 主进程 ↔ 宠物窗口通信
ipcMain.on('agent-status', (event, status) => {
  petWin?.webContents.send('status-update', status);
});
```

### 3.4 方案三：桌面端 — Tauri（推荐 ⭐）

**优势**：Rust 性能 + Web 技术，比 Electron 小 10x+

```rust
// src-tauri/src/main.rs
use tauri::Manager;

fn main() {
    tauri::Builder::default()
        .setup(|app| {
            // 创建宠物窗口
            let pet_window = tauri::WindowBuilder::new(
                app,
                "pet",                    // 窗口标签
                tauri::WindowUrl::App("pet.html".into())
            )
            .transparent(true)            // 透明
            .decorations(false)           // 无边框
            .always_on_top(true)          // 置顶
            .skip_taskbar(true)           // 不占任务栏
            .inner_size(200.0, 200.0)
            .build()?;
            
            Ok(())
        })
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
```

```jsonc
// tauri.conf.json
{
  "app": {
    "windows": [
      {
        "label": "main",
        "title": "My App",
        "width": 1200,
        "height": 800
      },
      {
        "label": "pet",
        "title": "Pet",
        "width": 200,
        "height": 200,
        "transparent": true,
        "decorations": false,
        "alwaysOnTop": true,
        "skipTaskbar": true,
        "visible": false
      }
    ]
  }
}
```

**Tauri ↔ Agent 状态同步**：
```rust
// Rust 侧接收 Agent 状态，转发给宠物窗口
#[tauri::command]
fn update_agent_status(window: tauri::Window, status: AgentStatus) {
    if let Some(pet_win) = window.get_window("pet") {
        pet_win.emit("status-change", status).unwrap();
    }
}
```

```typescript
// 前端侧监听状态
import { listen } from '@tauri-apps/api/event';

listen<AgentStatus>('status-change', (event) => {
  updatePetAnimation(event.payload.state);
});
```

### 3.5 方案四：统一架构（Web + 桌面）

**核心思想**：宠物逻辑写一次，Web 和桌面共用

```
┌──────────────────────────────────────────────┐
│                  共享层                        │
│  ┌──────────┐ ┌──────────┐ ┌───────────────┐ │
│  │ 状态机    │ │ 精灵渲染  │ │ 交互 (拖拽等) │ │
│  └──────────┘ └──────────┘ └───────────────┘ │
├────────────────────┬─────────────────────────┤
│     Web 适配层      │     Tauri 适配层         │
│  - DOM 事件        │  - Tauri event          │
│  - WebSocket       │  - Rust IPC             │
│  - localStorage    │  - 文件系统               │
└────────────────────┴─────────────────────────┘
```

---

## 4. 状态机设计

```typescript
// 状态流转图
//
//   ┌──────┐  agent 开始工作  ┌──────────┐
//   │ idle │ ───────────────→ │ working  │
//   └──┬───┘                  └────┬─────┘
//      ↑                           │
//      │ 超时/完成                  │ 需要确认
//      │                           ↓
//   ┌──────┐  用户确认后    ┌──────────┐
//   │ done │ ←───────────── │ waiting  │
//   └──────┘                └──────────┘
//      │
//      │ 3秒后自动
//      ↓
//   ┌──────┐
//   │ idle │
//   └──────┘

type PetState = 'idle' | 'working' | 'waiting' | 'done' | 'error';

const transitions: Record<PetState, PetState[]> = {
  idle:    ['working'],
  working: ['waiting', 'done', 'error', 'idle'],
  waiting: ['working', 'done', 'idle'],
  done:    ['idle', 'working'],
  error:   ['idle', 'working'],
};
```

---

## 5. 资源制作指南

### 5.1 精灵图规格

| 规格 | 推荐值 |
|------|--------|
| 单帧尺寸 | 128×128 或 64×64 |
| 每状态帧数 | 4-8 帧 |
| 状态数 | 5 (idle/working/waiting/done/error) |
| 总帧数 | 20-40 帧 |
| 格式 | PNG (透明背景) |
| 排列 | 水平排列精灵图 |

### 5.2 精灵图示例

```
[帧0][帧1][帧2][帧3] | [帧4][帧5][帧6][帧7] | ...
←── idle (4帧) ───→  ←── working (4帧) ──→
```

### 5.3 获取动画资源

| 来源 | 说明 |
|------|------|
| LottieFiles | 免费 AE 动画，可导出精灵图 |
| itch.io | 游戏素材，像素宠物多 |
| 自己画 | Aseprite (像素) / Figma (矢量) |
| AI 生成 | 用图片生成模型出帧动画 |

---

## 6. 增强功能

### 6.1 自定义宠物

```typescript
// /hatch 命令实现
async function hatchPet(description: string): Promise<PetConfig> {
  // 1. 用 AI 生成宠物描述
  const style = await generatePetStyle(description);
  
  // 2. 用图片模型生成精灵图
  const spriteSheet = await generateSpriteSheet({
    style,
    frameCount: 4,
    states: ['idle', 'working', 'waiting', 'done'],
  });
  
  // 3. 保存为自定义宠物
  return {
    id: crypto.randomUUID(),
    name: style.name,
    spriteSheet: spriteSheet.url,
    frameWidth: 128,
    frameHeight: 128,
    animations: style.animations,
  };
}
```

### 6.2 交互增强

- **拖拽**：Pointer Events，记住位置到 localStorage
- **右键菜单**：切换宠物、设置、关闭
- **点击展开**：显示 Agent 当前任务详情
- **双击**：打开 Agent 界面
- **多显示器**：限制在当前屏幕范围内

### 6.3 音效（可选）

- 状态切换时播放音效（轻柔提示音）
- 点击宠物时播放互动音
- 任务完成时播放庆祝音

---

## 7. 已知问题 & 注意事项

| 问题 | 说明 | 解决方案 |
|------|------|---------|
| 透明窗口兼容性 | 部分 Linux WM 不支持 | 降级为普通窗口 + 背景色 |
| 高 DPI 缩放 | 精灵图模糊 | @2x 资源 + devicePixelRatio |
| 性能 | Canvas 频繁重绘 | requestAnimationFrame + 变化检测 |
| 多窗口冲突 | 宠物可能遮挡内容 | 鼠标穿透模式 toggle |
| Sprite clipping | 宠物渲染裁切 (Codex 已知 bug) | 边界检测 + 重绘 |

---

## 8. 推荐实现路径

### Phase 1: Web MVP (1-2天)
- [ ] React 组件 + Canvas 渲染
- [ ] 4 状态动画（用现成像素宠物）
- [ ] WebSocket 状态同步
- [ ] 拖拽移动

### Phase 2: 增强 (3-5天)
- [ ] 多宠物切换
- [ ] 思考气泡
- [ ] 右键菜单
- [ ] 位置记忆 (localStorage)

### Phase 3: 桌面版 (1周)
- [ ] Tauri 套壳
- [ ] 透明窗口 + 置顶
- [ ] Rust ↔ Web 状态同步
- [ ] 系统托盘控制

### Phase 4: 高级功能 (持续)
- [ ] /hatch 自定义宠物
- [ ] 社区宠物市场
- [ ] 音效系统
- [ ] 多 Agent 多宠物

---

## 9. 参考资料

- [openai/codex](https://github.com/openai/codex) — 开源 Codex (Rust TUI)
- [Tauri](https://tauri.app/) — 桌面应用框架
- [PixiJS](https://pixijs.com/) — 2D 渲染引擎
- [Lottie](https://lottiefiles.com/) — 动画资源平台
- [Aseprite](https://www.aseprite.org/) — 像素动画工具

---

_🐴 老马出品 — 先调研后动手，方案写清楚再开干_
