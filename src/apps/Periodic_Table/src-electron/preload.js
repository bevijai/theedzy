// Preload script: expose minimal APIs if needed
const { contextBridge } = require('electron')

contextBridge.exposeInMainWorld('electron', {
  platform: process.platform
})
