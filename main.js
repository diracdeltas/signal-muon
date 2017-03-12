const electron = require('electron')
const path = require('path')
const Store = require('./store.js')
// Module to control application life.
const app = electron.app
// Module to create native browser window.
const BrowserWindow = electron.BrowserWindow
const ipc = electron.ipcMain
const shell = electron.shell

// map ID to window object
const windows = {}

const isProduction = process.env.NODE_ENV !== 'development'
const signalExtensionId = 'iopnjipkpnmbpjaalcjcpcbfcnjknmmo'
const signalExtensionPath = process.env.NODE_ENV === 'production'
  ? path.join(__dirname, '..', '..', 'Signal-Desktop')
  : path.join(__dirname, 'Signal-Desktop')

// Instantiate the userData store
const store = new Store({
  configName: 'user-preferences',
  defaults: {
    windowBounds: { width: 800, height: 700 }
  }
})

const messages = {
  CALLBACK: 'callback',
  CREATE_WINDOW: 'create-window',
  GET_CURRENT_WINDOW: 'get-current-window',
  FOCUS_WINDOW: 'focus-window',
  REMOVE_WINDOW: 'remove-window',
  RESTART: 'restart',
  OPEN_LINK: 'open-link'
}

const fileUrl = (str) => {
  let pathName = path.resolve(str).replace(/\\/g, '/')

  // Windows drive letter must be prefixed with a slash
  if (pathName[0] !== '/') {
    pathName = '/' + pathName
  }

  return encodeURI('file://' + pathName)
}

function createWindow (options) {
  let { width, height } = store.get('windowBounds')
  let mainWindow = new BrowserWindow({
    title: 'Signal Private Messenger',
    icon: path.join(__dirname, 'Signal-Desktop', 'images', 'icon_128.png'),
    width: width,
    height: height
  })

  windows[options.id] = mainWindow
  mainWindow.id = options.id

  // and load the index.html of the app.
  mainWindow.loadURL(fileUrl(path.join(__dirname, `index.html#${options.url}`)))
  // Open the DevTools.
  // mainWindow.webContents.openDevTools()

  mainWindow.on('close', function (event) {
    // Store current window position to userData
    store.set('windowBounds', mainWindow.getBounds())
  })

  // Emitted when the window is closed.
  mainWindow.on('closed', function () {
    // Dereference the window object, usually you would store windows
    // in an array if your app supports multi windows, this is the time
    // when you should delete the corresponding element.
    mainWindow = null
    delete windows[options.id]
  })

  return mainWindow
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', () => {
  init()
  // Attach IPC listeners
  ipc.on(messages.CREATE_WINDOW, (e, id, options) => {
    createWindow(options)
    e.sender.send(messages.CALLBACK, id, {
      id: options.id,
      focused: true
    })
  })
  ipc.on(messages.GET_CURRENT_WINDOW, (e, id) => {
    const windowInfo = {
      id: BrowserWindow.getFocusedWindow().id,
      focused: true
    }
    e.sender.send(messages.CALLBACK, id, windowInfo)
  })
  ipc.on(messages.REMOVE_WINDOW, (e, id, windowId) => {
    if (windows[windowId]) {
      windows[windowId].close()
    }
    e.sender.send(messages.CALLBACK, id)
  })
  ipc.on(messages.FOCUS_WINDOW, (e, id, windowId) => {
    if (windows[windowId]) {
      windows[windowId].focus()
    }
    e.sender.send(messages.CALLBACK, id)
  })
  ipc.on(messages.RESTART, () => {
    const args = process.argv.slice(1)
    args.push('--relaunch')
    app.relaunch({args})
    app.quit()
  })
  ipc.on(messages.OPEN_LINK, (e, url) => {
    shell.openExternal(url)
  })
})

// Quit when all windows are closed.
app.on('window-all-closed', function () {
  // On OS X it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

const signalManifest = {
  name: 'Signal Private Messenger',
  short_name: 'Signal',
  manifest_version: 2,
  version: '0.13.0',
  default_locale: 'en',
  permissions: [
    'unlimitedStorage',
    'notifications',
    {fileSystem: ['write']},
    'alarms',
    'fullscreen',
    'audioCapture'
  ],
  icons: {
    '16': 'images/icon_16.png',
    '32': 'images/icon_32.png',
    '48': 'images/icon_48.png',
    '128': 'images/icon_128.png',
    '256': 'images/icon_256.png'
  },
  incognito: 'spanning',
  background: {
    page: isProduction ? 'background.html' : 'background.html#dev'
  },
  key: 'MIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEAxvZ70fWZ/yqYMuoRMRIRLR0zwiEGJrDuQwI03TiqUllg6/EBj+YOyldoPQeEOua//0i6NzSX6OwoZv2ynfGJSQwq550OphRXU8YGeWqPGhU7JeoH/6ZqHJefBXIHIAqipuBuVCsm9ONfrj1L1CmWt/VOIUqlk6i4g3Xe2WnPRk5z7su9VR0UYIahX8av4qJtAwGoUkvbdTZAD6vHIu18wgA0jO5g41KGXb/uco3o8HpJ9YPQsH04TXadXwOA9sn6LNBl0t12GlRVViQJZe3x3hS/uYQFdPfqN+abrqnSOwA2mDZbxkLBwPt6ayql5cM1OjGt+Wj3bMBtTHQ+oavBBwIDAQAB'
}

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and require them here.
const init = (extensionId, manifest) => {
  const {session} = require('electron')
  process.on('extension-load-error', (error) => {
    console.log('extension load error: ' + error)
  })
  process.on('extension-ready', (installInfo) => {
    console.log('extension ready', installInfo.name)
  })

  let loadExtension = (extensionId, extensionPath, manifest, manifestLocation = 'unpacked') => {
    session.defaultSession.extensions.load(extensionPath, manifest, manifestLocation)
  }
  loadExtension(signalExtensionId, signalExtensionPath, signalManifest)
}
