import { useTranslation } from 'react-i18next'
import { useRequestStore } from '../../stores/requestStore'
import type { AuthType } from '../../types'

const AUTH_TYPES: { value: AuthType; label: string }[] = [
  { value: 'none', label: 'authNone' },
  { value: 'bearer', label: 'authBearer' },
  { value: 'basic', label: 'authBasic' },
  { value: 'apikey', label: 'authApiKey' },
  { value: 'oauth2', label: 'authOAuth2' },
]

export function AuthConfig() {
  const { t } = useTranslation()
  const { request, setAuth } = useRequestStore()
  const auth = request.auth || { authType: 'none' as AuthType }

  const handleTypeChange = (authType: AuthType) => {
    setAuth({ ...auth, authType })
  }

  return (
    <div className="auth-config">
      <div className="auth-type-tabs">
        {AUTH_TYPES.map((at) => (
          <button
            key={at.value}
            onClick={() => handleTypeChange(at.value)}
            className={`auth-type-btn ${auth.authType === at.value ? 'active' : ''}`}
          >
            {t(at.label)}
          </button>
        ))}
      </div>

      <div className="auth-fields">
        {auth.authType === 'bearer' && (
          <div className="auth-field">
            <label>Token</label>
            <input
              type="password"
              value={auth.bearerToken || ''}
              onChange={(e) => setAuth({ ...auth, bearerToken: e.target.value })}
              placeholder="eyJhbGciOi..."
              className="auth-input"
            />
          </div>
        )}

        {auth.authType === 'basic' && (
          <>
            <div className="auth-field">
              <label>{t('key')}</label>
              <input
                type="text"
                value={auth.basicUsername || ''}
                onChange={(e) => setAuth({ ...auth, basicUsername: e.target.value })}
                placeholder="Username"
                className="auth-input"
              />
            </div>
            <div className="auth-field">
              <label>{t('value')}</label>
              <input
                type="password"
                value={auth.basicPassword || ''}
                onChange={(e) => setAuth({ ...auth, basicPassword: e.target.value })}
                placeholder="Password"
                className="auth-input"
              />
            </div>
          </>
        )}

        {auth.authType === 'apikey' && (
          <>
            <div className="auth-field">
              <label>Header Name</label>
              <input
                type="text"
                value={auth.apiKeyHeader || ''}
                onChange={(e) => setAuth({ ...auth, apiKeyHeader: e.target.value })}
                placeholder="X-API-Key"
                className="auth-input"
              />
            </div>
            <div className="auth-field">
              <label>API Key</label>
              <input
                type="password"
                value={auth.apiKey || ''}
                onChange={(e) => setAuth({ ...auth, apiKey: e.target.value })}
                placeholder="sk-..."
                className="auth-input"
              />
            </div>
          </>
        )}

        {auth.authType === 'oauth2' && (
          <div className="placeholder-text">OAuth 2.0 — coming soon</div>
        )}
      </div>
    </div>
  )
}
