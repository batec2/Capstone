import {app, BrowserWindow,screen, ipcMain} from 'electron';
import {OverlayController, OVERLAY_WINDOW_OPTS} from 'electron-overlay-window';
import {path} from 'node:path';
import * as tf from '@tensorflow/tfjs-node';

const createWindow = () => {
	const win = new BrowserWindow({
		width: 400,
		height: 300,
		webPreferences: {
			preload: path.join(__dirname, 'preload.js'),
			nodeIntegration: true,
			contextIsolation: true
		},
		...OVERLAY_WINDOW_OPTS
	});

	win.loadFile('index.html');

	// NOTE: if you close Dev Tools overlay window will lose transparency
	win.webContents.openDevTools({ mode: 'detach', activate: false });

	//https://github.com/SnosMe/electron-overlay-window/blob/master/src/demo/electron-demo.ts
	//for demo of overlay
	OverlayController.attachByTitle(
		win,
		'RuneLite',
	)
}


app.whenReady().then(() => {
	ipcMain.handle('mouseLocation',()=>screen.getCursorScreenPoint());
  	createWindow();	
})
