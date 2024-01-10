/**
 * Preload allows main and renderer threads to talk to each other, Electron
 * sandboxes renderers(the window that the user sees)
 */
const {contextBridge, ipcRenderer} = require('electron');

contextBridge.exposeInMainWorld('api', {
	//Put things here to expose in renderer.js
	getImage: (image) => ipcRenderer.send('getImage',image),
	resetImage: ()=> resetImage(),
})

let globalStream;

ipcRenderer.on('SET_SOURCE', async (event, sourceId) => {
	try {
		const stream = await navigator.mediaDevices.getUserMedia({
		audio: false,
		video: {
			mandatory: {
			chromeMediaSource: 'desktop',
			chromeMediaSourceId: sourceId,
			minWidth: 864,
			maxWidth: 864,
			minHeight: 864,
			maxHeight: 864
			}
		}
		})
		globalStream = stream;
		handleStream(stream);
	} catch (e) {
		handleError(e);
	}
})

ipcRenderer.on('Return Image',async (event,image)=>{
	console.log(image);
	var idata = new ImageData(image,864,864);
	const canvas = document.getElementById('testCanvas2');
	const ctx = canvas.getContext("2d",{ willReadFrequently: true });
	ctx.putImageData(idata,0,0,);
})

function handleStream (stream) {
	const video = document.querySelector('video')
	video.srcObject = stream
	video.onloadedmetadata = (e) => video.play()
}

function resetImage () {
	console.log('here');
	let imageCapture = new ImageCapture(globalStream.getTracks()[0]);
	imageCapture.grabFrame()
	.then(imageBitmap => {
		console.log(imageBitmap);
		const canvas = document.getElementById('testCanvas');
		const ctx = canvas.getContext("2d",{ willReadFrequently: true });
		ctx.drawImage(imageBitmap,0,0,);
		const imageData = ctx.getImageData(0,0,864,864);
		ipcRenderer.send('getImage',imageData.data);
	})
	.catch((err)=>console.log(err));
}

function handleError (e) {
  	console.log(e)	
}