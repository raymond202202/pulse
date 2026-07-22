import { create } from 'zustand'
import type { AiMessage } from '../types'

interface AiState {
  messages: AiMessage[]
  loading: boolean
  addMessage: (msg: AiMessage) => void
  setLoading: (loading: boolean) => void
  clearMessages: () => void
}

export const useAiStore = create<AiState>((set) => ({
  messages: [],
  loading: false,
  addMessage: (msg) =>
    set((s) => ({ messages: [...s.messages, msg] })),
  setLoading: (loading) => set({ loading }),
  clearMessages: () => set({ messages: [] }),
}))
