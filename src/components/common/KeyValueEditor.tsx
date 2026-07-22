import { useState } from 'react'
import type { KeyValue } from '../../types'
import { Plus, X, GripVertical } from 'lucide-react'

interface Props {
  items: KeyValue[]
  onChange: (items: KeyValue[]) => void
  keyPlaceholder?: string
  valuePlaceholder?: string
}

export function KeyValueEditor({ items, onChange, keyPlaceholder, valuePlaceholder }: Props) {
  const addRow = () => {
    onChange([...items, { key: '', value: '', enabled: true }])
  }

  const removeRow = (index: number) => {
    onChange(items.filter((_, i) => i !== index))
  }

  const updateRow = (index: number, field: keyof KeyValue, value: string | boolean) => {
    const updated = items.map((item, i) =>
      i === index ? { ...item, [field]: value } : item
    )
    onChange(updated)
  }

  return (
    <div className="kv-editor">
      {items.length === 0 && (
        <div className="placeholder-text">No items</div>
      )}
      {items.map((item, i) => (
        <div key={i} className="kv-row">
          <input
            type="checkbox"
            checked={item.enabled}
            onChange={(e) => updateRow(i, 'enabled', e.target.checked)}
            className="kv-checkbox"
          />
          <input
            type="text"
            value={item.key}
            onChange={(e) => updateRow(i, 'key', e.target.value)}
            placeholder={keyPlaceholder || 'Key'}
            className="kv-input kv-key"
            spellCheck={false}
          />
          <input
            type="text"
            value={item.value}
            onChange={(e) => updateRow(i, 'value', e.target.value)}
            placeholder={valuePlaceholder || 'Value'}
            className="kv-input kv-value"
            spellCheck={false}
          />
          <button onClick={() => removeRow(i)} className="kv-remove-btn">
            <X size={12} />
          </button>
        </div>
      ))}
      <button onClick={addRow} className="kv-add-btn">
        <Plus size={12} />
        Add
      </button>
    </div>
  )
}
