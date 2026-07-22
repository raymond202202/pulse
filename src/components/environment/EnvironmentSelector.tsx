import { useTranslation } from 'react-i18next'
import { useEnvironmentStore } from '../../stores/environmentStore'

export function EnvironmentSelector() {
  const { t } = useTranslation()
  const { environments, activeEnvironmentId, setActiveEnvironment } = useEnvironmentStore()

  return (
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
    </div>
  )
}
