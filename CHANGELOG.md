# Pulse - 变更日志

## v0.6.1 → v0.7.0 (2026-07-22 夜间)
- 🔢 版本号动态化（走 `__APP_VERSION__`，显示 0.7.0）
- ⚙️ 标题栏新增齿轮设置入口（当前显示「关于」信息）
- 🕐 历史记录可点击回溯请求
- 📋 验收测试文档 `docs/TEST_PLAN_v0.6.1.md`（用于人工/AI 验收）
- 📝 设置规划文档 `docs/SETTINGS_PLAN.md`
- 🛠️ 版本号升级脚本 `scripts/bump-version.sh`

## v0.6.0 → v0.6.1 (2026-07-22 夜间)
- 📁 导入支持从文件选择（Electron 原生对话框）
- 🚫 移除 Electron 默认菜单（File/Edit/View/Window/Help）
- 📁 集合持久化 (localStorage) + 完整 CRUD UI
- 🌍 环境变量持久化 + 内联编辑
- 📥 导入 Postman v2.1 格式
- 📤 导出 Pulse / Postman v2.1 格式
- ✏️ 集合/环境重命名
- 🗑️ 删除集合/环境/变量

## v0.4.0 → v0.5.0 (2026-07-22 夜间)
- ⏱️ 请求 30 秒超时保护 (AbortController)
- 🐛 超时错误中文提示
- 🚀 Electron 生产模式修复 (可脱离 Vite 直接加载 dist)

## v0.3.0 → v0.4.0 (2026-07-22 夜间)
- 📋 响应 Body 一键复制按钮
- ⌨️ Ctrl+Enter 快捷键发送请求

## v0.2.0 → v0.3.0 (2026-07-22 夜间)
- 💾 标签页状态持久化 (localStorage)
- ✏️ 标签页双击重命名

## v0.1.0 → v0.2.0 (2026-07-22 夜间)
- 📑 请求多 Tab 支持 (新建/切换/关闭)

## v0.1.0 (2026-07-22)
- 🏗️ Electron + React 19 + Vite 6 骨架
- 🎨 浅色/深色主题切换 (白底紫配 #6d4aff)
- 🌏 中文界面 (react-i18next)
- 🔌 请求构建器 (GET/POST/PUT/DELETE/PATCH/HEAD/OPTIONS)
- 📡 原生 fetch 发送 + 响应查看器
- 🔐 认证配置 (Bearer/Basic/API Key)
- 🔄 Key-Value 编辑器
- 📁 集合树 + 环境选择器
- 🤖 AI 面板 (占位)
- 📜 历史记录持久化 (localStorage)
- 🔍 响应搜索 (高亮)
- 💻 代码生成 (cURL/Python/JavaScript/Go/Rust/HTTPie)
- 🎯 保留 Pulse 名称和原始图标
