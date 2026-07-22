import { useRequestStore } from '../../stores/requestStore'
import { KeyValueEditor } from '../common/KeyValueEditor'

export function HeadersEditor() {
  const { request, setHeaders } = useRequestStore()
  return (
    <KeyValueEditor
      items={request.headers}
      onChange={setHeaders}
      keyPlaceholder="Header Name"
      valuePlaceholder="Header Value"
    />
  )
}
