import {app, BrowserWindow, ipcMain, desktopCapturer} from 'electron';
import {OverlayController, OVERLAY_WINDOW_OPTS} from 'electron-overlay-window';
import {Worker, isMainThread, parentPort, workerData} from 'worker_threads';
import * as utils from './utils/utils.js';
import * as path from 'node:path';//gets the path current path from node
import {fileURLToPath} from 'url';

//ES6 module does not have access to __dirname and __filename
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const modelWorker = new Worker('./src/utils/tfModel.js');
let win;
let isWorking = false;

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
    ipcMain.on('getImage',(event,image)=>{
        if(isWorking===false){
            console.log('its sending a image');
            modelWorker.postMessage(image);
            isWorking = true;
        }
    });
    ipcMain.on('start',()=>{
        utils.getSourceId().then((sourceId)=>{
            if(sourceId){
                console.log(sourceId);
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


modelWorker.on('message',(results)=>{
    if(results){
        //console.log(results[0][0]);
        win.webContents.send('Send Bounding Box',results);
    }
    isWorking = false;
});
