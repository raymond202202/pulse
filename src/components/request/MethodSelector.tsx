import { useRequestStore } from '../../stores/requestStore'
import type { HttpMethod } from '../../types'

const METHODS: HttpMethod[] = ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'HEAD', 'OPTIONS']

const METHOD_COLORS: Record<string, string> = {
  GET: '#22c55e',
  POST: '#f59e0b',
  PUT: '#3b82f6',
  DELETE: '#ef4444',
  PATCH: '#8b5cf6',
  HEAD: '#6b7280',
  OPTIONS: '#6b7280',
}

export function MethodSelector() {
  const { request, setMethod } = useRequestStore()

  return (
    <select
      value={request.method}
      onChange={(e) => setMethod(e.target.value as HttpMethod)}
      className="method-select"
      style={{ color: METHOD_COLORS[request.method] }}
    >
      {METHODS.map((m) => (
        <option key={m} value={m} style={{ color: METHOD_COLORS[m] }}>
          {m}
        </option>
      ))}
    </select>
  )
}
