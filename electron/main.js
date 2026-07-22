const { app, BrowserWindow, Menu, ipcMain, dialog, session } = require('electron')
const path = require('path')
const fs = require('fs')

const isDev = process.argv.includes('--dev') ||
  process.env.NODE_ENV === 'development' ||
  !app.isPackaged

function createWindow() {
  // 去掉默认菜单 (File/Edit/View/Window/Help)
  Menu.setApplicationMenu(null)

  const win = new BrowserWindow({
    width: 1280,
    height: 800,
    minWidth: 900,
    minHeight: 600,
    title: 'Pulse',
    icon: path.join(__dirname, '../resources/icon.png'),
    autoHideMenuBar: true,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      contextIsolation: true,
      nodeIntegration: false,
      sandbox: false,
    },
  })

  if (isDev) {
    win.loadURL('http://localhost:5173/')
  } else {
    win.loadFile(path.join(__dirname, '../dist/index.html'))
  }

  // F12 / Ctrl+Shift+I 开关 DevTools（开发调试用）
  win.webContents.on('before-input-event', (event, input) => {
    if (input.key === 'F12' ||
        (input.control && input.shift && input.key === 'I') ||
        (input.meta && input.alt && input.key === 'I')) {
      win.webContents.toggleDevTools()
    }
  })
}

// IPC: 文件选择对话框 (用于导入)
ipcMain.handle('dialog:openFile', async () => {
  const result = await dialog.showOpenDialog({
    properties: ['openFile'],
    filters: [
      { name: 'JSON', extensions: ['json'] },
      { name: '所有文件', extensions: ['*'] },
    ],
  })
  if (result.canceled || result.filePaths.length === 0) return null
  const content = fs.readFileSync(result.filePaths[0], 'utf-8')
  return content
})

// IPC: 代理配置
ipcMain.handle('proxy:setConfig', async (event, config) => {
  const { httpProxy, httpsProxy, noProxy } = config
  const rules = []
  if (httpProxy) rules.push(`http=${httpProxy}`)
  if (httpsProxy) rules.push(`https=${httpsProxy || httpProxy}`)
  try {
    await session.defaultSession.setProxy({
      proxyRules: rules.join(';'),
      proxyBypassRules: noProxy || '',
    })
  } catch (e) {
    console.error('代理配置失败:', e)
  }
})

app.whenReady().then(createWindow)

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow()
  }
})
