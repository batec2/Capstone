import {app, BrowserWindow, ipcMain, desktopCapturer} from 'electron';
import {OverlayController, OVERLAY_WINDOW_OPTS} from 'electron-overlay-window';
import {Worker,MessageChannel} from 'worker_threads';
import * as utils from './utils/utils.js';
import * as path from 'node:path';//gets the path current path from node
import {fileURLToPath} from 'url';
//ES6 module does not have access to __dirname and __filename
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const modelWorker = new Worker('./src/utils/tfModel.js');
const {port1,port2} = new MessageChannel();
let win;

const createWindow = () => {
    win = new BrowserWindow({
        width: 800,
        height: 600,
        webPreferences: {
            //_dirname is the path to the current script
            //path.join creates a path by joining the root path with preload.js
            preload: path.join(__dirname,'preload.js'),
        }
    });
    win.loadFile('index.html');
    //win.webContents.openDevTools({ mode: 'detach', activate: false });
}

app.whenReady().then(() => {
    /**
     * Sends the image array to the worker thread to be passed into the model
     * for inference. Sets the global isWorking thread to true to prevent
     * more images to be sent to model before it completes inference. 
     * @param image Uint8ClampedArray - data comes from Imagedata.data
     */
    ipcMain.on('getImage',(event,image)=>{
            modelWorker.postMessage(image);
    });
    /**
     * On start up this looks for the 
     */
    ipcMain.on('start',()=>{
        utils.getSourceId().then((sourceId)=>{
            if(sourceId){
                win.webContents.send('SET_SOURCE',sourceId);
            }
            else{
                console.log('Could not get source');
            }
        });
    });
    createWindow();
});

/*
listens for 'window-all-closed' event and quits application when all windows
are gone 
*/
app.on('window-all-closed',()=>{
    if(process.platform !== 'darwin'){//Checks if the platform is not MacOS
        console.log("I'm Quitting Now, Goodbye!");
        modelWorker.terminate();
        app.quit();
    }
});

/**
 * listens for a message from worker thread, and sends the resutls to
 * the front end to be rendered
 */
modelWorker.on('message',(results)=>{
    if(results){
        win.webContents.send('bounding box',results);
    }
});
