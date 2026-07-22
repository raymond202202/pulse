import { useTranslation } from 'react-i18next'
import { useRequestStore } from '../../stores/requestStore'
import type { BodyMode } from '../../types'

const BODY_MODES: { value: BodyMode; label: string }[] = [
  { value: 'none', label: 'bodyNone' },
  { value: 'json', label: 'bodyJson' },
  { value: 'xml', label: 'bodyXml' },
  { value: 'formdata', label: 'bodyFormData' },
  { value: 'formurlencoded', label: 'bodyFormUrlEncoded' },
  { value: 'graphql', label: 'bodyGraphql' },
  { value: 'raw', label: 'bodyRaw' },
  { value: 'binary', label: 'bodyBinary' },
]

export function BodyEditor() {
  const { t } = useTranslation()
  const { request, setBody } = useRequestStore()
  const body = request.body || { mode: 'none' as BodyMode }

  const handleModeChange = (mode: BodyMode) => {
    setBody({ ...body, mode })
  }

  const handleRawChange = (raw: string) => {
    setBody({ ...body, raw })
  }

  return (
    <div className="body-editor">
      <div className="body-mode-tabs">
        {BODY_MODES.map((m) => (
          <button
            key={m.value}
            onClick={() => handleModeChange(m.value)}
            className={`body-mode-btn ${body.mode === m.value ? 'active' : ''}`}
          >
            {t(m.label)}
          </button>
        ))}
      </div>

      {body.mode !== 'none' && body.mode !== 'formdata' && body.mode !== 'formurlencoded' && body.mode !== 'binary' && (
        <textarea
          value={body.raw || ''}
          onChange={(e) => handleRawChange(e.target.value)}
          className="body-textarea"
          placeholder={body.mode === 'graphql' ? '{ query { ... } }' : ''}
          spellCheck={false}
        />
      )}

      {(body.mode === 'formdata' || body.mode === 'formurlencoded') && (
        <div className="placeholder-text">Form editor coming soon</div>
      )}
      {body.mode === 'binary' && (
        <div className="placeholder-text">File upload coming soon</div>
      )}
    </div>
  )
}
