# 浏览器自动化快速开始

## 当前状态
- Playwright 框架已安装 ✓
- MCP 协议支持已启用 ✓  
- 浏览器引擎正在下载中 ⏳

## 如何使用浏览器自动化

### 1. 检查浏览器是否准备就绪
```bash
npx playwright install --dry-run
```

### 2. 运行浏览器自动化脚本
```bash
node demo_browser_automation.js
```

### 3. 使用 MCP 协议进行浏览器控制
```bash
npx @playwright/mcp --headless --browser chromium
```

## 支持的功能
- 网站导航 (browser_navigate)
- 元素点击 (browser_click)
- 表单填写 (browser_fill)
- 截图功能 (browser_screenshot)
- 数据提取 (browser_evaluate)
- 文件上传 (browser_upload)

## 故障排除
如果遇到 "Executable doesn't exist" 错误，请等待浏览器下载完成：
```bash
npx playwright install chromium
```

## 注意事项
- 首次运行可能需要下载浏览器，这可能需要几分钟时间
- 确保网络连接稳定以完成浏览器下载
- 可以使用 --headless 参数进行无头模式运行