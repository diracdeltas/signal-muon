const page = window.location.href.split('#')[1]
const webview = document.createElement('webview')
webview.setAttribute('src',
  `chrome-extension://iopnjipkpnmbpjaalcjcpcbfcnjknmmo/${page}`)
webview.setAttribute('partition', 'persist:default')
webview.setAttribute('style', 'height:100%;')
webview.addEventListener('dom-ready', () => {
  webview.openDevTools()
})
document.body.appendChild(webview)
