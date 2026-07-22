# Pulse 调研报告 — 取代 Postman 的 AI 集成 API 客户端

> 调研日期: 2026-07-22
> 基于原始项目: `/home/fantastic/ComateProject/pulse/`（React + Tauri 原型 v0.1.0）

---

## 一、原始项目分析

### 1.1 当前技术栈

| 层级 | 技术 | 说明 |
|------|------|------|
| 前端框架 | **React 18 + TypeScript** | Vite 构建 |
| 桌面框架 | **Tauri 2.x** (Rust 后端) | 用户要求改成 Electron |
| 样式 | **Tailwind CSS 3** | 全深色模式（`bg-zinc-950` 系） |
| 图标 | **Lucide React** | 轻量图标库 |
| 状态管理 | **Zustand** | 4 个 store：request/collection/environment/history/ai |
| 代码编辑器 | **Monaco Editor** (@monaco-editor/react) | VS Code 同款 |
| HTTP 客户端 | **Axios + Rust reqwest** | 前端 Axios（未用），实际走 Rust Tauri 命令 |
| AI 集成 | **OpenAI API** (硬编码) | Rust 后端直接调用 `api.openai.com` |

### 1.2 现有功能清单

| 功能 | 状态 | 详情 |
|------|------|------|
| **请求构建器** | ✅ 完成 | Method/URL/Params/Headers/Body/Auth tab 布局 |
| **HTTP 方法** | ✅ 完成 | GET/POST/PUT/DELETE/PATCH/HEAD/OPTIONS |
| **Body 类型** | ⚠️ 部分完成 | JSON/XML/Raw 可编辑；FormData/FormURLEncoded 占位；Binary 占位 |
| **认证方式** | ⚠️ 部分完成 | None/Bearer/Basic/APIKey UI 已有；OAuth2 只定义类型 |
| **响应查看器** | ✅ 完成 | 状态码/耗时/大小/格式化 JSON Body/Headers 标签 |
| **集合管理** | ⚠️ 部分完成 | 树形集合/文件夹结构 UI 完整，但 CRUD 未实际接线 |
| **环境变量** | ⚠️ 部分完成 | 选择器 + `{{variable}}` 解析引擎已实现 |
| **历史记录** | ✅ 完成 | 最多 200 条，可清除 |
| **AI 助手** | ⚠️ 部分完成 | 聊天面板 + 上下文注入；测试生成/响应分析/代码生成后端实现 |
| **预/后置脚本** | ❌ 占位 | UI 标签在但提示 "coming soon" |
| **WebSocket** | ❌ 占位 | Rust 命令已定义但未实现 |
| **代码生成** | ✅ 完成 | curl/Python/JavaScript/Go |
| **持久化存储** | ❌ 缺失 | 所有 store 仅存内存，刷新即丢 |
| **深色/浅色主题** | ❌ 缺失 | 全深色模式硬编码 |
| **国际化** | ❌ 缺失 | 纯英文 |

### 1.3 架构特点

```
┌──────────────────┐     ┌──────────────────┐     ┌──────────────────────┐
│  React Frontend  │     │  Tauri IPC Bridge │     │  Rust Backend         │
│                  │     │  (invoke/send)    │     │                       │
│  Zustand Stores  │◄───►│  JSON serialized  │◄───►│  HTTP Client (reqwest)│
│  Monaco Editor   │     │                   │     │  AI Service (OpenAI)  │
│  Tailwind UI     │     │                   │     │  Code Generator       │
│                  │     │                   │     │  Script Engine (占位) │
└──────────────────┘     └──────────────────┘     └──────────────────────┘
```

### 1.4 代码规模和结构

```
pulse/
├── src/                          # React 前端
│   ├── components/
│   │   ├── layout/               # MainLayout (核心布局)
│   │   ├── request/              # 请求构建器 (6 个子组件)
│   │   ├── response/             # 响应查看器 (3 个子组件)
│   │   ├── collection/           # 集合树
│   │   ├── environment/          # 环境选择器
│   │   ├── ai/                   # AI 面板
│   │   ├── history/              # 历史列表
│   │   └── common/               # KeyValueEditor, CodeEditor
│   ├── stores/                   # 5 个 Zustand store
│   ├── lib/                      # codeGen.ts, variableResolver.ts
│   ├── types/                    # 完整 TS 类型定义
│   └── App.tsx                   # 主组件
├── src-tauri/                    # Rust 后端
│   ├── src/
│   │   ├── commands/             # HTTP/Collection/Environment/AI/Storage
│   │   ├── services/             # HTTP client/AI service/Script engine/Code gen
│   │   ├── models/               # 数据模型
│   │   └── main.rs               # 入口
│   └── icons/                    # 应用图标（含 pulse.svg 原版）
└── package.json
```

---

## 二、竞品分析

### 2.1 主要竞品

