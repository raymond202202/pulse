import { create } from 'zustand'
import type { HistoryEntry } from '../types'

const STORAGE_KEY = 'pulse-history'

function loadHistory(): HistoryEntry[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (raw) return JSON.parse(raw)
  } catch {}
  return []
}

function saveHistory(entries: HistoryEntry[]) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(entries.slice(0, 200)))
  } catch {}
}

interface HistoryState {
  entries: HistoryEntry[]
  addEntry: (entry: HistoryEntry) => void
  clearHistory: () => void
  removeEntry: (id: string) => void
}

export const useHistoryStore = create<HistoryState>((set) => ({
  entries: loadHistory(),

  addEntry: (entry) =>
    set((s) => {
      const entries = [entry, ...s.entries].slice(0, 200)
      saveHistory(entries)
      return { entries }
    }),

  clearHistory: () => {
    localStorage.removeItem(STORAGE_KEY)
    set({ entries: [] })
  },

  removeEntry: (id) =>
    set((s) => {
      const entries = s.entries.filter((e) => e.id !== id)
      saveHistory(entries)
      return { entries }
    }),
}))
