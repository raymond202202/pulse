import { useState, useRef, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { useAiStore } from '../../stores/aiStore'
import { useRequestStore } from '../../stores/requestStore'
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
      let contextPrompt = ''
      if (request.url) {
        contextPrompt += `当前请求：${request.method} ${request.url}\n`
      }
      if (response) {
        contextPrompt += `响应状态：${response.status} ${response.statusText}\n`
      }

      const fullPrompt = contextPrompt
        ? `${contextPrompt}\n用户问题：${input}`
        : input

      // TODO: Phase 4 - integrate DeepSeek API
      const mockReply = `[AI 集成待上线] 你问的是：${fullPrompt}\n\nDeepSeek API 将在 Phase 4 接入。`
      addMessage({ role: 'assistant', content: mockReply })
    } catch (e: any) {
      addMessage({ role: 'assistant', content: `${t('aiError')}: ${e?.toString() || 'Unknown'}` })
    } finally {
      setLoading(false)
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
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
