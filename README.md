# Pulse

> **AI-powered API client** — Take the pulse of your APIs.
>
> 🧠 **Built by AI** — This project was entirely developed by an AI agent (Hermes Agent by Nous Research) under human direction.

Pulse is a desktop API client designed as a modern, lightweight alternative to Postman. It features multi-tab request editing, collection management, environment variables, AI integration, and full import/export compatibility with Postman.

![Tech Stack](https://img.shields.io/badge/Electron-33-blue) ![React](https://img.shields.io/badge/React-19-61dafb) ![Vite](https://img.shields.io/badge/Vite-6-646cff)

---

## Features

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

---

## Screenshots

<!-- TODO: Add screenshots -->

---

## Installation

### Linux (Fedora / RHEL / CentOS)

Download the `.rpm` from [Releases](https://github.com/raymond202202/pulse/releases):

```bash
sudo dnf install ./pulse-*.x86_64.rpm
# or
sudo rpm -ivh pulse-*.x86_64.rpm
```

Then launch from your application menu or run `pulse` in terminal.

### Linux (Debian / Ubuntu)

An `.rpm` is provided. For Debian-based systems, convert it:

```bash
sudo apt install alien
sudo alien -i pulse-*.x86_64.rpm
pulse
```

### macOS

Currently not packaged for macOS. See [Building from source](#building-from-source) below.

To build a macOS `.dmg`:

```bash
# On a Mac:
npm run electron:build:mac
```

Prerequisites: Xcode Command Line Tools, Node.js 18+.

### Windows

Currently not packaged for Windows. See [Building from source](#building-from-source) below.

To build a Windows `.exe` installer:

```powershell
# On Windows:
npm run electron:build:win
```

Prerequisites: Visual Studio Build Tools, Node.js 18+, NSIS (for installer).

---

## Building from Source

### Prerequisites

- Node.js 18+ (tested with v24)
- npm 9+
- Git

### Clone & Build

```bash
git clone https://github.com/raymond202202/pulse.git
cd pulse
npm install
npm run build          # Build the frontend
npm run electron:dev   # Start in development mode (Vite + Electron)
```

### Package for Distribution

```bash
# Linux RPM
npm run build
npx electron-builder --linux rpm

# Linux (portable directory)
npm run build
npx electron-builder --linux dir

# macOS (requires macOS)
npm run build
npx electron-builder --mac

# Windows (requires Windows)
npm run build
npx electron-builder --win
```

Output goes to `release/` directory.

### Cross-Platform Notes

| Platform | Can Build? | Notes |
|----------|-----------|-------|
| **Linux** | ✅ Yes | Native platform. RPM and directory builds tested on Fedora. |
| **macOS** | ⚠️ Requires macOS | electron-builder can create `.dmg` and `.zip` but must run on macOS. Cross-compilation from Linux is not supported for macOS. |
| **Windows** | ⚠️ Requires Windows | electron-builder can create `.exe` (NSIS) and portable `.zip`. Cross-compilation from Linux is not supported for Windows. |

---

## Usage

### Quick Start

1. Launch Pulse
2. Enter a URL in the request bar (e.g., `https://api.github.com`)
3. Select HTTP method (default: GET)
4. Click **Send** or press `Ctrl+Enter`

### Request Tab Management

- **New tab**: Click `+` in the tab bar
- **Close tab**: Click `✕` on the tab (can't close the last tab)
- **Rename tab**: Double-click the tab name
- **Tabs persist** across app restarts

### Collections

- **Create**: Click `+` in the Collections sidebar header
- **Save request**: Click the `+` button next to a collection name to save the current request
- **Load request**: Click any request in a collection to restore method + URL
- **Rename/Delete**: Use the icons that appear when hovering over a collection

### Environment Variables

- **Manage**: Click the ⚙ gear icon next to the environment selector at the bottom of the sidebar
- **Create**: Add a new environment with named variables
- **Use**: Reference variables with `{{variableName}}` in URLs and header values
- **Switch**: Select environments from the dropdown

### AI Assistant

1. Click the **🤖** button (bottom-right corner) to open the AI panel
2. Go to **Settings ⚙ → AI** tab
3. Configure:
   - **API Provider**: DeepSeek (recommended), OpenAI, or Custom
   - **Model**: `deepseek-chat`, `gpt-4o`, or custom
   - **API Key**: Your API key (stored locally in your browser's localStorage)
4. Type your question and press Enter

The AI has context of your current request and response — it can help build requests, analyze responses, generate test cases, and debug issues.

### Import / Export

- Click the **↑** (upload) button in the Collections header
- **Import**: Paste JSON or click "从文件选择" to pick a `.json` file
- Supports Postman v2.1 format and Pulse native format
- **Export**: Choose Pulse or Postman v2.1 format, copy or download

### Settings

Click the ⚙ gear icon in the title bar to open Settings:

| Tab | Settings |
|-----|----------|
| General | Language (中文/English), Theme (Light/Dark), Request timeout, History limit |
| AI | API provider, endpoint, model, API key, context toggle |
| Proxy | HTTP/HTTPS proxy (applied via Electron) |
| About | Version, tech stack |

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
| Styling | Pure CSS with CSS Variables (no Tailwind) |
| Packaging | electron-builder |

---

## Project Artifacts

Files generated during this project:

| File | Purpose |
|------|---------|
| `CHANGELOG.md` | Version history (v0.1.0 → v0.9.1) |
| `docs/TEST_PLAN_v0.9.1.md` | Acceptance test plan |
| `docs/SETTINGS_PLAN.md` | Settings feature roadmap |
| `scripts/bump-version.sh` | Version bump helper |
| `.pulse-state.json` | AI agent iteration state |

---

## License

MIT

---

## Credits

- **Author**: [raymond202202](https://github.com/raymond202202)
- **AI Agent**: [Hermes Agent](https://hermes-agent.nousresearch.com) by Nous Research
- **Inspiration**: The original Pulse concept by Comate/WPS
