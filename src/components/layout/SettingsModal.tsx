import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useSettingsStore, type AppSettings } from '../../stores/settingsStore'
import { useThemeStore } from '../../stores/themeStore'
import { X, Settings, Globe, Bot, Server, Info, Sun, Moon } from 'lucide-react'

interface Props {
  onClose: () => void
}

type SettingsTab = 'general' | 'ai' | 'proxy' | 'about'

export function SettingsModal({ onClose }: Props) {
  const { t } = useTranslation()
  const { settings, update } = useSettingsStore()
  const [tab, setTab] = useState<SettingsTab>('general')

  const tabs: { key: SettingsTab; icon: React.ReactNode; label: string }[] = [
    { key: 'general', icon: <Globe size={12} />, label: '通用' },
    { key: 'ai', icon: <Bot size={12} />, label: 'AI' },
    { key: 'proxy', icon: <Server size={12} />, label: '代理' },
    { key: 'about', icon: <Info size={12} />, label: '关于' },
  ]

  return (
    <div className="settings-overlay" onClick={onClose}>
      <div className="settings-modal settings-modal-wide" onClick={(e) => e.stopPropagation()}>
        <div className="settings-header">
          <Settings size={14} />
          <span>设置</span>
          <button onClick={onClose} className="settings-close-btn"><X size={14} /></button>
        </div>

        <div className="settings-body-hz">
          <div className="settings-tabs">
            {tabs.map((t) => (
              <button
                key={t.key}
                className={`settings-tab ${tab === t.key ? 'active' : ''}`}
                onClick={() => setTab(t.key)}
              >
                {t.icon}
                {t.label}
              </button>
            ))}
          </div>

          <div className="settings-content">
            {tab === 'general' && <GeneralTab settings={settings} update={update} />}
            {tab === 'ai' && <AiTab settings={settings} update={update} />}
            {tab === 'proxy' && <ProxyTab settings={settings} update={update} />}
            {tab === 'about' && <AboutTab />}
          </div>
        </div>
      </div>
    </div>
  )
}

/* ---- 通用 ---- */
function GeneralTab({ settings, update }: { settings: AppSettings; update: (p: Partial<AppSettings>) => void }) {
  const { i18n } = useTranslation()

  const handleLanguageChange = (lang: string) => {
    update({ language: lang })
    i18n.changeLanguage(lang)
  }

  const handleThemeChange = (theme: 'light' | 'dark') => {
    update({ theme })
    document.documentElement.setAttribute('data-theme', theme)
    localStorage.setItem('pulse-theme', theme)
    useThemeStore.getState().setTheme(theme)
  }

  return (
    <div className="settings-fields">
      <div className="settings-field">
        <label>界面语言</label>
        <select value={settings.language} onChange={(e) => handleLanguageChange(e.target.value)} className="settings-select">
          <option value="zh-CN">中文 (简体)</option>
          <option value="en">English</option>
        </select>
        <span className="settings-field-hint">部分界面文字将跟随切换（完整多语言支持开发中）</span>
      </div>
      <div className="settings-field">
        <label>主题</label>
        <div className="settings-theme-toggle">
          <button
            className={`settings-theme-btn ${settings.theme === 'light' ? 'active' : ''}`}
            onClick={() => handleThemeChange('light')}
          >
            <Sun size={12} /> 浅色
          </button>
          <button
            className={`settings-theme-btn ${settings.theme === 'dark' ? 'active' : ''}`}
            onClick={() => handleThemeChange('dark')}
          >
            <Moon size={12} /> 深色
          </button>
        </div>
      </div>
      <div className="settings-field">
        <label>请求超时 (秒)</label>
        <input
          type="number"
          value={settings.requestTimeout}
          onChange={(e) => update({ requestTimeout: Math.max(1, Math.min(300, parseInt(e.target.value) || 30)) })}
          className="settings-input"
          min={1}
          max={300}
        />
      </div>
      <div className="settings-field">
        <label>历史记录上限</label>
        <input
          type="number"
          value={settings.historyLimit}
          onChange={(e) => update({ historyLimit: Math.max(10, Math.min(1000, parseInt(e.target.value) || 200)) })}
          className="settings-input"
          min={10}
          max={1000}
        />
      </div>
    </div>
  )
}

