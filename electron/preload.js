const { contextBridge, ipcRenderer } = require('electron')

contextBridge.exposeInMainWorld('electronAPI', {
  send: (channel, data) => ipcRenderer.send(channel, data),
  on: (channel, callback) => ipcRenderer.on(channel, (event, ...args) => callback(...args)),
  // 文件打开对话框
  openFileDialog: () => ipcRenderer.invoke('dialog:openFile'),
  // 代理配置
  setProxyConfig: (config) =>
    ipcRenderer.invoke('proxy:setConfig', config),
})
