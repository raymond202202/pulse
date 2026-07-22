import { useState } from 'react'
import { MainLayout } from './components/layout/MainLayout'
import { RequestBuilder } from './components/request/RequestBuilder'
import { ResponseViewer } from './components/response/ResponseViewer'
import { CollectionTree } from './components/collection/CollectionTree'
import { EnvironmentSelector } from './components/environment/EnvironmentSelector'
import { HistoryList } from './components/history/HistoryList'
import { AiPanel } from './components/ai/AiPanel'
import { useRequestStore } from './stores/requestStore'
import { useHistoryStore } from './stores/historyStore'
import { useThemeStore } from './stores/themeStore'
import { useCallback, useEffect } from 'react'
import type { HistoryEntry } from './types'

type Panel = 'collection' | 'history' | 'none'

export default function App() {
  const [leftPanel, setLeftPanel] = useState<Panel>('collection')
  const [showAi, setShowAi] = useState(false)
  const { request, setResponse, setLoading, setError } = useRequestStore()
  const addHistoryEntry = useHistoryStore((s) => s.addEntry)
  const theme = useThemeStore((s) => s.theme)

  // Apply theme on mount
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme)
  }, [theme])

  // Ctrl+Enter keyboard shortcut to send
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
        handleSend()
      }
    }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  })

  const handleSend = async () => {
    if (!request.url.trim()) return
    setLoading(true)
    setError(null)
    try {
      // Parse URL
      const url = new URL(request.url)
      // Add query params
      const activeParams = request.queryParams.filter((p) => p.enabled && p.key)
      activeParams.forEach((p) => url.searchParams.set(p.key, p.value))

      // Build headers
      const headers: Record<string, string> = {}
      request.headers
        .filter((h) => h.enabled && h.key)
        .forEach((h) => { headers[h.key] = h.value })

      // Add auth headers
      if (request.auth?.authType === 'bearer' && request.auth.bearerToken) {
        headers['Authorization'] = `Bearer ${request.auth.bearerToken}`
      } else if (request.auth?.authType === 'basic' && request.auth.basicUsername) {
        const creds = btoa(`${request.auth.basicUsername}:${request.auth.basicPassword || ''}`)
        headers['Authorization'] = `Basic ${creds}`
      } else if (request.auth?.authType === 'apikey' && request.auth.apiKey && request.auth.apiKeyHeader) {
        headers[request.auth.apiKeyHeader] = request.auth.apiKey
      }

      const startTime = performance.now()

      const fetchOptions: RequestInit = {
        method: request.method,
        headers,
      }

      if (request.body?.mode !== 'none' && request.body?.raw) {
        if (request.body.mode === 'json') {
          headers['Content-Type'] = 'application/json'
          fetchOptions.body = request.body.raw
        } else if (request.body.mode === 'xml') {
          headers['Content-Type'] = 'application/xml'
          fetchOptions.body = request.body.raw
        } else {
          fetchOptions.body = request.body.raw
        }
      }

      const resp = await fetch(url.toString(), fetchOptions)
      const elapsed = Math.round(performance.now() - startTime)

      const respHeaders: { key: string; value: string; enabled: boolean }[] = []
      resp.headers.forEach((value, key) => {
        respHeaders.push({ key, value, enabled: true })
      })

      const bodyText = await resp.text()

      setResponse({
        status: resp.status,
        statusText: resp.statusText,
        headers: respHeaders,
        body: bodyText,
        timeMs: elapsed,
        sizeBytes: bodyText.length,
      })

      // Save to history
      addHistoryEntry({
        id: crypto.randomUUID(),
        request: { ...request },
        response: {
          status: resp.status,
          statusText: resp.statusText,
          headers: respHeaders,
          body: bodyText,
          timeMs: elapsed,
          sizeBytes: bodyText.length,
        },
        timestamp: new Date().toISOString(),
      })
    } catch (e: any) {
      setError(e?.toString() || 'Request failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <MainLayout
      leftSidebar={
        <div className="sidebar-content">
          <div className="sidebar-tabs">
            {(['collection', 'history'] as const).map((p) => (
              <button
                key={p}
                onClick={() => setLeftPanel(leftPanel === p ? 'none' : p)}
                className={`sidebar-tab ${leftPanel === p ? 'active' : ''}`}
              >
                {p === 'collection' ? '📁' : '🕐'}
              </button>
            ))}
          </div>
          <div className="sidebar-panel">
            {leftPanel === 'collection' && <CollectionTree />}
            {leftPanel === 'history' && <HistoryList />}
          </div>
          <EnvironmentSelector />
        </div>
      }
      rightSidebar={
        showAi ? (
          <div className="sidebar-content">
            <div className="sidebar-header">
              <span>🤖 AI</span>
              <button onClick={() => setShowAi(false)} className="sidebar-close-btn">✕</button>
            </div>
            <AiPanel />
          </div>
        ) : undefined
      }
    >
      <div className="app-center">
        <RequestBuilder onSend={handleSend} />
        <ResponseViewer />

        {/* AI FAB (floating action button) */}
        {!showAi && (
          <button onClick={() => setShowAi(true)} className="ai-fab" title="AI 助手">
            🤖
          </button>
        )}
      </div>
    </MainLayout>
  )
}
