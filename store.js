const electron = require('electron')
const path = require('path')
const fs = require('fs')

class Store {
  constructor (opts) {
    const isProduction = process.env.NODE_ENV !== 'development'
    if (!isProduction) {
      app.setPath('userData', path.join(app.getPath('appData'), 'signal-muon'))
    }
    // Use a different userData file for development
    const configName = isProduction ? opts.configName : opts.configName + '-dev'
    // Renderer process has to get `app` module via `remote`, whereas the main process can get it directly
    const userDataPath = (electron.app || electron.remote.app).getPath('userData')
    this.path = path.join(userDataPath, configName + '.json')
    this.data = parseDataFile(this.path, opts.defaults)
    console.log('Using userData located at ' + this.path)
  }

  get (key) {
    return this.data[key]
  }

  set (key, val) {
    this.data[key] = val
    fs.writeFile(this.path, JSON.stringify(this.data))
  }
}

function parseDataFile (filePath, defaults) {
  try {
    return JSON.parse(fs.readFileSync(filePath))
  } catch (error) {
    // if there was some kind of error, return the passed in defaults instead.
    return defaults
  }
}

module.exports = Store
