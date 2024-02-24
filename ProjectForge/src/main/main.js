import { app, BrowserWindow, ipcMain } from "electron";
// import {OverlayController, OVERLAY_WINDOW_OPTS} from 'electron-overlay-window';
import * as path from "node:path"; //gets the path current path from node
import { fileURLToPath } from "url";
import { io } from "socket.io-client";
import getSourceId from "../renderer/video/getSourceId";
// Handle creating/removing shortcuts on Windows when installing/uninstalling.
if (require("electron-squirrel-startup")) {
  app.quit();
}

// const socket = io("http://localhost:3009");

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const createWindow = () => {
  // Create the browser window.
  const mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      preload: path.join(__dirname, "preload.js"),
    },
  });

  // and load the index.html of the app.
  if (MAIN_WINDOW_VITE_DEV_SERVER_URL) {
    mainWindow.loadURL(MAIN_WINDOW_VITE_DEV_SERVER_URL);
  } else {
    mainWindow.loadFile(
      path.join(__dirname, `../renderer/${MAIN_WINDOW_VITE_NAME}/index.html`)
    );
  }
  // Open the DevTools.
  mainWindow.webContents.openDevTools({ mode: "detach" });
};

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.whenReady().then(() => {
  createWindow();
});

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
  }
});

// socket.on("BOUNDING_BOX", (boundingArray) => {
//   // console.log(results);
//   win.webContents.send("BOUNDING_BOX", boundingArray);
// });

ipcMain.handle("GET_SOURCE", async () => {
  const id = await getSourceId();
  return id;
});

/**
 * @param image Uint8ClampedArray - data comes from Imagedata.data
 */
// ipcMain.on("PREDICT_FRAME", (event, image) => {
//   socket.emit("image", image);
// });
