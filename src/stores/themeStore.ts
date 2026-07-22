import { create } from 'zustand'
import type { ThemeMode } from '../types'

interface ThemeState {
  theme: ThemeMode
  toggleTheme: () => void
  setTheme: (theme: ThemeMode) => void
}

const getInitialTheme = (): ThemeMode => {
  if (typeof window !== 'undefined') {
    const saved = localStorage.getItem('pulse-theme')
    if (saved === 'dark' || saved === 'light') return saved
  }
  return 'light' // 默认浅色
}

export const useThemeStore = create<ThemeState>((set) => ({
  theme: getInitialTheme(),
  toggleTheme: () =>
    set((state) => {
      const next = state.theme === 'light' ? 'dark' : 'light'
      localStorage.setItem('pulse-theme', next)
      document.documentElement.setAttribute('data-theme', next)
      return { theme: next }
    }),
  setTheme: (theme) => {
    localStorage.setItem('pulse-theme', theme)
    document.documentElement.setAttribute('data-theme', theme)
    set({ theme })
  },
}))
