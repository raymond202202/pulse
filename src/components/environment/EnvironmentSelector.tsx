import { useState, useCallback } from 'react'
import { useTranslation } from 'react-i18next'
import { useEnvironmentStore } from '../../stores/environmentStore'
import { useVariableResolver } from '../../hooks/useVariableResolver'
import { Plus, Trash2, Settings, X, Check, Edit3 } from 'lucide-react'

export function EnvironmentSelector() {
  const { t } = useTranslation()
  const { environments, activeEnvironmentId, setActiveEnvironment, addEnvironment, removeEnvironment, renameEnvironment } = useEnvironmentStore()
  const [showManager, setShowManager] = useState(false)
  const [newName, setNewName] = useState('')

  const handleAdd = () => {
    const name = newName.trim()
    if (name) {
      addEnvironment(name)
      setNewName('')
    }
  }

  return (
    <>
      <div className="env-selector">
        <select
          value={activeEnvironmentId || ''}
          onChange={(e) => setActiveEnvironment(e.target.value || null)}
          className="env-select"
        >
          <option value="">{t('noEnvironment')}</option>
          {environments.map((env) => (
            <option key={env.id} value={env.id}>
              {env.name}
            </option>
          ))}
        </select>
        <button
          onClick={() => setShowManager(!showManager)}
          className="env-manage-btn"
          title={t('manageEnvironments')}
        >
          <Settings size={11} />
        </button>
      </div>

      {showManager && (
        <div className="env-manager">
          <div className="env-manager-header">
            <span className="env-manager-title">{t('manageEnvironments')}</span>
            <button onClick={() => setShowManager(false)} className="env-manager-close">
              <X size={11} />
            </button>
          </div>

          <div className="env-manager-add">
            <input
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
              onKeyDown={(e) => { if (e.key === 'Enter' && !e.nativeEvent.isComposing) handleAdd() }}
              placeholder={t('environment')}
              className="env-manager-input"
            />
            <button onClick={handleAdd} className="env-manager-add-btn">
              <Plus size={11} />
            </button>
          </div>

          <div className="env-manager-list">
            {environments.length === 0 && (
              <div className="placeholder-text">{t('noEnvironment')}</div>
            )}
            {environments.map((env) => (
              <EnvironmentItem key={env.id} env={env} />
            ))}
          </div>
        </div>
      )}
    </>
  )
}

function EnvironmentItem({ env }: { env: import('../../types').Environment }) {
  const { renameEnvironment, removeEnvironment, addVariable, updateVariable, removeVariable } = useEnvironmentStore()
  const [editing, setEditing] = useState(false)
  const [editName, setEditName] = useState(env.name)

  const handleRename = () => {
    const name = editName.trim()
    if (name) renameEnvironment(env.id, name)
    setEditing(false)
  }

  return (
    <div className="env-item">
      <div className="env-item-header">
        {editing ? (
          <input
            autoFocus
            value={editName}
            onChange={(e) => setEditName(e.target.value)}
            onBlur={handleRename}
            onKeyDown={(e) => { if (e.key === 'Enter' && !e.nativeEvent.isComposing) handleRename(); if (e.key === 'Escape') setEditing(false) }}
            className="env-rename-input"
          />
        ) : (
          <span className="env-item-name" onDoubleClick={() => { setEditName(env.name); setEditing(true) }}>
            {env.name}
          </span>
        )}
        <div className="env-item-actions">
          <button onClick={() => addVariable(env.id)} className="env-action-btn" title="Add variable">
            <Plus size={10} />
          </button>
          <button onClick={() => { setEditName(env.name); setEditing(true) }} className="env-action-btn" title="Rename">
            <Edit3 size={10} />
          </button>
          <button onClick={() => removeEnvironment(env.id)} className="env-action-btn danger" title="Delete">
            <Trash2 size={10} />
          </button>
        </div>
      </div>

      {env.variables.map((v, i) => (
        <div key={i} className="env-variable-row">
          <input
            type="checkbox"
            checked={v.enabled}
            onChange={(e) => updateVariable(env.id, i, v.key, v.value, e.target.checked)}
            className="kv-checkbox"
          />
          <input
            value={v.key}
            onChange={(e) => updateVariable(env.id, i, e.target.value, v.value, v.enabled)}
            placeholder={t('variable')}
            className="env-var-input env-var-key"
            spellCheck={false}
          />
          <span className="env-var-eq">=</span>
          <input
            value={v.value}
            onChange={(e) => updateVariable(env.id, i, v.key, e.target.value, v.enabled)}
            placeholder={t('value')}
            className="env-var-input env-var-value"
            spellCheck={false}
          />
          <button onClick={() => removeVariable(env.id, i)} className="kv-remove-btn">
            <X size={10} />
          </button>
        </div>
      ))}
    </div>
  )
}
