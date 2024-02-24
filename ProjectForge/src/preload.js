// See the Electron documentation for details on how to use preload scripts:
// https://www.electronjs.org/docs/latest/tutorial/process-model#preload-scripts
/**
 * Preload allows main and renderer threads to talk to each other, Electron
 * sandboxes renderers(the window that the user sees)
 */
const { contextBridge, ipcRenderer } = require("electron");

contextBridge.exposeInMainWorld("api", {
  //Put things here to expose in renderer.js
  getFrameData: (callback) => {
    ipcRenderer.on("GIVE_FRAME", () => {
      callback();
    });
  },
  getImage: (image) => ipcRenderer.send("PREDICT_FRAME", image),
  getSourceId: async () => {
    try {
      const id = await ipcRenderer.invoke("GET_SOURCE");
      return id;
    } catch (err) {
      console.log(err);
    }
  },

  drawBoundingBox: (callback) => {
    ipcRenderer.on("BOUNDING_BOX", (_, boundingArray) => {
      callback(boundingArray.bounding, boundingArray.widthHeight);
    });
  },
});

ipcRenderer.on("give-frame", () => {
  getImageData();
});
