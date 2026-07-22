import { useTranslation } from 'react-i18next'
import { useRequestStore } from '../../stores/requestStore'
import { Clock, HardDrive, AlertCircle, Code, Copy, Check, Search } from 'lucide-react'
import { useState } from 'react'
import { CodeGenerator } from './CodeGenerator'

type Tab = 'body' | 'headers'

export function ResponseViewer() {
  const { t } = useTranslation()
  const { response, loading, error } = useRequestStore()
  const [activeTab, setActiveTab] = useState<Tab>('body')
  const [showCodeGen, setShowCodeGen] = useState(false)
  const [searchText, setSearchText] = useState('')
  const [copyOk, setCopyOk] = useState(false)

  const handleCopyResponse = async () => {
    if (!response) return
    try {
      await navigator.clipboard.writeText(formatResponseBody(response.body))
      setCopyOk(true)
      setTimeout(() => setCopyOk(false), 2000)
    } catch {}
  }

  if (loading) {
    return (
      <div className="response-empty">
        <div className="loader">{t('sendingRequest')}</div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="response-error">
        <AlertCircle size={24} />
        <span>{error}</span>
      </div>
    )
  }

  if (!response) {
    return (
      <div className="response-empty">
        <span className="response-icon">⚡</span>
        <span className="response-hint">{t('enterUrlHint')}</span>
        <span className="response-subhint">{t('appTagline')}</span>
      </div>
    )
  }

  const statusColor =
    response.status < 200 ? 'status-neutral' :
    response.status < 300 ? 'status-ok' :
    response.status < 400 ? 'status-warn' :
    'status-error'

  return (
    <div className="response-viewer">
      {/* Response meta */}
      <div className="response-meta">
        <span className={`response-status ${statusColor}`}>
          {response.status} {response.statusText}
        </span>
        <span className="response-stat">
          <Clock size={12} />
          {response.timeMs}ms
        </span>
        <span className="response-stat">
          <HardDrive size={12} />
          {formatBytes(response.sizeBytes)}
        </span>
        <div className="response-meta-actions">
          <button
            onClick={() => setShowCodeGen(true)}
            className="response-action-btn"
            title={t('generateCode')}
          >
            <Code size={12} />
            {t('generateCode')}
          </button>
          <button
            onClick={handleCopyResponse}
            className="response-action-btn"
            title="Copy response body"
          >
            {copyOk ? <Check size={12} /> : <Copy size={12} />}
            {copyOk ? t('copied') : t('copyCode')}
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="response-tabs">
        {(['body', 'headers'] as Tab[]).map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`tab-btn ${activeTab === tab ? 'active' : ''}`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Content */}
      <div className="response-content">
        {activeTab === 'body' && (
          <div className="response-body-area">
            {response.body.length > 0 && (
              <div className="response-search-bar">
                <Search size={11} />
                <input
                  type="text"
                  value={searchText}
                  onChange={(e) => setSearchText(e.target.value)}
                  placeholder="Search in response..."
                  className="response-search-input"
                />
              </div>
            )}
            <pre className="response-body-text" dangerouslySetInnerHTML={{
              __html: searchText
                ? highlightText(renderResponseBody(response.body), searchText)
                : renderResponseBody(response.body)
            }} />
          </div>
        )}
        {activeTab === 'headers' && (
          <div className="response-headers">
            {response.headers.map((h, i) => (
              <div key={i} className="response-header-row">
                <span className="rh-key">{h.key}:</span>
                <span className="rh-value">{h.value}</span>
              </div>
            ))}
          </div>
        )}
      </div>

      {showCodeGen && <CodeGenerator onClose={() => setShowCodeGen(false)} />}
    </div>
  )
}

function formatBytes(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
}

function formatResponseBody(body: string): string {
  try {
    return JSON.stringify(JSON.parse(body), null, 2)
  } catch {
    return body
  }
}

function renderResponseBody(body: string): string {
  const formatted = formatResponseBody(body)
  const isJson = (() => { try { JSON.parse(body); return true } catch { return false } })()
  if (isJson) return syntaxHighlightJson(formatted)
  return escapeHtml(formatted)
}

function syntaxHighlightJson(json: string): string {
  let out = json
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
  out = out.replace(/(&quot;(?:[^&]|\\.)*&quot;)\s*:/g, '<span class="syn-key">$1</span>:')
  out = out.replace(/:\s*(&quot;(?:[^&]|\\.)*&quot;)/g, ': <span class="syn-string">$1</span>')
  out = out.replace(/:\s*(\d+(?:\.\d+)?)/g, ': <span class="syn-number">$1</span>')
  out = out.replace(/:\s*(true|false)\b/g, ': <span class="syn-boolean">$1</span>')
  out = out.replace(/:\s*(null)\b/g, ': <span class="syn-null">$1</span>')
  return out
}

function highlightText(text: string, query: string): string {
  if (!query.trim()) return text
  const escaped = query.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
  const regex = new RegExp(`(${escaped})`, 'gi')
  return text.replace(regex, '<mark class="search-highlight">$1</mark>')
}

function escapeHtml(text: string): string {
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
}
