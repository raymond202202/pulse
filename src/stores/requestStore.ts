import { create } from 'zustand'
import type { ApiRequest, ApiResponse, HttpMethod, KeyValue, RequestBody, AuthConfig } from '../types'

interface RequestState {
  // Tab management
  requestMap: Record<string, ApiRequest>
  tabIds: string[]
  activeTabId: string
  request: ApiRequest

  // Response state (per-tab)
  responseMap: Record<string, ApiResponse | null>
  loadingMap: Record<string, boolean>
  errorMap: Record<string, string | null>
  response: ApiResponse | null
  loading: boolean
  error: string | null

  // Tab operations
  createTab: () => void
  closeTab: (tabId: string) => void
  setActiveTab: (tabId: string) => void

  // Request setters (operate on active tab)
  setMethod: (method: HttpMethod) => void
  setUrl: (url: string) => void
  setHeaders: (headers: KeyValue[]) => void
  setQueryParams: (params: KeyValue[]) => void
  setBody: (body: RequestBody | undefined) => void
  setAuth: (auth: AuthConfig | undefined) => void

  // Response setters
  setResponse: (response: ApiResponse) => void
  setLoading: (loading: boolean) => void
  setError: (error: string | null) => void
  resetResponse: () => void
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

const syncActive = (state: RequestState, tabId: string): Partial<RequestState> => ({
  request: state.requestMap[tabId],
  response: state.responseMap[tabId] ?? null,
  loading: state.loadingMap[tabId] ?? false,
  error: state.errorMap[tabId] ?? null,
})

export const useRequestStore = create<RequestState>((set, get) => {
  const initialId = crypto.randomUUID()
  const initialReq = createEmptyRequest()

  return {
    requestMap: { [initialId]: initialReq },
    tabIds: [initialId],
    activeTabId: initialId,
    request: initialReq,

    responseMap: { [initialId]: null },
    loadingMap: { [initialId]: false },
    errorMap: { [initialId]: null },
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
        return {
          requestMap: newMap,
          tabIds: [...s.tabIds, id],
          activeTabId: id,
          responseMap: newResp,
          loadingMap: newLoad,
          errorMap: newErr,
          ...syncActive({ ...s, requestMap: newMap, responseMap: newResp, loadingMap: newLoad, errorMap: newErr } as RequestState, id),
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

      set({
        requestMap: newReqMap,
        tabIds: newTabIds,
        activeTabId: newActive,
        responseMap: newResp,
        loadingMap: newLoad,
        errorMap: newErr,
        ...syncActive(
          { requestMap: newReqMap, responseMap: newResp, loadingMap: newLoad, errorMap: newErr } as RequestState,
          newActive,
        ),
      })
    },

    setActiveTab: (tabId) => {
      const state = get()
      if (!state.requestMap[tabId]) return
      set({
        activeTabId: tabId,
        ...syncActive(state as RequestState, tabId),
      })
    },

    setMethod: (method) =>
      set((s) => {
        const req = { ...s.requestMap[s.activeTabId], method }
        return { requestMap: { ...s.requestMap, [s.activeTabId]: req }, request: req }
      }),
    setUrl: (url) =>
      set((s) => {
        const req = { ...s.requestMap[s.activeTabId], url }
        return { requestMap: { ...s.requestMap, [s.activeTabId]: req }, request: req }
      }),
    setHeaders: (headers) =>
      set((s) => {
        const req = { ...s.requestMap[s.activeTabId], headers }
        return { requestMap: { ...s.requestMap, [s.activeTabId]: req }, request: req }
      }),
    setQueryParams: (params) =>
      set((s) => {
        const req = { ...s.requestMap[s.activeTabId], queryParams: params }
        return { requestMap: { ...s.requestMap, [s.activeTabId]: req }, request: req }
      }),
    setBody: (body) =>
      set((s) => {
        const req = { ...s.requestMap[s.activeTabId], body }
        return { requestMap: { ...s.requestMap, [s.activeTabId]: req }, request: req }
      }),
    setAuth: (auth) =>
      set((s) => {
        const req = { ...s.requestMap[s.activeTabId], auth }
        return { requestMap: { ...s.requestMap, [s.activeTabId]: req }, request: req }
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
