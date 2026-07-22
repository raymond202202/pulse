import { create } from 'zustand'
import type { Collection, CollectionItem, ApiRequest } from '../types'

const STORAGE_KEY = 'pulse-collections'

function load(): Collection[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (raw) return JSON.parse(raw)
  } catch {}
  return []
}

function save(collections: Collection[]) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(collections))
  } catch {}
}

interface CollectionState {
  collections: Collection[]
  setCollections: (collections: Collection[]) => void
  addCollection: (name: string) => void
  renameCollection: (id: string, name: string) => void
  removeCollection: (id: string) => void
  addItemToCollection: (collectionId: string, item: CollectionItem) => void
  removeItemFromCollection: (collectionId: string, itemId: string) => void
  saveRequestToCollection: (collectionId: string, request: ApiRequest) => void
}

export const useCollectionStore = create<CollectionState>((set) => ({
  collections: load(),

  setCollections: (collections) => {
    save(collections)
    set({ collections })
  },

  addCollection: (name) =>
    set((s) => {
      const col: Collection = {
        id: crypto.randomUUID(),
        name,
        items: [],
        variables: [],
      }
      const collections = [...s.collections, col]
      save(collections)
      return { collections }
    }),

  renameCollection: (id, name) =>
    set((s) => {
      const collections = s.collections.map((c) =>
        c.id === id ? { ...c, name } : c
      )
      save(collections)
      return { collections }
    }),

  removeCollection: (id) =>
    set((s) => {
      const collections = s.collections.filter((c) => c.id !== id)
      save(collections)
      return { collections }
    }),

  addItemToCollection: (collectionId, item) =>
    set((s) => {
      const collections = s.collections.map((c) =>
        c.id === collectionId ? { ...c, items: [...c.items, item] } : c
      )
      save(collections)
      return { collections }
    }),

  removeItemFromCollection: (collectionId, itemId) =>
    set((s) => {
      const collections = s.collections.map((c) =>
        c.id === collectionId
          ? { ...c, items: c.items.filter((i) => i.id !== itemId) }
          : c
      )
      save(collections)
      return { collections }
    }),

  saveRequestToCollection: (collectionId, request) =>
    set((s) => {
      const item: CollectionItem = {
        type: 'request',
        id: crypto.randomUUID(),
        name: request.name || request.url || 'Untitled',
        request,
      }
      const collections = s.collections.map((c) =>
        c.id === collectionId ? { ...c, items: [...c.items, item] } : c
      )
      save(collections)
      return { collections }
    }),
}))
