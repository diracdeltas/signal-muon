const page = window.location.href.split('#')[1]
const webview = document.createElement('webview')
webview.setAttribute('partition', 'persist:default')
webview.setAttribute('style', 'height:100%;')
webview.setAttribute('src', `chrome-extension://iopnjipkpnmbpjaalcjcpcbfcnjknmmo/${page}`)

webview.addEventListener('dom-ready', () => {
  console.log('webview DOM ready')
})

document.body.appendChild(webview)
