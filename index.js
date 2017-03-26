const page = window.location.href.split('#')[1]
const webview = document.createElement('webview')
webview.setAttribute('src', `chrome-extension://iopnjipkpnmbpjaalcjcpcbfcnjknmmo/${page}`)
webview.setAttribute('partition', 'persist:default')
webview.setAttribute('style', 'height:100%;')
webview.addEventListener('dom-ready', () => {
  if (process.env.NODE_ENV === 'development') {
    webview.openDevTools()
  }
})
document.body.appendChild(webview)
require('electron').ipcRenderer.on('window-focused', function() {
  webview.focus()
})
