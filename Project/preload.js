const { contextBridge, ipcRenderer} = require('electron');

contextBridge.exposeInMainWorld('mouseInfo', {
    mouseLocation: () => ipcRenderer.invoke('mouseLocation'), //Triggers main process handler
    //Wrap ipcRenderer api in function dont expose as it is unsafe
})