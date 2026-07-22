import { useRequestStore } from '../../stores/requestStore'
import { KeyValueEditor } from '../common/KeyValueEditor'

export function QueryParamsEditor() {
  const { request, setQueryParams } = useRequestStore()
  return (
    <KeyValueEditor
      items={request.queryParams}
      onChange={setQueryParams}
      keyPlaceholder="Parameter Name"
      valuePlaceholder="Parameter Value"
    />
  )
}
