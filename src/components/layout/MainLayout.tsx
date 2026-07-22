import React from 'react'
import { useTranslation } from 'react-i18next'
import { Activity, Sun, Moon, Settings } from 'lucide-react'
import { useThemeStore } from '../../stores/themeStore'

interface Props {
  leftSidebar?: React.ReactNode
  rightSidebar?: React.ReactNode
  children: React.ReactNode
}

export function MainLayout({ leftSidebar, rightSidebar, children }: Props) {
  const { t } = useTranslation()
  const { theme, toggleTheme } = useThemeStore()
  const [showSettings, setShowSettings] = React.useState(false)

  return (
    <div className="app-shell">
      {/* Title bar */}
      <header className="titlebar">
        <div className="titlebar-left">
          <Activity className="titlebar-icon pulse-beat" />
          <span className="titlebar-title">{t('appName')}</span>
          <span className="titlebar-version">{__APP_VERSION__}</span>
        </div>
        <div className="titlebar-center drag-region" />
        <div className="titlebar-right">
          <button
            onClick={toggleTheme}
            className="theme-toggle no-drag"
            title={theme === 'light' ? t('darkMode') : t('lightMode')}
          >
            {theme === 'light' ? <Moon size={14} /> : <Sun size={14} />}
          </button>
          <button
            onClick={() => setShowSettings(!showSettings)}
            className="theme-toggle no-drag"
            title={t('settings') || '设置'}
          >
            <Settings size={14} />
          </button>
        </div>
      </header>

      {/* Main content */}
      <div className="main-content">
        {/* Left sidebar */}
        {leftSidebar && (
          <aside className="sidebar sidebar-left">
            {leftSidebar}
          </aside>
        )}

        {/* Center */}
        <main className="center-panel">
          {children}
        </main>

        {/* Right sidebar */}
        {rightSidebar && (
          <aside className="sidebar sidebar-right">
            {rightSidebar}
          </aside>
        )}
      </div>

      {/* Status bar */}
      <footer className="statusbar">
        <span className="statusbar-item">
          <span className="statusbar-dot" />
          {t('ready')}
        </span>
        <span className="statusbar-right">{t('poweredBy')}</span>
      </footer>

      {/* Settings Modal */}
      {showSettings && (
        <div className="settings-overlay" onClick={() => setShowSettings(false)}>
          <div className="settings-modal" onClick={(e) => e.stopPropagation()}>
            <div className="settings-header">
              <Settings size={14} />
              <span>设置</span>
            </div>
            <div className="settings-body">
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
                  <span className="settings-label">Git 提交</span>
                  <span className="settings-value">v{__APP_VERSION__}</span>
                </div>
              </div>
            </div>
            <div className="settings-footer">
              <span className="settings-more">更多设置项将在后续版本添加 → 见 docs/SETTINGS_PLAN.md</span>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
