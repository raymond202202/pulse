import { create } from 'zustand'

const STORAGE_KEY = 'pulse-settings'

export interface AppSettings {
  language: string
  theme: 'light' | 'dark'
  requestTimeout: number
  historyLimit: number

  // AI
  aiProvider: 'openai' | 'deepseek' | 'custom'
  aiEndpoint: string
  aiModel: string
  aiApiKey: string
  aiContextEnabled: boolean

  // Proxy
  httpProxy: string
  httpsProxy: string
  noProxy: string
}

function load(): AppSettings {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (raw) return { ...defaultSettings, ...JSON.parse(raw) }
  } catch {}
  return { ...defaultSettings }
}

function save(settings: AppSettings) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(settings))
  } catch {}
}

const defaultSettings: AppSettings = {
  language: 'zh-CN',
  theme: 'light',
  requestTimeout: 30,
  historyLimit: 200,

  aiProvider: 'deepseek',
  aiEndpoint: '',
  aiModel: 'deepseek-chat',
  aiApiKey: '',
  aiContextEnabled: true,

  httpProxy: '',
  httpsProxy: '',
  noProxy: '',
}

interface SettingsState {
  settings: AppSettings
  update: (partial: Partial<AppSettings>) => void
  reset: () => void
}

export const useSettingsStore = create<SettingsState>((set) => {
  // 启动时同步已保存的代理配置
  const initialSettings = load()
  if (typeof window !== 'undefined' && (window as any).electronAPI?.setProxyConfig) {
    setTimeout(() => {
      ;(window as any).electronAPI.setProxyConfig({
        httpProxy: initialSettings.httpProxy,
        httpsProxy: initialSettings.httpsProxy,
        noProxy: initialSettings.noProxy,
      })
    }, 0)
  }

  return {
    settings: initialSettings,

    update: (partial) =>
      set((s) => {
        const settings = { ...s.settings, ...partial }
        save(settings)
        // 同步代理配置到 Electron session（如有提供）
        if (typeof window !== 'undefined' && (window as any).electronAPI?.setProxyConfig) {
          ;(window as any).electronAPI.setProxyConfig({
            httpProxy: settings.httpProxy,
            httpsProxy: settings.httpsProxy,
            noProxy: settings.noProxy,
          })
        }
        return { settings }
      }),

    reset: () => {
      save(defaultSettings)
      set({ settings: { ...defaultSettings } })
    },
  }
})
