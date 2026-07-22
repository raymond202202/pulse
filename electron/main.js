const { app, BrowserWindow } = require('electron')
const path = require('path')

// Detect dev mode: check if running via `electron .` with vite dev server
const isDev = process.argv.includes('--dev') ||
  process.env.NODE_ENV === 'development' ||
  !app.isPackaged

function createWindow() {
  const win = new BrowserWindow({
    width: 1280,
    height: 800,
    minWidth: 900,
    minHeight: 600,
    title: 'Pulse',
    icon: path.join(__dirname, '../resources/icon.png'),
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      contextIsolation: true,
      nodeIntegration: false,
      sandbox: false,
    },
  })

  if (isDev) {
    // Dev: connect to Vite dev server
    win.loadURL('http://localhost:5173/')
    win.webContents.openDevTools()
  } else {
    // Production: load from dist
    win.loadFile(path.join(__dirname, '../dist/index.html'))
  }
}

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
