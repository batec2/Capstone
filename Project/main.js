const {app, BrowserWindow} = require ('electron');
const { OverlayController, OVERLAY_WINDOW_OPTS } = require ('electron-overlay-window');

//app.disableHardwareAcceleration()

const createWindow = () => {
  const win = new BrowserWindow({
    width: 400,
    height: 300,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false
    },
    ...OVERLAY_WINDOW_OPTS
  });
  win.loadFile('index.html');

  // NOTE: if you close Dev Tools overlay window will lose transparency
  win.webContents.openDevTools({ mode: 'detach', activate: false })
  //https://github.com/SnosMe/electron-overlay-window/blob/master/src/demo/electron-demo.ts
  //for demo of overlay
  OverlayController.attachByTitle(
    win,
    process.platform === 'darwin' ? 'Untitled' : 'RuneLite',
    { hasTitleBarOnMac: true }
  )
}

app.whenReady().then(() => {
  createWindow();
})
