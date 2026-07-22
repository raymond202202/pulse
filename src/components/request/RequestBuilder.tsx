import { useTranslation } from 'react-i18next'
import { Send, Loader2 } from 'lucide-react'
import { useRequestStore } from '../../stores/requestStore'
import { MethodSelector } from './MethodSelector'
import { UrlBar } from './UrlBar'
import { QueryParamsEditor } from './QueryParamsEditor'
import { HeadersEditor } from './HeadersEditor'
import { BodyEditor } from './BodyEditor'
import { AuthConfig } from './AuthConfig'
import { RequestTabs } from './RequestTabs'
import { useState } from 'react'

type Tab = 'params' | 'headers' | 'body' | 'auth' | 'scripts'

interface Props {
  onSend: () => void
}

export function RequestBuilder({ onSend }: Props) {
  const { t } = useTranslation()
  const { request, loading } = useRequestStore()
  const [activeTab, setActiveTab] = useState<Tab>('params')

  const tabs: { key: Tab; label: string }[] = [
    { key: 'params', label: t('params') },
    { key: 'headers', label: t('headers') },
    { key: 'body', label: t('body') },
    { key: 'auth', label: t('auth') },
    { key: 'scripts', label: t('scripts') },
  ]

  return (
    <div className="request-builder">
      <RequestTabs />
      {/* URL Bar */}
      <div className="url-bar">
        <MethodSelector />
        <UrlBar />
        <button
          onClick={onSend}
          disabled={loading || !request.url.trim()}
          className="send-btn"
        >
          {loading ? (
            <Loader2 size={14} className="spinner" />
          ) : (
            <Send size={14} />
          )}
          {t('send')}
        </button>
      </div>

      {/* Tabs */}
      <div className="request-tabs">
        {tabs.map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            className={`tab-btn ${activeTab === tab.key ? 'active' : ''}`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab content */}
      <div className="tab-content">
        {activeTab === 'params' && <QueryParamsEditor />}
        {activeTab === 'headers' && <HeadersEditor />}
        {activeTab === 'body' && <BodyEditor />}
        {activeTab === 'auth' && <AuthConfig />}
        {activeTab === 'scripts' && (
          <div className="placeholder-text">{t('scripts')} — coming soon</div>
        )}
      </div>
    </div>
  )
}