/* ---- AI ---- */
function AiTab({ settings, update }: { settings: AppSettings; update: (p: Partial<AppSettings>) => void }) {
  return (
    <div className="settings-fields">
      <div className="settings-field">
        <label>API 提供商</label>
        <select value={settings.aiProvider} onChange={(e) => update({ aiProvider: e.target.value as any })} className="settings-select">
          <option value="openai">OpenAI</option>
          <option value="deepseek">DeepSeek</option>
          <option value="custom">自定义</option>
        </select>
      </div>
      {settings.aiProvider === 'custom' && (
        <div className="settings-field">
          <label>API Endpoint</label>
          <input
            type="text"
            value={settings.aiEndpoint}
            onChange={(e) => update({ aiEndpoint: e.target.value })}
            placeholder="https://api.example.com/v1/chat/completions"
            className="settings-input mono"
          />
        </div>
      )}
      <div className="settings-field">
        <label>模型</label>
        <input
          type="text"
          value={settings.aiModel}
          onChange={(e) => update({ aiModel: e.target.value })}
          placeholder={settings.aiProvider === 'deepseek' ? 'deepseek-chat' : 'gpt-4o'}
          className="settings-input mono"
        />
        <span className="settings-field-hint">
          {settings.aiProvider === 'deepseek' ? '推荐: deepseek-chat' : '推荐: gpt-4o, gpt-4o-mini'}
        </span>
      </div>
      <div className="settings-field">
        <label>API 密钥</label>
        <input
          type="password"
          value={settings.aiApiKey}
          onChange={(e) => update({ aiApiKey: e.target.value })}
          placeholder="sk-..."
          className="settings-input mono"
        />
        <span className="settings-field-hint">密钥仅存储在本地 localStorage，请妥善保管</span>
      </div>
      <div className="settings-field">
        <label>上下文关联</label>
        <label className="settings-toggle">
          <input
            type="checkbox"
            checked={settings.aiContextEnabled}
            onChange={(e) => update({ aiContextEnabled: e.target.checked })}
          />
          <span>发送请求时自动将当前请求/响应上下文注入 AI</span>
        </label>
      </div>
    </div>
  )
}

/* ---- 代理 ---- */
function ProxyTab({ settings, update }: { settings: AppSettings; update: (p: Partial<AppSettings>) => void }) {
  return (
    <div className="settings-fields">
      <div className="settings-field">
        <label>HTTP 代理</label>
        <input
          type="text"
          value={settings.httpProxy}
          onChange={(e) => update({ httpProxy: e.target.value })}
          placeholder="http://127.0.0.1:7890"
          className="settings-input mono"
        />
      </div>
      <div className="settings-field">
        <label>HTTPS 代理</label>
        <input
          type="text"
          value={settings.httpsProxy}
          onChange={(e) => update({ httpsProxy: e.target.value })}
          placeholder="http://127.0.0.1:7890"
          className="settings-input mono"
        />
      </div>
      <div className="settings-field">
        <label>绕过代理</label>
        <input
          type="text"
          value={settings.noProxy}
          onChange={(e) => update({ noProxy: e.target.value })}
          placeholder="localhost, 127.0.0.1, .local"
          className="settings-input"
        />
        <span className="settings-field-hint">逗号分隔的域名列表</span>
      </div>
      <div className="settings-field">
        <span className="settings-field-note">配置后立即生效，所有请求将通过代理发送</span>
      </div>
    </div>
  )
}

/* ---- 关于 ---- */
function AboutTab() {
  return (
    <div className="settings-about">
      <div className="settings-row">
        <span className="settings-label">应用名称</span>
        <span className="settings-value">Pulse</span>
      </div>
      <div className="settings-row">
        <span className="settings-label">版本</span>
        <span className="settings-value">{__APP_VERSION__}</span>
      </div>
      <div className="settings-row">
        <span className="settings-label">技术栈</span>
        <span className="settings-value">Electron + React 19 + Vite 6</span>
      </div>
      <div className="settings-row">
        <span className="settings-label">Git 标签</span>
        <span className="settings-value">v{__APP_VERSION__}</span>
      </div>
      <div className="settings-about-credit">
        <p>AI-powered API client. Take the pulse of your APIs.</p>
        <p className="settings-about-links">
          <a href="https://github.com/raymond202202" target="_blank" rel="noreferrer">GitHub</a>
        </p>
      </div>
    </div>
  )
}
