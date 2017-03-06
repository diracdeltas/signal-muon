const webview = document.getElementById('signal-webview')

webview.addEventListener('dom-ready', () => {
  webview.openDevTools()
})
