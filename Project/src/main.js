import {app, BrowserWindow, ipcMain, desktopCapturer} from 'electron';
import {OverlayController, OVERLAY_WINDOW_OPTS} from 'electron-overlay-window';
//https://stackoverflow.com/questions/41058569/what-is-the-difference-between-const-and-const-in-javascript
//for const {} = ...
import * as path from 'node:path';//gets the path current path from node
import {fileURLToPath} from 'url';
import * as tfTools from './utils/tfTools.js';
import { getPrediction } from './utils/tfModel.js';
import * as tf from '@tensorflow/tfjs-node';

//ES6 module does not have access to __dirname and __filename
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

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
    win.webContents.openDevTools({ mode: 'detach', activate: false });
    }
/*
Usually app.on('ready',()=>{createWindow}) is used to listen to events from  node
*/
app.whenReady().then(() => {
    ipcMain.on('getImage',(event,image)=>{
        //console.log(Uint8Array.from(image));
        /*
        win.webContents.send('Return Image',image);
        */
        const imageObject = {data:Uint8Array.from(image), width: 864, height: 864};
        tf.tidy(()=>{
            const tensor = tfTools.getTensorFromImageData(imageObject,3);
            //console.log(tensor);
            //console.log(tensor.as3D(864,864,3));
            //tfTools.saveImage(tensor.as3D(864,864,3));
            tf.browser.toPixels(tensor.as3D(864,864,3)).then((thing)=>{
                win.webContents.send('Return Image',thing);
                //tf.dispose(tensor);
            });
            
        });
        console.log('numBytes : ' + tf.memory().numBytes);
        console.log('numTensors (outside tidy): ' + tf.memory().numTensors);
        console.log('numDataBuffers : ' + tf.memory().numDataBuffers);
    });
    createWindow();
});

desktopCapturer.getSources({ types: ['window'] }).then((sources,reject) => {
    if(reject){
        console.log('---Error at getSources');
        console.log(reject);
        return;
    }
    for (const source of sources) {
        if (source.name === 'RuneLite') {
            win.webContents.send('SET_SOURCE', source.id);
            return;
        }
    }
})

/*
listens for 'window-all-closed' event and quits application when all windows
are gone 
*/
app.on('window-all-closed',()=>{
    if(process.platform !== 'darwin'){//Checks if the platform is not MacOS
        console.log("I'm Quitting Now, Goodbye!");
        app.quit();
    }
});

