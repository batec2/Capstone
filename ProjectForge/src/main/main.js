import { app, BrowserWindow, ipcMain } from "electron";
import * as path from "node:path"; //gets the path current path from node
import { fileURLToPath } from "url";
import getSourceId from "../renderer/video/getSourceId";

// Handle creating/removing shortcuts on Windows when installing/uninstalling.
if (require("electron-squirrel-startup")) {
  app.quit();
}

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const createWindow = () => {
  // Create the browser window.
  const mainWindow = new BrowserWindow({
    width: 870,
    height: 870,
    webPreferences: {
      preload: path.join(__dirname, "preload.js"),
    },
  });
  // and load the index.html of the app.
  if (MAIN_WINDOW_VITE_DEV_SERVER_URL) {
    mainWindow.loadURL(MAIN_WINDOW_VITE_DEV_SERVER_URL);
  } else {
    mainWindow.loadFile(path.join(__dirname, `../renderer/index.html`));
  }
  // Open the DevTools.
  mainWindow.webContents.openDevTools({ mode: "detach" });
};

const createBotWindow = () => {
  // Create the browser window.
  const botWindow = new BrowserWindow({
    width: 870,
    height: 870,
    webPreferences: {
      preload: path.join(__dirname, "preload.js"),
    },
  });
  // and load the index.html of the app.
  if (BOT_WINDOW_VITE_DEV_SERVER_URL) {
    botWindow.loadURL(BOT_WINDOW_VITE_DEV_SERVER_URL);
  } else {
    botWindow.loadFile(path.join(__dirname, `../renderer-bot/index.html`));
  }
  // Open the DevTools.
  botWindow.webContents.openDevTools({ mode: "detach" });
};

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.whenReady().then(() => {
  createWindow();
  createBotWindow();
});

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
  }
});

ipcMain.handle("GET_SOURCE", async () => {
  const id = await getSourceId();
  return id;
});
