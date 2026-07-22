import { create } from 'zustand'
import type { ApiRequest, ApiResponse, HttpMethod, KeyValue, RequestBody, AuthConfig } from '../types'

const TABS_STORAGE_KEY = 'pulse-tabs'

interface PersistedTabState {
  requestMap: Record<string, ApiRequest>
  tabIds: string[]
  activeTabId: string
}

function loadTabs(): PersistedTabState | null {
  try {
    const raw = localStorage.getItem(TABS_STORAGE_KEY)
    if (raw) return JSON.parse(raw)
  } catch {}
  return null
}

function saveTabs(state: PersistedTabState) {
  try {
    localStorage.setItem(TABS_STORAGE_KEY, JSON.stringify(state))
  } catch {}
}

interface RequestState {
  requestMap: Record<string, ApiRequest>
  tabIds: string[]
  activeTabId: string
  request: ApiRequest

  responseMap: Record<string, ApiResponse | null>
  loadingMap: Record<string, boolean>
  errorMap: Record<string, string | null>
  response: ApiResponse | null
  loading: boolean
  error: string | null

  createTab: () => void
  closeTab: (tabId: string) => void
  setActiveTab: (tabId: string) => void
  renameTab: (tabId: string, name: string) => void

  setMethod: (method: HttpMethod) => void
  setUrl: (url: string) => void
  setHeaders: (headers: KeyValue[]) => void
  setQueryParams: (params: KeyValue[]) => void
  setBody: (body: RequestBody | undefined) => void
  setAuth: (auth: AuthConfig | undefined) => void

  setResponse: (response: ApiResponse) => void
  setLoading: (loading: boolean) => void
  setError: (error: string | null) => void
  resetResponse: () => void
}

const persist = (state: Pick<RequestState, 'requestMap' | 'tabIds' | 'activeTabId'>) => {
  saveTabs({ requestMap: state.requestMap, tabIds: state.tabIds, activeTabId: state.activeTabId })
}

let tabCounter = 0

const createEmptyRequest = (): ApiRequest => {
  tabCounter++
  return {
    id: crypto.randomUUID(),
    name: `新请求 ${tabCounter}`,
    method: 'GET',
    url: '',
    headers: [{ key: '', value: '', enabled: true }],
    queryParams: [],
    body: { mode: 'none' },
    auth: { authType: 'none' },
  }
}

const syncActive = (state: {
  requestMap: Record<string, ApiRequest>
  responseMap: Record<string, ApiResponse | null>
  loadingMap: Record<string, boolean>
  errorMap: Record<string, string | null>
}, tabId: string) => ({
  request: state.requestMap[tabId],
  response: state.responseMap[tabId] ?? null,
  loading: state.loadingMap[tabId] ?? false,
  error: state.errorMap[tabId] ?? null,
})

