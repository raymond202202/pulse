# Pulse

> **AI 驱动 API 测试客户端** — 给你的 API 把把脉。
>
> 🧠 **由 AI 构建** — 本项目由 AI 智能体（Hermes Agent by Nous Research）在人类指导下全程开发。

Pulse 是一款桌面 API 客户端，旨在成为 Postman 的轻量级现代替代品。支持多标签请求编辑、集合管理、环境变量、AI 集成、与 Postman 格式的导入导出。

![Tech Stack](https://img.shields.io/badge/Electron-33-blue) ![React](https://img.shields.io/badge/React-19-61dafb) ![Vite](https://img.shields.io/badge/Vite-6-646cff)

---

[English](#english) | [中文](#中文)

---

## 中文

### 功能特性

- **多标签请求** — 同时处理多个 API 请求，每个标签独立状态
- **HTTP 方法** — GET、POST、PUT、DELETE、PATCH、HEAD、OPTIONS
- **请求构建器** — URL 参数、请求头、请求体 (JSON/XML/表单/GraphQL/原始)、认证 (Bearer/Basic/API Key/OAuth2)
- **响应查看器** — 格式化 JSON 语法高亮、响应头、状态/耗时/大小
- **集合管理** — 将请求组织到集合和文件夹中，持久化到 localStorage
- **环境变量** — 通过 `{{key}}` 语法定义变量，支持环境切换
- **AI 集成** — 内置 AI 助手，支持 DeepSeek / OpenAI / 自定义接口
- **导入/导出** — 支持 Postman v2.1 格式和 Pulse 原生格式
- **代码生成** — cURL、Python、JavaScript、Go、Rust、HTTPie
- **主题切换** — 浅色（默认）和深色主题，标题栏一键切换
- **历史记录** — 持久化存储，点击可恢复完整请求
- **响应搜索** — 在响应体中搜索并高亮匹配内容
- **键盘快捷键** — Ctrl+Enter 发送请求，F12 打开开发者工具

### 安装

#### Linux (Fedora / RHEL / CentOS)

从源码构建（参见下方「从源码构建」章节）后，运行以下命令打包为 RPM：

```bash
npx electron-builder --linux rpm
sudo dnf install ./release/pulse-*.x86_64.rpm
```

然后从应用菜单启动或运行 `pulse` 命令。

#### Linux (Debian / Ubuntu)

```bash
sudo apt install alien
sudo alien -i pulse-*.x86_64.rpm
pulse
```

#### macOS 和 Windows

当前未提供原生包，请参考下方从源码构建。

### 从源码构建

```bash
git clone https://github.com/raymond202202/pulse.git
cd pulse
npm install
npm run build          # 构建前端
npm run electron:dev   # 开发模式启动 (Vite + Electron)
```

### 打包分发包

```bash
# Linux RPM
npx electron-builder --linux rpm

# macOS (需在 Mac 上执行)
npx electron-builder --mac

# Windows (需在 Windows 上执行)
npx electron-builder --win
```

### 快速使用

1. 启动 Pulse
2. 输入 URL（如 `https://api.github.com`）
3. 选择 HTTP 方法（默认 GET）
4. 点击 **发送** 或按 `Ctrl+Enter`

### 标签页管理

- **新建标签**：点击标签栏 `+`
- **关闭标签**：点击标签上的 `✕`（最后一个标签不能关）
- **重命名标签**：双击标签名
- **重启后恢复**：标签页状态自动持久化

### 集合

- **创建**：点击侧栏集合头部的 `+`
- **保存请求**：鼠标悬停集合名，点击 `+` 按钮保存当前请求
- **加载请求**：点击集合中的请求条目，自动填入 Method + URL
- **管理**：鼠标悬停时显示编辑/删除按钮

### 环境变量

- **管理**：点击底部环境选择器旁的 ⚙ 图标
- **创建**：新建环境并添加变量
- **使用**：在 URL 和请求头中用 `{{变量名}}` 引用
- **切换**：从下拉列表中选择环境

### AI 助手

1. 点击右下角 **🤖** 按钮打开 AI 面板
2. 进入 **设置 ⚙ → AI** 标签页配置：
   - **API 提供商**：DeepSeek（推荐）、OpenAI 或自定义
   - **模型**：`deepseek-chat`、`gpt-4o` 或自定义
   - **API 密钥**：填写你的密钥（仅存储在本地 localStorage）
3. 输入问题按回车发送

AI 会自动感知当前请求和响应的上下文，可以帮助你构建请求、分析响应、生成测试用例和调试问题。

### 导入/导出

- 点击集合头部的 **↑** 按钮
- **导入**：粘贴 JSON 或点击「从文件选择」选取 `.json` 文件
- 支持 Postman v2.1 格式和 Pulse 原生格式
- **导出**：选择 Pulse 或 Postman v2.1 格式，复制或下载

### 设置

点击标题栏的 ⚙ 齿轮图标：

| 标签页 | 设置项 |
|--------|--------|
| 通用 | 语言、主题、超时时间、历史上限 |
| AI | API 提供商、接口地址、模型、密钥、上下文开关 |
| 代理 | HTTP/HTTPS 代理 |
| 关于 | 版本号、技术栈 |

### 键盘快捷键

| 快捷键 | 功能 |
|--------|------|
| `Ctrl+Enter` | 发送请求 |
| `F12` | 切换开发者工具 |

---

## English

### Features

- **Multi-Tab Requests** — Work on multiple API requests simultaneously with independent state
- **HTTP Methods** — GET, POST, PUT, DELETE, PATCH, HEAD, OPTIONS
- **Request Builder** — URL params, headers, body (JSON/XML/Form/GraphQL/Raw), auth (Bearer/Basic/API Key/OAuth2)
- **Response Viewer** — Formatted JSON with syntax highlighting, response headers, status/time/size
- **Collections** — Organize requests into collections and folders, persist to localStorage
- **Environment Variables** — Define variables with `{{key}}` syntax, switch between environments
- **AI Integration** — Built-in AI assistant powered by DeepSeek / OpenAI / custom endpoints
- **Import / Export** — Postman v2.1 format, Pulse native format, JSON file import
- **Code Generation** — cURL, Python, JavaScript, Go, Rust, HTTPie
- **Themes** — Light (default) and dark mode, toggle from title bar
- **History** — Request history with localStorage persistence, click to restore
- **Search** — Search within response bodies with highlighted results
- **Keyboard Shortcuts** — Ctrl+Enter to send, F12 for DevTools

### Installation

#### Linux (Fedora / RHEL / CentOS)

Build from source first (see [Building from Source](#building-from-source)), then package as RPM:

```bash
npx electron-builder --linux rpm
sudo dnf install ./release/pulse-*.x86_64.rpm
```

#### Linux (Debian / Ubuntu)

```bash
sudo apt install alien
sudo alien -i pulse-*.x86_64.rpm
pulse
```

#### macOS & Windows

Native packages are not currently provided. See [Building from source](#building-from-source) below.

### Building from Source

```bash
git clone https://github.com/raymond202202/pulse.git
cd pulse
npm install
npm run build
npm run electron:dev
```

### Package for Distribution

```bash
# Linux RPM
npx electron-builder --linux rpm

# macOS (requires macOS)
npx electron-builder --mac

# Windows (requires Windows)
npx electron-builder --win
```

### Quick Start

1. Launch Pulse
2. Enter a URL (e.g., `https://api.github.com`)
3. Select HTTP method (default: GET)
4. Click **Send** or press `Ctrl+Enter`

### Keyboard Shortcuts

| Shortcut | Action |
|----------|--------|
| `Ctrl+Enter` | Send request |
| `F12` | Toggle Developer Tools |

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Desktop Framework | **Electron 33** |
| Frontend | **React 19** + TypeScript |
| Build Tool | **Vite 6** |
| State Management | Zustand 5 |
| Code Editor | Monaco Editor |
| Icons | Lucide React |
| Internationalization | i18next + react-i18next |
| Styling | Pure CSS with CSS Variables |
| Packaging | electron-builder |

---

## Cross-Platform Notes

| Platform | Can Build? | Notes |
|----------|-----------|-------|
| **Linux** | ✅ Yes | RPM and directory builds tested on Fedora 44. |
| **macOS** | ⚠️ Requires macOS | electron-builder can create `.dmg` but must run on macOS. |
| **Windows** | ⚠️ Requires Windows | electron-builder can create `.exe` (NSIS) but must run on Windows. |

---

## License

MIT

---

## Credits

- **Author**: [raymond202202](https://github.com/raymond202202)
- **AI Agent**: [Hermes Agent](https://hermes-agent.nousresearch.com) by Nous Research — This project was entirely developed by AI under human direction.
- **Inspiration**: The original Pulse concept by Comate/WPS
