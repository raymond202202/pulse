import { useState, useRef, useCallback } from 'react'
import { useRequestStore } from '../../stores/requestStore'
import { Plus, X } from 'lucide-react'

export function RequestTabs() {
  const { tabIds, activeTabId, requestMap, setActiveTab, createTab, closeTab, renameTab } = useRequestStore()

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
            <TabItem
              key={id}
              id={id}
              method={req.method}
              name={req.name}
              url={req.url}
              isActive={id === activeTabId}
              methodColor={methodColor[req.method] || '#6b7280'}
              onClick={() => setActiveTab(id)}
              onClose={() => closeTab(id)}
              onRename={(name) => renameTab(id, name)}
              canClose={tabIds.length > 1}
            />
          )
        })}
      </div>
      <button className="request-tab-add" onClick={createTab} title="新标签页">
        <Plus size={12} />
      </button>
    </div>
  )
}

function TabItem({
  id, method, name, url, isActive, methodColor, onClick, onClose, onRename, canClose,
}: {
  id: string; method: string; name: string; url: string
  isActive: boolean; methodColor: string
  onClick: () => void; onClose: () => void; onRename: (name: string) => void
  canClose: boolean
}) {
  const [editing, setEditing] = useState(false)
  const [editValue, setEditValue] = useState(name)
  const inputRef = useRef<HTMLInputElement>(null)

  const handleDoubleClick = useCallback(() => {
    setEditValue(name)
    setEditing(true)
    setTimeout(() => inputRef.current?.select(), 50)
  }, [name])

  const handleSubmit = useCallback(() => {
    const trimmed = editValue.trim()
    if (trimmed) onRename(trimmed)
    setEditing(false)
  }, [editValue, onRename])

  const displayName = url ? (url.length > 30 ? url.slice(0, 27) + '...' : url) : name

  if (editing) {
    return (
      <div className={`request-tab ${isActive ? 'active' : ''}`} onDoubleClick={handleDoubleClick}>
        <span className="request-tab-method" style={{ color: methodColor }}>{method}</span>
        <input
          ref={inputRef}
          className="request-tab-edit-input"
          value={editValue}
          onChange={(e) => setEditValue(e.target.value)}
          onBlur={handleSubmit}
          onKeyDown={(e) => { if (e.key === 'Enter' && !e.nativeEvent.isComposing) handleSubmit(); if (e.key === 'Escape') setEditing(false) }}
          onClick={(e) => e.stopPropagation()}
        />
      </div>
    )
  }

  return (
    <div className={`request-tab ${isActive ? 'active' : ''}`} onClick={onClick} onDoubleClick={handleDoubleClick}>
      <span className="request-tab-method" style={{ color: methodColor }}>{method}</span>
      <span className="request-tab-name">{displayName}</span>
      {canClose && (
        <button className="request-tab-close" onClick={(e) => { e.stopPropagation(); onClose() }}>
          <X size={10} />
        </button>
      )}
    </div>
  )
}
