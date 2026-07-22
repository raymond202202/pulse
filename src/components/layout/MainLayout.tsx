import React from 'react'
import { useTranslation } from 'react-i18next'
import { Activity, Sun, Moon, Settings } from 'lucide-react'
import { useThemeStore } from '../../stores/themeStore'
import { SettingsModal } from './SettingsModal'

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
      {showSettings && <SettingsModal onClose={() => setShowSettings(false)} />}
    </div>
  )
}
