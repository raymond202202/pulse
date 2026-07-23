import { useState, useRef, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { useAiStore } from '../../stores/aiStore'
import { useRequestStore } from '../../stores/requestStore'
import { useSettingsStore } from '../../stores/settingsStore'
import { aiChat } from '../../lib/aiService'
import { Send, Sparkles, Trash2 } from 'lucide-react'
import type { AiMessage } from '../../types'

export function AiPanel() {
  const { t } = useTranslation()
  const { messages, addMessage, loading, setLoading, clearMessages } = useAiStore()
  const { request, response } = useRequestStore()
  const [input, setInput] = useState('')
  const bottomRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const handleSend = async () => {
    if (!input.trim() || loading) return
    const userMsg: AiMessage = { role: 'user', content: input }
    addMessage(userMsg)
    setInput('')
    setLoading(true)

    try {
      // Build context from current request/response
      const settings = useSettingsStore.getState()

      let systemPrompt = 'You are Pulse AI, an API testing expert. 请用中文回答。'
      if (settings.aiContextEnabled) {
        let ctx = ''
        if (request.url) ctx += `当前请求：${request.method} ${request.url}\n`
        if (request.headers.some(h => h.key)) ctx += `Headers: ${JSON.stringify(request.headers.filter(h => h.enabled && h.key))}\n`
        if (response) ctx += `响应状态：${response.status} ${response.statusText}\n`
        if (ctx) systemPrompt += `\n\n上下文：\n${ctx}`
      }

      const result = await aiChat({
        messages: [...messages, userMsg],
        systemPrompt,
      })
      addMessage({ role: 'assistant', content: result.content })
    } catch (e: any) {
      addMessage({ role: 'assistant', content: `${t('aiError')}: ${e?.message || e?.toString() || 'Unknown'}` })
    } finally {
      setLoading(false)
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey && !e.nativeEvent.isComposing) {
      e.preventDefault()
      handleSend()
    }
  }

  return (
    <div className="ai-panel">
      {/* Messages */}
      <div className="ai-messages">
        {messages.length === 0 && (
          <div className="ai-empty">
            <Sparkles size={24} className="ai-empty-icon" />
            <p className="ai-empty-text">{t('askMeAnything')}</p>
            <p className="ai-empty-subtext">{t('aiDescription')}</p>
          </div>
        )}
        {messages.map((msg, i) => (
          <div key={i} className={`ai-msg ${msg.role}`}>
            <div className="ai-msg-bubble">
              <pre className="ai-msg-text">{msg.content}</pre>
            </div>
          </div>
        ))}
        {loading && (
          <div className="ai-msg assistant">
            <div className="ai-loading">
              <span className="ai-dot" />
              <span className="ai-dot" style={{ animationDelay: '150ms' }} />
              <span className="ai-dot" style={{ animationDelay: '300ms' }} />
            </div>
          </div>
        )}
        <div ref={bottomRef} />
      </div>

      {/* Input */}
      <div className="ai-input-area">
        <textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={t('inputPlaceholder')}
          rows={2}
          className="ai-textarea"
        />
        <button
          onClick={handleSend}
          disabled={loading || !input.trim()}
          className="ai-send-btn"
        >
          <Send size={14} />
        </button>
      </div>
    </div>
  )
}
