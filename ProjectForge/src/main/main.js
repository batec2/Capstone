import { app, BrowserWindow, ipcMain } from "electron";
import * as path from "node:path"; //gets the path current path from node
import { fileURLToPath } from "url";
import getSourceId from "../renderer/video/getSourceId";
import { io } from "socket.io-client";
import { moveBot } from "./bot";

// Handle creating/removing shortcuts on Windows when installing/uninstalling.
if (require("electron-squirrel-startup")) {
  app.quit();
}

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Connection to computer vision server
const modelSocket = io("http://localhost:3000");
// Connection to runelite server
const clientSocket = io.connect("http://localhost:3030", {
  transports: ["websocket"],
});

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
  mainWindow.webContents.openDevTools();
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

let currentDetection = null;
const onBoundingBox = (filteredBoxes) => {
  currentDetection = filteredBoxes;
};

let previousPosition = { x: null, y: null };
const onGameTick = async (data) => {
  const dataJSON = JSON.parse(data);
  const { camera, player, animation } = dataJSON;
  // Activates bot only if the player hasnt moved for 1 tick and not in a
  // animation
  // console.log(player, animation);
  if (
    player.x === previousPosition.x &&
    player.y === previousPosition.y &&
    animation === -1
  ) {
    // console.log("moving");
    await moveBot(currentDetection);
  }
  previousPosition = player;
};

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.whenReady().then(() => {
  createWindow();
  // createBotWindow();

  modelSocket.on("BOUNDING_BOX", onBoundingBox);
  clientSocket.on("data", onGameTick);
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
