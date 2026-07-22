import React from 'react'
import { useTranslation } from 'react-i18next'
import { Activity, Sun, Moon } from 'lucide-react'
import { useThemeStore } from '../../stores/themeStore'

interface Props {
  leftSidebar?: React.ReactNode
  rightSidebar?: React.ReactNode
  children: React.ReactNode
}

export function MainLayout({ leftSidebar, rightSidebar, children }: Props) {
  const { t } = useTranslation()
  const { theme, toggleTheme } = useThemeStore()

  return (
    <div className="app-shell">
      {/* Title bar */}
      <header className="titlebar">
        <div className="titlebar-left">
          <Activity className="titlebar-icon pulse-beat" />
          <span className="titlebar-title">{t('appName')}</span>
          <span className="titlebar-version">v0.1.0</span>
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
    </div>
  )
}