export const useRequestStore = create<RequestState>((set, get) => {
  // Try to restore tabs from localStorage
  const saved = loadTabs()
  let initialId: string
  let initialReq: ApiRequest
  let initialReqMap: Record<string, ApiRequest>
  let initialTabIds: string[]

  if (saved && saved.tabIds.length > 0) {
    // Fix tab counter
    let max = 0
    for (const req of Object.values(saved.requestMap)) {
      const m = req.name.match(/新请求 (\d+)/)
      if (m) max = Math.max(max, parseInt(m[1]))
    }
    tabCounter = max
    initialReqMap = saved.requestMap
    initialTabIds = saved.tabIds
    initialId = saved.activeTabId
    initialReq = saved.requestMap[initialId]
  } else {
    initialId = crypto.randomUUID()
    initialReq = createEmptyRequest()
    initialReqMap = { [initialId]: initialReq }
    initialTabIds = [initialId]
  }

  const initialRespMap: Record<string, null> = {}
  initialTabIds.forEach((id) => { initialRespMap[id] = null })
  const initialLoadMap: Record<string, boolean> = {}
  initialTabIds.forEach((id) => { initialLoadMap[id] = false })
  const initialErrMap: Record<string, null> = {}
  initialTabIds.forEach((id) => { initialErrMap[id] = null })

  return {
    requestMap: initialReqMap,
    tabIds: initialTabIds,
    activeTabId: initialId,
    request: initialReq,

    responseMap: initialRespMap as Record<string, ApiResponse | null>,
    loadingMap: initialLoadMap,
    errorMap: initialErrMap as Record<string, string | null>,
    response: null,
    loading: false,
    error: null,

    createTab: () => {
      const id = crypto.randomUUID()
      const req = createEmptyRequest()
      set((s) => {
        const newMap = { ...s.requestMap, [id]: req }
        const newResp = { ...s.responseMap, [id]: null }
        const newLoad = { ...s.loadingMap, [id]: false }
        const newErr = { ...s.errorMap, [id]: null }
        persist({ requestMap: newMap, tabIds: [...s.tabIds, id], activeTabId: id })
        return {
          requestMap: newMap,
          tabIds: [...s.tabIds, id],
          activeTabId: id,
          responseMap: newResp,
          loadingMap: newLoad,
          errorMap: newErr,
          ...syncActive({ requestMap: newMap, responseMap: newResp, loadingMap: newLoad, errorMap: newErr }, id),
        }
      })
    },

    closeTab: (tabId) => {
      const state = get()
      if (state.tabIds.length <= 1) return
      const idx = state.tabIds.indexOf(tabId)
      const newTabIds = state.tabIds.filter((id) => id !== tabId)
      const newReqMap = { ...state.requestMap }
      delete newReqMap[tabId]
      const newResp = { ...state.responseMap }
      delete newResp[tabId]
      const newLoad = { ...state.loadingMap }
      delete newLoad[tabId]
      const newErr = { ...state.errorMap }
      delete newErr[tabId]
      let newActive = state.activeTabId
      if (state.activeTabId === tabId) {
        newActive = newTabIds[Math.min(idx, newTabIds.length - 1)]
      }
      persist({ requestMap: newReqMap, tabIds: newTabIds, activeTabId: newActive })
      set({
        requestMap: newReqMap,
        tabIds: newTabIds,
        activeTabId: newActive,
        responseMap: newResp,
        loadingMap: newLoad,
        errorMap: newErr,
        ...syncActive({ requestMap: newReqMap, responseMap: newResp, loadingMap: newLoad, errorMap: newErr }, newActive),
      })
    },

    setActiveTab: (tabId) => {
      const state = get()
      if (!state.requestMap[tabId]) return
      persist({ requestMap: state.requestMap, tabIds: state.tabIds, activeTabId: tabId })
      set({
        activeTabId: tabId,
        ...syncActive(state, tabId),
      })
    },

    renameTab: (tabId, name) =>
      set((s) => {
        if (!s.requestMap[tabId]) return s
        const req = { ...s.requestMap[tabId], name }
        const newMap = { ...s.requestMap, [tabId]: req }
        persist({ requestMap: newMap, tabIds: s.tabIds, activeTabId: s.activeTabId })
        const isActive = tabId === s.activeTabId
        return {
          requestMap: newMap,
          ...(isActive ? { request: req } : {}),
        }
      }),

    setMethod: (method) =>
      set((s) => {
        const req = { ...s.requestMap[s.activeTabId], method }
        const newMap = { ...s.requestMap, [s.activeTabId]: req }
        persist({ requestMap: newMap, tabIds: s.tabIds, activeTabId: s.activeTabId })
        return { requestMap: newMap, request: req }
      }),
    setUrl: (url) =>
      set((s) => {
        const req = { ...s.requestMap[s.activeTabId], url }
        const newMap = { ...s.requestMap, [s.activeTabId]: req }
        persist({ requestMap: newMap, tabIds: s.tabIds, activeTabId: s.activeTabId })
        return { requestMap: newMap, request: req }
      }),
    setHeaders: (headers) =>
      set((s) => {
        const req = { ...s.requestMap[s.activeTabId], headers }
        const newMap = { ...s.requestMap, [s.activeTabId]: req }
        persist({ requestMap: newMap, tabIds: s.tabIds, activeTabId: s.activeTabId })
        return { requestMap: newMap, request: req }
      }),
    setQueryParams: (params) =>
      set((s) => {
        const req = { ...s.requestMap[s.activeTabId], queryParams: params }
        const newMap = { ...s.requestMap, [s.activeTabId]: req }
        persist({ requestMap: newMap, tabIds: s.tabIds, activeTabId: s.activeTabId })
        return { requestMap: newMap, request: req }
      }),
    setBody: (body) =>
      set((s) => {
        const req = { ...s.requestMap[s.activeTabId], body }
        const newMap = { ...s.requestMap, [s.activeTabId]: req }
        persist({ requestMap: newMap, tabIds: s.tabIds, activeTabId: s.activeTabId })
        return { requestMap: newMap, request: req }
      }),
    setAuth: (auth) =>
      set((s) => {
        const req = { ...s.requestMap[s.activeTabId], auth }
        const newMap = { ...s.requestMap, [s.activeTabId]: req }
        persist({ requestMap: newMap, tabIds: s.tabIds, activeTabId: s.activeTabId })
        return { requestMap: newMap, request: req }
      }),

    setResponse: (response) =>
      set((s) => ({
        responseMap: { ...s.responseMap, [s.activeTabId]: response },
        errorMap: { ...s.errorMap, [s.activeTabId]: null },
        response,
        error: null,
      })),
    setLoading: (loading) =>
      set((s) => ({
        loadingMap: { ...s.loadingMap, [s.activeTabId]: loading },
        loading,
      })),
    setError: (error) =>
      set((s) => ({
        errorMap: { ...s.errorMap, [s.activeTabId]: error },
        error,
      })),
    resetResponse: () =>
      set((s) => ({
        responseMap: { ...s.responseMap, [s.activeTabId]: null },
        errorMap: { ...s.errorMap, [s.activeTabId]: null },
        response: null,
        error: null,
      })),
  }
})
