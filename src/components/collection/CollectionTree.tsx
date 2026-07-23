import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useCollectionStore } from '../../stores/collectionStore'
import { useRequestStore } from '../../stores/requestStore'
import { FolderOpen, FileText, Plus, Trash2, Edit3, Check, X, ChevronRight, ChevronDown, Download, Upload } from 'lucide-react'
import type { CollectionItem } from '../../types'
import { ImportExport } from '../common/ImportExport'

export function CollectionTree() {
  const { t } = useTranslation()
  const { collections, addCollection, removeCollection, renameCollection } = useCollectionStore()
  const [newName, setNewName] = useState('')
  const [adding, setAdding] = useState(false)
  const [showImportExport, setShowImportExport] = useState(false)

  const handleAdd = () => {
    const name = newName.trim()
    if (name) {
      addCollection(name)
      setNewName('')
      setAdding(false)
    }
  }

  return (
    <div className="collection-tree">
      <div className="collection-header">
        <span className="collection-header-title">{t('collections')}</span>
        <button className="collection-add-btn" onClick={() => { setAdding(true); setNewName('') }} title={t('createCollection')}>
          <Plus size={12} />
        </button>
        <button className="collection-add-btn" onClick={() => setShowImportExport(true)} title="导入/导出">
          <Upload size={11} />
        </button>
      </div>

      {adding && (
        <div className="collection-add-form">
          <input
            autoFocus
            value={newName}
            onChange={(e) => setNewName(e.target.value)}
            onKeyDown={(e) => { if (e.key === 'Enter' && !e.nativeEvent.isComposing) handleAdd(); if (e.key === 'Escape') setAdding(false) }}
            placeholder={t('collectionName')}
            className="collection-name-input"
          />
          <button onClick={handleAdd} className="collection-add-confirm"><Check size={11} /></button>
          <button onClick={() => setAdding(false)} className="collection-add-cancel"><X size={11} /></button>
        </div>
      )}

      {collections.length === 0 && !adding && (
        <div className="panel-empty">
          <FolderOpen size={18} className="panel-empty-icon" />
          <p className="panel-empty-text">{t('noCollections')}</p>
        </div>
      )}

      <div className="collection-list">
        {collections.map((col) => (
          <CollectionGroup key={col.id} collection={col} />
        ))}
      </div>

      {showImportExport && <ImportExport onClose={() => setShowImportExport(false)} />}
    </div>
  )
}

function CollectionGroup({ collection }: { collection: import('../../types').Collection }) {
  const { t } = useTranslation()
  const { renameCollection, removeCollection, saveRequestToCollection } = useCollectionStore()
  const { request } = useRequestStore()
  const [expanded, setExpanded] = useState(true)
  const [editing, setEditing] = useState(false)
  const [editName, setEditName] = useState(collection.name)

  const handleRename = () => {
    const name = editName.trim()
    if (name) renameCollection(collection.id, name)
    setEditing(false)
  }

  return (
    <div className="collection-group">
      <div className="collection-group-header">
        <button className="collection-expand-btn" onClick={() => setExpanded(!expanded)}>
          {expanded ? <ChevronDown size={10} /> : <ChevronRight size={10} />}
        </button>
        <FolderOpen size={12} className="collection-folder-icon" />

        {editing ? (
          <input
            autoFocus
            value={editName}
            onChange={(e) => setEditName(e.target.value)}
            onBlur={handleRename}
            onKeyDown={(e) => { if (e.key === 'Enter' && !e.nativeEvent.isComposing) handleRename(); if (e.key === 'Escape') setEditing(false) }}
            className="collection-rename-input"
            onClick={(e) => e.stopPropagation()}
          />
        ) : (
          <span className="collection-group-name" onDoubleClick={() => { setEditName(collection.name); setEditing(true) }}>
            {collection.name}
          </span>
        )}

        <div className="collection-group-actions">
          <button onClick={() => { setEditName(collection.name); setEditing(true) }} className="collection-action-btn" title={t('edit')}>
            <Edit3 size={10} />
          </button>
          <button
            onClick={() => saveRequestToCollection(collection.id, request)}
            className="collection-action-btn"
            title={t('save')}
          >
            <Plus size={10} />
          </button>
          <button onClick={() => removeCollection(collection.id)} className="collection-action-btn danger" title={t('delete')}>
            <Trash2 size={10} />
          </button>
        </div>
      </div>

      {expanded && collection.items.map((item) => (
        <CollectionItemRow key={item.id} item={item} collectionId={collection.id} />
      ))}
    </div>
  )
}

function CollectionItemRow({ item, collectionId }: { item: CollectionItem; collectionId: string }) {
  const { removeItemFromCollection } = useCollectionStore()
  const { setMethod, setUrl } = useRequestStore()

  if (item.type === 'folder') {
    return (
      <div className="collection-folder-row">
        <span className="collection-folder-name">📁 {item.name}</span>
      </div>
    )
  }

  return (
    <div
      className="collection-request-row"
      onClick={() => {
        setMethod(item.request.method as any)
        setUrl(item.request.url)
      }}
    >
      <span className={`method-badge ${item.request.method.toLowerCase()}`}>
        {item.request.method}
      </span>
      <span className="collection-request-name">{item.name}</span>
      <button
        onClick={(e) => { e.stopPropagation(); removeItemFromCollection(collectionId, item.id) }}
        className="collection-action-btn danger"
      >
        <X size={8} />
      </button>
    </div>
  )
}
