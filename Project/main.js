const {app, BrowserWindow,screen, ipcMain} = require ('electron');
const { OverlayController, OVERLAY_WINDOW_OPTS } = require ('electron-overlay-window');
const { mouse, left, right, up, down, straightTo, Point  } = require("@nut-tree/nut-js");
const path = require('node:path');
const fs = require('node:fs');
const tf = require('@tensorflow/tfjs-node');
//const mouseBox = document.getElementById('mouseBox');
//app.disableHardwareAcceleration()

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
/*
const modelPath = './agility_web_model/model.json';
const handler = tf.io.fileSystem(modelPath);
const image = fs.readFileSync('D:/Github/Capstone/Project/opencvData/Agility/images/test/2023-12-23_02-02-30.png');
const imageTensor = tf.node.decodePng(image,4);
console.log(imageTensor);
const resizedTensor = tf.image
	.resizeBilinear(imageTensor,[640,640], true)
//console.log(resizedTensor);
	.div(255)
	.reshape([1,3,640,640]);
	//const stuff = resizedTensor.reshape(640,640,3);
	
	tf.node.encodePng(resizedTensor,3).then((imageNew)=>{
		fs.writeFileSync('D:/Github/Capstone/Project/redone.png',imageNew);
	})
	*/

//0->3: boxes 4: scores 5: class_detect 

tf.loadGraphModel(handler).then((model)=>{
	const result = model.predict(resizedTensor).array().then((arrayed)=>{
		console.log(arrayed[0].length);
		for(let i = 0;i<arrayed[0].length;i++){
			if(arrayed[0][i][4]>0.000080){
				console.log(arrayed[0][i]);
			}
		}
		console.log('done');
	});
	//.filter((detected)=>detected[4]>0.80);
	//result.print();
})


app.whenReady().then(() => {
	ipcMain.handle('mouseLocation',()=>screen.getCursorScreenPoint());
  	//createWindow();	
})

function shortenedCol(arrayofarray, indexlist) {
	return arrayofarray.map(function (array) {
		return indexlist.map(function (idx) {
			return array[idx];
		});
	});
}