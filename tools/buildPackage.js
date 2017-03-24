/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this file,
 * You can obtain one at http://mozilla.org/MPL/2.0/. */

let execute = require('./execute')
const path = require('path')
const fs = require('fs')

const isWindows = process.platform === 'win32'
const isDarwin = process.platform === 'darwin'
let arch = 'x64'
const isLinux = process.platform === 'linux'

let pack = JSON.parse(fs.readFileSync('package.json', 'utf-8'))
let electronPrebuiltPack = JSON.parse(fs.readFileSync('./node_modules/electron-prebuilt/package.json', 'utf-8'))
const signalVersion = pack.version
const electronVersion = electronPrebuiltPack.version.replace(/-.*/, '')

let appIcon
if (isWindows) {
  appIcon = 'img/icon.ico'
  if (process.env.TARGET_ARCH === 'ia32') {
    arch = 'ia32'
  }
} else if (isDarwin) {
  appIcon = 'img/icon.icns'
} else {
  appIcon = 'img/icon.png'
}

const buildDir = 'Signal-' + process.platform + '-' + arch

let env = {
  NODE_ENV: 'production'
}

let cmds = ['echo cleaning up target...']

if (isWindows) {
  cmds = cmds.concat([
    '(if exist Signal-win32-x64 rmdir /s /q Signal-win32-x64)',
    '(if exist Signal-win32-ia32 rmdir /s /q Signal-win32-ia32)'
  ])

  // Remove the destination folder for the selected arch
  if (arch === 'ia32') {
    cmds = cmds.concat([
      '(if exist dist-ia32 rmdir /s /q dist-ia32)'
    ])
  } else {
    cmds = cmds.concat([
      '(if exist dist-x64 rmdir /s /q dist-x64)'
    ])
  }
} else {
  cmds = cmds.concat([
    'rm -Rf ' + buildDir,
    'rm -Rf dist',
    'rm -f Signal.tar.bz2'
  ])
}

cmds = cmds.concat([
  'echo done',
  'echo starting build...'
])

console.log('Building in ' + buildDir)

cmds = cmds.concat([
  'node ./node_modules/electron-packager/cli.js . Signal' +
    ' --overwrite' +
    ' --platform=' + process.platform +
    ' --arch=' + arch +
    ' --version=' + electronVersion +
    ' --icon=' + appIcon +
    ' --asar=false' +
    ' --app-version=' + signalVersion +
    ' --build-version=' + electronVersion
])

let extensionsPath = isDarwin
  ? path.join(buildDir, 'Signal.app', 'Contents', 'Resources')
  : path.join(buildDir, 'resources')

cmds.push('mkdir -p ' + extensionsPath)
cmds.push((isWindows ? 'xcopy /e /i ' : 'cp -R ') + 'Signal-Desktop ' + extensionsPath)

if (isLinux) {
  cmds.push('mv Signal-linux-x64/Signal Signal-linux-x64/signal')
} else if (isWindows) {
  // Make sure the Signal.exe binary is squirrel aware so we get squirrel events and so that Squirrel doesn't auto create shortcuts.
  cmds.push('"node_modules/rcedit/bin/rcedit.exe" ./Signal-win32-' + arch + '/Signal.exe --set-version-string "SquirrelAwareVersion" "1"')
}

execute(cmds, env, (err) => {
  if (err) {
    console.error('buildPackage failed', err)
    process.exit(1)
    return
  }
  console.log('done')
})
