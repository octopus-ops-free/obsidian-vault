# GPT Image 2 完整工业级提示词模板库

> 来源: [freestylefly/awesome-gpt-image-2](https://github.com/freestylefly/awesome-gpt-image-2)
> 378 个案例逆向工程，18 套工业级模板，双语（中/JSON）

## 核心理念

将散文式提示词压缩为结构化协议（Prompt-as-Code），将主体、光照、材质、布局、视觉细节拆分为可组合的原子部分。

**结构化顺序：** 主体 → 动作 → 环境 → 光照 → 风格 → 技术参数

---

## 模板 1: UI 与界面

**常规模板：**
```
为[产品类型]生成一张[平台，如 iOS/Android/Web]界面图。
核心功能：[功能点A]、[功能点B]、[功能点C]。
视觉风格：[极简/科技/拟物]，主色[颜色]，强调色[颜色]。
布局：[顶部导航/双栏/卡片流]，信息层级清晰，留白充足。
输出：高保真UI截图，文字清晰可读，比例[9:16/16:9]。
```

**JSON 进阶模板：**
```json
{
  "type": "UI Screenshot",
  "platform": "iOS",
  "product": "Fitness App",
  "layout": "Card-based feed with bottom tab bar",
  "style": {
    "theme": "Dark Mode",
    "primary_color": "Neon Green",
    "typography": "Clean sans-serif"
  },
  "content": {
    "header": "Today's Activity",
    "cards": [
      {"title": "Running", "data": "5.2 km", "button": "Start"},
      {"title": "Calories", "data": "340 kcal"}
    ]
  },
  "constraints": "High fidelity, readable text, 9:16 aspect ratio"
}
```

**避坑：** 不要给模糊指令，强制文字锁定

---

## 模板 2: 图表与信息可视化

**常规模板：**
```
生成[主题]信息图，目标读者为[人群]。
结构：标题区 + [3-5]个模块（每模块含图标、短标题、1-2句说明）。
图表类型：[流程图/对比图/关系图/时间线]。
风格：[专业报告/科普插画]，主色[颜色]，背景[浅色/深色]。
输出：信息层级清晰、可读性高的中文信息图。
```

**JSON 进阶模板：**
```json
{
  "type": "Infographic",
  "topic": "Urban Metabolism",
  "audience": "General Public",
  "structure": {
    "title_area": "城市生命系统图谱",
    "layout": "Isometric cutaway, 12 numbered panels",
    "modules": [
      {"title": "能源", "icon": "lightning", "text": "Power flows"},
      {"title": "水循环", "icon": "water_drop", "text": "Water flows"}
    ]
  },
  "style": {
    "aesthetic": "Scientific atlas",
    "colors": "Low saturation, color-coded flows",
    "background": "Light paper texture"
  },
  "constraints": "No cyberpunk, no gibberish text, strict structural layout"
}
```

**避坑：** 控制模块数量，文案克制（短句优先）

---

## 模板 3: 海报与排版

### 3A 常规海报
```
设计一张[活动/产品/电影]海报，主题为[主题词]。
主视觉：[主体元素]，标题文案：[标题]，副标题：[副标题]。
版式：[居中/左对齐/对角构图]，风格：[复古/未来/极简]。
色彩：[主色 + 辅色]，氛围：[情绪关键词]。
输出：可用于社媒传播的高分辨率海报。
```

### 3B 运动商业 Campaign
```
设计一张[运动项目/健身品类]商业 Campaign 海报。
主体：[运动员/模特/产品道具]，姿态：[坐姿/冲刺/挥拍/力量动作]。
核心道具：[球拍/哑铃/球鞋/球衣]，以夸张比例或对角构图成为视觉锚点。
版式：[单张强主视觉/三联画/数据涂鸦海报]。
大字标题："[主标题]"，辅助文案："[短句/数据/精神口号]"。
视觉风格：高端运动品牌广告，强光影，反光地面，干净构图，品牌化配色[主色+辅助色]。
约束：主体清晰，文字可读，色调统一，不要杂乱拼贴，不要生成错误运动器材。
输出：1:1 或 4:5，适合社媒传播的运动商业视觉。
```

### 3C 概念字体海报
```
Create ONE finished premium conceptual typography poster for the exact title:
"[标题/词语/短句]"

Single poster only. No moodboard, grid, presentation board, mockup, captions, prompt text, process sheet, or sample labels.

The title must be the dominant visual structure of the poster: huge, readable, powerful, and spelled exactly.

Silently interpret the title's meaning, mood, cultural aura, symbolic associations. Turn that interpretation into one strong visual metaphor.

Typography is the hero. Design custom-looking letterforms whose weight, width, contrast, spacing, rhythm, distortion, negative space, edge quality express the temperament of the title.

Use a restrained 4-6 color system matched to the theme.

Composition style: high-end editorial poster, museum-quality graphic design, dramatic scale, strong hierarchy, few elements, intelligent whitespace, bold flat color areas, sharp cropping, silkscreen / lithograph / risograph grain.
```

### 3D 水墨双重曝光人物海报
```
生成一张[人物/角色]的水墨双重曝光人物海报。
画幅：9:16 竖版，高级电影海报构图。
主体结构：
- 上半区：放大的人物头部、面部轮廓或半身剪影
- 中下区：同一人物的全身或半身主体
- 剪影内部：融合[关键场景]、[象征物]、[叙事片段]
视觉连接：云雾、水墨扩散、飞白边缘、负空间
风格：东方水墨美学 + 写实电影感
约束：不要硬拼贴，不要把背景塞满，不要廉价武侠特效
```

### 3E 自然科普海报（Apple 风格）
```
9:16 竖版高级科普海报，Apple keynote 风格。
背景纯白或极浅灰白渐变，大量留白。
主体动物极度放大，占据画面 50%-70%。
底部信息区：四列极简 icon + 标题 + 短说明，细竖线分隔。
不要卡片框、圆角背景、大面积色块。
```

**避坑：** 主标题与副标题要硬编码，主体放大，信息克制

---

## 模板 4: 商品与电商

### 4A 常规商品图
```
生成[商品名]电商主图，卖点为[卖点1]、[卖点2]。
场景：[纯色棚拍/生活方式场景]，镜头：[特写/半身/全景]。
材质细节：[材质关键词]，灯光：[柔光/侧光/轮廓光]。
附加元素：[价格角标/卖点icon/促销文案]。
```

### 4B 个人化美妆推荐报告
```
输入参数：用户图像、品牌、风格偏好、推荐数量
分析层：肤色判断（冷/暖/中性）、气质判断、唇部基础
推荐层：筛选差异化色号，含色号名称、色系标签、上脸效果、推荐场景
品牌视觉层：根据品牌自动生成视觉调性，只用少量品牌强调色做点缀
版式结构：左上用户图+肤色分析 / 右上分析结论 / 中部试色矩阵 / 底部建议
```

**JSON 进阶模板：**
```json
{
  "type": "E-commerce Hero Image",
  "product": {
    "name": "Noise Cancelling Headphones",
    "material": "Matte black finish with metallic accents",
    "angle": "3/4 profile, floating slightly"
  },
  "setting": {
    "background": "Minimalist studio setup, soft gray gradient",
    "lighting": "Softbox overhead, sharp rim light on edges"
  },
  "copywriting": {
    "badges": ["NEW", "$299"],
    "slogan": "Silence the World"
  },
  "constraints": "Commercial photography quality, hyper-realistic textures"
}
```

**避坑：** 材质和光影是灵魂，促销文案只给核心 1-2 句

---

## 模板 5: 品牌与标志

### 5A 常规品牌视觉
```
为[品牌名]设计品牌视觉方案。
品牌关键词：[关键词1]、[关键词2]、[关键词3]。
包含：Logo方向[几何/字标/图形]、辅助图形、主辅色、应用示意。
```

### 5B 完整品牌身份包
```
输出：品牌战略基础 → Logo概念(3-5个方向) → 配色系统 → 字体系统 → 应用触点 → 品牌规则
```

### 5C 品牌触点系统视觉板
```
为[品牌名]生成高端品牌触点系统视觉板
触点必须包含：主产品 hero shot、包装物料、菜单卡/价目表、生活方式场景
像顶级设计机构提案页，所有触点整齐但不死板
```

**避坑：** 先做品牌战略再画 Logo，强制纯白背景

---

## 模板 6: 建筑与空间

```
生成[空间类型]设计效果图，功能定位为[用途]。
风格：[现代简约/工业/新中式]，材质：[木/石/金属/玻璃]。
光线：[自然采光/人工照明方案]，时间：[白天/夜景]。
```

**JSON 进阶模板：**
```json
{
  "type": "Architectural Visualization",
  "space": {
    "type": "Modern Cabin Interior",
    "function": "Living room",
    "materials": "Exposed concrete, large floor-to-ceiling glass, warm timber accents"
  },
  "environment": "Nestled in a dense, snowy pine forest visible through the glass",
  "camera": {
    "angle": "Eye-level perspective, wide-angle lens",
    "lighting": "Golden hour, warm interior lights glowing, cool blue ambient light outside"
  },
  "render_quality": "Unreal Engine 5 style, hyper-realistic, 8k resolution, ray tracing"
}
```

**避坑：** 用 Eye-level perspective 控制透视变形，冷暖对比提升高级感

---

## 模板 7: 摄影与写实

### 7A 常规摄影
```
拍摄主题：[人物/物品/街景]，场景为[地点]。
摄影参数风格：[35mm/85mm]，[浅景深/深景深]，[纪实/电影感]。
光线：[自然光/夜景霓虹/逆光]，情绪：[情绪词]。
```

### 7B 街头意外瞬间写实摄影
```
生成一张竖版手机纪实照片
主体呈现真实的材质状态（液体扩散/冰块散落/纸张褶皱/灰尘颗粒）
镜头：手持手机视角，略微俯拍或低角度
画面质感：raw unedited photo look，自然色彩，真实纹理
约束：不要插画、动漫、CGI、棚拍光、过度干净
```

**JSON 进阶模板：**
```json
{
  "type": "Hyper-realistic Photography",
  "subject": {
    "description": "A weary 30-year-old barista wiping a coffee cup",
    "details": "Subtle sweat on forehead, detailed skin pores, wearing a denim apron"
  },
  "setting": "Dimly lit vintage cafe, rain visible through the window behind",
  "camera_specs": {
    "gear": "Shot on Sony A7R IV, 50mm lens",
    "aperture": "f/1.4 (shallow depth of field, background completely blurred)",
    "lighting": "Cinematic lighting, neon sign reflecting on wet window"
  },
  "film_aesthetic": "Kodak Portra 400 emulation, subtle film grain"
}
```

**避坑：** 加瑕疵（皮肤纹理、胶片颗粒），用 f/1.4 代替"浅景深"

---

## 模板 8: 插画与艺术

```
创作[题材]插画，主角为[角色/主体]。
画风：[日漫/水彩/扁平/厚涂]，线条：[细腻/粗犷]。
配色：[配色方案]，背景：[简洁/复杂场景]。
```

**JSON 进阶模板：**
```json
{
  "type": "Artistic Illustration",
  "art_style": "Studio Ghibli inspired anime style",
  "scene": {
    "description": "A giant flying whale carrying a small cozy village on its back",
    "details": "Windmills turning, tiny people looking over the edge, fluffy white clouds"
  },
  "palette": "Vibrant sky blue, lush greens, soft pastel accents",
  "technique": "Cel shading, detailed background art, soft glowing magical aura",
  "mood": "Whimsical, adventurous, nostalgic"
}
```

**避坑：** 锁定笔触（厚涂/水彩晕染），提取大师特征而非直接写大师名

---

## 模板 9: 人物与角色

### 9A 常规角色设计
```
设计[角色身份]角色设定图。
外观：[年龄/发型/服饰/配件]，性格：[关键词]。
姿态：[站姿/动态动作]，表情：[情绪]。
世界观：[时代/阵营/职业]，标志性元素：[元素]。
```

### 9B 动作分解参考表
```
4×4 网格，共 16 个等尺寸面板，细线分隔，每格编号 1-16。
角色一致性：所有面板使用同一角色，保持脸型、服装、比例和发型一致。
每格结构：动作标题 + 完整身体动作姿态 + 动作说明 + 方向箭头
```

### 9C 参考图转 3D 收藏玩具
```
身份保持：保留原始人物/角色的脸部身份、主要发型、表情气质
造型比例：大头设计，五官轻微夸张，身体比例玩具化
材质：哑光 vinyl / resin / collectible figure finish
灯光与背景：柔和棚拍光，干净背景
```

**避坑：** 拆解五官（桃花眼、高鼻梁），写清服装材质（丝绸/机能防风面料）

---

## 模板 10: 场景与叙事

```
生成[故事主题]场景图，发生在[时间+地点]。
主事件：[事件描述]，主角：[角色]，冲突点：[冲突]。
镜头语言：[广角建立镜头/中景叙事/特写]。
氛围：[紧张/温暖/悬疑]，色调：[冷/暖/高反差]。
```

**JSON 进阶模板：**
```json
{
  "type": "Narrative Scene",
  "story_context": "The exact moment an ancient seal breaks",
  "environment": "Crumbling stone temple overgrown with glowing blue vines",
  "action": "A young explorer dropping their torch as a massive beam of light shoots into the sky",
  "atmosphere": {
    "mood": "Awe-inspiring, terrifying",
    "lighting": "Blinding central light casting long dramatic shadows"
  },
  "camera": "Low angle shot, emphasizing the scale of the light beam"
}
```

**避坑：** 要有"动词"让画面动起来，使用 Low angle / Dutch angle 增加戏剧冲突

---

## 模板 11: 历史与古风题材

```
生成[朝代/古风设定]题材画面，主题为[主题]。
人物：[身份/服饰/器物]，场景：[宫廷/市井/山水]。
美术风格：[工笔/写意/影视写实]，色调：[色调]。
文化细节：[纹样/礼制/建筑要素]。
```

**JSON 进阶模板：**
```json
{
  "type": "Historical/Oriental Scene",
  "setting": "Tang Dynasty Capital City at Night",
  "subject": {
    "identity": "Noblewoman",
    "clothing": "Traditional Ruqun (襦裙) with elaborate floral embroidery",
    "action": "Holding a glowing silk lantern, looking at fireworks"
  },
  "style": "Cinematic realism combined with subtle traditional ink wash textures",
  "constraints": "No modern elements, historically accurate clothing structure"
}
```

**避坑：** 明确朝代（唐/宋/明），强制 "No modern elements"

---

## 模板 12: 文档与出版物

```
制作[文档类型]。版面结构：[栏数/页边距/标题层级]。
内容模块：[封面区/正文区/图表区/脚注]。
字体风格：[衬线/无衬线]，配色：[配色方案]。
```

**JSON 进阶模板：**
```json
{
  "type": "Editorial Layout",
  "document": "Fashion Magazine Double-page Spread",
  "grid": "3-column grid, wide margins",
  "content": {
    "left_page": "Full-bleed high-fashion photograph",
    "right_page": {
      "headline": "THE RED RENAISSANCE",
      "body_text": "(Simulated text blocks)"
    }
  },
  "style": "High-end editorial, clean typography, generous whitespace"
}
```

---

## 模板 13-18: 其他分类

- 🏮 历史与古典中国主题（卷轴、历史人物、传统题材、诗词视觉）
- 🧪 其他用例（创意实验、特殊任务、混合工作流）
- 📷 Photography & Realism（人像、手机摄影、胶片质感、商业摄影）
- 🎨 Illustration & Art（插画、艺术风格、材质实验、装饰图）
- 🧍 Characters & People（角色设计、姿势参考、卡片、3D 玩具）
- 🎬 Scenes & Storytelling（故事板、叙事场景、直播画面、世界观构建）

---

## 高级技巧

### 权重控制
用逗号分隔重要程度，越靠前越重要

### 负面提示词
排除不想要的元素（"No cyberpunk", "No modern elements"）

### 风格混合
"Studio Ghibli meets cyberpunk"

### 材质叠加
"glass morphism with frosted texture"

### 常见错误
- 提示词过长导致失焦
- 风格描述与主体矛盾
- 忽略光照对氛围的影响
- 未固定关键角色特征导致一致性差

---

## 关键词标签

#ai-image #gpt-image-2 #prompt-engineering #template #video-production #design #openclaw
