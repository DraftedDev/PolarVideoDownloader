/**
 * Build using:
 * npx electron-packager C:\Users\Mikail\Desktop\Coding\JS\PolarVideoDownloader polarvideodownloader --platform=win32 --arch=ia32
 */

const { app, BrowserWindow } = require('electron');

app.whenReady().then(() => {

    createWindow()

})

function createWindow () {
    const win = new BrowserWindow({
      width: 1000,
      height: 800,
      icon: 'resources/icon.png',
      webPreferences: {
        contextIsolation: false,
        nodeIntegration: true
      }
    })
    win.removeMenu();
    win.loadFile('index.html')
}