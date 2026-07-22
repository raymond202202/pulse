import type { AiMessage } from '../types'
import { useSettingsStore } from '../stores/settingsStore'

interface AiChatParams {
  messages: AiMessage[]
  systemPrompt?: string
  signal?: AbortSignal
}

interface AiChatResult {
  content: string
  model: string
}

function getEndpoint(provider: string, customEndpoint: string): string {
  if (provider === 'custom' && customEndpoint) return customEndpoint
  if (provider === 'deepseek') return 'https://api.deepseek.com/v1/chat/completions'
  return 'https://api.openai.com/v1/chat/completions'
}

function getModel(provider: string, customModel: string): string {
  if (customModel) return customModel
  if (provider === 'deepseek') return 'deepseek-chat'
  return 'gpt-4o'
}

export async function aiChat(params: AiChatParams): Promise<AiChatResult> {
  const { settings } = useSettingsStore.getState()
  const { aiProvider, aiEndpoint, aiModel, aiApiKey } = settings

  if (!aiApiKey) {
    throw new Error('未配置 API 密钥，请在设置中填写')
  }

  const endpoint = getEndpoint(aiProvider, aiEndpoint)
  const model = getModel(aiProvider, aiModel)

  const body: any = {
    model,
    messages: [],
    temperature: 0.7,
    max_tokens: 4096,
  }

  if (params.systemPrompt) {
    body.messages.push({ role: 'system', content: params.systemPrompt })
  }

  for (const msg of params.messages) {
    body.messages.push({ role: msg.role, content: msg.content })
  }

  const response = await fetch(endpoint, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${aiApiKey}`,
    },
    body: JSON.stringify(body),
    signal: params.signal,
  })

  if (!response.ok) {
    const errText = await response.text().catch(() => '')
    throw new Error(`AI 请求失败 (${response.status}): ${errText || response.statusText}`)
  }

  const data = await response.json()
  const content = data.choices?.[0]?.message?.content || 'No response'

  return { content, model }
}