| 产品 | ⭐ Stars | 技术栈 | 特点 |
|------|---------|--------|------|
| **Hoppscotch** | ⭐80k | TypeScript + Web/PWA + Desktop | 多协议(GraphQL/WebSocket/gRPC)，自托管，社区大 |
| **Bruno** | ⭐46k | JS + Electron | 本地优先，Git 原生集合，轻量，离线可用，开源 |
| **Insomnia** (Kong) | 闭源化趋势 | JS + Electron | 开始收费，限免费功能，插件生态丰富 |
| **Yaade** | ⭐2k | JS + Docker | 自托管协作，多用户 |
| **HTTPie** | ⭐34k | Python | 终端工具，非 GUI |

### 2.2 市场趋势

1. **Postman 收费潮** → 大量用户寻找替代品，2023-2024 年用户流失明显
2. **本地优先 / 离线可用** → Bruno 代表的 git-native 模式受欢迎
3. **AI 集成** → 各大客户端争相加入 AI 辅助功能（自动生成测试、分析响应、代码转换）
4. **轻量化** → 用户厌倦了 Postman 的臃肿（几百 MB 内存占用）
5. **多协议** → 不满足于 REST，需要 GraphQL/gRPC/WebSocket/SSE 支持

---

## 三、Pulse 的优势与短板

### 3.1 现有优势
- **AI 集成基因** — 从最初就内置 AI 面板，天然适合你的 DeepSeek 接入
- **代码简洁** — 前端 ~1500 行，Rust 后端 ~600 行，易于重写
- **图标好看** — pulse.svg 紫色渐变心跳图，可以作为保留
- **功能框架完整** — 主要功能页面的 tab 布局已设计好，参考价值高

### 3.2 需要重构的点

1. **Tauri → Electron** — 你指定用 Electron
2. **深色→浅色+切换** — 目前全深色，你要白底紫配(#6d4aff)主题
3. **英文→中文** — 全面国际化
4. **AI 仅支持 OpenAI** — 需要改为 DeepSeek 优先，支持多模型
5. **无持久化** — 需要添加本地存储(localStorage/SQLite)
6. **Rust 逻辑迁移** — HTTP 客户端、AI 服务、代码生成等 Rust 逻辑需要迁移到 Node.js

---

## 四、推荐实现方案 — Electron 重写

### 4.1 技术选型建议

| 领域 | 推荐 | 理由 |
|------|------|------|
| **桌面框架** | Electron 33+ | 用户指定 |
| **前端框架** | React 19 + TypeScript | 代码可复用 |
| **构建工具** | Vite (electron-vite) | 原项目已用 Vite |
| **UI 框架** | Tailwind CSS 4 | 浅色主题优先，兼容深色 |
| **状态管理** | Zustand | 代码可直接迁移 |
| **编辑器** | Monaco Editor | 原项目已用 |
| **HTTP 客户端** | Node.js built-in fetch / undici | 无需 Rust 层 |
| **AI 集成** | DeepSeek API + OpenAI 兼容层 | 你已充值 DeepSeek |
| **持久化** | SQLite (better-sqlite3) 或 JSON 文件 | 本地存储 |
| **国际化** | i18next / react-i18next | 中文优先 |

### 4.2 阶段路线图（建议）

**Phase 1 — 基础骨架**
- Electron + Vite 脚手架
- 浅色主题布局（白底紫配 #6d4aff）
- 深色/浅色模式切换开关
- 中文界面
- URL 输入 + Send 按钮 + 基本响应显示

**Phase 2 — 核心 API 功能**
- HTTP 方法选择器
- 请求参数/Headers/Body 编辑器
- 认证配置（Bearer/Basic/APIKey）
- 响应查看器（状态/耗时/大小/格式化 Body）
- 代码生成（curl/Python/JS）

**Phase 3 — 组织管理**
- 集合（Collection）管理（增删改查 + 树结构）
- 文件夹嵌套
- 环境变量 + `{{variable}}` 解析
- 历史记录持久化

**Phase 4 — AI 集成**
- AI 聊天面板（DeepSeek 优先）
- 上下文感知（自动注入当前请求/响应）
- AI 生成测试用例
- AI 分析响应
- AI 代码生成（多种语言）

**Phase 5 — 高级功能**
- 预请求/后响应脚本（JS 沙箱）
- WebSocket 支持
- GraphQL 支持
- 导出/导入（Postman/Bruno 格式）
- 请求多 Tab 支持

### 4.3 图标策略

原始 pulse.svg 是紫灰渐变心跳图，配色：
- 心跳线渐变: `#7c3aed → #a78bfa → #7c3aed`（你的品牌紫色系 ✅）
- 背景深色: `#1a1a2e → #16213e`

浅色模式下背景需要改为浅色或透明，心跳线保留紫色渐变。这个设计语言和你的偏好（白底紫配 #6d4aff）天然契合。

---

## 五、下一步行动

按照你的要求，先出调研报告。等你确认方向后再开始动手做——
- 要不要按上面的 Phase 1→5 顺序来？
- 是否需要调整技术选型（比如用哪个 HTTP 请求库）？
- 是否保留「Pulse」这个名称和图标？

等你拍板后我就开始劈项目架子。
