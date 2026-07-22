import { useRequestStore } from '../../stores/requestStore'
import { Plus, X } from 'lucide-react'

export function RequestTabs() {
  const { tabIds, activeTabId, requestMap, setActiveTab, createTab, closeTab } = useRequestStore()

  return (
    <div className="request-tabs-bar">
      <div className="request-tabs-list">
        {tabIds.map((id) => {
          const req = requestMap[id]
          const methodColor: Record<string, string> = {
            GET: '#22c55e', POST: '#f59e0b', PUT: '#3b82f6',
            DELETE: '#ef4444', PATCH: '#8b5cf6', HEAD: '#6b7280',
          }
          return (
            <div
              key={id}
              className={`request-tab ${id === activeTabId ? 'active' : ''}`}
              onClick={() => setActiveTab(id)}
            >
              <span className="request-tab-method" style={{ color: methodColor[req.method] || '#6b7280' }}>
                {req.method}
              </span>
              <span className="request-tab-name">
                {req.url ? (req.url.length > 30 ? req.url.slice(0, 27) + '...' : req.url) : req.name}
              </span>
              {tabIds.length > 1 && (
                <button
                  className="request-tab-close"
                  onClick={(e) => { e.stopPropagation(); closeTab(id) }}
                >
                  <X size={10} />
                </button>
              )}
            </div>
          )
        })}
      </div>
      <button className="request-tab-add" onClick={createTab} title="新标签页">
        <Plus size={12} />
      </button>
    </div>
  )
}
