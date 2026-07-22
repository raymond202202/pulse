import { useState, useCallback } from 'react'
import { useTranslation } from 'react-i18next'
import { useCollectionStore } from '../../stores/collectionStore'
import { useRequestStore } from '../../stores/requestStore'
import { Download, Upload, X, Check, AlertCircle } from 'lucide-react'
import type { ApiRequest, Collection, KeyValue } from '../../types'

interface Props {
  onClose: () => void
}

export function ImportExport({ onClose }: Props) {
  const { t } = useTranslation()
  const { collections, setCollections, addCollection } = useCollectionStore()
  const { request, setMethod, setUrl, setHeaders, setBody, setAuth, setQueryParams } = useRequestStore()
  const [tab, setTab] = useState<'import' | 'export'>('export')
  const [importJson, setImportJson] = useState('')
  const [importError, setImportError] = useState('')
  const [importOk, setImportOk] = useState(false)
  const [exportFormat, setExportFormat] = useState<'pulse' | 'postman'>('pulse')

  // --- Export ---
  const exportData = useCallback(() => {
    const data = exportFormat === 'pulse'
      ? JSON.stringify({ collections, version: '0.1.0', exporter: 'pulse' }, null, 2)
      : convertToPostman(collections)
    return data
  }, [collections, exportFormat])

  const handleCopyExport = async () => {
    try {
      await navigator.clipboard.writeText(exportData())
      setImportOk(true)
      setTimeout(() => setImportOk(false), 2000)
    } catch {}
  }

  const handleDownload = () => {
    const blob = new Blob([exportData()], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `pulse-collections-${new Date().toISOString().slice(0, 10)}.json`
    a.click()
    URL.revokeObjectURL(url)
  }

  // --- Import ---
  const handleImport = () => {
    setImportError('')
    setImportOk(false)
    try {
      const data = JSON.parse(importJson)

      // Try Postman format
      if (data.info?._postman_id || data.info?.schema?.includes('postman')) {
        const imported = convertFromPostman(data)
        if (imported.length > 0) {
          setCollections([...collections, ...imported])
          setImportOk(true)
          return
        }
      }

      // Try Pulse format
      if (data.collections && Array.isArray(data.collections)) {
        setCollections([...collections, ...data.collections])
        setImportOk(true)
        return
      }

      // Try single collection
      if (data.name && data.items) {
        setCollections([...collections, data as Collection])
        setImportOk(true)
        return
      }

      setImportError('无法识别的格式，请使用 Pulse 或 Postman 格式')
    } catch {
      setImportError('JSON 解析失败，请检查格式')
    }
  }

  return (
    <div className="import-export-overlay" onClick={onClose}>
      <div className="import-export-modal" onClick={(e) => e.stopPropagation()}>
        <div className="import-export-header">
          <span className="import-export-title">
            {tab === 'export' ? <Download size={14} /> : <Upload size={14} />}
            {tab === 'export' ? '导出' : '导入'}
          </span>
          <button onClick={onClose} className="import-export-close"><X size={14} /></button>
        </div>

        <div className="import-export-tabs">
          <button className={`ie-tab ${tab === 'export' ? 'active' : ''}`} onClick={() => setTab('export')}>
            <Download size={12} /> 导出
          </button>
          <button className={`ie-tab ${tab === 'import' ? 'active' : ''}`} onClick={() => setTab('import')}>
            <Upload size={12} /> 导入
          </button>
        </div>

        {tab === 'export' ? (
          <div className="ie-export">
            <div className="ie-format-select">
              <label>导出格式</label>
              <select value={exportFormat} onChange={(e) => setExportFormat(e.target.value as any)} className="ie-select">
                <option value="pulse">Pulse 格式</option>
                <option value="postman">Postman v2.1 格式</option>
              </select>
            </div>
            <pre className="ie-code">{exportData().slice(0, 2000)}{exportData().length > 2000 ? '\n...' : ''}</pre>
            <div className="ie-actions">
              <button onClick={handleCopyExport} className="ie-btn">
                {importOk ? <Check size={12} /> : <Download size={12} />}
                {importOk ? '已复制' : '复制到剪贴板'}
              </button>
              <button onClick={handleDownload} className="ie-btn primary">
                <Download size={12} /> 下载文件
              </button>
            </div>
          </div>
        ) : (
          <div className="ie-import">
            <textarea
              value={importJson}
              onChange={(e) => { setImportJson(e.target.value); setImportError(''); setImportOk(false) }}
              placeholder="粘贴 Pulse 或 Postman 格式的 JSON..."
              className="ie-textarea"
              rows={10}
            />
            {importError && (
              <div className="ie-error"><AlertCircle size={12} /> {importError}</div>
            )}
            {importOk && (
              <div className="ie-success"><Check size={12} /> 导入成功</div>
            )}
            <button onClick={handleImport} className="ie-btn primary" disabled={!importJson.trim()}>
              <Upload size={12} /> 导入
            </button>
          </div>
        )}
      </div>
    </div>
  )
}

// --- Converters ---

function convertToPostman(collections: Collection[]): string {
  const items = collections.flatMap((col) => ({
    name: col.name,
    item: col.items.map((item) => {
      if (item.type === 'folder') {
        return { name: item.name, item: [] }
      }
      const req: any = {
        method: item.request.method,
        header: item.request.headers.filter((h) => h.enabled && h.key).map((h) => ({
          key: h.key, value: h.value, type: 'text',
        })),
        url: {
          raw: item.request.url,
          query: item.request.queryParams.filter((p) => p.enabled && p.key).map((p) => ({
            key: p.key, value: p.value,
          })),
        },
      }
      if (item.request.body?.raw && item.request.body.mode !== 'none') {
        req.body = {
          mode: item.request.body.mode === 'json' ? 'raw' : item.request.body.mode,
          raw: item.request.body.raw,
          options: item.request.body.mode === 'json' ? { raw: { language: 'json' } } : undefined,
        }
      }
      return { name: item.name, request: req }
    }),
  }))

  return JSON.stringify({
    info: {
      name: 'Pulse Collections',
      schema: 'https://schema.getpostman.com/json/collection/v2.1.0/collection.json',
    },
    item: items.length === 1 ? items[0].item : items,
  }, null, 2)
}

function convertFromPostman(data: any): Collection[] {
  const items = data.item || []
  const col: Collection = {
    id: crypto.randomUUID(),
    name: data.info?.name || 'Imported',
    items: [],
    variables: [],
  }

  const convertItem = (pItem: any): import('../../types').CollectionItem | null => {
    if (pItem.item && Array.isArray(pItem.item)) {
      return {
        type: 'folder',
        id: crypto.randomUUID(),
        name: pItem.name || 'Folder',
        items: pItem.item.map(convertItem).filter(Boolean) as import('../../types').CollectionItem[],
      }
    }
    if (!pItem.request) return null

    const req = pItem.request
    const headers: KeyValue[] = (req.header || []).map((h: any) => ({
      key: h.key || '', value: h.value || '', enabled: true,
    }))
    if (headers.length === 0) headers.push({ key: '', value: '', enabled: true })

    let queryParams: KeyValue[] = []
    if (req.url?.query) {
      queryParams = req.url.query.map((q: any) => ({
        key: q.key || '', value: q.value || '', enabled: true,
      }))
    }

    let bodyMode: any = 'none'
    let bodyRaw = ''
    if (req.body) {
      if (req.body.mode === 'raw') {
        bodyMode = 'raw'
        bodyRaw = req.body.raw || ''
        if (req.body.options?.raw?.language === 'json') bodyMode = 'json'
      } else if (req.body.mode) {
        bodyMode = req.body.mode
      }
    }

    const request: ApiRequest = {
      id: crypto.randomUUID(),
      name: pItem.name || 'Untitled',
      method: req.method || 'GET',
      url: typeof req.url === 'string' ? req.url : (req.url?.raw || ''),
      headers,
      queryParams,
      body: bodyMode === 'none' ? undefined : { mode: bodyMode, raw: bodyRaw },
      auth: undefined,
    }

    return { type: 'request', id: crypto.randomUUID(), name: request.name, request }
  }

  for (const item of items) {
    const converted = convertItem(item)
    if (converted) col.items.push(converted)
  }

  return [col]
}
