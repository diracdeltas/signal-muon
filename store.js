const fs = require('fs')

class Store {
  constructor (opts) {
    this.path = opts.configFile
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
