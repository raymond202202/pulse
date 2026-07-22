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

  aiProvider: 'openai',
  aiEndpoint: '',
  aiModel: 'gpt-4o',
  aiApiKey: '',
  aiContextEnabled: true,
}

interface SettingsState {
  settings: AppSettings
  update: (partial: Partial<AppSettings>) => void
  reset: () => void
}

export const useSettingsStore = create<SettingsState>((set) => ({
  settings: load(),

  update: (partial) =>
    set((s) => {
      const settings = { ...s.settings, ...partial }
      save(settings)
      return { settings }
    }),

  reset: () => {
    save(defaultSettings)
    set({ settings: { ...defaultSettings } })
  },
}))
