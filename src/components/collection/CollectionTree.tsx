import { useTranslation } from 'react-i18next'
import { useCollectionStore } from '../../stores/collectionStore'
import { useRequestStore } from '../../stores/requestStore'
import { useState } from 'react'

export function CollectionTree() {
  const { t } = useTranslation()
  const { collections } = useCollectionStore()
  const { setMethod, setUrl } = useRequestStore()

  if (collections.length === 0) {
    return (
      <div className="panel-empty">
        <span className="panel-empty-icon">📂</span>
        <p className="panel-empty-text">{t('noCollections')}</p>
      </div>
    )
  }

  return (
    <div className="collection-tree">
      {collections.map((col) => (
        <div key={col.id} className="collection-group">
          <div className="collection-name">{col.name}</div>
          {col.items.map((item) => {
            if (item.type === 'folder') {
              return <FolderNode key={item.id} name={item.name} depth={1} />
            }
            return (
              <div
                key={item.id}
                className="request-node"
                onClick={() => {
                  setMethod(item.request.method as any)
                  setUrl(item.request.url)
                }}
              >
                <span className={`method-badge ${item.request.method.toLowerCase()}`}>
                  {item.request.method}
                </span>
                <span className="request-node-name">{item.name}</span>
              </div>
            )
          })}
        </div>
      ))}
    </div>
  )
}

function FolderNode({ name, depth }: { name: string; depth: number }) {
  const [expanded, setExpanded] = useState(true)
  return (
    <div className="folder-node">
      <div
        className="folder-name"
        style={{ paddingLeft: `${8 + depth * 12}px` }}
        onClick={() => setExpanded(!expanded)}
      >
        {expanded ? '📂' : '📁'} {name}
      </div>
    </div>
  )
}
