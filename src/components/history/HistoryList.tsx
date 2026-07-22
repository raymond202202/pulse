import { useTranslation } from 'react-i18next'
import { useHistoryStore } from '../../stores/historyStore'

export function HistoryList() {
  const { t } = useTranslation()
  const { entries, clearHistory } = useHistoryStore()

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
        <div key={entry.id} className="history-entry">
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
