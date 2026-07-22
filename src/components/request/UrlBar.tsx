import { useTranslation } from 'react-i18next'
import { useRequestStore } from '../../stores/requestStore'

export function UrlBar() {
  const { t } = useTranslation()
  const { request, setUrl } = useRequestStore()

  return (
    <input
      type="text"
      value={request.url}
      onChange={(e) => setUrl(e.target.value)}
      placeholder={t('enterUrl')}
      className="url-input"
      spellCheck={false}
    />
  )
}
