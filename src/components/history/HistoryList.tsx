import { useTranslation } from 'react-i18next'
import { useHistoryStore } from '../../stores/historyStore'
import { useRequestStore } from '../../stores/requestStore'

export function HistoryList() {
  const { t } = useTranslation()
  const { entries, clearHistory } = useHistoryStore()
  const { setMethod, setUrl, setHeaders, setQueryParams, setBody, setAuth } = useRequestStore()

  const restoreRequest = (entry: import('../../types').HistoryEntry) => {
    setMethod(entry.request.method as any)
    setUrl(entry.request.url)
    if (entry.request.headers) setHeaders(entry.request.headers)
    if (entry.request.queryParams) setQueryParams(entry.request.queryParams)
    if (entry.request.body) setBody(entry.request.body)
    if (entry.request.auth) setAuth(entry.request.auth)
  }

  if (entries.length === 0) {
    return (
      <div className="panel-empty">
        <span className="panel-empty-icon">🕐</span>
        <p className="panel-empty-text">{t('noHistory')}</p>
      </div>
    )
  }

  return (
    <div className="history-list">
      <div className="history-header">
        <span className="history-title">{t('history')}</span>
        <button onClick={clearHistory} className="history-clear-btn">{t('clearHistory')}</button>
      </div>
      {entries.map((entry) => (
        <div key={entry.id} className="history-entry" onClick={() => restoreRequest(entry)}>
          <span className={`method-badge ${entry.request.method.toLowerCase()}`}>
            {entry.request.method}
          </span>
          <span className="history-url">{entry.request.url}</span>
          {entry.response && (
            <span className={`history-status ${
              entry.response.status < 300 ? 'status-ok' :
              entry.response.status < 400 ? 'status-warn' : 'status-error'
            }`}>
              {entry.response.status}
            </span>
          )}
        </div>
      ))}
    </div>
  )
}
